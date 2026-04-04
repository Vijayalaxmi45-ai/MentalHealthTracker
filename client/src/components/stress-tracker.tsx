import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { Zap } from "lucide-react";

export default function StressTracker() {
  const [level, setLevel] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("mindtune_token");
      await axios.post("/api/mood", { 
        mood: "Stress", 
        mood_score: level, 
        note: `Stress level: ${level}`,
        date: new Date().toISOString().split('T')[0]
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast({ title: "Stress Level Recorded", description: "Taking care of your stress is important." });
    } catch (error) {
      toast({ title: "Error", description: "Failed to record stress level.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getLabel = (l: number) => {
    if (l <= 3) return "Low Stress";
    if (l <= 7) return "Moderate Stress";
    return "High Stress";
  };

  const getColorClass = (l: number) => {
    if (l <= 3) return "text-emerald-500";
    if (l <= 7) return "text-amber-500";
    return "text-rose-500";
  };

  return (
    <Card className="border-[var(--mindtune-neutral-200)] shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl font-semibold flex items-center gap-2">
          <Zap className="w-5 h-5 text-amber-500" />
          Stress Level Tracker
        </CardTitle>
        <CardDescription>Assess your current stress on a scale of 1 to 10.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center gap-4">
          <div className={`text-3xl font-bold ${getColorClass(level)} animate-fade-in`}>{level}</div>
          <div className="text-sm font-medium text-muted-foreground">{getLabel(level)}</div>
          <Slider 
            value={[level]} 
            min={1} 
            max={10} 
            step={1} 
            onValueChange={(v) => setLevel(v[0])}
            className="w-full"
          />
        </div>
        <Button 
          onClick={handleSubmit} 
          disabled={isSubmitting}
          className="w-full"
        >
          {isSubmitting ? "Submitting..." : "Log My Level"}
        </Button>
      </CardContent>
    </Card>
  );
}
