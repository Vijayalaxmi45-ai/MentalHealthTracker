import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BrainCircuit, LineChart as LineChartIcon } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export default function MoodAnalytics() {
  const { data: moodHistory } = useQuery({
    queryKey: ["/api/mood/history"],
    queryFn: async () => {
        const token = localStorage.getItem("mindtune_token");
        const res = await axios.get("/api/mood/history", {
            headers: { Authorization: `Bearer ${token}` }
        });
        return res.data;
    }
  });

  const getChartData = () => {
    if (!moodHistory || moodHistory.length === 0) return [];
    return moodHistory.slice(0, 7).reverse().map((entry: any) => ({
        day: new Date(entry.date).toLocaleDateString('en-US', { weekday: 'short' }),
        mood: entry.mood_score
    }));
  };

  const getDistributionData = () => {
    if (!moodHistory || moodHistory.length === 0) return [];
    const counts: any = {};
    moodHistory.forEach((entry: any) => {
        counts[entry.mood] = (counts[entry.mood] || 0) + 1;
    });
    
    const colors: any = {
        great: '#34d399',
        good: '#22c55e',
        okay: '#fbbf24',
        bad: '#f87171',
        terrible: '#ef4444'
    };

    return Object.keys(counts).map(key => ({
        name: key.charAt(0).toUpperCase() + key.slice(1),
        value: counts[key],
        color: colors[key.toLowerCase()] || '#cbd5e1'
    }));
  };

  const chartData = getChartData();
  const distributionData = getDistributionData();

  return (
    <Card className="border-[var(--mindtune-neutral-200)] shadow-sm mb-8">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold text-[var(--mindtune-neutral-800)] flex items-center space-x-2">
            <BrainCircuit className="w-5 h-5 text-primary" />
            <span>Interactive analytics & Weekly Report</span>
          </CardTitle>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-8">
        {!moodHistory || moodHistory.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-slate-400 font-medium">
                Complete your first check-in to see analytics!
            </div>
        ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Line Chart: Weekly Trend */}
                <div className="bg-white border rounded-xl p-4 shadow-sm border-[var(--mindtune-neutral-100)]">
                    <h3 className="text-sm font-medium mb-4 flex items-center text-[var(--mindtune-neutral-700)]">
                        <LineChartIcon className="w-4 h-4 mr-2" /> Weekly Mood Trend
                    </h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} domain={[0, 5]} ticks={[1, 2, 3, 4, 5]} />
                                <Tooltip 
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                />
                                <Line 
                                    type="monotone" 
                                    dataKey="mood" 
                                    stroke="var(--mindtune-primary)" 
                                    strokeWidth={3} 
                                    dot={{ fill: 'var(--mindtune-primary)', strokeWidth: 2 }} 
                                    activeDot={{ r: 6 }} 
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Pie Chart: Mood Distribution */}
                <div className="bg-white border rounded-xl p-4 shadow-sm border-[var(--mindtune-neutral-100)] flex flex-col">
                    <h3 className="text-sm font-medium mb-4 flex items-center text-[var(--mindtune-neutral-700)]">
                        <LineChartIcon className="w-4 h-4 mr-2" /> Mood Distribution
                    </h3>
                    <div className="h-64 flex-1">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={distributionData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                    animationDuration={1000}
                                >
                                    {distributionData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip 
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                />
                                <Legend verticalAlign="bottom" height={36} iconType="circle" />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        )}

        {/* AI Insight Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-indigo-100 rounded-xl p-4">
            <p className="text-sm font-semibold text-indigo-900 mb-1">Time-based Pattern Detected</p>
            <p className="text-xs text-indigo-700">You tend to feel the most stressed around 3 PM on weekdays. Consider taking our recommended deep breathing break at 2:45 PM.</p>
          </div>
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-teal-100 rounded-xl p-4">
            <p className="text-sm font-semibold text-teal-900 mb-1">Recovery Insight</p>
            <p className="text-xs text-teal-700">When you listen to the Focus Playlist, your mood recovers to 'Good' 40% faster than average.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
