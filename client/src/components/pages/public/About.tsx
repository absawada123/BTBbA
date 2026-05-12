// client/src/components/pages/public/About.tsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Flower2, ShieldCheck, Leaf, Heart,
  MapPin, CalendarDays, Clock,
  Search, ClipboardList, MessageSquare, Truck,
  Plus, ArrowRight,
} from 'lucide-react';
import { useScrollProgress } from '../../hooks/useScrollProgress';
import logo from '../../../assets/images/logo.png';

const coreValues = [
  { icon: Flower2,     title: 'Crafted with Care',    description: 'Every bouquet is made by hand with genuine love and attention to detail.' },
  { icon: ShieldCheck, title: 'Honest & Transparent', description: 'Clear pricing, honest communication, and no hidden surprises.' },
  { icon: Leaf,        title: 'Fresh Always',          description: 'We source fresh blooms and never compromise on quality.' },
  { icon: Heart,       title: 'Customer First',        description: 'Your happiness is the measure of our success on every order.' },
];

const steps = [
  { step: '01', icon: Search,        title: 'Browse or Request',  desc: 'Explore our collections or send a custom bouquet request.' },
  { step: '02', icon: ClipboardList, title: 'Submit Inquiry',     desc: 'Fill out our quick inquiry form — takes less than a minute.' },
  { step: '03', icon: MessageSquare, title: 'Get Your Quotation', desc: 'We send your quotation and order number via confirmation.' },
  { step: '04', icon: Truck,         title: 'Pickup or Delivery', desc: 'Schedule your weekend pickup at Krav Coffee or DALI.' },
];

const faqs = [
  { q: 'How many days in advance should I reserve?',  a: 'Bouquets are usually prepared and delivered during weekends. We recommend reserving at least 2–3 days before your preferred date.' },
  { q: 'Is same-day delivery available?',             a: 'It depends on stock availability and our current schedule. Message us to check.' },
  { q: 'Are custom bouquets available?',              a: "Yes! Custom requests depend on flower availability and bouquet type. Send us an inquiry and we'll work something out." },
  { q: 'What payment methods are accepted?',          a: 'We accept GCash, Maya, and Maribank.' },
  { q: 'Where can I pick up my order?',               a: 'Pickup is available at Krav Coffee and DALI at Barangay Labas, Sta. Rosa City, Laguna.' },
];

const SideNav: React.FC<{ active: string; scrollTo: (id: string) => void }> = ({ active, scrollTo }) => {
  const items = [
    { id: 'story',  Icon: Flower2        },
    { id: 'values', Icon: Heart          },
    { id: 'popup',  Icon: MapPin         },
    { id: 'how',    Icon: ClipboardList  },
    { id: 'faq',    Icon: MessageSquare  },
    { id: 'cta',    Icon: ArrowRight     },
  ];
  return (
    <div className="fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-3 lg:flex">
      <div className="absolute right-[14px] top-0 bottom-0 w-px bg-[#C4717A]/20" />
      {items.map(({ id, Icon }) => (
        <button
          key={id}
          onClick={() => scrollTo(id)}
          aria-label={id}
          className={`relative z-10 flex h-7 w-7 items-center justify-center rounded-full border-2 transition-all duration-300 ${
            active === id
              ? 'scale-125 border-[#C4717A] bg-[#C4717A] text-white shadow-lg'
              : 'border-[#C4717A]/30 bg-white text-[#C4717A]/50 hover:border-[#C4717A]'
          }`}
        >
          <Icon className="h-3 w-3" />
        </button>
      ))}
    </div>
  );
};

