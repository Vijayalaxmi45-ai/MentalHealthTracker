"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.storage = exports.DatabaseStorage = void 0;
const schema_1 = require("@shared/schema");
const db_1 = require("./db");
const drizzle_orm_1 = require("drizzle-orm");
class DatabaseStorage {
    // User operations (required for Replit Auth)
    getUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const [user] = yield db_1.db.select().from(schema_1.users).where((0, drizzle_orm_1.eq)(schema_1.users.id, id));
            return user;
        });
    }
    upsertUser(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            const [user] = yield db_1.db
                .insert(schema_1.users)
                .values(userData)
                .onConflictDoUpdate({
                target: schema_1.users.id,
                set: Object.assign(Object.assign({}, userData), { updatedAt: new Date() }),
            })
                .returning();
            return user;
        });
    }
    // Mood entries
    createMoodEntry(entry) {
        return __awaiter(this, void 0, void 0, function* () {
            const [moodEntry] = yield db_1.db
                .insert(schema_1.moodEntries)
                .values(entry)
                .returning();
            return moodEntry;
        });
    }
    getUserMoodEntries(userId_1) {
        return __awaiter(this, arguments, void 0, function* (userId, limit = 30) {
            return yield db_1.db
                .select()
                .from(schema_1.moodEntries)
                .where((0, drizzle_orm_1.eq)(schema_1.moodEntries.userId, userId))
                .orderBy((0, drizzle_orm_1.desc)(schema_1.moodEntries.date))
                .limit(limit);
        });
    }
    getUserMoodEntriesInRange(userId, startDate, endDate) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield db_1.db
                .select()
                .from(schema_1.moodEntries)
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.moodEntries.userId, userId), (0, drizzle_orm_1.gte)(schema_1.moodEntries.date, startDate), (0, drizzle_orm_1.lte)(schema_1.moodEntries.date, endDate)))
                .orderBy((0, drizzle_orm_1.desc)(schema_1.moodEntries.date));
        });
    }
    getMoodEntry(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const [entry] = yield db_1.db.select().from(schema_1.moodEntries).where((0, drizzle_orm_1.eq)(schema_1.moodEntries.id, id));
            return entry;
        });
    }
    // Therapy activities
    getAllTherapyActivities() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield db_1.db.select().from(schema_1.therapyActivities);
        });
    }
    getTherapyActivitiesByMood(mood) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield db_1.db
                .select()
                .from(schema_1.therapyActivities)
                .where((0, drizzle_orm_1.sql) `${schema_1.therapyActivities.moodRecommendations} && ARRAY[${mood}]`);
        });
    }
    getTherapyActivity(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const [activity] = yield db_1.db.select().from(schema_1.therapyActivities).where((0, drizzle_orm_1.eq)(schema_1.therapyActivities.id, id));
            return activity;
        });
    }
    // Activity completions
    createActivityCompletion(completion) {
        return __awaiter(this, void 0, void 0, function* () {
            const [activityCompletion] = yield db_1.db
                .insert(schema_1.activityCompletions)
                .values(completion)
                .returning();
            return activityCompletion;
        });
    }
    getUserActivityCompletions(userId_1) {
        return __awaiter(this, arguments, void 0, function* (userId, limit = 20) {
            return yield db_1.db
                .select()
                .from(schema_1.activityCompletions)
                .where((0, drizzle_orm_1.eq)(schema_1.activityCompletions.userId, userId))
                .orderBy((0, drizzle_orm_1.desc)(schema_1.activityCompletions.completedAt))
                .limit(limit);
        });
    }
    getUserWeeklyActivityCount(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            const [result] = yield db_1.db
                .select({ count: (0, drizzle_orm_1.count)() })
                .from(schema_1.activityCompletions)
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.activityCompletions.userId, userId), (0, drizzle_orm_1.gte)(schema_1.activityCompletions.completedAt, weekAgo)));
            return result.count;
        });
    }
    // Music recommendations
    getMusicByMood(mood) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield db_1.db
                .select()
                .from(schema_1.musicRecommendations)
                .where((0, drizzle_orm_1.eq)(schema_1.musicRecommendations.mood, mood))
                .limit(10);
        });
    }
    saveUserMusic(userId, musicId) {
        return __awaiter(this, void 0, void 0, function* () {
            const [saved] = yield db_1.db
                .insert(schema_1.savedMusic)
                .values({ userId, musicId })
                .returning();
            return saved;
        });
    }
    getUserSavedMusic(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield db_1.db
                .select()
                .from(schema_1.savedMusic)
                .where((0, drizzle_orm_1.eq)(schema_1.savedMusic.userId, userId))
                .orderBy((0, drizzle_orm_1.desc)(schema_1.savedMusic.savedAt));
        });
    }
    // Analytics
    getUserMoodStats(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Get all mood entries for the user
            const entries = yield db_1.db
                .select()
                .from(schema_1.moodEntries)
                .where((0, drizzle_orm_1.eq)(schema_1.moodEntries.userId, userId))
                .orderBy((0, drizzle_orm_1.desc)(schema_1.moodEntries.date));
            if (entries.length === 0) {
                return {
                    averageMood: 0,
                    totalEntries: 0,
                    currentStreak: 0,
                    positiveDays: 0,
                    totalDays: 0,
                };
            }
            // Calculate average mood
            const totalMoodScore = entries.reduce((sum, entry) => sum + entry.moodScore, 0);
            const averageMood = Math.round((totalMoodScore / entries.length) * 10) / 10;
            // Calculate current streak
            let currentStreak = 0;
            const today = new Date().toISOString().split('T')[0];
            let checkDate = new Date(today);
            for (let i = 0; i < entries.length; i++) {
                const entryDate = entries[i].date;
                const checkDateStr = checkDate.toISOString().split('T')[0];
                if (entryDate === checkDateStr) {
                    currentStreak++;
                    checkDate.setDate(checkDate.getDate() - 1);
                }
                else {
                    break;
                }
            }
            // Calculate positive days (mood score >= 4)
            const positiveDays = entries.filter(entry => entry.moodScore >= 4).length;
            return {
                averageMood,
                totalEntries: entries.length,
                currentStreak,
                positiveDays,
                totalDays: entries.length,
            };
        });
    }
}
exports.DatabaseStorage = DatabaseStorage;
exports.storage = new DatabaseStorage();
