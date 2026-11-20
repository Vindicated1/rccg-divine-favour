'use client';

import { useState, useEffect } from 'react';
import { Megaphone, Calendar, Image as ImageIcon, X, ArrowUpRight } from 'lucide-react';

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
    <section id="announcements" className="mx-auto max-w-7xl border-b border-slate-200 px-4 py-16">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <div className="rounded-xl bg-[#4c1864]/[0.07] p-2.5 text-[#4c1864]">
            <Megaphone className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-[#241333]">Upcoming events & parish news</h2>
            <p className="text-sm text-slate-600">Stay up to date with programs and special events.</p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="py-8 text-sm text-slate-500">Loading parish events…</div>
      ) : announcements.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-600">
          No events are published at the moment. New announcements will appear here.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {announcements.map((item) => (
            <div
              key={item.id}
              className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-[#4c1864]/30 hover:shadow-md"
            >
              <div>
                {item.image_url ? (
                  <div
                    className="relative h-56 cursor-pointer overflow-hidden bg-slate-100"
                    onClick={() => setSelectedFlier(item)}
                  >
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/10 transition group-hover:bg-transparent" />
                    <span className="absolute bottom-3 right-3 flex items-center gap-1 rounded-lg border border-white/40 bg-white/90 px-2.5 py-1 text-[10px] text-slate-700 backdrop-blur">
                      <ImageIcon className="h-3 w-3 text-[#4c1864]" /> Click to expand
                    </span>
                  </div>
                ) : (
                  <div className="flex h-28 items-center justify-center border-b border-slate-200 bg-slate-50 text-xs text-slate-500">
                    No flier attached
                  </div>
                )}

                <div className="p-5">
                  {item.event_date && (
                    <div className="mb-3 inline-flex items-center gap-1.5 rounded-md bg-[#008f4a]/[0.07] px-2.5 py-1 text-xs font-semibold text-[#00783e]">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{new Date(item.event_date).toLocaleDateString('en-US', { dateStyle: 'medium' })}</span>
                    </div>
                  )}
                  <h3 className="mb-2 text-lg font-bold leading-snug text-[#241333]">{item.title}</h3>
                  {item.description && (
                    <p className="whitespace-pre-line text-sm leading-relaxed text-slate-600">
                      {item.description}
                    </p>
                  )}
                  <a
                    href={`mailto:rccgdfajibode@gmail.com?subject=${encodeURIComponent(`Question about ${item.title}`)}`}
                    className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[#4c1864] hover:text-[#008f4a]"
                  >
                    Ask about this event <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Flier Lightbox Modal */}
      {selectedFlier && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md">
          <div className="relative w-full max-w-3xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
            <button
              onClick={() => setSelectedFlier(null)}
              className="absolute right-4 top-4 z-10 rounded-full bg-white/90 p-2 text-slate-700 transition hover:bg-white hover:text-[#4c1864]"
              aria-label="Close announcement image"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="max-h-[80vh] overflow-y-auto">
              <img src={selectedFlier.image_url} alt={selectedFlier.title} className="w-full h-auto" />
              <div className="space-y-2 p-6">
                <h3 className="text-xl font-bold text-[#241333]">{selectedFlier.title}</h3>
                {selectedFlier.description && <p className="text-sm text-slate-600">{selectedFlier.description}</p>}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}