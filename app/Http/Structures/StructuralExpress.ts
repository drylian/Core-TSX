import { RootPATH } from "@/Structural";
import { Application } from "express";
import { glob } from "glob";
import path from "path";
import { Middleware } from "@/Http/Structures/Middleware";
import { Router } from "../Structures/Route";
import Loggings from "@/Controllers/Loggings";
import { GenericError } from "@/core";
/**
 * Routers Structural
 * @param app Express
 */
export async function StructuralRouters(app: Application) {
	const CoreDIR = path.join(RootPATH);
	const paths = await glob(["Http/Routes/**/*.{ts,js}"], { cwd: CoreDIR });
	for (const pather of paths) {
		await import(`${path.join("..", "..", pather)}`);
	}

	for (const isolated of Router.all) {
		app[isolated.method](isolated.path, async (req, res) => {
			const core = new Loggings("Router - " + isolated.name, "red");
			try {
				req.core.route = {
					name: isolated.name,
					path: isolated.path,
					comment: isolated.comment,
					origin_path: req.originalUrl,
					method: isolated.method,
				};
				await isolated.run({ req, res }, core);
			} catch (HttpError) {
				core.error(`Erro : ${(HttpError as GenericError).message}`);
				res.status(500);
				// new Responser(req, res).error({ title: "Router Error", status: 500, error: HttpError as GenericError });
			}
		});
	}
}
/**
 * Middlewares Structural
 * @param app Express
 */
export async function StructuralMiddlewares(app: Application) {
	const CoreDIR = path.join(RootPATH);
	const paths = await glob(["Http/Routes/**/*.{ts,js}"], { cwd: CoreDIR });
	for (const pather of paths) {
		await import(`${path.join("..", "..", pather)}`);
	}

	for (const isolated of Middleware.all) {
		if (!isolated.path) isolated.path = "*";
		app.use(isolated.path, async (req, res, next) => {
			const core = new Loggings("Middlewares - " + isolated.name, "red");
			try {
				await isolated.run({ req, res, next }, core);
			} catch (HttpError) {
				core.error(`Erro : ${(HttpError as GenericError).message}`);
				res.status(500);
				// new Responser(req, res).error({ title: "Middleware Error", status: 500, error: HttpError as GenericError });
			}
		});
	}
}
