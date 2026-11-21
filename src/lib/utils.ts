import type { IRequest } from "itty-router";

import { yourFault } from "./responses.ts";

export function getCookie(key: string, cookieString?: string | null) {
    const cookies = cookieString?.split(";").map((a) => a.trim().split("="));
    const f = cookies?.find((a) => a[0] === key);

    if (!f) return;
    return f.length === 2 ? f[1] : undefined;
}

export async function toHash(buffer: ArrayBuffer) {
    return Array.from(
        new Uint8Array(await crypto.subtle.digest("SHA-256", buffer)),
    )
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
}

export const withJson = async (request: IRequest) => {
    try {
        request.content = await request.json();
        if (!request.content) return yourFault("json");
    } catch (_err) {
        return yourFault("json");
    }
};

export function randomSeed(seed: number) {
    let t = seed;
    return () => {
        // is it called mulberry cos of the color or what
        // that's pretty cool
        t = (t + 0x6d2b79f5) | 0;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}
