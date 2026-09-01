/**
 * Teacher Live Attendance Scanner Controller
 * Handles real-time RFID tap listening, QR camera scanning simulation, live snapshots, KPI counters, and manual overrides.
 */

// Initial student live stream dataset
const DEFAULT_SCANS = [
  { id: '2026-1001', name: 'Santos, Maria', section: 'BSIT 3-A', timeIn: '07:38:12 AM', status: 'Present', method: 'RFID', remarks: 'On-Time Tap' },
  { id: '2026-1002', name: 'Garcia, Juan', section: 'BSIT 3-A', timeIn: '07:39:45 AM', status: 'Present', method: 'RFID', remarks: 'On-Time Tap' },
  { id: '2026-1003', name: 'Reyes, Anna', section: 'BSIT 3-A', timeIn: '07:41:03 AM', status: 'Present', method: 'QR Code', remarks: 'Mobile QR Scan' },
  { id: '2026-1004', name: 'Dela Cruz, John', section: 'BSIT 3-A', timeIn: '07:42:15 AM', status: 'Present', method: 'RFID', remarks: 'On-Time Tap' },
  { id: '2026-1005', name: 'Rivera, Luis', section: 'BSIT 3-A', timeIn: '07:44:00 AM', status: 'Present', method: 'RFID', remarks: 'On-Time Tap' },
  { id: '2026-1006', name: 'Aquino, Bea', section: 'BSIT 3-A', timeIn: '07:45:10 AM', status: 'Present', method: 'QR Code', remarks: 'Mobile QR Scan' },
  { id: '2026-1007', name: 'Castro, Daniel', section: 'BSIT 3-A', timeIn: '07:51:22 AM', status: 'Late', method: 'RFID', remarks: 'Late (6 mins)' },
  { id: '2026-1008', name: 'Bautista, Elena', section: 'BSIT 3-A', timeIn: '07:55:40 AM', status: 'Late', method: 'QR Code', remarks: 'Late (10 mins)' },
  { id: '2026-1009', name: 'Navarro, Mark', section: 'BSIT 3-A', timeIn: '08:02:15 AM', status: 'Late', method: 'RFID', remarks: 'Late (17 mins)' }
];

let sessionScans = JSON.parse(JSON.stringify(DEFAULT_SCANS));
let isScannerActive = true;
let currentScannerMode = 'rfid'; // 'rfid' or 'qr'

// Class schedule metadata
const SCHEDULES = {
  'web-dev': { subject: 'Web Development', section: 'BSIT 3-A', time: '07:30 AM - 09:00 AM', room: 'Room 402' },
  'dbms': { subject: 'Database Management Systems', section: 'BSIT 3-B', time: '09:00 AM - 10:30 AM', room: 'Lab 3' },
  'data-struct': { subject: 'Data Structures & Algorithms', section: 'BSIT 2-A', time: '11:00 AM - 12:30 PM', room: 'Room 205' }
};

document.addEventListener('DOMContentLoaded', () => {
  initSidebar();
  initScheduleChange();
  renderLiveTable();
  updateKpiCounters();
});

/**
 * Sidebar and Dropdown navigation
 */
function initSidebar() {
  const burgerBtn = document.querySelector('.burger-btn') || document.getElementById('sidebarToggleBtn');
  const sidebar = document.getElementById('mainSidebar') || document.querySelector('aside');

  if (burgerBtn && sidebar && !burgerBtn.getAttribute('onclick')) {
    burgerBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      sidebar.classList.toggle('sidebar-collapsed');
    });
  }
}

window.toggleScannerDropdown = function() {
  const menu = document.getElementById('scannerDropdownMenu');
  const arrow = document.getElementById('scannerDropdownArrow');
  if (menu && arrow) {
    menu.classList.toggle('hidden');
    arrow.classList.toggle('rotate-90');
  }
};

/**
 * Subject & Section schedule change
 */
function initScheduleChange() {
  const subjectSelect = document.getElementById('subjectSelect');
  const sectionSelect = document.getElementById('sectionSelect');

  function updateSchedule() {
    const subVal = subjectSelect?.value || 'web-dev';
    const info = SCHEDULES[subVal] || SCHEDULES['web-dev'];
    const schedDisplay = document.getElementById('activeScheduleDisplay');
    if (schedDisplay) {
      schedDisplay.innerHTML = `Schedule: <strong class="text-[#111827]">${info.time} (${info.room})</strong>`;
    }
  }

  if (subjectSelect) subjectSelect.addEventListener('change', updateSchedule);
  if (sectionSelect) sectionSelect.addEventListener('change', updateSchedule);
}

