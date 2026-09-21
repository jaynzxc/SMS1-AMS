// assets/js/main.js

// Main JavaScript file for global functions

console.log('Attendance Monitoring System initialized');

document.addEventListener('DOMContentLoaded', function() {
    
    // =============================================================
    // NOTIFICATION BADGE & FLYOUT
    // =============================================================
    // Handled seamlessly by assets/js/common/notifications-flyout.js

    // =============================================================
    // SIDEBAR DROPDOWN FUNCTIONS (for inline onclick)
    // =============================================================
    window.toggleDropdown = function() {
        const dropdown = document.querySelector('.dropdown-menu');
        const arrow = document.querySelector('.dropdown-arrow');
        if (dropdown) {
            dropdown.classList.toggle('hidden');
        }
        if (arrow) {
            arrow.classList.toggle('rotate-90');
        }
    };

    window.toggleTardyDropdown = function() {
        const dropdown = document.querySelector('.tardy-dropdown-menu');
        const arrow = document.querySelector('.tardy-dropdown-arrow');
        if (dropdown) {
            dropdown.classList.toggle('hidden');
        }
        if (arrow) {
            arrow.classList.toggle('rotate-90');
        }
    };

    window.toggleExcuseDropdown = function() {
        const dropdown = document.querySelector('.excuse-dropdown-menu');
        const arrow = document.querySelector('.excuse-dropdown-arrow');
        if (dropdown) {
            dropdown.classList.toggle('hidden');
        }
        if (arrow) {
            arrow.classList.toggle('rotate-90');
        }
    };

    // =============================================================
    // HEADER CURRENT DATE DISPLAY NAVIGATION
    // =============================================================
    const dateDisplayBtn = document.getElementById('currentDateDisplay');
    if (dateDisplayBtn && !dateDisplayBtn.dataset.bound) {
        dateDisplayBtn.dataset.bound = 'true';
        dateDisplayBtn.classList.add('cursor-pointer');
        dateDisplayBtn.setAttribute('title', 'View Attendance Calendar');
        dateDisplayBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const currentPath = window.location.pathname.replace(/\\/g, '/');
            if (currentPath.endsWith('attendance-calendar.html')) {
                if (typeof window.goToToday === 'function') {
                    window.goToToday();
                } else if (typeof window.renderCalendar === 'function') {
                    window.renderCalendar();
                }
            } else {
                let target = 'attendance-calendar.html';
                if (currentPath.includes('/excuse-slip/') || 
                    currentPath.includes('/rfid-and-qr/') || 
                    currentPath.includes('/tardy-and-absence/')) {
                    target = '../attendance-calendar.html';
                }
                window.location.href = target;
            }
        });
    }

    console.log('Main.js loaded successfully');
});