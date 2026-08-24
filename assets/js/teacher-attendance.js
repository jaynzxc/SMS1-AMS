// assets/js/teacher-attendance.js
// Teacher Attendance Management & Interactive Filtering Module

let currentPage = 1;
const totalPages = 9;

document.addEventListener('DOMContentLoaded', function() {
    console.log('Teacher Attendance module initialized');

    // Initialize Search
    initTableSearch();

    // Initial graph & cards load
    updateGraphData('2026-07');

    // Modal listeners (backdrop click and ESC key)
    initModalListeners();

    // Read and apply URL query parameters (date)
    const urlParams = new URLSearchParams(window.location.search);
    const dateParam = urlParams.get('date');
    if (dateParam) {
        const dateFromInput = document.getElementById('filterDateFrom');
        const dateToInput = document.getElementById('filterDateTo');
        if (dateFromInput) dateFromInput.value = dateParam;
        if (dateToInput) dateToInput.value = dateParam;
    }
});

// =============================================================
// TOAST NOTIFICATIONS HELPER
// =============================================================
function showToast(message, type = 'success') {
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
}

// =============================================================
// TEACHER ATTENDANCE - COMPREHENSIVE GRAPH DATASET (2026, 2025 & Dynamic Historical)
// =============================================================

const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

const monthAbbrs = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

