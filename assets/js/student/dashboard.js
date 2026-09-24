// assets/js/student/dashboard.js
// Student Dashboard Module for Bestlink College of the Philippines Attendance Monitoring System

import { supabase } from '../config/supabaseClient.js';

document.addEventListener('DOMContentLoaded', () => {
  console.log('Student Dashboard Module Initialized');
  initCurrentDate();
  initActionHandlers();
  initAttendanceTrendChart();
});

/**
 * Initialize current date in top bar
 */
function initCurrentDate() {
  const dateBtn = document.getElementById('currentDateDisplay');
  if (dateBtn) {
    const today = new Date();
    
    // Format: "May 27, 2025 (Tuesday)"
    const dayOfWeek = today.toLocaleDateString('en-US', { weekday: 'long' });
    const monthDayYear = today.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    
    dateBtn.innerHTML = `
      <svg class="w-4 h-4 text-[#6b7280] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.75">
        <path stroke-linecap="round" stroke-linejoin="round"
          d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
      </svg>
      <span id="currentDateLabel">${monthDayYear} (${dayOfWeek})</span>
    `;
  }
}

/**
 * Initialize quick action event listeners and navigation
 */
function initActionHandlers() {
  const notifBtn = document.getElementById('studentNotifBtn');
  if (notifBtn) {
    notifBtn.addEventListener('click', (e) => {
      e.preventDefault();
      console.log('Student notifications clicked');
    });
  }
}

/**
 * Initialize 30-Day Attendance & Punctuality Trend Chart
 */
function initAttendanceTrendChart() {
  const canvas = document.getElementById('studentAttendanceTrendChart');
  if (!canvas || typeof Chart === 'undefined') return;

  const ctx = canvas.getContext('2d');

  new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Current Week'],
      datasets: [
        {
          label: 'Present Rate (%)',
          data: [95.0, 97.5, 96.0, 100.0, 96.8],
          borderColor: '#0030c2',
          backgroundColor: 'rgba(0, 48, 194, 0.06)',
          borderWidth: 2.5,
          tension: 0.35,
          fill: true,
          pointRadius: 4,
          pointHoverRadius: 6,
          pointBackgroundColor: '#0030c2',
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2
        },
        {
          label: 'Punctuality (%)',
          data: [90.0, 92.5, 95.0, 97.0, 95.5],
          borderColor: '#f97316',
          backgroundColor: 'transparent',
          borderWidth: 2,
          borderDash: [4, 4],
          tension: 0.35,
          fill: false,
          pointRadius: 3.5,
          pointHoverRadius: 5.5,
          pointBackgroundColor: '#f97316',
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false
      },
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          backgroundColor: '#111827',
          titleColor: '#ffffff',
          bodyColor: '#e5e7eb',
          padding: 10,
          cornerRadius: 8,
          callbacks: {
            label: function(context) {
              return `${context.dataset.label}: ${context.parsed.y}%`;
            }
          }
        }
      },
      scales: {
        x: {
          grid: {
            display: false
          },
          ticks: {
            font: {
              family: "'Inter', sans-serif",
              size: 11
            },
            color: '#6b7280'
          }
        },
        y: {
          min: 80,
          max: 100,
          ticks: {
            stepSize: 5,
            callback: function(val) {
              return val + '%';
            },
            font: {
              family: "'Inter', sans-serif",
              size: 11
            },
            color: '#6b7280'
          },
          grid: {
            color: '#f3f4f6'
          }
        }
      }
    }
  });
}
