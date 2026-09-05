/**
 * Teacher Panel - Reports & Export Module JavaScript
 * Handles dynamic faculty report generation for grading and departmental submission.
 * Reference: docs/teacher_frontend.md (Section 1.11 Reports & Export)
 */

document.addEventListener('DOMContentLoaded', () => {
  // Active State
  let activeReportType = null;
  let activeFormat = null;

  // Active Filter Criteria
  let activeFilters = {
    subject: 'all',
    section: 'all',
    dateRange: 'current_term',
    student: 'all',
  };

  // Recent Exports Log
  let recentExports = [
    {
      id: 'EXP-2025-004',
      reportName: 'Class Master Attendance Sheet',
      subjectSection: 'IT301 · BSIT 3A',
      dateGenerated: 'May 27, 2025 · 09:15 AM',
      format: 'PDF',
      formatClass: 'bg-[#fee2e2] text-[#dc2626]',
      fileSize: '148 KB',
      rawDatasetType: 'master'
    },
    {
      id: 'EXP-2025-003',
      reportName: 'Subject Tardy/Absence Warning',
      subjectSection: 'CS201 · BSCS 2A',
      dateGenerated: 'May 26, 2025 · 04:30 PM',
      format: 'XLSX',
      formatClass: 'bg-[#dcfce7] text-[#16a34a]',
      fileSize: '42 KB',
      rawDatasetType: 'tardy'
    },
    {
      id: 'EXP-2025-002',
      reportName: 'Weekly Roll Call Log (May W3)',
      subjectSection: 'IT302 · BSIT 3B',
      dateGenerated: 'May 23, 2025 · 05:00 PM',
      format: 'CSV',
      formatClass: 'bg-[#dcfce7] text-[#16a34a]',
      fileSize: '18 KB',
      rawDatasetType: 'weekly'
    },
    {
      id: 'EXP-2025-001',
      reportName: 'Monthly Section Summary (April)',
      subjectSection: 'All Assigned Classes',
      dateGenerated: 'May 02, 2025 · 10:20 AM',
      format: 'PDF',
      formatClass: 'bg-[#fee2e2] text-[#dc2626]',
      fileSize: '210 KB',
      rawDatasetType: 'monthly'
    }
  ];

  // Master Enrolled Students Data Store for Mrs. Jane Dela Cruz
  const teacherStudents = [
    {
      id: '2022-00123',
      name: 'Alexandra Gonzales',
      section: 'BSIT 3A',
      subject: 'IT301 - Web Development',
      totalSessions: 24,
      present: 24,
      late: 0,
      absent: 0,
      excused: 0,
      rate: '100.0%',
      compliance: 'Eligible / Excellent',
      weekLogs: ['Present (07:15 AM)', 'Present (07:18 AM)', 'Present (07:12 AM)', 'Present (07:15 AM)', 'Present (07:20 AM)'],
      weekRate: '100.0%',
      rfidUid: 'E2-80-68-91',
      lastScanMethod: 'ESP32 RFID',
      lastScanTime: '07:15 AM'
    },
    {
      id: '2022-00145',
      name: 'Brian Marquez',
      section: 'BSIT 3A',
      subject: 'IT301 - Web Development',
      totalSessions: 24,
      present: 23,
      late: 1,
      absent: 0,
      excused: 0,
      rate: '97.9%',
      compliance: 'Eligible / Good',
      weekLogs: ['Present (07:22 AM)', 'Present (07:25 AM)', 'Late 10m (07:40 AM)', 'Present (07:19 AM)', 'Present (07:22 AM)'],
      weekRate: '96.5%',
      rfidUid: 'E2-80-68-92',
      lastScanMethod: 'ESP32 RFID',
      lastScanTime: '07:22 AM'
    },
    {
      id: '2022-00189',
      name: 'Catherine Diaz',
      section: 'BSIT 3A',
      subject: 'IT301 - Web Development',
      totalSessions: 24,
      present: 21,
      late: 2,
      absent: 1,
      excused: 0,
      rate: '91.7%',
      compliance: 'Eligible / Satisfactory',
      weekLogs: ['Late 15m (07:45 AM)', 'Present (07:28 AM)', 'Present (07:20 AM)', 'Present (07:25 AM)', 'Present (07:18 AM)'],
      weekRate: '94.0%',
      rfidUid: 'E2-80-68-93',
      lastScanMethod: 'QR Code',
      lastScanTime: '07:45 AM'
    },
    {
      id: '2022-00210',
      name: 'David Lim',
      section: 'BSIT 3A',
      subject: 'IT301 - Web Development',
      totalSessions: 24,
      present: 24,
      late: 0,
      absent: 0,
      excused: 0,
      rate: '100.0%',
      compliance: 'Eligible / Excellent',
      weekLogs: ['Present (07:10 AM)', 'Present (07:12 AM)', 'Present (07:14 AM)', 'Present (07:11 AM)', 'Present (07:10 AM)'],
      weekRate: '100.0%',
      rfidUid: 'E2-80-68-94',
      lastScanMethod: 'ESP32 RFID',
      lastScanTime: '07:10 AM'
    },
    {
      id: '2022-00244',
      name: 'Evelyn Ramos',
      section: 'BSIT 3B',
      subject: 'IT302 - Database Management',
      totalSessions: 24,
      present: 20,
      late: 1,
      absent: 2,
      excused: 1,
      rate: '85.4%',
      compliance: 'Eligible / Satisfactory',
      weekLogs: ['Excused Absence (EXC-089)', 'Present (09:15 AM)', 'Present (09:12 AM)', 'Present (09:14 AM)', 'Present (09:20 AM)'],
      weekRate: '88.0%',
      rfidUid: 'E2-80-68-95',
      lastScanMethod: 'QR Code',
      lastScanTime: '09:15 AM'
    },
    {
      id: '2022-00278',
      name: 'Francis Torres',
      section: 'BSIT 3B',
      subject: 'IT302 - Database Management',
      totalSessions: 24,
      present: 24,
      late: 0,
      absent: 0,
      excused: 0,
      rate: '100.0%',
      compliance: 'Eligible / Excellent',
      weekLogs: ['Present (09:05 AM)', 'Present (09:08 AM)', 'Present (09:06 AM)', 'Present (09:10 AM)', 'Present (09:05 AM)'],
      weekRate: '100.0%',
      rfidUid: 'E2-80-68-96',
      lastScanMethod: 'ESP32 RFID',
      lastScanTime: '09:05 AM'
    },
    {
      id: '2022-00301',
      name: 'Joshua Santos',
      section: 'BSIT 3B',
      subject: 'IT302 - Database Management',
      totalSessions: 24,
      present: 18,
      late: 3,
      absent: 3,
      excused: 0,
      rate: '79.2%',
      compliance: 'At Risk / Warning (20%)',
      weekLogs: ['Unexcused Absent', 'Late 25m (09:55 AM)', 'Present (09:18 AM)', 'Present (09:22 AM)', 'Present (09:25 AM)'],
      weekRate: '75.0%',
      rfidUid: 'E2-80-68-97',
      lastScanMethod: 'QR Code',
      lastScanTime: '09:55 AM'
    },
    {
      id: '2022-00312',
      name: 'Grace Mendoza',
      section: 'BSCS 2A',
      subject: 'CS201 - Data Structures',
      totalSessions: 24,
      present: 22,
      late: 2,
      absent: 0,
      excused: 0,
      rate: '95.8%',
      compliance: 'Eligible / Good',
      weekLogs: ['Present (01:10 PM)', 'Late 20m (01:50 PM)', 'Present (01:15 PM)', 'Present (01:12 PM)', 'Present (01:10 PM)'],
      weekRate: '95.0%',
      rfidUid: 'E2-80-68-98',
      lastScanMethod: 'ESP32 RFID',
      lastScanTime: '01:50 PM'
    },
    {
      id: '2022-00350',
      name: 'Hannah Nicole Cruz',
      section: 'BSCS 2A',
      subject: 'CS201 - Data Structures',
      totalSessions: 24,
      present: 24,
      late: 0,
      absent: 0,
      excused: 0,
      rate: '100.0%',
      compliance: 'Eligible / Excellent',
      weekLogs: ['Present (01:12 PM)', 'Present (01:15 PM)', 'Present (01:10 PM)', 'Present (01:14 PM)', 'Present (01:12 PM)'],
      weekRate: '100.0%',
      rfidUid: 'E2-80-68-99',
      lastScanMethod: 'ESP32 RFID',
      lastScanTime: '01:12 PM'
    },
    {
      id: '2022-00388',
      name: 'Ian Christopher Reyes',
      section: 'BSCS 2A',
      subject: 'CS201 - Data Structures',
      totalSessions: 24,
      present: 17,
      late: 2,
      absent: 5,
      excused: 0,
      rate: '72.9%',
      compliance: 'Critical / Exceeded 20%',
      weekLogs: ['Unexcused Absent', 'Unexcused Absent', 'Present (01:25 PM)', 'Late 15m (01:45 PM)', 'Present (01:20 PM)'],
      weekRate: '60.0%',
      rfidUid: 'E2-80-69-00',
      lastScanMethod: 'ESP32 RFID',
      lastScanTime: '01:45 PM'
    },
    {
      id: '2021-00412',
      name: 'Kenneth Tan',
      section: 'BSIT 4A',
      subject: 'IT401 - Capstone Project 1',
      totalSessions: 24,
      present: 23,
      late: 1,
      absent: 0,
      excused: 0,
      rate: '97.9%',
      compliance: 'Eligible / Good',
      weekLogs: ['Present (03:10 PM)', 'Present (03:15 PM)', 'Present (03:12 PM)', 'Present (03:14 PM)', 'Late 10m (03:40 PM)'],
      weekRate: '98.0%',
      rfidUid: 'E2-80-69-01',
      lastScanMethod: 'ESP32 RFID',
      lastScanTime: '03:40 PM'
    },
    {
      id: '2021-00455',
      name: 'Leila Joy Flores',
      section: 'BSIT 4A',
      subject: 'IT401 - Capstone Project 1',
      totalSessions: 24,
      present: 24,
      late: 0,
      absent: 0,
      excused: 0,
      rate: '100.0%',
      compliance: 'Eligible / Excellent',
      weekLogs: ['Present (03:05 PM)', 'Present (03:08 PM)', 'Present (03:05 PM)', 'Present (03:06 PM)', 'Present (03:10 PM)'],
      weekRate: '100.0%',
      rfidUid: 'E2-80-69-02',
      lastScanMethod: 'ESP32 RFID',
      lastScanTime: '03:05 PM'
    }
  ];

  // Render recent exports table
  function renderRecentExportsTable() {
    const tbody = document.getElementById('recentExportsTableBody');
    const counter = document.getElementById('historyCounterText');
    if (!tbody) return;

    if (counter) counter.textContent = `${recentExports.length} Exports Recorded`;

    tbody.innerHTML = recentExports.map((exp, idx) => `
      <tr class="hover:bg-[#f9fafb] transition-colors">
        <td class="py-3.5 px-4 font-bold text-xs text-[#111827]">
          <div class="flex items-center gap-2">
            <svg class="w-4 h-4 text-[#0030c2] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.75">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
            <span>${exp.reportName}</span>
          </div>
        </td>
        <td class="py-3.5 px-4 text-xs text-[#374151]">
          <span class="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-[#eff6ff] text-[#0030c2]">${exp.subjectSection}</span>
        </td>
        <td class="py-3.5 px-4 text-xs text-[#6b7280] font-mono">${exp.dateGenerated}</td>
        <td class="py-3.5 px-4 text-center">
          <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-black ${exp.formatClass}">
            ${exp.format}
          </span>
        </td>
        <td class="py-3.5 px-4 text-center text-xs font-mono text-[#4b5563]">${exp.fileSize}</td>
        <td class="py-3.5 px-4 text-center">
          <button onclick="handleReDownload('${exp.id}')"
            class="w-7 h-7 flex items-center justify-center rounded-lg bg-[#eff6ff] hover:bg-[#dbeafe] text-[#0030c2] transition-colors cursor-pointer mx-auto shadow-2xs"
            title="Re-download File" aria-label="Re-download File">
            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
          </button>
        </td>
      </tr>
    `).join('');
  }

  // Populate dynamic student dropdown based on section
  function populateStudentDropdown(selectedSection, currentSelectedStudent = 'all') {
    const studentSelect = document.getElementById('filterStudent');
    if (!studentSelect) return;

    let students = teacherStudents;
    if (selectedSection && selectedSection !== 'all') {
      students = teacherStudents.filter(s => s.section === selectedSection);
    }

    let optionsHtml = '<option value="all">All Enrolled Students</option>';
    students.forEach(s => {
      const isSelected = s.name === currentSelectedStudent ? 'selected' : '';
      optionsHtml += `<option value="${s.name}" ${isSelected}>${s.name} (${s.id}) · ${s.section}</option>`;
    });

    studentSelect.innerHTML = optionsHtml;
  }

  // Window-accessible: Section change inside filter modal
  window.handleSectionFilterChange = function() {
    const sec = document.getElementById('filterSection')?.value || 'all';
    populateStudentDropdown(sec);
  };

  // Window-accessible: Date preset change inside filter modal
  window.handleDateRangePresetChange = function() {
    const val = document.getElementById('filterDateRange')?.value;
    const customContainer = document.getElementById('customDateRangeInputs');
    if (!customContainer) return;

    if (val === 'custom') {
      customContainer.classList.remove('hidden');
      customContainer.classList.add('grid');
    } else {
      customContainer.classList.add('hidden');
      customContainer.classList.remove('grid');
    }
  };

  // Window-accessible: Select Report Card
  window.selectReportCard = function(type) {
    activeReportType = type;
    const cards = document.querySelectorAll('.report-card');
    cards.forEach(card => {
      const cardType = card.getAttribute('data-report');
      if (cardType === type) {
        card.classList.remove('border-[#e5e7eb]', 'bg-white');
        card.classList.add('border-2', 'border-[#0030c2]', 'bg-[#eff6ff]');
      } else {
        card.classList.remove('border-2', 'border-[#0030c2]', 'bg-[#eff6ff]');
        card.classList.add('border', 'border-[#e5e7eb]', 'bg-white');
      }
    });

    const dataset = buildTeacherDataset(type, activeFilters);
    if (dataset) {
      showToast('Report Selected', `Ready to configure and preview ${dataset.title}.`, 'info');
    }
  };

  // Window-accessible: Select Export Format
  window.selectFormatOption = function(clickedCard, format) {
    activeFormat = format;
    const formatCards = document.querySelectorAll('.format-card');
    formatCards.forEach(card => {
      const radio = card.querySelector('input[type="radio"]');
      const circle = card.querySelector('.radio-circle');
      const dot = circle ? circle.querySelector('div') : null;

      if (card === clickedCard) {
        if (radio) radio.checked = true;
        card.classList.remove('border-[#e5e7eb]', 'bg-white');
        card.classList.add('border-2', 'border-[#0030c2]', 'bg-[#eff6ff]');
        if (circle) {
          circle.classList.remove('border-[#d1d5db]', 'bg-white');
          circle.classList.add('border-[#0030c2]', 'bg-[#0030c2]');
        }
        if (dot) dot.classList.remove('hidden');
      } else {
        if (radio) radio.checked = false;
        card.classList.remove('border-2', 'border-[#0030c2]', 'bg-[#eff6ff]');
        card.classList.add('border', 'border-[#e5e7eb]', 'bg-white');
        if (circle) {
          circle.classList.remove('border-[#0030c2]', 'bg-[#0030c2]');
          circle.classList.add('border-[#d1d5db]', 'bg-white');
        }
        if (dot) dot.classList.add('hidden');
      }
    });
  };

  // Window-accessible: Clear Report & Format Selections
  window.clearReportSelections = function() {
    if (!activeReportType && !activeFormat) {
      showToast('No Active Selections', 'Select a report and an export format to proceed.', 'info');
      return;
    }

    activeReportType = null;
    activeFormat = null;

    // Reset report cards
    document.querySelectorAll('.report-card').forEach(card => {
      card.classList.remove('border-2', 'border-[#0030c2]', 'bg-[#eff6ff]');
      card.classList.add('border', 'border-[#e5e7eb]', 'bg-white');
    });

    // Reset format cards
    document.querySelectorAll('.format-card').forEach(card => {
      const radio = card.querySelector('input[type="radio"]');
      if (radio) radio.checked = false;
      card.classList.remove('border-2', 'border-[#0030c2]', 'bg-[#eff6ff]');
      card.classList.add('border', 'border-[#e5e7eb]', 'bg-white');
      const circle = card.querySelector('.radio-circle');
      if (circle) {
        circle.classList.remove('border-[#0030c2]', 'bg-[#0030c2]');
        circle.classList.add('border-[#d1d5db]', 'bg-white');
      }
      const dot = circle ? circle.querySelector('div') : null;
      if (dot) dot.classList.add('hidden');
    });

    showToast('Selections Cleared', 'Report type and format choices have been reset.', 'info');
  };

  // Filter Modal Controls
  window.openFilterModal = function() {
    const modal = document.getElementById('filterModal');
    if (!modal) return;

    const subSelect = document.getElementById('filterSubject');
    const secSelect = document.getElementById('filterSection');
    const dateSelect = document.getElementById('filterDateRange');

    if (subSelect) subSelect.value = activeFilters.subject || 'all';
    if (secSelect) {
      secSelect.value = activeFilters.section || 'all';
      populateStudentDropdown(activeFilters.section, activeFilters.student);
    }
    if (dateSelect) {
      dateSelect.value = activeFilters.dateRange || 'current_term';
      window.handleDateRangePresetChange();
    }

    modal.classList.remove('hidden');
    modal.classList.add('flex');
  };

  window.closeFilterModal = function() {
    const modal = document.getElementById('filterModal');
    if (modal) {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    }
  };

  // Apply Filters
  window.handleApplyFilters = function(event) {
    if (event) event.preventDefault();

    activeFilters.subject = document.getElementById('filterSubject')?.value || 'all';
    activeFilters.section = document.getElementById('filterSection')?.value || 'all';
    activeFilters.dateRange = document.getElementById('filterDateRange')?.value || 'current_term';
    activeFilters.student = document.getElementById('filterStudent')?.value || 'all';

    if (activeFilters.dateRange === 'custom') {
      activeFilters.startDate = document.getElementById('filterStartDate')?.value || '2025-01-15';
      activeFilters.endDate = document.getElementById('filterEndDate')?.value || '2025-05-27';
    }

    updateActiveFilterSummaryUI();
    window.closeFilterModal();

    showToast('Filter Applied', 'Report parameters updated for class roster compilation.', 'success');
  };

  // Reset Filters
  window.handleResetFilters = function() {
    const form = document.getElementById('filtersForm');
    if (form) {
      if (document.getElementById('filterSubject')) document.getElementById('filterSubject').value = 'all';
      if (document.getElementById('filterSection')) document.getElementById('filterSection').value = 'all';
      if (document.getElementById('filterDateRange')) document.getElementById('filterDateRange').value = 'current_term';
      if (document.getElementById('filterStudent')) document.getElementById('filterStudent').value = 'all';
    }

    activeFilters = {
      subject: 'all',
      section: 'all',
      dateRange: 'current_term',
      student: 'all'
    };

    updateActiveFilterSummaryUI();
    showToast('Filters Reset', 'All filter parameters restored to default full semester view.', 'info');
  };

  function updateActiveFilterSummaryUI() {
    const bar = document.getElementById('activeFiltersSummaryBar');
    const container = document.getElementById('activeFilterChipsContainer');
    const label = document.getElementById('filterBtnLabel');
    if (!bar || !container) return;

    const chips = [];

    if (activeFilters.subject !== 'all') {
      chips.push({ key: 'subject', label: `Subject: ${activeFilters.subject}` });
    }
    if (activeFilters.section !== 'all') {
      chips.push({ key: 'section', label: `Section: ${activeFilters.section}` });
    }
    if (activeFilters.dateRange !== 'current_term') {
      const dateLabels = {
        this_month: 'Current Month (May 2025)',
        this_week: 'Current Week',
        today: 'Today Only'
      };
      chips.push({ key: 'dateRange', label: `Period: ${dateLabels[activeFilters.dateRange] || activeFilters.dateRange}` });
    }
    if (activeFilters.student !== 'all') {
      chips.push({ key: 'student', label: `Student: ${activeFilters.student}` });
    }

    if (chips.length === 0) {
      bar.classList.add('hidden');
      bar.classList.remove('flex');
      if (label) label.textContent = 'Filter Criteria';
    } else {
      bar.classList.remove('hidden');
      bar.classList.add('flex');
      if (label) label.textContent = `Filtered (${chips.length})`;

      container.innerHTML = chips.map(c => `
        <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-[#bfdbfe] text-[#0030c2] font-semibold text-[11px] shadow-2xs">
          <span>${c.label}</span>
          <button type="button" onclick="removeFilterChip('${c.key}')" class="hover:text-red-500 cursor-pointer">
            <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </span>
      `).join('');
    }
  }

  window.removeFilterChip = function(key) {
    if (key === 'subject') activeFilters.subject = 'all';
    if (key === 'section') activeFilters.section = 'all';
    if (key === 'dateRange') activeFilters.dateRange = 'current_term';
    if (key === 'student') activeFilters.student = 'all';

    updateActiveFilterSummaryUI();
    showToast('Filter Updated', `Removed ${key} filter parameter.`, 'info');
  };

  // Compile Dynamic Report Dataset based on Type & Filters
  function buildTeacherDataset(type, filters) {
    // 1. Filter students
    let filteredStudents = teacherStudents.filter(s => {
      if (filters.subject !== 'all' && !s.subject.includes(filters.subject.split(' - ')[0])) return false;
      if (filters.section !== 'all' && s.section !== filters.section) return false;
      if (filters.student !== 'all' && s.name !== filters.student) return false;
      return true;
    });

    const includePercentages = document.getElementById('optIncludePercentages')?.checked ?? true;
    const includeTimestamps = document.getElementById('optIncludeTimestamps')?.checked ?? true;
    const includeSignatures = document.getElementById('optIncludeSignatures')?.checked ?? true;

    // Toggle signature block visibility in modal
    const sigBlock = document.getElementById('previewSignatoryBlock');
    if (sigBlock) {
      if (includeSignatures) sigBlock.classList.remove('hidden');
      else sigBlock.classList.add('hidden');
    }

    if (type === 'master') {
      const columns = [
        '#',
        'Student ID',
        'Student Name',
        'Section',
        'Subject',
        'Sessions',
        'Present',
        'Late',
        'Absent',
        'Excused'
      ];
      if (includePercentages) columns.push('Attendance %');
      columns.push('Compliance Status');

      const rows = filteredStudents.map((s, idx) => {
        const row = [
          idx + 1,
          `<span class="font-mono font-bold text-[#0030c2]">${s.id}</span>`,
          `<span class="font-bold text-[#111827]">${s.name}</span>`,
          `<span class="px-1.5 py-0.5 rounded text-[11px] font-bold bg-[#eff6ff] text-[#0030c2]">${s.section}</span>`,
          `<span class="truncate max-w-[150px] font-medium">${s.subject}</span>`,
          s.totalSessions,
          `<span class="font-bold text-[#16a34a]">${s.present}</span>`,
          `<span class="font-bold ${s.late > 0 ? 'text-amber-600' : 'text-gray-500'}">${s.late}</span>`,
          `<span class="font-bold ${s.absent > 0 ? 'text-red-600' : 'text-gray-500'}">${s.absent}</span>`,
          `<span class="font-bold text-[#0030c2]">${s.excused}</span>`
        ];
        if (includePercentages) {
          row.push(`<span class="font-black ${parseFloat(s.rate) >= 90 ? 'text-[#16a34a]' : 'text-amber-600'}">${s.rate}</span>`);
        }
        let complianceBadge = `<span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#f0fdf4] text-[#15803d]">Eligible ✓</span>`;
        if (s.compliance.includes('At Risk')) {
          complianceBadge = `<span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">Warning (20%)</span>`;
        } else if (s.compliance.includes('Critical')) {
          complianceBadge = `<span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-50 text-red-700 border border-red-200">Exceeded 20%</span>`;
        }
        row.push(complianceBadge);
        return row;
      });

      return {
        title: 'Class Master Attendance Sheet',
        columns,
        rows,
        rawRows: filteredStudents
      };
    }

    if (type === 'weekly') {
      const columns = [
        '#',
        'Student ID',
        'Student Name',
        'Section',
        'Mon (05/26)',
        'Tue (05/27)',
        'Wed (05/28)',
        'Thu (05/29)',
        'Fri (05/30)',
        'Weekly %'
      ];

      const rows = filteredStudents.map((s, idx) => [
        idx + 1,
        `<span class="font-mono font-bold text-[#0030c2]">${s.id}</span>`,
        `<span class="font-bold text-[#111827]">${s.name}</span>`,
        `<span class="px-1.5 py-0.5 rounded text-[11px] font-bold bg-[#eff6ff] text-[#0030c2]">${s.section}</span>`,
        `<span class="text-[11px] font-medium">${s.weekLogs[0]}</span>`,
        `<span class="text-[11px] font-medium">${s.weekLogs[1]}</span>`,
        `<span class="text-[11px] font-medium">${s.weekLogs[2]}</span>`,
        `<span class="text-[11px] font-medium">${s.weekLogs[3]}</span>`,
        `<span class="text-[11px] font-medium">${s.weekLogs[4]}</span>`,
        `<span class="font-black text-[#16a34a]">${s.weekRate}</span>`
      ]);

      return {
        title: 'Weekly Roll Call Log',
        columns,
        rows,
        rawRows: filteredStudents
      };
    }

    if (type === 'monthly') {
      const columns = [
        'Section',
        'Subject',
        'Calendar Month',
        'Enrolled',
        'Sessions Held',
        'Present Rate',
        'Tardy Rate',
        'Unexcused Absent',
        'Section Average'
      ];

      const sectionsSummary = [
        { section: 'BSIT 3A', subject: 'IT301 - Web Development', month: 'May 2025', enrolled: 38, sessions: 24, pres: '96.2%', tard: '2.8%', abs: '1.0%', avg: '96.2%' },
        { section: 'BSIT 3B', subject: 'IT302 - Database Systems', month: 'May 2025', enrolled: 36, sessions: 24, pres: '94.5%', tard: '3.5%', abs: '2.0%', avg: '94.5%' },
        { section: 'BSCS 2A', subject: 'CS201 - Data Structures', month: 'May 2025', enrolled: 34, sessions: 24, pres: '93.8%', tard: '4.0%', abs: '2.2%', avg: '93.8%' },
        { section: 'BSIT 4A', subject: 'IT401 - Capstone Project', month: 'May 2025', enrolled: 34, sessions: 24, pres: '98.1%', tard: '1.2%', abs: '0.7%', avg: '98.1%' }
      ];

      const rows = sectionsSummary.map(sec => [
        `<span class="px-2 py-0.5 rounded text-[11px] font-bold bg-[#eff6ff] text-[#0030c2]">${sec.section}</span>`,
        `<span class="font-semibold text-[#111827]">${sec.subject}</span>`,
        sec.month,
        sec.enrolled,
        sec.sessions,
        `<span class="font-bold text-[#16a34a]">${sec.pres}</span>`,
        `<span class="font-bold text-amber-600">${sec.tard}</span>`,
        `<span class="font-bold text-red-600">${sec.abs}</span>`,
        `<span class="font-black text-[#0030c2]">${sec.avg}</span>`
      ]);

      return {
        title: 'Monthly Section Summary',
        columns,
        rows,
        rawRows: sectionsSummary
      };
    }

    if (type === 'student') {
      const columns = [
        '#',
        'Student ID',
        'Student Name',
        'Class Section',
        'Subject',
        'Scan Method',
        'RFID Card UID',
        'Recorded Time',
        'Status'
      ];

      const rows = filteredStudents.map((s, idx) => [
        idx + 1,
        `<span class="font-mono font-bold text-[#0030c2]">${s.id}</span>`,
        `<span class="font-bold text-[#111827]">${s.name}</span>`,
        `<span class="px-1.5 py-0.5 rounded text-[11px] font-bold bg-[#eff6ff] text-[#0030c2]">${s.section}</span>`,
        s.subject,
        `<span class="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-blue-50 text-blue-700">${s.lastScanMethod}</span>`,
        `<span class="font-mono text-[#4b5563]">${s.rfidUid}</span>`,
        `<span class="font-mono font-semibold">${includeTimestamps ? s.lastScanTime : 'Confidential'}</span>`,
        `<span class="font-bold text-[#16a34a]">Present</span>`
      ]);

      return {
        title: 'Student-by-Student Attendance Summary',
        columns,
        rows,
        rawRows: filteredStudents
      };
    }

    if (type === 'tardy') {
      const columns = [
        'Student ID',
        'Student Name',
        'Section',
        'Subject',
        'Total Tardy',
        'Unexcused Absences',
        'Absence %',
        'Max Threshold (20%)',
        'Action Status'
      ];

      // Highlight students with tardy or absences
      const atRiskStudents = filteredStudents.filter(s => s.late > 0 || s.absent > 0);
      const displayPool = atRiskStudents.length > 0 ? atRiskStudents : filteredStudents.slice(0, 5);

      const rows = displayPool.map(s => {
        const absPercent = ((s.absent / s.totalSessions) * 100).toFixed(1) + '%';
        let actionBadge = `<span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-700">Good Standing</span>`;
        if (s.absent >= 4) {
          actionBadge = `<span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-700">Notice to Guidance</span>`;
        } else if (s.absent >= 2 || s.late >= 2) {
          actionBadge = `<span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">Faculty Counseling</span>`;
        }

        return [
          `<span class="font-mono font-bold text-[#0030c2]">${s.id}</span>`,
          `<span class="font-bold text-[#111827]">${s.name}</span>`,
          `<span class="px-1.5 py-0.5 rounded text-[11px] font-bold bg-[#eff6ff] text-[#0030c2]">${s.section}</span>`,
          s.subject,
          `<span class="font-bold ${s.late > 0 ? 'text-amber-600' : 'text-gray-500'}">${s.late} sessions</span>`,
          `<span class="font-bold ${s.absent > 0 ? 'text-red-600' : 'text-gray-500'}">${s.absent} sessions</span>`,
          `<span class="font-black text-red-600">${absPercent}</span>`,
          `<span class="font-mono text-gray-500">4.8 sessions (20%)</span>`,
          actionBadge
        ];
      });

      return {
        title: 'Subject Tardy / Absence Warning Report',
        columns,
        rows,
        rawRows: displayPool
      };
    }

    return null;
  }

  // Trigger Generate Report
  window.triggerGenerateReport = function() {
    if (!activeReportType) {
      showToast('Report Type Required', 'Please click and select an Available Report card first.', 'error');
      return;
    }
    if (!activeFormat) {
      showToast('Export Format Required', 'Please select CSV, Excel, or PDF format.', 'error');
      return;
    }

    const btn = document.getElementById('btnGenerateReport');
    const dataset = buildTeacherDataset(activeReportType, activeFilters);

    if (btn) {
      btn.disabled = true;
      btn.innerHTML = `
        <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Compiling ${activeFormat}...
      `;
    }

    setTimeout(() => {
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = `
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m.75 12l3 3m0 0l3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          </svg>
          Preview &amp; Generate Report
        `;
      }

      openReportPreviewModal(dataset);
    }, 450);
  };

  // Open Preview Modal
  function openReportPreviewModal(dataset) {
    const modal = document.getElementById('reportPreviewModal');
    if (!modal || !dataset) return;

    document.getElementById('previewModalTitle').textContent = dataset.title;
    document.getElementById('previewReportBadge').textContent = dataset.title;
    document.getElementById('previewFormatLabel').textContent = activeFormat;
    document.getElementById('previewRowCount').textContent = dataset.rows.length;
    document.getElementById('previewSectionLabel').textContent = activeFilters.section === 'all' ? 'All Assigned Classes' : activeFilters.section;

    // Filter Chips inside preview
    const chipsEl = document.getElementById('previewFilterChips');
    if (chipsEl) {
      const criteria = [
        `Section: ${activeFilters.section === 'all' ? 'All Sections' : activeFilters.section}`,
        `Subject: ${activeFilters.subject === 'all' ? 'All Subjects' : activeFilters.subject}`,
        `Period: 2nd Semester 2024-2025`
      ];
      if (activeFilters.student !== 'all') criteria.push(`Student: ${activeFilters.student}`);

      chipsEl.innerHTML = criteria.map(c => `
        <span class="inline-flex items-center px-2 py-0.5 rounded bg-white text-[#0030c2] border border-[#bfdbfe] text-[10px] font-bold">
          ${c}
        </span>
      `).join('');
    }

    // Render Table Head
    const thead = document.getElementById('previewTableHead');
    if (thead) {
      thead.innerHTML = dataset.columns.map(col => `<th class="py-3 px-3">${col}</th>`).join('');
    }

    // Render Table Body
    const tbody = document.getElementById('previewTableBody');
    if (tbody) {
      if (dataset.rows.length === 0) {
        tbody.innerHTML = `
          <tr>
            <td colspan="${dataset.columns.length}" class="py-8 text-center text-gray-500">
              No matching class attendance records found for active criteria.
            </td>
          </tr>
        `;
      } else {
        tbody.innerHTML = dataset.rows.map(row => `
          <tr class="hover:bg-[#f9fafb] transition-colors">
            ${row.map(cell => `<td class="py-3 px-3 text-xs">${cell}</td>`).join('')}
          </tr>
        `).join('');
      }
    }

    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }

  window.closeReportPreviewModal = function() {
    const modal = document.getElementById('reportPreviewModal');
    if (modal) {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    }
  };

  // Download Report File
  window.downloadReportFile = function() {
    const dataset = buildTeacherDataset(activeReportType || 'master', activeFilters);
    if (!dataset) return;

    const fileFormat = (activeFormat || 'CSV').toUpperCase();
    const timestamp = '20250527';
    const cleanTitle = dataset.title.replace(/[\s\/]+/g, '_');
    const filename = `BCP_${cleanTitle}_${activeFilters.section === 'all' ? 'AllClasses' : activeFilters.section}_${timestamp}.${fileFormat === 'EXCEL' ? 'xlsx' : fileFormat.toLowerCase()}`;

    if (fileFormat === 'CSV') {
      // Generate clean CSV content with institutional header
      const headerLines = [
        `"BESTLINK COLLEGE OF THE PHILIPPINES"`,
        `"COLLEGE OF COMPUTER STUDIES - ATTENDANCE MONITORING SYSTEM"`,
        `"Report Title:","${dataset.title}"`,
        `"Faculty Instructor:","Mrs. Jane Dela Cruz, LPT"`,
        `"Academic Term:","2nd Semester, A.Y. 2024-2025"`,
        `"Assigned Scope:","${activeFilters.section === 'all' ? 'All Assigned Sections' : activeFilters.section}"`,
        `"Date Exported:","May 27, 2025"`,
        `""`
      ];

      const plainHeaders = dataset.columns.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',');
      const plainRows = dataset.rows.map(row => {
        return row.map(cell => {
          const stripped = String(cell).replace(/<[^>]+>/g, '').trim();
          return `"${stripped.replace(/"/g, '""')}"`;
        }).join(',');
      }).join('\r\n');

      const csvContent = '\uFEFF' + headerLines.join('\r\n') + '\r\n' + plainHeaders + '\r\n' + plainRows;
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      triggerBrowserDownload(blob, filename);
    } else if (fileFormat === 'EXCEL') {
      // Generate Excel-compatible HTML spreadsheet
      const tableHeadHtml = dataset.columns.map(c => `<th style="background:#0030c2;color:#ffffff;padding:8px;border:1px solid #ddd;font-family:sans-serif;font-size:12px;">${c}</th>`).join('');
      const tableBodyHtml = dataset.rows.map(row => {
        return `<tr>${row.map(cell => `<td style="padding:6px 8px;border:1px solid #e5e7eb;font-family:sans-serif;font-size:11px;">${String(cell).replace(/<[^>]+>/g, '').trim()}</td>`).join('')}</tr>`;
      }).join('');

      const excelHtml = `
        <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
        <head><meta charset="utf-8"><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>${cleanTitle.substring(0, 30)}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head>
        <body style="font-family:sans-serif;">
          <div style="margin-bottom:12px;">
            <h2 style="color:#0030c2;margin:0 0 4px 0;">BESTLINK COLLEGE OF THE PHILIPPINES</h2>
            <p style="margin:0;font-size:12px;color:#4b5563;">College of Computer Studies · Attendance Monitoring System</p>
            <p style="margin:4px 0 0 0;font-size:11px;color:#6b7280;"><strong>Report:</strong> ${dataset.title} | <strong>Faculty:</strong> Mrs. Jane Dela Cruz | <strong>Term:</strong> 2nd Semester, A.Y. 2024-2025</p>
          </div>
          <table border="1" cellpadding="5" cellspacing="0" style="border-collapse:collapse;width:100%;">
            <thead><tr>${tableHeadHtml}</tr></thead>
            <tbody>${tableBodyHtml}</tbody>
          </table>
        </body>
        </html>
      `;

      const blob = new Blob([excelHtml], { type: 'application/vnd.ms-excel;charset=utf-8;' });
      triggerBrowserDownload(blob, filename);
    } else if (fileFormat === 'PDF') {
      // For PDF format, open preview modal and trigger browser print dialog
      openReportPreviewModal(dataset);
      setTimeout(() => {
        window.print();
      }, 300);
    }

    // Add to Recent Exports table
    const newEntry = {
      id: `EXP-2025-00${recentExports.length + 1}`,
      reportName: dataset.title,
      subjectSection: activeFilters.section === 'all' ? 'All Assigned Classes' : activeFilters.section,
      dateGenerated: 'May 27, 2025 · Just Now',
      format: fileFormat,
      formatClass: fileFormat === 'PDF' ? 'bg-[#fee2e2] text-[#dc2626]' : 'bg-[#dcfce7] text-[#16a34a]',
      fileSize: fileFormat === 'PDF' ? '184 KB' : fileFormat === 'EXCEL' ? '46 KB' : '22 KB',
      rawDatasetType: activeReportType || 'master'
    };

    recentExports.unshift(newEntry);
    renderRecentExportsTable();

    window.closeReportPreviewModal();
    showToast('Download Completed', `Successfully exported "${filename}".`, 'success');
  };

  function triggerBrowserDownload(blob, filename) {
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  // Window-accessible: Re-download previous export
  window.handleReDownload = function(exportId) {
    const item = recentExports.find(e => e.id === exportId);
    if (!item) return;

    activeReportType = item.rawDatasetType;
    activeFormat = item.format;
    window.downloadReportFile();
  };

  // Toast System
  function showToast(title, message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `pointer-events-auto flex items-start gap-3 p-4 rounded-xl bg-white border border-[#e5e7eb] shadow-xl text-xs max-w-sm w-full transition-all transform duration-300 translate-y-4 opacity-0`;

    let iconBg = 'bg-blue-100 text-[#0030c2]';
    let iconSvg = `<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`;

    if (type === 'success') {
      iconBg = 'bg-[#f0fdf4] text-[#16a34a] border border-[#bbf7d0]';
      iconSvg = `<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>`;
    } else if (type === 'error') {
      iconBg = 'bg-red-100 text-red-600 border border-red-200';
      iconSvg = `<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>`;
    }

    toast.innerHTML = `
      <div class="w-7 h-7 rounded-lg ${iconBg} flex items-center justify-center shrink-0 mt-0.5">
        ${iconSvg}
      </div>
      <div class="flex-1 min-w-0">
        <h4 class="font-bold text-[#111827] text-xs leading-tight">${title}</h4>
        <p class="text-[11px] text-[#6b7280] mt-0.5 leading-snug">${message}</p>
      </div>
      <button onclick="this.parentElement.remove()" class="text-gray-400 hover:text-gray-600 p-0.5 rounded-md hover:bg-gray-100 cursor-pointer">
        <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
      </button>
    `;

    container.appendChild(toast);

    requestAnimationFrame(() => {
      toast.classList.remove('translate-y-4', 'opacity-0');
      toast.classList.add('translate-y-0', 'opacity-100');
    });

    setTimeout(() => {
      toast.classList.remove('translate-y-0', 'opacity-100');
      toast.classList.add('translate-y-4', 'opacity-0');
      setTimeout(() => toast.remove(), 300);
    }, 4500);
  }

  // Initialize on load (clean unselected state, ready for hover and user click)
  populateStudentDropdown('all');

  const dateBtn = document.getElementById('currentDateDisplay');
  if (dateBtn) {
    dateBtn.addEventListener('click', () => {
      showToast('Academic Calendar', 'Current Date: May 27, 2025 (Tuesday) · 2nd Semester Grading Term', 'info');
    });
  }

  renderRecentExportsTable();
});
