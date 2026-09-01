// assets/js/teacher/daily-attendance.js
// Teacher Daily Attendance Management Module for Bestlink College of the Philippines Attendance Monitoring System

import { supabase } from '../config/supabaseClient.js';

// Default Demo Class Roster Data
const DEFAULT_ROSTER = [
  { id: '2024-00101', name: 'Capili, John Michael', gender: 'M', timeIn: '9:18 AM', status: 'Late', method: 'RFID', remarks: 'Late: 3 mins' },
  { id: '2024-00102', name: 'Santos, Maria Angela', gender: 'F', timeIn: '9:08 AM', status: 'Present', method: 'QR Code', remarks: '-' },
  { id: '2024-00103', name: 'Dela Cruz, Pedro Luis', gender: 'M', timeIn: '--', status: 'Absent', method: 'Manual', remarks: 'Unexcused' },
  { id: '2024-00104', name: 'Reyes, Anna Sophia', gender: 'F', timeIn: '9:05 AM', status: 'Present', method: 'RFID', remarks: '-' },
  { id: '2024-00105', name: 'Rivera, Luis Gabriel', gender: 'M', timeIn: '9:25 AM', status: 'Late', method: 'RFID', remarks: 'Late: 10 mins' },
  { id: '2024-00106', name: 'Solomon, Carla Jane', gender: 'F', timeIn: '9:12 AM', status: 'Present', method: 'QR Code', remarks: '-' },
  { id: '2024-00107', name: 'Salazar, Miguel Antonio', gender: 'M', timeIn: '--', status: 'Absent', method: 'Manual', remarks: 'No excuse slip' },
  { id: '2024-00108', name: 'Bautista, Chloe Marie', gender: 'F', timeIn: '9:02 AM', status: 'Present', method: 'RFID', remarks: '-' },
  { id: '2024-00109', name: 'Aquino, Rafael James', gender: 'M', timeIn: '9:20 AM', status: 'Late', method: 'QR Code', remarks: 'Late: 5 mins' },
  { id: '2024-00110', name: 'Villanueva, Nicole Anne', gender: 'F', timeIn: '9:14 AM', status: 'Present', method: 'RFID', remarks: '-' },
  { id: '2024-00111', name: 'Tan, Joshua Alexander', gender: 'M', timeIn: '9:07 AM', status: 'Present', method: 'RFID', remarks: '-' },
  { id: '2024-00112', name: 'Mendoza, Princess Kate', gender: 'F', timeIn: '9:19 AM', status: 'Late', method: 'Manual', remarks: 'Late: 4 mins' }
];

// Class Schedule mapping
const CLASS_SCHEDULES = {
  'web-dev': { subject: 'Web Development', section: 'BSIT 2B', time: '9:15 AM - 10:45 AM', room: 'IT 203' },
  'intro-comp': { subject: 'Introduction to Computing', section: 'BSIT 1A', time: '7:30 AM - 9:00 AM', room: 'IT 101' },
  'db-systems': { subject: 'Database Systems', section: 'BSIT 3A', time: '1:00 PM - 2:30 PM', room: 'IT 205' },
  'sys-analysis': { subject: 'Systems Analysis', section: 'BSIT 4A', time: '2:45 PM - 4:15 PM', room: 'IT 302' }
};

let currentRoster = JSON.parse(JSON.stringify(DEFAULT_ROSTER));
let activeStatusFilter = '';
let activeMethodFilter = '';
let searchQuery = '';
let isSessionActive = true;
let editingStudentId = null;

document.addEventListener('DOMContentLoaded', () => {
  console.log('🧑‍🏫 Teacher Daily Attendance Module Initialized');
  initURLParams();
  initEventListeners();
  renderAttendanceTable();
  updateStatCounters();
});

/**
 * Read URL parameters (e.g. ?subject=web-development) to auto-select class
 */
