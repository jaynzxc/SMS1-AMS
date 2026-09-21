// assets/js/teacher/tardy-and-absence.js
// Teacher Tardy & Absence Logs Controller

document.addEventListener('DOMContentLoaded', function () {
  console.log('Teacher Tardy & Absence module initialized');
  initTeacherLogs();
  setupTeacherSearch();
});

let currentTab = 'all';
let currentSubject = '';
let currentSearch = '';

const teacherMockLogs = [
  { id: '2023-00101', name: 'Althea Ramos', subject: 'IT 311 - Web Systems', section: 'BSIT 3A', type: 'tardy', date: '2026-09-21', time: '08:18 AM', remarks: 'Late by 18 mins', avatar: 'AR' },
  { id: '2023-00102', name: 'Joshua Bautista', subject: 'IT 311 - Web Systems', section: 'BSIT 3A', type: 'absence', date: '2026-09-21', time: 'Unexcused', remarks: 'No slip filed', avatar: 'JB' },
  { id: '2023-00105', name: 'Chloe Mendoza', subject: 'IT 312 - Systems Integration', section: 'BSIT 3B', type: 'tardy', date: '2026-09-21', time: '08:12 AM', remarks: 'Late by 12 mins', avatar: 'CM' },
  { id: '2023-00109', name: 'Mark Anthony Santos', subject: 'IT 311 - Web Systems', section: 'BSIT 3A', type: 'absence', date: '2026-09-20', time: 'Excused', remarks: 'Medical slip approved', avatar: 'MS' },
  { id: '2023-00112', name: 'Ezekiel Flores', subject: 'CS 211 - Data Structures', section: 'BSCS 2A', type: 'tardy', date: '2026-09-20', time: '08:40 AM', remarks: 'Late by 40 mins', avatar: 'EF' },
  { id: '2023-00122', name: 'Daniel Padilla', subject: 'IT 312 - Systems Integration', section: 'BSIT 3B', type: 'tardy', date: '2026-09-19', time: '08:08 AM', remarks: 'Late by 8 mins', avatar: 'DP' },
  { id: '2023-00125', name: 'Kathryn Bernardo', subject: 'CS 211 - Data Structures', section: 'BSCS 2A', type: 'absence', date: '2026-09-19', time: 'Excused', remarks: 'Approved family slip', avatar: 'KB' },
  { id: '2023-00130', name: 'James Reid', subject: 'IT 311 - Web Systems', section: 'BSIT 3A', type: 'tardy', date: '2026-09-18', time: '08:25 AM', remarks: 'Late by 25 mins', avatar: 'JR' }
];

function initTeacherLogs() {
  renderTeacherLogs();
  updateTeacherCounts();
}

function updateTeacherCounts() {
  const tardy = teacherMockLogs.filter(l => l.type === 'tardy').length;
  const absence = teacherMockLogs.filter(l => l.type === 'absence').length;
  const all = teacherMockLogs.length;

  const countAll = document.getElementById('countAll');
  const countTardy = document.getElementById('countTardy');
  const countAbsence = document.getElementById('countAbsence');

  if (countAll) countAll.textContent = all;
  if (countTardy) countTardy.textContent = tardy;
  if (countAbsence) countAbsence.textContent = absence;
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

  renderTeacherLogs();
}

function setupTeacherSearch() {
  const searchInput = document.getElementById('teacherLogSearch');
  if (searchInput) {
    searchInput.addEventListener('input', function (e) {
      currentSearch = e.target.value.toLowerCase().trim();
      renderTeacherLogs();
    });
  }
}

function applyFilters() {
  const subjectSelect = document.getElementById('subjectFilter');
  if (subjectSelect) {
    currentSubject = subjectSelect.value;
  }
  renderTeacherLogs();
}

function renderTeacherLogs() {
  const tbody = document.getElementById('teacherLogsTableBody');
  if (!tbody) return;

  let filtered = teacherMockLogs.filter(item => {
    if (currentTab !== 'all' && item.type !== currentTab) return false;
    if (currentSubject && item.subject !== currentSubject) return false;
    if (currentSearch) {
      const matchName = item.name.toLowerCase().includes(currentSearch);
      const matchId = item.id.toLowerCase().includes(currentSearch);
      const matchSubject = item.subject.toLowerCase().includes(currentSearch);
      if (!matchName && !matchId && !matchSubject) return false;
    }
    return true;
  });

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="9" class="py-8 text-center text-[#6b7280]">
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
        <td class="py-3 px-4 text-[#374151] font-medium">${item.subject}</td>
        <td class="py-3 px-4 text-[#6b7280]">${item.section}</td>
        <td class="py-3 px-4">${typeBadge}</td>
        <td class="py-3 px-4 text-[#6b7280] whitespace-nowrap">${item.date}</td>
        <td class="py-3 px-4 whitespace-nowrap">${statusBadge}</td>
        <td class="py-3 px-4 text-[#6b7280] max-w-xs truncate">${item.remarks}</td>
        <td class="py-3 px-4 text-center">
          <a href="student-attendance-history.html" title="View Full History" class="p-1 text-[#6b7280] hover:text-[#0030c2] hover:bg-[#eff6ff] rounded transition-colors inline-block">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </a>
        </td>
      </tr>
    `;
  }).join('');

  const pageInfo = document.getElementById('pageInfo');
  if (pageInfo) pageInfo.textContent = `Showing 1 to ${filtered.length} of ${filtered.length} entries`;
}

function handleExport() {
  const headers = ['Student ID', 'Student Name', 'Subject', 'Section', 'Type', 'Date', 'Time/Status', 'Remarks'];
  const rows = teacherMockLogs.map(l => [
    `"${l.id}"`,
    `"${l.name}"`,
    `"${l.subject}"`,
    `"${l.section}"`,
    `"${l.type}"`,
    `"${l.date}"`,
    `"${l.time}"`,
    `"${l.remarks}"`
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const link = document.createElement('a');
  link.setAttribute('href', encodeURI(csvContent));
  link.setAttribute('download', `Teacher_Tardy_and_Absence_Logs_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

window.switchTab = switchTab;
window.applyFilters = applyFilters;
window.handleExport = handleExport;
