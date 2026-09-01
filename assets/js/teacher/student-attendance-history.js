/**
 * Teacher Student Attendance History Controller
 * Handles comprehensive student profile attendance analytics, monthly calendar heatmap generation, daily log stream, and report printing.
 */

const STUDENTS_PROFILE_DATA = {
  '2026-1001': {
    id: '2026-1001',
    name: 'Santos, Maria Angela',
    section: 'BSIT 3-A',
    subject: 'Web Development',
    guardian: 'Mrs. Carmen Santos (0917-555-0199)',
    attendanceRate: '98.0%',
    presentDays: '49 Days',
    lateDays: 0,
    absentDays: '1 Day',
    absentBreakdown: '1 Excused • 0 Unexcused',
    punctualityScore: '100%',
    avgTime: '07:38 AM (12 mins before start)',
    streak: '14 consecutive days on-time',
    statusSummary: 'Model Student',
    heatmap: {
      // 1-31 days of May 2025 (May 1 is Thursday)
      // null = weekend/holiday, P = present, L = late, A = absent, E = excused
      1: 'P', 2: 'P', 3: null, 4: null, 5: 'P', 6: 'P', 7: 'P', 8: 'P', 9: 'P',
      10: null, 11: null, 12: 'P', 13: 'P', 14: 'P', 15: 'P', 16: 'P',
      17: null, 18: null, 19: 'P', 20: 'E', 21: 'P', 22: 'P', 23: 'P',
      24: null, 25: null, 26: 'P', 27: 'P', 28: 'P', 29: 'P', 30: 'P', 31: null
    },
    logs: [
      { date: 'May 27, 2025', subject: 'Web Development', timeIn: '07:38:12 AM', status: 'Present', method: 'RFID', remarks: 'On-Time Tap Verified' },
      { date: 'May 26, 2025', subject: 'Web Development', timeIn: '07:37:45 AM', status: 'Present', method: 'RFID', remarks: 'On-Time Tap Verified' },
      { date: 'May 23, 2025', subject: 'Web Development', timeIn: '07:41:00 AM', status: 'Present', method: 'QR Code', remarks: 'Mobile QR Verified' },
      { date: 'May 22, 2025', subject: 'Web Development', timeIn: '07:39:10 AM', status: 'Present', method: 'RFID', remarks: 'On-Time Tap Verified' },
      { date: 'May 21, 2025', subject: 'Web Development', timeIn: '07:40:02 AM', status: 'Present', method: 'RFID', remarks: 'On-Time Tap Verified' },
      { date: 'May 20, 2025', subject: 'Web Development', timeIn: '--', status: 'Excused', method: 'Manual', remarks: 'Excused Slip #EX-102 Approved' },
      { date: 'May 19, 2025', subject: 'Web Development', timeIn: '07:36:50 AM', status: 'Present', method: 'RFID', remarks: 'On-Time Tap Verified' },
      { date: 'May 16, 2025', subject: 'Web Development', timeIn: '07:38:15 AM', status: 'Present', method: 'RFID', remarks: 'On-Time Tap Verified' },
      { date: 'May 15, 2025', subject: 'Web Development', timeIn: '07:42:00 AM', status: 'Present', method: 'QR Code', remarks: 'Mobile QR Verified' },
      { date: 'May 14, 2025', subject: 'Web Development', timeIn: '07:35:40 AM', status: 'Present', method: 'RFID', remarks: 'On-Time Tap Verified' }
    ]
  },
  '2026-1003': {
    id: '2026-1003',
    name: 'Reyes, Anna',
    section: 'BSIT 3-A',
    subject: 'Web Development',
    guardian: 'Mrs. Elena Reyes (0917-123-4567)',
    attendanceRate: '92.0%',
    presentDays: '46 Days',
    lateDays: 1,
    absentDays: '4 Days',
    absentBreakdown: '3 Excused • 1 Unexcused',
    punctualityScore: '96.0%',
    avgTime: '07:42 AM (8 mins before start)',
    streak: '4 consecutive days on-time',
    statusSummary: 'Good Standing',
    heatmap: {
      1: 'P', 2: 'P', 3: null, 4: null, 5: 'P', 6: 'P', 7: 'P', 8: 'P', 9: 'P',
      10: null, 11: null, 12: 'P', 13: 'P', 14: 'P', 15: 'L', 16: 'P',
      17: null, 18: null, 19: 'P', 20: 'E', 21: 'E', 22: 'E', 23: 'A',
      24: null, 25: null, 26: 'P', 27: 'P', 28: 'P', 29: 'P', 30: 'P', 31: null
    },
    logs: [
      { date: 'May 27, 2025', subject: 'Web Development', timeIn: '07:41:03 AM', status: 'Present', method: 'QR Code', remarks: 'Mobile QR Verified' },
      { date: 'May 26, 2025', subject: 'Web Development', timeIn: '07:44:10 AM', status: 'Present', method: 'QR Code', remarks: 'Mobile QR Verified' },
      { date: 'May 23, 2025', subject: 'Web Development', timeIn: '--', status: 'Absent', method: 'Manual', remarks: 'Unexcused Absence' },
      { date: 'May 22, 2025', subject: 'Web Development', timeIn: '--', status: 'Excused', method: 'Manual', remarks: 'Medical Slip Approved' },
      { date: 'May 21, 2025', subject: 'Web Development', timeIn: '--', status: 'Excused', method: 'Manual', remarks: 'Medical Slip Approved' },
      { date: 'May 20, 2025', subject: 'Web Development', timeIn: '--', status: 'Excused', method: 'Manual', remarks: 'Medical Slip Approved' },
      { date: 'May 19, 2025', subject: 'Web Development', timeIn: '07:40:15 AM', status: 'Present', method: 'QR Code', remarks: 'Mobile QR Verified' },
      { date: 'May 16, 2025', subject: 'Web Development', timeIn: '07:43:00 AM', status: 'Present', method: 'RFID', remarks: 'On-Time Tap Verified' },
      { date: 'May 15, 2025', subject: 'Web Development', timeIn: '07:54:12 AM', status: 'Late', method: 'QR Code', remarks: 'Late (9 mins)' },
      { date: 'May 14, 2025', subject: 'Web Development', timeIn: '07:39:20 AM', status: 'Present', method: 'RFID', remarks: 'On-Time Tap Verified' }
    ]
  },
  '2026-1007': {
    id: '2026-1007',
    name: 'Castro, Daniel',
    section: 'BSIT 3-A',
    subject: 'Web Development',
    guardian: 'Mr. Fernando Castro (0919-888-2233)',
    attendanceRate: '88.0%',
    presentDays: '44 Days',
    lateDays: 4,
    absentDays: '2 Days',
    absentBreakdown: '0 Excused • 2 Unexcused',
    punctualityScore: '78.0%',
    avgTime: '07:51 AM (6 mins late avg)',
    streak: '0 days on-time',
    statusSummary: 'Needs Follow-Up (Frequent Late)',
    heatmap: {
      1: 'P', 2: 'P', 3: null, 4: null, 5: 'P', 6: 'L', 7: 'P', 8: 'P', 9: 'P',
      10: null, 11: null, 12: 'P', 13: 'L', 14: 'P', 15: 'P', 16: 'A',
      17: null, 18: null, 19: 'P', 20: 'L', 21: 'P', 22: 'P', 23: 'A',
      24: null, 25: null, 26: 'P', 27: 'L', 28: 'P', 29: 'P', 30: 'P', 31: null
    },
    logs: [
      { date: 'May 27, 2025', subject: 'Web Development', timeIn: '07:51:22 AM', status: 'Late', method: 'RFID', remarks: 'Late (16 mins)' },
      { date: 'May 26, 2025', subject: 'Web Development', timeIn: '07:44:00 AM', status: 'Present', method: 'RFID', remarks: 'On-Time Tap' },
      { date: 'May 23, 2025', subject: 'Web Development', timeIn: '--', status: 'Absent', method: 'Manual', remarks: 'Unexcused Absence' },
      { date: 'May 20, 2025', subject: 'Web Development', timeIn: '07:46:10 AM', status: 'Late', method: 'RFID', remarks: 'Late (11 mins)' },
      { date: 'May 19, 2025', subject: 'Web Development', timeIn: '07:42:15 AM', status: 'Present', method: 'RFID', remarks: 'On-Time Tap' },
      { date: 'May 16, 2025', subject: 'Web Development', timeIn: '--', status: 'Absent', method: 'Manual', remarks: 'Unexcused Absence' },
      { date: 'May 13, 2025', subject: 'Web Development', timeIn: '07:49:05 AM', status: 'Late', method: 'RFID', remarks: 'Late (14 mins)' },
      { date: 'May 12, 2025', subject: 'Web Development', timeIn: '07:43:50 AM', status: 'Present', method: 'RFID', remarks: 'On-Time Tap' },
      { date: 'May 06, 2025', subject: 'Web Development', timeIn: '07:47:30 AM', status: 'Late', method: 'RFID', remarks: 'Late (12 mins)' },
      { date: 'May 05, 2025', subject: 'Web Development', timeIn: '07:40:00 AM', status: 'Present', method: 'RFID', remarks: 'On-Time Tap' }
    ]
  },
  '2026-1008': {
    id: '2026-1008',
    name: 'Bautista, Elena',
    section: 'BSIT 3-A',
    subject: 'Web Development',
    guardian: 'Mrs. Sonia Bautista (0921-777-6655)',
    attendanceRate: '86.0%',
    presentDays: '43 Days',
    lateDays: 3,
    absentDays: '4 Days',
    absentBreakdown: '2 Excused • 2 Unexcused',
    punctualityScore: '80.0%',
    avgTime: '07:53 AM (8 mins late avg)',
    streak: '0 days on-time',
    statusSummary: 'Needs Follow-Up',
    heatmap: {
      1: 'P', 2: 'P', 3: null, 4: null, 5: 'P', 6: 'P', 7: 'P', 8: 'A', 9: 'A',
      10: null, 11: null, 12: 'P', 13: 'P', 14: 'P', 15: 'L', 16: 'P',
      17: null, 18: null, 19: 'P', 20: 'E', 21: 'E', 22: 'L', 23: 'P',
      24: null, 25: null, 26: 'P', 27: 'L', 28: 'P', 29: 'P', 30: 'P', 31: null
    },
    logs: [
      { date: 'May 27, 2025', subject: 'Web Development', timeIn: '07:55:40 AM', status: 'Late', method: 'QR Code', remarks: 'Late (20 mins)' },
      { date: 'May 26, 2025', subject: 'Web Development', timeIn: '07:43:20 AM', status: 'Present', method: 'QR Code', remarks: 'Mobile QR Verified' },
      { date: 'May 22, 2025', subject: 'Web Development', timeIn: '07:52:15 AM', status: 'Late', method: 'QR Code', remarks: 'Late (17 mins)' },
      { date: 'May 21, 2025', subject: 'Web Development', timeIn: '--', status: 'Excused', method: 'Manual', remarks: 'Family Emergency Note' },
      { date: 'May 20, 2025', subject: 'Web Development', timeIn: '--', status: 'Excused', method: 'Manual', remarks: 'Family Emergency Note' },
      { date: 'May 19, 2025', subject: 'Web Development', timeIn: '07:44:00 AM', status: 'Present', method: 'QR Code', remarks: 'Mobile QR Verified' },
      { date: 'May 15, 2025', subject: 'Web Development', timeIn: '07:53:00 AM', status: 'Late', method: 'QR Code', remarks: 'Late (18 mins)' },
      { date: 'May 09, 2025', subject: 'Web Development', timeIn: '--', status: 'Absent', method: 'Manual', remarks: 'Unexcused' },
      { date: 'May 08, 2025', subject: 'Web Development', timeIn: '--', status: 'Absent', method: 'Manual', remarks: 'Unexcused' },
      { date: 'May 07, 2025', subject: 'Web Development', timeIn: '07:41:00 AM', status: 'Present', method: 'QR Code', remarks: 'Mobile QR Verified' }
    ]
  },
  '2026-1010': {
    id: '2026-1010',
    name: 'Ramos, Joshua',
    section: 'BSIT 3-A',
    subject: 'Web Development',
    guardian: 'Mrs. Maria Ramos (0920-555-1212)',
    attendanceRate: '84.0%',
    presentDays: '42 Days',
    lateDays: 2,
    absentDays: '6 Days',
    absentBreakdown: '0 Excused • 6 Unexcused',
    punctualityScore: '82.0%',
    avgTime: '07:46 AM (1 min late avg)',
    streak: '1 day on-time',
    statusSummary: 'Chronic Absence Risk',
    heatmap: {
      1: 'A', 2: 'A', 3: null, 4: null, 5: 'P', 6: 'P', 7: 'A', 8: 'A', 9: 'P',
      10: null, 11: null, 12: 'P', 13: 'L', 14: 'P', 15: 'P', 16: 'P',
      17: null, 18: null, 19: 'A', 20: 'A', 21: 'P', 22: 'L', 23: 'P',
      24: null, 25: null, 26: 'P', 27: 'P', 28: 'P', 29: 'P', 30: 'P', 31: null
    },
    logs: [
      { date: 'May 27, 2025', subject: 'Web Development', timeIn: '07:46:00 AM', status: 'Present', method: 'Manual', remarks: 'Manual Override Recorded' },
      { date: 'May 26, 2025', subject: 'Web Development', timeIn: '07:43:10 AM', status: 'Present', method: 'RFID', remarks: 'On-Time Tap' },
      { date: 'May 22, 2025', subject: 'Web Development', timeIn: '07:54:00 AM', status: 'Late', method: 'RFID', remarks: 'Late (19 mins)' },
      { date: 'May 20, 2025', subject: 'Web Development', timeIn: '--', status: 'Absent', method: 'Manual', remarks: 'Unexcused Absence' },
      { date: 'May 19, 2025', subject: 'Web Development', timeIn: '--', status: 'Absent', method: 'Manual', remarks: 'Unexcused Absence' },
      { date: 'May 13, 2025', subject: 'Web Development', timeIn: '07:49:15 AM', status: 'Late', method: 'RFID', remarks: 'Late (14 mins)' },
      { date: 'May 08, 2025', subject: 'Web Development', timeIn: '--', status: 'Absent', method: 'Manual', remarks: 'Unexcused Absence' },
      { date: 'May 07, 2025', subject: 'Web Development', timeIn: '--', status: 'Absent', method: 'Manual', remarks: 'Unexcused Absence' },
      { date: 'May 02, 2025', subject: 'Web Development', timeIn: '--', status: 'Absent', method: 'Manual', remarks: 'Unexcused Absence' },
      { date: 'May 01, 2025', subject: 'Web Development', timeIn: '--', status: 'Absent', method: 'Manual', remarks: 'Unexcused Absence' }
    ]
  }
};

