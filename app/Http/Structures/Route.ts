import { LoggingsMethods } from "@/Controllers/Loggings";
import { Request, Response } from "express";

import { Permissions } from "@/Models/User.model";

/**
 * Declarações de methods do express
 */
export enum ExpressMethods {
    Get = "get",
    Post = "post",
    Put = "put",
    Delete = "delete",
}

/**
 * Tipos de autenticação do painel
 */
export enum AuthenticateTypes {
    Cookie = "Cookie",
    Token = "Token",
    ClientToken = "ClientToken",
    FullAccess = "AllAccess",
}

type ExpressConfigurations = {
    req: Request;
    res: Response;
};

export type RouterConfigurations = {
    /**
     * Identificador do Router, usado em logs, html e lang,
     * Adicione o argumento do name em /routes/names.json no arquivo de langs
     */
    name: string;
    /**
     * Argumento I18n para melhores estruturas
     * Adicione o argumento do Comment em /routes/comments.json no arquivo de langs
     */
    comment: string;
    /**
     * Path do Router
     */
    path: string;
    /**
     * Permissão necessaria para poder acessar essa rota
     */
    permission?: Permissions;
    /**
     * Tipo de Acesso permitido [Cookie, Token, e ClientToken]
     */
    type: Array<AuthenticateTypes>;
    /**
     * Tipo de rota usada, GET,PUT,POST,DELETE
     */
    method: ExpressMethods;
    /**
     * Função do Router
     * @param express Request,Response,NextFunction do express
     * @param core Console de Logs
     */
    run(express: ExpressConfigurations, core: LoggingsMethods): Promise<void> | void;
};

export class Router {
	public static all: RouterConfigurations[] = [];
	public static readonly Methods = ExpressMethods;
	public static readonly Types = AuthenticateTypes;

	constructor(options: RouterConfigurations) {
		let type;
		if (options.type.includes(AuthenticateTypes.FullAccess)) {
			type = [AuthenticateTypes.Cookie, AuthenticateTypes.Token, AuthenticateTypes.ClientToken];
		} else {
			type = options.type;
		}
		const data = {
			...options,
			type,
		};
		Router.all.push(data);
	}
}
