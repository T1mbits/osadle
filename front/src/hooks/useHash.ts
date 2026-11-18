import { useEffect, useState } from "react";

export default function useHash() {
    const [hash, setHash] = useState("");

    useEffect(() => {
        setHash(window.location.hash);
        const update = () => setHash(window.location.hash);

        window.addEventListener("hashchange", update);
        window.addEventListener("popstate", update);
        window.addEventListener("locationchange", update);

        return () => {
            window.removeEventListener("hashchange", update);
            window.removeEventListener("popstate", update);
            window.removeEventListener("locationchange", update);
        };
    });

    return hash;
}
