'use client';

import { useState, useEffect } from 'react';
import { Play, Download, Send, Heart, BookOpen, Calendar, ShieldCheck } from 'lucide-react';

export default function Home() {
  const [sermons, setSermons] = useState([]);
  const [loadingSermons, setLoadingSermons] = useState(true);
  
  // Prayer Form State
  const [prayerData, setPrayerData] = useState({ full_name: '', contact: '', request_body: '' });
  const [prayerStatus, setPrayerStatus] = useState(null);
  const [submittingPrayer, setSubmittingPrayer] = useState(false);

  // Fetch Sermons from API
  useEffect(() => {
    async function fetchSermons() {
      try {
        const res = await fetch('/api/sermons');
        const data = await res.json();
        if (Array.isArray(data)) setSermons(data);
      } catch (err) {
        console.error('Failed to load sermons:', err);
      } finally {
        setLoadingSermons(false);
      }
    }
    fetchSermons();
  }, []);

  // Submit Prayer Request
  const handlePrayerSubmit = async (e) => {
    e.preventDefault();
    setSubmittingPrayer(true);
    setPrayerStatus(null);

    try {
      const res = await fetch('/api/prayers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(prayerData),
      });

      const result = await res.json();

      if (res.ok) {
        setPrayerStatus({ type: 'success', msg: 'Your prayer request has been submitted securely.' });
        setPrayerData({ full_name: '', contact: '', request_body: '' });
      } else {
        setPrayerStatus({ type: 'error', msg: result.error || 'Failed to submit request.' });
      }
    } catch (err) {
      setPrayerStatus({ type: 'error', msg: 'Network error. Please try again.' });
    } finally {
      setSubmittingPrayer(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      {/* Navigation Header */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold text-lg text-white shadow-lg">
              DFP
            </div>
            <div>
              <h1 className="font-bold text-lg tracking-wide text-white">RCCG Divine Favour</h1>
              <p className="text-xs text-blue-400 font-medium">Parish Web Portal</p>
            </div>
          </div>
          <nav className="hidden md:flex space-x-6 text-sm font-medium text-slate-300">
            <a href="#about" className="hover:text-blue-400 transition">About Us</a>
            <a href="#sermons" className="hover:text-blue-400 transition">Audio Sermons</a>
            <a href="#prayer" className="hover:text-blue-400 transition">Prayer Requests</a>
            <a href="/admin" className="hover:text-blue-400 transition text-slate-400">Admin Portal</a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 text-center bg-gradient-to-b from-slate-900 to-slate-950 border-b border-slate-800/50">
        <div className="max-w-4xl mx-auto space-y-6">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-semibold border border-blue-500/20">
            <ShieldCheck className="w-4 h-4" /> Welcome to Divine Favour Parish
          </span>
          <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white">
            Experience Divine Grace & Spiritual Transformation
          </h2>
          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto">
            Join our vibrant community in worship, prayer, and listening to the life-changing word of God.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <a href="#sermons" className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium shadow-lg transition">
              Listen to Sermons
            </a>
            <a href="#prayer" className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium border border-slate-700 transition">
              Submit Prayer Request
            </a>
          </div>
        </div>
      </section>

      {/* Audio Sermons Section */}
      <section id="sermons" className="py-16 px-4 max-w-6xl mx-auto">
        <div className="flex items-center space-x-3 mb-8">
          <BookOpen className="w-6 h-6 text-blue-400" />
          <h3 className="text-2xl font-bold text-white">Recent Audio Sermons</h3>
        </div>

        {loadingSermons ? (
          <div className="text-slate-400 text-sm">Loading sermons...</div>
        ) : sermons.length === 0 ? (
          <p className="text-slate-400 text-sm bg-slate-900 border border-slate-800 p-6 rounded-2xl">No audio sermons uploaded yet. Preachers can upload sermons via the Admin Portal.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sermons.map((sermon) => (
              <div key={sermon.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
                    <Calendar className="w-3.5 h-3.5 text-blue-400" />
                    <span>{new Date(sermon.date_preached).toLocaleDateString()}</span>
                  </div>
                  <h4 className="font-semibold text-lg text-white mb-1">{sermon.title}</h4>
                  <p className="text-sm text-slate-400 mb-4">Minister: {sermon.speaker}</p>
                </div>
                
                {/* Audio Player */}
                <div className="mt-2">
                  <audio controls className="w-full h-10 rounded-lg bg-slate-800">
                    <source src={sermon.audio_url} type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Prayer Request Form */}
      <section id="prayer" className="py-16 px-4 bg-slate-900/50 border-t border-slate-800">
        <div className="max-w-2xl mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
          <div className="flex items-center space-x-3 mb-4">
            <Heart className="w-6 h-6 text-rose-500" />
            <h3 className="text-2xl font-bold text-white">Prayer Request & Intercession</h3>
          </div>
          <p className="text-slate-400 text-sm mb-6">
            Share your prayer requests with us. Our pastoral team will stand in agreement with you.
          </p>

          {prayerStatus && (
            <div className={`p-4 rounded-xl text-sm mb-6 ${prayerStatus.type === 'success' ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400' : 'bg-rose-500/10 border border-rose-500/30 text-rose-400'}`}>
              {prayerStatus.msg}
            </div>
          )}

          <form onSubmit={handlePrayerSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Brother John"
                value={prayerData.full_name}
                onChange={(e) => setPrayerData({ ...prayerData, full_name: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Contact (Phone / Email)</label>
              <input
                type="text"
                required
                placeholder="+234..."
                value={prayerData.contact}
                onChange={(e) => setPrayerData({ ...prayerData, contact: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Prayer Request</label>
              <textarea
                required
                rows={4}
                placeholder="Describe your prayer point..."
                value={prayerData.request_body}
                onChange={(e) => setPrayerData({ ...prayerData, request_body: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={submittingPrayer}
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl flex items-center justify-center space-x-2 transition disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{submittingPrayer ? 'Submitting...' : 'Submit Prayer Request'}</span>
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8 text-center text-xs text-slate-500">
        <p>© {new Date().getFullYear()} RCCG Divine Favour Parish. All rights reserved.</p>
      </footer>
    </div>
  );
}