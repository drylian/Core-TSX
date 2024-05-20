import { ResourcesPATH, RootPATH, StoragePATH } from "@/Structural";
import path from "node:path";
import * as esbuild from "esbuild";
import { Internal } from "@/Controllers/Storage";
import { ReacterLogger } from "../Plugins/ReacterLogger";
import { ReacterLoaders } from "../Loader";
export function InstallerEsbuild(): esbuild.BuildOptions {
	const production = (Internal.get("core:mode") as string).startsWith("pro") ? true : false;
	return {
		assetNames: "[name]-[hash]",
		bundle: true,
		chunkNames: "[name]-[hash]",
		entryNames: "[name]-[hash]",
		entryPoints: {
			bundle: path.join(ResourcesPATH + "/Install/Index.tsx"),
			hmr: RootPATH + "/Controllers/Reacter/HMR/hmr-entrypoint.ts",
			react: "react",
			"react-dom": "react-dom",
			"react-refresh/runtime": "react-refresh/runtime",
		},
		jsx: "transform",
		format: "esm",
		logLevel: "silent",
		metafile:true,
		sourcemap: production,
		minify: true,
		outdir: path.join(ResourcesPATH, "Build", "Install"),
		loader: ReacterLoaders,
		plugins: [new ReacterLogger("Install", "blue").init()],
	};
}
