// assets/js/student/my-attendance.js
// Student My Attendance Module for Bestlink College of the Philippines Attendance Monitoring System

import { supabase } from '../config/supabaseClient.js';

// Local Mock Data for Attendance Logs
const attendanceData = [
  {
    id: 1,
    date: 'May 27, 2025 (Tue)',
    dateRaw: '2025-05-27',
    subject: 'Introduction to Computing',
    teacher: 'Mrs. Jane Dela Cruz',
    timeIn: '7:48 AM',
    schedule: '7:30 AM - 9:00 AM',
    status: 'Present',
    method: 'RFID',
    remarks: '-'
  },
  {
    id: 2,
    date: 'May 26, 2025 (Mon)',
    dateRaw: '2025-05-26',
    subject: 'Web Development',
    teacher: 'Mr. Carlo Reyes',
    timeIn: '9:17 AM',
    schedule: '9:00 AM - 10:30 AM',
    status: 'Late',
    method: 'QR Code',
    remarks: 'Late 17 mins'
  },
  {
    id: 3,
    date: 'May 23, 2025 (Fri)',
    dateRaw: '2025-05-23',
    subject: 'Database Systems',
    teacher: 'Ms. Angela Ramos',
    timeIn: '1:03 PM',
    schedule: '1:00 PM - 2:30 PM',
    status: 'Present',
    method: 'RFID',
    remarks: '-'
  },
  {
    id: 4,
    date: 'May 22, 2025 (Thu)',
    dateRaw: '2025-05-22',
    subject: 'Systems Analysis',
    teacher: 'Mr. Benj Torres',
    timeIn: '2:45 PM',
    schedule: '2:45 PM - 4:15 PM',
    status: 'Present',
    method: 'QR Code',
    remarks: '-'
  },
  {
    id: 5,
    date: 'May 21, 2025 (Wed)',
    dateRaw: '2025-05-21',
    subject: 'Introduction to Computing',
    teacher: 'Mrs. Jane Dela Cruz',
    timeIn: '7:30 AM',
    schedule: '7:30 AM - 9:00 AM',
    status: 'Absent',
    method: '-',
    remarks: 'No valid reason'
  },
  {
    id: 6,
    date: 'May 20, 2025 (Tue)',
    dateRaw: '2025-05-20',
    subject: 'Web Development',
    teacher: 'Mr. Carlo Reyes',
    timeIn: '9:00 AM',
    schedule: '9:00 AM - 10:30 AM',
    status: 'Present',
    method: 'RFID',
    remarks: '-'
  },
  {
    id: 7,
    date: 'May 19, 2025 (Mon)',
    dateRaw: '2025-05-19',
    subject: 'Database Systems',
    teacher: 'Ms. Angela Ramos',
    timeIn: '1:00 PM',
    schedule: '1:00 PM - 2:30 PM',
    status: 'Excused',
    method: '-',
    remarks: 'Medical Certificate'
  },
  {
    id: 8,
    date: 'May 16, 2025 (Fri)',
    dateRaw: '2025-05-16',
    subject: 'Systems Analysis',
    teacher: 'Mr. Benj Torres',
    timeIn: '2:40 PM',
    schedule: '2:45 PM - 4:15 PM',
    status: 'Late',
    method: 'QR Code',
    remarks: 'Late 10 mins'
  },
  {
    id: 9,
    date: 'May 15, 2025 (Thu)',
    dateRaw: '2025-05-15',
    subject: 'Introduction to Computing',
    teacher: 'Mrs. Jane Dela Cruz',
    timeIn: '7:35 AM',
    schedule: '7:30 AM - 9:00 AM',
    status: 'Present',
    method: 'RFID',
    remarks: '-'
  },
  {
    id: 10,
    date: 'May 14, 2025 (Wed)',
    dateRaw: '2025-05-14',
    subject: 'Web Development',
    teacher: 'Mr. Carlo Reyes',
    timeIn: '9:05 AM',
    schedule: '9:00 AM - 10:30 AM',
    status: 'Present',
    method: 'RFID',
    remarks: '-'
  }
];

let filteredRecords = [...attendanceData];
let isAscending = false;
let currentPage = 1;
const pageSize = 10;

document.addEventListener('DOMContentLoaded', () => {
  console.log('📊 Student My Attendance Module Initialized');
  initCurrentDate();
  initSearch();
  exposeGlobalFunctions();
});

/**
 * Initialize current date in top bar
 */
function initCurrentDate() {
  const dateBtn = document.getElementById('currentDateDisplay');
  if (dateBtn) {
    const today = new Date();
    const dayOfWeek = today.toLocaleDateString('en-US', { weekday: 'long' });
    const monthDayYear = today.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    
    dateBtn.innerHTML = `
      <svg class="w-4 h-4 text-[#6b7280] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.75">
        <path stroke-linecap="round" stroke-linejoin="round"
          d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
      </svg>
      <span>${monthDayYear} (${dayOfWeek})</span>
    `;
  }
}

