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
exports.registerRoutes = registerRoutes;
const http_1 = require("http");
const storage_1 = require("./storage");
const replitAuth_1 = require("./replitAuth");
const openai_1 = require("./openai");
const schema_1 = require("@shared/schema");
const zod_1 = require("zod");
function registerRoutes(app) {
    return __awaiter(this, void 0, void 0, function* () {
        // Auth middleware
        yield (0, replitAuth_1.setupAuth)(app);
        // Auth routes
        app.get('/api/auth/user', replitAuth_1.isAuthenticated, (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.user.claims.sub;
                const user = yield storage_1.storage.getUser(userId);
                res.json(user);
            }
            catch (error) {
                console.error("Error fetching user:", error);
                res.status(500).json({ message: "Failed to fetch user" });
            }
        }));
        // Mood entries
        app.post('/api/mood-entries', replitAuth_1.isAuthenticated, (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.user.claims.sub;
                const data = schema_1.insertMoodEntrySchema.parse(Object.assign(Object.assign({}, req.body), { userId }));
                // Get mood score from mood string
                const moodScores = {
                    'terrible': 1,
                    'bad': 2,
                    'okay': 3,
                    'good': 4,
                    'great': 5
                };
                data.moodScore = moodScores[data.mood] || 3;
                // Analyze mood if journal entry exists
                let aiAnalysis = null;
                if (data.journalEntry && data.journalEntry.trim()) {
                    aiAnalysis = yield (0, openai_1.analyzeMoodFromText)(data.journalEntry, data.mood);
                }
                const entry = yield storage_1.storage.createMoodEntry(Object.assign(Object.assign({}, data), { aiAnalysis: aiAnalysis ? JSON.stringify(aiAnalysis) : null }));
                res.json(entry);
            }
            catch (error) {
                if (error instanceof zod_1.ZodError) {
                    res.status(400).json({ message: "Invalid data", errors: error.errors });
                }
                else {
                    console.error("Error creating mood entry:", error);
                    res.status(500).json({ message: "Failed to create mood entry" });
                }
            }
        }));
        app.get('/api/mood-entries', replitAuth_1.isAuthenticated, (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.user.claims.sub;
                const limit = req.query.limit ? parseInt(req.query.limit) : 30;
                const entries = yield storage_1.storage.getUserMoodEntries(userId, limit);
                res.json(entries);
            }
            catch (error) {
                console.error("Error fetching mood entries:", error);
                res.status(500).json({ message: "Failed to fetch mood entries" });
            }
        }));
        app.get('/api/mood-entries/range', replitAuth_1.isAuthenticated, (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.user.claims.sub;
                const { startDate, endDate } = req.query;
                if (!startDate || !endDate) {
                    return res.status(400).json({ message: "startDate and endDate are required" });
                }
                const entries = yield storage_1.storage.getUserMoodEntriesInRange(userId, startDate, endDate);
                res.json(entries);
            }
            catch (error) {
                console.error("Error fetching mood entries:", error);
                res.status(500).json({ message: "Failed to fetch mood entries" });
            }
        }));
        // Therapy activities
        app.get('/api/therapy-activities', replitAuth_1.isAuthenticated, (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const mood = req.query.mood;
                let activities;
                if (mood) {
                    activities = yield storage_1.storage.getTherapyActivitiesByMood(mood);
                }
                else {
                    activities = yield storage_1.storage.getAllTherapyActivities();
                }
                res.json(activities);
            }
            catch (error) {
                console.error("Error fetching therapy activities:", error);
                res.status(500).json({ message: "Failed to fetch therapy activities" });
            }
        }));
        app.post('/api/activity-completions', replitAuth_1.isAuthenticated, (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.user.claims.sub;
                const data = schema_1.insertActivityCompletionSchema.parse(Object.assign(Object.assign({}, req.body), { userId }));
                const completion = yield storage_1.storage.createActivityCompletion(data);
                res.json(completion);
            }
            catch (error) {
                if (error instanceof zod_1.ZodError) {
                    res.status(400).json({ message: "Invalid data", errors: error.errors });
                }
                else {
                    console.error("Error creating activity completion:", error);
                    res.status(500).json({ message: "Failed to create activity completion" });
                }
            }
        }));
        app.get('/api/activity-completions', replitAuth_1.isAuthenticated, (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.user.claims.sub;
                const completions = yield storage_1.storage.getUserActivityCompletions(userId);
                res.json(completions);
            }
            catch (error) {
                console.error("Error fetching activity completions:", error);
                res.status(500).json({ message: "Failed to fetch activity completions" });
            }
        }));
        // Music recommendations
        app.get('/api/music', replitAuth_1.isAuthenticated, (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const mood = req.query.mood;
                if (!mood) {
                    return res.status(400).json({ message: "mood parameter is required" });
                }
                const music = yield storage_1.storage.getMusicByMood(mood);
                res.json(music);
            }
            catch (error) {
                console.error("Error fetching music:", error);
                res.status(500).json({ message: "Failed to fetch music recommendations" });
            }
        }));
        app.post('/api/saved-music', replitAuth_1.isAuthenticated, (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.user.claims.sub;
                const { musicId } = req.body;
                if (!musicId) {
                    return res.status(400).json({ message: "musicId is required" });
                }
                const saved = yield storage_1.storage.saveUserMusic(userId, musicId);
                res.json(saved);
            }
            catch (error) {
                console.error("Error saving music:", error);
                res.status(500).json({ message: "Failed to save music" });
            }
        }));
        // User analytics
        app.get('/api/user/stats', replitAuth_1.isAuthenticated, (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.user.claims.sub;
                const stats = yield storage_1.storage.getUserMoodStats(userId);
                const weeklyActivities = yield storage_1.storage.getUserWeeklyActivityCount(userId);
                res.json(Object.assign(Object.assign({}, stats), { weeklyActivities }));
            }
            catch (error) {
                console.error("Error fetching user stats:", error);
                res.status(500).json({ message: "Failed to fetch user stats" });
            }
        }));
        // AI suggestions
        app.post('/api/ai/suggestion', replitAuth_1.isAuthenticated, (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { mood, text } = req.body;
                if (!mood) {
                    return res.status(400).json({ message: "mood is required" });
                }
                const analysis = yield (0, openai_1.analyzeMoodFromText)(text || "", mood);
                const suggestion = yield (0, openai_1.generateTherapySuggestion)(mood, analysis);
                res.json({
                    analysis,
                    suggestion,
                });
            }
            catch (error) {
                console.error("Error generating AI suggestion:", error);
                res.status(500).json({ message: "Failed to generate suggestion" });
            }
        }));
        const httpServer = (0, http_1.createServer)(app);
        return httpServer;
    });
}
