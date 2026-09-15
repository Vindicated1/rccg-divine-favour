'use client';

import { useState, useEffect } from 'react';
import { Lock, Plus, Upload, LogOut, Heart, CheckCircle, Music, FileAudio } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

// Initialize client-side Supabase client for audio uploads
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('sermons');
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');

  // Sermon state
  const [sermonForm, setSermonForm] = useState({
    title: '', speaker: '', date_preached: new Date().toISOString().split('T')[0], audio_url: ''
  });
  const [audioFile, setAudioFile] = useState(null);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');

  // Prayer state
  const [prayers, setPrayers] = useState([]);
  const [loadingPrayers, setLoadingPrayers] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    if (res.ok) setIsAuthenticated(true);
    else setLoginError('Invalid credentials.');
  };

  const fetchPrayers = async () => {
    setLoadingPrayers(true);
    try {
      const res = await fetch('/api/prayers');
      if (res.ok) {
        const data = await res.json();
        setPrayers(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingPrayers(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && activeTab === 'prayers') {
      fetchPrayers();
    }
  }, [isAuthenticated, activeTab]);

  const updatePrayerStatus = async (id, status) => {
    await fetch('/api/prayers', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    });
    fetchPrayers();
  };

  // Upload MP3 directly to Supabase Storage
  const handleFileUpload = async (file) => {
    if (!file) return;
    setUploadingFile(true);
    setUploadStatus('Uploading MP3 to storage...');

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
      const filePath = `sermons/${fileName}`;

      const { data, error } = await supabase.storage
        .from('sermons-audio')
        .upload(filePath, file);

      if (error) throw error;

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from('sermons-audio')
        .getPublicUrl(filePath);

      setSermonForm((prev) => ({ ...prev, audio_url: publicUrlData.publicUrl }));
      setUploadStatus('Audio file uploaded successfully!');
    } catch (err) {
      console.error('File upload failed:', err);
      setUploadStatus('Failed to upload MP3 file. You can also paste an MP3 URL manually.');
    } finally {
      setUploadingFile(false);
    }
  };

  const handleAddSermon = async (e) => {
    e.preventDefault();
    if (!sermonForm.audio_url) {
      setUploadStatus('Please upload an MP3 file or provide an Audio URL first.');
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
        setSermonForm({ title: '', speaker: '', date_preached: new Date().toISOString().split('T')[0], audio_url: '' });
      } else {
        setUploadStatus(`Error: ${result.error || 'Failed to upload sermon'}`);
      }
    } catch (err) {
      setUploadStatus('Network error while saving sermon.');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#05070F] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-900 border border-amber-500/20 rounded-3xl p-8 shadow-2xl">
          <div className="flex items-center space-x-3 mb-6">
            <Lock className="w-6 h-6 text-amber-400" />
            <h2 className="text-xl font-bold text-white">Parish Admin Login</h2>
          </div>
          {loginError && <p className="text-rose-400 text-xs mb-4">{loginError}</p>}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Username</label>
              <input type="text" required className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-amber-500" value={credentials.username} onChange={(e) => setCredentials({ ...credentials, username: e.target.value })} />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Password</label>
              <input type="password" required className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-amber-500" value={credentials.password} onChange={(e) => setCredentials({ ...credentials, password: e.target.value })} />
            </div>
            <button type="submit" className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-slate-950 font-bold rounded-xl">Log In</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#05070F] text-slate-100 p-6 md:p-12">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex items-center justify-between border-b border-amber-500/20 pb-4">
          <div>
            <h2 className="text-2xl font-bold text-white">Admin Dashboard</h2>
            <p className="text-xs text-amber-400">RCCG Divine Favour Parish, Ajibode Ibadan</p>
          </div>
          <button onClick={() => setIsAuthenticated(false)} className="flex items-center gap-2 text-xs text-slate-400 hover:text-white bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex space-x-4 border-b border-slate-800">
          <button
            onClick={() => setActiveTab('sermons')}
            className={`pb-3 px-2 text-sm font-medium border-b-2 transition ${activeTab === 'sermons' ? 'border-amber-400 text-amber-400' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
          >
            Manage Sermons
          </button>
          <button
            onClick={() => setActiveTab('prayers')}
            className={`pb-3 px-2 text-sm font-medium border-b-2 transition ${activeTab === 'prayers' ? 'border-amber-400 text-amber-400' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
          >
            Prayer Requests
          </button>
        </div>

        {/* TAB 1: SERMONS */}
        {activeTab === 'sermons' && (
          <div className="bg-slate-900/80 border border-amber-500/20 rounded-3xl p-6 shadow-xl">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5 text-amber-400" /> Upload New Audio Sermon
            </h3>

            {uploadStatus && <p className="text-sm text-amber-400 mb-4 bg-amber-500/10 border border-amber-500/20 p-3 rounded-xl">{uploadStatus}</p>}

            <form onSubmit={handleAddSermon} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Sermon Title</label>
                  <input type="text" required placeholder="e.g. Walking in Divine Favour" className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white focus:border-amber-500 focus:outline-none" value={sermonForm.title} onChange={(e) => setSermonForm({ ...sermonForm, title: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Preacher / Minister</label>
                  <input type="text" required placeholder="e.g. Pastor In-Charge" className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white focus:border-amber-500 focus:outline-none" value={sermonForm.speaker} onChange={(e) => setSermonForm({ ...sermonForm, speaker: e.target.value })} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Date Preached</label>
                  <input type="date" required className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white focus:border-amber-500 focus:outline-none" value={sermonForm.date_preached} onChange={(e) => setSermonForm({ ...sermonForm, date_preached: e.target.value })} />
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1">Select MP3 File from Device</label>
                  <input
                    type="file"
                    accept="audio/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) handleFileUpload(file);
                    }}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-300 file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-amber-500 file:text-slate-950 hover:file:bg-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Audio URL (Auto-filled after upload or paste manually)</label>
                <input type="url" required placeholder="https://..." className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white focus:border-amber-500 focus:outline-none" value={sermonForm.audio_url} onChange={(e) => setSermonForm({ ...sermonForm, audio_url: e.target.value })} />
              </div>

              <button
                type="submit"
                disabled={uploadingFile}
                className="px-6 py-3 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-slate-950 font-bold rounded-xl flex items-center gap-2 transition disabled:opacity-50"
              >
                <Upload className="w-4 h-4" /> Publish Sermon
              </button>
            </form>
          </div>
        )}

        {/* TAB 2: PRAYERS */}
        {activeTab === 'prayers' && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Heart className="w-5 h-5 text-rose-500" /> Member Prayer Requests
            </h3>
            {loadingPrayers ? (
              <p className="text-slate-400 text-sm">Loading prayer requests...</p>
            ) : prayers.length === 0 ? (
              <p className="text-slate-400 text-sm bg-slate-900 border border-slate-800 p-6 rounded-2xl">No prayer requests received yet.</p>
            ) : (
              <div className="space-y-3">
                {prayers.map((req) => (
                  <div key={req.id} className="bg-slate-900/80 border border-amber-500/10 rounded-2xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-white">{req.full_name}</span>
                        <span className="text-xs text-slate-400">({req.contact})</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-semibold ${req.status === 'prayed' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                          {req.status}
                        </span>
                      </div>
                      <p className="text-slate-300 text-sm">{req.request_body}</p>
                      <span className="text-[11px] text-slate-500 block mt-2">{new Date(req.created_at).toLocaleString()}</span>
                    </div>

                    {req.status !== 'prayed' && (
                      <button
                        onClick={() => updatePrayerStatus(req.id, 'prayed')}
                        className="px-3 py-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 rounded-lg text-xs font-medium flex items-center gap-1 shrink-0"
                      >
                        <CheckCircle className="w-3.5 h-3.5" /> Mark as Prayed
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}