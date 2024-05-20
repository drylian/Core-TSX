import { Configuration } from "@/Controllers/Configurations/Configuration";
import { Env, Envsv, gen } from "@/Utils";

new Configuration([
	{
		key: "core:installed",
		env: "CORE_INSTALLED",
		type: Configuration.SetTypes.Boolean,
		internal: true,
		description:
            "Chave de instalação determina se o painel está no modo de instalação (limitado a configurações internas) ou no modo completo.",
		value: false,
	},
	{
		key: "core:key",
		env: "CORE_KEY",
		type: Configuration.SetTypes.String,
		internal: true,
		description: "Key, usada para encryptar informações importantes. , NOT MODIFY",
		value: undefined,
	},
	{
		key: "core:language",
		env: "CORE_LANGUAGE",
		type: Configuration.SetTypes.String,
		internal: true,
		description: "Linguagem do painel",
		value: Env("CORE_LANGUAGE") ? Env("CORE_LANGUAGE") : Envsv("CORE_LANGUAGE", "pt-BR", "Linguagem do painel"),
	},

	{
		key: "core:owner",
		env: "CORE_OWNER",
		type: Configuration.SetTypes.String,
		internal: true,
		description: "Dono do painel",
		value: "Core-ATS",
	},
	{
		key: "core:logo",
		env: "CORE_LOGO",
		type: Configuration.SetTypes.String,
		internal: true,
		description: "Logo do painel, use /img/favicon.png para imagem padrão ou link para imagens diferentes.",
		value: "/img/logo.jpg",
	},
	{
		key: "core:mode",
		env: "CORE_MODE",
		type: Configuration.SetTypes.String,
		internal: true,
		description: "modo do painel, 'development' ou 'production'.",
		value: "development",
	},
	{
		key: "core:port",
		env: "CORE_PORT",
		type: Configuration.SetTypes.Number,
		internal: true,
		description: "Porta do painel core, padrão é 6000.",
		value: 3000,
	},
	{
		key: "core:protocol",
		env: "CORE_PROTOCOL",
		type: Configuration.SetTypes.String,
		internal: true,
		checker: (env, defaults) => {
			/**
             * Verifica se o valor do env é um desses
             */
			if (["http", "https", "http/https"].includes(Env(env))) {
				return Env(env);
			}
			return defaults;
		},
		description: "Protocolo do painel, http,https ou http/https.",
		value: "http/https",
	},
	{
		key: "core:signature",
		env: "CORE_SIGNATURE",
		type: Configuration.SetTypes.String,
		internal: true,
		description: "Assinatura do painel, usado em no site e nos cookies.",
		value: gen(128),
	},
	{
		key: "core:title",
		env: "CORE_TITLE",
		type: Configuration.SetTypes.String,
		internal: true,
		description: "Titulo do painel.",
		value: "Core-ATS",
	},
	{
		key: "core:url",
		env: "CORE_URL",
		type: Configuration.SetTypes.String,
		internal: true,
		description: "Url do painel, use http ou https.",
		value: "http://localhost",
	},
]);
