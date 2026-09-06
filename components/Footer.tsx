'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUp, Shield, Heart } from 'lucide-react';
import { usePortfolio } from '@/context/PortfolioContext';
import { SocialIcon } from './SocialIcon';

export const Footer: React.FC = () => {
  const { data } = usePortfolio();
  const { profile, socials } = data;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-pink-500/15 bg-[#050308] py-12 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-zinc-900">
          
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 p-[1.5px]">
              <div className="w-full h-full bg-[#0d0a14] rounded-[10px] flex items-center justify-center">
                <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-rose-300 text-xs font-mono">
                  SG
                </span>
              </div>
            </div>
            <div>
              <span className="text-base font-bold text-white tracking-tight">
                {profile.name}
              </span>
              <span className="text-xs text-zinc-300 block font-mono">
                {profile.headline}
              </span>
            </div>
          </div>

          {/* Social Icons Bar */}
          <div className="flex items-center gap-3">
            {socials.map((social) => (
              <a
                key={social.id}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-zinc-900/80 border border-zinc-800 hover:border-pink-500/40 hover:bg-pink-950/20 text-zinc-400 hover:text-pink-400 flex items-center justify-center transition-all"
                title={social.platform}
              >
                <SocialIcon iconName={social.icon || social.platform} size={16} />
              </a>
            ))}
          </div>

          {/* Back to top */}
          <button
            type="button"
            suppressHydrationWarning
            onClick={scrollToTop}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900/60 border border-zinc-800 text-xs font-mono text-zinc-400 hover:text-white hover:border-pink-500/30 transition-all"
          >
            <span>Back to top</span>
            <ArrowUp size={14} className="text-pink-400" />
          </button>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-zinc-300">
          <div>
            &copy; <span suppressHydrationWarning>{new Date().getFullYear()}</span> {profile.name}. All rights reserved.
          </div>

          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-zinc-300">
              Forged for Web3 builders
            </span>
            <span className="text-zinc-400">&bull;</span>
            <Link
              href="/admin"
              className="text-zinc-300 hover:text-pink-400 flex items-center gap-1 transition-colors"
            >
              <Shield size={12} />
              <span>Admin Access</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
