// assets/js/sidebar.js

// =============================================================
// DROPDOWN TOGGLE FUNCTIONS
// =============================================================

// Toggle dropdown menu (RFID/QR)
function toggleDropdown() {
    const dropdown = document.querySelector('.dropdown-menu');
    const arrow = document.querySelector('.dropdown-arrow');
    
    // Close other dropdowns
    const tardyDropdown = document.querySelector('.tardy-dropdown-menu');
    const tardyArrow = document.querySelector('.tardy-dropdown-arrow');
    if (tardyDropdown) tardyDropdown.classList.add('hidden');
    if (tardyArrow) tardyArrow.classList.remove('rotate-90');
    
    const excuseDropdown = document.querySelector('.excuse-dropdown-menu');
    const excuseArrow = document.querySelector('.excuse-dropdown-arrow');
    if (excuseDropdown) excuseDropdown.classList.add('hidden');
    if (excuseArrow) excuseArrow.classList.remove('rotate-90');

    if (dropdown) {
        dropdown.classList.toggle('hidden');
    }
    if (arrow) {
        arrow.classList.toggle('rotate-90');
    }
}

// Toggle dropdown menu (Tardy & Absence)
function toggleTardyDropdown() {
    const dropdown = document.querySelector('.tardy-dropdown-menu');
    const arrow = document.querySelector('.tardy-dropdown-arrow');
    
    // Close other dropdowns
    const rfidDropdown = document.querySelector('.dropdown-menu');
    const rfidArrow = document.querySelector('.dropdown-arrow');
    if (rfidDropdown) rfidDropdown.classList.add('hidden');
    if (rfidArrow) rfidArrow.classList.remove('rotate-90');
    
    const excuseDropdown = document.querySelector('.excuse-dropdown-menu');
    const excuseArrow = document.querySelector('.excuse-dropdown-arrow');
    if (excuseDropdown) excuseDropdown.classList.add('hidden');
    if (excuseArrow) excuseArrow.classList.remove('rotate-90');

    if (dropdown) {
        dropdown.classList.toggle('hidden');
    }
    if (arrow) {
        arrow.classList.toggle('rotate-90');
    }
}

// Toggle dropdown menu (Excuse Slip)
function toggleExcuseDropdown() {
    const dropdown = document.querySelector('.excuse-dropdown-menu');
    const arrow = document.querySelector('.excuse-dropdown-arrow');
    
    // Close other dropdowns
    const rfidDropdown = document.querySelector('.dropdown-menu');
    const rfidArrow = document.querySelector('.dropdown-arrow');
    if (rfidDropdown) rfidDropdown.classList.add('hidden');
    if (rfidArrow) rfidArrow.classList.remove('rotate-90');
    
    const tardyDropdown = document.querySelector('.tardy-dropdown-menu');
    const tardyArrow = document.querySelector('.tardy-dropdown-arrow');
    if (tardyDropdown) tardyDropdown.classList.add('hidden');
    if (tardyArrow) tardyArrow.classList.remove('rotate-90');

    if (dropdown) {
        dropdown.classList.toggle('hidden');
    }
    if (arrow) {
        arrow.classList.toggle('rotate-90');
    }
}

// =============================================================
// AUTO-EXPAND DROPDOWNS BASED ON CURRENT PAGE
// =============================================================

document.addEventListener('DOMContentLoaded', function() {
    const path = window.location.pathname;
    const filename = path.split('/').pop();

    // RFID/QR Dropdown - auto-expand if on RFID pages
    const isRfidPage = path.includes('/rfid-and-qr/') || 
                       filename === 'rfid-registry.html' || 
                       filename === 'qr-management.html' || 
                       filename === 'scan-logs.html';
    
    if (isRfidPage) {
        const dropdown = document.querySelector('.dropdown-menu');
        const arrow = document.querySelector('.dropdown-arrow');
        if (dropdown) dropdown.classList.remove('hidden');
        if (arrow) arrow.classList.add('rotate-90');
    }

    // Tardy & Absence Dropdown - auto-expand if on Tardy pages
    const isTardyPage = path.includes('/tardy-and-absence/') || 
                        filename === 'tardy-list.html' || 
                        filename === 'absence-list.html' || 
                        filename === 'habitual-offender.html';
    
    if (isTardyPage) {
        const dropdown = document.querySelector('.tardy-dropdown-menu');
        const arrow = document.querySelector('.tardy-dropdown-arrow');
        if (dropdown) dropdown.classList.remove('hidden');
        if (arrow) arrow.classList.add('rotate-90');
    }

    // Excuse Slip Dropdown - auto-expand if on Excuse Slip pages
    const isExcusePage = path.includes('/excuse-slip/') || 
                         filename === 'pending-requests.html' || 
                         filename === 'approved-requests.html' || 
                         filename === 'rejected-requests.html' || 
                         filename === 'excuse-history.html';
    
    if (isExcusePage) {
        const dropdown = document.querySelector('.excuse-dropdown-menu');
        const arrow = document.querySelector('.excuse-dropdown-arrow');
        if (dropdown) dropdown.classList.remove('hidden');
        if (arrow) arrow.classList.add('rotate-90');
    }

    // Set active state for current page
    setActiveNavItem();

    // Initialize burger menu sidebar toggle with slide motion
    initSidebarToggle();
});

