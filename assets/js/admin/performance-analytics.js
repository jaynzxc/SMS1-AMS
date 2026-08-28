/**
 * Performance Analytics Logic & Interactivity
 */

document.addEventListener('DOMContentLoaded', () => {
  initStudentsAtRiskTabs();
  initExportAction();
  initFilterListeners();
});

/**
 * Tab switcher for "Students At Risk" card (Most Absences vs Most Tardiness)
 */
function initStudentsAtRiskTabs() {
  const btnTabAbsences = document.getElementById('btnTabAbsences');
  const btnTabTardiness = document.getElementById('btnTabTardiness');
  const viewMostAbsences = document.getElementById('viewMostAbsences');
  const viewMostTardiness = document.getElementById('viewMostTardiness');

  if (!btnTabAbsences || !btnTabTardiness || !viewMostAbsences || !viewMostTardiness) return;

  btnTabAbsences.addEventListener('click', () => {
    // Absences active style
    btnTabAbsences.className = 'text-xs font-bold text-[#dc2626] pb-1 border-b-2 border-[#dc2626] focus:outline-none transition-colors';
    btnTabTardiness.className = 'text-xs font-medium text-[#6b7280] pb-1 hover:text-[#111827] focus:outline-none transition-colors';
    
    viewMostAbsences.classList.remove('hidden');
    viewMostTardiness.classList.add('hidden');
  });

  btnTabTardiness.addEventListener('click', () => {
    // Tardiness active style
    btnTabTardiness.className = 'text-xs font-bold text-[#ea580c] pb-1 border-b-2 border-[#ea580c] focus:outline-none transition-colors';
    btnTabAbsences.className = 'text-xs font-medium text-[#6b7280] pb-1 hover:text-[#111827] focus:outline-none transition-colors';
    
    viewMostTardiness.classList.remove('hidden');
    viewMostAbsences.classList.add('hidden');
  });
}

/**
 * Export analytics action
 */
function initExportAction() {
  const btnExport = document.getElementById('btnExport');
  if (!btnExport) return;

  btnExport.addEventListener('click', () => {
    // Trigger download or print prompt for analytics
    alert('Exporting Performance Analytics report for the selected filter criteria...');
  });
}

/**
 * Filter change listeners for dynamic updates
 */
function initFilterListeners() {
  const filters = ['filterSchoolYear', 'filterSemester', 'filterMonth', 'filterCourse', 'filterSection', 'filterTeacher'];

  filters.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('change', () => {
        // Visual feedback when filter changes
        console.log(`Filter changed: ${id} = ${el.value}`);
      });
    }
  });
}
