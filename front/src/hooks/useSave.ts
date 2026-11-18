import { useEffect, useState } from "react";

import { api } from "../lib/api";

export type Save = {
	lastDay: number;
	streak: number;
	games: Map<string, GenericGame>;
};

export type GenericGame = {
	guesses: [];
	startTime?: number;
};

function get(): Save {
	const raw = JSON.parse(localStorage.getItem("osadle") ?? "{}");
	return {
		lastDay: raw.lastDay ?? 0,
		streak: raw.streak ?? 0,
		games: new Map(Object.entries(raw.games)),
	};
}

export function useSave(day?: number) {
	const [save, _] = useState<Save>(get());

	if (day && save.lastDay !== day) {
		save.lastDay = day;
		save.games.forEach((v) => {
			v.guesses = [];
			v.startTime = undefined;
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
