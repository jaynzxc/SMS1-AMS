// assets/js/tardy.js
// Tardy List Management & Interactive Filtering Module

document.addEventListener('DOMContentLoaded', function() {
  console.log('Tardy List module initialized');

  // Initialize Search
  initTardySearch();

  // Backdrop click and ESC key listeners for all modals
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
// SEARCH & MULTI-CRITERIA FILTERING
// =============================================================
function initTardySearch() {
  const searchInput = document.getElementById('tardySearch');
  if (!searchInput) return;

  searchInput.addEventListener('input', function() {
    executeTardyFiltering();
  });
}

function executeTardyFiltering() {
  const searchInput = document.getElementById('tardySearch');
  const sectionFilter = document.getElementById('filterSectionSelect');
  const adviserFilter = document.getElementById('filterAdviserSelect');
  const minTardyFilter = document.getElementById('filterMinTardiesSelect');
  const dateFilter = document.getElementById('filterDateInput');
  const table = document.getElementById('tardyTable');

  if (!table) return 0;

  const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';
  const selectedSection = sectionFilter ? sectionFilter.value.toLowerCase().trim() : '';
  const selectedAdviser = adviserFilter ? adviserFilter.value.toLowerCase().trim() : '';
  const selectedMinTardy = minTardyFilter ? parseInt(minTardyFilter.value, 10) : 0;
  const selectedDate = dateFilter ? dateFilter.value.trim() : '';

  const rows = table.querySelectorAll('tbody tr');
  let visibleCount = 0;

  rows.forEach(row => {
    const rowText = row.innerText.toLowerCase();
    const sectionCell = row.getAttribute('data-section') || (row.querySelector('[data-section]') ? row.querySelector('[data-section]').innerText.toLowerCase() : rowText);
    const adviserCell = row.getAttribute('data-adviser') || (row.querySelector('[data-adviser]') ? row.querySelector('[data-adviser]').innerText.toLowerCase() : rowText);
    const tardyCountAttr = row.getAttribute('data-tardies') || (row.querySelector('[data-tardies]') ? row.querySelector('[data-tardies]').getAttribute('data-tardies') : '0');
    const tardyCount = parseInt(tardyCountAttr, 10) || 0;
    const dateCell = row.getAttribute('data-date') || '';

    const matchesSearch = !searchTerm || rowText.includes(searchTerm);
    const matchesSection = !selectedSection || selectedSection === 'all sections' || sectionCell.toLowerCase().includes(selectedSection) || rowText.includes(selectedSection);
    const matchesAdviser = !selectedAdviser || selectedAdviser === 'all advisers' || adviserCell.toLowerCase().includes(selectedAdviser) || rowText.includes(selectedAdviser);
    const matchesMinTardy = isNaN(selectedMinTardy) || selectedMinTardy === 0 || tardyCount >= selectedMinTardy;
    const matchesDate = !selectedDate || dateCell.includes(selectedDate) || rowText.includes(selectedDate);

    if (matchesSearch && matchesSection && matchesAdviser && matchesMinTardy && matchesDate) {
      row.style.display = '';
      visibleCount++;
    } else {
      row.style.display = 'none';
    }
  });

  // Update visible count in table header badge
  const countBadge = document.getElementById('tardyRecordCount');
  if (countBadge) {
    const hasFilter = searchTerm || selectedSection || selectedAdviser || (selectedMinTardy > 0) || selectedDate;
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

function applyTardyFilters() {
  const matchCount = executeTardyFiltering();
  closeFilterModal();
  showToast(`Filters applied. ${matchCount} record(s) matching.`, 'info');
}

function resetTardyFilters() {
  if (document.getElementById('filterSectionSelect')) document.getElementById('filterSectionSelect').value = '';
  if (document.getElementById('filterAdviserSelect')) document.getElementById('filterAdviserSelect').value = '';
  if (document.getElementById('filterMinTardiesSelect')) document.getElementById('filterMinTardiesSelect').value = '';
  if (document.getElementById('filterDateInput')) document.getElementById('filterDateInput').value = '';
  if (document.getElementById('tardySearch')) document.getElementById('tardySearch').value = '';

  closeFilterModal();
  executeTardyFiltering();
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
    showToast(`Tardy_List_${specificDate}.${fileExt} downloaded successfully!`, 'success');
  }, 1200);
}

// =============================================================
// RESET COUNT (AUTHORIZED) MODAL CONTROLS
// =============================================================
function openResetCountModal() {
  const modal = document.getElementById('resetCountModal');
  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }
}

function closeResetCountModal() {
  const modal = document.getElementById('resetCountModal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
}

function confirmResetAllTardy() {
  closeResetCountModal();
  showToast('All student tardy counters have been reset for the new grading period.', 'success');
}

// Single Student Reset
let targetStudentForReset = '';
function openResetStudentModal(studentName) {
  targetStudentForReset = studentName;
  const modal = document.getElementById('resetStudentModal');
  if (!modal) return;

  const nameEl = document.getElementById('resetTargetStudentName');
  if (nameEl) nameEl.textContent = studentName;

  modal.classList.remove('hidden');
  modal.classList.add('flex');
}

function closeResetStudentModal() {
  const modal = document.getElementById('resetStudentModal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
}

function confirmResetStudentTardy() {
  closeResetStudentModal();
  showToast(`Tardy counter for ${targetStudentForReset || 'student'} has been reset to 0.`, 'success');
}

// =============================================================
// VIEW TARDY DETAILS MODAL CONTROLS
// =============================================================
function openViewTardyModal(data) {
  const modal = document.getElementById('viewTardyModal');
  if (!modal) return;

  if (document.getElementById('modalStudentId')) document.getElementById('modalStudentId').textContent = data.id || '2026-1001';
  if (document.getElementById('modalStudentName')) document.getElementById('modalStudentName').textContent = data.student || 'Santos, Maria';
  if (document.getElementById('modalStudentSection')) document.getElementById('modalStudentSection').textContent = data.section || 'Grade 10 - A';
  if (document.getElementById('modalStudentAdviser')) document.getElementById('modalStudentAdviser').textContent = data.adviser || 'Mr. Juan Dela Cruz';
  if (document.getElementById('modalTotalLates')) document.getElementById('modalTotalLates').textContent = (data.tardies || '5') + ' Late Arrivals';
  if (document.getElementById('modalLastLate')) document.getElementById('modalLastLate').textContent = data.lastLate || 'July 25, 2026 (7:35 AM)';
  if (document.getElementById('modalAverageDelay')) document.getElementById('modalAverageDelay').textContent = data.avgDelay || '14 mins average delay';
  if (document.getElementById('modalParentStatus')) document.getElementById('modalParentStatus').textContent = data.parentStatus || 'Parent Notification SMS Sent on July 25, 2026';

  const countBadge = document.getElementById('modalTardyCountBadge');
  if (countBadge) {
    const count = parseInt(data.tardies, 10) || 5;
    countBadge.textContent = count;
    if (count >= 5) {
      countBadge.className = 'w-10 h-10 rounded-xl bg-red-100 text-red-500 font-extrabold text-lg flex items-center justify-center';
    } else if (count >= 3) {
      countBadge.className = 'w-10 h-10 rounded-xl bg-amber-100 text-amber-500 font-extrabold text-lg flex items-center justify-center';
    } else {
      countBadge.className = 'w-10 h-10 rounded-xl bg-emerald-100 text-emerald-500 font-extrabold text-lg flex items-center justify-center';
    }
  }

  modal.classList.remove('hidden');
  modal.classList.add('flex');
}

function closeViewTardyModal() {
  const modal = document.getElementById('viewTardyModal');
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
      closeResetCountModal();
      closeResetStudentModal();
      closeViewTardyModal();
    }
  });

  // Backdrop click closes modal
  const modals = ['filterModal', 'exportModal', 'resetCountModal', 'resetStudentModal', 'viewTardyModal'];
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
