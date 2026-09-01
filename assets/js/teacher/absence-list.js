/**
 * Teacher Absence List Controller
 * Handles absence tracking, excused vs unexcused segregation, excuse slip audit previews, filters, and exports.
 */

const ABSENCE_STUDENTS_DATA = [
  {
    id: '2026-1003',
    name: 'Reyes, Anna',
    section: 'BSIT 3-A',
    subject: 'Web Development',
    totalAbsences: 4,
    excused: 3,
    unexcused: 1,
    guardian: 'Mrs. Elena Reyes (0917-123-4567)',
    slip: {
      dates: 'May 20, 2025 – May 21, 2025 (2 days)',
      reason: 'Medical / High Fever and Flu',
      fileName: 'Medical_Certificate_Reyes.pdf',
      status: 'Approved'
    }
  },
  {
    id: '2026-1005',
    name: 'Rivera, Luis',
    section: 'BSIT 3-A',
    subject: 'Web Development',
    totalAbsences: 2,
    excused: 2,
    unexcused: 0,
    guardian: 'Mr. Gabriel Rivera (0918-987-6543)',
    slip: {
      dates: 'May 14, 2025 (1 day)',
      reason: 'Official Family Emergency',
      fileName: 'Parent_Excuse_Letter_Rivera.pdf',
      status: 'Approved'
    }
  },
  {
    id: '2026-1010',
    name: 'Ramos, Joshua',
    section: 'BSIT 3-A',
    subject: 'Web Development',
    totalAbsences: 3,
    excused: 0,
    unexcused: 3,
    guardian: 'Mrs. Maria Ramos (0920-555-1212)',
    slip: null
  },
  {
    id: '2026-1013',
    name: 'Dela Cruz, Pedro',
    section: 'BSIT 3-A',
    subject: 'Web Development',
    totalAbsences: 5,
    excused: 1,
    unexcused: 4,
    guardian: 'Mr. Roberto Dela Cruz (0919-444-3322)',
    slip: {
      dates: 'May 07, 2025 (1 day)',
      reason: 'Barangay Health Consultation',
      fileName: 'Health_Clearance_DelaCruz.pdf',
      status: 'Approved'
    }
  },
  {
    id: '2026-1015',
    name: 'Salazar, Miguel',
    section: 'BSIT 3-A',
    subject: 'Web Development',
    totalAbsences: 1,
    excused: 0,
    unexcused: 1,
    guardian: 'Mrs. Teresa Salazar (0915-333-8899)',
    slip: null
  }
];

let currentAbsenceList = JSON.parse(JSON.stringify(ABSENCE_STUDENTS_DATA));
let searchQuery = '';
let filterType = '';
let filterSeverity = '';

document.addEventListener('DOMContentLoaded', () => {
  initSearch();
  initClassSelect();
  renderAbsenceTable();
  updateKpiStats();
});

/**
 * Search input listener
 */
function initSearch() {
  const searchInput = document.getElementById('absenceSearchInput');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.trim().toLowerCase();
      renderAbsenceTable();
    });
  }
}

/**
 * Class selector listener
 */
function initClassSelect() {
  const classSelect = document.getElementById('absenceClassSelect');
  if (classSelect) {
    classSelect.addEventListener('change', () => {
      showToast(`Switched view to ${classSelect.options[classSelect.selectedIndex].text}`, 'info');
      renderAbsenceTable();
      updateKpiStats();
    });
  }
}

/**
 * Render Absence Table (matching admin/tardy-and-absence/absence-list.html)
 */
