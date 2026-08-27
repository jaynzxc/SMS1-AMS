// assets/js/user-management.js
// User Management Interactive Functionality

let currentTab = 'students';
let currentPage = 1;
const itemsPerPage = 10;
let searchQuery = '';
let searchField = 'id';
let selectedUserIds = new Set();


// =============================================================
// MOCK DATASETS
// =============================================================
const studentsData = [
  { id: '2024-1001', name: 'Dela Cruz, Juan Paolo', courseSection: 'BSIT 2A', email: 'juan.delacruz@school.edu.ph', contact: '0917-123-4567', status: 'Active', rfidUid: 'E20000192803001', qrCode: 'QR-STU-2024-1001' },
  { id: '2024-1002', name: 'Santos, Maria Isabelle', courseSection: 'BSBA 2B', email: 'maria.santos@school.edu.ph', contact: '0918-234-5678', status: 'Active', rfidUid: 'E20000192803002', qrCode: 'QR-STU-2024-1002' },
  { id: '2024-1003', name: 'Reyes, Anna Mae', courseSection: 'BSCS 2A', email: 'anna.reyes@school.edu.ph', contact: '0919-345-6789', status: 'Active', rfidUid: 'E20000192803003', qrCode: 'QR-STU-2024-1003' },
  { id: '2024-1004', name: 'Garcia, Miguel Angelo', courseSection: 'BSIT 2B', email: 'miguel.garcia@school.edu.ph', contact: '0920-456-7890', status: 'Inactive', rfidUid: 'E20000192803004', qrCode: 'QR-STU-2024-1004' },
  { id: '2024-1005', name: 'Rivera, Louisse', courseSection: 'BSA 2A', email: 'louisse.rivera@school.edu.ph', contact: '0921-567-8901', status: 'Active', rfidUid: 'E20000192803005', qrCode: 'QR-STU-2024-1005' },
  { id: '2024-1006', name: 'Lim, Kenneth John', courseSection: 'BSIT 2A', email: 'kenneth.lim@school.edu.ph', contact: '0922-678-9012', status: 'Active', rfidUid: 'E20000192803006', qrCode: 'QR-STU-2024-1006' },
  { id: '2024-1007', name: 'Torres, Nicole', courseSection: 'BSBA 2A', email: 'nicole.torres@school.edu.ph', contact: '0923-789-0123', status: 'Inactive', rfidUid: 'E20000192803007', qrCode: 'QR-STU-2024-1007' },
  { id: '2024-1008', name: 'Castillo, Adrian', courseSection: 'BSCS 2B', email: 'adrian.castillo@school.edu.ph', contact: '0924-890-1234', status: 'Active', rfidUid: 'E20000192803008', qrCode: 'QR-STU-2024-1008' },
  { id: '2024-1009', name: 'Mendoza, Erica Mae', courseSection: 'BSIT 2A', email: 'erica.mendoza@school.edu.ph', contact: '0925-901-2345', status: 'Active', rfidUid: 'E20000192803009', qrCode: 'QR-STU-2024-1009' },
  { id: '2024-1010', name: 'Ramos, Carlo', courseSection: 'BSA 2B', email: 'carlo.ramos@school.edu.ph', contact: '0926-012-3456', status: 'Active', rfidUid: 'E20000192803010', qrCode: 'QR-STU-2024-1010' },
  { id: '2024-1011', name: 'Aquino, Bea Clarisse', courseSection: 'BSIT 3A', email: 'bea.aquino@school.edu.ph', contact: '0927-111-2222', status: 'Active', rfidUid: 'E20000192803011', qrCode: 'QR-STU-2024-1011' },
  { id: '2024-1012', name: 'Villanueva, Mark Lester', courseSection: 'BSCS 3B', email: 'mark.villanueva@school.edu.ph', contact: '0928-222-3333', status: 'Active', rfidUid: 'E20000192803012', qrCode: 'QR-STU-2024-1012' },
  { id: '2024-1013', name: 'Bautista, Chloe Andrea', courseSection: 'BSBA 3A', email: 'chloe.bautista@school.edu.ph', contact: '0929-333-4444', status: 'Active', rfidUid: 'E20000192803013', qrCode: 'QR-STU-2024-1013' },
  { id: '2024-1014', name: 'Gonzales, Ralph Dave', courseSection: 'BSIT 1A', email: 'ralph.gonzales@school.edu.ph', contact: '0930-444-5555', status: 'Inactive', rfidUid: 'E20000192803014', qrCode: 'QR-STU-2024-1014' },
  { id: '2024-1015', name: 'Navarro, Sofia Marie', courseSection: 'BSA 1B', email: 'sofia.navarro@school.edu.ph', contact: '0931-555-6666', status: 'Active', rfidUid: 'E20000192803015', qrCode: 'QR-STU-2024-1015' },
  { id: '2024-1016', name: 'Corpuz, Christian Paul', courseSection: 'BSCS 1A', email: 'christian.corpuz@school.edu.ph', contact: '0932-666-7777', status: 'Active', rfidUid: 'E20000192803016', qrCode: 'QR-STU-2024-1016' }
];

