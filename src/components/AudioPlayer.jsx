import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

export default function AudioPlayer({ isPlaying, onTogglePlay }) {
  return (
    <div className="fixed bottom-6 left-6 z-50">
      <button
        onClick={onTogglePlay}
        className="group flex items-center gap-2.5 px-3.5 py-2.5 rounded-full panel-card border border-[#544354] shadow-panel hover:border-[#725c72] active:scale-95 transition-all text-xs font-mono bg-[#382c38]/90 backdrop-blur-md focus-visible:ring-2 focus-visible:ring-[#eaeafb]"
        aria-label={isPlaying ? "Mute background theme audio" : "Unmute background theme audio"}
        title={isPlaying ? "Click to mute Bella Ciao theme" : "Click to play Bella Ciao theme"}
      >
        {isPlaying ? (
          <>
            <div className="w-6 h-6 rounded-full bg-[#fdf2f2]/15 flex items-center justify-center text-[#fdf2f2]">
              <Volume2 className="w-3.5 h-3.5" />
            </div>
            
            {/* Animated sound wave bars */}
            <div className="flex items-end gap-[3px] h-3.5 px-0.5">
              <span className="w-[3px] h-3 bg-[#fdf2f2] rounded-full animate-pulse" />
              <span className="w-[3px] h-2 bg-[#d6d5e7] rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
              <span className="w-[3px] h-3.5 bg-[#eaeafb] rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
            </div>

            <span className="text-[#fdf2f2] font-semibold hidden sm:inline pr-1">
              Bella Ciao
            </span>
          </>
        ) : (
          <>
            <div className="w-6 h-6 rounded-full bg-[#544354]/40 flex items-center justify-center text-[#bebabf]">
              <VolumeX className="w-3.5 h-3.5" />
            </div>
            <span className="text-[#bebabf] font-medium hidden sm:inline pr-1">
              Music Off
            </span>
          </>
        )}
      </button>
    </div>
  );
}
