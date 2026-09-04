// assets/js/teacher/parent-alerts.js

// ==========================================================================
// MOCK DATA STORE: PARENT SMS ATTENDANCE ALERTS (Teacher Panel Assigned Classes)
// ==========================================================================

let alertsData = [
  {
    id: "ALT-2026-001",
    studentId: "2024-00142",
    studentName: "Juan Dela Cruz",
    section: "BSIT 3A",
    subject: "IT301 - Web Development",
    parentName: "Maria Dela Cruz",
    relationship: "Mother",
    contactNumber: "0917-882-4190",
    carrier: "Globe Telecom",
    alertType: "Late Advisory",
    timestamp: "2026-09-04 07:46 AM",
    date: "2026-09-04",
    status: "Delivered",
    messageBody: "BCP AMS Advisory: Your student Juan Dela Cruz (BSIT 3A) arrived LATE at 07:45 AM for class IT301. Punctuality is encouraged. - Bestlink College"
  },
  {
    id: "ALT-2026-002",
    studentId: "2024-00189",
    studentName: "Angelo Santos",
    section: "BSIT 3A",
    subject: "IT301 - Web Development",
    parentName: "Roberto Santos",
    relationship: "Father",
    contactNumber: "0918-554-2199",
    carrier: "Smart Communications",
    alertType: "Unexcused Absence",
    timestamp: "2026-09-04 08:35 AM",
    date: "2026-09-04",
    status: "Delivered",
    messageBody: "BCP AMS Notice: Student Angelo Santos (BSIT 3A) was marked UNEXCUSED ABSENT for IT301 on Sept 04, 2026. Submit an excuse slip promptly. - BCP"
  },
  {
    id: "ALT-2026-003",
    studentId: "2024-00205",
    studentName: "Maria Clara Reyes",
    section: "BSIT 3B",
    subject: "IT302 - Database Systems",
    parentName: "Elena Reyes",
    relationship: "Mother",
    contactNumber: "0920-112-9034",
    carrier: "Smart Communications",
    alertType: "Excuse Approved",
    timestamp: "2026-09-04 10:15 AM",
    date: "2026-09-04",
    status: "Delivered",
    messageBody: "BCP AMS Update: The excuse slip submitted for Maria Clara Reyes (BSIT 3B) for absence date Sept 02 has been APPROVED by the instructor. - BCP"
  },
  {
    id: "ALT-2026-004",
    studentId: "2024-00311",
    studentName: "Mark Christian Dizon",
    section: "BSCS 2A",
    subject: "CS201 - Data Structures",
    parentName: "Carmelo Dizon",
    relationship: "Father",
    contactNumber: "0999-441-8821",
    carrier: "Smart Communications",
    alertType: "Unexcused Absence",
    timestamp: "2026-09-04 01:40 PM",
    date: "2026-09-04",
    status: "Failed",
    messageBody: "BCP AMS Notice: Student Mark Christian Dizon (BSCS 2A) was marked UNEXCUSED ABSENT for CS201 on Sept 04, 2026. Submit an excuse slip promptly. - BCP"
  },
  {
    id: "ALT-2026-005",
    studentId: "2024-00167",
    studentName: "Kristine Joy Mendoza",
    section: "BSIT 4A",
    subject: "IT401 - Capstone Project",
    parentName: "Corazon Mendoza",
    relationship: "Mother",
    contactNumber: "0917-331-9088",
    carrier: "Globe Telecom",
    alertType: "Late Advisory",
    timestamp: "2026-09-04 03:22 PM",
    date: "2026-09-04",
    status: "Delivered",
    messageBody: "BCP AMS Advisory: Your student Kristine Joy Mendoza (BSIT 4A) arrived LATE at 03:20 PM for class IT401. Punctuality is encouraged. - Bestlink College"
  },
  {
    id: "ALT-2026-006",
    studentId: "2024-00450",
    studentName: "Joshua David Alcantara",
    section: "BSIT 3B",
    subject: "IT302 - Database Systems",
    parentName: "Lourdes Alcantara",
    relationship: "Mother",
    contactNumber: "0928-771-4402",
    carrier: "Smart Communications",
    alertType: "Daily Roll Call",
    timestamp: "2026-09-04 05:05 PM",
    date: "2026-09-04",
    status: "Pending",
    messageBody: "BCP AMS Daily Summary: Joshua David Alcantara attended 2/2 scheduled classes today (PRESENT). Thank you for supporting your child's education. - BCP"
  },
  {
    id: "ALT-2026-007",
    studentId: "2024-00277",
    studentName: "Ezekiel Tan",
    section: "BSCS 2A",
    subject: "CS201 - Data Structures",
    parentName: "Arthur Tan",
    relationship: "Father",
    contactNumber: "0908-129-3388",
    carrier: "Smart Communications",
    alertType: "Excuse Rejected",
    timestamp: "2026-09-03 11:20 AM",
    date: "2026-09-03",
    status: "Delivered",
    messageBody: "BCP AMS Notice: The excuse slip submitted for Ezekiel Tan (BSCS 2A) was REJECTED: 'Medical certificate missing clinic stamp'. Please resubmit. - BCP"
  },
  {
    id: "ALT-2026-008",
    studentId: "2024-00512",
    studentName: "Nicole Anne Bautista",
    section: "BSIT 3A",
    subject: "IT301 - Web Development",
    parentName: "Gloria Bautista",
    relationship: "Mother",
    contactNumber: "0915-442-9901",
    carrier: "Globe Telecom",
    alertType: "Unexcused Absence",
    timestamp: "2026-09-03 08:30 AM",
    date: "2026-09-03",
    status: "Delivered",
    messageBody: "BCP AMS Notice: Student Nicole Anne Bautista (BSIT 3A) was marked UNEXCUSED ABSENT for IT301 on Sept 03, 2026. Submit an excuse slip promptly. - BCP"
  },
  {
    id: "ALT-2026-009",
    studentId: "2024-00388",
    studentName: "Gabriel Ramos",
    section: "BSIT 4A",
    subject: "IT401 - Capstone Project",
    parentName: "Danilo Ramos",
    relationship: "Father",
    contactNumber: "0927-661-8012",
    carrier: "Globe Telecom",
    alertType: "Late Advisory",
    timestamp: "2026-09-03 03:15 PM",
    date: "2026-09-03",
    status: "Failed",
    messageBody: "BCP AMS Advisory: Your student Gabriel Ramos (BSIT 4A) arrived LATE at 03:14 PM for class IT401. Punctuality is encouraged. - Bestlink College"
  },
  {
    id: "ALT-2026-010",
    studentId: "2024-00620",
    studentName: "Princess Mae Ocampo",
    section: "BSIT 3B",
    subject: "IT302 - Database Systems",
    parentName: "Teresa Ocampo",
    relationship: "Mother",
    contactNumber: "0917-550-1123",
    carrier: "Globe Telecom",
    alertType: "Daily Roll Call",
    timestamp: "2026-09-02 05:00 PM",
    date: "2026-09-02",
    status: "Delivered",
    messageBody: "BCP AMS Daily Summary: Princess Mae Ocampo attended all scheduled classes on Sept 02 (PRESENT). Bestlink College Attendance System."
  },
  {
    id: "ALT-2026-011",
    studentId: "2024-00105",
    studentName: "Christian Paul Castro",
    section: "BSCS 2A",
    subject: "CS201 - Data Structures",
    parentName: "Rosanna Castro",
    relationship: "Mother",
    contactNumber: "0919-880-3341",
    carrier: "Smart Communications",
    alertType: "Unexcused Absence",
    timestamp: "2026-09-02 01:30 PM",
    date: "2026-09-02",
    status: "Delivered",
    messageBody: "BCP AMS Notice: Student Christian Paul Castro (BSCS 2A) was marked UNEXCUSED ABSENT for CS201 on Sept 02, 2026. - Bestlink College"
  },
  {
    id: "ALT-2026-012",
    studentId: "2024-00772",
    studentName: "Bea Patricia Flores",
    section: "BSIT 3A",
    subject: "IT301 - Web Development",
    parentName: "Eduardo Flores",
    relationship: "Father",
    contactNumber: "0995-112-4490",
    carrier: "Globe Telecom",
    alertType: "Excuse Approved",
    timestamp: "2026-09-01 09:10 AM",
    date: "2026-09-01",
    status: "Delivered",
    messageBody: "BCP AMS Update: The excuse slip submitted for Bea Patricia Flores (BSIT 3A) for absence date Aug 28 has been APPROVED. - BCP"
  }
];

