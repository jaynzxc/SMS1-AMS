/**
 * Teacher Scan Logs Controller
 * Handles historical and session-based scan logs table rendering, searching, filtering, modal audits, and export.
 */

const LOGS_DATA = [
  { id: '2026-1001', name: 'Santos, Maria', section: 'BSIT 3-A', dateTime: 'May 27, 2025 • 07:38:12 AM', status: 'Present', method: 'RFID', result: 'On-Time Tap Verified', checkpoint: 'Reader #01 (Room 402)' },
  { id: '2026-1002', name: 'Garcia, Juan', section: 'BSIT 3-A', dateTime: 'May 27, 2025 • 07:39:45 AM', status: 'Present', method: 'RFID', result: 'On-Time Tap Verified', checkpoint: 'Reader #01 (Room 402)' },
  { id: '2026-1003', name: 'Reyes, Anna', section: 'BSIT 3-A', dateTime: 'May 27, 2025 • 07:41:03 AM', status: 'Present', method: 'QR Code', result: 'Mobile QR Verified', checkpoint: 'Camera Scanner (Room 402)' },
  { id: '2026-1004', name: 'Dela Cruz, John', section: 'BSIT 3-A', dateTime: 'May 27, 2025 • 07:42:15 AM', status: 'Present', method: 'RFID', result: 'On-Time Tap Verified', checkpoint: 'Reader #01 (Room 402)' },
  { id: '2026-1005', name: 'Rivera, Luis', section: 'BSIT 3-A', dateTime: 'May 27, 2025 • 07:44:00 AM', status: 'Present', method: 'RFID', result: 'On-Time Tap Verified', checkpoint: 'Reader #01 (Room 402)' },
  { id: '2026-1006', name: 'Aquino, Bea', section: 'BSIT 3-A', dateTime: 'May 27, 2025 • 07:45:10 AM', status: 'Present', method: 'QR Code', result: 'Mobile QR Verified', checkpoint: 'Camera Scanner (Room 402)' },
  { id: '2026-1007', name: 'Castro, Daniel', section: 'BSIT 3-A', dateTime: 'May 27, 2025 • 07:51:22 AM', status: 'Late', method: 'RFID', result: 'Late (6 mins)', checkpoint: 'Reader #01 (Room 402)' },
  { id: '2026-1008', name: 'Bautista, Elena', section: 'BSIT 3-A', dateTime: 'May 27, 2025 • 07:55:40 AM', status: 'Late', method: 'QR Code', result: 'Late (10 mins)', checkpoint: 'Camera Scanner (Room 402)' },
  { id: '2026-1009', name: 'Navarro, Mark', section: 'BSIT 3-A', dateTime: 'May 27, 2025 • 08:02:15 AM', status: 'Late', method: 'RFID', result: 'Late (17 mins)', checkpoint: 'Reader #01 (Room 402)' },
  { id: '2026-1010', name: 'Ramos, Joshua', section: 'BSIT 3-A', dateTime: 'May 27, 2025 • 07:46:00 AM', status: 'Present', method: 'Manual', result: 'Manual Override Approved', checkpoint: 'Teacher Console' },
  { id: '2026-1011', name: 'Valdez, Christine', section: 'BSIT 3-A', dateTime: 'May 27, 2025 • 07:35:10 AM', status: 'Present', method: 'RFID', result: 'On-Time Tap Verified', checkpoint: 'Reader #01 (Room 402)' },
  { id: '2026-1012', name: 'Mendoza, Kyle', section: 'BSIT 3-A', dateTime: 'May 27, 2025 • 07:36:55 AM', status: 'Present', method: 'RFID', result: 'On-Time Tap Verified', checkpoint: 'Reader #01 (Room 402)' }
];

let currentLogs = JSON.parse(JSON.stringify(LOGS_DATA));
let searchQuery = '';
let filterStatus = '';
let filterMethod = '';

