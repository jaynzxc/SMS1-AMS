// assets/js/academic-management.js
// Academic Management Interactive Functionality

document.addEventListener('DOMContentLoaded', function () {
  console.log('Academic Management module initialized');
  initModalListeners();
});

// =============================================================
// MOCK DATA & CONFIGURATIONS
// =============================================================
const academicModuleConfigs = {
  school_year: {
    title: 'School Year Management',
    subtitle: 'Configure active and upcoming academic school years.',
    itemName: 'School Year',
    headers: ['School Year', 'Start Date', 'End Date', 'Status'],
    items: [
      { col1: 'S.Y. 2026 - 2027', col2: 'August 15, 2026', col3: 'May 30, 2027', status: 'Upcoming' },
      { col1: 'S.Y. 2025 - 2026', col2: 'August 18, 2025', col3: 'May 28, 2026', status: 'Active' },
      { col1: 'S.Y. 2024 - 2025', col2: 'August 20, 2024', col3: 'May 30, 2025', status: 'Archived' }
    ]
  },
  semester: {
    title: 'Semester Management',
    subtitle: 'Manage term semesters and enrollment grading periods.',
    itemName: 'Semester',
    headers: ['Semester Term', 'Academic Year', 'Duration', 'Status'],
    items: [
      { col1: '1st Semester', col2: 'S.Y. 2025 - 2026', col3: 'Aug 2025 - Dec 2025', status: 'Completed' },
      { col1: '2nd Semester', col2: 'S.Y. 2025 - 2026', col3: 'Jan 2026 - May 2026', status: 'Active' },
      { col1: 'Summer Term', col2: 'S.Y. 2025 - 2026', col3: 'Jun 2026 - Jul 2026', status: 'Upcoming' }
    ]
  },
  courses: {
    title: 'Course Programs Management',
    subtitle: 'Manage degree programs and college curriculum offerings.',
    itemName: 'Course',
    headers: ['Course Code', 'Course Title', 'Department / College', 'Status'],
    items: [
      { col1: 'BSIT', col2: 'Bachelor of Science in Information Technology', col3: 'College of Computer Studies', status: 'Active' },
      { col1: 'BSCS', col2: 'Bachelor of Science in Computer Science', col3: 'College of Computer Studies', status: 'Active' },
      { col1: 'BSBA', col2: 'BS in Business Administration', col3: 'College of Business Administration', status: 'Active' },
      { col1: 'BSA', col2: 'Bachelor of Science in Accountancy', col3: 'College of Accountancy', status: 'Active' },
      { col1: 'BSECE', col2: 'BS in Electronics Engineering', col3: 'College of Engineering', status: 'Active' }
    ]
  },
  year_levels: {
    title: 'Year Levels Setup',
    subtitle: 'Configure academic year levels across degree programs.',
    itemName: 'Year Level',
    headers: ['Level Code', 'Level Description', 'Program Category', 'Status'],
    items: [
      { col1: '1st Year', col2: 'Freshman Academic Year Level', col3: 'Undergraduate', status: 'Active' },
      { col1: '2nd Year', col2: 'Sophomore Academic Year Level', col3: 'Undergraduate', status: 'Active' },
      { col1: '3rd Year', col2: 'Junior Academic Year Level', col3: 'Undergraduate', status: 'Active' },
      { col1: '4th Year', col2: 'Senior Academic Year Level', col3: 'Undergraduate', status: 'Active' }
    ]
  },
  sections: {
    title: 'Sections Management',
    subtitle: 'Manage student classes, class sizes, and sections.',
    itemName: 'Section',
    headers: ['Section Name', 'Course & Year', 'Adviser Assigned', 'Status'],
    items: [
      { col1: 'BSIT 1A', col2: 'BS Information Technology (1st Year)', col3: 'Mr. Juan Dela Cruz', status: 'Active' },
      { col1: 'BSIT 2A', col2: 'BS Information Technology (2nd Year)', col3: 'Ms. Emily Davis', status: 'Active' },
      { col1: 'BSIT 2B', col2: 'BS Information Technology (2nd Year)', col3: 'Dr. Sarah Jenkins', status: 'Active' },
      { col1: 'BSCS 2A', col2: 'BS Computer Science (2nd Year)', col3: 'Dr. Leonardo Gomez', status: 'Active' },
      { col1: 'BSBA 2B', col2: 'BS Business Admin (2nd Year)', col3: 'Prof. Robert Miller', status: 'Active' }
    ]
  },
  subjects: {
    title: 'Subjects & Curriculum Management',
    subtitle: 'Manage academic subjects, course units, and prerequisites.',
    itemName: 'Subject',
    headers: ['Subject Code', 'Subject Title', 'Units', 'Status'],
    items: [
      { col1: 'IT-201', col2: 'Data Structures and Algorithms', col3: '3 Units (Lecture + Lab)', status: 'Active' },
      { col1: 'IT-202', col2: 'Database Management Systems', col3: '3 Units (Lecture + Lab)', status: 'Active' },
      { col1: 'CS-205', col2: 'Object-Oriented Programming', col3: '3 Units (Lecture + Lab)', status: 'Active' },
      { col1: 'BA-201', col2: 'Principles of Marketing', col3: '3 Units (Lecture)', status: 'Active' },
      { col1: 'GE-101', col2: 'Purposive Communication', col3: '3 Units (Lecture)', status: 'Active' }
    ]
  },
  rooms: {
    title: 'Rooms & Laboratories Management',
    subtitle: 'Manage classrooms, computer laboratories, and lecture halls.',
    itemName: 'Room',
    headers: ['Room / Lab Code', 'Building / Location', 'Capacity', 'Status'],
    items: [
      { col1: 'Lab 301', col2: 'IT Building - 3rd Floor', col3: '45 Students (Equipped with RFID)', status: 'Active' },
      { col1: 'Lab 302', col2: 'IT Building - 3rd Floor', col3: '45 Students (Equipped with RFID)', status: 'Active' },
      { col1: 'Room 204', col2: 'Main Academic Hall - 2nd Floor', col3: '50 Students', status: 'Active' },
      { col1: 'Room 205', col2: 'Main Academic Hall - 2nd Floor', col3: '50 Students', status: 'Active' },
      { col1: 'AVR Hall 1', col2: 'Student Activity Center - 4th Floor', col3: '150 Students', status: 'Active' }
    ]
  },
  schedules: {
    title: 'Class Schedules Management',
    subtitle: 'Configure lecture times, laboratory slots, and room allocations.',
    itemName: 'Schedule',
    headers: ['Class / Subject', 'Section & Room', 'Day & Time Slot', 'Status'],
    items: [
      { col1: 'IT-201 (Data Structures)', col2: 'BSIT 2A · Lab 301', col3: 'Mon / Wed 07:30 AM - 09:30 AM', status: 'Active' },
      { col1: 'IT-202 (Database Systems)', col2: 'BSIT 2B · Lab 302', col3: 'Tue / Thu 09:30 AM - 11:30 AM', status: 'Active' },
      { col1: 'CS-205 (OOP with Java)', col2: 'BSCS 2A · Lab 301', col3: 'Mon / Wed 01:00 PM - 03:00 PM', status: 'Active' },
      { col1: 'BA-201 (Marketing)', col2: 'BSBA 2B · Room 204', col3: 'Tue / Thu 01:00 PM - 02:30 PM', status: 'Active' }
    ]
  },
  advisers: {
    title: 'Section Adviser Assignment',
    subtitle: 'Assign faculty advisory leads to student sections.',
    itemName: 'Adviser Assignment',
    headers: ['Section', 'Assigned Faculty Adviser', 'Department', 'Status'],
    items: [
      { col1: 'BSIT 2A', col2: 'Ms. Emily Davis', col3: 'College of Computer Studies', status: 'Assigned' },
      { col1: 'BSIT 2B', col2: 'Dr. Sarah Jenkins', col3: 'College of Computer Studies', status: 'Assigned' },
      { col1: 'BSCS 2A', col2: 'Dr. Leonardo Gomez', col3: 'College of Computer Studies', status: 'Assigned' },
      { col1: 'BSBA 2B', col2: 'Prof. Robert Miller', col3: 'College of Business Administration', status: 'Assigned' },
      { col1: 'BSA 2A', col2: 'Mr. Michael Chang', col3: 'College of Accountancy', status: 'Assigned' }
    ]
  },
  teacher_subjects: {
    title: 'Teacher Subject Assignment',
    subtitle: 'Assign instructor faculty members to specialized subjects.',
    itemName: 'Teacher Assignment',
    headers: ['Faculty Instructor', 'Assigned Subject', 'Assigned Section', 'Status'],
    items: [
      { col1: 'Dr. Sarah Jenkins', col2: 'IT-202 Database Management Systems', col3: 'BSIT 2A & BSIT 2B', status: 'Active' },
      { col1: 'Prof. Robert Miller', col2: 'BA-201 Principles of Marketing', col3: 'BSBA 2A & BSBA 2B', status: 'Active' },
      { col1: 'Ms. Emily Davis', col2: 'IT-201 Data Structures and Algorithms', col3: 'BSIT 2A', status: 'Active' },
      { col1: 'Mr. Michael Chang', col2: 'ACC-101 Financial Accounting', col3: 'BSA 2A & BSA 2B', status: 'Active' },
      { col1: 'Dr. Leonardo Gomez', col2: 'CS-205 Object-Oriented Programming', col3: 'BSCS 2A & BSCS 2B', status: 'Active' }
    ]
  }
};

