// assets/js/sidebar.js

// Toggle dropdown menu
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

// Auto-expand dropdown if on RFID sub-page
document.addEventListener('DOMContentLoaded', function() {
    const path = window.location.pathname;
    const isRfidPage = path.includes('/rfid/') || path.includes('rfid');
    
    if (isRfidPage) {
        const dropdown = document.querySelector('.dropdown-menu');
        const arrow = document.querySelector('.dropdown-arrow');
        if (dropdown) {
            dropdown.classList.remove('hidden');
        }
        if (arrow) {
            arrow.classList.add('rotate-90');
        }
    }

    // Set active state for current page
    setActiveNavItem();
});

// Set active nav item based on current URL
function setActiveNavItem() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('nav a:not(.dropdown-menu a)');
    const dropdownLinks = document.querySelectorAll('.dropdown-menu a');
    
    // Remove all active states first
    document.querySelectorAll('.nav-active').forEach(el => {
        el.classList.remove('nav-active');
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
    
    // Check dropdown links
    dropdownLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && currentPath.includes(href)) {
            link.classList.add('nav-active');
            link.classList.remove('text-[#6b7280]');
            // Also activate parent
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
}

// Close dropdown when clicking outside
document.addEventListener('click', function(event) {
    const sidebar = document.querySelector('aside');
    const dropdown = document.querySelector('.dropdown-menu');
    const toggleBtn = document.querySelector('.dropdown-toggle');
    
    if (sidebar && dropdown && toggleBtn) {
        if (!sidebar.contains(event.target)) {
            // Check if we're on RFID page before closing
            const path = window.location.pathname;
            if (!path.includes('/rfid/') && !path.includes('rfid')) {
                dropdown.classList.add('hidden');
                const arrow = document.querySelector('.dropdown-arrow');
                if (arrow) {
                    arrow.classList.remove('rotate-90');
                }
            }
        }
    }
});