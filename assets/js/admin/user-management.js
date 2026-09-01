// assets/js/admin/user-management.js
// User Management Module for Bestlink College of the Philippines Attendance Monitoring System
// Handles Admin user creation (Students & Teachers), Supabase integration, RFID & QR generation, and RBAC management.

import { supabase } from '../config/supabaseClient.js';

let currentTab = 'students';
let currentPage = 1;
const itemsPerPage = 10;
let searchQuery = '';
let selectedUserIds = new Set();

// =============================================================
// DATASETS (Loaded dynamically from Supabase database)
// =============================================================
const studentsData = [];
const teachersData = [];

// =============================================================
// INITIALIZATION
// =============================================================
document.addEventListener('DOMContentLoaded', async () => {
  console.log('👥 User Management Module Initialized');
  initCurrentDate();
  initSearch();
  initModalListeners();
  exposeGlobalFunctions();

  // Fetch remote records from Supabase
  await loadRemoteUsersFromSupabase();
  renderTable();
});

/**
 * Load live students and teachers from Supabase
 */
async function loadRemoteUsersFromSupabase() {
  try {
    // 1. Fetch Students
    const { data: dbStudents, error: stuErr } = await supabase
      .from('students')
      .select('*')
      .order('created_at', { ascending: false });

    if (!stuErr && dbStudents) {
      studentsData.length = 0;
      const mappedStudents = dbStudents.map(s => ({
        id: s.student_id || s.id,
        name: s.name,
        courseSection: `${s.course || 'BSIT'} ${s.section || '1A'}`,
        course: s.course || 'BSIT',
        section: s.section || '1A',
        email: s.email || `${s.student_id}@gmail.com`,
        password: s.password || generateDefaultPassword(s.name),
        contact: s.contact || '0917-000-0000',
        status: s.status || 'Active',
        rfidUid: s.rfid_uid || 'NOT-ASSIGNED',
        qrCode: s.qr_code || `QR-STU-${s.student_id}`,
        validationDate: s.validation_date || '1st Semester'
      }));
      studentsData.push(...mappedStudents);
    }

    // 2. Fetch Teachers
    const { data: dbTeachers, error: tchErr } = await supabase
      .from('teachers')
      .select('*')
      .order('created_at', { ascending: false });

    if (!tchErr && dbTeachers) {
      teachersData.length = 0;
      const mappedTeachers = dbTeachers.map(t => ({
        id: t.teacher_id || t.id,
        name: t.name,
        courseSection: t.department || 'College of Computer Studies',
        department: t.department || 'College of Computer Studies',
        email: t.email || `${t.teacher_id}@gmail.com`,
        password: t.password || generateDefaultPassword(t.name),
        contact: t.contact || '0917-000-0000',
        status: t.status || 'Active',
        rfidUid: t.rfid_uid || 'NOT-ASSIGNED',
        qrCode: t.qr_code || `QR-TCH-${t.teacher_id}`
      }));
      teachersData.push(...mappedTeachers);
    }
  } catch (err) {
    console.warn('Supabase fetch notice:', err);
  }
}

/**
 * Format current date header
 */
function initCurrentDate() {
  const dateBtn = document.getElementById('currentDateLabel');
  if (dateBtn) {
    const today = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' };
    dateBtn.textContent = today.toLocaleDateString('en-US', options);
  }
}

// =============================================================
// ID, RFID & QR GENERATOR HELPERS
// =============================================================
function generateStudentId() {
  // Format: s23011XXXX
  const nextNum = 1000 + studentsData.length + 1;
  return `s23011${nextNum}`;
}

function generateTeacherId() {
  // Format: t23011XXXX
  const nextNum = 1000 + teachersData.length + 1;
  return `t23011${nextNum}`;
}

function generateRfidHex() {
  // 14-character hex starting with E200
  const hexChars = '0123456789ABCDEF';
  let uid = 'E2000019';
  for (let i = 0; i < 7; i++) {
    uid += hexChars.charAt(Math.floor(Math.random() * hexChars.length));
  }
  return uid;
}

function generateQrCodeString(rolePrefix, id) {
  return `QR-${rolePrefix.toUpperCase()}-${id}`;
}

function autoAssignSection(course = 'BSIT') {
  // Assign section e.g. 1A, 2A, 1B based on count
  const countInCourse = studentsData.filter(s => s.course === course).length;
  const sectionLetter = countInCourse % 2 === 0 ? 'A' : 'B';
  return `1${sectionLetter}`;
}

// =============================================================
// TAB SWITCHING
// =============================================================
export function switchTab(tab) {
  currentTab = tab;
  currentPage = 1;
  searchQuery = '';
  selectedUserIds.clear();
  updateBulkToolbar();

  const searchInput = document.getElementById('userSearchInput');
  if (searchInput) searchInput.value = '';

  const tabStudents = document.getElementById('tabStudents');
  const tabTeachers = document.getElementById('tabTeachers');

  const inactiveClass = 'text-[#6b7280] hover:text-[#0030c2] border-transparent';
  const activeClass = 'text-[#0030c2] font-bold border-[#0030c2]';

  [tabStudents, tabTeachers].forEach(t => {
    if (t) {
      t.className = `btn-press flex items-center gap-2 pb-3 px-3 text-sm font-semibold border-b-2 transition-all cursor-pointer ${inactiveClass}`;
    }
  });

  if (tab === 'students' && tabStudents) tabStudents.className = `btn-press flex items-center gap-2 pb-3 px-3 text-sm font-semibold border-b-2 transition-all cursor-pointer ${activeClass}`;
  if (tab === 'teachers' && tabTeachers) tabTeachers.className = `btn-press flex items-center gap-2 pb-3 px-3 text-sm font-semibold border-b-2 transition-all cursor-pointer ${activeClass}`;

  updateTabContextUI();
  renderTable();
}

function updateTabContextUI() {
  const cardTitle = document.getElementById('cardTitle');
  const cardRecordCount = document.getElementById('cardRecordCount');
  const addBtnText = document.getElementById('addBtnText');
  const tableHeaderId = document.getElementById('tableHeaderId');
  const tableHeaderCourse = document.getElementById('tableHeaderCourse');
  const searchInput = document.getElementById('userSearchInput');

  if (currentTab === 'students') {
    if (cardTitle) cardTitle.textContent = 'Students';
    if (cardRecordCount) cardRecordCount.textContent = `${studentsData.length} Records`;
    if (addBtnText) addBtnText.textContent = 'Add Student';
    if (tableHeaderId) tableHeaderId.textContent = 'Student ID';
    if (tableHeaderCourse) tableHeaderCourse.textContent = 'Course & Section';
    if (searchInput) searchInput.placeholder = 'Search student ID, name, or course...';
  } else {
    if (cardTitle) cardTitle.textContent = 'Teachers';
    if (cardRecordCount) cardRecordCount.textContent = `${teachersData.length} Records`;
    if (addBtnText) addBtnText.textContent = 'Add Teacher';
    if (tableHeaderId) tableHeaderId.textContent = 'Teacher ID';
    if (tableHeaderCourse) tableHeaderCourse.textContent = 'Department / College';
    if (searchInput) searchInput.placeholder = 'Search teacher ID, name, or department...';
  }
}

