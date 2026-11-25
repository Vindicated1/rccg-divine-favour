'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, BookOpen, Shield, Home, UsersRound, CalendarDays, MapPin, CreditCard } from 'lucide-react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'About', href: '#about', icon: Home },
    { name: 'Watch', href: '#sermons', icon: BookOpen },
    { name: 'Ministries', href: '#next-steps', icon: UsersRound },
    { name: 'Events', href: '#announcements', icon: CalendarDays },
    { name: 'Give', href: '#giving', icon: CreditCard },
    { name: 'Plan a visit', href: '#visit', icon: MapPin, isVisit: true },
    { name: 'Admin portal', href: '/admin', icon: Shield, isExternal: false },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="group flex min-w-0 items-center gap-3">
            <Image
              src="/logo.png"
              alt="RCCG Divine Favour Parish logo"
              width={52}
              height={52}
              priority
              className="h-11 w-11 shrink-0 object-contain"
            />
            <div>
              <span className="block truncate text-sm font-bold tracking-tight text-slate-900 transition group-hover:text-[#4c1864] sm:text-base">
                RCCG Divine Favour Parish
              </span>
              <span className="block text-[10px] font-medium tracking-wide text-slate-500 sm:text-xs">Ajibode, Ibadan</span>
            </div>
          </Link>

          <nav aria-label="Main navigation" className="hidden items-center gap-5 lg:flex">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className={`whitespace-nowrap text-xs font-semibold transition-colors xl:text-sm ${
                  link.isExternal
                    ? 'rounded-md border border-[#4c1864]/20 bg-[#4c1864]/[0.05] px-3 py-2 text-[#4c1864] hover:bg-[#4c1864] hover:text-white'
                    : link.isVisit
                    ? 'rounded-md bg-[#008f4a] px-3 py-2 text-white hover:bg-[#00783e]'
                    : 'text-slate-600 hover:text-[#4c1864]'
                }`}
              >
                {link.name}
              </a>
            ))}
          </nav>

          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              type="button"
              className="rounded-lg p-2 text-slate-700 transition hover:bg-slate-100 hover:text-[#4c1864] focus:outline-none focus:ring-2 focus:ring-[#008f4a]"
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {mobileMenuOpen && (
        <nav aria-label="Mobile navigation" className="space-y-1 border-t border-slate-100 bg-white px-4 py-3 lg:hidden">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition ${
                  link.isVisit
                    ? 'bg-[#008f4a]/[0.07] text-[#008f4a] hover:bg-[#008f4a]/[0.12]'
                    : 'text-slate-700 hover:bg-slate-50 hover:text-[#4c1864]'
                }`}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                <span>{link.name}</span>
              </a>
            );
          })}
        </nav>
      )}
    </header>
  );
}