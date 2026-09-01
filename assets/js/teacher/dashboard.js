// assets/js/teacher/dashboard.js
// Teacher Dashboard Module for Bestlink College of the Philippines Attendance Monitoring System

import { supabase } from '../config/supabaseClient.js';

document.addEventListener('DOMContentLoaded', () => {
  console.log('🧑‍🏫 Teacher Dashboard Module Initialized');
  initCurrentDate();
  initActionHandlers();
});

/**
 * Initialize current date in top bar
 */
function initCurrentDate() {
  const dateBtn = document.getElementById('currentDateDisplay');
  if (dateBtn) {
    const today = new Date();
    
    // Format matching reference: "May 27, 2025 (Tuesday)"
    const dayOfWeek = today.toLocaleDateString('en-US', { weekday: 'long' });
    const monthDayYear = today.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    
    dateBtn.innerHTML = `
      <svg class="w-4 h-4 text-[#6b7280] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.75">
        <path stroke-linecap="round" stroke-linejoin="round"
          d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
      </svg>
      <span>${monthDayYear} (${dayOfWeek})</span>
    `;
  }
}

/**
 * Initialize quick action event listeners and navigation
 */
function initActionHandlers() {
  const notifBtn = document.getElementById('teacherNotifBtn');
  if (notifBtn) {
    notifBtn.addEventListener('click', (e) => {
      e.preventDefault();
      console.log('Teacher notifications opened');
    });
  }
}
