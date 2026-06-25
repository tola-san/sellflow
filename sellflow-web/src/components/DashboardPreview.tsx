import React from 'react';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingCart,
  Users,
  BarChart3,
  Settings,
  Bell,
  Search,
} from "lucide-react";


const sidebarItems = [
  {
    name: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Products",
    icon: Package,
  },
  {
    name: "Categories",
    icon: FolderTree,
  },
  {
    name: "Orders",
    icon: ShoppingCart,
  },
  {
    name: "Customers",
    icon: Users,
  },
  {
    name: "Analytics",
    icon: BarChart3,
  },
];

export function DashboardPreview() {
  return (
    <section id="demo" className="py-24 bg-canvas overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2
            initial={{
              opacity: 0,
              y: 20
            }}
            whileInView={{
              opacity: 1,
              y: 0
            }}
            viewport={{
              once: true
            }}
            className="font-display text-3xl md:text-4xl font-bold text-ink mb-4">
            
            A dashboard you'll love using
          </motion.h2>
          <motion.p
            initial={{
              opacity: 0,
              y: 20
            }}
            whileInView={{
              opacity: 1,
              y: 0
            }}
            viewport={{
              once: true
            }}
            transition={{
              delay: 0.1
            }}
            className="text-lg text-muted">
            
            Manage your entire business from a single, beautifully designed
            interface that feels like a premium SaaS product.
          </motion.p>
        </div>

        <motion.div
          initial={{
            opacity: 0,
            y: 40
          }}
          whileInView={{
            opacity: 1,
            y: 0
          }}
          viewport={{
            once: true
          }}
          transition={{
            duration: 0.8
          }}
          className="relative mx-auto max-w-5xl rounded-2xl border border-line/50 bg-white shadow-2xl overflow-hidden flex">
          
          {/* Sidebar */}
          <div className="hidden md:flex w-64 flex-col border-r border-line bg-canvas/50 p-4">
            <div className="flex items-center gap-2 px-2 mb-8">
              <div className="w-6 h-6 rounded-md bg-brand"></div>
              <span className="font-display font-bold text-ink">SellFlow</span>
            </div>
            <nav className="flex-1 space-y-1">
             {sidebarItems.map((item, index) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.name}
                  className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-3 cursor-pointer transition-colors ${
                    index === 0
                      ? "bg-brand-soft text-brand"
                      : "text-muted hover:bg-surface hover:text-ink"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </div>
              );
            })}
            </nav>
            <div className="mt-auto pt-4 border-t border-line">
              <div className="flex items-center gap-3 px-2">
                <img
                  src="https://i.pravatar.cc/150?img=32"
                  alt="User"
                  className="w-8 h-8 rounded-full" />
                
                <div className="text-sm">
                  <div className="font-medium text-ink">Jane Doe</div>
                  <div className="text-muted text-xs">Store Owner</div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col min-h-[600px]">
            {/* Header */}
            <header className="h-16 border-b border-line flex items-center justify-between px-6">
              <div className="relative w-64">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full bg-surface border-none rounded-full pl-9 pr-4 py-1.5 text-sm focus:ring-2 focus:ring-brand outline-none text-ink" />
                
              </div>
              <div className="flex items-center gap-4">
                <button className="relative p-2 text-muted hover:text-ink">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500"></span>
                </button>
              </div>
            </header>

            {/* Content Area */}
            <div className="flex-1 p-6 bg-canvas/30">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-display font-bold text-ink">
                  Overview
                </h1>
                <button className="bg-brand text-white px-4 py-2 rounded-lg text-sm font-medium">
                  Add Product
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                {/* Chart spanning 2 cols */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-line p-5 shadow-sm">
                  <div className="text-sm font-medium text-muted mb-4">
                    Revenue (Last 7 Days)
                  </div>
                  <div className="h-48 flex items-end gap-2">
                    {[30, 50, 40, 70, 60, 90, 80].map((h, i) =>
                    <div
                      key={i}
                      className="flex-1 bg-brand-soft rounded-t-md relative group">
                      
                        <div
                        className="absolute bottom-0 w-full bg-brand rounded-t-md transition-all duration-500"
                        style={{
                          height: `${h}%`
                        }}>
                      </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Recent Orders */}
                <div className="bg-white rounded-2xl border border-line p-5 shadow-sm">
                  <div className="text-sm font-medium text-muted mb-4">
                    Recent Orders
                  </div>
                  <div className="space-y-4">
                    {[1, 2, 3, 4].map((i) =>
                    <div
                      key={i}
                      className="flex items-center justify-between">
                      
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-surface flex items-center justify-center text-xs font-medium text-ink/80">
                            #{1040 + i}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-ink">
                              Premium Coffee
                            </div>
                            <div className="text-xs text-muted">2 mins ago</div>
                          </div>
                        </div>
                        <div className="text-sm font-medium text-brand">
                          $24.00
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Table */}
              <div className="bg-white rounded-2xl border border-line shadow-sm overflow-hidden">
                <table className="w-full text-left text-sm">
                  <thead className="bg-canvas text-muted">
                    <tr>
                      <th className="px-6 py-3 font-medium">Product</th>
                      <th className="px-6 py-3 font-medium">Category</th>
                      <th className="px-6 py-3 font-medium">Price</th>
                      <th className="px-6 py-3 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line">
                    {[
                    {
                      name: 'Artisan Coffee Beans',
                      cat: 'Beverages',
                      price: '$24.00',
                      status: 'Active'
                    },
                    {
                      name: 'Ceramic Mug',
                      cat: 'Accessories',
                      price: '$18.00',
                      status: 'Active'
                    },
                    {
                      name: 'Pour Over Kit',
                      cat: 'Equipment',
                      price: '$45.00',
                      status: 'Out of Stock'
                    }].
                    map((item, i) =>
                    <tr key={i} className="text-ink/80">
                        <td className="px-6 py-4 font-medium text-ink">
                          {item.name}
                        </td>
                        <td className="px-6 py-4">{item.cat}</td>
                        <td className="px-6 py-4">{item.price}</td>
                        <td className="px-6 py-4">
                          <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${item.status === 'Active' ? 'bg-brand-soft text-brand' : 'bg-surface text-muted'}`}>
                          
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>);

}