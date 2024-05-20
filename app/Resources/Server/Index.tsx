import ReactDOMServer from "react-dom/server";
import React, { Suspense } from "react";
import { Application } from "@/Server/Application";
import { Request, Response } from "express";
import "@/Http/Assets/css/main.css";

/**
 *
 * @param Request Express Request
 * @param Response Express Response
 * @returns
 */
export function Renderize(req: Request, res: Response) {
	const icon = req.core?.internal?.get("core:logo");
	const owner = req.core?.internal?.get("core:owner");
	return ReactDOMServer.renderToString(
		<React.StrictMode>
			<html>
				<head>
					<link rel="icon" type="image/png" href={icon} />
					<meta name="viewport" content="width=device-width, initial-scale=1.0" />
					<meta name="author" content={owner} />
				</head>
				<body className="bg-white dark:bg-black transition duration-500">
					<div id="application">
						<Application />
					</div>
					<script type="module" src="/reacter/resources.tsx"></script>
				</body>
			</html>
		</React.StrictMode>,
	);
}
