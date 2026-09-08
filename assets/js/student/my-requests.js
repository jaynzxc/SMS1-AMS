// assets/js/student/my-requests.js
// Student Excuse Requests Tracking & Management Module
// Bestlink College of the Philippines Attendance Monitoring System
// Follows student/tardy-and-absence/attendance-history.js design & styling standards 1:1

import { supabase } from '../config/supabaseClient.js';

// Base dataset of excuse slips for student Juan Dela Cruz (Ticket Year: 2026)
const defaultSlips = [
  {
    id: 'EXC-2026-004',
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
    remarks: 'Pending evaluation by department head and instructor.'
  },
  {
    id: 'EXC-2026-003',
    subject: 'Web Development',
    teacher: 'Mr. Carlo Reyes',
    section: 'BSIT 3A',
    absenceDate: 'May 26, 2025',
    absenceDateRaw: '2025-05-26',
    dateFiled: 'May 26, 2025',
    reasonCategory: 'Medical Illness / Consultation',
    explanation: 'Medical consultation due to severe migraine and fever symptoms. Consulted with university clinic doctor.',
    attachmentName: 'Medical_Cert_May26.pdf',
    status: 'Pending Review',
    remarks: 'Pending review by instructor.'
  },
  {
    id: 'EXC-2026-002',
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
    remarks: 'Approved. Excuse accepted. Please submit missed laboratory exercise #4 before Friday.'
  },
  {
    id: 'EXC-2026-001',
    subject: 'Introduction to Computing',
    teacher: 'Mrs. Jane Dela Cruz',
    section: 'BSIT 3A',
    absenceDate: 'May 21, 2025',
    absenceDateRaw: '2025-05-21',
    dateFiled: 'May 21, 2025',
    reasonCategory: 'Other Valid Grounds',
    explanation: 'Personal urgent matter at home during the scheduled lecture.',
    attachmentName: 'Barangay_Cert.pdf',
    status: 'Rejected',
    remarks: 'Insufficient valid supporting documentation provided. Please coordinate with the guidance office.'
  }
];

let allSlips = [];
let filteredSlips = [];
let pendingWithdrawTicketId = null;
let pendingEditTicketId = null;

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  console.log('📋 My Excuse Requests Module Initialized');
  initCurrentDate();
  loadExcuseSlips();
  initSearch();
  initModalListeners();
  initProfileDropdown();
  exposeGlobalFunctions();
});

/**
 * Initialize current date in header (Matching attendance-history.html)
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
 * Load Excuse Slips (combining default sample data with session submissions in localStorage)
 */
function loadExcuseSlips() {
  let combined = [...defaultSlips];

  try {
    const storedSlipsRaw = localStorage.getItem('student_excuse_slips');
    if (storedSlipsRaw) {
      const storedSlips = JSON.parse(storedSlipsRaw);
      // Prepend user-submitted slips not already in default list
      storedSlips.forEach(s => {
        if (!combined.some(c => c.id === s.id)) {
          combined.unshift(s);
        }
      });
    }
  } catch (e) {
    console.warn('Error retrieving excuse slips from localStorage:', e);
  }

  allSlips = combined;
  filteredSlips = [...allSlips];
  updateKPICounters();
  renderRequestsTable();
}

/**
 * Update Metric Cards and Header Badges (Matching attendance-history.html)
 */
function updateKPICounters() {
  const total = allSlips.length;
  const pending = allSlips.filter(s => s.status === 'Pending Review').length;
  const approved = allSlips.filter(s => s.status === 'Approved').length;
  const rejected = allSlips.filter(s => s.status === 'Rejected').length;

  const kpiTotal = document.getElementById('kpiTotalRequests');
  const kpiPending = document.getElementById('kpiPendingReview');
  const kpiApproved = document.getElementById('kpiApprovedRequests');
  const kpiRejected = document.getElementById('kpiRejectedRequests');

  if (kpiTotal) kpiTotal.textContent = total;
  if (kpiPending) kpiPending.textContent = pending;
  if (kpiApproved) kpiApproved.textContent = approved;
  if (kpiRejected) kpiRejected.textContent = rejected;

  const countBadge = document.getElementById('requestsCountBadge');
  if (countBadge) {
    countBadge.textContent = `${filteredSlips.length} Requests`;
  }
}