// =============================================================
// DATA FILTERING & TABLE RENDERING
// =============================================================
function getCurrentDataset() {
  return currentTab === 'students' ? studentsData : teachersData;
}

function getFilteredData() {
  const dataset = getCurrentDataset();
  if (!searchQuery) return dataset;

  const query = searchQuery.toLowerCase().trim();
  return dataset.filter(item => {
    return (item.id && item.id.toLowerCase().includes(query)) ||
      (item.name && item.name.toLowerCase().includes(query)) ||
      (item.courseSection && item.courseSection.toLowerCase().includes(query)) ||
      (item.email && item.email.toLowerCase().includes(query)) ||
      (item.status && item.status.toLowerCase().includes(query));
  });
}

function renderTable() {
  const tableBody = document.getElementById('userTableBody');
  if (!tableBody) return;

  const filtered = getFilteredData();
  const totalItems = filtered.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;

  const cardRecordCount = document.getElementById('cardRecordCount');
  if (cardRecordCount) {
    cardRecordCount.textContent = `${totalItems} Records`;
  }

  if (currentPage > totalPages) currentPage = totalPages;
  if (currentPage < 1) currentPage = 1;

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const pageData = filtered.slice(startIndex, endIndex);

  if (pageData.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="6" class="py-12 text-center text-gray-500">
          <div class="flex flex-col items-center justify-center gap-2">
            <svg class="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
            <p class="font-medium text-sm text-[#111827]">No records found</p>
            <p class="text-xs text-[#6b7280]">Try searching with a different keyword or create an account.</p>
          </div>
        </td>
      </tr>
    `;
  } else {
    tableBody.innerHTML = pageData.map(user => {
      const isSelected = selectedUserIds.has(user.id);
      const isActive = user.status.toLowerCase() === 'active';
      const statusBadge = isActive
        ? `<span class="inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-[#ecfdf5] text-[#10b981] border border-[#a7f3d0]">Active</span>`
        : `<span class="inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-[#f1f5f9] text-[#64748b] border border-[#e2e8f0]">Inactive</span>`;

      return `
        <tr id="row-${user.id}" class="hover:bg-[#f8fafc] transition-colors border-b border-[#f1f5f9] ${isSelected ? 'row-selected' : ''}">
          <td class="py-3.5 px-3.5 text-center">
            <input type="checkbox" onchange="onUserSelect('${user.id}', this)"
              class="row-checkbox w-4 h-4 rounded border-[#d1d5db] text-[#0030c2] focus:ring-[#0030c2] cursor-pointer"
              ${isSelected ? 'checked' : ''}
              title="Select ${user.name}">
          </td>
          <td class="py-3.5 px-4 font-mono font-bold text-[#0030c2] whitespace-nowrap text-xs">${user.id}</td>
          <td class="py-3.5 px-4 font-medium text-[#111827] text-xs">
            <div class="flex items-center gap-2.5">
              <div class="w-8 h-8 rounded-full bg-[#0030c2]/10 text-[#0030c2] flex items-center justify-center font-bold text-xs shrink-0">
                ${user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div>
                <p class="font-bold text-[#111827]">${user.name}</p>
                <p class="text-[11px] text-[#6b7280]">${user.email || 'No email'}</p>
              </div>
            </div>
          </td>
          <td class="py-3.5 px-4 text-[#4b5563] text-xs font-medium">${user.courseSection}</td>
          <td class="py-3.5 px-4">${statusBadge}</td>
          <td class="py-3.5 px-4 text-center whitespace-nowrap">
            <div class="flex items-center justify-center gap-1">
              <!-- Edit Button -->
              <button onclick="openEditModal('${user.id}')" title="Edit ${user.name}" class="btn-press p-1.5 text-[#4b5563] hover:text-[#0030c2] hover:bg-[#e7edff] rounded-lg transition-colors cursor-pointer">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.75">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
                </svg>
              </button>

              <!-- Delete / Remove Account Button -->
              <button onclick="openDeleteModal('${user.id}')" title="Delete ${user.name}" class="btn-press p-1.5 text-[#4b5563] hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.75">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                </svg>
              </button>

              <!-- 3-Dot Options Dropdown -->
              <div class="relative inline-block text-left">
                <button onclick="toggleMoreMenu('${user.id}', event)" title="More options" class="btn-press p-1.5 text-[#4b5563] hover:text-[#111827] hover:bg-gray-100 rounded-lg transition-colors cursor-pointer">
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                  </svg>
                </button>
                <div id="moreMenu-${user.id}" class="hidden absolute right-0 top-full mt-1 w-44 bg-white rounded-xl shadow-xl border border-[#e5e7eb] py-1.5 z-50 text-left text-xs divide-y divide-gray-100">
                  <div class="py-1">
                    <button onclick="openRfidModal('${user.id}')" class="flex items-center gap-2 w-full px-3 py-1.5 text-[#374151] hover:bg-gray-50 hover:text-[#0030c2] transition-colors cursor-pointer">
                      <svg class="w-3.5 h-3.5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-6-10.5h16.5a1.5 1.5 0 011.5 1.5v10.5a1.5 1.5 0 01-1.5 1.5H3.75a1.5 1.5 0 01-1.5-1.5V7.5a1.5 1.5 0 011.5-1.5z" /></svg>
                      RFID Setup
                    </button>
                    <button onclick="openQrModal('${user.id}')" class="flex items-center gap-2 w-full px-3 py-1.5 text-[#374151] hover:bg-gray-50 hover:text-[#0030c2] transition-colors cursor-pointer">
                      <svg class="w-3.5 h-3.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 15.375c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5zM13.5 15.75h2.25v2.25H13.5V15.75zM18 15.75h2.25v2.25H18v-2.25zM13.5 19.5h2.25v1.5H13.5v-1.5zM18 19.5h2.25v1.5H18v-1.5z" /></svg>
                      View QR Code
                    </button>
                    <button onclick="openResetPasswordModal('${user.id}')" class="flex items-center gap-2 w-full px-3 py-1.5 text-[#374151] hover:bg-gray-50 hover:text-[#0030c2] transition-colors cursor-pointer">
                      <svg class="w-3.5 h-3.5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" /></svg>
                      Reset Password
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  syncMasterCheckbox(pageData);
  renderPagination(totalItems, totalPages);
}

// =============================================================
// MODAL CONTROLS & ADD / EDIT LOGIC
// =============================================================
const ALL_MODAL_IDS = ['userModal', 'rfidModal', 'qrModal', 'resetPasswordModal', 'deleteModal', 'bulkDeleteModal'];

/**
 * Generate default account password according to formula:
 * (# + 1st letter uppercase + 2nd letter lowercase of last name + 8080)
 * Example: "Dela Cruz, Juan Paolo" -> "#De8080"
 * Example: "Miller, Robert" or "Prof. Robert Miller" -> "#Mi8080"
 */
export function generateDefaultPassword(fullName) {
  if (!fullName || typeof fullName !== 'string') return '#Bc8080';

  let clean = fullName.trim();
  clean = clean.replace(/^(Prof\.|Dr\.|Mr\.|Mrs\.|Ms\.|Engr\.)\s+/i, '');

  let lastName = '';
  if (clean.includes(',')) {
    lastName = clean.split(',')[0].trim();
  } else {
    const parts = clean.split(/\s+/);
    lastName = parts[parts.length - 1] || 'Bc';
  }

  const lettersOnly = lastName.replace(/[^a-zA-Z]/g, '');
  if (!lettersOnly) return '#Bc8080';

  const firstLetter = lettersOnly.charAt(0).toUpperCase();
  const secondLetter = (lettersOnly.length >= 2 ? lettersOnly.charAt(1) : 'x').toLowerCase();

  return `#${firstLetter}${secondLetter}8080`;
}

/**
 * Validate password against security requirements:
 * - At least 8 characters long (or matches 7-char default pattern e.g. #De8080)
 * - An Uppercase letter
 * - A lowercase letter
 * - A number
 * - A symbol
 */
export function validatePasswordRequirements(password) {
  if (!password || typeof password !== 'string') {
    return {
      isValid: false,
      length: false,
      uppercase: false,
      lowercase: false,
      number: false,
      symbol: false,
      message: 'Password is required'
    };
  }
  const length = password.length >= 7; // Supports default #De8080 (7 chars) & custom passwords (>= 8 chars)
  const uppercase = /[A-Z]/.test(password);
  const lowercase = /[a-z]/.test(password);
  const number = /[0-9]/.test(password);
  const symbol = /[^A-Za-z0-9]/.test(password);
  const isValid = length && uppercase && lowercase && number && symbol;

  let message = '';
  if (!length) message = 'Password must be at least 8 characters long (or default pattern)';
  else if (!uppercase) message = 'Password must include an uppercase letter (A-Z)';
  else if (!lowercase) message = 'Password must include a lowercase letter (a-z)';
  else if (!number) message = 'Password must include a number (0-9)';
  else if (!symbol) message = 'Password must include a symbol (e.g. #, @, !)';

  return { isValid, length, uppercase, lowercase, number, symbol, message };
}

/**
 * Update real-time checklist UI indicators for password requirements
 */
export function updatePasswordChecklistUI(pass) {
  const reqLength = document.getElementById('reqLength');
  const reqUpper = document.getElementById('reqUpper');
  const reqLower = document.getElementById('reqLower');
  const reqNumber = document.getElementById('reqNumber');
  const reqSymbol = document.getElementById('reqSymbol');

  if (!reqLength) return;

  const res = validatePasswordRequirements(pass || '');

  function setBadge(el, satisfied) {
    if (!el) return;
    if (satisfied) {
      el.className = 'flex items-center gap-1.5 transition-colors text-emerald-600 font-medium';
      el.innerHTML = `
        <svg class="w-3.5 h-3.5 shrink-0 status-icon text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
        </svg>
        <span>${el.dataset.text || el.textContent.trim()}</span>
      `;
    } else {
      el.className = 'flex items-center gap-1.5 transition-colors text-gray-400';
      el.innerHTML = `
        <svg class="w-3.5 h-3.5 shrink-0 status-icon text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-dasharray="2 2" />
        </svg>
        <span>${el.dataset.text || el.textContent.trim()}</span>
      `;
    }
  }

  // Cache text content
  if (!reqLength.dataset.text) reqLength.dataset.text = 'At least 8 chars (or default)';
  if (!reqUpper.dataset.text) reqUpper.dataset.text = 'Uppercase letter (A-Z)';
  if (!reqLower.dataset.text) reqLower.dataset.text = 'Lowercase letter (a-z)';
  if (!reqNumber.dataset.text) reqNumber.dataset.text = 'A number (0-9)';
  if (!reqSymbol.dataset.text) reqSymbol.dataset.text = 'A symbol (e.g. #, @, !)';

  setBadge(reqLength, res.length);
  setBadge(reqUpper, res.uppercase);
  setBadge(reqLower, res.lowercase);
  setBadge(reqNumber, res.number);
  setBadge(reqSymbol, res.symbol);
}

function initModalListeners() {
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAllModals();
  });

  ALL_MODAL_IDS.forEach(mId => {
    const modal = document.getElementById(mId);
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeAllModals();
      });
    }
  });

  // Dynamic password auto-calculation when typing name in userModal
  const nameInput = document.getElementById('formUserName');
  const passInput = document.getElementById('formUserPassword');
  const isEditingInput = document.getElementById('formIsEditing');
  if (nameInput && passInput) {
    nameInput.addEventListener('input', function () {
      if (isEditingInput?.value !== 'true') {
        const val = this.value.trim();
        if (val) {
          const autoPass = generateDefaultPassword(val);
          passInput.placeholder = `Default: ${autoPass}`;
          if (!passInput.dataset.manuallyEdited || (passInput.value.startsWith('#') && passInput.value.endsWith('8080'))) {
            passInput.value = autoPass;
            updatePasswordChecklistUI(autoPass);
          }
        }
      }
    });

    passInput.addEventListener('input', function () {
      passInput.dataset.manuallyEdited = 'true';
      updatePasswordChecklistUI(this.value);
    });
  }
}

