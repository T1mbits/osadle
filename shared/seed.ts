import { randomSeed } from "../src/lib/utils.ts";
import type { RandomizerValue } from "./game.ts";

export function fromSeed(
    seed: number,
    randomizer: Record<string, RandomizerValue>,
) {
    const chosen: Record<string, string | number> = {};
    const gen = randomSeed(seed);

    Object.entries(randomizer).forEach(([id, value]) => {
        switch (value.type) {
            case "list": {
                chosen[id] =
                    value.options[Math.floor(gen() * value.options.length)] ??
                    value.options[0] ??
                    "ERROR";
                break;
            }
            case "range": {
                let n = gen() * (value.max - value.min) + value.min;
                if (!value.decimals) n = Math.floor(n);

                chosen[id] = n;

                break;
            }
        }
    });

    return chosen;
}
