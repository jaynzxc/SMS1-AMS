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
// EDIT RFID MODAL CONTROLS
// =============================================================
function openEditModal(data) {
  const modal = document.getElementById('editModal');
  if (!modal) return;

  if (document.getElementById('editStudentId')) document.getElementById('editStudentId').value = data.id || '';
  if (document.getElementById('editStudentName')) document.getElementById('editStudentName').value = data.student || '';
  if (document.getElementById('editCourse')) document.getElementById('editCourse').value = data.course || 'BSIT';
  if (document.getElementById('editYear')) document.getElementById('editYear').value = data.year || '1st Year';
  if (document.getElementById('editRfidUid')) document.getElementById('editRfidUid').value = data.rfid || '';
  if (document.getElementById('editStatus')) document.getElementById('editStatus').value = data.status || 'Active';

  modal.classList.remove('hidden');
  modal.classList.add('flex');
}

function closeEditModal() {
  const modal = document.getElementById('editModal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
}

function handleEditRfid(event) {
  if (event) event.preventDefault();
  const studentName = document.getElementById('editStudentName')?.value || 'Student';
  const rfidUid = document.getElementById('editRfidUid')?.value || 'RFID-000000';

  closeEditModal();
  showToast(`RFID record for ${studentName} (${rfidUid}) updated successfully!`, 'success');
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
      closeEditModal();
      closeReplaceModal();
      closeViewModal();
    }
  });

  // Backdrop click closes modal
  const modals = ['filterModal', 'registerModal', 'editModal', 'replaceModal', 'viewRfidModal'];
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