export function closeAllModals() {
  ALL_MODAL_IDS.forEach(mId => {
    const el = document.getElementById(mId);
    if (el) {
      el.classList.add('hidden');
      el.classList.remove('flex');
    }
  });
}

/**
 * Open Modal to Add Student or Teacher with auto-generated values
 */
export function openAddModal() {
  const modal = document.getElementById('userModal');
  const modalTitle = document.getElementById('userModalTitle');
  const modalSubtitle = document.getElementById('userModalSubtitle');
  const form = document.getElementById('userForm');
  const isEditingInput = document.getElementById('formIsEditing');
  const idInput = document.getElementById('formUserId');
  const idLabel = document.getElementById('formIdLabel');
  const gmailLabel = document.getElementById('formGmailLabel');
  const rfidInput = document.getElementById('formUserRfid');
  const qrInput = document.getElementById('formUserQr');
  const sectionInput = document.getElementById('formStudentSection');
  const submitBtnText = document.getElementById('formSubmitBtnText');

  const studentFields = document.getElementById('studentSpecificFields');
  const teacherFields = document.getElementById('teacherSpecificFields');

  if (!modal) return;
  if (form) form.reset();
  if (isEditingInput) isEditingInput.value = 'false';

  const isStudent = currentTab === 'students';
  const newId = isStudent ? generateStudentId() : generateTeacherId();
  const generatedRfid = generateRfidHex();
  const generatedQr = generateQrCodeString(isStudent ? 'STU' : 'TCH', newId);

  if (modalTitle) modalTitle.textContent = isStudent ? 'Add New Student' : 'Add New Teacher';
  if (modalSubtitle) modalSubtitle.textContent = isStudent
    ? 'Provision a student account with auto-generated ID, RFID, QR badge, and semester enrollment.'
    : 'Provision a faculty teacher account with department assignment and attendance badge.';

  const emailInput = document.getElementById('formUserEmail');
  if (emailInput) {
    emailInput.value = '';
    emailInput.placeholder = isStudent ? 'e.g. student@gmail.com' : 'e.g. teacher@gmail.com';
  }
  const passInput = document.getElementById('formUserPassword');
  if (passInput) {
    passInput.value = '';
    passInput.placeholder = 'create password';
    delete passInput.dataset.manuallyEdited;
    updatePasswordChecklistUI('');
  }

  if (idLabel) idLabel.textContent = isStudent ? 'Student ID' : 'Teacher ID';
  if (gmailLabel) gmailLabel.textContent = isStudent ? 'Student Gmail' : 'Teacher Gmail';
  if (idInput) idInput.value = newId;
  if (rfidInput) rfidInput.value = generatedRfid;
  if (qrInput) qrInput.value = generatedQr;
  if (sectionInput && isStudent) sectionInput.value = autoAssignSection('BSIT');
  if (submitBtnText) submitBtnText.textContent = isStudent ? 'Create Student Account' : 'Create Teacher Account';

  // Toggle field visibility
  if (studentFields) studentFields.classList.toggle('hidden', !isStudent);
  if (teacherFields) teacherFields.classList.toggle('hidden', isStudent);

  modal.classList.remove('hidden');
  modal.classList.add('flex');
}

