import { Song } from "../hooks/useToday";
import { styleForImage } from "../lib/utils";
import "./results.css";

export function Results({
    answer,
    title,
    guessAmount,
    longest,
    correct,
    custom,
}: {
    answer?: Song;
    title: string;
    guessAmount: number;
    longest: number;
    correct: boolean;
    custom?: () => void;
}) {
    return (
        <div className="darken">
            <div className="results">
                <span className="thumb" style={styleForImage(answer?.image)} />
                <p>answer: {answer?.name ?? "well idk"}</p>
                <h1>{title}</h1>
                <p>
                    {correct
                        ? `guessed in ${guessAmount} tries, using ${longest}sec of the song!`
                        : `failed guessing up to ${longest}sec. holy larps`}
                </p>
                <button
                    type="button"
                    onClick={() => {
                        window.location.hash = "#";
                    }}
                >
                    back
                </button>
                {custom ? (
                    <button
                        type="button"
                        onClick={() => {
                            custom();
                        }}
                    >
                        again
                    </button>
                ) : (
                    <>
                        <button
                            type="button"
                            className="textButton"
                            onClick={() => {
                                navigator.clipboard.writeText(
                                    `**${title}**: ${"⬛".repeat(guessAmount - 1)}${correct ? "🩶" : "💥"} (${correct ? guessAmount : "X"}/5) \n> https://osadle.guhw.dev/`,
                                );
                                alert("copied");
                            }}
                        >
                            copy text (for discord)
                        </button>
                        <a href="#song-custom">keep playing?</a>
                    </>
                )}
            </div>
        </div>
    );
}
