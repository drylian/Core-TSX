import { Configuration } from "@/Controllers/Configurations/Configuration";
import { Crons } from "@/Controllers/Configurations/Crons";
import { Models } from "@/Controllers/Sequelize/Models";
import Loggings from "@/Controllers/Loggings";
import { Internal } from "@/Controllers/Storage";
import CoreProvinder from "@/Models/Core.model";

/**
 * Cron responsavel por atualizar as configurações do banco de dados,
 * para garatir que modificações externas sejam aceitas
 */
new Crons({
	name: "SettingsDatabaseSync",
	cron: "0 */2 * * * *", // a cada 2 minutos
	exec: async (cron, interval) => {
		const core = new Loggings("Database Sync", "blue");
		if (interval && Models.active(CoreProvinder)) {
			const Settings = await CoreProvinder.findAll();
			for (const config of Configuration.all) {
				if (!config?.internal) {
					// database resources
					let KeyDB = Settings.find((s) => s.dataValues.key === config.key);

					if (!KeyDB) {
						KeyDB = await CoreProvinder.create({
							key: config.key,
							value: config.value ? config.value.toString() : undefined,
							description: config.description,
							type: config.type,
						});
						core.debug(config.key + " foi criada com sucesso.");
					}
					if (Internal.get(config.key) === KeyDB.dataValues.value) return;
					Internal.set(config.key, Configuration.convert(KeyDB.dataValues.key, KeyDB.dataValues.value));
				}
			}
			core.debug("Settings sinclonizada com sucesso.");
		}
	},
});
