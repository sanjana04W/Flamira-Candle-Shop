'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ShoppingCart,
  Users,
  Sparkles,
  Database,
  Package,
  Layers,
  Archive,
  UserCheck,
  Truck,
  FileText,
  Star,
  BarChart3,
  Settings,
  LogOut,
  ExternalLink,
} from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { useAdminAuth } from '@/context/AdminAuthContext';

export const AdminSidebar: React.FC = () => {
  const pathname = usePathname();
  const { orders, products } = useStore();
  const { adminUser, logout } = useAdminAuth();

  const pendingCount = orders.filter((o) => o.orderStatus === 'Pending').length;
  const lowStockCount = products.filter(
    (p) => p.stockQty > 0 && p.stockQty <= p.lowStockThreshold
  ).length;

  const navItems = [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'Orders', href: '/admin/orders', icon: ShoppingCart, badge: pendingCount },
    { label: 'User Control', href: '/admin/users', icon: Users },
    { label: 'Featured Products', href: '/admin/featured', icon: Sparkles },
    { label: 'Master Data', href: '/admin/master-data', icon: Database },
    { label: 'Products', href: '/admin/products', icon: Package },
    { label: 'Categories', href: '/admin/categories', icon: Layers },
    { label: 'Inventory', href: '/admin/inventory', icon: Archive, badge: lowStockCount ? '!' : undefined },
    { label: 'Customers', href: '/admin/customers', icon: UserCheck },
    { label: 'Delivery', href: '/admin/delivery', icon: Truck },
    { label: 'Content', href: '/admin/content', icon: FileText },
    { label: 'Reviews', href: '/admin/reviews', icon: Star },
    { label: 'Reports', href: '/admin/reports', icon: BarChart3 },
    { label: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-white border-r border-[#EFE8DF] min-h-screen flex flex-col justify-between shrink-0">
      <div>
        {/* Brand Header matching Image 1: Flamira ADMIN */}
        <div className="p-6 border-b border-[#F5ECE1]">
          <Link href="/admin" className="flex items-baseline gap-2">
            <span className="font-serif text-2xl font-bold tracking-tight text-[#281B13]">
              Flamira
            </span>
            <span className="text-[10px] font-bold tracking-widest text-[#8C7A6B] uppercase">
              ADMIN
            </span>
          </Link>
        </div>

        {/* Navigation list */}
        <nav className="p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-[#FBEFEA] text-[#943B17] font-bold shadow-xs'
                    : 'text-[#5C4A3E] hover:bg-[#FAF7F2] hover:text-[#281B13]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    size={16}
                    className={isActive ? 'text-[#C45A2C]' : 'text-[#8C7A6B]'}
                  />
                  <span>{item.label}</span>
                </div>

                {item.badge !== undefined && item.badge !== 0 && (
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isActive
                        ? 'bg-[#C45A2C] text-white'
                        : 'bg-[#FAF3EA] text-[#943B17] border border-[#E9DAC8]'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Profile card matching Image 1: Flamira Owner / Owner, Log Out */}
      <div className="p-4 border-t border-[#F2ECE1] space-y-3">
        <div className="flex items-center justify-between px-2">
          <div>
            <span className="text-xs font-bold text-[#281B13] block">
              {adminUser?.name || 'Flamira Owner'}
            </span>
            <span className="text-[10px] text-[#8C7A6B] block">
              {adminUser?.role || 'Super Admin'}
            </span>
          </div>
          <Link
            href="/"
            target="_blank"
            className="text-[#C45A2C] hover:text-[#943B17] p-1.5 rounded-lg hover:bg-[#FAF7F2]"
            title="View Live Storefront"
          >
            <ExternalLink size={15} />
          </Link>
        </div>

        <button
          onClick={logout}
          className="w-full flex items-center gap-2 text-xs font-medium text-[#796455] hover:text-[#C45A2C] px-2 py-1.5 rounded-lg hover:bg-[#FAF7F2] transition text-left"
        >
          <LogOut size={14} />
          <span>Sign Out / Lock</span>
        </button>
      </div>
    </aside>
  );
};
