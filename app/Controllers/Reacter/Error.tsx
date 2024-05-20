import { GenericError } from "@/core";
import fs from "fs";
import React from "react";
import ReactDOMServer from "react-dom/server";

export function ReacterERROR(error: GenericError, production: boolean, client: boolean) {
	let Previewer;
	let PreviewerRouter;

	try {
		const stackLines = error.stack?.split("\n");
		const firstStackTraceLine = stackLines && stackLines.length > 1 ? stackLines[1] : null;
		const TraceRoute = firstStackTraceLine?.split("at ")[1];
		if (TraceRoute) {
			PreviewerRouter = TraceRoute;
			const pathdir = TraceRoute?.split(":").slice(0, -2).join(":");
			const coluns = TraceRoute?.split(":").slice(-2);
			const lineNumber = parseInt(coluns[0]) - 1;
			const columnNumber = parseInt(coluns[1]);
			const fileLines = fs.readFileSync(pathdir, "utf-8").split("\n");
			const lines = [];

			for (let i = lineNumber - 2; i <= lineNumber; i++) {
				if (i >= 0 && i < fileLines.length) {
					lines.push(fileLines[i]);
				}
			}
			lines.push(" ".repeat(columnNumber - 20) + "⬆ ERR: " + error.message);
			for (let i = lineNumber + 1; i <= lineNumber + 3; i++) {
				if (i >= 0 && i < fileLines.length) {
					lines.push(fileLines[i]);
				}
			}
			Previewer = lines;
		}
	} catch (err) {
		// ignores resources
	}
	return ReactDOMServer.renderToString(
		<html>
			<head>
				<title>Reacter - Error</title>
				<link rel="stylesheet" href="/css/tailwind.css" />
				<link rel="stylesheet" href="/icon/css/boxicons.min.css" />
			</head>
			<body className="bg-slate-800 text-white">
				<div className="mt-4 flex items-center m-2 px-4">
					<i className="bx bx-error-circle text-red-500 text-4xl mb-4 block" style={{ fontSize: "40px" }} />
					<h2 className="ml-2 text-2xl font-bold mb-4">
                        Reacter Fatal {client ? "Client Side" : "Server side"} Error {error.code && "- " + error.code}
					</h2>
				</div>
				<p className="text-gray-300 px-4">{error.message}</p>
				{!production && Previewer && PreviewerRouter && (
					<div className="p-4">
						<div className="bg-black m-4 rounded-lg">
							<div className="bg-gray-600 p-0.5 rounded-lg text-slate-400 text-lg font-bold">
								<p className="m-1">Pre-viewer - {PreviewerRouter}</p>
							</div>
							<div className="text-base">
								<pre>
									{Previewer.map((line, index) =>
										index === 3 ? (
											<React.Fragment key={index}>
												<p className="text-red-500" key={index}>
													{line}
												</p>
											</React.Fragment>
										) : (
											<p key={index}>{line}</p>
										),
									)}
								</pre>
							</div>
						</div>
					</div>
				)}
				{!production && (
					<div className="p-4">
						<div className="bg-black m-4 rounded-lg">
							<div className="bg-gray-600 p-0.5 rounded-lg text-slate-400 text-lg font-bold">
								<p className="m-1">Stack</p>
							</div>
							<div className="text-base m-2">
								{error.stack?.split("\n").map((line, index) => (
									<p key={index}>
										{index > 0 ? "⟶   " : ""}
										{line}
									</p>
								))}
							</div>
						</div>
					</div>
				)}
			</body>
		</html>,
	);
}
