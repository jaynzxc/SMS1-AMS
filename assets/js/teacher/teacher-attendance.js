/**
 * Teacher Attendance JavaScript Module
 * Handles personal attendance records, calendar view, history table, and export functions.
 */

// Sample personal attendance dataset for the teacher (Mrs. Jane Dela Cruz)
const attendanceData = [
  { date: '2026-09-03', timeIn: '07:18 AM', timeOut: '--:--', hours: 'Ongoing', status: 'Present', method: 'RFID Tap', checkpoint: 'Gate 1 RFID Terminal', remarks: 'On Time' },
  { date: '2026-09-02', timeIn: '07:15 AM', timeOut: '05:02 PM', hours: '9h 47m', status: 'Present', method: 'RFID Tap', checkpoint: 'Gate 1 RFID Terminal', remarks: 'On Time' },
  { date: '2026-09-01', timeIn: '07:35 AM', timeOut: '05:10 PM', hours: '9h 35m', status: 'Late', method: 'RFID Tap', checkpoint: 'Gate 1 RFID Terminal', remarks: 'Late by 20 mins' },
  { date: '2026-08-31', timeIn: '--:--', timeOut: '--:--', hours: '0h 00m', status: 'Holiday', method: 'System', checkpoint: 'Campus', remarks: 'National Heroes Day' },
  { date: '2026-08-28', timeIn: '07:10 AM', timeOut: '05:00 PM', hours: '9h 50m', status: 'Present', method: 'RFID Tap', checkpoint: 'Gate 2 RFID Terminal', remarks: 'On Time' },
  { date: '2026-08-27', timeIn: '07:22 AM', timeOut: '05:15 PM', hours: '9h 53m', status: 'Present', method: 'RFID Tap', checkpoint: 'Gate 1 RFID Terminal', remarks: 'On Time' },
  { date: '2026-08-26', timeIn: '07:12 AM', timeOut: '05:05 PM', hours: '9h 53m', status: 'Present', method: 'QR Code', checkpoint: 'Faculty Room Scanner', remarks: 'Backup QR Scan' },
  { date: '2026-08-25', timeIn: '07:14 AM', timeOut: '05:01 PM', hours: '9h 47m', status: 'Present', method: 'RFID Tap', checkpoint: 'Gate 1 RFID Terminal', remarks: 'On Time' },
  { date: '2026-08-24', timeIn: '07:42 AM', timeOut: '05:30 PM', hours: '9h 48m', status: 'Late', method: 'RFID Tap', checkpoint: 'Gate 1 RFID Terminal', remarks: 'Late by 27 mins' },
  { date: '2026-08-21', timeIn: '--:--', timeOut: '--:--', hours: '0h 00m', status: 'Holiday', method: 'System', checkpoint: 'Campus', remarks: 'Ninoy Aquino Day' },
  { date: '2026-08-20', timeIn: '07:18 AM', timeOut: '05:08 PM', hours: '9h 50m', status: 'Present', method: 'RFID Tap', checkpoint: 'Gate 1 RFID Terminal', remarks: 'On Time' },
  { date: '2026-08-19', timeIn: '07:16 AM', timeOut: '05:00 PM', hours: '9h 44m', status: 'Present', method: 'RFID Tap', checkpoint: 'Gate 1 RFID Terminal', remarks: 'On Time' },
  { date: '2026-08-18', timeIn: '07:10 AM', timeOut: '05:02 PM', hours: '9h 52m', status: 'Present', method: 'RFID Tap', checkpoint: 'Gate 1 RFID Terminal', remarks: 'On Time' },
  { date: '2026-08-17', timeIn: '07:20 AM', timeOut: '05:12 PM', hours: '9h 52m', status: 'Present', method: 'RFID Tap', checkpoint: 'Gate 1 RFID Terminal', remarks: 'On Time' },
  { date: '2026-08-14', timeIn: '07:15 AM', timeOut: '05:00 PM', hours: '9h 45m', status: 'Present', method: 'RFID Tap', checkpoint: 'Gate 2 RFID Terminal', remarks: 'On Time' },
  { date: '2026-08-13', timeIn: '07:12 AM', timeOut: '05:04 PM', hours: '9h 52m', status: 'Present', method: 'RFID Tap', checkpoint: 'Gate 1 RFID Terminal', remarks: 'On Time' },
  { date: '2026-08-12', timeIn: '--:--', timeOut: '--:--', hours: '0h 00m', status: 'Absent', method: 'Manual', checkpoint: 'Dean Office', remarks: 'Official Leave (Medical)' }
];

