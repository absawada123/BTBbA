// client/src/components/pages/public/home/Hero.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import {
  Flower2,
  MapPin,
  Clock,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

import logo from '../../../../assets/images/logo.png';

type HeroProps = {
  mounted: boolean;
  scrollToSection: (id: string) => void;
  CheckIcon: React.FC<{ className?: string }>;
};

const Hero: React.FC<HeroProps> = ({ mounted, scrollToSection }) => {
  return (
    <section id="top" className="relative overflow-hidden bg-[#FAF6F0]">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute -top-40 -right-40 h-[520px] w-[520px] rounded-full bg-[#C4717A]/15 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-[480px] w-[480px] rounded-full bg-[#6B7C5C]/10 blur-3xl" />
        <div className="absolute top-1/3 left-1/2 h-[320px] w-[320px] rounded-full bg-[#C9A84C]/10 blur-3xl" />

        {/* Watermark logo */}
        <div
          className="absolute inset-0 opacity-[0.03] bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${logo})`,
            backgroundSize: '650px',
          }}
        />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-7xl items-center px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid w-full grid-cols-1 items-center gap-14 lg:grid-cols-2">

          {/* LEFT CONTENT */}
          <div
            className={`transition-all duration-700 ${
              mounted
                ? 'translate-y-0 opacity-100'
                : 'translate-y-6 opacity-0'
            }`}
          >

            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-[#C4717A]/20 bg-white/80 px-4 py-2 shadow-sm backdrop-blur-sm">
              <span className="h-2 w-2 animate-pulse rounded-full bg-[#C4717A]" />
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#C4717A]">
                Est. 2026 • Sta. Rosa Laguna
              </span>
            </div>

            {/* Heading */}
            <h1 className="mt-7 text-5xl font-bold leading-[1.05] text-[#2C2C2C] sm:text-6xl lg:text-7xl">
              Where memories
              <span className="mt-2 block font-serif italic text-[#C4717A]">
                blooms beyond time
              </span>
            </h1>

            {/* Description */}
            <p className="mt-6 max-w-xl text-base leading-relaxed text-[#2C2C2C]/70 sm:text-lg">
              Elegant bouquets, romantic floral gifts, and premium flower
              arrangements handcrafted to celebrate every meaningful moment.
            </p>

            {/* CTA */}
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <button
                type="button"
                onClick={() => scrollToSection('inquiry')}
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-[#C4717A] px-8 py-4 text-sm font-semibold text-white shadow-xl shadow-[#C4717A]/30 transition-all hover:-translate-y-0.5 hover:bg-[#b25d67]"
              >
                <Flower2 className="h-4 w-4" />
                Order Bouquet
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>

              <Link
                to="/projects"
                className="inline-flex items-center justify-center rounded-full border border-[#C4717A]/25 bg-white px-8 py-4 text-sm font-semibold text-[#C4717A] shadow-sm transition-all hover:border-[#C4717A] hover:bg-[#C4717A]/5"
              >
                View Gallery
              </Link>
            </div>

            {/* Features */}
            <div className="mt-10 flex flex-wrap gap-3">
              {[
                {
                  icon: <Sparkles className="h-4 w-4" />,
                  text: 'Luxury Bouquets',
                },
                {
                  icon: <MapPin className="h-4 w-4" />,
                  text: 'Pop-Up Events',
                },
                {
                  icon: <Clock className="h-4 w-4" />,
                  text: 'Pre-Order Ready',
                },
              ].map((item) => (
                <div
                  key={item.text}
                  className="flex items-center gap-2 rounded-full border border-[#C9A84C]/20 bg-white px-4 py-2 shadow-sm"
                >
                  <span className="text-[#C9A84C]">{item.icon}</span>
                  <span className="text-xs font-medium text-[#2C2C2C]/70">
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT IMAGE */}
          <div
            className={`flex justify-center transition-all duration-1000 delay-200 ${
              mounted
                ? 'translate-y-0 opacity-100'
                : 'translate-y-10 opacity-0'
            }`}
          >
            <div className="relative flex items-center justify-center">

              {/* Main glowing background */}
              <div className="absolute h-[420px] w-[420px] rounded-full bg-[#C4717A]/15 blur-3xl" />

              {/* Golden blur */}
              <div className="absolute h-[500px] w-[500px] rounded-full bg-[#C9A84C]/10 blur-3xl" />

              {/* Rotating ring */}
              <div className="absolute h-[420px] w-[420px] animate-[spin_25s_linear_infinite] rounded-full border border-dashed border-[#C9A84C]/30" />

              {/* Outer glass circle */}
              <div className="relative flex h-[360px] w-[360px] items-center justify-center rounded-full border border-white/50 bg-white/20 shadow-2xl backdrop-blur-xl sm:h-[420px] sm:w-[420px]">

                {/* Decorative mini circles */}
                <div className="absolute left-5 top-10 h-6 w-6 rounded-full bg-[#C9A84C]/50 blur-sm" />
                <div className="absolute bottom-14 right-8 h-4 w-4 rounded-full bg-[#C4717A]/50 blur-sm" />
                <div className="absolute right-16 top-20 h-3 w-3 rounded-full bg-[#6B7C5C]/50 blur-sm" />

                {/* Image */}
                <div className="relative h-[300px] w-[300px] overflow-hidden rounded-full border-[10px] border-white shadow-[0_25px_60px_rgba(196,113,122,0.35)] sm:h-[360px] sm:w-[360px]">
                  <img
                    src="/src/assets/images/bouquet/6.png"
                    alt="Fresh handcrafted bouquet"
                    className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-white/10" />
                </div>

                {/* Floating logo badge */}
                <div className="absolute bottom-4 right-4 flex items-center gap-2 rounded-full border border-white/40 bg-white/80 px-3 py-2 shadow-xl backdrop-blur-md">
                  <img
                    src={logo}
                    alt="Logo"
                    className="h-8 w-8 rounded-full object-cover"
                  />

                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#C4717A]">
                      Beyond
                    </p>
                    <p className="text-[9px] text-[#2C2C2C]/50">
                      The Bloom
                    </p>
                  </div>
                </div>

                {/* Floating Badge Top */}
                <div className="absolute -top-2 right-8 rounded-2xl border border-[#C9A84C]/20 bg-white/90 px-4 py-3 shadow-xl backdrop-blur-md">
                  <div className="flex items-center gap-2">
                    <Flower2 className="h-5 w-5 text-[#C4717A]" />
                    <div>
                      <p className="text-xs font-bold text-[#2C2C2C]">
                        Fresh Daily
                      </p>
                      <p className="text-[10px] text-[#2C2C2C]/50">
                        Premium Flowers
                      </p>
                    </div>
                  </div>
                </div>

                {/* Floating Badge Bottom */}
                <div className="absolute bottom-2 left-2 rounded-2xl border border-[#C4717A]/20 bg-white/90 px-4 py-3 shadow-xl backdrop-blur-md">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-[#6B7C5C]" />
                    <div>
                      <p className="text-xs font-bold text-[#2C2C2C]">
                        Handmade
                      </p>
                      <p className="text-[10px] text-[#2C2C2C]/50">
                        Crafted with Love
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <button
            onClick={() => scrollToSection('services')}
            className="flex flex-col items-center gap-2 text-[#2C2C2C]/40 transition-colors hover:text-[#C4717A]"
          >
            <span className="text-[11px] font-semibold uppercase tracking-[0.3em]">
              Explore
            </span>

            <div className="flex h-9 w-5 justify-center rounded-full border-2 border-current pt-1.5">
              <div className="h-2 w-1 rounded-full bg-current animate-bounce" />
            </div>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;