// =============================================================
// SIDEBAR SLIDE TOGGLE WITH SMOOTH MOTION
// =============================================================

function toggleSidebar(e) {
    if (e && e.stopPropagation) {
        e.stopPropagation();
    }
    const sidebar = document.getElementById('mainSidebar') || document.querySelector('aside');
    if (!sidebar) return;

    sidebar.classList.toggle('sidebar-collapsed');

    const isCollapsed = sidebar.classList.contains('sidebar-collapsed');
    try {
        localStorage.setItem('sms_sidebar_collapsed', isCollapsed ? 'true' : 'false');
    } catch (err) {}
}

function initSidebarToggle() {
    const sidebar = document.getElementById('mainSidebar') || document.querySelector('aside');
    if (!sidebar) return;

    // Restore saved state if previously collapsed
    try {
        if (localStorage.getItem('sms_sidebar_collapsed') === 'true') {
            sidebar.classList.add('sidebar-collapsed');
        }
    } catch (err) {}

    // Find and attach click handler to burger toggle button(s) if not already inline
    const burgerPaths = document.querySelectorAll('header button svg path[d*="M3.75 6.75"]');
    burgerPaths.forEach(path => {
        const btn = path.closest('button');
        if (btn && !btn.hasAttribute('data-sidebar-bound')) {
            btn.setAttribute('data-sidebar-bound', 'true');
            btn.classList.add('burger-btn', 'cursor-pointer');
            btn.setAttribute('title', 'Toggle Navigation Sidebar');
            if (!btn.getAttribute('onclick')) {
                btn.addEventListener('click', function(evt) {
                    toggleSidebar(evt);
                });
            }
        }
    });
}

// =============================================================
// SET ACTIVE NAV ITEM BASED ON CURRENT URL - FIXED
// =============================================================

function setActiveNavItem() {
    const currentPath = window.location.pathname;
    const currentFile = currentPath.split('/').pop().toLowerCase();
    
    // Get all nav links (excluding dropdown items)
    const navLinks = document.querySelectorAll('nav a:not(.dropdown-menu a):not(.tardy-dropdown-menu a):not(.excuse-dropdown-menu a)');
    const dropdownLinks = document.querySelectorAll('.dropdown-menu a');
    const tardyDropdownLinks = document.querySelectorAll('.tardy-dropdown-menu a');
    const excuseDropdownLinks = document.querySelectorAll('.excuse-dropdown-menu a');
    
    // Remove all active states first
    document.querySelectorAll('.nav-active').forEach(el => {
        el.classList.remove('nav-active');
        el.classList.remove('bg-[#e7edff]', 'text-[#0030c2]', 'font-semibold');
        el.classList.add('text-[#6b7280]');
    });
    
    // =============================================================
    // 1. CHECK MAIN NAV LINKS
    // =============================================================
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && href !== '#') {
            const hrefFile = href.split('/').pop().toLowerCase();
            if (currentFile === hrefFile) {
                link.classList.add('nav-active', 'bg-[#e7edff]', 'text-[#0030c2]', 'font-semibold');
                link.classList.remove('text-[#6b7280]');
            }
        }
    });
    
    // =============================================================
    // 2. CHECK RFID DROPDOWN LINKS
    // =============================================================
    dropdownLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && href !== '#') {
            const hrefFile = href.split('/').pop().toLowerCase();
            if (currentFile === hrefFile) {
                link.classList.add('nav-active', 'bg-[#e7edff]', 'text-[#0030c2]', 'font-semibold');
                link.classList.remove('text-[#6b7280]');
                // Activate parent toggle
                const parent = link.closest('.relative');
                if (parent) {
                    const toggleBtn = parent.querySelector('.dropdown-toggle');
                    if (toggleBtn) {
                        toggleBtn.classList.add('text-[#0030c2]', 'font-semibold');
                        toggleBtn.classList.remove('text-[#6b7280]');
                    }
                }
            }
        }
    });

    // =============================================================
    // 3. CHECK TARDY DROPDOWN LINKS
    // =============================================================
    tardyDropdownLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && href !== '#') {
            const hrefFile = href.split('/').pop().toLowerCase();
            if (currentFile === hrefFile) {
                link.classList.add('nav-active', 'bg-[#e7edff]', 'text-[#0030c2]', 'font-semibold');
                link.classList.remove('text-[#6b7280]');
                // Activate parent toggle
                const parent = link.closest('.relative');
                if (parent) {
                    const toggleBtn = parent.querySelector('.tardy-dropdown-toggle');
                    if (toggleBtn) {
                        toggleBtn.classList.add('text-[#0030c2]', 'font-semibold');
                        toggleBtn.classList.remove('text-[#6b7280]');
                    }
                }
            }
        }
    });

    // =============================================================
    // 4. CHECK EXCUSE SLIP DROPDOWN LINKS
    // =============================================================
    excuseDropdownLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && href !== '#') {
            const hrefFile = href.split('/').pop().toLowerCase();
            if (currentFile === hrefFile) {
                link.classList.add('nav-active', 'bg-[#e7edff]', 'text-[#0030c2]', 'font-semibold');
                link.classList.remove('text-[#6b7280]');
                // Activate parent toggle
                const parent = link.closest('.relative');
                if (parent) {
                    const toggleBtn = parent.querySelector('.excuse-dropdown-toggle');
                    if (toggleBtn) {
                        toggleBtn.classList.add('text-[#0030c2]', 'font-semibold');
                        toggleBtn.classList.remove('text-[#6b7280]');
                    }
                }
            }
        }
    });
}

