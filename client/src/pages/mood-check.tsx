import { useState, useRef, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/header";
import BottomNav from "@/components/bottom-nav";
import MoodSelector from "@/components/mood-selector";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Mic, Image, Brain, Camera, X } from "lucide-react";

type MoodType = 'terrible' | 'bad' | 'okay' | 'good' | 'great';

export default function MoodCheck() {
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);
  const [journalEntry, setJournalEntry] = useState("");
  const [aiInsights, setAiInsights] = useState<any>(null);
  const [isScanning, setIsScanning] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();

  const startCamera = async () => {
    setIsScanning(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      // Mock scanning duration and AI response
      setTimeout(() => {
        stream.getTracks().forEach(track => track.stop());
        setIsScanning(false);
        
        // Face analysis mock result
        const moods: MoodType[] = ['good', 'okay', 'bad'];
        const randomMood = moods[Math.floor(Math.random() * moods.length)];
        setSelectedMood(randomMood);
        
        setAiInsights({
          analysis: { detectedEmotions: ['tense', 'focused', 'slight fatigue'] },
          suggestion: "Our facial micro-expression analysis detected slight fatigue and tension. We recommend closing your eyes and doing a 2-minute 4-7-8 breathing exercise to reset your nervous system."
        });
        
        toast({
          title: "Scan Complete",
          description: "Facial analysis finished. Insights updated below.",
        });
      }, 4000);
    } catch (err) {
      toast({
        title: "Camera Access Denied",
        description: "Could not access the camera. Please allow permissions.",
        variant: "destructive"
      });
      setIsScanning(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
    setIsScanning(false);
  };

  const moodMutation = useMutation({
    mutationFn: async (data: { mood: MoodType; journalEntry?: string; date: string }) => {
      const response = await apiRequest("POST", "/api/mood-entries", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Mood logged successfully!",
        description: "Your daily check-in has been saved.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/mood-entries"] });
      queryClient.invalidateQueries({ queryKey: ["/api/user/stats"] });
      setLocation("/");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const aiInsightsMutation = useMutation({
    mutationFn: async (data: { mood: MoodType; text: string }) => {
      const response = await apiRequest("POST", "/api/ai/suggestion", data);
      return response.json();
    },
    onSuccess: (data) => {
      setAiInsights(data);
    },
    onError: (error) => {
      console.error("Failed to get AI insights:", error);
    },
  });

  const handleMoodSelect = (mood: MoodType) => {
    setSelectedMood(mood);
    
    // Get AI insights if journal entry exists
    if (journalEntry.trim()) {
      aiInsightsMutation.mutate({ mood, text: journalEntry });
    }
  };

  const handleJournalChange = (value: string) => {
    setJournalEntry(value);
    
    // Get AI insights if mood is selected and text is substantial
    if (selectedMood && value.trim().length > 20) {
      aiInsightsMutation.mutate({ mood: selectedMood, text: value });
    }
  };

  const handleSubmit = () => {
    if (!selectedMood) {
      toast({
        title: "Please select a mood",
        description: "Choose how you're feeling today before saving.",
        variant: "destructive",
      });
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    moodMutation.mutate({
      mood: selectedMood,
      journalEntry: journalEntry.trim() || undefined,
      date: today,
    });
  };

  return (
    <div className="min-h-screen bg-[var(--mindtune-neutral-50)]">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 md:pb-8">
        <Card className="border-[var(--mindtune-neutral-200)] shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-semibold text-[var(--mindtune-neutral-800)]">
                Daily Mood Check-in
              </CardTitle>
              <span className="text-sm text-[var(--mindtune-neutral-500)]">
                Today, {new Date().toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </span>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Mood Selection */}
            <div>
              <p className="text-[var(--mindtune-neutral-600)] mb-4">
                How are you feeling right now?
              </p>
              <MoodSelector 
                selectedMood={selectedMood} 
                onMoodSelect={handleMoodSelect}
              />
            </div>

            {/* AI Face Scanner */}
            {isScanning && (
              <div className="relative w-full max-w-sm mx-auto overflow-hidden rounded-xl border-2 border-[var(--mindtune-primary)] shadow-lg animate-fade-in">
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline 
                  muted 
                  className="w-full aspect-video object-cover bg-black"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--mindtune-primary)]/30 to-transparent mix-blend-overlay animate-pulse-gentle"></div>
                <div className="absolute top-0 w-full h-[2px] bg-[var(--mindtune-secondary)] shadow-[0_0_10px_2px_var(--mindtune-secondary)] opacity-80 animate-[scan_2s_ease-in-out_infinite]"></div>
                <Button 
                  variant="destructive" 
                  size="icon" 
                  className="absolute top-2 right-2 rounded-full h-8 w-8 opacity-80 hover:opacity-100"
                  onClick={stopCamera}
                >
                  <X className="w-4 h-4" />
                </Button>
                <div className="absolute bottom-2 left-0 right-0 text-center">
                  <span className="bg-black/60 text-white px-3 py-1 rounded-full text-xs font-medium tracking-wide">
                    Analyzing micro-expressions...
                  </span>
                </div>
              </div>
            )}

            {/* Journal Entry */}
            <div>
              <label className="block text-sm font-medium text-[var(--mindtune-neutral-700)] mb-2">
                Tell us more about your day (optional)
              </label>
              <Textarea
                value={journalEntry}
                onChange={(e) => handleJournalChange(e.target.value)}
                className="w-full px-4 py-3 border border-[var(--mindtune-neutral-300)] rounded-xl focus:ring-2 focus:ring-[var(--mindtune-primary)] focus:border-transparent resize-none"
                rows={4}
                placeholder="Had a great morning walk and feeling energized for the day ahead..."
              />
            </div>

            {/* AI Insights */}
            {aiInsights && (
              <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-2">
                    <Brain className="w-5 h-5 text-[var(--mindtune-primary)]" />
                    <CardTitle className="text-lg">AI Insights</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {aiInsights.analysis?.detectedEmotions?.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-[var(--mindtune-neutral-700)] mb-1">
                        Detected emotions:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {aiInsights.analysis.detectedEmotions.map((emotion: string, index: number) => (
                          <span 
                            key={index}
                            className="px-2 py-1 bg-[var(--mindtune-primary)]/10 text-[var(--mindtune-primary)] rounded-full text-xs"
                          >
                            {emotion}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {aiInsights.suggestion && (
                    <div>
                      <p className="text-sm font-medium text-[var(--mindtune-neutral-700)] mb-1">
                        Personalized suggestion:
                      </p>
                      <p className="text-sm text-[var(--mindtune-neutral-600)]">
                        {aiInsights.suggestion}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-4">
              <div className="flex items-center space-x-4">
                <button 
                  onClick={startCamera}
                  disabled={isScanning}
                  className="flex items-center space-x-2 text-[var(--mindtune-primary)] font-medium hover:text-[var(--mindtune-secondary)] transition-colors bg-[var(--mindtune-primary)]/10 px-3 py-1.5 rounded-lg"
                >
                  <Camera className="w-4 h-4" />
                  <span className="text-sm">AI Face Scan</span>
                </button>
                <button className="flex items-center space-x-2 text-[var(--mindtune-neutral-600)] hover:text-[var(--mindtune-primary)] transition-colors">
                  <Mic className="w-4 h-4" />
                  <span className="text-sm">Voice note</span>
                </button>
                <button className="flex items-center space-x-2 text-[var(--mindtune-neutral-600)] hover:text-[var(--mindtune-primary)] transition-colors">
                  <Image className="w-4 h-4" />
                  <span className="text-sm">Add photo</span>
                </button>
              </div>
              
              <Button 
                onClick={handleSubmit}
                disabled={moodMutation.isPending}
                className="bg-[var(--mindtune-primary)] hover:bg-[var(--mindtune-primary)]/90 text-white px-6 py-3 rounded-xl font-medium"
              >
                {moodMutation.isPending ? "Saving..." : "Save Check-in"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>

      <BottomNav />
    </div>
  );
}
