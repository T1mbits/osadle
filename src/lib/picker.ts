import type { RandomizerValue } from "../../shared/game.ts";
import { fromSeed } from "../../shared/seed.ts";

export function getValidSeed(
    randomizer: Record<string, RandomizerValue>,
    lastSeed?: number,
) {
    let last: Record<string, string | number>;
    if (lastSeed !== undefined) {
        last = fromSeed(lastSeed, randomizer);
    }

    let newSeed = 0;
    let rerolls = 0;
    while (rerolls < 100) {
        let invalidated = false;
        rerolls += 1;

        newSeed = Math.floor(Math.random() * 67676767);
        const next = fromSeed(newSeed, randomizer);

        Object.entries(next).forEach(([key, value]) => {
            if (last?.[key] === value) {
                invalidated = true;
            }
        });

        if (!invalidated) {
            break;
        }
    }

    return newSeed;
}
