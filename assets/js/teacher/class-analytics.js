/**
 * Bestlink College of the Philippines
 * Class Analytics Dashboard Module (teacher/class-analytics.html)
 * Reference: admin/performance-analytics.html & docs/teacher_frontend.md Section 1.9
 */

document.addEventListener('DOMContentLoaded', () => {
  initAnalyticsData();
  setupEventListeners();
});

// Mock analytics data keyed by Subject and Section
const analyticsDataset = {
  ALL: {
    overall: '93.40%',
    overallTrend: '2.10%',
    overallTrendUp: true,
    present: '90.80%',
    presentTrend: '3.12%',
    absent: '2.60%',
    absentTrend: '1.18%',
    late: '5.40%',
    lateTrend: '0.75%',
    excused: '1.20%',
    excusedTrend: '0.81%',
    topStudents: [
      { rank: 1, name: 'Dela Cruz, Mark', section: 'BSIT 3A', rate: '100.0%' },
      { rank: 2, name: 'Santos, Maria Elena', section: 'BSCS 2A', rate: '100.0%' },
      { rank: 3, name: 'Reyes, Joshua Paul', section: 'BSIT 3B', rate: '99.50%' },
      { rank: 4, name: 'Bautista, Angel Mae', section: 'BSIT 4A', rate: '98.80%' },
      { rank: 5, name: 'Aquino, John Lloyd', section: 'BSIT 3A', rate: '98.50%' }
    ],
    riskAbsences: [
      { rank: 1, name: 'Villanueva, Gabriel', section: 'BSIT 3B', count: 4 },
      { rank: 2, name: 'Navarro, Kenneth', section: 'BSIT 3A', count: 3 },
      { rank: 3, name: 'Mercado, Alyssa', section: 'BSIT 4A', count: 3 },
      { rank: 4, name: 'Pascual, Kevin', section: 'BSCS 2A', count: 2 }
    ],
    riskTardiness: [
      { rank: 1, name: 'Soriano, Jerome', section: 'BSIT 3B', count: 6 },
      { rank: 2, name: 'Castaneda, Ryan', section: 'BSIT 3A', count: 5 },
      { rank: 3, name: 'Villanueva, Gabriel', section: 'BSIT 3B', count: 4 },
      { rank: 4, name: 'Navarro, Kenneth', section: 'BSIT 3A', count: 3 }
    ],
    sections: [
      { name: 'CS201 (BSCS 2A)', present: '93.00%', late: '4.10%', absent: '1.80%' },
      { name: 'IT301 (BSIT 3A)', present: '91.50%', late: '4.80%', absent: '2.40%' },
      { name: 'IT302 (BSIT 3B)', present: '89.20%', late: '6.10%', absent: '3.10%' },
      { name: 'IT401 (BSIT 4A)', present: '89.50%', late: '6.60%', absent: '3.10%' }
    ]
  },
  IT301: {
    overall: '91.50%',
    overallTrend: '1.40%',
    overallTrendUp: true,
    present: '88.20%',
    presentTrend: '1.80%',
    absent: '2.40%',
    absentTrend: '0.60%',
    late: '4.80%',
    lateTrend: '0.40%',
    excused: '1.40%',
    excusedTrend: '0.20%',
    topStudents: [
      { rank: 1, name: 'Dela Cruz, Mark', section: 'BSIT 3A', rate: '100.0%' },
      { rank: 2, name: 'Aquino, John Lloyd', section: 'BSIT 3A', rate: '98.50%' },
      { rank: 3, name: 'Valdez, Stephanie', section: 'BSIT 3A', rate: '97.20%' },
      { rank: 4, name: 'Morales, Christian', section: 'BSIT 3A', rate: '96.80%' },
      { rank: 5, name: 'Alcantara, Bea', section: 'BSIT 3A', rate: '96.10%' }
    ],
    riskAbsences: [
      { rank: 1, name: 'Navarro, Kenneth', section: 'BSIT 3A', count: 3 },
      { rank: 2, name: 'Castaneda, Ryan', section: 'BSIT 3A', count: 2 },
      { rank: 3, name: 'Tolentino, Paul', section: 'BSIT 3A', count: 2 },
      { rank: 4, name: 'Cortez, Mary Ann', section: 'BSIT 3A', count: 1 }
    ],
    riskTardiness: [
      { rank: 1, name: 'Castaneda, Ryan', section: 'BSIT 3A', count: 5 },
      { rank: 2, name: 'Navarro, Kenneth', section: 'BSIT 3A', count: 3 },
      { rank: 3, name: 'Ocampo, Miguel', section: 'BSIT 3A', count: 2 },
      { rank: 4, name: 'Ramos, Dave', section: 'BSIT 3A', count: 2 }
    ],
    sections: [
      { name: 'IT301 (BSIT 3A)', present: '91.50%', late: '4.80%', absent: '2.40%' }
    ]
  },
  IT302: {
    overall: '89.20%',
    overallTrend: '0.80%',
    overallTrendUp: false,
    present: '86.10%',
    presentTrend: '1.20%',
    absent: '3.10%',
    absentTrend: '0.90%',
    late: '6.10%',
    lateTrend: '1.10%',
    excused: '1.60%',
    excusedTrend: '0.30%',
    topStudents: [
      { rank: 1, name: 'Reyes, Joshua Paul', section: 'BSIT 3B', rate: '99.50%' },
      { rank: 2, name: 'Lim, Princess Sarah', section: 'BSIT 3B', rate: '97.80%' },
      { rank: 3, name: 'Mendoza, Ethan', section: 'BSIT 3B', rate: '96.40%' },
      { rank: 4, name: 'Garcia, Hannah', section: 'BSIT 3B', rate: '95.90%' },
      { rank: 5, name: 'David, Lance', section: 'BSIT 3B', rate: '95.10%' }
    ],
    riskAbsences: [
      { rank: 1, name: 'Villanueva, Gabriel', section: 'BSIT 3B', count: 4 },
      { rank: 2, name: 'Soriano, Jerome', section: 'BSIT 3B', count: 3 },
      { rank: 3, name: 'Rivera, Camille', section: 'BSIT 3B', count: 2 },
      { rank: 4, name: 'Castro, Neil', section: 'BSIT 3B', count: 2 }
    ],
    riskTardiness: [
      { rank: 1, name: 'Soriano, Jerome', section: 'BSIT 3B', count: 6 },
      { rank: 2, name: 'Villanueva, Gabriel', section: 'BSIT 3B', count: 4 },
      { rank: 3, name: 'Tan, Kimberly', section: 'BSIT 3B', count: 3 },
      { rank: 4, name: 'Gonzales, Ralph', section: 'BSIT 3B', count: 2 }
    ],
    sections: [
      { name: 'IT302 (BSIT 3B)', present: '89.20%', late: '6.10%', absent: '3.10%' }
    ]
  },
  CS201: {
    overall: '93.00%',
    overallTrend: '3.20%',
    overallTrendUp: true,
    present: '91.20%',
    presentTrend: '3.40%',
    absent: '1.80%',
    absentTrend: '1.20%',
    late: '4.10%',
    lateTrend: '0.90%',
    excused: '1.10%',
    excusedTrend: '0.40%',
    topStudents: [
      { rank: 1, name: 'Santos, Maria Elena', section: 'BSCS 2A', rate: '100.0%' },
      { rank: 2, name: 'Abad, Vincent', section: 'BSCS 2A', rate: '99.00%' },
      { rank: 3, name: 'Flores, Diana', section: 'BSCS 2A', rate: '98.30%' },
      { rank: 4, name: 'Chua, Jonathan', section: 'BSCS 2A', rate: '97.90%' },
      { rank: 5, name: 'Bernardo, Kayla', section: 'BSCS 2A', rate: '97.40%' }
    ],
    riskAbsences: [
      { rank: 1, name: 'Pascual, Kevin', section: 'BSCS 2A', count: 2 },
      { rank: 2, name: 'Torres, Liam', section: 'BSCS 2A', count: 2 },
      { rank: 3, name: 'Salazar, Rachel', section: 'BSCS 2A', count: 1 },
      { rank: 4, name: 'Vargas, Carlo', section: 'BSCS 2A', count: 1 }
    ],
    riskTardiness: [
      { rank: 1, name: 'Torres, Liam', section: 'BSCS 2A', count: 3 },
      { rank: 2, name: 'Pascual, Kevin', section: 'BSCS 2A', count: 2 },
      { rank: 3, name: 'Salazar, Rachel', section: 'BSCS 2A', count: 2 },
      { rank: 4, name: 'Vargas, Carlo', section: 'BSCS 2A', count: 1 }
    ],
    sections: [
      { name: 'CS201 (BSCS 2A)', present: '93.00%', late: '4.10%', absent: '1.80%' }
    ]
  },
  IT401: {
    overall: '89.50%',
    overallTrend: '1.10%',
    overallTrendUp: true,
    present: '87.40%',
    presentTrend: '1.50%',
    absent: '3.10%',
    absentTrend: '0.40%',
    late: '6.60%',
    lateTrend: '0.80%',
    excused: '1.30%',
    excusedTrend: '0.50%',
    topStudents: [
      { rank: 1, name: 'Bautista, Angel Mae', section: 'BSIT 4A', rate: '98.80%' },
      { rank: 2, name: 'Cordero, Gerald', section: 'BSIT 4A', rate: '97.60%' },
      { rank: 3, name: 'Luna, Clarisse', section: 'BSIT 4A', rate: '96.90%' },
      { rank: 4, name: 'Serrano, Dominic', section: 'BSIT 4A', rate: '96.20%' },
      { rank: 5, name: 'Enriquez, Trisha', section: 'BSIT 4A', rate: '95.50%' }
    ],
    riskAbsences: [
      { rank: 1, name: 'Mercado, Alyssa', section: 'BSIT 4A', count: 3 },
      { rank: 2, name: 'Panganiban, Patrick', section: 'BSIT 4A', count: 2 },
      { rank: 3, name: 'Roque, Francis', section: 'BSIT 4A', count: 2 },
      { rank: 4, name: 'Gomez, Patricia', section: 'BSIT 4A', count: 1 }
    ],
    riskTardiness: [
      { rank: 1, name: 'Mercado, Alyssa', section: 'BSIT 4A', count: 4 },
      { rank: 2, name: 'Panganiban, Patrick', section: 'BSIT 4A', count: 3 },
      { rank: 3, name: 'Roque, Francis', section: 'BSIT 4A', count: 3 },
      { rank: 4, name: 'Gomez, Patricia', section: 'BSIT 4A', count: 2 }
    ],
    sections: [
      { name: 'IT401 (BSIT 4A)', present: '89.50%', late: '6.60%', absent: '3.10%' }
    ]
  }
};

