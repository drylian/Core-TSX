import { Configuration } from "@/Controllers/Configurations/Configuration";
import { Events } from "@/Controllers/Configurations/Events";
import chokidar from "chokidar";
import fs from "fs";
import dotenv from "dotenv";
import { Internal } from "@/Controllers/Storage";

/**
 * Structural Env updates
 */
export async function StructuralEnvWatcher() {
	const configWatcher = chokidar.watch("./.env");

	configWatcher.on("change", () => {
		const envFileContent = fs.readFileSync(".env", "utf8");
		const envConfig = dotenv.parse(envFileContent);
		for (const config of Configuration.all) {
			if (config?.internal && config.env) {
				if (envConfig[config.env] !== Internal.get(config.key) && envConfig[config.env] !== undefined) {
					Events.set.emit("UpdateInternalSet", config.key, envConfig[config.env]);
				}
			}
		}
	});
}
