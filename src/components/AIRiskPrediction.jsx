import React from 'react';
import { Cpu, TrendingUp, Clock, AlertTriangle, ShieldCheck, Zap, Activity, Info } from 'lucide-react';

export default function AIRiskPrediction({ data }) {
  const { aiRisk = {} } = data;

  const {
    currentCH4 = 0,
    methaneRate = 0,
    rateFormatted = '+0.00 %/min',
    timeToCriticalMin = null,
    timeFormatted = 'N/A (Stable)',
    riskScore = 12,
    riskLevel = 'SAFE',
    trendLabel = 'Stable',
    confidence = 'Medium',
    criticalThreshold = '1.25%',
    recommendation = '✅ OPTIMAL: Atmospheric gas levels stable. Main ventilation active.'
  } = aiRisk;

  // Determine colors based on riskLevel (Strict Green / Amber / Red for Safety Status)
  const getBadgeStyle = (level) => {
    switch (level) {
      case 'DANGER':
      case 'CRITICAL':
        return 'bg-red-600 text-white font-black border-red-700';
      case 'HIGH':
      case 'WARNING':
        return 'bg-amber-500 text-slate-950 font-bold border-amber-600';
      case 'SAFE':
      default:
        return 'bg-emerald-600 text-white font-bold border-emerald-700';
    }
  };

  const getProgressColor = (score) => {
    if (score >= 80) return 'bg-red-600';
    if (score >= 50) return 'bg-amber-500';
    if (score >= 30) return 'bg-amber-400';
    return 'bg-emerald-600';
  };

  return (
    <section className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4 relative overflow-hidden">
      
      {/* Title & Overall Risk Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-slate-900 text-white shadow-sm">
            <Cpu className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-extrabold tracking-wide text-slate-900 uppercase font-mono">
                AI Predictive Methane Risk Layer
              </h2>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-300">
                REAL-TIME INFERENCE
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-0.5">
              Atmospheric gas accumulation rate estimation & critical threshold vector analysis
            </p>
          </div>
        </div>

        {/* AI Hazard Index Indicator */}
        <div className="flex items-center gap-4 bg-slate-50 p-3 rounded-lg border border-slate-200">
          <div>
            <div className="text-[10px] font-mono text-slate-600 uppercase tracking-wider">
              AI Hazard Index
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black font-mono text-slate-900">
                {riskScore}
              </span>
              <span className="text-xs font-mono text-slate-500">/100</span>
            </div>
          </div>

          <div className="w-28">
            <div className="flex justify-between text-[9px] font-mono text-slate-600 mb-1">
              <span>RISK</span>
              <span className="font-bold">{riskLevel}</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden border border-slate-300">
              <div
                className={`h-full rounded-full transition-all duration-300 ${getProgressColor(riskScore)}`}
                style={{ width: `${Math.min(100, Math.max(5, riskScore))}%` }}
              ></div>
            </div>
          </div>

          {/* Level Pill */}
          <span className={`text-xs font-mono tracking-wider px-3 py-1 rounded-full border shadow-sm ${getBadgeStyle(riskLevel)}`}>
            {riskLevel}
          </span>
        </div>
      </div>

      {/* Grid of 7 Detailed Methane Predictive Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
        
        {/* Metric 1: Current CH4 */}
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 flex flex-col justify-between">
          <div className="text-[10px] font-mono text-slate-600 uppercase font-semibold">
            Current CH₄
          </div>
          <div className="text-xl font-black font-mono text-slate-900 my-1">
            {currentCH4.toFixed(2)}%
          </div>
          <div className="text-[9px] font-mono text-slate-500 border-t border-slate-200 pt-1">
            Volume Level
          </div>
        </div>

        {/* Metric 2: Risk Level */}
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 flex flex-col justify-between">
          <div className="text-[10px] font-mono text-slate-600 uppercase font-semibold">
            Risk Status
          </div>
          <div className="text-sm font-black font-mono my-1 uppercase">
            <span className={`px-2 py-0.5 rounded border text-xs ${getBadgeStyle(riskLevel)}`}>
              {riskLevel}
            </span>
          </div>
          <div className="text-[9px] font-mono text-slate-500 border-t border-slate-200 pt-1">
            Evaluated Level
          </div>
        </div>

        {/* Metric 3: Critical Threshold */}
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 flex flex-col justify-between">
          <div className="text-[10px] font-mono text-slate-600 uppercase font-semibold">
            Critical Limit
          </div>
          <div className="text-xl font-black font-mono text-red-600 my-1">
            {criticalThreshold}
          </div>
          <div className="text-[9px] font-mono text-slate-500 border-t border-slate-200 pt-1">
            Safety Ceiling
          </div>
        </div>

        {/* Metric 4: Trend Direction */}
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 flex flex-col justify-between">
          <div className="text-[10px] font-mono text-slate-600 uppercase font-semibold">
            Trend Direction
          </div>
          <div className="text-sm font-bold font-mono text-slate-900 my-1 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-slate-700" />
            <span>{trendLabel}</span>
          </div>
          <div className="text-[9px] font-mono text-slate-500 border-t border-slate-200 pt-1">
            5-Sample Window
          </div>
        </div>

        {/* Metric 5: Rate of Change */}
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 flex flex-col justify-between">
          <div className="text-[10px] font-mono text-slate-600 uppercase font-semibold">
            Rate of Change
          </div>
          <div className="text-sm font-bold font-mono text-slate-900 my-1">
            {rateFormatted}
          </div>
          <div className="text-[9px] font-mono text-slate-500 border-t border-slate-200 pt-1">
            ΔCH₄ / Δt
          </div>
        </div>

        {/* Metric 6: Time to Critical */}
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 flex flex-col justify-between">
          <div className="text-[10px] font-mono text-slate-600 uppercase font-semibold">
            Est. Time to Limit
          </div>
          <div className="text-sm font-bold font-mono text-slate-900 my-1">
            {timeFormatted}
          </div>
          <div className="text-[9px] font-mono text-slate-500 border-t border-slate-200 pt-1">
            To 1.25% Ceiling
          </div>
        </div>

        {/* Metric 7: AI Confidence */}
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 flex flex-col justify-between">
          <div className="text-[10px] font-mono text-slate-600 uppercase font-semibold">
            Model Confidence
          </div>
          <div className="text-sm font-bold font-mono text-slate-900 my-1">
            {confidence}
          </div>
          <div className="text-[9px] font-mono text-slate-500 border-t border-slate-200 pt-1">
            Sample Density
          </div>
        </div>

      </div>

      {/* AI Recommendation & Action Guidance Box */}
      <div className={`p-4 rounded-lg border transition-all duration-200 ${
        riskLevel === 'DANGER' || riskLevel === 'CRITICAL' ? 'bg-red-50 border-2 border-red-600 text-red-950' :
        riskLevel === 'HIGH' ? 'bg-amber-50 border border-amber-500 text-amber-950' :
        riskLevel === 'WARNING' ? 'bg-amber-50 border border-amber-400 text-amber-900' :
        'bg-emerald-50 border border-emerald-300 text-emerald-950'
      }`}>
        <div className="flex items-start gap-3">
          <Activity className="w-5 h-5 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="text-xs font-mono font-bold uppercase tracking-wider">
              Supervisor Action Guidance
            </div>
            <p className="text-xs font-semibold leading-relaxed">
              {recommendation}
            </p>
          </div>
        </div>
      </div>

      {/* Model Disclaimer */}
      <div className="flex items-center gap-2 text-[10px] font-mono text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
        <Info className="w-4 h-4 text-slate-600 shrink-0" />
        <span>
          <strong className="text-slate-900">Prediction Notice:</strong> MQ-5 gas sensor readings are prototype approximations; they do not provide laboratory-accurate methane concentration. Predictive risk algorithms model potential gas accumulation vectors based on sliding linear regression and do not guarantee an impending danger event or replace certified safety systems.
        </span>
      </div>
    </section>
  );
}
