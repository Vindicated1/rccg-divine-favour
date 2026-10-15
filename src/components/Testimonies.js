'use client';

import { useEffect, useState } from 'react';
import { Heart, MessageSquare, Send } from 'lucide-react';

export default function Testimonies() {
  const [testimonies, setTestimonies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ name: '', testimony: '' });
  const [status, setStatus] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function fetchTestimonies() {
      try {
        const response = await fetch('/api/testimonies');
        if (!response.ok) throw new Error('Failed to load testimonies.');
        const data = await response.json();
        if (Array.isArray(data)) setTestimonies(data);
      } catch (error) {
        console.error('Failed to load testimonies:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchTestimonies();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setStatus(null);

    try {
      const response = await fetch('/api/testimonies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const result = await response.json();

      if (!response.ok) throw new Error(result.error || 'Failed to submit testimony.');

      setFormData({ name: '', testimony: '' });
      setStatus({
        type: 'success',
        message: 'Thank you for sharing. Your testimony will appear after it has been reviewed.',
      });
    } catch (error) {
      setStatus({ type: 'error', message: error.message || 'Network error. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="testimonies" className="py-16 px-4 max-w-7xl mx-auto border-b border-slate-800/60">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div>
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <Heart className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Testimonies</h2>
              <p className="text-xs text-slate-400">Stories of God&apos;s goodness in our community</p>
            </div>
          </div>

          {loading ? (
            <p className="text-sm text-slate-400 py-8">Loading testimonies...</p>
          ) : testimonies.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center text-slate-400">
              No testimonies have been published yet.
            </div>
          ) : (
            <div className="space-y-4">
              {testimonies.map((item) => (
                <article key={item.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                  <MessageSquare className="w-5 h-5 text-rose-400 mb-3" />
                  <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">{item.testimony}</p>
                  <p className="text-xs text-slate-400 mt-4 font-semibold">{item.name || 'Anonymous'}</p>
                </article>
              ))}
            </div>
          )}
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 h-fit">
          <h3 className="text-xl font-bold text-white mb-2">Share Your Testimony</h3>
          <p className="text-sm text-slate-400 mb-6">
            Encourage others by sharing what God has done. Your testimony will be reviewed before it is published.
          </p>

          {status && (
            <div className={`p-4 rounded-xl text-sm mb-5 ${
              status.type === 'success'
                ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                : 'bg-rose-500/10 border border-rose-500/30 text-rose-400'
            }`}>
              {status.message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="testimony-name" className="block text-xs font-semibold text-slate-300 mb-1">
                Your name (optional)
              </label>
              <input
                id="testimony-name"
                type="text"
                maxLength={100}
                value={formData.name}
                onChange={(event) => setFormData({ ...formData, name: event.target.value })}
                placeholder="Leave blank to share anonymously"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label htmlFor="testimony-body" className="block text-xs font-semibold text-slate-300 mb-1">
                Your testimony
              </label>
              <textarea
                id="testimony-body"
                required
                minLength={10}
                maxLength={5000}
                rows={6}
                value={formData.testimony}
                onChange={(event) => setFormData({ ...formData, testimony: event.target.value })}
                placeholder="Share your testimony..."
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
              <p className="text-right text-[11px] text-slate-500 mt-1">{formData.testimony.length}/5000</p>
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{submitting ? 'Submitting...' : 'Submit Testimony'}</span>
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
