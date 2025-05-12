import { Switch, Route, useLocation } from "wouter";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import Tasks from "@/pages/tasks";
import Subjects from "@/pages/subjects";
import StudySessions from "@/pages/study-sessions";
import Notes from "@/pages/notes";
import Goals from "@/pages/goals";
import AuthPage from "@/pages/auth-page";
import UserInfoPage from "@/pages/user-info-page";
import AppShell from "@/components/layout/app-shell";
import { ThemeProvider } from "./hooks/use-theme";
import { ProtectedRoute } from "./lib/protected-route";
import { useLocalStorage } from "@/hooks/use-local-storage";

function Router() {
  return (
    <Switch>
      <ProtectedRoute path="/" component={Dashboard} />
      <ProtectedRoute path="/tasks" component={Tasks} />
      <ProtectedRoute path="/subjects" component={Subjects} />
      <ProtectedRoute path="/sessions" component={StudySessions} />
      <ProtectedRoute path="/notes" component={Notes} />
      <ProtectedRoute path="/goals" component={Goals} />
      <Route path="/auth" component={AuthPage} />
      <Route path="/user-info" component={UserInfoPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [location] = useLocation();
  const [userData] = useLocalStorage<{
    user: null | { 
      name: string; 
      initials: string; 
      role: string;
      age?: string;
      educationLevel?: string;
      institute?: string;
      studyGoal?: string;
    }
  }>("studyTrackerData", { 
    user: null
  });
  
  // If we're on the auth page or user-info page, don't show the AppShell
  const isAuthPage = location === "/auth";
  const isUserInfoPage = location.startsWith("/user-info");
  
  // If user is not logged in and not on auth page or user-info page, redirect to auth
  if (!userData.user && !isAuthPage && !isUserInfoPage) {
    return (
      <ThemeProvider>
        <TooltipProvider>
          <AuthPage />
        </TooltipProvider>
      </ThemeProvider>
    );
  }
  
  return (
    <ThemeProvider>
      <TooltipProvider>
        {isAuthPage || isUserInfoPage ? (
          <Router />
        ) : (
          <AppShell>
            <Router />
          </AppShell>
        )}
      </TooltipProvider>
    </ThemeProvider>
  );
}

export default App;
