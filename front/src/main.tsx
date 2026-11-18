import Landing from "./pages/landing";
import "./global.css";
import { useEffect, useState } from "react";

import useHash from "./hooks/useHash";
import ErrorPage from "./pages/error";
import GuessSong from "./pages/song";
import { useToday } from "./hooks/useToday";

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
    console.log(hash, shown.name, shown.hashes);

    document.body.id = shown.name;

    return <>{shown.element}</>;
}