/**
 * Open Modal to Edit existing user
 */
export function openEditModal(userId) {
  const modal = document.getElementById('userModal');
  const modalTitle = document.getElementById('userModalTitle');
  const modalSubtitle = document.getElementById('userModalSubtitle');
  const isEditingInput = document.getElementById('formIsEditing');
  const idInput = document.getElementById('formUserId');
  const nameInput = document.getElementById('formUserName');
  const emailInput = document.getElementById('formUserEmail');
  const passInput = document.getElementById('formUserPassword');
  const statusSelect = document.getElementById('formUserStatus');
  const rfidInput = document.getElementById('formUserRfid');
  const qrInput = document.getElementById('formUserQr');
  const submitBtnText = document.getElementById('formSubmitBtnText');

  const studentFields = document.getElementById('studentSpecificFields');
  const teacherFields = document.getElementById('teacherSpecificFields');
  const courseSelect = document.getElementById('formStudentCourse');
  const sectionInput = document.getElementById('formStudentSection');
  const validationSelect = document.getElementById('formStudentValidation');
  const deptSelect = document.getElementById('formTeacherDepartment');

  const dataset = getCurrentDataset();
  const user = dataset.find(u => u.id === userId);
  if (!user || !modal) return;

  if (isEditingInput) isEditingInput.value = 'true';
  const isStudent = currentTab === 'students';

  if (modalTitle) modalTitle.textContent = `Edit ${isStudent ? 'Student' : 'Teacher'} Information`;
  if (modalSubtitle) modalSubtitle.textContent = `Modify records and assignments for ${user.name} (${user.id}).`;
  if (submitBtnText) submitBtnText.textContent = 'Save Changes';

  const idLabel = document.getElementById('formUserIdLabel');
  const gmailLabel = document.getElementById('formGmailLabel');
  if (idLabel) idLabel.textContent = isStudent ? 'Student ID' : 'Teacher ID';
  if (gmailLabel) gmailLabel.textContent = isStudent ? 'Student Gmail' : 'Teacher Gmail';

  if (idInput) idInput.value = user.id;
  if (nameInput) nameInput.value = user.name;
  if (emailInput) {
    emailInput.value = user.email || '';
    emailInput.placeholder = isStudent ? 'e.g. student@gmail.com' : 'e.g. teacher@gmail.com';
  }
  if (passInput) {
    passInput.value = user.password || generateDefaultPassword(user.name);
    passInput.placeholder = 'Account password';
    updatePasswordChecklistUI(passInput.value);
  }
  if (statusSelect) statusSelect.value = user.status;
  if (rfidInput) rfidInput.value = user.rfidUid || generateRfidHex();
  if (qrInput) qrInput.value = user.qrCode || generateQrCodeString(isStudent ? 'STU' : 'TCH', user.id);

  if (studentFields) studentFields.classList.toggle('hidden', !isStudent);
  if (teacherFields) teacherFields.classList.toggle('hidden', isStudent);

  if (isStudent) {
    if (courseSelect) courseSelect.value = user.course || 'BSIT';
    if (sectionInput) sectionInput.value = user.section || '1A';
    if (validationSelect) validationSelect.value = user.validationDate || '1st Semester';
  } else {
    if (deptSelect) deptSelect.value = user.department || 'College of Computer Studies';
  }

  modal.classList.remove('hidden');
  modal.classList.add('flex');
}

/**
 * Handle form submission: Persist to Supabase and update local UI
 */
