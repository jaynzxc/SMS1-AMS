/**
 * Bestlink College of the Philippines
 * Attendance Monitoring System - Teacher Panel
 * Module: Perfect Attendance Award (teacher/perfect-attendance.html)
 * Reference: teacher/attendance-calendar.html & docs/teacher_frontend.md Section 1.10
 */

document.addEventListener('DOMContentLoaded', () => {
  initPerfectAttendance();
});

// =========================================================================
// DATA MODELS & STATE
// =========================================================================

// Master mock list of candidates across teacher's assigned classes
let candidates = [
  {
    id: 1,
    studentId: '2023-01004',
    name: 'Dela Cruz, Mark J.',
    section: 'BSIT 3A',
    subject: 'IT301 - Web Systems & Technologies',
    totalSessions: 24,
    sessionsPresent: 24,
    attendanceRate: '100.0%',
    lateCount: 0,
    absenceCount: 0,
    status: 'QUALIFIED', // QUALIFIED, RECOMMENDED, APPROVED
    recommendedDate: null,
    endorsementNote: '',
    selected: false
  },
  {
    id: 2,
    studentId: '2023-01018',
    name: 'Santos, Maria Elena V.',
    section: 'BSCS 2A',
    subject: 'CS201 - Data Structures & Algorithms',
    totalSessions: 24,
    sessionsPresent: 24,
    attendanceRate: '100.0%',
    lateCount: 0,
    absenceCount: 0,
    status: 'RECOMMENDED',
    recommendedDate: 'May 22, 2025',
    endorsementNote: 'Consistent punctuality and active laboratory performance with zero tardiness.',
    selected: false
  },
  {
    id: 3,
    studentId: '2023-02045',
    name: 'Reyes, Joshua Paul C.',
    section: 'BSIT 3B',
    subject: 'IT302 - Database Administration',
    totalSessions: 24,
    sessionsPresent: 24,
    attendanceRate: '100.0%',
    lateCount: 0,
    absenceCount: 0,
    status: 'APPROVED',
    recommendedDate: 'May 18, 2025',
    endorsementNote: 'Flawless attendance throughout both lecture and laboratory sessions.',
    selected: false
  },
  {
    id: 4,
    studentId: '2022-03189',
    name: 'Bautista, Angel Mae S.',
    section: 'BSIT 4A',
    subject: 'IT401 - Capstone Project & Research',
    totalSessions: 24,
    sessionsPresent: 24,
    attendanceRate: '100.0%',
    lateCount: 0,
    absenceCount: 0,
    status: 'QUALIFIED',
    recommendedDate: null,
    endorsementNote: '',
    selected: false
  },
  {
    id: 5,
    studentId: '2023-01102',
    name: 'Aquino, John Lloyd R.',
    section: 'BSIT 3A',
    subject: 'IT301 - Web Systems & Technologies',
    totalSessions: 24,
    sessionsPresent: 24,
    attendanceRate: '100.0%',
    lateCount: 0,
    absenceCount: 0,
    status: 'QUALIFIED',
    recommendedDate: null,
    endorsementNote: '',
    selected: false
  },
  {
    id: 6,
    studentId: '2023-02194',
    name: 'Valdez, Stephanie G.',
    section: 'BSIT 3B',
    subject: 'IT302 - Database Administration',
    totalSessions: 24,
    sessionsPresent: 24,
    attendanceRate: '100.0%',
    lateCount: 0,
    absenceCount: 0,
    status: 'RECOMMENDED',
    recommendedDate: 'May 24, 2025',
    endorsementNote: 'Punctual submission of all database tasks and 100% attendance rate.',
    selected: false
  },
  {
    id: 7,
    studentId: '2023-01205',
    name: 'Morales, Christian D.',
    section: 'BSCS 2A',
    subject: 'CS201 - Data Structures & Algorithms',
    totalSessions: 24,
    sessionsPresent: 24,
    attendanceRate: '100.0%',
    lateCount: 0,
    absenceCount: 0,
    status: 'APPROVED',
    recommendedDate: 'May 16, 2025',
    endorsementNote: 'Perfect time records logged via physical ESP32 scanner on morning sessions.',
    selected: false
  },
  {
    id: 8,
    studentId: '2022-03310',
    name: 'Alcantara, Bea Nicole P.',
    section: 'BSIT 4A',
    subject: 'IT401 - Capstone Project & Research',
    totalSessions: 24,
    sessionsPresent: 24,
    attendanceRate: '100.0%',
    lateCount: 0,
    absenceCount: 0,
    status: 'QUALIFIED',
    recommendedDate: null,
    endorsementNote: '',
    selected: false
  }
];

// History of recommendations sent by teacher to admin
let recommendationBatches = [
  {
    batchId: 'REC-2025-001',
    dateSubmitted: 'May 18, 2025',
    term: '2nd Semester, A.Y. 2024-2025',
    totalNominees: 2,
    sections: 'BSIT 3B, BSCS 2A',
    adminStatus: 'Approved',
    adminRemarks: 'Verified against gate and room RFID logs. Certificate generated.'
  },
  {
    batchId: 'REC-2025-002',
    dateSubmitted: 'May 24, 2025',
    term: '2nd Semester, A.Y. 2024-2025',
    totalNominees: 2,
    sections: 'BSCS 2A, BSIT 3B',
    adminStatus: 'Under Review',
    adminRemarks: 'Pending administrative signature from Academic Head.'
  }
];

// Pagination and filter state
let currentPage = 1;
const itemsPerPage = 5;
let currentSearch = '';
let currentSectionFilter = 'ALL';
let currentStatusFilter = 'ALL';

// =========================================================================
// INITIALIZATION
// =========================================================================

function initPerfectAttendance() {
  setupEventListeners();
  updateKPICards();
  renderActiveFilterBadges();
  renderCandidatesTable();
  renderHistoryTable();
}

