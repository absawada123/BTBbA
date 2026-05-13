// client/src/components/layout/Sidebar.tsx

import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, MessageSquare, ShoppingBag, TrendingUp,
  Package, List, Truck, Receipt, Wallet, ArrowLeftRight,
  PiggyBank, BarChart2, PieChart, Users, Upload,
  ScrollText, Settings, ChevronLeft, LogOut, Flower2,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/images/logo.png';

// ─── Nav Structure ────────────────────────────────────────────────────────────

const NAV_GROUPS = [
  {
    label: 'Overview',
    items: [
      { label: 'Dashboard',   to: '/dashboard',            icon: LayoutDashboard },
    ],
  },
  {
    label: 'Operations',
    items: [
      { label: 'Inquiries',   to: '/dashboard/inquiries',  icon: MessageSquare },
      { label: 'Orders',      to: '/dashboard/orders',     icon: ShoppingBag },
      { label: 'Sales',       to: '/dashboard/sales',      icon: TrendingUp },
    ],
  },
  {
    label: 'Inventory & Products',
    items: [
      { label: 'Inventory',   to: '/dashboard/inventory',  icon: Package },
      { label: 'Products',    to: '/dashboard/products',   icon: List },
      { label: 'Suppliers',   to: '/dashboard/suppliers',  icon: Truck },
    ],
  },
  {
    label: 'Financials',
    items: [
      { label: 'Expenses',    to: '/dashboard/expenses',   icon: Receipt },
      { label: 'Accounts',    to: '/dashboard/accounts',   icon: Wallet },
      { label: 'Cash Flow',   to: '/dashboard/cashflow',   icon: ArrowLeftRight },
      { label: 'Savings',     to: '/dashboard/savings',    icon: PiggyBank },
    ],
  },
  {
    label: 'Analytics',
    items: [
      { label: 'Reports',     to: '/dashboard/reports',    icon: BarChart2 },
      { label: 'Analytics',   to: '/dashboard/analytics',  icon: PieChart },
    ],
  },
  {
    label: 'Customers',
    items: [
      { label: 'Customers',   to: '/dashboard/customers',  icon: Users },
    ],
  },
  {
    label: 'System',
    items: [
      { label: 'Import Data', to: '/dashboard/import',     icon: Upload },
      { label: 'Activity Log',to: '/dashboard/logs',       icon: ScrollText },
      { label: 'Settings',    to: '/dashboard/settings',   icon: Settings },
    ],
  },
];

// ─── Props ────────────────────────────────────────────────────────────────────

interface SidebarProps {
  collapsed: boolean;
  onCollapse: (v: boolean) => void;
  onClose?: () => void; // mobile drawer close
  mobile?: boolean;
}

// ─── Component ────────────────────────────────────────────────────────────────