const attendanceData = {
    // --- YEAR 2026 ---
    '2026-01': {
        rate: [85, 83, 88, 86, 87, 84, 86],
        late: [15, 12, 18, 14, 13, 16, 15],
        absent: [8, 6, 5, 7, 9, 6, 8],
        labels: ['Jan 1', 'Jan 5', 'Jan 10', 'Jan 15', 'Jan 20', 'Jan 25', 'Jan 31']
    },
    '2026-02': {
        rate: [87, 85, 90, 88, 89, 86, 88],
        late: [14, 11, 16, 12, 15, 13, 14],
        absent: [6, 4, 7, 5, 4, 8, 6],
        labels: ['Feb 1', 'Feb 5', 'Feb 10', 'Feb 15', 'Feb 20', 'Feb 25', 'Feb 28']
    },
    '2026-03': {
        rate: [88, 90, 86, 92, 89, 91, 90],
        late: [12, 10, 14, 8, 11, 9, 10],
        absent: [5, 3, 6, 4, 5, 3, 4],
        labels: ['Mar 1', 'Mar 5', 'Mar 10', 'Mar 15', 'Mar 20', 'Mar 25', 'Mar 31']
    },
    '2026-04': {
        rate: [86, 84, 89, 87, 85, 88, 87],
        late: [16, 14, 12, 15, 17, 13, 14],
        absent: [7, 8, 5, 6, 7, 5, 6],
        labels: ['Apr 1', 'Apr 5', 'Apr 10', 'Apr 15', 'Apr 20', 'Apr 25', 'Apr 30']
    },
    '2026-05': {
        rate: [90, 88, 92, 89, 91, 90, 89],
        late: [10, 12, 8, 11, 9, 10, 11],
        absent: [4, 5, 3, 4, 3, 4, 5],
        labels: ['May 1', 'May 5', 'May 10', 'May 15', 'May 20', 'May 25', 'May 31']
    },
    '2026-06': {
        rate: [89, 87, 91, 88, 90, 86, 88],
        late: [11, 13, 9, 12, 10, 14, 12],
        absent: [5, 6, 4, 5, 4, 7, 5],
        labels: ['Jun 1', 'Jun 5', 'Jun 10', 'Jun 15', 'Jun 20', 'Jun 25', 'Jun 30']
    },
    '2026-07': {
        rate: [88, 86, 92, 90, 91, 87, 89.6],
        late: [18, 14, 10, 16, 12, 15, 19],
        absent: [6, 4, 8, 5, 7, 5, 9],
        labels: ['Jul 1', 'Jul 5', 'Jul 10', 'Jul 15', 'Jul 20', 'Jul 25', 'Jul 31']
    },
    '2026-08': {
        rate: [91, 89, 93, 91, 92, 90, 91],
        late: [9, 11, 7, 10, 8, 9, 10],
        absent: [3, 4, 2, 3, 3, 4, 3],
        labels: ['Aug 1', 'Aug 5', 'Aug 10', 'Aug 15', 'Aug 20', 'Aug 25', 'Aug 31']
    },
    '2026-09': {
        rate: [87, 85, 89, 86, 88, 84, 86],
        late: [15, 17, 13, 16, 14, 18, 15],
        absent: [7, 8, 6, 7, 6, 9, 7],
        labels: ['Sep 1', 'Sep 5', 'Sep 10', 'Sep 15', 'Sep 20', 'Sep 25', 'Sep 30']
    },
    '2026-10': {
        rate: [89, 91, 87, 90, 88, 92, 89],
        late: [12, 10, 14, 11, 13, 9, 12],
        absent: [5, 3, 6, 4, 5, 3, 5],
        labels: ['Oct 1', 'Oct 5', 'Oct 10', 'Oct 15', 'Oct 20', 'Oct 25', 'Oct 31']
    },
    '2026-11': {
        rate: [86, 84, 88, 85, 87, 83, 85],
        late: [16, 18, 14, 17, 15, 19, 16],
        absent: [8, 9, 7, 8, 7, 10, 8],
        labels: ['Nov 1', 'Nov 5', 'Nov 10', 'Nov 15', 'Nov 20', 'Nov 25', 'Nov 30']
    },
    '2026-12': {
        rate: [90, 92, 88, 91, 89, 93, 90],
        late: [10, 8, 12, 9, 11, 7, 10],
        absent: [4, 2, 5, 3, 4, 2, 4],
        labels: ['Dec 1', 'Dec 5', 'Dec 10', 'Dec 15', 'Dec 20', 'Dec 25', 'Dec 31']
    },

    // --- YEAR 2025 (Historical Records) ---
    '2025-01': {
        rate: [82, 80, 85, 84, 83, 81, 83.5],
        late: [20, 18, 22, 17, 19, 21, 20],
        absent: [10, 9, 8, 11, 12, 10, 11],
        labels: ['Jan 1', 'Jan 5', 'Jan 10', 'Jan 15', 'Jan 20', 'Jan 25', 'Jan 31']
    },
    '2025-02': {
        rate: [84, 82, 88, 86, 85, 83, 85],
        late: [18, 16, 20, 15, 17, 19, 17],
        absent: [9, 8, 7, 9, 10, 8, 9],
        labels: ['Feb 1', 'Feb 5', 'Feb 10', 'Feb 15', 'Feb 20', 'Feb 25', 'Feb 28']
    },
    '2025-03': {
        rate: [86, 88, 84, 89, 87, 88, 87],
        late: [15, 13, 17, 12, 14, 13, 14],
        absent: [7, 6, 8, 6, 7, 5, 6],
        labels: ['Mar 1', 'Mar 5', 'Mar 10', 'Mar 15', 'Mar 20', 'Mar 25', 'Mar 31']
    },
    '2025-04': {
        rate: [83, 81, 87, 85, 82, 86, 84],
        late: [19, 17, 15, 18, 20, 16, 17],
        absent: [10, 11, 7, 8, 10, 7, 9],
        labels: ['Apr 1', 'Apr 5', 'Apr 10', 'Apr 15', 'Apr 20', 'Apr 25', 'Apr 30']
    },
    '2025-05': {
        rate: [87, 85, 90, 87, 89, 88, 87.5],
        late: [14, 15, 11, 13, 12, 13, 14],
        absent: [6, 7, 5, 6, 5, 6, 7],
        labels: ['May 1', 'May 5', 'May 10', 'May 15', 'May 20', 'May 25', 'May 31']
    },
    '2025-06': {
        rate: [86, 84, 88, 85, 87, 83, 85.5],
        late: [15, 17, 13, 16, 14, 18, 15],
        absent: [8, 9, 6, 7, 6, 10, 8],
        labels: ['Jun 1', 'Jun 5', 'Jun 10', 'Jun 15', 'Jun 20', 'Jun 25', 'Jun 30']
    },
    '2025-07': {
        rate: [85, 83, 89, 87, 88, 84, 86],
        late: [22, 18, 14, 19, 15, 18, 21],
        absent: [9, 7, 10, 8, 9, 8, 11],
        labels: ['Jul 1', 'Jul 5', 'Jul 10', 'Jul 15', 'Jul 20', 'Jul 25', 'Jul 31']
    },
    '2025-08': {
        rate: [88, 86, 91, 89, 90, 87, 88.5],
        late: [12, 14, 10, 13, 11, 12, 13],
        absent: [5, 6, 4, 5, 5, 6, 5],
        labels: ['Aug 1', 'Aug 5', 'Aug 10', 'Aug 15', 'Aug 20', 'Aug 25', 'Aug 31']
    },
    '2025-09': {
        rate: [84, 82, 86, 83, 85, 81, 83.5],
        late: [18, 20, 16, 19, 17, 21, 18],
        absent: [9, 10, 8, 9, 8, 11, 9],
        labels: ['Sep 1', 'Sep 5', 'Sep 10', 'Sep 15', 'Sep 20', 'Sep 25', 'Sep 30']
    },
    '2025-10': {
        rate: [87, 89, 85, 88, 86, 90, 87.5],
        late: [14, 12, 16, 13, 15, 11, 14],
        absent: [7, 5, 8, 6, 7, 5, 7],
        labels: ['Oct 1', 'Oct 5', 'Oct 10', 'Oct 15', 'Oct 20', 'Oct 25', 'Oct 31']
    },
    '2025-11': {
        rate: [83, 81, 85, 82, 84, 80, 82.5],
        late: [19, 21, 17, 20, 18, 22, 19],
        absent: [10, 11, 9, 10, 9, 12, 10],
        labels: ['Nov 1', 'Nov 5', 'Nov 10', 'Nov 15', 'Nov 20', 'Nov 25', 'Nov 30']
    },
    '2025-12': {
        rate: [88, 90, 86, 89, 87, 91, 88.5],
        late: [13, 11, 15, 12, 14, 10, 12],
        absent: [6, 4, 7, 5, 6, 4, 6],
        labels: ['Dec 1', 'Dec 5', 'Dec 10', 'Dec 15', 'Dec 20', 'Dec 25', 'Dec 31']
    }
};