// Fill up to mock total 125 students
for (let i = 17; i <= 125; i++) {
  const paddedId = '2024-' + (1000 + i);
  const courses = ['BSIT 2A', 'BSCS 2B', 'BSBA 2A', 'BSA 2B', 'BSIT 3B', 'BSCS 1B'];
  const lastNames = ['Cruz', 'Valdez', 'Morales', 'Perez', 'Tan', 'Alvarez', 'Mercado', 'Flores', 'Salazar', 'Domingo'];
  const firstNames = ['Joshua', 'Patricia', 'Daniel', 'Alyssa', 'Kevin', 'Andrea', 'Gabriel', 'Katrina', 'Justin', 'Samantha'];
  const randomLast = lastNames[i % lastNames.length];
  const randomFirst = firstNames[i % firstNames.length];
  const randomCourse = courses[i % courses.length];
  const status = (i % 7 === 0) ? 'Inactive' : 'Active';

  studentsData.push({
    id: paddedId,
    name: `${randomLast}, ${randomFirst}`,
    courseSection: randomCourse,
    email: `${randomFirst.toLowerCase()}.${randomLast.toLowerCase()}@school.edu.ph`,
    contact: `09${Math.floor(100000000 + Math.random() * 900000000).toString().substring(0, 9)}`,
    status: status,
    rfidUid: `E20000192803${i.toString().padStart(3, '0')}`,
    qrCode: `QR-STU-${paddedId}`
  });
}

const teachersData = [
  { id: 'TCH-2024-001', name: 'Dr. Sarah Jenkins', courseSection: 'College of Computer Studies', email: 'sarah.jenkins@school.edu.ph', contact: '0917-555-1001', status: 'Active', rfidUid: 'E20000192900001', qrCode: 'QR-TCH-001' },
  { id: 'TCH-2024-002', name: 'Prof. Robert Miller', courseSection: 'College of Business Administration', email: 'robert.miller@school.edu.ph', contact: '0917-555-1002', status: 'Active', rfidUid: 'E20000192900002', qrCode: 'QR-TCH-002' },
  { id: 'TCH-2024-003', name: 'Ms. Emily Davis', courseSection: 'College of Computer Studies', email: 'emily.davis@school.edu.ph', contact: '0917-555-1003', status: 'Active', rfidUid: 'E20000192900003', qrCode: 'QR-TCH-003' },
  { id: 'TCH-2024-004', name: 'Mr. Michael Chang', courseSection: 'College of Accountancy', email: 'michael.chang@school.edu.ph', contact: '0917-555-1004', status: 'Active', rfidUid: 'E20000192900004', qrCode: 'QR-TCH-004' },
  { id: 'TCH-2024-005', name: 'Engr. David Wilson', courseSection: 'College of Engineering', email: 'david.wilson@school.edu.ph', contact: '0917-555-1005', status: 'Active', rfidUid: 'E20000192900005', qrCode: 'QR-TCH-005' },
  { id: 'TCH-2024-006', name: 'Prof. Maria Santos-Cruz', courseSection: 'College of Arts & Sciences', email: 'maria.cruz@school.edu.ph', contact: '0917-555-1006', status: 'Inactive', rfidUid: 'E20000192900006', qrCode: 'QR-TCH-006' },
  { id: 'TCH-2024-007', name: 'Dr. Leonardo Gomez', courseSection: 'College of Computer Studies', email: 'leonardo.gomez@school.edu.ph', contact: '0917-555-1007', status: 'Active', rfidUid: 'E20000192900007', qrCode: 'QR-TCH-007' },
  { id: 'TCH-2024-008', name: 'Ms. Rachel Bennett', courseSection: 'College of Business Administration', email: 'rachel.bennett@school.edu.ph', contact: '0917-555-1008', status: 'Active', rfidUid: 'E20000192900008', qrCode: 'QR-TCH-008' }
];

