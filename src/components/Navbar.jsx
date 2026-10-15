import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowUpRight, Volume2, VolumeX } from 'lucide-react';

export default function Navbar({ onRegisterClick, isPlaying, onToggleAudio }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      const sections = ['hero', 'about', 'highlights', 'details', 'cta'];
      const scrollPosition = window.scrollY + 120;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', href: '#hero', id: 'hero' },
    { label: 'About', href: '#about', id: 'about' },
    { label: 'Highlights', href: '#highlights', id: 'highlights' },
    { label: 'Details', href: '#details', id: 'details' },
  ];

  const handleLinkClick = (e, href) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-200 ${
      scrolled ? 'nav-backdrop shadow-md' : 'bg-[#413441]/85 backdrop-blur-sm border-b border-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Branding */}
          <a 
            href="#hero" 
            onClick={(e) => handleLinkClick(e, '#hero')}
            className="flex items-center gap-2.5 group rounded-md p-1 focus-visible:ring-2 focus-visible:ring-[#eaeafb]"
          >
            <img 
              src="/gdg-logo.png" 
              alt="GDG on Campus MIET" 
              className="w-9 h-9 rounded-full object-contain shadow-sm border border-[#544354] group-hover:scale-105 transition-transform duration-200 bg-white" 
            />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-base text-[#fdf2f2] tracking-tight font-mono">
                  HACK<span>HEIST</span>
                </span>
                <span className="text-[11px] font-mono font-semibold px-1.5 py-0.2 rounded bg-[#352835] text-[#d6d5e7] border border-[#544354]">
                  2026
                </span>
              </div>
              <p className="text-[10px] text-[#bebabf] tracking-tight font-medium hidden sm:block">
                GDG on Campus MIET
              </p>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6" aria-label="Main Navigation">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <a
                  key={link.id}
                  href={link.href}
                  onClick={(e) => handleLinkClick(e, link.href)}
                  className={`text-sm font-medium transition-colors duration-150 ${
                    isActive
                      ? 'text-[#fdf2f2] font-semibold border-b-2 border-[#eaeafb] pb-0.5'
                      : 'text-[#bebabf] hover:text-[#fdf2f2]'
                  }`}
                >
                  {link.label}
                </a>
              );
            })}
          </nav>

          {/* Desktop Actions: Audio Toggle + Register Button */}
          <div className="hidden md:flex items-center gap-3">
            {/* Audio Toggle Button */}
            <button
              onClick={onToggleAudio}
              className={`px-3 py-2 rounded-lg border transition-colors focus-visible:ring-2 focus-visible:ring-[#eaeafb] flex items-center gap-2 ${
                isPlaying 
                  ? 'bg-[#382c38] border-[#fdf2f2]/40 text-[#fdf2f2] shadow-sm' 
                  : 'bg-[#382c38]/60 border-[#544354] text-[#bebabf] hover:text-[#fdf2f2]'
              }`}
              aria-label={isPlaying ? "Mute background music" : "Play background music"}
              title={isPlaying ? "Mute music (Bella Ciao)" : "Play background music"}
            >
              {isPlaying ? <Volume2 className="w-4 h-4 text-[#fdf2f2]" /> : <VolumeX className="w-4 h-4 text-[#bebabf]" />}
              <span className="text-xs font-mono font-medium">{isPlaying ? 'Sound: ON' : 'Sound: OFF'}</span>
            </button>

            <button
              onClick={onRegisterClick}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold text-[#413441] bg-[#fdf2f2] hover:bg-white active:bg-[#eaeafb] transition-colors shadow-sm focus-visible:ring-2 focus-visible:ring-[#eaeafb]"
            >
              <span>Register Now</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile Right Controls: Audio Toggle + Hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <button
              type="button"
              onClick={onToggleAudio}
              className="p-2 rounded-lg bg-[#382c38] border border-[#544354] text-[#bebabf] hover:text-[#fdf2f2] focus:outline-none focus:ring-2 focus:ring-[#eaeafb]"
              aria-label={isPlaying ? "Mute music" : "Play music"}
            >
              {isPlaying ? <Volume2 className="w-5 h-5 text-[#fdf2f2]" /> : <VolumeX className="w-5 h-5 text-[#bebabf]" />}
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-[#382c38] border border-[#544354] text-[#bebabf] hover:text-[#fdf2f2] focus:outline-none focus:ring-2 focus:ring-[#eaeafb]"
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#382c38] border-b border-[#544354] px-4 pt-3 pb-5 space-y-2">
          <nav className="flex flex-col space-y-1">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <a
                  key={link.id}
                  href={link.href}
                  onClick={(e) => handleLinkClick(e, link.href)}
                  className={`px-3 py-2.5 rounded-lg text-sm font-medium flex items-center justify-between ${
                    isActive
                      ? 'bg-[#413441] text-[#fdf2f2] font-semibold border border-[#544354]'
                      : 'text-[#bebabf] hover:bg-[#413441] hover:text-[#fdf2f2]'
                  }`}
                >
                  <span>{link.label}</span>
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#fdf2f2]"></span>}
                </a>
              );
            })}
          </nav>
          <div className="pt-2 space-y-2">
            <button
              type="button"
              onClick={onToggleAudio}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium bg-[#413441] border border-[#544354] text-[#fdf2f2]"
            >
              <div className="flex items-center gap-2">
                {isPlaying ? <Volume2 className="w-4 h-4 text-[#fdf2f2]" /> : <VolumeX className="w-4 h-4 text-[#bebabf]" />}
                <span>Theme Music</span>
              </div>
              <span className="text-xs font-mono font-semibold text-[#eaeafb]">
                {isPlaying ? 'Sound: ON' : 'Sound: OFF'}
              </span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onRegisterClick();
              }}
              className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-sm font-semibold text-[#413441] bg-[#fdf2f2] hover:bg-white transition-colors shadow-sm"
            >
              <span>Register Now</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
