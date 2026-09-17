'use client';

import Link from 'next/link';
import { Instagram, MapPin, Phone, Mail, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 py-12 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-slate-800/60">
        
        {/* Brand & Mission */}
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <img
              src="/logo.png"
              alt="RCCG Divine Favour Logo"
              className="w-8 h-8 object-contain"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
            <span className="font-bold text-white text-lg tracking-wide">
              RCCG Divine Favour Parish Ajiode
            </span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            A place of divine transformation, passionate worship, and unfeigned love in Jesus Christ.
          </p>
        </div>

        {/* Quick Links / Location */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-white">Location & Contact</h4>
          <ul className="space-y-2 text-xs">
            <li className="flex items-start space-x-2">
              <MapPin className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <span>Along Laaniba Road, Onile-Aro, Ajibode, University of Ibadan, Ibadan, Oyo State, Nigeria</span>
            </li>
            <li className="flex items-center space-x-2">
              <Phone className="w-4 h-4 text-blue-400 shrink-0" />
              <span>+234 806 965 9845</span>
            </li>
            <li className="flex items-center space-x-2">
              <Mail className="w-4 h-4 text-blue-400 shrink-0" />
              <span>rccgdfajibode@gmail.com</span>
            </li>
          </ul>
        </div>

        {/* Social Media Handles */}
        <div>
          <h4 className="text-md font-semibold text-white mb-4">Connect With Us</h4>
          <p className="text-sm text-slate-400 mb-4">
            Follow our live streams and updates on social media:
          </p>
          
          <div className="flex flex-col space-y-3">
            {/* Facebook Link */}
            <a
              href="https://web.facebook.com/profile.php?id=61579495722502"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-3 text-sm bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 hover:text-amber-400 px-3 py-2 rounded-lg transition-all"
            >
              <svg className="w-5 h-5 text-blue-500 fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              <span>RCCG Divine Favour Ajibode</span>
            </a>

            {/* YouTube Link */}
            <a
              href="https://www.youtube.com/results?search_query=RCCG+Divine+Favour+Parish"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-3 text-sm bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 hover:text-amber-400 px-3 py-2 rounded-lg transition-all"
            >
              <svg className="w-5 h-5 text-red-500 fill-current" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
              <span>RCCG Divine Favour Parish</span>
            </a>
            <div className="space-y-3">
          
              <div className="flex flex-col space-y-2">
                  <a
                  href="https://www.instagram.com/rccgdfajibode/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 text-xs text-slate-300 hover:text-pink-400 transition group">
                <div className="p-2 rounded-lg bg-pink-500/10 border border-pink-500/20 text-pink-400       group-hover:bg-pink-500/20 transition">
                <Instagram className="w-4 h-4" />
                </div>
                <span className="font-medium">RCCG Divine Favour Ajibode</span>
                </a>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Copyright */}
      <div className="max-w-7xl mx-auto pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-2">
        <p>© {new Date().getFullYear()} RCCG Divine Favour Parish, Ajibode. All rights reserved.</p>
      </div>
    </footer>
  );
}