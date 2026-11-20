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
    <section id="testimonies" className="mx-auto max-w-7xl border-b border-slate-200 px-4 py-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div>
          <div className="flex items-center gap-3 mb-8">
            <div className="rounded-xl bg-[#4c1864]/[0.07] p-2.5 text-[#4c1864]">
              <Heart className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[#241333]">Stories from our parish</h2>
              <p className="text-sm text-slate-600">Encouragement from our church family.</p>
            </div>
          </div>

          {loading ? (
            <p className="py-8 text-sm text-slate-500">Loading parish stories…</p>
          ) : testimonies.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-slate-600">
              No testimonies have been published yet. Approved stories will appear here.
            </div>
          ) : (
            <div className="space-y-4">
              {testimonies.map((item) => (
                <article key={item.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <MessageSquare className="mb-3 h-5 w-5 text-[#008f4a]" />
                  <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700">{item.testimony}</p>
                  <p className="mt-4 text-xs font-semibold text-slate-500">{item.name || 'Parish member'}</p>
                </article>
              ))}
            </div>
          )}
        </div>

        <div className="h-fit rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <h3 className="mb-2 text-xl font-bold text-[#241333]">Share your testimony</h3>
          <p className="mb-6 text-sm text-slate-600">
            Encourage others by sharing what God has done. Your testimony will be reviewed before it is published.
          </p>

          {status && (
            <div className={`p-4 rounded-xl text-sm mb-5 ${
              status.type === 'success'
                ? 'border border-emerald-700/20 bg-emerald-50 text-emerald-800'
                : 'border border-rose-700/20 bg-rose-50 text-rose-800'
            }`}>
              {status.message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="testimony-name" className="mb-1 block text-xs font-semibold text-slate-700">
                Your name (optional)
              </label>
              <input
                id="testimony-name"
                type="text"
                maxLength={100}
                value={formData.name}
                onChange={(event) => setFormData({ ...formData, name: event.target.value })}
                placeholder="Leave blank to share anonymously"
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-slate-900 placeholder-slate-400 focus:border-[#4c1864] focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="testimony-body" className="mb-1 block text-xs font-semibold text-slate-700">
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
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-[#4c1864] focus:outline-none"
              />
              <p className="mt-1 text-right text-[11px] text-slate-500">{formData.testimony.length}/5000</p>
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#008f4a] py-3 font-semibold text-white transition hover:bg-[#00783e] disabled:opacity-50"
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
