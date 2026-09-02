// assets/js/admin/dashboard.js
// Dynamic Dashboard metrics and live attendance loader for Admin Panel

import { supabase } from '../config/supabaseClient.js';

document.addEventListener('DOMContentLoaded', () => {
  console.log('📊 Admin Dashboard Module Initialized');
  initCurrentDate();
  loadDashboardData();
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
