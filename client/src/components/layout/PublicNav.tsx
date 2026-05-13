// client/src/components/layout/PublicNav.tsx

import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { Home, Image, Info, Search, Flower2 } from 'lucide-react';
import logo from '../../assets/images/logo.png';
import AdminLoginModal from './AdminLoginModal';
import { useAuth } from '../../context/AuthContext';

interface Admin {
  id: number;
  username: string;
  email: string;
  role: string;
}

const NAV_LINKS = [
  { label: 'Home',    to: '/home',     icon: <Home   className="h-5 w-5" /> },
  { label: 'Gallery', to: '/projects', icon: <Image  className="h-5 w-5" /> },
  { label: 'About',   to: '/about',    icon: <Info   className="h-5 w-5" /> },
  { label: 'Track',   to: '/track',    icon: <Search className="h-5 w-5" /> },
];

const LONG_PRESS_MS = 3000; // 3 seconds

// ─── Component ───────────────────────────────────────────────────────────────

const PublicNav: React.FC = () => {
  const location                  = useLocation();
  const navigate                  = useNavigate();
  const { login }                 = useAuth();
  const [scrolled, setScrolled]   = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  // Long press timer ref — survives re-renders, cleared on release
  const pressTimer   = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Track if long press fired — prevents navigate() on release
  const longFired    = useRef(false);

  const isLanding = location.pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => { if (pressTimer.current) clearTimeout(pressTimer.current); };
  }, []);

  // ── Press handlers ────────────────────────────────────────────────────────

  function startPress(e: React.MouseEvent | React.TouchEvent) {
    e.preventDefault(); // prevent context menu on long press mobile
    longFired.current = false;

    pressTimer.current = setTimeout(() => {
      longFired.current = true;
      setModalOpen(true); // 🌸 3s hold → open admin modal
    }, LONG_PRESS_MS);
  }

  function cancelPress() {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
      pressTimer.current = null;
    }
  }

  function releasePress() {
    cancelPress();
    // Only navigate if long press did NOT fire
    if (!longFired.current) {
      navigate('/');
    }
    longFired.current = false;
  }

  function handleLoginSuccess(admin: Admin) {
    login(admin);
    setModalOpen(false);
    navigate('/dashboard');
  }

  if (isLanding) return <Outlet />;

  // ── Logo button — shared for desktop + mobile ─────────────────────────────

  const logoButton = (compact = false) => (
    <button
      type="button"
      // Mouse events (desktop)
      onMouseDown={startPress}
      onMouseUp={releasePress}
      onMouseLeave={cancelPress}   // dragged off = cancel
      // Touch events (mobile)
      onTouchStart={startPress}
      onTouchEnd={releasePress}
      onTouchCancel={cancelPress}
      // Prevent default click so we control navigation manually
      onClick={(e) => e.preventDefault()}
      className={`
        flex items-center gap-2 bg-transparent border-0 p-0
        cursor-pointer select-none
        focus-visible:outline-none focus-visible:ring-2
        focus-visible:ring-[#C4717A]/40 rounded-lg
      `}
      aria-label="Beyond the Bloom by A — home"
      // Hint for mobile: long press opens admin
      title="Hold to access admin"
    >
      <div className={`
        rounded-full bg-white shadow border border-[#C4717A]/15
        flex items-center justify-center shrink-0 transition-transform
        active:scale-95
        ${compact ? 'h-8 w-8 p-1' : 'h-9 w-9 p-1.5'}
      `}>
        <img src={logo} alt="" className="h-full w-full object-contain" draggable={false} />
      </div>
      <div>
        <p className={`font-bold text-[#2C2C2C] leading-none
          ${compact ? 'text-xs' : 'text-sm'}`}>
          Beyond the Bloom
        </p>
        <p className={`italic font-serif text-[#C4717A] leading-none mt-0.5
          ${compact ? 'text-[9px]' : 'text-[10px]'}`}>
          by A
        </p>
      </div>
    </button>
  );

  return (
    <div className="min-h-screen bg-[#FAF6F0]">

      {/* ── Desktop Navbar ── */}
      <header className={`
        fixed top-0 left-0 right-0 z-50 hidden md:block transition-all duration-300
        ${scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-[#C4717A]/10'
          : 'bg-transparent'}
      `}>
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">

            {logoButton()}

            <nav className="flex items-center gap-1">
              {NAV_LINKS.map((link) => {
                const isActive = location.pathname === link.to;
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`rounded-full px-4 py-2 text-sm font-semibold
                                transition-all duration-200 ${
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

            <Link
              to="/inquiry"
              className="inline-flex items-center gap-1.5 rounded-full bg-[#C4717A]
                         px-5 py-2 text-xs font-bold text-white shadow-md
                         shadow-[#C4717A]/25 transition hover:bg-[#b05f68] active:scale-95"
            >
              <Flower2 className="h-3.5 w-3.5" />
              Order Now
            </Link>

          </div>
        </div>
      </header>

      {/* ── Mobile Top Bar ── */}
      <header className="fixed top-0 left-0 right-0 z-50 md:hidden">
        <div className={`
          flex h-14 items-center justify-between px-4 transition-all duration-300
          ${scrolled
            ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-[#C4717A]/10'
            : 'bg-transparent'}
        `}>
          {logoButton(true)}

          <Link
            to="/inquiry"
            className="inline-flex items-center gap-1 rounded-full bg-[#C4717A]
                       px-3.5 py-1.5 text-[11px] font-bold text-white shadow
                       transition hover:bg-[#b05f68] active:scale-95"
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

      {/* ── Mobile Bottom Nav ── */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
        <div className="h-4 bg-gradient-to-t from-white/80 to-transparent pointer-events-none" />
        <div className="bg-white/95 backdrop-blur-md border-t border-[#C4717A]/10
                        shadow-[0_-4px_24px_rgba(196,113,122,0.08)]">
          <div className="flex items-center justify-around px-2 py-1">
            {NAV_LINKS.map((link) => {
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className="flex flex-1 flex-col items-center gap-0.5 py-2
                             transition-all active:scale-90 relative"
                >
                  <span className={`
                    flex h-8 w-8 items-center justify-center rounded-2xl
                    transition-all duration-200
                    ${isActive ? 'bg-[#C4717A]/12 text-[#C4717A] scale-110' : 'text-[#2C2C2C]/35'}
                  `}>
                    {link.icon}
                  </span>
                  <span className={`
                    text-[10px] font-semibold transition-colors duration-200
                    ${isActive ? 'text-[#C4717A]' : 'text-[#2C2C2C]/35'}
                  `}>
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

      {/* ── Admin Modal ── */}
      <AdminLoginModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

    </div>
  );
};

export default PublicNav;