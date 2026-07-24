import React, { useCallback, useEffect, useState, createContext, useContext } from 'react';
import type { BusinessType } from '../../types/businessTypes';
export type AuthMode = 'login' | 'register';

export interface AuthUser {
  id?: number;
  name?: string;
  email?: string;
  has_business?: boolean;
  onboarding_completed?: boolean;
  business_type?: BusinessType | null;
  [key: string]: unknown;
}

interface AuthContextValue {
  isOpen: boolean;
  mode: AuthMode;
  user: AuthUser | null;
  isAuthenticated: boolean;
  openAuth: (mode: AuthMode) => void;
  closeAuth: () => void;
  setMode: (mode: AuthMode) => void;
  setSession: (token: string, user: AuthUser) => void;
  clearSession: () => void;
}
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function storedUser(): AuthUser | null {
  try {
    const value = localStorage.getItem('user');
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: {children: React.ReactNode;}) {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<AuthMode>('login');
  const [user, setUser] = useState<AuthUser | null>(() => storedUser());

  const openAuth = useCallback((nextMode: AuthMode) => {
    setMode(nextMode);
    setIsOpen(true);
  }, []);
  const closeAuth = useCallback(() => setIsOpen(false), []);

  const setSession = useCallback((token: string, nextUser: AuthUser) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(nextUser));
    setUser(nextUser);
  }, []);

  const clearSession = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  }, []);

  useEffect(() => {
    const syncSession = (event: StorageEvent) => {
      if (event.key === 'token' || event.key === 'user' || event.key === null) {
        setUser(storedUser());
      }
    };
    window.addEventListener('storage', syncSession);
    return () => window.removeEventListener('storage', syncSession);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isOpen,
        mode,
        user,
        isAuthenticated: Boolean(user && localStorage.getItem('token')),
        openAuth,
        closeAuth,
        setMode,
        setSession,
        clearSession,
      }}>
      
      {children}
    </AuthContext.Provider>);

}
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
