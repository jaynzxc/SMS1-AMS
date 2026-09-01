// assets/js/attendance-calendar.js

document.addEventListener('DOMContentLoaded', function () {
  // Calendar State Variables
  let currentYear = 2026;
  let currentMonth = 6; // July (0-indexed)
  let selectedDay = 25; // Default active day

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Realistic mock data mapped to days for dynamic feedback
  const mockDailyStats = {
    1:  { present: '1,120', presentPct: '89.60%', absent: '43', absentPct: '3.44%', late: '87', latePct: '6.96%', excused: '20', excusedPct: '1.60%', teachers: '44 / 45', teacherPct: '97.78%' },
    2:  { present: '1,135', presentPct: '90.80%', absent: '35', absentPct: '2.80%', late: '80', latePct: '6.40%', excused: '18', excusedPct: '1.44%', teachers: '45 / 45', teacherPct: '100.0%' },
    3:  { present: '1,105', presentPct: '88.40%', absent: '55', absentPct: '4.40%', late: '90', latePct: '7.20%', excused: '25', excusedPct: '2.00%', teachers: '43 / 45', teacherPct: '95.56%' },
    4:  { present: '1,142', presentPct: '91.36%', absent: '30', absentPct: '2.40%', late: '78', latePct: '6.24%', excused: '15', excusedPct: '1.20%', teachers: '45 / 45', teacherPct: '100.0%' },
    15: { present: '1,118', presentPct: '89.44%', absent: '48', absentPct: '3.84%', late: '84', latePct: '6.72%', excused: '22', excusedPct: '1.76%', teachers: '43 / 45', teacherPct: '95.56%' },
    25: { present: '1,120', presentPct: '89.60%', absent: '43', absentPct: '3.44%', late: '87', latePct: '6.96%', excused: '20', excusedPct: '1.60%', teachers: '42 / 45', teacherPct: '93.33%' },
    default: { present: '1,120', presentPct: '89.60%', absent: '43', absentPct: '3.44%', late: '87', latePct: '6.96%', excused: '20', excusedPct: '1.60%', teachers: '42 / 45', teacherPct: '93.33%' }
  };

  function getDailyStats(dayNum) {
    if (mockDailyStats[dayNum]) {
      return mockDailyStats[dayNum];
    }
    // Generate semi-deterministic stats based on dayNum
    const presentVal = 1100 + (dayNum * 3) % 45;
    const absentVal = 30 + (dayNum * 2) % 25;
    const lateVal = 70 + (dayNum * 4) % 30;
    const excusedVal = 15 + (dayNum * 1) % 15;
    const presentPctVal = ((presentVal / 1250) * 100).toFixed(2) + '%';
    const absentPctVal = ((absentVal / 1250) * 100).toFixed(2) + '%';
    const latePctVal = ((lateVal / 1250) * 100).toFixed(2) + '%';
    const excusedPctVal = ((excusedVal / 1250) * 100).toFixed(2) + '%';

    return {
      present: presentVal.toLocaleString(),
      presentPct: presentPctVal,
      absent: absentVal.toString(),
      absentPct: absentPctVal,
      late: lateVal.toString(),
      latePct: latePctVal,
      excused: excusedVal.toString(),
      excusedPct: excusedPctVal,
      teachers: '43 / 45',
      teacherPct: '95.56%'
    };
  }

  function isHoliday(year, month, day) {
    // July 25, 2026 is a holiday (as in original static mockups)
    if (year === 2026 && month === 6 && day === 25) return true;
    // January 1, December 25 are holidays
    if (month === 0 && day === 1) return true;
    if (month === 11 && day === 25) return true;
    return false;
  }

  // Render Calendar Grid Dynamically
  function renderCalendar(year, month) {
    const monthTitle = document.getElementById('calendarMonthTitle');
    const daysGrid = document.getElementById('calendarDaysGrid');
    if (!monthTitle || !daysGrid) return;

    // Set Header Month Year
    monthTitle.textContent = `${monthNames[month]} ${year}`;

    // Get first day and total days
    const firstDayIndex = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();
    const prevTotalDays = new Date(year, month, 0).getDate();

    let gridHtml = '';

    // Prev Month Trailing Days (greyed out)
    for (let i = firstDayIndex; i > 0; i--) {
      const dayNum = prevTotalDays - i + 1;
      gridHtml += `<div class="py-3 sm:py-3.5 text-[#d1d5db] font-normal cursor-default">${dayNum}</div>`;
    }

    // Active Month Days
    for (let day = 1; day <= totalDays; day++) {
      const dateObj = new Date(year, month, day);
      const dayOfWeek = dateObj.getDay(); // 0 = Sunday, etc.
      const holiday = isHoliday(year, month, day);

      let dotColor = '#0030c2'; // default: blue (With Records)
      let dotTitle = 'With Records';
      let isHolidayAttr = '';

      if (holiday) {
        dotColor = '#dc2626'; // red (Holiday)
        dotTitle = 'Holiday';
        isHolidayAttr = 'data-is-holiday="true"';
      } else if (dayOfWeek === 0) {
        dotColor = '#9ca3af'; // gray (No Classes)
        dotTitle = 'No Classes';
      }

      const isSelected = (day === selectedDay);
      let cardClasses = 'calendar-day py-3 sm:py-3.5 rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all hover:bg-[#f8fafc]';
      let textClasses = 'text-[#111827]';

      if (isSelected) {
        cardClasses = 'calendar-day py-3 sm:py-3.5 rounded-xl bg-[#e7edff] border-2 border-[#0030c2] shadow-xs flex flex-col items-center justify-center cursor-pointer transition-all';
        textClasses = 'text-[#0030c2] font-bold';
      }

      gridHtml += `
        <div class="${cardClasses}" data-day="${day}" ${isHolidayAttr}>
          <span class="${textClasses}">${day}</span>
          <span class="w-1.5 h-1.5 rounded-full mt-1.5" style="background-color: ${dotColor}" title="${dotTitle}"></span>
        </div>
      `;
    }

    // Next Month Leading Days (greyed out)
    const totalCells = firstDayIndex + totalDays;
    const nextDaysCount = (7 - (totalCells % 7)) % 7;
    for (let day = 1; day <= nextDaysCount; day++) {
      gridHtml += `<div class="py-3 sm:py-3.5 text-[#d1d5db] font-normal cursor-default">${day}</div>`;
    }

    daysGrid.innerHTML = gridHtml;

    // Bind Click Events
    const dayElements = daysGrid.querySelectorAll('.calendar-day');
    dayElements.forEach((dayEl) => {
      dayEl.addEventListener('click', function () {
        const dayNum = parseInt(this.dataset.day, 10);
        selectedDay = dayNum;

        dayElements.forEach((el) => {
          el.className = 'calendar-day py-3 sm:py-3.5 rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all hover:bg-[#f8fafc]';
          const ns = el.querySelector('span:first-child');
          if (ns && !el.dataset.isHoliday) {
            ns.className = 'text-[#111827]';
          }
        });

        this.className = 'calendar-day py-3 sm:py-3.5 rounded-xl bg-[#e7edff] border-2 border-[#0030c2] shadow-xs flex flex-col items-center justify-center cursor-pointer transition-all';
        const ns = this.querySelector('span:first-child');
        if (ns) {
          ns.className = 'text-[#0030c2] font-bold';
        }

        updateDayDetails(year, month, dayNum, this.dataset.isHoliday === 'true');
      });
    });
  }

  function updateDayDetails(year, month, dayNum, isHolidayVal) {
    // Update Section Titles
    const summaryHeader = document.getElementById('dailySummaryHeading');
    const quickActionHeader = document.getElementById('quickActionsHeading');

    if (summaryHeader) {
      summaryHeader.textContent = `Daily Summary - ${monthNames[month]} ${dayNum}, ${year}`;
    }
    if (quickActionHeader) {
      quickActionHeader.textContent = `Quick Actions for ${monthNames[month]} ${dayNum}, ${year}`;
    }

    // Update Navigation & KPI Card Links dynamically
    const dayStr = dayNum.toString().padStart(2, '0');
    const monthStr = (month + 1).toString().padStart(2, '0');
    const dateStr = `${year}-${monthStr}-${dayStr}`;

    const editBtn = document.getElementById('editAttendanceBtn');
    const viewBtn = document.getElementById('viewSummaryBtn');
    if (editBtn) editBtn.href = `attendance.html?date=${dateStr}`;
    if (viewBtn) viewBtn.href = `attendance.html?date=${dateStr}`;

    const kpiPresent = document.getElementById('kpiPresentCard');
    const kpiLate = document.getElementById('kpiLateCard');
    const kpiAbsent = document.getElementById('kpiAbsentCard');
    const kpiExcused = document.getElementById('kpiExcusedCard');
    const kpiTeacher = document.getElementById('kpiTeacherCardLink');

    if (kpiPresent) kpiPresent.href = `attendance.html?date=${dateStr}&status=Present`;
    if (kpiLate) kpiLate.href = `attendance.html?date=${dateStr}&status=Late`;
    if (kpiAbsent) kpiAbsent.href = `attendance.html?date=${dateStr}&status=Absent`;
    if (kpiExcused) kpiExcused.href = `attendance.html?date=${dateStr}&status=Excused`;
    if (kpiTeacher) kpiTeacher.href = `teacher-attendance.html?date=${dateStr}`;

    // Update dynamic KPI stats
    const stats = getDailyStats(dayNum);
    
    const presentCount = document.getElementById('kpiPresentCount');
    const presentPct = document.getElementById('kpiPresentPct');
    const absentCount = document.getElementById('kpiAbsentCount');
    const absentPct = document.getElementById('kpiAbsentPct');
    const lateCount = document.getElementById('kpiLateCount');
    const latePct = document.getElementById('kpiLatePct');
    const excusedCount = document.getElementById('kpiExcusedCount');
    const excusedPct = document.getElementById('kpiExcusedPct');
    const teacherCount = document.getElementById('kpiTeacherCount');
    const teacherPct = document.getElementById('kpiTeacherPct');

    if (presentCount) presentCount.textContent = stats.present;
    if (presentPct) presentPct.textContent = stats.presentPct;
    if (absentCount) absentCount.textContent = stats.absent;
    if (absentPct) absentPct.textContent = stats.absentPct;
    if (lateCount) lateCount.textContent = stats.late;
    if (latePct) latePct.textContent = stats.latePct;
    if (excusedCount) excusedCount.textContent = stats.excused;
    if (excusedPct) excusedPct.textContent = stats.excusedPct;
    if (teacherCount) teacherCount.textContent = stats.teachers;
    if (teacherPct) teacherPct.textContent = stats.teacherPct;
  }

  // Setup Button Navigation
  const prevBtn = document.getElementById('prevMonthBtn');
  const nextBtn = document.getElementById('nextMonthBtn');

  if (prevBtn) {
    prevBtn.addEventListener('click', function () {
      currentMonth--;
      if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
      }
      const maxDays = new Date(currentYear, currentMonth + 1, 0).getDate();
      if (selectedDay > maxDays) selectedDay = maxDays;
      renderCalendar(currentYear, currentMonth);
      updateDayDetails(currentYear, currentMonth, selectedDay, isHoliday(currentYear, currentMonth, selectedDay));
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', function () {
      currentMonth++;
      if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
      }
      const maxDays = new Date(currentYear, currentMonth + 1, 0).getDate();
      if (selectedDay > maxDays) selectedDay = maxDays;
      renderCalendar(currentYear, currentMonth);
      updateDayDetails(currentYear, currentMonth, selectedDay, isHoliday(currentYear, currentMonth, selectedDay));
    });
  }

  // Initial Draw
  renderCalendar(currentYear, currentMonth);
  updateDayDetails(currentYear, currentMonth, selectedDay, isHoliday(currentYear, currentMonth, selectedDay));

  // =============================================================
  // TOAST NOTIFICATIONS HELPER
  // =============================================================
  window.showToast = function(message, type = 'success') {
    let toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) {
      toastContainer = document.createElement('div');
      toastContainer.id = 'toastContainer';
      toastContainer.className = 'fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none';
      document.body.appendChild(toastContainer);
    }

    const toast = document.createElement('div');
    const bgColor = type === 'success' ? 'bg-emerald-600' : type === 'error' ? 'bg-rose-600' : 'bg-[#0030c2]';
    const iconSvg = type === 'success' 
      ? `<svg class="w-5 h-5 text-white shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>`
      : type === 'error'
      ? `<svg class="w-5 h-5 text-white shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>`
      : `<svg class="w-5 h-5 text-white shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`;

    toast.className = `flex items-center gap-2.5 px-4 py-3 text-white text-xs font-semibold rounded-xl shadow-xl ${bgColor} transform transition-all duration-300 translate-y-2 opacity-0 pointer-events-auto border border-white/10`;
    toast.innerHTML = `
      ${iconSvg}
      <span>${message}</span>
    `;

    toastContainer.appendChild(toast);

    // Trigger animation
    setTimeout(() => {
      toast.classList.remove('translate-y-2', 'opacity-0');
    }, 10);

    // Remove toast after 3.5s
    setTimeout(() => {
      toast.classList.add('translate-y-2', 'opacity-0');
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, 3500);
  };

  // =============================================================
  // FILTER MODAL CONTROLS
  // =============================================================
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

  window.applyFiltersAndClose = function() {
    closeFilterModal();
    window.showToast('Filters applied successfully.', 'success');
  };

  window.resetFiltersAndClose = function() {
    const selects = document.querySelectorAll('#filterDepartment, #filterCourse, #filterSection, #filterTeacher');
    selects.forEach((select) => {
      select.value = 'all';
    });
    closeFilterModal();
    window.showToast('Filters reset to default.', 'info');
  };

  // Esc key and backdrop clicks
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      closeFilterModal();
    }
  });

  const filterModal = document.getElementById('filterModal');
  if (filterModal) {
    filterModal.addEventListener('click', function(e) {
      if (e.target === filterModal) {
        closeFilterModal();
      }
    });
  }
});
