export type RandomizerValue = RandomizerOptions | RandomizerRange;

export type RandomizerOptions = {
    type: "list";
    options: string[];
};

export type RandomizerRange = {
    type: "range";
    decimals: boolean;
    min: number;
    max: number;
};

export type OsadleGameConfig = {
    name: string;
    randomizer: Record<string, RandomizerValue>;
    data: Record<string, unknown>;
};