// ==========================================================================
// STATE MANAGEMENT & CLIENT-SIDE CONTROLS
// ==========================================================================

let filteredAlerts = [...alertsData];
let currentPage = 1;
const itemsPerPage = 7;
let selectedAlertForResend = null;
let currentPreviewAlert = null;

// ==========================================================================
// INITIALIZATION
// ==========================================================================

document.addEventListener('DOMContentLoaded', function () {
  initEventListeners();
  updateKPIs();
  renderAlertsTable();
});

function initEventListeners() {
  // Search Input
  const searchInput = document.getElementById('alertsSearchInput');
  if (searchInput) {
    searchInput.addEventListener('input', function () {
      applyFilters();
    });
  }

  // Quick Section Dropdown Filter
  const sectionFilter = document.getElementById('sectionQuickFilter');
  if (sectionFilter) {
    sectionFilter.addEventListener('change', function () {
      const modalSec = document.getElementById('modalFilterSection');
      if (modalSec) modalSec.value = this.value;
      applyFilters();
    });
  }
}

// ==========================================================================
// KPI STATS CALCULATION
// ==========================================================================

function updateKPIs() {
  const total = alertsData.length;
  const delivered = alertsData.filter(a => a.status === 'Delivered').length;
  const pending = alertsData.filter(a => a.status === 'Pending').length;
  const failed = alertsData.filter(a => a.status === 'Failed').length;

  const totalEl = document.getElementById('totalAlertsKpi');
  const deliveredEl = document.getElementById('deliveredKpi');
  const pendingEl = document.getElementById('pendingKpi');
  const failedEl = document.getElementById('failedKpi');
  const rateTextEl = document.getElementById('deliveryRateText');

  if (totalEl) totalEl.textContent = (336 + total).toString();
  if (deliveredEl) deliveredEl.textContent = (322 + delivered).toString();
  if (pendingEl) pendingEl.textContent = pending.toString();
  if (failedEl) failedEl.textContent = failed.toString();

  const rate = total > 0 ? ((delivered / total) * 100).toFixed(1) : "0.0";
  if (rateTextEl) rateTextEl.textContent = `${rate}% Delivery Rate`;
}

