import * as fs from "node:fs";
import * as path from "node:path";
import * as chokidar from "chokidar";
import * as esbuild from "esbuild";
import express from "express";
import expressWebSocket from "express-ws";

class HMRServer {
  esbuildContext: esbuild.Service | null = null;
  lastBuildResult: esbuild.BuildResult<esbuild.BuildOptions> | null = null;

  constructor() {}

  async start() {
    await this.initializeEsbuild();
    this.watchAndRebuild();
    this.setupExpressApp();
    this.startServer();
  }

  async initializeEsbuild() {
    this.esbuildContext = await esbuild.context({
      assetNames: "[name]-[hash]",
      bundle: true,
      chunkNames: "[name]-[hash]",
      entryNames: "[name]-[hash]",
      entryPoints: {
        bundle: "app/entry.client.tsx",
        hmr: "hmr-entrypoint.ts",
        react: "react",
        "react-dom": "react-dom",
        "react-refresh/runtime": "react-refresh/runtime",
      },
      format: "esm",
      logLevel: "warning",
      jsx: "automatic",
      metafile: true,
      outdir: "public/build",
      platform: "browser",
      splitting: true,
      target: "es2019",
      supported: {
        "import-meta": true,
      },
      plugins: [
        {
          name: "hmr-runtime",
          setup(build) {
            build.onResolve({ filter: /^hmr:runtime$/ }, (args) => {
              return {
                path: "hmr:runtime",
                namespace: "hmr-runtime",
              };
            });

            build.onLoad(
              { filter: /.*/, namespace: "hmr-runtime" },
              (args) => {
                const contents = fs.readFileSync("hmr-runtime.ts", "utf8");

                return {
                  contents,
                  loader: "ts",
                };
              }
            );
          },
        },
        {
          name: "hmr",
          async setup(build) {
            const babel = await import("@babel/core");
            const reactRefresh = await import("react-refresh/babel");

            const IS_FAST_REFRESH_ENABLED = /\$RefreshReg\$\(/;

            const appDir = path.join(process.cwd(), "app");

            build.onLoad({ filter: /.*/, namespace: "file" }, (args) => {
              if (
                !args.path.match(/\.[tj]sx?$/) ||
                !fs.existsSync(args.path) ||
                !args.path.startsWith(appDir)
              ) {
                return undefined;
              }

              const hmrId = JSON.stringify(
                path.relative(process.cwd(), args.path)
              );
              const hmrPrefix = fs
                .readFileSync("hmr-prefix.ts", "utf8")
                .replace(
                  `import * as __hmr__ from "./hmr-runtime";`,
                  `import * as __hmr__ from "hmr:runtime";`
                )
                .replace(/\$id\$/g, hmrId);
              const sourceCode = fs.readFileSync(args.path, "utf8");

              const sourceCodeWithHMR = hmrPrefix + sourceCode;

              const jsWithHMR = esbuild.transformSync(sourceCodeWithHMR, {
                loader: args.path.endsWith("x") ? "tsx" : "ts",
                format: args.pluginData?.format || "esm",
              }).code;
              let resultCode = jsWithHMR;

              const jsWithReactRefresh = babel.transformSync(jsWithHMR, {
                filename: args.path,
                ast: false,
                compact: false,
                sourceMaps: build.initialOptions.sourcemap ? "inline" : false,
                configFile: false,
                babelrc: false,
                plugins: [[reactRefresh.default, { skipEnvCheck: true }]],
              }).code;

              if (IS_FAST_REFRESH_ENABLED.test(jsWithReactRefresh)) {
                resultCode =
                  `
                  if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
                    console.warn('@remix-run/react-refresh: HTML setup script not run. React Fast Refresh only works when Remix serves your HTML routes. You may want to remove this plugin.');
                  } else {
                    var prevRefreshReg = window.$RefreshReg$;
                    var prevRefreshSig = window.$RefreshSig$;
                    window.$RefreshReg$ = (type, id) => {
                      window.$RefreshRuntime$.register(type, ${JSON.stringify(
                        hmrId
                      )} + id);
                    }
                    window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
                  }
                ` +
                  jsWithReactRefresh +
                  `
                  window.$RefreshReg$ = prevRefreshReg;
                  window.$RefreshSig$ = prevRefreshSig;
                  import.meta.hot.accept(({ module }) => {
                    window.$RefreshRuntime$.performReactRefresh();
                  });
                `;
              }

              return {
                contents: resultCode,
                loader: args.path.endsWith("x") ? "tsx" : "ts",
                resolveDir: path.dirname(args.path),
              };
            });
          },
        },
      ],
    });
  }

  async rebuild() {
    if (!this.esbuildContext) return;

    const newBuildResult = await this.esbuildContext.rebuild();
    this.writeIndexHtml(newBuildResult);
    this.lastBuildResult = newBuildResult;
  }

  writeIndexHtml(build: esbuild.BuildResult<esbuild.BuildOptions>) {
    let [entry] = Object.entries(build.metafile.outputs).find(
      ([_, output]) => output.inputs["app/entry.client.tsx"]
    );
    let [hmrEntry] = Object.entries(build.metafile.outputs).find(
      ([_, output]) => output.inputs["hmr-entrypoint.ts"]
    );

    entry = JSON.stringify("/" + entry.replace(/^public\//, ""));
    hmrEntry = JSON.stringify("/" + hmrEntry.replace(/^public\//, ""));

    fs.writeFileSync(
      "public/index.html",
      `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>ESBuild HMR</title>
  </head>
  <body>
    <h1>ESBuild HMR</h1>
    <div id="app"></div>
    <script type="module" src=${hmrEntry}></script>
    <script type="module">
      import * as entry from ${entry};

      entry.run();
    </script>
  </body>
</html>
`
    );
  }

  watchAndRebuild() {
    if (!this.esbuildContext) return;

    const watcher = chokidar
      .watch("app", {
        ignoreInitial: true,
      })
      .on("all", async (eventName, path) => {
        console.log(eventName, path);
        await this.rebuild();
        this.sendReloadMessage();
      });
  }

  setupExpressApp() {
    const expressApp = express();
    const ws = expressWebSocket(expressApp);
    const app = ws.app;

    app.use(express.static("public"));
    app.ws("/__hmr__", () => {});
  }

  startServer() {
    const server = express()
      .listen(3000, "localhost", () => {
        console.log("Listening on http://localhost:3000");
      })
      .on("error", (err: any) => {
        console.error("Server error:", err);
      });
  }

  sendReloadMessage() {
    if (!this.lastBuildResult || !this.lastBuildResult.metafile) return;

    const updates = Object.keys(this.lastBuildResult.metafile.inputs).map(
      (input) => ({
        type: "update",
        id: input,
        url:
          "/" +
          this.lastBuildResult.metafile.outputs[input].replace(/^public\//, ""),
      })
    );

    const message = JSON.stringify({ type: "hmr", updates });

    const clients = expressWebSocket.getWss().clients;
    if (clients.size > 0) {
      console.log(
        "Send reload to",
        clients.size,
        "client" + (clients.size > 1 ? "s" : "")
      );
      clients.forEach((socket) => {
        socket.send(message);
      });
    }
  }
}

const hmrServer = new HMRServer();
hmrServer.start();
