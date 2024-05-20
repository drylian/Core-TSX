import chokidar from "chokidar";
import { Internal } from "@/Controllers/Storage";
import path from "path";
import { json } from "@/Utils";
import { ResourcesPATH, RootPATH, StoragePATH } from "@/Structural";
import _ from "lodash";
import fs from "fs";
import { glob } from "glob";
import { Console, LoggingsMessage } from "@/Controllers/Loggings";

function Core(type: string, ...args: LoggingsMessage[]) {
	return Console(type, "magenta", ...args);
}

/**
 * Language metadata loads Watcher
 */
export async function StructuralLanguageWatcher() {
	if (Internal.get("core:mode").startsWith("dev")) {
		/**
         * Active Watcher for live langs
         */
		const directoryToWatch = ResourcesPATH + "/Languages";
		const watcher = chokidar.watch(directoryToWatch, {
			persistent: true,
			// eslint-disable-next-line no-useless-escape
			ignored: /(^|[\/\\])\../, // Ignora arquivos ocultos (começando com ponto)
		});
		watcher.on("add", (filePath) => {
			if (path.extname(filePath) === ".json") {
				const locale = path.relative(directoryToWatch, filePath).replace(".json", "").replace(/[/\\]/g, ".");
				const data = _.set({}, locale.split("."), json(filePath));
				const location = path.relative(directoryToWatch, filePath).replace(".json", "").replace(/[/\\]/g, "/");
				Internal.merge("cache:languages", { ...data });
				Core("Lang", `[${location}].red adicionado.`);
			}
		});
		watcher.on("change", (filePath) => {
			if (path.extname(filePath) === ".json") {
				const locale = path.relative(directoryToWatch, filePath).replace(".json", "").replace(/[/\\]/g, ".");
				const data = _.set({}, locale.split("."), json(filePath));
				const location = path
					.relative(directoryToWatch, filePath)
					.replace(".json", "")
					.replace(/[/\\]/g, " -> ");
				Internal.merge("cache:languages", { ...data });
				Core("Lang", `[${location}].red modificado.`);
			}
		});
		watcher.on("unlink", (filePath) => {
			if (path.extname(filePath) === ".json") {
				const locale = path.relative(directoryToWatch, filePath).replace(".json", "").replace(/[/\\]/g, ".");
				const data = _.set({}, locale.split("."), json(filePath));
				const location = path
					.relative(directoryToWatch, filePath)
					.replace(".json", "")
					.replace(/[/\\]/g, " -> ");
				Internal.merge("cache:languages", { ...data });
				Core("Lang", `[${location}].red deletado.`);
			}
		});
	} else {
		/**
         * Production mode (Load Compilated.langs)
         */
		const LangCore = path.join(StoragePATH, "Compilated.langs.json");

		if (!fs.existsSync(LangCore)) {
			const paths = await glob(["Languages/**/*.json"], { cwd: RootPATH });
			let langCore = {};
			for (const pather of paths) {
				const local = path.relative(ResourcesPATH + "/Languages", pather);
				const locale = path.join(local.slice(16).replace(".json", "").replace(/[/\\]/g, "."));
				const data = _.set({}, locale.split("."), json(path.join(RootPATH, pather)));
				console.log(data);
				langCore = _.merge(langCore, data);
			}
			const langCoreJSON = JSON.stringify(langCore);
			fs.writeFileSync(LangCore, langCoreJSON, "utf8");
			Internal.set("cache:languages", { ...langCore });
		} else {
			const Language = fs.readFileSync(LangCore, "utf8");
			Internal.set("cache:languages", { ...JSON.parse(Language) });
		}
	}
}
