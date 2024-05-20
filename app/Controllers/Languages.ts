import * as fs from "fs";
import * as _ from "lodash";
import { json } from "@/Utils";
import { Console, LoggingsMessage } from "@/Controllers/Loggings";
import { Internal } from "./Storage";
import { ResourcesPATH } from "@/Structural";

const core = (...message: LoggingsMessage[]) => Console("Warn", "red", message);

/**
 * Tipo que representa os métodos e propriedades da classe I18alt.
 * @type {Object} i18t.
 * @property {function(string, Record<string, string>): string} t - Função para traduzir uma chave.
 * @property {function(string, Record<string, string>): string} translate - Função para traduzir uma chave.
 * @property {string} lang - O idioma atual.
 * @property {string} language - O idioma atual.
 * @property {string[]} langs - Lista de idiomas disponíveis.
 * @property {string[]} languages - Lista de idiomas disponíveis.
 * @property {function(string): boolean} sl - Função para definir o idioma atual.
 * @property {function(string): boolean} setLanguage - Função para definir o idioma atual.
 * @property {function(string, string): object} getNR - Função para obter um recurso de namespace.
 * @property {function(string, string): object} getNamespaceResource - Função para obter um recurso de namespace.
 */
export default class I18alt {
	private currentLang: string;
	public static get live() {
		const i18n = new I18alt();
		return i18n;
	}
	/**
     * Cria uma instância da classe I18alt.
     */
	constructor(lang?: string) {
		this.currentLang = lang ?? Internal.get("core:language");
	}

	/**
     * (Alias do translate) Traduz uma chave para o idioma atual.
     * @param {string} key - A chave de tradução.
     * @param {Record<string, string>} params (Opcional) - Parâmetros para substituição na tradução.
     * @returns {string} A tradução resultante.
     */
	public t(key: string, params: Record<string, string> = {}): string {
		return this.translate(key, params);
	}

	/**
     * (LangCore)
     * @returns {string} A tradução resultante.
     */
	public lc(lang?: string): object {
		if (lang) return (Internal.get("cache:languages") as { [key: string]: object })[lang];
		const LangCore = Internal.get("cache:languages") as { [key: string]: object };
		return LangCore;
	}

	/**
     * Traduz uma chave para o idioma atual.
     * @param {string} key - A chave de tradução.
     * @param {Record<string, string>} params (Opcional) - Parâmetros para substituição na tradução.
     * @returns {string} A tradução resultante.
     */
	public translate(key: string, params: Record<string, string> = {}): string {
		const LangCore = Internal.get("cache:languages") as { [key: string]: object };
		const keyvar = key;
		key = key.replace(/:/g, ".");
		if (!params.lang) params.lang = this.currentLang;
		const keys = key.split(".");
		const langdir = ResourcesPATH + `/Languages/${params.lang}/${keys[0]}.json`;
		const nestedKey = keys.join(".");
		if (LangCore[params.lang]) {
			let translation = _.get(LangCore[params.lang], nestedKey, nestedKey);
			if (translation === nestedKey) {
				core(
					`[A key ${nestedKey} não pode ser encontrada].red no [${langdir}].blue da lingua atual ["${params.lang}"].blue verifique se a key existe.`,
				);
			}
			if (typeof translation === "string") {
				for (const param in params) {
					translation = translation.replace(`{{${param}}}`, params[param]);
				}

				return translation;
			}
		} else if (!LangCore[params.lang]) {
			core(
				`[Lingua atual não foi encontrada].red ["${params.lang}"].blue , alterando para a lingua [padrão "${Internal.get("core:language")}"].green.`,
			);
			this.currentLang = Internal.get("core:language");
			return this.t(key, params);
		}

		core(
			`[A key ${keyvar} não pode ser encontrada].red na lingua atual ["${this.currentLang}"].blue , verifique se diretorio [${langdir}].blue está correto e se a key existe.`,
		);

		return key;
	}

