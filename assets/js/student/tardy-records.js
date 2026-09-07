// assets/js/student/tardy-records.js
// Student Tardy Records Module for Bestlink College of the Philippines Attendance Monitoring System
// Follows student/my-attendance.js design and logic conventions 1:1

import { supabase } from '../config/supabaseClient.js';

// Local Mock Data for Tardy Logs (Without day of week name)
const tardyData = [
  {
    id: 1,
    date: 'May 26, 2025',
    dateRaw: '2025-05-26',
    subject: 'Web Development',
    section: 'BSIT 3A',
    teacher: 'Mr. Carlo Reyes',
    timeIn: '9:17 AM',
    schedule: '9:00 AM - 10:30 AM',
    delayMins: 17,
    status: 'Late',
    method: 'QR Code',
    remarks: 'Late 17 mins - Transit congestion'
  },
  {
    id: 2,
    date: 'May 16, 2025',
    dateRaw: '2025-05-16',
    subject: 'Systems Analysis',
    section: 'BSIT 3A',
    teacher: 'Mr. Benj Torres',
    timeIn: '2:55 PM',
    schedule: '2:45 PM - 4:15 PM',
    delayMins: 10,
    status: 'Late',
    method: 'QR Code',
    remarks: 'Late 10 mins - Laboratory transition'
  },
  {
    id: 3,
    date: 'May 08, 2025',
    dateRaw: '2025-05-08',
    subject: 'Web Development',
    section: 'BSIT 3A',
    teacher: 'Mr. Carlo Reyes',
    timeIn: '9:25 AM',
    schedule: '9:00 AM - 10:30 AM',
    delayMins: 25,
    status: 'Late',
    method: 'RFID',
    remarks: 'Late 25 mins - Transport breakdown'
  },
  {
    id: 4,
    date: 'April 24, 2025',
    dateRaw: '2025-04-24',
    subject: 'Database Systems',
    section: 'BSIT 3A',
    teacher: 'Ms. Angela Ramos',
    timeIn: '1:16 PM',
    schedule: '1:00 PM - 2:30 PM',
    delayMins: 16,
    status: 'Late',
    method: 'RFID',
    remarks: 'Late 16 mins - Heavy rainfall'
  }
];

let allRecords = [...tardyData];
let filteredRecords = [...tardyData];
let currentPage = 1;
const pageSize = 10;

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', async () => {
  console.log('⏰ Student Tardy Records Module Initialized');
  initCurrentDate();
  await loadTardyRecords();
  initSearch();
  initModalsAndBackdrops();
  exposeGlobalFunctions();
});

/**
 * Initialize current date in top bar (Matches rfid-and-qr.html & my-attendance.html)
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
 * Fetch records from Supabase or fallback to mock
 */
