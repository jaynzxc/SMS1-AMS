// assets/js/attendance-calendar.js

document.addEventListener('DOMContentLoaded', function () {
  const calendarDays = document.querySelectorAll('.calendar-day');

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

  // Calendar day selection interactive behavior
  calendarDays.forEach((day) => {
    day.addEventListener('click', function () {
      // Remove active state from all days
      calendarDays.forEach((d) => {
        d.classList.remove('bg-[#e7edff]', 'border-2', 'border-[#0030c2]', 'shadow-xs');
        const numSpan = d.querySelector('span:first-child');
        if (numSpan && !d.dataset.isHoliday) {
          numSpan.classList.remove('text-[#0030c2]', 'font-bold');
          numSpan.classList.add('text-[#111827]');
        }
      });

      // Add active state to clicked day
      this.classList.add('bg-[#e7edff]', 'border-2', 'border-[#0030c2]', 'shadow-xs');
      const numSpan = this.querySelector('span:first-child');
      const num = numSpan ? parseInt(numSpan.textContent.trim(), 10) : 25;

      if (numSpan && !this.dataset.isHoliday) {
        numSpan.classList.add('text-[#0030c2]', 'font-bold');
      }

      // Update Section Titles
      const summaryHeader = document.getElementById('dailySummaryHeading');
      const quickActionHeader = document.getElementById('quickActionsHeading');
      
      if (summaryHeader && num) {
        summaryHeader.textContent = `Daily Summary - July ${num}, 2026`;
      }
      if (quickActionHeader && num) {
        quickActionHeader.textContent = `Quick Actions for July ${num}, 2026`;
      }

      // Update dynamic KPI stats
      const stats = mockDailyStats[num] || mockDailyStats.default;
      
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
    });
  });

  // Filter Reset Button
  const resetBtn = document.getElementById('resetFilterBtn');
  if (resetBtn) {
    resetBtn.addEventListener('click', function () {
      const selects = document.querySelectorAll('#filterDepartment, #filterCourse, #filterSection, #filterTeacher');
      selects.forEach((select) => {
        select.value = 'all';
      });
      // Visual feedback
      resetBtn.classList.add('bg-gray-100');
      setTimeout(() => {
        resetBtn.classList.remove('bg-gray-100');
      }, 150);
    });
  }

  // Filter Apply Button
  const applyBtn = document.getElementById('applyFilterBtn');
  if (applyBtn) {
    applyBtn.addEventListener('click', function () {
      applyBtn.classList.add('opacity-80', 'scale-[0.98]');
      setTimeout(() => {
        applyBtn.classList.remove('opacity-80', 'scale-[0.98]');
      }, 150);
    });
  }
});
