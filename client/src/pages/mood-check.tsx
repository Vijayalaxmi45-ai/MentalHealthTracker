import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/header";
import BottomNav from "@/components/bottom-nav";
import MoodSelector from "@/components/mood-selector";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Heart, Send, BookOpen, Zap } from "lucide-react";

export default function MoodCheck() {
  const [selectedMood, setSelectedMood] = useState<any>(null);
  const [journalEntry, setJournalEntry] = useState("");
  const [stressLevel, setStressLevel] = useState(5);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();

  const moodMutation = useMutation({
    mutationFn: async (data: any) => {
      const token = localStorage.getItem("mindtune_token");
      const res = await axios.post("/api/mood", data, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data;
    },
    onSuccess: () => {
      toast({ title: "Mood logged!", description: "Your daily check-in is saved." });
      queryClient.invalidateQueries({ queryKey: ["/api/mood/history"] });
      setLocation("/dashboard");
    },
  });

  const journalMutation = useMutation({
    mutationFn: async (content: string) => {
      const token = localStorage.getItem("mindtune_token");
      await axios.post("/api/journal", { content }, {
          headers: { Authorization: `Bearer ${token}` }
      });
    }
  });

  const handleSubmit = async () => {
    if (!selectedMood) {
      toast({ title: "Select a mood", variant: "destructive" });
      return;
    }

    const moodScoreMap: any = { terrible: 1, bad: 2, okay: 3, good: 4, great: 5 };
    
    try {
        await moodMutation.mutateAsync({
          mood: selectedMood,
          mood_score: moodScoreMap[selectedMood],
          note: `Stress level: ${stressLevel}`,
          date: new Date().toISOString().split('T')[0]
        });

        if (journalEntry.trim()) {
            await journalMutation.mutateAsync(journalEntry);
        }
    } catch (err) {
        toast({ title: "Error", description: "Failed to save entry.", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50">
      <Header />
      
      <main className="max-w-3xl mx-auto px-4 py-12 pb-24">
        <div className="text-center mb-12">
            <h1 className="text-4xl font-black text-slate-900 mb-2">Daily Check-in</h1>
            <p className="text-slate-500 text-lg">Your mental health matters. Let's see how you're doing.</p>
        </div>

        <div className="space-y-8">
            {/* Step 1: Mood */}
            <Card className="border-none shadow-xl rounded-3xl overflow-hidden">
                <CardHeader className="bg-primary text-white p-6">
                    <CardTitle className="flex items-center gap-3 text-2xl">
                        <Heart className="w-6 h-6 fill-current" />
                        1. How are you feeling?
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                    <MoodSelector selectedMood={selectedMood} onMoodSelect={setSelectedMood} />
                </CardContent>
            </Card>

            {/* Step 2: Stress */}
            <Card className="border-none shadow-xl rounded-3xl overflow-hidden">
                <CardHeader className="bg-amber-500 text-white p-6">
                    <CardTitle className="flex items-center gap-3 text-2xl">
                        <Zap className="w-6 h-6 fill-current" />
                        2. Current Stress Level
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-8 space-y-6 text-center">
                    <div className="text-6xl font-black text-amber-600">{stressLevel}</div>
                    <Slider 
                        value={[stressLevel]} 
                        min={1} 
                        max={10} 
                        step={1} 
                        onValueChange={(v) => setStressLevel(v[0])}
                    />
                    <div className="flex justify-between text-sm font-bold text-slate-400 px-2">
                        <span>CALM</span>
                        <span>MODERATE</span>
                        <span>EXTREME</span>
                    </div>
                </CardContent>
            </Card>

            {/* Step 3: Journal */}
            <Card className="border-none shadow-xl rounded-3xl overflow-hidden">
                <CardHeader className="bg-indigo-600 text-white p-6">
                    <CardTitle className="flex items-center gap-3 text-2xl">
                        <BookOpen className="w-6 h-6" />
                        3. Journal Your Thoughts
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                    <Textarea 
                        placeholder="What's on your mind? Writing it down helps..."
                        className="min-h-[200px] text-lg rounded-2xl border-slate-200 focus:ring-primary focus:border-primary"
                        value={journalEntry}
                        onChange={(e) => setJournalEntry(e.target.value)}
                    />
                </CardContent>
            </Card>

            <Button 
                onClick={handleSubmit}
                disabled={moodMutation.isPending}
                className="w-full py-8 text-2xl font-bold rounded-3xl shadow-2xl hover:scale-102 transition-all"
            >
                {moodMutation.isPending ? "Saving..." : "Complete Check-in"}
                <Send className="w-6 h-6 ml-3" />
            </Button>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
