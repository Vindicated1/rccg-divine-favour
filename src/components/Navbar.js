'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, Bell, BookOpen, Heart, Shield, Home, CreditCard, MessageSquare } from 'lucide-react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [imgError, setImgError] = useState(false);

  const navLinks = [
    { name: 'Home', href: '#hero', icon: Home },
    { name: 'Announcements', href: '#announcements', icon: Bell },
    { name: 'Sermons', href: '#sermons', icon: BookOpen },
    { name: 'Giving', href: '#giving', icon: CreditCard },
    { name: 'Prayer Request', href: '#prayer', icon: Heart },
    { name: 'Testimonies', href: '#testimonies', icon: MessageSquare },
    { name: 'Admin Portal', href: '/admin', icon: Shield, isExternal: true },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#0b1524]/95 backdrop-blur-md border-b border-emerald-900/60 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo Section */}
          <Link href="/" className="flex items-center space-x-3 group">
            {!imgError ? (
              <img
                src="/logo.png"
                alt="RCCG Divine Favour Logo"
                className="w-10 h-10 object-contain drop-shadow"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="w-10 h-10 rounded-xl bg-emerald-700 group-hover:bg-emerald-600 flex items-center justify-center font-bold text-lg text-white shadow-lg shadow-emerald-900/30 transition">
                DFP
              </div>
            )}
            <div>
              <h1 className="font-bold text-base tracking-wide text-white group-hover:text-emerald-200 transition">
                RCCG Divine Favour Parish
              </h1>
              <p className="text-[11px] text-emerald-200/80 font-semibold tracking-wider">Ajibode, UI, Ibadan. Oyo Province 2</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  link.isExternal
                    ? 'px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-400/30 text-emerald-200 hover:bg-emerald-700 hover:text-white'
                    : link.name === 'Giving'
                    ? 'text-amber-300 hover:text-amber-200 font-semibold'
                    : 'text-slate-300 hover:text-emerald-200'
                }`}
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Mobile Burger Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              type="button"
              className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Slide-down Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0b1524]/98 border-b border-slate-800 px-4 pt-2 pb-6 space-y-2 animate-in slide-in-from-top duration-200">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-slate-200 hover:bg-slate-800 hover:text-emerald-200 transition text-sm font-medium"
              >
                <Icon className="w-4 h-4 text-emerald-300" />
                <span>{link.name}</span>
              </a>
            );
          })}
        </div>
      )}
    </header>
  );
}