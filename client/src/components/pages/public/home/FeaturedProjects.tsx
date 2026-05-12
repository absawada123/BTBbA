// client/src/components/pages/public/home/FeaturedProjects.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Flower2, CalendarHeart, Package, Heart, ChevronRight } from 'lucide-react';
import { projects, type ProjectCategory } from '../../../../data/projects';

const CATEGORY_CONFIG: Record<
  ProjectCategory,
  { label: string; icon: React.ReactNode; color: string }
> = {
  'Custom Bouquet': { label: 'Custom Bouquet', icon: <Flower2 className="h-4 w-4" />,       color: '#C4717A' },
  'Pop-Up Event':   { label: 'Pop-Up Event',   icon: <CalendarHeart className="h-4 w-4" />, color: '#C9A84C' },
  'Pre-Order':      { label: 'Pre-Order',       icon: <Package className="h-4 w-4" />,       color: '#6B7C5C' },
  "Mother's Day":   { label: "Mother's Day",    icon: <Heart className="h-4 w-4" />,         color: '#C4717A' },
};

const TABS: ProjectCategory[] = ['Custom Bouquet', 'Pop-Up Event', "Mother's Day"];

const FEATURED_IDS: Record<ProjectCategory, number[]> = {
  'Custom Bouquet': [1, 2, 3, 4, 5, 6],
  'Pop-Up Event':   [7, 8, 9],
  'Pre-Order':      [],
  "Mother's Day":   [10, 11, 12, 13, 14, 15],
};

const FeaturedProjects: React.FC = () => {
  const [activeTab, setActiveTab]   = useState<ProjectCategory>('Custom Bouquet');
  const [hovered,   setHovered]     = useState<number | null>(null);

  const visible = projects.filter((p) =>
    FEATURED_IDS[activeTab].includes(p.id)
  );

  const { color: tabColor } = CATEGORY_CONFIG[activeTab];

  return (
    <section id="featured-projects" className="scroll-mt-24 bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* ── Header ── */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="inline-block rounded-full border border-[#C9A84C]/30 bg-[#C9A84C]/8 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#C9A84C]">
              Featured Work
            </span>
            <h2 className="mt-4 text-3xl font-bold text-[#2C2C2C] sm:text-4xl">
              Fresh from the
              <span className="ml-2 italic font-serif text-[#C4717A]">studio</span>
            </h2>
          </div>
          <Link
            to="/projects"
            className="shrink-0 inline-flex items-center gap-1.5 text-sm font-semibold text-[#C4717A] hover:underline underline-offset-2"
          >
            View all <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        {/* ── Category Tabs ── */}
        <div className="mb-8 flex flex-wrap gap-2">
          {TABS.map((tab) => {
            const cfg     = CATEGORY_CONFIG[tab];
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200"
                style={{
                  backgroundColor: isActive ? cfg.color : `${cfg.color}10`,
                  color:           isActive ? '#fff'     : cfg.color,
                  border:          `1.5px solid ${isActive ? cfg.color : `${cfg.color}30`}`,
                }}
              >
                {cfg.icon}
                {cfg.label}
              </button>
            );
          })}
        </div>

        {/* ── Grid ── */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((item) => (
            <div
              key={item.id}
              onMouseEnter={() => setHovered(item.id)}
              onMouseLeave={() => setHovered(null)}
              className="group relative overflow-hidden rounded-3xl border border-[#C4717A]/10 bg-[#FAF6F0] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer"
              style={{
                boxShadow: hovered === item.id ? `0 20px 40px ${tabColor}25` : undefined,
              }}
            >
              {/* Image */}
              <div className="relative h-52 w-full overflow-hidden sm:h-56">
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* Tag badge */}
                {item.tag && (
                  <span
                    className="absolute top-3 left-3 rounded-full px-2.5 py-1 text-xs font-bold backdrop-blur-sm"
                    style={{
                      backgroundColor: `${tabColor}CC`,
                      color: '#fff',
                    }}
                  >
                    {item.tag}
                  </span>
                )}
                {/* Price badge */}
                {item.price && (
                  <span className="absolute top-3 right-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-bold text-[#2C2C2C] backdrop-blur-sm shadow">
                    {item.price}
                  </span>
                )}
              </div>

              {/* Content */}
              <div className="p-5">
                <span
                  className="inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold mb-2"
                  style={{ backgroundColor: `${tabColor}15`, color: tabColor }}
                >
                  {item.category}
                </span>
                <h3 className="text-base font-bold text-[#2C2C2C] group-hover:text-[#C4717A] transition-colors leading-snug">
                  {item.title}
                </h3>
                <p className="mt-1.5 text-sm text-[#2C2C2C]/55 leading-relaxed line-clamp-2">
                  {item.description}
                </p>
              </div>

              {/* Bottom accent line */}
              <div
                className="absolute bottom-0 left-0 h-0.5 w-0 transition-all duration-500 group-hover:w-full"
                style={{ backgroundColor: tabColor }}
              />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default FeaturedProjects;