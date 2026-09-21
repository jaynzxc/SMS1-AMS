// assets/js/admin/tardy-and-absence.js
// Consolidated Tardy & Absence Logs Controller

document.addEventListener('DOMContentLoaded', function () {
  console.log('Admin Tardy & Absence module initialized');
  initLogsTable();
  setupSearchAndFilters();
});

let currentTab = 'all';
let currentSection = '';
let currentSearch = '';

const mockLogs = [
  { id: '2023-00101', name: 'Althea Ramos', section: 'BSIT 3A', type: 'tardy', date: '2026-09-21', time: '08:24 AM', remarks: 'Late by 24 mins (Traffic)', avatar: 'AR' },
  { id: '2023-00102', name: 'Joshua Bautista', section: 'BSIT 3A', type: 'absence', date: '2026-09-21', time: 'Unexcused', remarks: 'No excuse slip filed', avatar: 'JB' },
  { id: '2023-00105', name: 'Chloe Mendoza', section: 'BSIT 3B', type: 'tardy', date: '2026-09-21', time: '08:15 AM', remarks: 'Late by 15 mins (Rain)', avatar: 'CM' },
  { id: '2023-00109', name: 'Mark Anthony Santos', section: 'BSIT 3A', type: 'absence', date: '2026-09-20', time: 'Excused', remarks: 'Medical certificate approved', avatar: 'MS' },
  { id: '2023-00112', name: 'Ezekiel Flores', section: 'BSCS 2A', type: 'tardy', date: '2026-09-20', time: '08:45 AM', remarks: 'Late by 45 mins (Commute)', avatar: 'EF' },
  { id: '2023-00118', name: 'Patricia Cruz', section: 'BSBA 4A', type: 'absence', date: '2026-09-20', time: 'Unexcused', remarks: 'No call/notice', avatar: 'PC' },
  { id: '2023-00122', name: 'Daniel Padilla', section: 'BSIT 3B', type: 'tardy', date: '2026-09-19', time: '08:10 AM', remarks: 'Late by 10 mins', avatar: 'DP' },
  { id: '2023-00125', name: 'Kathryn Bernardo', section: 'BSCS 2A', type: 'absence', date: '2026-09-19', time: 'Excused', remarks: 'Family emergency excuse slip', avatar: 'KB' },
  { id: '2023-00130', name: 'James Reid', section: 'BSIT 3A', type: 'tardy', date: '2026-09-18', time: '08:35 AM', remarks: 'Late by 35 mins', avatar: 'JR' },
  { id: '2023-00134', name: 'Nadine Lustre', section: 'BSBA 4A', type: 'absence', date: '2026-09-18', time: 'Unexcused', remarks: 'Flagged for counselor review', avatar: 'NL' }
];

function initLogsTable() {
  renderLogs();
  updateCounts();
}

function updateCounts() {
  const tardyCount = mockLogs.filter(l => l.type === 'tardy').length;
  const absenceCount = mockLogs.filter(l => l.type === 'absence').length;
  const allCount = mockLogs.length;

  const countAllEl = document.getElementById('countAll');
  const countTardyEl = document.getElementById('countTardy');
  const countAbsenceEl = document.getElementById('countAbsence');

  if (countAllEl) countAllEl.textContent = allCount;
  if (countTardyEl) countTardyEl.textContent = tardyCount;
  if (countAbsenceEl) countAbsenceEl.textContent = absenceCount;
}

function switchTab(tab) {
  currentTab = tab;

  const tabs = {
    all: document.getElementById('tabAll'),
    tardy: document.getElementById('tabTardy'),
    absence: document.getElementById('tabAbsence')
  };

  Object.keys(tabs).forEach(key => {
    const el = tabs[key];
    if (!el) return;
    if (key === tab) {
      el.className = 'px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors bg-white text-[#0030c2] shadow-xs cursor-pointer';
    } else {
      el.className = 'px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors text-[#6b7280] hover:text-[#111827] cursor-pointer';
    }
  });

  renderLogs();
}

function setupSearchAndFilters() {
  const searchInput = document.getElementById('logSearch');
  if (searchInput) {
    searchInput.addEventListener('input', function (e) {
      currentSearch = e.target.value.toLowerCase().trim();
      renderLogs();
    });
  }
}

function applyFilters() {
  const sectionSelect = document.getElementById('sectionFilter');
  if (sectionSelect) {
    currentSection = sectionSelect.value;
  }
  renderLogs();
}

