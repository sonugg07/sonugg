'use client';

import React from 'react';
import Image from 'next/image';
import { ArrowDown, ArrowUpRight, Terminal, Sparkles, CheckCircle2 } from 'lucide-react';
import { usePortfolio } from '@/context/PortfolioContext';
import { SocialIcon } from './SocialIcon';

export const Hero: React.FC = () => {
  const { data } = usePortfolio();
  const { profile, socials } = data;

  return (
    <section className="relative min-h-[92vh] flex items-center justify-center pt-28 pb-16 overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-pink-600/10 rounded-full blur-[140px] pointer-events-none -z-10 animate-pulse-slow" />
      <div className="absolute top-1/3 -left-32 w-[450px] h-[450px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-10 -right-20 w-[500px] h-[500px] bg-rose-600/10 rounded-full blur-[130px] pointer-events-none -z-10" />

      {/* Subtle grid pattern overlay */}
      <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none -z-10 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left / Main Text column */}
          <div className="lg:col-span-7 flex flex-col items-start text-left space-y-6">
            
            {/* Status Pill */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-pink-950/30 border border-pink-500/30 backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-pink-500" />
              </span>
              <span className="text-xs font-medium text-pink-300 tracking-wide font-mono">
                {profile.status || "Available for Web3 Collabs & Dev"}
              </span>
            </div>

            {/* Name & Headline */}
            <div className="space-y-3">
              <div className="text-sm uppercase tracking-widest text-zinc-400 font-mono flex items-center gap-2">
                <Terminal size={14} className="text-pink-400" />
                <span>Hello, World! I am</span>
              </div>
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight">
                <span className="text-white">I&apos;m </span>
                <span className="text-gradient-pink relative">
                  {profile.name}
                  {/* Subtle underline flare */}
                  <span className="absolute -bottom-1 left-0 right-0 h-[2px] bg-gradient-to-r from-pink-500 via-rose-400 to-transparent opacity-80" />
                </span>
              </h1>
              <h2 className="text-2xl sm:text-3xl text-zinc-200 font-semibold tracking-tight pt-1">
                {profile.headline}
              </h2>
            </div>

            {/* Short Introduction */}
            <p className="text-base sm:text-lg text-zinc-400 max-w-2xl leading-relaxed">
              {profile.shortBio || profile.about}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2 w-full sm:w-auto">
              <a
                href="#projects"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-pink-500 via-pink-600 to-rose-600 hover:from-pink-600 hover:to-rose-700 shadow-[0_0_30px_-5px_rgba(236,72,153,0.5)] transition-all duration-300 active:scale-95 group"
              >
                <span>View Projects</span>
                <ArrowDown size={16} className="transition-transform group-hover:translate-y-1" />
              </a>

              <a
                href="#contact"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-zinc-200 hover:text-white bg-zinc-900/80 hover:bg-zinc-800/90 border border-pink-500/20 hover:border-pink-500/50 backdrop-blur-md transition-all duration-300 group"
              >
                <span>Connect With Me</span>
                <ArrowUpRight size={16} className="text-pink-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </div>

            {/* Quick Social Links Bar */}
            <div className="pt-4 flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <span className="text-xs font-mono uppercase tracking-wider text-zinc-300">
                Official Channels:
              </span>
              <div className="flex items-center gap-2 flex-wrap">
                {socials.map((social) => (
                  <a
                    key={social.id}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900/70 border border-zinc-800 hover:border-pink-500/40 hover:bg-pink-950/20 text-zinc-300 hover:text-pink-300 transition-all text-xs font-medium group"
                    title={`${social.platform}: ${social.handle}`}
                  >
                    <SocialIcon iconName={social.icon || social.platform} size={14} className="text-pink-400 group-hover:scale-110 transition-transform" />
                    <span>{social.platform}</span>
                  </a>
                ))}
              </div>
            </div>

          </div>

          {/* Right / Visual Column: Electric Pink Avatar Showcase */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end relative">
            <div className="relative w-72 sm:w-80 md:w-96">
              
              {/* Outer neon ring aura */}
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-tr from-pink-600 via-rose-500 to-purple-600 opacity-60 blur-xl group-hover:opacity-100 transition-opacity animate-pulse-slow" />
              
              {/* Avatar Frame */}
              <div className="relative rounded-3xl overflow-hidden border-2 border-pink-500/40 bg-zinc-950 shadow-[0_0_50px_rgba(236,72,153,0.3)]">
                <div className="aspect-square relative w-full overflow-hidden bg-[#0a0712]">
                  <Image
                    src={profile.avatar || '/images/sonugg-avatar.png'}
                    alt={profile.name}
                    fill
                    priority
                    className="object-cover object-center transition-transform duration-700 hover:scale-105"
                  />
                  
                  {/* Subtle gradient overlay at bottom of avatar */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#07050b] via-transparent to-transparent opacity-80" />
                  
                  {/* Floating Builder Badge */}
                  <div className="absolute bottom-4 left-4 right-4 p-3 rounded-2xl bg-black/75 backdrop-blur-md border border-pink-500/30 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-pink-500/20 border border-pink-500/40 flex items-center justify-center">
                        <Sparkles size={16} className="text-pink-400" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white tracking-wide">Web3 Visionary</div>
                        <div className="text-[10px] font-mono text-pink-300">Code &bull; Content &bull; Growth</div>
                      </div>
                    </div>
                    <div className="w-2.5 h-2.5 rounded-full bg-pink-500 animate-ping" />
                  </div>
                </div>
              </div>

              {/* Floating Verified Web3 Developer tag */}
              <div className="absolute -top-4 -right-4 px-3.5 py-1.5 rounded-xl bg-zinc-900/90 border border-pink-500/40 backdrop-blur-xl shadow-lg flex items-center gap-2">
                <CheckCircle2 size={15} className="text-pink-400" />
                <span className="text-xs font-semibold text-zinc-200">Verified Builder</span>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
