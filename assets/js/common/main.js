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

    console.log('Main.js loaded successfully');
});