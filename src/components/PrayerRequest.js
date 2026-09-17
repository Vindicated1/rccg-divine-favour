'use client';

import { useState } from 'react';
import { Heart, Send } from 'lucide-react';

export default function PrayerRequest() {
  const [prayerData, setPrayerData] = useState({ full_name: '', contact: '', request_body: '' });
  const [prayerStatus, setPrayerStatus] = useState(null);
  const [submittingPrayer, setSubmittingPrayer] = useState(false);

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
  );
}