import { glob } from "glob";
import path from "path";
import { RootPATH } from "@/Structural";
import { Connection } from "@/Controllers/Sequelize/Connection";
import { Models } from "@/Controllers/Sequelize/Models";

/**
 * Configuration Models for panel
 */
export async function StructuralModels() {
	const CoreDIR = path.join(RootPATH);
	const paths = await glob(["Models/**/*.{ts,js}"], { cwd: CoreDIR });
	await Connection.restart(); // reconfigura o sequelize, por padrão eu configuro ele como "sqlite" memorial(n cria db)
	await Connection.sequelize.authenticate(); // seja sqlite ou mysql ou pg(futuramente), verifica se a conexão ta ok

	for (const pather of paths) {
		await import(`${path.join("..", pather)}`);
	}
	for (const moduler of Models.all) {
		moduler.initial({ sequelize: Connection.sequelize });
		await moduler.model.sync();
	}
}
