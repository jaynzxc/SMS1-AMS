// assets/js/student/excuse-history.js
// Student Excuse History & Resolution Archive Module
// Bestlink College of the Philippines Attendance Monitoring System
// Reference: Section 1.6 of docs/student_frontend.md & student/excuse-slip/my-requests.html (1:1 UI design)

import { supabase } from '../config/supabaseClient.js';

// Base comprehensive historical dataset of excuse slips for student Juan Dela Cruz
const defaultHistorySlips = [
  {
    id: 'EXC-2026-006',
    subject: 'Web Development',
    teacher: 'Mr. Carlo Reyes',
    section: 'BSIT 3A',
    absenceDate: 'May 26, 2025',
    absenceDateRaw: '2025-05-26',
    dateFiled: 'May 26, 2025',
    reasonCategory: 'Medical Illness / Consultation',
    explanation: 'Medical consultation due to severe migraine and fever symptoms. Consulted with university clinic doctor.',
    attachmentName: 'Medical_Cert_May26.pdf',
    status: 'Approved',
    reviewedBy: 'Mr. Carlo Reyes',
    reviewedDate: 'May 27, 2025',
    remarks: 'Approved. Excuse accepted. Please coordinate for missed laboratory exercise #5 before Friday.'
  },
  {
    id: 'EXC-2026-005',
    subject: 'Systems Analysis',
    teacher: 'Mr. Benj Torres',
    section: 'BSIT 3A',
    absenceDate: 'May 27, 2025',
    absenceDateRaw: '2025-05-27',
    dateFiled: 'May 27, 2025',
    reasonCategory: 'Official School / University Activity',
    explanation: 'Representing Bestlink College of the Philippines in the Regional Inter-School IT Skills Competition.',
    attachmentName: 'Endorsement_Letter_SkillsComp.pdf',
    status: 'Pending Review',
    reviewedBy: 'Pending Evaluation',
    reviewedDate: 'Pending',
    remarks: 'Under evaluation by instructor and department academic coordinator.'
  },
  {
    id: 'EXC-2026-004',
    subject: 'Database Systems',
    teacher: 'Ms. Angela Ramos',
    section: 'BSIT 3A',
    absenceDate: 'May 19, 2025',
    absenceDateRaw: '2025-05-19',
    dateFiled: 'May 19, 2025',
    reasonCategory: 'Medical Illness / Consultation',
    explanation: 'Suffered from acute gastroenteritis, was advised to rest for 2 days by attending physician.',
    attachmentName: 'Clinical_Slip_May19.pdf',
    status: 'Approved',
    reviewedBy: 'Ms. Angela Ramos',
    reviewedDate: 'May 20, 2025',
    remarks: 'Approved. Medical slip confirmed. Submit missed quiz on next class meeting.'
  },
  {
    id: 'EXC-2026-003',
    subject: 'Introduction to Computing',
    teacher: 'Mrs. Jane Dela Cruz',
    section: 'BSIT 3A',
    absenceDate: 'May 21, 2025',
    absenceDateRaw: '2025-05-21',
    dateFiled: 'May 21, 2025',
    reasonCategory: 'Other Valid Grounds',
    explanation: 'Personal urgent matter at home during the scheduled morning lecture.',
    attachmentName: 'Barangay_Cert.pdf',
    status: 'Rejected',
    reviewedBy: 'Mrs. Jane Dela Cruz',
    reviewedDate: 'May 22, 2025',
    remarks: 'Rejected. Insufficient valid supporting documentation provided. Please coordinate with the guidance office.'
  },
  {
    id: 'EXC-2026-002',
    subject: 'Data Structures & Algorithms',
    teacher: 'Engr. Mark Santos',
    section: 'BSIT 3A',
    absenceDate: 'May 12, 2025',
    absenceDateRaw: '2025-05-12',
    dateFiled: 'May 12, 2025',
    reasonCategory: 'Official School / University Activity',
    explanation: 'Attended official campus accreditation mock assessment as departmental student representative.',
    attachmentName: 'Mock_Accreditation_Pass.pdf',
    status: 'Approved',
    reviewedBy: 'Engr. Mark Santos',
    reviewedDate: 'May 13, 2025',
    remarks: 'Approved. Official institutional duty validated.'
  },
  {
    id: 'EXC-2026-001',
    subject: 'Web Development',
    teacher: 'Mr. Carlo Reyes',
    section: 'BSIT 3A',
    absenceDate: 'May 05, 2025',
    absenceDateRaw: '2025-05-05',
    dateFiled: 'May 05, 2025',
    reasonCategory: 'Medical Illness / Consultation',
    explanation: 'Self-reported migraine episode.',
    attachmentName: 'Clinic_Pass_May05.png',
    status: 'Withdrawn',
    reviewedBy: 'Self (Student)',
    reviewedDate: 'May 05, 2025',
    remarks: 'Withdrawn by student prior to instructor evaluation.'
  },
  {
    id: 'EXC-2025-089',
    subject: 'Systems Analysis',
    teacher: 'Mr. Benj Torres',
    section: 'BSIT 3A',
    absenceDate: 'Apr 28, 2025',
    absenceDateRaw: '2025-04-28',
    dateFiled: 'Apr 28, 2025',
    reasonCategory: 'Family Emergency',
    explanation: 'Family emergency requiring immediate travel back to home province.',
    attachmentName: 'Emergency_Notice.pdf',
    status: 'Approved',
    reviewedBy: 'Mr. Benj Torres',
    reviewedDate: 'Apr 29, 2025',
    remarks: 'Approved. Excused with consideration. Coordinate with peer group for project milestone #2.'
  }
];

