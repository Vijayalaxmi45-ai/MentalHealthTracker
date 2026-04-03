import { useState, useEffect } from "react";
import Header from "@/components/header";
import BottomNav from "@/components/bottom-nav";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Timer, Pause, Play, RotateCcw, Focus, Music as MusicIcon, Wind } from "lucide-react";

export default function FocusMode() {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 mins
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'focus' | 'break'>('focus');

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      // Automatically switch modes
      if (mode === 'focus') {
        setMode('break');
        setTimeLeft(5 * 60); // 5 min break
      } else {
        setMode('focus');
        setTimeLeft(25 * 60);
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, mode]);

  const toggleTimer = () => setIsActive(!isActive);
  
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(mode === 'focus' ? 25 * 60 : 5 * 60);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`min-h-screen transition-colors duration-1000 ${
      mode === 'focus' 
        ? 'bg-gradient-to-br from-indigo-900 to-[#0B0F19]' 
        : 'bg-gradient-to-br from-teal-900 to-emerald-950'
    }`}>
      {/* Zen Header */}
      <header className="px-6 py-6 flex justify-between items-center text-white/80">
        <div className="flex items-center space-x-2">
          <Focus className="w-5 h-5" />
          <span className="font-medium tracking-widest uppercase text-sm">Zen Focus</span>
        </div>
        <Button variant="ghost" className="text-white/80 hover:text-white" onClick={() => window.location.href='/dashboard'}>
          Exit
        </Button>
      </header>

      <main className="flex flex-col items-center justify-center min-h-[80vh] px-4 animate-fade-in">
        <div className="text-center mb-12">
          <h1 className="text-white/90 text-xl font-light mb-2 tracking-wide">
            {mode === 'focus' ? 'Deep Work Session' : 'Mindful Break'}
          </h1>
          <p className="text-white/50 text-sm">
            {mode === 'focus' ? 'Stay focused on your current task.' : 'Rest your eyes, breathe, and relax.'}
          </p>
        </div>

        <div className="relative flex items-center justify-center w-72 h-72 mb-16">
          <div className={`absolute inset-0 rounded-full border-[1px] border-white/20 ${isActive && mode === 'focus' ? 'animate-[spin_60s_linear_infinite]' : ''}`}></div>
          <div className={`absolute inset-4 rounded-full border border-dashed border-white/10 ${isActive ? 'animate-[spin_30s_linear_infinite_reverse]' : ''}`}></div>
          
          <div className="z-10 text-center">
            <div className="text-7xl font-light text-white tracking-tight font-mono drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
              {formatTime(timeLeft)}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-6 z-10">
          <Button 
            variant="outline" 
            size="icon"
            onClick={resetTimer}
            className="w-12 h-12 rounded-full border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white transition-all backdrop-blur-md"
          >
            <RotateCcw className="w-5 h-5" />
          </Button>

          <Button 
            size="lg"
            onClick={toggleTimer}
            className={`w-20 h-20 rounded-full shadow-[0_0_30px_rgba(255,255,255,0.1)] transition-all hover:scale-105 ${
              isActive 
                ? 'bg-white/10 hover:bg-white/20 text-white border border-white/30 backdrop-blur-md' 
                : 'bg-white text-indigo-950 hover:bg-white/90'
            }`}
          >
            {isActive ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
          </Button>

          <Button 
            variant="outline" 
            size="icon"
            className="w-12 h-12 rounded-full border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white transition-all backdrop-blur-md"
          >
            {mode === 'focus' ? <Wind className="w-5 h-5" /> : <MusicIcon className="w-5 h-5" />}
          </Button>
        </div>
      </main>

      {/* Hide bottom Nav here to maintain focus */}
    </div>
  );
}
