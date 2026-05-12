// client/src/pages/public/home/SectionShell.tsx
import React, { useEffect, useRef, useState } from 'react';

type SectionShellProps = {
  id: string;
  eyebrow: string;
  title: string;
  children: React.ReactNode;
  tone?: 'light' | 'default';
};

const SectionShell: React.FC<SectionShellProps> = ({ id, eyebrow, title, children, tone = 'default' }) => {
  const isLight = tone === 'light';
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Trigger when 15% of the element is visible
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Optional: Unobserve if you only want it to animate once
          // observer.unobserve(entry.target);
        }
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section 
      id={id} 
      ref={sectionRef}
      className={[
        'scroll-mt-24 snap-start scroll-py-24', // snap-start for snap scrolling
        isLight ? 'bg-white' : 'bg-gray-50'
      ].join(' ')}
    >
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div 
          className={`max-w-3xl transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
        >
          <div className="flex items-center gap-3">
             {/* Pulse indicator */}
            <span className={`inline-block h-2 w-2 rounded-full bg-primary duration-700 ${isVisible ? 'animate-pulse' : ''}`} />
            <p className="text-sm font-bold uppercase tracking-wider text-slate-600">{eyebrow}</p>
          </div>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            {title}
          </h2>
        </div>
        
        {/* Content with delayed stagger effect */}
        <div className={`mt-10 transition-all duration-1000 delay-200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          {children}
        </div>
      </div>
    </section>
  );
};

export default SectionShell;
