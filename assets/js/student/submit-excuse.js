// assets/js/student/submit-excuse.js
// Student Excuse Slip Submission Module for Bestlink College of the Philippines Attendance Monitoring System
// Follows student/tardy-and-absence/attendance-history.js design standards

import { supabase } from '../config/supabaseClient.js';

let selectedFile = null;

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  console.log('📋 Submit Excuse Slip Module Initialized');
  initCurrentDate();
  parseUrlParameters();
  initDropzone();
  initWholeDayToggle();
  initFormSubmit();
  initModalListeners();
  exposeGlobalFunctions();
  initProfileDropdown();
});

/**
 * Initialize current date badge in header matching attendance-history.html
 */
function initCurrentDate() {
  const dateEl = document.getElementById('currentDateLabel');
  if (dateEl) {
    const today = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' };
    const dateParts = today.toLocaleDateString('en-US', options).split(', ');
    if (dateParts.length >= 3) {
      dateEl.textContent = `${dateParts[1]}, ${dateParts[2]} (${dateParts[0]})`;
    } else {
      dateEl.textContent = 'May 27, 2025 (Tuesday)';
    }
  }

  // Set max date for date picker to today
  const dateInput = document.getElementById('excuseDateInput');
  if (dateInput) {
    const todayISO = new Date().toISOString().split('T')[0];
    dateInput.max = todayISO;
  }
}

/**
 * Parse URL query parameters to auto-fill form when routed from Absence or Tardy logs
 * Example: submit-excuse.html?date=2025-05-21&subject=Introduction%20to%20Computing
 */
function parseUrlParameters() {
  const urlParams = new URLSearchParams(window.location.search);
  const dateParam = urlParams.get('date');
  const subjectParam = urlParams.get('subject');

  const dateInput = document.getElementById('excuseDateInput');
  const subjectSelect = document.getElementById('excuseSubjectSelect');

  if (dateParam && dateInput) {
    dateInput.value = dateParam;
    dateInput.classList.add('bg-blue-50/50', 'border-[#0030c2]');
  }

  if (subjectParam && subjectSelect) {
    const options = Array.from(subjectSelect.options);
    const match = options.find(opt => 
      opt.value.toLowerCase().includes(subjectParam.toLowerCase()) || 
      subjectParam.toLowerCase().includes(opt.value.toLowerCase())
    );
    if (match) {
      subjectSelect.value = match.value;
      subjectSelect.classList.add('bg-blue-50/50', 'border-[#0030c2]');
    }
  }
}

/**
 * Handle whole day toggle checkbox
 */
function initWholeDayToggle() {
  const toggle = document.getElementById('wholeDayToggle');
  const subjectSelect = document.getElementById('excuseSubjectSelect');

  if (!toggle || !subjectSelect) return;

  toggle.addEventListener('change', () => {
    if (toggle.checked) {
      subjectSelect.disabled = true;
      subjectSelect.classList.add('bg-gray-100', 'cursor-not-allowed', 'opacity-60');
    } else {
      subjectSelect.disabled = false;
      subjectSelect.classList.remove('bg-gray-100', 'cursor-not-allowed', 'opacity-60');
    }
  });
}

/**
 * Initialize Drag-and-Drop Dropzone & File Input
 */
function initDropzone() {
  const dropZone = document.getElementById('fileDropZone');
  const fileInput = document.getElementById('excuseFileInput');

  if (!dropZone || !fileInput) return;

  // Click dropzone to open file picker
  dropZone.addEventListener('click', () => {
    fileInput.click();
  });

  // Drag-and-drop visual states
  ['dragenter', 'dragover'].forEach(eventName => {
    dropZone.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropZone.classList.add('border-[#0030c2]', 'bg-[#eff6ff]');
    });
  });

  ['dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropZone.classList.remove('border-[#0030c2]', 'bg-[#eff6ff]');
    });
  });

  // Handle dropped files
  dropZone.addEventListener('drop', (e) => {
    if (e.dataTransfer && e.dataTransfer.files.length > 0) {
      handleFileSelected(e.dataTransfer.files[0]);
    }
  });

  // Handle input file selection
  fileInput.addEventListener('change', () => {
    if (fileInput.files.length > 0) {
      handleFileSelected(fileInput.files[0]);
    }
  });
}

/**
 * Validate and process selected file
 */
