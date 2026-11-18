import Landing from "./pages/landing";
import "./global.css";
import { useEffect, useState } from "react";

import useHash from "./hooks/useHash";
import { useToday } from "./hooks/useToday";
import ErrorPage from "./pages/error";
import GuessSong from "./pages/song";
import Credits from "./pages/credits";

export default function Main() {
    const hash = useHash();
    const today = useToday();
    const [isMobile, setMobile] = useState(
        document.body.clientWidth < document.body.clientHeight,
    );

    useEffect(() => {
        window.addEventListener("resize", () => {
            setMobile(document.body.clientWidth < document.body.clientHeight);
        });
    }, []);
    document.getElementById("root")?.classList.toggle("mobileUi", isMobile);

    const map = [
        { name: "home", hashes: ["", "#home"], element: <Landing /> },
        { name: "credits", hashes: ["#credits"], element: <Credits /> },
        {
            name: "song",
            hashes: ["#song"],
            element: (
                <>
                    {today ? (
                        <GuessSong key={hash} today={today} />
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

    document.body.id = shown.name;

    return <>{shown.element}</>;
}
