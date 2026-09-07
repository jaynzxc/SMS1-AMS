// assets/js/student/rfid-and-qr.js
// Student RFID & QR Code Module for Bestlink College of the Philippines Attendance Monitoring System

import { supabase } from '../config/supabaseClient.js';

// Mock student profile data for offline/demo operation
let currentStudent = {
  studentId: 's210110045',
  name: 'Juan Dela Cruz',
  course: 'BS Information Technology',
  section: 'BSIT 3A',
  rfidUid: 'RFID-9041-3827',
  rfidStatus: 'Active',
  rfidAssigned: 'Aug 15, 2024',
  qrToken: 'BCP-SEC-S210110045-884A',
  qrStatus: 'Encrypted Active'
};

// Recent checkpoint verification logs for this student
const scanLogsData = [
  {
    id: 1,
    dateTime: 'May 27, 2025 · 7:48 AM',
    checkpoint: 'Gate 1 Main Turnstile',
    subject: 'Intro to Computing',
    method: 'RFID',
    status: 'Present',
    remarks: 'Tapped on time',
    terminal: 'ESP32-AMS-01 (Gate 1)'
  },
  {
    id: 2,
    dateTime: 'May 26, 2025 · 9:17 AM',
    checkpoint: 'Lab 305 Web Camera',
    subject: 'Web Development',
    method: 'QR Code',
    status: 'Late',
    remarks: 'Scanned 17 mins late',
    terminal: 'Instructor Webcam #03'
  },
  {
    id: 3,
    dateTime: 'May 23, 2025 · 1:03 PM',
    checkpoint: 'Gate 2 Student Turnstile',
    subject: 'Database Systems',
    method: 'RFID',
    status: 'Present',
    remarks: 'Verified biometric/card',
    terminal: 'ESP32-AMS-02 (Gate 2)'
  },
  {
    id: 4,
    dateTime: 'May 22, 2025 · 2:45 PM',
    checkpoint: 'Room 402 Scanner',
    subject: 'Systems Analysis',
    method: 'QR Code',
    status: 'Present',
    remarks: 'Dynamic pass scan',
    terminal: 'Teacher Tablet Cam'
  },
  {
    id: 5,
    dateTime: 'May 20, 2025 · 8:58 AM',
    checkpoint: 'Gate 1 Main Turnstile',
    subject: 'Web Development',
    method: 'RFID',
    status: 'Present',
    remarks: 'RFID card authenticated',
    terminal: 'ESP32-AMS-01 (Gate 1)'
  }
];

let filteredLogs = [...scanLogsData];

document.addEventListener('DOMContentLoaded', () => {
  console.log('💳 Student RFID & QR Code Module Initialized');
  initCurrentDate();
  loadStudentProfile();
  renderScanLogsTable();
  initSearchAndFilters();
  exposeGlobalFunctions();
});

/**
 * Initialize current date in top bar (Matches my-attendance.html)
 */
function initCurrentDate() {
  const dateLabel = document.getElementById('currentDateLabel');
  if (dateLabel) {
    const today = new Date();
    const dayOfWeek = today.toLocaleDateString('en-US', { weekday: 'long' });
    const monthDayYear = today.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    dateLabel.textContent = `${monthDayYear} (${dayOfWeek})`;
  }
}

/**
 * Load student profile from Supabase or fallback to mock
 */
async function loadStudentProfile() {
  try {
    if (supabase) {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: studentRecord, error } = await supabase
          .from('students')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (!error && studentRecord) {
          currentStudent = {
            studentId: studentRecord.student_id || currentStudent.studentId,
            name: studentRecord.name || currentStudent.name,
            course: studentRecord.course || currentStudent.course,
            section: studentRecord.section || currentStudent.section,
            rfidUid: studentRecord.rfid_uid || currentStudent.rfidUid,
            rfidStatus: studentRecord.status || currentStudent.rfidStatus,
            rfidAssigned: studentRecord.created_at ? new Date(studentRecord.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : currentStudent.rfidAssigned,
            qrToken: studentRecord.qr_code || `BCP-SEC-${studentRecord.student_id}-884A`,
            qrStatus: 'Encrypted Active'
          };
        }
      }
    }
  } catch (err) {
    console.log('Using demo student profile credentials:', err);
  }

  // Update UI with student data
  updateStudentUI();
}

