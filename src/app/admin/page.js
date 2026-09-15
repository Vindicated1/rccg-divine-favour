'use client';

import { useState } from 'react';
import { Lock, Plus, Upload, LogOut } from 'lucide-react';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');

  // Sermon Upload Form State
  const [sermonForm, setSermonForm] = useState({
    title: '',
    speaker: '',
    date_preached: new Date().toISOString().split('T')[0],
    audio_url: '',
  });
  const [uploadStatus, setUploadStatus] = useState('');

  // Handle Admin Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });

    if (res.ok) {
      setIsAuthenticated(true);
    } else {
      setLoginError('Invalid admin credentials.');
    }
  };

  // Handle Sermon Creation
  const handleAddSermon = async (e) => {
    e.preventDefault();
    setUploadStatus('Publishing sermon...');

    const res = await fetch('/api/sermons', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sermonForm),
    });

    if (res.ok) {
      setUploadStatus('Sermon published successfully!');
      setSermonForm({ title: '', speaker: '', date_preached: '', audio_url: '' });
    } else {
      setUploadStatus('Failed to publish sermon. Ensure audio URL is valid.');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-xl">
          <div className="flex items-center space-x-3 mb-6">
            <Lock className="w-6 h-6 text-blue-500" />
            <h2 className="text-xl font-bold text-white">Admin Login</h2>
          </div>

          {loginError && <p className="text-rose-400 text-xs mb-4">{loginError}</p>}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Username</label>
              <input
                type="text"
                required
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white"
                value={credentials.username}
                onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Password</label>
              <input
                type="password"
                required
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white"
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              />
            </div>
            <button type="submit" className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-xl">
              Log In
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <h2 className="text-2xl font-bold">Admin Dashboard</h2>
          <button onClick={() => setIsAuthenticated(false)} className="flex items-center gap-2 text-xs text-slate-400 hover:text-white">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>

        {/* Upload Sermon Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Plus className="w-5 h-5 text-blue-400" /> Upload New Audio Sermon
          </h3>

          {uploadStatus && <p className="text-sm text-blue-400 mb-4">{uploadStatus}</p>}

          <form onSubmit={handleAddSermon} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Sermon Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Walking in Grace"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white"
                  value={sermonForm.title}
                  onChange={(e) => setSermonForm({ ...sermonForm, title: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Preacher / Minister</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Pastor In-Charge"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white"
                  value={sermonForm.speaker}
                  onChange={(e) => setSermonForm({ ...sermonForm, speaker: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Date Preached</label>
                <input
                  type="date"
                  required
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white"
                  value={sermonForm.date_preached}
                  onChange={(e) => setSermonForm({ ...sermonForm, date_preached: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Audio Direct URL (MP3 Link)</label>
                <input
                  type="url"
                  required
                  placeholder="https://..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white"
                  value={sermonForm.audio_url}
                  onChange={(e) => setSermonForm({ ...sermonForm, audio_url: e.target.value })}
                />
              </div>
            </div>

            <button type="submit" className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-xl flex items-center gap-2">
              <Upload className="w-4 h-4" /> Publish Sermon
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}