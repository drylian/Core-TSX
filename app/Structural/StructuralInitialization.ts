import http, { createServer } from "node:http";
import { Express } from "@/Controllers/Express";
import { InstallerServer } from "@/Controllers/Installer";
import { Internal } from "@/Controllers/Storage";
import Loggings from "@/Controllers/Loggings";
import expressWS from "express-ws";
/**
 * Class for initialization web resources
 */
class StructuralInitialization {
	public process: ReturnType<typeof createServer> | null;
	private readonly core: InstanceType<typeof Loggings>;
	constructor() {
		this.process = null;
		this.core = new Loggings("Sistema", "cyan");
	}
	public async getIp() {
		const response = await fetch("https://ifconfig.me/ip");
		const ipAddress = (await response.text()).trim();
		return ipAddress;
	}
	/**
     * Start Server in full Aplication and Database
     */
	public async full(): Promise<void> {
		if (!this.process) {
			const Server = new Express().express;
			await Express.start(Server);
			const Application = expressWS(Server);
			this.process = http.createServer(Application.app);

			this.core.info(`Servidor iniciará em ${Internal.get("core:url")}:${Internal.get("core:port")}`);
			this.process.listen(Internal.get("core:port"));
		}
	}
	/**
     * Start Server in install mode, limited access and not have database
     */
	public async installer(): Promise<void> {
		if (!this.process) {
			const express = new InstallerServer();
			await express.start(express.express);			
			const Application = expressWS(express.express);
			this.process = http.createServer(Application.app);
			const ip = await this.getIp();
			this.core.info(
				`Servidor iniciará em modo de instalação, no link http://${ip}:${Internal.get("core:port")}`,
			);
			this.process.listen(Internal.get("core:port"));
		}
	}
}

export const Server = new StructuralInitialization();
