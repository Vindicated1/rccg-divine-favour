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
  Image as ImageIcon,
  Pencil
} from 'lucide-react';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');

  // Active Tab: 'announcements', 'sermons', 'prayers', 'testimonies'
  const [activeTab, setActiveTab] = useState('announcements');

  // Data State
  const [sermons, setSermons] = useState([]);
  const [prayers, setPrayers] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [testimonies, setTestimonies] = useState([]);
  const [manuals, setManuals] = useState([]);
  const [testimonyError, setTestimonyError] = useState('');
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
  const [editingSermonId, setEditingSermonId] = useState(null);

  // Announcement Form State
  const [announcementForm, setAnnouncementForm] = useState({
    title: '',
    description: '',
    event_date: new Date().toISOString().split('T')[0],
    image_url: '',
  });
  const [selectedFlierFile, setSelectedFlierFile] = useState(null);
  const [isUploadingAnnouncement, setIsUploadingAnnouncement] = useState(false);
  const [editingAnnouncementId, setEditingAnnouncementId] = useState(null);
  const [editingPrayerId, setEditingPrayerId] = useState(null);
  const [prayerForm, setPrayerForm] = useState({ full_name: '', contact: '', request_body: '' });
  const [editingTestimonyId, setEditingTestimonyId] = useState(null);
  const [testimonyForm, setTestimonyForm] = useState({ name: '', testimony: '' });

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
      const [sermonRes, prayerRes, annRes, testimonyRes, manualsRes] = await Promise.all([
        fetch('/api/sermons'),
        fetch('/api/prayers'),
        fetch('/api/announcements'),
        fetch('/api/testimonies'),
        fetch('/api/manuals'),
      ]);

      if (sermonRes.ok) setSermons(await sermonRes.json() || []);
      if (prayerRes.ok) setPrayers(await prayerRes.json() || []);
      if (annRes.ok) setAnnouncements(await annRes.json() || []);
      if (manualsRes.ok) setManuals(await manualsRes.json() || []);
      if (testimonyRes.ok) {
        setTestimonies(await testimonyRes.json() || []);
        setTestimonyError('');
      } else {
        const result = await testimonyRes.json();
        setTestimonyError(result.error || 'Failed to load testimonies.');
      }
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
        method: editingAnnouncementId ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...announcementForm,
          image_url: finalImageUrl,
          ...(editingAnnouncementId ? { id: editingAnnouncementId } : {}),
        }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Failed to save announcement.');

      setStatusMessage({
        type: 'success',
        text: editingAnnouncementId ? 'Announcement updated successfully!' : 'Announcement published successfully!',
      });
      setEditingAnnouncementId(null);
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

  const startEditingAnnouncement = (item) => {
    setEditingAnnouncementId(item.id);
    setAnnouncementForm({
      title: item.title || '',
      description: item.description || '',
      event_date: item.event_date ? item.event_date.split('T')[0] : '',
      image_url: item.image_url || '',
    });
    setSelectedFlierFile(null);
    setStatusMessage(null);
  };

  const cancelEditingAnnouncement = () => {
    setEditingAnnouncementId(null);
    setAnnouncementForm({
      title: '',
      description: '',
      event_date: new Date().toISOString().split('T')[0],
      image_url: '',
    });
    setSelectedFlierFile(null);
    setStatusMessage(null);
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
        method: editingSermonId ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...sermonForm,
          audio_url: finalAudioUrl,
          ...(editingSermonId ? { id: editingSermonId } : {}),
        }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Failed to publish sermon.');

      setStatusMessage({
        type: 'success',
        text: editingSermonId ? 'Sermon updated successfully!' : 'Sermon published successfully!',
      });
      setEditingSermonId(null);
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

  const startEditingSermon = (sermon) => {
    setEditingSermonId(sermon.id);
    setSermonForm({
      title: sermon.title || '',
      speaker: sermon.speaker || '',
      date_preached: sermon.date_preached ? sermon.date_preached.split('T')[0] : '',
      audio_url: sermon.audio_url || '',
    });
    setSelectedAudioFile(null);
    setStatusMessage(null);
  };

  const cancelEditingSermon = () => {
    setEditingSermonId(null);
    setSermonForm({
      title: '',
      speaker: '',
      date_preached: new Date().toISOString().split('T')[0],
      audio_url: '',
    });
    setSelectedAudioFile(null);
    setStatusMessage(null);
  };

  const savePrayer = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/prayers', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editingPrayerId, ...prayerForm }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Failed to update prayer request.');

      setPrayers((previous) =>
        previous.map((item) => (item.id === editingPrayerId ? { ...item, ...prayerForm } : item))
      );
      setEditingPrayerId(null);
    } catch (error) {
      setStatusMessage({ type: 'error', text: error.message || 'Failed to update prayer request.' });
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

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Failed to update prayer status.');

      setPrayers((prev) =>
        prev.map((p) => (p.id === id ? { ...p, status: newStatus } : p))
      );
    } catch (err) {
      setStatusMessage({ type: 'error', text: err.message || 'Failed to update prayer status.' });
    }
  };

  const handleUpdateTestimony = async (id, approved) => {
    try {
      const response = await fetch('/api/testimonies', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, approved }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Failed to update testimony.');

      setTestimonies((previous) =>
        previous.map((item) => (item.id === id ? { ...item, approved } : item))
      );
    } catch (error) {
      setTestimonyError(error.message || 'Failed to update testimony.');
    }
  };

  const saveTestimony = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/testimonies', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editingTestimonyId, ...testimonyForm }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Failed to update testimony.');

      setTestimonies((previous) =>
        previous.map((item) =>
          item.id === editingTestimonyId
            ? { ...item, name: testimonyForm.name.trim() || null, testimony: testimonyForm.testimony.trim() }
            : item
        )
      );
      setEditingTestimonyId(null);
      setTestimonyError('');
    } catch (error) {
      setTestimonyError(error.message || 'Failed to update testimony.');
    }
  };

  const handleDeleteTestimony = async (id) => {
    if (!confirm('Are you sure you want to delete this testimony?')) return;

    try {
      const response = await fetch(`/api/testimonies?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Failed to delete testimony.');

      setTestimonies((previous) => previous.filter((item) => item.id !== id));
      setTestimonyError('');
    } catch (error) {
      setTestimonyError(error.message || 'Failed to delete testimony.');
    }
  };

  // Add state for Manuals & Notes form
  const [manualType, setManualType] = useState('pdf'); // 'pdf' or 'text'
  const [manualTitle, setManualTitle] = useState('');
  const [manualCategory, setManualCategory] = useState('Sunday School');
  const [manualDescription, setManualDescription] = useState('');
  const [manualContent, setManualContent] = useState('');
  const [manualFile, setManualFile] = useState(null);
  const [uploadingManual, setUploadingManual] = useState(false);
  const [editingManualId, setEditingManualId] = useState(null);
  const [manualFileUrl, setManualFileUrl] = useState('');

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    setUploadingManual(true);

    try {
      let uploadedFileUrl = manualFileUrl;

      // If PDF, upload to Supabase storage bucket 'documents'
      if (manualType === 'pdf' && manualFile) {
        const fileExt = manualFile.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;

        const { data: uploadData, error: uploadErr } = await supabase.storage
          .from('documents')
          .upload(fileName, manualFile);

        if (uploadErr) throw uploadErr;

        const { data: publicUrlData } = supabase.storage
          .from('documents')
          .getPublicUrl(fileName);

        uploadedFileUrl = publicUrlData.publicUrl;
      }

      // Save metadata to database
      const res = await fetch('/api/manuals', {
        method: editingManualId ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...(editingManualId ? { id: editingManualId } : {}),
          title: manualTitle,
          category: manualCategory,
          type: manualType,
          description: manualDescription,
          content: manualType === 'text' ? manualContent : '',
          file_url: uploadedFileUrl
        })
      });

      const result = await res.json();
      if (res.ok) {
        setStatusMessage({
          type: 'success',
          text: editingManualId ? 'Manual or study note updated successfully!' : 'Published successfully!',
        });
        setEditingManualId(null);
        setManualTitle('');
        setManualDescription('');
        setManualContent('');
        setManualFile(null);
        setManualFileUrl('');
        await loadDashboardData();
      } else {
        throw new Error(result.error || 'Error saving document.');
      }
    } catch (err) {
      setStatusMessage({ type: 'error', text: err.message || 'Failed to submit' });
    } finally {
      setUploadingManual(false);
    }
  };

  const startEditingManual = (item) => {
    setEditingManualId(item.id);
    setManualType(item.type);
    setManualTitle(item.title || '');
    setManualCategory(item.category || 'Sunday School');
    setManualDescription(item.description || '');
    setManualContent(item.content || '');
    setManualFileUrl(item.file_url || '');
    setManualFile(null);
    setStatusMessage(null);
  };

  const cancelEditingManual = () => {
    setEditingManualId(null);
    setManualTitle('');
    setManualDescription('');
    setManualContent('');
    setManualFile(null);
    setManualFileUrl('');
    setManualType('pdf');
    setStatusMessage(null);
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
              <h3 className="text-3xl font-extrabold text-violet-300">
                {prayers.filter((p) => p.status !== 'prayed').length}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-violet-500/10 text-violet-300 flex items-center justify-center">
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
          <button
            onClick={() => setActiveTab('testimonies')}
            className={`pb-3 px-4 text-sm font-semibold flex items-center gap-2 border-b-2 transition ${
              activeTab === 'testimonies'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Heart className="w-4 h-4" /> Testimonies
          </button>
        </div>

        {/* TAB 1: ANNOUNCEMENTS MANAGEMENT */}
        {activeTab === 'announcements' && (
          <div className="space-y-8">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
              <div className="flex items-center space-x-3 mb-6">
                {editingAnnouncementId ? <Pencil className="w-5 h-5 text-blue-400" /> : <Plus className="w-5 h-5 text-blue-400" />}
                <h3 className="text-lg font-bold text-white">
                  {editingAnnouncementId ? 'Edit Announcement or Event Flier' : 'Publish New Announcement or Event Flier'}
                </h3>
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
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {editingAnnouncementId ? 'Replace Event Flier (optional)' : 'Upload Event Flier (Image / Banner)'}
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setSelectedFlierFile(e.target.files[0] || null)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-xs text-slate-300 file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-500"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={isUploadingAnnouncement}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl flex items-center justify-center space-x-2 transition disabled:opacity-50"
                  >
                    {editingAnnouncementId ? <Check className="w-4 h-4" /> : <Upload className="w-4 h-4" />}
                    <span>
                      {isUploadingAnnouncement
                        ? (editingAnnouncementId ? 'Saving...' : 'Publishing Announcement...')
                        : (editingAnnouncementId ? 'Save Changes' : 'Publish Announcement')}
                    </span>
                  </button>
                  {editingAnnouncementId && (
                    <button type="button" onClick={cancelEditingAnnouncement} className="px-4 py-3 text-slate-300 hover:bg-slate-800 rounded-xl">
                      Cancel
                    </button>
                  )}
                </div>
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
                      <div className="flex gap-1 self-start">
                        <button
                          onClick={() => startEditingAnnouncement(item)}
                          className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg transition"
                          title="Edit Announcement"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteAnnouncement(item.id)}
                          className="p-2 text-rose-400 hover:bg-rose-500/10 rounded-lg transition"
                          title="Delete Announcement"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
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
                {editingSermonId ? <Pencil className="w-5 h-5 text-blue-400" /> : <Plus className="w-5 h-5 text-blue-400" />}
                <h3 className="text-lg font-bold text-white">
                  {editingSermonId ? 'Edit Audio Sermon' : 'Publish New Audio Sermon'}
                </h3>
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
                      {editingSermonId ? 'Replace MP3 Audio File (optional)' : 'Upload MP3 Audio File'}
                    </label>
                    <input
                      type="file"
                      accept="audio/*"
                      onChange={(e) => setSelectedAudioFile(e.target.files[0] || null)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-xs text-slate-300 file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-500"
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={isUploadingSermon}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl flex items-center justify-center space-x-2 transition disabled:opacity-50"
                  >
                    {editingSermonId ? <Check className="w-4 h-4" /> : <Upload className="w-4 h-4" />}
                    <span>
                      {isUploadingSermon
                        ? 'Saving...'
                        : (editingSermonId ? 'Save Changes' : 'Publish Audio Sermon')}
                    </span>
                  </button>
                  {editingSermonId && (
                    <button type="button" onClick={cancelEditingSermon} className="px-4 py-3 text-slate-300 hover:bg-slate-800 rounded-xl">
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Sermons Library */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
              <h3 className="text-lg font-bold text-white mb-6">Published Sermons</h3>
              <div className="space-y-4">
                {sermons.map((sermon) => (
                  <div key={sermon.id} className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4 flex flex-wrap gap-3 justify-between items-center">
                    <div>
                      <h4 className="font-semibold text-white">{sermon.title}</h4>
                      <p className="text-xs text-slate-400">Preacher: {sermon.speaker}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <audio controls className="h-8 max-w-xs">
                        <source src={sermon.audio_url} type="audio/mpeg" />
                      </audio>
                      <button
                        onClick={() => startEditingSermon(sermon)}
                        className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg transition"
                        title="Edit Sermon"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                    </div>
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
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${prayer.status === 'prayed' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-violet-500/10 text-violet-300'}`}>
                      {prayer.status === 'prayed' ? 'Prayed Over' : 'Pending'}
                    </span>
                  </div>
                  {editingPrayerId === prayer.id ? (
                    <form onSubmit={savePrayer} className="space-y-3">
                      <input
                        required
                        value={prayerForm.full_name}
                        onChange={(e) => setPrayerForm({ ...prayerForm, full_name: e.target.value })}
                        placeholder="Name"
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white"
                      />
                      <input
                        required
                        value={prayerForm.contact}
                        onChange={(e) => setPrayerForm({ ...prayerForm, contact: e.target.value })}
                        placeholder="Contact"
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white"
                      />
                      <textarea
                        required
                        rows={3}
                        value={prayerForm.request_body}
                        onChange={(e) => setPrayerForm({ ...prayerForm, request_body: e.target.value })}
                        placeholder="Prayer request"
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white"
                      />
                      <div className="flex gap-2">
                        <button type="submit" className="px-3 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-xs font-semibold text-white">Save Changes</button>
                        <button type="button" onClick={() => setEditingPrayerId(null)} className="px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-xs font-semibold text-slate-200">Cancel</button>
                      </div>
                    </form>
                  ) : (
                    <>
                      <p className="text-xs text-blue-400">Contact: {prayer.contact}</p>
                      <p className="text-sm text-slate-300">"{prayer.request_body}"</p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleTogglePrayerStatus(prayer.id, prayer.status)}
                          className="px-3 py-1 bg-slate-700 hover:bg-slate-600 rounded-lg text-xs font-semibold text-slate-200"
                        >
                          Toggle Status
                        </button>
                        <button
                          onClick={() => {
                            setEditingPrayerId(prayer.id);
                            setPrayerForm({
                              full_name: prayer.full_name || '',
                              contact: prayer.contact || '',
                              request_body: prayer.request_body || '',
                            });
                          }}
                          className="px-3 py-1 bg-blue-500/10 hover:bg-blue-500/20 rounded-lg text-xs font-semibold text-blue-300"
                        >
                          Edit Request
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        {activeTab === 'testimonies' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-white">Testimony Submissions</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Review submissions before they appear on the public website.
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-violet-500/10 text-violet-300 text-xs font-semibold">
                {testimonies.filter((item) => !item.approved).length} pending
              </span>
            </div>

            {testimonyError && (
              <div className="p-4 mb-5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm">
                {testimonyError}
              </div>
            )}

            {testimonies.length === 0 ? (
              <p className="text-sm text-slate-400">No testimony submissions yet.</p>
            ) : (
              <div className="space-y-4">
                {testimonies.map((item) => (
                  <article key={item.id} className="bg-slate-800/50 border border-slate-700 rounded-2xl p-5">
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                      <div>
                        <h4 className="font-semibold text-white">{item.name || 'Anonymous'}</h4>
                        <p className="text-xs text-slate-500">
                          {new Date(item.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        item.approved
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : 'bg-violet-500/10 text-violet-300'
                      }`}>
                        {item.approved ? 'Published' : 'Pending review'}
                      </span>
                    </div>
                    {editingTestimonyId === item.id ? (
                      <form onSubmit={saveTestimony} className="space-y-3">
                        <input
                          value={testimonyForm.name}
                          onChange={(e) => setTestimonyForm({ ...testimonyForm, name: e.target.value })}
                          placeholder="Name (optional)"
                          maxLength={100}
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white"
                        />
                        <textarea
                          required
                          minLength={10}
                          maxLength={5000}
                          rows={5}
                          value={testimonyForm.testimony}
                          onChange={(e) => setTestimonyForm({ ...testimonyForm, testimony: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white"
                        />
                        <div className="flex gap-2">
                          <button type="submit" className="px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold">Save Changes</button>
                          <button type="button" onClick={() => setEditingTestimonyId(null)} className="px-3 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-semibold">Cancel</button>
                        </div>
                      </form>
                    ) : (
                      <p className="text-sm text-slate-300 whitespace-pre-wrap leading-relaxed">{item.testimony}</p>
                    )}
                    <div className="flex gap-2 mt-4">
                      {editingTestimonyId !== item.id && (
                        <button
                          onClick={() => {
                            setEditingTestimonyId(item.id);
                            setTestimonyForm({ name: item.name || '', testimony: item.testimony || '' });
                          }}
                          className="px-3 py-2 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 text-xs font-semibold transition"
                        >
                          Edit
                        </button>
                      )}
                      <button
                        onClick={() => handleUpdateTestimony(item.id, !item.approved)}
                        className="px-3 py-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-semibold transition"
                      >
                        {item.approved ? 'Unpublish' : 'Approve & Publish'}
                      </button>
                      <button
                        onClick={() => handleDeleteTestimony(item.id)}
                        className="px-3 py-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-semibold transition"
                      >
                        Delete
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        )}
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center gap-2">
            {editingManualId ? <Pencil className="w-5 h-5 text-blue-400" /> : <Plus className="w-5 h-5 text-blue-400" />}
            <h3 className="text-lg font-bold text-white">
              {editingManualId ? 'Edit Manual or Study Note' : 'Publish Manual or Study Note'}
            </h3>
          </div>

          {statusMessage && (
            <div className={`p-4 rounded-xl text-xs font-medium ${
              statusMessage.type === 'success'
                ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                : 'bg-rose-500/10 border border-rose-500/30 text-rose-400'
            }`}>
              {statusMessage.text}
            </div>
          )}

          <form onSubmit={handleManualSubmit} className="space-y-4">
            {/* Type Selection */}
            <div className="flex gap-4 bg-slate-950 p-2 rounded-xl border border-slate-800 text-xs">
              <label className="flex items-center gap-2 text-white cursor-pointer">
                <input
                  type="radio"
                  name="type"
                  checked={manualType === 'pdf'}
                  onChange={() => {
                    setManualType('pdf');
                    if (editingManualId && manualType !== 'pdf') setManualFileUrl('');
                  }}
                />
                PDF Document Upload
              </label>
              <label className="flex items-center gap-2 text-white cursor-pointer">
                <input
                  type="radio"
                  name="type"
                  checked={manualType === 'text'}
                  onChange={() => {
                    setManualType('text');
                    if (editingManualId && manualType !== 'text') setManualFileUrl('');
                  }}
                />
                Long Paragraph / Study Note
              </label>
            </div>

            {/* Title & Category */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Title (e.g., Workers Manual 2026)"
                value={manualTitle}
                onChange={(e) => setManualTitle(e.target.value)}
                required
                className="bg-slate-950 border border-slate-800 text-white rounded-xl px-4 py-2 text-xs"
              />
              <select
                value={manualCategory}
                onChange={(e) => setManualCategory(e.target.value)}
                className="bg-slate-950 border border-slate-800 text-white rounded-xl px-4 py-2 text-xs"
              >
                <option value="Sunday School">Sunday School</option>
                <option value="Believers Class">Believers Class</option>
                <option value="Workers Training">Workers Training</option>
                <option value="Pastor Note">Pastor's Weekly Note</option>
                <option value="Bible Study Outlines">Bible Study Outlines</option>
              </select>
            </div>

            {/* Description */}
            <input
              type="text"
              placeholder="Short Summary / Description"
              value={manualDescription}
              onChange={(e) => setManualDescription(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-4 py-2 text-xs"
            />

            {/* PDF Upload File Picker */}
            {manualType === 'pdf' ? (
              <div>
                <label className="text-xs text-slate-400 block mb-1">Select PDF File:</label>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => setManualFile(e.target.files[0])}
                  required={manualType === 'pdf' && !manualFileUrl}
                  className="text-xs text-slate-300"
                />
              </div>
            ) : (
              /* Long Paragraph Text Area */
              <div>
                <label className="text-xs text-slate-400 block mb-1">Full Note Content / Paragraphs:</label>
                <textarea
                  rows={8}
                  placeholder="Paste or write full paragraphs here..."
                  value={manualContent}
                  onChange={(e) => setManualContent(e.target.value)}
                  required
                  className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl p-4 text-xs font-mono"
                ></textarea>
              </div>
            )}

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={uploadingManual}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-600/30 transition"
              >
                {uploadingManual ? 'Saving...' : (editingManualId ? 'Save Changes' : 'Publish Item')}
              </button>
              {editingManualId && (
                <button type="button" onClick={cancelEditingManual} className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-200 text-xs font-semibold">
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-lg font-bold text-white">Published Manuals & Study Notes</h3>
          {manuals.length === 0 ? (
            <p className="text-sm text-slate-400">No manuals or study notes published yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {manuals.map((item) => (
                <div key={item.id} className="flex items-center justify-between gap-3 bg-slate-800/60 border border-slate-700/60 rounded-xl p-4">
                  <div>
                    <h4 className="text-sm font-semibold text-white">{item.title}</h4>
                    <p className="text-xs text-slate-400">{item.category || 'General'} · {item.type === 'pdf' ? 'PDF' : 'Study note'}</p>
                  </div>
                  <button
                    onClick={() => startEditingManual(item)}
                    className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg transition"
                    title="Edit Manual or Study Note"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}