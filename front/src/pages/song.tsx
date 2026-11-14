import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import findAudio from "../lib/audio";
import "./song.css";
import { type Song, useToday } from "../hooks/useToday";
import { setSave, useSave } from "../hooks/useSave";
import { styleForImage } from "../lib/utils";
import { SuggestionBox } from "../components/suggestionBox";
import { Results } from "../components/results";
import useHash from "../hooks/useHash";

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

export type Custom = {
    answer: Song;
    start: number;
};

const GUESS_INTERVALS = [0.5, 1, 2, 5, 7];

// holy custom
export default function GuessSong({
    day,
    audioUrl,
    startPercent,
    options,
    answerId,
    custom,
}: {
    day: string;
    audioUrl: string;
    startPercent: number;
    options: Song[];
    answerId: string;
    custom?: Dispatch<SetStateAction<Custom | undefined>>;
}) {
    const state = useSave();

    const [start, setStart] = useState<number | undefined>();
    const [seconds, setSeconds] = useState<number>(GUESS_INTERVALS[0]);
    const [volume, setVolume] = useState<number>(0.25);
    const [buffer, setBuffer] = useState<AudioBuffer | undefined>();
    const [typed, setTyped] = useState("");
    const [first, setFirst] = useState<Song | undefined>();
    const [context, _] = useState(new AudioContext());
    const [guesses, setGuesses] = useState<Song[]>(
        custom ? [] : (state.guesses ?? []),
    );
    const inp = useRef<HTMLInputElement>(null);

    const correct = guesses[guesses.length - 1]
        ? btoa(guesses[guesses.length - 1].id) === answerId
        : false;
    const finished = guesses.length >= GUESS_INTERVALS.length || correct;

    const submit = () => {
        if (!first) return;
        setTyped("");
        setGuesses([...guesses, first]);

        if (!custom) {
            state.guesses = guesses;
            state.lastDay = Number(day);
            setSave(state);
        }

        if (correct) {
            if (!custom) {
                state.streak += 1;
                state.streak = Math.min(state.streak, state.lastDay);
            }
            return;
        }
        if (finished) {
            if (!custom) {
                state.streak = 0;
            }
        } else {
            setSeconds(
                GUESS_INTERVALS[
                    Math.min(GUESS_INTERVALS.length - 1, guesses.length + 1)
                ],
            );
        }
    };

    useEffect(() => {
        findAudio(audioUrl, startPercent).then((d) => {
            if (!d) return alert("error");
            setStart(d.start);

            setBuffer(d.buffer);
        });
    }, [audioUrl, startPercent]);

    return (
        <>
            <h1>osadle song #{custom ? "custom" : day}</h1>
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
                        if (!(start && buffer)) return alert("not loaded");

                        const source = context.createBufferSource();
                        source.buffer = buffer;

                        const gain = context.createGain();
                        gain.gain.value = 0.5 * volume;
                        source.connect(gain);
                        gain.connect(context.destination);

                        source.start(0, start);
                        source.stop(context.currentTime + seconds);
                        inp.current?.focus();
                    }}
                >
                    {buffer
                        ? `Play ${seconds} Second${seconds === 1 ? "" : "s"}`
                        : "Loading..."}
                </button>
                <br />
                <div className="guesses">
                    {GUESS_INTERVALS.map((v, i) => {
                        // biome-ignore lint/suspicious/noArrayIndexKey: i dont care
                        return <GuessEntry key={i} song={guesses[i]} />;
                    })}
                </div>
                <br />
                <p>Seconds: {seconds}</p>
                <div className="inputBox">
                    <SuggestionBox
                        songs={options}
                        current={typed}
                        setTopSuggestion={setFirst}
                    />
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
                        disabled={finished}
                        ref={inp}
                    />
                    <button type="button" onClick={submit} disabled={finished}>
                        submit
                    </button>
                </div>
            </div>
            {finished ? (
                <Results
                    title={
                        custom ? "custom osadle song" : `osadle song #${day}`
                    }
                    longest={seconds}
                    guessAmount={guesses.length}
                    answer={options.find((a) => {
                        return a.id === atob(answerId);
                    })}
                    correct={correct}
                    custom={
                        custom
                            ? () => {
                                  window.location.reload();
                              }
                            : undefined
                    }
                />
            ) : null}
        </>
    );
}
