// client/src/components/pages/public/home/WhyChooseUs.tsx
import React from 'react';
import { Flower2, Palette, Heart, Package, CalendarDays, Zap } from 'lucide-react';

interface WhyChooseUsProps {
  CheckIcon: React.FC<{ className?: string }>;
}

const reasons = [
  { icon: <Flower2      className="h-5 w-5" />, title: 'Fresh Every Day',      description: 'All arrangements are made with freshly sourced blooms — never pre-made or mass produced.' },
  { icon: <Palette      className="h-5 w-5" />, title: 'Fully Customizable',   description: 'Choose your flowers, colors, wrapping, and message. Every bouquet is uniquely yours.' },
  { icon: <Heart        className="h-5 w-5" />, title: 'Made with Love',        description: 'We treat every order personally — your joy is our craft and our motivation.' },
  { icon: <Package      className="h-5 w-5" />, title: 'Easy Pre-Orders',       description: 'Plan ahead stress-free. Pre-order days in advance and we\'ll have it ready on time.' },
  { icon: <CalendarDays className="h-5 w-5" />, title: 'Pop-Up Events',         description: 'Catch us at local events and markets for spontaneous bloom pick-ups.' },
  { icon: <Zap          className="h-5 w-5" />, title: 'Fast Response',         description: 'We reply to every inquiry within 24 hours. No ghosting — just flowers.' },
];

const WhyChooseUs: React.FC<WhyChooseUsProps> = ({ CheckIcon }) => {
  return (
    <section id="why" className="scroll-mt-24 bg-[#FAF6F0] py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">

          {/* Left */}
          <div>
            <span className="inline-block rounded-full border border-[#6B7C5C]/30 bg-[#6B7C5C]/8 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#6B7C5C]">
              Why Choose Us
            </span>
            <h2 className="mt-4 text-3xl font-bold text-[#2C2C2C] sm:text-4xl">
              More than just
              <span className="block italic font-serif text-[#C4717A] mt-1">a flower shop</span>
            </h2>
            <p className="mt-4 text-sm text-[#2C2C2C]/60 sm:text-base leading-relaxed max-w-md">
              Beyond the Bloom by A is built on care, creativity, and community. We don't just sell flowers — we help you create memories.
            </p>
            <ul className="mt-8 space-y-3">
              {[
                'Handcrafted with fresh, quality blooms',
                'Personalized for every customer',
                'Affordable pricing for all budgets',
                'Available for pre-order and same-day',
                'Based in Sta. Rosa / Calamba City, Calabarzon',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-[#2C2C2C]/70">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#C4717A]/15">
                    <CheckIcon className="h-3 w-3 text-[#C4717A]" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Right */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {reasons.map((reason, i) => (
              <div key={i} className="group rounded-2xl border border-[#C4717A]/10 bg-white p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#C4717A]/25 hover:shadow-lg hover:shadow-[#C4717A]/8">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-[#C4717A]/10 text-[#C4717A] transition-colors group-hover:bg-[#C4717A] group-hover:text-white">
                  {reason.icon}
                </div>
                <h3 className="text-sm font-bold text-[#2C2C2C] group-hover:text-[#C4717A] transition-colors">{reason.title}</h3>
                <p className="mt-1.5 text-xs text-[#2C2C2C]/55 leading-relaxed">{reason.description}</p>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;