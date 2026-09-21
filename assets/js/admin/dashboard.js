// assets/js/admin/dashboard.js
// Dynamic Dashboard metrics and live attendance loader for Admin Panel

import { supabase } from '../config/supabaseClient.js';

document.addEventListener('DOMContentLoaded', () => {
  console.log('Admin Dashboard Module Initialized');
  initCurrentDate();
  loadDashboardData();
  initTrendChartFilter();
});

/**
 * Display formatted current date in top bar
 */
function initCurrentDate() {
  const dateBtn = document.getElementById('currentDateDisplay');
  if (dateBtn) {
    const today = new Date();
    const dayOfWeek = today.toLocaleDateString('en-US', { weekday: 'long' });
    const monthDayYear = today.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    const formatted = `${monthDayYear} (${dayOfWeek})`;

    const label = dateBtn.querySelector('#currentDateLabel');
    if (label) {
      label.textContent = formatted;
    } else {
      dateBtn.innerHTML = `
        <svg class="w-4 h-4 text-[#6b7280] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.75">
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
        </svg>
        <span id="currentDateLabel">${formatted}</span>
      `;
    }
  }
}

/**
 * Load all live stats from Supabase
 */
async function loadDashboardData() {
  try {
    // 1. Fetch Students Total Count
    const { count: studentCount, error: studentError } = await supabase
      .from('students')
      .select('*', { count: 'exact', head: true });

    // 2. Fetch All Attendance Records
    const { data: attendanceLogs, error: attError } = await supabase
      .from('attendance')
      .select('*')
      .order('recorded_at', { ascending: false });

    if (attError) {
      console.error('Error fetching attendance logs:', attError);
      return;
    }

    const logs = attendanceLogs || [];
    const totalEnrolled = (studentCount !== null && studentCount > 0) ? studentCount : (logs.length > 0 ? logs.length : 0);

    // Calculate Today's Counts
    const presentCount = logs.filter(l => l.status === 'Present').length;
    const lateCount = logs.filter(l => l.status === 'Late').length;
    const absentCount = logs.filter(l => l.status === 'Absent').length;
    const excusedCount = logs.filter(l => l.status === 'Excused').length;

    const presentPct = totalEnrolled > 0 ? ((presentCount / totalEnrolled) * 100).toFixed(1) : '0.0';
    const latePct = totalEnrolled > 0 ? ((lateCount / totalEnrolled) * 100).toFixed(1) : '0.0';
    const absentPct = totalEnrolled > 0 ? ((absentCount / totalEnrolled) * 100).toFixed(1) : '0.0';
    const overallRate = totalEnrolled > 0 ? (((presentCount + lateCount) / totalEnrolled) * 100).toFixed(1) : '0.0';

    // Update Top 4 KPI Cards
    updateText('statTotalStudents', totalEnrolled.toLocaleString());
    updateText('statPresentToday', presentCount.toLocaleString());
    updateText('statPresentPercentage', `${presentPct}% of total`);
    updateText('statLateToday', lateCount.toLocaleString());
    updateText('statLatePercentage', `${latePct}% of total`);
    updateText('statAbsentToday', absentCount.toLocaleString());
    updateText('statAbsentPercentage', `${absentPct}% of total`);

    // Update Today's Summary Card
    updateText('summaryPresent', `${presentCount.toLocaleString()} (${presentPct}%)`);
    updateText('summaryLate', `${lateCount.toLocaleString()} (${latePct}%)`);
    updateText('summaryAbsent', `${absentCount.toLocaleString()} (${absentPct}%)`);
    updateText('summaryOverallRate', `${overallRate}%`);
    updateText('summaryTotalEnrolled', totalEnrolled.toLocaleString());

    // Update Recent Attendance Table
    renderRecentAttendance(logs.slice(0, 5));

  } catch (err) {
    console.error('Failed to load dashboard data:', err);
  }
}

/**
 * Render up to 5 recent attendance records into the table
 */
