import React, { useCallback, useState, createContext, useContext } from 'react';
export type AuthMode = 'login' | 'register';
interface AuthContextValue {
  isOpen: boolean;
  mode: AuthMode;
  openAuth: (mode: AuthMode) => void;
  closeAuth: () => void;
  setMode: (mode: AuthMode) => void;
}
const AuthContext = createContext<AuthContextValue | undefined>(undefined);
export function AuthProvider({ children }: {children: React.ReactNode;}) {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<AuthMode>('login');
  const openAuth = useCallback((nextMode: AuthMode) => {
    setMode(nextMode);
    setIsOpen(true);
  }, []);
  const closeAuth = useCallback(() => setIsOpen(false), []);
  return (
    <AuthContext.Provider
      value={{
        isOpen,
        mode,
        openAuth,
        closeAuth,
        setMode
      }}>
      
      {children}
    </AuthContext.Provider>);

}
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}