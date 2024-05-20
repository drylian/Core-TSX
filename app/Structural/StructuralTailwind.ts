import chokidar from "chokidar";
import { dirEX } from "@/Utils";
import path from "path";
import { Internal } from "@/Controllers/Storage";
import Loggings from "@/Controllers/Loggings";
import { exec } from "child_process";
import { RootPATH } from "@/Structural";

/**
 * Compile the tailwind.css
 */
const Compiler = async () => {
	try {
		const comando = `tailwindcss -i ${RootPATH}/Http/Assets/css/main.css -o ${RootPATH}/Http/Assets/css/tailwind.css --watch`;

		exec(comando, (error, stdout, stderr) => {
			if (error) {
				console.error(`Erro ao executar o comando: ${error.message}`);
				return;
			}
			if (stderr) {
				console.error(`Erro na execução: ${stderr}`);
				return;
			}
			console.log(`Saída do comando:\n${stdout}`);
		});
	} catch (error) {
		console.error("Erro ao recompilar o Tailwind CSS:", error);
	}
};
const ProductionTailwind = async () => {
	try {
		const comando = `tailwindcss -i ${RootPATH}/Http/Assets/css/main.css -o ${RootPATH}/Http/Assets/css/tailwind.css`;

		exec(comando, (error, stdout, stderr) => {
			if (error) {
				console.error(`Erro ao executar o comando: ${error.message}`);
				return;
			}
			if (stderr) {
				console.error(`Erro na execução: ${stderr}`);
				return;
			}
			console.log(`Saída do comando:\n${stdout}`);
		});
	} catch (error) {
		console.error("Erro ao recompilar o Tailwind CSS:", error);
	}
};
export async function StructuralTailwind() {
	if (!dirEX(path.join(RootPATH, "Http/Assets/css/tailwind.css"))) {
		await ProductionTailwind();
	}
	if (Internal.get("core:mode").startsWith("dev")) {
		const core = new Loggings("Tailwind", "blue");
		core.info("Aplicação em modo desenvolvimento, ativando tailwind Auto Rebuild");

		const configWatcher = chokidar.watch("./tailwind.config.cjs");

		configWatcher.on("change", () => {
			core.info("tailwind.config.cjs foi alterado. Rebuildando o Tailwind CSS...");
			Compiler();
		});

		// Compilar o Tailwind CSS quando o servidor for iniciado
		Compiler();
	}
}
