import React from 'react';
import { Thermometer, Droplets, Compass, RotateCcw, Flame, Activity, TrendingUp, TrendingDown, Minus, Info, AlertTriangle } from 'lucide-react';

export default function SensorCards({ data }) {
  const {
    temperature,
    humidity,
    tiltX,
    tiltY,
    methane = 0.42,
    vibration = 0.06,
    lastUpdated,
    tempUnit,
    sensorStates = {},
    sensorTrends = {}
  } = data;

  const timeStr = lastUpdated
    ? new Date(lastUpdated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    : '--:--:--';

  const displayTemp = tempUnit === 'F' ? (temperature * 9 / 5 + 32).toFixed(1) : temperature.toFixed(1);
  const tempSymbol = `°${tempUnit}`;

  const renderTrendBadge = (trend) => {
    if (!trend) return null;
    const isUp = trend.direction === 'RISING';
    const isDown = trend.direction === 'FALLING';

    return (
      <div className={`flex items-center gap-1 font-mono text-xs font-bold px-2 py-0.5 rounded border ${
        isUp ? 'bg-amber-50 text-amber-800 border-amber-300' :
        isDown ? 'bg-slate-100 text-slate-700 border-slate-200' :
        'bg-slate-100 text-slate-700 border-slate-200'
      }`}>
        {isUp ? <TrendingUp className="w-3.5 h-3.5" /> : isDown ? <TrendingDown className="w-3.5 h-3.5" /> : <Minus className="w-3.5 h-3.5" />}
        <span>{trend.text}</span>
      </div>
    );
  };

  const getStateStyle = (state) => {
    const lvl = state?.level;
    if (lvl === 'CRITICAL' || lvl === 'DANGER') return 'bg-red-100 text-red-900 border-red-300 font-black';
    if (lvl === 'WARNING' || lvl === 'HIGH' || lvl === 'ELEVATED') return 'bg-amber-100 text-amber-900 border-amber-300 font-black';
    return 'bg-emerald-100 text-emerald-800 border-emerald-300 font-bold';
  };

  const cards = [
    {
      id: 'temperature',
      name: 'Temperature',
      value: displayTemp,
      unit: tempSymbol,
      icon: Thermometer,
      state: sensorStates.temperature || { level: 'NORMAL', label: 'NORMAL' },
      trend: sensorTrends.temperature,
      thresholdLegend: 'Normal: <35°C | Warn: 35–40°C | Crit: ≥40°C'
    },
    {
      id: 'humidity',
      name: 'Humidity',
      value: humidity.toFixed(1),
      unit: '%',
      icon: Droplets,
      state: sensorStates.humidity || { level: 'NORMAL', label: 'NORMAL' },
      trend: sensorTrends.humidity,
      thresholdLegend: 'Normal: <75% | Warn: 75–85% | Crit: ≥85%'
    },
    {
      id: 'methane',
      name: 'Methane (CH₄)',
      value: methane.toFixed(2),
      unit: '%',
      icon: Flame,
      state: sensorStates.methane || { level: 'SAFE', label: 'SAFE' },
      trend: sensorTrends.methane,
      thresholdLegend: 'Safe: <0.50% | Warn: 0.50–0.75% | Danger: ≥1.25%'
    },
    {
      id: 'vibration',
      name: 'Vibration Activity',
      value: Math.round(vibration),
      unit: 'events/sec',
      icon: Activity,
      state: sensorStates.vibration || { level: 'SAFE', label: 'SAFE' },
      trend: sensorTrends.vibration,
      thresholdLegend: 'Safe: <3 ev/s | Warn: 3–7 ev/s | Danger: ≥8 ev/s'
    },
    {
      id: 'tiltX',
      name: 'Tilt X Axis',
      value: (tiltX > 0 ? `+${tiltX.toFixed(1)}` : tiltX.toFixed(1)),
      unit: '°',
      icon: Compass,
      state: sensorStates.tiltX || { level: 'NORMAL', label: 'NORMAL' },
      trend: sensorTrends.tiltX,
      thresholdLegend: 'Normal: <30° | Warn: 30–45° | Crit: ≥45°'
    },
    {
      id: 'tiltY',
      name: 'Tilt Y Axis',
      value: (tiltY > 0 ? `+${tiltY.toFixed(1)}` : tiltY.toFixed(1)),
      unit: '°',
      icon: RotateCcw,
      state: sensorStates.tiltY || { level: 'NORMAL', label: 'NORMAL' },
      trend: sensorTrends.tiltY,
      thresholdLegend: 'Normal: <30° | Warn: 30–45° | Crit: ≥45°'
    }
  ];

  return (
    <section className="space-y-4">
      
      {/* Header & Prototype Disclaimer Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-base font-extrabold tracking-wide text-slate-900 flex items-center gap-2 uppercase font-mono">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-900"></span>
            SENSOR MONITORING TELEMETRY
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Real-time parameter readouts, condition levels, and live trend indicators ({data.dataSource || 'DEMO DATA'})
          </p>
        </div>

        {/* Prototype Thresholds Disclaimer Badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-300 text-amber-900 text-xs font-mono">
          <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600" />
          <span className="font-semibold">
            PROTOTYPE DEMO THRESHOLDS — NOT CERTIFIED MINE SAFETY LIMITS
          </span>
        </div>
      </div>

      {/* Grid of 6 Sensor Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.id}
              className={`bg-white border rounded-xl p-4 shadow-sm transition-all duration-200 flex flex-col justify-between relative group ${
                card.state.level === 'CRITICAL' || card.state.level === 'DANGER'
                  ? 'border-red-400 bg-red-50/20'
                  : card.state.level === 'WARNING' || card.state.level === 'HIGH' || card.state.level === 'ELEVATED'
                  ? 'border-amber-400 bg-amber-50/20'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              {/* Header: Icon, Title & Condition Pill */}
              <div className="flex items-center justify-between mb-3 relative z-10">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg border bg-slate-100 border-slate-200 text-slate-700 shadow-sm">
                    <Icon className="w-4 h-4 stroke-[2.2]" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 leading-tight">
                      {card.name}
                    </h3>
                    <p className="text-[9px] font-mono text-slate-500 uppercase">
                      #{card.id}
                    </p>
                  </div>
                </div>

                {/* State Condition Pill (SAFE / WARNING / DANGER) */}
                <span className={`text-[9px] font-mono tracking-wider px-2 py-0.5 rounded-full border ${getStateStyle(card.state)}`}>
                  {card.state.label}
                </span>
              </div>

              {/* Readout Value & Trend Indicator */}
              <div className="my-2 relative z-10 flex items-baseline justify-between">
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl lg:text-3xl font-black font-mono text-slate-900 tracking-tight">
                    {card.value}
                  </span>
                  <span className="text-xs font-bold font-mono text-slate-600">
                    {card.unit}
                  </span>
                </div>

                {/* Trend Badge (Rising, Falling, Stable) */}
                {renderTrendBadge(card.trend)}
              </div>

              {/* Demo Threshold Legend */}
              <div className="mt-2 p-2 rounded-lg bg-slate-50 border border-slate-200 text-[9px] font-mono text-slate-600">
                <div className="flex items-center gap-1 text-slate-800 font-semibold mb-0.5">
                  <Info className="w-3 h-3 text-slate-600 shrink-0" />
                  <span>DEMO THRESHOLDS:</span>
                </div>
                <div className="text-slate-600 tracking-tight leading-tight">
                  {card.thresholdLegend}
                </div>
              </div>

              {/* Card Footer: Timestamp */}
              <div className="mt-3 pt-2 border-t border-slate-200 flex items-center justify-between text-[9px] font-mono text-slate-500 relative z-10">
                <span>UPDATED:</span>
                <span className="text-slate-800 font-semibold">{timeStr}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Hardware & Sensor Disclaimer */}
      <div className="text-[11px] font-mono text-slate-600 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-slate-600 shrink-0" />
          <span>
            <strong className="text-slate-900">Hardware & Sensor Disclaimer:</strong> MQ-5 analog gas readings provide prototype volume estimations; they do not provide laboratory-accurate methane concentration. Risk trend predictions estimate potential accumulation vectors and do not guarantee an impending danger event. Vibration Activity is measured in discrete impulse events/sec.
          </span>
        </div>
      </div>
    </section>
  );
}