function initAnalyticsData() {
  updateCurrentDateDisplay();
}

function setupEventListeners() {
  // Close export modal on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeExportModal();
    }
  });

  // Close topbar profile dropdown on click outside
  document.addEventListener('click', (e) => {
    const profileBtn = document.getElementById('topbarProfileBtn');
    const profileDropdown = document.getElementById('topbarProfileMenu');
    if (profileBtn && profileDropdown && !profileBtn.contains(e.target) && !profileDropdown.contains(e.target)) {
      profileDropdown.classList.add('hidden');
    }
  });
}

function updateCurrentDateDisplay() {
  const dateLabel = document.getElementById('currentDateLabel');
  if (dateLabel) {
    const now = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' };
    dateLabel.textContent = now.toLocaleDateString('en-US', options);
  }
}

/**
 * Filter change handler (Subject, Section, Month, Term)
 */
function handleAnalyticsFilterChange() {
  const subjectVal = document.getElementById('analyticsSubjectSelect')?.value || 'ALL';
  const sectionVal = document.getElementById('analyticsSectionSelect')?.value || 'ALL';

  // Pick dataset according to subject or section
  let dataKey = 'ALL';
  if (subjectVal !== 'ALL') {
    dataKey = subjectVal;
  } else if (sectionVal !== 'ALL') {
    if (sectionVal === 'BSIT 3A') dataKey = 'IT301';
    else if (sectionVal === 'BSIT 3B') dataKey = 'IT302';
    else if (sectionVal === 'BSCS 2A') dataKey = 'CS201';
    else if (sectionVal === 'BSIT 4A') dataKey = 'IT401';
  }

  const data = analyticsDataset[dataKey] || analyticsDataset['ALL'];

  // Update KPI cards
  const kpiOverall = document.getElementById('kpiOverallRate');
  if (kpiOverall) kpiOverall.textContent = data.overall;

  const kpiOverallTrend = document.getElementById('kpiOverallTrend');
  if (kpiOverallTrend) kpiOverallTrend.textContent = data.overallTrend;

  const kpiPresent = document.getElementById('kpiPresentRate');
  if (kpiPresent) kpiPresent.textContent = data.present;

  const kpiAbsent = document.getElementById('kpiAbsentRate');
  if (kpiAbsent) kpiAbsent.textContent = data.absent;

  const kpiLate = document.getElementById('metricLate');
  if (kpiLate) kpiLate.textContent = data.late;

  const kpiExcused = document.getElementById('kpiExcusedRate');
  if (kpiExcused) kpiExcused.textContent = data.excused;

  // Render Punctual Students table
  renderPunctualStudents(data.topStudents);

  // Render At-Risk Absences and Tardiness tables
  renderRiskAbsences(data.riskAbsences);
  renderRiskTardiness(data.riskTardiness);

  // Render Section Breakdown table
  renderSectionPerformance(data.sections);

  showToast(`Updated analytics for ${subjectVal === 'ALL' ? 'All Subjects' : subjectVal} (${sectionVal})`, 'info');
}

