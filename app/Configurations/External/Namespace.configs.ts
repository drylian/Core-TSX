import { Configuration } from "@/Controllers/Configurations/Configuration";
import { genv4 } from "@/Utils";

new Configuration([
	{
		key: "namespace:user",
		type: Configuration.SetTypes.String,
		description: "Namespace usado para os uuid de usuários.",
		value: genv4(),
	},
	{
		key: "namespace:tokens",
		type: Configuration.SetTypes.String,
		description: "Namespace usado para os uuid de tokens.",
		value: genv4(),
	},
]);
