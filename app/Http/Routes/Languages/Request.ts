/**
 * Global Routes, used in all server
 */
import I18alt from "@/Controllers/Languages";
import { Responser } from "@/Http/Structures/Responser";
import { Router } from "@/Http/Structures/Route";
import { hashmd5 } from "@/Utils";

new Router({
	name: "LanguagesRequest",
	type: [Router.Types.FullAccess],
	comment: "LanguagesComment",
	path: "/languages/requests",
	method: Router.Methods.Get,
	run: async ({ req, res }) => {
		const { namespace, lang, native, hash } = req.query;

		if (!namespace && lang) {
			const data = I18alt.live.lc(lang as string);
			res.header({
				"Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
				ETag: hashmd5(data),
				i18hash: hash || "know",
			});
			new Responser(req, res).json({
				title: "Language Request",
				data: data,
			});
		} else if (namespace && !lang) {
			const result: { [key: string]: object } = {};
			const langs = I18alt.live.langs;
			for (const lang in langs) {
				result[lang] = I18alt.live.lc(lang as string);
			}
			res.header({
				"Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
				ETag: hashmd5(result),
				i18hash: hash || "know",
			});
			new Responser(req, res).json({
				title: "Language Request",
				data: result,
			});
		} else {
			const data = I18alt.live.getNR(namespace as string, native !== undefined, lang as string);
			res.header({
				"Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
				ETag: hashmd5(data),
				i18hash: hash || "know",
			});
			new Responser(req, res).json({
				title: "Language Request",
				data: data,
			});
		}
	},
});
