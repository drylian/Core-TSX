import crypto from "crypto";
// Função para gerar um valor aleatório de 128 caracteres
const gen = (numero?: number) => {
	numero = numero || 128; // Define o valor padrão como '128' se não for fornecido nenhum valor ou se o valor fornecido for falsy
	const caracteres = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

	let valor = "";

	for (let i = 0; i < numero; i++) {
		const indiceAleatorio = Math.floor(Math.random() * caracteres.length);
		valor += caracteres.charAt(indiceAleatorio);
	}

	return valor;
};

const gex = (numero?: number) => {
	numero = numero || 128; // Define o valor padrão como '128' se não for fornecido nenhum valor ou se o valor fornecido for falsy
	const caracteres = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-={}[]|:;<>,.?/~`";

	let valor = "";

	for (let i = 0; i < numero; i++) {
		const indiceAleatorio = Math.floor(Math.random() * caracteres.length);
		valor += caracteres.charAt(indiceAleatorio);
	}

	return valor;
};

const hashmd5 = (response: object) => {
	return crypto.createHash("md5").update(JSON.stringify(response)).digest("hex");
};

const verifhash = (response: object, compare: string): boolean => {
	const generatedHash = hashmd5(response);
	return generatedHash === compare;
};
export { gen, gex, hashmd5, verifhash };
