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
    // { name: 'Admin portal', href: '/admin', icon: Shield, isExternal: true },
  ];

  return (
    <header className="sticky top-0 z-50 -mb-20 px-4 pt-4 sm:px-6 lg:px-8">
      <div className="relative mx-auto max-w-6xl">
        <div className="flex items-center gap-3 rounded-full border border-white/80 bg-white/95 px-4 py-2.5 shadow-xl shadow-black/15 backdrop-blur-md sm:gap-5 sm:px-6">
          <Link href="/" className="group flex min-w-0 shrink items-center gap-2.5 sm:gap-3">
            <Image
              src="/logo.png"
              alt="RCCG Divine Favour Parish logo"
              width={48}
              height={48}
              priority
              className="h-10 w-10 shrink-0 object-contain sm:h-11 sm:w-11"
            />
            <div className="min-w-0">
              <span className="block truncate text-xs font-extrabold tracking-tight text-[#241333] transition group-hover:text-[#4c1864] sm:text-sm">
                RCCG Divine Favour Parish
              </span>
              <span className="block text-[10px] font-semibold tracking-wide text-[#008f4a] sm:text-xs">Ajibode, Ibadan</span>
            </div>
          </Link>

          <nav aria-label="Main navigation" className="hidden flex-1 items-center justify-end gap-1 lg:flex xl:gap-2">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className={`whitespace-nowrap text-xs font-semibold transition-colors xl:text-sm ${
                  link.isExternal
                    ? 'rounded-full border border-[#4c1864]/20 bg-[#4c1864]/[0.05] px-4 py-2.5 text-[#4c1864] hover:bg-[#4c1864] hover:text-white'
                    : link.isVisit
                    ? 'rounded-full bg-[#4c1864] px-5 py-2.5 text-white shadow-sm hover:bg-[#3d1351]'
                    : 'rounded-full px-3 py-2.5 text-slate-600 hover:bg-[#4c1864]/[0.06] hover:text-[#4c1864]'
                }`}
              >
                {link.name}
              </a>
            ))}
          </nav>

          <div className="ml-auto flex items-center lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              type="button"
              className="rounded-full p-2 text-slate-700 transition hover:bg-slate-100 hover:text-[#4c1864] focus:outline-none focus:ring-2 focus:ring-[#008f4a]"
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <nav
            id="mobile-navigation"
            aria-label="Mobile navigation"
            className="absolute left-0 right-0 top-[calc(100%+0.75rem)] space-y-1 rounded-3xl border border-slate-200 bg-white p-3 shadow-xl lg:hidden"
          >
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
      </div>
    </header>
  );
}