let activeStudentId = '2026-1001';

document.addEventListener('DOMContentLoaded', () => {
  initURLParam();
  initStudentDropdown();
  loadStudentProfile(activeStudentId);
});

/**
 * Read URL Parameter ?id=2026-1007
 */
function initURLParam() {
  const params = new URLSearchParams(window.location.search);
  const paramId = params.get('id');
  if (paramId && STUDENTS_PROFILE_DATA[paramId]) {
    activeStudentId = paramId;
    const dropdown = document.getElementById('studentSelectDropdown');
    if (dropdown) dropdown.value = paramId;
  }
}

/**
 * Initialize Student Dropdown Switcher
 */
function initStudentDropdown() {
  const dropdown = document.getElementById('studentSelectDropdown');
  if (dropdown) {
    dropdown.addEventListener('change', (e) => {
      const selectedId = e.target.value;
      if (STUDENTS_PROFILE_DATA[selectedId]) {
        activeStudentId = selectedId;
        loadStudentProfile(selectedId);
        showToast(`Loaded profile for ${STUDENTS_PROFILE_DATA[selectedId].name}`, 'info');
      }
    });
  }
}

/**
 * Load & Render Selected Student Profile
 */
function loadStudentProfile(studentId) {
  const student = STUDENTS_PROFILE_DATA[studentId] || STUDENTS_PROFILE_DATA['2026-1001'];

  // Update Header Card Info
  updateText('profileStudentName', student.name);
  updateText('profileStudentIdBadge', student.id);
  updateText('profileClassSection', `Enrolled: ${student.subject} (${student.section})`);
  updateText('profileGuardian', `Parent/Guardian: ${student.guardian}`);

  // KPI Metrics
  updateText('kpiAttendanceRate', student.attendanceRate);
  updateText('kpiPresentDays', student.presentDays);
  updateText('kpiLateDays', student.lateDays);
  updateText('kpiPunctualityScore', `${student.punctualityScore} punctuality score`);
  updateText('kpiAbsenceDays', student.absentDays);
  updateText('kpiAbsenceBreakdown', student.absentBreakdown);

  // Rate feedback text
  const rateNum = parseFloat(student.attendanceRate) || 0;
  const rateTextEl = document.getElementById('kpiAttendanceRateText');
  if (rateTextEl) {
    if (rateNum >= 95) {
      rateTextEl.textContent = 'Excellent attendance standing';
      rateTextEl.className = 'text-[11px] text-[#16a34a] font-medium mt-2';
    } else if (rateNum >= 85) {
      rateTextEl.textContent = 'Good attendance standing';
      rateTextEl.className = 'text-[11px] text-[#2563eb] font-medium mt-2';
    } else {
      rateTextEl.textContent = 'Attendance warning threshold';
      rateTextEl.className = 'text-[11px] text-[#dc2626] font-medium mt-2';
    }
  }

  // Trend Analysis
  updateText('trendConsistencyScore', student.punctualityScore);
  const progressBar = document.getElementById('trendProgressBar');
  if (progressBar) progressBar.style.width = student.punctualityScore;

  updateText('trendAvgTime', student.avgTime);
  updateText('trendStreak', student.streak);
  updateText('trendStatusSummary', student.statusSummary);

  const statusSummaryEl = document.getElementById('trendStatusSummary');
  if (statusSummaryEl) {
    statusSummaryEl.className = rateNum >= 90 ? 'text-emerald-600 font-bold' : 'text-red-600 font-bold';
  }

  // Render Heatmap Matrix
  renderMonthlyHeatmap(student.heatmap);

  // Render Daily Logs Stream
  renderDailyLogsTable(student.logs);
}