function renderPunctualStudents(students) {
  const tbody = document.getElementById('topStudentsTableBody');
  if (!tbody || !students) return;

  tbody.innerHTML = students.map(s => `
    <tr>
      <td class="py-2.5 px-1 font-semibold text-[#6b7280]">${s.rank}</td>
      <td class="py-2.5 px-1 font-bold">${s.name}</td>
      <td class="py-2.5 px-1 text-[#4b5563]">${s.section}</td>
      <td class="py-2.5 px-1 text-right">
        <span class="px-2 py-0.5 rounded text-[11px] font-bold bg-[#dcfce7] text-[#16a34a]">${s.rate}</span>
      </td>
    </tr>
  `).join('');
}

function renderRiskAbsences(students) {
  const container = document.getElementById('viewMostAbsences');
  if (!container || !students) return;

  const tbody = container.querySelector('tbody');
  if (!tbody) return;

  tbody.innerHTML = students.map(s => `
    <tr>
      <td class="py-2.5 px-1 font-semibold text-[#6b7280]">${s.rank}</td>
      <td class="py-2.5 px-1 font-bold">${s.name}</td>
      <td class="py-2.5 px-1 text-[#4b5563]">${s.section}</td>
      <td class="py-2.5 px-1 text-right font-bold text-[#dc2626]">${s.count}</td>
    </tr>
  `).join('');
}

