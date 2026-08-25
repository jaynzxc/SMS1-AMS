// assets/js/attendance.js
// Interactive features for Daily Attendance Monitoring

document.addEventListener('DOMContentLoaded', function() {
  console.log('Daily Attendance Monitoring module initialized');

  // Initialize Search input for attendance table
  initAttendanceSearch();

  // Initialize Modal Listeners (ESC and backdrop click)
  initModalListeners();

  // Read and apply URL query parameters (date and status)
  const urlParams = new URLSearchParams(window.location.search);
  const dateParam = urlParams.get('date');
  const statusParam = urlParams.get('status');

  const dateInput = document.getElementById('filterDateInput');
  const searchInput = document.getElementById('studentSearchInput');

  let shouldFilter = false;

  if (dateParam && dateInput) {
    dateInput.value = dateParam;
    shouldFilter = true;
  }
  if (statusParam && searchInput) {
    searchInput.value = statusParam;
    shouldFilter = true;
  }

  if (shouldFilter) {
    executeFiltering();
  }
});

// Toast notification helper
function showToast(titleOrMessage, messageOrType, type = 'success') {
  let title = titleOrMessage;
  let message = messageOrType;
  let toastType = type;

  // Check if it's called as showToast(message, type)
  if (messageOrType === undefined) {
    message = titleOrMessage;
    toastType = 'success';
    title = 'Success';
  } else if (messageOrType === 'success' || messageOrType === 'info' || messageOrType === 'error' || messageOrType === 'danger') {
    message = titleOrMessage;
    toastType = messageOrType === 'danger' ? 'error' : messageOrType;
    title = toastType === 'success' ? 'Success' : toastType === 'info' ? 'Info' : 'Error';
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
  if (toastType === 'success') {
    iconSvg = `
      <div class="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
      </div>
    `;
  } else if (toastType === 'info') {
    iconSvg = `
      <div class="w-8 h-8 rounded-full bg-blue-50 text-[#0030c2] flex items-center justify-center shrink-0">
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
        </svg>
      </div>
    `;
  } else {
    iconSvg = `
      <div class="w-8 h-8 rounded-full bg-red-50 text-red-600 flex items-center justify-center shrink-0">
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
        </svg>
      </div>
    `;
  }

  toast.innerHTML = `
    ${iconSvg}
    <div class="flex-1">
      <p class="text-xs font-bold text-[#111827]">${title}</p>
      <p class="text-[11px] text-[#6b7280] mt-0.5 leading-tight">${message}</p>
    </div>
    <button onclick="this.parentElement.remove()" class="text-gray-400 hover:text-gray-600 p-1">
      <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
    </button>
  `;

  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('opacity-0', 'translate-x-full');
    setTimeout(() => toast.remove(), 300);
  }, 4000);
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

  const parentLabel = radioInput.closest('.export-format-option');
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

  closeExportModal();
  showToast('Exporting Records...', `Generating ${format} report for ${specificDate}`, 'info');

  setTimeout(() => {
    if (format === 'CSV') {
      const table = document.getElementById('attendanceTable');
      if (table) {
        const visibleRows = Array.from(table.querySelectorAll('tbody tr')).filter(row => row.style.display !== 'none');
        const csvRows = [
          ["Date", "Subject", "Section", "Teacher", "Student Name", "Time In", "Status", "Method", "Remarks"]
        ];

        visibleRows.forEach(row => {
          const cells = row.querySelectorAll('td');
          if (cells.length > 0) {
            const date = cells[0]?.textContent.trim() || '';
            const subject = cells[1]?.textContent.trim() || '';
            const section = cells[2]?.textContent.trim() || '';
            const teacher = cells[3]?.textContent.trim() || '';
            const name = cells[4]?.querySelector('span.font-bold')?.textContent.trim() || '';
            const timeIn = cells[5]?.textContent.trim() || '';
            const status = cells[6]?.textContent.trim() || '';
            const method = cells[7]?.textContent.trim() || '';
            const remarks = cells[8]?.textContent.trim() || '';
            
            csvRows.push([
              `"${date}"`,
              `"${subject}"`,
              `"${section}"`,
              `"${teacher}"`,
              `"${name}"`,
              `"${timeIn}"`,
              `"${status}"`,
              `"${method}"`,
              `"${remarks}"`
            ]);
          }
        });

        const csvContent = "data:text/csv;charset=utf-8," + csvRows.map(e => e.join(",")).join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `Daily_Attendance_${specificDate}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
    showToast('Download Ready', `Daily attendance report exported successfully (${format})`, 'success');
  }, 800);
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

// =============================================================
// MODAL GENERAL LISTENERS (Escape key & backdrop click)
// =============================================================
function initModalListeners() {
  // ESC key closes any open modal
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      closeFilterModal();
      closeAttendanceDetailsModal();
      closeEditRecordModal();
      closeDeleteConfirmModal();
      closeExportModal();
    }
  });

  // Backdrop click closes modal
  const modals = ['filterModal', 'viewDetailsModal', 'editRecordModal', 'deleteConfirmModal', 'exportModal'];
  modals.forEach(modalId => {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.addEventListener('click', function(e) {
        if (e.target === modal) {
          modal.classList.add('hidden');
          modal.classList.remove('flex');
        }
      });
    }
  });
}

