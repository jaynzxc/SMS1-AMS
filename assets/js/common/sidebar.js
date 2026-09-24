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
                        filename === 'tardy-and-absence.html' || 
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
                         filename === 'my-requests.html' || 
                         filename === 'submit-excuse.html';
    
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

    if (window.innerWidth < 1024) {
        // Mobile Drawer Mode
        sidebar.classList.toggle('mobile-open');
        let backdrop = document.getElementById('sidebarBackdrop');
        if (sidebar.classList.contains('mobile-open')) {
            if (!backdrop) {
                backdrop = document.createElement('div');
                backdrop.id = 'sidebarBackdrop';
                backdrop.className = 'fixed inset-0 bg-black/40 z-40 backdrop-blur-xs transition-opacity';
                backdrop.addEventListener('click', function () {
                    sidebar.classList.remove('mobile-open');
                    if (backdrop && backdrop.parentNode) {
                        backdrop.parentNode.removeChild(backdrop);
                    }
                });
                document.body.appendChild(backdrop);
            }
        } else if (backdrop && backdrop.parentNode) {
            backdrop.parentNode.removeChild(backdrop);
        }
    } else {
        // Desktop Collapse Mode
        sidebar.classList.toggle('sidebar-collapsed');
        const isCollapsed = sidebar.classList.contains('sidebar-collapsed');
        try {
            localStorage.setItem('sms_sidebar_collapsed', isCollapsed ? 'true' : 'false');
        } catch (err) {}
    }
}

// Global export for inline onclick handlers
window.toggleSidebar = toggleSidebar;

