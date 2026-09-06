'use client';

import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { About } from '@/components/About';
import { Projects } from '@/components/Projects';
import { Skills } from '@/components/Skills';
import { Socials } from '@/components/Socials';
import { Contact } from '@/components/Contact';
import { Footer } from '@/components/Footer';

export default function Home() {
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
