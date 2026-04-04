import { Express } from "express";
import { createServer, type Server } from "http";
import authRoutes from "./routes/authRoutes";
import moodRoutes from "./routes/moodRoutes";
import journalRoutes from "./routes/journalRoutes";
import { getAiSuggestions } from "./controllers/aiController";
import { authenticateToken } from "./middleware/authMiddleware";
import { initDB } from "./models";

export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize DB
  await initDB();

  // API Routes
  app.use("/api/auth", authRoutes);
  app.use("/api/mood", moodRoutes);
  app.use("/api/journal", journalRoutes);
  
  // AI Suggestions
  app.get("/api/ai/suggestions", authenticateToken as any, getAiSuggestions as any);

  const httpServer = createServer(app);
  return httpServer;
}
