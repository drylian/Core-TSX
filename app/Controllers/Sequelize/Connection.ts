import { Sequelize, Options } from "sequelize";
import Loggings from "@/Controllers/Loggings";
import { Internal } from "@/Controllers/Storage";

class SequelizeConnection {
	public sequelize: InstanceType<typeof Sequelize>;
	private core: InstanceType<typeof Loggings>;
	constructor() {
		this.core = new Loggings("Sequelize", "magenta");
		this.sequelize = new Sequelize({
			dialect: "sqlite",
		});
	}
	public async restart() {
		if (Internal.get("database:dialect") !== "sqlite") {
			this.sequelize = new Sequelize({
				dialect: "mysql",
				host: Internal.get("database:host"),
				password: Internal.get("database:pass"),
				port: Internal.get("database:port"),
				username: Internal.get("database:user"),
				database: Internal.get("database:database"),
				logging: (message: string) => {
					this.core.debug(message);
				},
			});
		} else {
			this.sequelize = new Sequelize({
				dialect: Internal.get("database:dialect"),
				host: Internal.get("database:host"),
				logging: (message: string) => {
					this.core.debug(message);
				},
			});
		}
	}
}
export const Connection = new SequelizeConnection();