let allHistorySlips = [];
let filteredHistorySlips = [];
let currentPage = 1;
const itemsPerPage = 6;

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  console.log('📜 Excuse History Module Initialized');
  initCurrentDate();
  loadExcuseHistory();
  initSearch();
  initModalListeners();
  initProfileDropdown();
  exposeGlobalFunctions();
});

/**
 * Initialize current date in header (Matching my-requests.html)
 */
function initCurrentDate() {
  const dateEl = document.getElementById('currentDateLabel');
  if (dateEl) {
    const today = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' };
    const dateParts = today.toLocaleDateString('en-US', options).split(', ');
    if (dateParts.length >= 3) {
      dateEl.textContent = `${dateParts[1]}, ${dateParts[2]} (${dateParts[0]})`;
    } else {
      dateEl.textContent = 'May 27, 2025 (Tuesday)';
    }
  }
}

/**
 * Load Excuse Slips (combining default historical archive with localStorage session submissions)
 */
function loadExcuseHistory() {
  let combined = [...defaultHistorySlips];

  try {
    const storedSlipsRaw = localStorage.getItem('student_excuse_slips');
    if (storedSlipsRaw) {
      const storedSlips = JSON.parse(storedSlipsRaw);
      storedSlips.forEach(s => {
        if (!combined.some(c => c.id === s.id)) {
          // Normalize newly submitted slip for history view
          const historyEntry = {
            id: s.id,
            subject: s.subject || 'Web Development',
            teacher: s.teacher || 'Mr. Carlo Reyes',
            section: s.section || 'BSIT 3A',
            absenceDate: s.absenceDate || s.date || 'May 27, 2025',
            absenceDateRaw: s.absenceDateRaw || '2025-05-27',
            dateFiled: s.dateFiled || 'May 27, 2025',
            reasonCategory: s.reasonCategory || 'Medical Illness / Consultation',
            explanation: s.explanation || s.reason || 'Submitted excuse request.',
            attachmentName: s.attachmentName || 'Proof_Document.pdf',
            status: s.status || 'Pending Review',
            reviewedBy: s.status === 'Approved' ? (s.teacher || 'Instructor') : (s.status === 'Rejected' ? (s.teacher || 'Instructor') : 'Pending Evaluation'),
            reviewedDate: s.status === 'Pending Review' ? 'Pending' : 'May 27, 2025',
            remarks: s.remarks || (s.status === 'Pending Review' ? 'Under evaluation by assigned instructor.' : 'Request processed.')
          };
          combined.unshift(historyEntry);
        }
      });
    }
  } catch (e) {
    console.warn('Error reading from localStorage:', e);
  }

  allHistorySlips = combined;
  filteredHistorySlips = [...allHistorySlips];
  updateKPICounters();
  renderHistoryTable();
}

/**
 * Update Metric Cards and Header Badges (Matching my-requests.html)
 */
