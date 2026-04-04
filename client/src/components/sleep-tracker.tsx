import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { Moon, BedDouble } from "lucide-react";

export default function SleepTracker() {
  const [duration, setDuration] = useState("8");
  const [quality, setQuality] = useState("7");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("mindtune_token");
      await axios.post("/api/mood", { 
        mood: "Sleep", 
        mood_score: parseInt(quality), 
        note: `Slept for: ${duration} hours`,
        date: new Date().toISOString().split('T')[0]
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast({ title: "Sleep Logged", description: "Sweet dreams. Better sleep tracker added." });
    } catch (error) {
      toast({ title: "Error", description: "Failed to log sleep.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="border-[var(--mindtune-neutral-200)] shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl font-semibold flex items-center gap-2">
          <Moon className="w-5 h-5 text-indigo-500" />
          Sleep Tracker
        </CardTitle>
        <CardDescription>Track your rest to improve your productivity.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-4">
          <div className="flex-1 space-y-2">
            <Label>Duration (Hours)</Label>
            <Input type="number" value={duration} onChange={(e) => setDuration(e.target.value)} min={0} max={24} />
          </div>
          <div className="flex-1 space-y-2">
            <Label>Quality (1-10)</Label>
            <Input type="number" value={quality} onChange={(e) => setQuality(e.target.value)} min={1} max={10} />
          </div>
        </div>
        <Button 
          onClick={handleSubmit} 
          disabled={isSubmitting}
          className="w-full bg-indigo-600 hover:bg-indigo-700"
        >
          <BedDouble className="w-4 h-4 mr-2" />
          {isSubmitting ? "Logging..." : "Log Sleep"}
        </Button>
      </CardContent>
    </Card>
  );
}
