'use client';

import { useState, useEffect } from 'react';
import { FileText, Download, BookOpen, X, Calendar, Tag } from 'lucide-react';

export default function ManualsAndNotes() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'pdf', 'text'
  const [selectedNote, setSelectedNote] = useState(null); // Modal state for long text notes

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await fetch('/api/manuals');
      const data = await res.json();
      if (Array.isArray(data)) setItems(data);
    } catch (e) {
      console.error('Failed to fetch manuals & notes', e);
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = items.filter((item) => {
    if (activeTab === 'pdf') return item.type === 'pdf';
    if (activeTab === 'text') return item.type === 'text';
    return true;
  });

  return (
    <section id="manuals" className="border-y border-slate-200 bg-slate-50 px-4 py-20">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-flex items-center gap-2 rounded-full bg-[#4c1864]/[0.07] px-3 py-1 text-xs font-semibold text-[#4c1864]">
            <BookOpen className="w-4 h-4" /> Study Center
          </span>
          <h2 className="mt-3 text-3xl font-extrabold text-[#241333] md:text-4xl">
            Manuals & Study Notes
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Access Sunday School manuals, class guides, and weekly teaching notes.
          </p>

          {/* Filter Tabs */}
          <div className="flex justify-center gap-2 mt-6">
            {[
              { key: 'all', label: 'All Resources' },
              { key: 'pdf', label: 'PDF Manuals' },
              { key: 'text', label: 'Study Notes & Outlines' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2 rounded-xl text-xs font-medium transition ${
                  activeTab === tab.key
                    ? 'bg-[#4c1864] text-white shadow-sm'
                    : 'bg-white text-slate-600 hover:bg-slate-100 hover:text-[#4c1864]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content Grid */}
        {loading ? (
          <div className="animate-pulse py-12 text-center text-sm text-slate-500">
            Loading manuals and study notes...
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-12 text-center text-sm text-slate-500">
            No study resources or notes published yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-[#4c1864]/30 hover:shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="inline-flex items-center gap-1 rounded-md bg-[#4c1864]/[0.07] px-2.5 py-0.5 text-[11px] font-semibold text-[#4c1864]">
                      <Tag className="w-3 h-3" /> {item.category || 'General'}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] text-slate-500">
                      <Calendar className="w-3 h-3" />
                      {new Date(item.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold leading-snug text-slate-900 transition group-hover:text-[#4c1864]">
                    {item.title}
                  </h3>

                  {item.description && (
                    <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-slate-600">
                      {item.description}
                    </p>
                  )}
                </div>

                <div className="mt-6 border-t border-slate-200 pt-4">
                  {item.type === 'pdf' ? (
                    <a
                      href={item.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#008f4a] py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-[#00783e]"
                    >
                      <Download className="w-4 h-4" /> Download / View PDF
                    </a>
                  ) : (
                    <button
                      onClick={() => setSelectedNote(item)}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white py-2.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                      <FileText className="h-4 w-4 text-[#4c1864]" /> Read Full Note
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Reader Modal for Long Text Notes */}
      {selectedNote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
          <div className="flex max-h-[85vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-200 bg-slate-50 p-6">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#4c1864]">
                  {selectedNote.category}
                </span>
                <h3 className="mt-1 text-xl font-bold text-[#241333]">{selectedNote.title}</h3>
              </div>
              <button
                onClick={() => setSelectedNote(null)}
                className="rounded-lg bg-white p-1.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content / Long Paragraphs */}
            <div className="space-y-4 overflow-y-auto whitespace-pre-wrap p-6 text-sm leading-relaxed text-slate-700">
              {selectedNote.content}
            </div>

            {/* Modal Footer */}
            <div className="border-t border-slate-200 bg-slate-50 p-4 text-right">
              <button
                onClick={() => setSelectedNote(null)}
                className="rounded-xl bg-[#4c1864] px-5 py-2 text-xs font-semibold text-white transition hover:bg-[#38124b]"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}
    </section>
  );
}