// Deterministic generator for historical years not explicitly defined
function getOrGenerateAttendanceData(year, monthNum) {
    const monthKey = `${year}-${monthNum}`;
    if (attendanceData[monthKey]) {
        return attendanceData[monthKey];
    }

    const monthIndex = parseInt(monthNum, 10) - 1;
    const abbr = monthAbbrs[monthIndex] || 'Mon';
    const seed = (parseInt(year, 10) * 12) + monthIndex;
    
    // Generate deterministic values based on year/month seed
    const pseudoRandom = (offset) => Math.sin(seed + offset) * 10000;
    const baseRate = 84 + (seed % 7);
    
    const rate = [
        +(baseRate + ((pseudoRandom(1) % 4) - 2)).toFixed(1),
        +(baseRate + ((pseudoRandom(2) % 4) - 3)).toFixed(1),
        +(baseRate + ((pseudoRandom(3) % 4) + 1)).toFixed(1),
        +(baseRate + ((pseudoRandom(4) % 4) - 1)).toFixed(1),
        +(baseRate + ((pseudoRandom(5) % 4) + 0)).toFixed(1),
        +(baseRate + ((pseudoRandom(6) % 4) - 2)).toFixed(1),
        +(baseRate + ((pseudoRandom(7) % 4) + 1)).toFixed(1)
    ];

    const late = [14, 16, 12, 15, 13, 17, 15];
    const absent = [6, 7, 5, 6, 7, 5, 6];
    const labels = [`${abbr} 1`, `${abbr} 5`, `${abbr} 10`, `${abbr} 15`, `${abbr} 20`, `${abbr} 25`, `${abbr} 31`];

    return { rate, late, absent, labels };
}

// =============================================================
// MONTH & YEAR PICKER CONTROLLER
// =============================================================

let currentPickerYear = 2026;
let currentPickerMonth = '07';

function toggleMonthDropdown() {
    const menu = document.getElementById('monthDropdownMenu');
    const arrow = document.getElementById('monthDropdownArrow');
    if (!menu) return;
    
    const isHidden = menu.classList.contains('hidden');
    if (isHidden) {
        menu.classList.remove('hidden');
        if (arrow) arrow.classList.add('rotate-180');
        refreshMonthGridUI();
    } else {
        closeMonthDropdown();
    }
}