const About: React.FC = () => {
  const scrollProgress = useScrollProgress();
  const [active, setActive]   = useState('story');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    window.scrollTo({ top: el.getBoundingClientRect().top + window.pageYOffset - 80, behavior: 'smooth' });
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { threshold: 0.3, rootMargin: '-80px 0px 0px 0px' }
    );
    ['story', 'values', 'popup', 'how', 'faq', 'cta'].forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <div className="overflow-x-hidden bg-[#FAF6F0] pb-24">

      {/* Scroll Progress */}
      <div className="fixed left-0 top-0 z-[60] h-[3px] w-full pointer-events-none">
        <div
          className="h-full bg-gradient-to-r from-[#C4717A] via-[#C9A84C] to-[#6B7C5C] transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <SideNav active={active} scrollTo={scrollTo} />

      {/* ── Hero ── */}
      <div className="relative overflow-hidden bg-[#2C2C2C] py-24 sm:py-32">
        <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-[#C4717A]/20 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-[#C9A84C]/15 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <img src={logo} alt="Beyond the Bloom by A" className="mx-auto mb-6 h-24 w-24 object-contain drop-shadow-xl" />
          <span className="inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#C9A84C]">
            Our Story
          </span>
          <h1 className="mt-5 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Flowers made beyond
            <span className="block italic font-serif text-[#C4717A] mt-1">the ordinary</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base text-white/60 leading-relaxed">
            Weekend blooms crafted with care — thoughtful bouquets for meaningful moments.
          </p>
        </div>
      </div>

      {/* ── Brand Story ── */}
      <section id="story" className="scroll-mt-20 bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-20">

            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-[#C4717A]">How it started</span>
              <h2 className="mt-3 text-3xl font-bold text-[#2C2C2C] sm:text-4xl">
                Born from a love of flowers
                <span className="block italic font-serif text-[#C4717A]">and meaningful moments</span>
              </h2>
              <p className="mt-5 text-sm text-[#2C2C2C]/65 sm:text-base leading-relaxed">
                Beyond the Bloom by A started as a personal passion — where flowers became part of special memories and real relationships. The name was inspired by{' '}
                <span className="italic text-[#C4717A]">Frieren: Beyond Journey's End</span>, giving the brand a soft emotional identity that goes far beyond a typical flower shop.
              </p>
              <p className="mt-4 text-sm text-[#2C2C2C]/65 sm:text-base leading-relaxed">
                Handcrafted bouquets made with care every weekend, balancing creative passion alongside everyday life in Sta. Rosa, Laguna.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                {[
                  { label: 'Handcrafted',    Icon: Flower2      },
                  { label: 'Weekend Blooms', Icon: CalendarDays },
                  { label: 'Sta. Rosa, Laguna', Icon: MapPin   },
                ].map(({ label, Icon }) => (
                  <span key={label} className="inline-flex items-center gap-1.5 rounded-full border border-[#C4717A]/20 bg-[#FAF6F0] px-4 py-1.5 text-xs font-medium text-[#C4717A]">
                    <Icon className="h-3 w-3" />
                    {label}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-center">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-[#C4717A]/15 blur-2xl scale-110" />
                <div className="relative h-72 w-72 sm:h-80 sm:w-80 rounded-full bg-white shadow-2xl shadow-[#C4717A]/20 flex items-center justify-center p-10 border border-[#C4717A]/10">
                  <img src={logo} alt="Beyond the Bloom by A" className="h-full w-full object-contain" />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Core Values ── */}
      <section id="values" className="scroll-mt-20 bg-[#FAF6F0] py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#C4717A]">What we stand for</span>
            <h2 className="mt-3 text-3xl font-bold text-[#2C2C2C] sm:text-4xl">The heart behind every arrangement</h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {coreValues.map(({ icon: Icon, title, description }, i) => (
              <div
                key={i}
                className="group rounded-3xl border border-[#C4717A]/10 bg-white p-6 transition-all hover:-translate-y-1 hover:border-[#C4717A]/25 hover:shadow-lg"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FAF6F0] border border-[#C4717A]/10 transition-transform group-hover:scale-110">
                  <Icon className="h-5 w-5 text-[#C4717A]" />
                </div>
                <h3 className="font-bold text-[#2C2C2C] group-hover:text-[#C4717A] transition-colors">{title}</h3>
                <p className="mt-2 text-xs text-[#2C2C2C]/55 leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Weekend Popup Experience ── */}
      <section id="popup" className="scroll-mt-20 bg-[#2C2C2C] py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#C9A84C]">Find us IRL</span>
            <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
              The Weekend Popup
              <span className="block italic font-serif text-[#C4717A] mt-1">Experience</span>
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-white/50 sm:text-base">
              Every weekend we set up our flower booth — limited slots, fresh blooms, and a cozy walk-in vibe you'll love.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-3">
            {[
              { Icon: MapPin,        title: 'Krav Coffee',  desc: 'Sta. Rosa, Laguna — drop by, pick up your order, or browse walk-in arrangements.' },
              { Icon: Leaf,          title: 'DALI',         desc: 'Barangay Labas, Sta. Rosa City, Laguna — another cozy pickup spot for your weekend blooms.' },
              { Icon: CalendarDays,  title: 'Weekend Only', desc: 'Popups run on weekends. Deliveries are also weekend-based depending on availability.' },
            ].map(({ Icon, title, desc }, i) => (
              <div key={i} className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition hover:border-[#C4717A]/40">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/10">
                  <Icon className="h-5 w-5 text-[#C4717A]" />
                </div>
                <h3 className="font-bold text-white">{title}</h3>
                <p className="mt-2 text-xs text-white/55 leading-relaxed sm:text-sm">{desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 flex justify-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#6B7C5C]/40 bg-[#6B7C5C]/20 px-5 py-2.5">
              <span className="h-2 w-2 rounded-full bg-[#6B7C5C] animate-pulse" />
              <span className="text-sm font-semibold text-white">Weekend Slots Open</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── How Ordering Works ── */}
      <section id="how" className="scroll-mt-20 bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#C4717A]">Easy as 1-2-3-4</span>
            <h2 className="mt-3 text-3xl font-bold text-[#2C2C2C] sm:text-4xl">How ordering works</h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-[#2C2C2C]/55 sm:text-base">
              No complicated process — just a quick inquiry and we handle the rest.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map(({ step, icon: Icon, title, desc }, i) => (
              <div key={i} className="relative rounded-3xl border border-[#C4717A]/10 bg-[#FAF6F0] p-6 transition-all hover:-translate-y-1 hover:shadow-lg">
                <span className="absolute top-4 right-4 text-[10px] font-bold text-[#C4717A]/30 tracking-widest">{step}</span>
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl border border-[#C4717A]/10 bg-white">
                  <Icon className="h-5 w-5 text-[#C4717A]" />
                </div>
                <h3 className="font-bold text-[#2C2C2C]">{title}</h3>
                <p className="mt-2 text-xs text-[#2C2C2C]/55 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 flex justify-center">
            <Link
              to="/inquiry"
              className="inline-flex items-center gap-2 rounded-full bg-[#C4717A] px-8 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-[#b36370] active:scale-95"
            >
              <Flower2 className="h-4 w-4" />
              Start Your Order
            </Link>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="scroll-mt-20 bg-[#FAF6F0] py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#C4717A]">Got questions?</span>
            <h2 className="mt-3 text-3xl font-bold text-[#2C2C2C] sm:text-4xl">Frequently Asked</h2>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="rounded-2xl border border-[#C4717A]/10 bg-white overflow-hidden">
                <button
                  className="flex w-full items-center justify-between px-6 py-4 text-left"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className="text-sm font-semibold text-[#2C2C2C] sm:text-base">{faq.q}</span>
                  <Plus
                    className={`ml-4 h-4 w-4 shrink-0 text-[#C4717A] transition-transform duration-300 ${
                      openFaq === i ? 'rotate-45' : ''
                    }`}
                  />
                </button>
                <div className={`overflow-hidden transition-all duration-300 ${openFaq === i ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
                  <p className="px-6 pb-5 text-sm text-[#2C2C2C]/60 leading-relaxed">{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section id="cta" className="scroll-mt-20 bg-[#C4717A] py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">Ready to order your blooms?</h2>
          <p className="mt-3 text-sm text-white/80 sm:text-base">Let's create something beautiful together.</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row items-center justify-center">
            <Link
              to="/inquiry"
              className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-3 text-sm font-bold text-[#C4717A] shadow-lg transition hover:bg-[#FAF6F0] active:scale-95"
            >
              <Flower2 className="h-4 w-4" />
              Place an Order
            </Link>
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 rounded-full border-2 border-white/40 px-8 py-3 text-sm font-bold text-white transition hover:bg-white/10 active:scale-95"
            >
              <Search className="h-4 w-4" />
              View Gallery
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default About;