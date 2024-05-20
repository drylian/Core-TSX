import fs from "fs";
import path from "path";

export function dirCR(folderPath: string) {
	fs.mkdirSync(folderPath, { recursive: true });
}
export function dirDEL(pathToDelete: string) {
	if (fs.existsSync(pathToDelete)) {
		try {
			const stats = fs.statSync(pathToDelete);
			if (stats.isDirectory()) {
				// Se for um diretório, exclua-o e seu conteúdo recursivamente
				fs.rmSync(pathToDelete, { recursive: true });
				// console.log(`Diretório ${pathToDelete} e seu conteúdo foram removidos com sucesso.`);
			} else if (stats.isFile()) {
				// Se for um arquivo, exclua-o
				fs.unlinkSync(pathToDelete);
				// console.log(`Arquivo ${pathToDelete} foi removido com sucesso.`);
			}
			return true;
		} catch (error) {
			console.error(`Erro ao remover ${pathToDelete}:`, error);
			throw error;
		}
	} else {
		return false;
	}
}

export function dirRE(filePath: string): string {
	try {
		// Lê o conteúdo do arquivo de forma síncrona
		const content = fs.readFileSync(filePath, "utf-8");
		return content;
	} catch (error) {
		console.error("Erro ao ler o arquivo:", error);
		return "";
	}
}
export function dirEX(folderPath: string) {
	if (fs.existsSync(folderPath)) {
		return true;
	} else {
		return false;
	}
}

interface FileInfo {
    name: string;
    path: string;
    isDirectory: boolean;
    size: number;
    createdAt: Date;
    modifiedAt: Date;
    accessedAt: Date;
}

export function dirSC(folderPath: string): FileInfo[] {
	const scannedFiles: FileInfo[] = [];

	function scanDir(directory: string) {
		const files = fs.readdirSync(directory);

		files.forEach((file) => {
			const filePath = path.join(directory, file);
			const stat = fs.statSync(filePath);

			const fileInfo: FileInfo = {
				name: file,
				path: filePath,
				isDirectory: stat.isDirectory(),
				size: stat.size,
				createdAt: stat.birthtime,
				modifiedAt: stat.mtime,
				accessedAt: stat.atime,
			};

			scannedFiles.push(fileInfo);

			if (stat.isDirectory()) {
				scanDir(filePath);
			}
		});
	}

	scanDir(folderPath);
	return scannedFiles;
}
