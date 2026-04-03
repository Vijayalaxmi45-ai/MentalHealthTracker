import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

const affirmations = [
  "You are capable of amazing things.",
  "Your feelings are valid, and you are allowed to feel them.",
  "Every day is a new beginning. Take a deep breath and start again.",
  "You are stronger than your anxiety.",
  "It's okay to prioritize your own well-being.",
  "Small steps forward are still steps."
];

export default function AffirmationWidget() {
  const [affirmation, setAffirmation] = useState("");

  useEffect(() => {
    // Pick a random affirmation
    const random = affirmations[Math.floor(Math.random() * affirmations.length)];
    setAffirmation(random);
  }, []);

  return (
    <Card className="border-[var(--mindtune-neutral-200)] shadow-sm bg-gradient-to-r from-[var(--mindtune-primary)]/10 to-[var(--mindtune-accent)]/10 mb-8 border-l-4 border-l-[var(--mindtune-primary)]">
      <CardContent className="p-6 flex items-center space-x-4">
        <div className="bg-white p-3 rounded-full shadow-sm">
          <Sparkles className="w-6 h-6 text-[var(--mindtune-primary)]" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-[var(--mindtune-neutral-700)] mb-1">Daily Affirmation</h3>
          <p className="text-lg font-medium text-[var(--mindtune-neutral-900)] tracking-wide">
            "{affirmation}"
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
