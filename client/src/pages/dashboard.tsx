import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "wouter";
import Header from "@/components/header";
import BottomNav from "@/components/bottom-nav";
import MoodCalendar from "@/components/mood-calendar";
import MusicPlayer from "@/components/music-player";
import TherapyActivities from "@/components/therapy-activities";
import EmergencySupport from "@/components/emergency-support";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Flame, TrendingUp, Leaf, Moon, Zap, BookOpen } from "lucide-react";

import AffirmationWidget from "@/components/affirmation";
import MoodAnalytics from "@/components/mood-analytics";
import JournalEntry from "@/components/journal-entry";
import StressTracker from "@/components/stress-tracker";
import SleepTracker from "@/components/sleep-tracker";
import MeditationTimer from "@/components/meditation-timer";
import AiSuggestions from "@/components/ai-suggestions";

export default function Dashboard() {
  const { user } = useAuth();
  
  const { data: moodHistory } = useQuery({
    queryKey: ["/api/mood/history"],
  });

  const userName = user?.name || "there";
  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? "Good morning" : currentHour < 18 ? "Good afternoon" : "Good evening";

  return (
    <div className="min-h-screen bg-[var(--mindtune-neutral-50)]">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 md:pb-8">
        {/* Welcome Section */}
        <section className="mb-8 animate-fade-in text-center md:text-left">
          <div className="bg-gradient-to-r from-primary to-indigo-600 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl">
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-3">
                {greeting}, {userName}! 🌅
              </h2>
              <p className="text-xl opacity-90 mb-8 max-w-2xl">
                Your journey to mental wellness continues. Remember, every step counts.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Link href="/mood-check">
                  <Button className="bg-white text-primary hover:bg-white/90 px-8 py-6 rounded-2xl font-bold text-lg shadow-lg transition-all hover:scale-105 active:scale-95 w-full sm:w-auto">
                    <Heart className="w-5 h-5 mr-3 fill-current" />
                    How are you feeling?
                  </Button>
                </Link>
                <Link href="/focus">
                  <Button variant="outline" className="bg-transparent border-2 border-white text-white hover:bg-white/20 px-8 py-6 rounded-2xl font-bold text-lg shadow-lg transition-all hover:scale-105 active:scale-95 w-full sm:w-auto">
                    Center Your Mind
                  </Button>
                </Link>
              </div>
            </div>
            <div className="absolute -right-10 -top-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute -left-10 -bottom-10 w-48 h-48 bg-indigo-400/20 rounded-full blur-2xl"></div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <div className="lg:col-span-2 space-y-8">
                {/* AI Suggestions & Affirmations */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <AiSuggestions currentMood={moodHistory?.[0]?.mood} />
                    <AffirmationWidget />
                </div>

                {/* Tracking Tools */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <StressTracker />
                    <SleepTracker />
                </div>

                <JournalEntry />
                
                {/* Visualizations */}
                <MoodAnalytics />
                <MoodCalendar />
            </div>

            <div className="space-y-8">
                <MeditationTimer />
                
                <Card className="border-none shadow-md bg-gradient-to-br from-amber-50 to-orange-50">
                    <CardHeader>
                        <CardTitle className="text-lg font-bold flex items-center gap-2">
                            <Flame className="w-5 h-5 text-orange-500" />
                            Daily Streak
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-black text-orange-600">5 Days</div>
                        <p className="text-sm text-orange-700 font-medium">Keep it up! You're doing great.</p>
                    </CardContent>
                </Card>

                <MusicPlayer />
                <TherapyActivities />
                <EmergencySupport />
            </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