function renderAbsenceTable() {
  const tbody = document.getElementById('absenceTableBody');
  const countBadge = document.getElementById('absenceRecordCountBadge');
  const showingCount = document.getElementById('pageShowingCount');
  const totalCount = document.getElementById('pageTotalCount');
  if (!tbody) return;

  const filtered = currentAbsenceList.filter(student => {
    // Type filter
    let matchesType = true;
    if (filterType === 'unexcused') matchesType = student.unexcused > 0;
    else if (filterType === 'excused') matchesType = student.excused > 0;

    // Severity filter
    let matchesSeverity = true;
    if (filterSeverity === 'chronic') matchesSeverity = student.totalAbsences >= 3;
    else if (filterSeverity === 'low') matchesSeverity = student.totalAbsences < 3;

    // Search query
    const matchesSearch = !searchQuery ||
      student.name.toLowerCase().includes(searchQuery) ||
      student.id.toLowerCase().includes(searchQuery) ||
      student.guardian.toLowerCase().includes(searchQuery) ||
      student.section.toLowerCase().includes(searchQuery);

    return matchesType && matchesSeverity && matchesSearch;
  });

  if (countBadge) countBadge.textContent = `${filtered.length} Records`;
  if (showingCount) showingCount.textContent = filtered.length;
  if (totalCount) totalCount.textContent = currentAbsenceList.length;

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" class="py-10 text-center text-xs text-[#6b7280]">
          <div class="flex flex-col items-center justify-center gap-2">
            <svg class="w-8 h-8 text-[#9ca3af]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
            <p class="font-semibold text-[#374151]">No absence records found</p>
            <p class="text-[11px] text-[#9ca3af]">No students match the current filter or search criteria.</p>
          </div>
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = filtered.map(student => {
    return `
      <tr class="hover:bg-[#f9fafb] transition-colors">
        <td class="py-3.5 px-4 font-mono font-medium text-[#6b7280] text-xs">${student.id}</td>
        <td class="py-3.5 px-4">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-full bg-[#e5e7eb] flex items-center justify-center shrink-0">
              <svg class="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12a4.5 4.5 0 100-9 4.5 4.5 0 000 9zM4 20.5c0-3.59 3.58-6.5 8-6.5s8 2.91 8 6.5V21H4v-.5z" />
              </svg>
            </div>
            <div>
              <p class="font-bold text-[#111827]">${student.name}</p>
              <p class="text-[11px] text-[#6b7280]">${student.guardian}</p>
            </div>
          </div>
        </td>
        <td class="py-3.5 px-4 font-medium text-[#4b5563] text-xs">${student.section}</td>
        <td class="py-3.5 px-4 text-center">
          <span class="inline-flex items-center justify-center w-8 h-8 rounded-lg font-bold text-xs bg-red-100 text-red-500">
            ${student.totalAbsences}
          </span>
        </td>
        <td class="py-3.5 px-4 text-center">
          <span class="inline-flex items-center justify-center w-8 h-8 rounded-lg font-bold text-xs bg-blue-100 text-blue-500">
            ${student.excused}
          </span>
        </td>
        <td class="py-3.5 px-4 text-center">
          <span class="inline-flex items-center justify-center w-8 h-8 rounded-lg font-bold text-xs bg-rose-100 text-rose-600">
            ${student.unexcused}
          </span>
        </td>
        <td class="py-3.5 px-4 text-center">
          <div class="flex items-center justify-center gap-1.5">
            <!-- View Excuse Slip Button (if available) -->
            ${student.slip ? `
              <button onclick="openExcuseSlipModal('${student.id}')"
                class="px-2.5 py-1 text-xs font-semibold text-[#0030c2] bg-[#e7edff] hover:bg-[#d8e3ff] rounded-lg transition-colors inline-flex items-center gap-1"
                title="View Submitted Excuse Slip">
                <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
                <span>Slip</span>
              </button>
            ` : `
              <span class="px-2 py-1 text-[11px] font-medium text-gray-400 bg-gray-100 rounded-lg">
                No Slip
              </span>
            `}

            <!-- View History Link -->
            <a href="student-attendance-history.html?id=${student.id}"
              class="p-1 text-[#2563eb] hover:bg-blue-50 rounded-lg transition-colors inline-flex items-center justify-center"
              title="View Attendance History">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638-0-8.573-3.007-9.963-7.178z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </a>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

/**
 * Update KPI Statistics Cards
 */
function updateKpiStats() {
  let totalUnexcused = 0;
  let totalExcused = 0;
  currentAbsenceList.forEach(s => {
    totalUnexcused += s.unexcused;
    totalExcused += s.excused;
  });

  updateText('kpiTotalAbsences', 2); // Today's absences
  updateText('kpiUnexcused', totalUnexcused);
  updateText('kpiExcused', totalExcused);
  updateText('kpiUniqueAbsentStudents', currentAbsenceList.length);
}

/**
 * View Excuse Slip Modal
 */
window.openExcuseSlipModal = function(studentId) {
  const student = currentAbsenceList.find(s => s.id === studentId);
  if (!student || !student.slip) return;

  updateText('slipModalStudentName', student.name);
  updateText('slipModalStudentId', `${student.id} • ${student.section}`);
  updateText('slipModalDates', student.slip.dates);
  updateText('slipModalReason', student.slip.reason);
  updateText('slipModalGuardian', student.guardian);
  updateText('slipModalFileName', student.slip.fileName);

  const modal = document.getElementById('excuseSlipModal');
  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }
};

window.closeExcuseSlipModal = function() {
  const modal = document.getElementById('excuseSlipModal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
};

/**
 * Filter Modal Controls
 */
window.openFilterModal = function() {
  const modal = document.getElementById('filterModal');
  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }
};

window.closeFilterModal = function() {
  const modal = document.getElementById('filterModal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
};

window.applyModalFilters = function() {
  filterType = document.getElementById('filterTypeSelect')?.value || '';
  filterSeverity = document.getElementById('filterSeveritySelect')?.value || '';
  closeFilterModal();
  renderAbsenceTable();
  showToast('Absence filters applied successfully', 'success');
};

window.resetModalFilters = function() {
  const typeSelect = document.getElementById('filterTypeSelect');
  const sevSelect = document.getElementById('filterSeveritySelect');
  if (typeSelect) typeSelect.value = '';
  if (sevSelect) sevSelect.value = '';
  filterType = '';
  filterSeverity = '';
  closeFilterModal();
  renderAbsenceTable();
  showToast('Filters reset to default', 'info');
};

/**
 * Export Modal Controls
 */
window.openExportModal = function() {
  const modal = document.getElementById('exportModal');
  if (modal) {
    // Reset selection so nothing is picked by default
    const radios = modal.querySelectorAll('input[name="exportFormat"]');
    radios.forEach(r => r.checked = false);

    const allOptions = modal.querySelectorAll('.export-format-option');
    allOptions.forEach(opt => {
      opt.classList.remove('border-[#0030c2]', 'bg-[#eff6ff]');
      opt.classList.add('border-[#e5e7eb]', 'bg-white');
    });

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

window.updateExportFormatSelection = function(radioInput) {
  const modal = document.getElementById('exportModal');
  if (!modal) return;

  const allOptions = modal.querySelectorAll('.export-format-option');
  allOptions.forEach(opt => {
    opt.classList.remove('border-[#0030c2]', 'bg-[#eff6ff]');
    opt.classList.add('border-[#e5e7eb]', 'bg-white');
  });

  const parentLabel = radioInput.closest('.export-format-option');
  if (parentLabel && radioInput.checked) {
    parentLabel.classList.remove('border-[#e5e7eb]', 'bg-white');
    parentLabel.classList.add('border-[#0030c2]', 'bg-[#eff6ff]');
  }
};

window.handleExport = function() {
  const selectedRadio = document.querySelector('input[name="exportFormat"]:checked');
  if (!selectedRadio) {
    showToast('Please select an export format (CSV or Excel) first.', 'info');
    return;
  }
  const format = selectedRadio.value;
  closeExportModal();
  showToast(`Class absence list exported as ${format} successfully!`, 'success');
};

/**
 * Utility functions
 */
function updateText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

function showToast(message, type = 'info') {
  let toastContainer = document.getElementById('toastContainer');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toastContainer';
    toastContainer.className = 'fixed top-5 right-5 z-50 flex flex-col gap-2 pointer-events-none';
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  toast.className = 'pointer-events-auto bg-white border border-[#e5e7eb] shadow-xl rounded-xl p-3.5 flex items-center gap-3 min-w-[280px] max-w-sm transition-all duration-300 transform translate-x-0';

  let iconSvg = `
    <div class="w-8 h-8 rounded-full bg-blue-50 text-[#0030c2] flex items-center justify-center shrink-0">
      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
      </svg>
    </div>
  `;
  if (type === 'success') {
    iconSvg = `
      <div class="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
      </div>
    `;
  }

  toast.innerHTML = `
    ${iconSvg}
    <div class="flex-1">
      <p class="text-xs font-bold text-[#111827]">${type === 'success' ? 'Success' : 'Notice'}</p>
      <p class="text-[11px] text-[#6b7280] leading-tight">${message}</p>
    </div>
  `;

  toastContainer.appendChild(toast);
  setTimeout(() => {
    toast.classList.add('opacity-0', 'translate-x-full');
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}
