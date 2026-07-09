import React from 'react';
import { motion } from 'framer-motion';
import { 
  QrCode, BarChart3, Package, ShoppingCart, 
  Home, Menu, Users, Settings, Bell, Search,
  TrendingUp, Calendar
} from 'lucide-react';

export function DashboardPage() {
  return (
    <div className="flex h-screen bg-zinc-100 overflow-hidden font-sans">
      {/* Sidebar */}
      <div className="w-72 border-r border-zinc-200 bg-white flex flex-col">
        {/* Logo / Brand */}
        <div className="p-6 border-b border-zinc-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-violet-500 to-indigo-500 rounded-xl flex items-center justify-center">
              <QrCode className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-semibold text-zinc-900 tracking-tight text-2xl">sellflow</div>
              <div className="text-[10px] text-zinc-500 -mt-1 tracking-wider">ប្រព័ន្ធគ្រប់គ្រងភោជនីយដ្ឋាន</div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 px-3 py-6">
          <nav className="space-y-1">
            {[
              { label: "ផ្ទាំងគ្រប់គ្រង", icon: Home, active: true },
              { label: "មុខម្ហូប", icon: Menu },
              { label: "កាតាឡុក", icon: Package },
              { label: "ការកុម្ម៉ង់", icon: ShoppingCart },
              { label: "ការវិភាគទិន្នន័យ", icon: BarChart3 },
              { label: "ក្រុមការងារ", icon: Users },
            ].map((item, i) => (
              <motion.a
                key={i}
                href="#"
                whileHover={{ x: 4 }}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all ${
                  item.active 
                    ? 'bg-purple-100 text-purple-700 shadow-sm font-medium' 
                    : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
                {item.active && (
                  <div className="ml-auto w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                )}
              </motion.a>
            ))}
          </nav>

          <div className="mt-10 px-4">
            <div className="text-xs font-mono tracking-widest text-zinc-500 mb-4">អាជីវកម្ម</div>
            <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-sm">
              <div className="flex justify-between items-center mb-3 text-sm">
                <span className="text-zinc-500">ចំណូលថ្ងៃនេះ</span>
                <span className="font-semibold text-emerald-600">៛១១,៥០០,០០០</span>
              </div>
              <div className="h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                <div className="h-full w-[73%] bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full" />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="p-4 border-t border-zinc-100 mt-auto">
          <div className="flex items-center gap-3 px-3 py-2 hover:bg-zinc-50 rounded-xl cursor-pointer transition-colors">
            <div className="w-8 h-8 bg-zinc-200 rounded-full flex items-center justify-center text-xs font-mono">JD</div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-zinc-900 truncate">ចន ដូ</div>
              <div className="text-xs text-zinc-500 truncate">ម្ចាស់ហាង • Trattoria Bella</div>
            </div>
            <Settings className="w-4 h-4 text-zinc-400" />
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="h-16 border-b border-zinc-200 bg-white px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-zinc-100 px-4 py-2 rounded-xl text-sm border border-zinc-200">
              <Search className="w-4 h-4 text-zinc-400" />
              <input 
                type="text" 
                placeholder="ស្វែងរកមុខម្ហូប ការកុម្ម៉ង់..." 
                className="bg-transparent outline-none text-sm w-80 placeholder-zinc-400"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-sm text-zinc-500">
              <Calendar className="w-4 h-4" />
              <span>៣ កក្កដា ២០២៦</span>
            </div>

            <motion.div 
              whileHover={{ scale: 1.1 }}
              className="relative cursor-pointer"
            >
              <Bell className="w-5 h-5 text-zinc-500" />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white rounded-full flex items-center justify-center text-[10px] font-medium">៣</div>
            </motion.div>

            <div className="w-8 h-8 bg-gradient-to-br from-violet-400 to-indigo-400 rounded-xl" />
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-auto p-8">
          <div className="max-w-7xl mx-auto">
            {/* Page Header */}
            <div className="flex items-end justify-between mb-8">
              <div>
                <div className="text-emerald-600 text-xs font-medium flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  TRATTORIA BELLA • កំពុងបើកទ្វារ
                </div>
                <h1 className="text-4xl font-semibold text-zinc-900 tracking-tight">ផ្ទាំងគ្រប់គ្រង</h1>
              </div>
              
              <div className="flex items-center gap-3">
                <button className="px-5 py-2.5 bg-white border border-zinc-200 hover:bg-zinc-50 transition-colors rounded-xl text-sm font-medium flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  ទាញយករបាយការណ៍
                </button>
                <button className="px-6 py-2.5 bg-purple-600 text-white hover:bg-purple-700 transition-colors rounded-xl text-sm font-semibold">
                  ការកុម្ម៉ង់ថ្មី
                </button>
              </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[
                { label: "ចំណូលថ្ងៃនេះ", value: "៛1,00000", change: "+១៨%", icon: BarChart3, color: "emerald" },
                { label: "កាតាឡុកសកម្ម", value: "20", change: "៣ កំពុងដំណើរការ", icon: Package, color: "purple" },
                { label: "ការកុម្ម៉ង់ថ្ងៃនេះ", value: "15", change: "↑១២", icon: ShoppingCart, color: "amber" },
                { label: "ម៉ោងអង្គុយមធ្យម", value: "20 នាទី", change: "-៩%", icon: Users, color: "blue" },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white border border-zinc-200 rounded-xl p-6 hover:shadow-md transition-all"
                >
                  <div className={`w-14 h-14 rounded-xl bg-${stat.color}-50 flex items-center justify-center mb-5`}>
                    <stat.icon className={`w-8 h-8 text-${stat.color}-500`} />
                  </div>
                  <div className="text-sm text-zinc-500 mb-1">{stat.label}</div>
                  <div className="text-4xl font-semibold text-zinc-900 tracking-tighter mb-3">
                    {stat.value}
                  </div>
                  <div className={`text-xs inline-flex items-center gap-1 ${stat.change.startsWith('+') || stat.change.startsWith('↑') ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {stat.change}
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Menu Preview - Left */}
              <div className="lg:col-span-7 bg-white border border-zinc-200 rounded-xl p-8 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <div className="font-semibold text-2xl text-zinc-900">មុខម្ហូបប្រចាំហាង</div>
                    <div className="text-zinc-500 text-sm mt-1">បានកែប្រែថ្មីកាលពី ២ ម៉ោងមុន</div>
                  </div>
                  <div className="flex items-center gap-2 px-2 py-2 bg-green-100/60 border border-green-200 text-green-500 rounded-xl text-sm font-medium">
                    <div className="w-2 h-2 bg-green-100/50 rounded-full animate-pulse" />
                    ផ្សាយបន្តផ្ទាល់
                  </div>
                </div>

                <div className="space-y-6">
                  {[
                    { name: "Truffle Carbonara", price: "$24", desc: "Fresh tagliatelle, black truffle, aged parmesan" },
                    { name: "Wagyu Ribeye", price: "$68", desc: "250g A5 Japanese Wagyu, rosemary butter" },
                    { name: "Matcha Tiramisu", price: "$14", desc: "House-made ladyfingers, ceremonial matcha" },
                    { name: "Burrata & Heirloom Tomatoes", price: "$19", desc: "Basil oil, aged balsamic" },
                  ].map((item, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.1 * i }}
                      className="flex justify-between items-center py-4 border-b border-zinc-100 last:border-0 group"
                    >
                      <div>
                        <div className="font-medium text-zinc-900 group-hover:text-violet-600 transition-colors">{item.name}</div>
                        <div className="text-sm text-zinc-500 mt-0.5">{item.desc}</div>
                      </div>
                      <div className="font-mono text-lg text-zinc-900">{item.price}</div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Revenue Chart - Right */}
              <div className="lg:col-span-5 bg-white border border-zinc-200 rounded-xl p-8 shadow-sm flex flex-col">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <div className="font-semibold text-2xl text-zinc-900">ចំណូលប្រចាំសប្តាហ៍</div>
                    <div className="text-emerald-600 text-sm mt-1">សរុប $18,920 • +22% ធៀបនឹងសប្តាហ៍មុន</div>
                  </div>
                  <div className="text-xs bg-zinc-100 px-3 py-1 rounded-full">ចន្ទ — អាទិត្យ</div>
                </div>

                <div className="flex-1 flex items-end gap-3 pb-4 h-48">
                  {[42, 65, 38, 78, 92, 71, 100].map((height, i) => (
                    <motion.div
                      key={i}
                      initial={{ height: 0 }}
                      animate={{ height: `${height}%` }}
                      transition={{ duration: 1.4, delay: 0.08 * i }}
                      className="flex-1 bg-gradient-to-t from-violet-500  to-purple-500 rounded-t-2xl relative group"
                    >
                      <div className="absolute -top-7 left-1/2 -translate-x-1/2 text-[10px] font-mono text-zinc-500 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        ${Math.floor(height * 1.8)}
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="grid grid-cols-7 text-center text-[10px] text-zinc-500 mt-2 font-medium">
                  {['ចន្ទ', 'អង្គារ', 'ពុធ', 'ព្រហស្បតិ៍', 'សុក្រ', 'សៅរ៍', 'អាទិត្យ'].map(day => (
                    <div key={day}>{day}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}