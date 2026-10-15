import React from 'react';
import { ArrowUpRight } from 'lucide-react';

export default function FinalCTA({ onRegisterClick }) {
  return (
    <section id="cta" className="relative pt-20 pb-12 md:pt-28 md:pb-14 tech-grid flex flex-col justify-between">
      {/* Main Call To Action Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 my-auto">
        
        {/* Section Identifier */}
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#382c38] border border-[#544354] text-[#d6d5e7] text-xs font-mono font-medium">
          <span>SECTION // 05</span>
        </div>

        {/* Heading */}
        <h2 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-[#fdf2f2] tracking-tight font-mono">
          Ready to <span className="text-[#eaeafb]">HackHeist?</span>
        </h2>

        {/* Motivating Supporting Sentence */}
        <p className="text-[#bebabf] text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-normal">
          Bring your curiosity, challenge your creativity, and get ready to build something extraordinary.
        </p>

        {/* Action Button & Note */}
        <div className="pt-4 flex flex-col items-center gap-3">
          <button
            onClick={onRegisterClick}
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-lg text-base font-semibold text-[#413441] bg-[#fdf2f2] hover:bg-white active:bg-[#eaeafb] transition-colors shadow-sm focus-visible:ring-2 focus-visible:ring-[#eaeafb]"
          >
            <span>Register Now</span>
            <ArrowUpRight className="w-5 h-5" />
          </button>

          {/* Small Supporting Text */}
          <p className="text-xs sm:text-sm text-[#d6d5e7] font-mono">
            Your next big idea could start here.
          </p>
        </div>

      </div>

      {/* Integrated Compact Footer (inside Section 5) */}
      <footer className="mt-20 pt-8 border-t border-[#544354]/80 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#bebabf] font-mono">
          
          {/* Brand & Organizer with Official Logo */}
          <div className="flex items-center gap-2.5">
            <img 
              src="/gdg-logo.png" 
              alt="GDG on Campus MIET" 
              className="w-7 h-7 rounded-full object-contain border border-[#544354] bg-white shadow-sm" 
            />
            <div>
              <span className="font-bold text-[#fdf2f2]">HACKHEIST 2026</span>
              <span className="mx-2 text-[#544354]">•</span>
              <span className="text-[#d6d5e7]">GDG on Campus MIET</span>
            </div>
          </div>

          {/* Copyright */}
          <div className="text-[#bebabf] text-center sm:text-right">
            <span>© 2026 HackHeist. All rights reserved.</span>
          </div>

        </div>
      </footer>
    </section>
  );
}
