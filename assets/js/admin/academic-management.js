// assets/js/admin/academic-management.js
// Academic Configuration Module: Terms, Sections, Subjects

// Default Datasets for Academic Structure
const DEFAULT_TERMS = [
  { id: 'term-1', schoolYear: 'S.Y. 2025 - 2026', semester: '1st Semester', startDate: '2025-08-18', endDate: '2025-12-19', status: 'Active' },
  { id: 'term-2', schoolYear: 'S.Y. 2025 - 2026', semester: '2nd Semester', startDate: '2026-01-12', endDate: '2026-05-22', status: 'Upcoming' },
  { id: 'term-3', schoolYear: 'S.Y. 2024 - 2025', semester: '2nd Semester', startDate: '2025-01-13', endDate: '2025-05-23', status: 'Completed' }
];

const DEFAULT_SECTIONS = [
  { id: 'sec-1', course: 'BSIT', section: '1A', department: 'College of Computer Studies', studentCount: 42, status: 'Active' },
  { id: 'sec-2', course: 'BSIT', section: '2A', department: 'College of Computer Studies', studentCount: 38, status: 'Active' },
  { id: 'sec-3', course: 'BSIT', section: '2B', department: 'College of Computer Studies', studentCount: 35, status: 'Active' },
  { id: 'sec-4', course: 'BSCS', section: '1A', department: 'College of Computer Studies', studentCount: 30, status: 'Active' },
  { id: 'sec-5', course: 'BSCS', section: '2A', department: 'College of Computer Studies', studentCount: 28, status: 'Active' },
  { id: 'sec-6', course: 'BSBA', section: '1A', department: 'College of Business Administration', studentCount: 45, status: 'Active' }
];

const DEFAULT_SUBJECTS = [
  { id: 'subj-1', code: 'IT 201', title: 'Web Development', course: 'BSIT', status: 'Active' },
  { id: 'subj-2', code: 'IT 202', title: 'Database Systems & Design', course: 'BSIT', status: 'Active' },
  { id: 'subj-3', code: 'IT 203', title: 'Networking & Telecommunications', course: 'BSIT', status: 'Active' },
  { id: 'subj-4', code: 'CS 101', title: 'Data Structures and Algorithms', course: 'BSCS', status: 'Active' },
  { id: 'subj-5', code: 'CS 102', title: 'Object-Oriented Programming', course: 'BSCS', status: 'Active' },
  { id: 'subj-6', code: 'BA 101', title: 'Principles of Management', course: 'BSBA', status: 'Active' }
];

let termsData = [];
let sectionsData = [];
let subjectsData = [];

let currentTab = 'terms'; // 'terms' | 'courses' | 'subjects'
let itemToDelete = null;

// Initialize on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  console.log('🎓 Academic Management (Streamlined) Initialized');
  loadData();
  setCurrentDate();
  renderActiveTab();
  initSearch();
  initFormListeners();
});

function loadData() {
  try {
    const savedTerms = localStorage.getItem('sms_academic_terms');
    termsData = savedTerms ? JSON.parse(savedTerms) : DEFAULT_TERMS;

    const savedSections = localStorage.getItem('sms_academic_sections');
    sectionsData = savedSections ? JSON.parse(savedSections) : DEFAULT_SECTIONS;

    const savedSubjects = localStorage.getItem('sms_academic_subjects');
    subjectsData = savedSubjects ? JSON.parse(savedSubjects) : DEFAULT_SUBJECTS;
  } catch (e) {
    console.error('Error loading academic data from storage', e);
    termsData = [...DEFAULT_TERMS];
    sectionsData = [...DEFAULT_SECTIONS];
    subjectsData = [...DEFAULT_SUBJECTS];
  }
  updateMetrics();
}

function saveData() {
  try {
    localStorage.setItem('sms_academic_terms', JSON.stringify(termsData));
    localStorage.setItem('sms_academic_sections', JSON.stringify(sectionsData));
    localStorage.setItem('sms_academic_subjects', JSON.stringify(subjectsData));
  } catch (e) {
    console.error('Error saving academic data to storage', e);
  }
  updateMetrics();
}