function initURLParams() {
  const params = new URLSearchParams(window.location.search);
  const subjectParam = params.get('subject');

  const subjectSelect = document.getElementById('subjectSelect');
  if (subjectParam && subjectSelect) {
    if (subjectParam.includes('intro')) subjectSelect.value = 'intro-comp';
    else if (subjectParam.includes('web')) subjectSelect.value = 'web-dev';
    else if (subjectParam.includes('data') || subjectParam.includes('db')) subjectSelect.value = 'db-systems';
    else if (subjectParam.includes('sys')) subjectSelect.value = 'sys-analysis';
    updateScheduleBadge();
  }

  // Set today's date if date input exists
  const dateInput = document.getElementById('attendanceDateInput');
  if (dateInput && !dateInput.value) {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    dateInput.value = `${yyyy}-${mm}-${dd}`;
  }
}

/**
 * Initialize all DOM event listeners
 */
function initEventListeners() {
  // Subject & Section change
  const subjectSelect = document.getElementById('subjectSelect');
  const sectionSelect = document.getElementById('sectionSelect');
  if (subjectSelect) subjectSelect.addEventListener('change', updateScheduleBadge);
  if (sectionSelect) sectionSelect.addEventListener('change', updateScheduleBadge);

  // Search Input
  const searchInput = document.getElementById('studentSearchInput');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.trim().toLowerCase();
      renderAttendanceTable();
    });
  }

  // Session Control (Start/End)
  const sessionToggleBtn = document.getElementById('sessionToggleBtn');
  if (sessionToggleBtn) {
    sessionToggleBtn.addEventListener('click', toggleSessionState);
  }

  // Bulk Action: Mark All Present
  const markAllPresentBtn = document.getElementById('markAllPresentBtn');
  if (markAllPresentBtn) {
    markAllPresentBtn.addEventListener('click', markAllPresent);
  }

  // Save Draft
  const saveDraftBtn = document.getElementById('saveDraftBtn');
  if (saveDraftBtn) {
    saveDraftBtn.addEventListener('click', saveDraft);
  }

  // Submit Attendance
  const submitAttendanceBtn = document.getElementById('submitAttendanceBtn');
  if (submitAttendanceBtn) {
    submitAttendanceBtn.addEventListener('click', openSubmitConfirmationModal);
  }

  // View Summary
  const viewSummaryBtn = document.getElementById('viewSummaryBtn');
  if (viewSummaryBtn) {
    viewSummaryBtn.addEventListener('click', openSummaryModal);
  }
}

/**
 * Update the schedule & room chip when subject or section changes
 */
function updateScheduleBadge() {
  const subjectVal = document.getElementById('subjectSelect')?.value || 'web-dev';
  const info = CLASS_SCHEDULES[subjectVal] || CLASS_SCHEDULES['web-dev'];

  const scheduleBadge = document.getElementById('scheduleInfoBadge');
  if (scheduleBadge) {
    scheduleBadge.textContent = `${info.time} • Room ${info.room}`;
  }

  const sectionSelect = document.getElementById('sectionSelect');
  if (sectionSelect) {
    sectionSelect.value = info.section;
  }
}

/**
 * Render attendance records in table with filtering
 */
