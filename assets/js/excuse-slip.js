// assets/js/excuse-slip.js
// Interactive features for Excuse Slip Management

document.addEventListener('DOMContentLoaded', function() {
  console.log('Excuse Slip Management module initialized');

  // Initialize Search inputs for tables
  initTableSearch('pendingSearch', 'pendingTable');
  initTableSearch('approvedSearch', 'approvedTable');
  initTableSearch('rejectedSearch', 'rejectedTable');
  initTableSearch('historySearch', 'historyTable');

  // Initialize Export Dropdowns
  initExportDropdowns();
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
    ? `<svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>`
    : `<svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`;

  toast.className = `flex items-center gap-2 px-4 py-3 text-white text-sm font-medium rounded-lg shadow-lg ${bgColor} transform transition-all duration-300 translate-y-2 opacity-0 pointer-events-auto`;
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

// Table Search Filtering
function initTableSearch(inputId, tableId) {
  const searchInput = document.getElementById(inputId);
  const table = document.getElementById(tableId);
  if (!searchInput || !table) return;

  searchInput.addEventListener('input', function(e) {
    const term = e.target.value.toLowerCase().trim();
    const rows = table.querySelectorAll('tbody tr');
    let visibleCount = 0;

    rows.forEach(row => {
      const text = row.innerText.toLowerCase();
      if (text.includes(term)) {
        row.style.display = '';
        visibleCount++;
      } else {
        row.style.display = 'none';
      }
    });
  });
}

// Modal: View Excuse Slip / Attachment
function openAttachmentModal(data) {
  const modal = document.getElementById('viewSlipModal');
  if (!modal) return;

  // Populate data
  if (document.getElementById('modalStudentName')) document.getElementById('modalStudentName').textContent = data.student || 'Santos, Maria';
  if (document.getElementById('modalStudentId')) document.getElementById('modalStudentId').textContent = 'ID: ' + (data.id || '2026-1001');
  if (document.getElementById('modalSection')) document.getElementById('modalSection').textContent = data.section || 'Grade 10 - A';
  if (document.getElementById('modalSubmittedDate')) document.getElementById('modalSubmittedDate').textContent = data.submitted || 'July 25, 2026 9:15 AM';
  if (document.getElementById('modalAbsenceDate')) document.getElementById('modalAbsenceDate').textContent = data.absenceDate || 'July 24, 2026';
  if (document.getElementById('modalReason')) document.getElementById('modalReason').textContent = data.reason || 'Medical Appointment';
  
  const statusEl = document.getElementById('modalStatus');
  if (statusEl) {
    statusEl.textContent = data.status || 'Pending Review';
    statusEl.className = 'status-badge ' + (
      data.status === 'Approved' ? 'status-badge-present' :
      data.status === 'Rejected' ? 'status-badge-absent' : 'status-badge-late'
    );
  }

  const remarksEl = document.getElementById('modalRemarks');
  if (remarksEl) {
    remarksEl.textContent = data.remarks || 'Medical certificate attached and awaiting adviser review.';
  }

  modal.classList.remove('hidden');
  modal.classList.add('flex');
}

function closeAttachmentModal() {
  const modal = document.getElementById('viewSlipModal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
}

// Modal: Quick Approve
function openApproveModal(studentName, studentId, absenceDate) {
  const modal = document.getElementById('approveModal');
  if (!modal) return;

  if (document.getElementById('approveStudentText')) {
    document.getElementById('approveStudentText').textContent = `${studentName} (${studentId}) - Absence: ${absenceDate}`;
  }
  modal.classList.remove('hidden');
  modal.classList.add('flex');
}

function closeApproveModal() {
  const modal = document.getElementById('approveModal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
}

function confirmApproval() {
  closeApproveModal();
  showToast('Excuse slip approved successfully!', 'success');
}

// Modal: Quick Reject
function openRejectModal(studentName, studentId, absenceDate) {
  const modal = document.getElementById('rejectModal');
  if (!modal) return;

  if (document.getElementById('rejectStudentText')) {
    document.getElementById('rejectStudentText').textContent = `${studentName} (${studentId}) - Absence: ${absenceDate}`;
  }
  modal.classList.remove('hidden');
  modal.classList.add('flex');
}

function closeRejectModal() {
  const modal = document.getElementById('rejectModal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
}

function confirmRejection() {
  const reason = document.getElementById('rejectionReasonSelect')?.value || 'Incomplete attachment';
  closeRejectModal();
  showToast(`Excuse slip rejected (${reason})`, 'error');
}

// Filter Modal
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
  showToast('Filters applied successfully!', 'info');
}

// Export Dropdown
function initExportDropdowns() {
  document.querySelectorAll('.export-btn-group').forEach(group => {
    const btn = group.querySelector('.export-btn');
    const menu = group.querySelector('.export-menu');
    if (btn && menu) {
      btn.addEventListener('click', function(e) {
        e.stopPropagation();
        menu.classList.toggle('hidden');
      });
    }
  });

  document.addEventListener('click', function() {
    document.querySelectorAll('.export-menu').forEach(m => m.classList.add('hidden'));
  });
}

function triggerExport(format, title = 'Excuse_Slip_Report') {
  showToast(`Exporting ${title} as ${format.toUpperCase()}...`, 'info');
  setTimeout(() => {
    showToast(`${title}.${format.toLowerCase()} downloaded successfully!`, 'success');
  }, 800);
}
