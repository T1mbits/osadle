import { useEffect, useState } from "react";

import { api } from "../lib/api";
import type { Song } from "./useToday";

export type Save = {
	lastDay: number;
	streak: number;
	guesses: Song[];
};
export function useSave() {
	const [today, _] = useState<Save>(
		JSON.parse(
			localStorage.getItem("save") ??
				'{"lastDay": 0,"streak": 0,"guesses": []}',
		),
	);

	return today;
}

export function setSave(save: Save) {
	localStorage.setItem("save", JSON.stringify(save));
}
