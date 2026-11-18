import type { RouterType } from "itty-router";

import { response, serverFault } from "../lib/responses.ts";
import { type History, sql } from "../lib/sql.ts";
import { env } from "cloudflare:workers";

export function routes(app: RouterType) {
	app.get("/api/today/", async (_request) => {
		const last: null | History = await sql.history.last(env.osadle);
		if (!last) return serverFault("nothing today");
		const song = await sql.songs.get(env.osadle, last.songId);

		const imgBase = new URL(
			"/storage/v1/object/public/thumbnails/",
			env.S3_ENDPOINT,
		);
		const audioBase = new URL(
			"/storage/v1/object/public/music/",
			env.S3_ENDPOINT,
		);

		return response({
			_: "you know what you're doing, don't you? don't do it !!",
			day: last.day,
			time: last.time,
			games: {
				song: {
					answer: btoa(last.songId),

					audio: new URL(song.audioHash, audioBase),
					start: last.startPercent,

					thumbnails: (await sql.songs.list(env.osadle)).map((a) => {
						return {
							id: a.songId,
							name: a.commonName,
							aliases: a.aliases,
							image: new URL(a.imageHash, imgBase),
							audio: new URL(a.audioHash, audioBase),
						};
					}),
				},
			},
		});
	});
}