for (let i = 9; i <= 48; i++) {
  const paddedId = 'TCH-2024-' + i.toString().padStart(3, '0');
  const depts = ['College of Computer Studies', 'College of Business Administration', 'College of Accountancy', 'College of Arts & Sciences'];
  teachersData.push({
    id: paddedId,
    name: `Faculty Member, Staff ${i}`,
    courseSection: depts[i % depts.length],
    email: `faculty.${i}@school.edu.ph`,
    contact: `0917-555-${1000 + i}`,
    status: (i % 8 === 0) ? 'Inactive' : 'Active',
    rfidUid: `E200001929000${i.toString().padStart(2, '0')}`,
    qrCode: `QR-TCH-${paddedId}`
  });
}

// =============================================================
// INITIALIZATION
// =============================================================
document.addEventListener('DOMContentLoaded', function () {
  renderTable();
  initSearch();
  initModalListeners();
});

// =============================================================
// TAB SWITCHING
// =============================================================
function switchTab(tab) {
  currentTab = tab;
  currentPage = 1;
  searchQuery = '';
  selectedUserIds.clear();
  updateBulkToolbar();

  const searchInput = document.getElementById('userSearchInput');
  if (searchInput) searchInput.value = '';

  // Update Tab Styling
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

  // Update Dynamic Text in Header, Button, Search Dropdown
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
    if (tableHeaderId) tableHeaderId.textContent = 'Employee ID';
    if (tableHeaderCourse) tableHeaderCourse.textContent = 'Department / College';
    if (searchInput) searchInput.placeholder = 'Search employee ID, name, or department...';
  }
}

// =============================================================
// GET ACTIVE DATASET & FILTERING
// =============================================================
function getCurrentDataset() {
  if (currentTab === 'students') return studentsData;
  return teachersData;
}

function getFilteredData() {
  const dataset = getCurrentDataset();
  if (!searchQuery) return dataset;

  const query = searchQuery.toLowerCase().trim();
  return dataset.filter(item => {
    return (item.id && item.id.toLowerCase().includes(query)) ||
      (item.name && item.name.toLowerCase().includes(query)) ||
      (item.courseSection && item.courseSection.toLowerCase().includes(query)) ||
      (item.status && item.status.toLowerCase().includes(query));
  });
}

