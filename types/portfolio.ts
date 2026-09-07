export interface Profile {
  name: string;
  headline: string;
  avatar: string;
  status: string;
  shortBio: string;
  about: string;
  email: string;
  location: string;
}

export interface Pillar {
  title: string;
  description: string;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  description: string;
}

export interface SocialLink {
  id: string;
  platform: string;
  handle: string;
  url: string;
  icon: string; // 'Twitter' | 'Github' | 'Linkedin' | 'Telegram' | 'Discord' | 'Youtube' | 'Globe' | 'Mail' | etc.
  description: string;
  featured: boolean;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  technologies: string[];
  demoUrl?: string;
  githubUrl?: string;
  status: 'Live on Mainnet' | 'Live' | 'Beta' | 'In Development' | 'Open Source' | 'Research' | string;
  featured: boolean;
}

export interface Stat {
  label: string;
  value: string;
}

export interface SiteSettings {
  isWebsiteOnline: boolean;
  maintenanceTitle?: string;
  maintenanceMessage?: string;
}

export interface PortfolioData {
  settings?: SiteSettings;
  updatedAt?: number;
  profile: Profile;
  pillars: Pillar[];
  skills: Skill[];
  socials: SocialLink[];
  projects: Project[];
  stats?: Stat[];
}

