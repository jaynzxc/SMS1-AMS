// assets/js/teacher-attendance.js

// =============================================================
// TEACHER ATTENDANCE - GRAPH FUNCTIONALITY
// =============================================================

// Sample data for different months
const attendanceData = {
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
    }
};

// =============================================================
// UPDATE GRAPH FUNCTION
// =============================================================

function updateGraphData(month) {
    // Use default if month not found
    const monthData = attendanceData[month] || attendanceData['2026-07'];
    const rateValues = monthData.rate;
    const lateValues = monthData.late;
    const absentValues = monthData.absent;
    const labels = monthData.labels;

    // Calculate Y positions
    // Rate: 100% = 30, 0% = 260 → y = 30 + (100 - value) * 2.3
    // Count: 0 = 260, 30 = 30 → y = 260 - (value * 7.67)

    const rateY = rateValues.map(v => 30 + (100 - v) * 2.3);
    const lateY = lateValues.map(v => 260 - (v * 7.67));
    const absentY = absentValues.map(v => 260 - (v * 7.67));

    // Rate line points
    const points = rateY.map((y, i) => `${110 + i * 100},${y}`).join(' ');

    // Update X-Axis Labels
    const xAxisGroup = document.getElementById('xAxisLabels');
    if (xAxisGroup) {
        const texts = xAxisGroup.querySelectorAll('text');
        labels.forEach((label, i) => {
            if (texts[i]) texts[i].textContent = label;
        });
    }

    // Update Rate Line
    const rateLine = document.getElementById('rateLine');
    if (rateLine) {
        rateLine.setAttribute('points', points);
    }

    // Update Rate Dots
    const dotsGroup = document.getElementById('rateDots');
    if (dotsGroup) {
        const circles = dotsGroup.querySelectorAll('circle');
        rateY.forEach((y, i) => {
            if (circles[i]) {
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
                texts[i].setAttribute('y', rateY[i] - 10);
            }
        });
    }

    // Update Late Bars
    const lateGroup = document.getElementById('lateBars');
    if (lateGroup) {
        const rects = lateGroup.querySelectorAll('rect');
        lateValues.forEach((val, i) => {
            if (rects[i]) {
                const y = 260 - (val * 7.67);
                const height = val * 7.67;
                rects[i].setAttribute('y', y);
                rects[i].setAttribute('height', height);
            }
        });
    }

    // Update Absent Bars
    const absentGroup = document.getElementById('absentBars');
    if (absentGroup) {
        const rects = absentGroup.querySelectorAll('rect');
        absentValues.forEach((val, i) => {
            if (rects[i]) {
                const y = 260 - (val * 7.67);
                const height = val * 7.67;
                rects[i].setAttribute('y', y);
                rects[i].setAttribute('height', height);
            }
        });
    }

    // Update Summary Cards (optional)
    updateSummaryCards(monthData);
}

// =============================================================
// UPDATE SUMMARY CARDS
// =============================================================

function updateSummaryCards(data) {
    // Calculate averages from the data
    const avgRate = (data.rate.reduce((a, b) => a + b, 0) / data.rate.length);
    const totalLate = data.late.reduce((a, b) => a + b, 0);
    const totalAbsent = data.absent.reduce((a, b) => a + b, 0);
    
    // Update Monthly Attendance card
    const rateCard = document.querySelector('.stat-card .text-green-600');
    if (rateCard) {
        rateCard.textContent = avgRate.toFixed(2) + '%';
    }
    
    // Update Total Late card
    const lateCard = document.querySelector('.stat-card .text-amber-500');
    if (lateCard) {
        lateCard.textContent = totalLate;
    }
    
    // Update Total Absent card
    const absentCard = document.querySelector('.stat-card .text-red-500');
    if (absentCard) {
        absentCard.textContent = totalAbsent;
    }
}

// =============================================================
// INITIALIZE DATE PICKER
// =============================================================

function initDatePicker() {
    const monthInput = document.getElementById('attendanceMonth');
    
    if (monthInput) {
        // Set default to current month if not set
        if (!monthInput.value) {
            const now = new Date();
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, '0');
            monthInput.value = `${year}-${month}`;
        }
        
        // Load initial data
        updateGraphData(monthInput.value);
        
        // Add event listener
        monthInput.addEventListener('change', function() {
            updateGraphData(this.value);
        });
    }
}

// =============================================================
// INITIALIZE ON DOM READY
// =============================================================

document.addEventListener('DOMContentLoaded', function() {
    initDatePicker();
    console.log('Teacher Attendance graph initialized');
});

// Date Range Picker Functions
function toggleDatePicker() {
  const popup = document.getElementById('datePickerPopup');
  popup.classList.toggle('hidden');
}

function closeDatePicker() {
  document.getElementById('datePickerPopup').classList.add('hidden');
}

function updateDateRange() {
  const from = document.getElementById('dateFrom');
  const to = document.getElementById('dateTo');
  const display = document.getElementById('dateRangeText');
  
  // Format dates to MM/DD/YYYY
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    return `${parts[1]}/${parts[2]}/${parts[0]}`;
  };
  
  const fromFormatted = formatDate(from.value);
  const toFormatted = formatDate(to.value);
  
  if (from.value && to.value) {
    display.value = `${fromFormatted} - ${toFormatted}`;
  } else if (from.value) {
    display.value = `${fromFormatted} - `;
  } else if (to.value) {
    display.value = ` - ${toFormatted}`;
  }
}

// Close popup when clicking outside
document.addEventListener('click', function(event) {
  const container = document.getElementById('dateRangeContainer');
  const popup = document.getElementById('datePickerPopup');
  
  if (!container.contains(event.target) && !popup.classList.contains('hidden')) {
    popup.classList.add('hidden');
  }
});

// Initialize with default values
document.addEventListener('DOMContentLoaded', function() {
  updateDateRange();
});