/**
 * Bestlink College of the Philippines
 * Student Performance Analytics Module (student/performance-analytics.html)
 * Reference: teacher/class-analytics.html & assets/js/teacher/class-analytics.js
 */

document.addEventListener('DOMContentLoaded', () => {
  initDateDisplay();
  initAnalyticsData();
  setupEventListeners();
});

// Student dataset keyed by enrolled subject
const analyticsDataset = {
  ALL: {
    overall: '94.20%',
    overallTrend: '1.80%',
    overallTrendUp: true,
    present: '91.50%',
    presentTrend: '2.30%',
    absent: '3.40%',
    absentTrend: '0.90%',
    late: '5.10%',
    lateTrend: '0.60%',
    excused: '1.70%',
    excusedTrend: '0.50%',
    topSubjects: [
      { rank: 1, name: 'CS201 (Data Structures)', teacher: 'Prof. Santos', rate: '96.50%' },
      { rank: 2, name: 'IT401 (Capstone Project 1)', teacher: 'Dr. Garcia', rate: '95.00%' },
      { rank: 3, name: 'IT301 (Web Systems)', teacher: 'Mrs. Dela Cruz', rate: '93.00%' },
      { rank: 4, name: 'GE101 (Purposive Comm)', teacher: 'Prof. Lim', rate: '92.50%' },
      { rank: 5, name: 'IT302 (Database Admin)', teacher: 'Mr. Ramos', rate: '91.80%' }
    ],
    riskAbsences: [
      { rank: 1, name: 'IT302 (Database Admin)', teacher: 'Mr. Ramos', count: 1 },
      { rank: 2, name: 'GE101 (Purposive Comm)', teacher: 'Prof. Lim', count: 1 },
      { rank: 3, name: 'IT301 (Web Systems)', teacher: 'Mrs. Dela Cruz', count: 0 },
      { rank: 4, name: 'CS201 (Data Structures)', teacher: 'Prof. Santos', count: 0 }
    ],
    riskTardiness: [
      { rank: 1, name: 'IT302 (Database Admin)', teacher: 'Mr. Ramos', count: 1 },
      { rank: 2, name: 'IT301 (Web Systems)', teacher: 'Mrs. Dela Cruz', count: 1 },
      { rank: 3, name: 'CS201 (Data Structures)', teacher: 'Prof. Santos', count: 1 },
      { rank: 4, name: 'IT401 (Capstone 1)', teacher: 'Dr. Garcia', count: 1 }
    ],
    sections: [
      { name: 'CS201 (BSIT 3A)', present: '95.00%', late: '2.50%', absent: '2.50%' },
      { name: 'IT401 (BSIT 3A)', present: '93.50%', late: '3.50%', absent: '3.00%' },
      { name: 'IT301 (BSIT 3A)', present: '90.00%', late: '6.00%', absent: '4.00%' },
      { name: 'GE101 (BSIT 3A)', present: '89.50%', late: '4.50%', absent: '6.00%' },
      { name: 'IT302 (BSIT 3A)', present: '88.50%', late: '7.20%', absent: '4.30%' }
    ]
  }
};

/**
 * Initialize Date Display
 */
function initDateDisplay() {
  const dateLabel = document.getElementById('currentDateLabel');
  if (dateLabel) {
    const today = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' };
    dateLabel.textContent = today.toLocaleDateString('en-US', options);
  }
}

/**
 * Initialize Analytics View
 */
function initAnalyticsData() {
  renderTopSubjectsTable();
  setupChartHoverTooltips();
}

/**
 * Setup Event Listeners
 */
function setupEventListeners() {
  // Backdrop dismiss
  const modal = document.getElementById('exportModal');
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeExportModal();
    });
  }
}

/**
 * Render Punctual Subjects Table
 */
function renderTopSubjectsTable() {
  const tbody = document.getElementById('topStudentsTableBody');
  if (!tbody) return;

  const list = analyticsDataset.ALL.topSubjects;
  tbody.innerHTML = list.map(item => `
    <tr>
      <td class="py-2.5 px-1 font-semibold text-[#6b7280]">${item.rank}</td>
      <td class="py-2.5 px-1 font-bold">${item.name}</td>
      <td class="py-2.5 px-1 text-[#4b5563]">${item.teacher}</td>
      <td class="py-2.5 px-1 text-right">
        <span class="px-2 py-0.5 rounded text-[11px] font-bold bg-[#dcfce7] text-[#16a34a]">${item.rate}</span>
      </td>
    </tr>
  `).join('');
}

