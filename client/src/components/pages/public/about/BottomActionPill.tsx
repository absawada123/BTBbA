// client/src/pages/public/about/BottomActionPill.tsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  IconHome, 
  IconBriefcase, 
  IconUsers, 
  IconArrowUp, 
  IconMenu, 
  IconArrowRight 
} from '../../../components/common/Icons';

interface BottomActionPillProps {
  scrollProgress: number;
  onScrollToTop: () => void;
}

export const BottomActionPill: React.FC<BottomActionPillProps> = ({ scrollProgress, onScrollToTop }) => {
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isProjectsPage = location.pathname === '/projects';

  let label = "Continue Exploring";
  let mode: 'nav' | 'action' = 'nav';

  if (scrollProgress < 10) {
    label = "Scroll to Explore";
  } else if (scrollProgress > 90) {
    label = "Start a Project";
    mode = 'action';
  }

  useEffect(() => {
    setExpanded(false);
  }, [scrollProgress]);

  const handleMainClick = () => {
    if (mode === 'action') {
      navigate('/inquiry');
    } else {
      setExpanded(!expanded);
    }
  };

  return (
    <div className="fixed bottom-8 left-0 right-0 z-[65] flex flex-col items-center justify-center pointer-events-none">
      {/* Expanded Actions Menu */}
      <div 
        className={`
          pointer-events-auto mb-4 flex gap-4 transition-all duration-300 ease-out
          ${expanded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0 pointer-events-none'}
        `}
      >
        <Link 
          to="/" 
          className="flex h-12 w-12 flex-col items-center justify-center rounded-full bg-white text-slate-900 shadow-lg ring-1 ring-slate-900/5 transition-transform hover:scale-110"
          aria-label="Home"
        >
          <IconHome className="h-5 w-5" />
        </Link>
        <button 
          onClick={onScrollToTop}
          className="flex h-12 w-12 flex-col items-center justify-center rounded-full bg-slate-900 text-white shadow-lg ring-1 ring-slate-900/5 transition-transform hover:scale-110"
          aria-label="Top"
        >
          <IconArrowUp className="h-5 w-5" />
        </button>
        {isProjectsPage ? (
          <Link 
            to="/about" 
            className="flex h-12 w-12 flex-col items-center justify-center rounded-full bg-white text-slate-900 shadow-lg ring-1 ring-slate-900/5 transition-transform hover:scale-110"
            aria-label="About"
          >
            <IconUsers className="h-5 w-5" />
          </Link>
        ) : (
          <Link 
            to="/projects" 
            className="flex h-12 w-12 flex-col items-center justify-center rounded-full bg-white text-slate-900 shadow-lg ring-1 ring-slate-900/5 transition-transform hover:scale-110"
            aria-label="Projects"
          >
            <IconBriefcase className="h-5 w-5" />
          </Link>
        )}
      </div>

      {/* Main Pill Button */}
      <button
        onClick={handleMainClick}
        className={`
          pointer-events-auto group relative flex items-center gap-3 rounded-full pl-4 pr-5 py-3 shadow-[0_8px_30px_rgb(0,0,0,0.12)] ring-1 ring-black/5 transition-all duration-300 hover:shadow-[0_8px_30px_rgb(242,142,28,0.2)]
          ${mode === 'action' ? 'bg-slate-900 text-white hover:bg-slate-800' : 'bg-white text-slate-700 hover:text-slate-900'}
        `}
      >
        <div className="relative h-5 w-5 overflow-hidden">
          <div className={`absolute inset-0 flex items-center justify-center transition-transform duration-500 ${mode === 'action' ? '-translate-y-full' : 'translate-y-0'}`}>
            <IconMenu className={`h-5 w-5 ${expanded ? 'rotate-90' : ''} transition-transform duration-300`} />
          </div>
          <div className={`absolute inset-0 flex items-center justify-center transition-transform duration-500 ${mode === 'action' ? 'translate-y-0' : 'translate-y-full'}`}>
            <IconArrowRight className="h-5 w-5" />
          </div>
        </div>

        <span className="text-sm font-semibold tracking-wide">
          {label}
        </span>

        {mode === 'action' && (
          <span className="absolute -right-1 -top-1 flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-400 opacity-75"></span>
            <span className="relative inline-flex h-3 w-3 rounded-full bg-orange-500"></span>
          </span>
        )}
      </button>
    </div>
  );
};
