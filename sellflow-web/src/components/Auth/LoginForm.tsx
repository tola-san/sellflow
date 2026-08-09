import React, { useState } from "react";
import { Mail, Lock, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { AuthField } from "./AuthField";
import { authService } from "../../Services/auth";
import { useToast } from "../ui/ToastContext";
import { useAuth } from "../../components/Auth/AuthContext";

interface LoginFormProps {
  onSwitch: () => void;
}

interface LoginData {
  email: string;
  password: string;
}

export function LoginForm({ onSwitch }: LoginFormProps) {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { closeAuth, setSession } = useAuth();

  const [form, setForm] = useState<LoginData>({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await authService.login(form);

      setSession(response.data.data.token, response.data.data.user ?? {
        email: form.email,
        name: form.email.split('@')[0],
      });

      closeAuth(); // Close the auth modal
      showToast("Welcome back! You have signed in successfully.");
      navigate(response.data.data.user?.has_business ? "/dashboard" : "/onboarding");

    } catch (error: any) {
      console.error(error);

      showToast(
        error.response?.data?.message ??
          "Login failed.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="font-display text-2xl font-bold text-ink">
          Welcome back
        </h2>

        <p className="text-sm text-muted mt-1">
          Sign in to manage your SellFlow catalog.
        </p>
      </div>

      <div className="flex items-center gap-3 my-6">
        <div className="h-px flex-1 bg-line" />

        <span className="text-xs font-medium text-muted">
          or continue with email
        </span>

        <div className="h-px flex-1 bg-line" />
      </div>

      <form
        className="space-y-4"
        onSubmit={handleSubmit}
      >
        <AuthField
          id="email"
          label="Email"
          type="email"
          placeholder="you@business.com"
          icon={Mail}
          autoComplete="email"
          value={form.email}
          onChange={handleChange}
        />

        <AuthField
          id="password"
          label="Password"
          type="password"
          placeholder="••••••••"
          icon={Lock}
          autoComplete="current-password"
          value={form.password}
          onChange={handleChange}
        />

        <div className="flex items-center justify-between text-sm">
          <span className="text-xs text-muted">Signed in for this browser session</span>
          <button
            type="button"
            className="text-brand hover:underline"
          >
            Forgot password?
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-brand text-white py-3 rounded-xl font-semibold disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {loading ? "Signing In..." : "Sign In"}

          {!loading && (
            <ArrowRight className="w-4 h-4" />
          )}
        </button>
      </form>

      <p className="text-center text-sm mt-6">
        Don't have an account?

        <button
          type="button"
          onClick={onSwitch}
          className="ml-2 font-semibold text-brand hover:underline"
        >
          Sign up free
        </button>
      </p>
    </div>
  );
}
