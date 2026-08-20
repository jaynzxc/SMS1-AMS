// assets/js/habitual-offender.js
// Habitual Offender Management & Interactive Filtering Module

document.addEventListener('DOMContentLoaded', function() {
  console.log('Habitual Offender module initialized');

  // Initialize Real-Time Search input
  initOffenderSearch();

  // Initialize Modal Listeners (ESC key and backdrop clicks)
  initModalListeners();
});

// =============================================================
// TOAST NOTIFICATIONS HELPER
// =============================================================
function showToast(message, type = 'success') {
  let toastContainer = document.getElementById('toastContainer');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toastContainer';
    toastContainer.className = 'fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none';
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  const bgColor = type === 'success' ? 'bg-emerald-600' : type === 'error' ? 'bg-rose-600' : 'bg-[#0030c2]';
  const iconSvg = type === 'success' 
    ? `<svg class="w-5 h-5 text-white shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>`
    : type === 'error'
    ? `<svg class="w-5 h-5 text-white shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>`
    : `<svg class="w-5 h-5 text-white shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`;

  toast.className = `flex items-center gap-2.5 px-4 py-3 text-white text-xs font-semibold rounded-xl shadow-xl ${bgColor} transform transition-all duration-300 translate-y-2 opacity-0 pointer-events-auto border border-white/10`;
  toast.innerHTML = `
    ${iconSvg}
    <span>${message}</span>
  `;

  toastContainer.appendChild(toast);

  // Trigger animation
  setTimeout(() => {
    toast.classList.remove('translate-y-2', 'opacity-0');
  }, 10);

  // Remove toast after 3.5s
  setTimeout(() => {
    toast.classList.add('translate-y-2', 'opacity-0');
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 3500);
}

// =============================================================
// SEARCH & MULTI-CRITERIA FILTERING (Search, Section, Status)
// =============================================================
function initOffenderSearch() {
  const searchInput = document.getElementById('offenderSearch');
  if (!searchInput) return;

  searchInput.addEventListener('input', function() {
    executeOffenderFiltering();
  });
}

function executeOffenderFiltering() {
  const searchInput = document.getElementById('offenderSearch');
  const sectionFilter = document.getElementById('filterSectionSelect');
  const statusFilter = document.getElementById('filterStatusSelect');
  const table = document.getElementById('offenderTable');

  if (!table) return 0;

  const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';
  const selectedSection = sectionFilter ? sectionFilter.value.toLowerCase().trim() : '';
  const selectedStatus = statusFilter ? statusFilter.value.toLowerCase().trim() : '';

  const rows = table.querySelectorAll('tbody tr');
  let visibleCount = 0;

  rows.forEach(row => {
    const rowText = row.innerText.toLowerCase();
    const studentIdAttr = (row.getAttribute('data-student-id') || '').toLowerCase();
    const studentNameAttr = (row.getAttribute('data-student-name') || '').toLowerCase();
    const sectionAttr = (row.getAttribute('data-section') || '').toLowerCase();
    const statusAttr = (row.getAttribute('data-status') || '').toLowerCase();

    // Check search term
    const matchesSearch = !searchTerm || 
      rowText.includes(searchTerm) || 
      studentIdAttr.includes(searchTerm) || 
      studentNameAttr.includes(searchTerm) ||
      sectionAttr.includes(searchTerm);

    // Check section filter
    const matchesSection = !selectedSection || 
      selectedSection === 'all sections' || 
      sectionAttr.includes(selectedSection) || 
      rowText.includes(selectedSection);

    // Check status filter (Exceeds 5 Late, Exceeds 5 Absences, Exceeds Both, At Risk)
    let matchesStatus = true;
    if (selectedStatus && selectedStatus !== 'all status' && selectedStatus !== '') {
      matchesStatus = statusAttr.includes(selectedStatus) || rowText.includes(selectedStatus);
    }

    if (matchesSearch && matchesSection && matchesStatus) {
      row.style.display = '';
      visibleCount++;
    } else {
      row.style.display = 'none';
    }
  });

  // Update visible count in table header badge
  const countBadge = document.getElementById('offenderRecordCount');
  if (countBadge) {
    const hasFilter = searchTerm || (selectedSection && selectedSection !== 'all sections') || (selectedStatus && selectedStatus !== 'all status');
    countBadge.textContent = hasFilter ? `${visibleCount} Found` : `18 Records`;
  }

  return visibleCount;
}

// =============================================================
// FILTER MODAL CONTROLS
// =============================================================
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

function applyOffenderFilters() {
  const matchCount = executeOffenderFiltering();
  closeFilterModal();
  showToast(`Filters applied. ${matchCount} record(s) matching.`, 'info');
}

function resetOffenderFilters() {
  if (document.getElementById('filterSectionSelect')) document.getElementById('filterSectionSelect').value = '';
  if (document.getElementById('filterStatusSelect')) document.getElementById('filterStatusSelect').value = '';
  if (document.getElementById('offenderSearch')) document.getElementById('offenderSearch').value = '';

  closeFilterModal();
  executeOffenderFiltering();
  showToast('Filters reset to default.', 'info');
}

// =============================================================
// EXPORT MODAL CONTROLS (Referenced from scan-logs.html)
// =============================================================
function openExportModal() {
  const modal = document.getElementById('exportModal');
  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }
}