/**
 * Switch Scanner Mode (RFID vs QR)
 */
window.switchScannerMode = function(mode) {
  currentScannerMode = mode;
  const rfidBtn = document.getElementById('modeRfidBtn');
  const qrBtn = document.getElementById('modeQrBtn');
  const rfidContainer = document.getElementById('rfidViewContainer');
  const qrContainer = document.getElementById('qrViewContainer');
  const modeBadge = document.getElementById('activeModeBadge');

  if (mode === 'rfid') {
    if (rfidBtn) {
      rfidBtn.className = 'flex-1 px-2.5 py-1 rounded-md font-bold text-xs bg-[#0030c2] text-white transition-all';
    }
    if (qrBtn) {
      qrBtn.className = 'flex-1 px-2.5 py-1 rounded-md text-xs text-[#6b7280] hover:bg-gray-50 transition-all';
    }
    if (rfidContainer) {
      rfidContainer.classList.remove('hidden');
      rfidContainer.classList.add('flex');
    }
    if (qrContainer) {
      qrContainer.classList.add('hidden');
      qrContainer.classList.remove('flex');
    }
    if (modeBadge) {
      modeBadge.textContent = 'RFID Mode';
      modeBadge.className = 'text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#eff6ff] text-[#0030c2] border border-[#bfdbfe]';
    }
  } else {
    if (qrBtn) {
      qrBtn.className = 'flex-1 px-2.5 py-1 rounded-md font-bold text-xs bg-[#0030c2] text-white transition-all';
    }
    if (rfidBtn) {
      rfidBtn.className = 'flex-1 px-2.5 py-1 rounded-md text-xs text-[#6b7280] hover:bg-gray-50 transition-all';
    }
    if (qrContainer) {
      qrContainer.classList.remove('hidden');
      qrContainer.classList.add('flex');
    }
    if (rfidContainer) {
      rfidContainer.classList.add('hidden');
      rfidContainer.classList.remove('flex');
    }
    if (modeBadge) {
      modeBadge.textContent = 'QR Camera Mode';
      modeBadge.className = 'text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#faf5ff] text-[#7c3aed] border border-[#e9d5ff]';
    }
  }
  showToast(`Switched to ${mode === 'rfid' ? 'RFID Card Tap' : 'QR Camera'} Mode`, 'info');
};

/**
 * Start / Stop Scanner State
 */
window.toggleScanner = function() {
  isScannerActive = !isScannerActive;
  const btn = document.getElementById('scannerToggleBtn');
  const text = document.getElementById('scannerToggleText');
  const dot = document.getElementById('scannerIndicatorDot');
  const statusLabel = document.getElementById('scannerStatusText');

  if (isScannerActive) {
    if (btn) btn.className = 'flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#0030c2] hover:bg-[#002699] rounded-lg shadow-sm transition-colors cursor-pointer';
    if (text) text.textContent = 'Stop Scanner';
    if (dot) dot.className = 'w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse';
    if (statusLabel) statusLabel.textContent = 'Scanner Active · Listening for taps & QR codes';
    showToast('Scanner activated and listening', 'success');
  } else {
    if (btn) btn.className = 'flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#dc2626] hover:bg-[#b91c1c] rounded-lg shadow-sm transition-colors cursor-pointer';
    if (text) text.textContent = 'Resume Scanner';
    if (dot) dot.className = 'w-2.5 h-2.5 rounded-full bg-gray-400';
    if (statusLabel) statusLabel.textContent = 'Scanner Paused · Tap to resume';
    showToast('Scanner paused', 'info');
  }
};

/**
 * Simulate Real-Time Scan
 */
window.simulateScan = function(type) {
  if (!isScannerActive) {
    showToast('Scanner is currently paused. Please start the scanner first.', 'info');
    return;
  }

  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true });

  let scanRecord = {};
  if (type === 'present') {
    scanRecord = {
      id: '2026-1010',
      name: 'Ramos, Joshua',
      section: 'BSIT 3-A',
      timeIn: timeStr,
      status: 'Present',
      method: 'RFID',
      remarks: 'On-Time Tap'
    };
  } else if (type === 'late') {
    scanRecord = {
      id: '2026-1011',
      name: 'Valdez, Christine',
      section: 'BSIT 3-A',
      timeIn: timeStr,
      status: 'Late',
      method: 'RFID',
      remarks: 'Late (18 mins)'
    };
  } else if (type === 'qr-success') {
    scanRecord = {
      id: '2026-1012',
      name: 'Mendoza, Kyle',
      section: 'BSIT 3-A',
      timeIn: timeStr,
      status: 'Present',
      method: 'QR Code',
      remarks: 'Mobile QR Scan'
    };
  }

  // Prepend to live stream
  sessionScans.unshift(scanRecord);

  // Update Snapshot Card
  updateSnapshotCard(scanRecord);

  // Re-render table and update KPI
  renderLiveTable();
  updateKpiCounters();

  // Show Toast
  showToast(`Attendance verified for ${scanRecord.name} (${scanRecord.status})`, 'success');
};