/**
 * Tab Switching for Risk Table (Absences vs Tardiness)
 * Exact match with teacher/class-analytics.js
 */
window.switchRiskTab = function (tab) {
  const btnAbs = document.getElementById('btnTabAbsences');
  const btnTardy = document.getElementById('btnTabTardiness');
  const viewAbs = document.getElementById('viewMostAbsences');
  const viewTardy = document.getElementById('viewMostTardiness');

  if (!btnAbs || !btnTardy || !viewAbs || !viewTardy) return;

  if (tab === 'absences') {
    btnAbs.className = 'text-xs font-bold text-[#dc2626] pb-1 border-b-2 border-[#dc2626] focus:outline-none transition-colors cursor-pointer';
    btnTardy.className = 'text-xs font-medium text-[#6b7280] pb-1 hover:text-[#111827] focus:outline-none transition-colors cursor-pointer';
    viewAbs.classList.remove('hidden');
    viewTardy.classList.add('hidden');
  } else {
    btnTardy.className = 'text-xs font-bold text-[#ea580c] pb-1 border-b-2 border-[#ea580c] focus:outline-none transition-colors cursor-pointer';
    btnAbs.className = 'text-xs font-medium text-[#6b7280] pb-1 hover:text-[#111827] focus:outline-none transition-colors cursor-pointer';
    viewTardy.classList.remove('hidden');
    viewAbs.classList.add('hidden');
  }
};

/**
 * Setup Line Chart Hover Tooltips
 */
function setupChartHoverTooltips() {
  const circles = document.querySelectorAll('#lineChartCircles circle');
  const tooltip = document.getElementById('chartTooltip');
  const tooltipDate = document.getElementById('tooltipDate');
  const tooltipVal = document.getElementById('tooltipValue');

  if (!tooltip || !tooltipDate || !tooltipVal) return;

  const dates = [
    'Sep 1', 'Sep 2', 'Sep 3', 'Sep 4', 'Sep 5', 'Sep 8', 'Sep 9', 'Sep 10',
    'Sep 11', 'Sep 12', 'Sep 15', 'Sep 16', 'Sep 17', 'Sep 18', 'Sep 19', 'Sep 22'
  ];

  circles.forEach((circle, idx) => {
    circle.style.cursor = 'pointer';

    circle.addEventListener('mouseenter', () => {
      const cx = parseFloat(circle.getAttribute('cx'));
      const cy = parseFloat(circle.getAttribute('cy'));
      const dateText = dates[idx] || `Sep ${idx + 1}`;
      const rateText = (100 - (cy - 20) * (40 / 180)).toFixed(2) + '%';

      tooltipDate.textContent = `${dateText}, 2026`;
      tooltipVal.textContent = rateText;

      tooltip.style.left = `${Math.min(Math.max(cx - 65, 10), 450)}px`;
      tooltip.style.top = `${Math.max(cy - 65, 10)}px`;
      tooltip.classList.remove('hidden');
    });
  });
}

/**
 * Export Modal Handlers
 * Exact match with teacher/class-analytics.js
 */
window.openExportModal = function () {
  const modal = document.getElementById('exportModal');
  if (modal) modal.classList.remove('hidden');
};

window.closeExportModal = function () {
  const modal = document.getElementById('exportModal');
  if (modal) modal.classList.add('hidden');
};

window.updateExportFormatSelection = function (radio) {
  const cards = document.querySelectorAll('.export-format-card');
  cards.forEach(card => {
    card.classList.remove('border-2', 'border-[#0030c2]', 'bg-[#eff6ff]');
    card.classList.add('border', 'border-[#e5e7eb]');
    const title = card.querySelector('.export-card-title');
    if (title) title.className = 'font-bold text-[#374151] export-card-title';
  });

  const parent = radio.closest('.export-format-card');
  if (parent) {
    parent.classList.remove('border', 'border-[#e5e7eb]');
    parent.classList.add('border-2', 'border-[#0030c2]', 'bg-[#eff6ff]');
    const title = parent.querySelector('.export-card-title');
    if (title) title.className = 'font-bold text-[#0030c2] export-card-title';
  }

  const btnText = document.getElementById('exportSubmitBtnText');
  if (btnText) {
    btnText.textContent = radio.value === 'Excel' ? 'Download Excel' : 'Download CSV';
  }
};