function initSidebarToggle() {
    const sidebar = document.getElementById('mainSidebar') || document.querySelector('aside');
    if (!sidebar) return;

    // Restore saved desktop state if previously collapsed and on desktop
    try {
        if (window.innerWidth >= 1024 && localStorage.getItem('sms_sidebar_collapsed') === 'true') {
            sidebar.classList.add('sidebar-collapsed');
        }
    } catch (err) {}

    // Attach click handler to any burger toggle button(s)
    const burgerBtns = document.querySelectorAll('#mobileMenuBtn, header button svg path[d*="M3.75 6.75"]');
    burgerBtns.forEach(item => {
        const btn = item.tagName === 'BUTTON' ? item : item.closest('button');
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

    // Dismiss mobile drawer on Escape key
    document.addEventListener('keydown', function(evt) {
        if (evt.key === 'Escape' && sidebar.classList.contains('mobile-open')) {
            sidebar.classList.remove('mobile-open');
            const backdrop = document.getElementById('sidebarBackdrop');
            if (backdrop && backdrop.parentNode) {
                backdrop.parentNode.removeChild(backdrop);
            }
        }
    });

    // Handle viewport resize: remove mobile classes if resized to desktop
    window.addEventListener('resize', function() {
        if (window.innerWidth >= 1024 && sidebar.classList.contains('mobile-open')) {
            sidebar.classList.remove('mobile-open');
            const backdrop = document.getElementById('sidebarBackdrop');
            if (backdrop && backdrop.parentNode) {
                backdrop.parentNode.removeChild(backdrop);
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
    
    // Reset all nav links and dropdown sub-items
    const allLinks = document.querySelectorAll('nav a');
    allLinks.forEach(el => {
        el.classList.remove('nav-active', 'bg-[#e7edff]', 'text-[#0030c2]', 'font-semibold');
        if (!el.classList.contains('text-[#6b7280]')) {
            el.classList.add('text-[#6b7280]');
        }
    });

    // Reset all dropdown toggle buttons
    const allToggles = document.querySelectorAll('.dropdown-toggle, .tardy-dropdown-toggle, .excuse-dropdown-toggle');
    allToggles.forEach(toggle => {
        toggle.classList.remove('text-[#0030c2]', 'font-semibold');
        if (!toggle.classList.contains('text-[#6b7280]')) {
            toggle.classList.add('text-[#6b7280]');
        }
    });
    
    // 1. Main Nav Links
    const navLinks = document.querySelectorAll('nav a:not(.dropdown-menu a):not(.tardy-dropdown-menu a):not(.excuse-dropdown-menu a)');
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
    
    // 2. RFID Dropdown Links
    const dropdownLinks = document.querySelectorAll('.dropdown-menu a');
    dropdownLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && href !== '#') {
            const hrefFile = href.split('/').pop().toLowerCase();
            if (currentFile === hrefFile) {
                link.classList.add('nav-active', 'bg-[#e7edff]', 'text-[#0030c2]', 'font-semibold');
                link.classList.remove('text-[#6b7280]');
                const parent = link.closest('.relative');
                if (parent) {
                    const toggleBtn = parent.querySelector('.dropdown-toggle');
                    const arrow = parent.querySelector('.dropdown-arrow');
                    const menu = parent.querySelector('.dropdown-menu');
                    if (toggleBtn) {
                        toggleBtn.classList.add('text-[#0030c2]', 'font-semibold');
                        toggleBtn.classList.remove('text-[#6b7280]');
                    }
                    if (menu) menu.classList.remove('hidden');
                    if (arrow) arrow.classList.add('rotate-90');
                }
            }
        }
    });

    // 3. Tardy Dropdown Links
    const tardyDropdownLinks = document.querySelectorAll('.tardy-dropdown-menu a');
    tardyDropdownLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && href !== '#') {
            const hrefFile = href.split('/').pop().toLowerCase();
            if (currentFile === hrefFile) {
                link.classList.add('nav-active', 'bg-[#e7edff]', 'text-[#0030c2]', 'font-semibold');
                link.classList.remove('text-[#6b7280]');
                const parent = link.closest('.relative');
                if (parent) {
                    const toggleBtn = parent.querySelector('.tardy-dropdown-toggle');
                    const arrow = parent.querySelector('.tardy-dropdown-arrow');
                    const menu = parent.querySelector('.tardy-dropdown-menu');
                    if (toggleBtn) {
                        toggleBtn.classList.add('text-[#0030c2]', 'font-semibold');
                        toggleBtn.classList.remove('text-[#6b7280]');
                    }
                    if (menu) menu.classList.remove('hidden');
                    if (arrow) arrow.classList.add('rotate-90');
                }
            }
        }
    });

    // 4. Excuse Slip Dropdown Links (if present)
    const excuseDropdownLinks = document.querySelectorAll('.excuse-dropdown-menu a');
    excuseDropdownLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && href !== '#') {
            const hrefFile = href.split('/').pop().toLowerCase();
            if (currentFile === hrefFile) {
                link.classList.add('nav-active', 'bg-[#e7edff]', 'text-[#0030c2]', 'font-semibold');
                link.classList.remove('text-[#6b7280]');
                const parent = link.closest('.relative');
                if (parent) {
                    const toggleBtn = parent.querySelector('.excuse-dropdown-toggle');
                    const arrow = parent.querySelector('.excuse-dropdown-arrow');
                    const menu = parent.querySelector('.excuse-dropdown-menu');
                    if (toggleBtn) {
                        toggleBtn.classList.add('text-[#0030c2]', 'font-semibold');
                        toggleBtn.classList.remove('text-[#6b7280]');
                    }
                    if (menu) menu.classList.remove('hidden');
                    if (arrow) arrow.classList.add('rotate-90');
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
                                filename === 'tardy-and-absence.html' || 
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
                                 filename === 'my-requests.html' || 
                                 filename === 'submit-excuse.html';
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

        const profileMenu = document.getElementById('topbarProfileMenu') || document.getElementById('studentProfileMenu') || document.getElementById('topbarProfileDropdown');
        if (profileMenu && !profileMenu.classList.contains('hidden')) {
            profileMenu.classList.add('hidden');
            const btn = document.getElementById('topbarProfileBtn');
            const chevron = document.getElementById('topbarProfileChevron') || (btn ? btn.querySelector('.topbar-profile-chevron, svg:last-of-type') : null);
            if (chevron) {
                chevron.classList.remove('rotate-90');
            }
        }
    }
});

