// assets/js/common/export-modal.js
// Universal Table-Level Export Modal Component with CHED Collegiate Compliance
// Supports CSV, EXCEL (.xlsx), PDF (Printable CHED Sheet), and WORD (.doc)

let currentExportOptions = null;

/**
 * Initializes and dynamically injects the universal Export Modal into the DOM if not present.
 */
function ensureExportModalDOM() {
  if (document.getElementById('bcpUniversalExportModal')) return;

  const modalHtml = `
  <div id="bcpUniversalExportModal" class="fixed inset-0 z-50 hidden flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs transition-opacity duration-200">
    <div class="bg-white rounded-2xl shadow-2xl border border-[#e5e7eb] max-w-lg w-full overflow-hidden transform transition-all scale-95 opacity-0 duration-200" id="bcpExportModalCard">
      <!-- Modal Header -->
      <div class="flex items-center justify-between px-6 py-4 border-b border-[#e5e7eb] bg-[#f8fafc]">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-xl bg-[#eff6ff] text-[#0030c2] border border-[#bfdbfe] flex items-center justify-center shrink-0">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"/>
            </svg>
          </div>
          <div>
            <h3 class="text-sm font-bold text-[#111827]" id="bcpExportModalTitle">Export Table Records</h3>
            <p class="text-[11px] text-[#6b7280]">Select file format and download options</p>
          </div>
        </div>
        <button type="button" onclick="closeExportModal()" class="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <!-- Modal Body -->
      <div class="p-6 space-y-5">
        <!-- CHED Compliance Badge -->
        <div class="flex items-center gap-2.5 p-3 rounded-xl bg-[#eff6ff] border border-[#bfdbfe] text-xs text-[#0030c2]">
          <svg class="w-4 h-4 shrink-0 text-[#0030c2]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z"/>
          </svg>
          <span class="font-semibold">CHED Collegiate Compliance Standard Formats Included</span>
        </div>

        <!-- Format Selector Grid -->
        <div>
          <label class="block text-xs font-bold text-[#374151] mb-2.5">Select Export File Format</label>
          <div class="grid grid-cols-2 gap-3" id="bcpExportFormatGrid">
            <!-- CSV Format Tile -->
            <label class="relative flex flex-col p-3.5 rounded-xl border-2 border-[#0030c2] bg-[#eff6ff] cursor-pointer hover:border-[#0030c2] transition-all bcp-format-option">
              <input type="radio" name="bcpExportFormat" value="CSV" checked class="hidden" style="display: none;">
              <div class="flex items-center justify-between mb-1.5">
                <span class="inline-flex items-center justify-center px-2 py-0.5 rounded text-[10px] font-bold bg-[#0030c2] text-white">.CSV</span>
                <span class="w-4 h-4 rounded-full border-2 border-[#0030c2] flex items-center justify-center bg-white bcp-radio-indicator">
                  <span class="w-2 h-2 rounded-full bg-[#0030c2]"></span>
                </span>
              </div>
              <p class="text-xs font-bold text-[#111827]">CSV Spreadsheet</p>
              <p class="text-[10px] text-[#6b7280]">Universal delimited text file</p>
            </label>

            <!-- Excel Format Tile -->
            <label class="relative flex flex-col p-3.5 rounded-xl border-2 border-[#e5e7eb] bg-white cursor-pointer hover:border-[#16a34a] hover:bg-green-50/30 transition-all bcp-format-option">
              <input type="radio" name="bcpExportFormat" value="EXCEL" class="hidden" style="display: none;">
              <div class="flex items-center justify-between mb-1.5">
                <span class="inline-flex items-center justify-center px-2 py-0.5 rounded text-[10px] font-bold bg-[#16a34a] text-white">.XLSX</span>
                <span class="w-4 h-4 rounded-full border-2 border-gray-300 flex items-center justify-center bg-white bcp-radio-indicator"></span>
              </div>
              <p class="text-xs font-bold text-[#111827]">Microsoft Excel</p>
              <p class="text-[10px] text-[#6b7280]">Formatted table workbook</p>
            </label>

            <!-- PDF Format Tile -->
            <label class="relative flex flex-col p-3.5 rounded-xl border-2 border-[#e5e7eb] bg-white cursor-pointer hover:border-[#dc2626] hover:bg-red-50/30 transition-all bcp-format-option">
              <input type="radio" name="bcpExportFormat" value="PDF" class="hidden" style="display: none;">
              <div class="flex items-center justify-between mb-1.5">
                <span class="inline-flex items-center justify-center px-2 py-0.5 rounded text-[10px] font-bold bg-[#dc2626] text-white">.PDF</span>
                <span class="w-4 h-4 rounded-full border-2 border-gray-300 flex items-center justify-center bg-white bcp-radio-indicator"></span>
              </div>
              <p class="text-xs font-bold text-[#111827]">Printable PDF</p>
              <p class="text-[10px] text-[#6b7280]">CHED Collegiate Form with Signatures</p>
            </label>

            <!-- Word Format Tile -->
            <label class="relative flex flex-col p-3.5 rounded-xl border-2 border-[#e5e7eb] bg-white cursor-pointer hover:border-[#0030c2] hover:bg-blue-50/30 transition-all bcp-format-option">
              <input type="radio" name="bcpExportFormat" value="WORD" class="hidden" style="display: none;">
              <div class="flex items-center justify-between mb-1.5">
                <span class="inline-flex items-center justify-center px-2 py-0.5 rounded text-[10px] font-bold text-white" style="background-color: #2563eb;">.DOC</span>
                <span class="w-4 h-4 rounded-full border-2 border-gray-300 flex items-center justify-center bg-white bcp-radio-indicator"></span>
              </div>
              <p class="text-xs font-bold text-[#111827]">Microsoft Word</p>
              <p class="text-[10px] text-[#6b7280]">Editable document with header</p>
            </label>
          </div>
        </div>

        <!-- Custom Filename Field -->
        <div>
          <label class="block text-xs font-bold text-[#374151] mb-1.5">File Name</label>
          <div class="relative">
            <input type="text" id="bcpExportFileNameInput" class="w-full px-3 py-2 text-xs font-medium text-[#111827] bg-[#f8fafc] border border-[#e5e7eb] rounded-xl focus:bg-white focus:border-[#0030c2] focus:outline-none transition-all">
          </div>
        </div>
      </div>

      <!-- Modal Footer Actions -->
      <div class="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#e5e7eb] bg-[#f8fafc]">
        <button type="button" onclick="closeExportModal()" class="px-4 py-2 text-xs font-semibold text-[#374151] hover:bg-gray-200/60 rounded-xl transition-colors cursor-pointer">
          Cancel
        </button>
        <button type="button" onclick="executeExportDownload()" id="bcpExportDownloadBtn" class="inline-flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-[#0030c2] hover:bg-[#002699] rounded-xl shadow-xs transition-colors cursor-pointer">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"/>
          </svg>
          <span>Download Export</span>
        </button>
      </div>
    </div>
  </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHtml);

  // Bind radio card visual state changes
  const formatOptions = document.querySelectorAll('#bcpExportFormatGrid .bcp-format-option');
  formatOptions.forEach(card => {
    card.addEventListener('click', () => {
      formatOptions.forEach(c => {
        c.classList.remove('border-[#0030c2]', 'bg-[#eff6ff]', 'border-[#16a34a]', 'bg-green-50/30', 'border-[#dc2626]', 'bg-red-50/30');
        c.classList.add('border-[#e5e7eb]', 'bg-white');
        const ind = c.querySelector('.bcp-radio-indicator');
        if (ind) {
          ind.classList.remove('border-[#0030c2]', 'border-[#16a34a]', 'border-[#dc2626]');
          ind.classList.add('border-gray-300');
          ind.innerHTML = '';
        }
      });

      const radio = card.querySelector('input[type="radio"]');
      radio.checked = true;

      const ind = card.querySelector('.bcp-radio-indicator');
      if (radio.value === 'CSV') {
        card.classList.remove('border-[#e5e7eb]', 'bg-white');
        card.classList.add('border-[#0030c2]', 'bg-[#eff6ff]');
        if (ind) {
          ind.classList.remove('border-gray-300');
          ind.classList.add('border-[#0030c2]');
          ind.innerHTML = '<span class="w-2 h-2 rounded-full bg-[#0030c2]"></span>';
        }
      } else if (radio.value === 'EXCEL') {
        card.classList.remove('border-[#e5e7eb]', 'bg-white');
        card.classList.add('border-[#16a34a]', 'bg-green-50/30');
        if (ind) {
          ind.classList.remove('border-gray-300');
          ind.classList.add('border-[#16a34a]');
          ind.innerHTML = '<span class="w-2 h-2 rounded-full bg-[#16a34a]"></span>';
        }
      } else if (radio.value === 'PDF') {
        card.classList.remove('border-[#e5e7eb]', 'bg-white');
        card.classList.add('border-[#dc2626]', 'bg-red-50/30');
        if (ind) {
          ind.classList.remove('border-gray-300');
          ind.classList.add('border-[#dc2626]');
          ind.innerHTML = '<span class="w-2 h-2 rounded-full bg-[#dc2626]"></span>';
        }
      } else if (radio.value === 'WORD') {
        card.classList.remove('border-[#e5e7eb]', 'bg-white');
        card.classList.add('border-[#0030c2]', 'bg-blue-50/30');
        if (ind) {
          ind.classList.remove('border-gray-300');
          ind.classList.add('border-[#0030c2]');
          ind.innerHTML = '<span class="w-2 h-2 rounded-full bg-[#0030c2]"></span>';
        }
      }
    });
  });

  // Close on Backdrop Click
  document.getElementById('bcpUniversalExportModal').addEventListener('click', (e) => {
    if (e.target.id === 'bcpUniversalExportModal') {
      closeExportModal();
    }
  });

  // Close on Escape Key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeExportModal();
  });
}

/**
 * Opens the universal export modal with table context and options.
 * @param {Object} options 
 *   - tableId: string (ID of the <table> to extract data from)
 *   - title: string (Display title on modal)
 *   - filename: string (Default filename without extension)
 *   - getHeaders: function (Optional custom header extractor)
 *   - getRows: function (Optional custom row extractor)
 *   - chedMetadata: object (Department, Course, Section, Subject, Instructor, Semester)
 */
export function openExportModal(options = {}) {
  if (!options || typeof options !== 'object' || options instanceof Event) {
    options = {};
  }
  ensureExportModalDOM();
  currentExportOptions = options;

  const titleEl = document.getElementById('bcpExportModalTitle');
  if (titleEl) {
    titleEl.textContent = options.title ? `Export: ${options.title}` : 'Export Table Records';
  }

  const dateStr = new Date().toISOString().split('T')[0];
  const defaultFilename = options.filename 
    ? `${options.filename}_${dateStr}`
    : `BCP_AMS_Report_${dateStr}`;

  const inputEl = document.getElementById('bcpExportFileNameInput');
  if (inputEl) {
    inputEl.value = defaultFilename;
  }

  const modal = document.getElementById('bcpUniversalExportModal');
  const card = document.getElementById('bcpExportModalCard');
  if (modal && card) {
    modal.classList.remove('hidden');
    requestAnimationFrame(() => {
      card.classList.remove('scale-95', 'opacity-0');
      card.classList.add('scale-100', 'opacity-100');
    });
  }
}

/**
 * Closes the export modal dialog.
 */
export function closeExportModal() {
  const modal = document.getElementById('bcpUniversalExportModal');
  const card = document.getElementById('bcpExportModalCard');
  if (modal && card) {
    card.classList.remove('scale-100', 'opacity-100');
    card.classList.add('scale-95', 'opacity-0');
    setTimeout(() => {
      modal.classList.add('hidden');
    }, 150);
  }
}

/**
 * Extracts clean tabular data from an HTML table element.
 */
function extractTableData(tableId) {
  let table = tableId ? document.getElementById(tableId) : null;
  if (!table) {
    table = document.querySelector('table');
  }
  if (!table) return { headers: [], rows: [] };

  const headers = [];
  const thEls = table.querySelectorAll('thead th');
  thEls.forEach(th => {
    const text = th.innerText.trim();
    // Exclude action columns or selection checkboxes
    if (text && !['action', 'actions', 'select', 'checkbox'].includes(text.toLowerCase())) {
      headers.push(text);
    }
  });

  const rows = [];
  const trEls = table.querySelectorAll('tbody tr');
  trEls.forEach(tr => {
    // Skip empty state or loading indicator rows
    if (tr.querySelector('.animate-pulse') || tr.innerText.includes('No records') || tr.innerText.includes('No Attendance')) {
      return;
    }
    const row = [];
    const tdEls = tr.querySelectorAll('td');
    tdEls.forEach((td, idx) => {
      if (idx < headers.length) {
        // Strip out SVG icons or nested button text
        const clone = td.cloneNode(true);
        clone.querySelectorAll('button, svg, input').forEach(el => el.remove());
        row.push(clone.innerText.trim().replace(/\s+/g, ' '));
      }
    });
    if (row.length > 0) rows.push(row);
  });

  return { headers, rows };
}

/**
 * Handles the download action triggered by the modal.
 */
export function executeExportDownload() {
  if (!currentExportOptions) return;

  const selectedFormatEl = document.querySelector('input[name="bcpExportFormat"]:checked');
  const format = selectedFormatEl ? selectedFormatEl.value : 'CSV';

  const fileNameInput = document.getElementById('bcpExportFileNameInput');
  const filename = (fileNameInput && fileNameInput.value.trim()) 
    ? fileNameInput.value.trim() 
    : `BCP_AMS_Export_${Date.now()}`;

  // Extract tabular data
  let headers = [];
  let rows = [];

  if (typeof currentExportOptions.getHeaders === 'function' && typeof currentExportOptions.getRows === 'function') {
    headers = currentExportOptions.getHeaders();
    rows = currentExportOptions.getRows();
  } else if (currentExportOptions.tableId) {
    const extracted = extractTableData(currentExportOptions.tableId);
    headers = extracted.headers;
    rows = extracted.rows;
  }

  if (headers.length === 0 || rows.length === 0) {
    alert('No exportable records found in the current table.');
    closeExportModal();
    return;
  }

  const ched = currentExportOptions.chedMetadata || {
    department: 'College of Computer Studies',
    course: 'Bachelor of Science in Information Technology',
    section: 'BSIT 3A',
    subject: 'IT301 - Systems Integration and Architecture',
    semester: '1st Semester, Academic Year 2026-2027',
    instructor: 'Faculty Instructor',
    remarks: 'Official Class Attendance Sheet in Compliance with CHED CMO Standards'
  };

  if (format === 'CSV') {
    exportToCSV(filename, headers, rows);
  } else if (format === 'EXCEL') {
    exportToExcel(filename, headers, rows, ched);
  } else if (format === 'PDF') {
    exportToCHEDPrintablePDF(filename, headers, rows, ched);
  } else if (format === 'WORD') {
    exportToWord(filename, headers, rows, ched);
  }

  closeExportModal();
}

/**
 * Exports data to CSV with UTF-8 BOM.
 */
function exportToCSV(filename, headers, rows) {
  const csvContent = '\uFEFF' + [
    headers.map(h => `"${String(h).replace(/"/g, '""')}"`).join(','),
    ...rows.map(row => row.map(c => `"${String(c ?? '').replace(/"/g, '""')}"`).join(','))
  ].join('\r\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  triggerDownload(blob, filename.endsWith('.csv') ? filename : `${filename}.csv`);
}