function closeMonthDropdown() {
    const menu = document.getElementById('monthDropdownMenu');
    const arrow = document.getElementById('monthDropdownArrow');
    if (menu) menu.classList.add('hidden');
    if (arrow) arrow.classList.remove('rotate-180');
}

function changeGraphYear(delta) {
    currentPickerYear += delta;
    const yearEl = document.getElementById('graphSelectedYear');
    if (yearEl) {
        yearEl.textContent = currentPickerYear;
    }
    refreshMonthGridUI();
}

function refreshMonthGridUI() {
    const yearEl = document.getElementById('graphSelectedYear');
    if (yearEl) {
        yearEl.textContent = currentPickerYear;
    }

    const currentActiveYear = parseInt(document.getElementById('selectedMonthText')?.textContent.split(' ')[1] || '2026', 10);
    const monthButtons = document.querySelectorAll('.month-grid-btn');
    monthButtons.forEach(btn => {
        const m = btn.dataset.month;
        if (m === currentPickerMonth && currentPickerYear === currentActiveYear) {
            btn.className = 'month-grid-btn py-1 rounded text-center bg-[#0030c2] text-white font-bold text-xs shadow-xs';
        } else {
            btn.className = 'month-grid-btn py-1 rounded text-center hover:bg-[#eff6ff] hover:text-[#0030c2] text-[#4b5563] text-xs font-semibold transition-colors';
        }
    });
}

function selectPickerMonth(monthNum, monthName) {
    currentPickerMonth = monthNum;
    const monthKey = `${currentPickerYear}-${monthNum}`;
    const fullLabel = `${monthName} ${currentPickerYear}`;

    const labelSpan = document.getElementById('selectedMonthText');
    if (labelSpan) {
        labelSpan.textContent = fullLabel;
    }

    refreshMonthGridUI();
    closeMonthDropdown();
    updateGraphData(monthKey);
    showToast(`Loaded attendance records for ${fullLabel}.`, 'info');
}

function jumpToCurrentMonth() {
    currentPickerYear = 2026;
    currentPickerMonth = '07';
    selectPickerMonth('07', 'July');
}

// =============================================================
// UPDATE GRAPH FUNCTION
// =============================================================

function updateGraphData(monthKey) {
    const parts = (monthKey || '2026-07').split('-');
    const year = parts[0] || '2026';
    const monthNum = parts[1] || '07';

    const monthData = getOrGenerateAttendanceData(year, monthNum);
    const rateValues = monthData.rate;
    const labels = monthData.labels;

    // X Coordinates matching the 7 data points (viewBox 0 0 700 280)
    const xCoords = [75, 170, 265, 360, 455, 550, 645];
    
    // Scale: 100% = y:20, 50% = y:215 (Range of 50% = 195px, 3.9px per 1%)
    const rateY = rateValues.map(v => {
        const clamped = Math.max(50, Math.min(100, v));
        return +(20 + (100 - clamped) * 3.9).toFixed(1);
    });

    const linePoints = rateY.map((y, i) => `${xCoords[i]},${y}`).join(' ');
    const polygonPoints = `${xCoords[0]},215 ` + linePoints + ` ${xCoords[xCoords.length - 1]},215`;

    // Update Rate Line
    const rateLine = document.getElementById('rateLine');
    if (rateLine) {
        rateLine.setAttribute('points', linePoints);
    }

    // Update Area Gradient Polygon
    const rateArea = document.getElementById('rateArea');
    if (rateArea) {
        rateArea.setAttribute('points', polygonPoints);
    }

    // Update Rate Dots
    const dotsGroup = document.getElementById('rateDots');
    if (dotsGroup) {
        const circles = dotsGroup.querySelectorAll('circle');
        rateY.forEach((y, i) => {
            if (circles[i]) {
                circles[i].setAttribute('cx', xCoords[i]);
                circles[i].setAttribute('cy', y);
            }
        });
    }

    // Update Rate Labels
    const labelsGroup = document.getElementById('rateLabels');
    if (labelsGroup) {
        const texts = labelsGroup.querySelectorAll('text');
        rateValues.forEach((val, i) => {
            if (texts[i]) {
                texts[i].textContent = val + '%';
                texts[i].setAttribute('x', xCoords[i]);
                texts[i].setAttribute('y', rateY[i] - 12);
            }
        });
    }

    // Update X-Axis Labels
    const xAxisGroup = document.getElementById('xAxisLabels');
    if (xAxisGroup) {
        const texts = xAxisGroup.querySelectorAll('text');
        labels.forEach((label, i) => {
            if (texts[i]) {
                texts[i].textContent = label;
                texts[i].setAttribute('x', xCoords[i]);
            }
        });
    }

    // Update Summary Cards
    updateSummaryCards(monthData);
}

