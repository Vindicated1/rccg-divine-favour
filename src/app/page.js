'use client';

import { useState, useEffect } from 'react';
import { Send, Heart, BookOpen, Calendar, MapPin, Sparkles, Clock, CreditCard, ExternalLink, Phone } from 'lucide-react';

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
        setPrayerStatus({ type: 'success', msg: 'Your prayer request has been submitted securely. God bless you!' });
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
    <div className="relative min-h-screen bg-[#05070F] text-slate-100 font-sans overflow-hidden">
      
      {/* Dynamic Background Mesh */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-32 left-1/4 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] animate-glow-blue" />
        <div className="absolute top-1/3 -right-20 w-[450px] h-[450px] bg-amber-500/15 rounded-full blur-[130px] animate-glow-gold" />
        <div className="absolute -bottom-32 left-1/3 w-[600px] h-[600px] bg-indigo-600/15 rounded-full blur-[140px] animate-glow-blue" />
      </div>

      {/* Navigation Header */}
      <header className="relative z-50 border-b border-amber-500/20 bg-[#070A14]/80 backdrop-blur-md sticky top-0">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative w-12 h-12 flex-shrink-0">
              <img 
                src="/logo.png" 
                alt="RCCG Divine Favour Parish Logo" 
                className="w-full h-full object-contain drop-shadow-[0_0_8px_rgba(212,175,55,0.4)]"
              />
            </div>
            <div>
              <h1 className="font-extrabold text-base md:text-lg tracking-wide text-white">
                RCCG Divine Favour Parish
              </h1>
              <p className="text-xs text-amber-400 font-medium flex items-center gap-1">
                <MapPin className="w-3 h-3 text-amber-400" /> Ajibode, Ibadan
              </p>
            </div>
          </div>

          <nav className="hidden md:flex space-x-6 text-sm font-medium text-slate-300">
            <a href="#services" className="hover:text-amber-400 transition">Weekly Services</a>
            <a href="#sermons" className="hover:text-amber-400 transition">Audio Sermons</a>
            <a href="#giving" className="hover:text-amber-400 transition">Giving</a>
            <a href="#prayer" className="hover:text-amber-400 transition">Prayer Requests</a>
            <a href="/admin" className="hover:text-amber-400 transition text-slate-400 border border-amber-500/20 px-3 py-1 rounded-lg bg-amber-500/5">Admin Portal</a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 py-16 md:py-24 px-4 text-center border-b border-amber-500/10">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-950/60 text-emerald-400 text-xs font-semibold border border-emerald-500/30 shadow-lg">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> The Redeemed Christian Church of God
          </div>

          <div className="flex justify-center my-4">
            <div className="relative p-2 rounded-full bg-gradient-to-b from-amber-500/20 to-transparent border border-amber-500/30 backdrop-blur-sm">
              <img 
                src="/logo.png" 
                alt="Emblem" 
                className="w-28 h-28 md:w-36 md:h-36 object-contain drop-shadow-[0_0_20px_rgba(212,175,55,0.5)]"
              />
            </div>
          </div>

          <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Welcome to <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-500 bg-clip-text text-transparent">Divine Favour Parish</span>
          </h2>
          
          <p className="text-slate-300 text-base md:text-xl max-w-2xl mx-auto font-light">
            Experiencing God’s unmerited favor, spiritual transformation, and rich fellowship in Ajibode, Ibadan.
          </p>

          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <a 
              href="#sermons" 
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-slate-950 font-bold shadow-[0_0_20px_rgba(245,158,11,0.3)] transition transform hover:-translate-y-0.5"
            >
              Listen to Sermons
            </a>
            <a 
              href="#prayer" 
              className="px-6 py-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-amber-300 font-semibold border border-amber-500/30 backdrop-blur-md transition transform hover:-translate-y-0.5"
            >
              Submit Prayer Request
            </a>
          </div>
        </div>
      </section>

      {/* Weekly Services Section */}
      <section id="services" className="relative z-10 py-16 px-4 max-w-6xl mx-auto">
        <div className="flex items-center space-x-3 mb-8 border-l-4 border-amber-400 pl-4">
          <Clock className="w-6 h-6 text-amber-400" />
          <h3 className="text-2xl font-bold text-white tracking-wide">Weekly Worship Schedule</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900/70 border border-amber-500/20 rounded-2xl p-6 backdrop-blur-md shadow-xl">
            <span className="text-xs font-semibold text-amber-400 uppercase tracking-widest block mb-2">Sundays</span>
            <h4 className="text-xl font-bold text-white mb-2">Sunday Service</h4>
            <p className="text-slate-400 text-sm mb-4">Worship, Word, Prophetic Prayers, etc</p>
            <span className="text-xs font-semibold text-slate-300 bg-slate-800/80 px-3 py-1 rounded-full border border-slate-700 inline-block">8:00 AM – 11:30 AM</span>
          </div>

          <div className="bg-slate-900/70 border border-amber-500/20 rounded-2xl p-6 backdrop-blur-md shadow-xl">
            <span className="text-xs font-semibold text-amber-400 uppercase tracking-widest block mb-2">Tuesdays</span>
            <h4 className="text-xl font-bold text-white mb-2">Digging Deep</h4>
            <p className="text-slate-400 text-sm mb-4">In-depth Bible Study and Exposition of God’s Word.</p>
            <span className="text-xs font-semibold text-slate-300 bg-slate-800/80 px-3 py-1 rounded-full border border-slate-700 inline-block">5:00 PM – 6:00 PM</span>
          </div>

          <div className="bg-slate-900/70 border border-amber-500/20 rounded-2xl p-6 backdrop-blur-md shadow-xl">
            <span className="text-xs font-semibold text-amber-400 uppercase tracking-widest block mb-2">Thursdays</span>
            <h4 className="text-xl font-bold text-white mb-2">Faith Clinic</h4>
            <p className="text-slate-400 text-sm mb-4">Intercessory Prayers, Deliverance & Spiritual Healing.</p>
            <span className="text-xs font-semibold text-slate-300 bg-slate-800/80 px-3 py-1 rounded-full border border-slate-700 inline-block">5:00 PM – 6:00 PM</span>
          </div>
        </div>
      </section>

      {/* Audio Sermons Section */}
      <section id="sermons" className="relative z-10 py-16 px-4 max-w-6xl mx-auto border-t border-amber-500/10">
        <div className="flex items-center space-x-3 mb-8 border-l-4 border-amber-400 pl-4">
          <BookOpen className="w-6 h-6 text-amber-400" />
          <h3 className="text-2xl font-bold text-white tracking-wide">Recent Audio Sermons</h3>
        </div>

        {loadingSermons ? (
          <div className="text-slate-400 text-sm animate-pulse">Loading sermons...</div>
        ) : sermons.length === 0 ? (
          <p className="text-slate-400 text-sm bg-slate-900/60 border border-amber-500/10 p-6 rounded-2xl backdrop-blur-sm">
            No audio sermons uploaded yet. Preachers can upload sermons via the Admin Portal.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sermons.map((sermon) => (
              <div 
                key={sermon.id} 
                className="bg-slate-900/70 border border-amber-500/20 hover:border-amber-500/40 rounded-2xl p-5 shadow-xl backdrop-blur-md transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-2 text-xs text-amber-400 font-medium mb-2">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{new Date(sermon.date_preached).toLocaleDateString()}</span>
                  </div>
                  <h4 className="font-semibold text-lg text-white mb-1">{sermon.title}</h4>
                  <p className="text-sm text-slate-400 mb-4">Minister: {sermon.speaker}</p>
                </div>
                
                <div className="mt-2">
                  <audio controls className="w-full h-10 rounded-lg bg-slate-800 accent-amber-500">
                    <source src={sermon.audio_url} type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Online Giving / Bank Transfer */}
      <section id="giving" className="relative z-10 py-16 px-4 max-w-6xl mx-auto border-t border-amber-500/10">
        <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/40 border border-amber-500/30 rounded-3xl p-8 backdrop-blur-xl shadow-2xl">
          <div className="flex items-center space-x-3 mb-4">
            <CreditCard className="w-6 h-6 text-amber-400" />
            <h3 className="text-2xl font-bold text-white">Online Giving & Tithes</h3>
          </div>
          <p className="text-slate-300 text-sm max-w-2xl mb-6">
            "Honor the LORD with your wealth, with the firstfruits of all your crops." — Proverbs 3:9. You can support God's kingdom work at Divine Favour Parish through direct bank transfer:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5">
              <span className="text-xs text-amber-400 font-semibold block mb-1">Tithe & Offering Account</span>
              <h4 className="text-lg font-bold text-white">The Redeemed Christian Church of God Divine Favour Parish</h4>
              <p className="text-2xl font-mono font-bold text-amber-300 my-2 tracking-wider">2026468000</p>
              <p className="text-xs text-slate-400">First Bank</p>
            </div>

            <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5">
              <span className="text-xs text-amber-400 font-semibold block mb-1">Project Account</span>
              <h4 className="text-lg font-bold text-white">RCCG Divine Favour Project Account</h4>
              <p className="text-2xl font-mono font-bold text-amber-300 my-2 tracking-wider">0252022052</p>
              <p className="text-xs text-slate-400">Wema Bank</p>
            </div>
          </div>
        </div>
      </section>

      {/* Prayer Request Form */}
      <section id="prayer" className="relative z-10 py-16 px-4 bg-slate-950/60 border-t border-amber-500/10">
        <div className="max-w-2xl mx-auto bg-slate-900/80 border border-amber-500/20 rounded-3xl p-8 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center space-x-3 mb-3">
            <Heart className="w-6 h-6 text-rose-500" />
            <h3 className="text-2xl font-bold text-white">Prayer Request & Intercession</h3>
          </div>
          <p className="text-slate-400 text-sm mb-6">
            Share your prayer requests with us. Our pastoral intercessors at Divine Favour Parish will stand in agreement with you.
          </p>

          {prayerStatus && (
            <div className={`p-4 rounded-xl text-sm mb-6 ${prayerStatus.type === 'success' ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400' : 'bg-rose-500/10 border border-rose-500/30 text-rose-400'}`}>
              {prayerStatus.msg}
            </div>
          )}

          <form onSubmit={handlePrayerSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-amber-200/80 mb-1">Full Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Brother John"
                value={prayerData.full_name}
                onChange={(e) => setPrayerData({ ...prayerData, full_name: e.target.value })}
                className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-amber-200/80 mb-1">Contact (Phone / Email)</label>
              <input
                type="text"
                required
                placeholder="+234..."
                value={prayerData.contact}
                onChange={(e) => setPrayerData({ ...prayerData, contact: e.target.value })}
                className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-amber-200/80 mb-1">Prayer Request</label>
              <textarea
                required
                rows={4}
                placeholder="Describe your prayer point..."
                value={prayerData.request_body}
                onChange={(e) => setPrayerData({ ...prayerData, request_body: e.target.value })}
                className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            <button
              type="submit"
              disabled={submittingPrayer}
              className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-slate-950 font-bold rounded-xl flex items-center justify-center space-x-2 transition shadow-[0_0_15px_rgba(245,158,11,0.2)] disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{submittingPrayer ? 'Submitting...' : 'Submit Prayer Request'}</span>
            </button>
          </form>
        </div>
      </section>

      {/* Footer & Location */}
      <footer className="relative z-10 border-t border-amber-500/10 py-12 px-4 text-center bg-[#04060C]">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="flex justify-center items-center space-x-2">
            <img src="/logo.png" alt="Logo" className="w-8 h-8 object-contain" />
            <span className="font-bold text-white text-lg">RCCG Divine Favour Parish</span>
          </div>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Ajibode, Ibadan, Oyo State, Nigeria.
          </p>
          <div className="flex justify-center gap-4 pt-2">
            <a 
              href="https://maps.google.com/?q=Ajibode+Ibadan" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-amber-400 hover:underline bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-full"
            >
              <MapPin className="w-3.5 h-3.5" /> Get Directions on Google Maps <ExternalLink className="w-3 h-3" />
            </a>
          </div>
          <p className="text-[11px] text-slate-600 pt-6">© {new Date().getFullYear()} RCCG Divine Favour Parish, Ajibode Ibadan. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}