// =============================================================
// ADMIN PROFILE DROPDOWN & LOGOUT HANDLER
// =============================================================

function toggleProfileDropdown(e) {
    if (e && e.stopPropagation) {
        e.stopPropagation();
    }
    const menu = document.getElementById('topbarProfileMenu') || document.getElementById('studentProfileMenu') || document.getElementById('topbarProfileDropdown');
    const btn = document.getElementById('topbarProfileBtn');
    const chevron = document.getElementById('topbarProfileChevron') || (btn ? btn.querySelector('.topbar-profile-chevron, svg:last-of-type') : null);

    if (menu) {
        const isHidden = menu.classList.toggle('hidden');
        if (chevron) {
            if (isHidden) {
                chevron.classList.remove('rotate-90');
            } else {
                chevron.classList.add('rotate-90');
            }
        }
    }
}

function handleLogout() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('userRole');

    const path = window.location.pathname;
    const isSubdir = path.includes('/rfid-and-qr/') || path.includes('/tardy-and-absence/') || path.includes('/excuse-slip/');
    const isModuleDir = path.includes('/admin/') || path.includes('/teacher/') || path.includes('/student/');

    let loginUrl = '../index.html';
    if (isSubdir) {
        loginUrl = '../../index.html';
    } else if (!isModuleDir) {
        loginUrl = 'index.html';
    }

    window.location.href = loginUrl;
}

// Global exposure
window.toggleProfileDropdown = toggleProfileDropdown;
window.handleLogout = handleLogout;

// Close profile dropdown when clicking outside
document.addEventListener('click', function(e) {
    const profileBtn = document.getElementById('topbarProfileBtn');
    const profileMenu = document.getElementById('topbarProfileMenu') || document.getElementById('studentProfileMenu') || document.getElementById('topbarProfileDropdown');
    if (profileMenu && !profileMenu.classList.contains('hidden')) {
        if (profileBtn && profileBtn.contains(e.target)) return;
        if (profileMenu.contains(e.target)) return;
        profileMenu.classList.add('hidden');
        const chevron = document.getElementById('topbarProfileChevron') || (profileBtn ? profileBtn.querySelector('.topbar-profile-chevron, svg:last-of-type') : null);
        if (chevron) {
            chevron.classList.remove('rotate-90');
        }
    }
});

// Auto-sync logged in user name & real-time date across all modules
document.addEventListener('DOMContentLoaded', function() {
    // 1. Sync User Name
    try {
        const raw = localStorage.getItem('currentUser');
        const user = raw ? JSON.parse(raw) : null;
        let name = user?.name;
        if (!name || name === 'System Administrator') name = 'Admin User';
        
        const topbarNameEl = document.getElementById('topbarAdminName');
        if (topbarNameEl) {
            topbarNameEl.textContent = name;
        }
    } catch (e) {
        // ignore
    }

    // 2. Sync Real-time Day & Date Display (Dashboard Design Pattern: "Month Day, Year (Weekday)")
    function syncHeaderDate() {
        try {
            const now = new Date();
            const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            const formattedDate = `${months[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()} (${days[now.getDay()]})`;

            // Update all elements with id="currentDateLabel"
            document.querySelectorAll('#currentDateLabel').forEach(el => {
                el.textContent = formattedDate;
            });

            // Update any currentDateDisplay button containers
            document.querySelectorAll('#currentDateDisplay').forEach(btn => {
                const label = btn.querySelector('#currentDateLabel') || btn.querySelector('span');
                if (label) {
                    label.textContent = formattedDate;
                } else {
                    const svg = btn.querySelector('svg');
                    btn.innerHTML = '';
                    if (svg) btn.appendChild(svg);
                    const span = document.createElement('span');
                    span.id = 'currentDateLabel';
                    span.textContent = formattedDate;
                    btn.appendChild(span);
                }
            });
        } catch (e) {
            console.error('Error syncing date display:', e);
        }
    }
    syncHeaderDate();
});

console.log('Sidebar.js loaded successfully with Profile Dropdown and Date Sync support');