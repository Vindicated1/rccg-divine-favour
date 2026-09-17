'use client';

import { ShieldCheck } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative py-20 px-4 text-center bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 border-b border-slate-800/50 overflow-hidden">
      
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none -z-10"></div>

      <div className="max-w-4xl mx-auto flex flex-col items-center space-y-6">
        
        {/* Glowing Circle Church Logo */}
        <div className="relative group flex items-center justify-center">
          {/* Outer glowing aura */}
          <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 opacity-75 blur-lg group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
          
          {/* Logo container circle */}
          <div className="relative w-28 h-28 md:w-36 md:h-36 rounded-full bg-slate-950 p-4 border-2 border-blue-500/50 shadow-[0_0_30px_rgba(59,130,246,0.4)] flex items-center justify-center">
            <img
              src="/logo.png"
              alt="RCCG Divine Favour Logo"
              className="w-full h-full object-contain drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)]"
              onError={(e) => {
                // Graceful fallback if logo image path isn't found
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        </div>

        {/* Welcome Tag */}
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-semibold border border-blue-500/20 shadow-sm">
          <ShieldCheck className="w-4 h-4 text-blue-400" /> Welcome to Divine Favour Parish, Ajibode
        </span>

        {/* Main Heading */}
        <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white leading-tight">
          Experience Divine Grace & <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
            Spiritual Transformation
          </span>
        </h2>

        {/* Subtitle */}
        <p className="text-slate-400 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
          Join our vibrant community in worship, prayer, and listening to the life-changing word of God.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-4 pt-2">
          <a
            href="#giving"
            className="px-6 py-3 rounded-xl bg-amber-600 hover:bg-blue-500 text-white font-medium shadow-lg shadow-blue-600/30 transition transform hover:-translate-y-0.5"
          >
            Online Giving & Accounts
          </a>
          <a
            href="#sermons"
            className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium shadow-lg shadow-blue-600/30 transition transform hover:-translate-y-0.5"
          >
            Listen to Sermons
          </a>
          <a
            href="#prayer"
            className="px-6 py-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-200 font-medium border border-slate-700/80 transition transform hover:-translate-y-0.5"
          >
            Submit Prayer Request
          </a>
        </div>

      </div>
    </section>
  );
}