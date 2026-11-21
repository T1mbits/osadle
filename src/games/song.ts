import { InitDb } from "../db/sql.ts";
import type { OsadleGameConfig } from "./index.ts";
import { env } from "cloudflare:workers";

export default async function SongGame(): Promise<OsadleGameConfig> {
    const songs = await InitDb(env.osadle).songs.list();
    return {
        name: "osadle song",
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
            },
        },
        data: {
            songs,
        },
    };
}
