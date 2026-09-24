/**
 * Bestlink College of the Philippines
 * Class Analytics Dashboard Module (teacher/class-analytics.html)
 * Reference: admin/performance-analytics.html & docs/teacher_frontend.md Section 1.9
 */

document.addEventListener('DOMContentLoaded', () => {
  initAnalyticsData();
  setupEventListeners();
  initChartTooltips();
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
  const dropdown = document.getElementById('topbarProfileMenu') || document.getElementById('topbarProfileDropdown') || document.getElementById('studentProfileMenu');
  const btn = document.getElementById('topbarProfileBtn');
  const chevron = document.getElementById('topbarProfileChevron') || (btn ? btn.querySelector('.topbar-profile-chevron, svg:last-of-type') : null);
  if (dropdown) {
    const isHidden = dropdown.classList.toggle('hidden');
    if (chevron) {
      if (isHidden) {
        chevron.classList.remove('rotate-90');
      } else {
        chevron.classList.add('rotate-90');
      }
    }
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

// =========================================================
// PERFORMANCE & CLASS ANALYTICS CHARTS ENGINE (600x226 Standard)
// =========================================================

const TEACHER_TREND_DATASETS = {
  '30d': [
    { date: 'Jul 1', rate: 93.4 },
    { date: 'Jul 3', rate: 94.1 },
    { date: 'Jul 5', rate: 91.8 },
    { date: 'Jul 8', rate: 95.2 },
    { date: 'Jul 10', rate: 92.5 },
    { date: 'Jul 12', rate: 93.0 },
    { date: 'Jul 15', rate: 96.0 },
    { date: 'Jul 17', rate: 94.5 },
    { date: 'Jul 19', rate: 93.8 },
    { date: 'Jul 22', rate: 95.6 },
    { date: 'Jul 24', rate: 96.5 },
    { date: 'Jul 25', rate: 95.0 },
    { date: 'Jul 26', rate: 97.2 },
    { date: 'Jul 28', rate: 97.2 },
    { date: 'Jul 30', rate: 96.2 },
    { date: 'Jul 31', rate: 93.8 }
  ],
  '14d': [
    { date: 'Jul 18', rate: 95.0 },
    { date: 'Jul 20', rate: 93.5 },
    { date: 'Jul 21', rate: 92.0 },
    { date: 'Jul 23', rate: 93.5 },
    { date: 'Jul 24', rate: 96.5 },
    { date: 'Jul 25', rate: 95.0 },
    { date: 'Jul 26', rate: 97.2 },
    { date: 'Jul 28', rate: 97.2 },
    { date: 'Jul 30', rate: 96.2 },
    { date: 'Jul 31', rate: 93.8 }
  ],
  '7d': [
    { date: 'Jul 25', rate: 95.0 },
    { date: 'Jul 26', rate: 97.2 },
    { date: 'Jul 27', rate: 96.8 },
    { date: 'Jul 28', rate: 97.2 },
    { date: 'Jul 29', rate: 95.5 },
    { date: 'Jul 30', rate: 96.2 },
    { date: 'Jul 31', rate: 93.8 }
  ]
};

/**
 * Calculates a smooth natural cubic Bezier spline SVG path string (type="natural")
 */
function getNaturalBezierPath(points) {
  if (!points || points.length === 0) return '';
  if (points.length === 1) return `M ${points[0].x.toFixed(1)},${points[0].y.toFixed(1)}`;

  let d = `M ${points[0].x.toFixed(1)},${points[0].y.toFixed(1)}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = i > 0 ? points[i - 1] : points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = (i + 2 < points.length) ? points[i + 2] : p2;

    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    d += ` C ${cp1x.toFixed(1)},${cp1y.toFixed(1)} ${cp2x.toFixed(1)},${cp2y.toFixed(1)} ${p2.x.toFixed(1)},${p2.y.toFixed(1)}`;
  }
  return d;
}

/**
 * Renders the natural spline area chart, dots, and X-axis ticks
 */
function renderTrendChart(timeRange = '30d') {
  const data = TEACHER_TREND_DATASETS[timeRange] || TEACHER_TREND_DATASETS['30d'];
  const areaPath = document.getElementById('trendAreaPath');
  const linePath = document.getElementById('trendLinePath');
  const pointsGroup = document.getElementById('trendPointsGroup');
  const xAxisGroup = document.getElementById('trendXAxisLabels');

  if (!areaPath || !linePath || !pointsGroup || !xAxisGroup) return [];

  // Coordinate mapping: viewBox="0 0 600 226", x span: 42 to 584 (fits grid 36 to 590), y span: 195 (60%) to 20 (100%)
  const startX = 42;
  const endX = 584;
  const bottomY = 195;
  const topY = 20;

  const points = data.map((item, idx) => {
    const cx = data.length > 1 ? startX + (idx / (data.length - 1)) * (endX - startX) : (startX + endX) / 2;
    const clampedRate = Math.max(60, Math.min(100, item.rate));
    const cy = bottomY - ((clampedRate - 60) / 40) * (bottomY - topY);
    return {
      x: cx,
      y: cy,
      date: item.date,
      rate: item.rate.toFixed(2) + '%'
    };
  });

  // Compute smooth natural spline curves
  const lineD = getNaturalBezierPath(points);
  const firstPt = points[0];
  const lastPt = points[points.length - 1];
  const areaD = `${lineD} L ${lastPt.x.toFixed(1)},${bottomY} L ${firstPt.x.toFixed(1)},${bottomY} Z`;

  linePath.setAttribute('d', lineD);
  areaPath.setAttribute('d', areaD);

  // Render snap circle dots
  pointsGroup.innerHTML = points.map((p, idx) => `
    <circle class="trend-dot cursor-pointer" cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="4" data-index="${idx}" />
  `).join('');

  // Render formatted X-axis labels
  if (timeRange === '30d') {
    const displayIndices = [0, 2, 5, 8, 11, 13, 15];
    xAxisGroup.innerHTML = displayIndices
      .filter(i => i < points.length)
      .map(i => `<text x="${points[i].x.toFixed(1)}" y="216" text-anchor="middle">${points[i].date}</text>`)
      .join('');
  } else {
    xAxisGroup.innerHTML = points
      .map(p => `<text x="${p.x.toFixed(1)}" y="216" text-anchor="middle">${p.date}</text>`)
      .join('');
  }

  // Cache dot elements into point objects for snappy magnetic cursor tracking
  const dotElements = Array.from(pointsGroup.querySelectorAll('.trend-dot'));
  points.forEach((p, i) => {
    p.el = dotElements[i];
  });

  return points;
}

/**
 * Magnetic Cursor & Contained Tooltip Handler for Line and Bar Charts
 */
function initChartTooltips() {
  // ---------------------------------------------------------
  // 1. Line Chart Magnetic Cursor Tracking (Natural Spline & Interactive Range)
  // ---------------------------------------------------------
  const trendContainer = document.getElementById('trendChartContainer');
  const trendSvg = document.getElementById('trendSvg');
  const trendMagneticLine = document.getElementById('trendMagneticLine');
  const trendTooltip = document.getElementById('trendChartTooltip');
  const trendTimeRange = document.getElementById('trendTimeRange');

  const trendDate = document.getElementById('trendTooltipDate');
  const trendRate = document.getElementById('trendTooltipRate');

  if (trendContainer && trendSvg && trendTooltip) {
    let currentPoints = renderTrendChart(trendTimeRange ? trendTimeRange.value : '30d');

    if (trendTimeRange) {
      trendTimeRange.addEventListener('change', (e) => {
        currentPoints = renderTrendChart(e.target.value);
        trendTooltip.style.opacity = '0';
        if (trendMagneticLine) trendMagneticLine.style.opacity = '0';
      });
    }

    trendContainer.addEventListener('mousemove', (e) => {
      if (!currentPoints || currentPoints.length === 0) return;
      const containerRect = trendContainer.getBoundingClientRect();
      const svgRect = trendSvg.getBoundingClientRect();
      const mouseSvgX = ((e.clientX - svgRect.left) / svgRect.width) * 600;

      // Find closest point by X coordinate
      let closest = currentPoints[0];
      let minDist = Math.abs(mouseSvgX - closest.x);
      for (let i = 1; i < currentPoints.length; i++) {
        const dist = Math.abs(mouseSvgX - currentPoints[i].x);
        if (dist < minDist) {
          minDist = dist;
          closest = currentPoints[i];
        }
      }

      // Snap magnetic vertical line
      if (trendMagneticLine) {
        trendMagneticLine.setAttribute('x1', closest.x);
        trendMagneticLine.setAttribute('x2', closest.x);
        trendMagneticLine.style.opacity = '0.5';
      }

      // Highlight active dot
      currentPoints.forEach(p => {
        if (p === closest) {
          if (p.el) {
            p.el.setAttribute('r', '6');
            p.el.setAttribute('stroke-width', '2.5');
          }
        } else {
          if (p.el) {
            p.el.setAttribute('r', '4');
            p.el.setAttribute('stroke-width', '2');
          }
        }
      });

      // Update simplified tooltip text (Date & Rate with indicator dot)
      if (trendDate) trendDate.textContent = `${closest.date}, 2026`;
      if (trendRate) trendRate.textContent = closest.rate;

      // Clamp position strictly inside container bounds so it never spills outside card
      const tooltipW = trendTooltip.offsetWidth || 120;
      const tooltipH = trendTooltip.offsetHeight || 50;
      const relX = e.clientX - containerRect.left;
      const relY = e.clientY - containerRect.top;

      const clampedX = Math.max(10, Math.min(relX - tooltipW / 2, containerRect.width - tooltipW - 10));
      const clampedY = Math.max(8, relY - tooltipH - 12);

      trendTooltip.style.left = `${clampedX}px`;
      trendTooltip.style.top = `${clampedY}px`;
      trendTooltip.style.opacity = '1';
    });

    trendContainer.addEventListener('mouseleave', () => {
      trendTooltip.style.opacity = '0';
      if (trendMagneticLine) trendMagneticLine.style.opacity = '0';
      if (currentPoints) {
        currentPoints.forEach(p => {
          if (p.el) {
            p.el.setAttribute('r', '4');
            p.el.setAttribute('stroke-width', '2');
          }
        });
      }
    });
  }

  // ---------------------------------------------------------
  // 2. Bar Chart Magnetic Cursor & Tooltip Tracking
  // ---------------------------------------------------------
  const barContainer = document.getElementById('barChartContainer');
  const barSvg = document.getElementById('barSvg');
  const barMagneticCol = document.getElementById('barMagneticColumn');
  const barTooltip = document.getElementById('barChartTooltip');
  const barItems = Array.from(document.querySelectorAll('.bar-item'));

  const barMonth = document.getElementById('barTooltipMonth');
  const barRate = document.getElementById('barTooltipRate');
  const barTooltipStats = document.getElementById('barTooltipStats');
  const barTooltipEmpty = document.getElementById('barTooltipEmpty');

  if (barContainer && barSvg && barTooltip && barItems.length > 0) {
    const barsData = barItems.map(item => ({
      el: item,
      status: item.getAttribute('data-status') || 'past',
      center: parseFloat(item.getAttribute('data-center') || '0'),
      month: item.getAttribute('data-month') || '',
      rate: item.getAttribute('data-rate') || ''
    }));

    barContainer.addEventListener('mousemove', (e) => {
      const containerRect = barContainer.getBoundingClientRect();
      const svgRect = barSvg.getBoundingClientRect();
      const mouseSvgX = ((e.clientX - svgRect.left) / svgRect.width) * 600;

      // Find closest bar by center X coordinate
      let closest = barsData[0];
      let minDist = Math.abs(mouseSvgX - closest.center);
      for (let i = 1; i < barsData.length; i++) {
        const dist = Math.abs(mouseSvgX - barsData[i].center);
        if (dist < minDist) {
          minDist = dist;
          closest = barsData[i];
        }
      }

      // Snap magnetic highlight column behind active bar (width 38 -> offset 19)
      if (barMagneticCol) {
        barMagneticCol.setAttribute('x', closest.center - 19);
        barMagneticCol.style.opacity = '1';
      }

      // Toggle tooltip contents based on month lifecycle status (simplified: Date & Rate only)
      if (closest.status === 'future') {
        // Zero details for future months as they have not yet come
        if (barTooltipStats) barTooltipStats.classList.add('hidden');
        if (barTooltipEmpty) barTooltipEmpty.classList.remove('hidden');
        if (barMonth) barMonth.textContent = closest.month;
      } else {
        // Simplified attendance statistics for past & present months
        if (barTooltipStats) barTooltipStats.classList.remove('hidden');
        if (barTooltipEmpty) barTooltipEmpty.classList.add('hidden');
        if (barMonth) barMonth.textContent = closest.month;
        if (barRate) barRate.textContent = closest.rate;
      }

      // Anchor tooltip cleanly centered above the active bar column
      const tooltipW = barTooltip.offsetWidth || 120;
      const barPixelX = (closest.center / 600) * containerRect.width;
      const clampedX = Math.max(10, Math.min(barPixelX - tooltipW / 2, containerRect.width - tooltipW - 10));

      barTooltip.style.left = `${clampedX}px`;
      barTooltip.style.top = '8px';
      barTooltip.style.opacity = '1';
    });

    barContainer.addEventListener('mouseleave', () => {
      barTooltip.style.opacity = '0';
      if (barMagneticCol) barMagneticCol.style.opacity = '0';
    });
  }
}

/**
 * Export Perfect Attendance Candidates List (CSV)
 */
function exportPerfectAttendanceList() {
  const candidates = [
    ["Student ID", "Student Name", "Section", "Attendance Rate", "Unexcused Absences", "Tardiness", "Honors Status"],
    ["2023-01102", "Dela Cruz, Mark", "BSIT 3A", "100.0%", "0 Days", "0 Late", "Eligible (Dean's Lister)"],
    ["2023-01458", "Santos, Maria Elena", "BSCS 2A", "100.0%", "0 Days", "0 Late", "Eligible (Dean's Lister)"],
    ["2023-01890", "Reyes, Joshua Paul", "BSIT 3B", "99.50%", "0 Days", "1 Late", "Honors Candidate"],
    ["2023-02031", "Bautista, Angel Mae", "BSIT 4A", "98.80%", "0 Days", "1 Late", "Honors Candidate"]
  ];

  const csvContent = "data:text/csv;charset=utf-8," + candidates.map(e => e.map(x => `"${x}"`).join(",")).join("\n");
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `Perfect_Attendance_Candidates_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  if (typeof showToast === 'function') {
    showToast('Candidates Exported', 'Perfect Attendance candidate list exported successfully (CSV)', 'success');
  }
}

window.exportPerfectAttendanceList = exportPerfectAttendanceList;

