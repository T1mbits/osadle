import { useEffect, useState } from "react";

export default function useMobile() {
    const [isMobile, setMobile] = useState(
        navigator.maxTouchPoints > 0 && matchMedia("(pointer: coarse)").matches,
    );

    useEffect(() => {
        const onKeyDown = () => setMobile(false);

        addEventListener("keydown", onKeyDown);

        return () => {
            removeEventListener("keydown", onKeyDown);
        };
    }, []);

    return isMobile;
}
