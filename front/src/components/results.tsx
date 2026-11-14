import "./results.css";

export function Results({
    title,
    guessAmount,
    longest,
}: {
    title: string;
    guessAmount: number;
    longest: number;
}) {
    return (
        <div className="darken">
            <div className="results">
                <h1>{title}</h1>
                <p>
                    guessed in {guessAmount} tries, using {longest} of the song!
                </p>
                <button
                    type="button"
                    onClick={() => {
                        window.location.hash = "#";
                    }}
                >
                    back
                </button>
                <a href="#song-custom">keep playing?</a>
            </div>
        </div>
    );
}
