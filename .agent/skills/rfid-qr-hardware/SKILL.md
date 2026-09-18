---
name: rfid-qr-hardware
description: Hardware integration standards, USB HID RFID reader event handling, QR camera scanner integration (html5-qrcode), scan debouncing/cooldown, audio chime feedback, and offline fallback queue for the Bestlink College of the Philippines Attendance Monitoring System. Use when implementing or debugging scanner modules, gate check-in, or badge generation.
---

# RFID & QR Hardware Integration Skill (SMS1-AMS)

## Goal

Provide standard, battle-tested integration patterns for physical RFID readers and QR code optical scanners across gate kiosks, classroom attendance terminals, and faculty mobile scanners.

---

## 1. Scanner Input Protocols

### A. USB HID RFID Reader (Keyboard Emulation Mode)
Standard 13.56 MHz / 125 kHz USB RFID readers behave as rapid keyboard input devices sending numeric UID characters terminated with an `Enter` keypress (Key code 13).

#### Implementation Rules:
1. **Global Keydown Capture**: The scanner listener attaches to `document` or a designated focused scan container.
2. **Buffer Inter-key Timing**: Keypresses arriving faster than 50ms apart are treated as hardware scanner input rather than human typing.
3. **Debounce / Cooldown Interval**: Once a badge UID is received, enforce a minimum **3-second cooldown** per badge to prevent accidental double-scanning at turnstiles.

```javascript
// Example: Global HID RFID Scanner Listener
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

## 2. Optical QR Scanner (`Html5Qrcode`)

For classroom mobile/webcam scanning using the `html5-qrcode` library:

1. **Resolution & Aspect Ratio**: Request `{ facingMode: "environment" }` with 1:1 square scanning box.
2. **Format**: Use JSON-encoded payloads or HMAC-signed tokens (`BCP-AMS:{student_id}:{hash}`) to prevent forged QR codes.
3. **Audio-Visual Feedback**:
   - Success: Green border flash (`border-emerald-500`) + high-pitch audio chime (880Hz, 150ms).
   - Rejected / Duplicate: Red shake animation + low-pitch buzz (220Hz, 300ms).

---

## 3. Audio Chime Synthesizer (Zero external audio files)

Use the browser Web Audio API to guarantee sound triggers even on locked-down kiosk machines:

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

## 4. Offline Fallback & Sync Queue

When kiosk internet connectivity drops:
1. Store scans in `localStorage` under `offline_scan_queue` with timestamp and device ID.
2. Display an amber "Offline Mode — Caching Scans" indicator on the UI.
3. When `navigator.onLine` fires, automatically flush queue items to Supabase via RPC or batch insert.
