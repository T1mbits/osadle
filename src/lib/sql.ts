export const sql = {
	songs: {
		upload: async (
			db: D1Database,
			songId: string,
			commonName: string,
			audioHash: string,
			imageHash: string,
		) => {
			return await db
				.prepare(
					"INSERT INTO songs (songId, commonName, audioHash, imageHash) VALUES (?,?,?,?)",
				)
				.bind(songId, commonName, audioHash, imageHash)
				.run();
		},
		delete: async (db: D1Database, songId: string) => {
			return await db
				.prepare("DELETE FROM songs WHERE songId = ?")
				.bind(songId)
				.run();
		},
		get: async (db: D1Database, songId: string) => {
			return <Song>(
				await db
					.prepare("SELECT * FROM songs WHERE songId = ?")
					.bind(songId)
					.first()
			);
		},
		aliases: async (
			db: D1Database,
			songId: string,
			add?: string,
			remove?: string,
		) => {
			const song: Song | null = await db
				.prepare("SELECT * FROM songs WHERE songId = ?")
				.bind(songId)
				.first();

			if (!song) return;

			const aliases: string[] = JSON.parse(song.aliases);

			if (add) {
				aliases.push(add);
			}

			const updated = JSON.stringify(
				aliases.filter((a) => {
					return a !== remove;
				}),
			);

			return await db
				.prepare("UPDATE songs SET aliases = ? WHERE songId = ?")
				.bind(updated, songId)
				.run();
		},
		list: async (db: D1Database) => {
			return (<D1Result<Song>>await db.prepare("SELECT * FROM songs").run())
				.results;
		},
	},
	history: {
		last: async (db: D1Database) => {
			return <History | null>(
				await db
					.prepare("SELECT * FROM history ORDER BY day DESC LIMIT 1")
					.first()
			);
		},
		recent: async (db: D1Database) => {
			return <History[] | null>(
				(
					await db
						.prepare("SELECT * FROM history ORDER BY day DESC LIMIT 10")
						.run()
				).results
			);
		},
		new: async (db: D1Database, day: number, time: number, songId: string) => {
			return await db
				.prepare("INSERT INTO history (day, time, songId) VALUES (?,?,?)")
				.bind(day, time, songId)
				.run();
		},
	},
};

export type Song = {
	songId: string;
	commonName: string;
	aliases: string;
	audioHash: string;
	imageHash: string;
};

export type History = {
	day: number;
	time: number;
	songId: string;
};
