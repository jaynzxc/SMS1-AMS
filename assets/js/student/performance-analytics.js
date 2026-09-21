/**
 * Bestlink College of the Philippines
 * Student Performance Analytics Module (student/performance-analytics.html)
 * Reference: teacher/class-analytics.html & assets/js/teacher/class-analytics.js
 */

document.addEventListener('DOMContentLoaded', () => {
  initDateDisplay();
  initAnalyticsData();
  setupEventListeners();
});

// Student dataset keyed by enrolled subject
const analyticsDataset = {
  ALL: {
    overall: '94.20%',
    overallTrend: '1.80%',
    overallTrendUp: true,
    present: '91.50%',
    presentTrend: '2.30%',
    absent: '3.40%',
    absentTrend: '0.90%',
    late: '5.10%',
    lateTrend: '0.60%',
    excused: '1.70%',
    excusedTrend: '0.50%',
    topSubjects: [
      { rank: 1, name: 'CS201 (Data Structures)', teacher: 'Prof. Santos', rate: '96.50%' },
      { rank: 2, name: 'IT401 (Capstone Project 1)', teacher: 'Dr. Garcia', rate: '95.00%' },
      { rank: 3, name: 'IT301 (Web Systems)', teacher: 'Mrs. Dela Cruz', rate: '93.00%' },
      { rank: 4, name: 'GE101 (Purposive Comm)', teacher: 'Prof. Lim', rate: '92.50%' },
      { rank: 5, name: 'IT302 (Database Admin)', teacher: 'Mr. Ramos', rate: '91.80%' }
    ],
    riskAbsences: [
      { rank: 1, name: 'IT302 (Database Admin)', teacher: 'Mr. Ramos', count: 1 },
      { rank: 2, name: 'GE101 (Purposive Comm)', teacher: 'Prof. Lim', count: 1 },
      { rank: 3, name: 'IT301 (Web Systems)', teacher: 'Mrs. Dela Cruz', count: 0 },
      { rank: 4, name: 'CS201 (Data Structures)', teacher: 'Prof. Santos', count: 0 }
    ],
    riskTardiness: [
      { rank: 1, name: 'IT302 (Database Admin)', teacher: 'Mr. Ramos', count: 1 },
      { rank: 2, name: 'IT301 (Web Systems)', teacher: 'Mrs. Dela Cruz', count: 1 },
      { rank: 3, name: 'CS201 (Data Structures)', teacher: 'Prof. Santos', count: 1 },
      { rank: 4, name: 'IT401 (Capstone 1)', teacher: 'Dr. Garcia', count: 1 }
    ],
    sections: [
      { name: 'CS201 (BSIT 3A)', present: '95.00%', late: '2.50%', absent: '2.50%' },
      { name: 'IT401 (BSIT 3A)', present: '93.50%', late: '3.50%', absent: '3.00%' },
      { name: 'IT301 (BSIT 3A)', present: '90.00%', late: '6.00%', absent: '4.00%' },
      { name: 'GE101 (BSIT 3A)', present: '89.50%', late: '4.50%', absent: '6.00%' },
      { name: 'IT302 (BSIT 3A)', present: '88.50%', late: '7.20%', absent: '4.30%' }
    ]
  }
};

/**
 * Initialize Date Display
 */
function initDateDisplay() {
  const dateLabel = document.getElementById('currentDateLabel');
  if (dateLabel) {
    const today = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' };
    dateLabel.textContent = today.toLocaleDateString('en-US', options);
  }
}

/**
 * Initialize Analytics View
 */
function initAnalyticsData() {
  renderTopSubjectsTable();
  initChartTooltips();
}

/**
 * Setup Event Listeners
 */
function setupEventListeners() {
  // Backdrop dismiss
  const modal = document.getElementById('exportModal');
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeExportModal();
    });
  }
}

/**
 * Render Punctual Subjects Table
 */
