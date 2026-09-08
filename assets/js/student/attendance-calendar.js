/**
 * Bestlink College of the Philippines
 * Attendance Monitoring System - Student Attendance Calendar Module
 * File: assets/js/student/attendance-calendar.js
 */

// State management for Student Calendar (Mirrors September 2026 academic timeline)
let currentCalendarYear = 2026;
let currentCalendarMonth = 8; // September (0-indexed)
let selectedDate = "2026-09-02";
let selectedSubject = "ALL";
let selectedSemester = "1ST_SEM_2026";

// Student Attendance Records matching enrolled BSIT 3A curriculum and teacher schedule
const studentDailyAttendanceData = {
  "2026-09-01": {
    status: "present",
    holiday: false,
    classes: [
      {
        subjectCode: "IT301",
        subjectName: "IT301 - Web Development",
        section: "BSIT 3A",
        room: "Lab 304",
        schedule: "08:00 AM – 10:00 AM",
        teacher: "Mrs. Jane Dela Cruz",
        timeIn: "07:50 AM",
        method: "RFID Badge",
        status: "Present",
        delay: "On Time (10 mins early)",
        remarks: "Orientation and course syllabus review completed."
      },
      {
        subjectCode: "CS201",
        subjectName: "CS201 - Data Structures",
        section: "BSCS 2A",
        room: "Room CS-201",
        schedule: "10:30 AM – 12:30 PM",
        teacher: "Mr. Carlo Reyes",
        timeIn: "10:20 AM",
        method: "Dynamic QR",
        status: "Present",
        delay: "On Time",
        remarks: "Introduction to algorithmic complexity."
      },
      {
        subjectCode: "IT302",
        subjectName: "IT302 - Database Systems II",
        section: "BSIT 3B",
        room: "Lab 305",
        schedule: "01:30 PM – 03:30 PM",
        teacher: "Ms. Angela Ramos",
        timeIn: "01:25 PM",
        method: "RFID Badge",
        status: "Present",
        delay: "On Time",
        remarks: "Database normalization exercise."
      },
      {
        subjectCode: "IT401",
        subjectName: "IT401 - Capstone Project",
        section: "BSIT 4A",
        room: "Room AVR-1",
        schedule: "04:00 PM – 06:00 PM",
        teacher: "Mr. Benj Torres",
        timeIn: "03:55 PM",
        method: "RFID Badge",
        status: "Present",
        delay: "On Time",
        remarks: "Proposal scoping and title consultation."
      }
    ]
  },
  "2026-09-02": {
    status: "present",
    holiday: false,
    classes: [
      {
        subjectCode: "IT301",
        subjectName: "IT301 - Web Development",
        section: "BSIT 3A",
        room: "Lab 304",
        schedule: "08:00 AM – 10:00 AM",
        teacher: "Mrs. Jane Dela Cruz",
        timeIn: "07:54 AM",
        method: "RFID Badge",
        status: "Present",
        delay: "On Time",
        remarks: "Attended scheduled period and completed practical laboratory checkpoint."
      },
      {
        subjectCode: "CS201",
        subjectName: "CS201 - Data Structures",
        section: "BSCS 2A",
        room: "Room CS-201",
        schedule: "10:30 AM – 12:30 PM",
        teacher: "Mr. Carlo Reyes",
        timeIn: "10:24 AM",
        method: "Dynamic QR",
        status: "Present",
        delay: "On Time",
        remarks: "Present for linear linked list implementation."
      },
      {
        subjectCode: "IT302",
        subjectName: "IT302 - Database Systems II",
        section: "BSIT 3B",
        room: "Lab 305",
        schedule: "01:30 PM – 03:30 PM",
        teacher: "Ms. Angela Ramos",
        timeIn: "01:25 PM",
        method: "RFID Badge",
        status: "Present",
        delay: "On Time",
        remarks: "Completed stored procedures lab module."
      },
      {
        subjectCode: "IT401",
        subjectName: "IT401 - Capstone Project",
        section: "BSIT 4A",
        room: "Room AVR-1",
        schedule: "04:00 PM – 06:00 PM",
        teacher: "Mr. Benj Torres",
        timeIn: "03:52 PM",
        method: "RFID Badge",
        status: "Present",
        delay: "On Time",
        remarks: "Software requirements specifications presentation."
      }
    ]
  },
  "2026-09-03": {
    status: "present",
    holiday: false,
    classes: [
      {
        subjectCode: "IT301",
        subjectName: "IT301 - Web Development",
        section: "BSIT 3A",
        room: "Lab 304",
        schedule: "08:00 AM – 10:00 AM",
        teacher: "Mrs. Jane Dela Cruz",
        timeIn: "07:45 AM",
        method: "RFID Badge",
        status: "Present",
        delay: "On Time",
        remarks: "Completed responsive Flexbox grid exam."
      },
      {
        subjectCode: "CS201",
        subjectName: "CS201 - Data Structures",
        section: "BSCS 2A",
        room: "Room CS-201",
        schedule: "10:30 AM – 12:30 PM",
        teacher: "Mr. Carlo Reyes",
        timeIn: "10:22 AM",
        method: "Dynamic QR",
        status: "Present",
        delay: "On Time",
        remarks: "Stack and queue evaluation."
      },
      {
        subjectCode: "IT302",
        subjectName: "IT302 - Database Systems II",
        section: "BSIT 3B",
        room: "Lab 305",
        schedule: "01:30 PM – 03:30 PM",
        teacher: "Ms. Angela Ramos",
        timeIn: "01:28 PM",
        method: "RFID Badge",
        status: "Present",
        delay: "On Time",
        remarks: "Relational algebra practice."
      },
      {
        subjectCode: "IT401",
        subjectName: "IT401 - Capstone Project",
        section: "BSIT 4A",
        room: "Room AVR-1",
        schedule: "04:00 PM – 06:00 PM",
        teacher: "Mr. Benj Torres",
        timeIn: "03:50 PM",
        method: "RFID Badge",
        status: "Present",
        delay: "On Time",
        remarks: "Database diagram defense approved."
      }
    ]
  },
  "2026-09-04": {
    status: "late",
    holiday: false,
    classes: [
      {
        subjectCode: "IT301",
        subjectName: "IT301 - Web Development",
        section: "BSIT 3A",
        room: "Lab 304",
        schedule: "08:00 AM – 10:00 AM",
        teacher: "Mrs. Jane Dela Cruz",
        timeIn: "08:22 AM",
        method: "Dynamic QR",
        status: "Late",
        delay: "+22 mins late",
        remarks: "Delayed due to campus transit queue. Tardy flag logged."
      },
      {
        subjectCode: "CS201",
        subjectName: "CS201 - Data Structures",
        section: "BSCS 2A",
        room: "Room CS-201",
        schedule: "10:30 AM – 12:30 PM",
        teacher: "Mr. Carlo Reyes",
        timeIn: "10:25 AM",
        method: "RFID Badge",
        status: "Present",
        delay: "On Time",
        remarks: "Present on time."
      },
      {
        subjectCode: "IT302",
        subjectName: "IT302 - Database Systems II",
        section: "BSIT 3B",
        room: "Lab 305",
        schedule: "01:30 PM – 03:30 PM",
        teacher: "Ms. Angela Ramos",
        timeIn: "01:26 PM",
        method: "RFID Badge",
        status: "Present",
        delay: "On Time",
        remarks: "Indexing lab completed."
      },
      {
        subjectCode: "IT401",
        subjectName: "IT401 - Capstone Project",
        section: "BSIT 4A",
        room: "Room AVR-1",
        schedule: "04:00 PM – 06:00 PM",
        teacher: "Mr. Benj Torres",
        timeIn: "03:54 PM",
        method: "RFID Badge",
        status: "Present",
        delay: "On Time",
        remarks: "Consultation on Gantt chart."
      }
    ]
  },
  "2026-09-07": {
    status: "present",
    holiday: false,
    classes: [
      {
        subjectCode: "IT301",
        subjectName: "IT301 - Web Development",
        section: "BSIT 3A",
        room: "Lab 304",
        schedule: "08:00 AM – 10:00 AM",
        teacher: "Mrs. Jane Dela Cruz",
        timeIn: "07:51 AM",
        method: "RFID Badge",
        status: "Present",
        delay: "On Time",
        remarks: "JavaScript DOM manipulation activity."
      },
      {
        subjectCode: "CS201",
        subjectName: "CS201 - Data Structures",
        section: "BSCS 2A",
        room: "Room CS-201",
        schedule: "10:30 AM – 12:30 PM",
        teacher: "Mr. Carlo Reyes",
        timeIn: "10:20 AM",
        method: "Dynamic QR",
        status: "Present",
        delay: "On Time",
        remarks: "Binary trees introductory lecture."
      }
    ]
  },
  "2026-09-08": {
    status: "absent",
    holiday: false,
    classes: [
      {
        subjectCode: "IT302",
        subjectName: "IT302 - Database Systems II",
        section: "BSIT 3B",
        room: "Lab 305",
        schedule: "01:30 PM – 03:30 PM",
        teacher: "Ms. Angela Ramos",
        timeIn: "—",
        method: "—",
        status: "Absent",
        delay: "Unexcused Missed",
        remarks: "Unexcused absence recorded. Parent advisory dispatched."
      }
    ]
  },
  "2026-09-09": {
    status: "present",
    holiday: false,
    classes: [
      {
        subjectCode: "IT301",
        subjectName: "IT301 - Web Development",
        section: "BSIT 3A",
        room: "Lab 304",
        schedule: "08:00 AM – 10:00 AM",
        teacher: "Mrs. Jane Dela Cruz",
        timeIn: "07:49 AM",
        method: "RFID Badge",
        status: "Present",
        delay: "On Time",
        remarks: "Active laboratory coding checkpoint."
      },
      {
        subjectCode: "CS201",
        subjectName: "CS201 - Data Structures",
        section: "BSCS 2A",
        room: "Room CS-201",
        schedule: "10:30 AM – 12:30 PM",
        teacher: "Mr. Carlo Reyes",
        timeIn: "10:21 AM",
        method: "Dynamic QR",
        status: "Present",
        delay: "On Time",
        remarks: "Binary tree traversal exercises."
      }
    ]
  },

  // --- AUGUST 2026 (Trailing days & holidays) ---
  "2026-08-31": {
    status: "holiday",
    holiday: true,
    holidayName: "National Heroes Day (Holiday)",
    classes: []
  },
  "2026-08-28": {
    status: "present",
    holiday: false,
    classes: [
      {
        subjectCode: "IT301",
        subjectName: "IT301 - Web Development",
        section: "BSIT 3A",
        room: "Lab 304",
        schedule: "08:00 AM – 10:00 AM",
        teacher: "Mrs. Jane Dela Cruz",
        timeIn: "07:52 AM",
        method: "RFID Badge",
        status: "Present",
        delay: "On Time",
        remarks: "CSS animations and responsive UI."
      }
    ]
  },
  "2026-08-27": {
    status: "present",
    holiday: false,
    classes: [
      {
        subjectCode: "CS201",
        subjectName: "CS201 - Data Structures",
        section: "BSCS 2A",
        room: "Room CS-201",
        schedule: "10:30 AM – 12:30 PM",
        teacher: "Mr. Carlo Reyes",
        timeIn: "10:23 AM",
        method: "Dynamic QR",
        status: "Present",
        delay: "On Time",
        remarks: "Recursion workshop completed."
      }
    ]
  },
  "2026-08-26": {
    status: "excused",
    holiday: false,
    classes: [
      {
        subjectCode: "IT301",
        subjectName: "IT301 - Web Development",
        section: "BSIT 3A",
        room: "Lab 304",
        schedule: "08:00 AM – 10:00 AM",
        teacher: "Mrs. Jane Dela Cruz",
        timeIn: "—",
        method: "Manual Slip",
        status: "Excused",
        delay: "Approved Excuse Slip",
        remarks: "Official medical excuse slip approved by Mrs. Dela Cruz."
      }
    ]
  },
  "2026-08-25": {
    status: "present",
    holiday: false,
    classes: [
      {
        subjectCode: "IT302",
        subjectName: "IT302 - Database Systems II",
        section: "BSIT 3B",
        room: "Lab 305",
        schedule: "01:30 PM – 03:30 PM",
        teacher: "Ms. Angela Ramos",
        timeIn: "01:22 PM",
        method: "RFID Badge",
        status: "Present",
        delay: "On Time",
        remarks: "ERD diagram review."
      }
    ]
  },
  "2026-08-21": {
    status: "holiday",
    holiday: true,
    holidayName: "Ninoy Aquino Day (Holiday)",
    classes: []
  }
};

