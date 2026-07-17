import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { authService } from "../../Services/auth";
import { useAuth } from "./AuthContext";

type SessionState = "checking" | "authenticated" | "guest";

export function ProtectedRoute() {
  const location = useLocation();
  const { setSession: setAuthSession, clearSession } = useAuth();
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
        <div className="text-center">
          <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-purple-100 border-t-purple-600" />
          <p className="mt-3 text-sm font-medium text-slate-500">
            Checking your session…
          </p>
        </div>
      </div>
    );
  }

  return session === "authenticated" ? (
    <Outlet />
  ) : (
    <Navigate
      to="/"
      replace
      state={{ from: `${location.pathname}${location.search}` }}
    />
  );
}
