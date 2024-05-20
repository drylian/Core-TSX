import { Events } from "@/Controllers/Configurations/Events";
import { Server } from "@/Structural";

new Events({
	name: "DatabaseUpdateSet",
	run: async (key, value) => {
		console.log("Instalação completa, fechando servidor");
		if (Server.process) {
			Server.process.close();
			console.log("Servidor de instalação fechado, iniciando servidor completo.");
			Server.process = null;
			Server.full();
		}
	},
});
