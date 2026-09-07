// assets/js/student/absence-records.js
// Student Absence Records Module for Bestlink College of the Philippines Attendance Monitoring System
// Follows student/my-attendance.js and student/tardy-and-absence/tardy-records.js design conventions 1:1

import { supabase } from '../config/supabaseClient.js';

// Local Mock Data for Absence Logs (Derived from student/my-attendance.js)
const absenceData = [
  {
    id: 1,
    date: 'May 21, 2025',
    dateRaw: '2025-05-21',
    subject: 'Introduction to Computing',
    section: 'BSIT 3A',
    teacher: 'Mrs. Jane Dela Cruz',
    schedule: '7:30 AM - 9:00 AM',
    status: 'Unexcused',
    excuseStatus: 'Not Filed',
    remarks: 'No formal excuse filed'
  },
  {
    id: 2,
    date: 'May 19, 2025',
    dateRaw: '2025-05-19',
    subject: 'Database Systems',
    section: 'BSIT 3A',
    teacher: 'Ms. Angela Ramos',
    schedule: '1:00 PM - 2:30 PM',
    status: 'Excused',
    excuseStatus: 'Approved',
    remarks: 'Medical Certificate verified'
  },
  {
    id: 3,
    date: 'April 15, 2025',
    dateRaw: '2025-04-15',
    subject: 'Web Development',
    section: 'BSIT 3A',
    teacher: 'Mr. Carlo Reyes',
    schedule: '9:00 AM - 10:30 AM',
    status: 'Unexcused',
    excuseStatus: 'Pending',
    remarks: 'Excuse slip submitted for verification'
  }
];

let allRecords = [...absenceData];
let filteredRecords = [...absenceData];

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', async () => {
  console.log('📋 Student Absence Records Module Initialized');
  initCurrentDate();
  await loadAbsenceRecords();
  initSearch();
  initModalsAndBackdrops();
  exposeGlobalFunctions();
});

/**
 * Initialize current date in top bar (Matches rfid-and-qr.html & tardy-records.html)
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
async function loadAbsenceRecords() {
  try {
    if (supabase) {
      const { data, error } = await supabase
        .from('attendance_records')
        .select('*')
        .in('status', ['Absent', 'Excused'])
        .order('date', { ascending: false });

      if (!error && data && data.length > 0) {
        allRecords = data.map((item, idx) => ({
          id: item.id || idx + 1,
          date: item.date ? new Date(item.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Recent Date',
          dateRaw: item.date || '',
          subject: item.subject_name || item.subject || 'Enrolled Course',
          section: item.section || 'BSIT 3A',
          teacher: item.teacher_name || item.teacher || 'Instructor',
          schedule: item.schedule || 'Scheduled Period',
          status: item.status === 'Excused' ? 'Excused' : 'Unexcused',
          excuseStatus: item.excuse_status || (item.status === 'Excused' ? 'Approved' : 'Not Filed'),
          remarks: item.remarks || (item.status === 'Excused' ? 'Excused Absence' : 'Unexcused Absence')
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
  const totalAbsences = allRecords.length;
  const unexcusedCount = allRecords.filter(r => r.status === 'Unexcused').length;
  const excusedCount = allRecords.filter(r => r.status === 'Excused').length;

  // Card 1: Total Absences
  const statTotalAbsencesEl = document.getElementById('statTotalAbsences');
  if (statTotalAbsencesEl) statTotalAbsencesEl.textContent = totalAbsences;

  const statAbsenceRateEl = document.getElementById('statAbsenceRate');
  if (statAbsenceRateEl) {
    const pct = ((totalAbsences / 45) * 100).toFixed(2);
    statAbsenceRateEl.textContent = `${pct}% of total (${totalAbsences}/45)`;
  }

  // Card 2: Unexcused Count
  const statUnexcusedCountEl = document.getElementById('statUnexcusedCount');
  if (statUnexcusedCountEl) statUnexcusedCountEl.textContent = unexcusedCount;

  // Card 3: Excused Count
  const statExcusedCountEl = document.getElementById('statExcusedCount');
  if (statExcusedCountEl) statExcusedCountEl.textContent = excusedCount;

  // Card 4: Risk Status
  const statRiskStatusEl = document.getElementById('statRiskStatus');
  const statRiskSubtextEl = document.getElementById('statRiskSubtext');
  if (statRiskStatusEl && statRiskSubtextEl) {
    if (unexcusedCount >= 3) {
      statRiskStatusEl.textContent = 'Critical';
      statRiskStatusEl.className = 'text-2xl font-extrabold text-[#dc2626]';
      statRiskSubtextEl.textContent = 'Action required - Advisory issued';
    } else if (unexcusedCount === 2) {
      statRiskStatusEl.textContent = 'Warning';
      statRiskStatusEl.className = 'text-2xl font-extrabold text-[#f97316]';
      statRiskSubtextEl.textContent = '1 absence from critical threshold';
    } else {
      statRiskStatusEl.textContent = 'Good';
      statRiskStatusEl.className = 'text-2xl font-extrabold text-[#111827]';
      statRiskSubtextEl.textContent = 'Max 1 consecutive absence';
    }
  }

  // Card 5: Attendance Rate
  const statAttendanceRateEl = document.getElementById('statAttendanceRate');
  if (statAttendanceRateEl) {
    const punctuality = (((45 - unexcusedCount) / 45) * 100).toFixed(2);
    statAttendanceRateEl.textContent = `${punctuality}%`;
  }
}

/**
 * Render the Absence Records Table
 */
