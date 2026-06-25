import React from 'react';
import { motion } from 'framer-motion';
import { Github, Code2, Database, Terminal } from 'lucide-react';
export function OpenSource() {
  return (
    <section
      id="github"
      className="py-24 bg-ink text-white overflow-hidden relative">
      
      {/* Background grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff1a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff1a_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{
              opacity: 0,
              x: -40
            }}
            whileInView={{
              opacity: 1,
              x: 0
            }}
            viewport={{
              once: true
            }}>
            
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white/80 text-sm font-medium mb-6 border border-white/10">
              <Github className="w-4 h-4" />
              100% Open Source
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">
              Built on modern, reliable technology.
            </h2>
            <p className="text-lg text-white/60 mb-8">
              SellFlow is proudly open-source under the MIT License. We believe
              in transparency and empowering developers to build upon our
              foundation.
            </p>

            <div className="grid grid-cols-2 gap-6 mb-10">
              {[
              {
                icon: Terminal,
                label: 'Laravel 12',
                desc: 'Robust Backend'
              },
              {
                icon: Code2,
                label: 'Next.js 15',
                desc: 'React Frontend'
              },
              {
                icon: Database,
                label: 'PostgreSQL',
                desc: 'Reliable Database'
              },
              {
                icon: Github,
                label: 'Community',
                desc: 'Driven Development'
              }].
              map((tech) =>
              <div key={tech.label} className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                    <tech.icon className="w-5 h-5 text-brand-soft" />
                  </div>
                  <div>
                    <div className="font-bold text-white">{tech.label}</div>
                    <div className="text-sm text-white/60">{tech.desc}</div>
                  </div>
                </div>
              )}
            </div>

            <button className="inline-flex items-center justify-center gap-2 bg-white text-ink hover:bg-surface px-8 py-4 rounded-full text-base font-semibold transition-all hover:-translate-y-0.5">
              <Github className="w-5 h-5" />
              View on GitHub
            </button>
          </motion.div>

          {/* Code Window Mockup */}
          <motion.div
            initial={{
              opacity: 0,
              x: 40
            }}
            whileInView={{
              opacity: 1,
              x: 0
            }}
            viewport={{
              once: true
            }}
            className="rounded-2xl border border-white/10 bg-ink/50 overflow-hidden shadow-2xl">
            
            <div className="h-10 border-b border-white/10 flex items-center px-4 gap-2 bg-white/5">
              <div className="w-3 h-3 rounded-full bg-white/20"></div>
              <div className="w-3 h-3 rounded-full bg-white/20"></div>
              <div className="w-3 h-3 rounded-full bg-white/20"></div>
              <div className="ml-4 text-xs text-white/40 font-mono">
                docker-compose.yml
              </div>
            </div>
            <div className="p-6 overflow-x-auto">
              <pre className="text-sm font-mono text-white/80 leading-relaxed">
                <code>
                  <span className="text-pink-400">version:</span>{' '}
                  <span className="text-brand-soft">'3.8'</span>
                  <span className="text-pink-400">services:</span>
                  <span className="text-blue-400">app:</span>
                  <span className="text-pink-400">build:</span>
                  <span className="text-pink-400">context:</span> .
                  <span className="text-pink-400">dockerfile:</span> Dockerfile
                  <span className="text-pink-400">ports:</span>-{' '}
                  <span className="text-brand-soft">"8000:8000"</span>
                  <span className="text-pink-400">environment:</span>-
                  DB_CONNECTION=pgsql - DB_HOST=db
                  <span className="text-blue-400">db:</span>
                  <span className="text-pink-400">image:</span>{' '}
                  postgres:15-alpine
                  <span className="text-pink-400">environment:</span>-
                  POSTGRES_DB=sellflow - POSTGRES_PASSWORD=secret
                </code>
              </pre>
            </div>
          </motion.div>
        </div>
      </div>
    </section>);

}