/**
 * Exports data to Excel (.xlsx / HTML Spreadsheet).
 */
function exportToExcel(filename, headers, rows, ched) {
  const excelHtml = `
  <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <style>
      body { font-family: 'Segoe UI', Arial, sans-serif; font-size: 11pt; }
      table { border-collapse: collapse; width: 100%; }
      th { background-color: #0030c2; color: #ffffff; font-weight: bold; border: 1px solid #cbd5e1; padding: 8px; text-align: left; }
      td { border: 1px solid #cbd5e1; padding: 6px; }
      .header-title { font-size: 14pt; font-weight: bold; color: #0030c2; }
      .header-sub { font-size: 10pt; color: #475569; }
      .meta-label { font-weight: bold; color: #1e293b; }
    </style>
  </head>
  <body>
    <div class="header-title">BESTLINK COLLEGE OF THE PHILIPPINES</div>
    <div class="header-sub">Commission on Higher Education (CHED) Compliance Attendance Record</div>
    <div class="header-sub">${ched.department} | ${ched.course}</div>
    <br/>
    <table>
      <tr><td class="meta-label">Subject:</td><td>${ched.subject}</td><td class="meta-label">Section:</td><td>${ched.section}</td></tr>
      <tr><td class="meta-label">Semester / A.Y.:</td><td>${ched.semester}</td><td class="meta-label">Instructor:</td><td>${ched.instructor}</td></tr>
      <tr><td class="meta-label">Generated Date:</td><td>${new Date().toLocaleDateString()}</td><td class="meta-label">Total Records:</td><td>${rows.length}</td></tr>
    </table>
    <br/>
    <table>
      <thead>
        <tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr>
      </thead>
      <tbody>
        ${rows.map(r => `<tr>${r.map(cell => `<td>${cell}</td>`).join('')}</tr>`).join('')}
      </tbody>
    </table>
    <br/>
    <p><em>${ched.remarks}</em></p>
  </body>
  </html>`;

  const blob = new Blob([excelHtml], { type: 'application/vnd.ms-excel;charset=utf-8;' });
  triggerDownload(blob, filename.endsWith('.xls') ? filename : `${filename}.xls`);
}

