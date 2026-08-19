// assets/js/attendance.js
// Interactive features for Daily Attendance Monitoring

document.addEventListener('DOMContentLoaded', function() {
  console.log('Daily Attendance Monitoring module initialized');

  // Initialize Search input for attendance table
  initAttendanceSearch();

  // Initialize Export Dropdown
  initExportDropdown();
});

// Toast notification helper
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

// Attendance Table Unified Filter Executor
function executeFiltering() {
  const searchInput = document.getElementById('studentSearchInput');
  const sectionSelect = document.getElementById('filterSectionSelect');
  const teacherSelect = document.getElementById('filterTeacherSelect');
  const subjectSelect = document.getElementById('filterSubjectSelect');
  const dateInput = document.getElementById('filterDateInput');
  const table = document.getElementById('attendanceTable');

  if (!table) return 0;

  const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';
  const selectedSection = sectionSelect && sectionSelect.value ? sectionSelect.value.toLowerCase().trim() : '';
  const selectedTeacher = teacherSelect && teacherSelect.value ? teacherSelect.value.toLowerCase().trim() : '';
  const selectedSubject = subjectSelect && subjectSelect.value ? subjectSelect.value.toLowerCase().trim() : '';

  // Format date if needed (e.g. 2026-07-25 -> July 25, 2026 or partial check)
  let selectedDateStr = '';
  if (dateInput && dateInput.value) {
    const d = new Date(dateInput.value + 'T00:00:00');
    if (!isNaN(d.getTime())) {
      const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      selectedDateStr = `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`.toLowerCase();
    }
  }

  const rows = table.querySelectorAll('tbody tr');
  let matchCount = 0;

  rows.forEach(row => {
    const rowText = row.innerText.toLowerCase();
    const matchesSearch = !searchTerm || rowText.includes(searchTerm);
    const matchesSection = !selectedSection || selectedSection === 'all sections' || rowText.includes(selectedSection);
    const matchesTeacher = !selectedTeacher || selectedTeacher === 'all teachers' || rowText.includes(selectedTeacher);
    const matchesSubject = !selectedSubject || selectedSubject === 'all subjects' || rowText.includes(selectedSubject);
    const matchesDate = !selectedDateStr || rowText.includes(selectedDateStr);

    if (matchesSearch && matchesSection && matchesTeacher && matchesSubject && matchesDate) {
      row.style.display = '';
      matchCount++;
    } else {
      row.style.display = 'none';
    }
  });

  return matchCount;
}

// Attendance Table Search
function initAttendanceSearch() {
  const searchInput = document.getElementById('studentSearchInput');
  if (!searchInput) return;

  searchInput.addEventListener('input', function() {
    executeFiltering();
  });
}

// Filter Modal Open & Close Handlers
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

// Reset Filters Function
function resetAttendanceFilters() {
  const searchInput = document.getElementById('studentSearchInput');
  const dateInput = document.getElementById('filterDateInput');
  const sectionSelect = document.getElementById('filterSectionSelect');
  const teacherSelect = document.getElementById('filterTeacherSelect');
  const subjectSelect = document.getElementById('filterSubjectSelect');

  if (searchInput) searchInput.value = '';
  if (dateInput) dateInput.value = '2026-07-25';
  if (sectionSelect) sectionSelect.selectedIndex = 0;
  if (teacherSelect) teacherSelect.selectedIndex = 0;
  if (subjectSelect) subjectSelect.selectedIndex = 0;

  const table = document.getElementById('attendanceTable');
  if (table) {
    const rows = table.querySelectorAll('tbody tr');
    rows.forEach(row => row.style.display = '');
  }

  closeFilterModal();
  showToast('Filters have been reset', 'info');
}

// Apply Filters Action
function applyAttendanceFilters() {
  const matchCount = executeFiltering();
  closeFilterModal();
  showToast(`Applied filters. ${matchCount} record(s) matching.`, 'success');
}

// Export Dropdown Group Handler
function initExportDropdown() {
  const exportBtn = document.querySelector('.export-btn');
  const exportMenu = document.querySelector('.export-menu');

  if (!exportBtn || !exportMenu) return;

  exportBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    exportMenu.classList.toggle('hidden');
  });

  document.addEventListener('click', function(e) {
    if (!exportMenu.contains(e.target) && !exportBtn.contains(e.target)) {
      exportMenu.classList.add('hidden');
    }
  });
}

