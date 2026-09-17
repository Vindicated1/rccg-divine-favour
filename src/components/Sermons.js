'use client';

import { useState, useEffect } from 'react';
import { BookOpen, Calendar } from 'lucide-react';

export default function Sermons() {
  const [sermons, setSermons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSermons() {
      try {
        const res = await fetch('/api/sermons');
        const data = await res.json();
        if (Array.isArray(data)) setSermons(data);
      } catch (err) {
        console.error('Failed to load sermons:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchSermons();
  }, []);

  return (
    <section id="sermons" className="py-16 px-4 max-w-7xl mx-auto border-b border-slate-800/60">
      <div className="flex items-center space-x-3 mb-8">
        <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
          <BookOpen className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-white">Audio Sermons Library</h3>
          <p className="text-xs text-slate-400">Listen and download messages for spiritual growth</p>
        </div>
      </div>

      {loading ? (
        <div className="text-slate-400 text-sm py-8">Loading sermons...</div>
      ) : sermons.length === 0 ? (
        <p className="text-slate-400">No audio sermons uploaded yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sermons.map((sermon) => (
            <div key={sermon.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
                  <Calendar className="w-3.5 h-3.5 text-blue-400" />
                  <span>{new Date(sermon.date_preached).toLocaleDateString('en-US', { dateStyle: 'medium' })}</span>
                </div>
                <h4 className="font-semibold text-lg text-white mb-1">{sermon.title}</h4>
                <p className="text-sm text-slate-400 mb-4">Minister: {sermon.speaker}</p>
              </div>
              
              <div className="mt-2">
                <audio controls className="w-full h-10 rounded-lg bg-slate-800">
                  <source src={sermon.audio_url} type="audio/mpeg" />
                </audio>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}