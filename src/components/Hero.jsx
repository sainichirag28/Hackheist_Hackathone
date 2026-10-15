import React from 'react';
import { ArrowUpRight, ChevronDown, Calendar, MapPin, Clock, Users, Code2, Terminal } from 'lucide-react';
import { EVENT_DETAILS } from '../config';

export default function Hero({ onRegisterClick }) {
  const scrollToAbout = (e) => {
    e.preventDefault();
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="relative pt-24 pb-16 md:pt-32 md:pb-24 tech-grid border-b border-[#544354]/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column: Hero Content */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            {/* GDG Badge */}
            <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-md bg-[#382c38] border border-[#544354] text-xs font-mono">
              <img 
                src="/gdg-logo.png" 
                alt="GDG on Campus MIET" 
                className="w-5 h-5 rounded-full object-contain bg-white" 
              />
              <span className="text-[#fdf2f2] font-semibold uppercase tracking-wider">
                GDG ON CAMPUS MIET PRESENTS
              </span>
              <div className="flex items-center gap-1 ml-1.5 pl-2 border-l border-[#544354]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4285F4]" title="Google Blue" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#EA4335]" title="Google Red" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#FBBC05]" title="Google Yellow" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#34A853]" title="Google Green" />
              </div>
            </div>

            {/* Main Heading & Tagline */}
            <div className="space-y-3">
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-[#fdf2f2] tracking-tight leading-none font-mono">
                HACK<span>HEIST</span>{' '}
                <span className="text-[#d6d5e7] font-normal">2026</span>
              </h1>
              
              <div className="flex flex-wrap items-center gap-3">
                <p className="text-lg sm:text-xl font-semibold text-[#eaeafb] font-mono tracking-wide">
                  Build. Break. Solve.
                </p>
                <span className="text-xs font-mono font-medium px-2 py-0.5 rounded bg-[#382c38] text-[#d6d5e7] border border-[#544354]">
                  La Casa De Code
                </span>
              </div>
            </div>

            {/* Factual, developer-focused description */}
            <p className="text-[#bebabf] text-base sm:text-lg leading-relaxed max-w-2xl font-normal">
              HackHeist 2026 is a developer-focused event organized by GDG on Campus MIET. Learn new technologies, collaborate with fellow students, and experience the excitement of building practical software solutions.
            </p>

            {/* Structured Event Info Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-2">
              <div className="p-3 rounded-lg bg-[#382c38] border border-[#544354]">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#d6d5e7] block">Organizer</span>
                <span className="text-sm font-semibold text-[#fdf2f2] block mt-0.5 truncate" title={EVENT_DETAILS.organizer}>
                  GDG MIET
                </span>
              </div>
              <div className="p-3 rounded-lg bg-[#382c38] border border-[#544354]">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#d6d5e7] block">Event</span>
                <span className="text-sm font-semibold text-[#fdf2f2] block mt-0.5 truncate">
                  {EVENT_DETAILS.name}
                </span>
              </div>
              <div className="p-3 rounded-lg bg-[#382c38] border border-[#544354]">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#d6d5e7] block">Venue</span>
                <span className="text-sm font-semibold text-[#fdf2f2] block mt-0.5 truncate">
                  {EVENT_DETAILS.venue}
                </span>
              </div>
              <div className="p-3 rounded-lg bg-[#382c38] border border-[#544354]">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#d6d5e7] block">Time</span>
                <span className="text-sm font-semibold text-[#fdf2f2] block mt-0.5 truncate">
                  {EVENT_DETAILS.time}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <button
                onClick={onRegisterClick}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold text-[#413441] bg-[#fdf2f2] hover:bg-white active:bg-[#eaeafb] transition-colors shadow-sm focus-visible:ring-2 focus-visible:ring-[#eaeafb]"
              >
                <span>Register Now</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>

              <a
                href="#about"
                onClick={scrollToAbout}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg text-sm font-medium text-[#fdf2f2] hover:text-white bg-[#382c38] hover:bg-[#483748] border border-[#544354] transition-colors"
              >
                <span>Explore Event</span>
                <ChevronDown className="w-4 h-4 text-[#d6d5e7]" />
              </a>
            </div>

          </div>

          {/* Right Column: Clean Event Specification Sheet */}
          <div className="lg:col-span-5">
            <div className="rounded-xl panel-card p-6 shadow-panel">
              
              {/* Card Header */}
              <div className="flex items-center justify-between pb-4 border-b border-[#544354] text-xs font-mono">
                <div className="flex items-center gap-2 text-[#fdf2f2] font-semibold">
                  <Terminal className="w-4 h-4 text-[#eaeafb]" />
                  <span>EVENT SPECIFICATION // 2026</span>
                </div>
                <span className="text-[11px] px-2 py-0.5 rounded bg-[#d6d5e7]/15 text-[#fdf2f2] border border-[#d6d5e7]/30 font-bold">
                  ACTIVE
                </span>
              </div>

              {/* Specification Grid */}
              <dl className="divide-y divide-[#544354]/80 text-sm">
                
                <div className="py-3.5 flex items-start justify-between gap-4">
                  <dt className="text-[#bebabf] font-mono text-xs uppercase flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-[#d6d5e7]" />
                    <span>Event Date</span>
                  </dt>
                  <dd className="text-[#fdf2f2] font-medium text-right font-mono text-xs">
                    {EVENT_DETAILS.dateDisplay}
                  </dd>
                </div>

                <div className="py-3.5 flex items-start justify-between gap-4">
                  <dt className="text-[#bebabf] font-mono text-xs uppercase flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-[#d6d5e7]" />
                    <span>Schedule</span>
                  </dt>
                  <dd className="text-[#fdf2f2] font-medium text-right font-mono text-xs">
                    {EVENT_DETAILS.time}
                  </dd>
                </div>

                <div className="py-3.5 flex items-start justify-between gap-4">
                  <dt className="text-[#bebabf] font-mono text-xs uppercase flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-[#d6d5e7]" />
                    <span>Location</span>
                  </dt>
                  <dd className="text-[#fdf2f2] font-medium text-right font-mono text-xs">
                    MIET Campus
                  </dd>
                </div>

                <div className="py-3.5 flex items-start justify-between gap-4">
                  <dt className="text-[#bebabf] font-mono text-xs uppercase flex items-center gap-2">
                    <Users className="w-3.5 h-3.5 text-[#d6d5e7]" />
                    <span>Organized By</span>
                  </dt>
                  <dd className="text-[#fdf2f2] font-medium text-right text-xs flex items-center justify-end gap-1.5">
                    <img src="/gdg-logo.png" alt="GDG" className="w-4 h-4 rounded-full object-contain bg-white" />
                    <span>{EVENT_DETAILS.organizer}</span>
                  </dd>
                </div>

                <div className="py-3.5 flex items-start justify-between gap-4">
                  <dt className="text-[#bebabf] font-mono text-xs uppercase flex items-center gap-2">
                    <Code2 className="w-3.5 h-3.5 text-[#d6d5e7]" />
                    <span>Focus Tracks</span>
                  </dt>
                  <dd className="text-[#fdf2f2] font-medium text-right text-xs">
                    Hackathon • Workshop • Tech Session • Networking
                  </dd>
                </div>

              </dl>

              {/* Status Footer */}
              <div className="mt-4 pt-4 border-t border-[#544354] text-xs text-[#bebabf] flex items-center justify-between">
                <span className="font-mono text-[11px]">THEME: LA CASA DE CODE</span>
                <span className="text-[#eaeafb] font-mono text-[11px] font-semibold">● IN-PERSON</span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