function renderTopSubjectsTable() {
  const tbody = document.getElementById('topStudentsTableBody');
  if (!tbody) return;

  const list = analyticsDataset.ALL.topSubjects;
  tbody.innerHTML = list.map(item => `
    <tr>
      <td class="py-2.5 px-1 font-semibold text-[#6b7280]">${item.rank}</td>
      <td class="py-2.5 px-1 font-bold">${item.name}</td>
      <td class="py-2.5 px-1 text-[#4b5563]">${item.teacher}</td>
      <td class="py-2.5 px-1 text-right">
        <span class="px-2 py-0.5 rounded text-[11px] font-bold bg-[#dcfce7] text-[#16a34a]">${item.rate}</span>
      </td>
    </tr>
  `).join('');
}

/**
 * Tab Switching for Risk Table (Absences vs Tardiness)
 * Exact match with teacher/class-analytics.js
 */
window.switchRiskTab = function (tab) {
  const btnAbs = document.getElementById('btnTabAbsences');
  const btnTardy = document.getElementById('btnTabTardiness');
  const viewAbs = document.getElementById('viewMostAbsences');
  const viewTardy = document.getElementById('viewMostTardiness');

  if (!btnAbs || !btnTardy || !viewAbs || !viewTardy) return;

  if (tab === 'absences') {
    btnAbs.className = 'text-xs font-bold text-[#dc2626] pb-1 border-b-2 border-[#dc2626] focus:outline-none transition-colors cursor-pointer';
    btnTardy.className = 'text-xs font-medium text-[#6b7280] pb-1 hover:text-[#111827] focus:outline-none transition-colors cursor-pointer';
    viewAbs.classList.remove('hidden');
    viewTardy.classList.add('hidden');
  } else {
    btnTardy.className = 'text-xs font-bold text-[#ea580c] pb-1 border-b-2 border-[#ea580c] focus:outline-none transition-colors cursor-pointer';
    btnAbs.className = 'text-xs font-medium text-[#6b7280] pb-1 hover:text-[#111827] focus:outline-none transition-colors cursor-pointer';
    viewTardy.classList.remove('hidden');
    viewAbs.classList.add('hidden');
  }
};

// =========================================================
// STUDENT PERFORMANCE ANALYTICS CHARTS ENGINE (600x226 Standard)
// =========================================================