function closeExportModal() {
  const modal = document.getElementById('exportModal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
}

function updateExportFormatSelection(radioInput) {
  const allOptions = document.querySelectorAll('.export-format-option');
  allOptions.forEach(opt => {
    opt.classList.remove('border-[#0030c2]', 'bg-[#eff6ff]');
    opt.classList.add('border-[#e5e7eb]');
    const span = opt.querySelector('span.font-bold');
    if (span) {
      span.classList.remove('text-[#0030c2]');
      span.classList.add('text-[#374151]');
    }
  });

  const parentLabel = radioInput.closest('.export-format-option');
  if (parentLabel) {
    parentLabel.classList.remove('border-[#e5e7eb]');
    parentLabel.classList.add('border-[#0030c2]', 'bg-[#eff6ff]');
    const span = parentLabel.querySelector('span.font-bold');
    if (span) {
      span.classList.remove('text-[#374151]');
      span.classList.add('text-[#0030c2]');
    }
  }
}

function handleExport(event) {
  if (event) event.preventDefault();
  const format = document.querySelector('input[name="exportFormat"]:checked')?.value || 'CSV';
  const specificDate = document.getElementById('exportDate')?.value || '2026-07-25';

  closeExportModal();
  showToast(`Generating ${format} export for Habitual Offenders (${specificDate})... Download will start shortly.`, 'info');

  const fileExt = format.toLowerCase() === 'excel' ? 'xlsx' : 'csv';
  setTimeout(() => {
    showToast(`Habitual_Offenders_${specificDate}.${fileExt} downloaded successfully!`, 'success');
  }, 1200);
}

// =============================================================
// VIEW OFFENDER DETAILS MODAL CONTROLS
// =============================================================
function openViewOffenderModal(data) {
  const modal = document.getElementById('viewOffenderModal');
  if (!modal) return;

  if (document.getElementById('modalStudentId')) document.getElementById('modalStudentId').textContent = data.id || '2026-1003';
  if (document.getElementById('modalStudentName')) document.getElementById('modalStudentName').textContent = data.student || 'Reyes, Anna';
  if (document.getElementById('modalStudentSection')) document.getElementById('modalStudentSection').textContent = data.section || 'Grade 10 - B';
  if (document.getElementById('modalLateCount')) document.getElementById('modalLateCount').textContent = (data.late || '6') + ' Lates';
  if (document.getElementById('modalAbsenceCount')) document.getElementById('modalAbsenceCount').textContent = (data.absences || '7') + ' Absences';
  if (document.getElementById('modalTotalInfractions')) document.getElementById('modalTotalInfractions').textContent = ((parseInt(data.late, 10) || 0) + (parseInt(data.absences, 10) || 0)) + ' Total Infractions';
  if (document.getElementById('modalCounselingStatus')) document.getElementById('modalCounselingStatus').textContent = data.counseling || 'Guidance Counseling Session Scheduled';
  if (document.getElementById('modalParentStatus')) document.getElementById('modalParentStatus').textContent = data.parentStatus || 'Advisory notice SMS sent to Guardian (+63 920 555 1294)';

  const statusBadge = document.getElementById('modalStatusBadge');
  if (statusBadge) {
    statusBadge.textContent = data.status || 'Exceeds Both';
    if (data.status === 'Exceeds Both' || data.status === 'Exceeds 5 Late & 5 Absences') {
      statusBadge.className = 'status-badge-exceeds-both px-3 py-1 rounded-lg font-bold text-xs';
    } else if (data.status === 'Exceeds 5 Absences') {
      statusBadge.className = 'status-badge-exceeds-absences px-3 py-1 rounded-lg font-bold text-xs';
    } else if (data.status === 'Exceeds 5 Late') {
      statusBadge.className = 'status-badge-exceeds-late px-3 py-1 rounded-lg font-bold text-xs';
    } else {
      statusBadge.className = 'status-badge-at-risk px-3 py-1 rounded-lg font-bold text-xs';
    }
  }

  modal.classList.remove('hidden');
  modal.classList.add('flex');
}

function closeViewOffenderModal() {
  const modal = document.getElementById('viewOffenderModal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
}

// =============================================================
// MODAL GENERAL LISTENERS (Escape key & backdrop click)
// =============================================================
function initModalListeners() {
  // ESC key closes any open modal
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      closeFilterModal();
      closeExportModal();
      closeViewOffenderModal();
    }
  });

  // Backdrop click closes modal
  const modals = ['filterModal', 'exportModal', 'viewOffenderModal'];
  modals.forEach(modalId => {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.addEventListener('click', function(e) {
        if (e.target === modal) {
          modal.classList.add('hidden');
          modal.classList.remove('flex');
        }
      });
    }
  });
}
