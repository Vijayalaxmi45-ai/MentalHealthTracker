"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.insertActivityCompletionSchema = exports.insertMoodEntrySchema = exports.savedMusic = exports.musicRecommendations = exports.activityCompletions = exports.therapyActivities = exports.moodEntries = exports.users = exports.sessions = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const drizzle_zod_1 = require("drizzle-zod");
const zod_1 = require("zod");
// Session storage table (required for Replit Auth)
exports.sessions = (0, pg_core_1.pgTable)("sessions", {
    sid: (0, pg_core_1.varchar)("sid").primaryKey(),
    sess: (0, pg_core_1.jsonb)("sess").notNull(),
    expire: (0, pg_core_1.timestamp)("expire").notNull(),
}, (table) => [(0, pg_core_1.index)("IDX_session_expire").on(table.expire)]);
// User storage table (required for Replit Auth)
exports.users = (0, pg_core_1.pgTable)("users", {
    id: (0, pg_core_1.varchar)("id").primaryKey().notNull(),
    email: (0, pg_core_1.varchar)("email").unique(),
    firstName: (0, pg_core_1.varchar)("first_name"),
    lastName: (0, pg_core_1.varchar)("last_name"),
    profileImageUrl: (0, pg_core_1.varchar)("profile_image_url"),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
});
// Mood entries table
exports.moodEntries = (0, pg_core_1.pgTable)("mood_entries", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    userId: (0, pg_core_1.varchar)("user_id").notNull().references(() => exports.users.id),
    mood: (0, pg_core_1.varchar)("mood").notNull(), // 'terrible', 'bad', 'okay', 'good', 'great'
    moodScore: (0, pg_core_1.integer)("mood_score").notNull(), // 1-5
    journalEntry: (0, pg_core_1.text)("journal_entry"),
    aiAnalysis: (0, pg_core_1.jsonb)("ai_analysis"), // JSON with detected emotions, keywords, etc.
    date: (0, pg_core_1.date)("date").notNull(),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
});
// Therapy activities table
exports.therapyActivities = (0, pg_core_1.pgTable)("therapy_activities", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    name: (0, pg_core_1.varchar)("name").notNull(),
    description: (0, pg_core_1.text)("description").notNull(),
    duration: (0, pg_core_1.integer)("duration").notNull(), // in minutes
    category: (0, pg_core_1.varchar)("category").notNull(), // 'breathing', 'meditation', 'journaling', etc.
    difficulty: (0, pg_core_1.varchar)("difficulty").notNull(), // 'beginner', 'intermediate', 'advanced'
    instructions: (0, pg_core_1.text)("instructions").notNull(),
    icon: (0, pg_core_1.varchar)("icon").notNull(),
    moodRecommendations: (0, pg_core_1.varchar)("mood_recommendations").array(), // moods this activity is good for
});
// User activity completions table
exports.activityCompletions = (0, pg_core_1.pgTable)("activity_completions", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    userId: (0, pg_core_1.varchar)("user_id").notNull().references(() => exports.users.id),
    activityId: (0, pg_core_1.integer)("activity_id").notNull().references(() => exports.therapyActivities.id),
    completedAt: (0, pg_core_1.timestamp)("completed_at").defaultNow(),
    rating: (0, pg_core_1.integer)("rating"), // 1-5 how helpful it was
});
// Music recommendations table
exports.musicRecommendations = (0, pg_core_1.pgTable)("music_recommendations", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    title: (0, pg_core_1.varchar)("title").notNull(),
    artist: (0, pg_core_1.varchar)("artist").notNull(),
    mood: (0, pg_core_1.varchar)("mood").notNull(),
    genre: (0, pg_core_1.varchar)("genre"),
    spotifyUrl: (0, pg_core_1.varchar)("spotify_url"),
    youtubeUrl: (0, pg_core_1.varchar)("youtube_url"),
});
// User's saved music
exports.savedMusic = (0, pg_core_1.pgTable)("saved_music", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    userId: (0, pg_core_1.varchar)("user_id").notNull().references(() => exports.users.id),
    musicId: (0, pg_core_1.integer)("music_id").notNull().references(() => exports.musicRecommendations.id),
    savedAt: (0, pg_core_1.timestamp)("saved_at").defaultNow(),
});
// Schemas
exports.insertMoodEntrySchema = (0, drizzle_zod_1.createInsertSchema)(exports.moodEntries).omit({
    id: true,
    createdAt: true,
}).extend({
    moodScore: zod_1.z.number().min(1).max(5).optional(),
});
exports.insertActivityCompletionSchema = (0, drizzle_zod_1.createInsertSchema)(exports.activityCompletions).omit({
    id: true,
    completedAt: true,
});
