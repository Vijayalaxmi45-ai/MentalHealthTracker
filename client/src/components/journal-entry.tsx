import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { BookOpen, Send } from "lucide-react";

export default function JournalEntry() {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!content.trim()) return;
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("mindtune_token");
      await axios.post("/api/journal", { content }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast({ title: "Journal Saved", description: "Your thoughts have been recorded." });
      setContent("");
    } catch (error) {
      toast({ title: "Error", description: "Failed to save journal entry.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="border-[var(--mindtune-neutral-200)] shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl font-semibold flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-primary" />
          Daily Journal
        </CardTitle>
        <CardDescription>Write down how you're feeling today.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea 
          placeholder="Today I feel..." 
          className="min-h-[120px] resize-none"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <Button 
          onClick={handleSubmit} 
          disabled={isSubmitting || !content.trim()}
          className="w-full"
        >
          {isSubmitting ? "Saving..." : "Save Entry"}
          <Send className="w-4 h-4 ml-2" />
        </Button>
      </CardContent>
    </Card>
  );
}
