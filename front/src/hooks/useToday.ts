import { useEffect, useState } from "react";

import { api, type Today } from "../lib/api";

export function useToday() {
    const [today, setToday] = useState<Today | undefined>(undefined);
    const [fetched, setFetched] = useState(false);

    useEffect(() => {
        if (!fetched) {
            setFetched(true);
            api.today().then((a) => {
                setToday(a);
            });
        }
    });

    return today;
}