// =============================================================
// RENDER TABLE & PAGINATION
// =============================================================
function renderTable() {
  const tableBody = document.getElementById('userTableBody');
  if (!tableBody) return;

  const filtered = getFilteredData();
  const totalItems = filtered.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;

  // Sync count badge in top bar
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
            <p class="text-xs text-[#6b7280]">Try searching with a different keyword or filter.</p>
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
          <!-- Checkbox Column -->
          <td class="py-3.5 px-3.5 text-center">
            <input type="checkbox" onchange="onUserSelect('${user.id}', this)"
              class="row-checkbox w-4 h-4 rounded border-[#d1d5db] text-[#0030c2] focus:ring-[#0030c2] cursor-pointer"
              ${isSelected ? 'checked' : ''}
              title="Select ${user.name}">
          </td>
          <td class="py-3.5 px-4 font-mono font-medium text-[#6b7280] whitespace-nowrap text-xs">${user.id}</td>
          <td class="py-3.5 px-4 font-medium text-[#111827] text-xs">
            <div class="flex items-center gap-2.5">
              <div class="w-8 h-8 rounded-full bg-[#e5e7eb] flex items-center justify-center shrink-0">
                <svg class="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12a4.5 4.5 0 100-9 4.5 4.5 0 000 9zM4 20.5c0-3.59 3.58-6.5 8-6.5s8 2.91 8 6.5V21H4v-.5z"/>
                </svg>
              </div>
              <p class="font-bold text-[#111827]">${user.name}</p>
            </div>
          </td>
          <td class="py-3.5 px-4 text-[#4b5563] text-xs font-medium">${user.courseSection}</td>
          <td class="py-3.5 px-4">${statusBadge}</td>
          <td class="py-3.5 px-4 text-center whitespace-nowrap">
            <div class="flex items-center justify-center gap-1">
              <!-- 1. Edit Button -->
              <button onclick="openEditModal('${user.id}')" title="Edit ${user.name}" class="btn-press p-1.5 text-[#4b5563] hover:text-[#0030c2] hover:bg-[#e7edff] rounded-lg transition-colors">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.75">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
                </svg>
              </button>

              <!-- 2. Archive / Deactivate Button -->
              <button onclick="openArchiveModal('${user.id}')" title="${isActive ? 'Archive / Deactivate' : 'Reactivate'} ${user.name}" class="btn-press p-1.5 ${isActive ? 'text-[#4b5563] hover:text-amber-600 hover:bg-amber-50' : 'text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50'} rounded-lg transition-colors">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.75">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                </svg>
              </button>

              <!-- 3. 3-Dot More Menu Button (RFID Setup, View QR Code, Reset Password) -->
              <div class="relative inline-block text-left">
                <button onclick="toggleMoreMenu('${user.id}', event)" title="More options" class="btn-press p-1.5 text-[#4b5563] hover:text-[#111827] hover:bg-gray-100 rounded-lg transition-colors">
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                  </svg>
                </button>
                <div id="moreMenu-${user.id}" class="hidden absolute right-0 mt-1 w-44 bg-white rounded-xl shadow-lg border border-[#e5e7eb] py-1 z-30 text-left text-xs divide-y divide-gray-100">
                  <div class="py-1">
                    <button onclick="openRfidModal('${user.id}')" class="flex items-center gap-2 w-full px-3 py-1.5 text-[#374151] hover:bg-gray-50 hover:text-[#0030c2] transition-colors">
                      <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-6-10.5h16.5a1.5 1.5 0 011.5 1.5v10.5a1.5 1.5 0 01-1.5 1.5H3.75a1.5 1.5 0 01-1.5-1.5V7.5a1.5 1.5 0 011.5-1.5z" /></svg>
                      RFID Setup
                    </button>
                    <button onclick="openQrModal('${user.id}')" class="flex items-center gap-2 w-full px-3 py-1.5 text-[#374151] hover:bg-gray-50 hover:text-[#0030c2] transition-colors">
                      <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 15.375c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5zM13.5 15.75h2.25v2.25H13.5V15.75zM18 15.75h2.25v2.25H18v-2.25zM13.5 19.5h2.25v1.5H13.5v-1.5zM18 19.5h2.25v1.5H18v-1.5z" /></svg>
                      View QR Code
                    </button>
                    <button onclick="openResetPasswordModal('${user.id}')" class="flex items-center gap-2 w-full px-3 py-1.5 text-[#374151] hover:bg-gray-50 hover:text-[#0030c2] transition-colors">
                      <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" /></svg>
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

  // Update Master Checkbox sync
  syncMasterCheckbox(pageData);

  // Update Pagination UI
  renderPagination(totalItems, totalPages);
}

