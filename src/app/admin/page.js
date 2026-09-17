'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import {
  Lock,
  Plus,
  Upload,
  LogOut,
  Heart,
  Clock,
  BookOpen,
  FileAudio,
  RefreshCw,
  Search,
  Check,
  Megaphone,
  Trash2,
  Image as ImageIcon
} from 'lucide-react';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');

  // Active Tab: 'announcements', 'sermons', 'prayers'
  const [activeTab, setActiveTab] = useState('announcements');

  // Data State
  const [sermons, setSermons] = useState([]);
  const [prayers, setPrayers] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
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
  const [selectedAudioFile, setSelectedAudioFile] = useState(null);
  const [isUploadingSermon, setIsUploadingSermon] = useState(false);

  // Announcement Form State
  const [announcementForm, setAnnouncementForm] = useState({
    title: '',
    description: '',
    event_date: new Date().toISOString().split('T')[0],
    image_url: '',
  });
  const [selectedFlierFile, setSelectedFlierFile] = useState(null);
  const [isUploadingAnnouncement, setIsUploadingAnnouncement] = useState(false);

  const [statusMessage, setStatusMessage] = useState(null);

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  );

  useEffect(() => {
    if (isAuthenticated) {
      loadDashboardData();
    }
  }, [isAuthenticated]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [sermonRes, prayerRes, annRes] = await Promise.all([
        fetch('/api/sermons'),
        fetch('/api/prayers'),
        fetch('/api/announcements'),
      ]);

      if (sermonRes.ok) setSermons(await sermonRes.json() || []);
      if (prayerRes.ok) setPrayers(await prayerRes.json() || []);
      if (annRes.ok) setAnnouncements(await annRes.json() || []);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

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
      setLoginError('Authentication service error.');
    }
  };

  // Add Announcement
  const handleAddAnnouncement = async (e) => {
    e.preventDefault();
    setIsUploadingAnnouncement(true);
    setStatusMessage(null);

    let finalImageUrl = announcementForm.image_url;

    try {
      // Flier upload
      if (selectedFlierFile) {
        const fileExt = selectedFlierFile.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `flier_${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('announcement-fliers')
          .upload(filePath, selectedFlierFile);

        if (uploadError) throw new Error(`Flier image upload failed: ${uploadError.message}`);

        const { data: publicUrlData } = supabase.storage
          .from('announcement-fliers')
          .getPublicUrl(filePath);

        finalImageUrl = publicUrlData.publicUrl;
      }

      const res = await fetch('/api/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...announcementForm, image_url: finalImageUrl }),
      });

      if (!res.ok) throw new Error('Failed to save announcement.');

      setStatusMessage({ type: 'success', text: 'Announcement published successfully!' });
      setAnnouncementForm({
        title: '',
        description: '',
        event_date: new Date().toISOString().split('T')[0],
        image_url: '',
      });
      setSelectedFlierFile(null);
      loadDashboardData();
    } catch (err) {
      setStatusMessage({ type: 'error', text: err.message });
    } finally {
      setIsUploadingAnnouncement(false);
    }
  };

  // Delete Announcement
  const handleDeleteAnnouncement = async (id) => {
    if (!confirm('Are you sure you want to delete this announcement?')) return;
    try {
      const res = await fetch(`/api/announcements?id=${id}`, { method: 'DELETE' });
      if (res.ok) loadDashboardData();
    } catch (err) {
      console.error('Failed to delete announcement:', err);
    }
  };

  // Add Sermon
  const handleAddSermon = async (e) => {
    e.preventDefault();
    setIsUploadingSermon(true);
    setStatusMessage(null);

    let finalAudioUrl = sermonForm.audio_url;

    try {
      if (selectedAudioFile) {
        const fileExt = selectedAudioFile.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `sermons/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('sermons-audio')
          .upload(filePath, selectedAudioFile);

        if (uploadError) throw new Error(`Audio file upload failed: ${uploadError.message}`);

        const { data: publicUrlData } = supabase.storage
          .from('sermons-audio')
          .getPublicUrl(filePath);

        finalAudioUrl = publicUrlData.publicUrl;
      }

      if (!finalAudioUrl) throw new Error('Provide an MP3 audio file or link.');

      const res = await fetch('/api/sermons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...sermonForm, audio_url: finalAudioUrl }),
      });

      if (!res.ok) throw new Error('Failed to publish sermon.');

      setStatusMessage({ type: 'success', text: 'Sermon published successfully!' });
      setSermonForm({
        title: '',
        speaker: '',
        date_preached: new Date().toISOString().split('T')[0],
        audio_url: '',
      });
      setSelectedAudioFile(null);
      loadDashboardData();
    } catch (err) {
      setStatusMessage({ type: 'error', text: err.message });
    } finally {
      setIsUploadingSermon(false);
    }
  };

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
      <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold shadow-lg">
              DFP
            </div>
            <div>
              <h1 className="font-bold text-lg text-white">Admin Dashboard</h1>
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
              <p className="text-xs font-medium text-slate-400 mb-1">Announcements & Fliers</p>
              <h3 className="text-3xl font-extrabold text-white">{announcements.length}</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <Megaphone className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-400 mb-1">Audio Sermons</p>
              <h3 className="text-3xl font-extrabold text-white">{sermons.length}</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <BookOpen className="w-6 h-6" />
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

        {/* Dashboard Tabs */}
        <div className="flex border-b border-slate-800 space-x-4">
          <button
            onClick={() => setActiveTab('announcements')}
            className={`pb-3 px-4 text-sm font-semibold flex items-center gap-2 border-b-2 transition ${
              activeTab === 'announcements'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Megaphone className="w-4 h-4" /> Announcements & Fliers
          </button>
          <button
            onClick={() => setActiveTab('sermons')}
            className={`pb-3 px-4 text-sm font-semibold flex items-center gap-2 border-b-2 transition ${
              activeTab === 'sermons'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileAudio className="w-4 h-4" /> Audio Sermons
          </button>
          <button
            onClick={() => setActiveTab('prayers')}
            className={`pb-3 px-4 text-sm font-semibold flex items-center gap-2 border-b-2 transition ${
              activeTab === 'prayers'
                ? 'border-rose-500 text-rose-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Heart className="w-4 h-4" /> Prayer Requests
          </button>
        </div>

        {/* TAB 1: ANNOUNCEMENTS MANAGEMENT */}
        {activeTab === 'announcements' && (
          <div className="space-y-8">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
              <div className="flex items-center space-x-3 mb-6">
                <Plus className="w-5 h-5 text-blue-400" />
                <h3 className="text-lg font-bold text-white">Publish New Announcement or Event Flier</h3>
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

              <form onSubmit={handleAddAnnouncement} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Announcement / Event Title</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Annual Holy Ghost Service"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                      value={announcementForm.title}
                      onChange={(e) => setAnnouncementForm({ ...announcementForm, title: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Event Date</label>
                    <input
                      type="date"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white"
                      value={announcementForm.event_date}
                      onChange={(e) => setAnnouncementForm({ ...announcementForm, event_date: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Description / Event Details</label>
                  <textarea
                    rows={3}
                    placeholder="Details about the event, time, venue, speaker, etc."
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    value={announcementForm.description}
                    onChange={(e) => setAnnouncementForm({ ...announcementForm, description: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Upload Event Flier (Image / Banner)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setSelectedFlierFile(e.target.files[0] || null)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-xs text-slate-300 file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isUploadingAnnouncement}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl flex items-center justify-center space-x-2 transition disabled:opacity-50"
                >
                  <Upload className="w-4 h-4" />
                  <span>{isUploadingAnnouncement ? 'Publishing Announcement...' : 'Publish Announcement'}</span>
                </button>
              </form>
            </div>

            {/* List of Announcements */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
              <h3 className="text-lg font-bold text-white mb-6">Published Announcements</h3>
              {announcements.length === 0 ? (
                <p className="text-slate-400 text-sm">No announcements published yet.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {announcements.map((item) => (
                    <div key={item.id} className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4 flex gap-4 justify-between">
                      <div className="space-y-1">
                        <h4 className="font-bold text-white">{item.title}</h4>
                        {item.event_date && (
                          <p className="text-xs text-blue-400 font-medium">
                            Date: {new Date(item.event_date).toLocaleDateString()}
                          </p>
                        )}
                        {item.description && (
                          <p className="text-xs text-slate-300 line-clamp-2">{item.description}</p>
                        )}
                      </div>
                      <button
                        onClick={() => handleDeleteAnnouncement(item.id)}
                        className="p-2 text-rose-400 hover:bg-rose-500/10 rounded-lg transition self-start"
                        title="Delete Announcement"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: SERMONS MANAGEMENT */}
        {activeTab === 'sermons' && (
          <div className="space-y-8">
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
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Upload MP3 Audio File</label>
                    <input
                      type="file"
                      accept="audio/*"
                      onChange={(e) => setSelectedAudioFile(e.target.files[0] || null)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-xs text-slate-300 file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isUploadingSermon}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl flex items-center justify-center space-x-2 transition disabled:opacity-50"
                >
                  <Upload className="w-4 h-4" />
                  <span>{isUploadingSermon ? 'Uploading...' : 'Publish Audio Sermon'}</span>
                </button>
              </form>
            </div>

            {/* Sermons Library */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
              <h3 className="text-lg font-bold text-white mb-6">Published Sermons</h3>
              <div className="space-y-4">
                {sermons.map((sermon) => (
                  <div key={sermon.id} className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4 flex justify-between items-center">
                    <div>
                      <h4 className="font-semibold text-white">{sermon.title}</h4>
                      <p className="text-xs text-slate-400">Preacher: {sermon.speaker}</p>
                    </div>
                    <audio controls className="h-8 max-w-xs">
                      <source src={sermon.audio_url} type="audio/mpeg" />
                    </audio>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: PRAYER REQUESTS */}
        {activeTab === 'prayers' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
            <h3 className="text-lg font-bold text-white mb-6">Prayer Requests</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {prayers.map((prayer) => (
                <div key={prayer.id} className="bg-slate-800/50 border border-slate-700 rounded-2xl p-5 space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold text-white">{prayer.full_name}</h4>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${prayer.status === 'prayed' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                      {prayer.status === 'prayed' ? 'Prayed Over' : 'Pending'}
                    </span>
                  </div>
                  <p className="text-xs text-blue-400">Contact: {prayer.contact}</p>
                  <p className="text-sm text-slate-300">"{prayer.request_body}"</p>
                  <button
                    onClick={() => handleTogglePrayerStatus(prayer.id, prayer.status)}
                    className="px-3 py-1 bg-slate-700 hover:bg-slate-600 rounded-lg text-xs font-semibold text-slate-200"
                  >
                    Toggle Status
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}