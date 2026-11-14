import type { Dispatch, SetStateAction } from "react";
import "./suggestionBox.css";

import type { Song } from "../hooks/useToday";
import { styleForImage } from "../lib/utils";

function Suggestion({ song, usedAlias }: { song: Song; usedAlias: string }) {
    return (
        <span className="suggestion">
            <span
                style={styleForImage(song?.image)}
                className="suggestionThumb"
            />
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
    if (current.length < 1) {
        return;
    }
    const inc = songs;

    const score = (x: string) => {
        let n = 0;
        if (x.toLowerCase().includes(current)) {
            n += 1;
        }
        if (x.toLowerCase().startsWith(current)) {
            n += 10;
        }
        return n;
    };

    const scoreSong = (x: Song) => {
        let n = score(x.name) * 100;

        x.aliases.forEach((alias) => {
            n += score(alias);
        });

        return n;
    };

    inc.sort((a, b) => {
        return scoreSong(b) - scoreSong(a);
    });

    setTopSuggestion(inc[0]);

    return (
        <div className="suggestions">
            {inc
                .filter((a) => {
                    return scoreSong(a) > 0;
                })
                .slice(0, 5)
                .map((s) => {
                    return (
                        <Suggestion
                            song={s}
                            usedAlias={
                                s.aliases.find((a) => {
                                    return a.toLowerCase().includes(current);
                                }) ?? s.name
                            }
                            key={s.id}
                        />
                    );
                })}
        </div>
    );
}
