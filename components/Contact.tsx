'use client';

import React, { useState } from 'react';
import { Mail, Send, Copy, Check, MessageSquare, ArrowUpRight, Sparkles } from 'lucide-react';
import { usePortfolio } from '@/context/PortfolioContext';

export const Contact: React.FC = () => {
  const { data } = usePortfolio();
  const { profile, socials } = data;
  const [copied, setCopied] = useState(false);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(profile.email || 'sonugg07@gmail.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Web3 Collaboration: Inquiry from ${name || 'Builder'}`);
    const body = encodeURIComponent(`Hi Sonugg,\n\n${message}\n\nBest regards,\n${name}`);
    window.location.href = `mailto:${profile.email || 'sonugg07@gmail.com'}?subject=${subject}&body=${body}`;
  };

  return (
    <section id="contact" className="py-24 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-pink-600/10 rounded-full blur-[150px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-950/40 border border-pink-500/25 text-pink-300 text-xs font-mono">
            <MessageSquare size={13} className="text-pink-400" />
            <span>GET IN TOUCH</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white">
            Let&apos;s Build <span className="text-gradient-pink">Together</span>
          </h2>
          <p className="text-zinc-400 text-base max-w-xl mx-auto">
            Whether you want to discuss a Web3 project, collaborate on content, or bounce protocol ideas, I&apos;m always excited to connect with fellow builders.
          </p>
          <div className="h-1 w-16 bg-gradient-to-r from-pink-500 to-rose-500 mx-auto rounded-full mt-2" />
        </div>

        {/* Contact Layout */}
        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Direct Connect & Email Copy */}
          <div className="lg:col-span-5 glass-panel rounded-3xl p-8 border border-pink-500/20 flex flex-col justify-between space-y-8">
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-white">
                Direct Channels
              </h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Connect directly through verified social channels or send an email. DMs are open on X.
              </p>

              {/* Email Copy Card */}
              <div className="p-4 rounded-2xl bg-zinc-950/80 border border-pink-500/25 space-y-2">
                <div className="text-xs font-mono text-zinc-300 uppercase tracking-wider">
                  Primary Email
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-mono text-pink-300 truncate">
                    {profile.email || 'sonugg07@gmail.com'}
                  </span>
                  <button
                    type="button"
                    suppressHydrationWarning
                    onClick={handleCopyEmail}
                    className="p-2 rounded-lg bg-pink-500/10 hover:bg-pink-500/20 text-pink-400 border border-pink-500/30 transition-all flex items-center gap-1 text-xs"
                    title="Copy Email"
                  >
                    {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                    <span className="font-mono">{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-3">
              <div className="text-xs font-mono text-zinc-300 uppercase tracking-wider">
                Fastest Response
              </div>
              <div className="flex flex-col gap-2">
                {socials.slice(0, 3).map((s) => (
                  <a
                    key={s.id}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 rounded-xl bg-zinc-900/50 hover:bg-zinc-800/80 border border-zinc-800/80 hover:border-pink-500/30 transition-all text-xs text-zinc-300 hover:text-white"
                  >
                    <span className="font-semibold">{s.platform}</span>
                    <span className="text-pink-400 flex items-center gap-1 font-mono">
                      {s.handle}
                      <ArrowUpRight size={12} />
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Quick Message */}
          <div className="lg:col-span-7 glass-panel rounded-3xl p-8 border border-pink-500/20">
            <h3 className="text-xl font-bold text-white mb-2">
              Send a Quick Note
            </h3>
            <p className="text-sm text-zinc-400 mb-6">
              Drop a message to initiate collaboration or inquire about Web3 content & dev work.
            </p>

            <form onSubmit={handleSendMessage} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
                  Your Name or Handle
                </label>
                <input
                  type="text"
                  required
                  suppressHydrationWarning
                  placeholder="e.g. Satoshi / @builder"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-zinc-950/80 border border-zinc-800 focus:border-pink-500/60 focus:outline-none focus:ring-1 focus:ring-pink-500/50 text-sm text-white placeholder-zinc-400 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
                  Message / Proposal
                </label>
                <textarea
                  required
                  rows={4}
                  suppressHydrationWarning
                  placeholder="Tell me about your project, idea, or what you'd like to collaborate on..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-zinc-950/80 border border-zinc-800 focus:border-pink-500/60 focus:outline-none focus:ring-1 focus:ring-pink-500/50 text-sm text-white placeholder-zinc-400 transition-all resize-none"
                />
              </div>

              <button
                type="submit"
                suppressHydrationWarning
                className="w-full py-3.5 px-6 rounded-xl font-semibold text-white bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 shadow-[0_0_25px_-5px_rgba(236,72,153,0.5)] transition-all flex items-center justify-center gap-2 active:scale-98"
              >
                <Send size={16} />
                <span>Send Message</span>
              </button>
            </form>
          </div>

        </div>

      </div>
    </section>
  );
};
