// client/src/components/pages/public/Projects.tsx
// ↓ Only the hero <div> text block changes — full file returned for safety

import React, { useState, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Flower2, CalendarHeart, Package, Heart, X, Search, ArrowUpRight } from 'lucide-react';
import { useScrollProgress } from '../../hooks/useScrollProgress';
import { projects, type Project, type ProjectCategory } from '../../../data/projects';
import { ScrollProgressLine } from './home/SmartNav';

const CATEGORY_CONFIG: Record<ProjectCategory, { icon: React.ReactNode; color: string }> = {
  'Custom Bouquet': { icon: <Flower2 className="h-4 w-4" />,       color: '#C4717A' },
  'Pop-Up Event':   { icon: <CalendarHeart className="h-4 w-4" />, color: '#C9A84C' },
  'Pre-Order':      { icon: <Package className="h-4 w-4" />,       color: '#6B7C5C' },
  "Mother's Day":   { icon: <Heart className="h-4 w-4" />,         color: '#C4717A' },
};

const TABS: Array<'All' | ProjectCategory> = [
  'All', 'Custom Bouquet', 'Pop-Up Event', 'Pre-Order', "Mother's Day",
];

const shuffle = <T,>(arr: T[]): T[] => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const KEYFRAMES = `
  @keyframes film-left {
    0%   { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
  @keyframes film-right {
    0%   { transform: translateX(-50%); }
    100% { transform: translateX(0); }
  }
`;

interface FilmStripProps {
  images:    { id: number; image: string; title: string }[];
  direction: 'left' | 'right';
  duration:  number;
  imgSize:   number;
}

const FilmStrip: React.FC<FilmStripProps> = ({ images, direction, duration, imgSize }) => {
  const doubled  = [...images, ...images];
  const animName = direction === 'left' ? 'film-left' : 'film-right';
  return (
    <div style={{ overflow: 'hidden', display: 'flex', width: '100%' }}>
      <div style={{ display: 'flex', gap: 10, animation: `${animName} ${duration}s linear infinite`, willChange: 'transform', flexShrink: 0 }}>
        {doubled.map((img, i) => (
          <div key={`${img.id}-${i}`} style={{ flexShrink: 0, width: imgSize * 0.88, height: imgSize, borderRadius: 14, overflow: 'hidden' }}>
            <img src={img.image} alt={img.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} draggable={false} />
          </div>
        ))}
      </div>
    </div>
  );
};