/**
 * Generate 31-Day Heatmap Matrix for May 2025
 * May 1, 2025 starts on Thursday (index 4 in Sun-Sat 0-6 array)
 */
function renderMonthlyHeatmap(heatmapData) {
  const grid = document.getElementById('calendarHeatmapGrid');
  if (!grid) return;

  const firstDayOffset = 4; // Thursday
  let cellsHtml = '';

  // Empty leading cells for Sunday–Wednesday (4 cells)
  for (let i = 0; i < firstDayOffset; i++) {
    cellsHtml += `<div class="h-10 rounded-lg bg-gray-50/40 border border-dashed border-gray-200"></div>`;
  }

  // Days 1 through 31
  for (let day = 1; day <= 31; day++) {
    const status = heatmapData[day];
    let pillClass = 'bg-gray-100 text-gray-400 border border-gray-200'; // Weekend / No class
    let label = 'No Class';

    if (status === 'P') {
      pillClass = 'bg-[#dcfce7] text-[#166534] border border-[#bbf7d0] font-bold';
      label = 'Present';
    } else if (status === 'L') {
      pillClass = 'bg-[#fef3c7] text-[#92400e] border border-[#fde68a] font-bold';
      label = 'Late';
    } else if (status === 'A') {
      pillClass = 'bg-[#fee2e2] text-[#991b1b] border border-[#fecaca] font-bold';
      label = 'Absent';
    } else if (status === 'E') {
      pillClass = 'bg-[#dbeafe] text-[#1e40af] border border-[#bfdbfe] font-bold';
      label = 'Excused';
    }

    cellsHtml += `
      <div class="h-10 rounded-lg p-1 flex flex-col items-center justify-between transition-all hover:scale-105 shadow-2xs ${pillClass}" title="May ${day}, 2025: ${label}">
        <span class="text-[10px] font-bold">${day}</span>
        <span class="text-[9px] font-extrabold">${status || '-'}</span>
      </div>
    `;
  }

  grid.innerHTML = cellsHtml;
}

