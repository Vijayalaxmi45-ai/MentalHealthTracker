"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const wouter_1 = require("wouter");
const queryClient_1 = require("./lib/queryClient");
const react_query_1 = require("@tanstack/react-query");
const toaster_1 = require("@/components/ui/toaster");
const tooltip_1 = require("@/components/ui/tooltip");
const useAuth_1 = require("@/hooks/useAuth");
const not_found_1 = __importDefault(require("@/pages/not-found"));
const landing_1 = __importDefault(require("@/pages/landing"));
const dashboard_1 = __importDefault(require("@/pages/dashboard"));
const mood_check_1 = __importDefault(require("@/pages/mood-check"));
const history_1 = __importDefault(require("@/pages/history"));
const support_1 = __importDefault(require("@/pages/support"));
function Router() {
    const { isAuthenticated, isLoading } = (0, useAuth_1.useAuth)();
    if (isLoading) {
        return (<div className="min-h-screen flex items-center justify-center bg-[var(--mindtune-neutral-50)]">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-[var(--mindtune-primary)] to-[var(--mindtune-secondary)] rounded-2xl flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-[var(--mindtune-neutral-600)]">Loading MindTune...</p>
        </div>
      </div>);
    }
    return (<wouter_1.Switch>
      {!isAuthenticated ? (<wouter_1.Route path="/" component={landing_1.default}/>) : (<>
          <wouter_1.Route path="/" component={dashboard_1.default}/>
          <wouter_1.Route path="/mood-check" component={mood_check_1.default}/>
          <wouter_1.Route path="/history" component={history_1.default}/>
          <wouter_1.Route path="/support" component={support_1.default}/>
        </>)}
      <wouter_1.Route component={not_found_1.default}/>
    </wouter_1.Switch>);
}
function App() {
    return (<react_query_1.QueryClientProvider client={queryClient_1.queryClient}>
      <tooltip_1.TooltipProvider>
        <toaster_1.Toaster />
        <Router />
      </tooltip_1.TooltipProvider>
    </react_query_1.QueryClientProvider>);
}
exports.default = App;