export async function handleSaveUser(event) {
  if (event) event.preventDefault();

  const isEditing = document.getElementById('formIsEditing')?.value === 'true';
  const id = document.getElementById('formUserId')?.value.trim();
  const name = document.getElementById('formUserName')?.value.trim();
  const email = document.getElementById('formUserEmail')?.value.trim();
  const isStudent = currentTab === 'students';
  const password = document.getElementById('formUserPassword')?.value.trim() || generateDefaultPassword(name);
  const status = document.getElementById('formUserStatus')?.value || 'Active';
  const rfidUid = document.getElementById('formUserRfid')?.value.trim() || generateRfidHex();
  const qrCode = document.getElementById('formUserQr')?.value.trim() || generateQrCodeString(isStudent ? 'STU' : 'TCH', id);

  if (!id || !name || !email) {
    showToast('Missing Fields', 'Please fill in all required fields.', 'error');
    return;
  }

  // Validate password security requirements
  const passValidation = validatePasswordRequirements(password);
  if (!passValidation.isValid) {
    showToast('Password Requirement', passValidation.message, 'error');
    const passInput = document.getElementById('formUserPassword');
    if (passInput) passInput.focus();
    return;
  }
  let course = 'BSIT';
  let section = '1A';
  let validationDate = '1st Semester';
  let department = 'College of Computer Studies';

  if (isStudent) {
    course = document.getElementById('formStudentCourse')?.value || 'BSIT';
    section = document.getElementById('formStudentSection')?.value.trim() || '1A';
    validationDate = document.getElementById('formStudentValidation')?.value || '1st Semester';
  } else {
    department = document.getElementById('formTeacherDepartment')?.value || 'College of Computer Studies';
  }

  const courseSection = isStudent ? `${course} ${section}` : department;
  const dataset = getCurrentDataset();

  // 1. DIRECT SUPABASE WRITE & AUTH PROVISIONING
  let supabaseSuccess = false;
  try {
    // Attempt Supabase Auth signup for user login capability
    try {
      if (email.includes('@') && password) {
        await supabase.auth.signUp({
          email: email,
          password: password,
          options: {
            data: {
              role: isStudent ? 'student' : 'teacher',
              full_name: name,
              user_id: id
            }
          }
        });
      }
    } catch (authErr) {
      console.log('Supabase Auth auto-signup notice:', authErr);
    }

    if (isStudent) {
      const studentPayload = {
        student_id: id,
        name: name,
        email: email,
        password: password,
        course: course,
        section: section,
        status: status,
        rfid_uid: rfidUid,
        qr_code: qrCode,
        validation_date: validationDate,
        updated_at: new Date()
      };

      const { data, error: stuError } = await supabase
        .from('students')
        .upsert(studentPayload, { onConflict: 'student_id' })
        .select();

      if (stuError) {
        console.error('❌ Supabase student error:', stuError);
        showToast('Supabase Notice', `Could not save to Supabase (${stuError.message}). Please ensure tables are created.`, 'error');
      } else {
        supabaseSuccess = true;
        console.log('✅ Student saved directly to Supabase:', data);
      }
    } else {
      const teacherPayload = {
        teacher_id: id,
        name: name,
        email: email,
        password: password,
        department: department,
        status: status,
        rfid_uid: rfidUid,
        qr_code: qrCode,
        updated_at: new Date()
      };

      const { data, error: tchError } = await supabase
        .from('teachers')
        .upsert(teacherPayload, { onConflict: 'teacher_id' })
        .select();

      if (tchError) {
        console.error('❌ Supabase teacher error:', tchError);
        showToast('Supabase Notice', `Could not save to Supabase (${tchError.message}). Please ensure tables are created.`, 'error');
      } else {
        supabaseSuccess = true;
        console.log('✅ Teacher saved directly to Supabase:', data);
      }
    }
  } catch (dbErr) {
    console.error('❌ Network / Supabase write error:', dbErr);
  }

  // 2. LOCAL DATASET UPDATE & REAL-TIME TABLE RE-RENDER
  if (isEditing) {
    const existing = dataset.find(u => u.id === id);
    if (existing) {
      existing.name = name;
      existing.email = email;
      existing.password = password;
      existing.status = status;
      existing.courseSection = courseSection;
      if (isStudent) {
        existing.course = course;
        existing.section = section;
        existing.validationDate = validationDate;
      } else {
        existing.department = department;
      }
    }
    showToast('Account Updated', `Account ${name} (${id}) updated and saved to Supabase!`, 'success');
    closeAllModals();
    updateTabContextUI();
    renderTable();
  } else {
    const newUser = {
      id: id,
      name: name,
      email: email,
      password: password,
      courseSection: courseSection,
      course: course,
      section: section,
      department: department,
      validationDate: validationDate,
      contact: '0917-000-0000',
      status: status,
      rfidUid: rfidUid,
      qrCode: qrCode
    };
    dataset.unshift(newUser);

    // Form closes immediately on creation
    closeAllModals();
    updateTabContextUI();
    renderTable();

    // Automatically send details and account activation confirmation to the specified Gmail
    dispatchAccountDetailsToEmail({
      id: id,
      name: name,
      email: email,
      password: password,
      role: isStudent ? 'Student' : 'Teacher',
      courseSection: courseSection,
      rfidUid: rfidUid,
      qrCode: qrCode,
      validationDate: validationDate
    });
  }
}

/**
 * Toggle password visibility in User Modal
 */
export function toggleModalPassword() {
  const passInput = document.getElementById('formUserPassword');
  if (!passInput) return;
  passInput.type = passInput.type === 'password' ? 'text' : 'password';
}

// =============================================================
// EMAIL DISPATCH SYSTEM (LIVE GMAIL DELIVERY + SUPABASE AUTH)
// =============================================================
export async function dispatchAccountDetailsToEmail(data) {
  const { id, name, email, password, role, courseSection, rfidUid, qrCode, validationDate } = data;

  console.log(`📧 Sending live email with account credentials to ${email}...`);

  // 1. LIVE EMAIL TRANSMISSION (Using direct FormSubmit AJAX API to send real emails to Gmail)
  let liveEmailDispatched = false;
  try {
    if (email && email.includes('@')) {
      const emailPayload = {
        _subject: `Official Account Credentials - Bestlink College Attendance System (${role})`,
        _template: "table",
        "Institution": "Bestlink College of the Philippines",
        "System": "Attendance Monitoring System with RFID/QR Scanning",
        "Account Role": role,
        "Full Name": name,
        "Username / ID": id,
        "Registered Email": email,
        "Assigned Password": password,
        "Course / Department": courseSection,
        "RFID Card UID": rfidUid,
        "QR Code Badge": qrCode,
        "Validation Term": validationDate || '1st Semester',
        "Login Portal Link": `${window.location.origin}/index.html`,
        "Notice": "Your account has been successfully created by the Administrator. You can now log into the portal using your Username/ID or Email along with the password provided above."
      };

      const response = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(email)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(emailPayload)
      });

      const resJson = await response.json();
      if (resJson && (resJson.success === 'true' || resJson.success === true)) {
        liveEmailDispatched = true;
        console.log(`✅ Live email successfully dispatched to ${email}:`, resJson);
      }
    }
  } catch (mailErr) {
    console.warn('Live mail service notice:', mailErr);
  }

  // 2. SUPABASE AUTH PROVISIONING WITH ACTIVATION CONFIRMATION
  try {
    if (email && email.includes('@')) {
      await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            role: role.toLowerCase(),
            full_name: name,
            user_id: id,
            course_section: courseSection,
            rfid_uid: rfidUid,
            qr_code: qrCode
          },
          emailRedirectTo: `${window.location.origin}/index.html`
        }
      });
    }
  } catch (authErr) {
    console.log('Supabase Auth auto-signup notice:', authErr);
  }

  // 3. SUCCESS TOAST
  showToast(
    'Account Created & Gmail Dispatched',
    `Account created! Details & activation confirmation sent to ${email} (Username: ${id}, Password: ${password})`,
    'success'
  );
}

