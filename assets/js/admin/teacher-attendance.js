// assets/js/teacher-attendance.js
// Teacher Attendance Management & Interactive Filtering Module

let currentPage = 1;
const totalPages = 9;

document.addEventListener('DOMContentLoaded', function() {
    console.log('Teacher Attendance module initialized');

    // Initialize Search
    initTableSearch();


    // Modal listeners (backdrop click and ESC key)
    initModalListeners();

    // Read and apply URL query parameters (date)
    const urlParams = new URLSearchParams(window.location.search);
    const dateParam = urlParams.get('date');
    if (dateParam) {
        const dateFromInput = document.getElementById('filterDateFrom');
        const dateToInput = document.getElementById('filterDateTo');
        if (dateFromInput) dateFromInput.value = dateParam;
        if (dateToInput) dateToInput.value = dateParam;
    }
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
// SEARCH & MULTI-CRITERIA FILTERING
// =============================================================

function initTableSearch() {
    const searchInput = document.getElementById('teacherSearch');
    if (!searchInput) return;

    searchInput.addEventListener('input', function() {
        executeTeacherFiltering();
    });
}

function executeTeacherFiltering() {
    const searchInput = document.getElementById('teacherSearch');
    const searchQuery = searchInput ? searchInput.value.trim().toLowerCase() : '';
    const deptFilter = document.getElementById('filterDepartmentSelect') ? document.getElementById('filterDepartmentSelect').value : '';
    const statusFilter = document.getElementById('filterStatusSelect') ? document.getElementById('filterStatusSelect').value : '';
    
    const rows = document.querySelectorAll('.teacher-row');
    let visibleCount = 0;

    rows.forEach(row => {
        const id = (row.dataset.teacherId || '').toLowerCase();
        const name = (row.dataset.teacherName || '').toLowerCase();
        const dept = row.dataset.department || '';
        const status = row.dataset.status || '';

        const matchesSearch = !searchQuery || id.includes(searchQuery) || name.includes(searchQuery) || dept.toLowerCase().includes(searchQuery);
        const matchesDept = !deptFilter || dept === deptFilter;
        const matchesStatus = !statusFilter || status.toLowerCase() === statusFilter.toLowerCase();

        if (matchesSearch && matchesDept && matchesStatus) {
            row.style.display = '';
            visibleCount++;
        } else {
            row.style.display = 'none';
        }
    });

    // Update Counts
    const recordBadge = document.getElementById('teacherRecordCount');
    if (recordBadge) {
        recordBadge.textContent = `${visibleCount} Records`;
    }
    const showingEnd = document.getElementById('showingEndCount');
    if (showingEnd) {
        showingEnd.textContent = visibleCount;
    }

    return visibleCount;
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

function applyTeacherFilters() {
    const matchCount = executeTeacherFiltering();
    closeFilterModal();
    showToast(`Filters applied. ${matchCount} record(s) matching.`, 'info');
}

function resetTeacherFilters() {
    const deptSelect = document.getElementById('filterDepartmentSelect');
    const statusSelect = document.getElementById('filterStatusSelect');
    const dateFrom = document.getElementById('filterDateFrom');
    const dateTo = document.getElementById('filterDateTo');
    const searchInput = document.getElementById('teacherSearch');

    if (deptSelect) deptSelect.value = '';
    if (statusSelect) statusSelect.value = '';
    if (dateFrom) dateFrom.value = '2026-07-01';
    if (dateTo) dateTo.value = '2026-07-31';
    if (searchInput) searchInput.value = '';

    executeTeacherFiltering();
    closeFilterModal();
    showToast('Filters reset to default.', 'info');
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

    const parentLabel = radioInput.closest('.export-format-option') || radioInput.parentElement;
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
    showToast('Exporting Records...', `Generating ${format} report for ${specificDate}`, 'info');

    setTimeout(() => {
        if (format === 'CSV') {
            const visibleRows = Array.from(document.querySelectorAll('.teacher-row')).filter(row => row.style.display !== 'none');
            const csvRows = [
                ["Teacher ID", "Teacher Name", "Department", "Time In", "Time Out", "Status", "Date"]
            ];

            visibleRows.forEach(row => {
                const id = row.getAttribute('data-teacher-id') || '';
                const name = row.getAttribute('data-teacher-name') || '';
                const dept = row.getAttribute('data-department') || '';
                const status = row.getAttribute('data-status') || '';
                
                const cells = row.querySelectorAll('td');
                const timeIn = cells[2]?.textContent.trim() || '';
                const timeOut = cells[3]?.textContent.trim() || '';
                const date = cells[5]?.textContent.trim() || '';
                
                csvRows.push([
                    `"${id}"`,
                    `"${name}"`,
                    `"${dept}"`,
                    `"${timeIn}"`,
                    `"${timeOut}"`,
                    `"${status}"`,
                    `"${date}"`
                ]);
            });

            const csvContent = "data:text/csv;charset=utf-8," + csvRows.map(e => e.join(",")).join("\n");
            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", `Teacher_Attendance_${specificDate}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
        showToast('Download Ready', `Teacher attendance report exported successfully (${format})`, 'success');
    }, 800);
}

// =============================================================
// PAGINATION CONTROLLER
// =============================================================

function changePage(pageNum) {
    if (pageNum < 1 || pageNum > totalPages) return;
    currentPage = pageNum;

    // Update pagination button active state
    const paginationContainer = document.getElementById('paginationContainer');
    if (paginationContainer) {
        const buttons = paginationContainer.querySelectorAll('.pagination-btn');
        buttons.forEach(btn => {
            if (!btn.id) {
                const text = btn.textContent.trim();
                if (text === String(pageNum)) {
                    btn.classList.add('pagination-btn-active');
                } else if (text !== '...') {
                    btn.classList.remove('pagination-btn-active');
                }
            }
        });

        // Update Prev / Next button disabled state
        const prevBtn = document.getElementById('prevPageBtn');
        const nextBtn = document.getElementById('nextPageBtn');
        if (prevBtn) prevBtn.disabled = currentPage === 1;
        if (nextBtn) nextBtn.disabled = currentPage === totalPages;
    }

    const start = (currentPage - 1) * 5 + 1;
    const end = Math.min(currentPage * 5, 85);
    const startEl = document.getElementById('showingStartCount');
    const endEl = document.getElementById('showingEndCount');
    if (startEl) startEl.textContent = start;
    if (endEl) endEl.textContent = end;

    showToast(`Viewing page ${currentPage} of teacher attendance records.`, 'info');
}

// =============================================================
// VIEW & EDIT MODALS
// =============================================================

function openViewTeacherModal(data) {
    if (document.getElementById('viewTeacherName')) document.getElementById('viewTeacherName').textContent = data.name || '';
    if (document.getElementById('viewTeacherId')) document.getElementById('viewTeacherId').textContent = data.id || '';
    if (document.getElementById('viewTeacherDept')) document.getElementById('viewTeacherDept').textContent = data.dept || '';
    if (document.getElementById('viewTeacherRole')) document.getElementById('viewTeacherRole').textContent = data.role || 'Faculty Member';
    if (document.getElementById('viewTeacherTimeIn')) document.getElementById('viewTeacherTimeIn').textContent = data.timeIn || '—';
    if (document.getElementById('viewTeacherTimeOut')) document.getElementById('viewTeacherTimeOut').textContent = data.timeOut || '—';
    if (document.getElementById('viewTeacherDate')) document.getElementById('viewTeacherDate').textContent = data.date || '';
    if (document.getElementById('viewTeacherEmail')) document.getElementById('viewTeacherEmail').textContent = data.email || 'faculty@school.edu.ph';
    if (document.getElementById('viewTeacherContact')) document.getElementById('viewTeacherContact').textContent = data.contact || 'N/A';

    const statusBadge = document.getElementById('viewTeacherStatus');
    if (statusBadge) {
        statusBadge.textContent = data.status || 'Present';
        statusBadge.className = 'status-badge ' + (data.status === 'Present' ? 'status-badge-present' : (data.status === 'Late' ? 'status-badge-late' : 'status-badge-absent'));
    }

    const modal = document.getElementById('viewTeacherModal');
    if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    }
}

function closeViewTeacherModal() {
    const modal = document.getElementById('viewTeacherModal');
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }
}

function openEditTeacherModal(data) {
    if (document.getElementById('editTeacherName')) document.getElementById('editTeacherName').value = data.name || '';
    if (document.getElementById('editTeacherId')) document.getElementById('editTeacherId').value = data.id || '';
    if (document.getElementById('editTimeIn')) document.getElementById('editTimeIn').value = data.timeIn || '';
    if (document.getElementById('editTimeOut')) document.getElementById('editTimeOut').value = data.timeOut || '';
    if (document.getElementById('editStatus')) document.getElementById('editStatus').value = data.status || 'Present';

    const modal = document.getElementById('editTeacherModal');
    if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    }
}

function closeEditTeacherModal() {
    const modal = document.getElementById('editTeacherModal');
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }
}

