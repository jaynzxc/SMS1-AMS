// assets/js/excuse-slip.js
// Interactive features for Excuse Slip Management

document.addEventListener('DOMContentLoaded', function() {
  console.log('Excuse Slip Management module initialized');

  // Initialize Search inputs for tables
  initTableSearch('pendingSearch', 'pendingTable');
  initTableSearch('approvedSearch', 'approvedTable');
  initTableSearch('rejectedSearch', 'rejectedTable');
  initTableSearch('historySearch', 'historyTable');
});

// Export Modal Controls (Matching tardy-list.html standard)
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

  // Determine prefix and table based on current page filename or title
  let filename = 'Excuse_Slip_Report';
  let tableId = '';
  let headers = [];
  let colIndices = []; // indices of cells to export
  
  const path = window.location.pathname;
  if (path.includes('pending-requests')) {
    filename = 'Pending_Requests';
    tableId = 'pendingTable';
    headers = ["Student ID", "Student Name", "Section", "Submitted Date", "Absence Date", "Reason"];
    colIndices = [0, 1, 2, 3, 4, 5];
  } else if (path.includes('approved-requests')) {
    filename = 'Approved_Requests';
    tableId = 'approvedTable';
    headers = ["Student ID", "Student Name", "Section", "Absence Date", "Approved By", "Approval Date", "Remarks"];
    colIndices = [0, 1, 2, 3, 4, 5, 6];
  } else if (path.includes('rejected-requests')) {
    filename = 'Rejected_Requests';
    tableId = 'rejectedTable';
    headers = ["Student ID", "Student Name", "Section", "Absence Date", "Reason for Rejection", "Rejected Date"];
    colIndices = [0, 1, 2, 3, 4, 5];
  } else if (path.includes('excuse-history')) {
    filename = 'Excuse_History';
    tableId = 'historyTable';
    headers = ["Student ID", "Student Name", "Section", "Absent Date", "Reason", "Status", "Submitted Date"];
    colIndices = [0, 1, 2, 3, 4, 5, 6];
  }

  closeExportModal();
  showToast('Exporting Records...', `Generating ${format} report for ${specificDate}`, 'info');

  setTimeout(() => {
    if (format === 'CSV' && tableId) {
      const table = document.getElementById(tableId);
      if (table) {
        const visibleRows = Array.from(table.querySelectorAll('tbody tr')).filter(row => row.style.display !== 'none');
        const csvRows = [headers];

        visibleRows.forEach(row => {
          const cells = row.querySelectorAll('td');
          if (cells.length > 0) {
            const rowData = colIndices.map(idx => {
              const cell = cells[idx];
              if (!cell) return '""';
              // Check if cell contains the Student Name layout with avatar and p
              const namePara = cell.querySelector('p.font-bold') || cell.querySelector('p');
              if (idx === 1 && namePara) {
                return `"${namePara.textContent.trim()}"`;
              }
              return `"${cell.textContent.trim()}"`;
            });
            csvRows.push(rowData);
          }
        });

        const csvContent = "data:text/csv;charset=utf-8," + csvRows.map(e => e.join(",")).join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `${filename}_${specificDate}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
    showToast('Download Ready', `Excuse slips report exported successfully (${format})`, 'success');
  }, 800);
}

// Fallback helper for direct programmatic export triggers
function triggerExport(format, title = 'Excuse_Slip_Report') {
  showToast(`Exporting ${title} as ${format.toUpperCase()}...`, 'info');
  setTimeout(() => {
    showToast(`${title}.${format.toLowerCase() === 'excel' ? 'xlsx' : format.toLowerCase()} downloaded successfully!`, 'success');
  }, 800);
}

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
