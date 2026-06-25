import React, { useState } from 'react';
import { Eye, EyeOff, BoxIcon } from 'lucide-react';
interface AuthFieldProps {
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  icon: BoxIcon;
  autoComplete?: string;
  required?: boolean;
}
export function AuthField({
  id,
  label,
  type = 'text',
  placeholder,
  icon: Icon,
  autoComplete,
  required = true
}: AuthFieldProps) {
  const [show, setShow] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword && show ? 'text' : type;
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-ink mb-1.5">
        {label}
      </label>
      <div className="relative">
        <Icon className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
        <input
          id={id}
          name={id}
          type={inputType}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required={required}
          className="w-full rounded-xl border border-line bg-canvas pl-10 pr-10 py-2.5 text-sm text-ink placeholder:text-muted focus:bg-white focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none transition-all" />
        
        {isPassword &&
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          aria-label={show ? 'Hide password' : 'Show password'}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-ink transition-colors">
          
            {show ?
          <EyeOff className="w-4 h-4" /> :

          <Eye className="w-4 h-4" />
          }
          </button>
        }
      </div>
    </div>);

}