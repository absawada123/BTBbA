// client/src/components/pages/public/Home.tsx
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Flower2, Search } from 'lucide-react';

import Hero from './home/Hero';
import Services from './home/Services';
import WhyChooseUs from './home/WhyChooseUs';
import FeaturedProjects from './home/FeaturedProjects';
import Workflow from './home/Workflow';
import Footer from './home/Footer';
import { SmartNav, ScrollToTop as FabScrollToTop, ScrollProgressLine } from './home/SmartNav';
import { useScrollProgress } from '../../hooks/useScrollProgress';

const CheckIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M20 6 9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

type SectionId = 'top' | 'services' | 'why' | 'featured-projects' | 'workflow' | 'inquiry';

const Home: React.FC = () => {
  const scrollProgress = useScrollProgress();
  const [activeSection, setActiveSection] = useState<SectionId>('top');
  const [mounted, setMounted] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const sectionsToObserve: SectionId[] = useMemo(
    () => ['top', 'services', 'why', 'featured-projects', 'workflow', 'inquiry'],
    []
  );

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const currentIndex = sectionsToObserve.indexOf(activeSection);
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        const next = sectionsToObserve[currentIndex + 1];
        if (next) scrollToSection(next);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        const prev = sectionsToObserve[currentIndex - 1];
        if (prev) scrollToSection(prev);
      } else if (e.key === 'Home') {
        e.preventDefault();
        scrollToSection('top');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeSection, sectionsToObserve]);

  useEffect(() => {
    const elements = sectionsToObserve
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (elements.length === 0) return;
    observerRef.current?.disconnect();
    observerRef.current = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;
        const id = visible.target.getAttribute('id') as SectionId | null;
        if (id) setActiveSection(id);
      },
      { root: null, rootMargin: '-20% 0px -50% 0px', threshold: [0.1, 0.5] }
    );
    elements.forEach((el) => observerRef.current?.observe(el));
    return () => { observerRef.current?.disconnect(); };
  }, [sectionsToObserve]);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const offsetPosition = el.getBoundingClientRect().top + window.pageYOffset - 80;
    window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
  };

  const services = useMemo(() => [
    {
      title: 'Weekends Pop-Up Flower',
      description: 'We set up pop-up every weekend at Sta. Rosa Bayan near MCDO events — offering fresh bouquets, and floral styling tips.',
      href: '/inquiry',
    },
    {
      title: 'Custom Bouquets',
      description: 'Handcrafted bouquets tailored to your style, occasion, and budget — made fresh for every order.',
      href: '/inquiry',
    },
    {
      title: 'Pre-Order Arrangements',
      description: 'Plan ahead for birthdays, anniversaries, or special events with our easy pre-order system. Note: pre orders only avaiable every weekends',
      href: '/inquiry',
    },
    {
      title: 'Flowers',
      description: 'Browse our curated selection of fresh flowers, wrapped bouquets, and seasonal arrangements.',
      href: '/projects',
    },
  ], []);

  const workflow = useMemo(() => [
    { title: 'Browse & Inquire',    description: 'Tell us your occasion, preferred flowers, and budget through our inquiry form.' },
    { title: 'Design Consultation', description: 'We confirm your order details and suggest the perfect floral arrangement.' },
    { title: 'We Craft It',         description: 'Your bouquet is handcrafted fresh on the day using quality seasonal blooms.' },
    { title: 'Pickup or Delivery',  description: 'Collect from our shop or have it delivered straight to your door.' },
    { title: 'Share the Joy',       description: "Unbox your blooms and make someone's day unforgettable." },
  ], []);

  return (
    <div className="bg-[#FAF6F0] text-[#2C2C2C]">
      <ScrollProgressLine progress={scrollProgress} />
      <SmartNav activeSection={activeSection} scrollToSection={scrollToSection} />
      <FabScrollToTop progress={scrollProgress} onClick={() => scrollToSection('top')} />

      <main>
        <section id="top" className="scroll-mt-0">
          <Hero mounted={mounted} scrollToSection={scrollToSection} CheckIcon={CheckIcon} />
        </section>

        <Services services={services} />
        <WhyChooseUs CheckIcon={CheckIcon} />
        <FeaturedProjects />
        <Workflow steps={workflow} />

        {/* CTA / Inquiry Section */}
        <section id="inquiry" className="scroll-mt-24">
          <div className="relative overflow-hidden bg-[#2C2C2C]">
            <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-[#C4717A]/20 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-[#C9A84C]/15 blur-3xl" />

            <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
              <div className="grid gap-8 lg:grid-cols-3 lg:items-center">

                <div className="lg:col-span-2">
                  <span className="inline-block rounded-full border border-[#C9A84C]/40 bg-[#C9A84C]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#C9A84C] mb-4">
                    Ready to order?
                  </span>
                  <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                    Let's create something
                    <span className="block text-[#C4717A] italic font-serif">beautiful together.</span>
                  </h2>
                  <p className="mt-4 text-base text-white/60 max-w-2xl leading-relaxed">
                    Whether it's a surprise bouquet, a pop-up event, or a pre-planned arrangement — we'd love to be part of your moment. Send us an inquiry and we'll respond within 24 hours.
                  </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row lg:flex-col lg:items-stretch">
                  <Link
                    to="/inquiry"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-[#C4717A] px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#C4717A]/30 transition-all hover:bg-[#b05f68] hover:shadow-xl active:scale-95"
                  >
                    <Flower2 className="h-4 w-4" />
                    Place an Order
                  </Link>
                  <Link
                    to="/track"
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-8 py-3.5 text-sm font-bold text-white transition-all hover:bg-white/10 active:scale-95"
                  >
                    <Search className="h-4 w-4" />
                    Track My Order
                  </Link>
                </div>

              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Home;