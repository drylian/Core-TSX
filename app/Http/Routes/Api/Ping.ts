/**
 * Global Routes, used in all server
 */
import { Responser } from "@/Http/Structures/Responser";
import { Router } from "@/Http/Structures/Route";

new Router({
	name: "ApiPingRequest",
	type: [Router.Types.FullAccess],
	comment: "ApiPingComment",
	path: "/api/ping",
	method: Router.Methods.Get,
	run: async ({ req, res }) => {
		const end = Date.now();
		res.send(
			//     await Json({
			//     requested: res.locals.ping,
			//     ended: end,
			//     delay: end - res.locals.ping + "ms"
			// })
			"ola",
		);
		// new Responser(req, res).json({
		//     title: "Ping Request",
		//     data: {
		//         requested: res.locals.ping,
		//         ended: end,
		//         delay: end - res.locals.ping + "ms"
		//     }
		// })
	},
});
