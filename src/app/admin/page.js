'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// Safe helper function to avoid build-time crashes if env vars are missing
const getSupabaseClient = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !url.startsWith('http')) return null;
  return createClient(url, key);
};

export default function AdminPage() {
  const [sermonForm, setSermonForm] = useState({
    title: '',
    speaker: '',
    date_preached: new Date().toISOString().split('T')[0],
    audio_url: '',
  });
  const [uploadStatus, setUploadStatus] = useState('');
  const [uploading, setUploading] = useState(false);

  // File Upload Handler using safe Supabase client
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const supabase = getSupabaseClient();
    if (!supabase) {
      setUploadStatus('Error: Supabase environment variables are missing.');
      return;
    }

    setUploading(true);
    setUploadStatus('Uploading audio file to storage...');

    try {
      const fileName = `${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
      const { data, error } = await supabase.storage
        .from('sermons-audio')
        .upload(fileName, file);

      if (error) throw error;

      const { data: publicUrlData } = supabase.storage
        .from('sermons-audio')
        .getPublicUrl(fileName);

      const publicUrl = publicUrlData.publicUrl;
      setSermonForm((prev) => ({ ...prev, audio_url: publicUrl }));
      setUploadStatus('Audio file uploaded successfully!');
    } catch (err) {
      console.error(err);
      setUploadStatus(`Upload failed: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleAddSermon = async (e) => {
    e.preventDefault();
    if (!sermonForm.audio_url) {
      setUploadStatus('Please upload an MP3 file or enter an Audio URL first.');
      return;
    }

    setUploadStatus('Publishing sermon...');
    try {
      const res = await fetch('/api/sermons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sermonForm),
      });

      const result = await res.json();

      if (res.ok) {
        setUploadStatus('Sermon published successfully!');
        setSermonForm({
          title: '',
          speaker: '',
          date_preached: new Date().toISOString().split('T')[0],
          audio_url: '',
        });
      } else {
        setUploadStatus(`Error: ${result.error || 'Failed to publish sermon'}`);
      }
    } catch (err) {
      setUploadStatus('Connection error while saving sermon.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-3xl mx-auto bg-slate-900 border border-slate-800 rounded-xl p-8 shadow-xl">
        <h1 className="text-2xl font-bold mb-6 text-amber-500">Admin Dashboard - Upload Sermon</h1>

        {uploadStatus && (
          <div className="mb-6 p-4 rounded bg-slate-800 border border-slate-700 text-amber-400">
            {uploadStatus}
          </div>
        )}

        <form onSubmit={handleAddSermon} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Sermon Title</label>
            <input
              type="text"
              required
              className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white"
              value={sermonForm.title}
              onChange={(e) => setSermonForm({ ...sermonForm, title: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Preacher / Minister</label>
            <input
              type="text"
              required
              className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white"
              value={sermonForm.speaker}
              onChange={(e) => setSermonForm({ ...sermonForm, speaker: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Date Preached</label>
            <input
              type="date"
              required
              className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white"
              value={sermonForm.date_preached}
              onChange={(e) => setSermonForm({ ...sermonForm, date_preached: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Select MP3 File</label>
            <input
              type="file"
              accept="audio/*"
              disabled={uploading}
              onChange={handleFileUpload}
              className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Audio URL</label>
            <input
              type="url"
              required
              placeholder="Auto-filled after file upload or paste manually"
              className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-slate-300"
              value={sermonForm.audio_url}
              onChange={(e) => setSermonForm({ ...sermonForm, audio_url: e.target.value })}
            />
          </div>

          <button
            type="submit"
            disabled={uploading}
            className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-3 rounded transition"
          >
            {uploading ? 'Uploading File...' : 'Publish Sermon'}
          </button>
        </form>
      </div>
    </div>
  );
}