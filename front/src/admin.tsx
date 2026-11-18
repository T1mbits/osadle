import type { JSX } from "react/jsx-runtime";
import "./admin.css";
import { useState } from "react";

import { api } from "./lib/api";

function Part({
    name,
    children,
    processing = false,
}: {
    name: string;
    children: JSX.Element | JSX.Element[];
    processing?: boolean;
}) {
    return (
        <div className={processing ? "part processing" : "part"}>
            <h2>{name}</h2>
            <div className="fields">{children}</div>
        </div>
    );
}

function Upload() {
    const [id, setId] = useState("windy_is_a_bum");
    const [name, setName] = useState("windy is a bum");
    const [thumbnail, setThumbnail] = useState<File | undefined>(undefined);
    const [audio, setAudio] = useState<File | undefined>(undefined);

    const [processing, setProcessing] = useState(false);

    return (
        <Part name="upload" processing={processing}>
            <span>id</span>
            <input onChange={(ev) => setId(ev.target.value)} />
            <span>name</span>
            <input onChange={(ev) => setName(ev.target.value)} />
            <span>thumbnail</span>
            <input
                type="file"
                accept="image/*"
                onChange={(ev) => setThumbnail(ev.target.files?.[0])}
            />
            <span>audio</span>
            <input
                type="file"
                accept="audio/*"
                onChange={(ev) => setAudio(ev.target.files?.[0])}
            />
            <button
                type="submit"
                onClick={async () => {
                    if (!(id && name && thumbnail && audio)) return alert("no");
                    setProcessing(true);
                    await api.songs.upload(id, name, thumbnail, audio);
                    setProcessing(false);
                }}
            >
                upload
            </button>
        </Part>
    );
}

function Delete() {
    const [processing, setProcessing] = useState(false);
    const [id, setId] = useState("windy_is_a_bum");

    return (
        <Part name="delete" processing={processing}>
            <span>id</span>
            <input onChange={(ev) => setId(ev.target.value)} />
            <button
                type="button"
                onClick={async () => {
                    setProcessing(true);
                    await api.songs.delete(id);
                    setProcessing(false);
                }}
            >
                goodbye
            </button>
        </Part>
    );
}

function Songs() {
    const [processing, setProcessing] = useState(false);
    return (
        <Part name="songs" processing={processing}>
            <button
                type="button"
                onClick={async () => {
                    setProcessing(true);
                    console.log((await api.songs.list()).content);
                    setProcessing(false);
                }}
            >
                console.log
            </button>
        </Part>
    );
}

function UpdateAliases() {
    const [processing, setProcessing] = useState(false);
    const [id, setId] = useState("windy_is_a_bum");
    const [adding, setAdding] = useState("");
    const [removing, setRemoving] = useState("");

    return (
        <Part name="update aliases" processing={processing}>
            <span>id</span>
            <input onChange={(ev) => setId(ev.target.value)} />

            <span>add</span>
            <input onChange={(ev) => setAdding(ev.target.value)} />

            <span>remove</span>
            <input onChange={(ev) => setRemoving(ev.target.value)} />
            <button
                type="button"
                onClick={async () => {
                    setProcessing(true);
                    await api.songs.aliases(id, adding, removing);
                    setProcessing(false);
                }}
            >
                done
            </button>
        </Part>
    );
}

export default function Admin() {
    return (
        <>
            <h1>amazing osadle admin frontend</h1>
            <Upload />
            <Delete />
            <Songs />
            <UpdateAliases />
        </>
    );
}