// Scheduled classes mock data for day details modal
const schedulePerDay = {
  Monday: [
    { time: '08:00 AM - 10:00 AM', subject: 'Web Development', section: 'BSIT 2A', room: 'Lab 402' },
    { time: '10:30 AM - 12:30 PM', subject: 'Database Management', section: 'BSIT 2B', room: 'Lab 403' },
    { time: '01:30 PM - 03:30 PM', subject: 'Web Development', section: 'BSIT 2C', room: 'Lab 402' }
  ],
  Tuesday: [
    { time: '09:00 AM - 11:00 AM', subject: 'System Integration', section: 'BSIT 3A', room: 'Lab 405' },
    { time: '01:00 PM - 03:00 PM', subject: 'Database Management', section: 'BSIT 2A', room: 'Lab 403' },
    { time: '03:30 PM - 05:00 PM', subject: 'Consultation Hours', section: 'All Sections', room: 'Faculty Rm' }
  ],
  Wednesday: [
    { time: '08:00 AM - 10:00 AM', subject: 'Web Development', section: 'BSIT 2A', room: 'Lab 402' },
    { time: '10:30 AM - 12:30 PM', subject: 'Database Management', section: 'BSIT 2B', room: 'Lab 403' },
    { time: '02:00 PM - 04:00 PM', subject: 'System Integration', section: 'BSIT 3B', room: 'Lab 405' }
  ],
  Thursday: [
    { time: '09:00 AM - 11:00 AM', subject: 'System Integration', section: 'BSIT 3A', room: 'Lab 405' },
    { time: '01:00 PM - 03:00 PM', subject: 'Database Management', section: 'BSIT 2A', room: 'Lab 403' }
  ],
  Friday: [
    { time: '08:00 AM - 11:00 AM', subject: 'Capstone Project Advisory', section: 'BSIT 4A', room: 'Conf Rm 2' },
    { time: '01:00 PM - 04:00 PM', subject: 'Departmental Faculty Meeting', section: 'CITE Faculty', room: 'Audio-Visual Rm' }
  ]
};

// Calendar state
let currentYear = 2026;
let currentMonth = 8; // September (0-indexed: 8 = September)

document.addEventListener('DOMContentLoaded', () => {
  renderCalendar(currentYear, currentMonth);
  renderHistoryTable(attendanceData);
  setupEventListeners();
});

/**
 * Setup event listeners for filtering, modal closing, and exports
 */
function setupEventListeners() {
  // Table search input
  const searchInput = document.getElementById('tableSearchInput');
  if (searchInput) {
    searchInput.addEventListener('input', filterHistoryTable);
  }

  // Status filter
  const statusFilter = document.getElementById('tableStatusFilter');
  if (statusFilter) {
    statusFilter.addEventListener('change', filterHistoryTable);
  }

  // Month navigation
  const prevBtn = document.getElementById('prevMonthBtn');
  const nextBtn = document.getElementById('nextMonthBtn');
  const todayBtn = document.getElementById('todayMonthBtn');

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      currentMonth--;
      if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
      }
      renderCalendar(currentYear, currentMonth);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      currentMonth++;
      if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
      }
      renderCalendar(currentYear, currentMonth);
    });
  }

  if (todayBtn) {
    todayBtn.addEventListener('click', () => {
      const now = new Date();
      currentYear = now.getFullYear();
      currentMonth = now.getMonth();
      renderCalendar(currentYear, currentMonth);
    });
  }
}

/**
 * Render personal attendance monthly calendar with safe, non-overflowing cells
 */
