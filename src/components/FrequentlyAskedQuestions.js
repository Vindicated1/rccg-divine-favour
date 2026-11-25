'use client';

import { useEffect, useState } from 'react';
import { HelpCircle } from 'lucide-react';

export default function FrequentlyAskedQuestions() {
  const [faqs, setFaqs] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFaqs() {
      try {
        const response = await fetch('/api/faqs');
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || 'Failed to load FAQs.');
        setFaqs(Array.isArray(result) ? result : []);
      } catch (loadError) {
        setError(loadError.message || 'Failed to load FAQs.');
      } finally {
        setLoading(false);
      }
    }

    loadFaqs();
  }, []);

  return (
    <section id="faqs" className="mx-auto max-w-7xl border-b border-slate-200 px-4 py-16">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 flex items-center gap-3">
          <div className="rounded-xl bg-[#4c1864]/[0.07] p-2.5 text-[#4c1864]">
            <HelpCircle className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-[#241333]">Frequently Asked Questions</h2>
            <p className="text-sm text-slate-600">Answers to common questions about our parish.</p>
          </div>
        </div>

        {loading ? (
          <p className="py-6 text-sm text-slate-500">Loading FAQs...</p>
        ) : error ? (
          <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
            {error}
          </p>
        ) : faqs.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-600">
            FAQs will be added here soon.
          </p>
        ) : (
          <div className="space-y-3">
            {faqs.map((faq) => (
              <details key={faq.id} className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <summary className="cursor-pointer list-none pr-6 font-semibold text-[#241333] marker:hidden">
                  {faq.question}
                </summary>
                <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-slate-600">{faq.answer}</p>
              </details>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