// Trigger Export
function triggerExport(format, reportName = 'Attendance_Records') {
  const exportMenu = document.querySelector('.export-menu');
  if (exportMenu) exportMenu.classList.add('hidden');
  showToast(`Exporting ${reportName} as ${format.toUpperCase()}...`, 'success');
}

// Modal: View Attendance Details
function openAttendanceDetailsModal(data) {
  const modal = document.getElementById('viewDetailsModal');
  if (!modal) return;

  if (document.getElementById('modalDetailName')) document.getElementById('modalDetailName').textContent = data.student || 'Santos, Maria';
  if (document.getElementById('modalDetailDate')) document.getElementById('modalDetailDate').textContent = data.date || 'July 25, 2026';
  if (document.getElementById('modalDetailSubject')) document.getElementById('modalDetailSubject').textContent = data.subject || 'Math 101';
  if (document.getElementById('modalDetailSection')) document.getElementById('modalDetailSection').textContent = data.section || 'Grade 10 - A';
  if (document.getElementById('modalDetailTeacher')) document.getElementById('modalDetailTeacher').textContent = data.teacher || 'Mr. Juan Dela Cruz';
  if (document.getElementById('modalDetailTimeIn')) document.getElementById('modalDetailTimeIn').textContent = data.timeIn || '7:28 AM';
  if (document.getElementById('modalDetailRemarks')) document.getElementById('modalDetailRemarks').textContent = data.remarks || 'None';

  const statusEl = document.getElementById('modalDetailStatus');
  if (statusEl) {
    statusEl.textContent = data.status || 'Present';
    statusEl.className = 'status-badge ' + (
      data.status === 'Present' ? 'status-badge-present' :
      data.status === 'Late' ? 'status-badge-late' :
      data.status === 'Absent' ? 'status-badge-absent' : 'status-badge-excused'
    );
  }

  const methodEl = document.getElementById('modalDetailMethod');
  if (methodEl) {
    methodEl.textContent = data.method || 'RFID';
    methodEl.className = 'method-badge ' + (
      data.method === 'RFID' ? 'method-badge-rfid' :
      data.method === 'QR' ? 'method-badge-qr' : 'method-badge-manual'
    );
  }

  modal.classList.remove('hidden');
  modal.classList.add('flex');
}

function closeAttendanceDetailsModal() {
  const modal = document.getElementById('viewDetailsModal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
}

// Modal: Edit Record
function openEditRecordModal(student, subject, status, remarks) {
  const modal = document.getElementById('editRecordModal');
  if (!modal) return;

  if (document.getElementById('editStudentName')) document.getElementById('editStudentName').textContent = student;
  if (document.getElementById('editSubjectName')) document.getElementById('editSubjectName').textContent = subject;
  if (document.getElementById('editStatusSelect')) document.getElementById('editStatusSelect').value = status;
  if (document.getElementById('editRemarksInput')) document.getElementById('editRemarksInput').value = remarks !== '-' ? remarks : '';

  modal.classList.remove('hidden');
  modal.classList.add('flex');
}

function closeEditRecordModal() {
  const modal = document.getElementById('editRecordModal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
}

function saveEditRecord() {
  closeEditRecordModal();
  showToast('Attendance record updated successfully!', 'success');
}

// Modal: Delete Confirmation
let studentToDelete = '';
function openDeleteConfirmModal(student) {
  studentToDelete = student;
  const modal = document.getElementById('deleteConfirmModal');
  if (!modal) return;

  if (document.getElementById('deleteStudentName')) document.getElementById('deleteStudentName').textContent = student;

  modal.classList.remove('hidden');
  modal.classList.add('flex');
}

function closeDeleteConfirmModal() {
  const modal = document.getElementById('deleteConfirmModal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
}

function confirmDeleteRecord() {
  closeDeleteConfirmModal();
  showToast(`Attendance entry for ${studentToDelete || 'student'} deleted.`, 'error');
}
