"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Dashboard;
const react_query_1 = require("@tanstack/react-query");
const useAuth_1 = require("@/hooks/useAuth");
const wouter_1 = require("wouter");
const header_1 = __importDefault(require("@/components/header"));
const bottom_nav_1 = __importDefault(require("@/components/bottom-nav"));
const mood_calendar_1 = __importDefault(require("@/components/mood-calendar"));
const music_player_1 = __importDefault(require("@/components/music-player"));
const therapy_activities_1 = __importDefault(require("@/components/therapy-activities"));
const emergency_support_1 = __importDefault(require("@/components/emergency-support"));
const card_1 = require("@/components/ui/card");
const button_1 = require("@/components/ui/button");
const lucide_react_1 = require("lucide-react");
function Dashboard() {
    const { user } = (0, useAuth_1.useAuth)();
    const { data: stats } = (0, react_query_1.useQuery)({
        queryKey: ["/api/user/stats"],
    });
    const { data: recentEntries } = (0, react_query_1.useQuery)({
        queryKey: ["/api/mood-entries"],
    });
    const userName = (user === null || user === void 0 ? void 0 : user.firstName) || "there";
    const currentHour = new Date().getHours();
    const greeting = currentHour < 12 ? "Good morning" : currentHour < 18 ? "Good afternoon" : "Good evening";
    return (<div className="min-h-screen bg-[var(--mindtune-neutral-50)]">
      <header_1.default />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 md:pb-8">
        {/* Welcome Section */}
        <section className="mb-8 animate-fade-in">
          <div className="bg-gradient-to-r from-[var(--mindtune-primary)] to-[var(--mindtune-secondary)] rounded-2xl p-8 text-white relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-2xl md:text-3xl font-semibold mb-2">
                {greeting}, {userName}! 🌅
              </h2>
              <p className="text-lg opacity-90 mb-6">
                How are you feeling today? Take a moment to check in with yourself.
              </p>
              <wouter_1.Link href="/mood-check">
                <button_1.Button className="bg-white text-[var(--mindtune-primary)] hover:bg-white/90 px-6 py-3 rounded-xl font-medium">
                  <lucide_react_1.Heart className="w-4 h-4 mr-2"/>
                  Start Daily Check-in
                </button_1.Button>
              </wouter_1.Link>
            </div>
            <div className="absolute -right-4 -top-4 w-32 h-32 bg-white opacity-10 rounded-full"></div>
            <div className="absolute -right-8 -bottom-8 w-24 h-24 bg-white opacity-5 rounded-full"></div>
          </div>
        </section>

        {/* Quick Stats */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <card_1.Card className="border-[var(--mindtune-neutral-200)] shadow-sm">
            <card_1.CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <card_1.CardTitle className="text-sm font-medium">Current Streak</card_1.CardTitle>
              <div className="w-12 h-12 bg-gradient-to-br from-[var(--mindtune-secondary)] to-[var(--mindtune-primary)] rounded-xl flex items-center justify-center">
                <lucide_react_1.Flame className="w-6 h-6 text-white"/>
              </div>
            </card_1.CardHeader>
            <card_1.CardContent>
              <div className="text-3xl font-bold text-[var(--mindtune-primary)] mb-2">
                {(stats === null || stats === void 0 ? void 0 : stats.currentStreak) || 0}
              </div>
              <p className="text-[var(--mindtune-neutral-600)] text-sm">days in a row</p>
            </card_1.CardContent>
          </card_1.Card>

          <card_1.Card className="border-[var(--mindtune-neutral-200)] shadow-sm">
            <card_1.CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <card_1.CardTitle className="text-sm font-medium">This Week</card_1.CardTitle>
              <div className="w-12 h-12 bg-gradient-to-br from-[var(--mindtune-accent)] to-[var(--mindtune-primary)] rounded-xl flex items-center justify-center">
                <lucide_react_1.TrendingUp className="w-6 h-6 text-white"/>
              </div>
            </card_1.CardHeader>
            <card_1.CardContent>
              <div className="text-3xl font-bold text-[var(--mindtune-secondary)] mb-2">
                {(stats === null || stats === void 0 ? void 0 : stats.averageMood) || 0}
              </div>
              <p className="text-[var(--mindtune-neutral-600)] text-sm">average mood</p>
            </card_1.CardContent>
          </card_1.Card>

          <card_1.Card className="border-[var(--mindtune-neutral-200)] shadow-sm">
            <card_1.CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <card_1.CardTitle className="text-sm font-medium">Activities</card_1.CardTitle>
              <div className="w-12 h-12 bg-gradient-to-br from-[var(--mindtune-primary)] to-[var(--mindtune-accent)] rounded-xl flex items-center justify-center">
                <lucide_react_1.Leaf className="w-6 h-6 text-white"/>
              </div>
            </card_1.CardHeader>
            <card_1.CardContent>
              <div className="text-3xl font-bold text-[var(--mindtune-accent)] mb-2">
                {(stats === null || stats === void 0 ? void 0 : stats.weeklyActivities) || 0}
              </div>
              <p className="text-[var(--mindtune-neutral-600)] text-sm">completed this week</p>
            </card_1.CardContent>
          </card_1.Card>
        </section>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <music_player_1.default />
          <therapy_activities_1.default />
        </div>

        {/* Mood History */}
        <mood_calendar_1.default />

        {/* Emergency Support */}
        <emergency_support_1.default />
      </main>

      <bottom_nav_1.default />
    </div>);
}