function handleFileSelected(file) {
  const allowedExtensions = ['pdf', 'png', 'jpg', 'jpeg'];
  const ext = file.name.split('.').pop().toLowerCase();
  const maxBytes = 5 * 1024 * 1024; // 5 MB

  if (!allowedExtensions.includes(ext)) {
    alert('Invalid file format. Please upload a PDF, PNG, or JPG file.');
    removeAttachedFile();
    return;
  }

  if (file.size > maxBytes) {
    alert(`File is too large (${formatFileSize(file.size)}). Maximum permitted file size is 5 MB.`);
    removeAttachedFile();
    return;
  }

  selectedFile = file;

  // Show preview container
  const preview = document.getElementById('filePreviewContainer');
  const nameEl = document.getElementById('fileNameText');
  const sizeEl = document.getElementById('fileSizeText');

  if (preview && nameEl && sizeEl) {
    nameEl.textContent = file.name;
    sizeEl.textContent = formatFileSize(file.size);
    preview.classList.remove('hidden');
    preview.classList.add('flex');
  }
}

/**
 * Remove attached file
 */
function removeAttachedFile() {
  selectedFile = null;
  const fileInput = document.getElementById('excuseFileInput');
  const preview = document.getElementById('filePreviewContainer');

  if (fileInput) fileInput.value = '';
  if (preview) {
    preview.classList.remove('flex');
    preview.classList.add('hidden');
  }
}

/**
 * Helper: Format bytes to readable string
 */
function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

/**
 * Form Submission Handling
 */
function initFormSubmit() {
  const form = document.getElementById('excuseSlipForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const dateVal = document.getElementById('excuseDateInput').value;
    const wholeDay = document.getElementById('wholeDayToggle').checked;
    const subjectSelect = document.getElementById('excuseSubjectSelect');
    const subjectVal = wholeDay ? 'Whole Day / All Classes' : subjectSelect.value;
    const reasonVal = document.getElementById('excuseReasonCategory').value;
    const explanationVal = document.getElementById('excuseExplanation').value.trim();
    const submitBtn = document.getElementById('submitExcuseBtn');

    if (!dateVal || (!wholeDay && !subjectVal) || !reasonVal || !explanationVal) {
      alert('Please fill out all required fields marked with an asterisk (*).');
      return;
    }

    // Set submitting loading state
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
        </svg>
        <span>Submitting Excuse Slip...</span>
      `;
    }

    const ticketNo = `EXC-2026-00${Math.floor(Math.random() * 90) + 10}`;

    // Attempt Supabase insert with resilient fallback
    try {
      if (supabase) {
        await supabase.from('excuse_slips').insert([
          {
            ticket_no: ticketNo,
            student_name: 'Juan Dela Cruz',
            section: 'BSIT 3A',
            date_of_absence: dateVal,
            subject: subjectVal,
            reason: reasonVal,
            explanation: explanationVal,
            has_attachment: selectedFile !== null,
            attachment_name: selectedFile ? selectedFile.name : null,
            status: 'Pending Review',
            submitted_at: new Date().toISOString()
          }
        ]);
      }
    } catch (err) {
      console.warn('Supabase offline or table missing, continuing with local confirmation:', err);
    }

    // Save to localStorage for instant synchronization with user session
    try {
      const existingSlipsRaw = localStorage.getItem('student_excuse_slips');
      const existingSlips = existingSlipsRaw ? JSON.parse(existingSlipsRaw) : [];
      
      const newSlip = {
        id: ticketNo,
        dateFiled: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        dateRaw: new Date().toISOString().split('T')[0],
        absenceDate: new Date(dateVal + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        absenceDateRaw: dateVal,
        subject: subjectVal,
        teacher: getTeacherForSubject(subjectVal),
        reasonCategory: reasonVal,
        explanation: explanationVal,
        attachmentName: selectedFile ? selectedFile.name : null,
        status: 'Pending Review'
      };

      existingSlips.unshift(newSlip);
      localStorage.setItem('student_excuse_slips', JSON.stringify(existingSlips));
    } catch (e) {
      console.warn('Could not save excuse slip to local storage:', e);
    }

    // Simulated short delay for smooth UX
    setTimeout(() => {
      alert(`🎉 Excuse Slip Submitted Successfully!\n\nReference Ticket: ${ticketNo}\nSubject: ${subjectVal}\nStatus: Pending Review\n\nYour instructor has been notified to evaluate this request.`);
      resetExcuseForm();
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
          </svg>
          <span>Submit Excuse Slip</span>
        `;
      }
    }, 600);
  });
}