function renderRiskTardiness(students) {
  const container = document.getElementById('viewMostTardiness');
  if (!container || !students) return;

  const tbody = container.querySelector('tbody');
  if (!tbody) return;

  tbody.innerHTML = students.map(s => `
    <tr>
      <td class="py-2.5 px-1 font-semibold text-[#6b7280]">${s.rank}</td>
      <td class="py-2.5 px-1 font-bold">${s.name}</td>
      <td class="py-2.5 px-1 text-[#4b5563]">${s.section}</td>
      <td class="py-2.5 px-1 text-right font-bold text-[#ea580c]">${s.count}</td>
    </tr>
  `).join('');
}

function renderSectionPerformance(sections) {
  const tbody = document.getElementById('sectionPerformanceTableBody');
  if (!tbody || !sections) return;

  tbody.innerHTML = sections.map(sec => `
    <tr>
      <td class="py-2.5 px-1 font-bold">${sec.name}</td>
      <td class="py-2.5 px-1 text-right font-medium text-[#111827]">${sec.present}</td>
      <td class="py-2.5 px-1 text-right font-medium text-[#111827]">${sec.late}</td>
      <td class="py-2.5 px-1 text-right font-medium text-[#111827]">${sec.absent}</td>
    </tr>
  `).join('');
}

