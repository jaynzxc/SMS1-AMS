/**
 * Bestlink College of the Philippines
 * Attendance Monitoring System - Student Perfect Attendance Award Module
 * File: assets/js/student/perfect-attendance.js
 * 
 * Consistent with student/attendance-calendar.html UI/UX design patterns
 */

// State Management
let currentSemesterKey = '1ST_SEM_2026';
let currentSubjectFilter = 'ALL';

// Mock Data Store for Student Juan Dela Cruz (BSIT 3A)
const perfectAttendanceData = {
  '1ST_SEM_2026': {
    termLabel: '1st Semester AY 2026–2027',
    standing: 'Eligible',
    standingBadgeClass: 'bg-[#f0fdf4] text-[#16a34a] border-[#bbf7d0]',
    standingText: 'Eligible Candidate',
    congratulationsNote: 'You have maintained 100% attendance across all enrolled courses!',
    attendanceRate: '100.0%',
    sessionsText: '36 / 36 Valid sessions',
    latesCount: '0 Lates',
    latesSubtext: 'Limit: ≤ 2 allowable',
    absencesCount: '0 Days',
    absencesSubtext: 'Flawless zero record',
    awardsCount: '2 Awards',
    awardsSubtext: 'Past terms certified',
    termMilestone: 'Week 15 of 18 (83.3% Term Progress)',
    progressPct: '83.3%',
    courses: [
      {
        code: 'IT301',
        section: 'BSIT 3A',
        title: 'IT301 - Web Systems & Technologies',
        instructor: 'Mrs. Jane Dela Cruz',
        instructorRole: 'Professor',
        schedule: 'Mon/Wed 08:00 AM – 10:00 AM',
        room: 'Lab 304',
        sessions: 10,
        attended: 10,
        lates: 0,
        absences: 0,
        excused: 0,
        rate: '100.0%',
        punctuality: '0 Lates • Flawless',
        method: 'RFID & Dynamic QR',
        status: 'Eligible',
        remarks: 'Student completed all assigned laboratory periods with zero tardiness and 100% verified RFID hardware scans. Meets all institutional criteria for the Perfect Attendance Certificate.'
      },
      {
        code: 'CS201',
        section: 'BSIT 3A',
        title: 'CS201 - Data Structures & Algorithms',
        instructor: 'Mr. Carlo Reyes',
        instructorRole: 'Professor',
        schedule: 'Tue/Thu 10:30 AM – 12:30 PM',
        room: 'Room CS-201',
        sessions: 10,
        attended: 10,
        lates: 0,
        absences: 0,
        excused: 0,
        rate: '100.0%',
        punctuality: '0 Lates • Flawless',
        method: 'Dynamic QR Code',
        status: 'Eligible',
        remarks: 'Punctual attendance logged consistently through dynamic QR rotation in CS lecture sessions. Clean academic discipline record verified.'
      },
      {
        code: 'IT302',
        section: 'BSIT 3A',
        title: 'IT302 - Database Systems II',
        instructor: 'Ms. Angela Ramos',
        instructorRole: 'Assistant Professor',
        schedule: 'Mon/Wed 01:30 PM – 03:30 PM',
        room: 'Lab 305',
        sessions: 8,
        attended: 8,
        lates: 0,
        absences: 0,
        excused: 0,
        rate: '100.0%',
        punctuality: '0 Lates • Flawless',
        method: 'RFID Badge Tap',
        status: 'Eligible',
        remarks: 'Consistent physical tap-ins on terminal scanner. Database schema practical milestones validated on schedule.'
      },
      {
        code: 'IT401',
        section: 'BSIT 3A',
        title: 'IT401 - Capstone Project 1',
        instructor: 'Engr. Mark Bautista',
        instructorRole: 'Lead Adviser',
        schedule: 'Friday 08:00 AM – 12:00 PM',
        room: 'Lab 301',
        sessions: 8,
        attended: 7,
        lates: 0,
        absences: 0,
        excused: 1,
        rate: '100.0%',
        punctuality: '0 Lates • Approved Excuse',
        method: 'RFID & Excused Slip',
        status: 'Eligible',
        remarks: 'One session excused with official medical clearance signed by Clinic Physician and Department Chair. Preserves 100% institutional compliance.'
      }
    ]
  },
  '2ND_SEM_2025': {
    termLabel: '2nd Semester AY 2025–2026',
    standing: 'Honors Awarded',
    standingBadgeClass: 'bg-[#faf5ff] text-[#7c3aed] border-[#ddd6fe]',
    standingText: 'Honors Conferred',
    congratulationsNote: 'Official Perfect Attendance Certificate conferred on June 18, 2026.',
    attendanceRate: '100.0%',
    sessionsText: '48 / 48 Valid sessions',
    latesCount: '0 Lates',
    latesSubtext: 'Final audit certified',
    absencesCount: '0 Days',
    absencesSubtext: 'Flawless term completed',
    awardsCount: '2 Awards',
    awardsSubtext: 'Certificate in archive',
    termMilestone: 'Term Completed (100% Finalized)',
    progressPct: '100%',
    courses: [
      {
        code: 'IT205',
        section: 'BSIT 2A',
        title: 'IT205 - Object-Oriented Programming',
        instructor: 'Mrs. Jane Dela Cruz',
        instructorRole: 'Professor',
        schedule: 'Mon/Wed 08:00 AM – 10:00 AM',
        room: 'Lab 302',
        sessions: 12,
        attended: 12,
        lates: 0,
        absences: 0,
        excused: 0,
        rate: '100.0%',
        punctuality: '0 Lates • Certified',
        method: 'RFID Badge Tap',
        status: 'Awarded',
        remarks: 'Conferred award credit with flawless attendance across 12 scheduled laboratory programming exercises.'
      },
      {
        code: 'IT206',
        section: 'BSIT 2A',
        title: 'IT206 - Discrete Mathematics',
        instructor: 'Mr. Carlo Reyes',
        instructorRole: 'Professor',
        schedule: 'Tue/Thu 01:00 PM – 03:00 PM',
        room: 'Room 401',
        sessions: 12,
        attended: 12,
        lates: 0,
        absences: 0,
        excused: 0,
        rate: '100.0%',
        punctuality: '0 Lates • Certified',
        method: 'Dynamic QR Code',
        status: 'Awarded',
        remarks: 'Full presence in lecture sections; official transcript records clean attendance.'
      },
      {
        code: 'IT207',
        section: 'BSIT 2A',
        title: 'IT207 - Operating Systems & Scripting',
        instructor: 'Prof. Ricardo D. Mendoza',
        instructorRole: 'Dean / Faculty',
        schedule: 'Mon/Wed 10:30 AM – 12:30 PM',
        room: 'Lab 304',
        sessions: 12,
        attended: 12,
        lates: 0,
        absences: 0,
        excused: 0,
        rate: '100.0%',
        punctuality: '0 Lates • Certified',
        method: 'RFID Badge Tap',
        status: 'Awarded',
        remarks: 'Certified flawless participation throughout all shell scripting and Unix server laboratories.'
      },
      {
        code: 'GE104',
        section: 'BSIT 2A',
        title: 'GE104 - Ethics & Professionalism',
        instructor: 'Ms. Grace Santos',
        instructorRole: 'Instructor',
        schedule: 'Friday 01:00 PM – 04:00 PM',
        room: 'Room 205',
        sessions: 12,
        attended: 12,
        lates: 0,
        absences: 0,
        excused: 0,
        rate: '100.0%',
        punctuality: '0 Lates • Certified',
        method: 'RFID Badge Tap',
        status: 'Awarded',
        remarks: 'Exceptional academic discipline and promptness in ethics seminar assemblies.'
      }
    ]
  },
  '1ST_SEM_2025': {
    termLabel: '1st Semester AY 2025–2026',
    standing: 'Honors Awarded',
    standingBadgeClass: 'bg-[#faf5ff] text-[#7c3aed] border-[#ddd6fe]',
    standingText: 'Honors Conferred',
    congratulationsNote: 'Official Perfect Attendance Certificate conferred on January 22, 2026.',
    attendanceRate: '100.0%',
    sessionsText: '52 / 52 Valid sessions',
    latesCount: '0 Lates',
    latesSubtext: 'Final audit certified',
    absencesCount: '0 Days',
    absencesSubtext: 'Flawless term completed',
    awardsCount: '2 Awards',
    awardsSubtext: 'Certificate in archive',
    termMilestone: 'Term Completed (100% Finalized)',
    progressPct: '100%',
    courses: [
      {
        code: 'CS101',
        section: 'BSIT 2A',
        title: 'CS101 - Introduction to Computing',
        instructor: 'Mrs. Jane Dela Cruz',
        instructorRole: 'Professor',
        schedule: 'Tue/Thu 08:00 AM – 10:00 AM',
        room: 'Lab 301',
        sessions: 13,
        attended: 13,
        lates: 0,
        absences: 0,
        excused: 0,
        rate: '100.0%',
        punctuality: '0 Lates • Certified',
        method: 'RFID Badge Tap',
        status: 'Awarded',
        remarks: 'Perfect attendance verified on hardware scanner. Zero disciplinary deductions.'
      },
      {
        code: 'IT102',
        section: 'BSIT 2A',
        title: 'IT102 - Computer Programming 1',
        instructor: 'Engr. Mark Bautista',
        instructorRole: 'Assistant Professor',
        schedule: 'Mon/Wed 08:00 AM – 11:00 AM',
        room: 'Lab 304',
        sessions: 13,
        attended: 13,
        lates: 0,
        absences: 0,
        excused: 0,
        rate: '100.0%',
        punctuality: '0 Lates • Certified',
        method: 'RFID Badge Tap',
        status: 'Awarded',
        remarks: 'Complete session attendance with perfect code checkpoint submission rates.'
      },
      {
        code: 'CS102',
        section: 'BSIT 2A',
        title: 'CS102 - Computer Systems & Architecture',
        instructor: 'Mr. Carlo Reyes',
        instructorRole: 'Professor',
        schedule: 'Mon/Wed 01:30 PM – 03:30 PM',
        room: 'Lab 303',
        sessions: 13,
        attended: 13,
        lates: 0,
        absences: 0,
        excused: 0,
        rate: '100.0%',
        punctuality: '0 Lates • Certified',
        method: 'Dynamic QR Code',
        status: 'Awarded',
        remarks: 'Zero absences or delays recorded on electronic database logs.'
      },
      {
        code: 'GE101',
        section: 'BSIT 2A',
        title: 'GE101 - Purposive Communication',
        instructor: 'Dr. Vicente K. Perez',
        instructorRole: 'VP for Academic Affairs',
        schedule: 'Friday 08:00 AM – 11:00 AM',
        room: 'Room 301',
        sessions: 13,
        attended: 13,
        lates: 0,
        absences: 0,
        excused: 0,
        rate: '100.0%',
        punctuality: '0 Lates • Certified',
        method: 'RFID Badge Tap',
        status: 'Awarded',
        remarks: 'Outstanding dedication to speech labs and collegiate lectures.'
      }
    ]
  }
};

