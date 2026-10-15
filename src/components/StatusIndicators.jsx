import React from 'react';
import { ShieldCheck, AlertTriangle, Siren, RefreshCw, History, ChevronRight } from 'lucide-react';
import { telemetryService } from '../services/telemetryService';

export default function StatusIndicators({ currentStatus, manualOverride, statusLogs = [] }) {
  const statuses = [
    {
      id: 'SAFE',
      label: 'SAFE',
      sublabel: 'Optimal Operating Conditions',
      activeBg: 'bg-emerald-50 border-2 border-emerald-600 text-emerald-950 shadow-sm',
      activeBadge: 'bg-emerald-600 text-white',
      activeLight: 'bg-emerald-500 text-white shadow-md',
      icon: ShieldCheck
    },
    {
      id: 'WARNING',
      label: 'WARNING',
      sublabel: 'Elevated Parameter Thresholds',
      activeBg: 'bg-amber-50 border-2 border-amber-500 text-amber-950 shadow-sm',
      activeBadge: 'bg-amber-500 text-slate-950',
      activeLight: 'bg-amber-500 text-slate-950 shadow-md',
      icon: AlertTriangle
    },
    {
      id: 'EMERGENCY',
      label: 'EMERGENCY / DANGER',
      sublabel: 'CRITICAL HAZARD - EVACUATE MINE',
      activeBg: 'bg-red-50 border-2 border-red-600 text-red-950 shadow-sm animate-pulse',
      activeBadge: 'bg-red-600 text-white',
      activeLight: 'bg-red-600 text-white shadow-md animate-pulse',
      icon: Siren
    }
  ];

  const handleSetOverride = (id) => {
    if (manualOverride === id) {
      telemetryService.setManualStatusOverride(null);
    } else {
      telemetryService.setManualStatusOverride(id);
    }
  };

  return (
    <div className="space-y-6">

      {/* --- PROMINENT EMERGENCY / WARNING ALERT BANNERS --- */}

      {/* EMERGENCY ALERT BANNER */}
      {currentStatus === 'EMERGENCY' && (
        <div className="rounded-xl bg-red-600 border-2 border-red-700 p-5 md:p-6 text-white shadow-lg animate-pulse">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-white text-red-600 shadow shrink-0">
                <Siren className="w-8 h-8 stroke-[2.5]" />
              </div>
              <div>
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <span className="px-2.5 py-0.5 rounded bg-white text-red-700 font-black font-mono text-xs uppercase tracking-widest">
                    CRITICAL HAZARD
                  </span>
                  <h3 className="text-xl md:text-2xl font-black font-mono tracking-wider">
                    EMERGENCY EVACUATION ALERT
                  </h3>
                </div>
                <p className="text-sm font-semibold text-red-100 mt-1">
                  IMMEDIATE UNDERGROUND MINE EVACUATION ORDER IN EFFECT. All personnel proceed to designated safety shelters or surface shafts immediately!
                </p>
              </div>
            </div>

            <div className="shrink-0 flex items-center gap-2">
              <span className="text-xs font-mono font-extrabold bg-red-800 text-white px-4 py-2 rounded-lg border border-red-400">
                ALARM LEVEL 3 ACTIVE
              </span>
            </div>
          </div>
        </div>
      )}

      {/* WARNING ALERT BANNER */}
      {currentStatus === 'WARNING' && (
        <div className="rounded-xl bg-amber-50 border-2 border-amber-500 p-5 text-amber-950 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-amber-500 text-slate-950 font-bold shrink-0">
              <AlertTriangle className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-amber-500 text-slate-950 font-mono text-[10px] font-extrabold uppercase">
                  ATTENTION REQUIRED
                </span>
                <h3 className="text-lg font-bold font-mono text-amber-950">
                  SYSTEM WARNING ALERT
                </h3>
              </div>
              <p className="text-xs font-semibold text-amber-900 mt-0.5">
                Elevated environmental gas or structural inclination parameters detected. Safety officers inspect sensor nodes and verify ventilation ducting.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* --- MAIN STATUS LIGHTS SECTION --- */}
      <section className="bg-white border border-slate-200 rounded-xl p-5 md:p-6 shadow-sm relative overflow-hidden">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5 border-b border-slate-200 pb-4">
          <div>
            <h2 className="text-base font-extrabold tracking-wide text-slate-900 flex items-center gap-2 uppercase font-mono">
              <span className={`w-2.5 h-2.5 rounded-full ${
                currentStatus === 'EMERGENCY' ? 'bg-red-600' : currentStatus === 'WARNING' ? 'bg-amber-500' : 'bg-emerald-600'
              }`}></span>
              CONTROL SYSTEM SAFETY STATUS
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              Underground mine condition monitoring status lights
            </p>
          </div>

          {/* Development / Testing Control Bar */}
          <div className="flex flex-wrap items-center gap-2 bg-slate-50 p-2 rounded-lg border border-slate-200">
            <span className="text-[10px] font-mono font-bold text-slate-600 px-2 uppercase">
              DEV TEST CONTROLS:
            </span>
            <button
              onClick={() => handleSetOverride('SAFE')}
              className={`px-2.5 py-1 rounded-md font-mono text-xs font-bold transition-all border ${
                manualOverride === 'SAFE'
                  ? 'bg-emerald-600 text-white border-emerald-700 shadow-sm'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
              }`}
            >
              TEST: SAFE
            </button>
            <button
              onClick={() => handleSetOverride('WARNING')}
              className={`px-2.5 py-1 rounded-md font-mono text-xs font-bold transition-all border ${
                manualOverride === 'WARNING'
                  ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-sm'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
              }`}
            >
              TEST: WARNING
            </button>
            <button
              onClick={() => handleSetOverride('EMERGENCY')}
              className={`px-2.5 py-1 rounded-md font-mono text-xs font-bold transition-all border ${
                manualOverride === 'EMERGENCY'
                  ? 'bg-red-600 text-white border-red-700 shadow-sm'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
              }`}
            >
              TEST: DANGER
            </button>
            {manualOverride && (
              <button
                onClick={() => handleSetOverride(null)}
                className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-900 hover:bg-slate-800 text-white font-mono text-xs font-bold transition-all shadow-sm"
                title="Return to real-time automated threshold evaluation"
              >
                <RefreshCw className="w-3 h-3 animate-spin" />
                <span>AUTO-EVALUATE</span>
              </button>
            )}
          </div>
        </div>

        {/* Three Status Indicator Lights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {statuses.map((item) => {
            const isActive = currentStatus === item.id;
            const IconComponent = item.icon;

            return (
              <div
                key={item.id}
                onClick={() => handleSetOverride(item.id)}
                className={`group cursor-pointer rounded-xl p-5 border transition-all duration-300 flex flex-col items-center justify-center text-center relative ${
                  isActive
                    ? item.activeBg
                    : 'bg-slate-50 border-slate-200 opacity-60 hover:opacity-100 hover:border-slate-300'
                }`}
              >
                {/* Outer Industrial Metallic Bezel */}
                <div className="p-3 rounded-full mb-3 bg-white border border-slate-300 shadow-sm">
                  {/* Circular LED Light */}
                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
                      isActive
                        ? item.activeLight
                        : 'bg-slate-200 border border-slate-300 text-slate-400'
                    }`}
                  >
                    <IconComponent className="w-8 h-8 stroke-[2.2]" />
                  </div>
                </div>

                {/* Status Label */}
                <div>
                  <h3
                    className={`text-lg font-black tracking-wider font-mono uppercase ${
                      isActive ? 'text-slate-900' : 'text-slate-500'
                    }`}
                  >
                    {item.label}
                  </h3>
                  <p className="text-[11px] text-slate-600 mt-0.5 font-medium">
                    {item.sublabel}
                  </p>
                </div>

                {/* State Badge */}
                <div className="mt-3">
                  <span
                    className={`text-[10px] font-mono font-bold uppercase tracking-widest px-3 py-0.5 rounded-full border ${
                      isActive
                        ? `${item.activeBadge} font-extrabold border-transparent`
                        : 'border-slate-300 text-slate-500 bg-white'
                    }`}
                  >
                    {isActive ? 'STATUS: ACTIVE' : 'INACTIVE'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* --- STATUS HISTORY LOG SECTION --- */}
      <section className="bg-white border border-slate-200 rounded-xl p-5 md:p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4 border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-slate-700" />
            <h3 className="text-sm font-extrabold tracking-wide text-slate-900 font-mono uppercase">
              SYSTEM STATUS HISTORY AUDIT LOG
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-500">
            TOTAL TRANSITIONS: {statusLogs.length}
          </span>
        </div>

        {statusLogs.length === 0 ? (
          <div className="text-center py-6 text-xs text-slate-500 font-mono">
            No status state transitions logged yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse font-mono text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 text-[11px] uppercase tracking-wider bg-slate-50">
                  <th className="py-2.5 px-3">TIMESTAMP</th>
                  <th className="py-2.5 px-3">PREVIOUS STATE</th>
                  <th className="py-2.5 px-3">TRANSITION</th>
                  <th className="py-2.5 px-3">NEW STATE</th>
                  <th className="py-2.5 px-3">TRIGGER REASON / AUDIT DETAILS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {statusLogs.slice(0, 8).map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 transition-colors text-slate-800">
                    <td className="py-2.5 px-3 font-semibold text-slate-900">
                      {log.timeStr}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                        log.prevStatus === 'EMERGENCY' ? 'bg-red-100 text-red-800 border-red-300' :
                        log.prevStatus === 'WARNING' ? 'bg-amber-100 text-amber-900 border-amber-300' :
                        'bg-emerald-100 text-emerald-800 border-emerald-300'
                      }`}>
                        {log.prevStatus}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-400">
                      <ChevronRight className="w-4 h-4 inline" />
                    </td>
                    <td className="py-2.5 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                        log.newStatus === 'EMERGENCY' ? 'bg-red-600 text-white border-red-700' :
                        log.newStatus === 'WARNING' ? 'bg-amber-500 text-slate-950 border-amber-600' :
                        'bg-emerald-600 text-white border-emerald-700'
                      }`}>
                        {log.newStatus}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-600 font-sans text-xs">
                      {log.reason}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

    </div>
  );
}
