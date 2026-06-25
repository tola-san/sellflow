import React from 'react';
import { Mail, Lock, User, Store, ArrowRight } from 'lucide-react';
import { AuthField } from './AuthField';

interface RegisterFormProps {
  onSwitch: () => void;
}
export function RegisterForm({ onSwitch }: RegisterFormProps) {
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
        onSubmit={(e) => {
          e.preventDefault();
        }}>
        
        <AuthField
  id="register-name"
  label="Full Name"
  type="text"
  placeholder="Jane Doe"
  icon={User}
  autoComplete="name"
/>

<AuthField
  id="register-email"
  label="Email"
  type="email"
  placeholder="you@business.com"
  icon={Mail}
  autoComplete="email"
/>

<AuthField
  id="register-password"
  label="Password"
  type="password"
  placeholder="At least 8 characters"
  icon={Lock}
  autoComplete="new-password"
/>

<AuthField
  id="password_confirmation"
  label="Confirm Password"
  type="password"
  placeholder="Confirm your password"
  icon={Lock}
  autoComplete="new-password"
/>

        <label className="flex items-start gap-2 text-xs text-muted cursor-pointer">
          <input
            type="checkbox"
            required
            className="mt-0.5 rounded border-line text-brand focus:ring-brand/30" />
          
          <span>
            I agree to the{' '}
            <a href="#" className="text-brand hover:underline">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="text-brand hover:underline">
              Privacy Policy
            </a>
            .
          </span>
        </label>

        <button
          type="submit"
          className="w-full inline-flex items-center justify-center gap-2 bg-brand hover:bg-brand-hover text-white px-4 py-3 rounded-xl text-sm font-semibold transition-all shadow-glow hover:shadow-none hover:-translate-y-0.5 active:translate-y-0">
          
          Create account
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      <p className="text-center text-sm text-muted mt-6">
        Already have an account?{' '}
        <button
          onClick={onSwitch}
          className="font-semibold text-brand hover:underline">
          
          Sign in
        </button>
      </p>
    </div>);

}