/**
 * Update UI elements with current student data
 */
function updateStudentUI() {
  // Topbar
  const topbarName = document.getElementById('topbarStudentName');
  if (topbarName) topbarName.textContent = currentStudent.name;

  const topbarMeta = document.getElementById('topbarStudentMeta');
  if (topbarMeta) topbarMeta.textContent = `Student · ${currentStudent.section}`;

  // QR Card
  const qrName = document.getElementById('qrCardStudentName');
  if (qrName) qrName.textContent = currentStudent.name;

  const qrId = document.getElementById('qrCardStudentId');
  if (qrId) qrId.textContent = currentStudent.studentId;

  const qrCourse = document.getElementById('qrCardCourse');
  if (qrCourse) qrCourse.textContent = currentStudent.course;

  const qrSection = document.getElementById('qrCardSection');
  if (qrSection) qrSection.textContent = currentStudent.section;

  const qrToken = document.getElementById('qrCardToken');
  if (qrToken) qrToken.textContent = currentStudent.qrToken;

  // RFID Virtual Card
  const cardUid = document.getElementById('cardVisualUid');
  if (cardUid) cardUid.textContent = currentStudent.rfidUid || 'RFID-9041-3827';

  const cardName = document.getElementById('cardVisualName');
  if (cardName) cardName.textContent = currentStudent.name || 'Juan Dela Cruz';

  const cardAssigned = document.getElementById('cardVisualAssigned');
  if (cardAssigned) cardAssigned.textContent = currentStudent.rfidAssigned || 'Aug 15, 2024';

  const statUid = document.getElementById('statRfidUid');
  if (statUid) statUid.textContent = `UID: ${currentStudent.rfidUid || 'RFID-9041-3827'}`;

  const modalReportUid = document.getElementById('modalReportUid');
  if (modalReportUid) modalReportUid.textContent = currentStudent.rfidUid || 'RFID-9041-3827';
}

/**
 * Render Recent Scan Logs Table (Matches my-attendance.html design)
 */