// Certificate Definitions for High-Fidelity Modal Preview
const certificateArchive = {
  '2nd_sem_2025': {
    recipient: 'JUAN DELA CRUZ',
    program: 'Bachelor of Science in Information Technology (BSIT 3A)',
    term: '2nd Semester of Academic Year 2025–2026',
    conferredDate: 'June 18, 2026',
    credentialId: 'BCP-AMS-CERT-2026-004821',
    sessionsSummary: '48 of 48 sessions present • 0 Absences • 0 Lates'
  },
  '1st_sem_2025': {
    recipient: 'JUAN DELA CRUZ',
    program: 'Bachelor of Science in Information Technology (BSIT 3A)',
    term: '1st Semester of Academic Year 2025–2026',
    conferredDate: 'January 22, 2026',
    credentialId: 'BCP-AMS-CERT-2026-002109',
    sessionsSummary: '52 of 52 sessions present • 0 Absences • 0 Lates'
  }
};

// Initialize DOM
document.addEventListener('DOMContentLoaded', function () {
  renderTermOverview(currentSemesterKey);
  populateSubjectFilterOptions(currentSemesterKey);
  renderSubjectAuditTable(currentSemesterKey, currentSubjectFilter);
});

/**
 * Render KPI Cards, Milestone Progress, and Overview Header
 */
