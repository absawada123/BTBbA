// client/src/components/layout/PublicNav.tsx
import React, { useEffect, useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { Home, Image, Info, Search, Flower2 } from 'lucide-react';
import logo from '../../assets/images/logo.png';

const NAV_LINKS = [
  { label: 'Home',    to: '/home',     icon: <Home   className="h-5 w-5" /> },
  { label: 'Gallery', to: '/projects', icon: <Image  className="h-5 w-5" /> },
  { label: 'About',   to: '/about',    icon: <Info   className="h-5 w-5" /> },
  { label: 'Track',   to: '/track',    icon: <Search className="h-5 w-5" /> },
];

const PublicNav: React.FC = () => {
  const location               = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const isLanding               = location.pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (isLanding) return <Outlet />;

  return (
    <div className="min-h-screen bg-[#FAF6F0]">

      {/* ── Top Navbar — md and up ── */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 hidden md:block transition-all duration-300 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-[#C4717A]/10'
            : 'bg-transparent'
        }`}
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 shrink-0">
              <div className="h-9 w-9 rounded-full bg-white shadow border border-[#C4717A]/15 flex items-center justify-center p-1.5">
                <img src={logo} alt="BTBbA" className="h-full w-full object-contain" />
              </div>
              <div>
                <p className="text-sm font-bold text-[#2C2C2C] leading-none">Beyond the Bloom</p>
                <p className="text-[10px] italic font-serif text-[#C4717A] leading-none mt-0.5">by A</p>
              </div>
            </Link>

            {/* Links */}
            <nav className="flex items-center gap-1">
              {NAV_LINKS.map((link) => {
                const isActive = location.pathname === link.to;
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                      isActive
                        ? 'bg-[#C4717A]/10 text-[#C4717A]'
                        : 'text-[#2C2C2C]/60 hover:text-[#C4717A] hover:bg-[#C4717A]/5'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* CTA */}
            <Link
              to="/inquiry"
              className="inline-flex items-center gap-1.5 rounded-full bg-[#C4717A] px-5 py-2 text-xs font-bold text-white shadow-md shadow-[#C4717A]/25 transition hover:bg-[#b05f68] active:scale-95"
            >
              <Flower2 className="h-3.5 w-3.5" />
              Order Now
            </Link>
          </div>
        </div>
      </header>

      {/* ── Mobile Top Bar — logo only, sm and below ── */}
      <header className="fixed top-0 left-0 right-0 z-50 md:hidden">
        <div
          className={`flex h-14 items-center justify-between px-4 transition-all duration-300 ${
            scrolled
              ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-[#C4717A]/10'
              : 'bg-transparent'
          }`}
        >
          <Link to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-white shadow border border-[#C4717A]/15 flex items-center justify-center p-1">
              <img src={logo} alt="BTBbA" className="h-full w-full object-contain" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#2C2C2C] leading-none">Beyond the Bloom</p>
              <p className="text-[9px] italic font-serif text-[#C4717A] leading-none mt-0.5">by A</p>
            </div>
          </Link>

          <Link
            to="/inquiry"
            className="inline-flex items-center gap-1 rounded-full bg-[#C4717A] px-3.5 py-1.5 text-[11px] font-bold text-white shadow transition hover:bg-[#b05f68] active:scale-95"
          >
            <Flower2 className="h-3 w-3" />
            Order
          </Link>
        </div>
      </header>

      {/* Page content */}
      <div className="pt-14 md:pt-16 pb-20 md:pb-0">
        <Outlet />
      </div>

      {/* ── Bottom Nav — mobile only ── */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
        {/* Soft top fade */}
        <div className="h-4 bg-gradient-to-t from-white/80 to-transparent pointer-events-none" />
        <div className="bg-white/95 backdrop-blur-md border-t border-[#C4717A]/10 shadow-[0_-4px_24px_rgba(196,113,122,0.08)]">
          <div className="flex items-center justify-around px-2 py-1 safe-area-bottom">
            {NAV_LINKS.map((link) => {
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className="flex flex-1 flex-col items-center gap-0.5 py-2 transition-all active:scale-90"
                >
                  <span
                    className={`flex h-8 w-8 items-center justify-center rounded-2xl transition-all duration-200 ${
                      isActive
                        ? 'bg-[#C4717A]/12 text-[#C4717A] scale-110'
                        : 'text-[#2C2C2C]/35'
                    }`}
                  >
                    {link.icon}
                  </span>
                  <span
                    className={`text-[10px] font-semibold transition-colors duration-200 ${
                      isActive ? 'text-[#C4717A]' : 'text-[#2C2C2C]/35'
                    }`}
                  >
                    {link.label}
                  </span>
                  {isActive && (
                    <span className="absolute -bottom-0 h-0.5 w-8 rounded-full bg-[#C4717A]" />
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

    </div>
  );
};

export default PublicNav;