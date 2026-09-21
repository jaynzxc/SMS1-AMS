/**
 * Table Pagination Engine - Bestlink College of the Philippines Attendance Monitoring System
 * Handles client-side DOM table pagination, dynamic page navigation, counter calculation,
 * and automatic synchronization with search filters and dynamic roster updates.
 */

(function () {
  'use strict';

  const paginationInstances = [];

  class TablePaginationInstance {
    constructor(table, footer, options = {}) {
      this.table = table;
      this.footer = footer;
      this.tbody = table.querySelector('tbody');
      this.pageSize = options.pageSize || parseInt(table.dataset.pageSize, 10) || 5;
      this.currentPage = 1;
      this.totalRows = 0;
      this.filteredRows = [];
      this.isUpdating = false;

      this.initElements();
      this.bindEvents();
      this.observeMutations();
      this.update();
    }

    initElements() {
      // Find or establish counter element
      this.counterEl = this.footer.querySelector('p') || this.footer.querySelector('#paginationInfo');
      
      // Find button container
      this.buttonContainer = this.footer.querySelector('.flex.items-center.gap-1') ||
                             this.footer.querySelector('#paginationContainer') ||
                             this.footer.querySelector('#paginationControls');

      if (!this.buttonContainer) {
        // Create button container if missing
        this.buttonContainer = document.createElement('div');
        this.buttonContainer.className = 'flex items-center gap-1';
        this.footer.appendChild(this.buttonContainer);
      }
    }

    getEligibleRows() {
      if (!this.tbody) return [];
      const allRows = Array.from(this.tbody.querySelectorAll('tr'));
      return allRows.filter(row => {
        // Ignore "No records found" or empty-state placeholder rows
        if (row.querySelector('td[colspan]')) return false;
        // Ignore rows hidden explicitly by a search filter (not by pagination)
        if (row.dataset.filteredOut === 'true') return false;
        return true;
      });
    }

    update() {
      if (this.isUpdating || !this.tbody) return;
      this.isUpdating = true;

      // Determine which rows are available
      const allRows = Array.from(this.tbody.querySelectorAll('tr'));
      const contentRows = allRows.filter(row => !row.querySelector('td[colspan]'));

      // Check for search filter visibility
      this.filteredRows = contentRows.filter(row => {
        // If row was hidden by external filter script (style.display === 'none' and not tagged by us)
        if (row.style.display === 'none' && !row.dataset.paginatedHidden) {
          row.dataset.filteredOut = 'true';
          return false;
        }
        delete row.dataset.filteredOut;
        return true;
      });

      this.totalRows = this.filteredRows.length;
      const totalPages = Math.max(1, Math.ceil(this.totalRows / this.pageSize));

      if (this.currentPage > totalPages) {
        this.currentPage = totalPages;
      }
      if (this.currentPage < 1) {
        this.currentPage = 1;
      }

      const startIndex = (this.currentPage - 1) * this.pageSize;
      const endIndex = Math.min(startIndex + this.pageSize, this.totalRows);

      // Slice rows display
      this.filteredRows.forEach((row, idx) => {
        if (idx >= startIndex && idx < endIndex) {
          row.style.display = '';
          delete row.dataset.paginatedHidden;
        } else {
          row.style.display = 'none';
          row.dataset.paginatedHidden = 'true';
        }
      });

      this.renderCounters(startIndex, endIndex, totalPages);
      this.renderButtons(totalPages);

      this.isUpdating = false;
    }

    renderCounters(startIndex, endIndex, totalPages) {
      const startCount = this.totalRows === 0 ? 0 : startIndex + 1;
      const endCount = endIndex;
      const totalCount = this.totalRows;

      // Update specific target ID elements if present
      const pageShowingCount = document.getElementById('pageShowingCount');
      const pageTotalCount = document.getElementById('pageTotalCount');
      const showingStartCount = document.getElementById('showingStartCount');
      const showingEndCount = document.getElementById('showingEndCount');
      const showingTotalCount = document.getElementById('showingTotalCount');

      if (pageShowingCount) pageShowingCount.textContent = endCount;
      if (pageTotalCount) pageTotalCount.textContent = totalCount;
      if (showingStartCount) showingStartCount.textContent = startCount;
      if (showingEndCount) showingEndCount.textContent = endCount;
      if (showingTotalCount) showingTotalCount.textContent = totalCount;

      // Update general counter text
      if (this.counterEl && !this.counterEl.querySelector('#showingStartCount')) {
        const noun = this.counterEl.textContent.includes('entries') ? 'entries' : 'records';
        this.counterEl.innerHTML = `Showing <span class="font-semibold text-[#111827]">${startCount}</span> to <span class="font-semibold text-[#111827]">${endCount}</span> of <span class="font-semibold text-[#111827]">${totalCount}</span> ${noun}`;
      }
    }

    renderButtons(totalPages) {
      if (!this.buttonContainer) return;

      this.buttonContainer.innerHTML = '';

      // Prev Button
      const prevBtn = document.createElement('button');
      prevBtn.type = 'button';
      prevBtn.id = 'prevPageBtn';
      prevBtn.className = `w-7 h-7 flex items-center justify-center rounded border border-[#e5e7eb] transition-colors ${
        this.currentPage === 1
          ? 'text-[#9ca3af] opacity-50 cursor-not-allowed'
          : 'text-[#374151] hover:bg-gray-50 cursor-pointer'
      }`;
      prevBtn.title = 'Previous Page';
      prevBtn.disabled = this.currentPage === 1;
      prevBtn.innerHTML = `
        <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
      `;
      prevBtn.addEventListener('click', () => {
        if (this.currentPage > 1) {
          this.currentPage--;
          this.update();
        }
      });
      this.buttonContainer.appendChild(prevBtn);

      // Page Number Buttons
      const maxButtons = 5;
      let startPage = Math.max(1, this.currentPage - Math.floor(maxButtons / 2));
      let endPage = Math.min(totalPages, startPage + maxButtons - 1);

      if (endPage - startPage + 1 < maxButtons) {
        startPage = Math.max(1, endPage - maxButtons + 1);
      }

      if (startPage > 1) {
        this.appendPageButton(1);
        if (startPage > 2) {
          const ellipsis = document.createElement('span');
          ellipsis.className = 'px-1 text-[#9ca3af] text-xs';
          ellipsis.textContent = '...';
          this.buttonContainer.appendChild(ellipsis);
        }
      }

      for (let p = startPage; p <= endPage; p++) {
        this.appendPageButton(p);
      }

      if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
          const ellipsis = document.createElement('span');
          ellipsis.className = 'px-1 text-[#9ca3af] text-xs';
          ellipsis.textContent = '...';
          this.buttonContainer.appendChild(ellipsis);
        }
        this.appendPageButton(totalPages);
      }

      // Next Button
      const nextBtn = document.createElement('button');
      nextBtn.type = 'button';
      nextBtn.id = 'nextPageBtn';
      nextBtn.className = `w-7 h-7 flex items-center justify-center rounded border border-[#e5e7eb] transition-colors ${
        this.currentPage === totalPages
          ? 'text-[#9ca3af] opacity-50 cursor-not-allowed'
          : 'text-[#374151] hover:bg-gray-50 cursor-pointer'
      }`;
      nextBtn.title = 'Next Page';
      nextBtn.disabled = this.currentPage === totalPages;
      nextBtn.innerHTML = `
        <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      `;
      nextBtn.addEventListener('click', () => {
        if (this.currentPage < totalPages) {
          this.currentPage++;
          this.update();
        }
      });
      this.buttonContainer.appendChild(nextBtn);
    }

    appendPageButton(pageNum) {
      const btn = document.createElement('button');
      btn.type = 'button';
      const isActive = pageNum === this.currentPage;
      btn.className = `w-7 h-7 flex items-center justify-center rounded text-xs font-semibold transition-colors cursor-pointer ${
        isActive
          ? 'bg-[#0030c2] text-white font-bold shadow-xs'
          : 'border border-[#e5e7eb] text-[#374151] hover:bg-gray-50'
      }`;
      btn.textContent = pageNum;
      btn.addEventListener('click', () => {
        this.currentPage = pageNum;
        this.update();
      });
      this.buttonContainer.appendChild(btn);
    }

    bindEvents() {
      // Connect to common search inputs and filters
      const searchInputs = document.querySelectorAll('input[type="text"], input[type="search"]');
      searchInputs.forEach(input => {
        input.addEventListener('input', () => {
          setTimeout(() => {
            this.currentPage = 1;
            this.update();
          }, 50);
        });
      });

      const filterSelects = document.querySelectorAll('select');
      filterSelects.forEach(select => {
        select.addEventListener('change', () => {
          setTimeout(() => {
            this.currentPage = 1;
            this.update();
          }, 50);
        });
      });
    }

    observeMutations() {
      if (!this.tbody) return;
      const observer = new MutationObserver(() => {
        if (!this.isUpdating) {
          this.update();
        }
      });
      observer.observe(this.tbody, { childList: true, subtree: false });
    }
  }

  // Global TablePagination Object
  window.TablePagination = {
    instances: paginationInstances,

    init(options = {}) {
      const tables = document.querySelectorAll('table');
      tables.forEach(table => {
        // Skip user management table which handles its own Supabase pagination
        if (table.id === 'userTable' || (table.closest && table.closest('#userManagementContainer')) || table.dataset.noPaginate === 'true') {
          return;
        }

        // Check if table is already initialized
        if (table.dataset.paginated === 'true') return;

        // Locate pagination footer: look in parent card or nearby siblings
        let footer = null;
        let parent = table.parentElement;
        
        while (parent && parent !== document.body) {
          const candidates = parent.querySelectorAll('div');
          for (let i = 0; i < candidates.length; i++) {
            const cand = candidates[i];
            // Check if this div is a direct footer container containing Showing
            if (cand.children.length > 0 && cand.textContent && cand.textContent.includes('Showing') && 
                (cand.textContent.includes('records') || cand.textContent.includes('entries') || cand.textContent.includes('items') || cand.textContent.includes('results'))) {
              // Ensure it's not an outer container that wraps the whole table
              if (!cand.contains(table)) {
                footer = cand;
                break;
              }
            }
          }
          if (footer) break;
          parent = parent.parentElement;
        }

        if (footer) {
          table.dataset.paginated = 'true';
          const instance = new TablePaginationInstance(table, footer, options);
          paginationInstances.push(instance);
        }
      });
    },

    nextPage() {
      paginationInstances.forEach(inst => {
        const totalPages = Math.max(1, Math.ceil(inst.totalRows / inst.pageSize));
        if (inst.currentPage < totalPages) {
          inst.currentPage++;
          inst.update();
        }
      });
    },

    prevPage() {
      paginationInstances.forEach(inst => {
        if (inst.currentPage > 1) {
          inst.currentPage--;
          inst.update();
        }
      });
    },

    goToPage(pageNum) {
      paginationInstances.forEach(inst => {
        inst.currentPage = pageNum;
        inst.update();
      });
    },

    refresh() {
      paginationInstances.forEach(inst => inst.update());
    }
  };

  // Wire global aliases to support student & teacher legacy button clicks
  window.goToPreviousPage = function () {
    window.TablePagination.prevPage();
  };

  window.goToNextPage = function () {
    window.TablePagination.nextPage();
  };

  window.changePage = function (pageNum) {
    if (typeof pageNum === 'number') {
      window.TablePagination.goToPage(pageNum);
    }
  };

  // Auto initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      window.TablePagination.init();
    });
  } else {
    window.TablePagination.init();
  }
})();