/**
 * Render Requests Ledger Table (1:1 with attendance-history.html table rows)
 */
function renderRequestsTable() {
  const tbody = document.getElementById('requestsTableBody');
  const emptyState = document.getElementById('emptyRequestsState');
  const pageShowing = document.getElementById('pageShowingCount');
  const pageTotal = document.getElementById('pageTotalCount');
  const countBadge = document.getElementById('requestsCountBadge');

  if (pageShowing) pageShowing.textContent = filteredSlips.length;
  if (pageTotal) pageTotal.textContent = allSlips.length;
  if (countBadge) countBadge.textContent = `${filteredSlips.length} Requests`;

  if (!tbody) return;

  if (filteredSlips.length === 0) {
    tbody.innerHTML = '';
    if (emptyState) emptyState.classList.remove('hidden');
    return;
  }

  if (emptyState) emptyState.classList.add('hidden');

  tbody.innerHTML = filteredSlips.map(slip => {
    // Status Badge (1:1 with attendance-history.html badges)
    let statusBadge = '';
    if (slip.status === 'Approved') {
      statusBadge = `
        <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#f0fdf4] text-[#16a34a] border border-[#bbf7d0]">
          Approved
        </span>`;
    } else if (slip.status === 'Rejected') {
      statusBadge = `
        <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#fef2f2] text-[#dc2626] border border-[#fecaca]">
          Rejected
        </span>`;
    } else {
      statusBadge = `
        <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#fff7ed] text-[#f97316] border border-[#fed7aa]">
          Pending Review
        </span>`;
    }

    // Attachment display chip (1:1 with RFID/QR method badge styling in attendance-history.html)
    let attachmentHtml = '';
    if (slip.attachmentName) {
      attachmentHtml = `
        <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-[#eff6ff] text-[#2563eb] border border-[#bfdbfe] max-w-[130px] truncate" title="${slip.attachmentName}">
          <svg class="w-3 h-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.657-8.486l-6.364 6.364a1.5 1.5 0 11-2.122-2.122l7.071-7.071" />
          </svg>
          <span class="truncate">${slip.attachmentName}</span>
        </span>`;
    } else {
      attachmentHtml = `
        <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-gray-100 text-gray-500 border border-gray-200">
          -
        </span>`;
    }

    // Edit button (only for pending reviews)
    let editBtnHtml = '';
    if (slip.status === 'Pending Review') {
      editBtnHtml = `
        <button onclick="openEditModal('${slip.id}')"
          class="p-1.5 text-gray-400 hover:text-[#0030c2] hover:bg-[#e7edff] rounded-lg transition-colors cursor-pointer inline-flex items-center justify-center"
          title="Edit Request">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.75">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
          </svg>
        </button>
      `;
    }

    // Withdraw button (only for pending reviews)
    let withdrawBtnHtml = '';
    if (slip.status === 'Pending Review') {
      withdrawBtnHtml = `
        <button onclick="openWithdrawModal('${slip.id}')"
          class="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer inline-flex items-center justify-center"
          title="Withdraw Request">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.75">
            <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
          </svg>
        </button>
      `;
    }

    return `
      <tr class="hover:bg-[#f9fafb] transition-colors">
        <!-- Ticket ID -->
        <td class="py-3 px-4 font-mono font-bold text-[#0030c2] whitespace-nowrap">
          ${slip.id}
        </td>

        <!-- Date of Absence -->
        <td class="py-3 px-4 font-semibold text-[#111827] whitespace-nowrap">
          ${slip.absenceDate}
        </td>

        <!-- Subject -->
        <td class="py-3 px-4 font-semibold text-[#111827]">
          ${slip.subject}
        </td>

        <!-- Teacher -->
        <td class="py-3 px-4 text-[#4b5563]">
          ${slip.teacher}
        </td>

        <!-- Reason Category -->
        <td class="py-3 px-4 text-[#4b5563] truncate max-w-[160px]">
          ${slip.reasonCategory}
        </td>

        <!-- Status -->
        <td class="py-3 px-4 whitespace-nowrap">
          ${statusBadge}
        </td>

        <!-- Attachment -->
        <td class="py-3 px-4 whitespace-nowrap">
          ${attachmentHtml}
        </td>

        <!-- Date Filed -->
        <td class="py-3 px-4 text-[#4b5563] whitespace-nowrap">
          ${slip.dateFiled || slip.absenceDate}
        </td>

        <!-- Actions (1:1 with attendance-history.html) -->
        <td class="py-3 px-4 text-center whitespace-nowrap">
          <div class="inline-flex items-center gap-1 justify-center">
            <button onclick="openSlipModal('${slip.id}')"
              class="p-1.5 text-[#2563eb] hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
              title="View details">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
            ${editBtnHtml}
            ${withdrawBtnHtml}
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

/**
 * Setup Real-time Search Input (Matching attendance-history.html)
 */
function initSearch() {
  const searchInput = document.getElementById('requestsSearchInput');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase().trim();
      if (!q) {
        filteredSlips = [...allSlips];
      } else {
        filteredSlips = allSlips.filter(s =>
          s.id.toLowerCase().includes(q) ||
          s.subject.toLowerCase().includes(q) ||
          s.teacher.toLowerCase().includes(q) ||
          s.reasonCategory.toLowerCase().includes(q) ||
          s.explanation.toLowerCase().includes(q)
        );
      }
      renderRequestsTable();
    });
  }
}

/**
 * Filter Modal Controls (Matching attendance-history.html)
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
  const dateVal = document.getElementById('filterDateInput')?.value || '';
  const subjectVal = document.getElementById('filterSubjectSelect')?.value || '';
  const statusVal = document.getElementById('filterStatusSelect')?.value || '';

  filteredSlips = allSlips.filter(item => {
    if (dateVal && item.absenceDateRaw !== dateVal) return false;
    if (subjectVal && item.subject !== subjectVal) return false;
    if (statusVal && item.status !== statusVal) return false;
    return true;
  });

  renderRequestsTable();
  closeFilterModal();
  showToast('Filters Applied', 'Filtered excuse requests by selected criteria.', 'info');
}

function resetModalFilters() {
  const dateInput = document.getElementById('filterDateInput');
  const subjectSelect = document.getElementById('filterSubjectSelect');
  const statusSelect = document.getElementById('filterStatusSelect');
  const searchInput = document.getElementById('requestsSearchInput');

  if (dateInput) dateInput.value = '';
  if (subjectSelect) subjectSelect.value = '';
  if (statusSelect) statusSelect.value = '';
  if (searchInput) searchInput.value = '';

  filteredSlips = [...allSlips];
  renderRequestsTable();
  closeFilterModal();
  showToast('Filters Reset', 'All excuse request filters restored to default.', 'info');
}

/**
 * Open Excuse Slip Details Modal (Matching attendance-history.html recordDetailModal)
 */
function openSlipModal(ticketId) {
  const slip = allSlips.find(s => s.id === ticketId);
  if (!slip) return;

  const modal = document.getElementById('slipDetailModal');
  if (!modal) return;

  const subtitleEl = document.getElementById('modalSlipTicketSubtitle');
  const idEl = document.getElementById('modalSlipTicketId');
  const subjectEl = document.getElementById('modalSlipSubject');
  const teacherEl = document.getElementById('modalSlipTeacher');
  const absenceDateEl = document.getElementById('modalSlipAbsenceDate');
  const dateFiledEl = document.getElementById('modalSlipDateFiled');
  const reasonEl = document.getElementById('modalSlipReason');
  const expEl = document.getElementById('modalSlipExplanation');
  const attachmentBox = document.getElementById('modalSlipAttachmentBox');
  const attachmentNameEl = document.getElementById('modalSlipAttachmentName');
  const remarksEl = document.getElementById('modalSlipRemarks');
  const badgeContainer = document.getElementById('modalSlipStatusBadge');

  if (subtitleEl) subtitleEl.textContent = `Ticket: ${slip.id}`;
  if (idEl) idEl.textContent = slip.id;
  if (subjectEl) subjectEl.textContent = slip.subject;
  if (teacherEl) teacherEl.textContent = slip.teacher;
  if (absenceDateEl) absenceDateEl.textContent = slip.absenceDate;
  if (dateFiledEl) dateFiledEl.textContent = slip.dateFiled || slip.absenceDate;
  if (reasonEl) reasonEl.textContent = slip.reasonCategory;
  if (expEl) expEl.textContent = slip.explanation;
  if (remarksEl) remarksEl.textContent = slip.remarks || 'Pending evaluation by instructor.';

  if (attachmentNameEl) {
    if (slip.attachmentName) {
      attachmentNameEl.textContent = slip.attachmentName;
      if (attachmentBox) attachmentBox.classList.remove('hidden');
    } else {
      if (attachmentBox) attachmentBox.classList.add('hidden');
    }
  }

  if (badgeContainer) {
    if (slip.status === 'Approved') {
      badgeContainer.innerHTML = `
        <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#f0fdf4] text-[#16a34a] border border-[#bbf7d0]">
          Approved
        </span>
      `;
    } else if (slip.status === 'Rejected') {
      badgeContainer.innerHTML = `
        <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#fef2f2] text-[#dc2626] border border-[#fecaca]">
          Rejected
        </span>
      `;
    } else {
      badgeContainer.innerHTML = `
        <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#fff7ed] text-[#f97316] border border-[#fed7aa]">
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
 * Withdraw Request Confirmation Flow
 */
function openWithdrawModal(ticketId) {
  pendingWithdrawTicketId = ticketId;
  const label = document.getElementById('withdrawTicketIdLabel');
  if (label) label.textContent = ticketId;

  const modal = document.getElementById('withdrawModal');
  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }
}

function closeWithdrawModal() {
  pendingWithdrawTicketId = null;
  const modal = document.getElementById('withdrawModal');
  if (modal) {
    modal.classList.remove('flex');
    modal.classList.add('hidden');
  }
}

function confirmWithdrawRequest() {
  if (!pendingWithdrawTicketId) return;

  const ticketId = pendingWithdrawTicketId;
  allSlips = allSlips.filter(s => s.id !== ticketId);

  // Update localStorage if saved there
  try {
    const stored = JSON.parse(localStorage.getItem('student_excuse_slips') || '[]');
    const updated = stored.filter(s => s.id !== ticketId);
    localStorage.setItem('student_excuse_slips', JSON.stringify(updated));
  } catch (e) {
    console.warn('Error updating localStorage:', e);
  }

  closeWithdrawModal();
  updateKPICounters();
  filteredSlips = [...allSlips];
  renderRequestsTable();

  // Toast notification matching Admin Attendance Monitoring
  showToast('Request Withdrawn', `${ticketId} was successfully withdrawn.`, 'success');
}

/**
 * Open Edit Excuse Request Modal (Option A)
 */
function openEditModal(ticketId) {
  const slip = allSlips.find(s => s.id === ticketId);
  if (!slip) return;

  pendingEditTicketId = ticketId;

  const ticketLabel = document.getElementById('editModalTicketIdLabel');
  const subjectLabel = document.getElementById('editModalSubjectLabel');
  const teacherLabel = document.getElementById('editModalTeacherLabel');
  const dateInput = document.getElementById('editAbsenceDateInput');
  const categorySelect = document.getElementById('editReasonCategorySelect');
  const explanationText = document.getElementById('editExplanationTextarea');
  const attachmentLabel = document.getElementById('editCurrentAttachmentName');
  const attachmentStatus = document.getElementById('editAttachmentStatusBadge');
  const fileInput = document.getElementById('editAttachmentFileInput');

  if (ticketLabel) ticketLabel.textContent = slip.id;
  if (subjectLabel) subjectLabel.textContent = slip.subject;
  if (teacherLabel) teacherLabel.textContent = slip.teacher;
  if (dateInput) dateInput.value = slip.absenceDate || slip.absenceDateRaw || '';
  if (categorySelect) categorySelect.value = slip.reasonCategory;
  if (explanationText) explanationText.value = slip.explanation;
  if (attachmentLabel) attachmentLabel.textContent = slip.attachmentName || 'No document attached';
  
  if (fileInput) fileInput.value = '';
  if (attachmentStatus) {
    attachmentStatus.textContent = 'Current Proof';
    attachmentStatus.className = 'text-[10px] font-semibold text-[#0030c2] bg-[#eff6ff] px-2 py-0.5 rounded border border-[#bfdbfe] shrink-0';
  }

  const modal = document.getElementById('editSlipModal');
  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }
}

/**
 * Close Edit Excuse Request Modal
 */
function closeEditModal() {
  pendingEditTicketId = null;
  const modal = document.getElementById('editSlipModal');
  if (modal) {
    modal.classList.remove('flex');
    modal.classList.add('hidden');
  }
}

/**
 * Save Changes from Edit Modal
 */
function saveExcuseRequestChanges() {
  if (!pendingEditTicketId) return;

  const categorySelect = document.getElementById('editReasonCategorySelect');
  const explanationText = document.getElementById('editExplanationTextarea');
  const fileInput = document.getElementById('editAttachmentFileInput');

  const newCategory = categorySelect?.value;
  const newExplanation = explanationText?.value?.trim();

  if (!newExplanation) {
    showToast('Validation Error', 'Please complete the detailed explanation before saving.', 'warning');
    return;
  }

  const slipIndex = allSlips.findIndex(s => s.id === pendingEditTicketId);
  if (slipIndex === -1) return;

  allSlips[slipIndex].reasonCategory = newCategory;
  allSlips[slipIndex].explanation = newExplanation;
  allSlips[slipIndex].isEdited = true;

  if (fileInput?.files?.[0]) {
    allSlips[slipIndex].attachmentName = fileInput.files[0].name;
  }

  // Update in localStorage
  try {
    const stored = JSON.parse(localStorage.getItem('student_excuse_slips') || '[]');
    const storedIdx = stored.findIndex(s => s.id === pendingEditTicketId);
    if (storedIdx !== -1) {
      stored[storedIdx] = { ...stored[storedIdx], ...allSlips[slipIndex] };
      localStorage.setItem('student_excuse_slips', JSON.stringify(stored));
    } else {
      stored.unshift(allSlips[slipIndex]);
      localStorage.setItem('student_excuse_slips', JSON.stringify(stored));
    }
  } catch (e) {
    console.warn('Error updating localStorage:', e);
  }

  const savedId = pendingEditTicketId;
  closeEditModal();

  filteredSlips = [...allSlips];
  renderRequestsTable();

  // Trigger feedback toast
  showToast('Request Updated', `${savedId} was successfully updated.`, 'success');
}

/**
 * Toast Notification Helper (1:1 Reference from admin/attendance.js)
 */
function showToast(titleOrMessage, messageOrType, type = 'success') {
  let title = titleOrMessage;
  let message = messageOrType;
  let toastType = type;

  // Check if it's called as showToast(message, type)
  if (messageOrType === undefined) {
    message = titleOrMessage;
    toastType = 'success';
    title = 'Success';
  } else if (messageOrType === 'success' || messageOrType === 'info' || messageOrType === 'error' || messageOrType === 'danger') {
    message = titleOrMessage;
    toastType = messageOrType === 'danger' ? 'error' : messageOrType;
    title = toastType === 'success' ? 'Success' : toastType === 'info' ? 'Info' : 'Error';
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
 * Pagination Placeholder Stubs (Matching attendance-history.html)
 */
function goToPreviousPage() {
  console.log('Previous page clicked');
}

function goToNextPage() {
  console.log('Next page clicked');
}

/**
 * Modal Listeners for Click-Outside and Escape key
 */
function initModalListeners() {
  const slipModal = document.getElementById('slipDetailModal');
  const filterModal = document.getElementById('filterModal');
  const withdrawModal = document.getElementById('withdrawModal');
  const editSlipModal = document.getElementById('editSlipModal');

  [slipModal, filterModal, withdrawModal, editSlipModal].forEach(m => {
    if (m) {
      m.addEventListener('click', (e) => {
        if (e.target === m) {
          m.classList.remove('flex');
          m.classList.add('hidden');
          if (m === editSlipModal) pendingEditTicketId = null;
          if (m === withdrawModal) pendingWithdrawTicketId = null;
        }
      });
    }
  });

  // Replacement file upload change preview
  const fileInput = document.getElementById('editAttachmentFileInput');
  if (fileInput) {
    fileInput.addEventListener('change', (e) => {
      const file = e.target.files?.[0];
      if (file) {
        const label = document.getElementById('editCurrentAttachmentName');
        const badge = document.getElementById('editAttachmentStatusBadge');
        if (label) label.textContent = file.name;
        if (badge) {
          badge.textContent = 'Replacement File';
          badge.className = 'text-[10px] font-semibold text-[#16a34a] bg-[#f0fdf4] px-2 py-0.5 rounded border border-[#bbf7d0] shrink-0';
        }
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeSlipModal();
      closeFilterModal();
      closeWithdrawModal();
      closeEditModal();
    }
  });
}

/**
 * Topbar Profile Dropdown and Logout Handlers (1:1 Reference from attendance-history.html)
 */
function toggleProfileDropdown(event) {
  if (event) event.stopPropagation();
  const menu = document.getElementById('studentProfileMenu');
  if (menu) {
    menu.classList.toggle('hidden');
  }
}

function handleLogout() {
  if (confirm('Are you sure you want to log out?')) {
    window.location.href = '../../login.html';
  }
}

function initProfileDropdown() {
  document.addEventListener('click', (e) => {
    const profileBtn = document.getElementById('topbarProfileBtn');
    const profileMenu = document.getElementById('studentProfileMenu');
    if (profileMenu && !profileMenu.classList.contains('hidden')) {
      if (!profileBtn?.contains(e.target) && !profileMenu.contains(e.target)) {
        profileMenu.classList.add('hidden');
      }
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const profileMenu = document.getElementById('studentProfileMenu');
      if (profileMenu) profileMenu.classList.add('hidden');
    }
  });
}

/**
 * Expose functions to window
 */
function exposeGlobalFunctions() {
  window.openFilterModal = openFilterModal;
  window.closeFilterModal = closeFilterModal;
  window.applyModalFilters = applyModalFilters;
  window.resetModalFilters = resetModalFilters;
  window.openSlipModal = openSlipModal;
  window.closeSlipModal = closeSlipModal;
  window.openWithdrawModal = openWithdrawModal;
  window.closeWithdrawModal = closeWithdrawModal;
  window.confirmWithdrawRequest = confirmWithdrawRequest;
  window.openEditModal = openEditModal;
  window.closeEditModal = closeEditModal;
  window.saveExcuseRequestChanges = saveExcuseRequestChanges;
  window.showToast = showToast;
  window.goToPreviousPage = goToPreviousPage;
  window.goToNextPage = goToNextPage;
  window.toggleProfileDropdown = toggleProfileDropdown;
  window.handleLogout = handleLogout;
}
