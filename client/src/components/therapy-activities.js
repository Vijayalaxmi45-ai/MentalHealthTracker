"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = TherapyActivities;
const react_query_1 = require("@tanstack/react-query");
const react_1 = require("react");
const queryClient_1 = require("@/lib/queryClient");
const use_toast_1 = require("@/hooks/use-toast");
const card_1 = require("@/components/ui/card");
const button_1 = require("@/components/ui/button");
const badge_1 = require("@/components/ui/badge");
const lucide_react_1 = require("lucide-react");
const activityIcons = {
    wind: lucide_react_1.Wind,
    "book-open": lucide_react_1.BookOpen,
    zap: lucide_react_1.Zap,
    footprints: lucide_react_1.Zap,
    heart: lucide_react_1.Heart,
    palette: lucide_react_1.Palette,
    scan: lucide_react_1.Scan,
    users: lucide_react_1.Users,
};
const difficultyColors = {
    beginner: "bg-[var(--mindtune-secondary)]/20 text-[var(--mindtune-secondary)]",
    intermediate: "bg-[var(--mindtune-accent)]/20 text-[var(--mindtune-accent)]",
    advanced: "bg-[var(--mindtune-primary)]/20 text-[var(--mindtune-primary)]",
    "all-levels": "bg-[var(--mindtune-primary)]/20 text-[var(--mindtune-primary)]",
};
const categoryColors = {
    breathing: "from-[var(--mindtune-secondary)] to-[var(--mindtune-primary)]",
    journaling: "from-[var(--mindtune-primary)] to-[var(--mindtune-accent)]",
    meditation: "from-[var(--mindtune-accent)] to-[var(--mindtune-secondary)]",
};
function TherapyActivities() {
    const { toast } = (0, use_toast_1.useToast)();
    const queryClient = (0, react_query_1.useQueryClient)();
    const [userMood, setUserMood] = (0, react_1.useState)("good");
    // Fetch user's latest mood
    const { data: moodEntries } = (0, react_query_1.useQuery)({
        queryKey: ["/api/mood-entries"],
    });
    // Fetch all therapy activities
    const { data: activities, isLoading } = (0, react_query_1.useQuery)({
        queryKey: ["/api/therapy-activities"],
    });
    // Update user mood based on latest entry
    (0, react_1.useEffect)(() => {
        if (moodEntries && moodEntries.length > 0) {
            setUserMood(moodEntries[0].mood);
        }
    }, [moodEntries]);
    const completionMutation = (0, react_query_1.useMutation)({
        mutationFn: (activityId) => __awaiter(this, void 0, void 0, function* () {
            const response = yield (0, queryClient_1.apiRequest)("POST", "/api/activity-completions", {
                activityId,
                rating: 5,
            });
            return response.json();
        }),
        onSuccess: () => {
            toast({
                title: "Activity completed!",
                description: "Great job on taking care of your mental health.",
            });
            queryClient.invalidateQueries({ queryKey: ["/api/activity-completions"] });
            queryClient.invalidateQueries({ queryKey: ["/api/user/stats"] });
        },
        onError: (error) => {
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive",
            });
        },
    });
    const handleStartActivity = (activity) => {
        completionMutation.mutate(activity.id);
    };
    // Filter activities based on user's current mood
    const recommendedActivities = (activities === null || activities === void 0 ? void 0 : activities.filter(activity => activity.moodRecommendations.includes(userMood))) || [];
    if (isLoading) {
        return (<card_1.Card className="border-[var(--mindtune-neutral-200)] shadow-sm">
        <card_1.CardHeader>
          <card_1.CardTitle className="text-lg font-semibold text-[var(--mindtune-neutral-800)]">
            Loading Activities...
          </card_1.CardTitle>
        </card_1.CardHeader>
        <card_1.CardContent>
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map(i => (<div key={i} className="h-24 bg-gray-200 rounded-xl"></div>))}
          </div>
        </card_1.CardContent>
      </card_1.Card>);
    }
    const displayActivities = recommendedActivities.length > 0 ? recommendedActivities : (activities === null || activities === void 0 ? void 0 : activities.slice(0, 3)) || [];
    return (<card_1.Card className="border-[var(--mindtune-neutral-200)] shadow-sm">
      <card_1.CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
        <card_1.CardTitle className="text-lg font-semibold text-[var(--mindtune-neutral-800)]">
          {recommendedActivities.length > 0 ? `Activities for ${userMood} mood` : "Recommended Activities"}
        </card_1.CardTitle>
        <lucide_react_1.Leaf className="w-5 h-5 text-[var(--mindtune-secondary)]"/>
      </card_1.CardHeader>

      <card_1.CardContent className="space-y-4">
        {displayActivities.length === 0 ? (<p className="text-[var(--mindtune-neutral-600)]">No activities available at the moment.</p>) : (displayActivities.map((activity) => {
            const IconComponent = activityIcons[activity.icon] || lucide_react_1.Brain;
            const categoryColor = categoryColors[activity.category] || categoryColors.meditation;
            const difficultyColor = difficultyColors[activity.difficulty] || difficultyColors.beginner;
            return (<div key={activity.id} className="therapy-card rounded-xl p-4 border border-[var(--mindtune-neutral-200)]">
                <div className="flex items-start space-x-3">
                  <div className={`w-10 h-10 bg-gradient-to-br ${categoryColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <IconComponent className="w-5 h-5 text-white"/>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-sm mb-1">{activity.name}</h4>
                    <p className="text-xs text-[var(--mindtune-neutral-600)] mb-2">{activity.description}</p>
                    <p className="text-xs text-[var(--mindtune-neutral-500)] mb-3 italic">{activity.instructions}</p>
                    <div className="flex items-center space-x-2">
                      <badge_1.Badge variant="secondary" className="text-xs bg-[var(--mindtune-secondary)]/20 text-[var(--mindtune-secondary)]">
                        {activity.duration} min
                      </badge_1.Badge>
                      <badge_1.Badge variant="secondary" className={`text-xs ${difficultyColor}`}>
                        {activity.difficulty}
                      </badge_1.Badge>
                    </div>
                  </div>
                </div>
                <button_1.Button onClick={() => handleStartActivity(activity)} disabled={completionMutation.isPending} className="w-full mt-4 bg-[var(--mindtune-secondary)] hover:bg-[var(--mindtune-secondary)]/90 text-white text-sm font-medium">
                  {completionMutation.isPending ? "Completing..." : "Complete Activity"}
                </button_1.Button>
              </div>);
        }))}
      </card_1.CardContent>
    </card_1.Card>);
}
