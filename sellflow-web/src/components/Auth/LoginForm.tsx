import React, { useState } from "react";
import { Mail, Lock, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { AuthField } from "./AuthField";
import { authService } from "../../Services/auth";

interface LoginFormProps {
  onSwitch: () => void;
}

interface LoginData {
  email: string;
  password: string;
}

export function LoginForm({ onSwitch }: LoginFormProps) {
  const navigate = useNavigate();

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

      console.log("Login Success", response.data);

      localStorage.setItem(
        "token",
        response.data.data.token
      );

      navigate("/dashboard");

    } catch (error: any) {
      console.error(error);

      alert(
        error.response?.data?.message ??
          "Login failed."
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
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="rounded border-line text-brand"
            />
            Remember me
          </label>

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
          className="w-full bg-brand text-white py-3 rounded-xl font-semibold disabled:opacity-60"
        >
          {loading ? "Signing In..." : "Sign In"}

          {!loading && (
            <ArrowRight className="w-4 h-4 inline ml-2" />
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