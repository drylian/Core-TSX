import { Env, Envsv } from "@/Utils";
import { Console, LoggingsMessage } from "@/Controllers/Loggings";

type ArrayType = {
    String: "Astring";
    Boolean: "Aboolean";
    Number: "Anumber";
    Object: "Aobject";
};
function Core(type: string, ...args: LoggingsMessage[]) {
	return Console(type, "magenta", ...args);
}
type ValueType = string | number | boolean | object | undefined;
type ConfigurationTypeWithValue = ConfigurationType["value"];

export type ConfigurationType = {
    key: string;
    type: "string" | "boolean" | "number" | "object" | ArrayType[keyof ArrayType];
    value: ValueType;
    env?: string;
    checker?: ((env: string, defaults: ConfigurationTypeWithValue) => ConfigurationTypeWithValue) | undefined;
    description: string;
    internal?: boolean;
};

export class Configuration {
	public static readonly SetTypes = {
		String: "string",
		Boolean: "boolean",
		Number: "number",
		Object: "object",
		Array: {
			String: "Astring",
			Boolean: "Aboolean",
			Number: "Anumber",
			Object: "Aobject",
		},
	} as const;

	public static convert(key: ConfigurationType["key"], value: ConfigurationType["value"]) {
		const config = Configuration.all.find((c) => c.key === key);
		if (config) {
			const arg = Configuration.SetTypes;

			if (config.type === arg.String) return String(value);
			else if (config.type === arg.Number) return Number(value);
			else if (config.type === arg.Boolean) return Boolean(value);
			else if (config.type === arg.Object) return Object(value);
			else if (config.type === arg.Array.String) {
				if (Array.isArray(value)) {
					return value.map(String);
				}
				return String(value);
			} else if (config.type === arg.Array.Number) {
				if (Array.isArray(value)) {
					return value.map(Number);
				}
				return Number(value);
			} else if (config.type === arg.Array.Boolean) {
				if (Array.isArray(value)) {
					return value.map(Boolean);
				}
				return Boolean(value);
			} else if (config.type === arg.Array.Object) {
				if (Array.isArray(value)) {
					return value.map(Object);
				}
				return Object(value);
			}
		}
		return value;
	}

	public static all: Array<ConfigurationType> = [];
	/**
     * Atualiza o valores do cache
     * @param config
     */
	public static update(config: ConfigurationType) {
		const index = Configuration.all.findIndex((c) => c.key === config.key);
		if (config?.internal && config?.env) {
			Envsv(config.env, config.value !== undefined && config.value.toString());
		}
		if (index !== -1) {
			// Se a configuração existe, substitua-a
			Configuration.all[index] = config;
			Core("Env", `[${config.key}].blue-b atualizada com sucesso`);
		} else {
			// Se a configuração não existe, adicione-a
			Configuration.all.push(config);
			Core("Env", `[${config.key}].blue-b adicionada com sucesso`);
		}
	}

	constructor(public data: ConfigurationType[]) {
		for (const config of data) {
			if (config?.checker !== undefined && config?.env !== undefined) {
				/**
                 * Personal configurations value
                 */
				const valor = config.value !== undefined ? config.checker(config.env, config.value) : undefined;
				config.value = valor ? valor.toString() : undefined;
			} else if (config?.env) {
				/**
                 * Default method of values (Internal)
                 */
				const value = Env(config.env);
				config.value = value ? value : config.value;
			}
			if (config.env) {
				Core("Env", `[${config.env}].green-b -> [${config.key}].blue-b`);
			} else {
				Core("DB", `Defaults -> [${config.key}].blue-b`);
			}
			Configuration.all.push(config);
		}
	}
}
