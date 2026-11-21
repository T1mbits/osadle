import SongGame from "./song.ts";

export default async function getGames() {
    return [await SongGame()];
}
