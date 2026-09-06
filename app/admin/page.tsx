'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Shield, 
  Lock, 
  Unlock, 
  Save, 
  Plus, 
  Trash2, 
  Edit3, 
  ArrowLeft, 
  Check, 
  AlertCircle, 
  ExternalLink, 
  Upload, 
  RefreshCw, 
  Download, 
  FileJson,
  Layers,
  Share2,
  User,
  Sparkles,
  X
} from 'lucide-react';
import { usePortfolio } from '@/context/PortfolioContext';
import { Project, SocialLink, Skill, PortfolioData } from '@/types/portfolio';
import { SocialIcon, AVAILABLE_SOCIAL_ICONS } from '@/components/SocialIcon';

const ADMIN_PIN = 'sonugg2025';

export default function AdminPage() {
  const { 
    data, 
    saveData, 
    isSaving, 
    resetToDefaults, 
    refreshData 
  } = usePortfolio();

  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [pinInput, setPinInput] = useState<string>('');
  const [pinError, setPinError] = useState<string>('');

  // Active Tab
  const [activeTab, setActiveTab] = useState<'profile' | 'projects' | 'socials' | 'skills' | 'backup'>('profile');

  // Working copy of data for editing
  const [formData, setFormData] = useState<PortfolioData>(data);
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Modals
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isAddingProject, setIsAddingProject] = useState<boolean>(false);
  const [editingSocial, setEditingSocial] = useState<SocialLink | null>(null);
  const [isAddingSocial, setIsAddingSocial] = useState<boolean>(false);
  const [newSkillName, setNewSkillName] = useState<string>('');
  const [newSkillCategory, setNewSkillCategory] = useState<string>('Web3');
  const [newSkillDesc, setNewSkillDesc] = useState<string>('');

  // Project Form State
  const [projectForm, setProjectForm] = useState<Partial<Project>>({
    title: '',
    description: '',
    image: '',
    category: 'Web3 & dApps',
    technologies: [],
    demoUrl: '',
    githubUrl: '',
    status: 'Live on Mainnet',
    featured: true,
  });
  const [techInput, setTechInput] = useState<string>('');

  // Social Form State
  const [socialForm, setSocialForm] = useState<Partial<SocialLink>>({
    platform: '',
    handle: '',
    url: '',
    icon: 'Twitter',
    description: '',
    featured: true,
  });

  // Check saved session auth
  useEffect(() => {
    const sessionAuth = sessionStorage.getItem('sonugg_admin_authed');
    if (sessionAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  // Sync formData when data changes from context
  useEffect(() => {
    setFormData(data);
  }, [data]);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ type, text });
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === ADMIN_PIN) {
      setIsAuthenticated(true);
      sessionStorage.setItem('sonugg_admin_authed', 'true');
      setPinError('');
    } else {
      setPinError('Invalid PIN code. Default PIN is sonugg2025');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('sonugg_admin_authed');
  };

  // Persist all changes
  const handleSaveAll = async () => {
    const res = await saveData(formData);
    if (res.success) {
      showToast('All changes saved to disk & cache! Page refresh will keep your data intact.', 'success');
    } else {
      showToast(res.message || 'Failed to save changes.', 'error');
    }
  };

  // Image upload handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, targetField: 'avatar' | 'projectImage') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const uploadFormData = new FormData();
    uploadFormData.append('file', file);

    try {
      showToast('Uploading image...', 'success');
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData,
      });
      const result = await res.json();

      if (result.success && result.url) {
        if (targetField === 'avatar') {
          setFormData({
            ...formData,
            profile: { ...formData.profile, avatar: result.url },
          });
        } else if (targetField === 'projectImage') {
          setProjectForm((prev) => ({ ...prev, image: result.url }));
        }
        showToast('Image uploaded successfully!', 'success');
      } else {
        showToast(result.error || 'Upload failed', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Upload error occurred', 'error');
    }
  };

  // Project Handlers
  const handleOpenAddProject = () => {
    setProjectForm({
      title: '',
      description: '',
      image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=1200&auto=format&fit=crop',
      category: 'Web3 & dApps',
      technologies: ['Solidity', 'Next.js', 'Viem'],
      demoUrl: '',
      githubUrl: '',
      status: 'Live on Mainnet',
      featured: true,
    });
    setTechInput('Solidity, Next.js, Viem');
    setIsAddingProject(true);
    setEditingProject(null);
  };

  const handleOpenEditProject = (p: Project) => {
    setEditingProject(p);
    setProjectForm({ ...p });
    setTechInput(p.technologies.join(', '));
    setIsAddingProject(false);
  };

  const handleSaveProjectModal = async () => {
    if (!projectForm.title || !projectForm.description) {
      showToast('Title and description are required', 'error');
      return;
    }

    const techArray = techInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    let updatedProjects: Project[];

    if (editingProject) {
      updatedProjects = formData.projects.map((p) =>
        p.id === editingProject.id
          ? ({ ...p, ...projectForm, technologies: techArray } as Project)
          : p
      );
    } else {
      const newProj: Project = {
        id: `proj-${Date.now()}`,
        title: projectForm.title || 'Untitled Project',
        description: projectForm.description || '',
        image: projectForm.image || '',
        category: projectForm.category || 'Web3 & dApps',
        technologies: techArray.length ? techArray : ['Web3'],
        demoUrl: projectForm.demoUrl || '',
        githubUrl: projectForm.githubUrl || '',
        status: projectForm.status || 'Live',
        featured: !!projectForm.featured,
      };
      updatedProjects = [newProj, ...formData.projects];
    }

    const updatedData: PortfolioData = { ...formData, projects: updatedProjects };
    setFormData(updatedData);
    setEditingProject(null);
    setIsAddingProject(false);

    // Save permanently immediately!
    const res = await saveData(updatedData);
    if (res.success) {
      showToast('Project saved successfully! Data will not delete on refresh.', 'success');
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    const updatedProjects = formData.projects.filter((p) => p.id !== id);
    const updatedData: PortfolioData = { ...formData, projects: updatedProjects };
    setFormData(updatedData);
    const res = await saveData(updatedData);
    if (res.success) {
      showToast('Project deleted and changes saved to disk!', 'success');
    }
  };

  // Socials Handlers (CRITICAL: User explicitly asked to add their own socials)
  const handleOpenAddSocial = () => {
    setSocialForm({
      platform: '',
      handle: '',
      url: '',
      icon: 'Twitter',
      description: '',
      featured: true,
    });
    setIsAddingSocial(true);
    setEditingSocial(null);
  };

  const handleOpenEditSocial = (s: SocialLink) => {
    setEditingSocial(s);
    setSocialForm({ ...s });
    setIsAddingSocial(false);
  };

  const handleSaveSocialModal = async () => {
    if (!socialForm.platform || !socialForm.url) {
      showToast('Platform name and URL are required', 'error');
      return;
    }

    let updatedSocials: SocialLink[];

    if (editingSocial) {
      updatedSocials = formData.socials.map((s) =>
        s.id === editingSocial.id
          ? ({ ...s, ...socialForm } as SocialLink)
          : s
      );
    } else {
      const newSoc: SocialLink = {
        id: `social-${Date.now()}`,
        platform: socialForm.platform || 'Social',
        handle: socialForm.handle || '@sonugg',
        url: socialForm.url || 'https://x.com/Sonugg_7',
        icon: socialForm.icon || 'Twitter',
        description: socialForm.description || '',
        featured: socialForm.featured !== undefined ? socialForm.featured : true,
      };
      updatedSocials = [...formData.socials, newSoc];
    }

    const updatedData: PortfolioData = { ...formData, socials: updatedSocials };
    setFormData(updatedData);
    setEditingSocial(null);
    setIsAddingSocial(false);

    // Save permanently immediately!
    const res = await saveData(updatedData);
    if (res.success) {
      showToast('Social account saved! Visible immediately on website and preserved on refresh.', 'success');
    }
  };

  const handleDeleteSocial = async (id: string) => {
    if (!confirm('Are you sure you want to delete this social link?')) return;
    const updatedSocials = formData.socials.filter((s) => s.id !== id);
    const updatedData: PortfolioData = { ...formData, socials: updatedSocials };
    setFormData(updatedData);
    const res = await saveData(updatedData);
    if (res.success) {
      showToast('Social link deleted and updated on disk!', 'success');
    }
  };

  // Skill Handlers
  const handleAddSkill = async () => {
    if (!newSkillName.trim()) return;
    const newSkill: Skill = {
      id: `skill-${Date.now()}`,
      name: newSkillName.trim(),
      category: newSkillCategory,
      description: newSkillDesc.trim() || 'Active Web3 expertise',
    };
    const updatedSkills = [...formData.skills, newSkill];
    const updatedData = { ...formData, skills: updatedSkills };
    setFormData(updatedData);
    setNewSkillName('');
    setNewSkillDesc('');
    const res = await saveData(updatedData);
    if (res.success) {
      showToast('Skill added and saved permanently!', 'success');
    }
  };

  const handleDeleteSkill = async (id: string) => {
    const updatedSkills = formData.skills.filter((s) => s.id !== id);
    const updatedData = { ...formData, skills: updatedSkills };
    setFormData(updatedData);
    const res = await saveData(updatedData);
    if (res.success) {
      showToast('Skill removed and updated on disk!', 'success');
    }
  };

  // Backup & Restore
  const handleExportJSON = () => {
    const blob = new Blob([JSON.stringify(formData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sonugg-portfolio-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Backup JSON downloaded to your computer!', 'success');
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.profile && Array.isArray(parsed.projects)) {
          setFormData(parsed);
          await saveData(parsed);
          showToast('Backup restored successfully!', 'success');
        } else {
          showToast('Invalid backup file format', 'error');
        }
      } catch (err) {
        showToast('Failed to parse JSON file', 'error');
      }
    };
    reader.readAsText(file);
  };

  const handleReset = async () => {
    if (!confirm('Are you sure you want to reset all data to default initial values?')) return;
    await resetToDefaults();
    showToast('Portfolio reset to initial default data.', 'success');
  };

  // ----------------------------------------------------
  // LOGIN SCREEN
  // ----------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#07050b] flex items-center justify-center p-4 relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute w-[500px] h-[500px] bg-pink-600/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-md w-full glass-panel p-8 sm:p-10 rounded-3xl border border-pink-500/25 relative shadow-[0_0_50px_rgba(236,72,153,0.2)]">
          <div className="text-center space-y-3 mb-8">
            <div className="w-16 h-16 rounded-2xl bg-pink-950/50 border border-pink-500/40 flex items-center justify-center mx-auto text-pink-400 mb-4 shadow-lg shadow-pink-500/20">
              <Lock size={28} />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Sonugg Admin Panel
            </h1>
            <p className="text-sm text-zinc-400">
              Enter your access PIN to manage projects, social links, and website content.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
                Security PIN
              </label>
              <input
                type="password"
                required
                placeholder="Enter PIN (Default: sonugg2025)"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                className="w-full px-4 py-3.5 rounded-xl bg-zinc-950 border border-zinc-800 focus:border-pink-500 text-center tracking-widest text-lg text-white placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-pink-500 transition-all font-mono"
              />
              {pinError && (
                <p className="text-xs text-rose-400 mt-2 font-mono flex items-center gap-1">
                  <AlertCircle size={13} />
                  <span>{pinError}</span>
                </p>
              )}
            </div>

            <div className="p-3 rounded-xl bg-pink-950/30 border border-pink-500/20 text-xs text-pink-300 font-mono">
              💡 <strong>Default PIN:</strong> <code className="text-white font-bold bg-black/40 px-1 py-0.5 rounded">sonugg2025</code>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 shadow-lg shadow-pink-500/30 transition-all active:scale-98 flex items-center justify-center gap-2"
            >
              <Unlock size={16} />
              <span>Unlock Admin Panel</span>
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/"
              className="text-xs text-zinc-500 hover:text-pink-400 font-mono flex items-center justify-center gap-1 transition-colors"
            >
              <ArrowLeft size={13} />
              <span>Return to Portfolio</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // MAIN ADMIN DASHBOARD
  // ----------------------------------------------------
  return (
    <div className="min-h-screen bg-[#07050b] text-[#f4f4f5] flex flex-col font-sans">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`fixed top-5 right-5 z-50 px-5 py-3 rounded-xl border backdrop-blur-xl shadow-2xl flex items-center gap-2 text-sm font-medium transition-all ${
            toastMessage.type === 'success'
              ? 'bg-emerald-950/90 text-emerald-200 border-emerald-500/40 shadow-emerald-500/20'
              : 'bg-rose-950/90 text-rose-200 border-rose-500/40 shadow-rose-500/20'
          }`}
        >
          {toastMessage.type === 'success' ? <Check size={16} className="text-emerald-400" /> : <AlertCircle size={16} />}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Admin Header */}
      <header className="border-b border-pink-500/20 bg-[#0c0915]/90 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center shadow-md shadow-pink-500/30">
              <Shield size={20} className="text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-white">Sonugg Control Center</h1>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                  Disk Sync Active
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Persistent Portfolio Content & Socials Manager
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-pink-500/30 text-xs font-medium text-zinc-300 hover:text-white flex items-center gap-1.5 transition-all"
            >
              <span>View Website</span>
              <ExternalLink size={13} />
            </Link>

            <button
              onClick={handleSaveAll}
              disabled={isSaving}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-xs font-semibold text-white shadow-lg shadow-pink-500/25 flex items-center gap-1.5 transition-all active:scale-95 disabled:opacity-50"
            >
              <Save size={14} />
              <span>{isSaving ? 'Saving to Disk...' : 'Save All Changes'}</span>
            </button>

            <button
              onClick={handleLogout}
              className="p-2 rounded-xl text-zinc-400 hover:text-rose-400 hover:bg-zinc-900 border border-zinc-800 transition-all text-xs"
              title="Lock Admin Panel"
            >
              <Lock size={15} />
            </button>
          </div>

        </div>

        {/* Tab Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex gap-2 overflow-x-auto pt-2 pb-3 scrollbar-none border-t border-zinc-900">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 whitespace-nowrap transition-all ${
              activeTab === 'profile'
                ? 'bg-pink-500 text-white shadow-md shadow-pink-500/30'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
            }`}
          >
            <User size={14} />
            <span>Profile & Hero</span>
          </button>

          <button
            onClick={() => setActiveTab('projects')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 whitespace-nowrap transition-all ${
              activeTab === 'projects'
                ? 'bg-pink-500 text-white shadow-md shadow-pink-500/30'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
            }`}
          >
            <Layers size={14} />
            <span>Projects ({formData.projects.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('socials')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 whitespace-nowrap transition-all ${
              activeTab === 'socials'
                ? 'bg-pink-500 text-white shadow-md shadow-pink-500/30'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
            }`}
          >
            <Share2 size={14} />
            <span>Socials ({formData.socials.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('skills')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 whitespace-nowrap transition-all ${
              activeTab === 'skills'
                ? 'bg-pink-500 text-white shadow-md shadow-pink-500/30'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
            }`}
          >
            <Sparkles size={14} />
            <span>Skills ({formData.skills.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('backup')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 whitespace-nowrap transition-all ${
              activeTab === 'backup'
                ? 'bg-pink-500 text-white shadow-md shadow-pink-500/30'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
            }`}
          >
            <FileJson size={14} />
            <span>Backup & Sync</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        
        {/* Persistence Assurance Banner */}
        <div className="mb-6 p-4 rounded-2xl bg-pink-950/20 border border-pink-500/30 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-pink-500/20 flex items-center justify-center text-pink-400">
              <Check size={18} />
            </div>
            <div>
              <div className="text-xs font-bold text-pink-200">
                Guaranteed Persistence Active
              </div>
              <div className="text-[11px] text-zinc-400">
                Jab aap admin panel me koe bhi change karke save karenge, to vo seedha server disk (<code className="text-pink-300">data/portfolio.json</code>) aur browser storage me save ho jata hai. Website refresh karne par aapka data kabhi delete nahi hoga!
              </div>
            </div>
          </div>
          <button
            onClick={handleSaveAll}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-pink-500 text-white text-xs font-semibold whitespace-nowrap hover:bg-pink-600 transition-colors"
          >
            <Save size={13} />
            <span>Save Now</span>
          </button>
        </div>

        {/* ---------------------------------------------------- */}
        {/* TAB 1: PROFILE & HERO */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'profile' && (
          <div className="space-y-8">
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-pink-500/15 space-y-6">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                <div>
                  <h2 className="text-xl font-bold text-white">Hero & Profile Details</h2>
                  <p className="text-xs text-zinc-400">Update your public name, headline, avatar, and bio.</p>
                </div>
                <button
                  onClick={handleSaveAll}
                  className="px-4 py-2 rounded-xl bg-pink-500 hover:bg-pink-600 text-xs font-semibold text-white flex items-center gap-1.5"
                >
                  <Save size={13} />
                  <span>Save Profile</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-400 mb-2">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={formData.profile.name}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        profile: { ...formData.profile, name: e.target.value },
                      })
                    }
                    className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 focus:border-pink-500 text-sm text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-400 mb-2">
                    Headline
                  </label>
                  <input
                    type="text"
                    value={formData.profile.headline}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        profile: { ...formData.profile, headline: e.target.value },
                      })
                    }
                    className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 focus:border-pink-500 text-sm text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-400 mb-2">
                    Status Pill Badge
                  </label>
                  <input
                    type="text"
                    value={formData.profile.status}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        profile: { ...formData.profile, status: e.target.value },
                      })
                    }
                    className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 focus:border-pink-500 text-sm text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-400 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.profile.email}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        profile: { ...formData.profile, email: e.target.value },
                      })
                    }
                    className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 focus:border-pink-500 text-sm text-white focus:outline-none"
                  />
                </div>

                {/* Avatar section with file upload */}
                <div className="md:col-span-2 p-5 rounded-2xl bg-zinc-950/80 border border-zinc-800/80 space-y-4">
                  <label className="block text-xs font-mono uppercase text-zinc-400">
                    Profile Avatar / Image
                  </label>
                  <div className="flex flex-col sm:flex-row items-center gap-5">
                    <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-pink-500/40 bg-black relative flex-shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={formData.profile.avatar || '/images/sonugg-avatar.png'}
                        alt="Avatar preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 space-y-2 w-full">
                      <input
                        type="text"
                        value={formData.profile.avatar}
                        placeholder="/images/sonugg-avatar.png or https://..."
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            profile: { ...formData.profile, avatar: e.target.value },
                          })
                        }
                        className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-200 focus:border-pink-500 focus:outline-none"
                      />
                      <div className="flex items-center gap-3">
                        <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-pink-500/10 hover:bg-pink-500/20 text-pink-400 border border-pink-500/30 text-xs font-medium transition-all">
                          <Upload size={13} />
                          <span>Upload New Avatar</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleFileUpload(e, 'avatar')}
                          />
                        </label>
                        <span className="text-[11px] text-zinc-500">Supported: PNG, JPG, WEBP</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-mono uppercase text-zinc-400 mb-2">
                    Hero Short Intro
                  </label>
                  <textarea
                    rows={2}
                    value={formData.profile.shortBio}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        profile: { ...formData.profile, shortBio: e.target.value },
                      })
                    }
                    className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 focus:border-pink-500 text-sm text-white focus:outline-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-mono uppercase text-zinc-400 mb-2">
                    About Me Narrative (Main Bio)
                  </label>
                  <textarea
                    rows={4}
                    value={formData.profile.about}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        profile: { ...formData.profile, about: e.target.value },
                      })
                    }
                    className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 focus:border-pink-500 text-sm text-white focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* TAB 2: PROJECTS MANAGER */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'projects' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-white">Manage Projects Showcase</h2>
                <p className="text-xs text-zinc-400">Add, edit, or remove your Web3 projects and repositories.</p>
              </div>
              <button
                onClick={handleOpenAddProject}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 text-xs font-semibold text-white shadow-md shadow-pink-500/25 flex items-center gap-1.5"
              >
                <Plus size={15} />
                <span>Add New Project</span>
              </button>
            </div>

            {/* Project List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {formData.projects.map((project) => (
                <div
                  key={project.id}
                  className="glass-panel p-5 rounded-2xl border border-pink-500/15 flex flex-col justify-between space-y-4 group"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-black relative flex-shrink-0 border border-zinc-800">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={project.image || 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=600&auto=format&fit=crop'}
                        alt={project.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-pink-950/60 text-pink-300 border border-pink-500/30">
                          {project.status}
                        </span>
                        <span className="text-[10px] text-zinc-400">
                          {project.category}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-white truncate">
                        {project.title}
                      </h3>
                      <p className="text-xs text-zinc-400 line-clamp-2 mt-1">
                        {project.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {project.technologies.map((tech, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded text-[10px] font-mono bg-zinc-900 text-zinc-400 border border-zinc-800"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {project.demoUrl && (
                        <a
                          href={project.demoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] text-pink-400 hover:underline flex items-center gap-1"
                        >
                          <span>Demo</span>
                          <ExternalLink size={10} />
                        </a>
                      )}
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] text-zinc-400 hover:text-white flex items-center gap-1"
                        >
                          <span>GitHub</span>
                          <ExternalLink size={10} />
                        </a>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenEditProject(project)}
                        className="p-1.5 rounded-lg bg-zinc-900 hover:bg-pink-500/20 text-zinc-300 hover:text-pink-300 border border-zinc-800 transition-colors"
                        title="Edit Project"
                      >
                        <Edit3 size={14} />
                      </button>
                      <button
                        onClick={() => handleDeleteProject(project.id)}
                        className="p-1.5 rounded-lg bg-zinc-900 hover:bg-rose-500/20 text-zinc-300 hover:text-rose-400 border border-zinc-800 transition-colors"
                        title="Delete Project"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {formData.projects.length === 0 && (
              <div className="text-center py-12 p-6 rounded-2xl glass-panel text-zinc-400 text-sm">
                No projects yet. Click &quot;Add New Project&quot; above to create one.
              </div>
            )}
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* TAB 3: SOCIALS MANAGER (Requested: Add & Manage Socials) */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'socials' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-white">Social Accounts & Channels</h2>
                <p className="text-xs text-zinc-400">
                  Add extra social media platforms (X, GitHub, LinkedIn, Telegram, Discord, YouTube, Warpcast, etc.)
                </p>
              </div>
              <button
                onClick={handleOpenAddSocial}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 text-xs font-semibold text-white shadow-md shadow-pink-500/25 flex items-center gap-1.5"
              >
                <Plus size={15} />
                <span>Add Social Account</span>
              </button>
            </div>

            {/* Social Links Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {formData.socials.map((social) => (
                <div
                  key={social.id}
                  className="glass-panel p-5 rounded-2xl border border-pink-500/15 flex flex-col justify-between space-y-4"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-[#130f1e] border border-pink-500/30 flex items-center justify-center text-pink-400">
                        <SocialIcon iconName={social.icon || social.platform} size={20} />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-white">
                          {social.platform}
                        </h3>
                        <div className="text-xs font-mono text-pink-400">
                          {social.handle}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEditSocial(social)}
                        className="p-1.5 rounded-lg bg-zinc-900 hover:bg-pink-500/20 text-zinc-300 hover:text-pink-300 border border-zinc-800 transition-colors"
                        title="Edit Social"
                      >
                        <Edit3 size={13} />
                      </button>
                      <button
                        onClick={() => handleDeleteSocial(social.id)}
                        className="p-1.5 rounded-lg bg-zinc-900 hover:bg-rose-500/20 text-zinc-300 hover:text-rose-400 border border-zinc-800 transition-colors"
                        title="Delete Social"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-zinc-400 line-clamp-2">
                    {social.description || 'No description provided.'}
                  </p>

                  <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between">
                    <a
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-zinc-300 hover:text-pink-300 truncate max-w-[200px] flex items-center gap-1 font-mono"
                    >
                      <span className="truncate">{social.url}</span>
                      <ExternalLink size={11} className="flex-shrink-0" />
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {formData.socials.length === 0 && (
              <div className="text-center py-12 p-6 rounded-2xl glass-panel text-zinc-400 text-sm">
                No socials added yet. Click &quot;Add Social Account&quot; to add one.
              </div>
            )}
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* TAB 4: SKILLS & INTERESTS */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'skills' && (
          <div className="space-y-8">
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-pink-500/15 space-y-6">
              <div>
                <h2 className="text-xl font-bold text-white">Skills & Areas of Interest</h2>
                <p className="text-xs text-zinc-400">Add new skills or delete existing ones.</p>
              </div>

              {/* Add Skill Form */}
              <div className="p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800 flex flex-col sm:flex-row gap-3 items-center">
                <input
                  type="text"
                  placeholder="Skill Name (e.g. Zero Knowledge, DeFi, Rust)"
                  value={newSkillName}
                  onChange={(e) => setNewSkillName(e.target.value)}
                  className="w-full sm:w-1/3 px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:border-pink-500 focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Category (e.g. Core, Engineering, Media)"
                  value={newSkillCategory}
                  onChange={(e) => setNewSkillCategory(e.target.value)}
                  className="w-full sm:w-1/4 px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:border-pink-500 focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Short description..."
                  value={newSkillDesc}
                  onChange={(e) => setNewSkillDesc(e.target.value)}
                  className="w-full sm:flex-1 px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:border-pink-500 focus:outline-none"
                />
                <button
                  onClick={handleAddSkill}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-pink-500 hover:bg-pink-600 text-xs font-semibold text-white whitespace-nowrap flex items-center justify-center gap-1.5"
                >
                  <Plus size={14} />
                  <span>Add Skill</span>
                </button>
              </div>

              {/* Skills List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {formData.skills.map((skill) => (
                  <div
                    key={skill.id}
                    className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800/80 flex items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-white">{skill.name}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-pink-950/50 text-pink-300 border border-pink-500/20">
                          {skill.category}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400 mt-1 line-clamp-1">{skill.description}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteSkill(skill.id)}
                      className="p-1.5 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-zinc-900"
                      title="Remove Skill"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* TAB 5: BACKUP & DATA PERSISTENCE */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'backup' && (
          <div className="space-y-6">
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-pink-500/15 space-y-6">
              <div>
                <h2 className="text-xl font-bold text-white">Data Storage & Backup Management</h2>
                <p className="text-xs text-zinc-400">
                  Export backups or reset portfolio data if ever needed.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Export Backup Card */}
                <div className="p-6 rounded-2xl bg-zinc-950/80 border border-zinc-800 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="w-10 h-10 rounded-xl bg-pink-950/40 text-pink-400 border border-pink-500/30 flex items-center justify-center">
                      <Download size={18} />
                    </div>
                    <h3 className="font-bold text-white text-base">Export JSON Backup</h3>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      Download a complete backup file of all your projects, socials, and profile data to your computer.
                    </p>
                  </div>
                  <button
                    onClick={handleExportJSON}
                    className="w-full py-2.5 rounded-xl bg-pink-500 hover:bg-pink-600 text-xs font-semibold text-white flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Download size={14} />
                    <span>Download Backup</span>
                  </button>
                </div>

                {/* Import Backup Card */}
                <div className="p-6 rounded-2xl bg-zinc-950/80 border border-zinc-800 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="w-10 h-10 rounded-xl bg-purple-950/40 text-purple-400 border border-purple-500/30 flex items-center justify-center">
                      <Upload size={18} />
                    </div>
                    <h3 className="font-bold text-white text-base">Restore from Backup</h3>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      Upload a previously exported backup JSON to restore all projects and profile information.
                    </p>
                  </div>
                  <label className="cursor-pointer w-full py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs font-semibold text-zinc-200 flex items-center justify-center gap-1.5 transition-colors">
                    <Upload size={14} />
                    <span>Select Backup File</span>
                    <input
                      type="file"
                      accept=".json"
                      className="hidden"
                      onChange={handleImportJSON}
                    />
                  </label>
                </div>

                {/* Factory Reset Card */}
                <div className="p-6 rounded-2xl bg-zinc-950/80 border border-zinc-800 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="w-10 h-10 rounded-xl bg-rose-950/40 text-rose-400 border border-rose-500/30 flex items-center justify-center">
                      <RefreshCw size={18} />
                    </div>
                    <h3 className="font-bold text-white text-base">Reset to Default</h3>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      Revert all portfolio data back to Sonugg&apos;s initial clean launch configuration.
                    </p>
                  </div>
                  <button
                    onClick={handleReset}
                    className="w-full py-2.5 rounded-xl bg-rose-950/50 hover:bg-rose-900/60 border border-rose-800/60 text-xs font-semibold text-rose-300 flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <RefreshCw size={14} />
                    <span>Reset to Defaults</span>
                  </button>
                </div>

              </div>
            </div>
          </div>
        )}

      </main>

      {/* ---------------------------------------------------- */}
      {/* MODAL: ADD / EDIT PROJECT */}
      {/* ---------------------------------------------------- */}
      {(isAddingProject || editingProject) && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="max-w-2xl w-full glass-panel p-6 sm:p-8 rounded-3xl border border-pink-500/30 my-8 shadow-2xl relative">
            <button
              onClick={() => {
                setIsAddingProject(false);
                setEditingProject(null);
              }}
              className="absolute top-5 right-5 p-2 rounded-xl text-zinc-400 hover:text-white bg-zinc-900"
            >
              <X size={18} />
            </button>

            <h3 className="text-xl font-bold text-white mb-5">
              {editingProject ? 'Edit Project' : 'Add New Web3 Project'}
            </h3>

            <div className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                  Project Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. EVM Chain Pulse"
                  value={projectForm.title || ''}
                  onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-white focus:border-pink-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                  Description *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe the project, problem solved, and architecture..."
                  value={projectForm.description || ''}
                  onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-white focus:border-pink-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    placeholder="Web3 & dApps, Developer Tools, etc."
                    value={projectForm.category || ''}
                    onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-white focus:border-pink-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                    Project Status Badge
                  </label>
                  <select
                    value={projectForm.status || 'Live on Mainnet'}
                    onChange={(e) => setProjectForm({ ...projectForm, status: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-white focus:border-pink-500 focus:outline-none"
                  >
                    <option value="Live on Mainnet">Live on Mainnet</option>
                    <option value="Live">Live</option>
                    <option value="Beta">Beta</option>
                    <option value="In Development">In Development</option>
                    <option value="Open Source">Open Source</option>
                    <option value="Research">Research</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                  Technologies Used (Comma separated)
                </label>
                <input
                  type="text"
                  placeholder="Solidity, Next.js, Viem, Tailwind CSS"
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-white focus:border-pink-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                  Project Preview Image URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="https://images.unsplash.com/... or upload"
                    value={projectForm.image || ''}
                    onChange={(e) => setProjectForm({ ...projectForm, image: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-mono text-white focus:border-pink-500 focus:outline-none"
                  />
                  <label className="cursor-pointer px-3 py-2 rounded-xl bg-pink-950 text-pink-300 border border-pink-500/30 text-xs font-medium flex items-center gap-1 whitespace-nowrap">
                    <Upload size={12} />
                    <span>Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, 'projectImage')}
                    />
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                    Live Demo URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://demo.sonugg.dev"
                    value={projectForm.demoUrl || ''}
                    onChange={(e) => setProjectForm({ ...projectForm, demoUrl: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-white focus:border-pink-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                    GitHub Repo URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://github.com/sonugg07/..."
                    value={projectForm.githubUrl || ''}
                    onChange={(e) => setProjectForm({ ...projectForm, githubUrl: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-white focus:border-pink-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingProject(false);
                    setEditingProject(null);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-zinc-900 text-xs font-semibold text-zinc-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveProjectModal}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 text-xs font-semibold text-white shadow-lg shadow-pink-500/25 flex items-center gap-1.5"
                >
                  <Check size={14} />
                  <span>{editingProject ? 'Update & Save' : 'Add Project'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* MODAL: ADD / EDIT SOCIAL LINK (User Requested) */}
      {/* ---------------------------------------------------- */}
      {(isAddingSocial || editingSocial) && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="max-w-md w-full glass-panel p-6 sm:p-8 rounded-3xl border border-pink-500/30 shadow-2xl relative">
            <button
              onClick={() => {
                setIsAddingSocial(false);
                setEditingSocial(null);
              }}
              className="absolute top-5 right-5 p-2 rounded-xl text-zinc-400 hover:text-white bg-zinc-900"
            >
              <X size={18} />
            </button>

            <h3 className="text-xl font-bold text-white mb-1">
              {editingSocial ? 'Edit Social Account' : 'Add New Social Channel'}
            </h3>
            <p className="text-xs text-zinc-400 mb-5">
              Add your official handles (X, Telegram, YouTube, Discord, Farcaster, etc.)
            </p>

            <div className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                  Platform Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Telegram, YouTube, Discord, Warpcast"
                  value={socialForm.platform || ''}
                  onChange={(e) => setSocialForm({ ...socialForm, platform: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-white focus:border-pink-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                  Platform Icon
                </label>
                <select
                  value={socialForm.icon || 'Twitter'}
                  onChange={(e) => setSocialForm({ ...socialForm, icon: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-white focus:border-pink-500 focus:outline-none"
                >
                  {AVAILABLE_SOCIAL_ICONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                  Handle / Username
                </label>
                <input
                  type="text"
                  placeholder="@sonugg, sonugg07, or t.me/sonugg"
                  value={socialForm.handle || ''}
                  onChange={(e) => setSocialForm({ ...socialForm, handle: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-white focus:border-pink-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                  Profile URL *
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://..."
                  value={socialForm.url || ''}
                  onChange={(e) => setSocialForm({ ...socialForm, url: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-white focus:border-pink-500 focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                  Tagline / Description
                </label>
                <input
                  type="text"
                  placeholder="e.g. Join my Web3 telegram channel for daily updates"
                  value={socialForm.description || ''}
                  onChange={(e) => setSocialForm({ ...socialForm, description: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-white focus:border-pink-500 focus:outline-none"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingSocial(false);
                    setEditingSocial(null);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-zinc-900 text-xs font-semibold text-zinc-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveSocialModal}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 text-xs font-semibold text-white shadow-lg shadow-pink-500/25 flex items-center gap-1.5"
                >
                  <Check size={14} />
                  <span>{editingSocial ? 'Save Changes' : 'Add Social'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