function renderScanLogsTable() {
  const tbody = document.getElementById('scanLogsTableBody');
  const countBadge = document.getElementById('scanLogCountBadge');

  if (!tbody) return;

  if (countBadge) {
    countBadge.textContent = `${filteredLogs.length} Logs`;
  }

  if (filteredLogs.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" class="py-8 text-center text-gray-500">
          <p class="text-sm font-medium">No checkpoint verification logs found matching your criteria.</p>
          <button onclick="resetFilters()" class="mt-2 text-xs font-semibold text-[#0030c2] hover:underline">
            Reset Filters
          </button>
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = filteredLogs.map((log) => {
    // Status Badge
    let statusBadge = '';
    if (log.status === 'Present') {
      statusBadge = `<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#f0fdf4] text-[#16a34a] border border-[#bbf7d0]">Present</span>`;
    } else if (log.status === 'Late') {
      statusBadge = `<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#fff7ed] text-[#f97316] border border-[#fed7aa]">Late</span>`;
    } else {
      statusBadge = `<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#fef2f2] text-[#dc2626] border border-[#fecaca]">Absent</span>`;
    }

    // Method Badge
    let methodBadge = '';
    if (log.method === 'RFID') {
      methodBadge = `<span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-[#eff6ff] text-[#2563eb] border border-[#bfdbfe]">RFID</span>`;
    } else {
      methodBadge = `<span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-[#f0fdf4] text-[#16a34a] border border-[#bbf7d0]">QR Code</span>`;
    }

    return `
      <tr class="hover:bg-[#f9fafb] transition-colors">
        <td class="py-3 px-4 text-[#6b7280] whitespace-nowrap font-medium">${log.dateTime}</td>
        <td class="py-3 px-4 font-semibold text-[#111827]">${log.checkpoint}</td>
        <td class="py-3 px-4 text-[#4b5563]">${log.subject}</td>
        <td class="py-3 px-4">${methodBadge}</td>
        <td class="py-3 px-4">${statusBadge}</td>
        <td class="py-3 px-4 text-[#6b7280]">${log.remarks}</td>
        <td class="py-3 px-4 text-center">
          <button onclick="openScanModal(${log.id})"
            class="p-1.5 text-[#2563eb] hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
            title="View Details">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

/**
 * Filter & Search handlers
 */
function initSearchAndFilters() {
  const searchInput = document.getElementById('scanSearchInput');
  const methodSelect = document.getElementById('methodFilterSelect');

  if (searchInput) {
    searchInput.addEventListener('input', applyFilters);
  }

  if (methodSelect) {
    methodSelect.addEventListener('change', applyFilters);
  }
}

function applyFilters() {
  const query = document.getElementById('scanSearchInput')?.value.toLowerCase().trim() || '';
  const method = document.getElementById('methodFilterSelect')?.value || 'all';

  filteredLogs = scanLogsData.filter((log) => {
    const matchesSearch =
      log.checkpoint.toLowerCase().includes(query) ||
      log.subject.toLowerCase().includes(query) ||
      log.dateTime.toLowerCase().includes(query);

    const matchesMethod = method === 'all' || log.method === method;

    return matchesSearch && matchesMethod;
  });

  renderScanLogsTable();
}

function resetFilters() {
  const searchInput = document.getElementById('scanSearchInput');
  const methodSelect = document.getElementById('methodFilterSelect');

  if (searchInput) searchInput.value = '';
  if (methodSelect) methodSelect.value = 'all';

  filteredLogs = [...scanLogsData];
  renderScanLogsTable();
}

/**
 * Fullscreen QR Modal Handlers
 */
function openQrModal() {
  const modal = document.getElementById('qrFullscreenModal');
  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }
}

function closeQrModal() {
  const modal = document.getElementById('qrFullscreenModal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
}

/**
 * Download Dynamic QR Code as High-Res PNG
 */
function downloadQrCode() {
  const svg = document.getElementById('studentQrSvg');
  if (!svg) {
    showToast('QR Code element not found.', 'error');
    return;
  }

  try {
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    canvas.width = 600;
    canvas.height = 600;

    img.onload = () => {
      // White background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw QR Code
      ctx.drawImage(img, 40, 40, 520, 520);

      // Add watermark / label at bottom
      ctx.font = 'bold 16px Inter, sans-serif';
      ctx.fillStyle = '#0030c2';
      ctx.textAlign = 'center';
      ctx.fillText(`Bestlink College - ${currentStudent.name} (${currentStudent.studentId})`, 300, 580);

      // Trigger download
      const pngFile = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.download = `BCP_Student_QR_${currentStudent.studentId}.png`;
      downloadLink.href = pngFile;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);

      showToast('Student Dynamic QR Pass downloaded successfully!');
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  } catch (err) {
    console.error('Download QR failed:', err);
    showToast('Failed to download QR code image.', 'error');
  }
}

/**
 * Lost or Damaged RFID Card Modal Handlers
 */
function openLostCardModal() {
  const modal = document.getElementById('lostCardModal');
  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }
}

function closeLostCardModal() {
  const modal = document.getElementById('lostCardModal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
}

function submitLostCardReport() {
  const reason = document.getElementById('lostCardReason')?.value || 'Lost';
  const notes = document.getElementById('lostCardNotes')?.value.trim() || '';

  closeLostCardModal();

  // Update card status badges in UI
  const badgeTop = document.getElementById('cardStatusBadgeTop');
  if (badgeTop) {
    badgeTop.className = 'inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200';
    badgeTop.textContent = 'Revocation Pending';
  }

  const badgeInner = document.getElementById('cardBadgeInner');
  if (badgeInner) {
    badgeInner.className = 'text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-400/30';
    badgeInner.textContent = 'REVOCATION PENDING';
  }

  const statStatus = document.getElementById('statRfidStatus');
  if (statStatus) {
    statStatus.textContent = 'Revoked (Pending)';
    statStatus.className = 'text-xl font-extrabold text-rose-600 truncate';
  }

  showToast(`RFID incident reported (${reason}). Administrator alerted for card revocation.`);
}

/**
 * Scan Record Details Modal Handlers
 */
function openScanModal(logId) {
  const log = scanLogsData.find((item) => item.id === logId);
  if (!log) return;

  const dtEl = document.getElementById('detailScanDateTime');
  if (dtEl) dtEl.textContent = log.dateTime;

  const cpEl = document.getElementById('detailScanCheckpoint');
  if (cpEl) cpEl.textContent = log.checkpoint;

  const subEl = document.getElementById('detailScanSubject');
  if (subEl) subEl.textContent = `${log.subject} (${log.remarks})`;

  const methEl = document.getElementById('detailScanMethod');
  if (methEl) {
    methEl.textContent = log.method === 'RFID' ? 'RFID Hardware Tap (Mifare 1K)' : 'Dynamic QR Optical Scan';
  }

  const statEl = document.getElementById('detailScanStatus');
  if (statEl) {
    statEl.textContent = log.status === 'Present' ? 'Verified · Present (On-Time)' : 'Verified · Late (Tardy)';
    statEl.className = log.status === 'Present'
      ? 'inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700'
      : 'inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-50 text-orange-700';
  }

  const tokenEl = document.getElementById('detailScanToken');
  if (tokenEl) tokenEl.textContent = log.terminal;

  const modal = document.getElementById('scanDetailModal');
  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }
}

function closeScanModal() {
  const modal = document.getElementById('scanDetailModal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
}

/**
 * Toast Notification Utility
 */
function showToast(message, type = 'success') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'flex items-center gap-2.5 px-4 py-3 bg-[#111827] text-white text-xs font-semibold rounded-xl shadow-lg border border-white/10 transition-all transform duration-300 translate-y-2 opacity-0 mb-2';

  let iconSvg = '';
  if (type === 'success') {
    iconSvg = `<svg class="w-4 h-4 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`;
  } else if (type === 'error') {
    iconSvg = `<svg class="w-4 h-4 text-rose-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" /></svg>`;
  } else {
    iconSvg = `<svg class="w-4 h-4 text-blue-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12v-.008z" /></svg>`;
  }

  toast.innerHTML = `${iconSvg}<span>${message}</span>`;
  container.appendChild(toast);

  // Trigger animation
  requestAnimationFrame(() => {
    toast.classList.remove('translate-y-2', 'opacity-0');
  });

  setTimeout(() => {
    toast.classList.add('opacity-0', 'translate-y-2');
    setTimeout(() => {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 300);
  }, 4000);
}

/**
 * Copy to Clipboard Helpers
 */
function copyTokenToClipboard() {
  if (currentStudent && currentStudent.qrToken) {
    navigator.clipboard.writeText(currentStudent.qrToken)
      .then(() => {
        showToast('Dynamic Security Token copied to clipboard!');
      })
      .catch(() => {
        showToast('Copied: ' + currentStudent.qrToken);
      });
  }
}

function copyUidToClipboard() {
  if (currentStudent && currentStudent.rfidUid) {
    navigator.clipboard.writeText(currentStudent.rfidUid)
      .then(() => {
        showToast('RFID Card UID copied to clipboard!');
      })
      .catch(() => {
        showToast('Copied: ' + currentStudent.rfidUid);
      });
  }
}

/**
 * Expose functions globally for inline HTML event triggers
 */
function exposeGlobalFunctions() {
  window.downloadQrCode = downloadQrCode;
  window.openQrModal = openQrModal;
  window.closeQrModal = closeQrModal;
  window.openLostCardModal = openLostCardModal;
  window.closeLostCardModal = closeLostCardModal;
  window.submitLostCardReport = submitLostCardReport;
  window.openScanModal = openScanModal;
  window.closeScanModal = closeScanModal;
  window.resetFilters = resetFilters;
  window.copyTokenToClipboard = copyTokenToClipboard;
  window.copyUidToClipboard = copyUidToClipboard;
}
