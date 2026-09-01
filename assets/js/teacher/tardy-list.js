/**
 * Teacher Tardy List Controller
 * Handles tardiness tracking, frequency categorization, history inspection modals, filters, and exports.
 */

const TARDY_STUDENTS_DATA = [
  {
    id: '2026-1007',
    name: 'Castro, Daniel',
    section: 'BSIT 3-A',
    subject: 'Web Development',
    totalLate: 4,
    latestDate: 'May 27, 2025 • 07:51 AM',
    avgDuration: '14 mins',
    latestDuration: '16 mins late',
    logs: [
      { date: 'May 27, 2025', timeIn: '07:51:22 AM', delay: '16 mins late', reason: 'Heavy traffic on Commonwealth Ave' },
      { date: 'May 20, 2025', timeIn: '07:46:10 AM', delay: '11 mins late', reason: 'Transit delay' },
      { date: 'May 13, 2025', timeIn: '07:49:05 AM', delay: '14 mins late', reason: 'Rain / Flood' },
      { date: 'May 06, 2025', timeIn: '07:47:30 AM', delay: '12 mins late', reason: 'Transportation issue' }
    ]
  },
  {
    id: '2026-1008',
    name: 'Bautista, Elena',
    section: 'BSIT 3-A',
    subject: 'Web Development',
    totalLate: 3,
    latestDate: 'May 27, 2025 • 07:55 AM',
    avgDuration: '18 mins',
    latestDuration: '20 mins late',
    logs: [
      { date: 'May 27, 2025', timeIn: '07:55:40 AM', delay: '20 mins late', reason: 'Commute delay' },
      { date: 'May 22, 2025', timeIn: '07:52:15 AM', delay: '17 mins late', reason: 'Family assistance' },
      { date: 'May 15, 2025', timeIn: '07:53:00 AM', delay: '18 mins late', reason: 'Transit issue' }
    ]
  },
  {
    id: '2026-1009',
    name: 'Navarro, Mark',
    section: 'BSIT 3-A',
    subject: 'Web Development',
    totalLate: 2,
    latestDate: 'May 27, 2025 • 08:02 AM',
    avgDuration: '22 mins',
    latestDuration: '27 mins late',
    logs: [
      { date: 'May 27, 2025', timeIn: '08:02:15 AM', delay: '27 mins late', reason: 'Jeepney breakdown' },
      { date: 'May 18, 2025', timeIn: '07:51:30 AM', delay: '16 mins late', reason: 'Heavy rain' }
    ]
  },
  {
    id: '2026-1011',
    name: 'Valdez, Christine',
    section: 'BSIT 3-A',
    subject: 'Web Development',
    totalLate: 1,
    latestDate: 'May 20, 2025 • 07:40 AM',
    avgDuration: '8 mins',
    latestDuration: '8 mins late',
    logs: [
      { date: 'May 20, 2025', timeIn: '07:40:12 AM', delay: '8 mins late', reason: 'LRT line delay' }
    ]
  },
  {
    id: '2026-1014',
    name: 'Salazar, Miguel',
    section: 'BSIT 3-A',
    subject: 'Web Development',
    totalLate: 2,
    latestDate: 'May 22, 2025 • 07:44 AM',
    avgDuration: '10 mins',
    latestDuration: '11 mins late',
    logs: [
      { date: 'May 22, 2025', timeIn: '07:44:00 AM', delay: '11 mins late', reason: 'Traffic congestion' },
      { date: 'May 08, 2025', timeIn: '07:41:45 AM', delay: '9 mins late', reason: 'Minor delay' }
    ]
  },
  {
    id: '2026-1016',
    name: 'Mendoza, Princess',
    section: 'BSIT 3-A',
    subject: 'Web Development',
    totalLate: 1,
    latestDate: 'May 15, 2025 • 07:38 AM',
    avgDuration: '6 mins',
    latestDuration: '6 mins late',
    logs: [
      { date: 'May 15, 2025', timeIn: '07:38:20 AM', delay: '6 mins late', reason: 'Rain delay' }
    ]
  }
];

let currentTardyList = JSON.parse(JSON.stringify(TARDY_STUDENTS_DATA));
let searchQuery = '';
let filterFrequency = '';
let filterDuration = '';

document.addEventListener('DOMContentLoaded', () => {
  initSearch();
  initClassSelect();
  renderTardyTable();
  updateKpiStats();
});

/**
 * Initialize search listener
 */
function initSearch() {
  const searchInput = document.getElementById('tardySearchInput');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.trim().toLowerCase();
      renderTardyTable();
    });
  }
}

/**
 * Class selector change listener
 */
