import childProcess from "child_process";
import "colors";
async function main() {
	try {
		console.log("Preparando Prettier...".cyan);
		childProcess.execSync('npx prettier --config .prettierrc.json "app/**/*.{ts,tsx,css}" --write', { stdio: "inherit" });
		console.log("Prettier finalizado. \n".green);
		console.log("Preparando Eslint...".cyan);
		childProcess.execSync("npx eslint ./app -c .eslintrc.json --fix --debug", { stdio: "inherit" });
		console.log("Eslint concluído.\n".green);
		console.log("Script finalizado com sucesso.\n".green);
	} catch (error) {
		console.error("Erro durante a execução:".red, error, "\n");
		process.exit(1);
	}
}
main();