/**
 * Switch between Absences and Tardiness tabs on the At-Risk Card
 */
function switchRiskTab(tabType) {
  const btnAbsences = document.getElementById('btnTabAbsences');
  const btnTardiness = document.getElementById('btnTabTardiness');
  const viewAbsences = document.getElementById('viewMostAbsences');
  const viewTardiness = document.getElementById('viewMostTardiness');

  if (tabType === 'absences') {
    btnAbsences.className = 'text-xs font-bold text-[#dc2626] pb-1 border-b-2 border-[#dc2626] focus:outline-none transition-colors cursor-pointer';
    btnTardiness.className = 'text-xs font-medium text-[#6b7280] pb-1 hover:text-[#111827] focus:outline-none transition-colors cursor-pointer';
    viewAbsences.classList.remove('hidden');
    viewTardiness.classList.add('hidden');
  } else {
    btnAbsences.className = 'text-xs font-medium text-[#6b7280] pb-1 hover:text-[#111827] focus:outline-none transition-colors cursor-pointer';
    btnTardiness.className = 'text-xs font-bold text-[#ea580c] pb-1 border-b-2 border-[#ea580c] focus:outline-none transition-colors cursor-pointer';
    viewAbsences.classList.add('hidden');
    viewTardiness.classList.remove('hidden');
  }
}

/**
 * Topbar Profile dropdown toggle
 */
function toggleProfileDropdown(event) {
  if (event && event.stopPropagation) {
    event.stopPropagation();
  }
  const dropdown = document.getElementById('topbarProfileMenu') || document.getElementById('topbarProfileDropdown');
  if (dropdown) {
    dropdown.classList.toggle('hidden');
  }
}

/**
 * Export Modal Handlers
 */
function openExportModal() {
  const modal = document.getElementById('exportModal');
  if (modal) {
    modal.classList.remove('hidden');
  }
}

function closeExportModal() {
  const modal = document.getElementById('exportModal');
  if (modal) {
    modal.classList.add('hidden');
  }
}

function updateExportFormatSelection(input) {
  const cards = document.querySelectorAll('.export-format-card');
  cards.forEach(card => {
    const radio = card.querySelector('input[type="radio"]');
    const title = card.querySelector('.export-card-title');
    if (radio && radio.checked) {
      card.className = 'export-format-card border-2 border-[#0030c2] bg-[#eff6ff] p-3 rounded-xl flex flex-col items-center justify-center gap-1 cursor-pointer transition-all';
      if (title) title.className = 'font-bold text-[#0030c2] export-card-title';
    } else {
      card.className = 'export-format-card border border-[#e5e7eb] hover:border-gray-300 p-3 rounded-xl flex flex-col items-center justify-center gap-1 cursor-pointer transition-all';
      if (title) title.className = 'font-bold text-[#374151] export-card-title';
    }
  });

  const btnText = document.getElementById('exportSubmitBtnText');
  if (btnText) {
    btnText.textContent = input.value === 'Excel' ? 'Download Excel (.xlsx)' : 'Download CSV';
  }
}

function handleExportSubmit(event) {
  event.preventDefault();

  const format = document.querySelector('input[name="exportFormat"]:checked')?.value || 'CSV';
  const section = document.getElementById('modalExportSection')?.value || 'ALL';
  const period = document.getElementById('modalExportPeriod')?.value || 'ActiveMonth';

  // Generate downloadable CSV or simulated Excel
  if (format === 'CSV') {
    triggerCSVDownload(section, period);
  } else {
    triggerExcelDownload(section, period);
  }

  closeExportModal();
  showToast(`Successfully generated ${format} report for ${section}!`, 'success');
}

