// client/src/components/layout/DashboardLayout.tsx

import React, { useState, useEffect, useRef } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Menu, X, Bell, Search, Plus, ShoppingBag,
  MessageSquare, Receipt, ChevronDown, Flower2,
} from 'lucide-react';
import Sidebar from './Sidebar';
import { useAuth } from '../../context/AuthContext';

// ─── Route label map (for top navbar breadcrumb) ──────────────────────────────

const ROUTE_LABELS: Record<string, string> = {
  '/dashboard':            'Dashboard',
  '/dashboard/inquiries':  'Inquiries',
  '/dashboard/orders':     'Orders',
  '/dashboard/sales':      'Sales',
  '/dashboard/inventory':  'Inventory',
  '/dashboard/products':   'Products',
  '/dashboard/suppliers':  'Suppliers',
  '/dashboard/expenses':   'Expenses',
  '/dashboard/accounts':   'Accounts',
  '/dashboard/cashflow':   'Cash Flow',
  '/dashboard/savings':    'Savings',
  '/dashboard/reports':    'Reports',
  '/dashboard/analytics':  'Analytics',
  '/dashboard/customers':  'Customers',
  '/dashboard/import':     'Import Data',
  '/dashboard/logs':       'Activity Log',
  '/dashboard/settings':   'Settings',
};

// ─── Quick Actions ────────────────────────────────────────────────────────────

const QUICK_ACTIONS = [
  { label: 'New Sale',    icon: ShoppingBag,    to: '/dashboard/sales' },
  { label: 'New Inquiry', icon: MessageSquare,  to: '/dashboard/inquiries' },
  { label: 'Add Expense', icon: Receipt,        to: '/dashboard/expenses' },
];

// ─── Component ────────────────────────────────────────────────────────────────

