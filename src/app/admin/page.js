'use client';

import { useState, useEffect } from 'react';
import { Lock, Plus, Upload, LogOut, Heart, CheckCircle, Clock } from 'lucide-react';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('sermons'); // 'sermons' | 'prayers'
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');

  // Sermons state
  const [sermonForm, setSermonForm] = useState({
    title: '', speaker: '', date_preached: new Date().toISOString().split('T')[0], audio_url: ''
  });
  const [uploadStatus, setUploadStatus] = useState('');

  // Prayer requests state
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

  const handleAddSermon = async (e) => {
    e.preventDefault();
    setUploadStatus('Publishing...');
    const res = await fetch('/api/sermons', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sermonForm),
    });
    if (res.ok) {
      setUploadStatus('Sermon published successfully!');
      setSermonForm({ title: '', speaker: '', date_preached: '', audio_url: '' });
    } else {
      setUploadStatus('Error uploading sermon.');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-xl">
          <div className="flex items-center space-x-3 mb-6">
            <Lock className="w-6 h-6 text-blue-500" />
            <h2 className="text-xl font-bold text-white">Parish Admin Portal</h2>
          </div>
          {loginError && <p className="text-rose-400 text-xs mb-4">{loginError}</p>}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Username</label>
              <input type="text" required className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white" value={credentials.username} onChange={(e) => setCredentials({ ...credentials, username: e.target.value })} />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Password</label>
              <input type="password" required className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white" value={credentials.password} onChange={(e) => setCredentials({ ...credentials, password: e.target.value })} />
            </div>
            <button type="submit" className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-xl">Log In</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-12">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-2xl font-bold">Admin Portal</h2>
            <p className="text-xs text-slate-400">RCCG Divine Favour Parish</p>
          </div>
          <button onClick={() => setIsAuthenticated(false)} className="flex items-center gap-2 text-xs text-slate-400 hover:text-white">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-4 border-b border-slate-800">
          <button
            onClick={() => setActiveTab('sermons')}
            className={`pb-3 px-2 text-sm font-medium border-b-2 transition ${activeTab === 'sermons' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
          >
            Manage Sermons
          </button>
          <button
            onClick={() => setActiveTab('prayers')}
            className={`pb-3 px-2 text-sm font-medium border-b-2 transition ${activeTab === 'prayers' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
          >
            Prayer Requests
          </button>
        </div>

        {/* TAB 1: SERMONS */}
        {activeTab === 'sermons' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5 text-blue-400" /> Upload New Audio Sermon
            </h3>
            {uploadStatus && <p className="text-sm text-blue-400 mb-4">{uploadStatus}</p>}
            <form onSubmit={handleAddSermon} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Title</label>
                  <input type="text" required placeholder="e.g. Divine Favor Unlocked" className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white" value={sermonForm.title} onChange={(e) => setSermonForm({ ...sermonForm, title: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Speaker</label>
                  <input type="text" required placeholder="e.g. Pastor In-Charge" className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white" value={sermonForm.speaker} onChange={(e) => setSermonForm({ ...sermonForm, speaker: e.target.value })} />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Date Preached</label>
                  <input type="date" required className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white" value={sermonForm.date_preached} onChange={(e) => setSermonForm({ ...sermonForm, date_preached: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Audio Direct MP3 URL</label>
                  <input type="url" required placeholder="https://..." className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white" value={sermonForm.audio_url} onChange={(e) => setSermonForm({ ...sermonForm, audio_url: e.target.value })} />
                </div>
              </div>
              <button type="submit" className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-xl flex items-center gap-2">
                <Upload className="w-4 h-4" /> Publish Sermon
              </button>
            </form>
          </div>
        )}

        {/* TAB 2: PRAYER REQUESTS */}
        {activeTab === 'prayers' && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Heart className="w-5 h-5 text-rose-500" /> Member Prayer Requests
            </h3>
            {loadingPrayers ? (
              <p className="text-slate-400 text-sm">Loading prayer requests...</p>
            ) : prayers.length === 0 ? (
              <p className="text-slate-400 text-sm">No prayer requests received yet.</p>
            ) : (
              <div className="space-y-3">
                {prayers.map((req) => (
                  <div key={req.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
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