// Initialize DOM on Load
document.addEventListener("DOMContentLoaded", function () {
  console.log("📅 Student Attendance Calendar Module Initialized");
  initCurrentDate();
  renderCalendar();
  renderDayBreakdown();
});

/**
 * Initialize current date badge in top bar
 */
function initCurrentDate() {
  const dateBtn = document.getElementById("currentDateDisplay");
  if (dateBtn) {
    const today = new Date();
    const dayOfWeek = today.toLocaleDateString("en-US", { weekday: "long" });
    const monthDayYear = today.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
    const formatted = `${monthDayYear} (${dayOfWeek})`;
    const label = dateBtn.querySelector("#currentDateLabel");
    if (label) label.textContent = formatted;
  }
}

/**
 * Month Navigation: delta is -1 or +1
 */
function changeMonth(delta) {
  currentCalendarMonth += delta;
  if (currentCalendarMonth < 0) {
    currentCalendarMonth = 11;
    currentCalendarYear--;
  } else if (currentCalendarMonth > 11) {
    currentCalendarMonth = 0;
    currentCalendarYear++;
  }
  renderCalendar();
}

/**
 * Return to current default month (September 2026)
 */
function goToCurrentMonth() {
  currentCalendarYear = 2026;
  currentCalendarMonth = 8; // September
  renderCalendar();
}

