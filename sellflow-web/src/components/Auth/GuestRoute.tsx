import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { authService } from "../../Services/auth";

type SessionState = "checking" | "authenticated" | "guest";

export function GuestRoute() {
  const [session, setSession] = useState<SessionState>("checking");

  useEffect(() => {
    let active = true;
    const token = localStorage.getItem("token");

    if (!token) {
      setSession("guest");
      return;
    }

    authService.me(token)
      .then(() => {
        if (active) setSession("authenticated");
      })
      .catch(() => {
        localStorage.removeItem("token");
        if (active) setSession("guest");
      });

    return () => {
      active = false;
    };
  }, []);

  if (session === "checking") {
    return (
      <div className="grid min-h-screen place-items-center bg-slate-50">
        <div className="h-9 w-9 animate-spin rounded-full border-4 border-purple-100 border-t-purple-600" />
      </div>
    );
  }

  return session === "authenticated" ? (
    <Navigate to="/dashboard" replace />
  ) : (
    <Outlet />
  );
}
