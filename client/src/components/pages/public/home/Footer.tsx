// client/src/components/pages/public/home/Footer.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock, Facebook, Instagram } from 'lucide-react';
import logo from '../../../../assets/images/logo.png';

const Footer: React.FC = () => {
  return (
    <footer className="border-t border-[#C4717A]/10 bg-[#FAF6F0]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-3">

          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img src={logo} alt="Beyond the Bloom by A" className="h-14 w-14 object-contain" />
              <div>
                <p className="font-bold text-[#2C2C2C] leading-tight">Beyond the Bloom</p>
                <p className="text-xs font-medium text-[#C4717A] tracking-wide italic font-serif">by A</p>
              </div>
            </div>
            <p className="text-sm text-[#2C2C2C]/60 leading-relaxed">
              Where every bloom tells your story. Handcrafted florals for every moment worth celebrating.
            </p>
            <div className="flex gap-3">
              <a href="https://www.facebook.com/profile.php?id=61583724431618" className="inline-flex items-center gap-1.5 rounded-full border border-[#C4717A]/20 bg-white px-3 py-1.5 text-xs font-medium text-[#C4717A] hover:bg-[#C4717A] hover:text-white transition-colors">
                <Facebook className="h-3 w-3" /> Facebook
              </a>
              <a href="https://www.instagram.com/beyondthebloombya/" className="inline-flex items-center gap-1.5 rounded-full border border-[#C4717A]/20 bg-white px-3 py-1.5 text-xs font-medium text-[#C4717A] hover:bg-[#C4717A] hover:text-white transition-colors">
                <Instagram className="h-3 w-3" /> Instagram
              </a>
            </div>
          </div>

          {/* Links */}
          <div className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-widest text-[#2C2C2C]/50">Explore</p>
            <div className="flex flex-col gap-2 text-sm">
              {[
                { to: '/',         label: 'Home'           },
                { to: '/about',    label: 'About Us'       },
                { to: '/projects', label: 'Gallery'        },
                { to: '/inquiry',  label: 'Place an Order' },
                { to: '/track',    label: 'Track My Order' },
              ].map((link) => (
                <Link key={link.to} to={link.to} className="text-[#2C2C2C]/60 hover:text-[#C4717A] transition-colors w-fit">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-widest text-[#2C2C2C]/50">Visit Us</p>
            <div className="space-y-2 text-sm text-[#2C2C2C]/60">
              <p className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-[#C4717A] shrink-0 mt-0.5" />
                Sta. Rosa / Calamba City, Calabarzon, Philippines
              </p>
              <p className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-[#C4717A] shrink-0" />
                Open daily · Orders close 6PM
              </p>
            </div>
            <Link to="/inquiry" className="inline-flex items-center gap-2 justify-center rounded-full bg-[#C4717A] px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-[#C4717A]/25 transition hover:bg-[#b05f68] active:scale-95">
              Place an Order
            </Link>
          </div>

        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-[#C4717A]/10 pt-6 text-xs text-[#2C2C2C]/40 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Beyond the Bloom by A. All rights reserved.</p>
          <p>Est. 2026 · Sta. Rosa / Calamba City, Calabarzon</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;