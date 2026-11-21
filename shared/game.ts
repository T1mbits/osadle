export type RandomizerValue = RandomizerOptions | RandomizerRange;

type RandomizerBase = {
    avoidRepeats?: boolean;
    type: string;
};

export type RandomizerOptions = RandomizerBase & {
    type: "list";
    options: string[];
};

export type RandomizerRange = RandomizerBase & {
    type: "range";
    decimals: boolean;
    min: number;
    max: number;
};

export type OsadleGameConfig = {
    id: string;
    randomizer: Record<string, RandomizerValue>;
    data: Record<string, unknown>;
};
