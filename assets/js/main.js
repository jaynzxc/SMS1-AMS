// assets/js/main.js

// Main JavaScript file for global functions

console.log('Attendance Monitoring System initialized');

// Example: Notification badge click
document.addEventListener('DOMContentLoaded', function() {
    const notificationBtn = document.querySelector('.relative.text-[#6b7280]');
    if (notificationBtn) {
        notificationBtn.addEventListener('click', function() {
            alert('You have 3 notifications');
        });
    }

    // Example: Quick action buttons
    const actionButtons = document.querySelectorAll('.quick-action-btn');
    actionButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            const action = this.querySelector('.text-sm.font-semibold')?.textContent || 'Action';
            console.log(`Clicked: ${action}`);
        });
    });
});