/**
 * Render Daily Logs Table
 */
function renderDailyLogsTable(logs) {
  const tbody = document.getElementById('studentHistoryTableBody');
  const countBadge = document.getElementById('historyLogCountBadge');
  if (!tbody) return;

  if (countBadge) countBadge.textContent = `${logs.length} Records`;

  tbody.innerHTML = logs.map(log => {
    let badgeClass = 'status-badge status-badge-present';
    if (log.status === 'Late') badgeClass = 'status-badge status-badge-late';
    else if (log.status === 'Absent') badgeClass = 'status-badge status-badge-absent';
    else if (log.status === 'Excused') badgeClass = 'status-badge status-badge-excused';

    let methodBadgeClass = 'method-badge method-badge-rfid';
    if (log.method === 'QR Code') methodBadgeClass = 'method-badge method-badge-qr';
    else if (log.method === 'Manual') methodBadgeClass = 'method-badge method-badge-manual';

    return `
      <tr class="hover:bg-[#f9fafb] transition-colors">
        <td class="py-3.5 px-4 font-semibold text-[#111827] text-xs">${log.date}</td>
        <td class="py-3.5 px-4 font-medium text-[#4b5563] text-xs">${log.subject}</td>
        <td class="py-3.5 px-4 font-mono font-medium text-[#374151] text-xs">${log.timeIn}</td>
        <td class="py-3.5 px-4">
          <span class="${badgeClass}">${log.status}</span>
        </td>
        <td class="py-3.5 px-4 font-medium text-[#374151]">
          <span class="${methodBadgeClass}">${log.method}</span>
        </td>
        <td class="py-3.5 px-4 font-medium text-[#6b7280] text-xs">${log.remarks}</td>
      </tr>
    `;
  }).join('');
}

/**
 * Print Report
 */
window.printReport = function() {
  window.print();
};

/**
 * Utility functions
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