const Sidebar: React.FC<SidebarProps> = ({ collapsed, onCollapse, onClose, mobile }) => {
  const { admin, logout } = useAuth();
  const navigate          = useNavigate();

  async function handleLogout() {
    await logout();
    navigate('/');
  }

  return (
    <aside
      className={`
        flex flex-col h-full bg-white border-r border-[#EDE0E4]
        transition-all duration-300 ease-in-out overflow-hidden
        ${collapsed && !mobile ? 'w-[64px]' : 'w-[240px]'}
      `}
    >
      {/* ── Brand ── */}
      <div className={`
        flex items-center gap-2.5 px-4 border-b border-[#EDE0E4]
        ${collapsed && !mobile ? 'justify-center px-0 py-4' : 'py-3.5'}
      `}>
        <div className="h-8 w-8 shrink-0 rounded-full bg-[#FAF0F2] border border-[#C4717A]/20
                        flex items-center justify-center p-1.5">
          <img src={logo} alt="BTBbyA" className="h-full w-full object-contain" />
        </div>
        {(!collapsed || mobile) && (
          <div className="min-w-0">
            <p className="text-[11px] font-bold text-[#2C2C2C] leading-none truncate">Beyond the Bloom</p>
            <p className="text-[9px] italic font-serif text-[#C4717A] leading-none mt-0.5">by A · Admin</p>
          </div>
        )}
      </div>

      {/* ── Nav Groups ── */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-4 scrollbar-thin">
        {NAV_GROUPS.map((group) => (
          <div key={group.label}>
            {/* Group label — hidden when collapsed */}
            {(!collapsed || mobile) && (
              <p className="px-2 mb-1 text-[10px] font-bold uppercase tracking-widest text-[#C4717A]/60 select-none">
                {group.label}
              </p>
            )}
            {collapsed && !mobile && (
              <div className="mx-auto mb-1 h-px w-8 bg-[#EDE0E4]" />
            )}

            <ul className="space-y-0.5">
              {group.items.map(({ label, to, icon: Icon }) => (
                <li key={to}>
                  <NavLink
                    to={to}
                    end={to === '/dashboard'}
                    onClick={onClose}
                    className={({ isActive }) => `
                      flex items-center gap-2.5 rounded-lg px-2.5 py-2
                      text-sm font-medium transition-all duration-150
                      min-h-[40px] select-none group relative
                      ${isActive
                        ? 'bg-[#C4717A]/10 text-[#C4717A]'
                        : 'text-[#2C2C2C]/60 hover:bg-[#FAF0F2] hover:text-[#C4717A]'
                      }
                      ${collapsed && !mobile ? 'justify-center px-0' : ''}
                    `}
                    title={collapsed && !mobile ? label : undefined}
                  >
                    {({ isActive }) => (
                      <>
                        <Icon
                          className={`h-4.5 w-4.5 shrink-0 transition-colors
                            ${isActive ? 'text-[#C4717A]' : 'text-[#2C2C2C]/40 group-hover:text-[#C4717A]'}`}
                          size={18}
                        />
                        {(!collapsed || mobile) && (
                          <span className="truncate">{label}</span>
                        )}
                        {/* Active indicator bar */}
                        {isActive && (
                          <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5
                                           bg-[#C4717A] rounded-r-full" />
                        )}
                        {/* Tooltip when collapsed */}
                        {collapsed && !mobile && (
                          <span className="
                            pointer-events-none absolute left-[110%] top-1/2 -translate-y-1/2
                            whitespace-nowrap rounded-md bg-[#2C2C2C] px-2.5 py-1
                            text-xs font-medium text-white shadow-lg
                            opacity-0 group-hover:opacity-100
                            transition-opacity duration-150 z-50
                          ">
                            {label}
                          </span>
                        )}
                      </>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {/* ── Footer: Admin info + Logout ── */}
      <div className="border-t border-[#EDE0E4] p-2 space-y-1">
        {/* Admin badge */}
        {(!collapsed || mobile) && admin && (
          <div className="flex items-center gap-2 px-2.5 py-2 rounded-lg bg-[#FAF0F2]">
            <div className="h-7 w-7 shrink-0 rounded-full bg-[#C4717A]/20
                            flex items-center justify-center text-[11px] font-bold text-[#C4717A]">
              {admin.username?.[0]?.toUpperCase() ?? 'A'}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-[#2C2C2C] truncate">{admin.username}</p>
              <p className="text-[10px] text-[#2C2C2C]/40 truncate">{admin.role}</p>
            </div>
          </div>
        )}

        {/* Collapse toggle — desktop only */}
        {!mobile && (
          <button
            onClick={() => onCollapse(!collapsed)}
            className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2
                       text-sm text-[#2C2C2C]/50 hover:bg-[#FAF0F2] hover:text-[#C4717A]
                       transition-colors duration-150 min-h-[40px]
                       select-none group"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <ChevronLeft
              size={18}
              className={`shrink-0 transition-transform duration-300
                ${collapsed ? 'rotate-180' : ''}`}
            />
            {!collapsed && <span className="text-xs">Collapse</span>}
          </button>
        )}

        {/* Logout */}
        <button
          onClick={handleLogout}
          className={`
            flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2
            text-sm text-[#2C2C2C]/50 hover:bg-red-50 hover:text-red-500
            transition-colors duration-150 min-h-[40px] select-none
            ${collapsed && !mobile ? 'justify-center px-0' : ''}
          `}
          title="Logout"
          aria-label="Logout"
        >
          <LogOut size={18} className="shrink-0" />
          {(!collapsed || mobile) && <span className="text-xs">Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;