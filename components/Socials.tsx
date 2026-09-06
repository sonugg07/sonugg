'use client';

import React from 'react';
import { ArrowUpRight, Share2, Globe, Sparkles } from 'lucide-react';
import { usePortfolio } from '@/context/PortfolioContext';
import { SocialIcon } from './SocialIcon';

export const Socials: React.FC = () => {
  const { data } = usePortfolio();
  const { socials } = data;

  return (
    <section id="socials" className="py-24 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-rose-600/10 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-950/40 border border-pink-500/25 text-pink-300 text-xs font-mono">
            <Share2 size={13} className="text-pink-400" />
            <span>COMMUNITY & NETWORKS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white">
            Connect Across the <span className="text-gradient-pink">Ecosystem</span>
          </h2>
          <p className="text-zinc-400 text-base max-w-xl mx-auto">
            Follow along for Web3 development breakdowns, protocol deep-dives, and builder insights.
          </p>
          <div className="h-1 w-16 bg-gradient-to-r from-pink-500 to-rose-500 mx-auto rounded-full mt-2" />
        </div>

        {/* Social Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {socials.map((social) => (
            <a
              key={social.id}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="glass-panel glass-panel-hover rounded-2xl p-7 border border-pink-500/15 flex flex-col justify-between group cursor-pointer transition-all duration-300"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-[#120d1c] border border-pink-500/30 flex items-center justify-center text-white group-hover:scale-110 group-hover:border-pink-500/70 group-hover:shadow-[0_0_20px_-3px_rgba(236,72,153,0.4)] transition-all">
                    <SocialIcon iconName={social.icon || social.platform} size={24} className="text-pink-400" />
                  </div>
                  
                  <div className="w-8 h-8 rounded-full bg-zinc-900/80 border border-zinc-800 flex items-center justify-center text-zinc-400 group-hover:text-white group-hover:border-pink-500/40 transition-colors">
                    <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                </div>

                <div className="space-y-1 mb-3">
                  <div className="text-xl font-bold text-white group-hover:text-pink-300 transition-colors">
                    {social.platform}
                  </div>
                  <div className="text-xs font-mono text-pink-400/90 font-medium">
                    {social.handle}
                  </div>
                </div>

                <p className="text-sm text-zinc-400 leading-relaxed">
                  {social.description || `Connect with Sonugg on ${social.platform}.`}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-zinc-800/80 flex items-center justify-between">
                <span className="text-xs font-mono text-zinc-300 group-hover:text-zinc-200 transition-colors">
                  Open {social.platform}
                </span>
                <span className="text-xs font-semibold text-pink-400 group-hover:underline">
                  Visit Profile &rarr;
                </span>
              </div>
            </a>
          ))}
        </div>

      </div>
    </section>
  );
};
