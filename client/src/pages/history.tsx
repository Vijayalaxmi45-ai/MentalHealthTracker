import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Header from "@/components/header";
import BottomNav from "@/components/bottom-nav";
import MoodCalendar from "@/components/mood-calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, TrendingUp, Activity, Target, BookOpen } from "lucide-react";
import { useState } from "react";

const moodEmojis: any = {
  terrible: "😢",
  bad: "😔", 
  okay: "😐",
  good: "😊",
  great: "😄"
};

const moodColors: any = {
  terrible: "bg-red-100 text-red-800",
  bad: "bg-orange-100 text-orange-800",
  okay: "bg-yellow-100 text-yellow-800", 
  good: "bg-green-100 text-green-800",
  great: "bg-blue-100 text-blue-800"
};

export default function History() {
  const [timeFrame, setTimeFrame] = useState<'week' | 'month' | 'year'>('week');
  
  const { data: moodEntries } = useQuery({
    queryKey: ["/api/mood/history"],
    queryFn: async () => {
        const token = localStorage.getItem("mindtune_token");
        const res = await axios.get("/api/mood/history", {
            headers: { Authorization: `Bearer ${token}` }
        });
        return res.data;
    }
  });

  const { data: journalEntries } = useQuery({
    queryKey: ["/api/journal/history"],
    queryFn: async () => {
        const token = localStorage.getItem("mindtune_token");
        const res = await axios.get("/api/journal/history", {
            headers: { Authorization: `Bearer ${token}` }
        });
        return res.data;
    }
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-24">
        {/* Page Header */}
        <div className="mb-12">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-lg">
              <Calendar className="w-8 h-8 text-white" />
            </div>
            <div>
                <h1 className="text-3xl font-black text-slate-900">Your Mood Journey</h1>
                <p className="text-slate-500 font-medium">Discover patterns in your journey to wellness.</p>
            </div>
          </div>
        </div>

        {/* Mood Calendar */}
        <div className="mb-12">
            <MoodCalendar />
        </div>

        {/* History Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Mood Entries List */}
          <Card className="border-none shadow-xl rounded-3xl">
            <CardHeader className="p-6 pb-0">
              <CardTitle className="flex items-center space-x-3 text-xl">
                <Activity className="w-6 h-6 text-primary" />
                <span>Recent Mood Check-ins</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {moodEntries?.map((entry: any) => (
                  <div key={entry.id} className="flex items-start space-x-4 p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-all border border-slate-100">
                    <div className="text-3xl">
                      {moodEmojis[entry.mood.toLowerCase()] || "😶"}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <Badge className={`${moodColors[entry.mood.toLowerCase()] || 'bg-slate-100'} px-3 py-1 rounded-full`}>
                          {entry.mood}
                        </Badge>
                        <span className="text-xs font-bold text-slate-400 uppercase">
                          {new Date(entry.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 font-medium">
                        {entry.note || "No notes added."}
                      </p>
                    </div>
                  </div>
                ))}
                
                {(!moodEntries || moodEntries.length === 0) && (
                  <div className="text-center py-12 text-slate-400">
                    <Activity className="w-16 h-16 mx-auto mb-4 opacity-20" />
                    <p className="text-lg font-bold">No entries yet</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Journal Entries List */}
          <Card className="border-none shadow-xl rounded-3xl">
            <CardHeader className="p-6 pb-0">
              <CardTitle className="flex items-center space-x-3 text-xl">
                <BookOpen className="w-6 h-6 text-indigo-600" />
                <span>Journal History</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {journalEntries?.map((entry: any) => (
                  <div key={entry.id} className="p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-all border border-slate-100">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-black text-indigo-600 uppercase">Journal Entry</span>
                        <span className="text-xs font-bold text-slate-400">
                            {new Date(entry.date).toLocaleDateString()}
                        </span>
                    </div>
                    <p className="text-slate-700 leading-relaxed italic">
                        "{entry.content}"
                    </p>
                  </div>
                ))}
                
                {(!journalEntries || journalEntries.length === 0) && (
                  <div className="text-center py-12 text-slate-400">
                    <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-20" />
                    <p className="text-lg font-bold">No journals yet</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
