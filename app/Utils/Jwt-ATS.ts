import { GenericError } from "@/core";
import CryptoJS from "crypto-js";

/**
 * ### Criptografa os dados e gera um token hexadecimal.
 * @param {object} data - Os dados a serem criptografados.
 * @param {string} cryptKey - A chave de criptografia.
 * @param {object} options - Opções, como tempo de expiração (opcional).
 * @returns {string} - O token criptografado em formato hexadecimal.
 */
export function ALTcpt(data: object, cryptKey: string, options?: { ip: string | undefined; expires?: string }): string {
	try {
		// Verificar se a opção "expires" foi fornecida
		if (options && options.expires) {
			// Calcular o tempo de expiração em milissegundos
			const expirationTime = AlTexp(options.expires);

			// Calcular a data de expiração
			const expirationDate = new Date(Date.now() + expirationTime);

			// Converter a data de expiração em uma string no formato ISO
			const expires = expirationDate.toISOString();
			options.expires = expires;
		}

		const expectedValidToken = CryptoJS.SHA256(data.toString() + cryptKey).toString();

		// Adicionar o UUID gerado às opções
		const tokenOptions = { hashed: expectedValidToken, ...options };

		// Combine os dados e a opção "validtoken" em um único objeto
		const tokenData = { data, options: { ...tokenOptions } };

		// Criptografar
		const encrypted = CryptoJS.AES.encrypt(JSON.stringify(tokenData), cryptKey).toString();

		// Converter o token criptografado em hexadecimal
		const hexData = CryptoJS.enc.Hex.stringify(CryptoJS.enc.Utf8.parse(encrypted));
		return hexData;
	} catch (error) {
		console.error("Erro ao gerar o token:", error);
		throw error;
	}
}

/**
 * ### Calcula o tempo de expiração em milissegundos.
 * @param {string} expires - A string de expiração (por exemplo, "1h" para uma hora).
 * @returns {number} - O tempo de expiração em milissegundos.
 */
export function AlTexp(expires: string): number {
	const match = expires.match(/^(\d+)([hmd])$/);
	if (!match) {
		throw new Error(
			"Formato de expiração inválido. Use \"1h\" para uma hora, \"30m\" para 30 minutos ou \"2d\" para dois dias, por exemplo.",
		);
	}

	const value = parseInt(match[1]);
	const unit = match[2];

	switch (unit) {
	case "s":
		return value * 60 * 1000; // segundos em milissegundos
	case "h":
		return value * 60 * 60 * 1000; // horas em milissegundos
	case "m":
		return value * 60 * 1000; // minutos em milissegundos
	case "d":
		return value * 24 * 60 * 60 * 1000; // dias em milissegundos
	default:
		throw new Error(
			"Unidade de expiração inválida. Use \"h\" para horas, \"m\" para minutos, \"s\" para segundos ou \"d\" para dias.",
		);
	}
}

/**
 * ### Descriptografa um token e verifica sua validade.
 * @param {string} token - O token criptografado em formato hexadecimal.
 * @param {string} cryptKey - A chave de criptografia.
 * @returns {T | null} - Os dados descriptografados ou `false` se o token expirou.
 */
export function ALTdcp<T>(token: string, cryptKey: string, ip?: string | undefined): T {
	try {
		// Decodificar o token hexadecimal
		const wordArray = CryptoJS.enc.Hex.parse(token);
		const base64 = CryptoJS.enc.Utf8.stringify(wordArray);
		// Descriptografar o token
		const bytes = CryptoJS.AES.decrypt(base64, cryptKey);
		const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

		// Verificar se o hash (validtoken) está correto
		const expectedValidToken = CryptoJS.SHA256(decryptedData.data.toString() + cryptKey).toString();
		if (expectedValidToken !== decryptedData.options.hashed) {
			throw new Error("Token inválido: hash não corresponde");
		}

		// Verificar se o token expirou (se a opção "expires" estiver presente)
		let expired = false;
		let IpDif = false;
		if (decryptedData.options.expires) {
			const now = new Date().getTime();
			const expirationTime = new Date(decryptedData.options.expires).getTime();
			if (now >= expirationTime) {
				expired = true;
			}
		}
		if (decryptedData.options.ip && decryptedData.options.ip !== ip) IpDif = true;
		const data = expired
			? (null as T)
			: IpDif
				? (null as T)
				: ({ data: decryptedData.data, expires: decryptedData.options.expires } as T);
		return data;
	} catch (error) {
		throw new Error("Erro na verificação e descriptografia do token: " + (error as GenericError).message);
	}
}
