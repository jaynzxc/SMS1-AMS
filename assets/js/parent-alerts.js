// assets/js/parent-alerts.js
// Parent Alerts Monitoring Logic & Interactivity

// Sample Alerts Data (Initialized with records matching design specs)
const ALERTS_DATA = [
    {
        id: "ALT-2026-001",
        studentId: "2026-1001",
        studentName: "Santos, Maria",
        section: "Grade 10 - A",
        parentName: "Rosa Santos",
        relationship: "Mother",
        contactNumber: "0917-123-4567",
        alertType: "Absent",
        dateSent: "July 25, 2026",
        timeSent: "7:35 AM",
        fullDate: "2026-07-25",
        status: "Sent",
        gateway: "Semaphore SMS Gateway (Route 1)",
        cost: "₱0.50",
        message: "SMS Advisory: Maria Santos (2026-1001) has been marked ABSENT on July 25, 2026. If this is an excused absence, please submit an excuse slip within 48 hours."
    },
    {
        id: "ALT-2026-002",
        studentId: "2026-1002",
        studentName: "Garcia, Juan",
        section: "Grade 10 - A",
        parentName: "Luis Garcia",
        relationship: "Father",
        contactNumber: "0998-765-4321",
        alertType: "Late",
        dateSent: "July 25, 2026",
        timeSent: "7:28 AM",
        fullDate: "2026-07-25",
        status: "Sent",
        gateway: "Semaphore SMS Gateway (Route 1)",
        cost: "₱0.50",
        message: "SMS Advisory: Juan Garcia (2026-1002) was logged IN at 7:28 AM on July 25, 2026 and marked TARDY (13 minutes delayed). Please ensure prompt arrival."
    },
    {
        id: "ALT-2026-003",
        studentId: "2026-1003",
        studentName: "Reyes, Anna",
        section: "Grade 10 - B",
        parentName: "Elena Reyes",
        relationship: "Mother",
        contactNumber: "0916-555-7890",
        alertType: "Excuse Approved",
        dateSent: "July 24, 2026",
        timeSent: "4:32 PM",
        fullDate: "2026-07-24",
        status: "Sent",
        gateway: "Semaphore SMS Gateway (Route 2)",
        cost: "₱0.50",
        message: "SMS Notification: The excuse slip submitted for Anna Reyes (2026-1003) for July 24, 2026 has been APPROVED by the Administration."
    },
    {
        id: "ALT-2026-004",
        studentId: "2026-1004",
        studentName: "Dela Cruz, John",
        section: "Grade 10 - A",
        parentName: "Mario Dela Cruz",
        relationship: "Father",
        contactNumber: "0905-222-3344",
        alertType: "Excuse Rejected",
        dateSent: "July 24, 2026",
        timeSent: "3:15 PM",
        fullDate: "2026-07-24",
        status: "Sent",
        gateway: "Semaphore SMS Gateway (Route 2)",
        cost: "₱0.50",
        message: "SMS Notification: The excuse slip submitted for John Dela Cruz (2026-1004) has been REJECTED. Reason: Medical certificate is missing or invalid."
    },
    {
        id: "ALT-2026-005",
        studentId: "2026-1005",
        studentName: "Rivera, Luis",
        section: "Grade 10 - B",
        parentName: "Ana Rivera",
        relationship: "Mother",
        contactNumber: "0912-888-6677",
        alertType: "Late",
        dateSent: "July 24, 2026",
        timeSent: "7:40 AM",
        fullDate: "2026-07-24",
        status: "Failed",
        gateway: "Semaphore SMS Gateway (Route 1)",
        cost: "₱0.00 (Failed)",
        failureReason: "Network timeout / Recipient subscriber unreachable",
        message: "SMS Advisory: Luis Rivera (2026-1005) was logged IN at 7:40 AM on July 24, 2026 and marked TARDY (25 minutes delayed)."
    },
    {
        id: "ALT-2026-006",
        studentId: "2026-1006",
        studentName: "Lim, Cristine",
        section: "Grade 9 - A",
        parentName: "Mark Lim",
        relationship: "Father",
        contactNumber: "0933-777-8899",
        alertType: "Absent",
        dateSent: "July 23, 2026",
        timeSent: "8:05 AM",
        fullDate: "2026-07-23",
        status: "Sent",
        gateway: "Semaphore SMS Gateway (Route 1)",
        cost: "₱0.50",
        message: "SMS Advisory: Cristine Lim (2026-1006) has been marked ABSENT on July 23, 2026. Please submit documentation or contact the adviser."
    },
    {
        id: "ALT-2026-007",
        studentId: "2026-1007",
        studentName: "Torres, Janice",
        section: "Grade 9 - B",
        parentName: "Nicole Torres",
        relationship: "Mother",
        contactNumber: "0918-444-2211",
        alertType: "Excuse Approved",
        dateSent: "July 23, 2026",
        timeSent: "5:10 PM",
        fullDate: "2026-07-23",
        status: "Sent",
        gateway: "Semaphore SMS Gateway (Route 2)",
        cost: "₱0.50",
        message: "SMS Notification: The excuse slip submitted for Janice Torres (2026-1007) for July 23, 2026 has been APPROVED by the Administration."
    },
    {
        id: "ALT-2026-008",
        studentId: "2026-1008",
        studentName: "Bautista, Gabriel",
        section: "Grade 8 - A",
        parentName: "Ramon Bautista",
        relationship: "Father",
        contactNumber: "0921-998-1122",
        alertType: "Absent",
        dateSent: "July 23, 2026",
        timeSent: "7:50 AM",
        fullDate: "2026-07-23",
        status: "Sent",
        gateway: "Semaphore SMS Gateway (Route 1)",
        cost: "₱0.50",
        message: "SMS Advisory: Gabriel Bautista (2026-1008) has been marked ABSENT on July 23, 2026."
    }
];

