/**
 * Perfect Attendance Award Tool - Interactive Logic
 * SMS1-AMS Administrator Panel
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initial State & Mock Data
  let settings = {
    attendanceRequirement: 100,
    maxLate: 0,
    excusedAllowed: 0
  };

  // Load saved settings if any
  try {
    const saved = localStorage.getItem('ams_perfect_attendance_settings');
    if (saved) {
      settings = JSON.parse(saved);
    }
  } catch (e) {
    console.error('Error loading settings', e);
  }

  // Populate settings inputs
  const inputAttendance = document.getElementById('inputAttendanceReq');
  const inputMaxLate = document.getElementById('inputMaxLate');
  const inputExcused = document.getElementById('inputExcusedAllowed');

  if (inputAttendance) inputAttendance.value = settings.attendanceRequirement;
  if (inputMaxLate) inputMaxLate.value = settings.maxLate;
  if (inputExcused) inputExcused.value = settings.excusedAllowed;

  // Master List of Eligible Awardees
  let awardees = [
    { id: 1, name: 'Dela Cruz, John Paolo', section: 'BSIT 2A', attendance: '100.00%', late: 0, absences: 0, selected: false },
    { id: 2, name: 'Santos, Maria Isabelle', section: 'BSBA 2B', attendance: '100.00%', late: 0, absences: 0, selected: false },
    { id: 3, name: 'Reyes, Anna Mae', section: 'BSCS 2A', attendance: '100.00%', late: 0, absences: 0, selected: false },
    { id: 4, name: 'Garcia, Miguel Angelo', section: 'BSIT 2B', attendance: '100.00%', late: 0, absences: 0, selected: false },
    { id: 5, name: 'Rivera, Louisse', section: 'BSA 2A', attendance: '100.00%', late: 0, absences: 0, selected: false },
    { id: 6, name: 'Aquino, Ralph Lauren', section: 'BSIT 3A', attendance: '100.00%', late: 0, absences: 0, selected: false },
    { id: 7, name: 'Bautista, Claire Anne', section: 'BSBA 1A', attendance: '100.00%', late: 0, absences: 0, selected: false },
    { id: 8, name: 'Mendoza, Christian', section: 'BSCS 3B', attendance: '100.00%', late: 0, absences: 0, selected: false },
    { id: 9, name: 'Villanueva, Sofia Rose', section: 'BSA 4A', attendance: '100.00%', late: 0, absences: 0, selected: false },
    { id: 10, name: 'Cortez, Patricia May', section: 'BSIT 1B', attendance: '100.00%', late: 0, absences: 0, selected: false }
  ];

  // History Records
  let historyRecords = [
    {
      id: 'hist-1',
      schoolYear: '2024 - 2025',
      semester: '2nd Semester',
      dateGenerated: 'May 20, 2025',
      totalAwardees: 42,
      generatedBy: 'Admin User',
      awardeesList: [
        'Dela Cruz, John Paolo (BSIT 2A)',
        'Santos, Maria Isabelle (BSBA 2B)',
        'Reyes, Anna Mae (BSCS 2A)',
        'Garcia, Miguel Angelo (BSIT 2B)',
        'Rivera, Louisse (BSA 2A)',
        'Aquino, Ralph Lauren (BSIT 3A)',
        'Bautista, Claire Anne (BSBA 1A)',
        'Mendoza, Christian (BSCS 3B)'
      ]
    },
    {
      id: 'hist-2',
      schoolYear: '2024 - 2025',
      semester: '1st Semester',
      dateGenerated: 'November 18, 2024',
      totalAwardees: 38,
      generatedBy: 'Admin User',
      awardeesList: [
        'Tan, Alexander (BSIT 4A)',
        'Lim, Stephanie (BSBA 3B)',
        'Salazar, Miguel (BSCS 2A)',
        'Navarro, Bea (BSA 1B)'
      ]
    },
    {
      id: 'hist-3',
      schoolYear: '2023 - 2024',
      semester: '2nd Semester',
      dateGenerated: 'May 15, 2024',
      totalAwardees: 35,
      generatedBy: 'Admin User',
      awardeesList: [
        'Roxas, Danielle (BSIT 3A)',
        'Mercado, Joshua (BSBA 2A)',
        'Ocampo, Katrina (BSCS 4B)'
      ]
    },
    {
      id: 'hist-4',
      schoolYear: '2023 - 2024',
      semester: '1st Semester',
      dateGenerated: 'November 20, 2023',
      totalAwardees: 31,
      generatedBy: 'Admin User',
      awardeesList: [
        'Gonzales, Carlo (BSIT 2B)',
        'Flores, Andrea (BSA 3A)',
        'Castillo, Liza (BSBA 4A)'
      ]
    }
  ];

  // Pagination State
  let currentPage = 1;
  const itemsPerPage = 5;

  // Render Functions
  function renderAwardees() {
    const tbody = document.getElementById('awardeesTableBody');
    const footerText = document.getElementById('awardeesFooterText');
    const selectAllCheckbox = document.getElementById('selectAllAwardees');

    if (!tbody) return;

    if (awardees.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="8" class="py-8 text-center text-[#6b7280]">
            <p class="text-sm font-medium">No awardees found matching the criteria.</p>
            <p class="text-xs text-[#9ca3af] mt-1">Click "Generate List" to re-evaluate eligible students.</p>
          </td>
        </tr>
      `;
      if (footerText) footerText.textContent = 'Showing 0 to 0 of 0 entries';
      if (selectAllCheckbox) selectAllCheckbox.checked = false;
      return;
    }

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, awardees.length);
    const visibleAwardees = awardees.slice(startIndex, endIndex);

    let html = '';
    visibleAwardees.forEach((item, index) => {
      const globalIndex = startIndex + index + 1;
      html += `
        <tr class="hover:bg-[#f8fafc] transition-colors ${item.selected ? 'bg-[#eff6ff]/60' : ''}">
          <td class="py-3 px-3 text-center">
            <input type="checkbox" class="awardee-checkbox w-4 h-4 rounded border-[#d1d5db] text-[#0030c2] focus:ring-[#0030c2] cursor-pointer" data-id="${item.id}" ${item.selected ? 'checked' : ''}>
          </td>
          <td class="py-3 px-2 text-[#6b7280] font-semibold text-xs">${globalIndex}</td>
          <td class="py-3 px-3 font-semibold text-[#111827] text-xs">${item.name}</td>
          <td class="py-3 px-3 text-[#4b5563] text-xs font-medium">${item.section}</td>
          <td class="py-3 px-3 text-xs font-bold text-[#16a34a]">${item.attendance}</td>
          <td class="py-3 px-3 text-xs font-semibold text-[#4b5563]">${item.late}</td>
          <td class="py-3 px-3 text-xs font-semibold text-[#4b5563]">${item.absences}</td>
          <td class="py-3 px-4 text-center">
            <div class="flex items-center justify-center gap-1.5">
              <!-- Send Certificate PDF to Gmail (Paper Airplane / Send Icon) -->
              <button onclick="window.openSendCertificateModal(${item.id})" class="p-1.5 text-[#2563eb] hover:bg-blue-50 rounded-lg transition-colors inline-flex items-center justify-center" title="Send Certificate PDF to Gmail">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                </svg>
              </button>
              <!-- View Certificate (Eye Icon) -->
              <button onclick="window.viewStudentCertificate(${item.id})" class="p-1.5 text-[#2563eb] hover:bg-blue-50 rounded-lg transition-colors inline-flex items-center justify-center" title="View Certificate Details">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </div>
          </td>
        </tr>
      `;
    });

    tbody.innerHTML = html;

    if (footerText) {
      footerText.textContent = `Showing ${startIndex + 1} to ${endIndex} of ${awardees.length} entries`;
    }

    // Update select all checkbox state
    if (selectAllCheckbox) {
      const allSelected = visibleAwardees.length > 0 && visibleAwardees.every(item => item.selected);
      selectAllCheckbox.checked = allSelected;
    }

    // Attach individual checkbox listeners
    document.querySelectorAll('.awardee-checkbox').forEach(cb => {
      cb.addEventListener('change', (e) => {
        const id = parseInt(e.target.dataset.id);
        const target = awardees.find(a => a.id === id);
        if (target) {
          target.selected = e.target.checked;
        }
        renderAwardees();
      });
    });
  }

  function renderHistory() {
    const tbody = document.getElementById('historyTableBody');
    const footerText = document.getElementById('historyFooterText');
    if (!tbody) return;

    let html = '';
    historyRecords.forEach((rec) => {
      html += `
        <tr class="hover:bg-[#f8fafc] transition-colors">
          <td class="py-3 px-4 font-semibold text-[#111827] text-xs">${rec.schoolYear}</td>
          <td class="py-3 px-4 text-[#4b5563] text-xs font-medium">${rec.semester}</td>
          <td class="py-3 px-4 text-[#4b5563] text-xs font-medium">${rec.dateGenerated}</td>
          <td class="py-3 px-4 text-xs font-bold text-[#111827]">${rec.totalAwardees}</td>
          <td class="py-3 px-4 text-[#4b5563] text-xs font-medium">${rec.generatedBy}</td>
          <td class="py-3 px-4 text-center">
            <button onclick="window.viewHistoryDetails('${rec.id}')" class="p-1.5 text-[#2563eb] hover:bg-blue-50 rounded-lg transition-colors inline-flex items-center justify-center" title="View Details">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </td>
        </tr>
      `;
    });

    tbody.innerHTML = html;
    if (footerText) {
      footerText.textContent = `Showing 1 to ${historyRecords.length} of ${historyRecords.length} entries`;
    }
  }

  // Toast Notification Helper (Matching Parent Alerts Monitoring design)
  function showToast(titleOrMessage, messageOrType, type = 'success') {
    let title = titleOrMessage;
    let message = messageOrType;
    let toastType = type;

    // Support both showToast(message, type) and showToast(title, message, type)
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

  // Save Settings
  const btnSaveSettings = document.getElementById('btnSaveSettings');
  if (btnSaveSettings) {
    btnSaveSettings.addEventListener('click', (e) => {
      e.preventDefault();
      settings.attendanceRequirement = parseFloat(inputAttendance?.value || 100);
      settings.maxLate = parseInt(inputMaxLate?.value || 0);
      settings.excusedAllowed = parseInt(inputExcused?.value || 0);

      try {
        localStorage.setItem('ams_perfect_attendance_settings', JSON.stringify(settings));
        showToast('Award settings saved successfully!', 'success');
      } catch (err) {
        showToast('Failed to save settings.', 'error');
      }
    });
  }

  // Generate List Button
  const btnGenerateList = document.getElementById('btnGenerateList');
  if (btnGenerateList) {
    btnGenerateList.addEventListener('click', () => {
      btnGenerateList.disabled = true;
      const originalText = btnGenerateList.innerHTML;
      btnGenerateList.innerHTML = `
        <svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
        </svg>
        Generating...
      `;

      setTimeout(() => {
        awardees = [
          { id: 1, name: 'Dela Cruz, John Paolo', section: 'BSIT 2A', attendance: '100.00%', late: 0, absences: 0, selected: false },
          { id: 2, name: 'Santos, Maria Isabelle', section: 'BSBA 2B', attendance: '100.00%', late: 0, absences: 0, selected: false },
          { id: 3, name: 'Reyes, Anna Mae', section: 'BSCS 2A', attendance: '100.00%', late: 0, absences: 0, selected: false },
          { id: 4, name: 'Garcia, Miguel Angelo', section: 'BSIT 2B', attendance: '100.00%', late: 0, absences: 0, selected: false },
          { id: 5, name: 'Rivera, Louisse', section: 'BSA 2A', attendance: '100.00%', late: 0, absences: 0, selected: false },
          { id: 6, name: 'Aquino, Ralph Lauren', section: 'BSIT 3A', attendance: '100.00%', late: 0, absences: 0, selected: false },
          { id: 7, name: 'Bautista, Claire Anne', section: 'BSBA 1A', attendance: '100.00%', late: 0, absences: 0, selected: false },
          { id: 8, name: 'Mendoza, Christian', section: 'BSCS 3B', attendance: '100.00%', late: 0, absences: 0, selected: false },
          { id: 9, name: 'Villanueva, Sofia Rose', section: 'BSA 4A', attendance: '100.00%', late: 0, absences: 0, selected: false },
          { id: 10, name: 'Cortez, Patricia May', section: 'BSIT 1B', attendance: '100.00%', late: 0, absences: 0, selected: false }
        ];

        currentPage = 1;
        renderAwardees();
        btnGenerateList.disabled = false;
        btnGenerateList.innerHTML = originalText;
        showToast('Generated 25 eligible students for Perfect Attendance Award!', 'success');
      }, 500);
    });
  }

  // Select All Checkbox
  const selectAllCheckbox = document.getElementById('selectAllAwardees');
  if (selectAllCheckbox) {
    selectAllCheckbox.addEventListener('change', (e) => {
      const isChecked = e.target.checked;
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = Math.min(startIndex + itemsPerPage, awardees.length);
      for (let i = startIndex; i < endIndex; i++) {
        awardees[i].selected = isChecked;
      }
      renderAwardees();
    });
  }

  // Approve Awardees
  const btnApprove = document.getElementById('btnApprove');
  if (btnApprove) {
    btnApprove.addEventListener('click', () => {
      const selected = awardees.filter(a => a.selected);
      const count = selected.length > 0 ? selected.length : awardees.length;
      const names = selected.length > 0 ? selected.map(s => `${s.name} (${s.section})`) : awardees.map(s => `${s.name} (${s.section})`);

      if (awardees.length === 0) {
        showToast('No awardees available to approve.', 'error');
        return;
      }

      // Add to History
      const now = new Date();
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      const newHistory = {
        id: `hist-${Date.now()}`,
        schoolYear: '2025 - 2026',
        semester: '1st Semester',
        dateGenerated: now.toLocaleDateString('en-US', options),
        totalAwardees: count,
        generatedBy: 'Admin User',
        awardeesList: names
      };

      historyRecords.unshift(newHistory);
      renderHistory();
      showToast(`Successfully approved and archived ${count} Perfect Attendance awardees!`, 'success');
    });
  }

  // Remove Selected Students
  const btnRemove = document.getElementById('btnRemove');
  if (btnRemove) {
    btnRemove.addEventListener('click', () => {
      const selectedCount = awardees.filter(a => a.selected).length;
      if (selectedCount === 0) {
        showToast('Please select at least one student to remove.', 'error');
        return;
      }

      awardees = awardees.filter(a => !a.selected);
      currentPage = 1;
      renderAwardees();
      showToast(`Removed ${selectedCount} student(s) from awardees list.`, 'info');
    });
  }

  // Single Student Certificate View & Send Handlers
  const certificateModal = document.getElementById('certificateModal');
  const certificateContainer = document.getElementById('certificateListContainer');

  window.viewStudentCertificate = function (studentId) {
    const student = awardees.find(a => a.id === studentId);
    if (!student || !certificateModal || !certificateContainer) return;

    certificateContainer.innerHTML = `
      <div class="border-4 border-[#0030c2]/20 p-8 rounded-xl bg-white shadow-sm text-center relative overflow-hidden">
        <div class="absolute top-0 right-0 w-24 h-24 bg-[#0030c2]/5 rounded-bl-full pointer-events-none"></div>
        <div class="absolute bottom-0 left-0 w-24 h-24 bg-[#0030c2]/5 rounded-tr-full pointer-events-none"></div>
        
        <div class="w-12 h-12 rounded-full bg-[#e7edff] text-[#0030c2] flex items-center justify-center mx-auto mb-3 shadow-inner">
          <svg class="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        </div>
        
        <h4 class="text-xs tracking-widest uppercase font-extrabold text-[#0030c2]">Certificate of Recognition</h4>
        <p class="text-[11px] text-[#6b7280] mt-1">This certifies that</p>
        
        <h3 class="text-xl font-black text-[#111827] my-3 underline decoration-[#0030c2] decoration-2 underline-offset-4">${student.name}</h3>
        
        <p class="text-xs text-[#4b5563] max-w-md mx-auto leading-relaxed">
          from <span class="font-bold text-[#111827]">${student.section}</span> has achieved an exemplary 
          <span class="font-bold text-[#16a34a]">100% Perfect Attendance Record</span> for the Academic Term 2025-2026.
        </p>
        
        <div class="flex justify-between items-end mt-8 pt-6 border-t border-[#f1f5f9] text-xs text-[#6b7280]">
          <div>
            <p class="font-bold text-[#111827]">July 25, 2026</p>
            <p class="text-[10px]">Date Issued</p>
          </div>
          <div>
            <div class="w-32 border-b border-[#111827] mb-1 mx-auto"></div>
            <p class="font-bold text-[#111827]">School Administrator</p>
            <p class="text-[10px]">Authorized Signature</p>
          </div>
        </div>
      </div>
    `;
    certificateModal.classList.remove('hidden');
  };

  // Send Certificate Modal Handlers
  const sendCertModal = document.getElementById('sendCertificateModal');

  window.openSendCertificateModal = function (studentId) {
    const student = awardees.find(a => a.id === studentId);
    if (!student || !sendCertModal) return;

    const studentEmail = `${student.name.toLowerCase().replace(/[^a-z0-9]/g, '.')}@gmail.com`;
    const formattedFileName = `Certificate_${student.name.replace(/\s+/g, '_')}_Perfect_Attendance.pdf`;

    document.getElementById('sendCertStudentId').value = student.id;
    document.getElementById('sendCertStudentName').textContent = student.name;
    document.getElementById('sendCertStudentSection').textContent = `${student.section} • 100% Attendance`;
    document.getElementById('sendCertRecipientEmail').value = studentEmail;
    document.getElementById('sendCertSubject').value = `Certificate of Recognition - Perfect Attendance Award (${student.name})`;
    document.getElementById('sendCertFileName').textContent = formattedFileName;
    document.getElementById('sendCertMessage').value = `Dear ${student.name},\n\nCongratulations! Attached is your official Certificate of Recognition for achieving a 100% Perfect Attendance record for the School Year 2025-2026.\n\nBest regards,\nSchool Administration`;

    sendCertModal.classList.remove('hidden');
    sendCertModal.classList.add('flex');
  };

  window.closeSendCertificateModal = function () {
    if (sendCertModal) {
      sendCertModal.classList.add('hidden');
      sendCertModal.classList.remove('flex');
    }
  };

  window.handleSendCertificateSubmit = function (event) {
    event.preventDefault();
    const studentId = parseInt(document.getElementById('sendCertStudentId').value);
    const student = awardees.find(a => a.id === studentId);
    const email = document.getElementById('sendCertRecipientEmail').value;
    const studentName = student ? student.name : 'Student';

    window.closeSendCertificateModal();
    showToast("Certificate Sent Successfully", `Official Certificate PDF has been sent to ${studentName} (${email}).`, "success");
  };

  window.sendStudentCertificateEmail = window.openSendCertificateModal;

  // Close Certificate Modal
  window.closeCertificateModal = function () {
    if (certificateModal) certificateModal.classList.add('hidden');
  };

  // Trigger Print
  window.printCertificates = function () {
    window.print();
  };

  // View Details Modal for History
  const historyModal = document.getElementById('historyDetailsModal');
  const historyModalContent = document.getElementById('historyDetailsContent');
  const historyModalTitle = document.getElementById('historyDetailsTitle');

  window.viewHistoryDetails = function (histId) {
    const rec = historyRecords.find(h => h.id === histId);
    if (!rec || !historyModal || !historyModalContent) return;

    if (historyModalTitle) {
      historyModalTitle.textContent = `Awardees - ${rec.schoolYear} (${rec.semester})`;
    }

    let listHtml = `
      <div class="mb-3 flex items-center justify-between text-xs text-[#6b7280] pb-2 border-b border-[#e5e7eb]">
        <span>Generated on: <strong class="text-[#111827]">${rec.dateGenerated}</strong></span>
        <span>Total Recipients: <strong class="text-[#0030c2]">${rec.totalAwardees} students</strong></span>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-64 overflow-y-auto pr-1">
    `;

    rec.awardeesList.forEach((name, idx) => {
      listHtml += `
        <div class="flex items-center gap-2 p-2 bg-[#f8fafc] border border-[#e5e7eb] rounded-lg text-xs">
          <span class="w-5 h-5 rounded-full bg-[#e7edff] text-[#0030c2] font-bold text-[10px] flex items-center justify-center shrink-0">${idx + 1}</span>
          <span class="font-semibold text-[#111827] truncate">${name}</span>
        </div>
      `;
    });

    listHtml += `</div>`;
    historyModalContent.innerHTML = listHtml;
    historyModal.classList.remove('hidden');
  };

  window.closeHistoryModal = function () {
    if (historyModal) historyModal.classList.add('hidden');
  };

  // Export Modal Functions (Matching tardy-list.html)
  const exportModal = document.getElementById('exportModal');

  window.openExportModal = function () {
    if (exportModal) {
      exportModal.classList.remove('hidden');
      exportModal.classList.add('flex');
    }
  };

  window.closeExportModal = function () {
    if (exportModal) {
      exportModal.classList.add('hidden');
      exportModal.classList.remove('flex');
    }
  };

  window.updateExportFormatSelection = function (radio) {
    document.querySelectorAll('.export-format-option').forEach(el => {
      el.classList.remove('border-[#0030c2]', 'bg-[#eff6ff]');
      el.classList.add('border-[#e5e7eb]');
      const titleSpan = el.querySelector('span:first-of-type');
      if (titleSpan) {
        titleSpan.classList.remove('text-[#0030c2]');
        titleSpan.classList.add('text-[#374151]');
      }
    });

    const parent = radio.closest('.export-format-option');
    if (parent) {
      parent.classList.remove('border-[#e5e7eb]');
      parent.classList.add('border-[#0030c2]', 'bg-[#eff6ff]');
      const titleSpan = parent.querySelector('span:first-of-type');
      if (titleSpan) {
        titleSpan.classList.remove('text-[#374151]');
        titleSpan.classList.add('text-[#0030c2]');
      }
    }
  };

  window.handleExport = function (event) {
    event.preventDefault();
    const format = document.querySelector('input[name="exportFormat"]:checked')?.value || 'CSV';
    window.closeExportModal();
    showToast(`Exporting Perfect Attendance Awardees as ${format}...`, 'success');
  };

  // Pagination navigation handlers for Awardees
  const btnPrevPage = document.getElementById('btnPrevPage');
  const btnNextPage = document.getElementById('btnNextPage');

  if (btnPrevPage) {
    btnPrevPage.addEventListener('click', () => {
      if (currentPage > 1) {
        currentPage--;
        renderAwardees();
      }
    });
  }

  if (btnNextPage) {
    btnNextPage.addEventListener('click', () => {
      const maxPages = Math.ceil(awardees.length / itemsPerPage);
      if (currentPage < maxPages) {
        currentPage++;
        renderAwardees();
      }
    });
  }

  // Initial Table Renderings
  renderAwardees();
  renderHistory();
});
