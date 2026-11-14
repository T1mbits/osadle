import {
    type CSSProperties,
    type Dispatch,
    type SetStateAction,
    useEffect,
    useState,
} from "react";
import "./song.css";
import { type Song, useToday } from "../hooks/useToday";
import findAudio from "../lib/audio";

function styleForImage(image?: string): CSSProperties {
    return {
        // i have a feeling theres a better way to do the below but idc
        backgroundImage: `url("${image ?? "/images/guesses/question.png"}"), url("/images/guesses/question.png")`,
    };
}

function GuessEntry({ song }: { song?: Song }) {
    return (
        <span className="guess">
            <span style={styleForImage(song?.image)} className="thumb" />
            {song ? (
                <div className="vert">
                    <span className="text name">{song.name}</span>
                </div>
            ) : undefined}
        </span>
    );
}

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

function SuggestionBox({
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

const GUESS_INTERVALS = [0.5, 1, 2, 5, 7];

export default function GuessSong() {
    const today = useToday();
    const [start, setStart] = useState<number | undefined>();
    const [seconds, setSeconds] = useState<number>(GUESS_INTERVALS[0]);
    const [volume, setVolume] = useState<number>(0.25);
    const [buffer, setBuffer] = useState<AudioBuffer | undefined>();
    const [typed, setTyped] = useState("");
    const [first, setFirst] = useState<Song | undefined>();
    const [context, _] = useState(new AudioContext());
    const [guesses, setGuesses] = useState<Song[]>([]);

    const submit = () => {
        if (!(first && today)) return;
        setTyped("");
        setGuesses([...guesses, first]);

        if (btoa(first.id) === today.answer) {
            return alert("you win btw");
        }
        if (guesses.length >= GUESS_INTERVALS.length - 1) {
            return alert("you lost btw");
        }
        setSeconds(GUESS_INTERVALS[guesses.length + 1]);
    };

    useEffect(() => {
        if (!today) return;
        console.log(today.audio);
        findAudio(today.audio, today.start).then((d) => {
            if (!d) return alert("error");
            setStart(d.start);

            setBuffer(d.buffer);
        });
    }, [today]);

    return (
        <>
            <h1>osadle song #6767</h1>
            <div className="box">
                <p>volume</p>
                <input
                    type="range"
                    max={100}
                    min={0}
                    value={volume * 100}
                    onChange={(ev) => {
                        setVolume(ev.target.valueAsNumber / 100);
                    }}
                />
                <button
                    type="button"
                    className={buffer ? "" : "loading"}
                    onClick={async () => {
                        if (!(today && start && buffer))
                            return alert("not loaded");

                        const source = context.createBufferSource();
                        source.buffer = buffer;

                        const gain = context.createGain();
                        gain.gain.value = 0.5 * volume;
                        source.connect(gain);
                        gain.connect(context.destination);

                        source.start(0, start);
                        source.stop(context.currentTime + seconds);
                    }}
                >
                    {buffer
                        ? `Play ${seconds} Second${seconds === 1 ? "" : "s"}`
                        : "Loading..."}
                </button>
                <br />
                <div className="guesses">
                    <GuessEntry song={guesses[0]} />
                    <GuessEntry song={guesses[1]} />
                    <GuessEntry song={guesses[2]} />
                    <GuessEntry song={guesses[3]} />
                    <GuessEntry song={guesses[4]} />
                </div>
                <br />
                <p>Seconds: {seconds}</p>
                <div className="inputBox">
                    {today ? (
                        <SuggestionBox
                            songs={today.thumbnails}
                            current={typed}
                            setTopSuggestion={setFirst}
                        />
                    ) : undefined}
                    <input
                        value={typed}
                        onChange={(ev) => {
                            setTyped(ev.target.value);
                        }}
                        onKeyDown={(ev) => {
                            if (ev.key === "Enter") {
                                submit();
                            }
                        }}
                    />
                    <button type="button" onClick={submit}>
                        submit
                    </button>
                </div>
            </div>
        </>
    );
}
