import Loggings, { LoggingsColors } from "@/Controllers/Loggings";
import { GenericError } from "@/core";
import { NextFunction, Request, Response } from "express";
import { Responser } from "@/Http/Structures/Responser";
import { genv4 } from "@/Utils";

type ExpressConfigurations = {
    req: Request;
    res: Response;
    next: NextFunction;
};

export type MiddlewareConfigurations = {
    /**
     * Identificador do Middleware, usado em logs
     */
    name: string;
    /**
     * Caso precise expecificar a path onde o middleware vai trabalhar
     */
    path?: string;
    /**
     * Função do Middleware
     * @param express Request,Response,NextFunction do express
     * @param core Console de Logs
     */
    run(express: ExpressConfigurations, core: InstanceType<typeof Loggings>): Promise<void>;
};

export class MiddlewareError extends Error {
	public req: Request;
	public res: Response;
	constructor(
		req: Request,
		res: Response,
		message: string,
        public statusCode: number,
	) {
		super(message);
		this.name = "MiddlewareError";
		this.req = req;
		this.res = res;
	}
}

export class Middleware {
	private middleware: MiddlewareConfigurations["run"];
	public static all: MiddlewareConfigurations[] = [];
	constructor(options: MiddlewareConfigurations) {
		this.middleware = options.run;
		const data = {
			...options,
		};
		Middleware.all.push(data);
	}
}
