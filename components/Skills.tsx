'use client';

import React from 'react';
import { 
  Globe2, 
  Cpu, 
  Code, 
  Video, 
  Wrench, 
  FileEdit,
  Sparkles,
  CheckCircle
} from 'lucide-react';
import { usePortfolio } from '@/context/PortfolioContext';

export const Skills: React.FC = () => {
  const { data } = usePortfolio();
  const { skills } = data;

  const getSkillIcon = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes('web3')) return <Globe2 size={24} className="text-pink-400" />;
    if (n.includes('blockchain')) return <Cpu size={24} className="text-rose-400" />;
    if (n.includes('development') || n.includes('dev')) return <Code size={24} className="text-purple-400" />;
    if (n.includes('content') || n.includes('creation')) return <Video size={24} className="text-pink-400" />;
    if (n.includes('tools') || n.includes('tooling')) return <Wrench size={24} className="text-rose-400" />;
    if (n.includes('writing') || n.includes('technical')) return <FileEdit size={24} className="text-fuchsia-400" />;
    return <Sparkles size={24} className="text-pink-400" />;
  };

  return (
    <section id="skills" className="py-24 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-pink-950/15 rounded-full blur-[160px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-950/40 border border-pink-500/25 text-pink-300 text-xs font-mono">
            <Sparkles size={13} className="text-pink-400" />
            <span>EXPERTISE & PASSION</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white">
            Skills & <span className="text-gradient-pink">Interests</span>
          </h2>
          <p className="text-zinc-400 text-base max-w-xl mx-auto">
            Combining smart contract engineering, developer tooling, and high-signal Web3 content creation.
          </p>
          <div className="h-1 w-16 bg-gradient-to-r from-pink-500 to-rose-500 mx-auto rounded-full mt-2" />
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {skills.map((skill) => (
            <div
              key={skill.id}
              className="glass-panel glass-panel-hover rounded-2xl p-7 border border-pink-500/15 flex flex-col justify-between group transition-all duration-300"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-xl bg-pink-950/40 border border-pink-500/30 flex items-center justify-center group-hover:scale-110 group-hover:border-pink-500/60 transition-all">
                    {getSkillIcon(skill.name)}
                  </div>
                  {skill.category && (
                    <span className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-zinc-900/90 text-zinc-300 border border-zinc-800">
                      {skill.category}
                    </span>
                  )}
                </div>

                <h3 className="text-xl font-bold text-white group-hover:text-pink-300 transition-colors mb-2">
                  {skill.name}
                </h3>
                
                <p className="text-sm text-zinc-400 leading-relaxed">
                  {skill.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-zinc-800/60 flex items-center gap-2 text-xs font-mono text-zinc-300">
                <CheckCircle size={13} className="text-pink-500" />
                <span>Active Mastery & Practice</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