/**
 * Initialize live search input
 */
function initSearch() {
  const searchInput = document.getElementById('attendanceSearchInput');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const term = e.target.value.toLowerCase().trim();
      filterBySearchTerm(term);
    });
  }
}

/**
 * Filter records by search term
 */
function filterBySearchTerm(term) {
  filteredRecords = attendanceData.filter(item => {
    return (
      item.subject.toLowerCase().includes(term) ||
      item.teacher.toLowerCase().includes(term) ||
      item.remarks.toLowerCase().includes(term) ||
      item.status.toLowerCase().includes(term) ||
      item.date.toLowerCase().includes(term)
    );
  });
  renderTable();
}

/**
 * Render table rows
 */
function renderTable() {
  const tbody = document.getElementById('attendanceTableBody');
  const countBadge = document.getElementById('attendanceRecordCountBadge');
  const showingCount = document.getElementById('pageShowingCount');
  const totalCount = document.getElementById('pageTotalCount');

  if (!tbody) return;

  if (filteredRecords.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="8" class="text-center py-8 text-[#6b7280]">
          <p class="font-medium text-sm">No attendance records found matching your filters.</p>
          <button onclick="resetAllFilters()" class="mt-2 text-xs font-semibold text-[#0030c2] hover:underline cursor-pointer">Reset Filters</button>
        </td>
      </tr>
    `;
    if (countBadge) countBadge.textContent = '0 Records';
    if (showingCount) showingCount.textContent = '0';
    if (totalCount) totalCount.textContent = '0';
    return;
  }

  if (countBadge) countBadge.textContent = `${filteredRecords.length} Records`;
  if (showingCount) showingCount.textContent = `${filteredRecords.length}`;
  if (totalCount) totalCount.textContent = '45';

  tbody.innerHTML = filteredRecords.map(item => {
    let statusPill = '';
    if (item.status === 'Present') {
      statusPill = `<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#f0fdf4] text-[#16a34a] border border-[#bbf7d0]">Present</span>`;
    } else if (item.status === 'Late') {
      statusPill = `<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#fff7ed] text-[#f97316] border border-[#fed7aa]">Late</span>`;
    } else if (item.status === 'Absent') {
      statusPill = `<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#fef2f2] text-[#dc2626] border border-[#fecaca]">Absent</span>`;
    } else if (item.status === 'Excused') {
      statusPill = `<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#eff6ff] text-[#0030c2] border border-[#bfdbfe]">Excused</span>`;
    }

    let methodCol = '';
    if (item.method === 'RFID') {
      methodCol = `
        <span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-[#eff6ff] text-[#2563eb] border border-[#bfdbfe]">
          RFID
        </span>
      `;
    } else if (item.method === 'QR Code') {
      methodCol = `
        <span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-[#f0fdf4] text-[#16a34a] border border-[#bbf7d0]">
          QR Code
        </span>
      `;
    } else {
      methodCol = `<span class="text-[#9ca3af]">-</span>`;
    }

    return `
      <tr class="hover:bg-[#f9fafb] transition-colors">
        <td class="py-3 px-4 font-semibold text-[#111827] whitespace-nowrap">${item.date}</td>
        <td class="py-3 px-4 font-semibold text-[#111827]">${item.subject}</td>
        <td class="py-3 px-4 text-[#374151]">${item.teacher}</td>
        <td class="py-3 px-4 text-[#6b7280] font-mono">${item.timeIn}</td>
        <td class="py-3 px-4">${statusPill}</td>
        <td class="py-3 px-4">${methodCol}</td>
        <td class="py-3 px-4 text-[#6b7280]">${item.remarks}</td>
        <td class="py-3 px-4 text-center">
          <button onclick="openRecordModal(${item.id})" class="p-1.5 text-[#2563eb] hover:bg-blue-50 rounded-lg transition-colors cursor-pointer" title="View details">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

/**
 * Toggle date sorting
 */
function toggleDateSort() {
  isAscending = !isAscending;
  filteredRecords.sort((a, b) => {
    const d1 = new Date(a.dateRaw);
    const d2 = new Date(b.dateRaw);
    return isAscending ? d1 - d2 : d2 - d1;
  });
  renderTable();
}

/**
 * Filter modal functions
 */
function openFilterModal() {
  const modal = document.getElementById('filterModal');
  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }
}

function closeFilterModal() {
  const modal = document.getElementById('filterModal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
}

function applyModalFilters() {
  const dateInput = document.getElementById('filterDateInput').value;
  const subjectVal = document.getElementById('filterSubjectSelect').value;
  const statusVal = document.getElementById('filterStatusSelect').value;
  const methodVal = document.getElementById('filterMethodSelect').value;

  filteredRecords = attendanceData.filter(item => {
    let match = true;
    if (dateInput && item.dateRaw !== dateInput) match = false;
    if (subjectVal && item.subject !== subjectVal) match = false;
    if (statusVal && item.status !== statusVal) match = false;
    if (methodVal && item.method !== methodVal) match = false;
    return match;
  });

  const clearBtn = document.getElementById('clearFiltersBtn');
  if (clearBtn) {
    const hasFilter = dateInput || subjectVal || statusVal || methodVal;
    clearBtn.classList.toggle('hidden', !hasFilter);
    clearBtn.classList.toggle('flex', !!hasFilter);
  }

  renderTable();
  closeFilterModal();
}

function resetModalFilters() {
  document.getElementById('filterDateInput').value = '';
  document.getElementById('filterSubjectSelect').value = '';
  document.getElementById('filterStatusSelect').value = '';
  document.getElementById('filterMethodSelect').value = '';
}

function resetAllFilters() {
  resetModalFilters();
  const searchInput = document.getElementById('attendanceSearchInput');
  if (searchInput) searchInput.value = '';
  const clearBtn = document.getElementById('clearFiltersBtn');
  if (clearBtn) {
    clearBtn.classList.add('hidden');
    clearBtn.classList.remove('flex');
  }
  filteredRecords = [...attendanceData];
  renderTable();
}

/**
 * Record details modal
 */
function openRecordModal(id) {
  const record = attendanceData.find(item => item.id === id);
  if (!record) return;

  const subjectEl = document.getElementById('modalSubjectTitle') || document.getElementById('modalSubjectName');
  if (subjectEl) subjectEl.textContent = record.subject;

  const instructorEl = document.getElementById('modalInstructorName');
  if (instructorEl) instructorEl.textContent = record.teacher;

  const dateEl = document.getElementById('modalDateVal') || document.getElementById('modalDateValue');
  if (dateEl) dateEl.textContent = record.date;

  const timeInEl = document.getElementById('modalTimeInVal') || document.getElementById('modalTimeInValue');
  if (timeInEl) timeInEl.textContent = record.timeIn;

  const scheduleEl = document.getElementById('modalScheduleVal') || document.getElementById('modalScheduleValue');
  if (scheduleEl) scheduleEl.textContent = record.schedule;

  const remarksEl = document.getElementById('modalRemarksVal') || document.getElementById('modalRemarksValue');
  if (remarksEl) remarksEl.textContent = record.remarks;

  const sectionEl = document.getElementById('modalSectionName');
  if (sectionEl) sectionEl.textContent = 'BSIT 2A';

  const methodContainer = document.getElementById('modalMethodVal') || document.getElementById('modalMethodValue');
  if (methodContainer) {
    if (record.method === 'RFID') {
      methodContainer.innerHTML = `
        <span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-[#eff6ff] text-[#2563eb] border border-[#bfdbfe]">
          RFID
        </span>
      `;
    } else if (record.method === 'QR Code') {
      methodContainer.innerHTML = `
        <span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-[#f0fdf4] text-[#16a34a] border border-[#bbf7d0]">
          QR Code
        </span>
      `;
    } else {
      methodContainer.innerHTML = `<span class="text-[#9ca3af]">-</span>`;
    }
  }

  const badgeContainer = document.getElementById('modalStatusBadgeContainer');
  if (badgeContainer) {
    let badgeHtml = '';
    if (record.status === 'Present') {
      badgeHtml = `<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#f0fdf4] text-[#16a34a] border border-[#bbf7d0]">Present</span>`;
    } else if (record.status === 'Late') {
      badgeHtml = `<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#fff7ed] text-[#f97316] border border-[#fed7aa]">Late</span>`;
    } else if (record.status === 'Absent') {
      badgeHtml = `<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#fef2f2] text-[#dc2626] border border-[#fecaca]">Absent</span>`;
    } else if (record.status === 'Excused') {
      badgeHtml = `<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#eff6ff] text-[#0030c2] border border-[#bfdbfe]">Excused</span>`;
    }
    badgeContainer.innerHTML = badgeHtml;
  }

  const modal = document.getElementById('recordDetailModal');
  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }
}

function closeRecordModal() {
  const modal = document.getElementById('recordDetailModal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
}

/**
 * Simplified Pagination helpers
 */
function goToPreviousPage() {
  console.log('Previous page clicked');
}

function goToNextPage() {
  console.log('Next page clicked');
}

/**
 * Expose functions to window object for inline HTML event handlers
 */
function exposeGlobalFunctions() {
  window.openFilterModal = openFilterModal;
  window.closeFilterModal = closeFilterModal;
  window.applyModalFilters = applyModalFilters;
  window.resetModalFilters = resetModalFilters;
  window.resetAllFilters = resetAllFilters;
  window.openRecordModal = openRecordModal;
  window.closeRecordModal = closeRecordModal;
  window.goToPreviousPage = goToPreviousPage;
  window.goToNextPage = goToNextPage;
}