function updateKPICounters() {
  const total = allHistorySlips.length;
  const approved = allHistorySlips.filter(s => s.status === 'Approved').length;
  const rejected = allHistorySlips.filter(s => s.status === 'Rejected').length;
  const resolvedTotal = approved + rejected;
  const rate = resolvedTotal > 0 ? Math.round((approved / resolvedTotal) * 1000) / 10 : 0;

  const kpiTotal = document.getElementById('kpiTotalHistory');
  const kpiApproved = document.getElementById('kpiApprovedHistory');
  const kpiRejected = document.getElementById('kpiRejectedHistory');
  const kpiRate = document.getElementById('kpiApprovalRate');

  if (kpiTotal) kpiTotal.textContent = total;
  if (kpiApproved) kpiApproved.textContent = approved;
  if (kpiRejected) kpiRejected.textContent = rejected;
  if (kpiRate) kpiRate.textContent = `${rate}%`;

  const badge = document.getElementById('historyCountBadge');
  if (badge) {
    badge.textContent = `${filteredHistorySlips.length} ${filteredHistorySlips.length === 1 ? 'Record' : 'Records'}`;
  }
}

/**
 * Render Excuse History Table with Pagination
 */
function renderHistoryTable() {
  const tbody = document.getElementById('historyTableBody');
  const emptyState = document.getElementById('emptyHistoryState');
  const table = document.getElementById('historyTable');

  if (!tbody) return;

  if (filteredHistorySlips.length === 0) {
    tbody.innerHTML = '';
    if (emptyState) emptyState.classList.remove('hidden');
    if (table) table.classList.add('hidden');
    updatePaginationUI(0);
    return;
  }

  if (emptyState) emptyState.classList.add('hidden');
  if (table) table.classList.remove('hidden');

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, filteredHistorySlips.length);
  const pageItems = filteredHistorySlips.slice(startIndex, endIndex);

  tbody.innerHTML = pageItems.map(slip => {
    let statusBadge = '';
    if (slip.status === 'Approved') {
      statusBadge = `
        <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#f0fdf4] text-[#16a34a] border border-[#bbf7d0]">
          <span class="w-1.5 h-1.5 rounded-full bg-[#16a34a]"></span>
          Approved
        </span>
      `;
    } else if (slip.status === 'Rejected') {
      statusBadge = `
        <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#fef2f2] text-[#dc2626] border border-[#fecaca]">
          <span class="w-1.5 h-1.5 rounded-full bg-[#dc2626]"></span>
          Rejected
        </span>
      `;
    } else if (slip.status === 'Withdrawn') {
      statusBadge = `
        <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-gray-100 text-gray-600 border border-gray-200">
          <span class="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
          Withdrawn
        </span>
      `;
    } else {
      statusBadge = `
        <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#fff7ed] text-[#f97316] border border-[#fed7aa]">
          <span class="w-1.5 h-1.5 rounded-full bg-[#f97316] animate-pulse"></span>
          Pending Review
        </span>
      `;
    }

    const reviewedDateDisplay = slip.reviewedDate === 'Pending' 
      ? '<span class="text-amber-600 font-medium">Pending</span>'
      : `<span class="text-[#4b5563]">${escapeHtml(slip.reviewedDate || '—')}</span>`;

    return `
      <tr class="hover:bg-[#f8fafc] transition-colors">
        <td class="py-3 px-4 font-mono font-bold text-[#0030c2]">${escapeHtml(slip.id)}</td>
        <td class="py-3 px-4 font-medium text-[#4b5563]">${escapeHtml(slip.dateFiled)}</td>
        <td class="py-3 px-4 font-semibold text-[#111827]">${escapeHtml(slip.absenceDate)}</td>
        <td class="py-3 px-4 font-semibold text-[#111827]">${escapeHtml(slip.subject)}</td>
        <td class="py-3 px-4 text-[#4b5563]">${escapeHtml(slip.teacher)}</td>
        <td class="py-3 px-4 text-[#4b5563] truncate max-w-[180px]" title="${escapeHtml(slip.reasonCategory)}">${escapeHtml(slip.reasonCategory)}</td>
        <td class="py-3 px-4">${statusBadge}</td>
        <td class="py-3 px-4">${reviewedDateDisplay}</td>
        <td class="py-3 px-4">
          <span class="inline-flex items-center gap-1 text-[11px] font-medium text-[#0030c2] bg-[#eff6ff] hover:bg-[#dbeafe] px-2 py-0.5 rounded cursor-pointer border border-[#bfdbfe] transition-colors"
            onclick="openSlipModal('${escapeHtml(slip.id)}')" title="${escapeHtml(slip.attachmentName)}">
            <svg class="w-3 h-3 text-[#0030c2] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.657-8.486l-6.364 6.364a1.5 1.5 0 11-2.122-2.122l7.071-7.071" />
            </svg>
            <span class="truncate max-w-[90px]">${escapeHtml(slip.attachmentName)}</span>
          </span>
        </td>
        <td class="py-3 px-4 text-center">
          <div class="flex items-center justify-center">
            <button onclick="openSlipModal('${escapeHtml(slip.id)}')"
              class="p-1.5 text-gray-500 hover:text-[#0030c2] hover:bg-[#e7edff] rounded-lg transition-colors cursor-pointer"
              title="View History Details">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');

  updatePaginationUI(filteredHistorySlips.length);
}

/**
 * Update pagination count and button states
 */
function updatePaginationUI(total) {
  const showingCount = document.getElementById('pageShowingCount');
  const totalCount = document.getElementById('pageTotalCount');
  const prevBtn = document.getElementById('prevPageBtn');
  const nextBtn = document.getElementById('nextPageBtn');
  const pageOneBtn = document.getElementById('pageOneBtn');

  const startIndex = total === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, total);

  if (showingCount) showingCount.textContent = total === 0 ? '0' : `${endIndex - startIndex + 1}`;
  if (totalCount) totalCount.textContent = total;

  if (pageOneBtn) pageOneBtn.textContent = currentPage;

  const maxPage = Math.max(1, Math.ceil(total / itemsPerPage));
  if (prevBtn) prevBtn.disabled = currentPage <= 1;
  if (nextBtn) nextBtn.disabled = currentPage >= maxPage;
}

function goToPreviousPage() {
  if (currentPage > 1) {
    currentPage--;
    renderHistoryTable();
  }
}

function goToNextPage() {
  const maxPage = Math.ceil(filteredHistorySlips.length / itemsPerPage);
  if (currentPage < maxPage) {
    currentPage++;
    renderHistoryTable();
  }
}

/**
 * Real-time Search Filter across multiple fields
 */
function initSearch() {
  const searchInput = document.getElementById('historySearchInput');
  if (!searchInput) return;

  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    if (!query) {
      filteredHistorySlips = [...allHistorySlips];
    } else {
      filteredHistorySlips = allHistorySlips.filter(slip =>
        slip.id.toLowerCase().includes(query) ||
        slip.subject.toLowerCase().includes(query) ||
        slip.teacher.toLowerCase().includes(query) ||
        slip.reasonCategory.toLowerCase().includes(query) ||
        slip.status.toLowerCase().includes(query) ||
        slip.explanation.toLowerCase().includes(query) ||
        slip.remarks.toLowerCase().includes(query)
      );
    }
    currentPage = 1;
    renderHistoryTable();
    updateKPICounters();
  });
}

/**
 * Open Excuse Slip Detail Modal (Populates Section 1.6 metadata grid)
 */
function openSlipModal(ticketId) {
  const slip = allHistorySlips.find(s => s.id === ticketId);
  if (!slip) return;

  const modal = document.getElementById('slipDetailModal');
  if (!modal) return;

  document.getElementById('modalSlipTicketId').textContent = slip.id;
  document.getElementById('modalSlipSubject').textContent = slip.subject;
  document.getElementById('modalSlipTeacher').textContent = slip.teacher;
  document.getElementById('modalSlipAbsenceDate').textContent = slip.absenceDate;
  document.getElementById('modalSlipDateFiled').textContent = slip.dateFiled;
  document.getElementById('modalSlipReviewedDate').textContent = slip.reviewedDate || 'Pending Review';
  document.getElementById('modalSlipReviewedBy').textContent = slip.reviewedBy || 'Assigned Instructor';
  document.getElementById('modalSlipReason').textContent = slip.reasonCategory;
  document.getElementById('modalSlipExplanation').textContent = slip.explanation;
  document.getElementById('modalSlipAttachmentName').textContent = slip.attachmentName;
  document.getElementById('modalSlipRemarks').textContent = slip.remarks;

  const badgeContainer = document.getElementById('modalSlipStatusBadge');
  if (badgeContainer) {
    if (slip.status === 'Approved') {
      badgeContainer.innerHTML = `
        <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#f0fdf4] text-[#16a34a] border border-[#bbf7d0]">
          <span class="w-1.5 h-1.5 rounded-full bg-[#16a34a]"></span>
          Approved
        </span>
      `;
    } else if (slip.status === 'Rejected') {
      badgeContainer.innerHTML = `
        <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#fef2f2] text-[#dc2626] border border-[#fecaca]">
          <span class="w-1.5 h-1.5 rounded-full bg-[#dc2626]"></span>
          Rejected
        </span>
      `;
    } else if (slip.status === 'Withdrawn') {
      badgeContainer.innerHTML = `
        <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-gray-100 text-gray-600 border border-gray-200">
          <span class="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
          Withdrawn
        </span>
      `;
    } else {
      badgeContainer.innerHTML = `
        <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#fff7ed] text-[#f97316] border border-[#fed7aa]">
          <span class="w-1.5 h-1.5 rounded-full bg-[#f97316] animate-pulse"></span>
          Pending Review
        </span>
      `;
    }
  }

  modal.classList.remove('hidden');
  modal.classList.add('flex');
}

function closeSlipModal() {
  const modal = document.getElementById('slipDetailModal');
  if (modal) {
    modal.classList.remove('flex');
    modal.classList.add('hidden');
  }
}

/**
 * Filter Modal Controls
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
    modal.classList.remove('flex');
    modal.classList.add('hidden');
  }
}

function applyModalFilters() {
  const dateVal = document.getElementById('filterDateInput')?.value;
  const subjectVal = document.getElementById('filterSubjectSelect')?.value;
  const statusVal = document.getElementById('filterStatusSelect')?.value;
  const categoryVal = document.getElementById('filterCategorySelect')?.value;

  filteredHistorySlips = allHistorySlips.filter(slip => {
    let matchesDate = true;
    let matchesSubject = true;
    let matchesStatus = true;
    let matchesCategory = true;

    if (dateVal) {
      matchesDate = slip.absenceDateRaw === dateVal;
    }
    if (subjectVal) {
      matchesSubject = slip.subject === subjectVal;
    }
    if (statusVal) {
      matchesStatus = slip.status === statusVal;
    }
    if (categoryVal) {
      matchesCategory = slip.reasonCategory === categoryVal;
    }

    return matchesDate && matchesSubject && matchesStatus && matchesCategory;
  });

  currentPage = 1;
  renderHistoryTable();
  updateKPICounters();
  closeFilterModal();

  showToast('Filters Applied', `Showing ${filteredHistorySlips.length} matching history record(s).`, 'info');
}

function resetModalFilters() {
  const dateInput = document.getElementById('filterDateInput');
  const subjectSelect = document.getElementById('filterSubjectSelect');
  const statusSelect = document.getElementById('filterStatusSelect');
  const categorySelect = document.getElementById('filterCategorySelect');
  const searchInput = document.getElementById('historySearchInput');

  if (dateInput) dateInput.value = '';
  if (subjectSelect) subjectSelect.value = '';
  if (statusSelect) statusSelect.value = '';
  if (categorySelect) categorySelect.value = '';
  if (searchInput) searchInput.value = '';

  filteredHistorySlips = [...allHistorySlips];
  currentPage = 1;
  renderHistoryTable();
  updateKPICounters();
  closeFilterModal();

  showToast('Filters Reset', 'All excuse history filters restored to default.', 'info');
}

/**
 * Toast Notification Helper (1:1 Reference from admin/attendance.js)
 */
function showToast(titleOrMessage, messageOrType, type = 'success') {
  let title = titleOrMessage;
  let message = messageOrType;
  let toastType = type;

  // Check if called as showToast(message, type)
  if (messageOrType === undefined) {
    message = titleOrMessage;
    toastType = 'success';
    title = 'Success';
  } else if (messageOrType === 'success' || messageOrType === 'info' || messageOrType === 'error' || messageOrType === 'danger' || messageOrType === 'warning') {
    message = titleOrMessage;
    toastType = messageOrType === 'danger' ? 'error' : messageOrType;
    title = toastType === 'success' ? 'Success' : toastType === 'info' ? 'Info' : toastType === 'warning' ? 'Warning' : 'Error';
  }

  let toastContainer = document.getElementById('toastContainer');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toastContainer';
    toastContainer.className = 'fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none';
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  toast.className = 'custom-toast pointer-events-auto bg-white border border-[#e5e7eb] shadow-xl rounded-xl p-3.5 flex items-start gap-3 min-w-[280px] max-w-sm transition-all duration-300 transform translate-x-0';

  let iconSvg = '';
  if (toastType === 'success') {
    iconSvg = `
      <div class="w-8 h-8 rounded-xl bg-[#f0fdf4] text-[#16a34a] border border-[#bbf7d0] flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
        <svg class="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.25">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
      </div>
    `;
  } else if (toastType === 'info') {
    iconSvg = `
      <div class="w-8 h-8 rounded-xl bg-[#eff6ff] text-[#0030c2] border border-[#bfdbfe] flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
        <svg class="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.25">
          <path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
        </svg>
      </div>
    `;
  } else if (toastType === 'warning') {
    iconSvg = `
      <div class="w-8 h-8 rounded-xl bg-[#fff7ed] text-[#f97316] border border-[#fed7aa] flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
        <svg class="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.25">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
        </svg>
      </div>
    `;
  } else {
    iconSvg = `
      <div class="w-8 h-8 rounded-xl bg-[#fef2f2] text-[#dc2626] border border-[#fecaca] flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
        <svg class="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.25">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>
    `;
  }

  toast.innerHTML = `
    ${iconSvg}
    <div class="flex-1 min-w-0">
      <p class="text-xs font-bold text-[#111827]">${title}</p>
      <p class="text-[11px] text-[#6b7280] mt-0.5 leading-tight">${message}</p>
    </div>
    <button onclick="this.parentElement.remove()" class="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg p-1 transition-colors cursor-pointer shrink-0">
      <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
    </button>
  `;

  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('opacity-0', 'translate-x-full');
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

/**
 * Escape HTML to avoid XSS injections
 */
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Modal Backdrop & Escape key listeners
 */
function initModalListeners() {
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeSlipModal();
      closeFilterModal();
    }
  });

  const slipModal = document.getElementById('slipDetailModal');
  if (slipModal) {
    slipModal.addEventListener('click', (e) => {
      if (e.target === slipModal) closeSlipModal();
    });
  }

  const filterModal = document.getElementById('filterModal');
  if (filterModal) {
    filterModal.addEventListener('click', (e) => {
      if (e.target === filterModal) closeFilterModal();
    });
  }
}

/**
 * Student Topbar Profile Dropdown
 */
function initProfileDropdown() {
  document.addEventListener('click', (e) => {
    const profileBtn = document.getElementById('topbarProfileBtn');
    const profileMenu = document.getElementById('studentProfileMenu');
    if (profileBtn && profileMenu && !profileBtn.contains(e.target) && !profileMenu.contains(e.target)) {
      profileMenu.classList.add('hidden');
    }
  });
}

function toggleProfileDropdown(event) {
  if (event) event.stopPropagation();
  const profileMenu = document.getElementById('studentProfileMenu');
  if (profileMenu) {
    profileMenu.classList.toggle('hidden');
  }
}

function handleLogout() {
  if (confirm('Are you sure you want to log out of your student account?')) {
    window.location.href = '../../index.html';
  }
}

/**
 * Expose functions globally for inline HTML event triggers
 */
function exposeGlobalFunctions() {
  window.openSlipModal = openSlipModal;
  window.closeSlipModal = closeSlipModal;
  window.openFilterModal = openFilterModal;
  window.closeFilterModal = closeFilterModal;
  window.applyModalFilters = applyModalFilters;
  window.resetModalFilters = resetModalFilters;
  window.goToPreviousPage = goToPreviousPage;
  window.goToNextPage = goToNextPage;
  window.toggleProfileDropdown = toggleProfileDropdown;
  window.handleLogout = handleLogout;
  window.showToast = showToast;
}