document.addEventListener('DOMContentLoaded', () => {
  initSidebar();
  initSearch();
  renderLogsTable();
  updateKpiStats();
});

/**
 * Sidebar and Dropdown navigation
 */
function initSidebar() {
  const burgerBtn = document.querySelector('.burger-btn') || document.getElementById('sidebarToggleBtn');
  const sidebar = document.getElementById('mainSidebar') || document.querySelector('aside');

  if (burgerBtn && sidebar && !burgerBtn.getAttribute('onclick')) {
    burgerBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      sidebar.classList.toggle('sidebar-collapsed');
    });
  }
}

window.toggleScannerDropdown = function() {
  const menu = document.getElementById('scannerDropdownMenu');
  const arrow = document.getElementById('scannerDropdownArrow');
  if (menu && arrow) {
    menu.classList.toggle('hidden');
    arrow.classList.toggle('rotate-90');
  }
};

/**
 * Initialize search listener
 */
function initSearch() {
  const searchInput = document.getElementById('logSearchInput');
  const topbarSearch = document.getElementById('topbarSearchInput');

  function handleSearch(val) {
    searchQuery = val.trim().toLowerCase();
    renderLogsTable();
  }

  if (searchInput) {
    searchInput.addEventListener('input', (e) => handleSearch(e.target.value));
  }
  if (topbarSearch) {
    topbarSearch.addEventListener('input', (e) => handleSearch(e.target.value));
  }
}

/**
 * Render Scan Logs Table (matching rfid-registry.html design)
 */
