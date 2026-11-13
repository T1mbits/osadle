import type { RouterType } from "itty-router";

import { response, serverFault } from "../lib/responses.ts";
import { sign } from "../lib/s3.ts";
import { type History, sql } from "../lib/sql.ts";
import { env } from "cloudflare:workers";

export function routes(app: RouterType) {
	app.get("/api/today/", async (_request) => {
		const last: null | History = await sql.history.last(env.osadle);
		if (!last) return serverFault("nothing today");
		const song = await sql.songs.get(env.osadle, last.songId);

		return response({
			day: last.day,
			time: last.time,
			answer: btoa(last.songId),

			audio: await sign("music", song.audioHash, 360),

			thumbnails: (await sql.songs.list(env.osadle)).map((a) => {
				return a.imageHash;
			}),

			base: new URL("/storage/v1/object/public/thumbnails/", env.S3_ENDPOINT),
		});
	});
}