/**
 * Get instructor name for subject
 */
function getTeacherForSubject(subject) {
  const teacherMap = {
    'Introduction to Computing': 'Mrs. Jane Dela Cruz',
    'Web Development': 'Mr. Carlo Reyes',
    'Database Systems': 'Ms. Angela Ramos',
    'Systems Analysis': 'Mr. Benj Torres'
  };
  return teacherMap[subject] || 'Assigned Instructor';
}

/**
 * Reset form fields
 */
function resetExcuseForm() {
  const form = document.getElementById('excuseSlipForm');
  if (form) form.reset();
  removeAttachedFile();
  const subjectSelect = document.getElementById('excuseSubjectSelect');
  if (subjectSelect) {
    subjectSelect.disabled = false;
    subjectSelect.classList.remove('bg-gray-100', 'cursor-not-allowed', 'opacity-60', 'bg-blue-50/50', 'border-[#0030c2]');
  }
  const dateInput = document.getElementById('excuseDateInput');
  if (dateInput) {
    dateInput.classList.remove('bg-blue-50/50', 'border-[#0030c2]');
  }
}

/**
 * Topbar Profile Dropdown and Logout Handlers (1:1 Reference from attendance-history.html)
 */
function toggleProfileDropdown(event) {
  if (event) event.stopPropagation();
  const menu = document.getElementById('studentProfileMenu');
  if (menu) {
    menu.classList.toggle('hidden');
  }
}

function handleLogout() {
  if (confirm('Are you sure you want to log out?')) {
    window.location.href = '../../login.html';
  }
}

function initProfileDropdown() {
  document.addEventListener('click', (e) => {
    const profileBtn = document.getElementById('topbarProfileBtn');
    const profileMenu = document.getElementById('studentProfileMenu');
    if (profileMenu && !profileMenu.classList.contains('hidden')) {
      if (!profileBtn?.contains(e.target) && !profileMenu.contains(e.target)) {
        profileMenu.classList.add('hidden');
      }
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const profileMenu = document.getElementById('studentProfileMenu');
      if (profileMenu) profileMenu.classList.add('hidden');
    }
  });
}

/**
 * Recent Excuse Slips Dataset for Table Action Eye Icon & Modal View
 */
const recentSlipsData = {
  'EXC-2026-003': {
    id: 'EXC-2026-003',
    subject: 'Web Development',
    teacher: 'Mr. Carlo Reyes',
    absenceDate: 'May 26, 2025',
    dateFiled: 'May 26, 2025',
    reasonCategory: 'Medical Illness / Consultation',
    explanation: 'Medical consultation due to severe migraine and fever symptoms. Consulted with university clinic doctor.',
    attachmentName: 'Medical_Cert_May26.pdf',
    status: 'Pending Review',
    remarks: 'Pending review by instructor.'
  },
  'EXC-2026-002': {
    id: 'EXC-2026-002',
    subject: 'Database Systems',
    teacher: 'Ms. Angela Ramos',
    absenceDate: 'May 19, 2025',
    dateFiled: 'May 19, 2025',
    reasonCategory: 'Medical Illness / Consultation',
    explanation: 'Suffered from acute gastroenteritis, was advised to rest for 2 days by attending physician.',
    attachmentName: 'Clinical_Slip_May19.pdf',
    status: 'Approved',
    remarks: 'Approved. Excuse accepted. Please submit missed laboratory exercise #4 before Friday.'
  },
  'EXC-2026-001': {
    id: 'EXC-2026-001',
    subject: 'Introduction to Computing',
    teacher: 'Mrs. Jane Dela Cruz',
    absenceDate: 'May 21, 2025',
    dateFiled: 'May 21, 2025',
    reasonCategory: 'Other Valid Grounds',
    explanation: 'Personal urgent matter at home during the scheduled lecture.',
    attachmentName: 'Barangay_Cert.pdf',
    status: 'Rejected',
    remarks: 'Insufficient valid supporting documentation provided. Please coordinate with the guidance office.'
  }
};

/**
 * Open Excuse Slip Details Modal (Triggered by Eye Icon in Recent Submissions Table)
 */
