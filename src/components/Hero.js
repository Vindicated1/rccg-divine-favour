'use client';

import { useState, useEffect } from 'react';
import { Sparkles, Heart, BookOpen, Video, Send } from 'lucide-react';

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
    <section id="hero" className="relative min-h-[100vh] flex items-center justify-center py-20 px-4 text-center border-b border-emerald-500/20 overflow-hidden bg-[#0b1524]">
      
      {/* 1. Animated Photo Slideshow Layer */}
      {HERO_IMAGES.map((imgUrl, index) => (
        <div
          key={imgUrl}
          className={`absolute inset-0 transition-all duration-1000 ease-in-out pointer-events-none z-0 ${
            index === currentIndex
              ? 'opacity-100 scale-105'
              : 'opacity-0 scale-100'
          }`}
          style={{
            backgroundImage: `url(${imgUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            transition: 'opacity 1.2s ease-in-out, transform 6s ease-out'
          }}
          aria-hidden="true"
        />
      ))}

      <div className="absolute inset-0 bg-gradient-to-t from-[#0b1524]/85 via-[#0b1524]/15 to-[#0b1524]/35 z-0 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0b1524]/45 via-transparent to-[#0b1524]/45 z-0 pointer-events-none" />

      <div className="absolute -top-32 left-1/4 w-[500px] h-[500px] bg-emerald-600/15 rounded-full blur-[130px] pointer-events-none z-0" />
      <div className="absolute top-1/3 -right-20 w-[450px] h-[450px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none z-0" />

      {/* 4. Foreground Hero Content */}
      <div className="relative z-10 max-w-4xl mx-auto space-y-6">
        
        {/* Top Church Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#10251f]/90 text-emerald-100 text-xs font-semibold border border-emerald-300/30 shadow-lg backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" /> The Redeemed Christian Church of God
        </div>

        <div className="flex justify-center my-5">
          <div className="w-28 h-28 md:w-36 md:h-36 rounded-2xl bg-white p-2 border border-amber-300/80 shadow-[0_12px_40px_rgba(0,0,0,0.35)]">
            <img
              src="/logo.png"
              alt="RCCG Divine Favour Parish Emblem"
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white leading-tight">
          Welcome to <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-amber-200 via-amber-300 to-emerald-300 bg-clip-text text-transparent">
            Divine Favour Parish
          </span>
        </h1>

        {/* Subtitle with Parish Location */}
        <p className="text-slate-300 text-base md:text-xl max-w-2xl mx-auto font-light leading-relaxed">
          Experiencing God’s unmerited favor, spiritual transformation, and rich fellowship in <span className="text-amber-300 font-medium">Ajibode, Ibadan</span>.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-4 pt-4">
          <a
            href="#sermons"
            className="px-6 py-3.5 rounded-xl bg-amber-300 hover:bg-amber-200 text-slate-950 font-bold shadow-lg shadow-amber-950/30 transition transform hover:-translate-y-0.5 flex items-center gap-2"
          >
            <BookOpen className="w-4 h-4" /> Listen to Sermons
          </a>
          <a
            href="https://meet.google.com/kqs-wmyn-vpk"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-semibold shadow-lg shadow-emerald-950/30 transition transform hover:-translate-y-0.5 flex items-center gap-2"
          >
            <Video className="w-4 h-4" /> Join online prayer
          </a>
          <a
            href="https://t.me/+YB1vNpaZ1HZmZDc0"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold border border-white/25 backdrop-blur-md transition transform hover:-translate-y-0.5 flex items-center gap-2"
          >
            <Send className="w-4 h-4" /> Telegram channel
          </a>
          <a
            href="#prayer"
            className="px-6 py-3.5 rounded-xl bg-[#0b1524]/70 hover:bg-[#0b1524]/90 text-emerald-100 font-semibold border border-emerald-300/40 backdrop-blur-md transition transform hover:-translate-y-0.5 flex items-center gap-2"
          >
            <Heart className="w-4 h-4 text-emerald-300" /> Submit prayer request
          </a>
        </div>

        {/* Slide Indicator Dots */}
        <div className="flex justify-center gap-2 pt-6">
          {HERO_IMAGES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                idx === currentIndex ? 'w-8 bg-amber-300' : 'w-2 bg-white/60'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
              aria-pressed={idx === currentIndex}
            />
          ))}
        </div>

      </div>
    </section>
  );
}