function renderLogsTable() {
  const tbody = document.getElementById('scanLogsTableBody');
  const countBadge = document.getElementById('logsRecordCountBadge');
  const showingCount = document.getElementById('pageShowingCount');
  const totalCount = document.getElementById('pageTotalCount');
  if (!tbody) return;

  const filtered = currentLogs.filter(log => {
    const matchesStatus = !filterStatus || log.status.toLowerCase() === filterStatus.toLowerCase();
    const matchesMethod = !filterMethod || log.method.toLowerCase() === filterMethod.toLowerCase();
    const matchesSearch = !searchQuery ||
      log.name.toLowerCase().includes(searchQuery) ||
      log.id.toLowerCase().includes(searchQuery) ||
      log.result.toLowerCase().includes(searchQuery) ||
      log.checkpoint.toLowerCase().includes(searchQuery);

    return matchesStatus && matchesMethod && matchesSearch;
  });

  if (countBadge) countBadge.textContent = `${filtered.length} Records`;
  if (showingCount) showingCount.textContent = filtered.length;
  if (totalCount) totalCount.textContent = currentLogs.length;

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" class="py-10 text-center text-xs text-[#6b7280]">
          <div class="flex flex-col items-center justify-center gap-2">
            <svg class="w-8 h-8 text-[#9ca3af]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
            <p class="font-semibold text-[#374151]">No scan logs found</p>
            <p class="text-[11px] text-[#9ca3af]">Try adjusting your search keywords or filter criteria.</p>
          </div>
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = filtered.map(log => {
    let statusBadgeClass = 'status-badge status-badge-present';
    if (log.status === 'Late') statusBadgeClass = 'status-badge status-badge-late';
    else if (log.status === 'Absent') statusBadgeClass = 'status-badge status-badge-absent';

    let methodBadgeClass = 'method-badge method-badge-rfid';
    if (log.method === 'QR Code') methodBadgeClass = 'method-badge method-badge-qr';
    else if (log.method === 'Manual') methodBadgeClass = 'method-badge method-badge-manual';

    return `
      <tr class="hover:bg-[#f9fafb] transition-colors">
        <td class="py-3.5 px-4 font-semibold text-[#6b7280] font-mono text-xs">${log.id}</td>
        <td class="py-3.5 px-4">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-full bg-[#e5e7eb] flex items-center justify-center shrink-0">
              <svg class="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12a4.5 4.5 0 100-9 4.5 4.5 0 000 9zM4 20.5c0-3.59 3.58-6.5 8-6.5s8 2.91 8 6.5V21H4v-.5z" />
              </svg>
            </div>
            <div>
              <p class="font-bold text-[#111827]">${log.name}</p>
              <p class="text-[11px] text-[#6b7280]">${log.section}</p>
            </div>
          </div>
        </td>
        <td class="py-3.5 px-4 font-medium text-[#374151] font-mono text-xs">${log.dateTime}</td>
        <td class="py-3.5 px-4" data-status="${log.status}">
          <span class="${statusBadgeClass}">${log.status}</span>
        </td>
        <td class="py-3.5 px-4 font-medium text-[#374151]">
          <span class="${methodBadgeClass}">${log.method}</span>
        </td>
        <td class="py-3.5 px-4 font-medium text-[#6b7280] text-xs max-w-[180px] truncate" title="${log.result}">
          ${log.result}
        </td>
        <td class="py-3.5 px-4 text-center">
          <div class="flex items-center justify-center gap-1.5">
            <!-- View Details Button (from rfid-registry.html) -->
            <button onclick="openViewScanModal('${log.id}')"
              class="p-1.5 text-[#2563eb] hover:bg-blue-50 rounded-lg transition-colors inline-flex items-center justify-center"
              title="View Scan Details">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638-0-8.573-3.007-9.963-7.178z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

/**
 * KPI Stat Counter updates
 */
function updateKpiStats() {
  const total = currentLogs.length;
  const rfidCount = currentLogs.filter(l => l.method === 'RFID').length;
  const qrCount = currentLogs.filter(l => l.method === 'QR Code').length;
  const manualCount = currentLogs.filter(l => l.method === 'Manual').length;

  updateText('kpiTotalScans', total);
  updateText('kpiRfidScans', rfidCount);
  updateText('kpiQrScans', qrCount);
  updateText('kpiManualScans', manualCount);
}

/**
 * Filter Modal Controls
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
  filterStatus = statusSelect ? statusSelect.value : '';
  filterMethod = methodSelect ? methodSelect.value : '';
  closeFilterModal();
  renderLogsTable();
  showToast('Filters applied successfully', 'success');
};

window.resetModalFilters = function() {
  const statusSelect = document.getElementById('filterStatusSelect');
  const methodSelect = document.getElementById('filterMethodSelect');
  if (statusSelect) statusSelect.value = '';
  if (methodSelect) methodSelect.value = '';
  filterStatus = '';
  filterMethod = '';
  closeFilterModal();
  renderLogsTable();
  showToast('Filters reset to default', 'info');
};

/**
 * Export Modal Controls
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

window.handleExport = function() {
  closeExportModal();
  showToast('Classroom scan logs downloaded successfully!', 'success');
};

/**
 * View Scan Audit Details Modal
 */
window.openViewScanModal = function(studentId) {
  const log = currentLogs.find(l => l.id === studentId);
  if (!log) return;

  updateText('viewModalStudentName', log.name);
  updateText('viewModalStudentId', log.id);
  updateText('viewModalSection', `Web Development (${log.section})`);
  updateText('viewModalTimeIn', log.dateTime);
  updateText('viewModalMethod', log.method === 'RFID' ? 'RFID Card Tap' : (log.method === 'QR Code' ? 'QR Code Mobile Scan' : 'Manual Override'));
  updateText('viewModalRemarks', log.result);

  const statusBadge = document.getElementById('viewModalStatus');
  if (statusBadge) {
    statusBadge.textContent = log.status;
    if (log.status === 'Present') statusBadge.className = 'status-badge status-badge-present';
    else if (log.status === 'Late') statusBadge.className = 'status-badge status-badge-late';
    else statusBadge.className = 'status-badge status-badge-absent';
  }

  const modal = document.getElementById('viewScanModal');
  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }
};

window.closeViewScanModal = function() {
  const modal = document.getElementById('viewScanModal');
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
