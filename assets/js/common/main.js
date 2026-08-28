// assets/js/main.js

// Main JavaScript file for global functions

console.log('Attendance Monitoring System initialized');

document.addEventListener('DOMContentLoaded', function() {
    
    // =============================================================
    // NOTIFICATION BADGE
    // =============================================================
    const notificationBtn = document.querySelector('header button.relative') || document.querySelector('.notification-btn');
    if (notificationBtn) {
        notificationBtn.addEventListener('click', function(e) {
            e.preventDefault();
            alert('You have 3 unread notifications');
        });
    }

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