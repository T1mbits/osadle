import type { Song } from "../db/schema.ts";
import { InitDb } from "../db/sql.ts";
import { env } from "cloudflare:workers";

export async function getSongFor(): Promise<Song | undefined> {
    const bucket = await getPossibilitiesFor();
    console.log(bucket.length);
    if (bucket.length === 0) {
        return;
    }

    const choice = bucket[Math.floor(Math.random() * bucket.length)];
    return await InitDb(env.osadle).songs.get(choice ?? "lagtrain");
}

async function getPossibilitiesFor() {
    const sql = InitDb(env.osadle);
    const dbBlacklist = (await sql.history.recent()) ?? [];
    const dbSongs = await sql.songs.list();

    const drawings = dbSongs.map((drawing) => {
        return drawing.songId;
    });

    const blacklist = dbBlacklist.map((history) => {
        return history.songId;
    });

    console.log(drawings.length, blacklist.length);

    return drawings.filter((d) => blacklist.find((b) => d === b) === undefined);
}
