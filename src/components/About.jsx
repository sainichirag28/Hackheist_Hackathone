import React from 'react';
import { Sparkles, Terminal } from 'lucide-react';
import { EVENT_DETAILS } from '../config';

export default function About() {
  return (
    <section id="about" className="py-20 md:py-28 relative border-b border-[#544354]/60 bg-[#382c38]/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#382c38] border border-[#544354] text-[#d6d5e7] text-xs font-mono font-medium">
            <span>SECTION // 02</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#fdf2f2] tracking-tight font-mono">
            What is <span className="text-[#eaeafb]">HackHeist?</span>
          </h2>
        </div>

        {/* 2-Column Responsive Layout: Poster + Editorial Story */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center max-w-6xl">
          
          {/* Left Column: Official Poster Artwork */}
          <div className="lg:col-span-5">
            <div className="rounded-xl overflow-hidden panel-card border border-[#544354] shadow-panel group">
              <div className="relative overflow-hidden bg-black/40">
                <img 
                  src="/hackheist-poster.jpg" 
                  alt="HackHeist 2026 - La Casa De Code" 
                  className="w-full h-auto object-cover rounded-t-xl group-hover:scale-[1.02] transition-transform duration-300"
                />
              </div>
              <div className="p-4 bg-[#382c38] border-t border-[#544354] flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2 text-[#d6d5e7]">
                  <Terminal className="w-3.5 h-3.5 text-[#eaeafb]" />
                  <span className="font-semibold">THEME: LA CASA DE CODE</span>
                </div>
                <span className="text-[11px] px-2 py-0.5 rounded bg-[#d6d5e7]/15 text-[#fdf2f2] border border-[#d6d5e7]/30 font-bold">
                  2K26
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Editorial Description & Mission Badge */}
          <div className="lg:col-span-7 panel-card rounded-xl p-8 sm:p-10 space-y-8 shadow-panel">
            
            {/* Main Description */}
            <p className="text-[#bebabf] text-base sm:text-lg leading-relaxed font-normal">
              {EVENT_DETAILS.aboutParagraph}
            </p>

            {/* Highlighted Phrase Strip */}
            <div className="pt-6 border-t border-[#544354] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <span className="text-xs font-mono uppercase tracking-wider text-[#d6d5e7]">
                Core Motto
              </span>
              
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#d6d5e7]/15 border border-[#d6d5e7]/30 text-[#fdf2f2] font-mono font-bold text-sm sm:text-base tracking-wide">
                <span className="w-2 h-2 rounded-full bg-[#fdf2f2]" />
                <span>{EVENT_DETAILS.highlightedPhrase}</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
