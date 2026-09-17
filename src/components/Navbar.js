'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Bell, BookOpen, Heart, Shield, Home } from 'lucide-react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', href: '#hero', icon: Home },
    { name: 'Announcements', href: '#announcements', icon: Bell },
    { name: 'Sermons', href: '#sermons', icon: BookOpen },
    { name: 'Prayer Request', href: '#prayer', icon: Heart },
    { name: 'Admin Portal', href: '/admin', icon: Shield, isExternal: true },
  ];

  return (
    <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-blue-600 group-hover:bg-blue-500 flex items-center justify-center font-bold text-lg text-white shadow-lg shadow-blue-600/30 transition">
              DFP
            </div>
            <div>
              <h1 className="font-bold text-base tracking-wide text-white group-hover:text-blue-400 transition">
                RCCG Divine Favour
              </h1>
              <p className="text-[10px] text-blue-400 font-medium tracking-wider">Parish Portal</p>
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
                    ? 'px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:text-blue-400 hover:border-blue-500/50'
                    : 'text-slate-300 hover:text-blue-400'
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
              className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 focus:outline-none transition"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Slide-down Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900/95 border-b border-slate-800 px-4 pt-2 pb-6 space-y-3 animate-in slide-in-from-top duration-200">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-slate-200 hover:bg-slate-800 hover:text-blue-400 transition text-sm font-medium"
              >
                <Icon className="w-4 h-4 text-blue-400" />
                <span>{link.name}</span>
              </a>
            );
          })}
        </div>
      )}
    </header>
  );
}