	/**
     * (Alias do language) Obtém o idioma atual.
     * @returns {string} O idioma atual.
     */
	public get lang(): string {
		return this.language;
	}

	/**
     * Obtém o idioma atual.
     * @returns {string} O idioma atual.
     */
	public get language(): string {
		return this.currentLang;
	}

	/**
     * (Alias do languages) Obtém a lista de idiomas disponíveis.
     * @returns {string[]} A lista de idiomas disponíveis em um array.
     */
	public get langs(): string[] {
		return this.languages;
	}

	/**
     * Obtém a lista de idiomas disponíveis.
     * @returns {string[]} A lista de idiomas disponíveis em um array.
     */
	public get languages(): string[] {
		const folders = fs.readdirSync(ResourcesPATH + "/Languages");
		const languageFolders = folders.filter((folder) =>
			fs.statSync(`${ResourcesPATH + "/Languages"}/${folder}`).isDirectory(),
		);
		return languageFolders;
	}

	/**
     * (Alias do setLanguage) Define o idioma atual.
     * @param {string} lang - O idioma a ser definido como idioma atual.
     */
	public sl(lang: string | undefined): boolean {
		return this.setLanguage(lang ?? Internal.get("core:language"));
	}

	/**
     * Define o idioma atual.
     * @param {string| null} lang - O idioma a ser definido como idioma atual.
     */
	public setLanguage(lang: string | undefined): boolean {
		if (fs.existsSync(ResourcesPATH + `/Languages/${lang}`)) {
			this.currentLang = lang ?? Internal.get("core:language");
			return true;
		}
		core(
			`[Lingua não encontrada].red ["${lang}"].blue , não ouve alterações na linguagem atual ["${this.currentLang}"].green.`,
		);
		return false;
	}

	/**
     * ( Alias do getNamespaceResource ) Obtem um json do namespace selecionado.
     * @param {string} namespace - o namespace selecionado.
     * @param {string} lang - O idioma a ser definido (opicional, caso não definido será usado o padrão).
     */
	public getNR(namespace: string, i18next: boolean, lang?: string): object {
		return this.getNamespaceResource(namespace, i18next, lang);
	}

	/**
     * Obtem um json do namespace selecionado.
     * @param {string} namespace - o namespace selecionado.
     * @param {string} lang - O idioma a ser definido (opicional, caso não definido será usado o padrão).
     */
	public getNamespaceResource(namespace: string, i18next: boolean, lang?: string): object {
		const value = namespace;
		namespace = namespace.replace(/:/g, "/");
		const keys = namespace.split(".");
		const langdir = `${ResourcesPATH + "/Languages"}/${lang || this.currentLang}/${keys[0]}.json`;
		if (i18next && lang) {
			const nextLang = lang.split(" ");
			const nextNamespace = value.split(" ");
			const response: { [locale: string]: object } = {};
			const LangCore = Internal.get("cache:languages") as { [key: string]: object };
			nextLang.forEach((locale) => {
				response[locale] = {};
				nextNamespace.forEach((nextns) => {
					let result;
					if (nextns.indexOf(":") !== -1) {
						result = _.get(LangCore[locale], nextns.replace(/:/g, ".").split("."));
					} else {
						result = _.get(LangCore[locale], nextns);
					}
					if (result !== undefined) {
						_.set(response[locale], nextns, result);
					} else {
						_.set(response[locale], nextns, []);
					}
				});
			});
			// console.log(response);
			return response;
		} else if (namespace.split(".").length === 1) {
			if (fs.existsSync(langdir)) {
				return json(langdir);
			}
		} else {
			keys.shift();
			const nestedKey = keys.join(".");
			return _.set({}, keys, _.get(json(langdir), nestedKey, nestedKey));
		}
		return {
			error: "NamespaceResourcesNotFound",
			message: this.t("core:langs.NamespaceResourcesNotFound", {
				SelectedLang: lang || this.currentLang,
				Selectednamespace: value,
			}),
		};
	}
}
