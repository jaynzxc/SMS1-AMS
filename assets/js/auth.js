// =============================================================
// AUTH.JS - Login Page Functionality
// =============================================================

document.addEventListener('DOMContentLoaded', function() {

    // --- ELEMENTS ---
    const loginForm = document.getElementById('loginForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const toggleBtn = document.getElementById('togglePassword');
    const eyeOpen = document.getElementById('eyeOpen');
    const eyeClosed = document.getElementById('eyeClosed');

    let isVisible = false;
    let timer = null;

    // =============================================================
    // SHOW/HIDE PASSWORD
    // =============================================================

    if (toggleBtn) {
        toggleBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();

            console.log('Toggle button clicked!');

            // Clear timer
            if (timer) {
                clearTimeout(timer);
                timer = null;
            }

            isVisible = !isVisible;

            if (isVisible) {
                // Show password
                passwordInput.type = 'text';
                eyeOpen.classList.add('hidden');
                eyeClosed.classList.remove('hidden');

                // Auto-hide after 5 seconds
                timer = setTimeout(function() {
                    hidePassword();
                }, 5000);

            } else {
                hidePassword();
            }
        });

        function hidePassword() {
            isVisible = false;
            passwordInput.type = 'password';
            eyeOpen.classList.remove('hidden');
            eyeClosed.classList.add('hidden');

            if (timer) {
                clearTimeout(timer);
                timer = null;
            }
        }

        // Reset timer when typing
        passwordInput.addEventListener('input', function() {
            if (isVisible) {
                if (timer) clearTimeout(timer);
                timer = setTimeout(function() {
                    hidePassword();
                }, 5000);
            }
        });

        // Hide when losing focus
        passwordInput.addEventListener('blur', function() {
            if (isVisible) {
                hidePassword();
            }
        });
    }

    // =============================================================
    // TOAST NOTIFICATION
    // =============================================================

    function showToast(message, type) {
        const existing = document.querySelector('.custom-toast');
        if (existing) existing.remove();

        const toast = document.createElement('div');
        toast.className = `custom-toast fixed top-5 right-5 z-50 px-6 py-3 rounded-xl shadow-lg text-white text-sm font-medium transition-all duration-300 ${
            type === 'success' ? 'bg-green-600' :
            type === 'error' ? 'bg-red-600' :
            'bg-blue-600'
        }`;
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('opacity-0');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // =============================================================
    // LOGIN FORM
    // =============================================================

    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const username = usernameInput.value.trim();
            const password = passwordInput.value.trim();

            if (!username || !password) {
                showToast('Please fill in all fields.', 'error');
                return;
            }

            if (username === 'admin' && password === 'admin123') {
                showToast('Login successful! Redirecting...', 'success');
                setTimeout(function() {
                    window.location.href = 'admin/dashboard.html';
                }, 800);
            } else {
                showToast('Invalid username or password.', 'error');
            }
        });
    }

    // Enter key support
    if (passwordInput) {
        passwordInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                loginForm.dispatchEvent(new Event('submit'));
            }
        });
    }

    if (usernameInput) {
        usernameInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                passwordInput.focus();
            }
        });
    }

    console.log('auth.js loaded');

});