'use client';

import React from 'react';
import { Layers, Compass, Share2, Code2, Users, Flame, BookOpen } from 'lucide-react';
import { usePortfolio } from '@/context/PortfolioContext';

export const About: React.FC = () => {
  const { data } = usePortfolio();
  const { profile, pillars } = data;

  const pillarIcons = [
    <Code2 key="code" className="text-pink-400" size={22} />,
    <Share2 key="share" className="text-rose-400" size={22} />,
    <Compass key="compass" className="text-purple-400" size={22} />,
    <Users key="users" className="text-pink-400" size={22} />,
  ];

  return (
    <section id="about" className="py-24 relative overflow-hidden">
      {/* Background radial highlight */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-pink-900/10 rounded-full blur-[130px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-950/40 border border-pink-500/25 text-pink-300 text-xs font-mono">
            <Flame size={13} className="text-pink-400" />
            <span>ABOUT SONUGG</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white">
            Building, Exploring & <span className="text-gradient-pink">Sharing Web3</span>
          </h2>
          <div className="h-1 w-16 bg-gradient-to-r from-pink-500 to-rose-500 mx-auto rounded-full mt-2" />
        </div>

        {/* Narrative Box */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="glass-panel rounded-3xl p-8 sm:p-10 border border-pink-500/20 relative overflow-hidden shadow-[0_0_40px_-15px_rgba(236,72,153,0.15)]">
            <div className="absolute top-0 right-0 w-60 h-60 bg-pink-500/5 rounded-full blur-3xl pointer-events-none" />
            
            <p className="text-lg sm:text-xl text-zinc-300 leading-relaxed font-normal">
              {profile.about}
            </p>

            <div className="mt-8 pt-6 border-t border-zinc-800/80 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-zinc-300">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-pink-500" />
                <span>Focus: Learning by Building</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                <span>Mission: Empowering Builders & Community</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-purple-500" />
                <span>Ecosystem: Multi-Chain EVM & Protocols</span>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar, index) => (
            <div
              key={index}
              className="glass-panel glass-panel-hover rounded-2xl p-6 border border-pink-500/10 flex flex-col justify-between group"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-pink-950/40 border border-pink-500/20 flex items-center justify-center mb-5 group-hover:border-pink-500/50 group-hover:scale-105 transition-all">
                  {pillarIcons[index % pillarIcons.length]}
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-pink-300 transition-colors mb-2">
                  {pillar.title}
                </h3>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  {pillar.description}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-white/[0.05] flex items-center justify-between text-[11px] font-mono text-zinc-300">
                <span>PILLAR 0{index + 1}</span>
                <span className="text-pink-400 opacity-0 group-hover:opacity-100 transition-opacity">&rarr;</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
