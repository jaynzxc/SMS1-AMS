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
  showToast('Exporting Records...', `Generating ${format} report for ${specificDate}`, 'info');

  setTimeout(() => {
    if (format === 'CSV') {
      const table = document.getElementById('offenderTable');
      if (table) {
        const visibleRows = Array.from(table.querySelectorAll('tbody tr')).filter(row => row.style.display !== 'none');
        const csvRows = [
          ["Student ID", "Student Name", "Section", "Late Count", "Absence Count", "Status"]
        ];

        visibleRows.forEach(row => {
          const id = row.getAttribute('data-student-id') || '';
          const name = row.getAttribute('data-student-name') || '';
          const section = row.getAttribute('data-section') || '';
          const late = row.getAttribute('data-late') || '0';
          const absent = row.getAttribute('data-absent') || '0';
          
          const cells = row.querySelectorAll('td');
          const status = cells[5]?.textContent.trim() || '';
          
          csvRows.push([
            `"${id}"`,
            `"${name}"`,
            `"${section}"`,
            `"${late}"`,
            `"${absent}"`,
            `"${status}"`
          ]);
        });

        const csvContent = "data:text/csv;charset=utf-8," + csvRows.map(e => e.join(",")).join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `Habitual_Offenders_${specificDate}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
    showToast('Download Ready', `Habitual offenders report exported successfully (${format})`, 'success');
  }, 800);
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
