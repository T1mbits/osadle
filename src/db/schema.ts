import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const songs = sqliteTable("songs", {
    songId: text("songId").primaryKey(),
    commonName: text("commonName").notNull(),
    aliases: text("aliases", { mode: "json" })
        .$type<string[]>()
        .notNull()
        .default([]),

    audioHash: text("audioHash").notNull(),
    imageHash: text("imageHash").notNull(),
});

export const history = sqliteTable("history", {
    day: integer("day").primaryKey(),
    time: integer("time").notNull().unique(),
    songId: text("songId").notNull(),
    startPercent: integer("startPercent").notNull(),
});

export const users = sqliteTable("users", {
    id: text("id").primaryKey(),
    username: text("username").notNull(),
    displayName: text("displayName").notNull(),

    avatarHash: text("avatarHash").notNull(),

    streak: integer("streak").notNull().default(0),
    isAdmin: integer("isAdmin", { mode: "boolean" }).notNull().default(false),
    wasInServerLastCheck: integer("wasInServerLastCheck", {
        mode: "boolean",
    })
        .notNull()
        .default(false),

    lastPlaySession: text("lastPlaySession", { mode: "json" })
        .$type<Record<string, unknown>>()
        .notNull()
        .default({}),
});

export const sessions = sqliteTable("sessions", {
    sessionKey: text("sessionKey").primaryKey(),
    expiresAt: integer("expiresAt").notNull(),

    userId: text("userId").references(() => users.id, {
        onUpdate: "cascade",
        onDelete: "set null",
    }),
});

export const codeCollection = sqliteTable("codeCollection", {
    code: text("code").primaryKey(),
    sessionKey: text("sessionKey").notNull(),
    expiresAt: integer("expiresAt").notNull(),
});

export type Song = typeof songs.$inferSelect;
export type NewSong = typeof songs.$inferInsert;

export type History = typeof history.$inferSelect;
export type NewHistory = typeof history.$inferInsert;

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Session = typeof sessions.$inferSelect;
export type NewSession = typeof sessions.$inferInsert;

export type CodeCollection = typeof codeCollection.$inferSelect;
export type NewCodeCollection = typeof codeCollection.$inferInsert;
