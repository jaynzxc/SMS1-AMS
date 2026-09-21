/**
 * Performance Analytics Logic & Interactivity
 */

document.addEventListener('DOMContentLoaded', () => {
  initStudentsAtRiskTabs();
  initExportAction();
  initFilterListeners();
  initChartTooltips();
});

/**
 * Tab switcher for "Students At Risk" card (Most Absences vs Most Tardiness)
 */
function initStudentsAtRiskTabs() {
  const btnTabAbsences = document.getElementById('btnTabAbsences');
  const btnTabTardiness = document.getElementById('btnTabTardiness');
  const viewMostAbsences = document.getElementById('viewMostAbsences');
  const viewMostTardiness = document.getElementById('viewMostTardiness');

  if (!btnTabAbsences || !btnTabTardiness || !viewMostAbsences || !viewMostTardiness) return;

  btnTabAbsences.addEventListener('click', () => {
    // Absences active style
    btnTabAbsences.className = 'text-xs font-bold text-[#dc2626] pb-1 border-b-2 border-[#dc2626] focus:outline-none transition-colors';
    btnTabTardiness.className = 'text-xs font-medium text-[#6b7280] pb-1 hover:text-[#111827] focus:outline-none transition-colors';
    
    viewMostAbsences.classList.remove('hidden');
    viewMostTardiness.classList.add('hidden');
  });

  btnTabTardiness.addEventListener('click', () => {
    // Tardiness active style
    btnTabTardiness.className = 'text-xs font-bold text-[#ea580c] pb-1 border-b-2 border-[#ea580c] focus:outline-none transition-colors';
    btnTabAbsences.className = 'text-xs font-medium text-[#6b7280] pb-1 hover:text-[#111827] focus:outline-none transition-colors';
    
    viewMostTardiness.classList.remove('hidden');
    viewMostAbsences.classList.add('hidden');
  });
}

/**
 * Export analytics action
 */
function initExportAction() {
  const btnExport = document.getElementById('btnExport');
  if (!btnExport) return;

  btnExport.addEventListener('click', () => {
    // Trigger download or print prompt for analytics
    alert('Exporting Performance Analytics report for the selected filter criteria...');
  });
}

/**
 * Filter change listeners for dynamic updates
 */
function initFilterListeners() {
  const filters = ['filterSchoolYear', 'filterSemester', 'filterMonth', 'filterCourse', 'filterSection', 'filterTeacher'];

  filters.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('change', () => {
        // Visual feedback when filter changes
        console.log(`Filter changed: ${id} = ${el.value}`);
      });
    }
  });
}

// ---------------------------------------------------------
// Trend Dataset Configurations (Referencing line_chartUI.md)
// ---------------------------------------------------------
const TREND_DATASETS = {
  '30d': [
    { date: 'Jul 1', rate: 89.1 },
    { date: 'Jul 3', rate: 87.0 },
    { date: 'Jul 6', rate: 93.0 },
    { date: 'Jul 8', rate: 92.0 },
    { date: 'Jul 11', rate: 88.0 },
    { date: 'Jul 14', rate: 94.0 },
    { date: 'Jul 16', rate: 92.0 },
    { date: 'Jul 18', rate: 95.0 },
    { date: 'Jul 21', rate: 91.0 },
    { date: 'Jul 23', rate: 92.0 },
    { date: 'Jul 24', rate: 95.0 },
    { date: 'Jul 25', rate: 95.0 },
    { date: 'Jul 26', rate: 97.2 },
    { date: 'Jul 28', rate: 97.2 },
    { date: 'Jul 30', rate: 96.2 },
    { date: 'Jul 31', rate: 92.0 }
  ],
  '14d': [
    { date: 'Jul 18', rate: 95.0 },
    { date: 'Jul 20', rate: 93.5 },
    { date: 'Jul 21', rate: 91.0 },
    { date: 'Jul 23', rate: 92.0 },
    { date: 'Jul 24', rate: 95.0 },
    { date: 'Jul 25', rate: 95.0 },
    { date: 'Jul 26', rate: 97.2 },
    { date: 'Jul 28', rate: 97.2 },
    { date: 'Jul 30', rate: 96.2 },
    { date: 'Jul 31', rate: 92.0 }
  ],
  '7d': [
    { date: 'Jul 25', rate: 95.0 },
    { date: 'Jul 26', rate: 97.2 },
    { date: 'Jul 27', rate: 96.8 },
    { date: 'Jul 28', rate: 97.2 },
    { date: 'Jul 29', rate: 95.5 },
    { date: 'Jul 30', rate: 96.2 },
    { date: 'Jul 31', rate: 92.0 }
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
  const data = TREND_DATASETS[timeRange] || TREND_DATASETS['30d'];
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


