import type { Dispatch, SetStateAction } from "react";
import "./suggestionBox.css";

import { styleForImage } from "../lib/utils";

type GenericOsadleValue = {
    id: string;
    name: string;
    aliases: string[];
    image?: string;
};

function Suggestion({
    choice,
    usedAlias,
}: {
    choice: GenericOsadleValue;
    usedAlias: string;
}) {
    return (
        <span className="suggestion">
            <span
                style={styleForImage(choice?.image)}
                className="suggestionThumb"
            />
            <span className="name">{choice.name}</span>
            <span className="usedAlias">{usedAlias}</span>
        </span>
    );
}

export function SuggestionBox<T extends GenericOsadleValue>({
    choices,
    current,
    setTopSuggestion,
}: {
    choices: T[];
    current: string;
    setTopSuggestion: Dispatch<SetStateAction<T | undefined>>;
}) {
    const query = current.toLowerCase();
    if (query.length < 1) {
        setTopSuggestion(undefined);
        return;
    }
    const inc = choices;

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

    const scoreSong = (x: T) => {
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
                        choice={s}
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
