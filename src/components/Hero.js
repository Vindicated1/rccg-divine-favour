'use client';

import { useEffect, useState } from 'react';
import { ArrowDown, MapPin, Radio, Video } from 'lucide-react';

const HERO_IMAGES = ['/hero1.jpg', '/hero2.jpg', '/hero3.jpg', '/hero4.jpg', '/hero5.jpg', '/hero6.jpg', '/hero7.jpg'];
const ONLINE_SERVICE_URL = 'https://www.youtube.com/@rccgdfajibode';

export default function Hero() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((index) => (index + 1) % HERO_IMAGES.length);
    }, 6500);

    return () => clearInterval(interval);
  }, []);

  return (
    <section id="hero" className="relative isolate flex min-h-screen items-center justify-center overflow-hidden bg-[#241333] px-4 pb-20 pt-32 text-center sm:px-6 sm:pt-36 lg:py-24">
      {HERO_IMAGES.map((image, index) => (
        <div
          key={image}
          aria-hidden="true"
          className={`hero-slide absolute inset-0 -z-20 bg-cover bg-center ${
            index === currentIndex ? 'hero-slide-active opacity-100' : 'opacity-0'
          }`}
          style={{
            backgroundImage: `url("${image}")`,
          }}
        />
      ))}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#241333]/65 via-[#241333]/55 to-[#241333]/85" aria-hidden="true" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#241333]/40 via-transparent to-[#241333]/40" aria-hidden="true" />

      <div className="mx-auto max-w-6xl">
        <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] sm:text-base">
          The Redeemed Christian Church of God | Divine Favour Parish
        </p>
        <h1 className="mt-5 text-4xl font-black leading-[1.05] tracking-tight text-white drop-shadow-[0_4px_18px_rgba(0,0,0,0.75)] sm:text-6xl md:text-7xl 2xl:text-8xl">
          Find a place to belong
          <span className="mt-1 block text-emerald-200">and grow in faith.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-base font-medium leading-7 text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] sm:text-lg md:text-xl">
          Join us for worship, prayer, and fellowship at RCCG Divine Favour Parish.
          We would love to welcome you.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a
            href="#visit"
            className="inline-flex items-center gap-2 rounded-lg bg-[#008f4a] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-black/20 transition hover:bg-[#00783e]"
          >
            <MapPin className="h-4 w-4" aria-hidden="true" /> Plan your visit
          </a>
          <a
            href={ONLINE_SERVICE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-white/60 bg-white/10 px-6 py-3.5 text-sm font-bold text-white backdrop-blur transition hover:bg-white/20"
          >
            <Radio className="h-4 w-4" aria-hidden="true" /> Watch online
          </a>
          <a
            href="https://meet.google.com/kqs-wmyn-vpk"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-[#4c1864] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-black/20 transition hover:bg-[#3b124e]"
          >
            <Video className="h-4 w-4" aria-hidden="true" /> Join online prayer
          </a>
        </div>

        <a href="#about" className="mt-12 inline-flex items-center gap-2 text-sm font-medium text-white/75 transition hover:text-white">
          Discover our parish <ArrowDown className="h-4 w-4" aria-hidden="true" />
        </a>

        <div className="mt-7 flex justify-center gap-2" aria-label="Choose a background photo">
          {HERO_IMAGES.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setCurrentIndex(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentIndex ? 'w-8 bg-emerald-200' : 'w-2 bg-white/60 hover:bg-white'
              }`}
              aria-label={`Show photo ${index + 1}`}
              aria-pressed={index === currentIndex}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
