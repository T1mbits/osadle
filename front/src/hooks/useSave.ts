import { useState } from "react";

export type Save = {
    lastDay: number;
    games: Map<string, GenericGame>;
};

export type GenericGame = {
    guesses: [];
    streak?: number;
    startTime?: number;
};

function get(): Save {
    const raw = JSON.parse(localStorage.getItem("osadle") ?? "{}");
    return {
        lastDay: raw.lastDay ?? 0,
        games: new Map(Object.entries(raw.games ?? {})),
    };
}

export function useSave(day?: number) {
    const [save, _] = useState<Save>(get());

    if (day && save.lastDay !== day) {
        save.lastDay = day;
        save.games.forEach((v, idx) => {
            v.guesses = [];
            v.startTime = undefined;

            save.games.set(idx, v); // i don't think you need to do this but just in case
        });
    }

    setSave(save);
    return save;
}

export function useGame(game: string, day?: number) {
    const save = useSave(day);

    save.games.set(
        game,
        save.games.get(game) ?? {
            guesses: [],
            streak: 0,
            startTime: undefined,
        },
    );

    setSave(save);
    return save.games.get(game);
}

export function setSave(save: Save) {
    localStorage.setItem(
        "osadle",
        JSON.stringify({
            ...save,
            games: Object.fromEntries(save.games),
        }),
    );
}

export function modifySave(name: string, game: GenericGame) {
    const save = get();

    save.games.set(name, game);
    console.log(save);

    setSave(save);
}