function setupEventListeners() {
  // Search Input
  const searchInput = document.getElementById('candidateSearchInput');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentSearch = e.target.value.trim().toLowerCase();
      currentPage = 1;
      renderCandidatesTable();
    });
  }

  // Select All Checkbox
  const selectAll = document.getElementById('selectAllCandidates');
  if (selectAll) {
    selectAll.addEventListener('change', (e) => {
      const isChecked = e.target.checked;
      getFilteredCandidates().forEach(candidate => {
        if (candidate.status === 'QUALIFIED') {
          candidate.selected = isChecked;
        }
      });
      renderCandidatesTable();
      updateBatchActionButton();
    });
  }

  // Batch Recommend Button
  const btnBatchRecommend = document.getElementById('btnBatchRecommend');
  if (btnBatchRecommend) {
    btnBatchRecommend.addEventListener('click', () => {
      openBatchRecommendModal();
    });
  }

  // Export Button
  const btnExport = document.getElementById('btnExportRoster');
  if (btnExport) {
    btnExport.addEventListener('click', () => {
      openExportModal();
    });
  }
}

// =========================================================================
// FILTERING & ADVANCED FILTER MODAL (Matching teacher/parent-alerts.html)
// =========================================================================

function getFilteredCandidates() {
  return candidates.filter(candidate => {
    // Section match
    const matchSection = (currentSectionFilter === 'ALL') || (candidate.section === currentSectionFilter);

    // Status match
    const matchStatus = (currentStatusFilter === 'ALL') || (candidate.status === currentStatusFilter);

    // Search match (Name, Student ID, Section, or Subject)
    const matchSearch = !currentSearch ||
      candidate.name.toLowerCase().includes(currentSearch) ||
      candidate.studentId.toLowerCase().includes(currentSearch) ||
      candidate.section.toLowerCase().includes(currentSearch) ||
      candidate.subject.toLowerCase().includes(currentSearch);

    return matchSection && matchStatus && matchSearch;
  });
}

function applyFilters() {
  const searchInput = document.getElementById('candidateSearchInput');
  if (searchInput) currentSearch = searchInput.value.trim().toLowerCase();

  const modalSec = document.getElementById('modalFilterSection');
  if (modalSec) currentSectionFilter = modalSec.value;

  const modalStat = document.getElementById('modalFilterStatus');
  if (modalStat) currentStatusFilter = modalStat.value;

  currentPage = 1;
  renderActiveFilterBadges();
  renderCandidatesTable();
}

function renderActiveFilterBadges() {
  const container = document.getElementById('activeFiltersContainer');
  const badgesContainer = document.getElementById('activeFilterBadges');
  if (!container || !badgesContainer) return;

  const active = [];
  if (currentSectionFilter !== 'ALL') active.push({ key: 'section', label: `Section: ${currentSectionFilter}` });
  if (currentStatusFilter !== 'ALL') {
    const statusLabel = currentStatusFilter === 'QUALIFIED' ? 'Qualified' : currentStatusFilter === 'RECOMMENDED' ? 'Recommended' : 'Approved';
    active.push({ key: 'status', label: `Status: ${statusLabel}` });
  }

  if (active.length === 0) {
    container.classList.add('hidden');
    badgesContainer.innerHTML = '';
  } else {
    container.classList.remove('hidden');
    badgesContainer.innerHTML = active.map(f => `
      <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#eff6ff] text-[#0030c2] text-[11px] font-semibold border border-[#bfdbfe]">
        ${f.label}
        <button onclick="removeFilter('${f.key}')" class="hover:text-red-600 cursor-pointer ml-0.5 leading-none">&times;</button>
      </span>
    `).join('');
  }
}

function openFilterModal() {
  const modal = document.getElementById('filterModal');
  if (!modal) return;

  const modalSec = document.getElementById('modalFilterSection');
  if (modalSec) modalSec.value = currentSectionFilter;

  const modalStat = document.getElementById('modalFilterStatus');
  if (modalStat) modalStat.value = currentStatusFilter;

  modal.classList.remove('hidden');
  modal.classList.add('flex');
}