// =============================================================
// SELECTION & BULK ACTIONS
// =============================================================
function onUserSelect(userId, checkbox) {
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

function toggleSelectAll(masterCheckbox) {
  const filtered = getFilteredData();
  const startIndex = (currentPage - 1) * itemsPerPage;
  const pageData = filtered.slice(startIndex, startIndex + itemsPerPage);
  if (!pageData || pageData.length === 0) return;

  const selectedOnPage = pageData.filter(u => selectedUserIds.has(u.id)).length;

  if (selectedOnPage > 0) {
    // If some or all rows on current page are selected (including minus/indeterminate state), CLEAR ALL
    pageData.forEach(u => selectedUserIds.delete(u.id));
    if (masterCheckbox) {
      masterCheckbox.checked = false;
      masterCheckbox.indeterminate = false;
    }
  } else {
    // If 0 rows are selected (empty box), SELECT ALL on current page
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

function clearBulkSelection() {
  selectedUserIds.clear();
  updateBulkToolbar();
  renderTable();
}

function openBulkDeleteModal() {
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

function handleConfirmBulkDelete() {
  const count = selectedUserIds.size;
  if (count === 0) return;

  // Apply row slide-out animation to selected visible rows
  selectedUserIds.forEach(id => {
    const row = document.getElementById(`row-${id}`);
    if (row) row.classList.add('tr-removing');
  });

  // Delay splice slightly to show the smooth micro-animation
  setTimeout(() => {
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
    showToast(`Successfully deleted ${count} account(s)!`, 'success');
  }, 280);
}

function handleBulkToggleStatus() {
  if (selectedUserIds.size === 0) return;

  const dataset = getCurrentDataset();
  let updatedCount = 0;

  selectedUserIds.forEach(id => {
    const user = dataset.find(u => u.id === id);
    if (user) {
      user.status = (user.status.toLowerCase() === 'active') ? 'Inactive' : 'Active';
      updatedCount++;
    }
  });

  renderTable();
  showToast(`Updated status for ${updatedCount} account(s)!`, 'success');
}

function handleBulkExport() {
  if (selectedUserIds.size === 0) return;

  const dataset = getCurrentDataset();
  const selectedRecords = dataset.filter(u => selectedUserIds.has(u.id));

  let csvContent = "data:text/csv;charset=utf-8,";
  csvContent += "ID,Name,Course_or_Department,Email,Contact,Status,RFID_UID,QR_Code\r\n";

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
    ].join(",");
    csvContent += row + "\r\n";
  });

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `${currentTab}_export_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  showToast(`Exported ${selectedRecords.length} records to CSV!`, 'success');
}

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
    <button onclick="goToPage(${currentPage - 1})" ${currentPage === 1 ? 'disabled class="p-1.5 rounded-lg border border-[#e5e7eb] text-gray-300 cursor-not-allowed"' : 'class="p-1.5 rounded-lg border border-[#e5e7eb] text-[#374151] hover:bg-gray-100 transition-colors"'} title="Previous Page">
      <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
    </button>
  `;

  // Generate numbered pills matching reference design (< 1 2 3 ... 13 >)
  const pageNumbers = [];
  if (totalPages <= 5) {
    for (let i = 1; i <= totalPages; i++) pageNumbers.push(i);
  } else {
    if (currentPage <= 3) {
      pageNumbers.push(1, 2, 3, '...', totalPages);
    } else if (currentPage >= totalPages - 2) {
      pageNumbers.push(1, '...', totalPages - 2, totalPages - 1, totalPages);
    } else {
      pageNumbers.push(1, '...', currentPage, '...', totalPages);
    }
  }

  pageNumbers.forEach(p => {
    if (p === '...') {
      html += `<span class="px-2 py-1 text-xs text-gray-400 font-medium">...</span>`;
    } else if (p === currentPage) {
      html += `<button class="w-7 h-7 rounded-md bg-[#0030c2] text-white text-xs font-bold shadow-sm flex items-center justify-center">${p}</button>`;
    } else {
      html += `<button onclick="goToPage(${p})" class="w-7 h-7 rounded-md border border-transparent text-[#4b5563] hover:border-[#e5e7eb] hover:bg-gray-50 text-xs font-medium flex items-center justify-center transition-colors">${p}</button>`;
    }
  });

  html += `
    <button onclick="goToPage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled class="p-1.5 rounded-lg border border-[#e5e7eb] text-gray-300 cursor-not-allowed"' : 'class="p-1.5 rounded-lg border border-[#e5e7eb] text-[#374151] hover:bg-gray-100 transition-colors"'} title="Next Page">
      <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
    </button>
  `;

  paginationControls.innerHTML = html;
}

function goToPage(page) {
  const filtered = getFilteredData();
  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
  if (page < 1 || page > totalPages) return;
  currentPage = page;
  renderTable();
}

// =============================================================
// SEARCH
// =============================================================
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


// =============================================================
// DROPDOWN MENU HANDLER
// =============================================================
function toggleMoreMenu(userId, event) {
  if (event) event.stopPropagation();
  // Close all other menus
  document.querySelectorAll('[id^="moreMenu-"]').forEach(menu => {
    if (menu.id !== `moreMenu-${userId}`) menu.classList.add('hidden');
  });

  const menu = document.getElementById(`moreMenu-${userId}`);
  if (menu) menu.classList.toggle('hidden');
}

// Close menus on window click
window.addEventListener('click', function () {
  document.querySelectorAll('[id^="moreMenu-"]').forEach(menu => menu.classList.add('hidden'));
});

// =============================================================
// MODAL CONTROLS & FORM ACTIONS
// =============================================================
const ALL_MODAL_IDS = ['userModal', 'rfidModal', 'qrModal', 'resetPasswordModal', 'archiveModal', 'bulkDeleteModal'];

function initModalListeners() {
  // ESC key closes modals
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closeAllModals();
    }
  });

  // Modal backdrop click closes modals
  ALL_MODAL_IDS.forEach(mId => {
    const modal = document.getElementById(mId);
    if (modal) {
      modal.addEventListener('click', function (e) {
        if (e.target === modal) closeAllModals();
      });
    }
  });
}