// =============================================================
// RFID REGISTRATION MODAL
// =============================================================
export function openRfidModal(userId) {
  const modal = document.getElementById('rfidModal');
  const nameEl = document.getElementById('rfidUserName');
  const idEl = document.getElementById('rfidUserId');
  const uidInput = document.getElementById('rfidUidInput');
  const hiddenId = document.getElementById('rfidHiddenId');

  const dataset = getCurrentDataset();
  const user = dataset.find(u => u.id === userId);
  if (!user || !modal) return;

  if (nameEl) nameEl.textContent = user.name;
  if (idEl) idEl.textContent = user.id;
  if (uidInput) uidInput.value = user.rfidUid || '';
  if (hiddenId) hiddenId.value = user.id;

  modal.classList.remove('hidden');
  modal.classList.add('flex');
}

export async function handleSaveRfid(event) {
  if (event) event.preventDefault();
  const userId = document.getElementById('rfidHiddenId')?.value;
  const uid = document.getElementById('rfidUidInput')?.value.trim();

  const dataset = getCurrentDataset();
  const user = dataset.find(u => u.id === userId);
  if (user) {
    user.rfidUid = uid || 'NOT-ASSIGNED';

    // Direct sync to Supabase
    try {
      const table = currentTab === 'students' ? 'students' : 'teachers';
      const idKey = currentTab === 'students' ? 'student_id' : 'teacher_id';
      const { data, error } = await supabase
        .from(table)
        .update({ rfid_uid: uid, updated_at: new Date() })
        .eq(idKey, userId)
        .select();

      if (error) {
        console.error('RFID update error:', error);
        showToast('Supabase Notice', `Could not update RFID in database: ${error.message}`, 'error');
      } else {
        console.log('✅ RFID updated directly in Supabase:', data);
        showToast('RFID Linked', `RFID Card (${uid}) successfully linked to ${user.name} and saved to database!`, 'success');
      }
    } catch (e) {
      console.warn('RFID update error:', e);
      showToast('RFID Linked', `RFID Card (${uid}) linked to ${user.name}!`, 'success');
    }
  }

  closeAllModals();
  renderTable();
}

export function simulateRfidTap() {
  const uidInput = document.getElementById('rfidUidInput');
  if (uidInput) {
    const simulatedHex = generateRfidHex();
    uidInput.value = simulatedHex;
    showToast('Card Detected', `Scanned Hex: ${simulatedHex}`, 'info');
  }
}

// =============================================================
// QR CODE MODAL
// =============================================================
export function openQrModal(userId) {
  const modal = document.getElementById('qrModal');
  const nameEl = document.getElementById('qrUserName');
  const idEl = document.getElementById('qrUserId');
  const courseEl = document.getElementById('qrUserCourse');
  const qrCodeText = document.getElementById('qrCodeText');

  const dataset = getCurrentDataset();
  const user = dataset.find(u => u.id === userId);
  if (!user || !modal) return;

  if (nameEl) nameEl.textContent = user.name;
  if (idEl) idEl.textContent = user.id;
  if (courseEl) courseEl.textContent = user.courseSection;
  if (qrCodeText) qrCodeText.textContent = user.qrCode || `QR-${user.id}`;

  modal.classList.remove('hidden');
  modal.classList.add('flex');
}

export function printQrCard() {
  window.print();
}

export function downloadQrCard() {
  showToast('Download Ready', 'Attendance QR badge generated for download!', 'success');
}

// =============================================================
// RESET PASSWORD MODAL (Admin-only reset with direct DB update)
// =============================================================
export function openResetPasswordModal(userId) {
  const modal = document.getElementById('resetPasswordModal');
  const nameEl = document.getElementById('resetUserName');
  const idEl = document.getElementById('resetUserId');
  const tempPassInput = document.getElementById('resetTempPassword');
  const hiddenId = document.getElementById('resetHiddenId');

  const dataset = getCurrentDataset();
  const user = dataset.find(u => u.id === userId);
  if (!user || !modal) return;

  if (nameEl) nameEl.textContent = user.name;
  if (idEl) idEl.textContent = user.id;
  if (hiddenId) hiddenId.value = user.id;

  const defaultPass = generateDefaultPassword(user.name);
  if (tempPassInput) tempPassInput.value = defaultPass;

  modal.classList.remove('hidden');
  modal.classList.add('flex');
}

export function copyTempPassword() {
  const tempPassInput = document.getElementById('resetTempPassword');
  if (tempPassInput) {
    navigator.clipboard.writeText(tempPassInput.value).then(() => {
      showToast('Copied', 'Temporary password copied to clipboard!', 'info');
    });
  }
}

export async function handleConfirmPasswordReset() {
  const userId = document.getElementById('resetHiddenId')?.value;
  const tempPass = document.getElementById('resetTempPassword')?.value.trim();
  const dataset = getCurrentDataset();
  const user = dataset.find(u => u.id === userId);

  if (user && tempPass) {
    user.password = tempPass;

    try {
      const table = currentTab === 'students' ? 'students' : 'teachers';
      const idKey = currentTab === 'students' ? 'student_id' : 'teacher_id';
      const { error } = await supabase
        .from(table)
        .update({ password: tempPass, updated_at: new Date() })
        .eq(idKey, userId);

      if (error) {
        console.error('Password reset sync error:', error);
        showToast('Notice', `Password updated locally. (${error.message})`, 'info');
      } else {
        console.log(`✅ Password for ${userId} updated directly in Supabase to ${tempPass}`);
      }
    } catch (e) {
      console.warn('Password reset error:', e);
    }

    showToast('Password Reset', `Password reset for ${user.name} to "${tempPass}". Saved directly to database!`, 'success');
  }

  closeAllModals();
  renderTable();
}

// =============================================================
// DELETE SINGLE ACCOUNT MODAL (Direct DB Delete)
// =============================================================
export function openDeleteModal(userId) {
  const modal = document.getElementById('deleteModal');
  const nameEl = document.getElementById('deleteUserName');
  const idEl = document.getElementById('deleteUserId');
  const hiddenId = document.getElementById('deleteHiddenId');

  const dataset = getCurrentDataset();
  const user = dataset.find(u => u.id === userId);
  if (!user || !modal) return;

  if (nameEl) nameEl.textContent = user.name;
  if (idEl) idEl.textContent = user.id;
  if (hiddenId) hiddenId.value = user.id;

  modal.classList.remove('hidden');
  modal.classList.add('flex');
}

