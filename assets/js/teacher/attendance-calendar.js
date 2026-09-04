/**
 * Bestlink College of the Philippines
 * Attendance Monitoring System - Attendance Calendar Module (Teacher Panel)
 * File: assets/js/teacher/attendance-calendar.js
 */

// State management for Calendar
let currentCalendarYear = 2026;
let currentCalendarMonth = 8; // September (0-indexed)
let selectedDate = "2026-09-02";

// Calendar sample records with class breakdown data
const calendarDaysData = {
  "2026-09-01": { status: "high", present: 119, late: 4, absent: 5, excused: 0, pct: 93.0, holiday: false },
  "2026-09-02": { status: "high", present: 118, late: 6, absent: 4, excused: 2, pct: 92.2, holiday: false },
  "2026-09-03": { status: "high", present: 120, late: 3, absent: 3, excused: 2, pct: 93.8, holiday: false },
  "2026-09-04": { status: "mod", present: 112, late: 10, absent: 6, excused: 0, pct: 87.5, holiday: false },
  "2026-08-31": { status: "holiday", title: "National Heroes Day (Holiday)", present: 0, late: 0, absent: 0, excused: 0, pct: 0, holiday: true },
  "2026-08-28": { status: "high", present: 116, late: 5, absent: 5, excused: 2, pct: 90.6, holiday: false },
  "2026-08-27": { status: "high", present: 117, late: 4, absent: 6, excused: 1, pct: 91.4, holiday: false },
  "2026-08-26": { status: "mod", present: 110, late: 9, absent: 8, excused: 1, pct: 85.9, holiday: false },
  "2026-08-25": { status: "high", present: 122, late: 2, absent: 3, excused: 1, pct: 95.3, holiday: false },
  "2026-08-21": { status: "holiday", title: "Ninoy Aquino Day (Holiday)", present: 0, late: 0, absent: 0, excused: 0, pct: 0, holiday: true }
};

document.addEventListener("DOMContentLoaded", function () {
  initCurrentDate();
  renderCalendar();
});

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

function goToCurrentMonth() {
  currentCalendarYear = 2026;
  currentCalendarMonth = 8; // September
  renderCalendar();
}

