import { Switch, Route } from "wouter";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import Tasks from "@/pages/tasks";
import Subjects from "@/pages/subjects";
import StudySessions from "@/pages/study-sessions";
import Notes from "@/pages/notes";
import Goals from "@/pages/goals";
import AppShell from "@/components/layout/app-shell";
import { ThemeProvider } from "./hooks/use-theme";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/tasks" component={Tasks} />
      <Route path="/subjects" component={Subjects} />
      <Route path="/sessions" component={StudySessions} />
      <Route path="/notes" component={Notes} />
      <Route path="/goals" component={Goals} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ThemeProvider>
      <TooltipProvider>
        <AppShell>
          <Router />
        </AppShell>
      </TooltipProvider>
    </ThemeProvider>
  );
}

export default App;
