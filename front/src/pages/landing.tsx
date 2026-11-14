export default function Landing() {
    return (
        <>
            <div className="box">
                <h1>osadle</h1>
                <p>Guess daily inabakumori things!</p>
                <br />
                <button
                    onClick={() => {
                        window.location.hash = "song";
                    }}
                    type="button"
                >
                    Guess Daily Song
                </button>
            </div>
            <p>this website is WIP! things might change.</p>
            <a href="https://guhw.dev/discord">suggest things in my discord!</a>
        </>
    );
}
