import React, { useState } from "react";
import { Mail, Lock, User, ArrowRight } from "lucide-react";
import { AuthField } from "./AuthField";
import { authService } from "../../Services/auth";

interface RegisterFormProps {
  onSwitch: () => void;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export function RegisterForm({ onSwitch }: RegisterFormProps) {
  const [form, setForm] = useState<RegisterData>({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

      const response = await authService.register(form);

      console.log(response.data);

      alert("Registration successful!");

      // Optional:
      // localStorage.setItem(
      //   "token",
      //   response.data.data.token
      // );

      // redirect("/dashboard");

    } catch (error: any) {
      console.error(error);

      alert(
        error.response?.data?.message ??
          "Registration failed."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="font-display text-2xl font-bold text-ink">
          Create your account
        </h2>

        <p className="text-sm text-muted mt-1">
          Free forever. Set up your digital catalog in minutes.
        </p>
      </div>

      <div className="flex items-center gap-3 my-6">
        <div className="h-px flex-1 bg-line" />

        <span className="text-xs font-medium text-muted">
          or sign up with email
        </span>

        <div className="h-px flex-1 bg-line" />
      </div>

      <form
        className="space-y-4"
        onSubmit={handleSubmit}
      >
        <AuthField
          id="name"
          label="Full Name"
          type="text"
          placeholder="Jane Doe"
          icon={User}
          autoComplete="name"
          value={form.name}
          onChange={handleChange}
        />

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
          placeholder="At least 8 characters"
          icon={Lock}
          autoComplete="new-password"
          value={form.password}
          onChange={handleChange}
        />

        <AuthField
          id="password_confirmation"
          label="Confirm Password"
          type="password"
          placeholder="Confirm your password"
          icon={Lock}
          autoComplete="new-password"
          value={form.password_confirmation}
          onChange={handleChange}
        />

        <label className="flex items-start gap-2 text-xs text-muted cursor-pointer">
          <input
            type="checkbox"
            required
            className="mt-0.5 rounded border-line text-brand focus:ring-brand/30"
          />

          <span>
            I agree to the{" "}
            <a
              href="#"
              className="text-brand hover:underline"
            >
              Terms of Service
            </a>{" "}
            and{" "}
            <a
              href="#"
              className="text-brand hover:underline"
            >
              Privacy Policy
            </a>
            .
          </span>
        </label>

        <button
          type="submit"
          disabled={loading}
          className="w-full inline-flex items-center justify-center gap-2 bg-brand hover:bg-brand-hover disabled:opacity-60 text-white px-4 py-3 rounded-xl text-sm font-semibold transition-all"
        >
          {loading ? "Creating Account..." : "Create Account"}

          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      <p className="text-center text-sm text-muted mt-6">
        Already have an account?{" "}
        <button
          type="button"
          onClick={onSwitch}
          className="font-semibold text-brand hover:underline"
        >
          Sign in
        </button>
      </p>
    </div>
  );
}