function closeFilterModal() {
  const modal = document.getElementById('filterModal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
}

function resetFilterModalForm() {
  const ms = document.getElementById('modalFilterSection');
  const mst = document.getElementById('modalFilterStatus');

  if (ms) ms.value = 'ALL';
  if (mst) mst.value = 'ALL';
}

function applyFiltersFromModal() {
  const modalSec = document.getElementById('modalFilterSection')?.value || 'ALL';

  currentSectionFilter = modalSec;
  currentStatusFilter = document.getElementById('modalFilterStatus')?.value || 'ALL';

  closeFilterModal();
  applyFilters();
  showToastNotification("Filters applied successfully");
}

function removeFilter(key) {
  if (key === 'section') {
    currentSectionFilter = 'ALL';
    const ms = document.getElementById('modalFilterSection');
    if (ms) ms.value = 'ALL';
  } else if (key === 'status') {
    currentStatusFilter = 'ALL';
    const ms = document.getElementById('modalFilterStatus');
    if (ms) ms.value = 'ALL';
  }
  applyFilters();
}

function resetAllFilters() {
  currentSearch = '';
  currentSectionFilter = 'ALL';
  currentStatusFilter = 'ALL';

  const searchInput = document.getElementById('candidateSearchInput');
  const ms = document.getElementById('modalFilterSection');
  const mst = document.getElementById('modalFilterStatus');

  if (searchInput) searchInput.value = '';
  if (ms) ms.value = 'ALL';
  if (mst) mst.value = 'ALL';

  applyFilters();
  showToastNotification("All filters have been reset");
}

window.openFilterModal = openFilterModal;
window.closeFilterModal = closeFilterModal;
window.resetFilterModalForm = resetFilterModalForm;
window.applyFiltersFromModal = applyFiltersFromModal;
window.removeFilter = removeFilter;
window.resetAllFilters = resetAllFilters;

// =========================================================================
// KPI SUMMARY CARDS CALCULATION
// =========================================================================

function updateKPICards() {
  const totalQualified = candidates.length;
  const nominatedCount = candidates.filter(c => c.status === 'RECOMMENDED' || c.status === 'APPROVED').length;
  const pendingAdmin = candidates.filter(c => c.status === 'RECOMMENDED').length;
  const approvedCount = candidates.filter(c => c.status === 'APPROVED').length;

  const elTotal = document.getElementById('kpiTotalCandidates');
  const elNominated = document.getElementById('kpiNominatedCount');
  const elPending = document.getElementById('kpiPendingAdmin');
  const elApproved = document.getElementById('kpiApprovedCount');

  if (elTotal) elTotal.textContent = totalQualified;
  if (elNominated) elNominated.textContent = nominatedCount;
  if (elPending) elPending.textContent = pendingAdmin;
  if (elApproved) elApproved.textContent = approvedCount;
}

// =========================================================================
// TABLE RENDERING (Exact match: teacher/attendance-calendar.html)
// =========================================================================

function renderCandidatesTable() {
  const tbody = document.getElementById('candidatesTableBody');
  const footerText = document.getElementById('showingCandidatesCount') || document.getElementById('candidatesFooterText');
  const selectAll = document.getElementById('selectAllCandidates');
  const countBadge = document.getElementById('candidatesRecordCountBadge');

  if (!tbody) return;

  const filtered = getFilteredCandidates();
  const totalItems = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

  if (countBadge) {
    countBadge.textContent = `${totalItems} ${totalItems === 1 ? 'Candidate' : 'Candidates'}`;
  }

  if (currentPage > totalPages) currentPage = totalPages;

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const pageCandidates = filtered.slice(startIndex, endIndex);

  // Check if all selectable items on this page are selected
  if (selectAll) {
    const selectable = pageCandidates.filter(c => c.status === 'QUALIFIED');
    selectAll.checked = selectable.length > 0 && selectable.every(c => c.selected);
  }

  if (totalItems === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="9" class="py-10 text-center text-[#6b7280]">
          <div class="flex flex-col items-center justify-center">
            <div class="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 mb-2">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.75">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.504-1.125-1.125-1.125h-.75a1.125 1.125 0 01-1.125-1.125v-.75c0-.621-.504-1.125-1.125-1.125h-2.25c-.621 0-1.125.504-1.125 1.125v.75c0 .621-.504 1.125-1.125 1.125h-.75c-.621 0-1.125.504-1.125 1.125V18.75" />
              </svg>
            </div>
            <p class="text-xs font-bold text-[#111827]">No Candidates Found</p>
            <p class="text-[11px] text-[#6b7280] mt-0.5">Try adjusting your search criteria or section filter.</p>
          </div>
        </td>
      </tr>
    `;
    if (footerText) footerText.innerHTML = 'Showing <span class="font-semibold text-[#111827]">0</span> to <span class="font-semibold text-[#111827]">0</span> of <span class="font-semibold text-[#111827]">0</span> candidates';
    renderPagination(0);
    updateBatchActionButton();
    return;
  }

  let html = '';
  pageCandidates.forEach((item, index) => {
    const globalIndex = startIndex + index + 1;

    // Status Badges (Matching calendar attendance pills)
    let statusBadge = '';
    let actionButtons = '';

    if (item.status === 'QUALIFIED') {
      statusBadge = `
        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#f0fdf4] text-[#15803d]">
          Qualified
        </span>
      `;
      actionButtons = `
        <div class="flex items-center justify-center gap-1.5">
          <button onclick="openCandidateDrawer(${item.id})"
            class="w-7 h-7 flex items-center justify-center rounded-lg bg-[#eff6ff] hover:bg-[#dbeafe] text-[#0030c2] transition-colors cursor-pointer shadow-2xs"
            title="Inspect Candidate Details" aria-label="Inspect Candidate Details">
            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
          <button onclick="openRecommendModal(${item.id})"
            class="w-7 h-7 flex items-center justify-center rounded-lg bg-[#0030c2] hover:bg-[#002699] text-white transition-colors cursor-pointer shadow-2xs"
            title="Submit Recommendation to Admin" aria-label="Submit Recommendation">
            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
            </svg>
          </button>
        </div>
      `;
    } else if (item.status === 'RECOMMENDED') {
      statusBadge = `
        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#fffbeb] text-[#b45309]">
          Under Review
        </span>
      `;
      actionButtons = `
        <div class="flex items-center justify-center gap-1.5">
          <button onclick="openCandidateDrawer(${item.id})"
            class="w-7 h-7 flex items-center justify-center rounded-lg bg-[#eff6ff] hover:bg-[#dbeafe] text-[#0030c2] transition-colors cursor-pointer shadow-2xs"
            title="Inspect Candidate Details" aria-label="Inspect Candidate Details">
            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
          <span class="w-7 h-7 flex items-center justify-center rounded-lg bg-amber-50 text-amber-600 border border-amber-200 shadow-2xs"
            title="Nomination Under Admin Review">
            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </span>
        </div>
      `;
    } else if (item.status === 'APPROVED') {
      statusBadge = `
        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#f5f3ff] text-[#7c3aed]">
          Award Conferred
        </span>
      `;
      actionButtons = `
        <div class="flex items-center justify-center gap-1.5">
          <button onclick="openCandidateDrawer(${item.id})"
            class="w-7 h-7 flex items-center justify-center rounded-lg bg-[#eff6ff] hover:bg-[#dbeafe] text-[#0030c2] transition-colors cursor-pointer shadow-2xs"
            title="Inspect Candidate Details" aria-label="Inspect Candidate Details">
            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
          <span class="w-7 h-7 flex items-center justify-center rounded-lg bg-[#f0fdf4] text-[#16a34a] border border-[#bbf7d0] shadow-2xs"
            title="Award Conferred & Certified">
            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </span>
        </div>
      `;
    }

    const isSelectable = item.status === 'QUALIFIED';

    html += `
      <tr class="hover:bg-[#f9fafb] transition-colors ${item.selected ? 'bg-[#eff6ff]/50' : ''}">
        <td class="py-3.5 px-3 text-center">
          <input type="checkbox"
            class="candidate-checkbox w-4 h-4 rounded border-[#d1d5db] text-[#0030c2] focus:ring-[#0030c2] cursor-pointer ${!isSelectable ? 'opacity-40 cursor-not-allowed' : ''}"
            ${!isSelectable ? 'disabled' : ''}
            data-id="${item.id}"
            ${item.selected ? 'checked' : ''}
            onchange="toggleCandidateSelection(${item.id}, this.checked)">
        </td>
        <td class="py-3.5 px-2 text-[#6b7280] font-semibold text-xs">${globalIndex}</td>
        <td class="py-3.5 px-4 font-semibold text-[#111827]">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-full bg-[#e5e7eb] flex items-center justify-center shrink-0">
              <svg class="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12a4.5 4.5 0 100-9 4.5 4.5 0 000 9zM4 20.5c0-3.59 3.58-6.5 8-6.5s8 2.91 8 6.5V21H4v-.5z" />
              </svg>
            </div>
            <div>
              <p class="font-bold text-[#111827] text-xs">${item.name}</p>
              <p class="text-[10px] font-mono text-[#6b7280]">${item.studentId}</p>
            </div>
          </div>
        </td>
        <td class="py-3.5 px-4 text-[#374151]">
          <div class="flex items-center gap-2">
            <span class="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-[#eff6ff] text-[#0030c2]">${item.section}</span>
            <span class="truncate max-w-[190px] font-medium text-xs">${item.subject}</span>
          </div>
        </td>
        <td class="py-3.5 px-4 text-center">
          <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#f0fdf4] text-[#15803d]">${item.attendanceRate}</span>
        </td>
        <td class="py-3.5 px-4 text-center font-bold text-[#16a34a]">
          ${item.lateCount}
        </td>
        <td class="py-3.5 px-4 text-center font-bold text-[#16a34a]">
          ${item.absenceCount}
        </td>
        <td class="py-3.5 px-4 text-center">
          ${statusBadge}
        </td>
        <td class="py-3.5 px-4 text-center whitespace-nowrap">
          ${actionButtons}
        </td>
      </tr>
    `;
  });

  tbody.innerHTML = html;

  // Footer text (Exact match: teacher/parent-alerts.html)
  if (footerText) {
    footerText.innerHTML = `Showing <span class="font-semibold text-[#111827]">${startIndex + 1}</span> to <span class="font-semibold text-[#111827]">${endIndex}</span> of <span class="font-semibold text-[#111827]">${totalItems}</span> candidates`;
  }

  // Render pagination (Exact match: teacher/parent-alerts.html)
  renderPagination(totalPages);
  updateBatchActionButton();
}

function renderPagination(totalPages) {
  const container = document.getElementById('pageButtonsContainer') || document.getElementById('paginationControls');
  const prevBtn = document.getElementById('prevPageBtn');
  const nextBtn = document.getElementById('nextPageBtn');

  if (prevBtn) prevBtn.disabled = currentPage <= 1;
  if (nextBtn) nextBtn.disabled = currentPage >= totalPages || totalPages === 0;

  if (!container) return;
  if (totalPages <= 1) {
    container.innerHTML = `<span class="w-7 h-7 rounded-lg bg-[#0030c2] text-white flex items-center justify-center font-bold text-xs">1</span>`;
    return;
  }

  let html = '';
  for (let p = 1; p <= totalPages; p++) {
    if (p === currentPage) {
      html += `<span class="w-7 h-7 rounded-lg bg-[#0030c2] text-white flex items-center justify-center font-bold text-xs">${p}</span>`;
    } else {
      html += `<button onclick="goToPage(${p})" class="w-7 h-7 rounded-lg hover:bg-gray-100 text-[#374151] flex items-center justify-center font-semibold text-xs transition-colors cursor-pointer">${p}</button>`;
    }
  }
  container.innerHTML = html;
}

function changePage(delta) {
  currentPage += delta;
  renderCandidatesTable();
}

function goToPage(page) {
  currentPage = page;
  renderCandidatesTable();
}

window.changePage = changePage;
window.goToPage = goToPage;

window.toggleCandidateSelection = function(id, isChecked) {
  const candidate = candidates.find(c => c.id === id);
  if (candidate && candidate.status === 'QUALIFIED') {
    candidate.selected = isChecked;
  }
  updateBatchActionButton();
};

function updateBatchActionButton() {
  const btnBatch = document.getElementById('btnBatchRecommend');
  const countBadge = document.getElementById('selectedCandidateCount');
  if (!btnBatch) return;

  const selectedCount = candidates.filter(c => c.status === 'QUALIFIED' && c.selected).length;

  if (countBadge) {
    countBadge.textContent = selectedCount;
  }

  if (selectedCount > 0) {
    btnBatch.classList.remove('opacity-50', 'pointer-events-none');
    btnBatch.removeAttribute('disabled');
  } else {
    btnBatch.classList.add('opacity-50', 'pointer-events-none');
    btnBatch.setAttribute('disabled', 'true');
  }
}

// =========================================================================
// CANDIDATE SLIDE-OVER DRAWER (Exact match: #dayViewDrawer in attendance-calendar.html)
// =========================================================================

window.openCandidateDrawer = function(id) {
  const candidate = candidates.find(c => c.id === id);
  if (!candidate) return;

  const drawerName = document.getElementById('drawerCandidateName');
  const drawerMeta = document.getElementById('drawerCandidateMeta');
  const drawerRate = document.getElementById('drawerCandidateRate');
  const drawerSessions = document.getElementById('drawerCandidateSessions');
  const statusBanner = document.getElementById('drawerCandidateStatusBanner');
  const actionContainer = document.getElementById('drawerActionContainer');

  if (drawerName) drawerName.textContent = candidate.name;
  if (drawerMeta) drawerMeta.textContent = `${candidate.studentId} • ${candidate.section} • Roll Call Overview`;
  if (drawerRate) drawerRate.textContent = candidate.attendanceRate;
  if (drawerSessions) drawerSessions.textContent = `${candidate.sessionsPresent}/${candidate.totalSessions}`;

  if (statusBanner) {
    if (candidate.status === 'QUALIFIED') {
      statusBanner.className = 'p-3 rounded-xl border border-[#bbf7d0] bg-[#f0fdf4] flex items-center justify-between';
      statusBanner.innerHTML = `
        <div class="flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-[#16a34a]"></span>
          <span class="font-bold text-xs text-[#16a34a]">Eligible for Perfect Attendance Award</span>
        </div>
        <span class="text-[11px] font-bold text-[#15803d]">Pending Endorsement</span>
      `;
    } else if (candidate.status === 'RECOMMENDED') {
      statusBanner.className = 'p-3 rounded-xl border border-[#fde68a] bg-[#fffbeb] flex items-center justify-between';
      statusBanner.innerHTML = `
        <div class="flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-[#f59e0b]"></span>
          <span class="font-bold text-xs text-[#b45309]">Submitted to Administrator</span>
        </div>
        <span class="text-[11px] font-bold text-[#b45309]">${candidate.recommendedDate}</span>
      `;
    } else {
      statusBanner.className = 'p-3 rounded-xl border border-[#ddd6fe] bg-[#f5f3ff] flex items-center justify-between';
      statusBanner.innerHTML = `
        <div class="flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-[#7c3aed]"></span>
          <span class="font-bold text-xs text-[#6d28d9]">Official Recognition Conferred</span>
        </div>
        <span class="text-[11px] font-bold text-[#7c3aed]">Approved ✓</span>
      `;
    }
  }

  if (actionContainer) {
    if (candidate.status === 'QUALIFIED') {
      actionContainer.innerHTML = `
        <button onclick="closeCandidateDrawer(); openRecommendModal(${candidate.id})"
          class="px-4 py-2 text-xs font-semibold text-white bg-[#0030c2] hover:bg-[#002699] rounded-lg shadow-xs cursor-pointer flex items-center gap-1.5">
          <span>Endorse to Admin</span>
          <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
          </svg>
        </button>
      `;
    } else {
      actionContainer.innerHTML = `
        <a href="daily-attendance.html"
          class="px-4 py-2 text-xs font-semibold text-white bg-[#0030c2] hover:bg-[#002699] rounded-lg shadow-xs cursor-pointer flex items-center gap-1.5">
          <span>Open Full Roll Call</span>
          <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </a>
      `;
    }
  }

  const drawer = document.getElementById('candidateDrawer');
  if (drawer) {
    drawer.classList.remove('hidden');
    drawer.classList.add('flex');
  }
};

window.closeCandidateDrawer = function() {
  const drawer = document.getElementById('candidateDrawer');
  if (drawer) {
    drawer.classList.add('hidden');
    drawer.classList.remove('flex');
  }
};

// =========================================================================
// RECOMMENDATION MODAL (SINGLE & BATCH)
// =========================================================================

let pendingRecommendationCandidateIds = [];

window.openRecommendModal = function(id) {
  const candidate = candidates.find(c => c.id === id);
  if (!candidate) return;

  pendingRecommendationCandidateIds = [id];

  const modalTitle = document.getElementById('recommendModalTitle');
  const candidateListEl = document.getElementById('recommendCandidateList');
  const remarksInput = document.getElementById('recommendRemarksInput');

  if (modalTitle) modalTitle.textContent = 'Submit Award Recommendation to Admin';
  if (remarksInput) {
    remarksInput.value = `Student has demonstrated 100% verified attendance, exemplary classroom discipline, and zero tardiness in ${candidate.section}.`;
  }

  if (candidateListEl) {
    candidateListEl.innerHTML = `
      <div class="p-3 bg-gray-50 border border-[#e5e7eb] rounded-xl flex items-center justify-between">
        <div class="flex items-center gap-2.5">
          <div class="w-8 h-8 rounded-full bg-[#eff6ff] text-[#0030c2] font-bold text-xs flex items-center justify-center shrink-0">
            ${candidate.name.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <p class="text-xs font-bold text-[#111827]">${candidate.name}</p>
            <p class="text-[11px] text-[#6b7280] font-mono">${candidate.studentId} · ${candidate.section}</p>
          </div>
        </div>
        <span class="text-xs font-extrabold text-[#16a34a]">${candidate.attendanceRate}</span>
      </div>
    `;
  }

  const modal = document.getElementById('recommendModal');
  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }
};

function openBatchRecommendModal() {
  const selected = candidates.filter(c => c.status === 'QUALIFIED' && c.selected);
  if (selected.length === 0) return;

  pendingRecommendationCandidateIds = selected.map(c => c.id);

  const modalTitle = document.getElementById('recommendModalTitle');
  const candidateListEl = document.getElementById('recommendCandidateList');
  const remarksInput = document.getElementById('recommendRemarksInput');

  if (modalTitle) modalTitle.textContent = `Submit Batch Recommendations (${selected.length} Students)`;
  if (remarksInput) {
    remarksInput.value = `Batch recommendation of ${selected.length} qualified candidate(s) for the Perfect Attendance Recognition. All students satisfy institutional 100% criteria.`;
  }

  if (candidateListEl) {
    let listHtml = '<div class="space-y-2 max-h-48 overflow-y-auto pr-1">';
    selected.forEach(candidate => {
      listHtml += `
        <div class="p-2.5 bg-gray-50 border border-[#e5e7eb] rounded-lg flex items-center justify-between">
          <div class="flex items-center gap-2">
            <div class="w-6 h-6 rounded-full bg-[#eff6ff] text-[#0030c2] font-bold text-[10px] flex items-center justify-center shrink-0">
              ${candidate.name.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <p class="text-xs font-bold text-[#111827] leading-tight">${candidate.name}</p>
              <p class="text-[10px] text-[#6b7280] font-mono">${candidate.studentId} · ${candidate.section}</p>
            </div>
          </div>
          <span class="text-xs font-bold text-[#16a34a]">${candidate.attendanceRate}</span>
        </div>
      `;
    });
    listHtml += '</div>';
    candidateListEl.innerHTML = listHtml;
  }

  const modal = document.getElementById('recommendModal');
  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }
}

window.closeRecommendModal = function() {
  const modal = document.getElementById('recommendModal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
};

window.handleConfirmRecommendation = function(event) {
  if (event) event.preventDefault();

  const remarksInput = document.getElementById('recommendRemarksInput');
  const remarks = remarksInput ? remarksInput.value.trim() : '';

  const todayStr = 'May 27, 2025';

  let affectedCount = 0;
  pendingRecommendationCandidateIds.forEach(id => {
    const candidate = candidates.find(c => c.id === id);
    if (candidate && candidate.status === 'QUALIFIED') {
      candidate.status = 'RECOMMENDED';
      candidate.recommendedDate = todayStr;
      candidate.endorsementNote = remarks;
      candidate.selected = false;
      affectedCount++;
    }
  });

  // Create history batch record
  if (affectedCount > 0) {
    const newBatchId = `REC-2025-00${recommendationBatches.length + 1}`;
    recommendationBatches.unshift({
      batchId: newBatchId,
      dateSubmitted: todayStr,
      term: '2nd Semester, A.Y. 2024-2025',
      totalNominees: affectedCount,
      sections: Array.from(new Set(pendingRecommendationCandidateIds.map(id => {
        const c = candidates.find(item => item.id === id);
        return c ? c.section : '';
      }))).filter(Boolean).join(', '),
      adminStatus: 'Under Review',
      adminRemarks: 'Recommendation submitted by Mrs. Jane Dela Cruz. Pending Admin Review.'
    });
  }

  closeRecommendModal();
  updateKPICards();
  renderCandidatesTable();
  renderHistoryTable();

  // Show Toast
  showToastNotification(`Successfully submitted ${affectedCount} recommendation(s) to the Administrator.`);
};

// =========================================================================
// SUBMISSION HISTORY TABLE
// =========================================================================

function renderHistoryTable() {
  const tbody = document.getElementById('historyTableBody');
  const footerText = document.getElementById('historyFooterText');
  if (!tbody) return;

  if (recommendationBatches.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" class="py-6 text-center text-[#6b7280] text-xs">
          No previous recommendation submissions recorded.
        </td>
      </tr>
    `;
    if (footerText) footerText.textContent = 'Showing 0 of 0 submissions';
    return;
  }

  let html = '';
  recommendationBatches.forEach(batch => {
    let statusBadge = '';
    if (batch.adminStatus === 'Approved') {
      statusBadge = `
        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#f0fdf4] text-[#15803d]">
          Approved ✓
        </span>
      `;
    } else {
      statusBadge = `
        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#fffbeb] text-[#b45309]">
          Under Review
        </span>
      `;
    }

    html += `
      <tr class="hover:bg-[#f9fafb] transition-colors">
        <td class="py-3.5 px-4 font-mono font-bold text-xs text-[#0030c2]">${batch.batchId}</td>
        <td class="py-3.5 px-4 text-xs font-semibold text-[#111827]">${batch.term}</td>
        <td class="py-3.5 px-4 text-xs text-[#374151]">
          <span class="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-[#eff6ff] text-[#0030c2]">${batch.sections}</span>
        </td>
        <td class="py-3.5 px-4 text-xs text-[#6b7280]">${batch.dateSubmitted}</td>
        <td class="py-3.5 px-4 text-xs font-bold text-center text-[#111827]">${batch.totalNominees}</td>
        <td class="py-3.5 px-4 text-center">
          ${statusBadge}
        </td>
        <td class="py-3.5 px-4 text-center">
          <button onclick="viewBatchDetails('${batch.batchId}')"
            class="w-7 h-7 flex items-center justify-center rounded-lg bg-[#eff6ff] hover:bg-[#dbeafe] text-[#0030c2] transition-colors cursor-pointer mx-auto shadow-2xs"
            title="View Endorsement Slip" aria-label="View Endorsement Slip">
            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
          </button>
        </td>
      </tr>
    `;
  });

  tbody.innerHTML = html;
  if (footerText) {
    footerText.textContent = `Showing 1 to ${recommendationBatches.length} of ${recommendationBatches.length} submissions`;
  }
}

let currentViewedBatch = null;

window.viewBatchDetails = function(batchId) {
  const batch = recommendationBatches.find(b => b.batchId === batchId);
  if (!batch) return;
  currentViewedBatch = batch;

  // Set modal fields
  const batchIdBadge = document.getElementById('slipBatchIdBadge');
  const termEl = document.getElementById('slipAcademicTerm');
  const dateEl = document.getElementById('slipDateSubmitted');
  const sectionsEl = document.getElementById('slipSections');
  const nomineesCountEl = document.getElementById('slipTotalNominees');
  const statusContainer = document.getElementById('slipStatusBadgeContainer');
  const adminRemarksEl = document.getElementById('slipAdminRemarks');
  const adminSignStatus = document.getElementById('slipAdminSignStatus');
  const nomineesTbody = document.getElementById('slipNomineesTableBody');

  if (batchIdBadge) batchIdBadge.textContent = batch.batchId;
  if (termEl) termEl.textContent = batch.term;
  if (dateEl) dateEl.textContent = `Submitted on ${batch.dateSubmitted}`;
  if (sectionsEl) sectionsEl.textContent = batch.sections;
  if (nomineesCountEl) nomineesCountEl.textContent = `${batch.totalNominees} Candidates (100% Attendance)`;
  if (adminRemarksEl) adminRemarksEl.textContent = batch.adminRemarks;

  // Status Badge in Header
  if (statusContainer) {
    if (batch.adminStatus === 'Approved') {
      statusContainer.innerHTML = `
        <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-[#f5f3ff] text-[#7c3aed] border border-[#ddd6fe]">
          <span class="w-1.5 h-1.5 rounded-full bg-[#7c3aed] mr-1.5"></span> Conferred &amp; Approved
        </span>
      `;
    } else {
      statusContainer.innerHTML = `
        <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-[#fffbeb] text-[#b45309] border border-[#fde68a]">
          <span class="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5"></span> Under Review by Admin
        </span>
      `;
    }
  }

  // Admin Signature Badge
  if (adminSignStatus) {
    if (batch.adminStatus === 'Approved') {
      adminSignStatus.className = 'inline-block mt-1 text-[9px] font-bold text-[#7c3aed] bg-[#f5f3ff] px-1.5 py-0.5 rounded border border-[#ddd6fe]';
      adminSignStatus.textContent = 'Approved & Conferred';
    } else {
      adminSignStatus.className = 'inline-block mt-1 text-[9px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200';
      adminSignStatus.textContent = 'Pending Signature';
    }
  }

  // Find candidates that correspond to this batch
  let batchNominees = [];
  if (batch.batchId === 'REC-2025-001') {
    batchNominees = candidates.filter(c => c.status === 'APPROVED');
  } else if (batch.batchId === 'REC-2025-002') {
    batchNominees = candidates.filter(c => c.status === 'RECOMMENDED');
  } else {
    batchNominees = candidates.filter(c => batch.sections.includes(c.section)).slice(0, batch.totalNominees);
  }

  if (nomineesTbody) {
    if (batchNominees.length === 0) {
      nomineesTbody.innerHTML = `
        <tr>
          <td colspan="5" class="py-4 text-center text-[#6b7280]">No candidate records found for this batch.</td>
        </tr>
      `;
    } else {
      nomineesTbody.innerHTML = batchNominees.map((n, idx) => `
        <tr class="hover:bg-gray-50/50">
          <td class="py-2 px-3 text-[#6b7280] font-semibold">${idx + 1}</td>
          <td class="py-2 px-3">
            <p class="font-bold text-[#111827]">${n.name}</p>
            <p class="text-[10px] font-mono text-[#6b7280]">${n.studentId}</p>
          </td>
          <td class="py-2 px-3">
            <span class="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#eff6ff] text-[#0030c2]">${n.section}</span>
            <span class="text-[11px] text-[#4b5563] ml-1">${n.subject}</span>
          </td>
          <td class="py-2 px-3 text-center">
            <span class="font-bold text-[#16a34a]">${n.attendanceRate}</span>
            <p class="text-[9px] text-[#6b7280]">${n.sessionsPresent}/${n.totalSessions} Sessions</p>
          </td>
          <td class="py-2 px-3 text-center">
            <span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
              ESP32 RFID ✓
            </span>
          </td>
        </tr>
      `).join('');
    }
  }

  // Open Modal
  const modal = document.getElementById('endorsementSlipModal');
  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }
};

window.closeEndorsementSlipModal = function() {
  const modal = document.getElementById('endorsementSlipModal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
};

window.printCurrentSlip = function() {
  if (!currentViewedBatch) return;
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Please allow popups to print the endorsement slip.');
    return;
  }
  
  let batchNominees = [];
  if (currentViewedBatch.batchId === 'REC-2025-001') {
    batchNominees = candidates.filter(c => c.status === 'APPROVED');
  } else if (currentViewedBatch.batchId === 'REC-2025-002') {
    batchNominees = candidates.filter(c => c.status === 'RECOMMENDED');
  } else {
    batchNominees = candidates.filter(c => currentViewedBatch.sections.includes(c.section)).slice(0, currentViewedBatch.totalNominees);
  }

  let rows = '';
  batchNominees.forEach((n, idx) => {
    rows += `
      <tr>
        <td style="padding: 6px; border: 1px solid #ddd; text-align: center;">${idx + 1}</td>
        <td style="padding: 6px; border: 1px solid #ddd; font-family: monospace;">${n.studentId}</td>
        <td style="padding: 6px; border: 1px solid #ddd; font-weight: bold;">${n.name}</td>
        <td style="padding: 6px; border: 1px solid #ddd;">${n.section} - ${n.subject}</td>
        <td style="padding: 6px; border: 1px solid #ddd; text-align: center; color: #16a34a; font-weight: bold;">${n.attendanceRate}</td>
        <td style="padding: 6px; border: 1px solid #ddd; text-align: center;">ESP32 RFID Verified</td>
      </tr>
    `;
  });

  const slipHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Endorsement Slip - ${currentViewedBatch.batchId}</title>
      <style>
        body { font-family: Arial, sans-serif; font-size: 11px; margin: 25px; color: #111; line-height: 1.4; }
        .header { text-align: center; border-bottom: 2px solid #0030c2; padding-bottom: 12px; margin-bottom: 15px; }
        .header h1 { font-size: 16px; margin: 0; color: #0030c2; text-transform: uppercase; }
        .header p { margin: 2px 0; color: #555; font-size: 11px; }
        .meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 15px; }
        .meta-box { background: #f9fafb; border: 1px solid #e5e7eb; padding: 8px 12px; border-radius: 6px; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; margin-bottom: 20px; font-size: 11px; }
        th { background: #f3f4f6; border: 1px solid #ddd; padding: 7px; text-align: left; }
        .remarks { background: #eff6ff; border: 1px solid #bfdbfe; padding: 10px; border-radius: 6px; margin-bottom: 25px; }
        .signatures { display: flex; justify-content: space-between; margin-top: 40px; text-align: center; }
        .sign-col { width: 28%; border-top: 1px solid #333; padding-top: 5px; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Bestlink College of the Philippines</h1>
        <p>Department of Academic Affairs · Attendance Monitoring System</p>
        <p><strong>FORM-AMS-PAA: Official Faculty Recommendation & Award Nomination Slip</strong></p>
      </div>

      <div class="meta-grid">
        <div class="meta-box">
          <p><strong>Batch ID:</strong> ${currentViewedBatch.batchId}</p>
          <p><strong>Submitting Faculty:</strong> Mrs. Jane Dela Cruz (College of Computer Studies)</p>
          <p><strong>Submission Date:</strong> ${currentViewedBatch.dateSubmitted}</p>
        </div>
        <div class="meta-box">
          <p><strong>Academic Term:</strong> ${currentViewedBatch.term}</p>
          <p><strong>Class Sections:</strong> ${currentViewedBatch.sections}</p>
          <p><strong>Administrator Status:</strong> ${currentViewedBatch.adminStatus}</p>
        </div>
      </div>

      <h3>Nominated Candidates for Perfect Attendance Award</h3>
      <table>
        <thead>
          <tr>
            <th style="width: 30px; text-align: center;">#</th>
            <th>Student ID</th>
            <th>Student Full Name</th>
            <th>Section & Subject</th>
            <th style="text-align: center;">Attendance Rate</th>
            <th style="text-align: center;">Hardware Status</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>

      <div class="remarks">
        <strong>Administrative Remarks & Verification:</strong><br>
        ${currentViewedBatch.adminRemarks}
      </div>

      <div class="signatures">
        <div class="sign-col">
          <strong>Mrs. Jane Dela Cruz</strong><br>
          <span style="color: #666; font-size: 10px;">Endorsing Faculty</span>
        </div>
        <div class="sign-col">
          <strong>Academic Department Head</strong><br>
          <span style="color: #666; font-size: 10px;">College of Computer Studies</span>
        </div>
        <div class="sign-col">
          <strong>Office of the Administrator</strong><br>
          <span style="color: #666; font-size: 10px;">Conferment & Validation</span>
        </div>
      </div>

      <script>
        window.onload = function() {
          window.print();
        };
      </script>
    </body>
    </html>
  `;

  printWindow.document.write(slipHtml);
  printWindow.document.close();
};

// =========================================================================
// EXPORT & PRINT FUNCTIONS (Exact match: teacher/attendance-calendar.html)
// =========================================================================

window.openExportModal = function() {
  const modal = document.getElementById('exportModal');
  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }
};

window.closeExportModal = function() {
  const modal = document.getElementById('exportModal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
};

window.updateExportFormatSelection = function(radio) {
  document.querySelectorAll('.export-format-card').forEach(card => {
    card.classList.remove('border-[#0030c2]', 'bg-[#eff6ff]');
    card.classList.add('border-[#e5e7eb]');
    const title = card.querySelector('.export-card-title');
    if (title) {
      title.classList.remove('text-[#0030c2]');
      title.classList.add('text-[#374151]');
    }
  });

  const parentCard = radio.closest('.export-format-card');
  if (parentCard) {
    parentCard.classList.add('border-[#0030c2]', 'bg-[#eff6ff]');
    parentCard.classList.remove('border-[#e5e7eb]');
    const title = parentCard.querySelector('.export-card-title');
    if (title) {
      title.classList.add('text-[#0030c2]');
      title.classList.remove('text-[#374151]');
    }
  }

  const submitText = document.getElementById('exportSubmitBtnText');
  if (submitText) {
    if (radio.value === 'Print') {
      submitText.textContent = 'Print Roster (PDF)';
    } else if (radio.value === 'Excel') {
      submitText.textContent = 'Download Excel (.xlsx)';
    } else {
      submitText.textContent = 'Download CSV';
    }
  }
};

window.handleExport = function(event) {
  if (event) event.preventDefault();

  const formatRadio = document.querySelector('input[name="exportFormat"]:checked');
  const format = formatRadio ? formatRadio.value : 'CSV';
  const sectionSelect = document.getElementById('exportSection');
  const sectionFilter = sectionSelect ? sectionSelect.value : 'ALL';

  const exportData = candidates.filter(c => sectionFilter === 'ALL' || c.section === sectionFilter);

  closeExportModal();

  if (format === 'Print') {
    generatePrintableRoster(exportData, sectionFilter);
  } else {
    // Generate CSV
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'Student ID,Student Name,Section,Subject,Attendance Rate,Sessions Present,Total Sessions,Late Count,Absence Count,Nomination Status,Endorsement Date\n';

    exportData.forEach(c => {
      const row = [
        `"${c.studentId}"`,
        `"${c.name}"`,
        `"${c.section}"`,
        `"${c.subject}"`,
        `"${c.attendanceRate}"`,
        c.sessionsPresent,
        c.totalSessions,
        c.lateCount,
        c.absenceCount,
        `"${c.status}"`,
        `"${c.recommendedDate || 'Not Yet Submitted'}"`
      ].join(',');
      csvContent += row + '\n';
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Perfect_Attendance_Candidates_${sectionFilter}_2025.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToastNotification(`Successfully exported candidate list as ${format}.`);
  }
};

function generatePrintableRoster(studentList, sectionTitle) {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Please allow popups to print the candidate roster.');
    return;
  }

  let tableRows = '';
  studentList.forEach((s, idx) => {
    tableRows += `
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${idx + 1}</td>
        <td style="padding: 8px; border: 1px solid #ddd; font-family: monospace;">${s.studentId}</td>
        <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">${s.name}</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${s.section}</td>
        <td style="padding: 8px; border: 1px solid #ddd; text-align: center; color: #16a34a; font-weight: bold;">${s.attendanceRate}</td>
        <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${s.sessionsPresent}/${s.totalSessions}</td>
        <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">0</td>
        <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">0</td>
        <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${s.status}</td>
      </tr>
    `;
  });

  const printHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Official Perfect Attendance Candidates Endorsement Sheet</title>
      <style>
        body { font-family: 'Inter', Arial, sans-serif; padding: 25px; color: #111827; }
        .header { text-align: center; border-bottom: 2px solid #0030c2; padding-bottom: 12px; margin-bottom: 20px; }
        .school-name { font-size: 16px; font-weight: 800; text-transform: uppercase; color: #0030c2; margin: 0; }
        .sub-header { font-size: 11px; color: #4b5563; margin-top: 4px; }
        .title { font-size: 14px; font-weight: bold; margin-top: 10px; color: #111827; }
        .meta { display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 15px; }
        table { width: 100%; border-collapse: collapse; font-size: 11px; margin-top: 10px; }
        th { background-color: #f1f5f9; padding: 8px; border: 1px solid #cbd5e1; text-align: left; }
        .signatures { margin-top: 40px; display: flex; justify-content: space-between; font-size: 11px; }
        .sign-box { width: 220px; text-align: center; }
        .line { border-top: 1px solid #111827; margin-top: 40px; padding-top: 5px; font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1 class="school-name">BESTLINK COLLEGE OF THE PHILIPPINES</h1>
        <p class="sub-header">Attendance Monitoring System · Faculty Endorsement Office</p>
        <p class="title">OFFICIAL PERFECT ATTENDANCE CANDIDATE NOMINATION ROSTER</p>
      </div>

      <div class="meta">
        <div>
          <p><strong>Faculty Adviser:</strong> Mrs. Jane Dela Cruz</p>
          <p><strong>Assigned Section:</strong> ${sectionTitle === 'ALL' ? 'All Assigned Sections' : sectionTitle}</p>
        </div>
        <div style="text-align: right;">
          <p><strong>Academic Year:</strong> 2024 - 2025 (2nd Semester)</p>
          <p><strong>Date Generated:</strong> May 27, 2025</p>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th style="width: 30px; text-align: center;">#</th>
            <th>Student ID</th>
            <th>Student Full Name</th>
            <th>Class Section</th>
            <th style="text-align: center;">Attendance %</th>
            <th style="text-align: center;">Sessions</th>
            <th style="text-align: center;">Lates</th>
            <th style="text-align: center;">Absences</th>
            <th style="text-align: center;">Status</th>
          </tr>
        </thead>
        <tbody>
          ${tableRows}
        </tbody>
      </table>

      <div class="signatures">
        <div class="sign-box">
          <div class="line">Mrs. Jane Dela Cruz</div>
          <p>Subject Teacher / Endorser</p>
        </div>
        <div class="sign-box">
          <div class="line">Academic Department Head</div>
          <p>College of Computer Studies</p>
        </div>
        <div class="sign-box">
          <div class="line">Office of the Administrator</div>
          <p>Final Validation & Award Approval</p>
        </div>
      </div>

      <script>
        window.onload = function() {
          window.print();
        };
      </script>
    </body>
    </html>
  `;

  printWindow.document.write(printHtml);
  printWindow.document.close();
}

// =========================================================================
// TOAST NOTIFICATION UTILITY
// =========================================================================

function showToastNotification(message) {
  let toastContainer = document.getElementById('amsToastContainer');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'amsToastContainer';
    toastContainer.className = 'fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm pointer-events-none';
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  toast.className = 'pointer-events-auto flex items-center gap-2.5 px-4 py-3 bg-[#111827] text-white text-xs rounded-xl shadow-xl border border-gray-700 animate-slide-in';
  toast.innerHTML = `
    <div class="w-5 h-5 rounded-full bg-[#16a34a] flex items-center justify-center shrink-0">
      <svg class="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
      </svg>
    </div>
    <span class="font-medium">${message}</span>
  `;

  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('opacity-0', 'transition-opacity', 'duration-300');
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 4000);
}
