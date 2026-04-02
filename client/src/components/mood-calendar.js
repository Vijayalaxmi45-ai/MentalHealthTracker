"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = MoodCalendar;
const react_query_1 = require("@tanstack/react-query");
const react_1 = require("react");
const card_1 = require("@/components/ui/card");
const button_1 = require("@/components/ui/button");
const lucide_react_1 = require("lucide-react");
const moodEmojis = {
    terrible: "😢",
    bad: "😔",
    okay: "😐",
    good: "😊",
    great: "😄"
};
const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
function MoodCalendar() {
    const [timeFrame, setTimeFrame] = (0, react_1.useState)('week');
    const { data: moodEntries } = (0, react_query_1.useQuery)({
        queryKey: ["/api/mood-entries"],
    });
    const { data: stats } = (0, react_query_1.useQuery)({
        queryKey: ["/api/user/stats"],
    });
    // Generate calendar days for the current month
    const generateCalendarDays = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth();
        // Get first day of the month and how many days in month
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();
        const calendarDays = [];
        // Add empty cells for days before the first day of the month
        for (let i = 0; i < startingDayOfWeek; i++) {
            calendarDays.push(null);
        }
        // Add all days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const dateString = new Date(year, month, day).toISOString().split('T')[0];
            const moodEntry = moodEntries === null || moodEntries === void 0 ? void 0 : moodEntries.find((entry) => entry.date === dateString);
            calendarDays.push({
                day,
                date: dateString,
                mood: (moodEntry === null || moodEntry === void 0 ? void 0 : moodEntry.mood) || null,
                hasEntry: !!moodEntry
            });
        }
        return calendarDays;
    };
    const calendarDays = generateCalendarDays();
    // Calculate progress percentages
    const progressPercentages = {
        positive: (stats === null || stats === void 0 ? void 0 : stats.totalDays) > 0 ? Math.round((stats.positiveDays / stats.totalDays) * 100) : 0,
        activities: Math.min(100, Math.round(((stats === null || stats === void 0 ? void 0 : stats.weeklyActivities) || 0) / 7 * 100)),
        consistency: (stats === null || stats === void 0 ? void 0 : stats.totalDays) > 0 ? Math.min(100, Math.round((stats.currentStreak / 7) * 100)) : 0,
    };
    const getStrokeDashoffset = (percentage) => {
        const circumference = 176; // 2 * π * 28 (radius)
        return circumference - (circumference * percentage / 100);
    };
    return (<card_1.Card className="border-[var(--mindtune-neutral-200)] shadow-sm mb-8">
      <card_1.CardHeader>
        <div className="flex items-center justify-between">
          <card_1.CardTitle className="text-xl font-semibold text-[var(--mindtune-neutral-800)] flex items-center space-x-2">
            <lucide_react_1.Calendar className="w-5 h-5 text-[var(--mindtune-primary)]"/>
            <span>Your Mood Journey</span>
          </card_1.CardTitle>
          <div className="flex items-center space-x-2">
            <button_1.Button variant={timeFrame === 'week' ? 'default' : 'outline'} size="sm" onClick={() => setTimeFrame('week')} className={timeFrame === 'week' ? 'bg-[var(--mindtune-primary)] text-white' : ''}>
              Week
            </button_1.Button>
            <button_1.Button variant={timeFrame === 'month' ? 'default' : 'outline'} size="sm" onClick={() => setTimeFrame('month')} className={timeFrame === 'month' ? 'bg-[var(--mindtune-primary)] text-white' : ''}>
              Month
            </button_1.Button>
            <button_1.Button variant={timeFrame === 'year' ? 'default' : 'outline'} size="sm" onClick={() => setTimeFrame('year')} className={timeFrame === 'year' ? 'bg-[var(--mindtune-primary)] text-white' : ''}>
              Year
            </button_1.Button>
          </div>
        </div>
      </card_1.CardHeader>

      <card_1.CardContent className="space-y-6">
        {/* Calendar Grid */}
        <div>
          <h3 className="text-lg font-medium text-[var(--mindtune-neutral-800)] mb-4">
            {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </h3>
          
          <div className="grid grid-cols-7 gap-2 mb-6">
            {/* Day headers */}
            {dayNames.map((day) => (<div key={day} className="text-center text-xs font-medium text-[var(--mindtune-neutral-500)] p-2">
                {day}
              </div>))}
            
            {/* Calendar days */}
            {calendarDays.map((dayData, index) => (<div key={index} className="aspect-square flex items-center justify-center">
                {dayData ? (<div className="w-full h-full flex flex-col items-center justify-center rounded-lg cursor-pointer hover:bg-[var(--mindtune-neutral-50)] transition-colors relative" title={dayData.hasEntry ? `Mood: ${dayData.mood}` : 'No entry'}>
                    {dayData.hasEntry && dayData.mood ? (<span className="text-lg">
                        {moodEmojis[dayData.mood]}
                      </span>) : (<span className="text-sm text-[var(--mindtune-neutral-400)]">
                        {dayData.day}
                      </span>)}
                    {dayData.day === new Date().getDate() && (<div className="absolute bottom-1 w-1 h-1 bg-[var(--mindtune-primary)] rounded-full"></div>)}
                  </div>) : (<div></div>)}
              </div>))}
          </div>
        </div>

        {/* Mood Trends */}
        <div>
          <h3 className="text-lg font-medium text-[var(--mindtune-neutral-800)] mb-4 flex items-center space-x-2">
            <lucide_react_1.TrendingUp className="w-5 h-5 text-[var(--mindtune-primary)]"/>
            <span>Progress Overview</span>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Positive Days */}
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-3 relative">
                <svg className="w-16 h-16 transform -rotate-90">
                  <circle cx="32" cy="32" r="28" stroke="var(--mindtune-neutral-200)" strokeWidth="4" fill="none"/>
                  <circle cx="32" cy="32" r="28" stroke="var(--mindtune-secondary)" strokeWidth="4" fill="none" strokeDasharray="176" strokeDashoffset={getStrokeDashoffset(progressPercentages.positive)} className="progress-ring"/>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-semibold text-[var(--mindtune-secondary)]">
                    {progressPercentages.positive}%
                  </span>
                </div>
              </div>
              <p className="text-sm font-medium text-[var(--mindtune-neutral-800)]">Positive Days</p>
              <p className="text-xs text-[var(--mindtune-neutral-600)]">
                {(stats === null || stats === void 0 ? void 0 : stats.positiveDays) || 0} out of {(stats === null || stats === void 0 ? void 0 : stats.totalDays) || 0} days
              </p>
            </div>

            {/* Activities */}
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-3 relative">
                <svg className="w-16 h-16 transform -rotate-90">
                  <circle cx="32" cy="32" r="28" stroke="var(--mindtune-neutral-200)" strokeWidth="4" fill="none"/>
                  <circle cx="32" cy="32" r="28" stroke="var(--mindtune-primary)" strokeWidth="4" fill="none" strokeDasharray="176" strokeDashoffset={getStrokeDashoffset(progressPercentages.activities)} className="progress-ring"/>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-semibold text-[var(--mindtune-primary)]">
                    {progressPercentages.activities}%
                  </span>
                </div>
              </div>
              <p className="text-sm font-medium text-[var(--mindtune-neutral-800)]">Activities</p>
              <p className="text-xs text-[var(--mindtune-neutral-600)]">
                {(stats === null || stats === void 0 ? void 0 : stats.weeklyActivities) || 0} completed this week
              </p>
            </div>

            {/* Consistency */}
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-3 relative">
                <svg className="w-16 h-16 transform -rotate-90">
                  <circle cx="32" cy="32" r="28" stroke="var(--mindtune-neutral-200)" strokeWidth="4" fill="none"/>
                  <circle cx="32" cy="32" r="28" stroke="var(--mindtune-accent)" strokeWidth="4" fill="none" strokeDasharray="176" strokeDashoffset={getStrokeDashoffset(progressPercentages.consistency)} className="progress-ring"/>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-semibold text-[var(--mindtune-accent)]">
                    {progressPercentages.consistency}%
                  </span>
                </div>
              </div>
              <p className="text-sm font-medium text-[var(--mindtune-neutral-800)]">Consistency</p>
              <p className="text-xs text-[var(--mindtune-neutral-600)]">
                {(stats === null || stats === void 0 ? void 0 : stats.currentStreak) || 0} day streak
              </p>
            </div>
          </div>
        </div>

        {/* Empty State */}
        {(!moodEntries || moodEntries.length === 0) && (<div className="text-center py-12">
            <lucide_react_1.Calendar className="w-16 h-16 mx-auto mb-4 text-[var(--mindtune-neutral-300)]"/>
            <h3 className="text-lg font-medium text-[var(--mindtune-neutral-600)] mb-2">
              No mood entries yet
            </h3>
            <p className="text-[var(--mindtune-neutral-500)] mb-4">
              Start tracking your mood to see your journey visualized here
            </p>
            <button_1.Button className="bg-[var(--mindtune-primary)] hover:bg-[var(--mindtune-primary)]/90 text-white">
              Start Your First Check-in
            </button_1.Button>
          </div>)}
      </card_1.CardContent>
    </card_1.Card>);
}
