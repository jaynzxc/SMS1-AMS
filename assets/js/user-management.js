// assets/js/user-management.js
// User Management Interactive Functionality

let currentTab = 'students';
let currentPage = 1;
const itemsPerPage = 10;
let searchQuery = '';
let searchField = 'id';

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

const adminsData = [
  { id: 'ADM-2024-001', name: 'Admin User (System Administrator)', courseSection: 'IT Systems & Security', email: 'admin.system@school.edu.ph', contact: '0917-999-0001', status: 'Active', rfidUid: 'E20000193000001', qrCode: 'QR-ADM-001' },
  { id: 'ADM-2024-002', name: 'Bautista, Catherine', courseSection: 'Registrar Office', email: 'catherine.bautista@school.edu.ph', contact: '0917-999-0002', status: 'Active', rfidUid: 'E20000193000002', qrCode: 'QR-ADM-002' },
  { id: 'ADM-2024-003', name: 'Villanueva, Greg', courseSection: 'Dean of Student Affairs', email: 'greg.villanueva@school.edu.ph', contact: '0917-999-0003', status: 'Active', rfidUid: 'E20000193000003', qrCode: 'QR-ADM-003' },
  { id: 'ADM-2024-004', name: 'Soriano, Jonathan', courseSection: 'Attendance Operations', email: 'jonathan.soriano@school.edu.ph', contact: '0917-999-0004', status: 'Active', rfidUid: 'E20000193000004', qrCode: 'QR-ADM-004' },
  { id: 'ADM-2024-005', name: 'Salazar, Teresa', courseSection: 'Finance & Accounting', email: 'teresa.salazar@school.edu.ph', contact: '0917-999-0005', status: 'Active', rfidUid: 'E20000193000005', qrCode: 'QR-ADM-005' },
  { id: 'ADM-2024-006', name: 'Del Rosario, Marcus', courseSection: 'IT Infrastructure', email: 'marcus.delrosario@school.edu.ph', contact: '0917-999-0006', status: 'Inactive', rfidUid: 'E20000193000006', qrCode: 'QR-ADM-006' }
];

