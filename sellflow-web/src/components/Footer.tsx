import React from "react";
import { ShoppingBag, Linkedin, MessageSquare, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-zinc-100 backdrop-blur-lg border-t pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
          
          {/* Brand Info */}
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
              ផ្លេតហ្វម SaaS គ្រប់គ្រងកាតាឡុក និងហាងទំនិញឌីជីថលឈានមុខគេ ដែលជួយឱ្យអាជីវកម្មខ្នាតតូចនិងមធ្យម អាចបង្កើត និងពង្រីកការលក់នៅលើអនឡាញបានយ៉ាងរហ័ស។
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-muted/80 hover:text-ink transition-colors" aria-label="Linkedin">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted/80 hover:text-ink transition-colors" aria-label="Message">
                <MessageSquare className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted/80 hover:text-ink transition-colors" aria-label="Mail">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* ផ្នែកផលិតផល (SaaS Links) */}
          <div>
            <h4 className="font-bold text-ink mb-4">ប្រព័ន្ធស្នូល</h4>
            <ul className="space-y-3">
              {[
                { label: "មុខងារប្រព័ន្ធ", href: "#" },
                { label: "សុវត្ថិភាពទិន្នន័យ", href: "#" },
                { label: "គម្រោងតម្លៃ", href: "#" },
                { label: "ការធ្វើបច្ចុប្បន្នភាព", href: "#" },
                { label: "ស្ថានភាពប្រព័ន្ធ (Status)", href: "#" }
              ].map((item) => (
                <li key={item.label}>
                  <a href={item.href} className="text-muted hover:text-brand transition-colors text-sm">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* ផ្នែកជំនួយ និងធនធាន */}
          <div>
            <h4 className="font-bold text-ink mb-4">ការគាំទ្រ</h4>
            <ul className="space-y-3">
              {[
                { label: "មជ្ឈមណ្ឌលជំនួយ", href: "#" },
                { label: "ឯកសារបច្ចេកទេស", href: "#" },
                { label: "ប្លុក និងចំណេះដឹង", href: "#" },
                { label: "វីដេអូណែនាំ", href: "#" },
                { label: "ទំនាក់ទំនងផ្នែកលក់", href: "#" }
              ].map((item) => (
                <li key={item.label}>
                  <a href={item.href} className="text-muted hover:text-brand transition-colors text-sm">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* ផ្នែកច្បាប់ */}
          <div>
            <h4 className="font-bold text-ink mb-4">ផ្នែកច្បាប់</h4>
            <ul className="space-y-3">
              {[
                { label: "គោលការណ៍ឯកជនភាព", href: "#" },
                { label: "លក្ខខណ្ឌប្រើប្រាស់សេវាកម្ម", href: "#" },
                { label: "កិច្ចព្រមព្រៀងកម្រិតសេវាកម្ម (SLA)", href: "#" },
                { label: "គោលការណ៍ខូឃី (Cookie)", href: "#" }
              ].map((item) => (
                <li key={item.label}>
                  <a href={item.href} className="text-muted hover:text-brand transition-colors text-sm">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ផ្នែករក្សាសិទ្ធិខាងក្រោម */}
        <div className="pt-8 border-t border-line flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-muted text-sm">
            © {new Date().getFullYear()} SellFlow Inc. រក្សាសិទ្ធិគ្រប់យ៉ាង។
          </p>
          <div className="flex items-center gap-2 text-sm text-muted">
            <span>រចនាឡើងប្រកបដោយការយកចិត្តទុកដាក់សម្រាប់អាជីវកម្មទំនើប</span>
          </div>
        </div>
      </div>
    </footer>
  );
}