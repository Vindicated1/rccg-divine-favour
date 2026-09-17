'use client';

import { useState, useEffect } from 'react';
import { Megaphone, Calendar, Image as ImageIcon, X } from 'lucide-react';

export default function Announcements() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFlier, setSelectedFlier] = useState(null);

  useEffect(() => {
    async function fetchAnnouncements() {
      try {
        const res = await fetch('/api/announcements');
        const data = await res.json();
        if (Array.isArray(data)) setAnnouncements(data);
      } catch (err) {
        console.error('Failed to load announcements:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchAnnouncements();
  }, []);

  return (
    <section id="announcements" className="py-16 px-4 max-w-7xl mx-auto border-b border-slate-800/60">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Megaphone className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white">Parish Announcements & Fliers</h3>
            <p className="text-xs text-slate-400">Stay updated with upcoming programs and special events</p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-slate-400 text-sm py-8">Loading announcements...</div>
      ) : announcements.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center text-slate-400">
          No upcoming announcements published at this time. Check back soon!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {announcements.map((item) => (
            <div
              key={item.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl flex flex-col justify-between hover:border-slate-700 transition group"
            >
              <div>
                {item.image_url ? (
                  <div
                    className="relative h-56 bg-slate-950 overflow-hidden cursor-pointer"
                    onClick={() => setSelectedFlier(item)}
                  >
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                    <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-transparent transition" />
                    <span className="absolute bottom-3 right-3 bg-slate-900/80 backdrop-blur px-2.5 py-1 rounded-lg text-[10px] text-slate-300 flex items-center gap-1 border border-slate-700">
                      <ImageIcon className="w-3 h-3 text-blue-400" /> Click to expand
                    </span>
                  </div>
                ) : (
                  <div className="h-28 bg-gradient-to-r from-blue-900/30 to-slate-900 border-b border-slate-800 flex items-center justify-center text-slate-500 text-xs">
                    No flier attached
                  </div>
                )}

                <div className="p-5">
                  {item.event_date && (
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-400 text-xs font-semibold mb-3 border border-blue-500/20">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{new Date(item.event_date).toLocaleDateString('en-US', { dateStyle: 'medium' })}</span>
                    </div>
                  )}
                  <h4 className="font-bold text-lg text-white mb-2 leading-snug">{item.title}</h4>
                  {item.description && (
                    <p className="text-sm text-slate-400 leading-relaxed whitespace-pre-line">
                      {item.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Flier Lightbox Modal */}
      {selectedFlier && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative max-w-3xl w-full bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
            <button
              onClick={() => setSelectedFlier(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 z-10 transition"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="max-h-[80vh] overflow-y-auto">
              <img src={selectedFlier.image_url} alt={selectedFlier.title} className="w-full h-auto" />
              <div className="p-6 space-y-2">
                <h3 className="text-xl font-bold text-white">{selectedFlier.title}</h3>
                {selectedFlier.description && <p className="text-sm text-slate-300">{selectedFlier.description}</p>}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}