/**
 * Update Snapshot Student Profile Card
 */
function updateSnapshotCard(student) {
  const nameEl = document.getElementById('snapshotStudentName');
  const idEl = document.getElementById('snapshotStudentId');
  const secEl = document.getElementById('snapshotStudentSection');
  const timeEl = document.getElementById('snapshotTimeIn');
  const statusBadge = document.getElementById('snapshotStatusBadge');
  const methodBadge = document.getElementById('snapshotMethodBadge');
  const resultText = document.getElementById('snapshotResultText');
  const iconContainer = document.getElementById('snapshotStatusIconContainer');

  if (nameEl) nameEl.textContent = student.name;
  if (idEl) idEl.textContent = student.id;
  if (secEl) secEl.textContent = `Web Development (${student.section})`;
  if (timeEl) timeEl.textContent = student.timeIn;

  if (methodBadge) {
    methodBadge.textContent = student.method === 'RFID' ? 'RFID Tap' : (student.method === 'QR Code' ? 'QR Code Scan' : 'Manual Override');
    methodBadge.className = student.method === 'RFID' ? 'method-badge method-badge-rfid' : (student.method === 'QR Code' ? 'method-badge method-badge-qr' : 'method-badge method-badge-manual');
  }

  if (statusBadge) {
    statusBadge.textContent = student.status;
    if (student.status === 'Present') {
      statusBadge.className = 'status-badge status-badge-present text-sm px-3 py-1 font-bold';
    } else if (student.status === 'Late') {
      statusBadge.className = 'status-badge status-badge-late text-sm px-3 py-1 font-bold';
    } else {
      statusBadge.className = 'status-badge status-badge-absent text-sm px-3 py-1 font-bold';
    }
  }

  if (resultText) {
    if (student.status === 'Present') {
      resultText.textContent = 'On-Time Attendance Verified';
      resultText.className = 'font-bold text-emerald-600';
    } else {
      resultText.textContent = `Late Arrival Recorded (${student.remarks})`;
      resultText.className = 'font-bold text-amber-600';
    }
  }

  if (iconContainer) {
    if (student.status === 'Present') {
      iconContainer.className = 'absolute bottom-0 right-0 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xs border-2 border-white';
    } else {
      iconContainer.className = 'absolute bottom-0 right-0 w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-xs border-2 border-white';
    }
  }
}

/**
 * Render Live Table matching rfid-registry.html
 */