// =============================================================
// UPDATE SUMMARY CARDS
// =============================================================

function updateSummaryCards(data) {
    const avgRate = (data.rate.reduce((a, b) => a + b, 0) / data.rate.length);
    const totalLate = data.late.reduce((a, b) => a + b, 0);
    const totalAbsent = data.absent.reduce((a, b) => a + b, 0);
    
    // Update Monthly Attendance card
    const rateCard = document.getElementById('statMonthlyRate') || document.querySelector('.stat-card .text-green-600');
    if (rateCard) {
        rateCard.textContent = avgRate.toFixed(2) + '%';
    }
    
    // Update Total Late card
    const lateCard = document.getElementById('statTotalLate') || document.querySelector('.stat-card .text-amber-500');
    if (lateCard) {
        lateCard.textContent = totalLate;
    }
    
    // Update Total Absent card
    const absentCard = document.getElementById('statTotalAbsent') || document.querySelector('.stat-card .text-red-500');
    if (absentCard) {
        absentCard.textContent = totalAbsent;
    }
}

// =============================================================
// SEARCH & MULTI-CRITERIA FILTERING
// =============================================================

function initTableSearch() {
    const searchInput = document.getElementById('teacherSearch');
    if (!searchInput) return;

    searchInput.addEventListener('input', function() {
        executeTeacherFiltering();
    });
}

function executeTeacherFiltering() {
    const searchInput = document.getElementById('teacherSearch');
    const searchQuery = searchInput ? searchInput.value.trim().toLowerCase() : '';
    const deptFilter = document.getElementById('filterDepartmentSelect') ? document.getElementById('filterDepartmentSelect').value : '';
    const statusFilter = document.getElementById('filterStatusSelect') ? document.getElementById('filterStatusSelect').value : '';
    
    const rows = document.querySelectorAll('.teacher-row');
    let visibleCount = 0;

    rows.forEach(row => {
        const id = (row.dataset.teacherId || '').toLowerCase();
        const name = (row.dataset.teacherName || '').toLowerCase();
        const dept = row.dataset.department || '';
        const status = row.dataset.status || '';

        const matchesSearch = !searchQuery || id.includes(searchQuery) || name.includes(searchQuery) || dept.toLowerCase().includes(searchQuery);
        const matchesDept = !deptFilter || dept === deptFilter;
        const matchesStatus = !statusFilter || status.toLowerCase() === statusFilter.toLowerCase();

        if (matchesSearch && matchesDept && matchesStatus) {
            row.style.display = '';
            visibleCount++;
        } else {
            row.style.display = 'none';
        }
    });

    // Update Counts
    const recordBadge = document.getElementById('teacherRecordCount');
    if (recordBadge) {
        recordBadge.textContent = `${visibleCount} Records`;
    }
    const showingEnd = document.getElementById('showingEndCount');
    if (showingEnd) {
        showingEnd.textContent = visibleCount;
    }

    return visibleCount;
}

// =============================================================
// FILTER MODAL CONTROLS
// =============================================================

function openFilterModal() {
    const modal = document.getElementById('filterModal');
    if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    }
}

function closeFilterModal() {
    const modal = document.getElementById('filterModal');
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }
}

function applyTeacherFilters() {
    const matchCount = executeTeacherFiltering();
    closeFilterModal();
    showToast(`Filters applied. ${matchCount} record(s) matching.`, 'info');
}