function renderCalendar() {
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
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

  // Current month active days
  for (let day = 1; day <= totalDays; day++) {
    const dateStr = `${currentCalendarYear}-${String(currentCalendarMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const dayOfWeek = new Date(currentCalendarYear, currentCalendarMonth, day).getDay();
    const isWeekend = (dayOfWeek === 0 || dayOfWeek === 6);
    const data = calendarDaysData[dateStr];
    const isSelected = (dateStr === selectedDate);

    const cell = document.createElement("div");
    const baseClasses = "min-h-[88px] p-2 rounded-xl border text-xs flex flex-col justify-between transition-all cursor-pointer select-none text-left";
    
    let borderClass = isSelected ? "border-[#0030c2] ring-2 ring-[#0030c2]/20 bg-[#f4f7ff]" : "border-[#e5e7eb] bg-white hover:border-[#0030c2]/60 hover:shadow-xs";
    
    let badgeHtml = "";
    if (isWeekend) {
      badgeHtml = `<span class="text-[10px] text-gray-400 font-medium">Weekend</span>`;
    } else if (data && data.holiday) {
      badgeHtml = `<span class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 text-[10px] font-bold border border-blue-200">
        <span class="w-1.5 h-1.5 rounded-full bg-blue-500"></span> Holiday
      </span>`;
    } else if (data) {
      const badgeBg = data.status === "high" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-amber-50 text-amber-700 border-amber-200";
      const dotBg = data.status === "high" ? "bg-emerald-500" : "bg-amber-500";
      badgeHtml = `
        <div class="space-y-1">
          <span class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded ${badgeBg} text-[10px] font-bold border">
            <span class="w-1.5 h-1.5 rounded-full ${dotBg}"></span> ${data.pct}% Present
          </span>
          <p class="text-[10px] text-[#6b7280] font-medium leading-none">${data.present} Present • ${data.absent} Abs</p>
        </div>
      `;
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

function selectCalendarDay(dateStr, day, dayOfWeek) {
  selectedDate = dateStr;
  const daysArr = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const monthsArr = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const formattedTitle = `Class Attendance Breakdown — ${monthsArr[currentCalendarMonth]} ${String(day).padStart(2, '0')}, ${currentCalendarYear} (${daysArr[dayOfWeek]})`;
  
  const titleEl = document.getElementById("selectedDateTitle");
  if (titleEl) titleEl.textContent = formattedTitle;
  
  const exportDateInput = document.getElementById("exportDate");
  if (exportDateInput) exportDateInput.value = dateStr;
  
  renderCalendar();
  showToast(`Selected ${monthsArr[currentCalendarMonth]} ${day}, ${currentCalendarYear} class records.`, "info");
}

// Drawer Controls
window.openDayViewDrawer = function (section, subject, date, present, late, absent, excused) {
  const titleEl = document.getElementById("drawerSectionTitle");
  if (titleEl) titleEl.textContent = `${section} — ${subject}`;
  
  const subEl = document.getElementById("drawerDateSubtitle");
  if (subEl) subEl.textContent = `${date} • Class Roll Call`;
  
  const presEl = document.getElementById("drawerPresentCount");
  if (presEl) presEl.textContent = present;
  
  const lateEl = document.getElementById("drawerLateCount");
  if (lateEl) lateEl.textContent = late;
  
  const absEl = document.getElementById("drawerAbsentCount");
  if (absEl) absEl.textContent = absent;
  
  const excEl = document.getElementById("drawerExcusedCount");
  if (excEl) excEl.textContent = excused;

  const drawer = document.getElementById("dayViewDrawer");
  if (drawer) {
    drawer.classList.remove("hidden");
    drawer.classList.add("flex");
  }
};

window.closeDayViewDrawer = function () {
  const drawer = document.getElementById("dayViewDrawer");
  if (drawer) {
    drawer.classList.add("hidden");
    drawer.classList.remove("flex");
  }
};

// Section Filter Controls
window.handleSectionFilterChange = function (val) {
  const rows = document.querySelectorAll("#classBreakdownTableBody tr");
  rows.forEach(row => {
    if (val === "ALL") {
      row.style.display = "";
    } else {
      const sectionBadge = row.querySelector("span");
      if (sectionBadge && sectionBadge.textContent.includes(val)) {
        row.style.display = "";
      } else {
        row.style.display = "none";
      }
    }
  });
  showToast(`Filtered attendance calendar table for ${val}.`, "success");
};

// Export Modal Controls
window.openExportModal = function () {
  const modal = document.getElementById("exportModal");
  if (modal) {
    modal.classList.remove("hidden");
    modal.classList.add("flex");
  }
};

window.closeExportModal = function () {
  const modal = document.getElementById("exportModal");
  if (modal) {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
  }
};

window.updateExportFormatSelection = function (radio) {
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
};

window.handleExport = function (event) {
  event.preventDefault();
  const form = event.target;
  const format = form.elements["exportFormat"].value;
  const section = form.elements["exportSection"].value;
  const date = form.elements["exportDate"].value;

  closeExportModal();

  if (format === "Print") {
    showToast(`Preparing printable attendance sheet for ${section} (${date})...`, "info");
    setTimeout(() => {
      window.print();
    }, 500);
  } else {
    showToast(`Generating ${format} attendance export for ${section} (${date})...`, "success");
  }
};

// Toast Notification
window.showToast = function (message, type = "success") {
  const toast = document.createElement("div");
  const bgClass = type === "success" ? "bg-[#111827] text-white" : type === "info" ? "bg-[#0030c2] text-white" : "bg-red-600 text-white";
  toast.className = `fixed bottom-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-xl text-xs font-medium ${bgClass} transition-all transform duration-300 translate-y-2 opacity-0`;
  toast.innerHTML = `<span>${message}</span>`;
  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.remove("translate-y-2", "opacity-0");
  });

  setTimeout(() => {
    toast.classList.add("translate-y-2", "opacity-0");
    setTimeout(() => toast.remove(), 300);
  }, 3000);
};
