import { useEffect, useState } from "react";

import { api } from "../lib/api";

export type Song = {
    id: string;
    name: string;
    aliases: string[];
    image: string;
    audio?: string;
};

export type SongGame = {
    answer: string;
    audio: string;
    start: number;
    thumbnails: Song[];
};

export type Today = {
    day: number;
    time: number;
    games: {
        song: SongGame;
    };
};
export function useToday() {
    const [today, setToday] = useState<Today | undefined>(undefined);
    const [fetched, setFetched] = useState(false);

    useEffect(() => {
        if (!fetched) {
            setFetched(true);
            api.today().then((a) => {
                setToday(a);
            });
        }
    });

    return today;
}