let currentAlertsList = [...ALERTS_DATA];
let selectedAlertForAction = null;

// Filter state
let activeFilters = {
    search: '',
    alertType: 'All',
    status: 'All',
    startDate: '2026-07-01',
    endDate: '2026-07-31'
};

// =============================================================
// DOM INITIALIZATION
// =============================================================
document.addEventListener('DOMContentLoaded', () => {
    renderAlertsTable(currentAlertsList);
    setupSearchInput();
});

// Setup instant search input in table header
function setupSearchInput() {
    const searchInput = document.getElementById('alertsSearch');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            activeFilters.search = e.target.value.toLowerCase().trim();
            filterAndRender();
        });
    }
}

// =============================================================
// FILTER MODAL CONTROLS
// =============================================================
function openFilterModal() {
    // Populate modal inputs with current active filter state
    const alertTypeSelect = document.getElementById('modalFilterAlertType');
    const statusSelect = document.getElementById('modalFilterStatus');
    const startDateInput = document.getElementById('modalFilterStartDate');
    const endDateInput = document.getElementById('modalFilterEndDate');

    if (alertTypeSelect) alertTypeSelect.value = activeFilters.alertType;
    if (statusSelect) statusSelect.value = activeFilters.status;
    if (startDateInput) startDateInput.value = activeFilters.startDate;
    if (endDateInput) endDateInput.value = activeFilters.endDate;

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

function applyAlertFilters() {
    const alertTypeSelect = document.getElementById('modalFilterAlertType');
    const statusSelect = document.getElementById('modalFilterStatus');
    const startDateInput = document.getElementById('modalFilterStartDate');
    const endDateInput = document.getElementById('modalFilterEndDate');

    if (alertTypeSelect) activeFilters.alertType = alertTypeSelect.value;
    if (statusSelect) activeFilters.status = statusSelect.value;
    if (startDateInput) activeFilters.startDate = startDateInput.value;
    if (endDateInput) activeFilters.endDate = endDateInput.value;

    closeFilterModal();
    filterAndRender();
    showToast('Filters Applied', `Showing ${currentAlertsList.length} filtered records`, 'info');
}

function resetAlertFilters() {
    activeFilters = {
        search: '',
        alertType: 'All',
        status: 'All',
        startDate: '2026-07-01',
        endDate: '2026-07-31'
    };

    const searchInput = document.getElementById('alertsSearch');
    if (searchInput) searchInput.value = '';

    const alertTypeSelect = document.getElementById('modalFilterAlertType');
    const statusSelect = document.getElementById('modalFilterStatus');
    const startDateInput = document.getElementById('modalFilterStartDate');
    const endDateInput = document.getElementById('modalFilterEndDate');

    if (alertTypeSelect) alertTypeSelect.value = 'All';
    if (statusSelect) statusSelect.value = 'All';
    if (startDateInput) startDateInput.value = '2026-07-01';
    if (endDateInput) endDateInput.value = '2026-07-31';

    closeFilterModal();
    filterAndRender();
    showToast('Filters Reset', 'All filter options cleared to default view', 'info');
}

function filterAndRender() {
    currentAlertsList = ALERTS_DATA.filter(item => {
        // Search query match
        const matchesSearch = !activeFilters.search || 
            item.studentName.toLowerCase().includes(activeFilters.search) ||
            item.studentId.toLowerCase().includes(activeFilters.search) ||
            item.parentName.toLowerCase().includes(activeFilters.search) ||
            item.contactNumber.includes(activeFilters.search);

        // Alert type match
        const matchesType = (activeFilters.alertType === 'All' || activeFilters.alertType === 'All Types') || 
            item.alertType.toLowerCase() === activeFilters.alertType.toLowerCase();

        // Status match
        const matchesStatus = (activeFilters.status === 'All' || activeFilters.status === 'All Status') || 
            item.status.toLowerCase() === activeFilters.status.toLowerCase();

        // Date range match
        let matchesDate = true;
        if (activeFilters.startDate && item.fullDate < activeFilters.startDate) matchesDate = false;
        if (activeFilters.endDate && item.fullDate > activeFilters.endDate) matchesDate = false;

        return matchesSearch && matchesType && matchesStatus && matchesDate;
    });

    renderAlertsTable(currentAlertsList);
}

// =============================================================
// RENDER TABLE
// =============================================================
function renderAlertsTable(data) {
    const tbody = document.getElementById('alertsTableBody');
    const recordCountBadge = document.getElementById('alertsRecordCount');
    const showingCountSpan = document.getElementById('showingAlertsCount');

    if (recordCountBadge) recordCountBadge.textContent = data.length > 7 ? '1,248 Records' : `${data.length} Records`;
    if (showingCountSpan) showingCountSpan.innerHTML = `Showing <span class="font-semibold text-[#111827]">1</span> to <span class="font-semibold text-[#111827]">${data.length}</span> of <span class="font-semibold text-[#111827]">1,248</span> records`;

    if (!tbody) return;

    if (data.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="py-10 text-center text-gray-500">
                    <div class="flex flex-col items-center justify-center">
                        <svg class="w-10 h-10 text-gray-300 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p class="font-semibold text-sm text-[#111827]">No matching parent alerts found</p>
                        <p class="text-xs text-[#6b7280] mt-0.5">Try resetting filter criteria or adjusting search keywords</p>
                    </div>
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = data.map(item => {
        // Alert Type styling
        let typeBadgeClass = "bg-gray-100 text-gray-700";
        if (item.alertType === "Absent") {
            typeBadgeClass = "bg-red-50 text-red-600 border border-red-200/50";
        } else if (item.alertType === "Late") {
            typeBadgeClass = "bg-amber-50 text-amber-600 border border-amber-200/50";
        } else if (item.alertType === "Excuse Approved") {
            typeBadgeClass = "bg-emerald-50 text-emerald-600 border border-emerald-200/50";
        } else if (item.alertType === "Excuse Rejected") {
            typeBadgeClass = "bg-rose-50 text-rose-600 border border-rose-200/50";
        }

        // Status badge styling
        let statusBadgeClass = item.status === "Sent" 
            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
            : "bg-red-50 text-red-700 border border-red-200";

        return `
            <tr class="hover:bg-[#f9fafb] transition-colors border-b border-[#f3f4f6] text-xs">
                <!-- Student -->
                <td class="py-3 px-4">
                    <div class="flex items-center gap-2.5">
                        <div class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center shrink-0 text-gray-500">
                            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 12a4.5 4.5 0 100-9 4.5 4.5 0 000 9zM4 20.5c0-3.59 3.58-6.5 8-6.5s8 2.91 8 6.5V21H4v-.5z"/>
                            </svg>
                        </div>
                        <div>
                            <p class="font-bold text-[#111827]">${item.studentName}</p>
                            <p class="text-[11px] text-[#6b7280] font-mono">${item.studentId}</p>
                        </div>
                    </div>
                </td>

                <!-- Parent -->
                <td class="py-3 px-4">
                    <p class="font-medium text-[#111827]">${item.parentName}</p>
                    <p class="text-[11px] text-[#6b7280]">${item.relationship}</p>
                </td>

                <!-- Contact Number -->
                <td class="py-3 px-4 font-mono font-medium text-[#4b5563]">
                    ${item.contactNumber}
                </td>

                <!-- Alert Type -->
                <td class="py-3 px-4">
                    <span class="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold ${typeBadgeClass}">
                        ${item.alertType}
                    </span>
                </td>

                <!-- Date Sent -->
                <td class="py-3 px-4 text-[#4b5563]">
                    <p class="font-medium text-[#111827]">${item.dateSent}</p>
                    <p class="text-[11px] text-[#6b7280]">${item.timeSent}</p>
                </td>

                <!-- Status -->
                <td class="py-3 px-4">
                    <span class="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold ${statusBadgeClass}">
                        ${item.status}
                    </span>
                </td>

                <!-- Actions -->
                <td class="py-3 px-4 text-center">
                    <div class="flex items-center justify-center gap-1.5">
                        <button onclick="triggerResendAlert('${item.id}')" class="p-1.5 text-[#2563eb] hover:bg-blue-50 rounded-lg transition-colors inline-flex items-center justify-center" title="Resend Notification">
                            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                            </svg>
                        </button>
                        <button onclick="openViewAlertModal('${item.id}')" class="p-1.5 text-[#2563eb] hover:bg-blue-50 rounded-lg transition-colors inline-flex items-center justify-center" title="View Alert Details">
                            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638-0-8.573-3.007-9.963-7.178z" />
                                <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

// =============================================================
// VIEW ALERT DETAILS MODAL
// =============================================================
function openViewAlertModal(alertId) {
    const alert = ALERTS_DATA.find(a => a.id === alertId);
    if (!alert) return;

    selectedAlertForAction = alert;

    // Fill modal fields
    document.getElementById('detailStudentName').textContent = alert.studentName;
    document.getElementById('detailStudentId').textContent = alert.studentId;
    document.getElementById('detailStudentSection').textContent = alert.section;
    document.getElementById('detailParentName').textContent = `${alert.parentName} (${alert.relationship})`;
    document.getElementById('detailContactNumber').textContent = alert.contactNumber;
    document.getElementById('detailDateSent').textContent = `${alert.dateSent} at ${alert.timeSent}`;
    document.getElementById('detailGateway').textContent = alert.gateway;
    document.getElementById('detailMessagePreview').textContent = alert.message;

    // Type Badge
    const typeBadge = document.getElementById('detailAlertTypeBadge');
    typeBadge.textContent = alert.alertType;
    typeBadge.className = "px-2.5 py-1 rounded text-xs font-bold ";
    if (alert.alertType === "Absent") {
        typeBadge.className += "bg-red-50 text-red-600 border border-red-200";
    } else if (alert.alertType === "Late") {
        typeBadge.className += "bg-amber-50 text-amber-600 border border-amber-200";
    } else if (alert.alertType === "Excuse Approved") {
        typeBadge.className += "bg-emerald-50 text-emerald-600 border border-emerald-200";
    } else {
        typeBadge.className += "bg-rose-50 text-rose-600 border border-rose-200";
    }

    // Status Badge
    const statusBadge = document.getElementById('detailStatusBadge');
    statusBadge.textContent = alert.status;
    statusBadge.className = "px-2.5 py-1 rounded text-xs font-bold " + 
        (alert.status === "Sent" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-red-50 text-red-700 border border-red-200");

    // Failure box if failed
    const failContainer = document.getElementById('detailFailureContainer');
    if (failContainer) {
        if (alert.status === "Failed" && alert.failureReason) {
            failContainer.classList.remove('hidden');
            document.getElementById('detailFailureReason').textContent = alert.failureReason;
        } else {
            failContainer.classList.add('hidden');
        }
    }

    const modal = document.getElementById('viewAlertModal');
    if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    }
}

function closeViewAlertModal() {
    const modal = document.getElementById('viewAlertModal');
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }
}

// =============================================================
// RESEND ALERT ACTIONS
// =============================================================
function triggerResendAlert(alertId) {
    const alert = ALERTS_DATA.find(a => a.id === alertId);
    if (!alert) return;

    selectedAlertForAction = alert;
    document.getElementById('resendTargetRecipient').textContent = `${alert.parentName} (${alert.contactNumber})`;
    document.getElementById('resendTargetStudent').textContent = `${alert.studentName} [${alert.alertType}]`;

    const modal = document.getElementById('resendConfirmModal');
    if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    }
}

function closeResendModal() {
    const modal = document.getElementById('resendConfirmModal');
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }
}

function confirmResendAction() {
    if (!selectedAlertForAction) return;

    closeResendModal();
    closeViewAlertModal();

    // Simulate sending via gateway
    showToast('Sending Alert...', `Dispatching SMS to ${selectedAlertForAction.contactNumber}`, 'info');

    setTimeout(() => {
        // Update alert status
        selectedAlertForAction.status = "Sent";
        delete selectedAlertForAction.failureReason;
        renderAlertsTable(currentAlertsList);

        // Update failed count on top KPI
        const failedCountEl = document.getElementById('failedCountKpi');
        if (failedCountEl) {
            const currentFailed = parseInt(failedCountEl.textContent, 10);
            if (currentFailed > 0) failedCountEl.textContent = Math.max(0, currentFailed - 1);
        }

        showToast('Alert Sent Successfully', `SMS alert delivered to ${selectedAlertForAction.parentName}`, 'success');
    }, 900);
}

// Quick action: Resend all failed
function openBatchResendModal() {
    const failedAlerts = ALERTS_DATA.filter(a => a.status === 'Failed');
    const modal = document.getElementById('batchResendModal');
    if (modal) {
        document.getElementById('batchFailedCount').textContent = failedAlerts.length > 0 ? failedAlerts.length : '32';
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    }
}

function closeBatchResendModal() {
    const modal = document.getElementById('batchResendModal');
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }
}

function confirmBatchResend() {
    closeBatchResendModal();
    showToast('Batch Resend Initiated', 'Queued 32 pending parent notifications for redelivery', 'info');

    setTimeout(() => {
        ALERTS_DATA.forEach(a => {
            if (a.status === 'Failed') a.status = 'Sent';
        });
        renderAlertsTable(currentAlertsList);
        const failedCountEl = document.getElementById('failedCountKpi');
        if (failedCountEl) failedCountEl.textContent = "0";

        showToast('Batch Resend Complete', 'All 32 notifications dispatched successfully!', 'success');
    }, 1500);
}

// =============================================================
// EXPORT MODAL & ACTIONS
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

function updateExportFormatSelection(radio) {
    document.querySelectorAll('.export-format-option').forEach(el => {
        el.classList.remove('border-[#0030c2]', 'bg-[#eff6ff]');
        el.classList.add('border-[#e5e7eb]');
        const textSpan = el.querySelector('span:first-of-type');
        if (textSpan) {
            textSpan.classList.remove('text-[#0030c2]');
            textSpan.classList.add('text-[#374151]');
        }
    });

    const parentLabel = radio.closest('.export-format-option');
    if (parentLabel) {
        parentLabel.classList.add('border-[#0030c2]', 'bg-[#eff6ff]');
        parentLabel.classList.remove('border-[#e5e7eb]');
        const textSpan = parentLabel.querySelector('span:first-of-type');
        if (textSpan) {
            textSpan.classList.add('text-[#0030c2]');
            textSpan.classList.remove('text-[#374151]');
        }
    }
}

function handleExportAlerts(event) {
    event.preventDefault();
    const format = document.querySelector('input[name="exportFormat"]:checked')?.value || 'CSV';
    const specificDate = document.getElementById('exportDate')?.value || '2026-07-25';

    closeExportModal();
    showToast('Exporting Records...', `Generating ${format} report for ${specificDate}`, 'info');

    setTimeout(() => {
        if (format === 'CSV') {
            const csvRows = [
                ["Student ID", "Student Name", "Section", "Parent Name", "Relationship", "Contact Number", "Alert Type", "Date Sent", "Time Sent", "Status"],
                ...currentAlertsList.map(a => [
                    `"${a.studentId}"`,
                    `"${a.studentName}"`,
                    `"${a.section}"`,
                    `"${a.parentName}"`,
                    `"${a.relationship}"`,
                    `"${a.contactNumber}"`,
                    `"${a.alertType}"`,
                    `"${a.dateSent}"`,
                    `"${a.timeSent}"`,
                    `"${a.status}"`
                ])
            ];

            const csvContent = "data:text/csv;charset=utf-8," + csvRows.map(e => e.join(",")).join("\n");
            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", `Parent_Alerts_Report_${specificDate}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }

        showToast('Download Ready', `Parent alerts report exported successfully (${format})`, 'success');
    }, 800);
}

// =============================================================
// NOTIFICATION HISTORY & DETAILED REPORT MODALS
// =============================================================
function openNotificationHistoryModal() {
    const modal = document.getElementById('historyModal');
    if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    }
}

function closeNotificationHistoryModal() {
    const modal = document.getElementById('historyModal');
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }
}

function openDetailedReportModal() {
    const modal = document.getElementById('detailedReportModal');
    if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    }
}

function closeDetailedReportModal() {
    const modal = document.getElementById('detailedReportModal');
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }
}

// =============================================================
// TOAST NOTIFICATION UTILITY
// =============================================================
function showToast(title, message, type = 'success') {
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
    if (type === 'success') {
        iconSvg = `
            <div class="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
            </div>
        `;
    } else if (type === 'info') {
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