function openSlipModal(ticketId) {
  let slip = recentSlipsData[ticketId];

  // Also check local storage if user submitted new slips in current session
  if (!slip) {
    try {
      const storedSlips = JSON.parse(localStorage.getItem('student_excuse_slips') || '[]');
      slip = storedSlips.find(s => s.id === ticketId);
    } catch (e) {
      console.warn('Error reading from localStorage:', e);
    }
  }

  if (!slip) {
    slip = {
      id: ticketId,
      subject: 'Class Attendance',
      teacher: 'Assigned Instructor',
      absenceDate: 'Recently Filed',
      dateFiled: 'Today',
      reasonCategory: 'Official University Activity',
      explanation: 'Official excuse request submitted for review.',
      attachmentName: 'supporting_document.pdf',
      status: 'Pending Review',
      remarks: 'Pending review by instructor.'
    };
  }

  const modal = document.getElementById('slipDetailModal');
  if (!modal) return;

  const subtitleEl = document.getElementById('modalSlipTicketSubtitle');
  const idEl = document.getElementById('modalSlipTicketId');
  const subjectEl = document.getElementById('modalSlipSubject');
  const teacherEl = document.getElementById('modalSlipTeacher');
  const absenceDateEl = document.getElementById('modalSlipAbsenceDate');
  const dateFiledEl = document.getElementById('modalSlipDateFiled');
  const reasonEl = document.getElementById('modalSlipReason');
  const expEl = document.getElementById('modalSlipExplanation');
  const attachmentBox = document.getElementById('modalSlipAttachmentBox');
  const attachmentNameEl = document.getElementById('modalSlipAttachmentName');
  const remarksEl = document.getElementById('modalSlipRemarks');
  const badgeContainer = document.getElementById('modalSlipStatusBadge');

  if (subtitleEl) subtitleEl.textContent = `Ticket: ${slip.id}`;
  if (idEl) idEl.textContent = slip.id;
  if (subjectEl) subjectEl.textContent = slip.subject;
  if (teacherEl) teacherEl.textContent = slip.teacher || 'Assigned Instructor';
  if (absenceDateEl) absenceDateEl.textContent = slip.absenceDate;
  if (dateFiledEl) dateFiledEl.textContent = slip.dateFiled || slip.absenceDate;
  if (reasonEl) reasonEl.textContent = slip.reasonCategory;
  if (expEl) expEl.textContent = slip.explanation;
  if (remarksEl) remarksEl.textContent = slip.remarks || 'Pending evaluation by instructor.';

  if (attachmentNameEl) {
    if (slip.attachmentName) {
      attachmentNameEl.textContent = slip.attachmentName;
      if (attachmentBox) attachmentBox.classList.remove('hidden');
    } else {
      if (attachmentBox) attachmentBox.classList.add('hidden');
    }
  }

  if (badgeContainer) {
    if (slip.status === 'Approved') {
      badgeContainer.innerHTML = `
        <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#f0fdf4] text-[#16a34a] border border-[#bbf7d0]">
          Approved
        </span>
      `;
    } else if (slip.status === 'Rejected') {
      badgeContainer.innerHTML = `
        <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#fef2f2] text-[#dc2626] border border-[#fecaca]">
          Rejected
        </span>
      `;
    } else {
      badgeContainer.innerHTML = `
        <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#fff7ed] text-[#f97316] border border-[#fed7aa]">
          Pending Review
        </span>
      `;
    }
  }

  modal.classList.remove('hidden');
  modal.classList.add('flex');
}

/**
 * Close Excuse Slip Details Modal
 */
function closeSlipModal() {
  const modal = document.getElementById('slipDetailModal');
  if (modal) {
    modal.classList.remove('flex');
    modal.classList.add('hidden');
  }
}

/**
 * Modal Click-Outside & Keyboard Escape Handler
 */
function initModalListeners() {
  const modal = document.getElementById('slipDetailModal');
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeSlipModal();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeSlipModal();
    }
  });
}

/**
 * Expose functions to window
 */
function exposeGlobalFunctions() {
  window.removeAttachedFile = removeAttachedFile;
  window.resetExcuseForm = resetExcuseForm;
  window.toggleProfileDropdown = toggleProfileDropdown;
  window.handleLogout = handleLogout;
  window.openSlipModal = openSlipModal;
  window.closeSlipModal = closeSlipModal;
}

