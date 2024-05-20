import { glob } from "glob";
import path from "path";
import { RootPATH } from "@/Structural";
import { Crons } from "@/Controllers/Configurations/Crons";

/**
 * Configuration Crons for panel
 */
export async function StructuralCrons() {
	const CoreDIR = path.join(RootPATH);
	const paths = await glob(["Crons/**/*.{ts,js}"], { cwd: CoreDIR });

	/**
     * Organize Crons filter
     */
	const customSort = (a: string, b: string) => {
		const partsA = a.split("/");
		const partsB = b.split("/");
		for (let i = 0; i < Math.min(partsA.length, partsB.length); i++) {
			if (partsA[i] !== partsB[i]) {
				return partsA[i].localeCompare(partsB[i]);
			}
		}
		return partsA.length - partsB.length;
	};

	const sortedPaths = paths.sort(customSort);

	for (const pather of sortedPaths) {
		await import(`${path.join("..", pather)}`);
	}

	for (const isolated of Crons.all) {
		Crons.set.on(isolated.uuid, isolated.exec); // create Cron Event
		Crons.start(isolated); // Run Cron events
	}
}
