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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = MoodCheck;
const react_1 = require("react");
const react_query_1 = require("@tanstack/react-query");
const wouter_1 = require("wouter");
const queryClient_1 = require("@/lib/queryClient");
const use_toast_1 = require("@/hooks/use-toast");
const header_1 = __importDefault(require("@/components/header"));
const bottom_nav_1 = __importDefault(require("@/components/bottom-nav"));
const mood_selector_1 = __importDefault(require("@/components/mood-selector"));
const card_1 = require("@/components/ui/card");
const button_1 = require("@/components/ui/button");
const textarea_1 = require("@/components/ui/textarea");
const lucide_react_1 = require("lucide-react");
function MoodCheck() {
    var _a, _b;
    const [selectedMood, setSelectedMood] = (0, react_1.useState)(null);
    const [journalEntry, setJournalEntry] = (0, react_1.useState)("");
    const [aiInsights, setAiInsights] = (0, react_1.useState)(null);
    const { toast } = (0, use_toast_1.useToast)();
    const queryClient = (0, react_query_1.useQueryClient)();
    const [, setLocation] = (0, wouter_1.useLocation)();
    const moodMutation = (0, react_query_1.useMutation)({
        mutationFn: (data) => __awaiter(this, void 0, void 0, function* () {
            const response = yield (0, queryClient_1.apiRequest)("POST", "/api/mood-entries", data);
            return response.json();
        }),
        onSuccess: () => {
            toast({
                title: "Mood logged successfully!",
                description: "Your daily check-in has been saved.",
            });
            queryClient.invalidateQueries({ queryKey: ["/api/mood-entries"] });
            queryClient.invalidateQueries({ queryKey: ["/api/user/stats"] });
            setLocation("/");
        },
        onError: (error) => {
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive",
            });
        },
    });
    const aiInsightsMutation = (0, react_query_1.useMutation)({
        mutationFn: (data) => __awaiter(this, void 0, void 0, function* () {
            const response = yield (0, queryClient_1.apiRequest)("POST", "/api/ai/suggestion", data);
            return response.json();
        }),
        onSuccess: (data) => {
            setAiInsights(data);
        },
        onError: (error) => {
            console.error("Failed to get AI insights:", error);
        },
    });
    const handleMoodSelect = (mood) => {
        setSelectedMood(mood);
        // Get AI insights if journal entry exists
        if (journalEntry.trim()) {
            aiInsightsMutation.mutate({ mood, text: journalEntry });
        }
    };
    const handleJournalChange = (value) => {
        setJournalEntry(value);
        // Get AI insights if mood is selected and text is substantial
        if (selectedMood && value.trim().length > 20) {
            aiInsightsMutation.mutate({ mood: selectedMood, text: value });
        }
    };
    const handleSubmit = () => {
        if (!selectedMood) {
            toast({
                title: "Please select a mood",
                description: "Choose how you're feeling today before saving.",
                variant: "destructive",
            });
            return;
        }
        const today = new Date().toISOString().split('T')[0];
        moodMutation.mutate({
            mood: selectedMood,
            journalEntry: journalEntry.trim() || undefined,
            date: today,
        });
    };
    return (<div className="min-h-screen bg-[var(--mindtune-neutral-50)]">
      <header_1.default />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 md:pb-8">
        <card_1.Card className="border-[var(--mindtune-neutral-200)] shadow-sm">
          <card_1.CardHeader>
            <div className="flex items-center justify-between">
              <card_1.CardTitle className="text-xl font-semibold text-[var(--mindtune-neutral-800)]">
                Daily Mood Check-in
              </card_1.CardTitle>
              <span className="text-sm text-[var(--mindtune-neutral-500)]">
                Today, {new Date().toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        })}
              </span>
            </div>
          </card_1.CardHeader>

          <card_1.CardContent className="space-y-6">
            {/* Mood Selection */}
            <div>
              <p className="text-[var(--mindtune-neutral-600)] mb-4">
                How are you feeling right now?
              </p>
              <mood_selector_1.default selectedMood={selectedMood} onMoodSelect={handleMoodSelect}/>
            </div>

            {/* Journal Entry */}
            <div>
              <label className="block text-sm font-medium text-[var(--mindtune-neutral-700)] mb-2">
                Tell us more about your day (optional)
              </label>
              <textarea_1.Textarea value={journalEntry} onChange={(e) => handleJournalChange(e.target.value)} className="w-full px-4 py-3 border border-[var(--mindtune-neutral-300)] rounded-xl focus:ring-2 focus:ring-[var(--mindtune-primary)] focus:border-transparent resize-none" rows={4} placeholder="Had a great morning walk and feeling energized for the day ahead..."/>
            </div>

            {/* AI Insights */}
            {aiInsights && (<card_1.Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
                <card_1.CardHeader className="pb-3">
                  <div className="flex items-center space-x-2">
                    <lucide_react_1.Brain className="w-5 h-5 text-[var(--mindtune-primary)]"/>
                    <card_1.CardTitle className="text-lg">AI Insights</card_1.CardTitle>
                  </div>
                </card_1.CardHeader>
                <card_1.CardContent className="space-y-3">
                  {((_b = (_a = aiInsights.analysis) === null || _a === void 0 ? void 0 : _a.detectedEmotions) === null || _b === void 0 ? void 0 : _b.length) > 0 && (<div>
                      <p className="text-sm font-medium text-[var(--mindtune-neutral-700)] mb-1">
                        Detected emotions:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {aiInsights.analysis.detectedEmotions.map((emotion, index) => (<span key={index} className="px-2 py-1 bg-[var(--mindtune-primary)]/10 text-[var(--mindtune-primary)] rounded-full text-xs">
                            {emotion}
                          </span>))}
                      </div>
                    </div>)}
                  
                  {aiInsights.suggestion && (<div>
                      <p className="text-sm font-medium text-[var(--mindtune-neutral-700)] mb-1">
                        Personalized suggestion:
                      </p>
                      <p className="text-sm text-[var(--mindtune-neutral-600)]">
                        {aiInsights.suggestion}
                      </p>
                    </div>)}
                </card_1.CardContent>
              </card_1.Card>)}

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-4">
              <div className="flex items-center space-x-4">
                <button className="flex items-center space-x-2 text-[var(--mindtune-neutral-600)] hover:text-[var(--mindtune-primary)] transition-colors">
                  <lucide_react_1.Mic className="w-4 h-4"/>
                  <span className="text-sm">Voice note</span>
                </button>
                <button className="flex items-center space-x-2 text-[var(--mindtune-neutral-600)] hover:text-[var(--mindtune-primary)] transition-colors">
                  <lucide_react_1.Image className="w-4 h-4"/>
                  <span className="text-sm">Add photo</span>
                </button>
              </div>
              
              <button_1.Button onClick={handleSubmit} disabled={moodMutation.isPending} className="bg-[var(--mindtune-primary)] hover:bg-[var(--mindtune-primary)]/90 text-white px-6 py-3 rounded-xl font-medium">
                {moodMutation.isPending ? "Saving..." : "Save Check-in"}
              </button_1.Button>
            </div>
          </card_1.CardContent>
        </card_1.Card>
      </main>

      <bottom_nav_1.default />
    </div>);
}
