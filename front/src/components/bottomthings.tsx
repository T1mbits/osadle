import useDark, { setDark } from "../hooks/theme";

export default function BottomThings() {
    const dark = useDark();
    return (
        <>
            <span id="watermark">
                <a href="https://guhw.dev/">made by windy</a> (the worse one)
            </span>
            <button
                type="button"
                onClick={() => {
                    setDark(!dark);
                }}
                id="toggle-dark"
                className="textButton"
            >
                toggle dark mode
            </button>
        </>
    );
}