/**
 * Render Calendar Grid with Month, Days, Trailing offsets, and Color Badges
 * Exactly matching teacher/attendance-calendar.js structure and classes
 */
function renderCalendar() {
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const titleEl = document.getElementById("calendarMonthTitle");
  if (titleEl) {
    titleEl.textContent = `${monthNames[currentCalendarMonth]} ${currentCalendarYear}`;
  }

  const grid = document.getElementById("calendarDaysGrid");
  if (!grid) return;
  grid.innerHTML = "";

  const firstDay = new Date(currentCalendarYear, currentCalendarMonth, 1).getDay();
  const totalDays = new Date(currentCalendarYear, currentCalendarMonth + 1, 0).getDate();
  const prevMonthDays = new Date(currentCalendarYear, currentCalendarMonth, 0).getDate();

  // Previous month trailing days
  for (let i = firstDay - 1; i >= 0; i--) {
    const dayNum = prevMonthDays - i;
    const cell = document.createElement("div");
    cell.className = "min-h-[88px] p-1.5 rounded-xl border border-dashed border-[#e5e7eb] bg-[#fcfcfd] text-gray-400 text-xs flex flex-col justify-between opacity-50";
    cell.innerHTML = `<span class="font-medium">${dayNum}</span>`;
    grid.appendChild(cell);
  }

  // Active month days
  for (let day = 1; day <= totalDays; day++) {
    const dateStr = `${currentCalendarYear}-${String(currentCalendarMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const dayOfWeek = new Date(currentCalendarYear, currentCalendarMonth, day).getDay();
    const isWeekend = (dayOfWeek === 0 || dayOfWeek === 6);
    const dayRecord = studentDailyAttendanceData[dateStr];
    const isSelected = (dateStr === selectedDate);

    const cell = document.createElement("div");
    const baseClasses = "min-h-[88px] p-2 rounded-xl border text-xs flex flex-col justify-between transition-all cursor-pointer select-none text-left";

    let borderClass = isSelected
      ? "border-[#0030c2] ring-2 ring-[#0030c2]/20 bg-[#f4f7ff]"
      : "border-[#e5e7eb] bg-white hover:border-[#0030c2]/60 hover:shadow-xs";

    let badgeHtml = "";

    if (isWeekend) {
      badgeHtml = `<span class="text-[10px] text-gray-400 font-medium">Weekend</span>`;
    } else if (dayRecord && dayRecord.holiday) {
      badgeHtml = `<span class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 text-[10px] font-bold border border-blue-200">
        <span class="w-1.5 h-1.5 rounded-full bg-blue-500"></span> Holiday
      </span>`;
    } else if (dayRecord) {
      const classCount = dayRecord.classes ? dayRecord.classes.length : 0;
      if (dayRecord.status === "present") {
        badgeHtml = `
          <div class="space-y-1">
            <span class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Present
            </span>
            <p class="text-[10px] text-[#6b7280] font-medium leading-none">${classCount} ${classCount === 1 ? 'Class' : 'Classes'} • On Time</p>
          </div>
        `;
      } else if (dayRecord.status === "late") {
        badgeHtml = `
          <div class="space-y-1">
            <span class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 text-[10px] font-bold border border-amber-200">
              <span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span> Late
            </span>
            <p class="text-[10px] text-[#c2410c] font-medium leading-none">1 Late • 08:22 AM</p>
          </div>
        `;
      } else if (dayRecord.status === "absent") {
        badgeHtml = `
          <div class="space-y-1">
            <span class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-rose-50 text-rose-700 text-[10px] font-bold border border-rose-200">
              <span class="w-1.5 h-1.5 rounded-full bg-rose-500"></span> Absent
            </span>
            <p class="text-[10px] text-[#dc2626] font-medium leading-none">Unexcused Missed</p>
          </div>
        `;
      } else if (dayRecord.status === "excused") {
        badgeHtml = `
          <div class="space-y-1">
            <span class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 text-[10px] font-bold border border-blue-200">
              <span class="w-1.5 h-1.5 rounded-full bg-blue-500"></span> Excused
            </span>
            <p class="text-[10px] text-[#0030c2] font-medium leading-none">Verified Slip</p>
          </div>
        `;
      }
    } else {
      badgeHtml = `<span class="text-[10px] text-gray-400">No logs yet</span>`;
    }

    cell.className = `${baseClasses} ${borderClass}`;
    cell.innerHTML = `
      <div class="flex items-center justify-between">
        <span class="font-bold ${isWeekend ? 'text-rose-500' : isSelected ? 'text-[#0030c2]' : 'text-[#111827]'} text-sm">${day}</span>
        ${isSelected ? '<span class="w-1.5 h-1.5 rounded-full bg-[#0030c2]"></span>' : ''}
      </div>
      <div class="mt-1">${badgeHtml}</div>
    `;

    cell.onclick = () => selectCalendarDay(dateStr, day, dayOfWeek);
    grid.appendChild(cell);
  }
}

/**
 * Handle day selection on calendar
 */
function selectCalendarDay(dateStr, day, dayOfWeek) {
  selectedDate = dateStr;
  const daysArr = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const monthsArr = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  
  const formattedTitle = `Scheduled Classes & Attendance — ${monthsArr[currentCalendarMonth]} ${String(day).padStart(2, '0')}, ${currentCalendarYear} (${daysArr[dayOfWeek]})`;
  
  const titleEl = document.getElementById("selectedDateTitle");
  if (titleEl) titleEl.textContent = formattedTitle;

  const exportDateInput = document.getElementById("exportTargetDate");
  if (exportDateInput) exportDateInput.value = dateStr;

  // Update excuse shortcut button href
  const excuseBtn = document.getElementById("submitExcuseShortcutBtn");
  if (excuseBtn) {
    excuseBtn.href = `excuse-slip/submit-excuse.html?date=${dateStr}`;
  }

  renderCalendar();
  renderDayBreakdown();
  showToast("Date Selected", `Viewing attendance records for ${monthsArr[currentCalendarMonth]} ${day}, ${currentCalendarYear}.`, "info");
}

/**
 * Render the class breakdown table for the currently selected date
 */
function renderDayBreakdown() {
  const tbody = document.getElementById("classBreakdownTableBody");
  if (!tbody) return;

  const dayRecord = studentDailyAttendanceData[selectedDate];
  const summaryLabel = document.getElementById("dailySummaryLabel");
  const summaryStatusCounts = document.getElementById("summaryStatusCounts");
  const summaryPunctualityRate = document.getElementById("summaryPunctualityRate");
  const summaryStandingBadge = document.getElementById("summaryStandingBadge");

  tbody.innerHTML = "";

  if (!dayRecord || !dayRecord.classes || dayRecord.classes.length === 0) {
    let emptyNotice = "No class schedules or attendance records logged for this date.";
    if (dayRecord && dayRecord.holiday) {
      emptyNotice = `School Holiday: ${dayRecord.holidayName}. No classes scheduled.`;
    }

    tbody.innerHTML = `
      <tr>
        <td colspan="7" class="py-8 text-center text-gray-500">
          <div class="flex flex-col items-center justify-center gap-2">
            <svg class="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
            </svg>
            <p class="text-xs font-semibold text-gray-600">${emptyNotice}</p>
            <p class="text-[11px] text-gray-400">Select another date to inspect enrolled class roll call records.</p>
          </div>
        </td>
      </tr>
    `;

    if (summaryLabel) summaryLabel.textContent = "Daily Summary (0 Classes)";
    if (summaryStatusCounts) summaryStatusCounts.innerHTML = `<span class="text-gray-400 font-medium">No Classes</span>`;
    if (summaryPunctualityRate) summaryPunctualityRate.textContent = "—";
    if (summaryStandingBadge) {
      summaryStandingBadge.textContent = "No Records";
      summaryStandingBadge.className = "py-3.5 px-4 text-center text-xs font-semibold text-gray-500";
    }
    return;
  }

  // Filter classes by subject if selected
  const visibleClasses = dayRecord.classes.filter(c => {
    if (selectedSubject === "ALL") return true;
    return c.subjectCode === selectedSubject;
  });

  if (visibleClasses.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" class="py-6 text-center text-gray-500 text-xs">
          No records match the selected subject filter (${selectedSubject}) for this date.
        </td>
      </tr>
    `;
    return;
  }

  let presentCount = 0;
  let lateCount = 0;
  let absentCount = 0;
  let excusedCount = 0;

  visibleClasses.forEach((cls, idx) => {
    if (cls.status === "Present") presentCount++;
    else if (cls.status === "Late") lateCount++;
    else if (cls.status === "Absent") absentCount++;
    else if (cls.status === "Excused") excusedCount++;

    let statusBadge = "";
    if (cls.status === "Present") {
      statusBadge = `
        <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#f0fdf4] text-[#16a34a] border border-[#bbf7d0]">
          <span class="w-1.5 h-1.5 rounded-full bg-[#16a34a]"></span> Present
        </span>
      `;
    } else if (cls.status === "Late") {
      statusBadge = `
        <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#fff7ed] text-[#f97316] border border-[#fed7aa]">
          <span class="w-1.5 h-1.5 rounded-full bg-[#f97316]"></span> Late (${cls.delay})
        </span>
      `;
    } else if (cls.status === "Absent") {
      statusBadge = `
        <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#fef2f2] text-[#dc2626] border border-[#fecaca]">
          <span class="w-1.5 h-1.5 rounded-full bg-[#dc2626]"></span> Absent
        </span>
      `;
    } else if (cls.status === "Excused") {
      statusBadge = `
        <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#eff6ff] text-[#0030c2] border border-[#bfdbfe]">
          <span class="w-1.5 h-1.5 rounded-full bg-[#0030c2]"></span> Excused
        </span>
      `;
    }

    let methodPill = "";
    if (cls.method.includes("RFID")) {
      methodPill = `<span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-[#eff6ff] text-[#0030c2] border border-[#bfdbfe]">RFID Badge</span>`;
    } else if (cls.method.includes("QR")) {
      methodPill = `<span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-[#f0fdf4] text-[#16a34a] border border-[#bbf7d0]">Dynamic QR</span>`;
    } else if (cls.method.includes("Slip")) {
      methodPill = `<span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-[#faf5ff] text-[#9333ea] border border-[#e9d5ff]">Excuse Pass</span>`;
    } else {
      methodPill = `<span class="text-gray-400">—</span>`;
    }

    const tr = document.createElement("tr");
    tr.className = "hover:bg-[#f9fafb] transition-colors";
    tr.innerHTML = `
      <td class="py-3.5 px-4 font-semibold text-[#111827]">
        <div class="flex items-center gap-2">
          <span class="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-[#eff6ff] text-[#0030c2]">${cls.section || 'BSIT 3A'}</span>
          <span>${cls.subjectName}</span>
        </div>
        <span class="text-[10px] text-[#6b7280] block mt-0.5">Room: ${cls.room}</span>
      </td>
      <td class="py-3.5 px-4 text-[#374151]">
        <p class="font-medium">${cls.schedule}</p>
        <p class="text-[10px] text-[#6b7280]">${cls.delay}</p>
      </td>
      <td class="py-3.5 px-4 text-[#111827]">
        <p class="font-medium">${cls.teacher}</p>
        <p class="text-[10px] text-[#6b7280]">Professor</p>
      </td>
      <td class="py-3.5 px-4 text-center font-bold ${cls.status === 'Present' ? 'text-[#16a34a]' : cls.status === 'Late' ? 'text-[#f97316]' : 'text-gray-400'}">
        ${cls.timeIn}
      </td>
      <td class="py-3.5 px-4 text-center">
        ${methodPill}
      </td>
      <td class="py-3.5 px-4 text-center">
        ${statusBadge}
      </td>
      <td class="py-3.5 px-4 text-center">
        <button onclick="openDayViewDrawer(${idx})"
          class="px-2.5 py-1 text-xs font-semibold text-[#0030c2] bg-[#eff6ff] hover:bg-[#dbeafe] rounded-lg transition-colors cursor-pointer">
          Inspect Details
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  // Update table summary row
  const totalClasses = visibleClasses.length;
  if (summaryLabel) {
    summaryLabel.textContent = `Daily Summary (${totalClasses} ${totalClasses === 1 ? 'Scheduled Class' : 'Scheduled Classes'})`;
  }
  if (summaryStatusCounts) {
    summaryStatusCounts.innerHTML = `
      <span class="text-emerald-600 font-bold">${presentCount} Present</span> • 
      <span class="text-amber-600 font-bold">${lateCount} Late</span> • 
      <span class="text-rose-600 font-bold">${absentCount} Absent</span> • 
      <span class="text-[#0030c2] font-bold">${excusedCount} Excused</span>
    `;
  }
  if (summaryPunctualityRate) {
    const rate = totalClasses > 0 ? Math.round((presentCount / totalClasses) * 100) : 0;
    summaryPunctualityRate.textContent = `${rate}% On-Time`;
  }
  if (summaryStandingBadge) {
    if (absentCount > 0) {
      summaryStandingBadge.textContent = "Attendance Warning";
      summaryStandingBadge.className = "py-3.5 px-4 text-center text-xs font-semibold text-[#dc2626]";
    } else if (lateCount > 0) {
      summaryStandingBadge.textContent = "Tardy Recorded";
      summaryStandingBadge.className = "py-3.5 px-4 text-center text-xs font-semibold text-[#d97706]";
    } else {
      summaryStandingBadge.textContent = "Good Standing";
      summaryStandingBadge.className = "py-3.5 px-4 text-center text-xs font-semibold text-[#16a34a]";
    }
  }
}

/**
 * Open Day View Drawer for a specific class index on the selected date
 */
function openDayViewDrawer(classIndex) {
  const dayRecord = studentDailyAttendanceData[selectedDate];
  if (!dayRecord || !dayRecord.classes[classIndex]) return;

  const cls = dayRecord.classes[classIndex];

  const subTitle = document.getElementById("drawerSubjectTitle");
  if (subTitle) subTitle.textContent = `${cls.section || 'BSIT 3A'} — ${cls.subjectName}`;

  const subDate = document.getElementById("drawerDateSubtitle");
  if (subDate) subDate.textContent = `${selectedDate} • Period Attendance Record`;

  const codeEl = document.getElementById("drawerSubjectCode");
  if (codeEl) codeEl.textContent = cls.subjectCode;

  const teacherEl = document.getElementById("drawerTeacher");
  if (teacherEl) teacherEl.textContent = cls.teacher;

  const schedEl = document.getElementById("drawerSchedule");
  if (schedEl) schedEl.textContent = cls.schedule;

  const timeInEl = document.getElementById("drawerTimeIn");
  if (timeInEl) timeInEl.textContent = cls.timeIn;

  const roomEl = document.getElementById("drawerRoom");
  if (roomEl) roomEl.textContent = cls.room;

  const delayEl = document.getElementById("drawerDelay");
  if (delayEl) delayEl.textContent = cls.delay;

  const methodEl = document.getElementById("drawerMethod");
  if (methodEl) methodEl.textContent = cls.method;

  const remarksEl = document.getElementById("drawerRemarks");
  if (remarksEl) remarksEl.textContent = cls.remarks;

  const statusBadgeContainer = document.getElementById("drawerStatusBadge");
  if (statusBadgeContainer) {
    if (cls.status === "Present") {
      statusBadgeContainer.innerHTML = `
        <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-[#f0fdf4] text-[#16a34a] border border-[#bbf7d0]">
          <span class="w-1.5 h-1.5 rounded-full bg-[#16a34a]"></span> Present (On Time)
        </span>
      `;
    } else if (cls.status === "Late") {
      statusBadgeContainer.innerHTML = `
        <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-[#fff7ed] text-[#f97316] border border-[#fed7aa]">
          <span class="w-1.5 h-1.5 rounded-full bg-[#f97316]"></span> Late Arrival
        </span>
      `;
    } else if (cls.status === "Absent") {
      statusBadgeContainer.innerHTML = `
        <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-[#fef2f2] text-[#dc2626] border border-[#fecaca]">
          <span class="w-1.5 h-1.5 rounded-full bg-[#dc2626]"></span> Unexcused Absent
        </span>
      `;
    } else if (cls.status === "Excused") {
      statusBadgeContainer.innerHTML = `
        <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-[#eff6ff] text-[#0030c2] border border-[#bfdbfe]">
          <span class="w-1.5 h-1.5 rounded-full bg-[#0030c2]"></span> Approved Excused
        </span>
      `;
    }
  }

  // Handle excuse slip context notice inside drawer
  const excuseNotice = document.getElementById("drawerExcuseNotice");
  const submitExcuseBtn = document.getElementById("drawerSubmitExcuseBtn");
  if (excuseNotice) {
    if (cls.status === "Late" || cls.status === "Absent") {
      excuseNotice.classList.remove("hidden");
      if (submitExcuseBtn) {
        submitExcuseBtn.href = `excuse-slip/submit-excuse.html?subject=${cls.subjectCode}&date=${selectedDate}`;
      }
    } else {
      excuseNotice.classList.add("hidden");
    }
  }

  const drawer = document.getElementById("dayViewDrawer");
  if (drawer) {
    drawer.classList.remove("hidden");
    drawer.classList.add("flex");
  }
}

/**
 * Close Day View Drawer
 */
function closeDayViewDrawer() {
  const drawer = document.getElementById("dayViewDrawer");
  if (drawer) {
    drawer.classList.add("hidden");
    drawer.classList.remove("flex");
  }
}

/**
 * Filter by Subject
 */
function handleSubjectFilterChange(val) {
  selectedSubject = val;
  renderDayBreakdown();
  showToast("Filter Applied", `Displaying records for ${val === 'ALL' ? 'all enrolled classes' : val}.`, "info");
}

/**
 * Filter by Semester
 */
function handleSemesterChange(val) {
  selectedSemester = val;
  if (val === "2ND_SEM_2025") {
    currentCalendarYear = 2026;
    currentCalendarMonth = 2; // March 2026
    selectedDate = "2026-03-10";
  } else {
    currentCalendarYear = 2026;
    currentCalendarMonth = 8; // September 2026
    selectedDate = "2026-09-02";
  }
  renderCalendar();
  renderDayBreakdown();
  showToast("Term Changed", `Switched calendar to ${val === '2ND_SEM_2025' ? '2nd Semester AY 2025-2026' : '1st Semester AY 2026-2027'}.`, "info");
}

/**
 * Export Modal Controls
 */
function openExportModal() {
  const modal = document.getElementById("exportModal");
  if (modal) {
    modal.classList.remove("hidden");
    modal.classList.add("flex");
  }
}

function closeExportModal() {
  const modal = document.getElementById("exportModal");
  if (modal) {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
  }
}

function updateExportFormatSelection(radio) {
  const cards = document.querySelectorAll(".export-format-card");
  cards.forEach(card => {
    card.classList.remove("border-[#0030c2]", "bg-[#eff6ff]", "border-2");
    card.classList.add("border-[#e5e7eb]");
    const title = card.querySelector(".export-card-title");
    if (title) {
      title.classList.remove("text-[#0030c2]");
      title.classList.add("text-[#374151]");
    }
  });

  const parentCard = radio.closest(".export-format-card");
  if (parentCard) {
    parentCard.classList.remove("border-[#e5e7eb]");
    parentCard.classList.add("border-[#0030c2]", "bg-[#eff6ff]", "border-2");
    const title = parentCard.querySelector(".export-card-title");
    if (title) {
      title.classList.add("text-[#0030c2]");
      title.classList.remove("text-[#374151]");
    }
  }

  const submitText = document.getElementById("exportSubmitBtnText");
  if (submitText) {
    if (radio.value === "Print") {
      submitText.textContent = "Print Attendance Sheet";
    } else {
      submitText.textContent = `Download ${radio.value}`;
    }
  }
}

function handleExport(e) {
  e.preventDefault();
  const formatInput = document.querySelector('input[name="exportFormat"]:checked');
  const format = formatInput ? formatInput.value : "CSV";
  const subjectScope = document.getElementById("exportSubjectScope")?.value || "ALL";
  const targetDate = document.getElementById("exportTargetDate")?.value || selectedDate;

  closeExportModal();

  if (format === "Print") {
    showToast("Print Sheet", "Opening formatted attendance sheet for printing...", "info");
    setTimeout(() => {
      window.print();
    }, 500);
    return;
  }

  // Generate downloadable CSV
  let csvContent = "data:text/csv;charset=utf-8,";
  csvContent += "Date,Section,Subject Code,Subject Name,Room,Schedule,Instructor,Time In,Scan Method,Status,Remarks\n";

  Object.keys(studentDailyAttendanceData).forEach(date => {
    const rec = studentDailyAttendanceData[date];
    if (rec.classes && rec.classes.length > 0) {
      rec.classes.forEach(c => {
        if (subjectScope === "ALL" || c.subjectCode === subjectScope) {
          csvContent += `"${date}","${c.section || 'BSIT 3A'}","${c.subjectCode}","${c.subjectName}","${c.room}","${c.schedule}","${c.teacher}","${c.timeIn}","${c.method}","${c.status}","${c.remarks}"\n`;
        }
      });
    }
  });

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `Student_Attendance_Calendar_${targetDate}.${format.toLowerCase() === 'excel' ? 'csv' : 'csv'}`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  showToast("Export Complete", `Your attendance calendar log was exported as ${format}.`, "success");
}

/**
 * Toast Notification System
 */
function showToast(title, message, type = "success") {
  let toastContainer = document.getElementById("toastContainer");
  if (!toastContainer) {
    toastContainer = document.createElement("div");
    toastContainer.id = "toastContainer";
    toastContainer.className = "fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none";
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement("div");
  toast.className = "custom-toast pointer-events-auto bg-white border border-[#e5e7eb] shadow-xl rounded-xl p-3.5 flex items-start gap-3 min-w-[280px] max-w-sm transition-all duration-300 transform translate-x-0";

  let iconSvg = "";
  if (type === "success") {
    iconSvg = `
      <div class="w-8 h-8 rounded-xl bg-[#f0fdf4] text-[#16a34a] border border-[#bbf7d0] flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
        <svg class="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.25">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
      </div>
    `;
  } else if (type === "info") {
    iconSvg = `
      <div class="w-8 h-8 rounded-xl bg-[#eff6ff] text-[#0030c2] border border-[#bfdbfe] flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
        <svg class="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.25">
          <path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
        </svg>
      </div>
    `;
  } else if (type === "warning") {
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
    toast.classList.add("opacity-0", "translate-x-full");
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// Global functions exposed for HTML event handlers
window.changeMonth = changeMonth;
window.goToCurrentMonth = goToCurrentMonth;
window.selectCalendarDay = selectCalendarDay;
window.openDayViewDrawer = openDayViewDrawer;
window.closeDayViewDrawer = closeDayViewDrawer;
window.handleSubjectFilterChange = handleSubjectFilterChange;
window.handleSemesterChange = handleSemesterChange;
window.openExportModal = openExportModal;
window.closeExportModal = closeExportModal;
window.updateExportFormatSelection = updateExportFormatSelection;
window.handleExport = handleExport;
window.showToast = showToast;