function closeAllModals() {
  ALL_MODAL_IDS.forEach(mId => {
    const el = document.getElementById(mId);
    if (el) {
      el.classList.add('hidden');
      el.classList.remove('flex');
    }
  });
}

// --- ADD / EDIT USER MODAL ---
function openAddModal() {
  const modal = document.getElementById('userModal');
  const modalTitle = document.getElementById('userModalTitle');
  const form = document.getElementById('userForm');
  const isEditingInput = document.getElementById('formIsEditing');
  const idInput = document.getElementById('formUserId');

  if (!modal) return;

  if (form) form.reset();
  if (isEditingInput) isEditingInput.value = 'false';

  const typeName = currentTab === 'students' ? 'Student' : 'Teacher';
  if (modalTitle) modalTitle.textContent = `Add New ${typeName}`;

  // Generate next available ID
  if (idInput) {
    const dataset = getCurrentDataset();
    if (currentTab === 'students') {
      idInput.value = `2024-${1000 + dataset.length + 1}`;
    } else {
      idInput.value = `TCH-2024-${(dataset.length + 1).toString().padStart(3, '0')}`;
    }
  }

  modal.classList.remove('hidden');
  modal.classList.add('flex');
}

function openEditModal(userId) {
  const modal = document.getElementById('userModal');
  const modalTitle = document.getElementById('userModalTitle');
  const isEditingInput = document.getElementById('formIsEditing');
  const idInput = document.getElementById('formUserId');
  const nameInput = document.getElementById('formUserName');
  const courseInput = document.getElementById('formUserCourse');
  const emailInput = document.getElementById('formUserEmail');
  const contactInput = document.getElementById('formUserContact');
  const statusSelect = document.getElementById('formUserStatus');

  const dataset = getCurrentDataset();
  const user = dataset.find(u => u.id === userId);
  if (!user || !modal) return;

  if (isEditingInput) isEditingInput.value = 'true';
  const typeName = currentTab === 'students' ? 'Student' : 'Teacher';
  if (modalTitle) modalTitle.textContent = `Edit ${typeName} Information`;

  if (idInput) idInput.value = user.id;
  if (nameInput) nameInput.value = user.name;
  if (courseInput) courseInput.value = user.courseSection;
  if (emailInput) emailInput.value = user.email || '';
  if (contactInput) contactInput.value = user.contact || '';
  if (statusSelect) statusSelect.value = user.status;

  modal.classList.remove('hidden');
  modal.classList.add('flex');
}

