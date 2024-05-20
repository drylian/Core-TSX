import Loggings, { LoggingsColor } from "@/Controllers/Loggings";
import { ResourcesPATH } from "@/Structural";
import { Uptimer } from "@/Utils/Uptimer";
import chalk from "chalk";
import * as esbuild from "esbuild";
import path from "path";
export class ReacterLogger {
	private core: InstanceType<typeof Loggings>;
	private progress: InstanceType<typeof Loggings.progress>;

	constructor(title: string, color: LoggingsColor) {
		this.core = new Loggings(title, color, {
			format: `[${chalk.cyan("Compiling")}] [{hours}:{minutes}:{seconds}].gray {message}`,
		});
		this.progress = new Loggings.progress({
			progress_size:10,
			progress_format:"{progress}% |[{bar}].red| [{current}].blue/[{total}].green - [{progress_time}].gray - {message}",
			progress_bar:"="
		});
	}
	init(): esbuild.Plugin {
		const core = this.core;
		const progress = this.progress
		return {
			name: "reacter-logger",
			setup(build) {
				const startTime = process.uptime();
				build.onStart(() => {
					core.log(
						`Compilando:[${path.basename(build.initialOptions.outdir ? build.initialOptions.outdir : "idk")}].magenta-b`,
					);
				});
				build.onLoad({ filter: /\.?$/ }, async (args) => {
					const locale = path.relative(path.join(process.cwd(), ResourcesPATH), args.path);
					progress.msg(`[${locale.includes("node_modules") ? locale.replace(`..\\..\\node_modules\\`, "Modules:") : locale}].magenta-b`);
					progress.cmt();
					return null;
				});
				build.onResolve({ filter: /\.?$/ }, () => {
					progress.add(1);
					return null;
				});
				build.onEnd((result) => {
					progress.msg(`[Finalizado].cyan-b`);
					progress.show();
					progress.end();
					if (result.warnings.length) {
						for (const warning of result.warnings) {
							core.warn(warning.text);
						}
						core.warn(`Compilação [concluída].green com [${result.warnings.length} avisos].yellow.`);
					}
					const elapsedTime = Uptimer(process.uptime() - startTime, true); // Calcular o tempo decorrido
					if (result.errors.length) {
						for (const error of result.errors) {
							core.error(error.text);
						}
						core.warn(
							`Compilação [concluída].green com [${result.errors.length} errors].yellow em [${elapsedTime}].red.`,
						);
					}
				});
			},
		};
	}
}
