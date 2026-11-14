import { useEffect, useState } from "react";
import findAudio from "../lib/audio";
import "./song.css";
import { type Song, useToday } from "../hooks/useToday";
import { setSave, useSave } from "../hooks/useSave";
import { styleForImage } from "../lib/utils";
import { SuggestionBox } from "../components/suggestionBox";
import { Results } from "../components/results";

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

const GUESS_INTERVALS = [0.5, 1, 2, 5, 7];

// holy custom
export default function GuessSong({ custom = false }: { custom?: boolean }) {
    const today = useToday();
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

    const submit = () => {
        if (!(first && today)) return;
        setTyped("");
        setGuesses([...guesses, first]);

        if (!custom) {
            state.guesses = guesses;
            state.lastDay = today.day;
            setSave(state);
        }

        if (btoa(first.id) === today.answer) {
            if (!custom) {
                state.streak += 1;
            }
            return alert("you win btw");
        }
        if (guesses.length >= GUESS_INTERVALS.length - 1) {
            if (!custom) {
                state.streak = 0;
            }
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
            <h1>
                osadle song #{custom ? "custom" : today ? today.day : "???"}
            </h1>
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
                    {GUESS_INTERVALS.map((v, i) => {
                        return <GuessEntry key={v} song={guesses[i]} />;
                    })}
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
                        disabled={
                            btoa(state.guesses.reverse()[0]?.id) ===
                            today?.answer
                        }
                    />
                    <button
                        type="button"
                        onClick={submit}
                        disabled={
                            btoa(state.guesses.reverse()[0]?.id) ===
                            today?.answer
                        }
                    >
                        submit
                    </button>
                </div>
            </div>
            {btoa(state.guesses.reverse()[0]?.id) === today?.answer ? (
                <Results
                    title={
                        custom ? "custom osadle" : `osadle song #${today.day}`
                    }
                    longest={seconds}
                    guessAmount={guesses.length}
                />
            ) : null}
        </>
    );
}
