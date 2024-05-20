import Loggings from "@/Controllers/Loggings";
import { Permissions } from "@/Models/User.model";
import { AuthenticateTypes } from "../Structures/Route";
import I18alt from "@/Controllers/Languages";
import { Request, Response } from "express";

export type AuthenticatorTypes = {
    permission?: Permissions;
    types?: AuthenticateTypes[];
};
class AuthenticatorController {
	private permission: AuthenticatorTypes["permission"];
	private only: AuthenticatorTypes["types"];
	private core: Loggings;
	private i18n: InstanceType<typeof I18alt>;
	public req: Request;
	public res: Response;
	constructor(Request: Request, Response: Response, options: AuthenticatorTypes) {
		this.core = new Loggings("🛡 Authenticator", "red");
		this.permission = options.permission;
		this.only = options.types;
		this.i18n = new I18alt();
		this.req = Request;
		this.res = Response;
	}
	public async auth(): Promise<{ req: Request; res: Response }> {
		const { req, res } = this;
		// eslint-disable-next-line no-async-promise-executor
		return new Promise(async (resolve) => {});
	}
}
