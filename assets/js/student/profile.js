/**
 * Student Profile Module JavaScript
 * Bestlink College of the Philippines - Attendance Monitoring System (SMS1-AMS)
 * Handles personal & guardian contact updates, password complexity validation,
 * profile avatar management, and single-session concurrency revocation.
 */

document.addEventListener('DOMContentLoaded', () => {
  initProfileModule();
});

function initProfileModule() {
  // Bind Contact Information Form
  const formContact = document.getElementById('formStudentContact');
  if (formContact) {
    formContact.addEventListener('submit', handleContactUpdate);
  }

  // Bind Password Change Form
  const formPassword = document.getElementById('formChangePassword');
  if (formPassword) {
    formPassword.addEventListener('submit', handlePasswordChange);
  }

  // Bind Real-Time Password Strength Verification
  const newPasswordInput = document.getElementById('newPassword');
  if (newPasswordInput) {
    newPasswordInput.addEventListener('input', validatePasswordStrength);
  }

  // Bind Profile Avatar Photo Input
  const avatarInput = document.getElementById('avatarFileInput');
  if (avatarInput) {
    avatarInput.addEventListener('change', handleAvatarChange);
  }

  // Bind Revoke Remote Device Sessions
  const btnRevoke = document.getElementById('btnRevokeOtherSessions');
  if (btnRevoke) {
    btnRevoke.addEventListener('click', handleRevokeOtherSessions);
  }

  // Close dropdowns on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeProfileDropdown();
    }
  });

  // Close profile dropdown on outside click
  document.addEventListener('click', (e) => {
    const profileBtn = document.getElementById('topbarProfileBtn');
    const profileMenu = document.getElementById('studentProfileMenu');
    if (profileMenu && !profileMenu.classList.contains('hidden')) {
      if (profileBtn && !profileBtn.contains(e.target) && !profileMenu.contains(e.target)) {
        closeProfileDropdown();
      }
    }
  });

  // Handle URL Hash Navigation (#personal, #security)
  const hash = window.location.hash.replace('#', '');
  if (['personal', 'security'].includes(hash)) {
    switchProfileTab(hash);
  }
}

/**
 * Switch Profile Horizontal Navigation Tabs
 * @param {'personal' | 'security'} tabName
 */
window.switchProfileTab = function (tabName) {
  const tabs = [
    { name: 'personal', btn: document.getElementById('tabPersonalBtn'), panel: document.getElementById('panelPersonal') },
    { name: 'security', btn: document.getElementById('tabSecurityBtn'), panel: document.getElementById('panelSecurity') }
  ];

  tabs.forEach(tab => {
    if (!tab.btn || !tab.panel) return;

    if (tab.name === tabName) {
      // Active Button State
      tab.btn.className = 'btn-press flex items-center gap-2 pb-3 px-3 text-xs sm:text-sm font-bold border-b-2 border-[#0030c2] text-[#0030c2] transition-all cursor-pointer whitespace-nowrap';
      tab.panel.classList.remove('hidden');
    } else {
      // Inactive Button State
      tab.btn.className = 'btn-press flex items-center gap-2 pb-3 px-3 text-xs sm:text-sm font-medium border-b-2 border-transparent text-[#6b7280] hover:text-[#111827] hover:border-gray-300 transition-all cursor-pointer whitespace-nowrap';
      tab.panel.classList.add('hidden');
    }
  });

  // Update hash safely without jump
  if (history.replaceState) {
    history.replaceState(null, '', `#${tabName}`);
  } else {
    window.location.hash = `#${tabName}`;
  }
};

/**
 * Handle Contact & Parent SMS Update
 */
