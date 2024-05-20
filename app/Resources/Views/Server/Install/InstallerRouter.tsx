import { Request, Response } from "express";
import { ReactALTRouter, Render } from "@/Utils/ReactALT";
import { InstallHome } from "./InstallHome";
import { ApplicationStructuralHTML } from "../Application.base";
import React from "react";

const router = new ReactALTRouter();
export function installerRouter(req: Request, res: Response) {
	router.add("/install", InstallHome);
	router.add("/", InstallHome);

	return Render(router.config(router, req, res), <ApplicationStructuralHTML />, req, res);
}
