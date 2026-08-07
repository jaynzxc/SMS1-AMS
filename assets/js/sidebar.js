// assets/js/sidebar.js

// Toggle dropdown menu (RFID/QR)
function toggleDropdown() {
    const dropdown = document.querySelector('.dropdown-menu');
    const arrow = document.querySelector('.dropdown-arrow');
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
    if (dropdown) {
        dropdown.classList.toggle('hidden');
    }
    if (arrow) {
        arrow.classList.toggle('rotate-90');
    }
}

// Auto-expand dropdowns based on current page
document.addEventListener('DOMContentLoaded', function() {
    const path = window.location.pathname;

    // RFID/QR Dropdown
    const isRfidPage = path.includes('/rfid/') || path.includes('rfid');
    if (isRfidPage) {
        const dropdown = document.querySelector('.dropdown-menu');
        const arrow = document.querySelector('.dropdown-arrow');
        if (dropdown) dropdown.classList.remove('hidden');
        if (arrow) arrow.classList.add('rotate-90');
    }

    // Tardy & Absence Dropdown
    const isTardyPage = path.includes('/tardy-and-absence/') || path.includes('tardy');
    if (isTardyPage) {
        const dropdown = document.querySelector('.tardy-dropdown-menu');
        const arrow = document.querySelector('.tardy-dropdown-arrow');
        if (dropdown) dropdown.classList.remove('hidden');
        if (arrow) arrow.classList.add('rotate-90');
    }

    // Set active state for current page
    setActiveNavItem();
});

// Set active nav item based on current URL
function setActiveNavItem() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('nav a:not(.dropdown-menu a):not(.tardy-dropdown-menu a)');
    const dropdownLinks = document.querySelectorAll('.dropdown-menu a');
    const tardyDropdownLinks = document.querySelectorAll('.tardy-dropdown-menu a');
    
    // Remove all active states first
    document.querySelectorAll('.nav-active').forEach(el => {
        el.classList.remove('nav-active');
        el.classList.remove('bg-[#e7edff]', 'text-[#0030c2]', 'font-semibold');
        el.classList.add('text-[#6b7280]');
    });
    
    // Check main nav links
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && currentPath.includes(href) && href !== '#') {
            link.classList.add('nav-active');
            link.classList.remove('text-[#6b7280]');
        }
    });
    
    // Check RFID dropdown links
    dropdownLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && currentPath.includes(href)) {
            link.classList.add('nav-active');
            link.classList.remove('text-[#6b7280]');
            const parent = link.closest('.relative');
            if (parent) {
                const toggleBtn = parent.querySelector('.dropdown-toggle');
                if (toggleBtn) {
                    toggleBtn.classList.add('nav-active');
                    toggleBtn.classList.remove('text-[#6b7280]');
                }
            }
        }
    });

    // Check Tardy dropdown links
    tardyDropdownLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && currentPath.includes(href)) {
            link.classList.add('nav-active');
            link.classList.remove('text-[#6b7280]');
            const parent = link.closest('.relative');
            if (parent) {
                const toggleBtn = parent.querySelector('.tardy-dropdown-toggle');
                if (toggleBtn) {
                    toggleBtn.classList.add('nav-active');
                    toggleBtn.classList.remove('text-[#6b7280]');
                }
            }
        }
    });
}

// Close dropdowns when clicking outside
document.addEventListener('click', function(event) {
    const sidebar = document.querySelector('aside');
    if (!sidebar) return;

    const rfidDropdown = document.querySelector('.dropdown-menu');
    const rfidToggle = document.querySelector('.dropdown-toggle');
    const tardyDropdown = document.querySelector('.tardy-dropdown-menu');
    const tardyToggle = document.querySelector('.tardy-dropdown-toggle');
    
    if (!sidebar.contains(event.target)) {
        const path = window.location.pathname;
        
        // RFID dropdown
        if (rfidDropdown && rfidToggle) {
            if (!path.includes('/rfid/') && !path.includes('rfid')) {
                rfidDropdown.classList.add('hidden');
                const arrow = document.querySelector('.dropdown-arrow');
                if (arrow) arrow.classList.remove('rotate-90');
            }
        }

        // Tardy dropdown
        if (tardyDropdown && tardyToggle) {
            if (!path.includes('/tardy-and-absence/') && !path.includes('tardy')) {
                tardyDropdown.classList.add('hidden');
                const arrow = document.querySelector('.tardy-dropdown-arrow');
                if (arrow) arrow.classList.remove('rotate-90');
            }
        }
    }
});