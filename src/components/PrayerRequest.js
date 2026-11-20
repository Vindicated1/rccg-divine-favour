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
    <section id="prayer" className="bg-white px-4 py-16">
      <div className="mx-auto max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="rounded-xl bg-[#4c1864]/[0.07] p-2.5 text-[#4c1864]">
            <Heart className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-[#241333]">Prayer request</h2>
            <p className="text-sm text-slate-600">Our pastoral team will stand in agreement with you.</p>
          </div>
        </div>

        {prayerStatus && (
          <div className={`mb-6 rounded-xl p-4 text-sm ${prayerStatus.type === 'success' ? 'border border-emerald-700/20 bg-emerald-50 text-emerald-800' : 'border border-rose-700/20 bg-rose-50 text-rose-800'}`}>
            {prayerStatus.msg}
          </div>
        )}

        <form onSubmit={handlePrayerSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700">Full name</label>
            <input
              type="text"
              required
              placeholder="e.g. Brother John"
              value={prayerData.full_name}
              onChange={(e) => setPrayerData({ ...prayerData, full_name: e.target.value })}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-slate-900 placeholder-slate-400 focus:border-[#4c1864] focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700">Contact (phone or email)</label>
            <input
              type="text"
              required
              placeholder="+234..."
              value={prayerData.contact}
              onChange={(e) => setPrayerData({ ...prayerData, contact: e.target.value })}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-slate-900 placeholder-slate-400 focus:border-[#4c1864] focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700">Prayer request</label>
            <textarea
              required
              rows={4}
              placeholder="Describe your prayer point..."
              value={prayerData.request_body}
              onChange={(e) => setPrayerData({ ...prayerData, request_body: e.target.value })}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-slate-900 placeholder-slate-400 focus:border-[#4c1864] focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={submittingPrayer}
            className="flex w-full items-center justify-center space-x-2 rounded-xl bg-[#008f4a] py-3 font-semibold text-white shadow-sm transition hover:bg-[#00783e] disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            <span>{submittingPrayer ? 'Submitting...' : 'Submit Prayer Request'}</span>
          </button>
        </form>
      </div>
    </section>
  );
}