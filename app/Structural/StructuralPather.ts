import path from "path";
import { json } from "@/Utils/Json";
import { dirCR } from "@/Utils";

/**
 * Basic Args
 */
export const Type = path.join(__filename).endsWith(".ts") ? "Typescript" : "Javascript";
export const Version = json<{ version: "string" }>("./package.json").version
	? json<{ version: "string" }>("./package.json").version
	: "Canary";
/***
 * Paths for Panel
 */
export const RootPATH = path.join(__filename).endsWith(".ts") ? "./app" : "./dist";
export const StoragePATH = RootPATH + "/Storage";
export const LoggingsPATH = RootPATH + "/Storage/Logs";
export const ResourcesPATH = RootPATH + "/Resources";
export const ReactPATH = RootPATH + "/Resources/Scripts";

/**
 * Create dirs
 */
dirCR(StoragePATH);
dirCR(LoggingsPATH);