/**
 * Generates an official CHED Collegiate Printable PDF view and invokes window.print().
 */
function exportToCHEDPrintablePDF(filename, headers, rows, ched) {
  const printWindow = window.open('', '_blank', 'width=950,height=750');
  if (!printWindow) {
    alert('Please allow popups to open the printable CHED Attendance PDF preview.');
    return;
  }

  const printHtml = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>${filename}</title>
    <style>
      @page { size: letter landscape; margin: 12mm; }
      body { font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Arial, sans-serif; color: #111827; margin: 0; padding: 20px; font-size: 11px; }
      .bcp-header { text-align: center; border-bottom: 2px solid #0030c2; padding-bottom: 12px; margin-bottom: 15px; }
      .bcp-title { font-size: 16px; font-weight: 800; color: #0030c2; letter-spacing: 0.5px; margin: 0; }
      .bcp-sub { font-size: 11px; color: #4b5563; margin: 2px 0; }
      .bcp-dept { font-size: 12px; font-weight: 700; color: #111827; text-transform: uppercase; margin-top: 4px; }
      .report-badge { display: inline-block; background-color: #eff6ff; color: #0030c2; border: 1px solid #bfdbfe; font-size: 10px; font-weight: bold; padding: 2px 10px; border-radius: 9999px; margin-top: 6px; }
      .meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; margin-bottom: 16px; font-size: 11px; background-color: #f8fafc; border: 1px solid #e5e7eb; padding: 10px; border-radius: 8px; }
      .meta-item { display: flex; gap: 6px; }
      .meta-label { font-weight: 700; color: #374151; min-width: 90px; }
      table { width: 100%; border-collapse: collapse; margin-top: 8px; font-size: 10.5px; }
      th { background-color: #0030c2; color: #ffffff; font-weight: 700; text-align: left; padding: 6px 8px; border: 1px solid #002699; }
      td { padding: 5px 8px; border: 1px solid #e5e7eb; }
      tr:nth-child(even) { background-color: #f9fafb; }
      .compliance-note { margin-top: 14px; font-size: 9.5px; color: #6b7280; font-style: italic; }
      .signatories-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; margin-top: 40px; page-break-inside: avoid; }
      .sig-line { border-top: 1px solid #111827; padding-top: 4px; text-align: center; }
      .sig-name { font-weight: 700; font-size: 11px; }
      .sig-title { font-size: 9.5px; color: #6b7280; }
      @media print {
        body { padding: 0; }
        .no-print { display: none !important; }
      }
    </style>
  </head>
  <body>
    <div class="bcp-header">
      <h1 class="bcp-title">BESTLINK COLLEGE OF THE PHILIPPINES</h1>
      <p class="bcp-sub">#1071 Brgy. Kaligayahan, Quirino Highway, Novaliches, Quezon City</p>
      <p class="bcp-dept">${ched.department}</p>
      <div class="report-badge">CHED COLLEGIATE ATTENDANCE RECORD COMPLIANCE</div>
    </div>

    <div class="meta-grid">
      <div class="meta-item"><span class="meta-label">Program:</span><span>${ched.course}</span></div>
      <div class="meta-item"><span class="meta-label">Section:</span><span>${ched.section}</span></div>
      <div class="meta-item"><span class="meta-label">Course Subject:</span><span>${ched.subject}</span></div>
      <div class="meta-item"><span class="meta-label">Academic Term:</span><span>${ched.semester}</span></div>
      <div class="meta-item"><span class="meta-label">Instructor:</span><span>${ched.instructor}</span></div>
      <div class="meta-item"><span class="meta-label">Generated On:</span><span>${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span></div>
    </div>

    <table>
      <thead>
        <tr>
          <th style="width: 35px;">No.</th>
          ${headers.map(h => `<th>${h}</th>`).join('')}
        </tr>
      </thead>
      <tbody>
        ${rows.map((row, idx) => `
          <tr>
            <td style="text-align: center; color: #6b7280;">${idx + 1}</td>
            ${row.map(cell => `<td>${cell}</td>`).join('')}
          </tr>
        `).join('')}
      </tbody>
    </table>

    <p class="compliance-note">${ched.remarks} | Benchmark: Minimum 80% class attendance required for collegiate unit accreditation.</p>

    <div class="signatories-grid">
      <div class="sig-line">
        <p class="sig-name">${ched.instructor}</p>
        <p class="sig-title">Subject Instructor</p>
      </div>
      <div class="sig-line">
        <p class="sig-name">Dean / Department Head</p>
        <p class="sig-title">${ched.department}</p>
      </div>
      <div class="sig-line">
        <p class="sig-name">Office of the Registrar / OSAS</p>
        <p class="sig-title">Academic Records Division</p>
      </div>
    </div>

    <script>
      window.onload = function() {
        setTimeout(function() {
          window.print();
        }, 350);
      };
    </script>
  </body>
  </html>`;

  printWindow.document.open();
  printWindow.document.write(printHtml);
  printWindow.document.close();
}

/**
 * Exports data to Microsoft Word document (.doc formatted HTML).
 */
function exportToWord(filename, headers, rows, ched) {
  const wordHtml = `
  <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
  <head>
    <meta charset="utf-8">
    <title>${filename}</title>
    <style>
      body { font-family: 'Calibri', Arial, sans-serif; font-size: 10.5pt; color: #111827; }
      h2 { color: #0030c2; margin-bottom: 2px; }
      table { border-collapse: collapse; width: 100%; margin-top: 10px; }
      th { background-color: #0030c2; color: #ffffff; border: 1px solid #cbd5e1; padding: 6px; text-align: left; font-size: 10pt; }
      td { border: 1px solid #cbd5e1; padding: 5px; font-size: 9.5pt; }
      .meta { margin-bottom: 12px; }
      .meta td { border: none; padding: 2px 8px; }
    </style>
  </head>
  <body>
    <div style="text-align: center; border-bottom: 2px solid #0030c2; padding-bottom: 10px;">
      <h2>BESTLINK COLLEGE OF THE PHILIPPINES</h2>
      <p style="font-size: 9pt; color: #4b5563; margin: 0;">#1071 Brgy. Kaligayahan, Quirino Highway, Novaliches, Quezon City</p>
      <p style="font-weight: bold; margin: 4px 0;">${ched.department}</p>
      <p style="font-size: 9pt; font-weight: bold; color: #0030c2;">OFFICIAL CHED COLLEGIATE ATTENDANCE REPORT</p>
    </div>
    <br/>
    <table class="meta">
      <tr><td><b>Course:</b></td><td>${ched.course}</td><td><b>Section:</b></td><td>${ched.section}</td></tr>
      <tr><td><b>Subject:</b></td><td>${ched.subject}</td><td><b>Semester:</b></td><td>${ched.semester}</td></tr>
      <tr><td><b>Instructor:</b></td><td>${ched.instructor}</td><td><b>Date:</b></td><td>${new Date().toLocaleDateString()}</td></tr>
    </table>
    <br/>
    <table>
      <thead>
        <tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr>
      </thead>
      <tbody>
        ${rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}
      </tbody>
    </table>
    <br/><br/>
    <table style="width: 100%; border: none;">
      <tr style="border: none;">
        <td style="border: none; text-align: center; width: 33%; border-top: 1px solid black;">
          <b>${ched.instructor}</b><br/><span style="font-size: 8pt; color: #6b7280;">Subject Instructor</span>
        </td>
        <td style="border: none; width: 33%;"></td>
        <td style="border: none; text-align: center; width: 33%; border-top: 1px solid black;">
          <b>Dean / Program Head</b><br/><span style="font-size: 8pt; color: #6b7280;">College Dean</span>
        </td>
      </tr>
    </table>
  </body>
  </html>`;

  const blob = new Blob(['\uFEFF' + wordHtml], { type: 'application/msword;charset=utf-8' });
  triggerDownload(blob, filename.endsWith('.doc') ? filename : `${filename}.doc`);
}

/**
 * Helper to trigger file download in browser.
 */
function triggerDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Bind to window for direct HTML inline click handlers if imported via script tag
if (typeof window !== 'undefined') {
  window.openExportModal = openExportModal;
  window.closeExportModal = closeExportModal;
  window.executeExportDownload = executeExportDownload;
}
