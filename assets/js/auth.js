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

    function showToast(titleOrMessage, messageOrType, type = 'success') {
        let title = titleOrMessage;
        let message = messageOrType;
        let toastType = type;

        // Check if it's called as showToast(message, type)
        if (messageOrType === undefined) {
            message = titleOrMessage;
            toastType = 'success';
            title = 'Success';
        } else if (messageOrType === 'success' || messageOrType === 'info' || messageOrType === 'error' || messageOrType === 'danger') {
            message = titleOrMessage;
            toastType = messageOrType === 'danger' ? 'error' : messageOrType;
            title = toastType === 'success' ? 'Success' : toastType === 'info' ? 'Info' : 'Error';
        }

        let toastContainer = document.getElementById('toastContainer');
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.id = 'toastContainer';
            toastContainer.className = 'fixed top-5 right-5 z-50 flex flex-col gap-2 pointer-events-none';
            document.body.appendChild(toastContainer);
        }

        const toast = document.createElement('div');
        toast.className = 'custom-toast pointer-events-auto bg-white border border-[#e5e7eb] shadow-xl rounded-xl p-3.5 flex items-start gap-3 min-w-[280px] max-w-sm transition-all duration-300 transform translate-x-0';

        let iconSvg = '';
        if (toastType === 'success') {
            iconSvg = `
                <div class="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                </div>
            `;
        } else if (toastType === 'info') {
            iconSvg = `
                <div class="w-8 h-8 rounded-full bg-blue-50 text-[#0030c2] flex items-center justify-center shrink-0">
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                    </svg>
                </div>
            `;
        } else {
            iconSvg = `
                <div class="w-8 h-8 rounded-full bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                    </svg>
                </div>
            `;
        }

        toast.innerHTML = `
            ${iconSvg}
            <div class="flex-1">
                <p class="text-xs font-bold text-[#111827]">${title}</p>
                <p class="text-[11px] text-[#6b7280] mt-0.5 leading-tight">${message}</p>
            </div>
            <button onclick="this.parentElement.remove()" class="text-gray-400 hover:text-gray-600 p-1">
                <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
        `;

        toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('opacity-0', 'translate-x-full');
            setTimeout(() => toast.remove(), 300);
        }, 4000);
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
    if (usernameInput) {
        usernameInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                passwordInput.focus();
            }
        });
    }

    console.log('auth.js loaded');

});