function renderCalendar(year, month) {
  const calendarGrid = document.getElementById('calendarDaysGrid');
  const monthTitle = document.getElementById('calendarMonthTitle');
  if (!calendarGrid || !monthTitle) return;

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  monthTitle.textContent = `${monthNames[month]} ${year}`;

  calendarGrid.innerHTML = '';

  const firstDayIndex = new Date(year, month, 1).getDay(); // 0 = Sunday
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  // Previous month padding cells
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    const dayNumber = daysInPrevMonth - i;
    const cell = document.createElement('div');
    cell.className = 'min-h-[82px] p-2 bg-gray-50/40 rounded-lg border border-dashed border-gray-200/80 opacity-30 select-none overflow-hidden';
    cell.innerHTML = `<span class="text-[11px] font-semibold text-gray-400">${dayNumber}</span>`;
    calendarGrid.appendChild(cell);
  }

  // Current month active cells
  const today = new Date();
  const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;
  const todayDate = today.getDate();

  for (let d = 1; d <= daysInMonth; d++) {
    const formattedDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const dayRecord = attendanceData.find(item => item.date === formattedDate);
    const dayOfWeek = new Date(year, month, d).getDay();
    const isWeekend = (dayOfWeek === 0 || dayOfWeek === 6);
    const isToday = isCurrentMonth && d === todayDate;

    const cell = document.createElement('div');
    cell.className = `min-h-[82px] p-2 bg-white rounded-lg border transition-all flex flex-col justify-between cursor-pointer hover:shadow-xs overflow-hidden ${
      isToday ? 'border-[#0030c2] bg-[#f8faff]' : 'border-[#e5e7eb] hover:border-[#0030c2]/50'
    }`;

    // Top date row
    let headerHtml = `
      <div class="flex items-center justify-between gap-1">
        <span class="text-xs font-bold leading-none ${isToday ? 'w-5 h-5 rounded-full bg-[#0030c2] text-white flex items-center justify-center text-[10px]' : 'text-[#111827]'}">
          ${d}
        </span>
        ${isToday ? '<span class="text-[9px] font-extrabold text-[#0030c2] uppercase tracking-tight">Today</span>' : ''}
      </div>
    `;

    // Status pill
    let bodyHtml = '';
    if (dayRecord) {
      let badgeBg = 'bg-emerald-50 text-emerald-700 border-emerald-200';
      let dotColor = 'bg-emerald-500';

      if (dayRecord.status === 'Late') {
        badgeBg = 'bg-amber-50 text-amber-700 border-amber-200';
        dotColor = 'bg-amber-500';
      } else if (dayRecord.status === 'Absent') {
        badgeBg = 'bg-rose-50 text-rose-700 border-rose-200';
        dotColor = 'bg-rose-500';
      } else if (dayRecord.status === 'Holiday') {
        badgeBg = 'bg-blue-50 text-blue-700 border-blue-200';
        dotColor = 'bg-blue-500';
      }

      bodyHtml = `
        <div class="mt-1 space-y-0.5 overflow-hidden">
          <div class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold border max-w-full truncate ${badgeBg}">
            <span class="w-1.5 h-1.5 rounded-full shrink-0 ${dotColor}"></span>
            <span class="truncate">${dayRecord.status}</span>
          </div>
          ${dayRecord.timeIn !== '--:--' ? `
            <div class="text-[10px] text-gray-500 flex items-center gap-1 truncate font-mono">
              <span class="truncate">${dayRecord.timeIn}</span>
            </div>
          ` : ''}
        </div>
      `;
    } else if (isWeekend) {
      bodyHtml = `
        <div class="my-auto py-1">
          <span class="text-[10px] font-medium text-gray-400 block truncate">Weekend</span>
        </div>
      `;
    } else if (new Date(year, month, d) > today) {
      bodyHtml = `
        <div class="my-auto py-1">
          <span class="text-[10px] text-gray-300 block truncate">Upcoming</span>
        </div>
      `;
    } else {
      bodyHtml = `
        <div class="my-auto py-1">
          <span class="text-[10px] font-medium text-gray-400 block truncate">No Record</span>
        </div>
      `;
    }

    cell.innerHTML = headerHtml + bodyHtml;

    // Attach click listener for modal
    cell.addEventListener('click', () => {
      openDayDetailModal(formattedDate, dayRecord, dayOfWeek);
    });

    calendarGrid.appendChild(cell);
  }
}

/**
 * Open Day Detail Modal
 */
function openDayDetailModal(dateStr, record, dayOfWeekIndex) {
  const modal = document.getElementById('dayDetailModal');
  if (!modal) return;

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayName = dayNames[dayOfWeekIndex];

  document.getElementById('modalDateTitle').textContent = `${dateStr} (${dayName})`;
  document.getElementById('modalStatusText').textContent = record ? record.status : (dayOfWeekIndex === 0 || dayOfWeekIndex === 6 ? 'Weekend' : 'No Record');
  document.getElementById('modalTimeIn').textContent = record ? record.timeIn : '--:--';
  document.getElementById('modalTimeOut').textContent = record ? record.timeOut : '--:--';
  document.getElementById('modalHours').textContent = record ? record.hours : '--';
  document.getElementById('modalMethod').textContent = record ? record.method : '--';
  document.getElementById('modalRemarks').textContent = record ? record.remarks : 'No remarks logged.';

  // Populate scheduled classes for that day
  const classesContainer = document.getElementById('modalClassesList');
  if (classesContainer) {
    const classes = schedulePerDay[dayName] || [];
    if (classes.length > 0) {
      classesContainer.innerHTML = classes.map(c => `
        <div class="p-2.5 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-between gap-2">
          <div class="min-w-0">
            <p class="text-xs font-bold text-[#111827] truncate">${c.subject}</p>
            <p class="text-[11px] text-gray-500 truncate">${c.section} • Room: ${c.room}</p>
          </div>
          <span class="px-2 py-0.5 text-[10px] font-semibold rounded bg-blue-50 text-[#0030c2] border border-blue-200 shrink-0">${c.time}</span>
        </div>
      `).join('');
    } else {
      classesContainer.innerHTML = `<p class="text-xs text-gray-500 italic">No scheduled teaching classes on ${dayName}s.</p>`;
    }
  }

  modal.classList.remove('hidden');
}

