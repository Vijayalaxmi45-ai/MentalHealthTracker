import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, RefreshCw } from "lucide-react";
import axios from "axios";

export default function AiSuggestions({ currentMood }: { currentMood?: string }) {
  const [suggestion, setSuggestion] = useState("Loading your personalized wellness advice...");
  const [loading, setLoading] = useState(false);

  const fetchSuggestion = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("mindtune_token");
      const res = await axios.get(`/api/ai/suggestions?mood=${currentMood || 'Good'}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuggestion(res.data.suggestion);
    } catch (error) {
      setSuggestion("Take a deep breath and stay positive. You're doing great!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuggestion();
  }, [currentMood]);

  return (
    <Card className="border-[var(--mindtune-neutral-200)] shadow-lg bg-gradient-to-br from-indigo-50 to-white overflow-hidden relative border-l-4 border-l-indigo-500">
      <CardHeader>
        <CardTitle className="text-xl font-bold flex items-center gap-2 text-indigo-900">
          <Sparkles className="w-5 h-5 text-indigo-500 animate-pulse" />
          AI Wellness Guide
        </CardTitle>
        <CardDescription className="text-indigo-700/80 font-medium italic">Personalized insights based on your mood.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-lg text-indigo-900 leading-relaxed font-outfit">
          "{suggestion}"
        </p>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={fetchSuggestion} 
          disabled={loading}
          className="border-indigo-200 text-indigo-700 hover:bg-indigo-100/50"
        >
          <RefreshCw className={`w-3 h-3 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh Insight
        </Button>
      </CardContent>
    </Card>
  );
}