function initClassSelect() {
  const classSelect = document.getElementById('tardyClassSelect');
  if (classSelect) {
    classSelect.addEventListener('change', () => {
      showToast(`Switched view to ${classSelect.options[classSelect.selectedIndex].text}`, 'info');
      renderTardyTable();
      updateKpiStats();
    });
  }
}

/**
 * Render Tardy Table (matching admin/tardy-and-absence/tardy-list.html)
 */
function renderTardyTable() {
  const tbody = document.getElementById('tardyTableBody');
  const countBadge = document.getElementById('tardyRecordCountBadge');
  const showingCount = document.getElementById('pageShowingCount');
  const totalCount = document.getElementById('pageTotalCount');
  if (!tbody) return;

  const filtered = currentTardyList.filter(student => {
    // Frequency filter
    let matchesFreq = true;
    if (filterFrequency === 'frequent') matchesFreq = student.totalLate >= 3;
    else if (filterFrequency === 'occasional') matchesFreq = student.totalLate < 3;

    // Duration filter
    let matchesDur = true;
    const durNum = parseInt(student.avgDuration) || 0;
    if (filterDuration === '15plus') matchesDur = durNum > 15;
    else if (filterDuration === 'under15') matchesDur = durNum <= 15;

    // Search query
    const matchesSearch = !searchQuery ||
      student.name.toLowerCase().includes(searchQuery) ||
      student.id.toLowerCase().includes(searchQuery) ||
      student.section.toLowerCase().includes(searchQuery) ||
      student.latestDuration.toLowerCase().includes(searchQuery);

    return matchesFreq && matchesDur && matchesSearch;
  });

  if (countBadge) countBadge.textContent = `${filtered.length} Records`;
  if (showingCount) showingCount.textContent = filtered.length;
  if (totalCount) totalCount.textContent = currentTardyList.length;

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" class="py-10 text-center text-xs text-[#6b7280]">
          <div class="flex flex-col items-center justify-center gap-2">
            <svg class="w-8 h-8 text-[#9ca3af]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p class="font-semibold text-[#374151]">No tardy records found</p>
            <p class="text-[11px] text-[#9ca3af]">No students match the current filter or search criteria.</p>
          </div>
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = filtered.map(student => {
    // Badge styling: >= 3 is Red/Frequent, < 3 is Amber/Occasional
    const isFrequent = student.totalLate >= 3;
    const countBadgeClass = isFrequent
      ? 'inline-flex items-center justify-center px-2.5 py-1 rounded-lg font-bold text-xs bg-red-100 text-red-600'
      : 'inline-flex items-center justify-center px-2.5 py-1 rounded-lg font-bold text-xs bg-amber-100 text-amber-700';

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
            <p class="font-bold text-[#111827]">${student.name}</p>
          </div>
        </td>
        <td class="py-3.5 px-4 font-medium text-[#4b5563] text-xs">${student.section}</td>
        <td class="py-3.5 px-4 text-center">
          <span class="${countBadgeClass}">${student.totalLate}</span>
        </td>
        <td class="py-3.5 px-4 font-medium text-[#374151] text-xs">${student.latestDate}</td>
        <td class="py-3.5 px-4 font-medium text-[#f97316] text-xs">${student.latestDuration}</td>
        <td class="py-3.5 px-4 text-center">
          <div class="flex items-center justify-center gap-1">
            <!-- 1. View Details (Eye Icon) -->
            <button onclick="openTardyHistoryModal('${student.id}')"
              class="p-1.5 text-[#0030c2] hover:bg-[#e7edff] rounded-lg transition-colors cursor-pointer"
              title="View Details">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638-0-8.573-3.007-9.963-7.178z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>

            <!-- 2. Edit Total Late (Pencil Icon) -->
            <button onclick="openEditTardyModal('${student.id}')"
              class="p-1.5 text-[#d97706] hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
              title="Edit Total Late">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
              </svg>
            </button>

            <!-- 3. Notification / Warning (Bell Icon) -->
            <button onclick="sendWarningAlert('${student.id}')"
              class="p-1.5 ${isFrequent ? 'text-red-600 hover:bg-red-50' : 'text-[#6b7280] hover:bg-gray-100'} rounded-lg transition-colors cursor-pointer"
              title="${isFrequent ? 'Send Warning Notification (≥ 3 Lates)' : 'Send Tardiness Reminder'}">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
              </svg>
            </button>
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
  const totalTardy = currentTardyList.length;
  const frequentCount = currentTardyList.filter(s => s.totalLate >= 3).length;

  let totalMinutes = 0;
  currentTardyList.forEach(s => {
    totalMinutes += parseInt(s.avgDuration) || 0;
  });
  const avgMin = totalTardy > 0 ? Math.round(totalMinutes / totalTardy) : 0;

  updateText('kpiTotalTardy', 3); // Today's late scans
  updateText('kpiFrequentTardy', frequentCount);
  updateText('kpiAvgLateMinutes', `${avgMin} mins`);
  updateText('kpiOnTimeCount', 9);
  updateText('kpiOnTimeRate', '75.0% punctuality rate');
}

/**
 * View Student Tardy History Modal
 */
window.openTardyHistoryModal = function(studentId) {
  const student = currentTardyList.find(s => s.id === studentId);
  if (!student) return;

  updateText('historyModalStudentName', student.name);
  updateText('historyModalStudentId', `${student.id} • ${student.section}`);

  const totalBadge = document.getElementById('historyModalTotalBadge');
  if (totalBadge) {
    totalBadge.textContent = `${student.totalLate} Late Occurrence${student.totalLate > 1 ? 's' : ''}`;
    totalBadge.className = student.totalLate >= 3
      ? 'inline-flex items-center justify-center px-2.5 py-1 rounded-lg text-xs font-bold bg-red-100 text-red-600'
      : 'inline-flex items-center justify-center px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-100 text-amber-700';
  }

  const logsList = document.getElementById('tardyHistoryLogsList');
  if (logsList) {
    logsList.innerHTML = student.logs.map(log => `
      <div class="py-2 flex items-center justify-between">
        <div>
          <p class="font-bold text-[#111827]">${log.date} — <span class="font-mono text-[#0030c2] font-semibold">${log.timeIn}</span></p>
          <p class="text-[11px] text-[#6b7280] mt-0.5">Reason: ${log.reason}</p>
        </div>
        <span class="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
          ${log.delay}
        </span>
      </div>
    `).join('');
  }

  const fullProfileLink = document.getElementById('historyViewFullProfileLink');
  if (fullProfileLink) {
    fullProfileLink.href = `student-attendance-history.html?id=${student.id}`;
  }

  const modal = document.getElementById('tardyHistoryModal');
  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }
};

window.closeTardyHistoryModal = function() {
  const modal = document.getElementById('tardyHistoryModal');
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
  filterFrequency = document.getElementById('filterFrequencySelect')?.value || '';
  filterDuration = document.getElementById('filterDurationSelect')?.value || '';
  closeFilterModal();
  renderTardyTable();
  showToast('Tardy filters applied successfully', 'success');
};

window.resetModalFilters = function() {
  const freq = document.getElementById('filterFrequencySelect');
  const dur = document.getElementById('filterDurationSelect');
  if (freq) freq.value = '';
  if (dur) dur.value = '';
  filterFrequency = '';
  filterDuration = '';
  closeFilterModal();
  renderTardyTable();
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
  showToast(`Class tardy list exported as ${format} successfully!`, 'success');
};

/**
 * Edit Tardy Count Modal Controls
 */
window.openEditTardyModal = function(studentId) {
  const student = currentTardyList.find(s => s.id === studentId);
  if (!student) return;

  const idInput = document.getElementById('editStudentId');
  const totalInput = document.getElementById('editTotalLateInput');
  const nameDisplay = document.getElementById('editModalStudentName');
  const idDisplay = document.getElementById('editModalStudentId');

  if (idInput) idInput.value = student.id;
  if (totalInput) totalInput.value = student.totalLate;
  if (nameDisplay) nameDisplay.textContent = student.name;
  if (idDisplay) idDisplay.textContent = `${student.id} • ${student.section}`;

  const modal = document.getElementById('editTardyModal');
  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }
};

window.closeEditTardyModal = function() {
  const modal = document.getElementById('editTardyModal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
};

window.handleEditTardySubmit = function(event) {
  if (event) event.preventDefault();
  const studentId = document.getElementById('editStudentId')?.value;
  const newTotal = parseInt(document.getElementById('editTotalLateInput')?.value);
  const reason = document.getElementById('editReasonSelect')?.value || 'Manual Adjustment';

  if (isNaN(newTotal) || newTotal < 0) {
    showToast('Please enter a valid total late count (0 or higher).', 'info');
    return;
  }

  const student = currentTardyList.find(s => s.id === studentId);
  if (student) {
    const oldTotal = student.totalLate;
    student.totalLate = newTotal;

    closeEditTardyModal();
    renderTardyTable();
    updateKpiStats();
    showToast(`Updated late count for ${student.name} from ${oldTotal} to ${newTotal} (${reason})`, 'success');
  }
};

/**
 * Send warning notice to student account
 */
window.sendWarningAlert = function(studentId) {
  const student = currentTardyList.find(s => s.id === studentId);
  if (!student) return;

  if (student.totalLate >= 3) {
    showToast(`Warning notification sent to ${student.name}'s account: ${student.totalLate} total late occurrences recorded.`, 'success');
  } else {
    showToast(`Tardiness reminder notice sent to ${student.name}'s account (${student.totalLate} late entry recorded).`, 'info');
  }
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
