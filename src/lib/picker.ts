import { sql } from "./sql.ts";
import { env } from "cloudflare:workers";

export async function getNextValidSeed(): Promise<number | null> {
    const history = (await sql.history.recent(env.osadle)) ?? [];
}
