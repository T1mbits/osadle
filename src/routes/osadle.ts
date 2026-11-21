import type { RouterType } from "itty-router";

import { InitDb } from "../db/sql.ts";
import getGames from "../games/index.ts";
import { response, serverFault } from "../lib/responses.ts";
import { env } from "cloudflare:workers";

export function routes(app: RouterType) {
    app.get("/api/today/", async (_request) => {
        const sql = InitDb(env.osadle);
        const games = await getGames();

        const last = await sql.history.last();
        if (!last) return serverFault("nothing today");

        return response({
            _: "you know what you're doing, don't you? don't do it !!",
            day: last.day,
            time: last.time,
            games: Object.entries(last.seeds).map(([game, seed]) => {
                return {
                    id: game,
                    seed,
                    game: games.find((v) => {
                        return game === v.id;
                    }),
                };
            }),
        });
    });
}
