// client/src/components/pages/Landing.tsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Search, Info, Image, MapPin, Clock } from 'lucide-react';
import logo from '../../assets/images/logo.png';

const Landing: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setTimeout(() => setMounted(true), 100); }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#FAF6F0] flex flex-col items-center justify-center px-4">
      <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-[#C4717A]/15 blur-3xl" />
      <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-[#6B7C5C]/10 blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-72 w-72 rounded-full bg-[#C9A84C]/8 blur-2xl" />

      <div className={`relative z-10 flex flex-col items-center text-center transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <div className="relative mb-8">
          <div className="absolute inset-0 rounded-full bg-[#C4717A]/20 blur-xl scale-125" />
          <div className="relative h-36 w-36 rounded-full bg-white shadow-2xl shadow-[#C4717A]/20 flex items-center justify-center p-5 border border-[#C4717A]/10">
            <img src={logo} alt="Beyond the Bloom by A" className="h-full w-full object-contain" />
          </div>
        </div>

        <h1 className="text-4xl font-bold text-[#2C2C2C] sm:text-5xl tracking-tight">Beyond the Bloom</h1>
        <p className="mt-1 text-lg font-medium text-[#C4717A] italic font-serif">by A</p>
        <p className="mt-4 text-sm text-[#2C2C2C]/55 max-w-xs leading-relaxed">
          Where every bloom tells your story. Handcrafted florals for every moment worth celebrating.
        </p>

        <div className="mt-5 flex items-center gap-2 rounded-full border border-[#C9A84C]/30 bg-white px-4 py-1.5 shadow-sm">
          <div className="h-1.5 w-1.5 rounded-full bg-[#C9A84C]" />
          <span className="text-xs font-semibold text-[#C9A84C] tracking-widest uppercase">Est. 2026 · Sta. Rosa / Calamba City</span>
        </div>

        <div className="mt-10 flex flex-col gap-3 w-full max-w-xs sm:flex-row sm:max-w-none sm:justify-center">
          <Link to="/home" className="inline-flex items-center justify-center gap-2 rounded-full bg-[#C4717A] px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#C4717A]/30 transition-all hover:bg-[#b05f68] hover:shadow-xl active:scale-95">
            <ShoppingBag className="h-4 w-4" />
            Enter the Shop
          </Link>
          <Link to="/inquiry" className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-[#C4717A]/30 bg-white px-8 py-3.5 text-sm font-bold text-[#C4717A] transition-all hover:border-[#C4717A] hover:bg-[#C4717A]/5 active:scale-95">
            Place an Order
          </Link>
        </div>

        <div className="mt-8 flex items-center gap-4 text-xs text-[#2C2C2C]/40">
          <Link to="/about"    className="hover:text-[#C4717A] transition-colors flex items-center gap-1"><Info className="h-3 w-3" />About</Link>
          <span>·</span>
          <Link to="/projects" className="hover:text-[#C4717A] transition-colors flex items-center gap-1"><Image className="h-3 w-3" />Gallery</Link>
          <span>·</span>
          <Link to="/track"    className="hover:text-[#C4717A] transition-colors flex items-center gap-1"><Search className="h-3 w-3" />Track Order</Link>
        </div>
      </div>

      <p className="absolute bottom-6 text-xs text-[#2C2C2C]/30">© {new Date().getFullYear()} Beyond the Bloom by A</p>
    </div>
  );
};

export default Landing;