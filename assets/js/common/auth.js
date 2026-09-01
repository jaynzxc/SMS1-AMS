// assets/js/common/auth.js
// Supabase Authentication & Multi-Role Login Handler
// Supports Admin, Teacher, and Student login with redirection to respective dashboards.

import { supabase } from '../config/supabaseClient.js';

/**
 * Generate default account password according to formula:
 * (# + first 2 letters of last name of student/teacher + 8080)
 * Example: "Dela Cruz, Juan Paolo" -> "#de8080"
 * Example: "Miller, Robert" or "Prof. Robert Miller" -> "#mi8080"
 */
export function generateDefaultPassword(fullName) {
    if (!fullName || typeof fullName !== 'string') return '#bc8080';

    let clean = fullName.trim();
    clean = clean.replace(/^(Prof\.|Dr\.|Mr\.|Mrs\.|Ms\.|Engr\.)\s+/i, '');

    let lastName = '';
    if (clean.includes(',')) {
        lastName = clean.split(',')[0].trim();
    } else {
        const parts = clean.split(/\s+/);
        lastName = parts[parts.length - 1] || 'bc';
    }

    const lettersOnly = lastName.replace(/[^a-zA-Z]/g, '');
    const twoLetters = (lettersOnly.length >= 2 ? lettersOnly.substring(0, 2) : (lettersOnly + 'x')).toLowerCase();

    return `#${twoLetters}8080`;
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('🔐 Auth Module Initialized with Supabase');

    const loginForm = document.getElementById('loginForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const toggleBtn = document.getElementById('togglePassword');
    const eyeOpen = document.getElementById('eyeOpen');
    const eyeClosed = document.getElementById('eyeClosed');

    let isVisible = false;
    let timer = null;

    // =============================================================
    // SHOW / HIDE PASSWORD TOGGLE
    // =============================================================
    if (toggleBtn) {
        toggleBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            if (timer) {
                clearTimeout(timer);
                timer = null;
            }

            isVisible = !isVisible;
            if (isVisible) {
                passwordInput.type = 'text';
                eyeOpen.classList.add('hidden');
                eyeClosed.classList.remove('hidden');

                // Auto-hide after 5 seconds
                timer = setTimeout(hidePassword, 5000);
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

        passwordInput.addEventListener('input', () => {
            if (isVisible) {
                if (timer) clearTimeout(timer);
                timer = setTimeout(hidePassword, 5000);
            }
        });

        passwordInput.addEventListener('blur', () => {
            if (isVisible) hidePassword();
        });
    }

    // =============================================================
    // TOAST NOTIFICATIONS
    // =============================================================
    function showToast(title, message, type = 'success') {
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
        if (type === 'success') {
            iconSvg = `
                <div class="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                </div>
            `;
        } else if (type === 'info') {
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
            <button onclick="this.parentElement.remove()" class="text-gray-400 hover:text-gray-600 p-1 cursor-pointer">
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
    // MULTI-ROLE LOGIN SUBMISSION HANDLER
    // =============================================================
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const userInput = usernameInput.value.trim();
            const password = passwordInput.value.trim();
            const submitBtn = loginForm.querySelector('button[type="submit"]');

            if (!userInput || !password) {
                showToast('Missing Fields', 'Please enter your username/ID and password.', 'error');
                return;
            }

            // Button loading state
            const originalBtnHtml = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = `
                <span class="inline-flex items-center gap-2">
                    <svg class="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                </span>
            `;

            try {
                // 1. CHECK SUPABASE AUTH (For accounts registered in Supabase Auth auth.users)
                if (userInput.includes('@')) {
                    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
                        email: userInput,
                        password: password
                    });

                    if (!authError && authData?.user) {
                        // Check user metadata or profiles table for assigned role
                        const metaRole = authData.user.user_metadata?.role;
                        const { data: profile } = await supabase
                            .from('profiles')
                            .select('*')
                            .eq('id', authData.user.id)
                            .maybeSingle();

                        const role = metaRole || profile?.role || 'admin';
                        const displayName = profile?.full_name || authData.user.user_metadata?.full_name || userInput;

                        localStorage.setItem('currentUser', JSON.stringify({
                            id: authData.user.id,
                            email: userInput,
                            name: displayName,
                            role: role
                        }));
                        localStorage.setItem('userRole', role);

                        redirectToRoleDashboard(role, displayName);
                        return;
                    }
                }

                // 2. CHECK ADMIN TABLE (By username e.g. "admin" or email)
                const { data: adminMatch } = await supabase
                    .from('admin_details')
                    .select('*')
                    .or(`username.eq.${userInput},email.eq.${userInput}`)
                    .limit(1);

                if (adminMatch && adminMatch.length > 0) {
                    const admin = adminMatch[0];
                    let adminValid = false;

                    // A. Check if password matches admin_details record
                    if (admin.password && admin.password === password) {
                        adminValid = true;
                    }

                    // B. Or attempt Supabase Auth if admin has email
                    if (!adminValid && admin.email) {
                        const { data: aAuth } = await supabase.auth.signInWithPassword({
                            email: admin.email,
                            password: password
                        });
                        if (aAuth?.user) {
                            adminValid = true;
                        }
                    }

                    if (adminValid) {
                        localStorage.setItem('currentUser', JSON.stringify({
                            username: admin.username,
                            name: admin.full_name || 'System Administrator',
                            role: 'admin',
                            email: admin.email
                        }));
                        localStorage.setItem('userRole', 'admin');

                        redirectToRoleDashboard('admin', admin.full_name || 'Administrator');
                        return;
                    }
                }

                // 3. CHECK STUDENTS TABLE (By student_id or email)
                const { data: studentMatch } = await supabase
                    .from('students')
                    .select('*')
                    .or(`student_id.eq.${userInput},email.eq.${userInput}`)
                    .limit(1);

                if (studentMatch && studentMatch.length > 0) {
                    const student = studentMatch[0];
                    // Formula: # + first 2 letters of last name + 8080 (e.g. Dela Cruz -> #de8080)
                    const defaultStudentPass = generateDefaultPassword(student.name);
                    const validStudentPass = (student.password ? student.password.toLowerCase() === password.toLowerCase() : password.toLowerCase() === defaultStudentPass.toLowerCase());

                    if (validStudentPass) {
                        localStorage.setItem('currentUser', JSON.stringify({
                            id: student.student_id,
                            name: student.name,
                            role: 'student',
                            courseSection: `${student.course} ${student.section}`,
                            email: student.email,
                            rfidUid: student.rfid_uid,
                            qrCode: student.qr_code
                        }));
                        localStorage.setItem('userRole', 'student');

                        redirectToRoleDashboard('student', student.name);
                        return;
                    }
                }

                // 4. CHECK TEACHERS TABLE (By teacher_id or email)
                const { data: teacherMatch } = await supabase
                    .from('teachers')
                    .select('*')
                    .or(`teacher_id.eq.${userInput},email.eq.${userInput}`)
                    .limit(1);

                if (teacherMatch && teacherMatch.length > 0) {
                    const teacher = teacherMatch[0];
                    // Formula: # + first 2 letters of last name + 8080 (e.g. Miller -> #mi8080)
                    const defaultTeacherPass = generateDefaultPassword(teacher.name);
                    const validTeacherPass = (teacher.password ? teacher.password.toLowerCase() === password.toLowerCase() : password.toLowerCase() === defaultTeacherPass.toLowerCase());

                    if (validTeacherPass) {
                        localStorage.setItem('currentUser', JSON.stringify({
                            id: teacher.teacher_id,
                            name: teacher.name,
                            role: 'teacher',
                            department: teacher.department,
                            email: teacher.email,
                            rfidUid: teacher.rfid_uid,
                            qrCode: teacher.qr_code
                        }));
                        localStorage.setItem('userRole', 'teacher');

                        redirectToRoleDashboard('teacher', teacher.name);
                        return;
                    }
                }

                // If no matching account or incorrect password
                showToast('Authentication Failed', 'Invalid username/ID or password. Please check your credentials.', 'error');

            } catch (err) {
                console.error('Login error:', err);
                showToast('Login Error', 'An error occurred while signing in. Please try again.', 'error');
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnHtml;
            }
        });
    }

    function redirectToRoleDashboard(role, name) {
        showToast('Login Successful', `Welcome, ${name}! Redirecting to your dashboard...`, 'success');
        setTimeout(() => {
            if (role === 'admin') {
                window.location.href = 'admin/dashboard.html';
            } else if (role === 'teacher') {
                window.location.href = 'teacher/dashboard.html';
            } else {
                window.location.href = 'student/dashboard.html';
            }
        }, 700);
    }

    // Enter key navigation
    if (usernameInput) {
        usernameInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                passwordInput.focus();
            }
        });
    }
});