let currentActiveModuleKey = null;

// =============================================================
// MODAL CONTROLS & MANAGEMENT DIALOGS
// =============================================================
function openSetupModal(moduleKey) {
  const config = academicModuleConfigs[moduleKey];
  if (!config) return;

  currentActiveModuleKey = moduleKey;

  const modal = document.getElementById('setupModal');
  const modalTitle = document.getElementById('setupModalTitle');
  const modalSubtitle = document.getElementById('setupModalSubtitle');
  const modalAddItemBtnText = document.getElementById('modalAddItemBtnText');
  const tableHeaders = document.getElementById('setupTableHeaders');
  const tableBody = document.getElementById('setupTableBody');

  if (modalTitle) modalTitle.textContent = config.title;
  if (modalSubtitle) modalSubtitle.textContent = config.subtitle;
  if (modalAddItemBtnText) modalAddItemBtnText.textContent = `+ Add ${config.itemName}`;

  // Render Table Headers
  if (tableHeaders) {
    tableHeaders.innerHTML = `
      <tr class="border-b border-[#e5e7eb] text-[11px] font-bold text-[#6b7280] tracking-wider bg-gray-50/50">
        <th class="py-2.5 px-4">${config.headers[0]}</th>
        <th class="py-2.5 px-4">${config.headers[1]}</th>
        <th class="py-2.5 px-4">${config.headers[2]}</th>
        <th class="py-2.5 px-4">${config.headers[3]}</th>
        <th class="py-2.5 px-4 text-center">Action</th>
      </tr>
    `;
  }

  // Render Table Rows
  if (tableBody) {
    tableBody.innerHTML = config.items.map((item, idx) => `
      <tr class="hover:bg-[#f8fafc] transition-colors border-b border-[#f1f5f9] text-xs">
        <td class="py-3 px-4 font-bold text-[#111827]">${item.col1}</td>
        <td class="py-3 px-4 text-[#374151]">${item.col2}</td>
        <td class="py-3 px-4 text-[#6b7280]">${item.col3}</td>
        <td class="py-3 px-4">
          <span class="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold ${
            item.status === 'Active' || item.status === 'Assigned'
              ? 'bg-[#ecfdf5] text-[#10b981] border border-[#a7f3d0]'
              : item.status === 'Upcoming'
              ? 'bg-[#eff6ff] text-[#0030c2] border border-[#bfdbfe]'
              : 'bg-[#f1f5f9] text-[#64748b] border border-[#e2e8f0]'
          }">
            ${item.status}
          </span>
        </td>
        <td class="py-3 px-4 text-center whitespace-nowrap">
          <div class="flex items-center justify-center gap-1">
            <button onclick="handleEditItem(${idx})" class="p-1.5 text-[#4b5563] hover:text-[#0030c2] hover:bg-[#e7edff] rounded-lg transition-colors" title="Edit">
              <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" /></svg>
            </button>
            <button onclick="handleDeleteItem(${idx})" class="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors" title="Remove">
              <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
            </button>
          </div>
        </td>
      </tr>
    `).join('');
  }

  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }
}