window.handleExportSubmit = function (event) {
  event.preventDefault();
  closeExportModal();

  const period = document.getElementById('modalExportPeriod').value;
  const section = document.getElementById('modalExportSection').value;
  const formatEl = document.querySelector('input[name="exportFormat"]:checked');
  const format = formatEl ? formatEl.value : 'CSV';

  // Trigger downloadable simulation
  const csvContent = "data:text/csv;charset=utf-8,"
    + "Rank,Subject,Instructor,Attendance Rate,Present %,Late %,Absent %\n"
    + "1,CS201 (Data Structures),Prof. Santos,96.50%,95.00%,2.50%,2.50%\n"
    + "2,IT401 (Capstone Project 1),Dr. Garcia,95.00%,93.50%,3.50%,3.00%\n"
    + "3,IT301 (Web Systems),Mrs. Dela Cruz,93.00%,90.00%,6.00%,4.00%\n"
    + "4,GE101 (Purposive Comm),Prof. Lim,92.50%,89.50%,4.50%,6.00%\n"
    + "5,IT302 (Database Admin),Mr. Ramos,91.80%,88.50%,7.20%,4.30%\n";

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `student_performance_analytics_${section.toLowerCase().replace(/\s+/g, '_')}_${period.toLowerCase()}.${format === 'Excel' ? 'xlsx' : 'csv'}`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  showToast('Analytics Exported', `Personal performance analytics (${format}) downloaded successfully.`, 'success');
};

/**
 * Toast Notification System (Consistent with Attendance Calendar)
 */
function showToast(titleOrMessage, messageOrType = 'info', possibleType) {
  let title = titleOrMessage;
  let message = messageOrType;
  let type = possibleType;

  if (possibleType === undefined) {
    const knownTypes = ['success', 'info', 'error', 'danger', 'warning'];
    if (knownTypes.includes(messageOrType)) {
      message = titleOrMessage;
      type = messageOrType === 'danger' ? 'error' : messageOrType;
      title = type === 'success' ? 'Success' : type === 'info' ? 'Notification' : type === 'warning' ? 'Warning' : 'Error';
    } else {
      type = 'info';
    }
  } else {
    if (type === 'danger') type = 'error';
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
  if (type === 'success') {
    iconSvg = `
      <div class="w-8 h-8 rounded-xl bg-[#f0fdf4] text-[#16a34a] border border-[#bbf7d0] flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
        <svg class="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.25">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
      </div>
    `;
  } else if (type === 'info') {
    iconSvg = `
      <div class="w-8 h-8 rounded-xl bg-[#eff6ff] text-[#0030c2] border border-[#bfdbfe] flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
        <svg class="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.25">
          <path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
        </svg>
      </div>
    `;
  } else if (type === 'warning') {
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

window.showToast = showToast;

// Topbar profile dropdown and logout handlers
if (!window.toggleProfileDropdown) {
  window.toggleProfileDropdown = function (event) {
    if (event) event.stopPropagation();
    const menu = document.getElementById('studentProfileMenu');
    if (menu) {
      menu.classList.toggle('hidden');
    }
  };
}

if (!window.handleLogout) {
  window.handleLogout = function () {
    if (confirm('Are you sure you want to log out?')) {
      window.location.href = '../login.html';
    }
  };
}

// Close profile dropdown on outside click
document.addEventListener('click', function (e) {
  const profileBtn = document.getElementById('topbarProfileBtn');
  const profileMenu = document.getElementById('studentProfileMenu');
  if (profileMenu && !profileMenu.classList.contains('hidden')) {
    if (profileBtn && !profileBtn.contains(e.target) && !profileMenu.contains(e.target)) {
      profileMenu.classList.add('hidden');
    }
  }
});
