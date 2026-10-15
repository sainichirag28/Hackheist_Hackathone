import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine
} from 'recharts';
import { Thermometer, Droplets, Compass, RotateCcw, Flame, Activity, Play, Pause } from 'lucide-react';
import { telemetryService } from '../services/telemetryService';

export default function RealTimeSensorTrends({ data }) {
  const { history, temperature, humidity, tiltX, tiltY, methane = 0.42, vibration = 0.06, tempUnit, isPaused } = data;

  const formattedHistory = history.map(point => ({
    ...point,
    displayTemp: tempUnit === 'F' ? Number((point.temperature * 9 / 5 + 32).toFixed(1)) : point.temperature,
    displayTiltX: point.tiltX,
    displayTiltY: point.tiltY,
    methane: point.methane !== undefined ? point.methane : 0.42,
    vibration: point.vibration !== undefined ? point.vibration : 0.06
  }));

  const displayTempCurrent = tempUnit === 'F' ? (temperature * 9 / 5 + 32).toFixed(1) : temperature.toFixed(1);
  const tempUnitSymbol = `°${tempUnit}`;

  const CustomChartTooltip = ({ active, payload, label, unitSymbol, metricName }) => {
    if (active && payload && payload.length) {
      const val = payload[0].value;
      return (
        <div className="bg-white border border-slate-300 p-2.5 rounded-lg shadow-md font-mono text-xs text-slate-900 z-50">
          <p className="text-slate-500 text-[10px] border-b border-slate-200 pb-1 mb-1">
            TIME: {label}
          </p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: payload[0].color }}></span>
            <span className="font-semibold text-slate-700">{metricName}:</span>
            <span className="font-bold text-slate-900">
              {val} {unitSymbol}
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  const handleTogglePause = () => {
    telemetryService.togglePause();
  };

  const handleUnitToggle = (unit) => {
    telemetryService.setTempUnit(unit);
  };

  const chartsConfig = [
    {
      id: 'temperature',
      title: 'Temperature vs Time',
      currentValue: displayTempCurrent,
      unit: tempUnitSymbol,
      dataKey: 'displayTemp',
      color: '#d97706',
      gradientId: 'tempGrad',
      icon: Thermometer,
      domain: tempUnit === 'F' ? [50, 140] : [10, 60],
      metricName: 'Temperature'
    },
    {
      id: 'humidity',
      title: 'Humidity vs Time',
      currentValue: humidity.toFixed(1),
      unit: '%',
      dataKey: 'humidity',
      color: '#0284c7',
      gradientId: 'humGrad',
      icon: Droplets,
      domain: [0, 100],
      metricName: 'Humidity'
    },
    {
      id: 'methane',
      title: 'Methane (CH₄) vs Time',
      currentValue: methane.toFixed(2),
      unit: '%',
      dataKey: 'methane',
      color: '#ea580c',
      gradientId: 'methaneGrad',
      icon: Flame,
      domain: [0, 2.0],
      metricName: 'Methane CH₄ Concentration',
      referenceLines: [
        { y: 0.50, label: 'WARN 0.50%', color: '#d97706' },
        { y: 0.75, label: 'HIGH 0.75%', color: '#ea580c' },
        { y: 1.25, label: 'DANGER 1.25%', color: '#dc2626' }
      ]
    },
    {
      id: 'vibration',
      title: 'Vibration Activity vs Time',
      currentValue: Math.round(vibration),
      unit: 'events/sec',
      dataKey: 'vibration',
      color: '#059669',
      gradientId: 'vibGrad',
      icon: Activity,
      domain: [0, 15],
      metricName: 'Vibration Activity',
      referenceLines: [
        { y: 3, label: 'WARN 3 ev/s', color: '#d97706' },
        { y: 8, label: 'DANGER 8 ev/s', color: '#dc2626' }
      ]
    },
    {
      id: 'tiltX',
      title: 'Tilt X vs Time',
      currentValue: (tiltX > 0 ? `+${tiltX.toFixed(1)}` : tiltX.toFixed(1)),
      unit: '°',
      dataKey: 'displayTiltX',
      color: '#2563eb',
      gradientId: 'tiltXGrad',
      icon: Compass,
      domain: [-45, 45],
      metricName: 'Tilt X'
    },
    {
      id: 'tiltY',
      title: 'Tilt Y vs Time',
      currentValue: (tiltY > 0 ? `+${tiltY.toFixed(1)}` : tiltY.toFixed(1)),
      unit: '°',
      dataKey: 'displayTiltY',
      color: '#7c3aed',
      gradientId: 'tiltYGrad',
      icon: RotateCcw,
      domain: [-45, 45],
      metricName: 'Tilt Y'
    }
  ];

  return (
    <section className="bg-white border border-slate-200 rounded-xl p-5 md:p-6 shadow-sm relative">
      
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-slate-200 pb-4">
        
        {/* Title & LIVE Indicator */}
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-base font-extrabold tracking-wide text-slate-900 flex items-center gap-2 uppercase font-mono">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-900"></span>
              Real-Time Sensor Trends
            </h2>

            {/* Pulsing LIVE Indicator */}
            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 border border-slate-300 text-slate-800 font-mono text-[11px] font-bold tracking-widest uppercase">
              <span className="relative flex h-2 w-2">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isPaused ? 'bg-amber-500' : 'bg-red-500'} opacity-75`}></span>
                <span className={`relative inline-flex rounded-full h-2 w-2 ${isPaused ? 'bg-amber-500' : 'bg-red-600'}`}></span>
              </span>
              <span>{isPaused ? 'PAUSED' : 'LIVE TICKER'}</span>
            </div>
          </div>

          <p className="text-xs text-slate-600 mt-1">
            Continuously updating multi-sensor line graphs (rolling 50 samples buffer)
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          
          {/* Temperature Unit Button */}
          <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-300 font-mono text-xs">
            <button
              onClick={() => handleUnitToggle('C')}
              className={`px-2.5 py-1 rounded-md font-bold transition-all ${
                tempUnit === 'C' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              °C
            </button>
            <button
              onClick={() => handleUnitToggle('F')}
              className={`px-2.5 py-1 rounded-md font-bold transition-all ${
                tempUnit === 'F' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              °F
            </button>
          </div>

          {/* Pause / Resume Button */}
          <button
            onClick={handleTogglePause}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-xs border font-bold transition-all shadow-sm ${
              isPaused
                ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 border-amber-600'
                : 'bg-slate-900 hover:bg-slate-800 text-white border-slate-900'
            }`}
          >
            {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
            <span>{isPaused ? 'RESUME STREAM' : 'PAUSE TICKER'}</span>
          </button>

        </div>
      </div>

      {/* Grid of 6 Real-Time Sensor Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {chartsConfig.map((cfg) => {
          const IconComponent = cfg.icon;
          return (
            <div
              key={cfg.id}
              className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col justify-between shadow-sm hover:border-slate-300 transition-colors"
            >
              {/* Header Above Graph */}
              <div className="flex items-center justify-between mb-3 border-b border-slate-200 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg border bg-slate-100 border-slate-200 text-slate-700">
                    <IconComponent className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 font-mono tracking-wide">
                      {cfg.title}
                    </h3>
                    <span className="text-[10px] font-mono text-slate-500">
                      X: Time (s) | Y: Value ({cfg.unit})
                    </span>
                  </div>
                </div>

                {/* Readout */}
                <div className="text-right">
                  <span className="text-xs text-slate-500 block font-mono text-[10px] uppercase">
                    CURRENT VALUE
                  </span>
                  <div className="flex items-baseline gap-1 justify-end">
                    <span className="text-xl font-black font-mono text-slate-900 tracking-tight">
                      {cfg.currentValue}
                    </span>
                    <span className="text-xs font-bold font-mono text-slate-600">
                      {cfg.unit}
                    </span>
                  </div>
                </div>
              </div>

              {/* Chart Canvas Container */}
              <div className="w-full h-52 pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={formattedHistory} margin={{ top: 10, right: 15, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id={cfg.gradientId} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={cfg.color} stopOpacity={0.15} />
                        <stop offset="95%" stopColor={cfg.color} stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis
                      dataKey="timeStr"
                      stroke="#64748b"
                      tick={{ fill: '#475569', fontSize: 10, fontFamily: 'JetBrains Mono' }}
                      interval="preserveStartEnd"
                      minTickGap={25}
                    />
                    <YAxis
                      stroke="#64748b"
                      tick={{ fill: '#475569', fontSize: 10, fontFamily: 'JetBrains Mono' }}
                      domain={cfg.domain}
                      unit={cfg.unit}
                    />
                    <Tooltip
                      content={
                        <CustomChartTooltip
                          unitSymbol={cfg.unit}
                          metricName={cfg.metricName}
                        />
                      }
                    />
                    {cfg.referenceLines && cfg.referenceLines.map((ref, idx) => (
                      <ReferenceLine
                        key={idx}
                        y={ref.y}
                        stroke={ref.color}
                        strokeDasharray="4 4"
                        label={{
                          value: ref.label,
                          fill: ref.color,
                          fontSize: 9,
                          position: 'top',
                          fontFamily: 'JetBrains Mono'
                        }}
                      />
                    ))}
                    <Line
                      type="monotone"
                      dataKey={cfg.dataKey}
                      stroke={cfg.color}
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 4, fill: cfg.color, stroke: '#ffffff', strokeWidth: 2 }}
                      isAnimationActive={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 mt-2 pt-2 border-t border-slate-200">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: cfg.color }}></span>
                  <span>WINDOW: {formattedHistory.length} READINGS</span>
                </div>
                <span>AUTO-ROLLING</span>
              </div>
            </div>
          );
        })}
      </div>

    </section>
  );
}
