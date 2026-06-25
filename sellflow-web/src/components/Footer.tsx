import React from 'react';
import {
  ShoppingBag,
  Github,
  Linkedin,
  MessageSquare,
  Mail } from
'lucide-react';
export function Footer() {
  return (
    <footer className="bg-white border-t border-line pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
          <div className="col-span-2 lg:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-xl bg-brand flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-white" />
              </div>
              <span className="font-display font-bold text-xl text-ink">
                SellFlow
              </span>
            </div>
            <p className="text-muted mb-6 max-w-sm">
              The free and open-source digital product catalog platform built
              specifically for small businesses.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="#"
                className="text-muted/80 hover:text-ink transition-colors">
                
                <Github className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-muted/80 hover:text-ink transition-colors">
                
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-muted/80 hover:text-ink transition-colors">
                
                <MessageSquare className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-muted/80 hover:text-ink transition-colors">
                
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-ink mb-4">Product</h4>
            <ul className="space-y-3">
              {['Features', 'Integrations', 'Pricing', 'Changelog', 'Docs'].map(
                (item) =>
                <li key={item}>
                    <a
                    href="#"
                    className="text-muted hover:text-brand transition-colors text-sm">
                    
                      {item}
                    </a>
                  </li>

              )}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-ink mb-4">Resources</h4>
            <ul className="space-y-3">
              {['Community', 'Help Center', 'Partners', 'Blog', 'Guides'].map(
                (item) =>
                <li key={item}>
                    <a
                    href="#"
                    className="text-muted hover:text-brand transition-colors text-sm">
                    
                      {item}
                    </a>
                  </li>

              )}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-ink mb-4">Legal</h4>
            <ul className="space-y-3">
              {[
              'Privacy Policy',
              'Terms of Service',
              'Cookie Policy',
              'License'].
              map((item) =>
              <li key={item}>
                  <a
                  href="#"
                  className="text-muted hover:text-brand transition-colors text-sm">
                  
                    {item}
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-line flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-muted text-sm">
            © {new Date().getFullYear()} SellFlow. Released under the MIT
            License.
          </p>
          <div className="flex items-center gap-2 text-sm text-muted">
            <span>Built with</span>
            <span className="text-red-500">♥</span>
            <span>by the open source community</span>
          </div>
        </div>
      </div>
    </footer>);

}