function handleSaveUser(event) {
  if (event) event.preventDefault();

  const isEditing = document.getElementById('formIsEditing')?.value === 'true';
  const id = document.getElementById('formUserId')?.value.trim();
  const name = document.getElementById('formUserName')?.value.trim();
  const course = document.getElementById('formUserCourse')?.value.trim();
  const email = document.getElementById('formUserEmail')?.value.trim();
  const contact = document.getElementById('formUserContact')?.value.trim();
  const status = document.getElementById('formUserStatus')?.value || 'Active';

  if (!id || !name || !course) {
    showToast('Please fill in all required fields.', 'error');
    return;
  }

  const dataset = getCurrentDataset();

  if (isEditing) {
    const existing = dataset.find(u => u.id === id);
    if (existing) {
      existing.name = name;
      existing.courseSection = course;
      existing.email = email;
      existing.contact = contact;
      existing.status = status;
    }
    showToast(`Account ${name} (${id}) updated successfully!`, 'success');
  } else {
    // Check if ID already exists
    if (dataset.some(u => u.id === id)) {
      showToast(`User with ID ${id} already exists!`, 'error');
      return;
    }
    const newUser = {
      id: id,
      name: name,
      courseSection: course,
      email: email,
      contact: contact,
      status: status,
      rfidUid: `E2000019${Math.floor(1000000 + Math.random() * 9000000)}`,
      qrCode: `QR-${currentTab.toUpperCase().substring(0, 3)}-${id}`
    };
    dataset.unshift(newUser);
    showToast(`New user ${name} registered successfully!`, 'success');
  }

  closeAllModals();
  updateTabContextUI();
  renderTable();
}

