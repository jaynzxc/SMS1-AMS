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
