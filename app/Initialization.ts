import "@/Structural";
import {
	StructuralConfiguration,
	Server,
	StructuralModels,
	StructuralEvents,
	StructuralTailwind,
	StructuralEnvWatcher,
	StructuralLanguageWatcher,
	StructuralCrons,
} from "@/Structural";
import { Internal } from "./Controllers/Storage";
/**
 * Load Structural Configurations
 */
async function StartServer() {
	/**
     * Get All Configurations for panel
     */
	await StructuralConfiguration();
	/**
     * Setup Internal Configurations
     */
	Internal.initial();
	/**
     * Get All Events for panel
     */
	await StructuralEvents();
	/**
     * Tailwind Compiler/production mode
     */
	await StructuralTailwind();
	/**
     * Env Watcher modifications
     */
	await StructuralEnvWatcher();
	/**
     * Language Watcher Modifications
     */
	await StructuralLanguageWatcher();
	/**
     * Cron Starter
     */
	await StructuralCrons();
}

StartServer().then(async () => {
	if (Internal.get("core:installed")) {
		/**
         * Configurations for Models
         */
		await StructuralModels();
		await Server.full();
	} else {
		/**
         * StartUp in Install
         */
		await Server.installer();
	}
});