function renderTermOverview(termKey) {
  const termData = perfectAttendanceData[termKey] || perfectAttendanceData['1ST_SEM_2026'];

  // Update KPI Cards
  const kpiAwardStatus = document.getElementById('kpiAwardStatus');
  const kpiAwardSubtext = document.getElementById('kpiAwardSubtext');
  const kpiAttendanceCount = document.getElementById('kpiAttendanceCount');
  const kpiAttendanceSubtext = document.getElementById('kpiAttendanceSubtext');
  const kpiTardyCount = document.getElementById('kpiTardyCount');
  const kpiTardySubtext = document.getElementById('kpiTardySubtext');
  const kpiAbsentCount = document.getElementById('kpiAbsentCount');
  const kpiAbsentSubtext = document.getElementById('kpiAbsentSubtext');
  const kpiAwardsCount = document.getElementById('kpiAwardsCount');
  const kpiAwardsSubtext = document.getElementById('kpiAwardsSubtext');

  if (kpiAwardStatus) kpiAwardStatus.textContent = termData.standing;
  if (kpiAwardSubtext) kpiAwardSubtext.textContent = termData.standing === 'Eligible' ? 'On track for honors' : 'Official award archived';
  if (kpiAttendanceCount) kpiAttendanceCount.textContent = termData.attendanceRate;
  if (kpiAttendanceSubtext) kpiAttendanceSubtext.textContent = termData.sessionsText;
  if (kpiTardyCount) kpiTardyCount.textContent = termData.latesCount;
  if (kpiTardySubtext) kpiTardySubtext.textContent = termData.latesSubtext;
  if (kpiAbsentCount) kpiAbsentCount.textContent = termData.absencesCount;
  if (kpiAbsentSubtext) kpiAbsentSubtext.textContent = termData.absencesSubtext;
  if (kpiAwardsCount) kpiAwardsCount.textContent = termData.awardsCount;
  if (kpiAwardsSubtext) kpiAwardsSubtext.textContent = termData.awardsSubtext;

  // Update Milestone Header & Progress Bar
  const milestoneTrackerTitle = document.getElementById('milestoneTrackerTitle');
  const milestoneBadge = document.getElementById('milestoneBadge');
  const standingAlertNotice = document.getElementById('standingAlertNotice');
  const termMilestonePct = document.getElementById('termMilestonePct');
  const termProgressBar = document.getElementById('termProgressBar');

  if (milestoneTrackerTitle) {
    milestoneTrackerTitle.textContent = `${termData.termLabel} Eligibility Milestone`;
  }

  if (milestoneBadge) {
    milestoneBadge.className = `inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border ${termData.standingBadgeClass}`;
    milestoneBadge.innerHTML = `
      <span class="w-1.5 h-1.5 rounded-full bg-current"></span>
      <span>${termData.standingText}</span>
    `;
  }

  if (standingAlertNotice) {
    standingAlertNotice.innerHTML = `
      <svg class="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>${termData.congratulationsNote}</span>
    `;
  }

  if (termMilestonePct) {
    termMilestonePct.textContent = termData.termMilestone;
  }

  if (termProgressBar) {
    termProgressBar.style.width = termData.progressPct;
  }
}