for (let i = 7; i <= 12; i++) {
  const paddedId = 'ADM-2024-' + i.toString().padStart(3, '0');
  adminsData.push({
    id: paddedId,
    name: `Administrator Staff ${i}`,
    courseSection: 'Administrative Services',
    email: `admin.${i}@school.edu.ph`,
    contact: `0917-999-${1000 + i}`,
    status: 'Active',
    rfidUid: `E200001930000${i.toString().padStart(2, '0')}`,
    qrCode: `QR-ADM-${paddedId}`
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

  const searchInput = document.getElementById('userSearchInput');
  if (searchInput) searchInput.value = '';

  // Update Tab Styling
  const tabStudents = document.getElementById('tabStudents');
  const tabTeachers = document.getElementById('tabTeachers');
  const tabAdmins = document.getElementById('tabAdmins');

  const inactiveClass = 'text-[#6b7280] hover:text-[#0030c2] border-transparent';
  const activeClass = 'text-[#0030c2] font-bold border-[#0030c2]';

  [tabStudents, tabTeachers, tabAdmins].forEach(t => {
    if (t) {
      t.className = `flex items-center gap-2 pb-3 px-3 text-sm font-semibold border-b-2 transition-all cursor-pointer ${inactiveClass}`;
    }
  });

  if (tab === 'students' && tabStudents) tabStudents.className = `flex items-center gap-2 pb-3 px-3 text-sm font-semibold border-b-2 transition-all cursor-pointer ${activeClass}`;
  if (tab === 'teachers' && tabTeachers) tabTeachers.className = `flex items-center gap-2 pb-3 px-3 text-sm font-semibold border-b-2 transition-all cursor-pointer ${activeClass}`;
  if (tab === 'admins' && tabAdmins) tabAdmins.className = `flex items-center gap-2 pb-3 px-3 text-sm font-semibold border-b-2 transition-all cursor-pointer ${activeClass}`;

  // Update Dynamic Text in Header, Button, Quick Actions, Search Dropdown
  updateTabContextUI();
  renderTable();
}

function updateTabContextUI() {
  const cardTitle = document.getElementById('cardTitle');
  const cardSubtitle = document.getElementById('cardSubtitle');
  const addBtnText = document.getElementById('addBtnText');
  const tableHeaderId = document.getElementById('tableHeaderId');
  const tableHeaderCourse = document.getElementById('tableHeaderCourse');
  const searchBySelect = document.getElementById('searchBySelect');
  const searchInput = document.getElementById('userSearchInput');

  // Quick Action Labels
  const qaAddTitle = document.getElementById('qaAddTitle');
  const qaAddDesc = document.getElementById('qaAddDesc');
  const qaEditTitle = document.getElementById('qaEditTitle');
  const qaEditDesc = document.getElementById('qaEditDesc');
  const qaArchiveTitle = document.getElementById('qaArchiveTitle');
  const qaArchiveDesc = document.getElementById('qaArchiveDesc');
  const qaResetTitle = document.getElementById('qaResetTitle');
  const qaResetDesc = document.getElementById('qaResetDesc');
  const qaRfidTitle = document.getElementById('qaRfidTitle');
  const qaRfidDesc = document.getElementById('qaRfidDesc');
  const qaQrTitle = document.getElementById('qaQrTitle');
  const qaQrDesc = document.getElementById('qaQrDesc');

  if (currentTab === 'students') {
    if (cardTitle) cardTitle.textContent = `Students (${studentsData.length})`;
    if (cardSubtitle) cardSubtitle.textContent = 'Manage student accounts and information.';
    if (addBtnText) addBtnText.textContent = 'Add Student';
    if (tableHeaderId) tableHeaderId.textContent = 'Student ID';
    if (tableHeaderCourse) tableHeaderCourse.textContent = 'Course & Section';
    if (searchInput) searchInput.placeholder = 'Enter Student ID';

    if (searchBySelect) {
      searchBySelect.innerHTML = `
        <option value="id">Student ID</option>
        <option value="name">Name</option>
        <option value="course">Course & Section</option>
        <option value="status">Status</option>
      `;
    }

    if (qaAddTitle) qaAddTitle.textContent = 'Add Student';
    if (qaAddDesc) qaAddDesc.textContent = 'Create a new student account.';
    if (qaEditTitle) qaEditTitle.textContent = 'Edit Student';
    if (qaEditDesc) qaEditDesc.textContent = 'Update student information.';
    if (qaArchiveTitle) qaArchiveTitle.textContent = 'Archive Student';
    if (qaArchiveDesc) qaArchiveDesc.textContent = 'Deactivate student account.';
    if (qaResetTitle) qaResetTitle.textContent = 'Reset Password';
    if (qaResetDesc) qaResetDesc.textContent = 'Reset student portal password.';
    if (qaRfidTitle) qaRfidTitle.textContent = 'Register RFID';
    if (qaRfidDesc) qaRfidDesc.textContent = 'Register or update RFID card.';
    if (qaQrTitle) qaQrTitle.textContent = 'Generate QR';
    if (qaQrDesc) qaQrDesc.textContent = 'Generate QR code for attendance.';

  } else if (currentTab === 'teachers') {
    if (cardTitle) cardTitle.textContent = `Teachers (${teachersData.length})`;
    if (cardSubtitle) cardSubtitle.textContent = 'Manage faculty members and teaching staff accounts.';
    if (addBtnText) addBtnText.textContent = 'Add Teacher';
    if (tableHeaderId) tableHeaderId.textContent = 'Employee ID';
    if (tableHeaderCourse) tableHeaderCourse.textContent = 'Department / College';
    if (searchInput) searchInput.placeholder = 'Enter Employee ID';

    if (searchBySelect) {
      searchBySelect.innerHTML = `
        <option value="id">Employee ID</option>
        <option value="name">Name</option>
        <option value="course">Department</option>
        <option value="status">Status</option>
      `;
    }

    if (qaAddTitle) qaAddTitle.textContent = 'Add Teacher';
    if (qaAddDesc) qaAddDesc.textContent = 'Create a new teacher account.';
    if (qaEditTitle) qaEditTitle.textContent = 'Edit Teacher';
    if (qaEditDesc) qaEditDesc.textContent = 'Update teacher profile details.';
    if (qaArchiveTitle) qaArchiveTitle.textContent = 'Archive Teacher';
    if (qaArchiveDesc) qaArchiveDesc.textContent = 'Deactivate teacher account.';
    if (qaResetTitle) qaResetTitle.textContent = 'Reset Password';
    if (qaResetDesc) qaResetDesc.textContent = 'Reset faculty portal password.';
    if (qaRfidTitle) qaRfidTitle.textContent = 'Register RFID';
    if (qaRfidDesc) qaRfidDesc.textContent = 'Register faculty RFID badge.';
    if (qaQrTitle) qaQrTitle.textContent = 'Generate QR';
    if (qaQrDesc) qaQrDesc.textContent = 'Generate faculty attendance QR.';

  } else {
    if (cardTitle) cardTitle.textContent = `Admins (${adminsData.length})`;
    if (cardSubtitle) cardSubtitle.textContent = 'Manage system administrators and administrative roles.';
    if (addBtnText) addBtnText.textContent = 'Add Admin';
    if (tableHeaderId) tableHeaderId.textContent = 'Admin ID';
    if (tableHeaderCourse) tableHeaderCourse.textContent = 'Role / Office';
    if (searchInput) searchInput.placeholder = 'Enter Admin ID';

    if (searchBySelect) {
      searchBySelect.innerHTML = `
        <option value="id">Admin ID</option>
        <option value="name">Name</option>
        <option value="course">Role / Office</option>
        <option value="status">Status</option>
      `;
    }

    if (qaAddTitle) qaAddTitle.textContent = 'Add Admin';
    if (qaAddDesc) qaAddDesc.textContent = 'Create a new administrator.';
    if (qaEditTitle) qaEditTitle.textContent = 'Edit Admin';
    if (qaEditDesc) qaEditDesc.textContent = 'Update administrator privileges.';
    if (qaArchiveTitle) qaArchiveTitle.textContent = 'Archive Admin';
    if (qaArchiveDesc) qaArchiveDesc.textContent = 'Deactivate administrator access.';
    if (qaResetTitle) qaResetTitle.textContent = 'Reset Password';
    if (qaResetDesc) qaResetDesc.textContent = 'Reset admin account password.';
    if (qaRfidTitle) qaRfidTitle.textContent = 'Register RFID';
    if (qaRfidDesc) qaRfidDesc.textContent = 'Register administrator RFID key.';
    if (qaQrTitle) qaQrTitle.textContent = 'Generate QR';
    if (qaQrDesc) qaQrDesc.textContent = 'Generate administrator QR badge.';
  }
}

// =============================================================
// GET ACTIVE DATASET & FILTERING
// =============================================================
function getCurrentDataset() {
  if (currentTab === 'students') return studentsData;
  if (currentTab === 'teachers') return teachersData;
  return adminsData;
}

function getFilteredData() {
  const dataset = getCurrentDataset();
  if (!searchQuery) return dataset;

  const query = searchQuery.toLowerCase().trim();
  return dataset.filter(item => {
    if (searchField === 'id') return item.id.toLowerCase().includes(query);
    if (searchField === 'name') return item.name.toLowerCase().includes(query);
    if (searchField === 'course') return item.courseSection.toLowerCase().includes(query);
    if (searchField === 'status') return item.status.toLowerCase().includes(query);
    return item.id.toLowerCase().includes(query) ||
      item.name.toLowerCase().includes(query) ||
      item.courseSection.toLowerCase().includes(query);
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

  if (currentPage > totalPages) currentPage = totalPages;
  if (currentPage < 1) currentPage = 1;

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const pageData = filtered.slice(startIndex, endIndex);

  if (pageData.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="5" class="py-12 text-center text-gray-500">
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
      const isActive = user.status.toLowerCase() === 'active';
      const statusBadge = isActive
        ? `<span class="inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-[#ecfdf5] text-[#10b981] border border-[#a7f3d0]">Active</span>`
        : `<span class="inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-[#f1f5f9] text-[#64748b] border border-[#e2e8f0]">Inactive</span>`;

      return `
        <tr class="hover:bg-[#f8fafc] transition-colors border-b border-[#f1f5f9]">
          <td class="py-3.5 px-4 font-mono font-medium text-[#111827] whitespace-nowrap text-xs">${user.id}</td>
          <td class="py-3.5 px-4 font-medium text-[#111827] text-xs">${user.name}</td>
          <td class="py-3.5 px-4 text-[#4b5563] text-xs">${user.courseSection}</td>
          <td class="py-3.5 px-4">${statusBadge}</td>
          <td class="py-3.5 px-4 text-center whitespace-nowrap">
            <div class="flex items-center justify-center gap-1">
              <!-- Edit Button -->
              <button onclick="openEditModal('${user.id}')" title="Edit ${user.name}" class="p-1.5 text-[#4b5563] hover:text-[#0030c2] hover:bg-[#e7edff] rounded-lg transition-colors">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.75">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
                </svg>
              </button>

              <!-- RFID Button -->
              <button onclick="openRfidModal('${user.id}')" title="Register / Update RFID" class="p-1.5 text-[#4b5563] hover:text-[#0030c2] hover:bg-[#e7edff] rounded-lg transition-colors">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.75">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-6-10.5h16.5a1.5 1.5 0 011.5 1.5v10.5a1.5 1.5 0 01-1.5 1.5H3.75a1.5 1.5 0 01-1.5-1.5V7.5a1.5 1.5 0 011.5-1.5z" />
                </svg>
              </button>

              <!-- QR Code Button -->
              <button onclick="openQrModal('${user.id}')" title="Generate / View QR Code" class="p-1.5 text-[#4b5563] hover:text-[#0030c2] hover:bg-[#e7edff] rounded-lg transition-colors">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.75">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 15.375c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5zM13.5 15.75h2.25v2.25H13.5V15.75zM18 15.75h2.25v2.25H18v-2.25zM13.5 19.5h2.25v1.5H13.5v-1.5zM18 19.5h2.25v1.5H18v-1.5z" />
                </svg>
              </button>

              <!-- Reset Password / Key Button -->
              <button onclick="openResetPasswordModal('${user.id}')" title="Reset Password" class="p-1.5 text-[#4b5563] hover:text-[#0030c2] hover:bg-[#e7edff] rounded-lg transition-colors">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.75">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
                </svg>
              </button>

              <!-- More Options (Dropdown) -->
              <div class="relative inline-block text-left">
                <button onclick="toggleMoreMenu('${user.id}', event)" class="p-1.5 text-[#4b5563] hover:text-[#111827] hover:bg-gray-100 rounded-lg transition-colors">
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                  </svg>
                </button>
                <div id="moreMenu-${user.id}" class="hidden absolute right-0 mt-1 w-44 bg-white rounded-xl shadow-lg border border-[#e5e7eb] py-1 z-30 text-left text-xs divide-y divide-gray-100">
                  <div class="py-1">
                    <button onclick="openEditModal('${user.id}')" class="flex items-center gap-2 w-full px-3 py-1.5 text-[#374151] hover:bg-gray-50 hover:text-[#0030c2]">
                      <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" /></svg>
                      Edit Details
                    </button>
                    <button onclick="openRfidModal('${user.id}')" class="flex items-center gap-2 w-full px-3 py-1.5 text-[#374151] hover:bg-gray-50 hover:text-[#0030c2]">
                      <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-6-10.5h16.5a1.5 1.5 0 011.5 1.5v10.5a1.5 1.5 0 01-1.5 1.5H3.75a1.5 1.5 0 01-1.5-1.5V7.5a1.5 1.5 0 011.5-1.5z" /></svg>
                      RFID Setup
                    </button>
                    <button onclick="openQrModal('${user.id}')" class="flex items-center gap-2 w-full px-3 py-1.5 text-[#374151] hover:bg-gray-50 hover:text-[#0030c2]">
                      <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5z" /></svg>
                      View QR Code
                    </button>
                  </div>
                  <div class="py-1">
                    <button onclick="openArchiveModal('${user.id}')" class="flex items-center gap-2 w-full px-3 py-1.5 text-red-600 hover:bg-red-50">
                      <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
                      ${isActive ? 'Deactivate / Archive' : 'Reactivate Account'}
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

  // Update Pagination UI
  renderPagination(totalItems, totalPages);
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
  const searchBySelect = document.getElementById('searchBySelect');
  const searchBtn = document.getElementById('userSearchBtn');

  if (searchInput) {
    searchInput.addEventListener('input', function () {
      searchQuery = this.value;
      currentPage = 1;
      renderTable();
    });
    searchInput.addEventListener('keypress', function (e) {
      if (e.key === 'Enter') {
        searchQuery = this.value;
        currentPage = 1;
        renderTable();
      }
    });
  }

  if (searchBySelect) {
    searchBySelect.addEventListener('change', function () {
      searchField = this.value;
      currentPage = 1;
      renderTable();
    });
  }

  if (searchBtn && searchInput) {
    searchBtn.addEventListener('click', function () {
      searchQuery = searchInput.value;
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
function initModalListeners() {
  // ESC key closes modals
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closeAllModals();
    }
  });

  // Modal backdrop click closes modals
  const modals = ['userModal', 'rfidModal', 'qrModal', 'resetPasswordModal', 'archiveModal'];
  modals.forEach(mId => {
    const modal = document.getElementById(mId);
    if (modal) {
      modal.addEventListener('click', function (e) {
        if (e.target === modal) closeAllModals();
      });
    }
  });
}

function closeAllModals() {
  ['userModal', 'rfidModal', 'qrModal', 'resetPasswordModal', 'archiveModal'].forEach(mId => {
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

  const typeName = currentTab === 'students' ? 'Student' : currentTab === 'teachers' ? 'Teacher' : 'Administrator';
  if (modalTitle) modalTitle.textContent = `Add New ${typeName}`;

  // Generate next available ID
  if (idInput) {
    const dataset = getCurrentDataset();
    if (currentTab === 'students') {
      idInput.value = `2024-${1000 + dataset.length + 1}`;
    } else if (currentTab === 'teachers') {
      idInput.value = `TCH-2024-${(dataset.length + 1).toString().padStart(3, '0')}`;
    } else {
      idInput.value = `ADM-2024-${(dataset.length + 1).toString().padStart(3, '0')}`;
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
  const typeName = currentTab === 'students' ? 'Student' : currentTab === 'teachers' ? 'Teacher' : 'Administrator';
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
