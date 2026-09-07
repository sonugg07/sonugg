'use client';

import React, { useState } from 'react';
import { ExternalLink, Layers, Code, Sparkles, Activity } from 'lucide-react';
import { usePortfolio } from '@/context/PortfolioContext';
import { GithubIcon } from '@/components/SocialIcon';

export const Projects: React.FC = () => {
  const { data } = usePortfolio();
  const { projects } = data;
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = ['All', ...Array.from(new Set(projects.map((p) => p.category).filter(Boolean)))];

  const filteredProjects = activeCategory === 'All'
    ? projects
    : projects.filter((p) => p.category === activeCategory);

  const getStatusBadgeClass = (status: string) => {
    const s = status.toLowerCase();
    if (s.includes('mainnet') || s.includes('live')) {
      return 'bg-emerald-950/70 text-emerald-300 border-emerald-500/40';
    }
    if (s.includes('beta')) {
      return 'bg-amber-950/70 text-amber-300 border-amber-500/40';
    }
    if (s.includes('dev') || s.includes('building')) {
      return 'bg-blue-950/70 text-blue-300 border-blue-500/40';
    }
    return 'bg-pink-950/70 text-pink-300 border-pink-500/40';
  };

  return (
    <section id="projects" className="py-24 relative">
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-pink-600/10 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-950/40 border border-pink-500/25 text-pink-300 text-xs font-mono">
              <Code size={13} className="text-pink-400" />
              <span>PROOF OF WORK</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white">
              Featured <span className="text-gradient-pink">Projects</span>
            </h2>
            <p className="text-zinc-400 text-base max-w-xl">
              A curated collection of smart contracts, decentralized applications, developer utilities, and Web3 research initiatives.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                suppressHydrationWarning
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 border ${
                  activeCategory === cat
                    ? 'bg-pink-500 text-white border-pink-400 shadow-[0_0_20px_-3px_rgba(236,72,153,0.5)]'
                    : 'bg-zinc-900/80 text-zinc-400 hover:text-white border-zinc-800 hover:border-zinc-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="glass-panel glass-panel-hover rounded-3xl overflow-hidden border border-pink-500/15 flex flex-col group transition-all duration-300"
            >
              {/* Project Image Preview */}
              <div className="relative aspect-video w-full overflow-hidden bg-zinc-950">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={project.image || 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=1200&auto=format&fit=crop'}
                  alt={project.title}
                  className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.src = 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=1200&auto=format&fit=crop';
                  }}
                />
                
                {/* Gradient vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#07050b] via-[#07050b]/30 to-transparent" />

                {/* Top badges: Status & Category */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-mono font-medium border backdrop-blur-md shadow-sm ${getStatusBadgeClass(
                      project.status
                    )}`}
                  >
                    {project.status}
                  </span>
                  
                  {project.category && (
                    <span className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-black/60 text-zinc-300 border border-white/10 backdrop-blur-md">
                      {project.category}
                    </span>
                  )}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-6">
                <div className="space-y-3">
                  <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:text-pink-300 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    {project.description}
                  </p>
                </div>

                <div className="space-y-5">
                  {/* Tech Stack Tags */}
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-md text-[11px] font-mono bg-pink-950/40 text-pink-300 border border-pink-500/20"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Actions / Links */}
                  <div className="pt-4 border-t border-zinc-800/80 flex items-center gap-3">
                    {project.demoUrl && (
                      <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-pink-600 hover:bg-pink-500 transition-all shadow-md hover:shadow-pink-500/25"
                      >
                        <span>Live Demo</span>
                        <ExternalLink size={13} />
                      </a>
                    )}

                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-zinc-200 hover:text-white bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 transition-all"
                      >
                        <GithubIcon size={13} />
                        <span>Source Code</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty state when filter has no results */}
        {filteredProjects.length === 0 && (
          <div className="text-center py-16 p-8 rounded-3xl glass-panel border border-pink-500/10">
            <Layers className="mx-auto text-pink-400 mb-3 opacity-50" size={40} />
            <p className="text-zinc-400 text-sm">No projects found in this category.</p>
          </div>
        )}

      </div>
    </section>
  );
};