async function loadTardyRecords() {
  try {
    if (supabase) {
      const { data, error } = await supabase
        .from('attendance_records')
        .select('*')
        .eq('status', 'Late')
        .order('date', { ascending: false });

      if (!error && data && data.length > 0) {
        allRecords = data.map((item, idx) => ({
          id: item.id || idx + 1,
          date: item.date ? new Date(item.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Recent Date',
          dateRaw: item.date || '',
          subject: item.subject_name || item.subject || 'Enrolled Course',
          section: item.section || 'BSIT 3A',
          teacher: item.teacher_name || item.teacher || 'Instructor',
          timeIn: item.time_in || 'Late Arrival',
          schedule: item.schedule || 'Scheduled Period',
          delayMins: parseInt(item.delay_mins || item.late_minutes || 15, 10),
          status: 'Late',
          method: item.method || 'RFID',
          remarks: item.remarks || `Late ${item.delay_mins || 15} mins`
        }));
      }
    }
  } catch (err) {
    console.warn('Supabase offline or table missing, using mock dataset:', err);
  }

  filteredRecords = [...allRecords];
  updateSummaryKPIs();
  renderTable();
}

/**
 * Update 5 KPI Statistics Cards (Matching my-attendance.html card format)
 */
function updateSummaryKPIs() {
  const totalLate = allRecords.length;
  const totalDelayMins = allRecords.reduce((sum, item) => sum + (item.delayMins || 0), 0);
  const avgDelay = totalLate > 0 ? (totalDelayMins / totalLate).toFixed(1) : '0.0';

  // Card 1: Total Late
  const statTotalLateEl = document.getElementById('statTotalLate');
  if (statTotalLateEl) statTotalLateEl.textContent = totalLate;

  const statLateRateEl = document.getElementById('statLateRate');
  if (statLateRateEl) {
    const pct = ((totalLate / 45) * 100).toFixed(2);
    statLateRateEl.textContent = `${pct}% of total (${totalLate}/45)`;
  }

  // Card 2: Total Delay
  const statAccumulatedDelayEl = document.getElementById('statAccumulatedDelay');
  if (statAccumulatedDelayEl) statAccumulatedDelayEl.textContent = `${totalDelayMins} mins`;

  // Card 3: Average Delay
  const statAvgDelayEl = document.getElementById('statAvgDelay');
  if (statAvgDelayEl) statAvgDelayEl.textContent = `${avgDelay} mins`;

  // Card 4: Policy Standing
  const statPolicyStandingEl = document.getElementById('statPolicyStanding');
  const statPolicySubtextEl = document.getElementById('statPolicySubtext');
  if (statPolicyStandingEl && statPolicySubtextEl) {
    if (totalLate >= 3) {
      statPolicyStandingEl.textContent = 'Warning';
      statPolicyStandingEl.className = 'text-2xl font-extrabold text-[#dc2626]';
      statPolicySubtextEl.textContent = '1 Unexcused equivalent (3/3)';
    } else {
      statPolicyStandingEl.textContent = 'Good';
      statPolicyStandingEl.className = 'text-2xl font-extrabold text-[#16a34a]';
      statPolicySubtextEl.textContent = `${3 - totalLate} lates remaining in buffer`;
    }
  }

  // Card 5: Punctuality Rate
  const statPunctualityRateEl = document.getElementById('statPunctualityRate');
  if (statPunctualityRateEl) {
    const punctuality = (((45 - totalLate) / 45) * 100).toFixed(2);
    statPunctualityRateEl.textContent = `${punctuality}%`;
  }
}

/**
 * Render the Tardy Records Table (Status is strictly "Late" without duration)
 */
function renderTable() {
  const tbody = document.getElementById('tardyTableBody');
  const countBadge = document.getElementById('tardyRecordCountBadge');
  const showingCount = document.getElementById('pageShowingCount');
  const totalCount = document.getElementById('pageTotalCount');

  if (!tbody) return;

  if (filteredRecords.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="8" class="text-center py-8 text-[#6b7280]">
          <p class="font-medium text-sm">No tardy records found matching your filters.</p>
          <button onclick="resetAllFilters()" class="mt-2 text-xs font-semibold text-[#0030c2] hover:underline cursor-pointer">Reset Filters</button>
        </td>
      </tr>
    `;
    if (countBadge) countBadge.textContent = '0 Records';
    if (showingCount) showingCount.textContent = '0';
    if (totalCount) totalCount.textContent = `${allRecords.length}`;
    return;
  }

  if (countBadge) countBadge.textContent = `${filteredRecords.length} ${filteredRecords.length === 1 ? 'Log' : 'Logs'}`;
  if (showingCount) showingCount.textContent = `${filteredRecords.length}`;
  if (totalCount) totalCount.textContent = `${allRecords.length}`;

  tbody.innerHTML = filteredRecords.map(item => {
    // Status pill: purely "Late" without delay duration
    const statusPill = `<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#fff7ed] text-[#f97316] border border-[#fed7aa]">Late</span>`;

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
 * Initialize live search input
 */
function initSearch() {
  const searchInput = document.getElementById('tardySearchInput');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const term = e.target.value.toLowerCase().trim();
      filteredRecords = allRecords.filter(item => {
        return (
          item.subject.toLowerCase().includes(term) ||
          item.teacher.toLowerCase().includes(term) ||
          item.remarks.toLowerCase().includes(term) ||
          item.date.toLowerCase().includes(term)
        );
      });
      renderTable();
    });
  }
}

/**
 * Filter Modal Controllers (Without redundant clear button or delay select)
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
  const dateInput = document.getElementById('filterDateInput')?.value;
  const subjectVal = document.getElementById('filterSubjectSelect')?.value;
  const methodVal = document.getElementById('filterMethodSelect')?.value;

  filteredRecords = allRecords.filter(item => {
    let match = true;
    if (dateInput && item.dateRaw !== dateInput) match = false;
    if (subjectVal && item.subject !== subjectVal) match = false;
    if (methodVal && item.method !== methodVal) match = false;
    return match;
  });

  renderTable();
  closeFilterModal();
}

function resetModalFilters() {
  const dateEl = document.getElementById('filterDateInput');
  const subjEl = document.getElementById('filterSubjectSelect');
  const methodEl = document.getElementById('filterMethodSelect');

  if (dateEl) dateEl.value = '';
  if (subjEl) subjEl.value = '';
  if (methodEl) methodEl.value = '';
}

function resetAllFilters() {
  resetModalFilters();
  const searchInput = document.getElementById('tardySearchInput');
  if (searchInput) searchInput.value = '';
  filteredRecords = [...allRecords];
  renderTable();
}

/**
 * Record Details Modal (Exact match with my-attendance.js)
 */