// ==========================================================================
// FILTER LOGIC & RENDERING
// ==========================================================================

function applyFilters() {
  const query = (document.getElementById('alertsSearchInput')?.value || '').toLowerCase().trim();
  const section = document.getElementById('sectionQuickFilter')?.value || 'ALL';
  const alertType = document.getElementById('modalFilterType')?.value || 'ALL';
  const status = document.getElementById('modalFilterStatus')?.value || 'ALL';
  const dateFilter = document.getElementById('modalFilterDate')?.value || '';

  filteredAlerts = alertsData.filter(item => {
    // Search Query
    const matchQuery = !query ||
      item.studentName.toLowerCase().includes(query) ||
      item.studentId.toLowerCase().includes(query) ||
      item.parentName.toLowerCase().includes(query) ||
      item.contactNumber.includes(query) ||
      item.section.toLowerCase().includes(query) ||
      item.subject.toLowerCase().includes(query);

    // Section
    const matchSection = section === 'ALL' || item.section === section;

    // Alert Type
    let matchType = true;
    if (alertType !== 'ALL') {
      if (alertType === 'Late Advisory') matchType = item.alertType === 'Late Advisory';
      else if (alertType === 'Unexcused Absence') matchType = item.alertType === 'Unexcused Absence';
      else if (alertType === 'Excuse Approved') matchType = item.alertType === 'Excuse Approved';
      else if (alertType === 'Excuse Rejected') matchType = item.alertType === 'Excuse Rejected';
      else if (alertType === 'Daily Roll Call') matchType = item.alertType === 'Daily Roll Call';
    }

    // Status
    const matchStatus = status === 'ALL' || item.status === status;

    // Date
    const matchDate = !dateFilter || item.date === dateFilter;

    return matchQuery && matchSection && matchType && matchStatus && matchDate;
  });

  currentPage = 1;
  renderActiveFilterBadges();
  renderAlertsTable();
}

