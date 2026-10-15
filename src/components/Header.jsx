import React, { useState, useEffect } from 'react';
import { ShieldAlert, Clock, Calendar, Zap, Server, Cable } from 'lucide-react';
import { telemetryService } from '../services/telemetryService';

export default function Header({ data }) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDate = (d) => {
    return d.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (d) => {
    return d.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const isConnected = data.surfaceReceiver && data.hc05Connected;
  const serialConnectionState = data.serialConnectionState;
  const mode = data.mode;
  const isConnectedOrLive = serialConnectionState === 'CONNECTED' || serialConnectionState === 'LIVE' || mode === 'SERIAL';

  const handleToggleSerial = async () => {
    if (serialConnectionState !== 'DISCONNECTED' || mode === 'SERIAL') {
      await telemetryService.disconnectSerial();
    } else {
      setIsConnecting(true);
      const success = await telemetryService.connectSerial();
      setIsConnecting(false);
    }
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50 px-4 lg:px-8 py-3.5 shadow-sm">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Title & Subtitle */}
        <div className="flex items-center gap-3.5">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-slate-900 text-white font-black shadow-sm">
            <ShieldAlert className="w-5 h-5 text-white stroke-[2.2]" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl md:text-2xl font-black tracking-wider text-slate-900 uppercase font-mono">
                MINERESQ
              </h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-300 uppercase tracking-widest font-mono">
                CONTROL ROOM
              </span>
            </div>
            <p className="text-xs text-slate-600 font-medium tracking-wide">
              Underground Mine Safety Monitoring &amp; Rescue System
            </p>
          </div>
        </div>

        {/* System Connection Status, Live Clock & Top-Right Connect ESP32 #2 Button */}
        <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
          
          {/* Connection Status Badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200">
            <Server className="w-4 h-4 text-slate-500" />
            <span className="text-slate-600 font-sans font-medium">Status:</span>
            <div className="flex items-center gap-1.5 font-semibold">
              <span className={`w-2.5 h-2.5 rounded-full ${isConnected ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
              <span className={isConnected ? 'text-emerald-700' : 'text-red-700'}>
                {isConnected ? 'ONLINE' : 'DEGRADED'}
              </span>
            </div>
          </div>

          {/* Mode Source Badge */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-800">
            <Zap className="w-3.5 h-3.5 text-slate-600" />
            <span className="text-slate-600 font-sans">Source:</span>
            <span className="text-slate-900 font-bold uppercase">{data.dataSource}</span>
          </div>

          {/* Date & Time Badge */}
          <div className="hidden sm:flex items-center gap-3 px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-300 text-slate-800">
            <div className="flex items-center gap-1.5 text-slate-600">
              <Calendar className="w-3.5 h-3.5 text-slate-700" />
              <span>{formatDate(currentTime)}</span>
            </div>
            <span className="text-slate-300">|</span>
            <div className="flex items-center gap-1.5 font-bold text-slate-900">
              <Clock className="w-3.5 h-3.5 text-slate-700" />
              <span>{formatTime(currentTime)}</span>
            </div>
          </div>

          {/* TOP-RIGHT CORNER CONNECT ESP32 #2 BUTTON */}
          <button
            onClick={handleToggleSerial}
            disabled={isConnecting}
            title={isConnectedOrLive ? 'Click to disconnect ESP32 #2 Serial' : 'Click to connect ESP32 #2 via Web Serial API'}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg font-mono text-xs font-bold transition-all shadow-sm border ${
              isConnectedOrLive
                ? 'bg-slate-900 hover:bg-slate-800 text-white border-slate-900'
                : 'bg-slate-900 hover:bg-slate-800 text-white border-slate-900'
            }`}
          >
            {isConnectedOrLive ? (
              <>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>ESP32 #2 Connected</span>
              </>
            ) : (
              <>
                <Cable className="w-4 h-4 text-white stroke-[2.2]" />
                <span>{isConnecting ? 'Opening Port...' : 'Connect ESP32 #2'}</span>
              </>
            )}
          </button>

        </div>

      </div>
    </header>
  );
}

