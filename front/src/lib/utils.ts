import type { CSSProperties } from "react";

export function styleForImage(image?: string): CSSProperties {
    return {
        // i have a feeling theres a better way to do the below but idc
        backgroundImage: `url("${image ?? "/images/guesses/question.png"}"), url("/images/guesses/question.png")`,
    };
}