function renderTable() {
  const tbody = document.getElementById('absenceTableBody');
  const countBadge = document.getElementById('absenceRecordCountBadge');
  const showingCount = document.getElementById('pageShowingCount');
  const totalCount = document.getElementById('pageTotalCount');

  if (!tbody) return;

  if (filteredRecords.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="8" class="text-center py-8 text-[#6b7280]">
          <p class="font-medium text-sm">No absence records found matching your filters.</p>
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
    // Status Pill
    const isExcused = item.status === 'Excused';
    const statusPill = isExcused
      ? `<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#eff6ff] text-[#0030c2] border border-[#bfdbfe]">Excused</span>`
      : `<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#fef2f2] text-[#dc2626] border border-[#fecaca]">Unexcused</span>`;

    // Excuse Slip Pill
    let excusePill = '';
    if (item.excuseStatus === 'Approved') {
      excusePill = `<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-[#f0fdf4] text-[#16a34a] border border-[#bbf7d0]">Approved</span>`;
    } else if (item.excuseStatus === 'Pending') {
      excusePill = `<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-[#fff7ed] text-[#f97316] border border-[#fed7aa]">Pending</span>`;
    } else {
      excusePill = `<span class="text-[#6b7280] font-medium text-[11px]">Not Filed</span>`;
    }

    return `
      <tr class="hover:bg-[#f9fafb] transition-colors">
        <td class="py-3 px-4 font-semibold text-[#111827] whitespace-nowrap">${item.date}</td>
        <td class="py-3 px-4 font-semibold text-[#111827]">${item.subject}</td>
        <td class="py-3 px-4 text-[#374151]">${item.teacher}</td>
        <td class="py-3 px-4 text-[#6b7280] font-mono">${item.schedule}</td>
        <td class="py-3 px-4">${statusPill}</td>
        <td class="py-3 px-4">${excusePill}</td>
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
  const searchInput = document.getElementById('absenceSearchInput');
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
 * Filter Modal Controllers (Without redundant clear button)
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
  const statusVal = document.getElementById('filterStatusSelect')?.value;

  filteredRecords = allRecords.filter(item => {
    let match = true;
    if (dateInput && item.dateRaw !== dateInput) match = false;
    if (subjectVal && item.subject !== subjectVal) match = false;
    if (statusVal && item.status !== statusVal) match = false;
    return match;
  });

  renderTable();
  closeFilterModal();
}

function resetModalFilters() {
  const dateEl = document.getElementById('filterDateInput');
  const subjEl = document.getElementById('filterSubjectSelect');
  const statusEl = document.getElementById('filterStatusSelect');

  if (dateEl) dateEl.value = '';
  if (subjEl) subjEl.value = '';
  if (statusEl) statusEl.value = '';
}

function resetAllFilters() {
  resetModalFilters();
  const searchInput = document.getElementById('absenceSearchInput');
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
  const scheduleVal = document.getElementById('modalScheduleVal');
  const statusContainer = document.getElementById('modalStatusBadgeContainer');
  const excuseContainer = document.getElementById('modalExcuseStatusContainer');
  const remarksVal = document.getElementById('modalRemarksVal');
  const excuseBtn = document.getElementById('modalExcuseBtn');

  if (subjectTitle) subjectTitle.textContent = record.subject;
  if (instructor) instructor.textContent = record.teacher;
  if (section) section.textContent = record.section || 'BSIT 3A';
  if (dateVal) dateVal.textContent = record.date;
  if (scheduleVal) scheduleVal.textContent = record.schedule;
  if (remarksVal) remarksVal.textContent = record.remarks;

  if (statusContainer) {
    const isExcused = record.status === 'Excused';
    statusContainer.innerHTML = isExcused
      ? `<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#eff6ff] text-[#0030c2] border border-[#bfdbfe]">Excused</span>`
      : `<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#fef2f2] text-[#dc2626] border border-[#fecaca]">Unexcused</span>`;
  }

  if (excuseContainer) {
    if (record.excuseStatus === 'Approved') {
      excuseContainer.innerHTML = `<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-[#f0fdf4] text-[#16a34a] border border-[#bbf7d0]">Approved</span>`;
    } else if (record.excuseStatus === 'Pending') {
      excuseContainer.innerHTML = `<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-[#fff7ed] text-[#f97316] border border-[#fed7aa]">Pending Review</span>`;
    } else {
      excuseContainer.innerHTML = `<span class="text-[#6b7280] text-xs font-medium">Not Filed</span>`;
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
