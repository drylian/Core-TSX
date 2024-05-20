import { ResourcesPATH } from "@/Structural";
import path from "node:path";
import * as esbuild from "esbuild";
import { ReacterLogger } from "../Plugins/ReacterLogger";
import { ReacterLoaders } from "../Loader";
import Externals from "esbuild-node-externals";
/**
 * Server Esbuild Configurations.
 */
export function ServerEsbuild(): esbuild.BuildOptions {
	return {
		assetNames: "[name]-[hash]",
		bundle: true,
		chunkNames: "[name]-[hash]",
		entryNames: "[name]-[hash]",
		entryPoints: {
			bundle: path.join(ResourcesPATH + "/Server/Index.tsx"),
		},
		jsx: "transform",
		format: "cjs",
		logLevel: "silent",
		platform: "node",
		target: ["node20"],
		alias: {
			"@/Server": ResourcesPATH + "/Server",
		},
		outdir: path.join(ResourcesPATH, "Build", "Server"),
		loader: ReacterLoaders,
		plugins: [new ReacterLogger("Server", "blue").init(), Externals()],
	};
}
