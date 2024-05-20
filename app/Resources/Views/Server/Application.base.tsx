import { Internal } from "@/Controllers/Storage";
import { ResourcesPATH } from "@/Structural";
import { json } from "@/Utils";
import React from "react";

/**
 * Core Application base html
 */
export function ApplicationStructuralHTML() {
	const icon = Internal.get("core:logo");
	const owner = Internal.get("core:owner");
	const mode = (Internal.get("core:mode") as string).startsWith("pro");
	return (
		<React.StrictMode>
			<html>
				<head>
					<link rel="icon" type="image/png" href={icon} />
					<meta name="viewport" content="width=device-width, initial-scale=1.0" />
					<meta name="author" content={owner} />
					<link rel="stylesheet" href="/css/tailwind.css" />
					<link rel="stylesheet" href="/icon/css/boxicons.min.css" />
					<coreapplicationtitlerender />
				</head>
				<body className="bg-white dark:bg-black transition duration-500">
					<coreapplicationrender />
					<div id="root" />
					<script src="/react-resources.js"></script>
				</body>
			</html>
		</React.StrictMode>
	);
}
