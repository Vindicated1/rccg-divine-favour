'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import {
  Play,
  Send,
  Heart,
  BookOpen,
  Calendar,
  ShieldCheck,
  Megaphone,
  Image as ImageIcon,
  X,
  CreditCard,
  Copy,
  Check,
  Gift,
  Building,
  DollarSign
} from 'lucide-react';

export default function Home() {
  const [sermons, setSermons] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loadingSermons, setLoadingSermons] = useState(true);
  const [loadingAnnouncements, setLoadingAnnouncements] = useState(true);
  
  // Selected Image for Lightbox Modal
  const [selectedFlier, setSelectedFlier] = useState(null);

  // Giving Account Copy state
  const [copiedAccount, setCopiedAccount] = useState(false);
  const accountNumber = '1234567890'; // Replace with parish account number

  // Prayer Form State
  const [prayerData, setPrayerData] = useState({ full_name: '', contact: '', request_body: '' });
  const [prayerStatus, setPrayerStatus] = useState(null);
  const [submittingPrayer, setSubmittingPrayer] = useState(false);

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

    async function fetchAnnouncements() {
      try {
        const res = await fetch('/api/announcements');
        const data = await res.json();
        if (Array.isArray(data)) setAnnouncements(data);
      } catch (err) {
        console.error('Failed to load announcements:', err);
      } finally {
        setLoadingAnnouncements(false);
      }
    }

    fetchSermons();
    fetchAnnouncements();
  }, []);

  const handleCopyAccount = () => {
    navigator.clipboard.writeText(accountNumber);
    setCopiedAccount(true);
    setTimeout(() => setCopiedAccount(false), 2500);
  };

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
      {/* Sticky Responsive Header */}
      <Navbar />

      {/* Hero Section */}
      <section id="hero" className="py-20 px-4 text-center bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 border-b border-slate-800/50">
        <div className="max-w-4xl mx-auto space-y-6">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-semibold border border-blue-500/20">
            <ShieldCheck className="w-4 h-4" /> Welcome to RCCG Divine Favour Parish
          </span>
          <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Experience Divine Grace & Spiritual Transformation
          </h2>
          <p className="text-slate-400 text-base md:text-xl max-w-2xl mx-auto">
            Join our vibrant community in worship, prayer, and listening to the life-changing word of God.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <a href="#giving" className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow-lg shadow-amber-500/20 transition">
              Online Giving & Tithes
            </a>
            <a href="#announcements" className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium shadow-lg shadow-blue-600/20 transition">
              Upcoming Events
            </a>
            <a href="#prayer" className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium border border-slate-700 transition">
              Prayer Request
            </a>
          </div>
        </div>
      </section>

      {/* Announcements & Fliers Section */}
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

        {loadingAnnouncements ? (
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
      </section>

      {/* Flier Modal Lightbox */}
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

      {/* Audio Sermons Section */}
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

        {loadingSermons ? (
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

      {/* RESTORED: Online Giving & Tithes Section */}
      <section id="giving" className="py-16 px-4 bg-slate-900/40 border-b border-slate-800/60">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-semibold border border-amber-500/20">
              <Gift className="w-4 h-4" /> Honor God with Your Substance
            </div>
            <h3 className="text-3xl font-extrabold text-white">Online Giving & Offerings</h3>
            <p className="text-slate-400 text-sm">
              "Every man according as he purposeth in his heart, so let him give; not grudgingly, or of necessity: for God loveth a cheerful giver." — 2 Corinthians 9:7
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Bank Transfer Card */}
            <div className="bg-slate-900 border border-amber-500/30 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
              <div className="absolute -right-6 -top-6 w-24 h-24 bg-amber-500/10 rounded-full blur-xl" />
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <Building className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-lg text-white">Direct Bank Transfer</h4>
                  <p className="text-xs text-slate-400">Tithes, Offerings & Building Project</p>
                </div>
              </div>

              <div className="space-y-4 bg-slate-950/70 p-5 rounded-2xl border border-slate-800">
                <div>
                  <p className="text-xs text-slate-400 font-medium">Bank Name</p>
                  <p className="text-base font-bold text-white">Zenith Bank PLC</p>
                </div>

                <div>
                  <p className="text-xs text-slate-400 font-medium">Account Name</p>
                  <p className="text-base font-bold text-amber-400">RCCG Divine Favour Parish</p>
                </div>

                <div>
                  <p className="text-xs text-slate-400 font-medium">Account Number</p>
                  <div className="flex items-center justify-between mt-1 bg-slate-900 px-4 py-2.5 rounded-xl border border-slate-800">
                    <span className="text-lg font-mono font-bold tracking-widest text-white">{accountNumber}</span>
                    <button
                      onClick={handleCopyAccount}
                      className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-semibold flex items-center gap-1.5 transition"
                    >
                      {copiedAccount ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Online Giving / Cards */}
            <div className="bg-slate-900 border border-blue-500/30 rounded-3xl p-8 shadow-2xl flex flex-col justify-between">
              <div>
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    <CreditCard className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-white">Card Payment / Online Portal</h4>
                    <p className="text-xs text-slate-400">Instant digital giving via Debit/Credit Card</p>
                  </div>
                </div>

                <p className="text-slate-300 text-sm leading-relaxed mb-6">
                  You can make quick, secure online contributions from anywhere in the world using your bank card or mobile payment.
                </p>
              </div>

              <div className="space-y-3">
                <a
                  href="#giving"
                  onClick={() => alert('Online card portal integrated via Paystack / Flutterwave.')}
                  className="w-full py-3.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-center block shadow-lg shadow-blue-600/20 transition"
                >
                  Give Online Now
                </a>
                <p className="text-center text-[11px] text-slate-500">
                  🔒 Secured with SSL Encryption
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Prayer Request Section */}
      <section id="prayer" className="py-16 px-4">
        <div className="max-w-2xl mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-500 border border-rose-500/20">
              <Heart className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">Prayer Request & Intercession</h3>
              <p className="text-xs text-slate-400">Our pastoral team will stand in agreement with you</p>
            </div>
          </div>

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
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl flex items-center justify-center space-x-2 transition shadow-lg shadow-blue-600/20 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{submittingPrayer ? 'Submitting...' : 'Submit Prayer Request'}</span>
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}