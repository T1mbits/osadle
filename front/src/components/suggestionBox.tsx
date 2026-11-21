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
    const query = current.toLowerCase();
    if (query.length < 1) {
        setTopSuggestion(undefined);
        return;
    }
    const inc = songs;

    const score = (x: string) => {
        let n = 0;
        if (x.toLowerCase().includes(query)) {
            n += 10;
        }
        if (x.toLowerCase().startsWith(query)) {
            n += 100;
        }
        return n + (x.length - Math.abs(x.length - query.length));
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
    const ref = scoreSong(inc[0]);

    const showing = inc.filter((a) => {
        const s = scoreSong(a);
        return s > ref * 0.5;
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
