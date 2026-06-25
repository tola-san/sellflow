import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Check } from 'lucide-react';
import { useAuth } from './AuthContext';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';
export function AuthModal() {
  const { isOpen, mode, closeAuth, setMode } = useAuth();
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeAuth();
    };
    if (isOpen) {
      document.addEventListener('keydown', onKey);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, closeAuth]);
  const highlights = [
  'Beautiful product catalog in minutes',
  'Share instantly with QR codes',
  'Manage orders from one dashboard',
  'Free forever, open source'];

  return (
    <AnimatePresence>
      {isOpen &&
      <motion.div
        initial={{
          opacity: 0
        }}
        animate={{
          opacity: 1
        }}
        exit={{
          opacity: 0
        }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
        aria-label={mode === 'login' ? 'Sign in' : 'Create account'}>
        
          {/* Overlay */}
          <div
          className="absolute inset-0 bg-ink/50 backdrop-blur-sm"
          onClick={closeAuth} />
        

          {/* Card */}
          <motion.div
          initial={{
            opacity: 0,
            scale: 0.96,
            y: 16
          }}
          animate={{
            opacity: 1,
            scale: 1,
            y: 0
          }}
          exit={{
            opacity: 0,
            scale: 0.96,
            y: 16
          }}
          transition={{
            type: 'spring',
            damping: 24,
            stiffness: 280
          }}
          className="relative w-full max-w-4xl grid md:grid-cols-2 rounded-3xl overflow-hidden bg-white border border-line shadow-2xl max-h-[92vh]">
          
            {/* Brand panel */}
            <div className="hidden md:flex flex-col justify-between p-8 bg-gradient-to-br from-brand via-[#7a4ee8] to-[#a98bf7] text-white relative overflow-hidden">
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_white_1px,_transparent_1px)] bg-[size:22px_22px]" />
              <div className="relative">
                <div className="flex items-center gap-2 mb-10">
                  <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
                    <ShoppingBag className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-display font-bold text-xl">
                    SellFlow
                  </span>
                </div>
                <h3 className="font-display text-2xl font-bold leading-snug mb-6">
                  Showcase your products. Grow your business.
                </h3>
                <ul className="space-y-3">
                  {highlights.map((item) =>
                <li
                  key={item}
                  className="flex items-center gap-3 text-brand-soft text-sm">
                  
                      <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3" />
                      </span>
                      {item}
                    </li>
                )}
                </ul>
              </div>
              <p className="relative text-xs text-brand-soft/80">
                Trusted by 10,000+ growing small businesses.
              </p>
            </div>

            {/* Form panel */}
            <div className="p-6 sm:p-8 overflow-y-auto">
              <button
              onClick={closeAuth}
              aria-label="Close"
              className="absolute top-4 right-4 p-2 rounded-full text-muted hover:bg-surface hover:text-ink transition-colors">
              
                <X className="w-5 h-5" />
              </button>

              <AnimatePresence mode="wait">
                <motion.div
                key={mode}
                initial={{
                  opacity: 0,
                  x: mode === 'login' ? -12 : 12
                }}
                animate={{
                  opacity: 1,
                  x: 0
                }}
                exit={{
                  opacity: 0,
                  x: mode === 'login' ? 12 : -12
                }}
                transition={{
                  duration: 0.2
                }}>
                
                  {mode === 'login' ?
                <LoginForm onSwitch={() => setMode('register')} /> :

                <RegisterForm onSwitch={() => setMode('login')} />
                }
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      }
    </AnimatePresence>);

}