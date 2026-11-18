import { type Song, sql } from "./sql.ts";
import { env } from "cloudflare:workers";

export async function getSongFor(): Promise<Song | null> {
    const bucket = await getPossibilitiesFor();
    console.log(bucket.length);
    if (bucket.length === 0) {
        return null;
    }

    const choice = bucket[Math.floor(Math.random() * bucket.length)];
    return await sql.songs.get(env.osadle, choice ?? "lagtrain");
}

async function getPossibilitiesFor() {
    const dbBlacklist = (await sql.history.recent(env.osadle)) ?? [];
    const dbSongs = await sql.songs.list(env.osadle);

    const drawings = dbSongs.map((drawing) => {
        return drawing.songId;
    });

    const blacklist = dbBlacklist.map((history) => {
        return history.songId;
    });

    console.log(drawings.length, blacklist.length);

    return drawings.filter((d) => blacklist.find((b) => d === b) === undefined);
}