/**
 * Dynamically Populate Filter Dropdown with Courses of the Selected Term
 */
function populateSubjectFilterOptions(termKey) {
  const termData = perfectAttendanceData[termKey] || perfectAttendanceData['1ST_SEM_2026'];
  const filterSelect = document.getElementById('subjectFilterSelect');
  if (!filterSelect) return;

  filterSelect.innerHTML = `<option value="ALL">All Enrolled Classes (${termData.courses.length} Courses)</option>`;
  termData.courses.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c.code;
    opt.textContent = `${c.section} - ${c.title}`;
    filterSelect.appendChild(opt);
  });
}

/**
 * Render Enrolled Subjects Audit Table (1:1 styling with attendance-calendar.html)
 */
function renderSubjectAuditTable(termKey, filterCode) {
  const termData = perfectAttendanceData[termKey] || perfectAttendanceData['1ST_SEM_2026'];
  const tableBody = document.getElementById('subjectAuditTableBody');
  const subjectCountBadge = document.getElementById('subjectCountBadge');
  if (!tableBody) return;

  let courses = termData.courses;
  if (filterCode && filterCode !== 'ALL') {
    courses = courses.filter(c => c.code === filterCode);
  }

  if (subjectCountBadge) {
    subjectCountBadge.textContent = `${courses.length} Enrolled Courses`;
  }

  tableBody.innerHTML = '';

  if (courses.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="9" class="py-8 text-center text-gray-500 text-xs">
          No courses found matching filter criteria.
        </td>
      </tr>
    `;
    return;
  }

  courses.forEach(course => {
    const tr = document.createElement('tr');
    tr.className = 'hover:bg-[#f9fafb] transition-colors';

    const isEligible = course.status === 'Eligible' || course.status === 'Awarded';
    const statusBadge = isEligible
      ? `<span class="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#f0fdf4] text-[#16a34a] border border-[#bbf7d0]">
           ${course.status === 'Awarded' ? 'Certified' : 'Qualified'}
         </span>`
      : `<span class="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#fef2f2] text-[#dc2626] border border-[#fecaca]">
           At Risk
         </span>`;

    tr.innerHTML = `
      <td class="py-3.5 px-4 font-semibold text-[#111827]">
        <div class="flex items-center gap-2">
          <span class="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-[#eff6ff] text-[#0030c2]">${course.section}</span>
          <span>${course.title}</span>
        </div>
        <span class="text-[10px] text-[#6b7280] block mt-0.5">${course.room}</span>
      </td>
      <td class="py-3.5 px-4 text-[#374151]">
        <p class="font-medium">${course.schedule}</p>
        <p class="text-[10px] text-[#16a34a] font-semibold">100% Punctual</p>
      </td>
      <td class="py-3.5 px-4 text-[#111827]">
        <p class="font-medium">${course.instructor}</p>
        <p class="text-[10px] text-[#6b7280]">${course.instructorRole || 'Faculty'}</p>
      </td>
      <td class="py-3.5 px-4 text-center font-bold text-[#111827]">${course.sessions}</td>
      <td class="py-3.5 px-4 text-center font-bold text-[#16a34a]">${course.attended}</td>
      <td class="py-3.5 px-4 text-center font-medium text-[#374151]">
        <span>${course.lates} L / ${course.absences} A</span>
        ${course.excused > 0 ? `<span class="block text-[10px] text-[#0030c2]">(${course.excused} Excused)</span>` : ''}
      </td>
      <td class="py-3.5 px-4 text-center font-extrabold text-[#111827]">${course.rate}</td>
      <td class="py-3.5 px-4 text-center">${statusBadge}</td>
      <td class="py-3.5 px-4 text-center">
        <button onclick="openCourseDetailsModal('${course.code}')"
          class="p-1.5 text-[#0030c2] hover:bg-[#eff6ff] rounded-lg transition-colors cursor-pointer inline-flex items-center justify-center"
          title="Inspect Course Details">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </td>
    `;
    tableBody.appendChild(tr);
  });
}

/**
 * Open Inspect Course Details Modal (1:1 with attendance-calendar.html Inspect Day View Drawer)
 */
function openCourseDetailsModal(courseCode) {
  const termData = perfectAttendanceData[currentSemesterKey] || perfectAttendanceData['1ST_SEM_2026'];
  const course = termData.courses.find(c => c.code === courseCode) || termData.courses[0];
  if (!course) return;

  const modal = document.getElementById('courseDetailsModal');
  if (!modal) return;

  // Populate fields
  const titleEl = document.getElementById('courseModalTitle');
  const statusBadgeEl = document.getElementById('courseModalStatusBadge');
  const methodEl = document.getElementById('courseModalMethod');
  const codeEl = document.getElementById('courseModalCode');
  const teacherEl = document.getElementById('courseModalTeacher');
  const scheduleEl = document.getElementById('courseModalSchedule');
  const roomEl = document.getElementById('courseModalRoom');
  const rateEl = document.getElementById('courseModalRate');
  const punctualityEl = document.getElementById('courseModalPunctuality');
  const presentEl = document.getElementById('courseModalPresentCount');
  const lateEl = document.getElementById('courseModalLateCount');
  const absentEl = document.getElementById('courseModalAbsentCount');
  const excusedEl = document.getElementById('courseModalExcusedCount');
  const remarksEl = document.getElementById('courseModalRemarks');

  if (titleEl) titleEl.textContent = `${course.code} - ${course.title.split(' - ')[1] || course.title}`;
  if (statusBadgeEl) {
    statusBadgeEl.innerHTML = `
      <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-[#f0fdf4] text-[#16a34a] border border-[#bbf7d0]">
        ${course.status === 'Awarded' ? 'Certified Conferred' : 'Qualified (100%)'}
      </span>
    `;
  }
  if (methodEl) methodEl.textContent = course.method;
  if (codeEl) codeEl.textContent = `${course.code} (${course.section})`;
  if (teacherEl) teacherEl.textContent = `${course.instructor} (${course.instructorRole})`;
  if (scheduleEl) scheduleEl.textContent = course.schedule;
  if (roomEl) roomEl.textContent = course.room;
  if (rateEl) rateEl.textContent = course.rate;
  if (punctualityEl) punctualityEl.textContent = course.punctuality;
  if (presentEl) presentEl.textContent = course.attended;
  if (lateEl) lateEl.textContent = course.lates;
  if (absentEl) absentEl.textContent = course.absences;
  if (excusedEl) excusedEl.textContent = course.excused;
  if (remarksEl) remarksEl.textContent = course.remarks;

  modal.classList.remove('hidden');
  modal.classList.add('flex');
  document.body.classList.add('overflow-hidden');
}

/**
 * Close Course Details Modal
 */
function closeCourseDetailsModal() {
  const modal = document.getElementById('courseDetailsModal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    document.body.classList.remove('overflow-hidden');
  }
}

/**
 * Open Export Modal
 */
function openExportModal() {
  const modal = document.getElementById('exportModal');
  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.classList.add('overflow-hidden');
  }
}

/**
 * Close Export Modal
 */
function closeExportModal() {
  const modal = document.getElementById('exportModal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    document.body.classList.remove('overflow-hidden');
  }
}

/**
 * Update Export Format Radio Selection
 */
function updateExportFormatSelection(input) {
  const cards = document.querySelectorAll('.export-format-card');
  cards.forEach(card => {
    card.classList.remove('border-2', 'border-[#0030c2]', 'bg-[#eff6ff]');
    card.classList.add('border', 'border-[#e5e7eb]');
    const title = card.querySelector('.export-card-title');
    if (title) {
      title.classList.remove('text-[#0030c2]');
      title.classList.add('text-[#374151]');
    }
  });

  const parentCard = input.closest('.export-format-card');
  if (parentCard) {
    parentCard.classList.remove('border', 'border-[#e5e7eb]');
    parentCard.classList.add('border-2', 'border-[#0030c2]', 'bg-[#eff6ff]');
    const title = parentCard.querySelector('.export-card-title');
    if (title) {
      title.classList.remove('text-[#374151]');
      title.classList.add('text-[#0030c2]');
    }
  }

  const submitText = document.getElementById('exportSubmitBtnText');
  if (submitText) {
    submitText.textContent = input.value === 'Print' ? 'Generate PDF' : `Download ${input.value}`;
  }
}

/**
 * Handle Export Submission
 */
function handleExportSubmit(event) {
  event.preventDefault();
  const formatInput = document.querySelector('input[name="exportFormat"]:checked');
  const format = formatInput ? formatInput.value : 'CSV';
  const termScope = document.getElementById('exportTermScope')?.value || currentSemesterKey;
  const subjectScope = document.getElementById('exportSubjectScope')?.value || 'ALL';

  closeExportModal();
  showToast('Generating Export File', `Preparing ${format} attendance audit report for ${termScope}...`, 'info');

  setTimeout(() => {
    const blob = new Blob([
      `BESTLINK COLLEGE OF THE PHILIPPINES\n` +
      `PERFECT ATTENDANCE COMPLIANCE AUDIT\n` +
      `Student: Juan Dela Cruz (BSIT 3A - 2023-0149)\n` +
      `Scope Term: ${termScope}\n` +
      `Format: ${format}\n` +
      `Date Generated: ${new Date().toLocaleDateString()}\n` +
      `Audit Status: 100.0% ELIGIBLE\n`
    ], { type: 'text/plain;charset=utf-8' });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `BCP_Attendance_Award_Audit_${termScope}_${subjectScope}.${format.toLowerCase() === 'excel' ? 'xlsx' : 'csv'}`;
    link.click();

    showToast('Export Completed', `Your ${format} audit file has been successfully downloaded.`, 'success');
  }, 1000);
}

/**
 * Handle Semester Filter Switch
 */
function handleSemesterChange(semesterKey) {
  currentSemesterKey = semesterKey;
  currentSubjectFilter = 'ALL';
  renderTermOverview(semesterKey);
  populateSubjectFilterOptions(semesterKey);
  renderSubjectAuditTable(semesterKey, currentSubjectFilter);

  const termData = perfectAttendanceData[semesterKey];
  const termName = termData ? termData.termLabel : semesterKey;
  showToast('Academic Term Updated', `Viewing records for ${termName}`, 'info');
}

/**
 * Handle Subject Filter Switch
 */
function handleSubjectFilterChange(courseCode) {
  currentSubjectFilter = courseCode;
  renderSubjectAuditTable(currentSemesterKey, courseCode);
}

/**
 * Open Certificate Modal
 */
function openCertificateModal(certKey) {
  const cert = certificateArchive[certKey] || certificateArchive['2nd_sem_2025'];
  const modal = document.getElementById('certificateModal');
  if (!modal) return;

  const recipientEl = document.getElementById('modalCertRecipient');
  const termSpan = document.getElementById('modalCertTermSpan');
  const certIdCode = document.getElementById('modalCertIdCode');

  if (recipientEl) recipientEl.textContent = cert.recipient;
  if (termSpan) termSpan.textContent = cert.term;
  if (certIdCode) certIdCode.textContent = cert.credentialId;

  modal.classList.remove('hidden');
  document.body.classList.add('overflow-hidden');
}

/**
 * Close Certificate Modal
 */
function closeCertificateModal() {
  const modal = document.getElementById('certificateModal');
  if (modal) {
    modal.classList.add('hidden');
    document.body.classList.remove('overflow-hidden');
  }
}

/**
 * Standard Toast Notification System (1:1 Reference: student/attendance-calendar.html)
 */
function showToast(title, message, type = 'info') {
  let toastContainer = document.getElementById('toastContainer');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toastContainer';
    toastContainer.className = 'fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none';
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  toast.className = 'pointer-events-auto bg-white border border-[#e5e7eb] shadow-xl rounded-xl p-3.5 flex items-start gap-3 min-w-[280px] max-w-sm transition-all duration-300 transform translate-x-0';

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

// Global Exports
window.handleSemesterChange = handleSemesterChange;
window.handleSubjectFilterChange = handleSubjectFilterChange;
window.openCourseDetailsModal = openCourseDetailsModal;
window.closeCourseDetailsModal = closeCourseDetailsModal;
window.openExportModal = openExportModal;
window.closeExportModal = closeExportModal;
window.updateExportFormatSelection = updateExportFormatSelection;
window.handleExportSubmit = handleExportSubmit;
window.openCertificateModal = openCertificateModal;
window.closeCertificateModal = closeCertificateModal;
window.printCertificate = printCertificate;
window.downloadCertificatePDF = downloadCertificatePDF;
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

// Close modals or dropdown on outside click
document.addEventListener('click', function (e) {
  // Profile dropdown
  const profileBtn = document.getElementById('topbarProfileBtn');
  const profileMenu = document.getElementById('studentProfileMenu');
  if (profileMenu && !profileMenu.classList.contains('hidden')) {
    if (profileBtn && !profileBtn.contains(e.target) && !profileMenu.contains(e.target)) {
      profileMenu.classList.add('hidden');
    }
  }

  // Course Details Modal Backdrop Click
  const courseModal = document.getElementById('courseDetailsModal');
  if (courseModal && !courseModal.classList.contains('hidden') && e.target === courseModal) {
    closeCourseDetailsModal();
  }

  // Export Modal Backdrop Click
  const exportModal = document.getElementById('exportModal');
  if (exportModal && !exportModal.classList.contains('hidden') && e.target === exportModal) {
    closeExportModal();
  }

  // Certificate Modal Backdrop Click
  const certModal = document.getElementById('certificateModal');
  if (certModal && !certModal.classList.contains('hidden') && e.target === certModal) {
    closeCertificateModal();
  }
});