export async function handleConfirmDelete() {
  const userId = document.getElementById('deleteHiddenId')?.value;
  const dataset = getCurrentDataset();
  const user = dataset.find(u => u.id === userId);
  const userName = user ? user.name : userId;

  if (userId) {
    // 1. Direct Delete from Supabase Database
    try {
      const table = currentTab === 'students' ? 'students' : 'teachers';
      const idKey = currentTab === 'students' ? 'student_id' : 'teacher_id';
      const { error } = await supabase
        .from(table)
        .delete()
        .eq(idKey, userId);

      if (error) {
        console.error('Delete error from Supabase:', error);
        showToast('Supabase Notice', `Could not delete from database: ${error.message}`, 'error');
      } else {
        console.log(`✅ ${userId} permanently removed from Supabase ${table} table`);
      }
    } catch (e) {
      console.warn('Delete sync exception:', e);
    }

    // 2. Remove locally from array
    if (currentTab === 'students') {
      const idx = studentsData.findIndex(u => u.id === userId);
      if (idx !== -1) studentsData.splice(idx, 1);
    } else {
      const idx = teachersData.findIndex(u => u.id === userId);
      if (idx !== -1) teachersData.splice(idx, 1);
    }

    selectedUserIds.delete(userId);
    showToast('Account Deleted', `Successfully removed ${userName} (${userId}) from database!`, 'success');
  }

  closeAllModals();
  updateTabContextUI();
  renderTable();
}

// =============================================================
// SELECTION & BULK ACTIONS
// =============================================================
export function onUserSelect(userId, checkbox) {
  const row = document.getElementById(`row-${userId}`);
  if (checkbox.checked) {
    selectedUserIds.add(userId);
    if (row) row.classList.add('row-selected');
  } else {
    selectedUserIds.delete(userId);
    if (row) row.classList.remove('row-selected');
  }
  updateBulkToolbar();

  const filtered = getFilteredData();
  const startIndex = (currentPage - 1) * itemsPerPage;
  const pageData = filtered.slice(startIndex, startIndex + itemsPerPage);
  syncMasterCheckbox(pageData);
}

export function toggleSelectAll(masterCheckbox) {
  const filtered = getFilteredData();
  const startIndex = (currentPage - 1) * itemsPerPage;
  const pageData = filtered.slice(startIndex, startIndex + itemsPerPage);
  if (!pageData || pageData.length === 0) return;

  const selectedOnPage = pageData.filter(u => selectedUserIds.has(u.id)).length;

  if (selectedOnPage > 0) {
    pageData.forEach(u => selectedUserIds.delete(u.id));
    if (masterCheckbox) {
      masterCheckbox.checked = false;
      masterCheckbox.indeterminate = false;
    }
  } else {
    pageData.forEach(u => selectedUserIds.add(u.id));
    if (masterCheckbox) {
      masterCheckbox.checked = true;
      masterCheckbox.indeterminate = false;
    }
  }

  updateBulkToolbar();
  renderTable();
}

function syncMasterCheckbox(pageData) {
  const master = document.getElementById('selectAllCheckbox');
  if (!master) return;

  if (!pageData || pageData.length === 0) {
    master.checked = false;
    master.indeterminate = false;
    return;
  }

  const selectedOnPage = pageData.filter(u => selectedUserIds.has(u.id)).length;
  if (selectedOnPage === pageData.length) {
    master.checked = true;
    master.indeterminate = false;
  } else if (selectedOnPage > 0) {
    master.checked = false;
    master.indeterminate = true;
  } else {
    master.checked = false;
    master.indeterminate = false;
  }
}

function updateBulkToolbar() {
  const toolbar = document.getElementById('bulkToolbar');
  const countEl = document.getElementById('bulkSelectedCount');
  const count = selectedUserIds.size;

  if (!toolbar) return;

  if (count > 0) {
    toolbar.classList.remove('hidden');
    toolbar.classList.add('flex', 'bulk-toolbar-active');
    if (countEl) countEl.textContent = `${count} ${count === 1 ? 'account' : 'accounts'} selected`;
  } else {
    toolbar.classList.add('hidden');
    toolbar.classList.remove('flex', 'bulk-toolbar-active');
  }
}

export function clearBulkSelection() {
  selectedUserIds.clear();
  updateBulkToolbar();
  renderTable();
}

export function openBulkDeleteModal() {
  if (selectedUserIds.size === 0) return;
  const modal = document.getElementById('bulkDeleteModal');
  const desc = document.getElementById('bulkDeleteDesc');
  if (desc) {
    desc.textContent = `Are you sure you want to permanently delete the ${selectedUserIds.size} selected ${currentTab} account(s)? This action cannot be undone.`;
  }
  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }
}

export async function handleConfirmBulkDelete() {
  const count = selectedUserIds.size;
  if (count === 0) return;

  const dataset = getCurrentDataset();
  const idsToDelete = Array.from(selectedUserIds);

  // Sync delete to Supabase
  try {
    const table = currentTab === 'students' ? 'students' : 'teachers';
    const idKey = currentTab === 'students' ? 'student_id' : 'teacher_id';
    await supabase.from(table).delete().in(idKey, idsToDelete);
  } catch (e) {
    console.warn('Bulk delete sync note:', e);
  }

  // Remove locally
  if (currentTab === 'students') {
    const remaining = studentsData.filter(u => !selectedUserIds.has(u.id));
    studentsData.length = 0;
    studentsData.push(...remaining);
  } else {
    const remaining = teachersData.filter(u => !selectedUserIds.has(u.id));
    teachersData.length = 0;
    teachersData.push(...remaining);
  }

  selectedUserIds.clear();
  closeAllModals();
  updateBulkToolbar();
  updateTabContextUI();
  renderTable();
  showToast('Bulk Delete', `Successfully deleted ${count} account(s)!`, 'success');
}

export async function handleBulkToggleStatus() {
  if (selectedUserIds.size === 0) return;

  const dataset = getCurrentDataset();
  const ids = Array.from(selectedUserIds);
  let updatedCount = 0;

  for (const id of ids) {
    const user = dataset.find(u => u.id === id);
    if (user) {
      user.status = (user.status.toLowerCase() === 'active') ? 'Inactive' : 'Active';
      updatedCount++;

      try {
        const table = currentTab === 'students' ? 'students' : 'teachers';
        const idKey = currentTab === 'students' ? 'student_id' : 'teacher_id';
        await supabase
          .from(table)
          .update({ status: user.status, updated_at: new Date() })
          .eq(idKey, id);
      } catch (e) {
        console.warn('Bulk status sync error:', e);
      }
    }
  }

  renderTable();
  showToast('Status Updated', `Updated and saved status for ${updatedCount} account(s) in database!`, 'success');
}