function renderLiveTable() {
  const tbody = document.getElementById('liveScanTableBody');
  const countBadge = document.getElementById('sessionScanCountBadge');
  if (!tbody) return;

  if (countBadge) {
    countBadge.textContent = `${sessionScans.length} Records`;
  }

  tbody.innerHTML = sessionScans.map(student => {
    let statusBadgeClass = 'status-badge status-badge-present';
    if (student.status === 'Late') statusBadgeClass = 'status-badge status-badge-late';
    else if (student.status === 'Absent') statusBadgeClass = 'status-badge status-badge-absent';

    let methodBadgeClass = 'method-badge method-badge-rfid';
    if (student.method === 'QR Code') methodBadgeClass = 'method-badge method-badge-qr';
    else if (student.method === 'Manual') methodBadgeClass = 'method-badge method-badge-manual';

    return `
      <tr class="hover:bg-[#f9fafb] transition-colors">
        <td class="py-3.5 px-4 font-semibold text-[#6b7280] font-mono text-xs">${student.id}</td>
        <td class="py-3.5 px-4">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-full bg-[#e5e7eb] flex items-center justify-center shrink-0">
              <svg class="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12a4.5 4.5 0 100-9 4.5 4.5 0 000 9zM4 20.5c0-3.59 3.58-6.5 8-6.5s8 2.91 8 6.5V21H4v-.5z" />
              </svg>
            </div>
            <p class="font-bold text-[#111827]">${student.name}</p>
          </div>
        </td>
        <td class="py-3.5 px-4 font-medium text-[#374151] font-mono text-xs">${student.timeIn}</td>
        <td class="py-3.5 px-4" data-status="${student.status}">
          <span class="${statusBadgeClass}">${student.status}</span>
        </td>
        <td class="py-3.5 px-4 font-medium text-[#374151]">
          <span class="${methodBadgeClass}">${student.method}</span>
        </td>
        <td class="py-3.5 px-4 font-medium text-[#6b7280] text-xs max-w-[160px] truncate" title="${student.remarks}">
          ${student.remarks}
        </td>
        <td class="py-3.5 px-4 text-center">
          <div class="flex items-center justify-center gap-1.5">
            <button onclick="rescanStudent('${student.id}')"
              class="p-1.5 text-[#6b7280] hover:text-[#0030c2] hover:bg-gray-100 rounded-lg transition-colors inline-flex items-center justify-center"
              title="Rescan Student">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

/**
 * Rescan student
 */
window.rescanStudent = function(studentId) {
  const student = sessionScans.find(s => s.id === studentId);
  if (!student) return;
  updateSnapshotCard(student);
  showToast(`Rescanned ${student.name} profile`, 'info');
};

/**
 * KPI Stat Counter updates
 */
function updateKpiCounters() {
  const total = sessionScans.length;
  const present = sessionScans.filter(s => s.status === 'Present').length;
  const late = sessionScans.filter(s => s.status === 'Late').length;
  const flagged = sessionScans.filter(s => s.status === 'Invalid' || s.status === 'Duplicate').length;

  const presentPct = total > 0 ? ((present / total) * 100).toFixed(1) : '0.0';
  const latePct = total > 0 ? ((late / total) * 100).toFixed(1) : '0.0';

  updateText('kpiTotalScans', total);
  updateText('kpiPresentScans', present);
  updateText('kpiPresentPct', `${presentPct}% on-time arrival rate`);
  updateText('kpiLateScans', late);
  updateText('kpiLatePct', `${latePct}% arrived past threshold`);
  updateText('kpiFlaggedScans', flagged);
}

/**
 * Manual Override Modal
 */
window.openManualOverrideModal = function() {
  const modal = document.getElementById('manualOverrideModal');
  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }
};

window.closeManualOverrideModal = function() {
  const modal = document.getElementById('manualOverrideModal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
};

window.handleManualOverrideSubmit = function(e) {
  e.preventDefault();
  const select = document.getElementById('overrideStudentSelect');
  const status = document.getElementById('overrideStatusSelect')?.value || 'Present';
  const time = document.getElementById('overrideTimeInput')?.value || '07:45 AM';
  const remarks = document.getElementById('overrideRemarksInput')?.value || 'Manual Override Approved';

  const selectedText = select?.options[select.selectedIndex]?.text || '';
  const parts = selectedText.split('—');
  const id = parts[0]?.trim() || '2026-1010';
  const nameSection = parts[1]?.trim() || 'Ramos, Joshua (BSIT 3-A)';
  const name = nameSection.split('(')[0]?.trim() || 'Ramos, Joshua';

  const newRecord = {
    id: id,
    name: name,
    section: 'BSIT 3-A',
    timeIn: time,
    status: status,
    method: 'Manual',
    remarks: remarks
  };

  sessionScans.unshift(newRecord);
  updateSnapshotCard(newRecord);
  renderLiveTable();
  updateKpiCounters();
  closeManualOverrideModal();
  showToast(`Manual override recorded for ${name}`, 'success');
};

/**
 * Utility Toast and Text update
 */
function updateText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

function showToast(message, type = 'info') {
  let toastContainer = document.getElementById('toastContainer');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toastContainer';
    toastContainer.className = 'fixed top-5 right-5 z-50 flex flex-col gap-2 pointer-events-none';
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  toast.className = 'pointer-events-auto bg-white border border-[#e5e7eb] shadow-xl rounded-xl p-3.5 flex items-center gap-3 min-w-[280px] max-w-sm transition-all duration-300 transform translate-x-0';

  let iconSvg = `
    <div class="w-8 h-8 rounded-full bg-blue-50 text-[#0030c2] flex items-center justify-center shrink-0">
      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
      </svg>
    </div>
  `;
  if (type === 'success') {
    iconSvg = `
      <div class="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
      </div>
    `;
  }

  toast.innerHTML = `
    ${iconSvg}
    <div class="flex-1">
      <p class="text-xs font-bold text-[#111827]">${type === 'success' ? 'Success' : 'Notice'}</p>
      <p class="text-[11px] text-[#6b7280] leading-tight">${message}</p>
    </div>
  `;

  toastContainer.appendChild(toast);
  setTimeout(() => {
    toast.classList.add('opacity-0', 'translate-x-full');
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}
