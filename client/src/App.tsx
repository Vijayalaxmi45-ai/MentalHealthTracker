import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import Dashboard from "@/pages/dashboard";
import MoodCheck from "@/pages/mood-check";
import History from "@/pages/history";
import Support from "@/pages/support";
import Games from "@/pages/games";
import FocusMode from "@/pages/focus";

import AuthPage from "@/pages/auth";
import { useLocation } from "wouter";
import { useEffect } from "react";

function ProtectedRoute({ component: Component, ...props }: any) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setLocation("/auth");
    }
  }, [isLoading, isAuthenticated, setLocation]);

  if (isLoading) return null;
  return isAuthenticated ? <Component {...props} /> : null;
}

function Router() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-primary rounded-2xl flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-muted-foreground">Loading MindTune...</p>
        </div>
      </div>
    );
  }

  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/auth" component={AuthPage} />
      <Route path="/dashboard">
          <ProtectedRoute component={Dashboard} />
      </Route>
      <Route path="/mood-check">
          <ProtectedRoute component={MoodCheck} />
      </Route>
      <Route path="/history">
          <ProtectedRoute component={History} />
      </Route>
      <Route path="/support">
          <ProtectedRoute component={Support} />
      </Route>
      <Route path="/games">
          <ProtectedRoute component={Games} />
      </Route>
      <Route path="/focus">
          <ProtectedRoute component={FocusMode} />
      </Route>
      <Route path="/:rest*" component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
