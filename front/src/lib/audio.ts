const THRESHOLD = 0.01;

export default async function findAudio(
    audioUrl: string,
    startPercent: number,
) {
    // purpose of this function is to find a portion after startPercent% of the song that is not silent
    const context = new AudioContext();

    try {
        const response = await fetch(audioUrl);
        const buffer = await context.decodeAudioData(
            await response.arrayBuffer(),
        );

        const sampleRate = buffer.sampleRate;
        const chunkSize = Math.floor(sampleRate * 0.05);
        const channels = Array.from(
            { length: buffer.numberOfChannels },
            (_, i) => buffer.getChannelData(i),
        );

        const length = buffer.length;
        const startOffset = Math.floor(length * (startPercent / 100));

        for (let offset = startOffset; offset < length; offset += chunkSize) {
            const end = Math.min(offset + chunkSize, length);
            let sum = 0;
            let count = 0;

            for (const channel of channels) {
                for (let i = offset; i < end; i++) {
                    sum += channel[i] ** 2;
                    count++;
                }
            }

            const rms = Math.sqrt(sum / count);

            if (rms > THRESHOLD) {
                return { buffer, start: offset / sampleRate };
            }
        }

        for (let offset = 0; offset < startOffset; offset += chunkSize) {
            const end = Math.min(offset + chunkSize, startOffset);
            let sum = 0;
            let count = 0;

            for (const channel of channels) {
                for (let i = offset; i < end; i++) {
                    sum += channel[i] ** 2;
                    count++;
                }
            }

            const rms = Math.sqrt(sum / count);

            if (rms > THRESHOLD) {
                return { buffer, start: offset / sampleRate };
            }
        }

        return null;
    } finally {
        if (context.state !== "closed") {
            await context.close();
        }
    }
}