function openRecordModal(id) {
  const record = allRecords.find(r => r.id === id);
  if (!record) return;

  const modal = document.getElementById('recordDetailModal');
  if (!modal) return;

  const subjectTitle = document.getElementById('modalSubjectTitle');
  const instructor = document.getElementById('modalInstructorName');
  const section = document.getElementById('modalSectionName');
  const dateVal = document.getElementById('modalDateVal');
  const timeInVal = document.getElementById('modalTimeInVal');
  const scheduleVal = document.getElementById('modalScheduleVal');
  const statusContainer = document.getElementById('modalStatusBadgeContainer');
  const methodVal = document.getElementById('modalMethodVal');
  const remarksVal = document.getElementById('modalRemarksVal');
  const excuseBtn = document.getElementById('modalExcuseBtn');

  if (subjectTitle) subjectTitle.textContent = record.subject;
  if (instructor) instructor.textContent = record.teacher;
  if (section) section.textContent = record.section || 'BSIT 3A';
  if (dateVal) dateVal.textContent = record.date;
  if (timeInVal) timeInVal.textContent = record.timeIn;
  if (scheduleVal) scheduleVal.textContent = record.schedule;
  if (remarksVal) remarksVal.textContent = record.remarks;

  if (statusContainer) {
    statusContainer.innerHTML = `
      <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#fff7ed] text-[#f97316] border border-[#fed7aa]">
        Late
      </span>
    `;
  }

  if (methodVal) {
    if (record.method === 'RFID') {
      methodVal.innerHTML = `
        <span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-[#eff6ff] text-[#2563eb] border border-[#bfdbfe]">
          RFID
        </span>
      `;
    } else {
      methodVal.innerHTML = `
        <span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-[#f0fdf4] text-[#16a34a] border border-[#bbf7d0]">
          QR Code
        </span>
      `;
    }
  }

  if (excuseBtn) {
    excuseBtn.href = `../excuse-slip/submit-excuse.html?subject=${encodeURIComponent(record.subject)}&date=${encodeURIComponent(record.dateRaw)}`;
  }

  modal.classList.remove('hidden');
  modal.classList.add('flex');
}

function closeRecordModal() {
  const modal = document.getElementById('recordDetailModal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
}

/**
 * Event listeners for escape key and outside click dismiss
 */
function initModalsAndBackdrops() {
  // Backdrop close for filter modal
  const filterModal = document.getElementById('filterModal');
  if (filterModal) {
    filterModal.addEventListener('click', (e) => {
      if (e.target === filterModal) closeFilterModal();
    });
  }

  // Backdrop close for record detail modal
  const recordModal = document.getElementById('recordDetailModal');
  if (recordModal) {
    recordModal.addEventListener('click', (e) => {
      if (e.target === recordModal) closeRecordModal();
    });
  }

  // Escape key close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeFilterModal();
      closeRecordModal();
      const profileMenu = document.getElementById('studentProfileMenu');
      if (profileMenu) profileMenu.classList.add('hidden');
    }
  });

  // Profile dropdown outside click
  document.addEventListener('click', (e) => {
    const profileBtn = document.getElementById('topbarProfileBtn');
    const profileMenu = document.getElementById('studentProfileMenu');
    if (profileMenu && !profileMenu.classList.contains('hidden')) {
      if (profileBtn && !profileBtn.contains(e.target) && !profileMenu.contains(e.target)) {
        profileMenu.classList.add('hidden');
      }
    }
  });
}

/**
 * Profile dropdown toggle
 */
window.toggleProfileDropdown = function (event) {
  if (event) event.stopPropagation();
  const profileMenu = document.getElementById('studentProfileMenu');
  if (profileMenu) {
    profileMenu.classList.toggle('hidden');
  }
};

/**
 * Logout Handler
 */
window.handleLogout = function () {
  if (confirm('Are you sure you want to log out of the Student Portal?')) {
    window.location.href = '../../index.html';
  }
};

/**
 * Pagination dummy buttons
 */
window.goToPreviousPage = function () {};
window.goToNextPage = function () {};

/**
 * Expose helper functions globally
 */
function exposeGlobalFunctions() {
  window.openFilterModal = openFilterModal;
  window.closeFilterModal = closeFilterModal;
  window.applyModalFilters = applyModalFilters;
  window.resetModalFilters = resetModalFilters;
  window.resetAllFilters = resetAllFilters;
  window.openRecordModal = openRecordModal;
  window.closeRecordModal = closeRecordModal;
  window.toggleProfileDropdown = window.toggleProfileDropdown;
  window.handleLogout = window.handleLogout;
  window.goToPreviousPage = window.goToPreviousPage;
  window.goToNextPage = window.goToNextPage;
}