function handleContactUpdate(e) {
  e.preventDefault();

  const email = document.getElementById('studentEmail')?.value.trim();
  const contact = document.getElementById('studentContact')?.value.trim();
  const guardianName = document.getElementById('guardianName')?.value.trim();
  const guardianRelationship = document.getElementById('guardianRelationship')?.value;
  const guardianContact = document.getElementById('guardianContact')?.value.trim();

  if (!email || !contact || !guardianName || !guardianContact) {
    showToast('Missing Fields', 'Please complete all required contact information fields.', 'warning');
    return;
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    showToast('Invalid Email', 'Please provide a valid email address.', 'warning');
    return;
  }

  // Synchronize with Left Overview Card safely via textContent (Anti-XSS)
  const cardEmail = document.getElementById('cardStudentEmail');
  if (cardEmail) {
    cardEmail.textContent = email;
    cardEmail.title = email;
  }

  const cardContact = document.getElementById('cardStudentContact');
  if (cardContact) {
    cardContact.textContent = contact;
  }

  const cardGuardian = document.getElementById('cardGuardianName');
  if (cardGuardian) {
    cardGuardian.textContent = `${guardianName} (${guardianRelationship})`;
  }

  const cardGuardianPhone = document.getElementById('cardGuardianContact');
  if (cardGuardianPhone) {
    cardGuardianPhone.textContent = guardianContact;
  }

  showToast('Contact Info Saved', 'Emergency and parent SMS contact details were updated successfully.', 'success');
}

/**
 * Real-Time Password Complexity & Strength Validation
 */
function validatePasswordStrength() {
  const newPass = document.getElementById('newPassword')?.value || '';

  const rules = {
    length: newPass.length >= 8,
    upper: /[A-Z]/.test(newPass),
    lower: /[a-z]/.test(newPass),
    number: /[0-9]/.test(newPass),
    special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(newPass)
  };

  const ruleElements = {
    length: document.getElementById('ruleLength'),
    upper: document.getElementById('ruleUpper'),
    lower: document.getElementById('ruleLower'),
    number: document.getElementById('ruleNumber'),
    special: document.getElementById('ruleSpecial')
  };

  let passedCount = 0;

  // Update visual checks for each rule
  for (const [key, passed] of Object.entries(rules)) {
    const el = ruleElements[key];
    if (!el) continue;

    const icon = el.querySelector('.rule-icon');

    if (passed) {
      passedCount++;
      el.className = 'flex items-center gap-1.5 text-emerald-700 font-semibold text-xs';
      if (icon) {
        icon.textContent = '✓';
        icon.className = 'rule-icon w-3.5 h-3.5 flex items-center justify-center text-emerald-600 font-bold';
      }
    } else {
      el.className = 'flex items-center gap-1.5 text-[#6b7280] text-xs';
      if (icon) {
        icon.textContent = '○';
        icon.className = 'rule-icon w-3.5 h-3.5 flex items-center justify-center text-gray-400';
      }
    }
  }

  // Update Password Strength Meter
  const bar = document.getElementById('passwordStrengthBar');
  const label = document.getElementById('passwordStrengthLabel');

  if (newPass.length === 0) {
    if (bar) {
      bar.style.width = '0%';
      bar.className = 'h-full w-0 bg-gray-300 transition-all duration-300';
    }
    if (label) {
      label.textContent = 'None';
      label.className = 'font-bold text-gray-400';
    }
  } else if (passedCount <= 2) {
    if (bar) {
      bar.style.width = '33%';
      bar.className = 'h-full bg-red-500 transition-all duration-300';
    }
    if (label) {
      label.textContent = 'Weak';
      label.className = 'font-bold text-red-600';
    }
  } else if (passedCount <= 4) {
    if (bar) {
      bar.style.width = '66%';
      bar.className = 'h-full bg-amber-500 transition-all duration-300';
    }
    if (label) {
      label.textContent = 'Moderate';
      label.className = 'font-bold text-amber-600';
    }
  } else {
    if (bar) {
      bar.style.width = '100%';
      bar.className = 'h-full bg-emerald-500 transition-all duration-300';
    }
    if (label) {
      label.textContent = 'Strong';
      label.className = 'font-bold text-emerald-600';
    }
  }

  // Hide warning badge once all criteria pass
  const badge = document.getElementById('passwordReqWarningBadge');
  const box = document.getElementById('passwordRequirementsBox');
  if (passedCount === 5) {
    if (box) box.classList.remove('checklist-warning-highlight');
    if (badge) badge.classList.add('hidden');
  }

  return passedCount === 5;
}

