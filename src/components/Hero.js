'use client';

import { useState, useEffect } from 'react';
import { Sparkles, MapPin, Heart, BookOpen } from 'lucide-react';

// Background photos array
// You can use Unsplash photos or replace with your own photos inside the /public folder (e.g. '/hero1.jpg', '/hero2.jpg')
const HERO_IMAGES = [
  '/hero1.jpg', // Worship environment
  '/hero2.jpg', // Prayer & Bible fellowship
  '/hero3.jpg', // Church sanctuary
  '/hero4.jpg', // Praise and light
];

export default function Hero() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Automatically cycle through background photos every 6 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center py-20 px-4 text-center border-b border-amber-500/10 overflow-hidden bg-[#05070F]">
      
      {/* 1. Animated Photo Slideshow Layer */}
      {HERO_IMAGES.map((imgUrl, index) => (
        <div
          key={imgUrl}
          className={`absolute inset-0 transition-all duration-1000 ease-in-out pointer-events-none z-0 ${
            index === currentIndex 
              ? 'opacity-35 scale-105' 
              : 'opacity-0 scale-100'
          }`}
          style={{
            backgroundImage: `url(${imgUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            transition: 'opacity 1.2s ease-in-out, transform 6s ease-out'
          }}
        />
      ))}

      {/* 2. Gradient Overlay Masks (Ensures text & glowing logo are 100% readable) */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#05070F] via-[#05070F]/80 to-[#05070F]/60 z-0 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#05070F]/90 via-transparent to-[#05070F]/90 z-0 pointer-events-none" />

      {/* 3. Dynamic Royal Blue & Gold Ethereal Glows */}
      <div className="absolute -top-32 left-1/4 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[130px] pointer-events-none z-0 animate-pulse" />
      <div className="absolute top-1/3 -right-20 w-[450px] h-[450px] bg-amber-500/15 rounded-full blur-[140px] pointer-events-none z-0" />

      {/* 4. Foreground Hero Content */}
      <div className="relative z-10 max-w-4xl mx-auto space-y-6">
        
        {/* Top Church Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-950/70 text-emerald-400 text-xs font-semibold border border-emerald-500/30 shadow-lg backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" /> The Redeemed Christian Church of God
        </div>

        {/* Glowing Circle Church Emblem */}
        <div className="flex justify-center my-4">
          <div className="relative group flex items-center justify-center">
            {/* Outer Gold/Blue Glowing Aura */}
            <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-amber-500 via-yellow-400 to-blue-500 opacity-80 blur-xl group-hover:opacity-100 transition duration-1000 animate-pulse"></div>
            
            {/* Logo Container Circle */}
            <div className="relative w-28 h-28 md:w-36 md:h-36 rounded-full bg-[#05070F]/90 p-4 border-2 border-amber-500/50 shadow-[0_0_30px_rgba(212,175,55,0.4)] backdrop-blur-md flex items-center justify-center">
              <img
                src="/logo.png"
                alt="RCCG Divine Favour Parish Emblem"
                className="w-full h-full object-contain drop-shadow-[0_4px_12px_rgba(212,175,55,0.6)]"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          </div>
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white leading-tight">
          Welcome to <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-500 bg-clip-text text-transparent">
            Divine Favour Parish
          </span>
        </h1>

        {/* Subtitle with Parish Location */}
        <p className="text-slate-300 text-base md:text-xl max-w-2xl mx-auto font-light leading-relaxed">
          Experiencing God’s unmerited favor, spiritual transformation, and rich fellowship in <span className="text-amber-400 font-medium">Ajibode, Ibadan</span>.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-4 pt-4">
          <a
            href="#sermons"
            className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-slate-950 font-bold shadow-[0_0_20px_rgba(245,158,11,0.3)] transition transform hover:-translate-y-0.5 flex items-center gap-2"
          >
            <BookOpen className="w-4 h-4" /> Listen to Sermons
          </a>
          <a
            href="#prayer"
            className="px-6 py-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-amber-300 font-semibold border border-amber-500/30 backdrop-blur-md transition transform hover:-translate-y-0.5 flex items-center gap-2"
          >
            <Heart className="w-4 h-4 text-rose-400" /> Submit Prayer Request
          </a>
        </div>

        {/* Slide Indicator Dots */}
        <div className="flex justify-center gap-2 pt-6">
          {HERO_IMAGES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                idx === currentIndex ? 'w-8 bg-amber-400' : 'w-2 bg-slate-700/80'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}