function updateMetrics() {
  const activeTerm = termsData.find(t => t.status === 'Active');
  const elActiveTerm = document.getElementById('statActiveTerm');
  if (elActiveTerm) {
    elActiveTerm.textContent = activeTerm ? `${activeTerm.semester.replace('Semester', 'Sem')} ${activeTerm.schoolYear.replace('S.Y. ', '')}` : 'None Active';
  }

  const elTotalSections = document.getElementById('statTotalSections');
  if (elTotalSections) {
    elTotalSections.textContent = `${sectionsData.filter(s => s.status === 'Active').length} Sections`;
  }

  const elTotalSubjects = document.getElementById('statTotalSubjects');
  if (elTotalSubjects) {
    elTotalSubjects.textContent = `${subjectsData.filter(sub => sub.status === 'Active').length} Subjects`;
  }
}

function setCurrentDate() {
  const el = document.getElementById('currentDateLabel');
  if (el) {
    const now = new Date();
    const dayOfWeek = now.toLocaleDateString('en-US', { weekday: 'long' });
    const monthDayYear = now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    el.textContent = `${monthDayYear} (${dayOfWeek})`;
  }
}

// Tab Switching
window.switchAcademicTab = function(tabName) {
  currentTab = tabName;

  // Reset tab button styling
  const tabTerms = document.getElementById('tabTerms');
  const tabCourses = document.getElementById('tabCourses');
  const tabSubjects = document.getElementById('tabSubjects');
  const addBtnLabel = document.getElementById('btnAddItemLabel');

  [tabTerms, tabCourses, tabSubjects].forEach(tab => {
    if (tab) {
      tab.className = 'btn-press flex items-center gap-2 pb-3 px-1 text-sm font-semibold border-b-2 border-transparent text-[#6b7280] hover:text-[#0030c2] transition-all cursor-pointer';
    }
  });

  if (tabName === 'terms') {
    if (tabTerms) tabTerms.className = 'btn-press flex items-center gap-2 pb-3 px-3 text-sm font-bold border-b-2 border-[#0030c2] text-[#0030c2] transition-all cursor-pointer';
    if (addBtnLabel) addBtnLabel.textContent = 'Add Academic Term';
    const cardTitle = document.getElementById('cardTitle');
    if (cardTitle) cardTitle.textContent = 'Academic Terms & Semesters';
  } else if (tabName === 'courses') {
    if (tabCourses) tabCourses.className = 'btn-press flex items-center gap-2 pb-3 px-3 text-sm font-bold border-b-2 border-[#0030c2] text-[#0030c2] transition-all cursor-pointer';
    if (addBtnLabel) addBtnLabel.textContent = 'Add Course & Section';
    const cardTitle = document.getElementById('cardTitle');
    if (cardTitle) cardTitle.textContent = 'Courses & Sections';
  } else if (tabName === 'subjects') {
    if (tabSubjects) tabSubjects.className = 'btn-press flex items-center gap-2 pb-3 px-3 text-sm font-bold border-b-2 border-[#0030c2] text-[#0030c2] transition-all cursor-pointer';
    if (addBtnLabel) addBtnLabel.textContent = 'Add Subject';
    const cardTitle = document.getElementById('cardTitle');
    if (cardTitle) cardTitle.textContent = 'Subjects Catalog';
  }

  // Clear search input on tab change
  const searchInput = document.getElementById('academicSearchInput');
  if (searchInput) searchInput.value = '';

  renderActiveTab();
};