function renderActiveFilterBadges() {
  const container = document.getElementById('activeFiltersContainer');
  const badgesContainer = document.getElementById('activeFilterBadges');
  if (!container || !badgesContainer) return;

  const section = document.getElementById('sectionQuickFilter')?.value || 'ALL';
  const alertType = document.getElementById('modalFilterType')?.value || 'ALL';
  const status = document.getElementById('modalFilterStatus')?.value || 'ALL';
  const dateFilter = document.getElementById('modalFilterDate')?.value || '';

  const active = [];
  if (section !== 'ALL') active.push({ key: 'section', label: `Section: ${section}` });
  if (alertType !== 'ALL') active.push({ key: 'type', label: `Type: ${alertType}` });
  if (status !== 'ALL') active.push({ key: 'status', label: `Status: ${status}` });
  if (dateFilter) active.push({ key: 'date', label: `Date: ${dateFilter}` });

  if (active.length === 0) {
    container.classList.add('hidden');
    badgesContainer.innerHTML = '';
  } else {
    container.classList.remove('hidden');
    badgesContainer.innerHTML = active.map(f => `
      <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#eff6ff] text-[#0030c2] text-[11px] font-semibold border border-[#bfdbfe]">
        ${f.label}
        <button onclick="removeFilter('${f.key}')" class="hover:text-red-600 cursor-pointer ml-0.5">&times;</button>
      </span>
    `).join('');
  }
}

function removeFilter(key) {
  if (key === 'section') {
    const s = document.getElementById('sectionQuickFilter');
    const ms = document.getElementById('modalFilterSection');
    if (s) s.value = 'ALL';
    if (ms) ms.value = 'ALL';
  } else if (key === 'type') {
    const t = document.getElementById('modalFilterType');
    if (t) t.value = 'ALL';
  } else if (key === 'status') {
    const st = document.getElementById('modalFilterStatus');
    if (st) st.value = 'ALL';
  } else if (key === 'date') {
    const d = document.getElementById('modalFilterDate');
    if (d) d.value = '';
  }
  applyFilters();
}

function resetAllFilters() {
  const search = document.getElementById('alertsSearchInput');
  const s = document.getElementById('sectionQuickFilter');
  const ms = document.getElementById('modalFilterSection');
  const t = document.getElementById('modalFilterType');
  const st = document.getElementById('modalFilterStatus');
  const d = document.getElementById('modalFilterDate');

  if (search) search.value = '';
  if (s) s.value = 'ALL';
  if (ms) ms.value = 'ALL';
  if (t) t.value = 'ALL';
  if (st) st.value = 'ALL';
  if (d) d.value = '';

  applyFilters();
  showToast("All filters have been reset", "info");
}

// ==========================================================================
// TABLE RENDERING & PAGINATION
// ==========================================================================

