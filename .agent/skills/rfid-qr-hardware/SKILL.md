---
name: rfid-qr-hardware
description: Hardware integration standards, USB HID RFID reader event handling, QR camera scanner integration (html5-qrcode), scan debouncing/cooldown, audio chime feedback, and offline fallback queue for the Bestlink College of the Philippines Attendance Monitoring System. Use when implementing or debugging scanner modules, gate check-in, or badge generation.
---

# RFID & QR Hardware Integration Skill (SMS1-AMS)

## Goal

Provide standard, battle-tested integration patterns for physical RFID readers and QR code optical scanners across gate kiosks, classroom attendance terminals, and campus event check-in points, supporting the **10 Official Submodules** and the **School Event Management System** bridge.

---

## 1. Scanner Input Protocols

### A. USB HID RFID Reader (Keyboard Emulation Mode)
Standard 13.56 MHz / 125 kHz USB RFID readers behave as rapid keyboard input devices sending numeric UID characters terminated with an `Enter` keypress (Key code 13).

#### Implementation Rules:
1. **Global Keydown Capture**: The scanner listener attaches to `document` or a designated focused scan container.
2. **Buffer Inter-key Timing**: Keypresses arriving faster than 50ms apart are treated as hardware scanner input rather than human typing.
3. **Debounce / Cooldown Interval**: Enforce a minimum **3-second cooldown** per badge to prevent accidental double-scanning at turnstiles.

```javascript
let rfidBuffer = '';
let lastKeyTime = Date.now();
const COOLDOWN_MS = 3000;
const lastScannedUids = new Map();

document.addEventListener('keydown', (e) => {
  const currentTime = Date.now();
  const timeDiff = currentTime - lastKeyTime;
  lastKeyTime = currentTime;

  if (e.key === 'Enter') {
    if (rfidBuffer.length >= 6) {
      handleCardScan(rfidBuffer.trim());
    }
    rfidBuffer = '';
    return;
  }

  // Accumulate printable characters
  if (e.key.length === 1) {
    if (timeDiff > 200) {
      rfidBuffer = ''; // Reset buffer if typed slowly by human
    }
    rfidBuffer += e.key;
  }
});
```

---

## 2. Dual-Context Scan Mode (Classroom vs. Campus Event)

The scanner engine in `teacher/rfid-and-qr/live-scanner.html` supports two operational contexts:

1. **`CLASSROOM_PERIOD` Mode**:
   * Evaluates student tap against active subject schedule.
   * Compares arrival time against grace period (e.g. 15 minutes).
   * Marks status as `Present` or `Late` in `attendance`.
2. **`EVENT_VENUE` Mode (SMS 1 School Events Bridge)**:
   * Activated when scanning for institutional events (Intramurals, Seminars, Foundation Day).
   * Sets `scan_context = 'EVENT_VENUE'` and records `event_id` in `rfid_qr_scan_logs`.
   * Displays real-time attendee count without subject schedule restrictions.

---

## 3. Optical QR Scanner (`Html5Qrcode`)

For classroom mobile/webcam scanning using the `html5-qrcode` library:

1. **Resolution & Aspect Ratio**: Request `{ facingMode: "environment" }` with 1:1 square scanning box.
2. **Format**: Use encrypted dynamic payloads (`BCP-AMS:{student_id}:{hash}`) to prevent forged QR codes.
3. **Audio-Visual Feedback**:
   * Success: Green border flash (`border-emerald-500`) + high-pitch audio chime (880Hz, 150ms).
   * Rejected / Duplicate: Red shake animation + low-pitch buzz (220Hz, 300ms).

---

## 4. Audio Chime Synthesizer (Zero External Audio Files)

Use the browser Web Audio API to guarantee sound triggers without external media dependencies:

```javascript
export function playScanSound(isSuccess = true) {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    if (isSuccess) {
      osc.frequency.setValueAtTime(880, audioCtx.currentTime); // High pitch (A5)
      gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.15);
    } else {
      osc.frequency.setValueAtTime(220, audioCtx.currentTime); // Low buzz (A3)
      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.3);
    }
  } catch (e) {
    console.warn('Audio Context not allowed without prior user interaction');
  }
}
```

---

## 5. Offline Fallback & Local Sync Queue

When network connectivity to Supabase is lost:
1. Store badge scans in `localStorage` under `offline_scan_queue`.
2. Display offline indicator badge: `Offline - 4 Scans Queued`.
3. Flush queue automatically via `navigator.onLine` event listener when connectivity is restored.