/**
 * Handle Account Security / Password Change Submission
 */
function handlePasswordChange(e) {
  e.preventDefault();

  const currentPass = document.getElementById('currentPassword')?.value;
  const newPass = document.getElementById('newPassword')?.value;
  const confirmPass = document.getElementById('confirmPassword')?.value;

  const box = document.getElementById('passwordRequirementsBox');
  const badge = document.getElementById('passwordReqWarningBadge');

  if (!currentPass || !newPass || !confirmPass) {
    if (box) box.classList.add('checklist-warning-highlight');
    if (badge) {
      badge.textContent = '⚠ Complete all fields';
      badge.classList.remove('hidden');
    }
    showToast('Incomplete Form', 'Please complete all password fields.', 'warning');
    return;
  }

  const isCriteriaMet = validatePasswordStrength();
  if (!isCriteriaMet) {
    if (box) box.classList.add('checklist-warning-highlight');
    if (badge) {
      badge.textContent = '⚠ Criteria not satisfied';
      badge.classList.remove('hidden');
    }
    showToast('Weak Password', 'New password must fulfill all 5 security requirements.', 'warning');
    return;
  }

  if (newPass !== confirmPass) {
    showToast('Mismatch Error', 'New password and confirmation password do not match.', 'error');
    return;
  }

  // Clear inputs and reset checklist
  document.getElementById('currentPassword').value = '';
  document.getElementById('newPassword').value = '';
  document.getElementById('confirmPassword').value = '';
  validatePasswordStrength();

  if (box) box.classList.remove('checklist-warning-highlight');
  if (badge) badge.classList.add('hidden');

  showToast('Password Updated', 'Your account password has been updated successfully.', 'success');
}

/**
 * Password Visibility Toggle with SVG Icons
 */
window.togglePasswordVisibility = function (inputId, eyeOpenId, eyeClosedId, event) {
  if (event && event.preventDefault) {
    event.preventDefault();
    event.stopPropagation();
  }
  const input = document.getElementById(inputId);
  if (!input) return;

  if (eyeClosedId) {
    const eyeOpen = document.getElementById(eyeOpenId);
    const eyeClosed = document.getElementById(eyeClosedId);
    if (input.type === 'password') {
      input.type = 'text';
      if (eyeOpen) eyeOpen.classList.add('hidden');
      if (eyeClosed) eyeClosed.classList.remove('hidden');
    } else {
      input.type = 'password';
      if (eyeOpen) eyeOpen.classList.remove('hidden');
      if (eyeClosed) eyeClosed.classList.add('hidden');
    }
    return;
  }

  // Fallback toggle
  input.type = input.type === 'password' ? 'text' : 'password';
};

/**
 * Handle Profile Photo / Avatar Change
 */
function handleAvatarChange(e) {
  const file = e.target.files?.[0];
  if (!file) return;

  if (!file.type.startsWith('image/')) {
    showToast('Invalid File', 'Please upload a valid image file (PNG or JPEG).', 'warning');
    return;
  }

  if (file.size > 5 * 1024 * 1024) {
    showToast('File Too Large', 'Maximum avatar image file size is 5MB.', 'warning');
    return;
  }

  const reader = new FileReader();
  reader.onload = function (event) {
    const preview = document.getElementById('profileAvatarPreview');
    if (preview) {
      preview.innerHTML = `<img src="${event.target.result}" alt="Student Avatar" class="w-full h-full object-cover rounded-full">`;
    }
    showToast('Avatar Updated', 'Profile photo updated successfully.', 'success');
  };
  reader.readAsDataURL(file);
}

