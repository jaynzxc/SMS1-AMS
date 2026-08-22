// assets/js/scan-logs.js
// Scan Logs Management & Real-Time Monitoring Module

document.addEventListener('DOMContentLoaded', function() {
  console.log('Scan Logs module initialized');

  // Initialize Search
  initScanSearch();

  // Backdrop click and ESC key listeners for all modals
  initModalListeners();

  // Initialize live timer badge if present
  initLiveClock();
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
// SEARCH & MULTI-CRITERIA FILTERING
// =============================================================
function initScanSearch() {
  const searchInput = document.getElementById('scanSearch');
  if (!searchInput) return;

  searchInput.addEventListener('input', function() {
    executeScanFiltering();
  });
}

function executeScanFiltering() {
  const searchInput = document.getElementById('scanSearch');
  const typeFilter = document.getElementById('filterScanTypeSelect');
  const resultFilter = document.getElementById('filterResultSelect');
  const checkpointFilter = document.getElementById('filterCheckpointSelect');
  const courseFilter = document.getElementById('filterCourseSelect');
  const dateFilter = document.getElementById('filterDateInput');
  const table = document.getElementById('scanLogsTable');

  if (!table) return;

  const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';
  const selectedType = typeFilter ? typeFilter.value.toLowerCase().trim() : '';
  const selectedResult = resultFilter ? resultFilter.value.toLowerCase().trim() : '';
  const selectedCheckpoint = checkpointFilter ? checkpointFilter.value.toLowerCase().trim() : '';
  const selectedCourse = courseFilter ? courseFilter.value.toLowerCase().trim() : '';
  const selectedDate = dateFilter ? dateFilter.value.trim() : '';

  const rows = table.querySelectorAll('tbody tr');
  let visibleCount = 0;

  rows.forEach(row => {
    const rowText = row.innerText.toLowerCase();
    const typeCell = row.getAttribute('data-scan-type') || (row.querySelector('[data-scan-type]') ? row.querySelector('[data-scan-type]').getAttribute('data-scan-type') : '');
    const resultCell = row.getAttribute('data-result') || (row.querySelector('[data-result]') ? row.querySelector('[data-result]').getAttribute('data-result') : '');
    const checkpointCell = row.getAttribute('data-checkpoint') || (row.querySelector('[data-checkpoint]') ? row.querySelector('[data-checkpoint]').getAttribute('data-checkpoint') : '');
    const courseCell = row.getAttribute('data-course') || '';
    const dateCell = row.getAttribute('data-date') || '';

    const matchesSearch = !searchTerm || rowText.includes(searchTerm);
    const matchesType = !selectedType || selectedType === 'all' || typeCell.toLowerCase().includes(selectedType) || rowText.includes(selectedType);
    const matchesResult = !selectedResult || selectedResult === 'all' || resultCell.toLowerCase().includes(selectedResult) || rowText.includes(selectedResult);
    const matchesCheckpoint = !selectedCheckpoint || selectedCheckpoint === 'all' || checkpointCell.toLowerCase().includes(selectedCheckpoint) || rowText.includes(selectedCheckpoint);
    const matchesCourse = !selectedCourse || selectedCourse === 'all' || courseCell.toLowerCase().includes(selectedCourse) || rowText.includes(selectedCourse);
    const matchesDate = !selectedDate || dateCell.includes(selectedDate) || rowText.includes(selectedDate);

    if (matchesSearch && matchesType && matchesResult && matchesCheckpoint && matchesCourse && matchesDate) {
      row.style.display = '';
      visibleCount++;
    } else {
      row.style.display = 'none';
    }
  });

  // Update visible count in table header badge
  const countBadge = document.getElementById('scanRecordCount');
  if (countBadge) {
    const hasFilter = searchTerm || selectedType || selectedResult || selectedCheckpoint || selectedCourse || selectedDate;
    countBadge.textContent = hasFilter ? `${visibleCount} Found` : `4,825 Logs`;
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
  executeScanFiltering();
  showToast('Filters applied successfully!', 'info');
}

function resetFilters() {
  if (document.getElementById('filterScanTypeSelect')) document.getElementById('filterScanTypeSelect').value = '';
  if (document.getElementById('filterResultSelect')) document.getElementById('filterResultSelect').value = '';
  if (document.getElementById('filterCheckpointSelect')) document.getElementById('filterCheckpointSelect').value = '';
  if (document.getElementById('filterCourseSelect')) document.getElementById('filterCourseSelect').value = '';
  if (document.getElementById('filterDateInput')) document.getElementById('filterDateInput').value = '';
  if (document.getElementById('scanSearch')) document.getElementById('scanSearch').value = '';

  closeFilterModal();
  executeScanFiltering();
  showToast('Filters reset to default.', 'info');
}

// =============================================================
// VIEW SCAN DETAILS MODAL CONTROLS
// =============================================================
function openViewScanModal(data) {
  const modal = document.getElementById('viewScanModal');
  if (!modal) return;

  // Populate data
  if (document.getElementById('modalStudentName')) document.getElementById('modalStudentName').textContent = data.student || 'Santos, Maria';
  if (document.getElementById('modalStudentId')) document.getElementById('modalStudentId').textContent = 'ID: ' + (data.id || '2026-1001');
  if (document.getElementById('modalCourseYear')) document.getElementById('modalCourseYear').textContent = data.courseYear || 'BSIT - 3rd Year';
  if (document.getElementById('modalScanType')) document.getElementById('modalScanType').textContent = data.scanType || 'RFID Tap';
  if (document.getElementById('modalDeviceUid')) document.getElementById('modalDeviceUid').textContent = data.uid || 'RFID-000123';
  if (document.getElementById('modalCheckpoint')) document.getElementById('modalCheckpoint').textContent = data.checkpoint || 'Gate 1 - Main Entrance (Kiosk A)';
  if (document.getElementById('modalTimestamp')) document.getElementById('modalTimestamp').textContent = data.timestamp || 'July 25, 2026 · 07:20:15 AM';
  if (document.getElementById('modalLogType')) document.getElementById('modalLogType').textContent = data.logType || 'Time-In (Morning Entry)';
  if (document.getElementById('modalSmsStatus')) document.getElementById('modalSmsStatus').textContent = data.smsStatus || 'Delivered to Guardian (+63 917 555 0192) at 07:20 AM';

  // Result Badge
  const resultBadge = document.getElementById('modalResultBadge');
  if (resultBadge) {
    const result = data.result || 'Success';
    resultBadge.textContent = result;
    if (result === 'Success') {
      resultBadge.className = 'status-badge status-badge-present';
    } else if (result === 'Failed' || result === 'Unregistered Card') {
      resultBadge.className = 'status-badge status-badge-absent';
    } else if (result === 'Late' || result === 'Tardy') {
      resultBadge.className = 'status-badge status-badge-late';
    } else {
      resultBadge.className = 'status-badge status-badge-excused';
    }
  }

  // Type Icon Pill
  const typePill = document.getElementById('modalTypePill');
  if (typePill) {
    const isRfid = (data.scanType || '').toUpperCase().includes('RFID');
    if (isRfid) {
      typePill.className = 'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-[#ede9fe] text-[#7c3aed] border border-[#ddd6fe]';
      typePill.innerHTML = `
        <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
        RFID Tap
      `;
    } else {
      typePill.className = 'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-[#eff6ff] text-[#2563eb] border border-[#bfdbfe]';
      typePill.innerHTML = `
        <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 15.375c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z" />
        </svg>
        QR Scan
      `;
    }
  }

  modal.classList.remove('hidden');
  modal.classList.add('flex');
}

function closeViewScanModal() {
  const modal = document.getElementById('viewScanModal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
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
  showToast(`Generating ${format} export for (${specificDate})... Download will start shortly.`, 'info');

  const fileExt = format.toLowerCase() === 'excel' ? 'xlsx' : 'csv';
  setTimeout(() => {
    showToast(`Scan_Logs_${specificDate}.${fileExt} downloaded successfully!`, 'success');
  }, 1200);
}

// =============================================================
// SIMULATE SCAN / TEST TAP MODAL CONTROLS
// =============================================================
function openSimulateScanModal() {
  const modal = document.getElementById('simulateScanModal');
  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }
}

function closeSimulateScanModal() {
  const modal = document.getElementById('simulateScanModal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
}

function handleSimulateScan(event) {
  if (event) event.preventDefault();

  const studentSelect = document.getElementById('simStudentSelect');
  const scanType = document.getElementById('simScanType')?.value || 'RFID';
  const checkpoint = document.getElementById('simCheckpoint')?.value || 'Gate 1 - Main Entrance';
  const result = document.getElementById('simResult')?.value || 'Success';

  let studentName = 'Santos, Maria';
  let studentId = '2026-1001';
  let courseYear = 'BSIT - 3rd Year';

  if (studentSelect) {
    const selectedOption = studentSelect.options[studentSelect.selectedIndex];
    studentName = selectedOption.getAttribute('data-name') || selectedOption.text;
    studentId = selectedOption.getAttribute('data-id') || '2026-1001';
    courseYear = selectedOption.getAttribute('data-course-year') || 'BSIT - 3rd Year';
  }

  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const dateStr = 'July 25, 2026';
  const uid = scanType === 'RFID' ? `RFID-${Math.floor(100000 + Math.random() * 900000)}` : `QR-SEC-${studentId}`;

  // Insert Row dynamically into table
  const table = document.getElementById('scanLogsTable');
  if (table) {
    const tbody = table.querySelector('tbody');
    if (tbody) {
      const tr = document.createElement('tr');
      tr.className = 'hover:bg-[#f9fafb] transition-colors bg-blue-50/40 animate-pulse';
      tr.setAttribute('data-student-id', studentId);
      tr.setAttribute('data-scan-type', scanType);
      tr.setAttribute('data-result', result);
      tr.setAttribute('data-checkpoint', checkpoint);
      tr.setAttribute('data-course', courseYear.split(' - ')[0] || 'BSIT');
      tr.setAttribute('data-date', dateStr);

      const isRfid = scanType === 'RFID';
      const badgeHtml = isRfid
        ? `<span class="method-badge method-badge-rfid" style="color: #7c3aed; background-color: #ede9fe; border-color: #7c3aed;">RFID</span>`
        : `<span class="method-badge method-badge-qr">QR</span>`;

      const resultBadgeHtml = result === 'Success'
        ? `<span class="status-badge status-badge-present">Success</span>`
        : result === 'Late'
        ? `<span class="status-badge status-badge-late">Late</span>`
        : `<span class="status-badge status-badge-absent">Failed</span>`;

      tr.innerHTML = `
        <td class="py-3.5 px-4 font-mono font-medium text-[#6b7280]">${studentId}</td>
        <td class="py-3.5 px-4 font-medium text-[#111827]">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-full bg-[#0030c2]/10 text-[#0030c2] font-bold text-xs flex items-center justify-center shrink-0">
              ${studentName.charAt(0)}
            </div>
            <div>
              <p class="font-bold text-[#111827]">${studentName}</p>
              <p class="text-[11px] text-[#6b7280]">${courseYear}</p>
            </div>
          </div>
        </td>
        <td class="py-3.5 px-4 text-[#6b7280]">
          <div class="font-medium text-[#111827]">${dateStr}</div>
          <div class="text-[11px] text-[#6b7280]">${timeStr}</div>
        </td>
        <td class="py-3.5 px-4">${badgeHtml}</td>
        <td class="py-3.5 px-4">${resultBadgeHtml}</td>
        <td class="py-3.5 px-4 font-medium text-[#374151]">${checkpoint}</td>
        <td class="py-3.5 px-4 text-center">
          <div class="flex items-center justify-center gap-1.5">
            <button onclick="openViewScanModal({student: '${studentName}', id: '${studentId}', courseYear: '${courseYear}', scanType: '${scanType} Tap', uid: '${uid}', checkpoint: '${checkpoint}', timestamp: '${dateStr} · ${timeStr}', logType: 'Time-In (Simulated)', result: '${result}', smsStatus: 'Simulated Parent Alert Sent'})" class="p-1.5 text-[#2563eb] hover:bg-blue-50 rounded-lg transition-colors inline-flex items-center justify-center" title="View Full Scan Details">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638-0-8.573-3.007-9.963-7.178z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
            <button onclick="handleReverify('${studentName}', '${studentId}')" class="p-1.5 text-[#6b7280] hover:text-[#0030c2] hover:bg-gray-100 rounded-lg transition-colors inline-flex items-center justify-center" title="Re-Verify Authentication">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          </div>
        </td>
      `;

      tbody.insertBefore(tr, tbody.firstChild);

      setTimeout(() => {
        tr.classList.remove('animate-pulse', 'bg-blue-50/40');
      }, 2000);
    }
  }

  // Update total count
  const countBadge = document.getElementById('scanRecordCount');
  if (countBadge) {
    countBadge.textContent = '4,826 Logs';
  }

  closeSimulateScanModal();
  showToast(`Simulated ${scanType} scan for ${studentName} logged at ${checkpoint}!`, result === 'Success' ? 'success' : 'error');
}

// =============================================================
// REVERIFY SCAN ACTION
// =============================================================
function handleReverify(studentName, studentId) {
  showToast(`Re-verified scan entry for ${studentName} (${studentId}). Checksum valid!`, 'success');
}

// =============================================================
// REFRESH LOGS
// =============================================================
function refreshScanLogs() {
  const refreshIcon = document.getElementById('refreshIcon');
  if (refreshIcon) {
    refreshIcon.classList.add('animate-spin');
    setTimeout(() => {
      refreshIcon.classList.remove('animate-spin');
      showToast('Scan logs refreshed. 3 new live events synced.', 'info');
    }, 700);
  } else {
    showToast('Scan logs updated from server.', 'info');
  }
}

// =============================================================
// LIVE CLOCK HELPER
// =============================================================
function initLiveClock() {
  const clockEl = document.getElementById('liveScannerClock');
  if (!clockEl) return;

  function update() {
    const now = new Date();
    clockEl.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  }
  update();
  setInterval(update, 1000);
}

// =============================================================
// MODAL GENERAL LISTENERS (Escape key & backdrop click)
// =============================================================
function initModalListeners() {
  // ESC key closes any open modal
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      closeFilterModal();
      closeViewScanModal();
      closeExportModal();
      closeSimulateScanModal();
    }
  });

  // Backdrop click closes modal
  const modals = ['filterModal', 'viewScanModal', 'exportModal', 'simulateScanModal'];
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
