import React, { useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';
import { Play, Pause, ShieldAlert } from 'lucide-react';
import { telemetryService } from '../services/telemetryService';

export default function RealTimeMonitoring({ data }) {
  const { history, isPaused, tempUnit } = data;
  const [activeTab, setActiveTab] = useState('environment');

  const handleTogglePause = () => {
    telemetryService.togglePause();
  };

  const handleUnitToggle = (unit) => {
    telemetryService.setTempUnit(unit);
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-slate-300 p-3 rounded-lg shadow-md font-mono text-xs text-slate-900">
          <p className="text-slate-900 font-bold mb-1 border-b border-slate-200 pb-1">
            TIMESTAMP: {label}
          </p>
          {payload.map((entry, index) => (
            <div key={`item-${index}`} className="flex items-center justify-between gap-4 py-0.5">
              <span style={{ color: entry.color }} className="font-semibold">
                {entry.name}:
              </span>
              <span className="font-bold text-slate-900">
                {entry.value} {entry.unit}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const chartData = history.map(item => ({
    ...item,
    displayTemp: tempUnit === 'F' ? Number((item.temperature * 9 / 5 + 32).toFixed(1)) : item.temperature
  }));

  return (
    <section className="bg-white border border-slate-200 rounded-xl p-5 md:p-6 shadow-sm">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-extrabold tracking-wide text-slate-900 flex items-center gap-2 font-mono uppercase">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-900"></span>
              Real-Time Multi-Axis Monitoring
            </h2>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-300">
              HARDWARE-READY INTERFACE
            </span>
          </div>
          <p className="text-xs text-slate-600 mt-0.5">
            Live telemetry trends and structural stability analytics (ESP32 Serial Ready)
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          
          {/* Chart View Selector */}
          <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-300 font-mono text-xs">
            <button
              onClick={() => setActiveTab('environment')}
              className={`px-3 py-1.5 rounded-md font-bold transition-all ${
                activeTab === 'environment'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Environment
            </button>
            <button
              onClick={() => setActiveTab('tilt')}
              className={`px-3 py-1.5 rounded-md font-bold transition-all ${
                activeTab === 'tilt'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Tilt &amp; Incline
            </button>
          </div>

          {/* Temperature Unit Switcher */}
          <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-300 font-mono text-xs">
            <button
              onClick={() => handleUnitToggle('C')}
              className={`px-2.5 py-1.5 rounded-md font-bold transition-all ${
                tempUnit === 'C' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              °C
            </button>
            <button
              onClick={() => handleUnitToggle('F')}
              className={`px-2.5 py-1.5 rounded-md font-bold transition-all ${
                tempUnit === 'F' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              °F
            </button>
          </div>

          {/* Pause / Play Stream Button */}
          <button
            onClick={handleTogglePause}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-xs border font-bold transition-all shadow-sm ${
              isPaused
                ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 border-amber-600'
                : 'bg-slate-900 hover:bg-slate-800 text-white border-slate-900'
            }`}
          >
            {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
            <span>{isPaused ? 'RESUME STREAM' : 'PAUSE STREAM'}</span>
          </button>

        </div>
      </div>

      {/* Main Chart Canvas Area */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 min-h-[340px] relative">
        
        <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${isPaused ? 'bg-amber-500' : 'bg-emerald-600 animate-ping'}`}></span>
          <span className="text-[10px] font-mono text-slate-500 uppercase font-semibold">
            {isPaused ? 'STREAM PAUSED' : 'LIVE FEEDING (2s)'}
          </span>
        </div>

        <ResponsiveContainer width="100%" height={320}>
          {activeTab === 'environment' ? (
            <LineChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="timeStr"
                stroke="#64748b"
                tick={{ fill: '#475569', fontSize: 11, fontFamily: 'JetBrains Mono' }}
              />
              <YAxis
                yAxisId="left"
                stroke="#d97706"
                tick={{ fill: '#d97706', fontSize: 11, fontFamily: 'JetBrains Mono' }}
                unit={`°${tempUnit}`}
                domain={['auto', 'auto']}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                stroke="#0284c7"
                tick={{ fill: '#0284c7', fontSize: 11, fontFamily: 'JetBrains Mono' }}
                unit="%"
                domain={[0, 100]}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '12px', fontFamily: 'JetBrains Mono' }} />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="displayTemp"
                name={`Temperature (°${tempUnit})`}
                stroke="#d97706"
                strokeWidth={2}
                dot={{ r: 2, fill: '#d97706' }}
                activeDot={{ r: 5, fill: '#d97706' }}
                unit={`°${tempUnit}`}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="humidity"
                name="Humidity (%)"
                stroke="#0284c7"
                strokeWidth={2}
                dot={{ r: 2, fill: '#0284c7' }}
                activeDot={{ r: 5, fill: '#0284c7' }}
                unit="%"
              />
            </LineChart>
          ) : (
            <LineChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="timeStr"
                stroke="#64748b"
                tick={{ fill: '#475569', fontSize: 11, fontFamily: 'JetBrains Mono' }}
              />
              <YAxis
                stroke="#2563eb"
                tick={{ fill: '#2563eb', fontSize: 11, fontFamily: 'JetBrains Mono' }}
                unit="°"
                domain={[-45, 45]}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '12px', fontFamily: 'JetBrains Mono' }} />
              <Line
                type="monotone"
                dataKey="tiltX"
                name="Tilt X Axis (°)"
                stroke="#2563eb"
                strokeWidth={2}
                dot={{ r: 2, fill: '#2563eb' }}
                activeDot={{ r: 5, fill: '#2563eb' }}
                unit="°"
              />
              <Line
                type="monotone"
                dataKey="tiltY"
                name="Tilt Y Axis (°)"
                stroke="#7c3aed"
                strokeWidth={2}
                dot={{ r: 2, fill: '#7c3aed' }}
                activeDot={{ r: 5, fill: '#7c3aed' }}
                unit="°"
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>

      <div className="mt-4 p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-start gap-3">
        <ShieldAlert className="w-4 h-4 text-slate-700 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-600 font-sans">
          <span className="font-bold text-slate-900 font-mono">ESP32 SERIAL INTEGRATION NOTE: </span>
          This section uses structured telemetry state (`telemetryService.js`). When connecting ESP32 #2 over serial (USB/COM), line-delimited JSON or text blocks automatically stream into these charts and thresholds seamlessly without UI modifications.
        </div>
      </div>

    </section>
  );
}
