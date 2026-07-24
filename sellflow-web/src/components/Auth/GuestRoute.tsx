import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { authService } from "../../Services/auth";
import { useAuth } from "./AuthContext";

type SessionState = "checking" | "authenticated" | "guest";

export function GuestRoute() {
  const { setSession: setAuthSession, clearSession, user } = useAuth();
  const [session, setSession] = useState<SessionState>("checking");

  useEffect(() => {
    let active = true;
    const token = localStorage.getItem("token");

    if (!token) {
      setSession("guest");
      return;
    }

    authService.me(token)
      .then((response) => {
        if (active) {
          setAuthSession(token, response.data.data);
          setSession("authenticated");
        }
      })
      .catch(() => {
        clearSession();
        if (active) setSession("guest");
      });

    return () => {
      active = false;
    };
  }, [clearSession, setAuthSession]);

  if (session === "checking") {
    return (
      <div className="grid min-h-screen place-items-center bg-slate-50">
        <div className="h-9 w-9 animate-spin rounded-full border-4 border-purple-100 border-t-purple-600" />
      </div>
    );
  }

  return session === "authenticated" ? (
    <Navigate to={user?.has_business ? "/dashboard" : "/onboarding"} replace />
  ) : (
    <Outlet />
  );
}
