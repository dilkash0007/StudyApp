import { ReactNode } from "react";
import { Route, Redirect } from "wouter";
import { useLocalStorage } from "@/hooks/use-local-storage";

interface ProtectedRouteProps {
  path: string;
  component: () => ReactNode;
}

export function ProtectedRoute({ path, component: Component }: ProtectedRouteProps) {
  const [userData] = useLocalStorage("studyTrackerData", { user: null });

  return (
    <Route
      path={path}
      component={() => {
        if (userData.user) {
          return <Component />;
        } else {
          return <Redirect to="/auth" />;
        }
      }}
    />
  );
}