const Projects: React.FC = () => {
  const scrollProgress            = useScrollProgress();
  const [activeTab, setActiveTab] = useState<'All' | ProjectCategory>('All');
  const [search,    setSearch]    = useState('');
  const [selected,  setSelected]  = useState<Project | null>(null);
  const [hovered,   setHovered]   = useState<number | null>(null);

  const allImgs = projects.map((p) => ({ id: p.id, image: p.image, title: p.title }));
  const rows    = useRef([shuffle(allImgs), shuffle(allImgs), shuffle(allImgs), shuffle(allImgs)]);

  const filtered = useMemo(() => projects.filter((p) => {
    const matchCat    = activeTab === 'All' || p.category === activeTab;
    const matchSearch = search === '' || p.title.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  }), [activeTab, search]);

  const showcaseItems = useMemo(() => {
    const picks = projects.filter((_, i) => i % 3 === 0).slice(0, 6);
    return picks.length >= 3 ? picks : projects.slice(0, 6);
  }, []);

  return (
    <div className="min-h-screen bg-[#FAF6F0] pb-24">
      <style>{KEYFRAMES}</style>
      <ScrollProgressLine progress={scrollProgress} />

      {/* ── Hero ── */}
      <section
        className="relative overflow-hidden select-none"
        style={{
          height:     'clamp(500px, 90vh, 860px)',
          background: 'linear-gradient(135deg, #e8b4bb 0%, #eec4ca 25%, #F2D9DC 50%, #f7e8ea 75%, #FAF6F0 100%)',
        }}
      >
        {/* Ambient blobs */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', top: '-10%', left: '-10%',  width: '50%', height: '60%', borderRadius: '50%', background: 'rgba(201,168,76,0.15)',  filter: 'blur(80px)' }} />
          <div style={{ position: 'absolute', bottom: '0%', right: '-5%', width: '45%', height: '55%', borderRadius: '50%', background: 'rgba(196,113,122,0.18)', filter: 'blur(90px)' }} />
          <div style={{ position: 'absolute', top: '30%', right: '20%',   width: '30%', height: '40%', borderRadius: '50%', background: 'rgba(107,124,92,0.08)',  filter: 'blur(60px)' }} />
        </div>

        {/* Film strips */}
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          gap: 10, padding: '10px 0',
          transform: 'rotate(-6deg) scale(1.28)',
          pointerEvents: 'none',
          opacity: 0.18,
        }}>
          <FilmStrip images={rows.current[0]} direction="left"  duration={30} imgSize={130} />
          <FilmStrip images={rows.current[1]} direction="right" duration={24} imgSize={110} />
          <FilmStrip images={rows.current[2]} direction="left"  duration={36} imgSize={130} />
          <FilmStrip images={rows.current[3]} direction="right" duration={20} imgSize={110} />
        </div>

        {/* Soft edge vignette */}
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 70% 60% at 50% 50%, transparent 30%, rgba(232,180,187,0.2) 70%, rgba(220,160,168,0.35) 100%)' }} />
        <div style={{ position: 'absolute', inset: '0 0 auto', height: 80,  background: 'linear-gradient(to bottom, rgba(232,180,187,0.5), transparent)' }} />
        <div style={{ position: 'absolute', inset: 'auto 0 0',  height: 140, background: 'linear-gradient(to top, #FAF6F0, transparent)' }} />

        {/* ── All text: pure white ── */}
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          zIndex: 10, textAlign: 'center', padding: '0 16px', pointerEvents: 'none',
        }}>

       

          {/* Giant title */}
          <h1 style={{
            fontFamily:    'Georgia, serif',
            fontStyle:     'italic',
            fontWeight:    700,
            color:         '#fff',
            lineHeight:    0.88,
            letterSpacing: '-0.02em',
            fontSize:      'clamp(4.5rem, 20vw, 14rem)',
            textShadow:    '0 2px 20px rgba(196,113,122,0.35), 0 1px 0 rgba(255,255,255,0.3)',
            margin:        0,
          }}>
            Gallery
          </h1>

          {/* Subtitle */}
          <p style={{
            marginTop:  20,
            fontSize:   14,
            color:      'rgba(255,255,255,0.85)',
            maxWidth:   300,
            lineHeight: 1.65,
            fontWeight: 500,
            textShadow: '0 1px 8px rgba(196,113,122,0.2)',
          }}>
            Every arrangement made with love,<br />
            for moments worth remembering.
          </p>

          {/* Scroll hint */}
          <div style={{ marginTop: 36, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 9, letterSpacing: '0.35em', textTransform: 'uppercase', fontWeight: 600, color: 'rgba(255,255,255,0.6)' }}>
              Scroll to explore
            </span>
            <div style={{ width: 1, height: 24, background: 'linear-gradient(to bottom, rgba(255,255,255,0.5), transparent)' }} />
          </div>
        </div>
      </section>

      {/* ── Sticky Filters ── */}
      <div className="sticky top-14 md:top-16 z-30 border-b border-[#C4717A]/10 bg-white/95 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3 space-y-2.5">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#C4717A]/50" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search arrangements..."
              className="w-full rounded-full border border-[#C4717A]/20 bg-[#FAF6F0] py-2 pl-9 pr-4 text-sm text-[#2C2C2C] placeholder-[#2C2C2C]/30 focus:border-[#C4717A] focus:outline-none focus:ring-2 focus:ring-[#C4717A]/20 transition"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-0.5 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap">
            {TABS.map((tab) => {
              const isActive = activeTab === tab;
              const color    = tab === 'All' ? '#C4717A' : CATEGORY_CONFIG[tab].color;
              const icon     = tab !== 'All' ? CATEGORY_CONFIG[tab].icon : null;
              return (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold transition-all duration-200"
                  style={{ backgroundColor: isActive ? color : `${color}12`, color: isActive ? '#fff' : color, border: `1.5px solid ${isActive ? color : `${color}30`}` }}>
                  {icon}{tab}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Grid ── */}
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <p className="mb-6 text-sm text-[#2C2C2C]/40">
          Showing <span className="font-bold text-[#2C2C2C]">{filtered.length}</span> arrangements
        </p>

        {filtered.length > 0 ? (
          <div className="grid gap-4 grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((project) => {
              const cfg     = CATEGORY_CONFIG[project.category];
              const isHover = hovered === project.id;
              return (
                <button key={project.id} onClick={() => setSelected(project)}
                  onMouseEnter={() => setHovered(project.id)} onMouseLeave={() => setHovered(null)}
                  className="group relative flex flex-col overflow-hidden rounded-2xl bg-white text-left focus:outline-none active:scale-[0.97] transition-all duration-300"
                  style={{ border: `1.5px solid ${isHover ? cfg.color + '40' : '#C4717A1A'}`, boxShadow: isHover ? `0 16px 40px ${cfg.color}22` : '0 2px 8px rgba(0,0,0,0.04)', transform: isHover ? 'translateY(-4px)' : 'translateY(0)' }}>
                  <div className="relative w-full overflow-hidden" style={{ paddingBottom: '80%' }}>
                    <img src={project.image} alt={project.title} className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent transition-opacity duration-300" style={{ opacity: isHover ? 1 : 0 }} />
                    {project.tag && (
                      <span className="absolute top-2.5 left-2.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold shadow" style={{ backgroundColor: `${cfg.color}EE`, color: '#fff' }}>
                        {project.tag}
                      </span>
                    )}
                    {project.price && (
                      <span className="absolute top-2.5 right-2.5 rounded-full bg-white/90 px-2.5 py-0.5 text-[10px] font-bold text-[#2C2C2C] shadow">
                        {project.price}
                      </span>
                    )}
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-white/90 px-3 py-1 text-[10px] font-bold text-[#2C2C2C] whitespace-nowrap shadow transition-all duration-300"
                      style={{ opacity: isHover ? 1 : 0, transform: `translateX(-50%) translateY(${isHover ? 0 : 6}px)` }}>
                      View Details
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col p-3 sm:p-4">
                    <span className="mb-1.5 inline-flex items-center gap-1 self-start rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider"
                      style={{ backgroundColor: `${cfg.color}15`, color: cfg.color }}>
                      {cfg.icon}<span className="hidden sm:inline">{project.category}</span>
                    </span>
                    <h3 className="text-xs font-bold leading-snug sm:text-sm transition-colors duration-200" style={{ color: isHover ? cfg.color : '#2C2C2C' }}>
                      {project.title}
                    </h3>
                    <p className="mt-1 text-[11px] text-[#2C2C2C]/50 leading-relaxed line-clamp-2 hidden sm:block">
                      {project.description}
                    </p>
                  </div>
                  <div className="absolute bottom-0 left-0 h-0.5 transition-all duration-500" style={{ width: isHover ? '100%' : '0%', backgroundColor: cfg.color }} />
                </button>
              );
            })}

            {filtered.length >= 4 && (
              <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#C4717A]/20 bg-[#C4717A]/5 p-4 text-center min-h-[180px]">
                <div className="mb-2 text-2xl">🌸</div>
                <h3 className="text-xs font-bold text-[#2C2C2C] sm:text-sm">Want one like this?</h3>
                <p className="mt-1 mb-3 text-[11px] text-[#2C2C2C]/55 hidden sm:block">Tell us your vision.</p>
                <Link to="/inquiry" onClick={(e) => e.stopPropagation()}
                  className="rounded-full bg-[#C4717A] px-4 py-1.5 text-xs font-bold text-white transition hover:bg-[#b05f68] active:scale-95">
                  Order Now
                </Link>
              </div>
            )}
          </div>
        ) : (
          <div className="flex h-56 flex-col items-center justify-center rounded-3xl border-2 border-dashed border-[#C4717A]/15 bg-white text-center">
            <p className="text-3xl mb-3">🌿</p>
            <p className="text-sm font-medium text-[#2C2C2C]/55">No arrangements found.</p>
            <button onClick={() => { setActiveTab('All'); setSearch(''); }}
              className="mt-3 rounded-full bg-[#FAF6F0] border border-[#C4717A]/20 px-4 py-1.5 text-xs font-semibold text-[#C4717A] hover:bg-[#C4717A]/10 transition">
              Clear Filters
            </button>
          </div>
        )}

        {/* ── Bottom Showcase ── */}
        <div className="mt-20">
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="inline-block rounded-full border border-[#C9A84C]/30 bg-[#C9A84C]/8 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#C9A84C]">
                Handpicked
              </span>
              <h2 className="mt-3 text-2xl font-bold text-[#2C2C2C] sm:text-3xl">
                A few of our <span className="ml-1 font-serif italic text-[#C4717A]">favourites</span>
              </h2>
            </div>
            <Link to="/inquiry"
              className="shrink-0 inline-flex items-center gap-1.5 rounded-full bg-[#C4717A] px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-[#C4717A]/25 transition hover:bg-[#b05f68] active:scale-95">
              <Flower2 className="h-3.5 w-3.5" /> Place an Order
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 auto-rows-[180px] sm:auto-rows-[200px]">
            {showcaseItems.map((project, idx) => {
              const cfg    = CATEGORY_CONFIG[project.category];
              const isTall = idx === 0 || idx === 3;
              return (
                <button key={project.id} onClick={() => setSelected(project)}
                  className="group relative overflow-hidden rounded-2xl focus:outline-none active:scale-[0.98] transition-transform duration-200"
                  style={{ gridRow: isTall ? 'span 2' : 'span 1' }}>
                  <img src={project.image} alt={project.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: cfg.color }} />
                    <span className="text-[10px] font-semibold text-white/80 hidden sm:block">{project.category}</span>
                  </div>
                  {project.price && (
                    <span className="absolute top-3 right-3 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-bold text-[#2C2C2C]">
                      {project.price}
                    </span>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4">
                    <h3 className="text-xs font-bold text-white leading-snug sm:text-sm drop-shadow line-clamp-2">{project.title}</h3>
                    {isTall && <p className="mt-1 text-[11px] text-white/60 line-clamp-2 hidden sm:block">{project.description}</p>}
                  </div>
                  <div className="absolute top-3 right-3 flex h-7 w-7 items-center justify-center rounded-full bg-white text-[#2C2C2C] shadow opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-110">
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </div>
                  <div className="absolute bottom-0 left-0 h-0.5 w-0 group-hover:w-full transition-all duration-500 rounded-b-2xl" style={{ backgroundColor: cfg.color }} />
                </button>
              );
            })}
          </div>

          {/* CTA strip */}
          <div className="mt-6 flex flex-col items-center gap-4 rounded-3xl px-6 py-10 text-center relative overflow-hidden sm:flex-row sm:text-left sm:py-8 sm:justify-between"
            style={{ background: 'linear-gradient(135deg, #C4717A 0%, #c97d85 40%, #d4909a 70%, #e8b4bb 100%)' }}>
            <div style={{ position: 'absolute', top: -30,  right: -30, width: 140, height: 140, borderRadius: '50%', background: 'rgba(255,255,255,0.12)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: -40, left: -20, width: 160, height: 160, borderRadius: '50%', background: 'rgba(201,168,76,0.18)', pointerEvents: 'none' }} />
            <div className="relative z-10">
              <p className="text-xs font-semibold uppercase tracking-widest text-white/70 mb-1">Ready to bloom?</p>
              <h3 className="text-lg font-bold text-white sm:text-xl">
                Let's create something beautiful <span className="font-serif italic text-white/90">together.</span>
              </h3>
              <p className="mt-1 text-sm text-white/60 max-w-sm">Every bouquet is handcrafted fresh — just for you.</p>
            </div>
            <div className="relative z-10 flex flex-col gap-2 sm:shrink-0 sm:flex-row">
              <Link to="/inquiry"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3 text-sm font-bold text-[#C4717A] shadow-lg transition hover:bg-[#FAF6F0] active:scale-95 whitespace-nowrap">
                <Flower2 className="h-4 w-4" /> Place Your Order
              </Link>
              <Link to="/track"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/40 bg-white/10 px-7 py-3 text-sm font-semibold text-white transition hover:bg-white/20 active:scale-95 whitespace-nowrap backdrop-blur-sm">
                Track My Order
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* ── Modal ── */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm sm:items-center sm:px-4"
          onClick={() => setSelected(null)}>
          <div className="w-full max-w-md overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl"
            onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-center pt-3 pb-1 sm:hidden">
              <div className="h-1 w-10 rounded-full bg-[#2C2C2C]/15" />
            </div>
            <div className="relative h-64 w-full overflow-hidden">
              <img src={selected.image} alt={selected.title} className="h-full w-full object-cover" />
              <button onClick={() => setSelected(null)}
                className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm hover:bg-black/60 transition">
                <X className="h-4 w-4" />
              </button>
              {selected.price && (
                <span className="absolute bottom-3 right-3 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-[#2C2C2C] shadow">
                  {selected.price}
                </span>
              )}
            </div>
            <div className="p-5">
              {(() => {
                const cfg = CATEGORY_CONFIG[selected.category];
                return (
                  <>
                    <span className="inline-flex items-center gap-1 rounded-full px-3 py-0.5 text-xs font-bold uppercase tracking-wider mb-3"
                      style={{ backgroundColor: `${cfg.color}15`, color: cfg.color }}>
                      {cfg.icon}{selected.category}
                    </span>
                    <h2 className="text-lg font-bold text-[#2C2C2C]">{selected.title}</h2>
                    <p className="mt-2 text-sm text-[#2C2C2C]/60 leading-relaxed">{selected.description}</p>
                    {selected.tag && (
                      <span className="mt-2 inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold"
                        style={{ backgroundColor: `${cfg.color}CC`, color: '#fff' }}>
                        {selected.tag}
                      </span>
                    )}
                    <div className="mt-5 flex gap-3">
                      <Link to="/inquiry"
                        className="flex-1 rounded-full py-2.5 text-center text-sm font-bold text-white transition hover:opacity-90 active:scale-95"
                        style={{ backgroundColor: cfg.color }}>
                        Order Similar
                      </Link>
                      <button onClick={() => setSelected(null)}
                        className="flex-1 rounded-full border py-2.5 text-sm font-semibold transition hover:bg-[#FAF6F0]"
                        style={{ borderColor: `${cfg.color}30`, color: cfg.color }}>
                        Close
                      </button>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;