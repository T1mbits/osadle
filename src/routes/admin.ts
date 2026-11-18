import type { IRequest, RouterType } from "itty-router";

import { notFound, response, yourFault } from "../lib/responses.ts";
import { upload } from "../lib/s3.ts";
import { sql } from "../lib/sql.ts";
import { getCookie, withJson } from "../lib/utils.ts";
import { env } from "cloudflare:workers";

export const withAdmin = async (request: IRequest) => {
    try {
        const cookie = getCookie("secret", request.headers.get("cookie"));
        if (cookie !== env.ADMIN_SECRET)
            return yourFault(
                "you're not supposed to know this endpoint btw !!!",
            );
    } catch (_err) {
        return notFound("no");
    }
};

export function adminRoutes(app: RouterType) {
    app.get("/admin/", withAdmin, async (request) => {
        return env.public.fetch(request);
    });

    app.get("/api/admin/songs/list", withAdmin, async (_request) => {
        return response(await sql.songs.list(env.osadle));
    });

    app.post("/api/admin/songs/upload", withAdmin, async (request) => {
        const form = await request.formData();

        const image = <File>form.get("thumb");
        const audio = <File>form.get("audio");
        const id = <string>form.get("id");
        const name = <string>form.get("name");
        console.log(id, name, image, audio);

        if (!(id && name && audio && image)) {
            return yourFault("no");
        }

        const imageHash = await upload("thumbnails", image, "image/png");
        const audioHash = await upload("music", audio, "audio/mpeg");

        await sql.songs.upload(env.osadle, id, name, audioHash, imageHash);

        return response("ok");
    });

    app.post(
        "/api/admin/songs/delete",
        withAdmin,
        withJson,
        async (request) => {
            const data = request.content;

            await sql.songs.delete(env.osadle, data.id);

            return response("ok");
        },
    );

    app.post(
        "/api/admin/songs/aliases",
        withAdmin,
        withJson,
        async (request) => {
            const data = request.content;

            await sql.songs.aliases(env.osadle, data.id, data.add, data.remove);

            return response("ok");
        },
    );
}
