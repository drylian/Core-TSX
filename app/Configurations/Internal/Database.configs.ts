import { Configuration } from "@/Controllers/Configurations/Configuration";
import { Env } from "@/Utils";

new Configuration([
	{
		key: "database:dialect",
		env: "DB_DIALECT",
		type: Configuration.SetTypes.String,
		internal: true,
		description: "\"mysql\" ou \"sqlite\"",
		value: Env("DB_DIALECT") ? Env("DB_DIALECT") : "sqlite",
	},
	{
		key: "database:host",
		env: "DB_HOSTNAME",
		type: Configuration.SetTypes.String,
		internal: true,
		description: "Hostname do Banco de dados.",
		value: Env("DB_DIALECT") == "mysql" ? (Env("DB_HOSTNAME") ? Env("DB_HOSTNAME") : undefined) : undefined,
	},
	{
		key: "database:port",
		env: "DB_PORT",
		type: Configuration.SetTypes.Number,
		internal: true,
		description: "Porta do banco de dados",
		value: Env("DB_DIALECT") == "mysql" ? (Env("DB_PORT") ? Env("DB_PORT") : undefined) : undefined,
	},
	{
		key: "database:user",
		env: "DB_USERNAME",
		type: Configuration.SetTypes.String,
		internal: true,
		description: "Username do banco de dados",
		value: Env("DB_DIALECT") == "mysql" ? (Env("DB_USERNAME") ? Env("DB_USERNAME") : undefined) : undefined,
	},
	{
		key: "database:pass",
		env: "DB_PASSWORD",
		type: Configuration.SetTypes.String,
		internal: true,
		description: "Senha do usuário do banco de dados",
		value: Env("DB_DIALECT") == "mysql" ? (Env("DB_PASSWORD") ? Env("DB_PASSWORD") : undefined) : undefined,
	},
	{
		key: "database:database",
		env: "DB_DATABASE",
		type: Configuration.SetTypes.String,
		internal: true,
		description: "Nome do banco de dados",
		value: Env("DB_DIALECT") == "mysql" ? (Env("DB_DATABASE") ? Env("DB_DATABASE") : undefined) : undefined,
	},
]);