// =============================================================
// CLOSE DROPDOWNS WHEN CLICKING OUTSIDE
// =============================================================

document.addEventListener('click', function(event) {
    const sidebar = document.querySelector('aside');
    if (!sidebar) return;

    const rfidDropdown = document.querySelector('.dropdown-menu');
    const rfidToggle = document.querySelector('.dropdown-toggle');
    const tardyDropdown = document.querySelector('.tardy-dropdown-menu');
    const tardyToggle = document.querySelector('.tardy-dropdown-toggle');
    const excuseDropdown = document.querySelector('.excuse-dropdown-menu');
    const excuseToggle = document.querySelector('.excuse-dropdown-toggle');
    
    // Only process if click is outside the sidebar
    if (!sidebar.contains(event.target)) {
        const path = window.location.pathname;
        const filename = path.split('/').pop();
        
        // RFID dropdown - close unless on RFID page
        if (rfidDropdown && rfidToggle) {
            const isRfidPage = path.includes('/rfid-and-qr/') || 
                               filename === 'rfid-registry.html' || 
                               filename === 'qr-management.html' || 
                               filename === 'scan-logs.html';
            if (!isRfidPage) {
                rfidDropdown.classList.add('hidden');
                const arrow = document.querySelector('.dropdown-arrow');
                if (arrow) arrow.classList.remove('rotate-90');
            }
        }

        // Tardy dropdown - close unless on Tardy page
        if (tardyDropdown && tardyToggle) {
            const isTardyPage = path.includes('/tardy-and-absence/') || 
                                filename === 'tardy-list.html' || 
                                filename === 'absence-list.html' || 
                                filename === 'habitual-offender.html';
            if (!isTardyPage) {
                tardyDropdown.classList.add('hidden');
                const arrow = document.querySelector('.tardy-dropdown-arrow');
                if (arrow) arrow.classList.remove('rotate-90');
            }
        }

        // Excuse Slip dropdown - close unless on Excuse Slip page
        if (excuseDropdown && excuseToggle) {
            const isExcusePage = path.includes('/excuse-slip/') || 
                                 filename === 'pending-requests.html' || 
                                 filename === 'approved-requests.html' || 
                                 filename === 'rejected-requests.html' || 
                                 filename === 'excuse-history.html';
            if (!isExcusePage) {
                excuseDropdown.classList.add('hidden');
                const arrow = document.querySelector('.excuse-dropdown-arrow');
                if (arrow) arrow.classList.remove('rotate-90');
            }
        }
    }
});

// =============================================================
// PREVENT DROPDOWN CLOSE WHEN CLICKING INSIDE
// =============================================================

document.querySelectorAll('.dropdown-menu, .tardy-dropdown-menu, .excuse-dropdown-menu').forEach(menu => {
    menu.addEventListener('click', function(e) {
        e.stopPropagation();
    });
});

// =============================================================
// CLOSE DROPDOWNS ON ESCAPE KEY
// =============================================================

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const rfidDropdown = document.querySelector('.dropdown-menu');
        const tardyDropdown = document.querySelector('.tardy-dropdown-menu');
        const excuseDropdown = document.querySelector('.excuse-dropdown-menu');
        
        if (rfidDropdown && !rfidDropdown.classList.contains('hidden')) {
            rfidDropdown.classList.add('hidden');
            const arrow = document.querySelector('.dropdown-arrow');
            if (arrow) arrow.classList.remove('rotate-90');
        }
        
        if (tardyDropdown && !tardyDropdown.classList.contains('hidden')) {
            tardyDropdown.classList.add('hidden');
            const arrow = document.querySelector('.tardy-dropdown-arrow');
            if (arrow) arrow.classList.remove('rotate-90');
        }

        if (excuseDropdown && !excuseDropdown.classList.contains('hidden')) {
            excuseDropdown.classList.add('hidden');
            const arrow = document.querySelector('.excuse-dropdown-arrow');
            if (arrow) arrow.classList.remove('rotate-90');
        }
    }
});

console.log('Sidebar.js loaded successfully');