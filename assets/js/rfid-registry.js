// assets/js/rfid-registry.js
// RFID Registry Interactive Functionality

document.addEventListener('DOMContentLoaded', function() {
  console.log('RFID Registry module initialized');

  // Initialize Search
  initRfidSearch();

  // Backdrop click and ESC key listeners for all modals
  initModalListeners();
});

// =============================================================
// TOAST NOTIFICATIONS HELPER
// =============================================================
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

// =============================================================
// SEARCH & UNIFIED FILTERING
// =============================================================
function initRfidSearch() {
  const searchInput = document.getElementById('rfidSearch');
  if (!searchInput) return;

  searchInput.addEventListener('input', function() {
    executeRfidFiltering();
  });
}

function executeRfidFiltering() {
  const searchInput = document.getElementById('rfidSearch');
  const courseFilter = document.getElementById('filterCourseSelect');
  const yearFilter = document.getElementById('filterYearSelect');
  const statusFilter = document.getElementById('filterStatusSelect');
  const table = document.getElementById('rfidTable');

  if (!table) return;

  const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';
  const selectedCourse = courseFilter ? courseFilter.value.toLowerCase().trim() : '';
  const selectedYear = yearFilter ? yearFilter.value.toLowerCase().trim() : '';
  const selectedStatus = statusFilter ? statusFilter.value.toLowerCase().trim() : '';

  const rows = table.querySelectorAll('tbody tr');
  let visibleCount = 0;

  rows.forEach(row => {
    const rowText = row.innerText.toLowerCase();
    const courseYearCell = row.querySelector('[data-course-year]') ? row.querySelector('[data-course-year]').innerText.toLowerCase() : rowText;
    const statusCell = row.querySelector('[data-status]') ? row.querySelector('[data-status]').innerText.toLowerCase() : rowText;

    const matchesSearch = !searchTerm || rowText.includes(searchTerm);
    const matchesCourse = !selectedCourse || selectedCourse === 'all' || courseYearCell.includes(selectedCourse);
    const matchesYear = !selectedYear || selectedYear === 'all' || courseYearCell.includes(selectedYear);
    const matchesStatus = !selectedStatus || selectedStatus === 'all' || statusCell.includes(selectedStatus);

    if (matchesSearch && matchesCourse && matchesYear && matchesStatus) {
      row.style.display = '';
      visibleCount++;
    } else {
      row.style.display = 'none';
    }
  });

  // Update visible count in table header badge if present
  const countBadge = document.getElementById('rfidRecordCount');
  if (countBadge) {
    countBadge.textContent = searchTerm || selectedCourse || selectedYear || selectedStatus 
      ? `${visibleCount} Found` 
      : `4,825 Cards`;
  }
}

// =============================================================
// FILTER MODAL CONTROLS
// =============================================================
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

function applyFilters() {
  closeFilterModal();
  executeRfidFiltering();
  showToast('Filters applied successfully!', 'info');
}

function resetFilters() {
  if (document.getElementById('filterCourseSelect')) document.getElementById('filterCourseSelect').value = '';
  if (document.getElementById('filterYearSelect')) document.getElementById('filterYearSelect').value = '';
  if (document.getElementById('filterStatusSelect')) document.getElementById('filterStatusSelect').value = '';
  if (document.getElementById('rfidSearch')) document.getElementById('rfidSearch').value = '';

  closeFilterModal();
  executeRfidFiltering();
  showToast('Filters reset to default.', 'info');
}

// =============================================================
// REGISTER RFID MODAL CONTROLS
// =============================================================
function openRegisterModal() {
  const modal = document.getElementById('registerModal');
  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }
}

function closeRegisterModal() {
  const modal = document.getElementById('registerModal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
}

function handleRegisterRfid(event) {
  if (event) event.preventDefault();
  const studentName = document.getElementById('regStudentName')?.value || 'Student';
  const rfidUid = document.getElementById('regRfidUid')?.value || 'RFID-000000';

  closeRegisterModal();
  showToast(`RFID card ${rfidUid} registered for ${studentName}!`, 'success');
}

// =============================================================
// REPLACE LOST RFID MODAL CONTROLS
// =============================================================
function openReplaceModal(studentName = '', studentId = '', oldRfid = '') {
  const modal = document.getElementById('replaceModal');
  if (!modal) return;

  if (document.getElementById('replaceStudentName') && studentName) {
    document.getElementById('replaceStudentName').value = studentName;
  }
  if (document.getElementById('replaceStudentId') && studentId) {
    document.getElementById('replaceStudentId').value = studentId;
  }
  if (document.getElementById('replaceOldRfid') && oldRfid) {
    document.getElementById('replaceOldRfid').value = oldRfid;
  }

  modal.classList.remove('hidden');
  modal.classList.add('flex');
}

function closeReplaceModal() {
  const modal = document.getElementById('replaceModal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
}

function handleReplaceRfid(event) {
  if (event) event.preventDefault();
  const oldRfid = document.getElementById('replaceOldRfid')?.value || 'Old RFID';
  const newRfid = document.getElementById('replaceNewRfid')?.value || 'New RFID';

  closeReplaceModal();
  showToast(`RFID replaced successfully: ${oldRfid} deactivated, ${newRfid} activated.`, 'success');
}

// =============================================================
// VIEW RFID DETAILS MODAL CONTROLS
// =============================================================
function openViewModal(data) {
  const modal = document.getElementById('viewRfidModal');
  if (!modal) return;

  if (document.getElementById('viewStudentName')) document.getElementById('viewStudentName').textContent = data.student || 'Santos, Maria';
  if (document.getElementById('viewStudentId')) document.getElementById('viewStudentId').textContent = 'ID: ' + (data.id || '2026-1001');
  if (document.getElementById('viewCourseYear')) document.getElementById('viewCourseYear').textContent = data.courseYear || 'BSIT - 3rd Year';
  if (document.getElementById('viewRfidNumber')) document.getElementById('viewRfidNumber').textContent = data.rfid || 'RFID-000123';
  if (document.getElementById('viewDateRegistered')) document.getElementById('viewDateRegistered').textContent = data.dateRegistered || 'July 20, 2026';
  if (document.getElementById('viewLastScan')) document.getElementById('viewLastScan').textContent = data.lastScan || 'Today, 7:45 AM (Gate 1)';

  const statusEl = document.getElementById('viewStatusBadge');
  if (statusEl) {
    const status = data.status || 'Active';
    statusEl.textContent = status;
    statusEl.className = 'status-badge ' + (
      status === 'Active' ? 'status-badge-present' :
      status === 'Inactive' ? 'status-badge-absent' : 'status-badge-late'
    );
  }

  modal.classList.remove('hidden');
  modal.classList.add('flex');
}

function closeViewModal() {
  const modal = document.getElementById('viewRfidModal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
}

// =============================================================
// TOGGLE / STATUS CHANGE ACTION
// =============================================================
function toggleCardStatus(studentName, currentStatus) {
  const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
  const actionText = newStatus === 'Active' ? 'activated' : 'deactivated';
  showToast(`RFID card for ${studentName} has been ${actionText}.`, newStatus === 'Active' ? 'success' : 'error');
}

// =============================================================
// MODAL GENERAL LISTENERS (Escape key & backdrop click)
// =============================================================
function initModalListeners() {
  // ESC key closes any open modal
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      closeFilterModal();
      closeRegisterModal();
      closeReplaceModal();
      closeViewModal();
    }
  });

  // Backdrop click closes modal
  const modals = ['filterModal', 'registerModal', 'replaceModal', 'viewRfidModal'];
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