function renderLogs() {
  const tbody = document.getElementById('logsTableBody');
  if (!tbody) return;

  let filtered = mockLogs.filter(item => {
    if (currentTab !== 'all' && item.type !== currentTab) return false;
    if (currentSection && item.section !== currentSection) return false;
    if (currentSearch) {
      const matchName = item.name.toLowerCase().includes(currentSearch);
      const matchId = item.id.toLowerCase().includes(currentSearch);
      const matchSection = item.section.toLowerCase().includes(currentSearch);
      if (!matchName && !matchId && !matchSection) return false;
    }
    return true;
  });

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="8" class="py-8 text-center text-[#6b7280]">
          <p class="font-semibold text-sm">No records found</p>
          <p class="text-xs text-[#9ca3af] mt-1">Try adjusting your filters or search query.</p>
        </td>
      </tr>
    `;
    const pageInfo = document.getElementById('pageInfo');
    if (pageInfo) pageInfo.textContent = 'Showing 0 entries';
    return;
  }

  tbody.innerHTML = filtered.map(item => {
    const isTardy = item.type === 'tardy';
    const typeBadge = isTardy
      ? '<span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#fff7ed] text-[#c2410c] border border-[#ffedd5]">Tardy</span>'
      : '<span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#fef2f2] text-[#dc2626] border border-[#fee2e2]">Absent</span>';

    const statusBadge = item.time === 'Excused'
      ? '<span class="text-[#16a34a] font-semibold">Excused</span>'
      : (item.time === 'Unexcused' ? '<span class="text-[#dc2626] font-semibold">Unexcused</span>' : `<span class="text-[#111827] font-medium">${item.time}</span>`);

    return `
      <tr class="hover:bg-gray-50 transition-colors border-b border-[#f3f4f6]">
        <td class="py-3 px-4 font-mono font-semibold text-[#0030c2]">${item.id}</td>
        <td class="py-3 px-4">
          <div class="flex items-center gap-2.5">
            <div class="w-7 h-7 rounded-full bg-[#0030c2]/10 text-[#0030c2] font-bold text-[10px] flex items-center justify-center shrink-0">
              ${item.avatar}
            </div>
            <div>
              <p class="font-bold text-[#111827] leading-tight">${item.name}</p>
            </div>
          </div>
        </td>
        <td class="py-3 px-4 text-[#374151] font-medium">${item.section}</td>
        <td class="py-3 px-4">${typeBadge}</td>
        <td class="py-3 px-4 text-[#6b7280] whitespace-nowrap">${item.date}</td>
        <td class="py-3 px-4 whitespace-nowrap">${statusBadge}</td>
        <td class="py-3 px-4 text-[#6b7280] max-w-xs truncate">${item.remarks}</td>
        <td class="py-3 px-4 text-center">
          <div class="flex items-center justify-center gap-1.5">
            <button onclick="viewStudentLog('${item.id}', '${item.name}')" title="View History" class="p-1 text-[#6b7280] hover:text-[#0030c2] hover:bg-[#eff6ff] rounded transition-colors">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');

  const pageInfo = document.getElementById('pageInfo');
  if (pageInfo) pageInfo.textContent = `Showing 1 to ${filtered.length} of ${filtered.length} entries`;
}

function viewStudentLog(id, name) {
  alert(`Student Record: ${name} (${id})\n\nDirecting to habitual offender and history inspection.`);
}

// Export modal logic
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

function handleExport() {
  const format = document.querySelector('input[name="exportFormat"]:checked')?.value || 'CSV';
  closeExportModal();

  if (format === 'CSV') {
    const headers = ['Student ID', 'Student Name', 'Section', 'Type', 'Date', 'Time/Status', 'Remarks'];
    const rows = mockLogs.map(l => [
      `"${l.id}"`,
      `"${l.name}"`,
      `"${l.section}"`,
      `"${l.type}"`,
      `"${l.date}"`,
      `"${l.time}"`,
      `"${l.remarks}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csvContent));
    link.setAttribute('download', `Tardy_and_Absence_Logs_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } else {
    alert(`${format} export generated successfully!`);
  }
}

window.switchTab = switchTab;
window.applyFilters = applyFilters;
window.openExportModal = openExportModal;
window.closeExportModal = closeExportModal;
window.handleExport = handleExport;
window.viewStudentLog = viewStudentLog;
