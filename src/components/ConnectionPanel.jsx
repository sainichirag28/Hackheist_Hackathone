import React, { useState } from 'react';
import { Radio, Bluetooth, Clock, Cable, CheckCircle2, XCircle, AlertCircle, Terminal, Send, ShieldAlert } from 'lucide-react';
import { telemetryService } from '../services/telemetryService';

export default function ConnectionPanel({ data }) {
  const { surfaceReceiver, hc05Connected, lastUpdated, mode, serialConnectionState, lastRawBlock } = data;
  const [isConnecting, setIsConnecting] = useState(false);
  const [showDevConsole, setShowDevConsole] = useState(false);
  const [testSerialText, setTestSerialText] = useState(
`MINERESQ
Temperature: 28.4 C
Humidity: 61.2 %
Tilt X: 2.3 deg
Tilt Y: -1.5 deg
Methane: 0.42 %
Vibration Activity: 1 events/sec
STATUS: NORMAL
--------------------`
  );

  const formatLastReceived = (timestamp) => {
    if (!timestamp) return 'No data received';
    const dateObj = new Date(timestamp);
    const diffSec = Math.floor((new Date() - dateObj) / 1000);
    const timeStr = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    if (diffSec < 2) return `${timeStr} (Just now)`;
    if (diffSec < 60) return `${timeStr} (${diffSec}s ago)`;
    return `${timeStr} (>1m ago)`;
  };

  const handleToggleSerial = async () => {
    if (serialConnectionState !== 'DISCONNECTED' || mode === 'SERIAL') {
      await telemetryService.disconnectSerial();
    } else {
      setIsConnecting(true);
      const success = await telemetryService.connectSerial();
      setIsConnecting(false);
    }
  };

  const handleTestIngestText = () => {
    telemetryService.parseESP32SerialBlock(testSerialText);
  };

  const isConnectedOrLive = serialConnectionState === 'CONNECTED' || serialConnectionState === 'LIVE' || mode === 'SERIAL';

  return (
    <section className="bg-white border border-slate-200 rounded-xl p-5 md:p-6 shadow-sm space-y-5">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-extrabold tracking-wide text-slate-900 flex items-center gap-2 uppercase font-mono">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-900"></span>
              ESP32 #2 Serial Connection Panel
            </h2>

            {/* Connection Status Badge */}
            <span
              className={`text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full border transition-all ${
                serialConnectionState === 'LIVE'
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                  : serialConnectionState === 'CONNECTED'
                  ? 'bg-slate-100 text-slate-800 border-slate-300'
                  : 'bg-slate-100 text-slate-600 border-slate-200'
              }`}
            >
              {serialConnectionState === 'LIVE'
                ? '● LIVE DATA STREAMING'
                : serialConnectionState === 'CONNECTED'
                ? '● ESP32 #2 CONNECTED'
                : '● DISCONNECTED'}
            </span>
          </div>

          <p className="text-xs text-slate-600 mt-1">
            Hardware Pipeline: <span className="font-mono text-slate-900 font-semibold">ESP32 #1 → HC-05 #1 → Bluetooth → HC-05 #2 → ESP32 #2 → USB Serial → Web Serial API</span>
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowDevConsole(!showDevConsole)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white hover:bg-slate-50 font-mono text-xs font-semibold text-slate-700 border border-slate-300 transition-all shadow-sm"
          >
            <Terminal className="w-4 h-4 text-slate-600" />
            <span>{showDevConsole ? 'HIDE CONSOLE' : 'DEV CONSOLE'}</span>
          </button>

          {/* Web Serial API ESP32 Connection Button */}
          <button
            onClick={handleToggleSerial}
            disabled={isConnecting}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-xs font-bold transition-all shadow-sm border ${
              isConnectedOrLive
                ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
                : 'bg-slate-900 hover:bg-slate-800 text-white border-slate-900'
            }`}
          >
            <Cable className="w-4 h-4 stroke-[2.2]" />
            <span>
              {isConnecting
                ? 'OPENING PORT...'
                : isConnectedOrLive
                ? 'DISCONNECT ESP32 #2 SERIAL'
                : 'CONNECT ESP32 #2 SERIAL'}
            </span>
          </button>
        </div>
      </div>

      {/* Hardware Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Surface Receiver Card */}
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-lg border ${isConnectedOrLive ? 'bg-emerald-100 text-emerald-700 border-emerald-300' : 'bg-white text-slate-500 border-slate-200'}`}>
              <Radio className="w-5 h-5 stroke-[2]" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Surface Receiver
              </h3>
              <p className="text-[11px] font-mono text-slate-600">
                ESP32 #2 USB COM Port
              </p>
            </div>
          </div>

          <div className="text-right">
            <div className="flex items-center gap-1.5 justify-end">
              {isConnectedOrLive ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span className="text-xs font-extrabold font-mono text-emerald-700 tracking-wide">
                    {serialConnectionState === 'LIVE' ? 'LIVE' : 'CONNECTED'}
                  </span>
                </>
              ) : (
                <>
                  <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                  <span className="text-xs font-extrabold font-mono text-slate-600 tracking-wide">
                    DISCONNECTED
                  </span>
                </>
              )}
            </div>
            <span className="text-[10px] font-mono text-slate-500">
              {isConnectedOrLive ? '115200 Baud • Web Serial' : 'Plug USB & click connect'}
            </span>
          </div>
        </div>

        {/* HC-05 Connection Card */}
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-lg border ${hc05Connected ? 'bg-slate-200 text-slate-800 border-slate-300' : 'bg-white text-slate-500 border-slate-200'}`}>
              <Bluetooth className="w-5 h-5 stroke-[2]" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                HC-05 #1 ↔ HC-05 #2
              </h3>
              <p className="text-[11px] font-mono text-slate-600">
                Bluetooth SPP Transceiver
              </p>
            </div>
          </div>

          <div className="text-right">
            <div className="flex items-center gap-1.5 justify-end">
              {hc05Connected ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span className="text-xs font-extrabold font-mono text-slate-900 tracking-wide">
                    CONNECTED
                  </span>
                </>
              ) : (
                <>
                  <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                  <span className="text-xs font-extrabold font-mono text-slate-600 tracking-wide">
                    DISCONNECTED
                  </span>
                </>
              )}
            </div>
            <span className="text-[10px] font-mono text-slate-500">
              {hc05Connected ? 'Baud 9600 • Wireless' : 'Awaiting RF Link'}
            </span>
          </div>
        </div>

        {/* Last Telemetry Timestamp Card */}
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-white text-slate-700 border border-slate-200">
              <Clock className="w-5 h-5 stroke-[2]" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Last Telemetry Packet
              </h3>
              <p className="text-[11px] font-mono text-slate-600">
                Serial Ingestion Interval
              </p>
            </div>
          </div>

          <div className="text-right">
            <div className="text-xs font-extrabold font-mono text-slate-900 tracking-wide">
              {formatLastReceived(lastUpdated)}
            </div>
            <span className="text-[10px] font-mono text-slate-500">
              CRC32 Validated
            </span>
          </div>
        </div>

      </div>

      {/* RAW SERIAL DIAGNOSTIC AREA */}
      <div className="bg-slate-50 rounded-lg border border-slate-200 p-4 space-y-2">
        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
          <div className="flex items-center gap-2 font-mono text-xs font-bold text-slate-900">
            <Terminal className="w-4 h-4 text-slate-700" />
            <span>LAST RAW DATA (ESP32 #2 SERIAL DIAGNOSTIC)</span>
          </div>
          <span className="text-[10px] font-mono text-slate-500">
            FORMAT: MULTILINE TEXT BLOCK
          </span>
        </div>

        <pre className="bg-slate-900 p-3 rounded-lg border border-slate-800 font-mono text-xs text-emerald-400 overflow-x-auto leading-relaxed max-h-40">
          {lastRawBlock || 'No raw serial packet received yet.'}
        </pre>
      </div>

      {/* Dev Console */}
      {showDevConsole && (
        <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <span className="text-slate-900 font-bold">MANUAL SERIAL TEXT BLOCK INGESTION TESTER</span>
            <span className="text-[10px] text-slate-500">window.parseESP32SerialBlock(text)</span>
          </div>

          <div className="space-y-3">
            <textarea
              value={testSerialText}
              onChange={(e) => setTestSerialText(e.target.value)}
              rows={6}
              className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-900 font-mono text-xs focus:outline-none focus:border-slate-800"
            />
            <button
              onClick={handleTestIngestText}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-all shadow-sm"
            >
              <Send className="w-3.5 h-3.5" />
              <span>PARSE & INGEST TEXT BLOCK NOW</span>
            </button>
          </div>
        </div>
      )}

      {/* Safety Disclaimer Notice */}
      <div className="flex items-center gap-2 p-3 rounded-lg bg-slate-100 border border-slate-200 text-slate-600 text-xs font-mono">
        <ShieldAlert className="w-4 h-4 text-slate-700 shrink-0" />
        <span>
          <strong className="text-slate-900">SAFETY NOTICE:</strong> This Web Serial interface is for prototype research and demonstration only. It is not certified mine safety equipment.
        </span>
      </div>

    </section>
  );
}
