import { sql } from "../lib/sql.ts";
import type { OsadleGameConfig } from "./index.ts";
import { env } from "cloudflare:workers";

export default async function SongGame(): Promise<OsadleGameConfig> {
    const songs = await sql.songs.list(env.osadle);
    return {
        id: "song",
        randomizer: {
            startPercent: {
                type: "range",
                decimals: false,
                min: 5,
                max: 90,
            },
            songId: {
                type: "list",
                options: songs.map((v) => {
                    return v.songId;
                }),
                avoidRepeats: true,
            },
        },
        data: {
            songs,
        },
    };
}