function saveTeacherEdit(e) {
    if (e) e.preventDefault();
    const id = document.getElementById('editTeacherId')?.value || '';
    const name = document.getElementById('editTeacherName')?.value || 'Faculty Member';
    const status = document.getElementById('editStatus')?.value || 'Present';
    const timeIn = document.getElementById('editTimeIn')?.value || '';
    const timeOut = document.getElementById('editTimeOut')?.value || '';

    const row = document.querySelector(`.teacher-row[data-teacher-id="${id}"]`);
    if (row) {
        row.dataset.status = status;
        const statusCell = row.querySelector('.status-badge');
        if (statusCell) {
            statusCell.textContent = status;
            statusCell.className = 'status-badge ' + (status === 'Present' ? 'status-badge-present' : (status === 'Late' ? 'status-badge-late' : 'status-badge-absent'));
        }
    }

    closeEditTeacherModal();
    showToast(`Attendance record for ${name} (${id}) updated successfully!`, 'success');
}

// =============================================================
// MODAL LISTENERS (BACKDROP CLICK & ESC KEY)
// =============================================================

function initModalListeners() {
    const modalIds = ['filterModal', 'exportModal', 'viewTeacherModal', 'editTeacherModal'];
    
    modalIds.forEach(id => {
        const modal = document.getElementById(id);
        if (modal) {
            modal.addEventListener('click', function(e) {
                if (e.target === modal) {
                    modal.classList.add('hidden');
                    modal.classList.remove('flex');
                }
            });
        }
    });

    // ESC key close all
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            closeFilterModal();
            closeExportModal();
            closeViewTeacherModal();
            closeEditTeacherModal();
        }
    });
}