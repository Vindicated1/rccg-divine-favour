'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { BookOpen, CalendarDays, Radio } from 'lucide-react';

const ONLINE_SERVICE_URL = 'https://www.youtube.com/@rccgdfajibode';

function formatDate(date) {
  if (!date) return null;
  const parsedDate = new Date(date);
  return Number.isNaN(parsedDate.getTime())
    ? null
    : parsedDate.toLocaleDateString('en-US', { dateStyle: 'medium' });
}

export default function Sermons() {
  const [sermons, setSermons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSermons() {
      try {
        const response = await fetch('/api/sermons');
        if (!response.ok) throw new Error('Failed to load parish messages.');
        const data = await response.json();
        if (Array.isArray(data)) setSermons(data);
      } catch (error) {
        console.error('Failed to load sermons:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchSermons();
  }, []);

  const latest = sermons[0];
  const archive = sermons.slice(1);

  return (
    <section id="sermons" className="bg-white px-4 py-16 sm:py-20 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-9 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#008f4a]">Watch & listen</p>
            <h2 className="mt-2 text-3xl font-bold text-[#241333] sm:text-4xl">Latest message</h2>
            <p className="mt-2 text-sm text-slate-600">Sermons and teaching from RCCG Divine Favour Parish.</p>
          </div>
          <a
            href={ONLINE_SERVICE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-[#4c1864]/20 px-4 py-2.5 text-sm font-semibold text-[#4c1864] transition hover:bg-[#4c1864]/[0.05]"
          >
            <Radio className="h-4 w-4" aria-hidden="true" /> Watch online
          </a>
        </div>

        {loading ? (
          <p className="rounded-2xl border border-slate-200 bg-slate-50 p-8 text-sm text-slate-500">Loading the latest message…</p>
        ) : !latest ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-sm text-slate-600">
            No audio messages are published yet. Add a sermon in the Admin Portal to feature it here.
          </div>
        ) : (
          <>
            <article className="grid overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm lg:grid-cols-[1fr_1.15fr]">
              <div className="group/image relative min-h-[260px] overflow-hidden bg-[#241333] sm:min-h-[340px]">
                <Image
                  src="/hero3.jpg"
                  alt=""
                  fill
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  className="object-cover opacity-80 transition-transform duration-700 ease-out group-hover/image:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#241333]/90 via-[#241333]/15 to-transparent" />
                <span className="absolute bottom-6 left-6 rounded-full border border-white/30 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-white backdrop-blur">
                  Latest parish message
                </span>
              </div>
              <div className="flex flex-col justify-center p-6 sm:p-9">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-medium text-slate-500">
                  {formatDate(latest.date_preached) && (
                    <span className="inline-flex items-center gap-1.5">
                      <CalendarDays className="h-4 w-4 text-[#008f4a]" aria-hidden="true" />
                      {formatDate(latest.date_preached)}
                    </span>
                  )}
                  {latest.speaker && <span>Minister: {latest.speaker}</span>}
                </div>
                <h3 className="mt-3 text-2xl font-bold leading-tight text-[#241333] sm:text-3xl">{latest.title}</h3>
                <div className="mt-6 rounded-xl bg-slate-50 p-3">
                  <audio controls className="h-10 w-full" aria-label={`Listen to ${latest.title}`}>
                    <source src={latest.audio_url} type="audio/mpeg" />
                    Your browser does not support audio playback.
                  </audio>
                </div>
                <a href="#manuals" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#4c1864] hover:text-[#008f4a]">
                  <BookOpen className="h-4 w-4" aria-hidden="true" /> Browse study resources
                </a>
              </div>
            </article>

            {archive.length > 0 && (
              <div className="mt-12">
                <h3 className="mb-5 text-xl font-bold text-[#241333]">More messages</h3>
                <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                  {archive.map((sermon) => (
                    <article key={sermon.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                      <div className="mb-2 flex items-center gap-2 text-xs text-slate-500">
                        <CalendarDays className="h-4 w-4 text-[#008f4a]" aria-hidden="true" />
                        {formatDate(sermon.date_preached) || 'Date not provided'}
                      </div>
                      <h4 className="font-bold text-slate-900">{sermon.title}</h4>
                      {sermon.speaker && <p className="mt-1 text-sm text-slate-600">Minister: {sermon.speaker}</p>}
                      <audio controls className="mt-4 h-10 w-full" aria-label={`Listen to ${sermon.title}`}>
                        <source src={sermon.audio_url} type="audio/mpeg" />
                        Your browser does not support audio playback.
                      </audio>
                    </article>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