/**
 * Close Day Detail Modal
 */
window.closeDayDetailModal = function() {
  const modal = document.getElementById('dayDetailModal');
  if (modal) modal.classList.add('hidden');
};

/**
 * Render personal attendance history table
 */
function renderHistoryTable(data) {
  const tbody = document.getElementById('attendanceHistoryTableBody');
  if (!tbody) return;

  if (data.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" class="py-8 text-center text-xs text-gray-500">
          No attendance records found matching your filters.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = data.map((row) => {
    let statusClass = 'bg-emerald-50 text-emerald-700 border-emerald-200';
    if (row.status === 'Late') statusClass = 'bg-amber-50 text-amber-700 border-amber-200';
    if (row.status === 'Absent') statusClass = 'bg-rose-50 text-rose-700 border-rose-200';
    if (row.status === 'Holiday') statusClass = 'bg-blue-50 text-blue-700 border-blue-200';

    return `
      <tr class="border-b border-[#f1f5f9] hover:bg-gray-50/80 transition-colors">
        <td class="py-3 px-4 text-xs font-semibold text-[#111827] whitespace-nowrap">
          ${row.date}
        </td>
        <td class="py-3 px-4 text-xs font-mono font-medium text-[#111827] whitespace-nowrap">
          ${row.timeIn}
        </td>
        <td class="py-3 px-4 text-xs font-mono font-medium text-[#111827] whitespace-nowrap">
          ${row.timeOut}
        </td>
        <td class="py-3 px-4 text-xs font-medium text-[#4b5563] whitespace-nowrap">
          ${row.hours}
        </td>
        <td class="py-3 px-4 whitespace-nowrap">
          <span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold border ${statusClass}">
            ${row.status}
          </span>
        </td>
        <td class="py-3 px-4 text-xs text-[#6b7280] whitespace-nowrap">
          <span class="inline-flex items-center gap-1.5">
            <svg class="w-3.5 h-3.5 text-[#0030c2] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            <span>${row.method}</span>
          </span>
        </td>
        <td class="py-3 px-4 text-xs text-[#6b7280]">
          ${row.remarks}
        </td>
      </tr>
    `;
  }).join('');

  // Update records count label
  const countEl = document.getElementById('tableRecordsCount');
  if (countEl) {
    countEl.textContent = `Showing ${data.length} records`;
  }
}

/**
 * Filter Attendance History Table
 */
function filterHistoryTable() {
  const searchTerm = (document.getElementById('tableSearchInput')?.value || '').toLowerCase().trim();
  const statusFilter = document.getElementById('tableStatusFilter')?.value || 'All';

  const filtered = attendanceData.filter(row => {
    const matchesSearch = row.date.toLowerCase().includes(searchTerm) ||
                          row.method.toLowerCase().includes(searchTerm) ||
                          row.remarks.toLowerCase().includes(searchTerm);
    const matchesStatus = statusFilter === 'All' || row.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  renderHistoryTable(filtered);
}

/**
 * Download Personal Attendance Ledger as CSV
 */
window.downloadAttendanceCSV = function() {
  const headers = ['Date', 'Time In', 'Time Out', 'Duty Hours', 'Status', 'Method', 'Remarks'];
  const rows = attendanceData.map(r => [
    `"${r.date}"`,
    `"${r.timeIn}"`,
    `"${r.timeOut}"`,
    `"${r.hours}"`,
    `"${r.status}"`,
    `"${r.method}"`,
    `"${r.remarks}"`
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `Teacher_Attendance_Ledger_Mrs_Jane_Dela_Cruz_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
