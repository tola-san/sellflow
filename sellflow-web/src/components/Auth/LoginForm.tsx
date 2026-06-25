import React from 'react';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { AuthField } from './AuthField';

interface LoginFormProps {
  onSwitch: () => void;
}
export function LoginForm({ onSwitch }: LoginFormProps) {
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
        onSubmit={(e) => {
          e.preventDefault();
        }}>
        
        <AuthField
          id="login-email"
          label="Email"
          type="email"
          placeholder="you@business.com"
          icon={Mail}
          autoComplete="email" />
        
        <AuthField
          id="login-password"
          label="Password"
          type="password"
          placeholder="••••••••"
          icon={Lock}
          autoComplete="current-password" />
        

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 text-ink/80 cursor-pointer">
            <input
              type="checkbox"
              className="rounded border-line text-brand focus:ring-brand/30" />
            
            Remember me
          </label>
          <a href="#" className="font-medium text-brand hover:underline">
            Forgot password?
          </a>
        </div>

        <button
          type="submit"
          className="w-full inline-flex items-center justify-center gap-2 bg-brand hover:bg-brand-hover text-white px-4 py-3 rounded-xl text-sm font-semibold transition-all shadow-glow hover:shadow-none hover:-translate-y-0.5 active:translate-y-0">
          
          Sign in
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      <p className="text-center text-sm text-muted mt-6">
        Don't have an account?{' '}
        <button
          onClick={onSwitch}
          className="font-semibold text-brand hover:underline">
          
          Sign up free
        </button>
      </p>
    </div>);

}