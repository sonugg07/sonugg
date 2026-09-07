'use client';

import React from 'react';
import Link from 'next/link';
import { Shield, ExternalLink } from 'lucide-react';
import { usePortfolio } from '@/context/PortfolioContext';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { About } from '@/components/About';
import { Projects } from '@/components/Projects';
import { Skills } from '@/components/Skills';
import { Socials } from '@/components/Socials';
import { Contact } from '@/components/Contact';
import { Footer } from '@/components/Footer';
import { SocialIcon } from '@/components/SocialIcon';

export default function Home() {
  const { data, isLoading } = usePortfolio();

  // If website is turned OFF by admin (Maintenance mode)
  if (!isLoading && data.settings?.isWebsiteOnline === false) {
    return (
      <div className="min-h-screen bg-[#07050b] text-[#f4f4f5] flex flex-col items-center justify-center p-6 relative overflow-hidden selection:bg-pink-500 selection:text-white">
        {/* Ambient Glows */}
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-pink-600/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-purple-600/15 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-xl w-full text-center space-y-8 relative z-10 glass-panel p-8 sm:p-12 rounded-3xl border border-pink-500/25 shadow-[0_0_60px_rgba(236,72,153,0.15)]">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-950/60 border border-rose-500/30 text-rose-300 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            <span>Maintenance Mode Active</span>
          </div>

          {/* Profile & Maintenance Info */}
          <div className="space-y-4">
            <div className="w-24 h-24 mx-auto rounded-3xl overflow-hidden border-2 border-pink-500/40 p-1 bg-gradient-to-br from-pink-500/20 to-purple-600/20 shadow-xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={data.profile.avatar || '/images/sonugg-avatar.png'}
                alt={data.profile.name}
                className="w-full h-full object-cover rounded-2xl"
              />
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              {data.settings.maintenanceTitle || 'Portfolio Under Maintenance'}
            </h1>
            
            <p className="text-sm sm:text-base text-zinc-400 leading-relaxed max-w-md mx-auto">
              {data.settings.maintenanceMessage || 'Upgrading systems and deploying new Web3 features. Please check back shortly or connect with me on socials!'}
            </p>
          </div>

          {/* Direct Social Links */}
          <div className="pt-2 border-t border-zinc-800/80">
            <p className="text-xs font-mono uppercase tracking-wider text-zinc-500 mb-4">
              Connect with Sonugg
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {data.socials.map((social) => (
                <a
                  key={social.id}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-zinc-900/80 hover:bg-pink-500/10 border border-zinc-800 hover:border-pink-500/40 text-xs font-medium text-zinc-300 hover:text-white flex items-center gap-2 transition-all group"
                >
                  <SocialIcon name={social.icon} size={15} className="text-pink-400 group-hover:scale-110 transition-transform" />
                  <span>{social.platform}</span>
                  <ExternalLink size={11} className="text-zinc-500 group-hover:text-pink-400" />
                </a>
              ))}
            </div>
          </div>

          {/* Discreet Admin Login Link at bottom */}
          <div className="pt-6">
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 text-xs text-zinc-600 hover:text-zinc-400 font-mono transition-colors"
            >
              <Shield size={12} />
              <span>Admin Login</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#07050b] text-[#f4f4f5] flex flex-col selection:bg-pink-500 selection:text-white">
      <Navbar />
      <main className="flex-1 flex flex-col">
        <Hero />
        <About />
        <Projects />
        <Skills />
        <Socials />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
