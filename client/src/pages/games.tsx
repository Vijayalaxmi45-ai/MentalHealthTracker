import { useState, useEffect } from "react";
import Header from "@/components/header";
import BottomNav from "@/components/bottom-nav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Joystick, RefreshCcw } from "lucide-react";

export default function Games() {
  const [bubbles, setBubbles] = useState<number[]>([]);
  const [poppedCount, setPoppedCount] = useState(0);

  const initGame = () => {
    setBubbles(Array.from({ length: 24 }).map((_, i) => i));
    setPoppedCount(0);
  };

  useEffect(() => {
    initGame();
  }, []);

  const popBubble = (id: number) => {
    setBubbles(bubbles.filter(b => b !== id));
    setPoppedCount(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-[var(--mindtune-neutral-50)]">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 md:pb-8">
        <Card className="border-[var(--mindtune-neutral-200)] shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-3 rounded-xl bg-[var(--mindtune-secondary)]/20">
                <Joystick className="w-6 h-6 text-[var(--mindtune-primary)]" />
              </div>
              <CardTitle className="text-xl font-semibold">Stress Relief: Bubble Pop</CardTitle>
            </div>
            <Button variant="outline" size="sm" onClick={initGame}>
              <RefreshCcw className="w-4 h-4 mr-2" /> Reset
            </Button>
          </CardHeader>
          <CardContent>
            <div className="text-center mb-6">
              <p className="text-[var(--mindtune-neutral-600)]">
                Take a deep breath and pop some bubbles to relieve stress. Focus on the satisfying sound and motion.
              </p>
              <div className="mt-4 text-[var(--mindtune-primary)] font-bold text-lg">
                Popped: {poppedCount}
              </div>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-4 justify-items-center bg-white p-8 rounded-2xl border border-[var(--mindtune-neutral-200)]">
              {Array.from({ length: 24 }).map((_, id) => {
                const isPopped = !bubbles.includes(id);
                return (
                  <button
                    key={id}
                    onClick={() => !isPopped && popBubble(id)}
                    className={`
                      w-12 h-12 rounded-full transition-all duration-200
                      ${isPopped 
                        ? 'opacity-0 scale-150' 
                        : 'opacity-100 scale-100 bg-gradient-to-br from-[var(--mindtune-accent)] to-[var(--mindtune-secondary)] shadow-md hover:scale-110 active:scale-95'
                      }
                    `}
                    disabled={isPopped}
                  />
                );
              })}
            </div>
          </CardContent>
        </Card>
      </main>

      <BottomNav />
    </div>
  );
}
