/**
 * Reports & Export Module JavaScript
 * Handles dynamic report generation based on filter criteria, format selection,
 * real-time UI filtering, modal preview, and exporting.
 */

document.addEventListener('DOMContentLoaded', () => {
  let activeReportType = null;
  let activeFormat = null;

  // Active filter criteria state
  let activeFilters = {
    date: '2025-05-20',
    course: 'all',
    section: 'all',
    teacher: 'all',
    student: 'all',
  };

  // Master Student Records
  const masterStudents = [
    {
      id: 'STD-2026-001',
      name: 'Alexandra Gonzales',
      section: 'Grade 10 - Diamond',
      course: 'STEM',
      teacher: 'Mr. Juan Dela Cruz',
      timeIn: '07:15 AM',
      timeOut: '04:30 PM',
      status: 'Present',
      tardyMins: '0 mins',
      tardyOffense: 'None',
      absenceType: 'None',
      parentName: 'Maria Gonzales',
      parentPhone: '+63 917 111 2233',
      alertType: 'On-Time Arrival Confirmation',
      excuseControl: '—',
      excuseReason: '—',
      weeklyRates: ['Present', 'Present', 'Present', 'Present', 'Present', '100%']
    },
    {
      id: 'STD-2026-002',
      name: 'Brian Marquez',
      section: 'Grade 10 - Emerald',
      course: 'STEM',
      teacher: 'Ms. Ana Reyes',
      timeIn: '07:22 AM',
      timeOut: '04:30 PM',
      status: 'Present',
      tardyMins: '0 mins',
      tardyOffense: 'None',
      absenceType: 'None',
      parentName: 'George Marquez',
      parentPhone: '+63 917 222 3344',
      alertType: 'On-Time Arrival Confirmation',
      excuseControl: '—',
      excuseReason: '—',
      weeklyRates: ['Present', 'Present', 'Late', 'Present', 'Present', '98.5%']
    },
    {
      id: 'STD-2026-003',
      name: 'Catherine Diaz',
      section: 'Grade 10 - Diamond',
      course: 'ABM',
      teacher: 'Mr. Juan Dela Cruz',
      timeIn: '07:45 AM',
      timeOut: '04:30 PM',
      status: 'Late (15m)',
      tardyMins: '15 mins',
      tardyOffense: '1st Offense',
      absenceType: 'None',
      parentName: 'Maria Diaz',
      parentPhone: '+63 917 123 4567',
      alertType: 'Tardy Notification (15 mins)',
      excuseControl: '—',
      excuseReason: '—',
      weeklyRates: ['Late', 'Present', 'Present', 'Present', 'Present', '96.2%']
    },
    {
      id: 'STD-2026-004',
      name: 'David Lim',
      section: 'Grade 11 - Gold',
      course: 'BSIT',
      teacher: 'Ms. Liza Santos',
      timeIn: '07:10 AM',
      timeOut: '04:30 PM',
      status: 'Present',
      tardyMins: '0 mins',
      tardyOffense: 'None',
      absenceType: 'None',
      parentName: 'Henry Lim',
      parentPhone: '+63 917 444 5566',
      alertType: 'On-Time Arrival Confirmation',
      excuseControl: '—',
      excuseReason: '—',
      weeklyRates: ['Present', 'Present', 'Present', 'Present', 'Present', '100%']
    },
    {
      id: 'STD-2026-005',
      name: 'Evelyn Ramos',
      section: 'Grade 10 - Ruby',
      course: 'HUMSS',
      teacher: 'Mr. Pedro Cruz',
      timeIn: '—',
      timeOut: '—',
      status: 'Absent (Excused)',
      tardyMins: '0 mins',
      tardyOffense: 'None',
      absenceType: 'Excused',
      parentName: 'Elena Ramos',
      parentPhone: '+63 928 987 6543',
      alertType: 'Excused Absence Notice',
      excuseControl: 'EXC-2026-089',
      excuseReason: 'Medical / Dental Appointment',
      weeklyRates: ['Absent', 'Present', 'Present', 'Present', 'Present', '80.0%']
    },
    {
      id: 'STD-2026-006',
      name: 'Francis Torres',
      section: 'Grade 12 - Platinum',
      course: 'BSCS',
      teacher: 'Mr. Juan Dela Cruz',
      timeIn: '07:05 AM',
      timeOut: '04:30 PM',
      status: 'Present',
      tardyMins: '0 mins',
      tardyOffense: 'None',
      absenceType: 'None',
      parentName: 'Carlos Torres',
      parentPhone: '+63 917 666 7788',
      alertType: 'On-Time Arrival Confirmation',
      excuseControl: '—',
      excuseReason: '—',
      weeklyRates: ['Present', 'Present', 'Present', 'Present', 'Present', '100%']
    },
    {
      id: 'STD-2026-007',
      name: 'Grace Mendoza',
      section: 'Grade 11 - Silver',
      course: 'TVL',
      teacher: 'Mr. Roberto Gomez',
      timeIn: '07:50 AM',
      timeOut: '04:30 PM',
      status: 'Late (20m)',
      tardyMins: '20 mins',
      tardyOffense: '2nd Offense',
      absenceType: 'None',
      parentName: 'Theresa Mendoza',
      parentPhone: '+63 918 777 8899',
      alertType: 'Tardy Warning (2nd Incident)',
      excuseControl: '—',
      excuseReason: '—',
      weeklyRates: ['Present', 'Late', 'Present', 'Present', 'Present', '95.0%']
    },
    {
      id: 'STD-2026-008',
      name: 'Hannah Nicole Cruz',
      section: 'Grade 10 - Diamond',
      course: 'STEM',
      teacher: 'Mr. Juan Dela Cruz',
      timeIn: '07:18 AM',
      timeOut: '04:30 PM',
      status: 'Present',
      tardyMins: '0 mins',
      tardyOffense: 'None',
      absenceType: 'None',
      parentName: 'Ricardo Cruz',
      parentPhone: '+63 917 888 9900',
      alertType: 'On-Time Arrival Confirmation',
      excuseControl: '—',
      excuseReason: '—',
      weeklyRates: ['Present', 'Present', 'Present', 'Present', 'Present', '100%']
    }
  ];

  // Master Teacher Records
  const masterTeachers = [
    {
      name: 'Mr. Juan Dela Cruz',
      department: 'Science Department',
      courseAffiliation: 'STEM',
      advisingSection: 'Grade 10 - Diamond',
      timeIn: '06:55 AM',
      timeOut: '05:00 PM',
      totalHours: '10.08 hrs',
      remarks: 'On Time'
    },
    {
      name: 'Ms. Ana Reyes',
      department: 'Mathematics Department',
      courseAffiliation: 'BSED',
      advisingSection: 'Grade 10 - Emerald',
      timeIn: '07:05 AM',
      timeOut: '05:00 PM',
      totalHours: '9.92 hrs',
      remarks: 'On Time'
    },
    {
      name: 'Mr. Pedro Cruz',
      department: 'English Department',
      courseAffiliation: 'HUMSS',
      advisingSection: 'Grade 10 - Ruby',
      timeIn: '07:25 AM',
      timeOut: '05:00 PM',
      totalHours: '9.58 hrs',
      remarks: 'Tardy (10m)'
    },
    {
      name: 'Ms. Liza Santos',
      department: 'Information Technology',
      courseAffiliation: 'BSIT',
      advisingSection: 'Grade 11 - Gold',
      timeIn: '06:50 AM',
      timeOut: '05:00 PM',
      totalHours: '10.17 hrs',
      remarks: 'On Time'
    },
    {
      name: 'Mr. Roberto Gomez',
      department: 'Humanities Department',
      courseAffiliation: 'TVL',
      advisingSection: 'Grade 11 - Silver',
      timeIn: '07:10 AM',
      timeOut: '05:00 PM',
      totalHours: '9.83 hrs',
      remarks: 'On Time'
    }
  ];

  // Master Section Performance Data
  const masterSections = [
    { section: 'Grade 10 - Diamond', course: 'STEM', students: 45, present: '98.4%', tardy: '1.2%', absence: '0.4%', status: 'Exemplary' },
    { section: 'Grade 10 - Emerald', course: 'STEM', students: 42, present: '96.8%', tardy: '2.1%', absence: '1.1%', status: 'Satisfactory' },
    { section: 'Grade 10 - Ruby', course: 'HUMSS', students: 40, present: '93.5%', tardy: '4.2%', absence: '2.3%', status: 'Needs Attention' },
    { section: 'Grade 11 - Gold', course: 'BSIT', students: 38, present: '97.2%', tardy: '1.8%', absence: '1.0%', status: 'Exemplary' },
    { section: 'Grade 11 - Silver', course: 'TVL', students: 40, present: '95.0%', tardy: '3.1%', absence: '1.9%', status: 'Satisfactory' },
    { section: 'Grade 12 - Platinum', course: 'BSCS', students: 44, present: '99.1%', tardy: '0.7%', absence: '0.2%', status: 'Exemplary' }
  ];

  // Helper to format ISO Date (YYYY-MM-DD) to Display Date (MM/DD/YYYY)
  function formatDisplayDate(isoDate) {
    if (!isoDate) return '05/20/2025';
    const parts = isoDate.split('-');
    if (parts.length === 3) {
      return `${parts[1]}/${parts[2]}/${parts[0]}`;
    }
    return isoDate;
  }

  // Filter Helper: matches a student object against current active filters
  function studentMatchesFilters(student, filters) {
    if (filters.student !== 'all' && student.name !== filters.student) {
      return false;
    }
    if (filters.section !== 'all' && student.section !== filters.section) {
      return false;
    }
    if (filters.course !== 'all' && student.course !== filters.course) {
      return false;
    }
    if (filters.teacher !== 'all' && student.teacher !== filters.teacher) {
      return false;
    }
    return true;
  }

  // Dynamic Dataset Builder based on active report type & filter selections
  function buildDynamicDataset(reportType, filters) {
    const formattedDate = formatDisplayDate(filters.date);
    const matchingStudents = masterStudents.filter(s => studentMatchesFilters(s, filters));

    switch (reportType) {
      case 'daily': {
        const rows = matchingStudents.map((s, idx) => [
          String(idx + 1),
          s.id,
          s.name,
          s.section,
          s.timeIn,
          s.timeOut,
          s.status
        ]);
        return {
          title: 'Daily Attendance Report',
          columns: ['#', 'Student ID', 'Full Name', 'Section', 'Time In', 'Time Out', 'Status'],
          rows: rows
        };
      }

      case 'weekly': {
        const rows = matchingStudents.map((s, idx) => [
          String(idx + 1),
          s.name,
          s.section,
          ...s.weeklyRates
        ]);
        return {
          title: 'Weekly Attendance Summary Report',
          columns: ['#', 'Student Name', 'Section', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Weekly Rate'],
          rows: rows
        };
      }

      case 'monthly': {
        let sections = masterSections;
        if (filters.section !== 'all') {
          sections = sections.filter(sec => sec.section === filters.section);
        } else if (filters.course !== 'all') {
          sections = sections.filter(sec => sec.course === filters.course);
        }
        const rows = sections.map((sec, idx) => [
          String(idx + 1),
          sec.section,
          String(sec.students),
          sec.present,
          sec.tardy,
          sec.absence,
          sec.status
        ]);
        return {
          title: 'Monthly Attendance Overview',
          columns: ['#', 'Section / Grade', 'Total Students', 'Present Rate', 'Tardy Rate', 'Absence Rate', 'Status'],
          rows: rows
        };
      }

      case 'student': {
        if (filters.student !== 'all') {
          const targetStudent = masterStudents.find(s => s.name === filters.student) || masterStudents[0];
          const rows = [
            ['05/16/2025', targetStudent.name, targetStudent.section, '07:15 AM', '04:30 PM', 'Present', 'On Time'],
            ['05/17/2025', targetStudent.name, targetStudent.section, '07:18 AM', '04:30 PM', 'Present', 'On Time'],
            ['05/18/2025', targetStudent.name, targetStudent.section, '07:12 AM', '04:30 PM', 'Present', 'On Time'],
            ['05/19/2025', targetStudent.name, targetStudent.section, '07:14 AM', '04:30 PM', 'Present', 'On Time'],
            [formattedDate, targetStudent.name, targetStudent.section, targetStudent.timeIn, targetStudent.timeOut, targetStudent.status, 'Target Record']
          ];
          return {
            title: `Individual Attendance: ${targetStudent.name}`,
            columns: ['Date', 'Student Name', 'Section', 'Check-In', 'Check-Out', 'Status', 'Remarks'],
            rows: rows
          };
        } else {
          const rows = matchingStudents.map(s => [
            formattedDate,
            s.name,
            s.section,
            s.timeIn,
            s.timeOut,
            s.status,
            'Daily Check-in'
          ]);
          return {
            title: 'Individual Student Attendance Summary',
            columns: ['Date', 'Student Name', 'Section', 'Check-In', 'Check-Out', 'Status', 'Remarks'],
            rows: rows
          };
        }
      }

      case 'teacher': {
        let teachers = masterTeachers;
        if (filters.teacher !== 'all') {
          teachers = teachers.filter(t => t.name === filters.teacher);
        }
        if (filters.course !== 'all') {
          teachers = teachers.filter(t => t.courseAffiliation === filters.course);
        }
        if (filters.section !== 'all') {
          teachers = teachers.filter(t => t.advisingSection === filters.section);
        }

        const rows = teachers.map((t, idx) => [
          String(idx + 1),
          t.name,
          t.department,
          t.timeIn,
          t.timeOut,
          t.totalHours,
          t.remarks
        ]);
        return {
          title: 'Teacher Attendance Logs',
          columns: ['#', 'Teacher Name', 'Department', 'Time In', 'Time Out', 'Total Hours', 'Remarks'],
          rows: rows
        };
      }

      case 'tardy': {
        const tardyStudents = matchingStudents.filter(s => s.status.includes('Late'));
        const rows = tardyStudents.map((s, idx) => [
          String(idx + 1),
          s.name,
          s.section,
          formattedDate,
          s.timeIn,
          s.tardyMins,
          s.tardyOffense
        ]);
        return {
          title: 'Tardy / Late Attendance Report',
          columns: ['#', 'Student Name', 'Section', 'Date', 'Time In', 'Minutes Late', 'Incident Count'],
          rows: rows
        };
      }

      case 'absence': {
        const absentStudents = matchingStudents.filter(s => s.status.includes('Absent'));
        const rows = absentStudents.map((s, idx) => [
          String(idx + 1),
          s.name,
          s.section,
          formattedDate,
          s.absenceType,
          'Yes (SMS Sent)',
          'Verified'
        ]);
        return {
          title: 'Absence Records Report',
          columns: ['#', 'Student Name', 'Section', 'Absence Date', 'Type', 'Parent Contacted', 'Status'],
          rows: rows
        };
      }

      case 'excuse': {
        const excuseStudents = matchingStudents.filter(s => s.excuseControl !== '—');
        const rows = excuseStudents.map((s, idx) => [
          String(idx + 1),
          s.excuseControl,
          s.name,
          s.excuseReason,
          formattedDate,
          'Approved',
          'Admin User'
        ]);
        return {
          title: 'Excuse Slip Submissions Report',
          columns: ['#', 'Control #', 'Student Name', 'Reason', 'Period Covered', 'Status', 'Approved By'],
          rows: rows
        };
      }

      case 'parent': {
        const rows = matchingStudents.map((s, idx) => [
          String(idx + 1),
          s.name,
          s.parentName,
          s.alertType,
          s.parentPhone,
          `${formattedDate} ${s.timeIn !== '—' ? s.timeIn : '08:00 AM'}`,
          'Delivered (SMS)'
        ]);
        return {
          title: 'Parent Alert Notifications Report',
          columns: ['#', 'Student Name', 'Parent Name', 'Alert Type', 'Phone Number', 'Timestamp', 'Delivery Status'],
          rows: rows
        };
      }

      case 'analytics': {
        const totalScope = matchingStudents.length > 0 ? matchingStudents.length : 1;
        const presentCount = matchingStudents.filter(s => s.status.includes('Present')).length;
        const tardyCount = matchingStudents.filter(s => s.status.includes('Late')).length;
        const absentCount = matchingStudents.filter(s => s.status.includes('Absent')).length;
        const presentRate = ((presentCount / totalScope) * 100).toFixed(1);

        const rows = [
          ['Filtered Attendance Rate', `${totalScope} Evaluated`, `${presentRate}%`, '95.0%', presentRate >= 95 ? '+Optimal' : 'Needs Review'],
          ['On-Time Arrivals', `${presentCount} Students`, `${((presentCount / totalScope) * 100).toFixed(1)}%`, '92.0%', '+Optimal'],
          ['Tardy Incidents', `${tardyCount} Students`, `${((tardyCount / totalScope) * 100).toFixed(1)}%`, '< 5.0%', tardyCount > 0 ? 'Logged' : 'Zero Incidents'],
          ['Absence Instances', `${absentCount} Students`, `${((absentCount / totalScope) * 100).toFixed(1)}%`, '< 3.0%', absentCount > 0 ? 'Excused' : 'Zero Absences'],
          ['Active Scope Target', `${filters.section !== 'all' ? filters.section : filters.course !== 'all' ? filters.course : 'Institution-wide'}`, `${formattedDate}`, 'Daily Benchmark', 'Synchronized']
        ];
        return {
          title: 'Attendance Performance Analytics Report',
          columns: ['Metric Description', 'Total Count', 'Current Rate', 'Benchmark Target', 'Performance Delta'],
          rows: rows
        };
      }

      default:
        return {
          title: 'Attendance Report',
          columns: ['#', 'Student Name', 'Section', 'Status'],
          rows: matchingStudents.map((s, i) => [String(i + 1), s.name, s.section, s.status])
        };
    }
  }

  // Update Dynamic Active Filters Summary Bar
  function updateActiveFilterSummaryUI() {
    const summaryBar = document.getElementById('activeFiltersSummaryBar');
    const chipsContainer = document.getElementById('activeFilterChipsContainer');
    const filterBtnLabel = document.getElementById('filterBtnLabel');
    const filterBtn = document.getElementById('btnOpenFilterModal');

    if (!summaryBar || !chipsContainer) return;

    const chips = [];
    const formattedDate = formatDisplayDate(activeFilters.date);

    // Date chip if changed from default
    if (activeFilters.date && activeFilters.date !== '2025-05-20') {
      chips.push({ key: 'date', label: `Date: ${formattedDate}` });
    } else {
      chips.push({ key: 'date', label: `Date: ${formattedDate}` });
    }

    if (activeFilters.course !== 'all') {
      chips.push({ key: 'course', label: `Course: ${activeFilters.course}` });
    }
    if (activeFilters.section !== 'all') {
      chips.push({ key: 'section', label: `Section: ${activeFilters.section}` });
    }
    if (activeFilters.teacher !== 'all') {
      chips.push({ key: 'teacher', label: `Teacher: ${activeFilters.teacher}` });
    }
    if (activeFilters.student !== 'all') {
      chips.push({ key: 'student', label: `Student: ${activeFilters.student}` });
    }

    // Has custom non-date filter?
    const hasCustomFilters = activeFilters.course !== 'all' ||
      activeFilters.section !== 'all' ||
      activeFilters.teacher !== 'all' ||
      activeFilters.student !== 'all' ||
      activeFilters.date !== '2025-05-20';

    if (hasCustomFilters) {
      summaryBar.classList.remove('hidden');
      summaryBar.classList.add('flex');

      chipsContainer.innerHTML = chips.map(chip => `
        <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#eff6ff] text-[#0030c2] border border-[#bfdbfe] font-semibold text-[11px]">
          ${chip.label}
        </span>
      `).join('');

      if (filterBtnLabel) {
        filterBtnLabel.textContent = `Filter (${chips.length})`;
      }
      if (filterBtn) {
        filterBtn.classList.remove('bg-[#e7edff]', 'text-[#0030c2]');
        filterBtn.classList.add('bg-[#0030c2]', 'text-white');
      }
    } else {
      summaryBar.classList.add('hidden');
      summaryBar.classList.remove('flex');
      chipsContainer.innerHTML = '';

      if (filterBtnLabel) {
        filterBtnLabel.textContent = 'Filter';
      }
      if (filterBtn) {
        filterBtn.classList.add('bg-[#e7edff]', 'text-[#0030c2]');
        filterBtn.classList.remove('bg-[#0030c2]', 'text-white');
      }
    }
  }

  // Window-accessible function: Select Report Card
  window.selectReportCard = function (type) {
    activeReportType = type;
    const cards = document.querySelectorAll('.report-card');
    cards.forEach(card => {
      if (card.dataset.report === type) {
        card.classList.remove('border-[#e5e7eb]', 'bg-white');
        card.classList.add('border-2', 'border-[#0030c2]', 'bg-[#eff6ff]');
        const iconContainer = card.querySelector('div');
        if (iconContainer) {
          iconContainer.classList.remove('bg-[#eff6ff]');
          iconContainer.classList.add('bg-[#e7edff]');
        }
      } else {
        card.classList.remove('border-2', 'border-[#0030c2]', 'bg-[#eff6ff]');
        card.classList.add('border', 'border-[#e5e7eb]', 'bg-white');
        const iconContainer = card.querySelector('div');
        if (iconContainer) {
          iconContainer.classList.remove('bg-[#e7edff]');
          iconContainer.classList.add('bg-[#eff6ff]');
        }
      }
    });

    const dataset = buildDynamicDataset(type, activeFilters);
    if (dataset) {
      showToast("Report Selected", `Ready to generate ${dataset.title}.`, "info");
    }
  };

  // Window-accessible function: Select Export Format
  window.selectFormatOption = function (clickedCard, format) {
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

  // Window-accessible function: Clear Report & Format Selections
  window.clearReportSelections = function () {
    if (!activeReportType && !activeFormat) {
      showToast("No Selection", "There are currently no active selections to clear.", "info");
      return;
    }

    activeReportType = null;
    activeFormat = null;

    // Reset report cards
    const reportCards = document.querySelectorAll('.report-card');
    reportCards.forEach(card => {
      card.classList.remove('border-2', 'border-[#0030c2]', 'bg-[#eff6ff]');
      card.classList.add('border', 'border-[#e5e7eb]', 'bg-white');
      const iconContainer = card.querySelector('div');
      if (iconContainer) {
        iconContainer.classList.remove('bg-[#e7edff]');
        iconContainer.classList.add('bg-[#eff6ff]');
      }
    });

    // Reset format cards
    const formatCards = document.querySelectorAll('.format-card');
    formatCards.forEach(card => {
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

    showToast("Selections Cleared", "Report type and export format choices have been cleared.", "info");
  };

  // Filter Modal Controls
  const filterModal = document.getElementById('filterModal');

  window.openFilterModal = function () {
    if (filterModal) {
      // Sync form with activeFilters
      const dateInput = document.getElementById('filterDate');
      const courseSelect = document.getElementById('filterCourse');
      const sectionSelect = document.getElementById('filterSection');
      const teacherSelect = document.getElementById('filterTeacher');
      const studentSelect = document.getElementById('filterStudent');

      if (dateInput) dateInput.value = activeFilters.date || '2025-05-20';
      if (courseSelect) courseSelect.value = activeFilters.course || 'all';
      if (sectionSelect) sectionSelect.value = activeFilters.section || 'all';
      if (teacherSelect) teacherSelect.value = activeFilters.teacher || 'all';
      if (studentSelect) studentSelect.value = activeFilters.student || 'all';

      filterModal.classList.remove('hidden');
      filterModal.classList.add('flex');
    }
  };

  window.closeFilterModal = function () {
    if (filterModal) {
      filterModal.classList.add('hidden');
      filterModal.classList.remove('flex');
    }
  };

  // Window-accessible function: Apply Filters
  window.handleApplyFilters = function (event) {
    if (event) event.preventDefault();

    activeFilters.date = document.getElementById('filterDate')?.value || '2025-05-20';
    activeFilters.course = document.getElementById('filterCourse')?.value || 'all';
    activeFilters.section = document.getElementById('filterSection')?.value || 'all';
    activeFilters.teacher = document.getElementById('filterTeacher')?.value || 'all';
    activeFilters.student = document.getElementById('filterStudent')?.value || 'all';

    updateActiveFilterSummaryUI();
    window.closeFilterModal();

    const descParts = [];
    if (activeFilters.date) descParts.push(`Date: ${formatDisplayDate(activeFilters.date)}`);
    if (activeFilters.section !== 'all') descParts.push(`Section: ${activeFilters.section}`);
    if (activeFilters.student !== 'all') descParts.push(`Student: ${activeFilters.student}`);
    if (activeFilters.teacher !== 'all') descParts.push(`Teacher: ${activeFilters.teacher}`);
    if (activeFilters.course !== 'all') descParts.push(`Course: ${activeFilters.course}`);

    showToast("Filters Applied", `Dataset updated with criteria: ${descParts.join(' • ')}`, "success");
  };

  // Window-accessible function: Reset Filters
  window.handleResetFilters = function () {
    const form = document.getElementById('filtersForm');
    if (form) {
      if (document.getElementById('filterDate')) document.getElementById('filterDate').value = '2025-05-20';
      if (document.getElementById('filterCourse')) document.getElementById('filterCourse').value = 'all';
      if (document.getElementById('filterSection')) document.getElementById('filterSection').value = 'all';
      if (document.getElementById('filterTeacher')) document.getElementById('filterTeacher').value = 'all';
      if (document.getElementById('filterStudent')) document.getElementById('filterStudent').value = 'all';
    }

    activeFilters = {
      date: '2025-05-20',
      course: 'all',
      section: 'all',
      teacher: 'all',
      student: 'all',
    };

    updateActiveFilterSummaryUI();
    showToast("Filters Reset", "All filter fields have been restored to default values.", "info");
  };

  // Window-accessible function: Generate Report Trigger
  window.triggerGenerateReport = function () {
    if (!activeReportType) {
      showToast("Report Type Required", "Please select a report to generate from Available Reports.", "error");
      return;
    }
    if (!activeFormat) {
      showToast("Export Format Required", "Please choose an export format (CSV, Excel, or PDF).", "error");
      return;
    }

    const btn = document.getElementById('btnGenerateReport');
    const dataset = buildDynamicDataset(activeReportType, activeFilters);

    // Temporary button loading state
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = `
        <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
          Generate Report
        `;
      }

      openReportPreviewModal(dataset);
    }, 500);
  };

  // Preview Modal Handler
  function openReportPreviewModal(dataset) {
    const modal = document.getElementById('reportPreviewModal');
    if (!modal) return;

    const formattedDate = formatDisplayDate(activeFilters.date);

    document.getElementById('previewModalTitle').textContent = dataset.title;
    document.getElementById('previewModalSubtitle').textContent = `Generated for date: ${formattedDate}`;
    document.getElementById('previewReportBadge').textContent = dataset.title;
    document.getElementById('previewFormatLabel').textContent = activeFormat;
    document.getElementById('previewRowCount').textContent = dataset.rows.length;

    // Render Filter Chips inside preview modal
    const filterChipsEl = document.getElementById('previewFilterChips');
    if (filterChipsEl) {
      const criteriaList = [
        `Date: ${formattedDate}`,
        activeFilters.course !== 'all' ? `Course: ${activeFilters.course}` : null,
        activeFilters.section !== 'all' ? `Section: ${activeFilters.section}` : null,
        activeFilters.teacher !== 'all' ? `Teacher: ${activeFilters.teacher}` : null,
        activeFilters.student !== 'all' ? `Student: ${activeFilters.student}` : null,
      ].filter(Boolean);

      filterChipsEl.innerHTML = criteriaList.map(c => `
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
            <td colspan="${dataset.columns.length}" class="py-10 text-center text-gray-500">
              <svg class="w-8 h-8 text-gray-300 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              <p class="font-bold text-xs text-gray-700">No records found</p>
              <p class="text-[11px] text-gray-400 mt-0.5">No attendance entries match your active filter criteria.</p>
            </td>
          </tr>
        `;
      } else {
        tbody.innerHTML = dataset.rows.map(row => `
          <tr class="hover:bg-[#f8fafc] transition-colors">
            ${row.map(cell => `<td class="py-3 px-3 text-xs font-medium">${cell}</td>`).join('')}
          </tr>
        `).join('');
      }
    }

    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }

  window.closeReportPreviewModal = function () {
    const modal = document.getElementById('reportPreviewModal');
    if (modal) {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    }
  };

  window.downloadReportFile = function () {
    const dataset = buildDynamicDataset(activeReportType || 'daily', activeFilters);
    const filename = `${dataset.title.replace(/\s+/g, '_')}_${activeFormat.toLowerCase()}.${activeFormat.toLowerCase() === 'excel' ? 'xlsx' : activeFormat.toLowerCase()}`;

    window.closeReportPreviewModal();
    showToast("File Download Started", `Your report "${filename}" (${dataset.rows.length} rows) has been generated and downloaded.`, "success");
  };

  // Toast Notification System
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
      <button onclick="this.parentElement.remove()" class="text-gray-400 hover:text-gray-600 p-0.5 rounded-md hover:bg-gray-100">
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
});