function renderAlertsTable() {
  const tbody = document.getElementById('alertsTableBody');
  const countBadge = document.getElementById('alertsRecordCountBadge');
  const showingCount = document.getElementById('showingAlertsCount');
  if (!tbody) return;

  const total = filteredAlerts.length;
  if (countBadge) countBadge.textContent = `${total} Records`;

  if (total === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" class="py-12 text-center text-[#6b7280]">
          <div class="flex flex-col items-center justify-center gap-2">
            <svg class="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
            <p class="font-semibold text-sm text-[#111827]">No parent alerts found</p>
            <p class="text-xs">Try adjusting your search criteria or active filters.</p>
          </div>
        </td>
      </tr>
    `;
    if (showingCount) showingCount.innerHTML = `Showing <span class="font-semibold text-[#111827]">0</span> of <span class="font-semibold text-[#111827]">0</span> records`;
    renderPagination(0);
    return;
  }

  const totalPages = Math.ceil(total / itemsPerPage);
  if (currentPage > totalPages) currentPage = totalPages;
  if (currentPage < 1) currentPage = 1;

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, total);
  const pageItems = filteredAlerts.slice(startIndex, endIndex);

  if (showingCount) {
    showingCount.innerHTML = `Showing <span class="font-semibold text-[#111827]">${startIndex + 1}</span> to <span class="font-semibold text-[#111827]">${endIndex}</span> of <span class="font-semibold text-[#111827]">${total}</span> records`;
  }

  tbody.innerHTML = pageItems.map(item => {
    // Initial avatar letters
    const initials = item.studentName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

    // Alert Type Badge Styles
    let typeBadgeClass = "bg-blue-50 text-blue-700 border-blue-200";
    if (item.alertType.includes("Late")) typeBadgeClass = "bg-amber-50 text-amber-700 border-amber-200";
    else if (item.alertType.includes("Absence")) typeBadgeClass = "bg-rose-50 text-rose-700 border-rose-200";
    else if (item.alertType.includes("Approved")) typeBadgeClass = "bg-emerald-50 text-emerald-700 border-emerald-200";
    else if (item.alertType.includes("Rejected")) typeBadgeClass = "bg-red-50 text-red-700 border-red-200";

    // Delivery Status Badge
    let statusBadge = `
      <span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
        <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Delivered
      </span>
    `;
    if (item.status === 'Pending') {
      statusBadge = `
        <span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
          <span class="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span> Pending
        </span>
      `;
    } else if (item.status === 'Failed') {
      statusBadge = `
        <span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
          <span class="w-1.5 h-1.5 rounded-full bg-rose-500"></span> Failed
        </span>
      `;
    }

    return `
      <tr class="hover:bg-[#f8fafc] transition-colors">
        <!-- Student -->
        <td class="py-3 px-4">
          <div class="flex items-center gap-2.5">
            <div class="w-7 h-7 rounded-full bg-[#e7edff] text-[#0030c2] font-bold text-xs flex items-center justify-center shrink-0">
              ${initials}
            </div>
            <div class="min-w-0">
              <p class="font-bold text-[#111827] truncate">${item.studentName}</p>
              <p class="text-[11px] text-[#6b7280] font-mono">${item.studentId}</p>
            </div>
          </div>
        </td>

        <!-- Section / Subject -->
        <td class="py-3 px-4">
          <span class="font-semibold text-[#111827] block truncate">${item.section}</span>
          <span class="text-[10px] text-[#6b7280] truncate block">${item.subject}</span>
        </td>

        <!-- Parent Info -->
        <td class="py-3 px-4">
          <p class="font-semibold text-[#111827] truncate">${item.parentName} <span class="text-[10px] text-[#6b7280] font-normal">(${item.relationship})</span></p>
          <p class="text-[11px] text-[#0030c2] font-mono">${item.contactNumber}</p>
        </td>

        <!-- Alert Type -->
        <td class="py-3 px-4">
          <span class="inline-block px-2 py-0.5 rounded text-[11px] font-semibold border ${typeBadgeClass}">
            ${item.alertType}
          </span>
        </td>

        <!-- Timestamp -->
        <td class="py-3 px-4 text-[#6b7280] font-medium whitespace-nowrap">
          ${item.timestamp}
        </td>

        <!-- Status -->
        <td class="py-3 px-4 whitespace-nowrap">
          ${statusBadge}
        </td>

        <!-- Actions -->
        <td class="py-3 px-4 text-center whitespace-nowrap">
          <div class="flex items-center justify-center gap-1.5">
            <button onclick="openSmsPreviewModal('${item.id}')"
              class="p-1.5 text-[#0030c2] hover:bg-[#e7edff] rounded-lg transition-colors cursor-pointer"
              title="View SMS Message">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
            <button onclick="openResendModal('${item.id}')"
              class="p-1.5 text-gray-600 hover:text-[#0030c2] hover:bg-[#e7edff] rounded-lg transition-colors cursor-pointer"
              title="Resend SMS Notification">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
              </svg>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');

  renderPagination(totalPages);
}

function renderPagination(totalPages) {
  const container = document.getElementById('pageButtonsContainer');
  const prevBtn = document.getElementById('prevPageBtn');
  const nextBtn = document.getElementById('nextPageBtn');

  if (prevBtn) prevBtn.disabled = currentPage <= 1;
  if (nextBtn) nextBtn.disabled = currentPage >= totalPages || totalPages === 0;

  if (!container) return;
  if (totalPages <= 1) {
    container.innerHTML = `<span class="w-7 h-7 rounded-lg bg-[#0030c2] text-white flex items-center justify-center font-bold text-xs">1</span>`;
    return;
  }

  let html = '';
  for (let p = 1; p <= totalPages; p++) {
    if (p === currentPage) {
      html += `<span class="w-7 h-7 rounded-lg bg-[#0030c2] text-white flex items-center justify-center font-bold text-xs">${p}</span>`;
    } else {
      html += `<button onclick="goToPage(${p})" class="w-7 h-7 rounded-lg hover:bg-gray-100 text-[#374151] flex items-center justify-center font-semibold text-xs transition-colors cursor-pointer">${p}</button>`;
    }
  }
  container.innerHTML = html;
}

function changePage(delta) {
  currentPage += delta;
  renderAlertsTable();
}

function goToPage(page) {
  currentPage = page;
  renderAlertsTable();
}

// ==========================================================================
// SMS PREVIEW MODAL
// ==========================================================================

function openSmsPreviewModal(alertId) {
  const item = alertsData.find(a => a.id === alertId);
  if (!item) return;

  currentPreviewAlert = item;

  document.getElementById('previewStudentName').textContent = item.studentName;
  document.getElementById('previewStudentId').textContent = `${item.studentId} · ${item.section}`;
  document.getElementById('previewParentName').textContent = `${item.parentName} (${item.relationship})`;
  document.getElementById('previewParentContact').textContent = item.contactNumber;
  document.getElementById('previewAlertType').textContent = item.alertType;
  document.getElementById('previewTimestamp').textContent = item.timestamp;
  document.getElementById('previewMessageBody').textContent = item.messageBody;
  document.getElementById('previewCharCount').textContent = `${item.messageBody.length} chars · 1 SMS segment`;
  document.getElementById('previewCarrier').innerHTML = `Carrier: <strong>${item.carrier}</strong>`;

  const statusBadge = document.getElementById('previewDeliveryStatusBadge');
  if (statusBadge) {
    statusBadge.textContent = item.status.toUpperCase();
    if (item.status === 'Delivered') {
      statusBadge.className = "font-bold text-emerald-600";
    } else if (item.status === 'Pending') {
      statusBadge.className = "font-bold text-amber-500";
    } else {
      statusBadge.className = "font-bold text-rose-600";
    }
  }

  document.getElementById('smsPreviewModal')?.classList.remove('hidden');
}

function closeSmsPreviewModal() {
  document.getElementById('smsPreviewModal')?.classList.add('hidden');
  currentPreviewAlert = null;
}

function triggerResendFromPreview() {
  if (currentPreviewAlert) {
    const alertId = currentPreviewAlert.id;
    closeSmsPreviewModal();
    openResendModal(alertId);
  }
}

// ==========================================================================
// RESEND ALERT MODAL & LOGIC
// ==========================================================================

function openResendModal(alertId) {
  const item = alertsData.find(a => a.id === alertId);
  if (!item) return;

  selectedAlertForResend = item;

  const titleEl = document.getElementById('resendModalTitle');
  const descEl = document.getElementById('resendModalDesc');

  if (titleEl) titleEl.textContent = `Resend SMS to ${item.parentName}?`;
  if (descEl) {
    descEl.textContent = `An automated ${item.alertType} SMS will be immediately dispatched to ${item.contactNumber} (${item.studentName}).`;
  }

  document.getElementById('resendAlertModal')?.classList.remove('hidden');
}

function openBatchResendModal() {
  const failedList = filteredAlerts.filter(a => a.status === 'Failed');
  if (failedList.length === 0) {
    showToast("No failed SMS alerts found in the current selection", "info");
    return;
  }

  selectedAlertForResend = 'BATCH_FAILED';

  const titleEl = document.getElementById('resendModalTitle');
  const descEl = document.getElementById('resendModalDesc');

  if (titleEl) titleEl.textContent = `Batch Resend ${failedList.length} Failed Alerts?`;
  if (descEl) {
    descEl.textContent = `This will re-dispatch all currently failed SMS notifications (${failedList.length} recipients) through the cellular gateway.`;
  }

  document.getElementById('resendAlertModal')?.classList.remove('hidden');
}

function closeResendModal() {
  document.getElementById('resendAlertModal')?.classList.add('hidden');
  selectedAlertForResend = null;
}

function executeResend() {
  if (!selectedAlertForResend) return;

  const btn = document.getElementById('confirmResendBtn');
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = `<span class="inline-block animate-spin mr-1">&#9696;</span> Sending...`;
  }

  setTimeout(() => {
    if (selectedAlertForResend === 'BATCH_FAILED') {
      let count = 0;
      alertsData.forEach(item => {
        if (item.status === 'Failed') {
          item.status = 'Delivered';
          item.timestamp = new Date().toLocaleString('en-US', {
            year: 'numeric', month: '2-digit', day: '2-digit',
            hour: '2-digit', minute: '2-digit', hour12: true
          });
          count++;
        }
      });
      showToast(`Successfully re-dispatched ${count} SMS alerts!`, "success");
    } else {
      const item = selectedAlertForResend;
      item.status = 'Delivered';
      item.timestamp = new Date().toLocaleString('en-US', {
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', hour12: true
      });
      showToast(`SMS alert re-sent successfully to ${item.parentName}!`, "success");
    }

    if (btn) {
      btn.disabled = false;
      btn.textContent = "Confirm Resend";
    }

    closeResendModal();
    updateKPIs();
    applyFilters();
  }, 700);
}

// ==========================================================================
// ADVANCED FILTER MODAL
// ==========================================================================

function openFilterModal() {
  const modal = document.getElementById('filterModal');
  if (!modal) return;

  const quickSection = document.getElementById('sectionQuickFilter')?.value || 'ALL';
  const modalSec = document.getElementById('modalFilterSection');
  if (modalSec) modalSec.value = quickSection;

  modal.classList.remove('hidden');
}

function closeFilterModal() {
  document.getElementById('filterModal')?.classList.add('hidden');
}

function resetFilterModalForm() {
  const ms = document.getElementById('modalFilterSection');
  const t = document.getElementById('modalFilterType');
  const st = document.getElementById('modalFilterStatus');
  const d = document.getElementById('modalFilterDate');

  if (ms) ms.value = 'ALL';
  if (t) t.value = 'ALL';
  if (st) st.value = 'ALL';
  if (d) d.value = '';
}

function applyFiltersFromModal() {
  const modalSec = document.getElementById('modalFilterSection')?.value || 'ALL';
  const quickSec = document.getElementById('sectionQuickFilter');
  if (quickSec) quickSec.value = modalSec;

  closeFilterModal();
  applyFilters();
  showToast("Filters applied successfully", "success");
}

// ==========================================================================
// EXPORT MODAL & REPORT DOWNLOAD
// ==========================================================================

function openExportModal() {
  document.getElementById('exportModal')?.classList.remove('hidden');
}

function closeExportModal() {
  document.getElementById('exportModal')?.classList.add('hidden');
}

function updateExportFormatSelection(input) {
  document.querySelectorAll('.export-format-card').forEach(card => {
    card.classList.remove('border-2', 'border-[#0030c2]', 'bg-[#eff6ff]');
    card.classList.add('border', 'border-[#e5e7eb]');
    const title = card.querySelector('.export-card-title');
    if (title) title.className = "font-bold text-[#374151] export-card-title";
  });

  const parent = input.closest('.export-format-card');
  if (parent) {
    parent.classList.remove('border', 'border-[#e5e7eb]');
    parent.classList.add('border-2', 'border-[#0030c2]', 'bg-[#eff6ff]');
    const title = parent.querySelector('.export-card-title');
    if (title) title.className = "font-bold text-[#0030c2] export-card-title";
  }

  const submitText = document.getElementById('exportSubmitBtnText');
  if (submitText) {
    submitText.textContent = `Download ${input.value}`;
  }
}

function handleExportSubmit(e) {
  e.preventDefault();
  const format = document.querySelector('input[name="exportFormat"]:checked')?.value || 'CSV';
  const section = document.getElementById('exportSection')?.value || 'ALL';
  const startDate = document.getElementById('exportStartDate')?.value || '2026-09-01';
  const endDate = document.getElementById('exportEndDate')?.value || '2026-09-05';

  const exportData = filteredAlerts.filter(a => section === 'ALL' || a.section === section);

  if (format === 'CSV') {
    const headers = ["Alert ID", "Student ID", "Student Name", "Section", "Subject", "Parent Name", "Relationship", "Contact", "Carrier", "Alert Type", "Timestamp", "Status"];
    const rows = exportData.map(d => [
      `"${d.id}"`,
      `"${d.studentId}"`,
      `"${d.studentName}"`,
      `"${d.section}"`,
      `"${d.subject}"`,
      `"${d.parentName}"`,
      `"${d.relationship}"`,
      `"${d.contactNumber}"`,
      `"${d.carrier}"`,
      `"${d.alertType}"`,
      `"${d.timestamp}"`,
      `"${d.status}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `BCP_Parent_Alerts_${section}_${startDate}_to_${endDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } else if (format === 'Excel') {
    // Basic Excel XML spreadsheet export
    const xmlHeader = '<?xml version="1.0"?><?mso-application progid="Excel.Sheet"?><Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"><Worksheet ss:Name="ParentAlerts"><Table>';
    const xmlFooter = '</Table></Worksheet></Workbook>';
    const headerRow = '<Row>' + ["Alert ID", "Student Name", "Section", "Parent Name", "Contact", "Alert Type", "Timestamp", "Status"].map(h => `<Cell><Data ss:Type="String">${h}</Data></Cell>`).join('') + '</Row>';
    const dataRows = exportData.map(d => '<Row>' + [d.id, d.studentName, d.section, d.parentName, d.contactNumber, d.alertType, d.timestamp, d.status].map(v => `<Cell><Data ss:Type="String">${v}</Data></Cell>`).join('') + '</Row>').join('');
    
    const blob = new Blob([xmlHeader + headerRow + dataRows + xmlFooter], { type: "application/vnd.ms-excel" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `BCP_Parent_Alerts_${section}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  closeExportModal();
  showToast(`Exported ${exportData.length} records as ${format}!`, "success");
}

// ==========================================================================
// TOAST NOTIFICATIONS HELPER
// ==========================================================================

function showToast(message, type = "info") {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  const bgColor = type === 'success' ? 'bg-emerald-600' : type === 'error' ? 'bg-rose-600' : 'bg-[#1e293b]';

  toast.className = `${bgColor} text-white px-4 py-2.5 rounded-xl shadow-lg text-xs font-semibold flex items-center gap-2 pointer-events-auto transform translate-y-2 opacity-0 transition-all duration-200`;
  toast.innerHTML = `
    <span>${message}</span>
  `;

  container.appendChild(toast);

  // Trigger enter animation
  setTimeout(() => {
    toast.classList.remove('translate-y-2', 'opacity-0');
  }, 10);

  // Auto dismiss
  setTimeout(() => {
    toast.classList.add('translate-y-2', 'opacity-0');
    setTimeout(() => {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 200);
  }, 3000);
}

// Expose globals for inline event handlers
window.openSmsPreviewModal = openSmsPreviewModal;
window.closeSmsPreviewModal = closeSmsPreviewModal;
window.triggerResendFromPreview = triggerResendFromPreview;
window.openResendModal = openResendModal;
window.openBatchResendModal = openBatchResendModal;
window.closeResendModal = closeResendModal;
window.executeResend = executeResend;
window.openFilterModal = openFilterModal;
window.closeFilterModal = closeFilterModal;
window.resetFilterModalForm = resetFilterModalForm;
window.applyFiltersFromModal = applyFiltersFromModal;
window.removeFilter = removeFilter;
window.resetAllFilters = resetAllFilters;
window.openExportModal = openExportModal;
window.closeExportModal = closeExportModal;
window.updateExportFormatSelection = updateExportFormatSelection;
window.handleExportSubmit = handleExportSubmit;
window.changePage = changePage;
window.goToPage = goToPage;