// --- RFID MODAL ---
function openRfidModal(userId) {
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

function handleSaveRfid(event) {
  if (event) event.preventDefault();
  const userId = document.getElementById('rfidHiddenId')?.value;
  const uid = document.getElementById('rfidUidInput')?.value.trim();

  const dataset = getCurrentDataset();
  const user = dataset.find(u => u.id === userId);
  if (user) {
    user.rfidUid = uid || 'NOT-ASSIGNED';
    showToast(`RFID Card (${uid}) successfully linked to ${user.name}!`, 'success');
  }

  closeAllModals();
  renderTable();
}

function simulateRfidTap() {
  const uidInput = document.getElementById('rfidUidInput');
  if (uidInput) {
    const simulatedHex = 'E200' + Array.from({ length: 10 }, () => Math.floor(Math.random() * 16).toString(16).toUpperCase()).join('');
    uidInput.value = simulatedHex;
    showToast('Card detected by RFID scanner reader!', 'info');
  }
}

// --- QR CODE MODAL ---
function openQrModal(userId) {
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

function printQrCard() {
  window.print();
}

function downloadQrCard() {
  showToast('QR Code badge prepared for download!', 'success');
}

// --- RESET PASSWORD MODAL ---
function openResetPasswordModal(userId) {
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

  // Generate temporary password
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789!@#';
  let tempPass = 'TempPass';
  for (let i = 0; i < 4; i++) tempPass += chars.charAt(Math.floor(Math.random() * chars.length));
  if (tempPassInput) tempPassInput.value = tempPass;

  modal.classList.remove('hidden');
  modal.classList.add('flex');
}

function copyTempPassword() {
  const tempPassInput = document.getElementById('resetTempPassword');
  if (tempPassInput) {
    navigator.clipboard.writeText(tempPassInput.value).then(() => {
      showToast('Temporary password copied to clipboard!', 'info');
    });
  }
}

function handleConfirmPasswordReset() {
  const userId = document.getElementById('resetHiddenId')?.value;
  const dataset = getCurrentDataset();
  const user = dataset.find(u => u.id === userId);

  closeAllModals();
  showToast(`Password successfully reset for ${user ? user.name : 'user'}. Notice sent via email!`, 'success');
}

// --- ARCHIVE / DEACTIVATE MODAL ---
function openArchiveModal(userId) {
  const modal = document.getElementById('archiveModal');
  const nameEl = document.getElementById('archiveUserName');
  const idEl = document.getElementById('archiveUserId');
  const textEl = document.getElementById('archiveActionText');
  const confirmBtn = document.getElementById('archiveConfirmBtn');
  const hiddenId = document.getElementById('archiveHiddenId');

  const dataset = getCurrentDataset();
  const user = dataset.find(u => u.id === userId);
  if (!user || !modal) return;

  const isActive = user.status.toLowerCase() === 'active';

  if (nameEl) nameEl.textContent = user.name;
  if (idEl) idEl.textContent = user.id;
  if (hiddenId) hiddenId.value = user.id;

  if (textEl) {
    textEl.textContent = isActive
      ? 'Deactivating this user will revoke attendance logging and portal login privileges.'
      : 'Reactivating this user will restore attendance scanning and login privileges.';
  }

  if (confirmBtn) {
    confirmBtn.textContent = isActive ? 'Deactivate Account' : 'Reactivate Account';
    confirmBtn.className = isActive
      ? 'px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-sm transition-colors'
      : 'px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition-colors';
  }

  modal.classList.remove('hidden');
  modal.classList.add('flex');
}

function handleConfirmArchive() {
  const userId = document.getElementById('archiveHiddenId')?.value;
  const dataset = getCurrentDataset();
  const user = dataset.find(u => u.id === userId);

  if (user) {
    const isNowActive = user.status.toLowerCase() !== 'active';
    user.status = isNowActive ? 'Active' : 'Inactive';
    showToast(`Account ${user.name} is now ${user.status}!`, isNowActive ? 'success' : 'info');
  }

  closeAllModals();
  renderTable();
}

// =============================================================
// TOAST NOTIFICATIONS
// =============================================================
function showToast(titleOrMessage, messageOrType, type = 'success') {
  let title = titleOrMessage;
  let message = messageOrType;
  let toastType = type;

  if (messageOrType === undefined) {
    message = titleOrMessage;
    toastType = 'success';
    title = 'Success';
  } else if (messageOrType === 'success' || messageOrType === 'info' || messageOrType === 'error') {
    message = titleOrMessage;
    toastType = messageOrType;
    title = toastType === 'success' ? 'Success' : toastType === 'info' ? 'Notification' : 'Notice';
  }

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
  if (toastType === 'success') {
    iconSvg = `
      <div class="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
      </div>
    `;
  } else if (toastType === 'info') {
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
    <button onclick="this.parentElement.remove()" class="text-gray-400 hover:text-gray-600 p-1">
      <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
    </button>
  `;

  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('opacity-0', 'translate-x-full');
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}