function triggerCSVDownload(section, period) {
  const headers = ['Student ID', 'Student Name', 'Subject', 'Section', 'Attendance Rate', 'Present Days', 'Tardy Days', 'Absent Days', 'Excused Days'];
  const rows = [
    ['2024-00101', 'Dela Cruz, Mark', 'IT301', 'BSIT 3A', '100.0%', '24', '0', '0', '0'],
    ['2024-00102', 'Santos, Maria Elena', 'CS201', 'BSCS 2A', '100.0%', '24', '0', '0', '0'],
    ['2024-00103', 'Reyes, Joshua Paul', 'IT302', 'BSIT 3B', '99.50%', '23', '1', '0', '0'],
    ['2024-00104', 'Bautista, Angel Mae', 'IT401', 'BSIT 4A', '98.80%', '23', '0', '1', '0'],
    ['2024-00105', 'Aquino, John Lloyd', 'IT301', 'BSIT 3A', '98.50%', '22', '2', '0', '0'],
    ['2024-00106', 'Villanueva, Gabriel', 'IT302', 'BSIT 3B', '78.20%', '17', '3', '4', '0'],
    ['2024-00107', 'Navarro, Kenneth', 'IT301', 'BSIT 3A', '82.00%', '18', '3', '3', '0'],
    ['2024-00108', 'Soriano, Jerome', 'IT302', 'BSIT 3B', '79.50%', '16', '5', '3', '0']
  ];

  let csvContent = 'data:text/csv;charset=utf-8,';
  csvContent += `BCP Class Attendance Analytics Report (${section} - ${period})\n`;
  csvContent += `Generated: ${new Date().toLocaleString()}\n\n`;
  csvContent += headers.join(',') + '\n';
  rows.forEach(r => {
    csvContent += r.join(',') + '\n';
  });

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `Class_Analytics_${section.replace(/\s+/g, '_')}_${period}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function triggerExcelDownload(section, period) {
  // Simulate excel download with TSV format compatible with Excel
  const content = `BCP Attendance System - Class Analytics\nScope: ${section}\nPeriod: ${period}\nDate: ${new Date().toLocaleDateString()}\n\nStudent ID\tStudent Name\tSection\tAttendance Rate\tAbsences\tTardies\n2024-00101\tDela Cruz, Mark\tBSIT 3A\t100.0%\t0\t0\n2024-00102\tSantos, Maria Elena\tBSCS 2A\t100.0%\t0\t0\n2024-00103\tReyes, Joshua Paul\tBSIT 3B\t99.50%\t0\t1\n2024-00106\tVillanueva, Gabriel\tBSIT 3B\t78.20%\t4\t4\n`;
  const blob = new Blob([content], { type: 'application/vnd.ms-excel' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `Class_Analytics_${section.replace(/\s+/g, '_')}_${period}.xls`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Toast Notification Helper
 */
function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  const bg = type === 'success' ? 'bg-[#16a34a]' : type === 'error' ? 'bg-[#dc2626]' : 'bg-[#0030c2]';

  toast.className = `${bg} text-white text-xs px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 transform transition-all duration-300 opacity-0 translate-y-2 pointer-events-auto`;
  toast.innerHTML = `
    <svg class="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
      <path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
    <span class="font-medium">${message}</span>
  `;

  container.appendChild(toast);

  // Animate in
  requestAnimationFrame(() => {
    toast.classList.remove('opacity-0', 'translate-y-2');
  });

  // Remove after 3.5s
  setTimeout(() => {
    toast.classList.add('opacity-0', 'translate-y-2');
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  }, 3500);
}

// Window attachments for inline event handlers
window.handleAnalyticsFilterChange = handleAnalyticsFilterChange;
window.switchRiskTab = switchRiskTab;
window.toggleProfileDropdown = toggleProfileDropdown;
window.openExportModal = openExportModal;
window.closeExportModal = closeExportModal;
window.updateExportFormatSelection = updateExportFormatSelection;
window.handleExportSubmit = handleExportSubmit;
