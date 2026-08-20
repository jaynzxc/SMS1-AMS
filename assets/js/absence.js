// assets/js/absence.js
// Absence List Management & Interactive Filtering Module

document.addEventListener('DOMContentLoaded', function() {
  console.log('Absence List module initialized');

  // Initialize Search input
  initAbsenceSearch();

  // Initialize Modal Listeners (ESC and backdrop click)
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
// SEARCH & MULTI-CRITERIA FILTERING (Date, Section, Total Absences)
// =============================================================
function initAbsenceSearch() {
  const searchInput = document.getElementById('absenceSearch');
  if (!searchInput) return;

  searchInput.addEventListener('input', function() {
    executeAbsenceFiltering();
  });
}

function executeAbsenceFiltering() {
  const searchInput = document.getElementById('absenceSearch');
  const sectionFilter = document.getElementById('filterSectionSelect');
  const totalAbsencesFilter = document.getElementById('filterTotalAbsencesSelect');
  const dateFilter = document.getElementById('filterDateInput');
  const table = document.getElementById('absenceTable');

  if (!table) return 0;

  const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';
  const selectedSection = sectionFilter ? sectionFilter.value.toLowerCase().trim() : '';
  const selectedMinAbsences = totalAbsencesFilter ? parseInt(totalAbsencesFilter.value, 10) : 0;
  const selectedDate = dateFilter ? dateFilter.value.trim() : '';

  const rows = table.querySelectorAll('tbody tr');
  let visibleCount = 0;

  rows.forEach(row => {
    const rowText = row.innerText.toLowerCase();
    const studentIdAttr = row.getAttribute('data-student-id') || '';
    const sectionAttr = row.getAttribute('data-section') || '';
    const absencesAttr = row.getAttribute('data-absences') || '0';
    const totalAbsences = parseInt(absencesAttr, 10) || 0;
    const dateAttr = row.getAttribute('data-date') || '';

    const matchesSearch = !searchTerm || rowText.includes(searchTerm) || studentIdAttr.toLowerCase().includes(searchTerm);
    const matchesSection = !selectedSection || selectedSection === 'all sections' || sectionAttr.toLowerCase().includes(selectedSection) || rowText.includes(selectedSection);
    const matchesTotalAbsences = isNaN(selectedMinAbsences) || selectedMinAbsences === 0 || totalAbsences >= selectedMinAbsences;
    const matchesDate = !selectedDate || dateAttr.includes(selectedDate) || rowText.includes(selectedDate);

    if (matchesSearch && matchesSection && matchesTotalAbsences && matchesDate) {
      row.style.display = '';
      visibleCount++;
    } else {
      row.style.display = 'none';
    }
  });

  // Update visible count in table header badge
  const countBadge = document.getElementById('absenceRecordCount');
  if (countBadge) {
    const hasFilter = searchTerm || selectedSection || (selectedMinAbsences > 0) || selectedDate;
    countBadge.textContent = hasFilter ? `${visibleCount} Found` : `245 Records`;
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

function applyAbsenceFilters() {
  const matchCount = executeAbsenceFiltering();
  closeFilterModal();
  showToast(`Filters applied. ${matchCount} record(s) matching.`, 'info');
}

function resetAbsenceFilters() {
  if (document.getElementById('filterDateInput')) document.getElementById('filterDateInput').value = '';
  if (document.getElementById('filterSectionSelect')) document.getElementById('filterSectionSelect').value = '';
  if (document.getElementById('filterTotalAbsencesSelect')) document.getElementById('filterTotalAbsencesSelect').value = '';
  if (document.getElementById('absenceSearch')) document.getElementById('absenceSearch').value = '';

  closeFilterModal();
  executeAbsenceFiltering();
  showToast('Filters reset to default.', 'info');
}

// =============================================================
// EXPORT MODAL CONTROLS
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
  showToast(`Generating ${format} export for (${specificDate})... Download will start shortly.`, 'info');

  const fileExt = format.toLowerCase() === 'excel' ? 'xlsx' : 'csv';
  setTimeout(() => {
    showToast(`Absence_List_${specificDate}.${fileExt} downloaded successfully!`, 'success');
  }, 1200);
}

// =============================================================
// VIEW ABSENCE DETAILS MODAL CONTROLS
// =============================================================
function openViewAbsenceModal(data) {
  const modal = document.getElementById('viewAbsenceModal');
  if (!modal) return;

  if (document.getElementById('modalStudentId')) document.getElementById('modalStudentId').textContent = data.id || '2026-1001';
  if (document.getElementById('modalStudentName')) document.getElementById('modalStudentName').textContent = data.student || 'Reyes, Anna';
  if (document.getElementById('modalStudentSection')) document.getElementById('modalStudentSection').textContent = data.section || 'Grade 10 - B';
  if (document.getElementById('modalTotalAbsences')) document.getElementById('modalTotalAbsences').textContent = (data.total || '7') + ' Days';
  if (document.getElementById('modalExcusedCount')) document.getElementById('modalExcusedCount').textContent = (data.excused || '2') + ' Excused';
  if (document.getElementById('modalUnexcusedCount')) document.getElementById('modalUnexcusedCount').textContent = (data.unexcused || '5') + ' Unexcused';
  if (document.getElementById('modalLastAbsentDate')) document.getElementById('modalLastAbsentDate').textContent = data.lastAbsent || 'July 25, 2026';
  if (document.getElementById('modalExcuseRef')) document.getElementById('modalExcuseRef').textContent = data.excuseRef || 'EX-2026-089 (Medical Certificate)';
  if (document.getElementById('modalParentStatus')) document.getElementById('modalParentStatus').textContent = data.parentStatus || 'Parent Notification SMS Sent on July 25, 2026';

  const countBadge = document.getElementById('modalAbsenceCountBadge');
  if (countBadge) {
    const total = parseInt(data.total, 10) || 7;
    countBadge.textContent = total;
    if (total >= 5) {
      countBadge.className = 'w-10 h-10 rounded-xl bg-red-100 text-red-500 font-extrabold text-lg flex items-center justify-center';
    } else if (total >= 3) {
      countBadge.className = 'w-10 h-10 rounded-xl bg-amber-100 text-amber-500 font-extrabold text-lg flex items-center justify-center';
    } else {
      countBadge.className = 'w-10 h-10 rounded-xl bg-emerald-100 text-emerald-500 font-extrabold text-lg flex items-center justify-center';
    }
  }

  modal.classList.remove('hidden');
  modal.classList.add('flex');
}

function closeViewAbsenceModal() {
  const modal = document.getElementById('viewAbsenceModal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
}

// =============================================================
// EDIT EXCUSE STATUS MODAL CONTROLS
// =============================================================
let editingStudentId = '';
function openEditAbsenceModal(data) {
  editingStudentId = data.id || '';
  const modal = document.getElementById('editAbsenceModal');
  if (!modal) return;

  if (document.getElementById('editStudentId')) document.getElementById('editStudentId').textContent = data.id || '2026-1001';
  if (document.getElementById('editStudentName')) document.getElementById('editStudentName').textContent = data.student || 'Reyes, Anna';
  if (document.getElementById('editStudentSection')) document.getElementById('editStudentSection').textContent = data.section || 'Grade 10 - B';
  if (document.getElementById('editExcuseStatusSelect')) document.getElementById('editExcuseStatusSelect').value = data.status || 'Excused';
  if (document.getElementById('editExcuseRefInput')) document.getElementById('editExcuseRefInput').value = data.excuseRef || 'EX-2026-089';
  if (document.getElementById('editRemarksInput')) document.getElementById('editRemarksInput').value = data.remarks || 'Medical consultation submitted';

  modal.classList.remove('hidden');
  modal.classList.add('flex');
}

function closeEditAbsenceModal() {
  const modal = document.getElementById('editAbsenceModal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
}

function saveEditAbsence(event) {
  if (event) event.preventDefault();
  closeEditAbsenceModal();
  showToast('Absence and excuse status updated successfully!', 'success');
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
      closeViewAbsenceModal();
      closeEditAbsenceModal();
    }
  });

  // Backdrop click closes modal
  const modals = ['filterModal', 'exportModal', 'viewAbsenceModal', 'editAbsenceModal'];
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
