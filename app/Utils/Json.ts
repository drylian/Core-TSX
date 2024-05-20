import { GenericError } from "@/core";
import fs from "fs";
import lodash from "lodash";

function json<T>(local: string): T {
	let existingData: string;

	try {
		if (fs.existsSync(local)) {
			existingData = fs.readFileSync(local, "utf-8");
		} else {
			return {} as T;
		}

		const parsedData: T = JSON.parse(existingData);
		return parsedData;
	} catch (err) {
		console.error("Erro ao analisar o JSON:", (err as GenericError).message);
		return {} as T;
	}
}

function jsonsv<Datatype>(local: string, data: Datatype): void {
	try {
		let existingData: Datatype;

		// Verifica se o arquivo já existe
		if (fs.existsSync(local)) {
			// Se existir, lê o conteúdo do arquivo e o converte em objeto JSON
			const fileContent = fs.readFileSync(local, "utf-8");
			existingData = JSON.parse(fileContent);
		} else {
			// Se o arquivo não existir, cria um objeto vazio
			existingData = {} as Datatype;
		}

		// Mescla os dados existentes com os novos dados (mesclagem profunda)
		const mergedData = lodash.merge(existingData, data);

		// Converte o objeto mesclado em uma string JSON
		const jsonData = JSON.stringify(mergedData, null, 2); // O terceiro argumento define a formatação com espaços (2 espaços, por exemplo)

		// Escreve a string JSON no arquivo
		fs.writeFileSync(local, jsonData, "utf-8");
	} catch (error) {
		console.error("Erro ao salvar o arquivo:" + local + " ,error :", error);
	}
}

export { json, jsonsv };
