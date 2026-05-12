// client/src/components/pages/public/home/SmartNav.tsx
import React, { useState } from 'react';
import { Home, Flower2, Star, Image, GitBranch, Mail, ChevronUp } from 'lucide-react';

type SectionId = 'top' | 'services' | 'why' | 'featured-projects' | 'workflow' | 'inquiry';

const navItems: { id: SectionId; label: string; icon: React.ReactNode }[] = [
  { id: 'top',               label: 'Home',     icon: <Home      className="h-3.5 w-3.5" /> },
  { id: 'services',          label: 'Services', icon: <Flower2   className="h-3.5 w-3.5" /> },
  { id: 'why',               label: 'Why Us',   icon: <Star      className="h-3.5 w-3.5" /> },
  { id: 'featured-projects', label: 'Gallery',  icon: <Image     className="h-3.5 w-3.5" /> },
  { id: 'workflow',          label: 'Process',  icon: <GitBranch className="h-3.5 w-3.5" /> },
  { id: 'inquiry',           label: 'Order',    icon: <Mail      className="h-3.5 w-3.5" /> },
];

interface SmartNavProps {
  activeSection: SectionId;
  scrollToSection: (id: string) => void;
}

export const SmartNav: React.FC<SmartNavProps> = ({ activeSection, scrollToSection }) => {
  const [hovered, setHovered] = useState<SectionId | null>(null);

  return (
    <div className="fixed right-5 top-1/2 z-50 hidden -translate-y-1/2 flex-col gap-3 lg:flex">
      <div className="absolute right-[14px] top-0 bottom-0 w-px bg-[#C4717A]/20" />
      {navItems.map((item) => {
        const isActive  = activeSection === item.id;
        const isHovered = hovered === item.id;
        return (
          <div key={item.id} className="group relative flex items-center justify-end" onMouseEnter={() => setHovered(item.id)} onMouseLeave={() => setHovered(null)}>
            <div className={`absolute right-11 whitespace-nowrap rounded-full bg-[#2C2C2C] px-3 py-1 text-xs font-medium text-white shadow-lg transition-all duration-300 ${isHovered || isActive ? 'translate-x-0 opacity-100' : 'translate-x-2 opacity-0'}`}>
              {item.label}
              <div className="absolute -right-1 top-1/2 -mt-1 h-2 w-2 rotate-45 bg-[#2C2C2C]" />
            </div>
            <button
              onClick={() => scrollToSection(item.id)}
              className={`relative z-10 flex h-7 w-7 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                isActive
                  ? 'scale-125 border-[#C4717A] bg-[#C4717A] text-white shadow-lg shadow-[#C4717A]/40'
                  : 'border-[#C4717A]/30 bg-white text-[#C4717A]/50 hover:border-[#C4717A] hover:text-[#C4717A]'
              }`}
              aria-label={`Go to ${item.label}`}
            >
              {item.icon}
            </button>
          </div>
        );
      })}
    </div>
  );
};

export const ScrollProgressLine: React.FC<{ progress: number }> = ({ progress }) => (
  <div className="fixed left-0 top-0 z-[60] h-[3px] w-full bg-transparent pointer-events-none">
    <div className="h-full bg-gradient-to-r from-[#C4717A] via-[#C9A84C] to-[#6B7C5C] transition-all duration-150 ease-out" style={{ width: `${progress}%` }} />
  </div>
);

export const ScrollToTop: React.FC<{ progress: number; onClick: () => void }> = ({ progress, onClick }) => {
  const show = progress > 30;
  const r    = 22;
  const circ = r * 2 * Math.PI;

  return (
    <button
      onClick={onClick}
      className={`fixed bottom-6 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#C4717A] shadow-xl border border-[#C4717A]/20 transition-all duration-500 hover:bg-[#C4717A] hover:text-white hover:shadow-2xl ${show ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'}`}
      aria-label="Back to top"
    >
      <ChevronUp className="h-5 w-5 relative z-10" />
      <svg className="absolute inset-0 -rotate-90" width="48" height="48">
        <circle stroke="#C4717A" strokeWidth="2" fill="transparent" strokeOpacity="0.15" r={r} cx="24" cy="24" />
        <circle stroke="#C4717A" strokeWidth="2" strokeDasharray={circ} strokeDashoffset={circ - (progress / 100) * circ} strokeLinecap="round" fill="transparent" r={r} cx="24" cy="24" className="transition-all duration-300" />
      </svg>
    </button>
  );
};