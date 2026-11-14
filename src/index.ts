import { IttyRouter, type RouterType } from "itty-router";

import { ONE_DAY } from "./lib/constants.ts";
import { getSongFor } from "./lib/picker.ts";
import { notFound } from "./lib/responses.ts";
import { type History, sql } from "./lib/sql.ts";
import { adminRoutes } from "./routes/admin.ts";
import { routes } from "./routes/osadle.ts";
import { env } from "cloudflare:workers";
export interface Env {
	public: {
		fetch(request: Request): Promise<Response>;
	};
	__router?: RouterType;
}

export default {
	async fetch(
		request: Request,
		appEnv: Env,
		_ctx: ExecutionContext,
	): Promise<Response> {
		if (!appEnv.__router) {
			const router = IttyRouter();
			adminRoutes(router);
			routes(router);

			router.all("*", async (request: Request, env: Env) => {
				const response = await env.public.fetch(request);

				if (response.status !== 404) {
					return response;
				}

				return notFound();
			});
			appEnv.__router = router;
		}

		return appEnv.__router.fetch(request, appEnv);
	},

	async scheduled(
		_controller: ScheduledController,
		_appEnv: Env,
		_ctx: ExecutionContext,
	) {
		const last: null | History = await sql.history.last(env.osadle);
		if (last == null || last.time + ONE_DAY < Math.ceil(Date.now())) {
			const nextDay = (last?.day ?? 0) + 1;
			const drawing = await getSongFor();

			console.log(drawing?.songId);
			if (drawing) {
				await sql.history.new(
					env.osadle,
					nextDay,
					Math.ceil(Date.now()),
					drawing?.songId,
					Math.floor(Math.random() * 90),
				);
			}
		}
		console.log(last?.time);
	},
};
