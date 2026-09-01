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
      <div class="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
      </div>
    `;
  } else if (toastType === 'info') {
    iconSvg = `
      <div class="w-8 h-8 rounded-full bg-blue-50 text-[#0030c2] flex items-center justify-center shrink-0">
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
        </svg>
      </div>
    `;
  } else {
    iconSvg = `
      <div class="w-8 h-8 rounded-full bg-red-50 text-red-600 flex items-center justify-center shrink-0">
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
        </svg>
      </div>
    `;
  }

  toast.innerHTML = `
    ${iconSvg}
    <div class="flex-1">
      <p class="text-xs font-bold text-[#111827]">${title}</p>
      <p class="text-[11px] text-[#6b7280] mt-0.5 leading-tight">${message}</p>
    </div>
    <button onclick="this.parentElement.remove()" class="text-gray-400 hover:text-gray-600 p-1">
      <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
    </button>
  `;

  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('opacity-0', 'translate-x-full');
    setTimeout(() => toast.remove(), 300);
  }, 4000);
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
  showToast('Exporting Records...', `Generating ${format} report for ${specificDate}`, 'info');

  setTimeout(() => {
    if (format === 'CSV') {
      const table = document.getElementById('absenceTable');
      if (table) {
        const visibleRows = Array.from(table.querySelectorAll('tbody tr')).filter(row => row.style.display !== 'none');
        const csvRows = [
          ["Student ID", "Student Name", "Section", "Total Absences", "Excused", "Unexcused"]
        ];

        visibleRows.forEach(row => {
          const id = row.getAttribute('data-student-id') || '';
          const name = row.querySelector('p.font-bold')?.textContent.trim() || '';
          const section = row.getAttribute('data-section') || '';
          
          const cells = row.querySelectorAll('td');
          if (cells.length > 0) {
            const total = cells[3]?.textContent.trim() || '0';
            const excused = cells[4]?.textContent.trim() || '0';
            const unexcused = cells[5]?.textContent.trim() || '0';
            
            csvRows.push([
              `"${id}"`,
              `"${name}"`,
              `"${section}"`,
              `"${total}"`,
              `"${excused}"`,
              `"${unexcused}"`
            ]);
          }
        });

        const csvContent = "data:text/csv;charset=utf-8," + csvRows.map(e => e.join(",")).join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `Absence_List_${specificDate}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
    showToast('Download Ready', `Absence list report exported successfully (${format})`, 'success');
  }, 800);
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
