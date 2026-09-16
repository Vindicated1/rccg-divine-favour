'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import {
  Lock,
  Plus,
  Upload,
  LogOut,
  Heart,
  CheckCircle,
  Clock,
  Trash2,
  BookOpen,
  FileAudio,
  ShieldCheck,
  RefreshCw,
  Search,
  Check
} from 'lucide-react';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');

  // Active Tab: 'sermons' or 'prayers'
  const [activeTab, setActiveTab] = useState('sermons');

  // Data State
  const [sermons, setSermons] = useState([]);
  const [prayers, setPrayers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [prayerFilter, setPrayerFilter] = useState('all');

  // Sermon Form State
  const [sermonForm, setSermonForm] = useState({
    title: '',
    speaker: '',
    date_preached: new Date().toISOString().split('T')[0],
    audio_url: '',
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  // Supabase Client for direct file storage upload
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  );

  // Fetch Data when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadDashboardData();
    }
  }, [isAuthenticated]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [sermonRes, prayerRes] = await Promise.all([
        fetch('/api/sermons'),
        fetch('/api/prayers'),
      ]);

      if (sermonRes.ok) {
        const sermonData = await sermonRes.json();
        if (Array.isArray(sermonData)) setSermons(sermonData);
      }

      if (prayerRes.ok) {
        const prayerData = await prayerRes.json();
        if (Array.isArray(prayerData)) setPrayers(prayerData);
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Login Handler
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      if (res.ok) {
        setIsAuthenticated(true);
      } else {
        setLoginError('Invalid username or password.');
      }
    } catch (err) {
      setLoginError('Authentication service unavailable.');
    }
  };

  // Sermon Add/Upload Handler
  const handleAddSermon = async (e) => {
    e.preventDefault();
    setIsUploading(true);
    setStatusMessage(null);

    let finalAudioUrl = sermonForm.audio_url;

    try {
      // Step A: Upload File to Supabase Storage if file is selected
      if (selectedFile) {
        const fileExt = selectedFile.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `sermons/${fileName}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('sermons-audio')
          .upload(filePath, selectedFile, { cacheControl: '3600', upsert: false });

        if (uploadError) {
          throw new Error(`Audio upload failed: ${uploadError.message}`);
        }

        const { data: publicUrlData } = supabase.storage
          .from('sermons-audio')
          .getPublicUrl(filePath);

        finalAudioUrl = publicUrlData.publicUrl;
      }

      if (!finalAudioUrl) {
        throw new Error('Please select an audio file to upload OR provide a direct MP3 URL.');
      }

      // Step B: Save Sermon details in Database
      const res = await fetch('/api/sermons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...sermonForm,
          audio_url: finalAudioUrl,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to save sermon details.');
      }

      setStatusMessage({ type: 'success', text: 'Sermon published successfully!' });
      setSermonForm({
        title: '',
        speaker: '',
        date_preached: new Date().toISOString().split('T')[0],
        audio_url: '',
      });
      setSelectedFile(null);
      loadDashboardData();
    } catch (err) {
      setStatusMessage({ type: 'error', text: err.message });
    } finally {
      setIsUploading(false);
    }
  };

  // Toggle Prayer Status (Pending <-> Prayed)
  const handleTogglePrayerStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'prayed' ? 'pending' : 'prayed';
    try {
      const res = await fetch('/api/prayers', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });

      if (res.ok) {
        setPrayers((prev) =>
          prev.map((p) => (p.id === id ? { ...p, status: newStatus } : p))
        );
      }
    } catch (err) {
      console.error('Failed to update prayer status:', err);
    }
  };

  // Filtered Prayers
  const filteredPrayers = prayers.filter((p) => {
    if (prayerFilter === 'pending') return p.status !== 'prayed';
    if (prayerFilter === 'prayed') return p.status === 'prayed';
    return true;
  });

  // Filtered Sermons
  const filteredSermons = sermons.filter(
    (s) =>
      s.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.speaker?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Render Login Form if Not Authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Church Admin Portal</h2>
              <p className="text-xs text-slate-400">RCCG Divine Favour Parish</p>
            </div>
          </div>

          {loginError && (
            <div className="p-3 mb-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-medium">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Username</label>
              <input
                type="text"
                required
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                value={credentials.username}
                onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
              <input
                type="password"
                required
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition shadow-lg shadow-blue-600/20"
            >
              Log In to Portal
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-16">
      {/* Admin Top Navigation */}
      <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold shadow-lg">
              DFP
            </div>
            <div>
              <h1 className="font-bold text-lg text-white">Admin Management Dashboard</h1>
              <p className="text-xs text-blue-400 font-medium">RCCG Divine Favour Parish</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={loadDashboardData}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={() => setIsAuthenticated(false)}
              className="px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-semibold flex items-center gap-2 transition"
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 pt-8 space-y-8">
        {/* Statistics Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-400 mb-1">Total Audio Sermons</p>
              <h3 className="text-3xl font-extrabold text-white">{sermons.length}</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <BookOpen className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-400 mb-1">Total Prayer Requests</p>
              <h3 className="text-3xl font-extrabold text-white">{prayers.length}</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center">
              <Heart className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-400 mb-1">Pending Intercessions</p>
              <h3 className="text-3xl font-extrabold text-amber-400">
                {prayers.filter((p) => p.status !== 'prayed').length}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Dashboard Section Tabs */}
        <div className="flex border-b border-slate-800 space-x-4">
          <button
            onClick={() => setActiveTab('sermons')}
            className={`pb-3 px-4 text-sm font-semibold flex items-center gap-2 border-b-2 transition ${
              activeTab === 'sermons'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileAudio className="w-4 h-4" /> Audio Sermons Management
          </button>
          <button
            onClick={() => setActiveTab('prayers')}
            className={`pb-3 px-4 text-sm font-semibold flex items-center gap-2 border-b-2 transition ${
              activeTab === 'prayers'
                ? 'border-rose-500 text-rose-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Heart className="w-4 h-4" /> Prayer Requests & Intercession
          </button>
        </div>

        {/* TAB 1: SERMONS MANAGEMENT */}
        {activeTab === 'sermons' && (
          <div className="space-y-8">
            {/* Upload Sermon Form */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
              <div className="flex items-center space-x-3 mb-6">
                <Plus className="w-5 h-5 text-blue-400" />
                <h3 className="text-lg font-bold text-white">Publish New Audio Sermon</h3>
              </div>

              {statusMessage && (
                <div
                  className={`p-4 rounded-xl text-xs font-medium mb-6 ${
                    statusMessage.type === 'success'
                      ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                      : 'bg-rose-500/10 border border-rose-500/30 text-rose-400'
                  }`}
                >
                  {statusMessage.text}
                </div>
              )}

              <form onSubmit={handleAddSermon} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Sermon Title</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Walking in Divine Grace"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                      value={sermonForm.title}
                      onChange={(e) => setSermonForm({ ...sermonForm, title: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Preacher / Minister</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Pastor In-Charge"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                      value={sermonForm.speaker}
                      onChange={(e) => setSermonForm({ ...sermonForm, speaker: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Date Preached</label>
                    <input
                      type="date"
                      required
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white"
                      value={sermonForm.date_preached}
                      onChange={(e) => setSermonForm({ ...sermonForm, date_preached: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Option A: Upload MP3 Audio File
                    </label>
                    <input
                      type="file"
                      accept="audio/*"
                      onChange={(e) => setSelectedFile(e.target.files[0] || null)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-xs text-slate-300 file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Option B: Or Direct MP3 URL (If hosted externally)
                  </label>
                  <input
                    type="url"
                    placeholder="https://example.com/audio/sermon.mp3"
                    disabled={!!selectedFile}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 disabled:opacity-40"
                    value={sermonForm.audio_url}
                    onChange={(e) => setSermonForm({ ...sermonForm, audio_url: e.target.value })}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isUploading}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl flex items-center justify-center space-x-2 transition disabled:opacity-50"
                >
                  <Upload className="w-4 h-4" />
                  <span>{isUploading ? 'Uploading & Publishing...' : 'Publish Audio Sermon'}</span>
                </button>
              </form>
            </div>

            {/* Sermons Library List */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <h3 className="text-lg font-bold text-white">Published Sermons Library</h3>
                <div className="relative w-full md:w-64">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search sermons..."
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              {filteredSermons.length === 0 ? (
                <p className="text-slate-400 text-sm py-4">No sermons found in database.</p>
              ) : (
                <div className="space-y-4">
                  {filteredSermons.map((sermon) => (
                    <div
                      key={sermon.id}
                      className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <h4 className="font-semibold text-white text-md">{sermon.title}</h4>
                        <p className="text-xs text-slate-400">
                          Preacher: <span className="text-slate-200">{sermon.speaker}</span> | Date:{' '}
                          <span className="text-slate-200">{new Date(sermon.date_preached).toLocaleDateString()}</span>
                        </p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <audio controls className="h-8 max-w-xs rounded-lg">
                          <source src={sermon.audio_url} type="audio/mpeg" />
                        </audio>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: PRAYER REQUESTS INTERCESSION */}
        {activeTab === 'prayers' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-lg font-bold text-white">Prayer Requests Hub</h3>
                <p className="text-xs text-slate-400">Intercede for members and update prayer status.</p>
              </div>

              {/* Filter Buttons */}
              <div className="flex bg-slate-800 p-1 rounded-xl border border-slate-700 text-xs font-semibold">
                <button
                  onClick={() => setPrayerFilter('all')}
                  className={`px-3 py-1.5 rounded-lg transition ${
                    prayerFilter === 'all' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  All ({prayers.length})
                </button>
                <button
                  onClick={() => setPrayerFilter('pending')}
                  className={`px-3 py-1.5 rounded-lg transition ${
                    prayerFilter === 'pending' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Pending ({prayers.filter((p) => p.status !== 'prayed').length})
                </button>
                <button
                  onClick={() => setPrayerFilter('prayed')}
                  className={`px-3 py-1.5 rounded-lg transition ${
                    prayerFilter === 'prayed' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Prayed Over ({prayers.filter((p) => p.status === 'prayed').length})
                </button>
              </div>
            </div>

            {filteredPrayers.length === 0 ? (
              <p className="text-slate-400 text-sm py-8 text-center">No prayer requests in this category.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredPrayers.map((prayer) => (
                  <div
                    key={prayer.id}
                    className={`border rounded-2xl p-5 flex flex-col justify-between space-y-4 transition ${
                      prayer.status === 'prayed'
                        ? 'bg-slate-900/40 border-slate-800/80'
                        : 'bg-slate-800/50 border-amber-500/30 shadow-lg'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-bold text-white text-md">{prayer.full_name}</h4>
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            prayer.status === 'prayed'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                              : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                          }`}
                        >
                          {prayer.status === 'prayed' ? 'Prayed Over' : 'Pending Prayer'}
                        </span>
                      </div>
                      <p className="text-xs text-blue-400 font-medium mb-3">Contact: {prayer.contact}</p>
                      <p className="text-sm text-slate-300 leading-relaxed bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                        "{prayer.request_body}"
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs text-slate-400">
                      <span>Submitted: {new Date(prayer.created_at).toLocaleDateString()}</span>
                      <button
                        onClick={() => handleTogglePrayerStatus(prayer.id, prayer.status)}
                        className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition ${
                          prayer.status === 'prayed'
                            ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                            : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                        }`}
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>{prayer.status === 'prayed' ? 'Mark Pending' : 'Mark as Prayed'}</span>
                      </button>
                    </div>
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