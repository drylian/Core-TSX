import * as CryptoJS from "crypto-js";
import { NextFunction, Request, Response } from "express";
import HttpError from "http-errors";
import type { CookieOptions } from "express";
import { defaultsDeep } from "lodash";
export interface CsrfOptions {
    secret: string;
    ignores?: {
        methods?: string[];
        routes?: string[];
    };
    csrf?: {
        name?: string;
        sender?: "http-error" | "ALTHtml/json" | "Custom";
        Custom?: (req: Request, res: Response, next?: NextFunction) => void;
    };
    cookie?: CookieOptions;
}
interface CsrfConf {
    secret: string;
    csrf: {
        name: string;
        sender: "http-error" | "ALTHtml/json" | "Custom";
        Custom?: (req: Request, res: Response, next?: NextFunction) => void;
    };
    cookie: CookieOptions;
}
export default class ALTCsrf {
	private conf: CsrfConf;
	private ignoredMethods;
	private ignoredRoutes;
	constructor(options: CsrfOptions) {
		// Configurações padrão
		const defaultOptions: CsrfOptions = {
			secret: "",
			ignores: {
				methods: ["GET", "HEAD", "OPTIONS"],
				routes: [""],
			},
			csrf: {
				name: "__Host_alt.csrftoken",
				sender: "ALTHtml/json",
			},
			cookie: {
				sameSite: "lax",
				path: "/",
				secure: true,
			},
		};

		// Mescla as opções padrão com as fornecidas
		const mergedOptions = defaultsDeep(options, defaultOptions);

		// Atribui as opções mescladas às propriedades do objeto
		this.conf = {
			secret: mergedOptions.secret,
			csrf: mergedOptions.csrf,
			cookie: mergedOptions.cookie,
		};
		this.ignoredMethods = new Set(mergedOptions.ignores.methods);
		this.ignoredRoutes = new Set(mergedOptions.ignores.routes);
	}

	get InvalidCsrfError() {
		return HttpError(403, "Error invalid csrf token");
	}

	private create(...args: string[]) {
		const SecretHash = CryptoJS.SHA256(args ? args.toString() : "" + this.conf.secret).toString();
		const encrypted = CryptoJS.AES.encrypt(SecretHash + args ? args.toString() : "", this.conf.secret).toString();
		const token = CryptoJS.enc.Hex.stringify(CryptoJS.enc.Utf8.parse(encrypted));
		return `${token}&${SecretHash}`;
	}

	private valide(csrfToken: string | undefined, ...args: string[]): boolean {
		if (!csrfToken) return false;
		const [token, Hash] = csrfToken.split("&");
		const ExpectedHash = CryptoJS.SHA256(args ? args.toString() : "" + this.conf.secret).toString();
		// Converte os bytes para uma string
		const decryptedToken = CryptoJS.AES.decrypt(
			CryptoJS.enc.Utf8.stringify(CryptoJS.enc.Hex.parse(token)),
			this.conf.secret,
		).toString(CryptoJS.enc.Utf8);
		if (Hash !== ExpectedHash) return false;
		if (decryptedToken !== (args ? args.toString() : "" + this.conf.secret)) return false;
		return true;
	}

	public ProtectionMiddleware() {
		return (req: Request, res: Response, next: NextFunction) => {
			if (!res.cookie) throw new Error("Cookie-parser module is required for ALTCsrf to work properly.");
			const CsrfToken: string | undefined = this.conf?.cookie?.signed
				? req.signedCookies[this.conf.csrf.name]
				: req.cookies[this.conf.csrf.name];
			if (this.ignoredRoutes.has(req.originalUrl)) return next();
			else if (this.ignoredMethods.has(req.method)) return next();
			else if (this.valide(CsrfToken, `${req.headers["x-forwarded-for"] ?? req.ip ?? req.socket.remoteAddress}`))
				return next();
			else {
				res.clearCookie(
					this.conf.cookie?.signed
						? req.signedCookies[this.conf.csrf.name]
						: req.cookies[this.conf.csrf.name],
				); // Clear Csrf-Token
				switch (this.conf.csrf?.sender) {
				case "ALTHtml/json":
					return next(this.InvalidCsrfError);
				case "http-error":
					return next(this.InvalidCsrfError);
				case "Custom":
					if (this.conf.csrf.Custom) return this.conf.csrf.Custom(req, res, next);
					else {
						console.error(
							"To use the Custom Response it is necessary to call new ALTCsrf({csrf:{ sender:\"Custom\",Custom:(req,res,next(optional)) => {res.send(\"exemple\")}}}) in the creation of the class, returning the default template \"http-error\".",
						);
						return next(this.InvalidCsrfError);
					}
				default:
					return next(this.InvalidCsrfError);
				}
			}
		};
	}

	public CreateToken(req: Request, res: Response, overwhite = false): string {
		if (!res.cookie) throw new Error("Cookie-parser module is required for ALTCsrf to work properly.");
		const CsrfToken: string | undefined =
            this.conf.cookie && this.conf.cookie.signed
            	? req.signedCookies[this.conf.csrf.name]
            	: req.cookies[this.conf.csrf.name];
		const newToken = this.create(`${req.headers["x-forwarded-for"] ?? req.ip ?? req.socket.remoteAddress}`);
		if (CsrfToken && !overwhite) return CsrfToken;
		res.cookie(this.conf.csrf.name, newToken, { httpOnly: true, ...this.conf.cookie });
		return newToken;
	}
	public ValiteToken(req: Request): boolean {
		const CsrfToken: string | undefined =
            this.conf.cookie && this.conf.cookie.signed
            	? req.signedCookies[this.conf.csrf.name]
            	: req.cookies[this.conf.csrf.name];
		return this.valide(CsrfToken, `${req.headers["x-forwarded-for"] ?? req.ip ?? req.socket.remoteAddress}`);
	}
	public expecificToken(res: Response, name: string, ...args: string[]): string {
		if (!res.cookie) throw new Error("Cookie-parser module is required for ALTCsrf to work properly.");
		const newToken = this.create(args.join("|"));
		res.cookie(name, newToken, { httpOnly: true, ...this.conf.cookie });
		return newToken;
	}
	public ValiteexpecificToken(req: Request, name: string, ...args: string[]): boolean {
		const CsrfToken: string | undefined =
            this.conf.cookie && this.conf.cookie.signed ? req.signedCookies[name] : req.cookies[name];
		return this.valide(CsrfToken, args.join("|"));
	}
}
export type ALTCsrfType = InstanceType<typeof ALTCsrf>;