function renderAttendanceTable() {
  const tbody = document.getElementById('attendanceTableBody');
  const countBadge = document.getElementById('tableRecordCountBadge');
  if (!tbody) return;

  // Filter roster
  const filtered = currentRoster.filter(student => {
    // Status Filter
    const matchesStatus = !activeStatusFilter || student.status.toLowerCase() === activeStatusFilter.toLowerCase();
    
    // Method Filter
    const matchesMethod = !activeMethodFilter || student.method.toLowerCase() === activeMethodFilter.toLowerCase();

    // Search Filter
    const matchesSearch = !searchQuery || 
      student.name.toLowerCase().includes(searchQuery) || 
      student.id.toLowerCase().includes(searchQuery) ||
      student.remarks.toLowerCase().includes(searchQuery);

    return matchesStatus && matchesMethod && matchesSearch;
  });

  if (countBadge) {
    countBadge.textContent = `${filtered.length} Records`;
  }

  const showingCount = document.getElementById('pageShowingCount');
  const totalCount = document.getElementById('pageTotalCount');
  if (showingCount) showingCount.textContent = filtered.length;
  if (totalCount) totalCount.textContent = currentRoster.length;

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="8" class="py-10 text-center text-xs text-[#6b7280]">
          <div class="flex flex-col items-center justify-center gap-2">
            <svg class="w-8 h-8 text-[#9ca3af]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
            <p class="font-semibold text-[#374151]">No student records found</p>
            <p class="text-[11px] text-[#9ca3af]">Try adjusting your search query or filter tabs.</p>
          </div>
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = filtered.map((student, index) => {
    // Status badge style (matching rfid-registry.html)
    let statusBadgeClass = 'status-badge status-badge-present';
    if (student.status === 'Late') {
      statusBadgeClass = 'status-badge status-badge-late';
    } else if (student.status === 'Absent') {
      statusBadgeClass = 'status-badge status-badge-absent';
    } else if (student.status === 'Excused') {
      statusBadgeClass = 'status-badge status-badge-excused';
    }

    // Method badge style (matching rfid-registry.html)
    let methodBadgeClass = 'method-badge method-badge-rfid';
    if (student.method === 'QR Code') {
      methodBadgeClass = 'method-badge method-badge-qr';
    } else if (student.method === 'Manual') {
      methodBadgeClass = 'method-badge method-badge-manual';
    }

    return `
      <tr class="hover:bg-[#f9fafb] transition-colors">
        <td class="py-3.5 px-4 font-semibold text-[#6b7280] font-mono text-xs">${student.id}</td>
        <td class="py-3.5 px-4">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-full bg-[#e5e7eb] flex items-center justify-center shrink-0">
              <svg class="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12a4.5 4.5 0 100-9 4.5 4.5 0 000 9zM4 20.5c0-3.59 3.58-6.5 8-6.5s8 2.91 8 6.5V21H4v-.5z" />
              </svg>
            </div>
            <p class="font-bold text-[#111827]">${student.name}</p>
          </div>
        </td>
        <td class="py-3.5 px-4 font-medium text-[#374151] font-mono text-xs">${student.timeIn}</td>
        
        <!-- Status Badge (matching rfid-registry.html) -->
        <td class="py-3.5 px-4" data-status="${student.status}">
          <span class="${statusBadgeClass}">${student.status}</span>
        </td>

        <!-- Method Badge (matching rfid-registry.html) -->
        <td class="py-3.5 px-4 font-medium text-[#374151]">
          <span class="${methodBadgeClass}">${student.method}</span>
        </td>

        <!-- Remarks -->
        <td class="py-3.5 px-4 font-medium text-[#6b7280] text-xs max-w-[160px] truncate" title="${student.remarks}">
          ${student.remarks}
        </td>

        <!-- Actions -->
        <td class="py-3.5 px-4 text-center">
          <div class="flex items-center justify-center gap-1.5">
            <!-- View Details Button (from rfid-registry.html) -->
            <button onclick="openViewStudentModal('${student.id}')" 
              class="p-1.5 text-[#2563eb] hover:bg-blue-50 rounded-lg transition-colors inline-flex items-center justify-center" 
              title="View Attendance Details">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638-0-8.573-3.007-9.963-7.178z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
            <!-- Edit Button (from rfid-registry.html) -->
            <button onclick="openEditStudentModal('${student.id}')" 
              class="p-1.5 text-[#6b7280] hover:text-[#0030c2] hover:bg-gray-100 rounded-lg transition-colors inline-flex items-center justify-center" 
              title="Edit Attendance Entry">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
              </svg>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

/**
 * Set individual student status
 */
window.setStudentStatus = function(studentId, status) {
  const student = currentRoster.find(s => s.id === studentId);
  if (!student) return;

  student.status = status;
  student.method = 'Manual';

  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

  if (status === 'Present') {
    if (student.timeIn === '--') student.timeIn = timeStr;
    if (student.remarks.startsWith('Late')) student.remarks = '-';
  } else if (status === 'Late') {
    if (student.timeIn === '--') student.timeIn = timeStr;
    if (student.remarks === '-') student.remarks = 'Marked Late';
  } else if (status === 'Absent') {
    student.timeIn = '--';
  } else if (status === 'Excused') {
    student.timeIn = '--';
    student.remarks = 'Excused Absence';
  }

  renderAttendanceTable();
  updateStatCounters();
};

/**
 * Update the 5 KPI summary counters
 */
function updateStatCounters() {
  const total = currentRoster.length;
  const presentCount = currentRoster.filter(s => s.status === 'Present').length;
  const lateCount = currentRoster.filter(s => s.status === 'Late').length;
  const absentCount = currentRoster.filter(s => s.status === 'Absent').length;
  const excusedCount = currentRoster.filter(s => s.status === 'Excused').length;

  const presentPct = total > 0 ? ((presentCount / total) * 100).toFixed(1) : '0.0';
  const latePct = total > 0 ? ((lateCount / total) * 100).toFixed(1) : '0.0';
  const absentPct = total > 0 ? ((absentCount / total) * 100).toFixed(1) : '0.0';
  const excusedPct = total > 0 ? ((excusedCount / total) * 100).toFixed(1) : '0.0';

  updateText('statTotalStudents', total);
  updateText('statPresent', presentCount);
  updateText('statPresentPct', `${presentPct}%`);
  updateText('statLate', lateCount);
  updateText('statLatePct', `${latePct}%`);
  updateText('statAbsent', absentCount);
  updateText('statAbsentPct', `${absentPct}%`);
  updateText('statExcused', excusedCount);
  updateText('statExcusedPct', `${excusedPct}%`);
}

/**
 * Mark all absent/unmarked students as Present
 */
function markAllPresent() {
  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

  currentRoster.forEach(student => {
    if (student.status !== 'Present') {
      student.status = 'Present';
      student.method = 'Manual';
      if (student.timeIn === '--') student.timeIn = timeStr;
      if (student.remarks.startsWith('Late')) student.remarks = '-';
    }
  });

  renderAttendanceTable();
  updateStatCounters();
  showToast('All students marked as Present', 'success');
}

/**
 * Toggle Session State (Start / End Attendance Session)
 */
function toggleSessionState() {
  isSessionActive = !isSessionActive;
  const btn = document.getElementById('sessionToggleBtn');
  const badge = document.getElementById('sessionStatusBadge');

  if (isSessionActive) {
    if (btn) {
      btn.innerHTML = `
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M5.25 7.5A2.25 2.25 0 017.5 5.25h9a2.25 2.25 0 012.25 2.25v9a2.25 2.25 0 01-2.25 2.25h-9a2.25 2.25 0 01-2.25-2.25v-9z" />
        </svg>
        <span>End Session</span>
      `;
      btn.className = 'flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#dc2626] bg-[#fef2f2] hover:bg-[#fee2e2] border border-[#fecaca] rounded-lg transition-colors';
    }
    if (badge) {
      badge.textContent = 'Session Ongoing';
      badge.className = 'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#eff6ff] text-[#2563eb] border border-[#bfdbfe]';
    }
    showToast('Attendance session started', 'info');
  } else {
    if (btn) {
      btn.innerHTML = `
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
        </svg>
        <span>Start Attendance</span>
      `;
      btn.className = 'flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#16a34a] bg-[#f0fdf4] hover:bg-[#dcfce7] border border-[#bbf7d0] rounded-lg transition-colors';
    }
    if (badge) {
      badge.textContent = 'Session Closed';
      badge.className = 'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600 border border-gray-200';
    }
    showToast('Attendance session closed', 'info');
  }
}

/**
 * Save draft handler
 */
function saveDraft() {
  try {
    localStorage.setItem('sms_teacher_attendance_draft', JSON.stringify(currentRoster));
    showToast('Draft attendance saved successfully!', 'success');
  } catch (err) {
    showToast('Draft saved in local session.', 'success');
  }
}

/**
 * Open Edit Student Details Modal
 */
window.openEditStudentModal = function(studentId) {
  const student = currentRoster.find(s => s.id === studentId);
  if (!student) return;

  editingStudentId = studentId;
  updateText('modalEditStudentName', student.name);
  updateText('modalEditStudentID', student.id);

  const statusSelect = document.getElementById('modalEditStatusSelect');
  const methodSelect = document.getElementById('modalEditMethodSelect');
  const timeInInput = document.getElementById('modalEditTimeInInput');
  const remarksInput = document.getElementById('modalEditRemarksInput');

  if (statusSelect) statusSelect.value = student.status;
  if (methodSelect) methodSelect.value = student.method;
  if (timeInInput) timeInInput.value = student.timeIn === '--' ? '' : student.timeIn;
  if (remarksInput) remarksInput.value = student.remarks === '-' ? '' : student.remarks;

  const modal = document.getElementById('editStudentModal');
  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }
};

window.closeEditStudentModal = function() {
  const modal = document.getElementById('editStudentModal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
  editingStudentId = null;
};

window.saveEditStudentModal = function() {
  if (!editingStudentId) return;
  const student = currentRoster.find(s => s.id === editingStudentId);
  if (!student) return;

  const statusSelect = document.getElementById('modalEditStatusSelect');
  const methodSelect = document.getElementById('modalEditMethodSelect');
  const timeInInput = document.getElementById('modalEditTimeInInput');
  const remarksInput = document.getElementById('modalEditRemarksInput');

  student.status = statusSelect ? statusSelect.value : student.status;
  student.method = methodSelect ? methodSelect.value : student.method;
  student.timeIn = timeInInput && timeInInput.value.trim() ? timeInInput.value.trim() : (student.status === 'Absent' ? '--' : '9:15 AM');
  student.remarks = remarksInput && remarksInput.value.trim() ? remarksInput.value.trim() : '-';

  closeEditStudentModal();
  renderAttendanceTable();
  updateStatCounters();
  showToast(`Updated attendance for ${student.name}`, 'success');
};

/**
 * Open Submit Confirmation Modal
 */
function openSubmitConfirmationModal() {
  const presentCount = currentRoster.filter(s => s.status === 'Present').length;
  const lateCount = currentRoster.filter(s => s.status === 'Late').length;
  const absentCount = currentRoster.filter(s => s.status === 'Absent').length;
  const excusedCount = currentRoster.filter(s => s.status === 'Excused').length;

  updateText('confirmPresentCount', presentCount);
  updateText('confirmLateCount', lateCount);
  updateText('confirmAbsentCount', absentCount);
  updateText('confirmExcusedCount', excusedCount);

  const modal = document.getElementById('submitConfirmModal');
  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }
}

window.closeSubmitConfirmationModal = function() {
  const modal = document.getElementById('submitConfirmModal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
};

window.confirmSubmitAttendance = function() {
  closeSubmitConfirmationModal();
  showToast('Attendance submitted to administration successfully!', 'success');

  const sessionBadge = document.getElementById('sessionStatusBadge');
  if (sessionBadge) {
    sessionBadge.textContent = 'Submitted';
    sessionBadge.className = 'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#f0fdf4] text-[#16a34a] border border-[#bbf7d0]';
  }
};

/**
 * Open View Student Details Modal (from tardy-list.html pattern)
 */
window.openViewStudentModal = function(studentId) {
  const student = currentRoster.find(s => s.id === studentId);
  if (!student) return;

  const subjectVal = document.getElementById('subjectSelect')?.value || 'web-dev';
  const info = CLASS_SCHEDULES[subjectVal] || CLASS_SCHEDULES['web-dev'];

  updateText('viewModalStudentName', student.name);
  updateText('viewModalStudentId', student.id);
  updateText('viewModalSection', `${info.subject} (${info.section})`);
  updateText('viewModalTimeIn', student.timeIn);
  updateText('viewModalMethod', student.method === 'RFID' ? 'RFID Card Scan' : (student.method === 'QR Code' ? 'QR Code Mobile Scan' : 'Manual Teacher Entry'));
  updateText('viewModalRemarks', student.remarks);

  const statusBadge = document.getElementById('viewModalStatusBadge');
  if (statusBadge) {
    statusBadge.textContent = student.status;
    if (student.status === 'Present') statusBadge.className = 'px-2.5 py-1 rounded-lg font-bold text-xs bg-emerald-100 text-emerald-600';
    else if (student.status === 'Late') statusBadge.className = 'px-2.5 py-1 rounded-lg font-bold text-xs bg-amber-100 text-amber-600';
    else if (student.status === 'Absent') statusBadge.className = 'px-2.5 py-1 rounded-lg font-bold text-xs bg-red-100 text-red-600';
    else if (student.status === 'Excused') statusBadge.className = 'px-2.5 py-1 rounded-lg font-bold text-xs bg-blue-100 text-[#0030c2]';
  }

  const modal = document.getElementById('viewStudentModal');
  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }
};

window.closeViewStudentModal = function() {
  const modal = document.getElementById('viewStudentModal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
};

/**
 * Filter Modal Controls (from tardy-list.html)
 */
window.openFilterModal = function() {
  const modal = document.getElementById('filterModal');
  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }
};

window.closeFilterModal = function() {
  const modal = document.getElementById('filterModal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
};

window.applyModalFilters = function() {
  const statusSelect = document.getElementById('filterStatusSelect');
  const methodSelect = document.getElementById('filterMethodSelect');
  activeStatusFilter = statusSelect ? statusSelect.value : '';
  activeMethodFilter = methodSelect ? methodSelect.value : '';
  closeFilterModal();
  renderAttendanceTable();
  showToast('Filters applied successfully', 'success');
};

window.resetModalFilters = function() {
  const statusSelect = document.getElementById('filterStatusSelect');
  const methodSelect = document.getElementById('filterMethodSelect');
  if (statusSelect) statusSelect.value = '';
  if (methodSelect) methodSelect.value = '';
  activeStatusFilter = '';
  activeMethodFilter = '';
  closeFilterModal();
  renderAttendanceTable();
  showToast('Filters reset', 'info');
};

/**
 * Export Modal Controls (from tardy-list.html)
 */
window.openExportModal = function() {
  const modal = document.getElementById('exportModal');
  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }
};

window.closeExportModal = function() {
  const modal = document.getElementById('exportModal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
};

window.handleExport = function(e) {
  if (e) e.preventDefault();
  closeExportModal();
  showToast('Export file downloaded successfully!', 'success');
};

/**
 * Open Attendance Summary Modal
 */
function openSummaryModal() {
  const total = currentRoster.length;
  const presentCount = currentRoster.filter(s => s.status === 'Present').length;
  const lateCount = currentRoster.filter(s => s.status === 'Late').length;
  const absentCount = currentRoster.filter(s => s.status === 'Absent').length;
  const excusedCount = currentRoster.filter(s => s.status === 'Excused').length;

  const subjectVal = document.getElementById('subjectSelect')?.value || 'web-dev';
  const info = CLASS_SCHEDULES[subjectVal] || CLASS_SCHEDULES['web-dev'];

  updateText('summaryModalSubject', `${info.subject} (${info.section})`);
  updateText('summaryModalSchedule', `${info.time} • Room ${info.room}`);
  updateText('summaryModalTotal', total);
  updateText('summaryModalPresent', `${presentCount} (${((presentCount / total) * 100).toFixed(1)}%)`);
  updateText('summaryModalLate', `${lateCount} (${((lateCount / total) * 100).toFixed(1)}%)`);
  updateText('summaryModalAbsent', `${absentCount} (${((absentCount / total) * 100).toFixed(1)}%)`);
  updateText('summaryModalExcused', `${excusedCount} (${((excusedCount / total) * 100).toFixed(1)}%)`);

  const modal = document.getElementById('attendanceSummaryModal');
  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }
}

window.closeSummaryModal = function() {
  const modal = document.getElementById('attendanceSummaryModal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
};

/**
 * Utility functions
 */
function updateText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

function showToast(message, type = 'info') {
  let toastContainer = document.getElementById('toastContainer');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toastContainer';
    toastContainer.className = 'fixed top-5 right-5 z-50 flex flex-col gap-2 pointer-events-none';
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  toast.className = 'pointer-events-auto bg-white border border-[#e5e7eb] shadow-xl rounded-xl p-3.5 flex items-center gap-3 min-w-[280px] max-w-sm transition-all duration-300 transform translate-x-0';

  let iconSvg = `
    <div class="w-8 h-8 rounded-full bg-blue-50 text-[#0030c2] flex items-center justify-center shrink-0">
      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
      </svg>
    </div>
  `;
  if (type === 'success') {
    iconSvg = `
      <div class="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
      </div>
    `;
  }

  toast.innerHTML = `
    ${iconSvg}
    <div class="flex-1">
      <p class="text-xs font-bold text-[#111827]">${type === 'success' ? 'Success' : 'Notice'}</p>
      <p class="text-[11px] text-[#6b7280] leading-tight">${message}</p>
    </div>
  `;

  toastContainer.appendChild(toast);
  setTimeout(() => {
    toast.classList.add('opacity-0', 'translate-x-full');
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}
