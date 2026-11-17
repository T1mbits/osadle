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
        window.addEventListener("resize", () => {
            setMobile(document.body.clientWidth < document.body.clientHeight);
        });
    }, []);
    document.body.classList.toggle("mobileUi", isMobile);

    const map = [
        { name: "home", hashes: ["", "#home"], element: <Landing /> },
        {
            name: "song",
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
            name: "song-custom",
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
    const page = map.find((a) => a.hashes.includes(hash));
    const shown = page ?? {
        name: "error",
        hashes: [],
        element: <ErrorPage />,
    };
    console.log(hash, shown.name, shown.hashes);

    document.body.id = shown.name;

    return <>{shown.element}</>;
}
