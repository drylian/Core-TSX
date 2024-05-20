import { Configuration } from "@/Controllers/Configurations/Configuration";
import { Events } from "@/Controllers/Configurations/Events";
import Loggings from "@/Controllers/Loggings";
import { Internal } from "@/Controllers/Storage";

const Core = new Loggings("Atualizações", "gray");
new Events({
	name: "UpdateInternalSet",
	run: async (key, value) => {
		Core.debug(`A key [${key}].blue-b foi atualizada`);
		Internal.set(key, Configuration.convert(key, value));
	},
});
