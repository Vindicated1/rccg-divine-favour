'use client';

import { ShieldCheck } from 'lucide-react';

export default function Hero() {
  return (
    <section id="hero" className="py-20 px-4 text-center bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 border-b border-slate-800/50">
      <div className="max-w-4xl mx-auto space-y-6">
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-semibold border border-blue-500/20">
          <ShieldCheck className="w-4 h-4" /> Welcome to RCCG Divine Favour Parish
        </span>
        <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white leading-tight">
          Experience Divine Grace & Spiritual Transformation
        </h2>
        <p className="text-slate-400 text-base md:text-xl max-w-2xl mx-auto">
          Join our vibrant community in worship, prayer, and listening to the life-changing word of God.
        </p>
        <div className="flex flex-wrap justify-center gap-4 pt-4">
          <a href="#giving" className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow-lg shadow-amber-500/20 transition">
            Online Giving & Accounts
          </a>
          <a href="#announcements" className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium shadow-lg shadow-blue-600/20 transition">
            Upcoming Events
          </a>
          <a href="#prayer" className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium border border-slate-700 transition">
            Prayer Request
          </a>
        </div>
      </div>
    </section>
  );
}