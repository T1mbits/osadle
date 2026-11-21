import { History } from "../../../shared/archive";
import { useArchive } from "../hooks/useArchive";
import { GenericArchive, useArchiveSave } from "../hooks/useSave";
import { attemptEmojis } from "../lib/utils";

import "./archive.css";

function ArchiveCard(
    { day, seeds, time }: History,
    archiveSave: GenericArchive | undefined,
) {
    return (
        <div className="archive-card">
            {Array.from(Object.entries(seeds)).map(([game, seed]) => (
                <div className="game-info">
                    <span
                        className="title"
                        onClick={() => console.log(game, seed)}
                    >
                        Daily {game} #{day}
                    </span>
                    <span className="attempts">
                        {archiveSave
                            ? attemptEmojis(
                                  archiveSave.guessCount,
                                  archiveSave.succeeded,
                              )
                            : "Unattempted"}
                    </span>
                </div>
            ))}
            <span className="date">{new Date(time).toDateString()}</span>
        </div>
    );
}

export default function Archive() {
    const archive = useArchive();
    const archiveSongSave = useArchiveSave("song");

    return (
        <>
            {archive?.archive.map((history) =>
                ArchiveCard(history, archiveSongSave.get(history.day)),
            )}
        </>
    );
}
