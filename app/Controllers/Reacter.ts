import { Application } from "express";
import path from "path";
import * as esbuild from "esbuild";
import fs from "fs";
import { dirDEL } from "@/Utils";
import { GenericError } from "@/core";
import { ReacterERROR } from "./Reacter/Error";
import { Internal } from "./Storage";
import express from "express";
interface ReacterConstructor {
	client: esbuild.BuildOptions;
	server: esbuild.BuildOptions;
	cachedir: string;
	production: boolean;
}
export class Reacter {
	private options: ReacterConstructor;
	private mode: boolean;
	constructor(options: ReacterConstructor) {
		this.mode = options?.production ? options?.production : false;
		this.options = options;
	}
	public async resources(app: Application) {
		const Production = this.mode;
		const Options = this.options;
		const ReacterCacher = path.join(this.options.cachedir, "Reacter");

		if (!Options.client.outdir) throw new Error("Client.outdir is Necessary.");
		if (!Options.server.outdir) throw new Error("Server.outdir is Necessary.");
		if (!Production) {
			//client dirs
			app.get("*", express.static(path.join(ReacterCacher, "Client")));
			//server dirs
			app.get("*", express.static(path.join(ReacterCacher, "Server")));
		}
		
		app.get("/reacter/resources.tsx", async (req, res) => {
			try {
				if (Production) {
					if (fs.existsSync(Options.client.outdir + "/index.js")) {
						const content = fs.readFileSync(Options.client.outdir + "/index.js", "utf-8");
						res.setHeader("Content-Type", "application/javascript");
						res.send(content);
					} else {
						res.setHeader("Content-Type", "text/plain");
						res.send("");
					}
				} else {
					dirDEL(path.join(ReacterCacher, "Client"));
					await esbuild
						.build({
							...Options.client,
							outdir: path.join(ReacterCacher, "Client"),
						})
						.then(() => {
							const content = fs.readFileSync(
								path.join(ReacterCacher, "Client", "index.js"),
								"utf-8",
							);
							res.setHeader("Content-Type", "application/javascript");
							res.send(content);
						});
				}
			} catch (e) {
				if (!res.headersSent) return res.send(ReacterERROR(e as GenericError, Production, true));
				console.error(
					"Reacter Server ERROR:" + `${(e as GenericError).message}\n ${(e as GenericError).stack}`,
				);
			}
		});
		app.get("*", async (req, res) => {
			req.core.internal = Internal;
			try {
				if (Production) {
					res.status(200).send(
						(await import(path.join("..", "Resources", "Build", "Server", "Index.js"))).Renderize(),
					);
				} else {
					dirDEL(path.join(ReacterCacher, "Server"));
					await esbuild
						.build({
							...Options.server,
							outdir: path.join(ReacterCacher, "Server"),
						})
						.then(() => {
							const relativer = path.relative(
								__dirname,
								path.join(ReacterCacher, "Server"),
							);
							const content = require(path.join(relativer, "Index.js"));
							const response = content.Renderize(req, res);
							if (!res.headersSent) return res.send(response);
						});
				}
			} catch (e) {
				if (!res.headersSent) return res.send(ReacterERROR(e as GenericError, Production, false));
				console.error(
					"Reacter Server ERROR:" + `${(e as GenericError).message}\n ${(e as GenericError).stack}`,
				);
			}
		});
	}
}