const STUDENT_TREND_DATASETS = {
  '30d': [
    { date: 'Jul 1', rate: 94.2 },
    { date: 'Jul 3', rate: 95.0 },
    { date: 'Jul 5', rate: 92.5 },
    { date: 'Jul 8', rate: 96.0 },
    { date: 'Jul 10', rate: 93.8 },
    { date: 'Jul 12', rate: 94.5 },
    { date: 'Jul 15', rate: 97.0 },
    { date: 'Jul 17', rate: 95.2 },
    { date: 'Jul 19', rate: 94.0 },
    { date: 'Jul 22', rate: 96.2 },
    { date: 'Jul 24', rate: 97.0 },
    { date: 'Jul 25', rate: 95.5 },
    { date: 'Jul 26', rate: 97.5 },
    { date: 'Jul 28', rate: 97.2 },
    { date: 'Jul 30', rate: 96.8 },
    { date: 'Jul 31', rate: 94.5 }
  ],
  '14d': [
    { date: 'Jul 18', rate: 95.5 },
    { date: 'Jul 20', rate: 94.0 },
    { date: 'Jul 21', rate: 93.0 },
    { date: 'Jul 23', rate: 94.5 },
    { date: 'Jul 24', rate: 97.0 },
    { date: 'Jul 25', rate: 95.5 },
    { date: 'Jul 26', rate: 97.5 },
    { date: 'Jul 28', rate: 97.2 },
    { date: 'Jul 30', rate: 96.8 },
    { date: 'Jul 31', rate: 94.5 }
  ],
  '7d': [
    { date: 'Jul 25', rate: 95.5 },
    { date: 'Jul 26', rate: 97.5 },
    { date: 'Jul 27', rate: 97.0 },
    { date: 'Jul 28', rate: 97.2 },
    { date: 'Jul 29', rate: 96.0 },
    { date: 'Jul 30', rate: 96.8 },
    { date: 'Jul 31', rate: 94.5 }
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
  const data = STUDENT_TREND_DATASETS[timeRange] || STUDENT_TREND_DATASETS['30d'];
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
 * Export Modal Handlers
 * Exact match with teacher/class-analytics.js
 */
window.openExportModal = function () {
  const modal = document.getElementById('exportModal');
  if (modal) modal.classList.remove('hidden');
};

window.closeExportModal = function () {
  const modal = document.getElementById('exportModal');
  if (modal) modal.classList.add('hidden');
};

window.updateExportFormatSelection = function (radio) {
  const cards = document.querySelectorAll('.export-format-card');
  cards.forEach(card => {
    card.classList.remove('border-2', 'border-[#0030c2]', 'bg-[#eff6ff]');
    card.classList.add('border', 'border-[#e5e7eb]');
    const title = card.querySelector('.export-card-title');
    if (title) title.className = 'font-bold text-[#374151] export-card-title';
  });

  const parent = radio.closest('.export-format-card');
  if (parent) {
    parent.classList.remove('border', 'border-[#e5e7eb]');
    parent.classList.add('border-2', 'border-[#0030c2]', 'bg-[#eff6ff]');
    const title = parent.querySelector('.export-card-title');
    if (title) title.className = 'font-bold text-[#0030c2] export-card-title';
  }

  const btnText = document.getElementById('exportSubmitBtnText');
  if (btnText) {
    btnText.textContent = radio.value === 'Excel' ? 'Download Excel' : 'Download CSV';
  }
};

window.handleExportSubmit = function (event) {
  event.preventDefault();
  closeExportModal();

  const period = document.getElementById('modalExportPeriod').value;
  const section = document.getElementById('modalExportSection').value;
  const formatEl = document.querySelector('input[name="exportFormat"]:checked');
  const format = formatEl ? formatEl.value : 'CSV';

  // Trigger downloadable simulation
  const csvContent = "data:text/csv;charset=utf-8,"
    + "Rank,Subject,Instructor,Attendance Rate,Present %,Late %,Absent %\n"
    + "1,CS201 (Data Structures),Prof. Santos,96.50%,95.00%,2.50%,2.50%\n"
    + "2,IT401 (Capstone Project 1),Dr. Garcia,95.00%,93.50%,3.50%,3.00%\n"
    + "3,IT301 (Web Systems),Mrs. Dela Cruz,93.00%,90.00%,6.00%,4.00%\n"
    + "4,GE101 (Purposive Comm),Prof. Lim,92.50%,89.50%,4.50%,6.00%\n"
    + "5,IT302 (Database Admin),Mr. Ramos,91.80%,88.50%,7.20%,4.30%\n";

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `student_performance_analytics_${section.toLowerCase().replace(/\s+/g, '_')}_${period.toLowerCase()}.${format === 'Excel' ? 'xlsx' : 'csv'}`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  showToast('Analytics Exported', `Personal performance analytics (${format}) downloaded successfully.`, 'success');
};

/**
 * Toast Notification System (Consistent with Attendance Calendar)
 */
function showToast(titleOrMessage, messageOrType = 'info', possibleType) {
  let title = titleOrMessage;
  let message = messageOrType;
  let type = possibleType;

  if (possibleType === undefined) {
    const knownTypes = ['success', 'info', 'error', 'danger', 'warning'];
    if (knownTypes.includes(messageOrType)) {
      message = titleOrMessage;
      type = messageOrType === 'danger' ? 'error' : messageOrType;
      title = type === 'success' ? 'Success' : type === 'info' ? 'Notification' : type === 'warning' ? 'Warning' : 'Error';
    } else {
      type = 'info';
    }
  } else {
    if (type === 'danger') type = 'error';
  }

  let toastContainer = document.getElementById('toastContainer');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toastContainer';
    toastContainer.className = 'fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none';
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  toast.className = 'custom-toast pointer-events-auto bg-white border border-[#e5e7eb] shadow-xl rounded-xl p-3.5 flex items-start gap-3 min-w-[280px] max-w-sm transition-all duration-300 transform translate-x-0';

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

// Close profile dropdown on outside click
document.addEventListener('click', function (e) {
  const profileBtn = document.getElementById('topbarProfileBtn');
  const profileMenu = document.getElementById('studentProfileMenu');
  if (profileMenu && !profileMenu.classList.contains('hidden')) {
    if (profileBtn && !profileBtn.contains(e.target) && !profileMenu.contains(e.target)) {
      profileMenu.classList.add('hidden');
    }
  }
});
