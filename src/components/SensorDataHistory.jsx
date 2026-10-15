import React from 'react';
import { Database, Download, Trash2, Clock } from 'lucide-react';
import { telemetryService } from '../services/telemetryService';

export default function SensorDataHistory({ data }) {
  const { history = [], tempUnit } = data;

  const sortedHistory = [...history].reverse();

  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to clear the sensor telemetry log history?')) {
      telemetryService.clearHistory();
    }
  };

  const handleExportCSV = () => {
    if (history.length === 0) {
      alert('No telemetry data available to export.');
      return;
    }

    let csvContent = 'Time,Temperature_C,Humidity_Pct,Methane_CH4_Pct,Vibration_Events_Per_Sec,Tilt_X_Deg,Tilt_Y_Deg,Status\n';

    sortedHistory.forEach((row) => {
      const time = `"${row.timeStr || ''}"`;
      const tempC = row.temperature ?? '';
      const hum = row.humidity ?? '';
      const ch4 = row.methane ?? 0.42;
      const vib = Math.round(row.vibration ?? 1);
      const tiltX = row.tiltX ?? '';
      const tiltY = row.tiltY ?? '';
      const status = `"${row.status || ''}"`;

      csvContent += `${time},${tempC},${hum},${ch4},${vib},${tiltX},${tiltY},${status}\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const timestampStr = new Date().toISOString().replace(/[:.]/g, '-');
    link.setAttribute('href', url);
    link.setAttribute('download', `MINERESQ_Sensor_History_${timestampStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section className="bg-white border border-slate-200 rounded-xl p-5 md:p-6 shadow-sm">
      
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-slate-700" />
            <h2 className="text-base font-extrabold tracking-wide text-slate-900 flex items-center gap-2 font-mono uppercase">
              Sensor Data History
            </h2>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-300">
              LOG TABLE
            </span>
          </div>
          <p className="text-xs text-slate-600 mt-0.5">
            Tabular log of recent telemetry packets (Newest readings on top • Rolling 50 buffer)
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            disabled={history.length === 0}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-mono text-xs font-bold transition-all shadow-sm border border-slate-900"
            title="Download CSV report of telemetry readings"
          >
            <Download className="w-4 h-4 stroke-[2.2]" />
            <span>EXPORT CSV</span>
          </button>

          <button
            onClick={handleClearHistory}
            disabled={history.length === 0}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 disabled:opacity-50 text-slate-700 font-mono text-xs font-semibold transition-all border border-slate-300"
            title="Clear all recorded history logs"
          >
            <Trash2 className="w-4 h-4 stroke-[2]" />
            <span>CLEAR HISTORY</span>
          </button>
        </div>
      </div>

      {/* Table Container */}
      {history.length === 0 ? (
        <div className="text-center py-10 bg-slate-50 rounded-lg border border-slate-200 font-mono text-xs text-slate-500">
          <Clock className="w-8 h-8 mx-auto mb-2 opacity-40 text-slate-600" />
          No sensor readings in history buffer. Waiting for telemetry packets...
        </div>
      ) : (
        <div className="max-h-96 overflow-y-auto border border-slate-200 rounded-lg bg-white shadow-sm">
          <table className="w-full text-left border-collapse font-mono text-xs">
            <thead className="sticky top-0 bg-slate-100 border-b border-slate-200 z-10">
              <tr className="text-slate-700 text-[11px] uppercase tracking-wider">
                <th className="py-3 px-4 font-bold">TIME</th>
                <th className="py-3 px-4 font-bold text-slate-900">TEMP ({tempUnit === 'F' ? '°F' : '°C'})</th>
                <th className="py-3 px-4 font-bold text-slate-900">HUM (%)</th>
                <th className="py-3 px-4 font-bold text-slate-900">CH₄ (%)</th>
                <th className="py-3 px-4 font-bold text-slate-900">VIB (ev/s)</th>
                <th className="py-3 px-4 font-bold text-slate-900">TILT X (°)</th>
                <th className="py-3 px-4 font-bold text-slate-900">TILT Y (°)</th>
                <th className="py-3 px-4 font-bold">SYSTEM STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {sortedHistory.map((row, idx) => {
                const displayTemp = tempUnit === 'F'
                  ? (row.temperature * 9 / 5 + 32).toFixed(1)
                  : row.temperature.toFixed(1);
                
                const isNewest = idx === 0;
                const ch4Val = (row.methane !== undefined ? row.methane : 0.42).toFixed(2);
                const vibVal = Math.round(row.vibration !== undefined ? row.vibration : 1);

                return (
                  <tr
                    key={row.timestamp ? row.timestamp.getTime() + idx : idx}
                    className={`transition-colors hover:bg-slate-50 ${
                      isNewest ? 'bg-slate-50 font-semibold' : 'text-slate-800'
                    }`}
                  >
                    <td className="py-2.5 px-4 font-bold text-slate-900 flex items-center gap-2">
                      <span>{row.timeStr}</span>
                      {isNewest && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-900 text-white font-bold uppercase tracking-tighter">
                          NEWEST
                        </span>
                      )}
                    </td>

                    <td className="py-2.5 px-4 font-semibold text-slate-900">
                      {displayTemp} °{tempUnit}
                    </td>

                    <td className="py-2.5 px-4 font-semibold text-slate-900">
                      {row.humidity.toFixed(1)} %
                    </td>

                    <td className="py-2.5 px-4 font-semibold text-slate-900 font-mono">
                      {ch4Val} %
                    </td>

                    <td className="py-2.5 px-4 font-semibold text-slate-900 font-mono">
                      {vibVal} ev/s
                    </td>

                    <td className="py-2.5 px-4 font-semibold text-slate-900">
                      {row.tiltX > 0 ? `+${row.tiltX.toFixed(1)}` : row.tiltX.toFixed(1)}°
                    </td>

                    <td className="py-2.5 px-4 font-semibold text-slate-900">
                      {row.tiltY > 0 ? `+${row.tiltY.toFixed(1)}` : row.tiltY.toFixed(1)}°
                    </td>

                    <td className="py-2.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                          row.status === 'EMERGENCY'
                            ? 'bg-red-600 text-white border-red-700 animate-pulse'
                            : row.status === 'WARNING'
                            ? 'bg-amber-500 text-slate-950 border-amber-600'
                            : 'bg-emerald-600 text-white border-emerald-700'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          row.status === 'EMERGENCY' ? 'bg-white' : row.status === 'WARNING' ? 'bg-slate-950' : 'bg-white'
                        }`}></span>
                        <span>{row.status}</span>
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Footer Info */}
      <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-slate-500">
        <span>TOTAL RECORDED READINGS: {history.length}</span>
        <span>AUTO-UPDATE ON TELEMETRY TICK</span>
      </div>

    </section>
  );
}
