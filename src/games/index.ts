export type RandomizerValue = RandomizerOptions | RandomizerRange;

export type RandomizerOptions = {
    type: "list";
    options: string[];
    avoidRepeats?: boolean;
};

export type RandomizerRange = {
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