function renderActiveTab(searchQuery = '') {
  const tableHead = document.getElementById('academicTableHead');
  const tableBody = document.getElementById('academicTableBody');
  const recordCountBadge = document.getElementById('cardRecordCount') || document.getElementById('tabRecordCountBadge');

  if (!tableHead || !tableBody) return;


  const query = searchQuery.toLowerCase().trim();

  if (currentTab === 'terms') {
    tableHead.innerHTML = `
      <tr>
        <th class="py-3 px-4">School Year</th>
        <th class="py-3 px-4">Semester Term</th>
        <th class="py-3 px-4">Start Date</th>
        <th class="py-3 px-4">End Date</th>
        <th class="py-3 px-4">Status</th>
        <th class="py-3 px-4 text-center">Actions</th>
      </tr>
    `;

    const filtered = termsData.filter(t => 
      t.schoolYear.toLowerCase().includes(query) || 
      t.semester.toLowerCase().includes(query) ||
      t.status.toLowerCase().includes(query)
    );

    if (recordCountBadge) recordCountBadge.textContent = `${filtered.length} Record${filtered.length === 1 ? '' : 's'}`;

    if (filtered.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="6" class="py-12 text-center text-gray-400">No academic terms found.</td></tr>`;
      return;
    }

    tableBody.innerHTML = filtered.map(t => {
      const isActive = t.status === 'Active';
      const badgeStyle = isActive 
        ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
        : (t.status === 'Upcoming' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-gray-100 text-gray-600 border-gray-200');

      return `
        <tr class="hover:bg-gray-50/80 transition-colors">
          <td class="py-3.5 px-4 font-bold text-[#111827]">${t.schoolYear}</td>
          <td class="py-3.5 px-4 font-medium text-[#374151]">${t.semester}</td>
          <td class="py-3.5 px-4 text-[#6b7280]">${t.startDate || '—'}</td>
          <td class="py-3.5 px-4 text-[#6b7280]">${t.endDate || '—'}</td>
          <td class="py-3.5 px-4">
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${badgeStyle}">
              ${isActive ? '● ' : ''}${t.status}
            </span>
          </td>
          <td class="py-3.5 px-4 text-center">
            <div class="flex items-center justify-center gap-1.5">
              ${!isActive ? `
                <button onclick="setActiveTerm('${t.id}')" title="Set as Active Term" class="btn-press p-1.5 text-[#4b5563] hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>
              ` : ''}
              <button onclick="editItem('terms', '${t.id}')" title="Edit Term" class="btn-press p-1.5 text-[#4b5563] hover:text-[#0030c2] hover:bg-[#e7edff] rounded-lg transition-colors cursor-pointer">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.75">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                </svg>
              </button>
              <button onclick="confirmDeleteItem('terms', '${t.id}')" title="Delete Term" class="btn-press p-1.5 text-[#4b5563] hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.75">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                </svg>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');

  } else if (currentTab === 'courses') {
    tableHead.innerHTML = `
      <tr>
        <th class="py-3 px-4">Course Program</th>
        <th class="py-3 px-4">Section Name</th>
        <th class="py-3 px-4">Department / College</th>
        <th class="py-3 px-4">Active Students</th>
        <th class="py-3 px-4">Status</th>
        <th class="py-3 px-4 text-center">Actions</th>
      </tr>
    `;

    const filtered = sectionsData.filter(s => 
      s.course.toLowerCase().includes(query) || 
      s.section.toLowerCase().includes(query) ||
      s.department.toLowerCase().includes(query)
    );

    if (recordCountBadge) recordCountBadge.textContent = `${filtered.length} Record${filtered.length === 1 ? '' : 's'}`;

    if (filtered.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="6" class="py-12 text-center text-gray-400">No course sections found.</td></tr>`;
      return;
    }

    tableBody.innerHTML = filtered.map(s => {
      const isActive = s.status === 'Active';
      return `
        <tr class="hover:bg-gray-50/80 transition-colors">
          <td class="py-3.5 px-4 font-bold text-[#0030c2]">${s.course}</td>
          <td class="py-3.5 px-4 font-bold text-[#111827]">${s.course} ${s.section}</td>
          <td class="py-3.5 px-4 text-[#4b5563]">${s.department}</td>
          <td class="py-3.5 px-4 font-semibold text-[#111827]">${s.studentCount || 0} Students</td>
          <td class="py-3.5 px-4">
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${isActive ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-gray-100 text-gray-600 border-gray-200'}">
              ${s.status}
            </span>
          </td>
          <td class="py-3.5 px-4 text-center">
            <div class="flex items-center justify-center gap-1.5">
              <button onclick="editItem('courses', '${s.id}')" title="Edit Section" class="btn-press p-1.5 text-[#4b5563] hover:text-[#0030c2] hover:bg-[#e7edff] rounded-lg transition-colors cursor-pointer">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.75">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                </svg>
              </button>
              <button onclick="confirmDeleteItem('courses', '${s.id}')" title="Delete Section" class="btn-press p-1.5 text-[#4b5563] hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.75">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                </svg>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');

  } else if (currentTab === 'subjects') {
    tableHead.innerHTML = `
      <tr>
        <th class="py-3 px-4">Subject Code</th>
        <th class="py-3 px-4">Subject Title / Description</th>
        <th class="py-3 px-4">Program</th>
        <th class="py-3 px-4">Status</th>
        <th class="py-3 px-4 text-center">Actions</th>
      </tr>
    `;

    const filtered = subjectsData.filter(sub => 
      sub.code.toLowerCase().includes(query) || 
      sub.title.toLowerCase().includes(query) ||
      sub.course.toLowerCase().includes(query)
    );

    if (recordCountBadge) recordCountBadge.textContent = `${filtered.length} Record${filtered.length === 1 ? '' : 's'}`;

    if (filtered.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="5" class="py-12 text-center text-gray-400">No subjects found.</td></tr>`;
      return;
    }

    tableBody.innerHTML = filtered.map(sub => {
      const isActive = sub.status === 'Active';
      return `
        <tr class="hover:bg-gray-50/80 transition-colors">
          <td class="py-3.5 px-4 font-mono font-bold text-[#0030c2]">${sub.code}</td>
          <td class="py-3.5 px-4 font-bold text-[#111827]">${sub.title}</td>
          <td class="py-3.5 px-4 font-semibold text-[#4b5563]">${sub.course}</td>
          <td class="py-3.5 px-4">
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${isActive ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-gray-100 text-gray-600 border-gray-200'}">
              ${sub.status}
            </span>
          </td>
          <td class="py-3.5 px-4 text-center">
            <div class="flex items-center justify-center gap-1.5">
              <button onclick="editItem('subjects', '${sub.id}')" title="Edit Subject" class="btn-press p-1.5 text-[#4b5563] hover:text-[#0030c2] hover:bg-[#e7edff] rounded-lg transition-colors cursor-pointer">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.75">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                </svg>
              </button>
              <button onclick="confirmDeleteItem('subjects', '${sub.id}')" title="Delete Subject" class="btn-press p-1.5 text-[#4b5563] hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.75">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                </svg>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }
}

function initSearch() {
  const searchInput = document.getElementById('academicSearchInput');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      renderActiveTab(e.target.value);
    });
  }
}

// Modal Controls
window.openAddModal = function() {
  if (currentTab === 'terms') {
    document.getElementById('formTerm').reset();
    document.getElementById('termEditId').value = '';
    document.getElementById('modalTermTitle').textContent = 'Add Academic Term';
    openModal('modalTerm');
  } else if (currentTab === 'courses') {
    document.getElementById('formCourse').reset();
    document.getElementById('courseEditId').value = '';
    document.getElementById('modalCourseTitle').textContent = 'Add Course & Section';
    openModal('modalCourse');
  } else if (currentTab === 'subjects') {
    document.getElementById('formSubject').reset();
    document.getElementById('subjectEditId').value = '';
    document.getElementById('modalSubjectTitle').textContent = 'Add Subject';
    openModal('modalSubject');
  }
};

window.editItem = function(tab, id) {
  if (tab === 'terms') {
    const item = termsData.find(t => t.id === id);
    if (!item) return;
    document.getElementById('termEditId').value = item.id;
    document.getElementById('termSchoolYear').value = item.schoolYear;
    document.getElementById('termSemester').value = item.semester;
    document.getElementById('termStartDate').value = item.startDate || '';
    document.getElementById('termEndDate').value = item.endDate || '';
    document.getElementById('termStatus').value = item.status;
    document.getElementById('modalTermTitle').textContent = 'Edit Academic Term';
    openModal('modalTerm');
  } else if (tab === 'courses') {
    const item = sectionsData.find(s => s.id === id);
    if (!item) return;
    document.getElementById('courseEditId').value = item.id;
    document.getElementById('courseCodeSelect').value = item.course;
    document.getElementById('sectionNameInput').value = item.section;
    document.getElementById('sectionStatus').value = item.status;
    document.getElementById('modalCourseTitle').textContent = 'Edit Course & Section';
    openModal('modalCourse');
  } else if (tab === 'subjects') {
    const item = subjectsData.find(sub => sub.id === id);
    if (!item) return;
    document.getElementById('subjectEditId').value = item.id;
    document.getElementById('subjectCodeInput').value = item.code;
    document.getElementById('subjectTitleInput').value = item.title;
    document.getElementById('subjectCourseSelect').value = item.course;
    document.getElementById('subjectStatus').value = item.status;
    document.getElementById('modalSubjectTitle').textContent = 'Edit Subject';
    openModal('modalSubject');
  }
};

window.setActiveTerm = function(id) {
  termsData.forEach(t => {
    t.status = (t.id === id) ? 'Active' : 'Upcoming';
  });
  saveData();
  renderActiveTab();
  showToast('Active term updated successfully.', 'success');
};

window.confirmDeleteItem = function(tab, id) {
  itemToDelete = { tab, id };
  const message = document.getElementById('deleteModalMessage');
  if (message) {
    message.textContent = `Are you sure you want to delete this ${tab === 'terms' ? 'academic term' : tab === 'courses' ? 'section' : 'subject'}?`;
  }
  openModal('modalDelete');
};

function initFormListeners() {
  // Term Form
  const formTerm = document.getElementById('formTerm');
  if (formTerm) {
    formTerm.addEventListener('submit', (e) => {
      e.preventDefault();
      const id = document.getElementById('termEditId').value;
      const schoolYear = document.getElementById('termSchoolYear').value.trim();
      const semester = document.getElementById('termSemester').value;
      const startDate = document.getElementById('termStartDate').value;
      const endDate = document.getElementById('termEndDate').value;
      const status = document.getElementById('termStatus').value;

      if (status === 'Active') {
        termsData.forEach(t => { t.status = 'Upcoming'; });
      }

      if (id) {
        const index = termsData.findIndex(t => t.id === id);
        if (index !== -1) {
          termsData[index] = { id, schoolYear, semester, startDate, endDate, status };
        }
      } else {
        termsData.unshift({
          id: 'term-' + Date.now(),
          schoolYear,
          semester,
          startDate,
          endDate,
          status
        });
      }

      saveData();
      closeModal('modalTerm');
      renderActiveTab();
      showToast('Academic term saved successfully.', 'success');
    });
  }

  // Course & Section Form
  const formCourse = document.getElementById('formCourse');
  if (formCourse) {
    formCourse.addEventListener('submit', (e) => {
      e.preventDefault();
      const id = document.getElementById('courseEditId').value;
      const course = document.getElementById('courseCodeSelect').value;
      const section = document.getElementById('sectionNameInput').value.trim().toUpperCase();
      const department = document.getElementById('courseDepartmentInput').value;
      const status = document.getElementById('sectionStatus').value;

      if (id) {
        const index = sectionsData.findIndex(s => s.id === id);
        if (index !== -1) {
          sectionsData[index] = { ...sectionsData[index], course, section, department, status };
        }
      } else {
        sectionsData.push({
          id: 'sec-' + Date.now(),
          course,
          section,
          department,
          studentCount: 0,
          status
        });
      }

      saveData();
      closeModal('modalCourse');
      renderActiveTab();
      showToast('Section saved successfully.', 'success');
    });
  }

  // Subject Form
  const formSubject = document.getElementById('formSubject');
  if (formSubject) {
    formSubject.addEventListener('submit', (e) => {
      e.preventDefault();
      const id = document.getElementById('subjectEditId').value;
      const code = document.getElementById('subjectCodeInput').value.trim().toUpperCase();
      const title = document.getElementById('subjectTitleInput').value.trim();
      const course = document.getElementById('subjectCourseSelect').value;
      const status = document.getElementById('subjectStatus').value;

      if (id) {
        const index = subjectsData.findIndex(sub => sub.id === id);
        if (index !== -1) {
          subjectsData[index] = { id, code, title, course, status };
        }
      } else {
        subjectsData.push({
          id: 'subj-' + Date.now(),
          code,
          title,
          course,
          status
        });
      }

      saveData();
      closeModal('modalSubject');
      renderActiveTab();
      showToast('Subject saved successfully.', 'success');
    });
  }

  // Delete Action
  const btnConfirmDelete = document.getElementById('btnConfirmDelete');
  if (btnConfirmDelete) {
    btnConfirmDelete.addEventListener('click', () => {
      if (!itemToDelete) return;
      const { tab, id } = itemToDelete;

      if (tab === 'terms') {
        termsData = termsData.filter(t => t.id !== id);
      } else if (tab === 'courses') {
        sectionsData = sectionsData.filter(s => s.id !== id);
      } else if (tab === 'subjects') {
        subjectsData = subjectsData.filter(sub => sub.id !== id);
      }

      saveData();
      closeModal('modalDelete');
      renderActiveTab();
      showToast('Record deleted successfully.', 'info');
      itemToDelete = null;
    });
  }
}

// Utility Modal Helpers
window.openModal = function(id) {
  const el = document.getElementById(id);
  if (el) el.classList.remove('hidden');
};

window.closeModal = function(id) {
  const el = document.getElementById(id);
  if (el) el.classList.add('hidden');
};

function showToast(message, type = 'info') {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'pointer-events-auto bg-white border border-[#e5e7eb] shadow-xl rounded-xl p-3 flex items-center gap-3 min-w-[260px] max-w-sm transition-all duration-300 transform translate-x-0';
  
  const iconColor = type === 'success' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-[#0030c2]';
  toast.innerHTML = `
    <div class="w-7 h-7 rounded-full ${iconColor} flex items-center justify-center shrink-0">
      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"/>
      </svg>
    </div>
    <p class="text-xs font-semibold text-[#111827] flex-1">${message}</p>
  `;

  container.appendChild(toast);
  setTimeout(() => {
    toast.classList.add('opacity-0', 'translate-x-full');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}
