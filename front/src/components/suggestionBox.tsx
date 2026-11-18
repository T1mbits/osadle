import type { Dispatch, SetStateAction } from "react";
import "./suggestionBox.css";

import type { Song } from "../hooks/useToday";
import { styleForImage } from "../lib/utils";

function Suggestion({ song, usedAlias }: { song: Song; usedAlias: string }) {
	return (
		<span className="suggestion">
			<span style={styleForImage(song?.image)} className="suggestionThumb" />
			<span className="name">{song.name}</span>
			<span className="usedAlias">{usedAlias}</span>
		</span>
	);
}

export function SuggestionBox({
	songs,
	current,
	setTopSuggestion,
}: {
	songs: Song[];
	current: string;
	setTopSuggestion: Dispatch<SetStateAction<Song | undefined>>;
}) {
	const query = current.toLowerCase();
	if (query.length < 1) {
		setTopSuggestion(undefined);
		return;
	}
	const inc = songs;

	const score = (x: string) => {
		let n = 0;
		if (x.toLowerCase().includes(query)) {
			n += 1;
		}
		if (x.toLowerCase().startsWith(query)) {
			n += 10;
		}
		return n;
	};

	const scoreSong = (x: Song) => {
		let n = score(x.name) * 100;
		const lengthDiff = Math.abs(x.name.length - query.length);

		x.aliases.forEach((alias) => {
			n += score(alias);
		});

		return n - lengthDiff;
	};

	inc.sort((a, b) => {
		return scoreSong(b) - scoreSong(a);
	});
	const showing = inc.filter((a) => {
		return scoreSong(a) > 0;
	});
	setTopSuggestion(showing[0]);

	return (
		<div className="suggestions">
			{showing.slice(0, 5).map((s) => {
				return (
					<Suggestion
						song={s}
						usedAlias={
							s.aliases.find((a) => {
								return a.toLowerCase().includes(query);
							}) ?? s.name
						}
						key={s.id}
					/>
				);
			})}
		</div>
	);
}
