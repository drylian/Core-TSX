import { Configuration } from "@/Controllers/Configurations/Configuration";
import { merge } from "lodash";

class Storage extends Map<string, any> {
	constructor() {
		super();
	}

	/**
     * Load Internal Resources
     */
	public initial() {
		for (const config of Configuration.all) {
			if (config?.internal && config.value) {
				this.set(config.key, Configuration.convert(config.key, config.value));
			}
		}
	}

	/**
     * Does not replace the value if it exists, merges it (for objects)
     * @param key - The key of the configuration to be merged
     * @param value - The value to merge with the existing configuration
     */
	public merge(key: string, value: any): void {
		const existingValue = this.get(key);

		if (existingValue && typeof existingValue === "object" && typeof value === "object") {
			this.set(key, merge(existingValue, value));
		} else {
			this.set(key, value);
		}
	}
}

export const Internal = new Storage();