const DashboardLayout: React.FC = () => {
  const { admin }                         = useAuth();
  const location                          = useLocation();
  const navigate                          = useNavigate();

  // Sidebar state
  const [collapsed,    setCollapsed]      = useState(false);
  const [drawerOpen,   setDrawerOpen]     = useState(false);

  // Top bar state
  const [searchOpen,   setSearchOpen]     = useState(false);
  const [searchQuery,  setSearchQuery]    = useState('');
  const [profileOpen,  setProfileOpen]    = useState(false);
  const [quickOpen,    setQuickOpen]      = useState(false);

  const profileRef  = useRef<HTMLDivElement>(null);
  const quickRef    = useRef<HTMLDivElement>(null);
  const searchRef   = useRef<HTMLInputElement>(null);

  const pageTitle = ROUTE_LABELS[location.pathname] ?? 'Dashboard';

  // Close dropdowns on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node))
        setProfileOpen(false);
      if (quickRef.current && !quickRef.current.contains(e.target as Node))
        setQuickOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Focus search input when opened
  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  // Close mobile drawer on route change
  useEffect(() => {
    setDrawerOpen(false);
  }, [location.pathname]);

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="flex h-screen bg-[#FAF6F0] overflow-hidden">

      {/* ── Desktop Sidebar ── */}
      <div className="hidden md:flex shrink-0 h-full">
        <Sidebar
          collapsed={collapsed}
          onCollapse={setCollapsed}
        />
      </div>

      {/* ── Mobile Drawer Overlay ── */}
      {drawerOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
          onClick={() => setDrawerOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ── Mobile Drawer Sidebar ── */}
      <div className={`
        fixed inset-y-0 left-0 z-50 md:hidden
        transition-transform duration-300 ease-in-out
        ${drawerOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <Sidebar
          collapsed={false}
          onCollapse={() => {}}
          onClose={() => setDrawerOpen(false)}
          mobile
        />
      </div>

      {/* ── Main Area ── */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">

        {/* ── Top Navbar ── */}
        <header className="shrink-0 h-14 flex items-center gap-3 px-4 md:px-6
                           bg-white border-b border-[#EDE0E4] z-30">

          {/* Mobile: hamburger */}
          <button
            onClick={() => setDrawerOpen(true)}
            className="md:hidden flex items-center justify-center h-9 w-9
                       rounded-lg hover:bg-[#FAF0F2] text-[#2C2C2C]/50
                       transition-colors"
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>

          {/* Page title */}
          <div className="flex items-center gap-2 min-w-0">
            <Flower2 size={14} className="text-[#C4717A] shrink-0" />
            <h1 className="text-sm font-bold text-[#2C2C2C] truncate">{pageTitle}</h1>
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* ── Search ── */}
          <div className="relative hidden sm:block">
            {searchOpen ? (
              <div className="flex items-center gap-2 bg-[#FAF0F2] rounded-lg
                              px-3 py-1.5 border border-[#C4717A]/20 w-56 md:w-72">
                <Search size={14} className="text-[#C4717A] shrink-0" />
                <input
                  ref={searchRef}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search orders, customers…"
                  className="flex-1 bg-transparent text-sm text-[#2C2C2C]
                             placeholder:text-[#2C2C2C]/30 outline-none min-w-0"
                />
                <button
                  onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
                  className="text-[#2C2C2C]/30 hover:text-[#2C2C2C]/60 transition-colors"
                  aria-label="Close search"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                className="flex items-center justify-center h-9 w-9
                           rounded-lg hover:bg-[#FAF0F2] text-[#2C2C2C]/40
                           hover:text-[#C4717A] transition-colors"
                aria-label="Search"
              >
                <Search size={18} />
              </button>
            )}
          </div>

          {/* ── Notification Bell ── */}
          <button
            className="relative flex items-center justify-center h-9 w-9
                       rounded-lg hover:bg-[#FAF0F2] text-[#2C2C2C]/40
                       hover:text-[#C4717A] transition-colors"
            aria-label="Notifications"
          >
            <Bell size={18} />
            {/* Future: unread badge */}
            {/* <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[#C4717A]" /> */}
          </button>

          {/* ── Quick Actions ── */}
          <div ref={quickRef} className="relative hidden sm:block">
            <button
              onClick={() => setQuickOpen((o) => !o)}
              className="flex items-center gap-1.5 h-9 rounded-lg px-3
                         bg-[#C4717A] text-white text-xs font-semibold
                         shadow shadow-[#C4717A]/25 hover:bg-[#b05f68]
                         active:scale-95 transition-all"
              aria-label="Quick actions"
            >
              <Plus size={14} />
              <span className="hidden md:inline">Quick Add</span>
            </button>

            {quickOpen && (
              <div className="absolute right-0 top-[calc(100%+8px)] z-50
                              w-44 bg-white rounded-xl shadow-lg
                              border border-[#EDE0E4] overflow-hidden
                              animate-[fadeSlideDown_0.15s_ease]">
                {QUICK_ACTIONS.map(({ label, icon: Icon, to }) => (
                  <button
                    key={to}
                    onClick={() => { navigate(to); setQuickOpen(false); }}
                    className="flex items-center gap-2.5 w-full px-4 py-2.5
                               text-sm text-[#2C2C2C]/70 hover:bg-[#FAF0F2]
                               hover:text-[#C4717A] transition-colors text-left"
                  >
                    <Icon size={15} className="shrink-0 text-[#C4717A]/60" />
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Profile Dropdown ── */}
          <div ref={profileRef} className="relative">
            <button
              onClick={() => setProfileOpen((o) => !o)}
              className="flex items-center gap-2 h-9 rounded-lg px-2
                         hover:bg-[#FAF0F2] transition-colors"
              aria-label="Profile menu"
            >
              <div className="h-7 w-7 rounded-full bg-[#C4717A]/15
                              flex items-center justify-center
                              text-[11px] font-bold text-[#C4717A]">
                {admin?.username?.[0]?.toUpperCase() ?? 'A'}
              </div>
              <ChevronDown
                size={14}
                className={`text-[#2C2C2C]/40 transition-transform duration-200
                  ${profileOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {profileOpen && (
              <div className="absolute right-0 top-[calc(100%+8px)] z-50
                              w-52 bg-white rounded-xl shadow-lg
                              border border-[#EDE0E4] overflow-hidden
                              animate-[fadeSlideDown_0.15s_ease]">
                {/* Admin info */}
                <div className="px-4 py-3 border-b border-[#EDE0E4]">
                  <p className="text-xs font-bold text-[#2C2C2C]">{admin?.username}</p>
                  <p className="text-[11px] text-[#2C2C2C]/40 mt-0.5">{admin?.email}</p>
                  <span className="inline-block mt-1.5 text-[10px] font-semibold
                                   text-[#C4717A] bg-[#C4717A]/10 px-2 py-0.5 rounded-full">
                    {admin?.role}
                  </span>
                </div>

                {/* Actions */}
                <div className="py-1">
                  <button
                    onClick={() => { navigate('/dashboard/settings'); setProfileOpen(false); }}
                    className="flex items-center gap-2.5 w-full px-4 py-2.5
                               text-sm text-[#2C2C2C]/70 hover:bg-[#FAF0F2]
                               hover:text-[#C4717A] transition-colors"
                  >
                    Settings
                  </button>
                  <button
                    onClick={() => { navigate('/dashboard/logs'); setProfileOpen(false); }}
                    className="flex items-center gap-2.5 w-full px-4 py-2.5
                               text-sm text-[#2C2C2C]/70 hover:bg-[#FAF0F2]
                               hover:text-[#C4717A] transition-colors"
                  >
                    Activity Log
                  </button>
                </div>

                {/* Security */}
                <div className="border-t border-[#EDE0E4] py-1">
                  <button
                    onClick={async () => {
                      setProfileOpen(false);
                      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
                      navigate('/');
                    }}
                    className="flex items-center gap-2.5 w-full px-4 py-2.5
                               text-sm text-red-500 hover:bg-red-50 transition-colors"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>

        </header>

        {/* ── Page Content ── */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 md:p-6 max-w-screen-2xl mx-auto">
            <Outlet />
          </div>
        </main>

      </div>

      {/* ── Animation keyframes ── */}
      <style>{`
        @keyframes fadeSlideDown {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

    </div>
  );
};

export default DashboardLayout;