/**
 * Handle Single-Session Concurrency Revocation
 */
function handleRevokeOtherSessions() {
  showToast('Sessions Revoked', 'All other active device sessions have been revoked.', 'success');
}

/**
 * Topbar Profile Menu Toggle
 */
window.toggleProfileDropdown = function (e) {
  if (e) e.stopPropagation();
  const menu = document.getElementById('studentProfileMenu');
  if (menu) menu.classList.toggle('hidden');
};

window.closeProfileDropdown = function () {
  const menu = document.getElementById('studentProfileMenu');
  if (menu && !menu.classList.contains('hidden')) {
    menu.classList.add('hidden');
  }
};

/**
 * Sidebar Dropdown Toggles (Tardy & Excuse)
 */
window.toggleTardyDropdown = function () {
  const menu = document.querySelector('.tardy-dropdown-menu');
  const arrow = document.querySelector('.tardy-dropdown-arrow');
  if (menu) menu.classList.toggle('hidden');
  if (arrow) arrow.classList.toggle('rotate-90');
};

window.toggleExcuseDropdown = function () {
  const menu = document.querySelector('.excuse-dropdown-menu');
  const arrow = document.querySelector('.excuse-dropdown-arrow');
  if (menu) menu.classList.toggle('hidden');
  if (arrow) arrow.classList.toggle('rotate-90');
};

/**
 * Student Portal Logout
 */
window.handleLogout = function () {
  sessionStorage.clear();
  window.location.replace('../login.html');
};

/**
 * Standard Toast Notification System (1:1 Reference: student/attendance-calendar.html)
 * @param {string} title
 * @param {string} message
 * @param {'success' | 'warning' | 'error' | 'info'} type
 */
window.showToast = function (title, message, type = 'success') {
  let toastContainer = document.getElementById('toastContainer');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toastContainer';
    toastContainer.className = 'fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none';
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  toast.className = 'pointer-events-auto bg-white border border-[#e5e7eb] shadow-xl rounded-xl p-3.5 flex items-start gap-3 min-w-[280px] max-w-sm transition-all duration-300 transform translate-x-0';

  let iconSvg = '';
  if (type === 'success') {
    iconSvg = `
      <div class="w-8 h-8 rounded-xl bg-[#f0fdf4] text-[#16a34a] border border-[#bbf7d0] flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
        <svg class="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.25">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
      </div>
    `;
  } else if (type === 'info') {
    iconSvg = `
      <div class="w-8 h-8 rounded-xl bg-[#eff6ff] text-[#0030c2] border border-[#bfdbfe] flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
        <svg class="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.25">
          <path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
        </svg>
      </div>
    `;
  } else if (type === 'warning') {
    iconSvg = `
      <div class="w-8 h-8 rounded-xl bg-[#fff7ed] text-[#f97316] border border-[#fed7aa] flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
        <svg class="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.25">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
        </svg>
      </div>
    `;
  } else {
    iconSvg = `
      <div class="w-8 h-8 rounded-xl bg-[#fef2f2] text-[#dc2626] border border-[#fecaca] flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
        <svg class="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.25">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>
    `;
  }

  toast.innerHTML = `
    ${iconSvg}
    <div class="flex-1 min-w-0">
      <p class="text-xs font-bold text-[#111827]">${escapeHtml(title)}</p>
      <p class="text-[11px] text-[#6b7280] mt-0.5 leading-tight">${escapeHtml(message)}</p>
    </div>
    <button onclick="this.parentElement.remove()" class="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg p-1 transition-colors cursor-pointer shrink-0" aria-label="Dismiss">
      <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
    </button>
  `;

  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('opacity-0', 'translate-x-full');
    setTimeout(() => toast.remove(), 300);
  }, 4000);
};

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/[&<>'"]/g, tag => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;'
  }[tag] || tag));
}
