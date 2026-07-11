import React from "react";
import {
  ShoppingBag,
  Linkedin,
  Mail,
  Send,
} from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-zinc-100/80 backdrop-blur-xl pt-16 pb-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
          {/* Brand */}
          <div className="col-span-2">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand shadow-lg">
                <ShoppingBag className="h-5 w-5 text-white" />
              </div>

              <span className="text-xl font-bold text-ink">
                SellFlow
              </span>
            </div>

            <p className="max-w-md leading-7 text-muted">
              ផ្លេតហ្វម SaaS សម្រាប់គ្រប់គ្រងកាតាឡុក និងហាងអនឡាញ
              ដែលជួយអាជីវកម្មខ្នាតតូច និងមធ្យម
              លក់ទំនិញបានកាន់តែលឿន និងមានប្រសិទ្ធភាព។
            </p>

            {/* Contact Card */}
            <div className="mt-8 rounded-2xl border border-zinc-200 bg-white/70 p-5 shadow-sm backdrop-blur">
              <p className="font-semibold text-ink">
                Need help?
              </p>

              <p className="mt-2 text-sm leading-6 text-muted">
                Contact our team for product demo,
                support or partnership.
              </p>

              <div className="mt-5 flex flex-wrap gap-3">
                <a
                  href="https://t.me/tolasannn"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-sky-500 px-4 py-2 text-sm font-medium text-white transition-all duration-300 hover:-translate-y-1 hover:bg-sky-600 hover:shadow-lg hover:shadow-sky-500/30"
                >
                  <Send className="h-4 w-4" />
                  Telegram
                </a>

                 <a
                href="mailto:tolasan369369@gmail.com"
                className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition hover:border-brand hover:text-brand"
              >
                <Mail className="h-4 w-4" />
                Email
              </a>
              </div>
            </div>

          </div>

          {/* Product */}
          <div>
            <h4 className="mb-4 font-bold text-ink">
              ប្រព័ន្ធស្នូល
            </h4>

            <ul className="space-y-3 text-sm">
              {[
                "មុខងារប្រព័ន្ធ",
                "សុវត្ថិភាពទិន្នន័យ",
                "គម្រោងតម្លៃ",
                "ការធ្វើបច្ចុប្បន្នភាព",
                "System Status",
              ].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-muted transition hover:text-brand"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="mb-4 font-bold text-ink">
              ការគាំទ្រ
            </h4>

            <ul className="space-y-3 text-sm">
              {[
                "មជ្ឈមណ្ឌលជំនួយ",
                "API Documentation",
                "Blog",
                "Video Tutorials",
                "Contact Sales",
              ].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-muted transition hover:text-brand"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="mb-4 font-bold text-ink">
              ផ្នែកច្បាប់
            </h4>

            <ul className="space-y-3 text-sm">
              {[
                "Privacy Policy",
                "Terms of Service",
                "SLA",
                "Cookie Policy",
              ].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-muted transition hover:text-brand"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-zinc-200 pt-8 md:flex-row">
          <p className="text-sm text-muted">
            © {new Date().getFullYear()} SellFlow. All rights reserved.
          </p>

          <div className="flex items-center gap-2 text-sm text-muted">
            ❤️ Built with care for modern businesses in Cambodia.
          </div>
        </div>
      </div>
    </footer>
  );
}