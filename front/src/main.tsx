import BottomThings from "./components/bottomthings";
import Landing from "./pages/landing";
import "./global.css";
import { useEffect, useState } from "react";

import useDark from "./hooks/theme";
import useHash from "./hooks/useHash";
import ErrorPage from "./pages/error";
import GuessSong, { Custom } from "./pages/song";
import { useToday } from "./hooks/useToday";

export default function Main() {
    const dark = useDark();
    const hash = useHash();
    const today = useToday();
    const [custom, setCustom] = useState<Custom | undefined>();
    const [isMobile, setMobile] = useState(
        document.body.clientWidth < document.body.clientHeight,
    );

    useEffect(() => {
        document.body.id = dark ? "dark" : "light";
        if (today) {
            setCustom({
                start: Math.floor(Math.random() * 90),
                answer: today.thumbnails[
                    Math.floor(Math.random() * today.thumbnails.length)
                ],
            });
        }
    }, [dark, today]);

    useEffect(() => {
        window.addEventListener("resize", () => {
            setMobile(document.body.clientWidth < document.body.clientHeight);
        });
    }, []);
    document.body.classList.toggle("mobileUi", isMobile);

    const map = [
        { hashes: ["", "#home"], element: <Landing /> },
        {
            hashes: ["#song"],
            element: (
                <>
                    {today ? (
                        <GuessSong
                            day={today.day.toString()}
                            answerId={today.answer}
                            audioUrl={today.audio}
                            startPercent={today.start}
                            options={today.thumbnails}
                        />
                    ) : (
                        <h1>loading</h1>
                    )}
                </>
            ),
        },
        {
            hashes: ["#song-custom", "#song-custom-redo"],
            element: (
                <>
                    {today && custom ? (
                        <GuessSong
                            day={"custom"}
                            answerId={btoa(custom?.answer.id)}
                            audioUrl={custom.answer.audio ?? ""}
                            startPercent={custom.start}
                            options={today.thumbnails}
                            custom={setCustom}
                            key={hash}
                        />
                    ) : (
                        <h1>loading</h1>
                    )}
                </>
            ),
        },
    ];

    return (
        <>
            {map.find((a) => a.hashes.includes(hash))?.element ?? <ErrorPage />}
        </>
    );
}