function renderRecentAttendance(recentLogs) {
  const tableBody = document.getElementById('recentAttendanceTableBody');
  const countBadge = document.getElementById('recentAttendanceCountBadge');

  if (!tableBody) return;

  if (countBadge) {
    countBadge.textContent = `${recentLogs.length} Logs`;
  }

  if (recentLogs.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="6" class="py-8 text-center text-xs text-[#6b7280]">
          No attendance records found yet.
        </td>
      </tr>
    `;
    return;
  }

  const badgeStyles = {
    'Present': 'bg-[#f0fdf4] text-[#16a34a] border border-[#bbf7d0]',
    'Late': 'bg-[#fffbeb] text-[#d97706] border border-[#fde68a]',
    'Absent': 'bg-[#fef2f2] text-[#dc2626] border border-[#fecaca]',
    'Excused': 'bg-[#eff6ff] text-[#0030c2] border border-[#bfdbfe]'
  };

  tableBody.innerHTML = recentLogs.map(log => {
    const badgeClass = badgeStyles[log.status] || 'bg-gray-100 text-gray-700';
    const formattedDate = log.date ? new Date(log.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—';
    const formattedTime = log.time_in ? formatTime(log.time_in) : '—';

    return `
      <tr class="hover:bg-[#f8fafc] transition-colors">
        <td class="py-3 px-4 font-mono font-medium text-[#6b7280]">${escapeHtml(log.student_id || '—')}</td>
        <td class="py-3 px-4 font-semibold text-[#111827]">${escapeHtml(log.student_name || '—')}</td>
        <td class="py-3 px-4 text-[#6b7280]">${formattedTime}</td>
        <td class="py-3 px-4">
          <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${badgeClass}">
            ${log.status || 'Unknown'}
          </span>
        </td>
        <td class="py-3 px-4 text-[#6b7280]">${formattedDate}</td>
        <td class="py-3 px-4 text-right">
          <a href="attendance.html"
            class="inline-flex p-1 text-[#6b7280] hover:text-[#111827] hover:bg-gray-100 rounded-lg transition-colors"
            title="View in Attendance">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.75">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" />
            </svg>
          </a>
        </td>
      </tr>
    `;
  }).join('');
}

function updateText(elementId, value) {
  const el = document.getElementById(elementId);
  if (el) el.textContent = value;
}

function formatTime(timeStr) {
  if (!timeStr) return '—';
  const parts = timeStr.split(':');
  if (parts.length < 2) return timeStr;
  let hours = parseInt(parts[0], 10);
  const minutes = parts[1];
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  return `${hours}:${minutes} ${ampm}`;
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

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

let activeTrendPoints = [];

/**
 * Attendance Trend Chart Filter & Modern Spline Setup
 */
function initTrendChartFilter() {
  const rangeSelect = document.getElementById('trendRangeSelect');
  const trendContainer = document.getElementById('trendChartContainer');
  const trendSvg = document.getElementById('trendChartSvg');
  const trendMagneticLine = document.getElementById('trendMagneticLine');
  const trendTooltip = document.getElementById('trendChartTooltip');
  const trendDate = document.getElementById('trendTooltipDate');
  const trendRate = document.getElementById('trendTooltipRate');

  const trendDataSets = {
    '7': {
      subtitle: 'Daily Attendance Rate (Last 7 Days)',
      rates: [88, 86, 92, 90, 91, 87, 89.6],
      labels: ['Jul 19', 'Jul 20', 'Jul 21', 'Jul 22', 'Jul 23', 'Jul 24', 'Jul 25'],
      dates: ['Jul 19, 2026', 'Jul 20, 2026', 'Jul 21, 2026', 'Jul 22, 2026', 'Jul 23, 2026', 'Jul 24, 2026', 'Jul 25, 2026']
    },
    '14': {
      subtitle: 'Daily Attendance Rate (Last 14 Days)',
      rates: [85, 87, 89, 86, 90, 91, 88, 86, 92, 90, 91, 87, 89.6],
      labels: ['Jul 12', 'Jul 14', 'Jul 16', 'Jul 18', 'Jul 20', 'Jul 22', 'Jul 25'],
      dates: ['Jul 12, 2026', 'Jul 14, 2026', 'Jul 16, 2026', 'Jul 18, 2026', 'Jul 20, 2026', 'Jul 22, 2026', 'Jul 25, 2026']
    },
    '30': {
      subtitle: 'Daily Attendance Rate (Last 30 Days)',
      rates: [84, 88, 91, 87, 89, 93, 89.6],
      labels: ['Jun 26', 'Jul 1', 'Jul 6', 'Jul 11', 'Jul 16', 'Jul 21', 'Jul 25'],
      dates: ['Jun 26, 2026', 'Jul 1, 2026', 'Jul 6, 2026', 'Jul 11, 2026', 'Jul 16, 2026', 'Jul 21, 2026', 'Jul 25, 2026']
    },
    'semester': {
      subtitle: 'Monthly Attendance Rate (This Semester)',
      rates: [87.5, 89.2, 91.0, 88.4, 92.1, 89.6],
      labels: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
      dates: ['Feb 28, 2026', 'Mar 31, 2026', 'Apr 30, 2026', 'May 31, 2026', 'Jun 30, 2026', 'Jul 25, 2026']
    }
  };

  // Initial render
  const initialKey = rangeSelect ? rangeSelect.value : '7';
  let currentTrendConfig = trendDataSets[initialKey] || trendDataSets['7'];
  activeTrendPoints = renderSvgTrendChart(currentTrendConfig.rates, currentTrendConfig.labels, currentTrendConfig.dates);

  if (rangeSelect) {
    rangeSelect.addEventListener('change', function () {
      const selected = this.value;
      currentTrendConfig = trendDataSets[selected] || trendDataSets['7'];

      const subtitleEl = document.getElementById('trendSubtitle');
      if (subtitleEl) subtitleEl.textContent = currentTrendConfig.subtitle;

      activeTrendPoints = renderSvgTrendChart(currentTrendConfig.rates, currentTrendConfig.labels, currentTrendConfig.dates);
      if (trendTooltip) trendTooltip.style.opacity = '0';
      if (trendMagneticLine) trendMagneticLine.style.opacity = '0';
    });
  }

  // Auto-refit cleanly on window or container resize
  window.addEventListener('resize', () => {
    if (currentTrendConfig) {
      activeTrendPoints = renderSvgTrendChart(currentTrendConfig.rates, currentTrendConfig.labels, currentTrendConfig.dates);
    }
  });

  // Magnetic cursor tracking and contained tooltip handler
  if (trendContainer && trendSvg && trendTooltip) {
    trendContainer.addEventListener('mousemove', (e) => {
      if (!activeTrendPoints || activeTrendPoints.length === 0) return;
      const containerRect = trendContainer.getBoundingClientRect();
      const svgRect = trendSvg.getBoundingClientRect();
      const mouseSvgX = e.clientX - svgRect.left;

      // Find closest point by X coordinate
      let closest = activeTrendPoints[0];
      let minDist = Math.abs(mouseSvgX - closest.x);
      for (let i = 1; i < activeTrendPoints.length; i++) {
        const dist = Math.abs(mouseSvgX - activeTrendPoints[i].x);
        if (dist < minDist) {
          minDist = dist;
          closest = activeTrendPoints[i];
        }
      }

      // Snap magnetic vertical guide line
      if (trendMagneticLine) {
        trendMagneticLine.setAttribute('x1', closest.x);
        trendMagneticLine.setAttribute('x2', closest.x);
        trendMagneticLine.style.opacity = '0.5';
      }

      // Highlight active dot
      activeTrendPoints.forEach(p => {
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

      // Update tooltip text - always use a real date
      if (trendDate) trendDate.textContent = closest.date || (closest.label ? `${closest.label}, 2026` : 'Jul 25, 2026');
      if (trendRate) trendRate.textContent = `${typeof closest.rate === 'number' ? closest.rate.toFixed(1) : closest.rate}%`;

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
      if (activeTrendPoints) {
        activeTrendPoints.forEach(p => {
          if (p.el) {
            p.el.setAttribute('r', '4');
            p.el.setAttribute('stroke-width', '2');
          }
        });
      }
    });
  }
}

function renderSvgTrendChart(rates, labels, dates) {
  const trendSvg = document.getElementById('trendChartSvg');
  const trendContainer = document.getElementById('trendChartContainer');
  const areaPath = document.getElementById('trendAreaPath');
  const linePath = document.getElementById('trendLinePath');
  const pointsGroup = document.getElementById('trendPointsGroup');
  const labelsGroup = document.getElementById('trendXAxisLabels');
  const gridLinesGroup = document.getElementById('trendGridLinesGroup');

  if (!trendSvg || !linePath || !areaPath || !pointsGroup || !labelsGroup) return [];

  // Determine dynamic container width for crisp 1:1 pixel rendering
  const containerW = trendContainer ? trendContainer.clientWidth : 0;
  const svgW = trendSvg.clientWidth || (trendSvg.getBoundingClientRect ? trendSvg.getBoundingClientRect().width : 0);
  const width = Math.max(450, Math.round(containerW || svgW || 750));
  const height = 226;

  // Set viewBox to match exact pixel dimensions so circles and text are 100% undistorted
  trendSvg.setAttribute('viewBox', `0 0 ${width} ${height}`);

  // Dynamic horizontal grid lines spanning card width naturally
  if (gridLinesGroup) {
    const endGridX = width - 16;
    gridLinesGroup.innerHTML = `
      <line x1="36" y1="20" x2="${endGridX}" y2="20" />
      <line x1="36" y1="63.75" x2="${endGridX}" y2="63.75" />
      <line x1="36" y1="107.5" x2="${endGridX}" y2="107.5" />
      <line x1="36" y1="151.25" x2="${endGridX}" y2="151.25" />
      <line x1="36" y1="195" x2="${endGridX}" y2="195" />
    `;
  }

  // Coordinate mapping: startX at 46 (right of Y-labels), endX at width - 20
  const startX = 46;
  const endX = width - 20;
  const bottomY = 195;
  const topY = 20;
  const count = rates.length;

  const points = rates.map((rate, idx) => {
    const cx = count > 1 ? startX + (idx / (count - 1)) * (endX - startX) : (startX + endX) / 2;
    const clampedRate = Math.max(60, Math.min(100, rate));
    const cy = bottomY - ((clampedRate - 60) / 40) * (bottomY - topY);
    const dateFormatted = (dates && dates[idx]) ? dates[idx] : `${labels[idx]}, 2026`;
    return {
      x: cx,
      y: cy,
      rate: rate,
      label: labels[idx] || `Point ${idx + 1}`,
      date: dateFormatted
    };
  });

  // Calculate natural Bezier spline
  const lineD = getNaturalBezierPath(points);
  const firstPt = points[0];
  const lastPt = points[points.length - 1];
  const areaD = `${lineD} L ${lastPt.x.toFixed(1)},${bottomY} L ${firstPt.x.toFixed(1)},${bottomY} Z`;

  linePath.setAttribute('d', lineD);
  areaPath.setAttribute('d', areaD);

  // Render interactive circle dots (100% round, undistorted)
  pointsGroup.innerHTML = points.map((p, idx) => `
    <circle class="trend-dot cursor-pointer" cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="4" data-index="${idx}" />
  `).join('');

  // Render formatted X-axis labels (crisp, undistorted)
  labelsGroup.innerHTML = points.map(p => `
    <text x="${p.x.toFixed(1)}" y="216" text-anchor="middle">${p.label}</text>
  `).join('');

  // Cache dot elements into point objects for magnetic hover
  const dotElements = Array.from(pointsGroup.querySelectorAll('.trend-dot'));
  points.forEach((p, i) => {
    p.el = dotElements[i];
  });

  return points;
}