function resetTeacherFilters() {
    const deptSelect = document.getElementById('filterDepartmentSelect');
    const statusSelect = document.getElementById('filterStatusSelect');
    const dateFrom = document.getElementById('filterDateFrom');
    const dateTo = document.getElementById('filterDateTo');
    const searchInput = document.getElementById('teacherSearch');

    if (deptSelect) deptSelect.value = '';
    if (statusSelect) statusSelect.value = '';
    if (dateFrom) dateFrom.value = '2026-07-01';
    if (dateTo) dateTo.value = '2026-07-31';
    if (searchInput) searchInput.value = '';

    executeTeacherFiltering();
    closeFilterModal();
    showToast('Filters reset to default.', 'info');
}

// =============================================================
// EXPORT MODAL CONTROLS
// =============================================================

function openExportModal() {
    const modal = document.getElementById('exportModal');
    if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    }
}

function closeExportModal() {
    const modal = document.getElementById('exportModal');
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }
}

function updateExportFormatSelection(radioInput) {
    const allOptions = document.querySelectorAll('.export-format-option');
    allOptions.forEach(opt => {
        opt.classList.remove('border-[#0030c2]', 'bg-[#eff6ff]');
        opt.classList.add('border-[#e5e7eb]');
        const span = opt.querySelector('span.font-bold');
        if (span) {
            span.classList.remove('text-[#0030c2]');
            span.classList.add('text-[#374151]');
        }
    });

    const parentLabel = radioInput.closest('.export-format-option') || radioInput.parentElement;
    if (parentLabel) {
        parentLabel.classList.remove('border-[#e5e7eb]');
        parentLabel.classList.add('border-[#0030c2]', 'bg-[#eff6ff]');
        const span = parentLabel.querySelector('span.font-bold');
        if (span) {
            span.classList.remove('text-[#374151]');
            span.classList.add('text-[#0030c2]');
        }
    }
}

function handleExport(event) {
    if (event) event.preventDefault();
    const format = document.querySelector('input[name="exportFormat"]:checked')?.value || 'CSV';
    const specificDate = document.getElementById('exportDate')?.value || '2026-07-25';
    const fileExt = format.toLowerCase() === 'excel' ? 'xlsx' : 'csv';

    closeExportModal();
    showToast(`Generating ${format} export for Teacher Attendance (${specificDate})... Download will start shortly.`, 'info');

    setTimeout(() => {
        showToast(`Teacher_Attendance_${specificDate}.${fileExt} downloaded successfully!`, 'success');
    }, 1200);
}

// =============================================================
// PAGINATION CONTROLLER
// =============================================================

function changePage(pageNum) {
    if (pageNum < 1 || pageNum > totalPages) return;
    currentPage = pageNum;

    // Update pagination button active state
    const paginationContainer = document.getElementById('paginationContainer');
    if (paginationContainer) {
        const buttons = paginationContainer.querySelectorAll('.pagination-btn');
        buttons.forEach(btn => {
            if (!btn.id) {
                const text = btn.textContent.trim();
                if (text === String(pageNum)) {
                    btn.classList.add('pagination-btn-active');
                } else if (text !== '...') {
                    btn.classList.remove('pagination-btn-active');
                }
            }
        });

        // Update Prev / Next button disabled state
        const prevBtn = document.getElementById('prevPageBtn');
        const nextBtn = document.getElementById('nextPageBtn');
        if (prevBtn) prevBtn.disabled = currentPage === 1;
        if (nextBtn) nextBtn.disabled = currentPage === totalPages;
    }

    const start = (currentPage - 1) * 5 + 1;
    const end = Math.min(currentPage * 5, 85);
    const startEl = document.getElementById('showingStartCount');
    const endEl = document.getElementById('showingEndCount');
    if (startEl) startEl.textContent = start;
    if (endEl) endEl.textContent = end;

    showToast(`Viewing page ${currentPage} of teacher attendance records.`, 'info');
}

// =============================================================
// VIEW & EDIT MODALS
// =============================================================

