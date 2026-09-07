'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { PortfolioData, Project, SocialLink, Skill, Profile } from '@/types/portfolio';
import { initialPortfolioData } from '@/data/defaultData';

const STORAGE_KEY = 'sonugg_portfolio_data_v1';

interface PortfolioContextType {
  data: PortfolioData;
  isLoading: boolean;
  isSaving: boolean;
  saveData: (newData: PortfolioData) => Promise<{ success: boolean; message: string }>;
  toggleWebsiteStatus: (isOnline: boolean) => Promise<boolean>;
  updateProfile: (profile: Partial<Profile>) => Promise<boolean>;
  addProject: (project: Omit<Project, 'id'>) => Promise<boolean>;
  editProject: (id: string, updated: Partial<Project>) => Promise<boolean>;
  deleteProject: (id: string) => Promise<boolean>;
  addSocial: (social: Omit<SocialLink, 'id'>) => Promise<boolean>;
  editSocial: (id: string, updated: Partial<SocialLink>) => Promise<boolean>;
  deleteSocial: (id: string) => Promise<boolean>;
  addSkill: (skill: Omit<Skill, 'id'>) => Promise<boolean>;
  deleteSkill: (id: string) => Promise<boolean>;
  resetToDefaults: () => Promise<boolean>;
  refreshData: () => Promise<void>;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const PortfolioProvider: React.FC<{ children: React.ReactNode; initialData?: PortfolioData }> = ({ children, initialData }) => {
  const [data, setData] = useState<PortfolioData>(initialData || initialPortfolioData);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // 1. Initial Load: Check localStorage first for instant hydration, then verify with server API
  useEffect(() => {
    let localData: PortfolioData | null = null;
    try {
      const cached = localStorage.getItem(STORAGE_KEY);
      if (cached) {
        const parsed: PortfolioData = JSON.parse(cached);
        if (parsed && parsed.profile && Array.isArray(parsed.projects)) {
          localData = parsed;
          setData(parsed);
        }
      }
    } catch (e) {
      console.warn('Could not read from localStorage', e);
    }

    // 2. Fetch from server API to get authoritative data with timestamp comparison
    fetch('/api/portfolio', { cache: 'no-store' })
      .then((res) => {
        if (!res.ok) throw new Error('Network response not ok');
        return res.json();
      })
      .then((serverData: PortfolioData) => {
        if (serverData && serverData.profile) {
          const serverTime = serverData.updatedAt || 0;
          const localTime = localData?.updatedAt || 0;

          // If localData has user changes that are newer than static/server data, keep local
          if (localData && localTime > serverTime) {
            // Keep local data in state & sync to server
            fetch('/api/portfolio', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(localData),
            }).catch((err) => console.warn('Background server sync error:', err));
          } else {
            // Server data is newer or local data is absent
            setData(serverData);
            try {
              localStorage.setItem(STORAGE_KEY, JSON.stringify(serverData));
            } catch (e) {
              console.warn('Failed to update localStorage cache', e);
            }
          }
        }
      })
      .catch((err) => {
        console.warn('Using local/cached data as server fetch failed:', err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  // Save full portfolio data to both Server and LocalStorage with fresh timestamp
  const saveData = async (newData: PortfolioData): Promise<{ success: boolean; message: string }> => {
    setIsSaving(true);
    const stampedData: PortfolioData = {
      ...newData,
      updatedAt: Date.now(),
      settings: {
        isWebsiteOnline: newData.settings?.isWebsiteOnline !== false,
        maintenanceTitle: newData.settings?.maintenanceTitle || 'Portfolio Temporarily Offline',
        maintenanceMessage: newData.settings?.maintenanceMessage || 'Upgrading systems and deploying new Web3 features.',
      },
    };

    try {
      // 1. Save to localStorage immediately
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(stampedData));
      } catch (e) {
        console.warn('localStorage save warning:', e);
      }

      // 2. Update React state immediately
      setData(stampedData);

      // 3. Persist to server API
      const res = await fetch('/api/portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(stampedData),
      });

      if (!res.ok) {
        throw new Error('Server returned error status');
      }

      setIsSaving(false);
      return { success: true, message: 'Changes saved permanently to disk and browser cache!' };
    } catch (error) {
      console.error('Error saving portfolio data:', error);
      setIsSaving(false);
      return {
        success: true,
        message: 'Saved to local browser storage (server sync will retry on next connection).',
      };
    }
  };

  const toggleWebsiteStatus = async (isOnline: boolean): Promise<boolean> => {
    const updated: PortfolioData = {
      ...data,
      settings: {
        ...data.settings,
        isWebsiteOnline: isOnline,
      },
    };
    const res = await saveData(updated);
    return res.success;
  };

  const updateProfile = async (updatedFields: Partial<Profile>): Promise<boolean> => {
    const newData: PortfolioData = {
      ...data,
      profile: {
        ...data.profile,
        ...updatedFields,
      },
    };
    const res = await saveData(newData);
    return res.success;
  };

  const addProject = async (project: Omit<Project, 'id'>): Promise<boolean> => {
    const id = `proj-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newProject: Project = { ...project, id };
    const newData: PortfolioData = {
      ...data,
      projects: [newProject, ...data.projects],
    };
    const res = await saveData(newData);
    return res.success;
  };

  const editProject = async (id: string, updated: Partial<Project>): Promise<boolean> => {
    const newData: PortfolioData = {
      ...data,
      projects: data.projects.map((p) => (p.id === id ? { ...p, ...updated } : p)),
    };
    const res = await saveData(newData);
    return res.success;
  };

  const deleteProject = async (id: string): Promise<boolean> => {
    const newData: PortfolioData = {
      ...data,
      projects: data.projects.filter((p) => p.id !== id),
    };
    const res = await saveData(newData);
    return res.success;
  };

  const addSocial = async (social: Omit<SocialLink, 'id'>): Promise<boolean> => {
    const id = `social-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newSocial: SocialLink = { ...social, id };
    const newData: PortfolioData = {
      ...data,
      socials: [...data.socials, newSocial],
    };
    const res = await saveData(newData);
    return res.success;
  };

  const editSocial = async (id: string, updated: Partial<SocialLink>): Promise<boolean> => {
    const newData: PortfolioData = {
      ...data,
      socials: data.socials.map((s) => (s.id === id ? { ...s, ...updated } : s)),
    };
    const res = await saveData(newData);
    return res.success;
  };

  const deleteSocial = async (id: string): Promise<boolean> => {
    const newData: PortfolioData = {
      ...data,
      socials: data.socials.filter((s) => s.id !== id),
    };
    const res = await saveData(newData);
    return res.success;
  };

  const addSkill = async (skill: Omit<Skill, 'id'>): Promise<boolean> => {
    const id = `skill-${Date.now()}`;
    const newSkill: Skill = { ...skill, id };
    const newData: PortfolioData = {
      ...data,
      skills: [...data.skills, newSkill],
    };
    const res = await saveData(newData);
    return res.success;
  };

  const deleteSkill = async (id: string): Promise<boolean> => {
    const newData: PortfolioData = {
      ...data,
      skills: data.skills.filter((s) => s.id !== id),
    };
    const res = await saveData(newData);
    return res.success;
  };

  const resetToDefaults = async (): Promise<boolean> => {
    const res = await saveData(initialPortfolioData);
    return res.success;
  };

  const refreshData = async () => {
    try {
      const res = await fetch('/api/portfolio', { cache: 'no-store' });
      if (res.ok) {
        const serverData = await res.json();
        setData(serverData);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(serverData));
      }
    } catch (e) {
      console.error('Refresh error:', e);
    }
  };

  return (
    <PortfolioContext.Provider
      value={{
        data,
        isLoading,
        isSaving,
        saveData,
        toggleWebsiteStatus,
        updateProfile,
        addProject,
        editProject,
        deleteProject,
        addSocial,
        editSocial,
        deleteSocial,
        addSkill,
        deleteSkill,
        resetToDefaults,
        refreshData,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};
