// assets/js/qr-management.js
// QR Code Management Interactive Functionality

document.addEventListener('DOMContentLoaded', function() {
  console.log('QR Code Management module initialized');

  // Initialize Search
  initQrSearch();

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
function initQrSearch() {
  const searchInput = document.getElementById('qrSearch');
  if (!searchInput) return;

  searchInput.addEventListener('input', function() {
    executeQrFiltering();
  });
}

function executeQrFiltering() {
  const searchInput = document.getElementById('qrSearch');
  const courseFilter = document.getElementById('filterCourseSelect');
  const yearFilter = document.getElementById('filterYearSelect');
  const statusFilter = document.getElementById('filterStatusSelect');
  const table = document.getElementById('qrTable');

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
  const countBadge = document.getElementById('qrRecordCount');
  if (countBadge) {
    countBadge.textContent = searchTerm || selectedCourse || selectedYear || selectedStatus 
      ? `${visibleCount} Found` 
      : `4,825 Codes`;
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
  executeQrFiltering();
  showToast('Filters applied successfully!', 'info');
}

function resetFilters() {
  if (document.getElementById('filterCourseSelect')) document.getElementById('filterCourseSelect').value = '';
  if (document.getElementById('filterYearSelect')) document.getElementById('filterYearSelect').value = '';
  if (document.getElementById('filterStatusSelect')) document.getElementById('filterStatusSelect').value = '';
  if (document.getElementById('qrSearch')) document.getElementById('qrSearch').value = '';

  closeFilterModal();
  executeQrFiltering();
  showToast('Filters reset to default.', 'info');
}

// =============================================================
// GENERATE QR MODAL CONTROLS
// =============================================================
function openGenerateQrModal() {
  const modal = document.getElementById('generateQrModal');
  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }
}

function closeGenerateQrModal() {
  const modal = document.getElementById('generateQrModal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
}

function handleGenerateQr(event) {
  if (event) event.preventDefault();
  const studentName = document.getElementById('genStudentName')?.value || 'Student';
  const studentId = document.getElementById('genStudentId')?.value || '2026-0000';

  closeGenerateQrModal();
  showToast(`QR Code generated for ${studentName} (${studentId})!`, 'success');
}

// =============================================================
// VIEW QR CODE MODAL CONTROLS
// =============================================================
function openViewQrModal(data) {
  const modal = document.getElementById('viewQrModal');
  if (!modal) return;

  if (document.getElementById('viewStudentName')) document.getElementById('viewStudentName').textContent = data.student || 'Santos, Maria';
  if (document.getElementById('viewStudentId')) document.getElementById('viewStudentId').textContent = 'ID: ' + (data.id || '2026-1001');
  if (document.getElementById('viewCourseYear')) document.getElementById('viewCourseYear').textContent = data.courseYear || 'BSIT - 3rd Year';
  if (document.getElementById('viewDateGenerated')) document.getElementById('viewDateGenerated').textContent = data.dateGenerated || 'July 25, 2026';
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

function closeViewQrModal() {
  const modal = document.getElementById('viewQrModal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
}

// =============================================================
// REGENERATE QR ACTION
// =============================================================
function handleRegenerateQr(studentName, studentId) {
  showToast(`QR Code for ${studentName} (${studentId}) has been regenerated and activated!`, 'success');
}

// =============================================================
// DOWNLOAD & PRINT QR ACTIONS
// =============================================================
function handleDownloadQr(studentName) {
  showToast(`Downloading QR Code image for ${studentName}...`, 'info');
}

function handlePrintQr(studentName) {
  showToast(`Preparing print layout for ${studentName}'s QR Pass...`, 'info');
}

// =============================================================
// MODAL GENERAL LISTENERS (Escape key & backdrop click)
// =============================================================
function initModalListeners() {
  // ESC key closes any open modal
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      closeFilterModal();
      closeGenerateQrModal();
      closeViewQrModal();
    }
  });

  // Backdrop click closes modal
  const modals = ['filterModal', 'generateQrModal', 'viewQrModal'];
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
