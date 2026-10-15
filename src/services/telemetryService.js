/**
 * MINERESQ Telemetry & Web Serial Integration Service
 * 
 * Hardware Telemetry Architecture:
 * ESP32 #1 -> HC-05 #1 -> Bluetooth -> HC-05 #2 -> ESP32 #2 -> USB Serial -> Computer -> Web Serial API
 * 
 * Configurable Methane (CH4) & Vibration Thresholds:
 * - Methane: SAFE <0.50%, WARNING 0.50%-0.75%, HIGH 0.75%-1.25%, DANGER/CRITICAL >=1.25%
 * - Vibration: NORMAL <0.15g, ELEVATED 0.15g-0.35g, SEISMIC >=0.35g
 * 
 * Prototype Disclaimer:
 * Prototype/demo thresholds — final mine deployment requires certified calibrated gas monitoring equipment and site-specific safety limits.
 */

export const METHANE_CONFIG = {
  SAFE: 0.50,       // CH4 < 0.50%
  WARNING: 0.75,    // 0.50% <= CH4 < 0.75%
  HIGH: 1.25,       // 0.75% <= CH4 < 1.25%
  CRITICAL: 1.25    // CH4 >= 1.25%
};

export const VIBRATION_CONFIG = {
  SAFE: 3,       // < 3 events/sec -> SAFE
  WARNING: 7,    // 3 - 7 events/sec -> WARNING
  DANGER: 8      // >= 8 events/sec -> DANGER
};