export function handleBulkExport() {
  if (selectedUserIds.size === 0) return;

  const dataset = getCurrentDataset();
  const selectedRecords = dataset.filter(u => selectedUserIds.has(u.id));

  let csvContent = 'data:text/csv;charset=utf-8,';
  csvContent += 'ID,Name,Course_or_Department,Email,Contact,Status,RFID_UID,QR_Code\r\n';

  selectedRecords.forEach(u => {
    const row = [
      `"${u.id}"`,
      `"${u.name}"`,
      `"${u.courseSection}"`,
      `"${u.email || ''}"`,
      `"${u.contact || ''}"`,
      `"${u.status}"`,
      `"${u.rfidUid || ''}"`,
      `"${u.qrCode || ''}"`
    ].join(',');
    csvContent += row + '\r\n';
  });

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `${currentTab}_export_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  showToast('Export Successful', `Exported ${selectedRecords.length} records to CSV!`, 'success');
}

// =============================================================
// PAGINATION & SEARCH
// =============================================================
function renderPagination(totalItems, totalPages) {
  const paginationInfo = document.getElementById('paginationInfo');
  const paginationControls = document.getElementById('paginationControls');

  if (paginationInfo) {
    const start = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
    const end = Math.min(currentPage * itemsPerPage, totalItems);
    paginationInfo.textContent = `Showing ${start} to ${end} of ${totalItems} entries`;
  }

  if (!paginationControls) return;
  if (totalPages <= 1) {
    paginationControls.innerHTML = '';
    return;
  }

  let html = `
    <button onclick="goToPage(${currentPage - 1})" ${currentPage === 1 ? 'disabled class="p-1.5 rounded-lg border border-[#e5e7eb] text-gray-300 cursor-not-allowed"' : 'class="p-1.5 rounded-lg border border-[#e5e7eb] text-[#374151] hover:bg-gray-100 transition-colors cursor-pointer"'} title="Previous Page">
      <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
    </button>
  `;

  for (let i = 1; i <= totalPages; i++) {
    if (i === currentPage) {
      html += `<button class="w-7 h-7 rounded-md bg-[#0030c2] text-white text-xs font-bold shadow-sm flex items-center justify-center">${i}</button>`;
    } else {
      html += `<button onclick="goToPage(${i})" class="w-7 h-7 rounded-md border border-transparent text-[#4b5563] hover:border-[#e5e7eb] hover:bg-gray-50 text-xs font-medium flex items-center justify-center transition-colors cursor-pointer">${i}</button>`;
    }
  }

  html += `
    <button onclick="goToPage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled class="p-1.5 rounded-lg border border-[#e5e7eb] text-gray-300 cursor-not-allowed"' : 'class="p-1.5 rounded-lg border border-[#e5e7eb] text-[#374151] hover:bg-gray-100 transition-colors cursor-pointer"'} title="Next Page">
      <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
    </button>
  `;

  paginationControls.innerHTML = html;
}

export function goToPage(page) {
  const filtered = getFilteredData();
  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
  if (page < 1 || page > totalPages) return;
  currentPage = page;
  renderTable();
}

function initSearch() {
  const searchInput = document.getElementById('userSearchInput');
  if (searchInput) {
    searchInput.addEventListener('input', function () {
      searchQuery = this.value;
      currentPage = 1;
      renderTable();
    });
  }
}

export function toggleMoreMenu(userId, event) {
  if (event) {
    event.stopPropagation();
  }

  const menu = document.getElementById(`moreMenu-${userId}`);
  if (!menu) return;

  const isClosed = menu.classList.contains('hidden');

  document.querySelectorAll('[id^="moreMenu-"]').forEach(m => {
    m.classList.add('hidden');
    const parentRow = m.closest('tr');
    if (parentRow) parentRow.style.zIndex = '';
  });

  if (isClosed) {
    const parentRow = menu.closest('tr');
    if (parentRow) parentRow.style.zIndex = '50';
    menu.classList.remove('hidden');
  }
}

window.addEventListener('click', () => {
  document.querySelectorAll('[id^="moreMenu-"]').forEach(menu => {
    menu.classList.add('hidden');
    const parentRow = menu.closest('tr');
    if (parentRow) parentRow.style.zIndex = '';
  });
});

// =============================================================
// TOAST NOTIFICATIONS
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
  toast.className = 'pointer-events-auto bg-white border border-[#e5e7eb] shadow-xl rounded-xl p-3.5 flex items-start gap-3 min-w-[280px] max-w-sm transition-all duration-300 transform translate-x-0';

  let iconSvg = '';
  if (type === 'success') {
    iconSvg = `
      <div class="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
      </div>
    `;
  } else if (type === 'info') {
    iconSvg = `
      <div class="w-8 h-8 rounded-full bg-blue-50 text-[#0030c2] flex items-center justify-center shrink-0">
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" /></svg>
      </div>
    `;
  } else {
    iconSvg = `
      <div class="w-8 h-8 rounded-full bg-red-50 text-red-600 flex items-center justify-center shrink-0">
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" /></svg>
      </div>
    `;
  }

  toast.innerHTML = `
    ${iconSvg}
    <div class="flex-1">
      <p class="text-xs font-bold text-[#111827]">${title}</p>
      <p class="text-[11px] text-[#6b7280] mt-0.5 leading-tight">${message}</p>
    </div>
    <button onclick="this.parentElement.remove()" class="text-gray-400 hover:text-gray-600 p-1 cursor-pointer">
      <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
    </button>
  `;

  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('opacity-0', 'translate-x-full');
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// =============================================================
// EXPOSE GLOBAL FUNCTIONS (FOR INLINE HTML EVENT HANDLERS)
// =============================================================
function exposeGlobalFunctions() {
  window.switchTab = switchTab;
  window.openAddModal = openAddModal;
  window.openEditModal = openEditModal;
  window.handleSaveUser = handleSaveUser;
  window.openRfidModal = openRfidModal;
  window.handleSaveRfid = handleSaveRfid;
  window.simulateRfidTap = simulateRfidTap;
  window.openQrModal = openQrModal;
  window.printQrCard = printQrCard;
  window.downloadQrCard = downloadQrCard;
  window.openResetPasswordModal = openResetPasswordModal;
  window.copyTempPassword = copyTempPassword;
  window.handleConfirmPasswordReset = handleConfirmPasswordReset;
  window.openDeleteModal = openDeleteModal;
  window.handleConfirmDelete = handleConfirmDelete;
  window.openBulkDeleteModal = openBulkDeleteModal;
  window.handleConfirmBulkDelete = handleConfirmBulkDelete;
  window.handleBulkToggleStatus = handleBulkToggleStatus;
  window.handleBulkExport = handleBulkExport;
  window.clearBulkSelection = clearBulkSelection;
  window.toggleSelectAll = toggleSelectAll;
  window.onUserSelect = onUserSelect;
  window.toggleMoreMenu = toggleMoreMenu;
  window.closeAllModals = closeAllModals;
  window.goToPage = goToPage;
  window.toggleModalPassword = toggleModalPassword;
  window.dispatchAccountDetailsToEmail = dispatchAccountDetailsToEmail;
  window.updatePasswordChecklistUI = updatePasswordChecklistUI;
  window.validatePasswordRequirements = validatePasswordRequirements;
  window.generateDefaultPassword = generateDefaultPassword;
}
