import I18alt from "@/Controllers/Languages";
import { SetTitle } from "@/Utils/ReactALT";
import { Request, Response } from "express";
import { Suspense } from "react";
import React from "react";

export function InstallHome(req: Request, res: Response) {
	const i18n = new I18alt();
	const error = req.query.error;
	return (
		<Suspense>
			<div className="h-screen flex items-center justify-center">
				<SetTitle title="Inicio" />
				<div className="max-w-md bg-slate-700 p-4 m-2 rounded-md shadow-md text-center justify-center">
					<img src="/img/logo.jpg" alt="/img/logo.jpg" className="h-36 w-36 mb-4 rounded-full mx-auto" />
					<h2 className="text-2xl font-bold mb-4">Core-ATS</h2>
					<p className="text-gray-300 mb-4">{i18n.t("installer.InitialMessage")}.</p>
					{error && <p className="text-red-500 mb-4">{i18n.t("installer." + error)}.</p>}
					<h4>{i18n.t("installer.termsofuse")}</h4>
					<div className="mt-4 flex justify-between">
						<a href="/" className="bg-blue-900 text-white rounded-md hover:bg-blue-700 duration-200">
							<i className="text-lg px-4 py-2 bx bxs-left-arrow-alt"></i>
						</a>
						<a
							href="/install/setup/one"
							className="bg-blue-900 text-white rounded-md hover:bg-blue-700 duration-200"
						>
							<i className="text-lg px-4 py-2 bx bxs-right-arrow-alt"></i>
						</a>
					</div>
				</div>
			</div>
		</Suspense>
	);
}
