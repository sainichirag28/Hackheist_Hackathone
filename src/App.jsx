import React, { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Highlights from './components/Highlights';
import EventDetails from './components/EventDetails';
import FinalCTA from './components/FinalCTA';
import { REGISTRATION_URL, IS_REGISTRATION_PLACEHOLDER } from './config';
import { X, Info } from 'lucide-react';

export default function App() {
  const [toastMessage, setToastMessage] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  const userMutedRef = useRef(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.loop = true;
    audio.muted = false;
    audio.volume = 0.85;

    const playUnmuted = () => {
      if (userMutedRef.current) return;
      audio.muted = false;
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
          })
          .catch(() => {
            // Browser autoplay policy holds back until first interaction
            setIsPlaying(false);
          });
      }
    };

    // Attempt immediate unmuted play on mount
    playUnmuted();

    // Trigger unmuted play on any initial user gesture (mousemove, scroll, click, touch, key)
    const triggerAudio = () => {
      if (audio.paused && !userMutedRef.current) {
        playUnmuted();
      }
    };

    const interactionEvents = [
      'click', 
      'pointerdown', 
      'touchstart', 
      'scroll', 
      'wheel', 
      'keydown', 
      'mousemove'
    ];

    interactionEvents.forEach(evt => {
      window.addEventListener(evt, triggerAudio, { passive: true });
    });

    return () => {
      interactionEvents.forEach(evt => {
        window.removeEventListener(evt, triggerAudio);
      });
    };
  }, []);

  const handleToggleAudio = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      userMutedRef.current = true;
    } else {
      userMutedRef.current = false;
      audio.muted = false;
      audio.play().then(() => {
        setIsPlaying(true);
      }).catch((err) => {
        console.warn("Audio play prevented:", err);
      });
    }
  };

  const handleRegisterClick = () => {
    if (IS_REGISTRATION_PLACEHOLDER) {
      setToastMessage({
        title: "Registration Placeholder Active",
        body: "Registration URL is configured at src/config.js. Update REGISTRATION_URL with your official Google Form link when ready.",
      });
    } else {
      window.open(REGISTRATION_URL, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="min-h-screen bg-[#413441] text-[#bebabf] flex flex-col font-sans selection:bg-[#fdf2f2] selection:text-[#413441] relative">
      
      {/* Background Audio Source with autoPlay and unmuted settings */}
      <audio 
        ref={audioRef} 
        src="/hackheist-theme.mp3" 
        loop 
        autoPlay 
        playsInline 
        preload="auto" 
      />

      {/* Top Fixed Navigation with Sound Toggle */}
      <Navbar 
        onRegisterClick={handleRegisterClick} 
        isPlaying={isPlaying} 
        onToggleAudio={handleToggleAudio} 
      />

      {/* Main Single-Page Content: EXACTLY 5 Sections */}
      <main className="flex-1 flex flex-col w-full">
        {/* Section 1: Hero */}
        <Hero onRegisterClick={handleRegisterClick} />

        {/* Section 2: About HackHeist */}
        <About />

        {/* Section 3: Event Highlights */}
        <Highlights />

        {/* Section 4: Event Details */}
        <EventDetails />

        {/* Section 5: Final Call To Action (Includes Compact Footer) */}
        <FinalCTA onRegisterClick={handleRegisterClick} />
      </main>

      {/* Notification Toast for Placeholder Registration */}
      {toastMessage && (
        <div 
          role="status" 
          aria-live="polite"
          className="fixed bottom-6 right-6 z-50 max-w-md w-[calc(100%-3rem)] p-4 rounded-lg panel-card border border-[#544354] shadow-panel"
        >
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-md bg-[#d6d5e7]/15 text-[#fdf2f2] border border-[#d6d5e7]/30">
              <Info className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-[#fdf2f2] font-mono">
                {toastMessage.title}
              </h4>
              <p className="text-xs text-[#bebabf] mt-1 leading-relaxed">
                {toastMessage.body}
              </p>
            </div>
            <button
              onClick={() => setToastMessage(null)}
              className="p-1 rounded text-[#d6d5e7] hover:text-[#fdf2f2] hover:bg-[#483748] transition-colors"
              aria-label="Close notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
