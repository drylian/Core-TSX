import { glob } from "glob";
import path from "path";
import { RootPATH } from "@/Structural";
/**
 * Load Resources for Configuration
 */
export async function StructuralConfiguration() {
	const CoreDIR = path.join(RootPATH);
	const paths = await glob(["Configurations/**/*.{ts,js}"], { cwd: CoreDIR });
	/**
     * Organize Configurations filter
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
}
