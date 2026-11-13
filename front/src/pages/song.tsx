import type { CSSProperties } from "react";
import "./song.css";

function GuessEntry({ songId }: { songId: string }) {
    const style: CSSProperties = {
        backgroundImage: `url("/test/${songId}.png"), url("/images/guesses/question.png")`,
    };

    return (
        <span className="guess">
            <span style={style} className="thumb"></span>
            <div className="vert">
                <span className="text name">{songId}</span>
                <span className="text album">Album: one of them</span>
            </div>
        </span>
    );
}

export default function GuessSong() {
    return (
        <>
            <h1>osadle song #6767</h1>
            <div className="box">
                <button type="button">Preview</button>
                <br />
                <div className="guesses">
                    <GuessEntry songId="watashiwaame" />
                    <GuessEntry songId="hi lol" />
                    <GuessEntry songId="hi lol" />
                    <GuessEntry songId="hi lol" />
                    <GuessEntry songId="hi lol" />
                </div>
                <br />
                <p>1 second.</p>
                <div className="inputBox">
                    <div className="bottom"></div>
                    <input></input>
                    <button type="button">submit</button>
                </div>
            </div>
        </>
    );
}
