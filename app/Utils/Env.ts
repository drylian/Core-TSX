import dotenv from "dotenv";
import fs from "fs";
/**
 * Returns Env value
 * @param key Env Key
 * @param path Env Path
 * @returns
 */
function Env(key: string, path = ".env") {
	if (!fs.existsSync(path)) {
		fs.writeFileSync(path, "", "utf8");
	}
	const envFileContent = fs.readFileSync(path, "utf8");
	const envConfig = dotenv.parse(envFileContent);
	return envConfig[key];
}
/**
 * Returns Env value and Update/Create .env config key
 * @param key Env Key
 * @param path Env Path
 * @returns
 */
function Envsv(key: string, value: string | number | boolean, comment?: string, path = "./.env") {
	if (!fs.existsSync(path)) {
		fs.writeFileSync(path, "", "utf8");
	}
	let envFileContent = fs.readFileSync(path, "utf8");
	const envConfig = dotenv.parse(envFileContent);

	if (envConfig[key]) {
		envFileContent = envFileContent.replace(new RegExp(`${key}='${envConfig[key]}'`), `${key}='${value}'`);
	} else {
		envFileContent += `\n${comment ? `# ${comment}\n${key}='${value}'` : `${key}='${value}'`}`;
	}

	fs.writeFileSync(path, envFileContent);
	return value;
}

export { Env, Envsv };
