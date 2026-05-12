// client/src/pages/public/projects/ProjectComponents.tsx
import React, { useState, useEffect } from 'react';
import { 
  IconChevronLeft, IconChevronRight, IconFilter, IconSearch, 
  IconMapPin, IconCalendar, IconZoomIn, IconX, IconArrowRight 
} from '../../../components/common/Icons';
import { Project, ProjectType } from '../../../data/projectsData';

// --- 1. HERO SLIDER ---
export const ProjectHero: React.FC<{ projects: Project[] }> = ({ projects }) => {
  const [current, setCurrent] = useState(0);
  const featured = projects.slice(0, 3); 

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % featured.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [featured.length]);

  return (
    <div className="relative h-[70vh] w-full overflow-hidden bg-slate-900">
      {featured.map((project, idx) => (
        <div 
          key={project.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${idx === current ? 'opacity-100' : 'opacity-0'}`}
        >
          <div className="absolute inset-0 overflow-hidden">
            <img 
              src={project.image} 
              alt={project.title} 
              // FIXED: duration-[6000ms] is valid JIT, keeping it but ensuring syntax is clean. 
              // FIXED: bg-gradient-to-t is standard v3. If linter complained, it might want bg-linear-to-t (v4), but sticking to v3 standard for safety unless you confirm v4.
              className={`h-full w-full object-cover transition-transform duration-6000 ease-out ${idx === current ? 'scale-110' : 'scale-100'}`}
            />
            {/* FIXED: 'bg-gradient-to-t' is correct for Tailwind v3. If v4, use 'bg-linear-to-t' */}
            <div className="absolute inset-0 bg-linear-to-t from-slate-900 via-slate-900/40 to-transparent opacity-90" />
          </div>

          <div className="absolute inset-0 flex items-center justify-center text-center">
            <div className="max-w-4xl px-4">
              <span className="mb-4 inline-block rounded-full bg-orange-500/20 px-4 py-1.5 text-sm font-bold uppercase tracking-wider text-orange-400 backdrop-blur-sm">
                Featured Project
              </span>
              <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-white sm:text-6xl">
                {project.title}
              </h1>
              <div className="mb-8 flex justify-center gap-6 text-slate-300">
                <span className="flex items-center gap-2"><IconMapPin className="h-4 w-4" /> {project.location}</span>
                <span className="hidden h-4 w-px bg-slate-500 sm:block" />
                <span className="flex items-center gap-2"><IconCalendar className="h-4 w-4" /> {project.year}</span>
              </div>
            </div>
          </div>
        </div>
      ))}

      <div className="absolute bottom-8 right-8 flex gap-2">
        <button onClick={() => setCurrent((c) => (c - 1 + featured.length) % featured.length)} className="rounded-full bg-white/10 p-3 text-white backdrop-blur hover:bg-white/20">
          <IconChevronLeft className="h-6 w-6" />
        </button>
        <button onClick={() => setCurrent((c) => (c + 1) % featured.length)} className="rounded-full bg-white/10 p-3 text-white backdrop-blur hover:bg-white/20">
          <IconChevronRight className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
};

// --- 2. FILTER BAR ---
interface FilterBarProps {
  onFilterChange: (filters: any) => void;
  activeFilters: any;
}

export const ProjectFilterBar: React.FC<FilterBarProps> = ({ onFilterChange, activeFilters }) => {
  const [isMobileOpen, setMobileOpen] = useState(false);
  const types: ProjectType[] = ['Residential', 'Commercial', 'Renovation', 'Industrial'];

  const handleTypeToggle = (t: string) => {
    const current = activeFilters.types || [];
    const updated = current.includes(t) ? current.filter((x: string) => x !== t) : [...current, t];
    onFilterChange({ ...activeFilters, types: updated });
  };

  return (
    <>
      <div className="relative z-30 w-full border-b border-slate-200 bg-white px-4 py-4 shadow-sm sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4">
          
          <button 
            className="flex items-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 lg:hidden"
            onClick={() => setMobileOpen(!isMobileOpen)}
          >
            <IconFilter className="h-4 w-4" /> Filters
          </button>

          <div className="hidden flex-wrap items-center gap-2 lg:flex">
            <span className="mr-2 text-xs font-bold uppercase text-slate-400">Project Type:</span>
            {types.map(t => (
              <button
                key={t}
                onClick={() => handleTypeToggle(t)}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                  activeFilters.types?.includes(t) 
                  ? 'bg-slate-900 text-white' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="relative w-full max-w-xs lg:w-auto">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <IconSearch className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Search location or title..."
              className="block w-full rounded-md border-0 bg-slate-100 py-2 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-500 focus:bg-white focus:ring-2 focus:ring-orange-500"
              value={activeFilters.search || ''}
              onChange={(e) => onFilterChange({ ...activeFilters, search: e.target.value })}
            />
          </div>
        </div>
        
        {activeFilters.types?.length > 0 && (
          <div className="mx-auto mt-4 flex max-w-7xl flex-wrap items-center gap-2">
            <span className="text-xs text-slate-500">Active:</span>
            {activeFilters.types.map((t: string) => (
              <span key={t} className="flex items-center gap-1 rounded border border-orange-200 bg-orange-50 px-2 py-1 text-xs font-semibold text-orange-700">
                {t} <button onClick={() => handleTypeToggle(t)}><IconX className="h-3 w-3" /></button>
              </span>
            ))}
            <button 
              onClick={() => onFilterChange({ ...activeFilters, types: [] })}
              className="text-xs font-semibold text-slate-500 underline hover:text-slate-800"
            >
              Clear All
            </button>
          </div>
        )}
      </div>

      {isMobileOpen && (
        <div className="fixed inset-0 z-40 flex lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <div className="relative ml-auto h-full w-80 bg-white p-6 shadow-xl">
             <h3 className="mb-6 text-lg font-bold">Filters</h3>
             <div className="space-y-6">
               <div>
                 <label className="mb-2 block text-sm font-semibold">Type</label>
                 <div className="flex flex-wrap gap-2">
                   {types.map(t => (
                     <button
                       key={t}
                       onClick={() => handleTypeToggle(t)}
                       className={`rounded px-3 py-2 text-xs font-medium border ${
                         activeFilters.types?.includes(t) ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-200'
                       }`}
                     >
                       {t}
                     </button>
                   ))}
                 </div>
               </div>
             </div>
          </div>
        </div>
      )}
    </>
  );
};

// --- 3. PROJECT CARD ---
export const ProjectCard: React.FC<{ project: Project; onClick: () => void }> = ({ project, onClick }) => {
  return (
    <div 
      className="group relative cursor-pointer overflow-hidden rounded-xl bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
      onClick={onClick}
    >
      {/* FIXED: aspect-[4/3] -> aspect-4/3 if using standard aspect-ratio plugin or native support */}
      <div className="relative aspect-4/3 overflow-hidden">
        <img 
          src={project.image} 
          alt={project.title} 
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" 
        />
        <div className="absolute inset-0 bg-slate-900/0 transition-colors duration-300 group-hover:bg-slate-900/60" />
        
        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <span className="flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-bold text-white backdrop-blur-md">
              <IconZoomIn className="h-4 w-4" /> Quick View
            </span>
        </div>

        <div className="absolute left-4 top-4 flex flex-col gap-2">
           {project.status === 'Ongoing' && (
             <span className="rounded bg-orange-500 px-2 py-1 text-[10px] font-bold uppercase text-white shadow-sm">
               Ongoing
             </span>
           )}
           {project.badges.map(b => (
             <span key={b} className="rounded bg-white/90 px-2 py-1 text-[10px] font-bold uppercase text-slate-800 shadow-sm backdrop-blur">
               {b}
             </span>
           ))}
        </div>
      </div>

      <div className="p-5">
        <div className="mb-1 flex items-center justify-between text-xs text-slate-500">
           <span>{project.type}</span>
           <span>{project.year}</span>
        </div>
        <h3 className="mb-2 text-lg font-bold text-slate-900 group-hover:text-orange-600">{project.title}</h3>
        <p className="flex items-center gap-1 text-sm text-slate-600">
           <IconMapPin className="h-3 w-3" /> {project.location}
        </p>
      </div>
    </div>
  );
};

// --- 4. PREVIEW MODAL ---
export const ProjectModal: React.FC<{ project: Project | null; onClose: () => void }> = ({ project, onClose }) => {
  if (!project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-2xl animate-fade-in-up">
        <button onClick={onClose} className="absolute right-4 top-4 z-10 rounded-full bg-black/10 p-2 text-slate-800 hover:bg-black/20">
          <IconX className="h-6 w-6" />
        </button>

        <div className="flex flex-col md:flex-row h-[80vh]">
           <div className="bg-slate-100 md:w-2/3 h-64 md:h-auto overflow-hidden">
             <img src={project.image} className="h-full w-full object-cover" alt={project.title} />
           </div>

           <div className="flex flex-col justify-between overflow-y-auto p-8 md:w-1/3">
             <div>
                <span className="mb-2 inline-block text-xs font-bold uppercase tracking-wider text-orange-600">
                   {project.type} • {project.year}
                </span>
                <h2 className="mb-4 text-3xl font-extrabold text-slate-900">{project.title}</h2>
                <p className="mb-6 text-slate-600 leading-relaxed">
                  {project.description}
                </p>

                <div className="grid grid-cols-2 gap-4 rounded-lg bg-slate-50 p-4 border border-slate-100">
                   <div>
                     <p className="text-xs text-slate-500">Duration</p>
                     <p className="font-semibold text-slate-900">{project.stats.duration}</p>
                   </div>
                   <div>
                     <p className="text-xs text-slate-500">Area</p>
                     <p className="font-semibold text-slate-900">{project.stats.area}</p>
                   </div>
                   <div>
                     <p className="text-xs text-slate-500">Location</p>
                     <p className="font-semibold text-slate-900">{project.location}</p>
                   </div>
                   <div>
                     <p className="text-xs text-slate-500">Status</p>
                     <p className="font-semibold text-slate-900">{project.status}</p>
                   </div>
                </div>
             </div>

             
           </div>
        </div>
      </div>
    </div>
  );
};