function openViewTeacherModal(data) {
    if (document.getElementById('viewTeacherName')) document.getElementById('viewTeacherName').textContent = data.name || '';
    if (document.getElementById('viewTeacherId')) document.getElementById('viewTeacherId').textContent = data.id || '';
    if (document.getElementById('viewTeacherDept')) document.getElementById('viewTeacherDept').textContent = data.dept || '';
    if (document.getElementById('viewTeacherRole')) document.getElementById('viewTeacherRole').textContent = data.role || 'Faculty Member';
    if (document.getElementById('viewTeacherTimeIn')) document.getElementById('viewTeacherTimeIn').textContent = data.timeIn || '—';
    if (document.getElementById('viewTeacherTimeOut')) document.getElementById('viewTeacherTimeOut').textContent = data.timeOut || '—';
    if (document.getElementById('viewTeacherDate')) document.getElementById('viewTeacherDate').textContent = data.date || '';
    if (document.getElementById('viewTeacherEmail')) document.getElementById('viewTeacherEmail').textContent = data.email || 'faculty@school.edu.ph';
    if (document.getElementById('viewTeacherContact')) document.getElementById('viewTeacherContact').textContent = data.contact || 'N/A';

    const statusBadge = document.getElementById('viewTeacherStatus');
    if (statusBadge) {
        statusBadge.textContent = data.status || 'Present';
        statusBadge.className = 'status-badge ' + (data.status === 'Present' ? 'status-badge-present' : (data.status === 'Late' ? 'status-badge-late' : 'status-badge-absent'));
    }

    const modal = document.getElementById('viewTeacherModal');
    if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    }
}

function closeViewTeacherModal() {
    const modal = document.getElementById('viewTeacherModal');
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }
}

function openEditTeacherModal(data) {
    if (document.getElementById('editTeacherName')) document.getElementById('editTeacherName').value = data.name || '';
    if (document.getElementById('editTeacherId')) document.getElementById('editTeacherId').value = data.id || '';
    if (document.getElementById('editTimeIn')) document.getElementById('editTimeIn').value = data.timeIn || '';
    if (document.getElementById('editTimeOut')) document.getElementById('editTimeOut').value = data.timeOut || '';
    if (document.getElementById('editStatus')) document.getElementById('editStatus').value = data.status || 'Present';

    const modal = document.getElementById('editTeacherModal');
    if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    }
}

function closeEditTeacherModal() {
    const modal = document.getElementById('editTeacherModal');
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }
}

function saveTeacherEdit(e) {
    if (e) e.preventDefault();
    const id = document.getElementById('editTeacherId')?.value || '';
    const name = document.getElementById('editTeacherName')?.value || 'Faculty Member';
    const status = document.getElementById('editStatus')?.value || 'Present';
    const timeIn = document.getElementById('editTimeIn')?.value || '';
    const timeOut = document.getElementById('editTimeOut')?.value || '';

    const row = document.querySelector(`.teacher-row[data-teacher-id="${id}"]`);
    if (row) {
        row.dataset.status = status;
        const statusCell = row.querySelector('.status-badge');
        if (statusCell) {
            statusCell.textContent = status;
            statusCell.className = 'status-badge ' + (status === 'Present' ? 'status-badge-present' : (status === 'Late' ? 'status-badge-late' : 'status-badge-absent'));
        }
    }

    closeEditTeacherModal();
    showToast(`Attendance record for ${name} (${id}) updated successfully!`, 'success');
}

// =============================================================
// MODAL LISTENERS (BACKDROP CLICK & ESC KEY)
// =============================================================

function initModalListeners() {
    const modalIds = ['filterModal', 'exportModal', 'viewTeacherModal', 'editTeacherModal'];
    
    modalIds.forEach(id => {
        const modal = document.getElementById(id);
        if (modal) {
            modal.addEventListener('click', function(e) {
                if (e.target === modal) {
                    modal.classList.add('hidden');
                    modal.classList.remove('flex');
                }
            });
        }
    });

    // Month dropdown outside click
    document.addEventListener('click', function(event) {
        const monthContainer = document.getElementById('monthDropdownContainer');
        if (monthContainer && !monthContainer.contains(event.target)) {
            closeMonthDropdown();
        }
    });

    // ESC key close all
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            closeFilterModal();
            closeExportModal();
            closeViewTeacherModal();
            closeEditTeacherModal();
            closeMonthDropdown();
        }
    });
}