function closeSetupModal() {
  const modal = document.getElementById('setupModal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
}

function openAddItemModal() {
  const config = academicModuleConfigs[currentActiveModuleKey];
  if (!config) return;

  const promptName = prompt(`Enter new ${config.itemName} details (Name / Code):`);
  if (promptName && promptName.trim()) {
    config.items.push({
      col1: promptName.trim(),
      col2: 'Standard Configuration',
      col3: 'S.Y. 2025 - 2026',
      status: 'Active'
    });
    openSetupModal(currentActiveModuleKey);
    showToast(`${config.itemName} "${promptName}" added successfully!`, 'success');
  }
}

function handleEditItem(index) {
  const config = academicModuleConfigs[currentActiveModuleKey];
  if (!config || !config.items[index]) return;

  const currentVal = config.items[index].col1;
  const newVal = prompt(`Update ${config.itemName} title:`, currentVal);
  if (newVal && newVal.trim()) {
    config.items[index].col1 = newVal.trim();
    openSetupModal(currentActiveModuleKey);
    showToast(`${config.itemName} updated successfully!`, 'success');
  }
}

function handleDeleteItem(index) {
  const config = academicModuleConfigs[currentActiveModuleKey];
  if (!config || !config.items[index]) return;

  if (confirm(`Are you sure you want to remove "${config.items[index].col1}"?`)) {
    const removed = config.items.splice(index, 1);
    openSetupModal(currentActiveModuleKey);
    showToast(`Removed "${removed[0].col1}" from ${config.title}.`, 'info');
  }
}

// =============================================================
// RECENT ACTIVITIES EXPANDER
// =============================================================
let isActivitiesExpanded = false;

const additionalActivities = [
  { activity: 'Room Reallocation', details: 'Lab 301 assigned to IT-201 Data Structures class.', date: 'May 19, 2026  02:15 PM', user: 'Admin User' },
  { activity: 'Adviser Assigned', details: 'Ms. Emily Davis assigned as Adviser for BSIT 2A.', date: 'May 18, 2026  11:00 AM', user: 'Admin User' },
  { activity: 'Course Curriculum Updated', details: 'BSCS 2nd Year elective modules updated.', date: 'May 18, 2026  09:30 AM', user: 'Admin User' },
  { activity: 'School Year Setup Completed', details: 'S.Y. 2026 - 2027 calendar terms published.', date: 'May 17, 2026  04:00 PM', user: 'Admin User' }
];

function toggleRecentActivities() {
  const extraContainer = document.getElementById('extraActivitiesContainer');
  const toggleBtnText = document.getElementById('viewMoreBtnText');

  if (!extraContainer || !toggleBtnText) return;

  isActivitiesExpanded = !isActivitiesExpanded;

  if (isActivitiesExpanded) {
    extraContainer.innerHTML = additionalActivities.map(act => `
      <tr class="hover:bg-[#f8fafc] transition-colors border-b border-[#f1f5f9] text-xs">
        <td class="py-3.5 px-4 font-bold text-[#111827]">${act.activity}</td>
        <td class="py-3.5 px-4 text-[#4b5563]">${act.details}</td>
        <td class="py-3.5 px-4 text-[#6b7280] font-medium whitespace-nowrap">${act.date}</td>
        <td class="py-3.5 px-4 text-[#374151] font-semibold">${act.user}</td>
      </tr>
    `).join('');
    extraContainer.classList.remove('hidden');
    toggleBtnText.innerHTML = 'View Less <svg class="w-3 h-3 inline rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>';
  } else {
    extraContainer.innerHTML = '';
    extraContainer.classList.add('hidden');
    toggleBtnText.innerHTML = 'View More <svg class="w-3 h-3 inline transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>';
  }
}

function openAllActivitiesModal() {
  const modal = document.getElementById('activitiesModal');
  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }
}

function closeAllActivitiesModal() {
  const modal = document.getElementById('activitiesModal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
}

// =============================================================
// MODAL LISTENERS (ESC & BACKDROP)
// =============================================================
function initModalListeners() {
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closeSetupModal();
      closeAllActivitiesModal();
    }
  });

  const setupModal = document.getElementById('setupModal');
  if (setupModal) {
    setupModal.addEventListener('click', function (e) {
      if (e.target === setupModal) closeSetupModal();
    });
  }

  const actModal = document.getElementById('activitiesModal');
  if (actModal) {
    actModal.addEventListener('click', function (e) {
      if (e.target === actModal) closeAllActivitiesModal();
    });
  }
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
