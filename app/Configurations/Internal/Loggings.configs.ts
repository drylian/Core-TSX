import { Configuration } from "@/Controllers/Configurations/Configuration";
import { Env } from "@/Utils";

new Configuration([
	{
		key: "loggings:level",
		env: "CORE_LOGGINGS_LEVEL",
		type: Configuration.SetTypes.String,
		internal: true,
		description: "Loggings do painel, \"Debug\", \"Info\", \"Warn\", \"Error\"",
		checker: (env, dafaults) => {
			const string = Env(env);
			if (["Debug", "Info", "Warn", "Error"].includes(string)) {
				return string;
			}
			return dafaults;
		},
		value: "Debug",
	},
	{
		key: "loggings:autodelete",
		env: "CORE_LOGGINGS_AUTODELETE",
		type: Configuration.SetTypes.Number,
		internal: true,
		description: "Auto Delete de logs do painel, use numero.",
		value: 10,
	},
	{
		key: "loggings:activedelete",
		env: "CORE_LOGGINGS_ACTIVEDELETE",
		type: Configuration.SetTypes.Number,
		internal: true,
		checker: (env, dafaults) => {
			const string = Env(env);
			if (typeof string === Configuration.SetTypes.Number) {
				return Boolean(string);
			}
			return dafaults;
		},
		description: "Ativa ou Desativa o sistema de auto-deletar logs do painel.",
		value: true,
	},
]);
