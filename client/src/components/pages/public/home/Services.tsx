// client/src/components/pages/public/home/Services.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Flower2, CalendarHeart, ShoppingBag, Store, ChevronRight } from 'lucide-react';

interface Service {
  title: string;
  description: string;
  icon?: React.ReactNode; // ← make optional
  href: string;
}

interface ServicesProps {
  services: Service[];
}

const iconMap = [
  <Flower2       className="h-6 w-6" />,
  <CalendarHeart className="h-6 w-6" />,
  <ShoppingBag   className="h-6 w-6" />,
  <Store         className="h-6 w-6" />,
];

const Services: React.FC<ServicesProps> = ({ services }) => {
  return (
    <section id="services" className="scroll-mt-24 bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        <div className="mb-12 text-center">
          <span className="inline-block rounded-full border border-[#C4717A]/30 bg-[#C4717A]/8 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#C4717A]">
            What We Offer
          </span>
          <h2 className="mt-4 text-3xl font-bold text-[#2C2C2C] sm:text-4xl">
            Blooms for every
            <span className="ml-2 italic font-serif text-[#C4717A]">occasion</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm text-[#2C2C2C]/60 sm:text-base leading-relaxed">
            From single stems to full event setups — we pour love into every petal.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service, i) => (
            <Link
              key={i}
              to={service.href}
              className="group relative flex flex-col rounded-3xl border border-[#C4717A]/10 bg-[#FAF6F0] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#C4717A]/30 hover:shadow-xl hover:shadow-[#C4717A]/10 active:scale-[0.98]"
            >
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-[#C4717A] shadow-sm border border-[#C4717A]/10 transition-transform duration-300 group-hover:scale-110 group-hover:bg-[#C4717A] group-hover:text-white">
                {iconMap[i] ?? <Flower2 className="h-6 w-6" />}
              </div>
              <h3 className="text-base font-bold text-[#2C2C2C] group-hover:text-[#C4717A] transition-colors">
                {service.title}
              </h3>
              <p className="mt-2 text-sm text-[#2C2C2C]/60 leading-relaxed flex-1">
                {service.description}
              </p>
              <div className="mt-5 inline-flex items-center gap-1 text-xs font-semibold text-[#C4717A] opacity-0 group-hover:opacity-100 transition-opacity">
                Learn more <ChevronRight className="h-3.5 w-3.5" />
              </div>
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#C4717A]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </Link>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link to="/inquiry" className="inline-flex items-center gap-2 rounded-full bg-[#C4717A] px-8 py-3 text-sm font-semibold text-white shadow-md shadow-[#C4717A]/25 transition-all hover:bg-[#b05f68] hover:shadow-lg active:scale-95">
            <Flower2 className="h-4 w-4" />
            Start Your Order
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Services;