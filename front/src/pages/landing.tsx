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
            {/* <a href="#how">how to play?</a>*/}
        </>
    );
}
