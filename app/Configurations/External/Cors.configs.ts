import { Configuration } from "@/Controllers/Configurations/Configuration";
import { Env } from "@/Utils";

new Configuration([
	{
		key: "cors:allowed",
		type: Configuration.SetTypes.String,
		description: "Ativa ou desativa o Cors",
		value: true,
	},
	{
		key: "cors:allowed:routes",
		type: Configuration.SetTypes.String,
		description: "Rotas configuradas para o cors, default é a rota setada em CORE_URL",
		value: [Env("CORE_URL")],
	},
]);
