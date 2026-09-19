'use client';

import { useState, useEffect } from 'react';
import { FileText, Download, BookOpen, Search, X, Calendar, Tag } from 'lucide-react';

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
    <section id="manuals" className="py-20 px-4 bg-slate-900/60 border-b border-slate-800/60">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-semibold border border-blue-500/20">
            <BookOpen className="w-4 h-4" /> Study Center
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mt-3">
            Manuals & Study Notes
          </h2>
          <p className="text-slate-400 text-sm mt-2">
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
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                    : 'bg-slate-800/80 text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content Grid */}
        {loading ? (
          <div className="text-center py-12 text-slate-500 text-sm animate-pulse">
            Loading manuals and study notes...
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-12 bg-slate-950/40 rounded-2xl border border-slate-800/60 text-slate-500 text-sm">
            No study resources or notes published yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="bg-slate-950/80 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-6 flex flex-col justify-between transition group shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2.5 py-0.5 rounded-md">
                      <Tag className="w-3 h-3" /> {item.category || 'General'}
                    </span>
                    <span className="text-[11px] text-slate-500 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(item.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  <h3 className="font-bold text-white text-lg group-hover:text-blue-400 transition leading-snug">
                    {item.title}
                  </h3>

                  {item.description && (
                    <p className="text-slate-400 text-xs mt-2 line-clamp-3 leading-relaxed">
                      {item.description}
                    </p>
                  )}
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800/60">
                  {item.type === 'pdf' ? (
                    <a
                      href={item.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md transition"
                    >
                      <Download className="w-4 h-4" /> Download / View PDF
                    </a>
                  ) : (
                    <button
                      onClick={() => setSelectedNote(item)}
                      className="inline-flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
                    >
                      <FileText className="w-4 h-4 text-blue-400" /> Read Full Note
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-800 flex items-start justify-between bg-slate-950/50">
              <div>
                <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
                  {selectedNote.category}
                </span>
                <h3 className="text-xl font-bold text-white mt-1">{selectedNote.title}</h3>
              </div>
              <button
                onClick={() => setSelectedNote(null)}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content / Long Paragraphs */}
            <div className="p-6 overflow-y-auto space-y-4 text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
              {selectedNote.content}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-800 bg-slate-950/50 text-right">
              <button
                onClick={() => setSelectedNote(null)}
                className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition"
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