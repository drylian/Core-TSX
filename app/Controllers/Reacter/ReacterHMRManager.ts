import fs from "fs";
import * as esbuild from "esbuild";
/**
 * Reacter 
 */
class ReacterHMRManager {
    constructor() {

    }
    public async whiter(build: esbuild.BuildResult<esbuild.BuildOptions> & { metafile: true }) {
        let entry = Object.entries(build.metafile.outputs).find(
            ([_, output]) => output.inputs["app/entry.client.tsx"]
        )?.[0];

        let hmrEntry = Object.entries(build.metafile.outputs).find(
            ([_, output]) => output.inputs["hmr-entrypoint.ts"]
        )?.[0];
        if (entry)
            entry = JSON.stringify("/" + entry.replace(/^public\//, ""));
        if (hmrEntry) hmrEntry = JSON.stringify("/" + hmrEntry.replace(/^public\//, ""));

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
}