import fs from "fs";
import path from "node:path";
import * as esbuild from "esbuild";
import { RootPATH } from "@/Structural";
export function ReacterHMRPlugin(): esbuild.Plugin[] {
    return [
        {
            name: "hmr-runtime",
            setup(build) {
                build.onResolve({ filter: /^hmr:runtime$/ }, (args) => {
                    return {
                        path: "hmr:runtime",
                        namespace: "hmr-runtime",
                    };
                });

                build.onLoad({ filter: /.*/, namespace: "hmr-runtime" }, (args) => {
                    const contents = fs.readFileSync(RootPATH + "/Controllers/Reacter/HMR/hmr-runtime.ts", "utf8");

                    return {
                        contents,
                        loader: "ts",
                    };
                });
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

                    const hmrId = JSON.stringify(path.relative(process.cwd(), args.path));
                    const hmrPrefix = fs
                        .readFileSync(RootPATH + "/Controllers/Reacter/HMR/hmr-prefix", "utf8")
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
                    })?.code;

                    if (jsWithReactRefresh && IS_FAST_REFRESH_ENABLED.test(jsWithReactRefresh)) {
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
    ]
}