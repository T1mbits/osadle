import { IttyRouter, type RouterType } from "itty-router";

import { legacyHistory } from "./db/schema.ts";
import { InitDb } from "./db/sql.ts";
import getGames from "./games/index.ts";
import SongGame from "./games/song.ts";
import { ONE_DAY } from "./lib/constants.ts";
import { getValidSeed } from "./lib/picker.ts";
import { notFound } from "./lib/responses.ts";
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
        const sql = InitDb(env.osadle);
        const games = await getGames();
        await sql.history.migrateV1ToV2();

        const last = await sql.history.last();
        if (last == null || last.time + ONE_DAY < Math.ceil(Date.now())) {
            const nextDay = (last?.day ?? 0) + 1;
            const seeds: Record<string, number> = {};
            games.forEach((game) => {
                seeds[game.id] = getValidSeed(
                    game.randomizer,
                    last?.seeds[game.id],
                );
            });

            await sql.history.new(nextDay, Math.ceil(Date.now()), seeds);
        }
        console.log(last?.time);
    },
};
