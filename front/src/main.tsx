import BottomThings from "./components/bottomthings";
import Landing from "./pages/landing";
import "./global.css";
import { useEffect } from "react";

import useDark from "./hooks/theme";
import useHash from "./hooks/useHash";
import ErrorPage from "./pages/error";
import GuessSong from "./pages/song";

export default function Main() {
    const dark = useDark();
    const hash = useHash();

    useEffect(() => {
        document.body.id = dark ? "dark" : "light";
    }, [dark]);

    const map = [
        { hashes: ["", "#home"], element: <Landing /> },
        { hashes: ["#song"], element: <GuessSong /> },
    ];
    console.log(map, hash);

    return (
        <>
            {map.find((a) => a.hashes.includes(hash))?.element ?? <ErrorPage />}
            <BottomThings />
        </>
    );
}