export class TelemetryService {
  constructor() {
    this.listeners = new Set();
    this.mode = 'MOCK'; // 'MOCK' | 'SERIAL'
    this.serialConnectionState = 'DISCONNECTED'; // 'DISCONNECTED' | 'CONNECTED' | 'LIVE'
    this.lastRawBlock = `MINERESQ
Temperature: 28.4 C
Humidity: 61.2 %
Tilt X: 2.3 deg
Tilt Y: -1.5 deg
Methane: 0.42 %
Vibration Activity: 1 events/sec
STATUS: NORMAL
--------------------`;

    this.isPaused = false;
    this.serialPort = null;
    this.reader = null;
    this.manualStatusOverride = null; // null | 'SAFE' | 'WARNING' | 'EMERGENCY'
    this.tempUnit = 'C'; // 'C' | 'F'

    // Initial Telemetry Data
    this.currentData = {
      temperature: 28.4,
      humidity: 61.2,
      tiltX: 2.3,
      tiltY: -1.5,
      methane: 0.42,      // Methane CH4 percentage %
      vibration: 1,       // Vibration Activity in events/sec
      surfaceReceiver: false,
      hc05Connected: false,
      lastUpdated: new Date(),
      status: 'SAFE',
      dataSource: 'DEMO DATA (SIMULATED)'
    };

    // Status Transition Audit Log
    this.statusLogs = [
      {
        id: Date.now() - 600000,
        timeStr: new Date(Date.now() - 600000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        timestamp: new Date(Date.now() - 600000),
        prevStatus: 'INITIALIZING',
        newStatus: 'SAFE',
        reason: 'System booted & telemetry verified optimal'
      }
    ];

    // Buffer for history (up to 50 data points for real-time charts)
    this.history = [];
    this.initHistory();

    // Start simulation ticker (fallback)
    this.timer = setInterval(() => this.tickMockData(), 2000);

    // Bind window globals for external serial-to-web bridges or devtools console
    this.bindWindowGlobals();
  }

  bindWindowGlobals() {
    if (typeof window !== 'undefined') {
      window.updateSensorData = (data) => this.updateSensorData(data);
      window.parseESP32SerialBlock = (textBlock) => this.parseESP32SerialBlock(textBlock);
      window.telemetryService = this;
    }
  }

  initHistory() {
    const now = Date.now();
    for (let i = 45; i >= 0; i--) {
      const time = new Date(now - i * 2000);
      const timeStr = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      const temp = Number((24 + Math.sin(i / 3) * 1.5 + (Math.random() * 0.4)).toFixed(1));
      const hum = Number((58 + Math.cos(i / 3) * 2 + (Math.random() * 0.8)).toFixed(1));
      const tX = Number((1.0 + Math.sin(i / 4) * 0.5 + (Math.random() * 0.2 - 0.1)).toFixed(1));
      const tY = Number((-0.5 + Math.cos(i / 4) * 0.5 + (Math.random() * 0.2 - 0.1)).toFixed(1));

      // Realistic increasing methane demo trend (0.32% up to ~0.46%)
      const methaneVal = Number((0.32 + ((45 - i) * 0.0035) + (Math.random() * 0.008 - 0.004)).toFixed(2));
      const vibrationVal = Number((0.05 + (Math.random() * 0.03)).toFixed(2));

      this.history.push({
        timeStr,
        timestamp: time,
        temperature: temp,
        humidity: hum,
        tiltX: tX,
        tiltY: tY,
        methane: methaneVal,
        vibration: vibrationVal,
        status: 'SAFE'
      });
    }
  }

  subscribe(callback) {
    this.listeners.add(callback);
    callback(this.getDataState());
    return () => this.listeners.delete(callback);
  }

  notify() {
    const dataState = this.getDataState();
    this.listeners.forEach(cb => cb(dataState));
  }

  getDataState() {
    const tempState = this.getTempState(this.currentData.temperature);
    const humState = this.getHumidityState(this.currentData.humidity);
    const tiltXState = this.getTiltState(this.currentData.tiltX);
    const tiltYState = this.getTiltState(this.currentData.tiltY);
    const methaneState = this.getMethaneState(this.currentData.methane);
    const vibrationState = this.getVibrationState(this.currentData.vibration);

    const tempTrend = this.calculateTrend('temperature');
    const humTrend = this.calculateTrend('humidity');
    const tiltXTrend = this.calculateTrend('tiltX');
    const tiltYTrend = this.calculateTrend('tiltY');
    const methaneTrend = this.calculateTrend('methane');
    const vibrationTrend = this.calculateTrend('vibration');

    const aiRisk = this.getMethaneAIRisk();

    return {
      ...this.currentData,
      history: [...this.history],
      statusLogs: [...this.statusLogs],
      sensorStates: {
        temperature: tempState,
        humidity: humState,
        tiltX: tiltXState,
        tiltY: tiltYState,
        methane: methaneState,
        vibration: vibrationState
      },
      sensorTrends: {
        temperature: tempTrend,
        humidity: humTrend,
        tiltX: tiltXTrend,
        tiltY: tiltYTrend,
        methane: methaneTrend,
        vibration: vibrationTrend
      },
      aiRisk,
      mode: this.mode,
      serialConnectionState: this.serialConnectionState,
      lastRawBlock: this.lastRawBlock,
      isPaused: this.isPaused,
      tempUnit: this.tempUnit,
      manualOverride: this.manualStatusOverride
    };
  }

  setTempUnit(unit) {
    this.tempUnit = unit;
    this.notify();
  }

  togglePause() {
    this.isPaused = !this.isPaused;
    this.notify();
  }

  clearHistory() {
    this.history = [];
    this.notify();
  }

  /**
   * AI PREDICTIVE RISK ENGINE
   * Calculates rate of change (methaneRate = ΔCH4 / elapsedMinutes)
   * Estimates timeToCriticalMin = (1.25 - currentCH4) / methaneRate
   */
  getMethaneAIRisk() {
    const currentCH4 = this.currentData.methane;
    let methaneRate = 0; // % / min

    if (this.history.length >= 5) {
      const pastItem = this.history[Math.max(0, this.history.length - 10)];
      const deltaCH4 = currentCH4 - pastItem.methane;
      const deltaSec = Math.max(1, (new Date(this.currentData.lastUpdated) - new Date(pastItem.timestamp)) / 1000);
      const deltaMin = deltaSec / 60;
      methaneRate = Number((deltaCH4 / deltaMin).toFixed(3));
    }

    let timeToCriticalMin = null;
    let riskScore = 12;
    let riskLevel = 'SAFE';
    let recommendation = '✅ OPTIMAL: Atmospheric gas levels stable. Main ventilation active.';

    if (methaneRate > 0.001) {
      const remainingTarget = METHANE_CONFIG.CRITICAL - currentCH4;
      if (remainingTarget > 0) {
        timeToCriticalMin = Number((remainingTarget / methaneRate).toFixed(1));
      } else {
        timeToCriticalMin = 0;
      }
    }

    if (currentCH4 >= METHANE_CONFIG.CRITICAL || (timeToCriticalMin !== null && timeToCriticalMin <= 5)) {
      riskScore = 95;
      riskLevel = 'DANGER';
      recommendation = '🚨 DANGER: Methane at critical threshold (≥1.25%). Initiate main ventilation fan boost and evacuate sector immediately.';
    } else if (currentCH4 >= METHANE_CONFIG.HIGH || (timeToCriticalMin !== null && timeToCriticalMin <= 15)) {
      riskScore = 78;
      riskLevel = 'HIGH';
      recommendation = '⚠️ HIGH RISK: Increase ventilation air velocity by +35% and dispatch gas monitoring technician.';
    } else if (currentCH4 >= METHANE_CONFIG.WARNING || (timeToCriticalMin !== null && timeToCriticalMin <= 30)) {
      riskScore = 48;
      riskLevel = 'WARNING';
      recommendation = '⚡ CAUTION: Methane accumulation detected. Monitor CH4 rate of change and verify secondary duct seals.';
    } else {
      riskScore = Math.min(30, Math.max(10, Math.round((currentCH4 / METHANE_CONFIG.SAFE) * 25)));
      riskLevel = 'SAFE';
      recommendation = '✅ OPTIMAL: Atmospheric methane concentration within safe limits. Continuous monitoring active.';
    }

    let confidence = 'Low';
    if (this.history.length >= 20) {
      confidence = 'High';
    } else if (this.history.length >= 8) {
      confidence = 'Medium';
    }

    const methaneTrendObj = this.calculateTrend('methane');
    const trendLabel = methaneTrendObj.direction === 'RISING' ? 'Rising' : (methaneTrendObj.direction === 'FALLING' ? 'Falling' : 'Stable');

    return {
      currentCH4,
      methaneRate,
      rateFormatted: methaneRate > 0 ? `+${methaneRate.toFixed(2)} %/min` : `${methaneRate.toFixed(2)} %/min`,
      timeToCriticalMin,
      timeFormatted: timeToCriticalMin !== null && timeToCriticalMin > 0 ? `${timeToCriticalMin} min` : (currentCH4 >= 1.25 ? '0 min (LIMIT BREACHED)' : 'N/A (Stable)'),
      riskScore,
      riskLevel,
      trendLabel,
      confidence,
      criticalThreshold: '1.25%',
      recommendation
    };
  }

  /**
   * PRIMARY RECEIVER FUNCTION FOR ESP32 #2 REAL-TIME DATA
   */
  updateSensorData(data) {
    if (!data) return;

    const temp = typeof data.temperature === 'number' ? data.temperature : parseFloat(data.temperature);
    const hum = typeof data.humidity === 'number' ? data.humidity : parseFloat(data.humidity);
    const tiltX = typeof data.tiltX === 'number' ? data.tiltX : parseFloat(data.tiltX);
    const tiltY = typeof data.tiltY === 'number' ? data.tiltY : parseFloat(data.tiltY);
    const methane = typeof data.methane === 'number' ? data.methane : parseFloat(data.methane ?? data.ch4);
    const vibration = typeof data.vibration === 'number' ? data.vibration : parseFloat(data.vibration ?? data.vib);

    if (!isNaN(temp)) this.currentData.temperature = temp;
    if (!isNaN(hum)) this.currentData.humidity = hum;
    if (!isNaN(tiltX)) this.currentData.tiltX = tiltX;
    if (!isNaN(tiltY)) this.currentData.tiltY = tiltY;
    if (!isNaN(methane)) this.currentData.methane = methane;
    if (!isNaN(vibration)) this.currentData.vibration = vibration;

    // Map status strings
    let inputStatus = data.status ? String(data.status).toUpperCase() : null;
    if (inputStatus === 'NORMAL') inputStatus = 'SAFE';
    if (inputStatus === 'CRITICAL') inputStatus = 'EMERGENCY';

    let finalStatus;
    let reason;

    if (inputStatus && ['SAFE', 'WARNING', 'EMERGENCY'].includes(inputStatus)) {
      finalStatus = inputStatus;
      reason = `ESP32 #2 Serial Payload Status: ${inputStatus}`;
    } else {
      const evalRes = this.evaluateStatus(
        this.currentData.temperature,
        this.currentData.humidity,
        this.currentData.tiltX,
        this.currentData.tiltY,
        this.currentData.methane,
        this.currentData.vibration
      );
      finalStatus = typeof evalRes === 'string' ? evalRes : evalRes.status;
      reason = typeof evalRes === 'string' ? 'Manual override' : evalRes.reason;
    }

    this.currentData.lastUpdated = data.timestamp ? new Date(data.timestamp) : new Date();
    this.currentData.surfaceReceiver = true;
    this.currentData.hc05Connected = true;
    this.mode = 'SERIAL';
    this.currentData.dataSource = 'ESP32 #2 SERIAL DATA';

    this.updateSystemStatus(finalStatus, reason);
    this.addHistoryPoint();
    this.notify();
  }

  /**
   * ESP32 Serial Text Parser for Multiline Format:
   * MINERESQ
   * Temperature: 28.4 C
   * Humidity: 61.2 %
   * Tilt X: 2.3 deg
   * Tilt Y: -1.5 deg
   * Methane: 0.42 %
   * Vibration: 0.06 g
   * STATUS: NORMAL
   * --------------------
   */
  parseESP32SerialBlock(textBlock) {
    if (!textBlock || !textBlock.trim()) return null;

    const rawClean = textBlock.trim();
    this.lastRawBlock = rawClean;

    let temperature = null;
    let humidity = null;
    let tiltX = null;
    let tiltY = null;
    let methane = null;
    let vibration = null;
    let status = null;

    const lines = rawClean.split('\n');
    for (let line of lines) {
      line = line.trim();
      if (!line || line.startsWith('-') || line.toUpperCase() === 'MINERESQ') continue;

      if (/temperature:/i.test(line)) {
        const match = line.match(/temperature:\s*([-\d.]+)/i);
        if (match) temperature = parseFloat(match[1]);
      } else if (/humidity:/i.test(line)) {
        const match = line.match(/humidity:\s*([-\d.]+)/i);
        if (match) humidity = parseFloat(match[1]);
      } else if (/tilt x:/i.test(line)) {
        const match = line.match(/tilt x:\s*([-\d.]+)/i);
        if (match) tiltX = parseFloat(match[1]);
      } else if (/tilt y:/i.test(line)) {
        const match = line.match(/tilt y:\s*([-\d.]+)/i);
        if (match) tiltY = parseFloat(match[1]);
      } else if (/methane:|ch4:/i.test(line)) {
        const match = line.match(/(?:methane|ch4):\s*([-\d.]+)/i);
        if (match) methane = parseFloat(match[1]);
      } else if (/vibration:|vib:/i.test(line)) {
        const match = line.match(/(?:vibration|vib):\s*([-\d.]+)/i);
        if (match) vibration = parseFloat(match[1]);
      } else if (/status:/i.test(line)) {
        const match = line.match(/status:\s*(\w+)/i);
        if (match) status = match[1].toUpperCase();
      }
    }

    if (status === 'NORMAL') status = 'SAFE';
    if (status === 'CRITICAL') status = 'EMERGENCY';

    const payload = {
      temperature: temperature ?? this.currentData.temperature,
      humidity: humidity ?? this.currentData.humidity,
      tiltX: tiltX ?? this.currentData.tiltX,
      tiltY: tiltY ?? this.currentData.tiltY,
      methane: methane ?? this.currentData.methane,
      vibration: vibration ?? this.currentData.vibration,
      status: status || 'SAFE',
      timestamp: new Date().toISOString()
    };

    this.updateSensorData(payload);
    return payload;
  }

  updateSystemStatus(newStatus, reason = 'Automated threshold evaluation') {
    const prevStatus = this.currentData.status;
    if (prevStatus !== newStatus) {
      this.currentData.status = newStatus;
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      this.statusLogs.unshift({
        id: Date.now() + Math.random(),
        timeStr,
        timestamp: new Date(),
        prevStatus,
        newStatus,
        reason
      });
      if (this.statusLogs.length > 30) {
        this.statusLogs.pop();
      }
    }
  }

  setManualStatusOverride(status) {
    this.manualStatusOverride = status;
    if (status) {
      if (status === 'WARNING') {
        this.currentData.temperature = 38.5;
        this.currentData.humidity = 78.2;
        this.currentData.tiltX = 18.4;
        this.currentData.tiltY = 12.1;
        this.currentData.methane = 0.62;
        this.currentData.vibration = 0.18;
        this.updateSystemStatus('WARNING', 'Manual Test Override: Warning State Forced');
      } else if (status === 'EMERGENCY') {
        this.currentData.temperature = 52.0;
        this.currentData.humidity = 89.5;
        this.currentData.tiltX = 34.8;
        this.currentData.tiltY = -28.2;
        this.currentData.methane = 1.35;
        this.currentData.vibration = 0.42;
        this.updateSystemStatus('EMERGENCY', 'Manual Test Override: Emergency State Forced');
      } else if (status === 'SAFE') {
        this.currentData.temperature = 25.2;
        this.currentData.humidity = 56.0;
        this.currentData.tiltX = 1.1;
        this.currentData.tiltY = -0.5;
        this.currentData.methane = 0.35;
        this.currentData.vibration = 0.05;
        this.updateSystemStatus('SAFE', 'Manual Test Override: Safe State Forced');
      }
    } else {
      const calculatedStatus = this.evaluateStatus(
        this.currentData.temperature,
        this.currentData.humidity,
        this.currentData.tiltX,
        this.currentData.tiltY,
        this.currentData.methane,
        this.currentData.vibration
      );
      const newStat = typeof calculatedStatus === 'string' ? calculatedStatus : calculatedStatus.status;
      this.updateSystemStatus(newStat, 'Auto-Evaluation Restored');
    }
    this.notify();
  }

  getTempState(tempC) {
    if (tempC >= 40) return { level: 'CRITICAL', label: 'CRITICAL', badgeClass: 'bg-red-500/20 text-red-400 border-red-500/40 animate-pulse' };
    if (tempC >= 35) return { level: 'WARNING', label: 'WARNING', badgeClass: 'bg-amber-500/20 text-amber-400 border-amber-500/40' };
    return { level: 'NORMAL', label: 'NORMAL', badgeClass: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' };
  }

  getHumidityState(hum) {
    if (hum >= 85) return { level: 'CRITICAL', label: 'CRITICAL', badgeClass: 'bg-red-500/20 text-red-400 border-red-500/40 animate-pulse' };
    if (hum >= 75) return { level: 'WARNING', label: 'WARNING', badgeClass: 'bg-amber-500/20 text-amber-400 border-amber-500/40' };
    return { level: 'NORMAL', label: 'NORMAL', badgeClass: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' };
  }

  getTiltState(tiltDeg) {
    const absTilt = Math.abs(tiltDeg);
    if (absTilt >= 45) return { level: 'CRITICAL', label: 'CRITICAL', badgeClass: 'bg-red-500/20 text-red-400 border-red-500/40 animate-pulse' };
    if (absTilt >= 30) return { level: 'WARNING', label: 'WARNING', badgeClass: 'bg-amber-500/20 text-amber-400 border-amber-500/40' };
    return { level: 'NORMAL', label: 'NORMAL', badgeClass: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' };
  }

  getMethaneState(ch4) {
    if (ch4 >= METHANE_CONFIG.CRITICAL) {
      return { level: 'CRITICAL', label: 'DANGER', badgeClass: 'bg-red-500/20 text-red-400 border-red-500/40 animate-pulse' };
    }
    if (ch4 >= METHANE_CONFIG.HIGH) {
      return { level: 'HIGH', label: 'HIGH', badgeClass: 'bg-orange-500/20 text-orange-400 border-orange-500/40' };
    }
    if (ch4 >= METHANE_CONFIG.WARNING) {
      return { level: 'WARNING', label: 'WARNING', badgeClass: 'bg-amber-500/20 text-amber-400 border-amber-500/40' };
    }
    return { level: 'SAFE', label: 'SAFE', badgeClass: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' };
  }

  getVibrationState(vib) {
    if (vib >= VIBRATION_CONFIG.DANGER) {
      return { level: 'CRITICAL', label: 'DANGER', badgeClass: 'bg-red-500/20 text-red-400 border-red-500/40 animate-pulse' };
    }
    if (vib >= VIBRATION_CONFIG.SAFE) {
      return { level: 'WARNING', label: 'WARNING', badgeClass: 'bg-amber-500/20 text-amber-400 border-amber-500/40' };
    }
    return { level: 'NORMAL', label: 'SAFE', badgeClass: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' };
  }

  calculateTrend(key) {
    if (!this.history || this.history.length < 3) {
      return { direction: 'STABLE', symbol: '→', text: 'STABLE', color: 'text-slate-400' };
    }
    const curr = this.currentData[key];
    const prev = this.history[Math.max(0, this.history.length - 4)][key];
    const diff = Number((curr - prev).toFixed(2));

    if (diff > 0.01) {
      return { direction: 'RISING', symbol: '↑', text: `↑ +${diff}`, color: 'text-amber-400' };
    }
    if (diff < -0.01) {
      return { direction: 'FALLING', symbol: '↓', text: `↓ ${diff}`, color: 'text-cyan-400' };
    }
    return { direction: 'STABLE', symbol: '→', text: '→ STABLE', color: 'text-emerald-400' };
  }

  evaluateStatus(temp, hum, tiltX, tiltY, methane, vibration) {
    if (this.manualStatusOverride) return this.manualStatusOverride;

    const ch4 = methane ?? this.currentData.methane;
    const vib = vibration ?? this.currentData.vibration;

    const tempState = this.getTempState(temp);
    const humState = this.getHumidityState(hum);
    const tiltXState = this.getTiltState(tiltX);
    const tiltYState = this.getTiltState(tiltY);
    const ch4State = this.getMethaneState(ch4);
    const vibState = this.getVibrationState(vib);

    const states = [tempState, humState, tiltXState, tiltYState, ch4State, vibState];
    const hasCritical = states.some(s => s.level === 'CRITICAL');
    const hasWarning = states.some(s => s.level === 'WARNING' || s.level === 'HIGH');

    if (hasCritical) {
      let reason = 'CRITICAL limit breached: ';
      if (tempState.level === 'CRITICAL') reason += `Temp ${temp}°C ≥ 40°C. `;
      if (humState.level === 'CRITICAL') reason += `Hum ${hum}% ≥ 85%. `;
      if (tiltXState.level === 'CRITICAL') reason += `TiltX ${tiltX}° ≥ 45°. `;
      if (tiltYState.level === 'CRITICAL') reason += `TiltY ${tiltY}° ≥ 45°. `;
      if (ch4State.level === 'CRITICAL') reason += `Methane ${ch4}% ≥ 1.25%. `;
      if (vibState.level === 'CRITICAL') reason += `Vibration ${vib} events/sec ≥ 8. `;
      return { status: 'EMERGENCY', reason };
    }
    if (hasWarning) {
      let reason = 'WARNING threshold reached: ';
      if (tempState.level === 'WARNING') reason += `Temp ${temp}°C ≥ 35°C. `;
      if (humState.level === 'WARNING') reason += `Hum ${hum}% ≥ 75%. `;
      if (tiltXState.level === 'WARNING') reason += `TiltX ${tiltX}° ≥ 30°. `;
      if (tiltYState.level === 'WARNING') reason += `TiltY ${tiltY}° ≥ 30°. `;
      if (ch4State.level === 'WARNING' || ch4State.level === 'HIGH') reason += `Methane ${ch4}% ≥ 0.50%. `;
      if (vibState.level === 'WARNING') reason += `Vibration ${vib} events/sec ≥ 3. `;
      return { status: 'WARNING', reason };
    }
    return { status: 'SAFE', reason: 'All sensors within SAFE limits' };
  }

  tickMockData() {
    if (this.isPaused || this.mode === 'SERIAL' || this.serialConnectionState !== 'DISCONNECTED') return;

    let deltaTemp = (Math.random() - 0.49) * 0.6;
    let deltaHum = (Math.random() - 0.49) * 0.8;
    let deltaTiltX = (Math.random() - 0.49) * 0.4;
    let deltaTiltY = (Math.random() - 0.49) * 0.4;
    let deltaMethane = (Math.random() - 0.45) * 0.015; // Slow demo accumulation trend
    let deltaVibration = Math.round((Math.random() - 0.49) * 1.6);

    if (!this.manualStatusOverride) {
      this.currentData.temperature = Number((Math.max(15, Math.min(60, this.currentData.temperature + deltaTemp))).toFixed(1));
      this.currentData.humidity = Number((Math.max(20, Math.min(95, this.currentData.humidity + deltaHum))).toFixed(1));
      this.currentData.tiltX = Number((Math.max(-45, Math.min(45, this.currentData.tiltX + deltaTiltX))).toFixed(1));
      this.currentData.tiltY = Number((Math.max(-45, Math.min(45, this.currentData.tiltY + deltaTiltY))).toFixed(1));
      this.currentData.methane = Number((Math.max(0.10, Math.min(2.50, this.currentData.methane + deltaMethane))).toFixed(2));
      this.currentData.vibration = Math.max(0, Math.min(15, Math.round(this.currentData.vibration + deltaVibration)));

      this.currentData.hc05Connected = true;
      this.currentData.surfaceReceiver = true;

      const evalRes = this.evaluateStatus(
        this.currentData.temperature,
        this.currentData.humidity,
        this.currentData.tiltX,
        this.currentData.tiltY,
        this.currentData.methane,
        this.currentData.vibration
      );
      const newStat = typeof evalRes === 'string' ? evalRes : evalRes.status;
      const reason = typeof evalRes === 'string' ? 'Manual override' : evalRes.reason;
      this.updateSystemStatus(newStat, reason);
    }

    this.currentData.lastUpdated = new Date();
    this.addHistoryPoint();
    this.notify();
  }

  addHistoryPoint() {
    const timeStr = this.currentData.lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    this.history.push({
      timeStr,
      timestamp: this.currentData.lastUpdated,
      temperature: this.currentData.temperature,
      humidity: this.currentData.humidity,
      tiltX: this.currentData.tiltX,
      tiltY: this.currentData.tiltY,
      methane: this.currentData.methane,
      vibration: this.currentData.vibration,
      status: this.currentData.status
    });

    if (this.history.length > 50) {
      this.history.shift();
    }
  }

  // --- ESP32 Hardware Integration via Web Serial API ---
  async connectSerial() {
    if (!('serial' in navigator)) {
      alert('Web Serial is not supported. Please use Google Chrome or Microsoft Edge.');
      return false;
    }

    try {
      this.serialPort = await navigator.serial.requestPort();
      await this.serialPort.open({ baudRate: 115200 });

      this.mode = 'SERIAL';
      this.serialConnectionState = 'CONNECTED';
      this.currentData.dataSource = 'ESP32 #2 SERIAL (COM)';
      this.currentData.surfaceReceiver = true;
      this.currentData.hc05Connected = true;
      this.notify();

      const textDecoder = new TextDecoderStream();
      const readableStreamClosed = this.serialPort.readable.pipeTo(textDecoder.writable);
      const reader = textDecoder.readable.getReader();
      this.reader = reader;

      let serialBuffer = '';
      while (this.serialPort && this.serialPort.readable) {
        const { value, done } = await reader.read();
        if (done) {
          reader.releaseLock();
          break;
        }
        if (value) {
          serialBuffer += value;

          if (serialBuffer.includes('--------------------')) {
            const blocks = serialBuffer.split('--------------------');
            serialBuffer = blocks.pop();

            for (const block of blocks) {
              if (block.trim()) {
                this.serialConnectionState = 'LIVE';
                this.parseESP32SerialBlock(block);
              }
            }
          } else if (serialBuffer.toLowerCase().includes('status:') && serialBuffer.includes('\n\n')) {
            const blocks = serialBuffer.split('\n\n');
            serialBuffer = blocks.pop();

            for (const block of blocks) {
              if (block.trim()) {
                this.serialConnectionState = 'LIVE';
                this.parseESP32SerialBlock(block);
              }
            }
          }
        }
      }
      return true;
    } catch (err) {
      if (err.name === 'NotFoundError') {
        this.disconnectSerial();
        return false;
      }
      alert(`Serial Port Connection Error: ${err.message || 'Failed to open serial port'}`);
      this.disconnectSerial();
      return false;
    }
  }

  async disconnectSerial() {
    if (this.reader) {
      try {
        await this.reader.cancel();
      } catch (e) {}
      this.reader = null;
    }
    if (this.serialPort) {
      try {
        await this.serialPort.close();
      } catch (e) {}
      this.serialPort = null;
    }
    this.mode = 'MOCK';
    this.serialConnectionState = 'DISCONNECTED';
    this.currentData.dataSource = 'MOCK SIMULATION';
    this.notify();
  }

  parseSerialLine(line) {
    if (!line) return;
    try {
      let temp, hum, tiltX, tiltY, methane, vibration, status;
      if (line.startsWith('{') && line.endsWith('}')) {
        const parsed = JSON.parse(line);
        temp = parsed.temp ?? parsed.temperature;
        hum = parsed.hum ?? parsed.humidity;
        tiltX = parsed.tiltX ?? parsed.tilt_x;
        tiltY = parsed.tiltY ?? parsed.tilt_y;
        methane = parsed.methane ?? parsed.ch4;
        vibration = parsed.vibration ?? parsed.vib;
        status = parsed.status;
      }
      if (temp !== undefined || hum !== undefined || tiltX !== undefined || tiltY !== undefined || methane !== undefined || vibration !== undefined) {
        this.updateSensorData({ temperature: temp, humidity: hum, tiltX, tiltY, methane, vibration, status });
      }
    } catch (e) {
      // Ignore non-JSON lines
    }
  }
}

export const telemetryService = new TelemetryService();
