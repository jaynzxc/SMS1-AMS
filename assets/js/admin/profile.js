// assets/js/admin/profile.js
// Administrator Profile Management & Security Script

const DEFAULT_ADMIN_PASSWORD = '#De8080';

document.addEventListener('DOMContentLoaded', () => {
  console.log('👤 Admin Profile Module Initialized');
  initCurrentDate();
  loadAdminProfile();
  initFormListeners();
  initPasswordLiveValidation();
});

function initCurrentDate() {
  const el = document.getElementById('currentDateLabel');
  if (el) {
    const now = new Date();
    const options = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' };
    el.textContent = now.toLocaleDateString('en-US', options);
  }
}

function loadAdminProfile() {
  try {
    const raw = localStorage.getItem('currentUser');
    const user = raw ? JSON.parse(raw) : null;

    let fullName = user?.name;
    if (!fullName || fullName === 'System Administrator') {
      fullName = 'Admin User';
      if (user) {
        user.name = 'Admin User';
        localStorage.setItem('currentUser', JSON.stringify(user));
      }
    }
    const username = user?.username || 'admin';
    const email = user?.email || 'admin@bcp.edu.ph';
    const office = user?.office || 'IT / Registrar Office';

    // Populate overview card
    const elCardName = document.getElementById('cardAdminFullName');
    const elCardEmail = document.getElementById('cardAdminEmail');
    const elCardOffice = document.getElementById('cardAdminOffice');
    const elTopbarName = document.getElementById('topbarAdminName');

    if (elCardName) elCardName.textContent = fullName;
    if (elCardEmail) elCardEmail.textContent = email;
    if (elCardOffice) elCardOffice.textContent = office;
    if (elTopbarName) elTopbarName.textContent = fullName;

    // Populate form fields
    const elFormName = document.getElementById('adminFullName');
    const elFormUsername = document.getElementById('adminUsername');
    const elFormEmail = document.getElementById('adminEmail');
    const elFormOffice = document.getElementById('adminOffice');

    if (elFormName) elFormName.value = fullName;
    if (elFormUsername) elFormUsername.value = username;
    if (elFormEmail) elFormEmail.value = email;
    if (elFormOffice) elFormOffice.value = office;

  } catch (e) {
    console.error('Error loading admin profile:', e);
  }
}

function initPasswordLiveValidation() {
  const newPassInput = document.getElementById('newPassword');
  if (!newPassInput) return;

  newPassInput.addEventListener('input', () => {
    const val = newPassInput.value;

    const hasLength = val.length >= 8;
    const hasUpper = /[A-Z]/.test(val);
    const hasLower = /[a-z]/.test(val);
    const hasNumber = /[0-9]/.test(val);
    const hasSymbol = /[^A-Za-z0-9]/.test(val);

    updateRuleState('rule-length', hasLength);
    updateRuleState('rule-upper', hasUpper);
    updateRuleState('rule-lower', hasLower);
    updateRuleState('rule-number', hasNumber);
    updateRuleState('rule-symbol', hasSymbol);
  });
}

function updateRuleState(elementId, isValid) {
  const el = document.getElementById(elementId);
  if (!el) return;

  if (isValid) {
    el.className = 'flex items-center gap-1.5 text-emerald-600 font-semibold';
    el.innerHTML = `<svg class="w-3.5 h-3.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"/></svg> ${el.textContent.trim()}`;
  } else {
    el.className = 'flex items-center gap-1.5 text-gray-500';
    el.innerHTML = `<span class="w-1.5 h-1.5 rounded-full bg-gray-400"></span> ${el.textContent.trim()}`;
  }
}

function initFormListeners() {
  // Personal Information Form
  const formProfile = document.getElementById('formAdminProfile');
  if (formProfile) {
    formProfile.addEventListener('submit', (e) => {
      e.preventDefault();

      const fullName = document.getElementById('adminFullName')?.value.trim();
      const username = document.getElementById('adminUsername')?.value.trim();
      const email = document.getElementById('adminEmail')?.value.trim();
      const office = document.getElementById('adminOffice')?.value.trim();

      if (!fullName || !username || !email) {
        showToast('Please complete all required fields.', 'error');
        return;
      }

      try {
        const raw = localStorage.getItem('currentUser');
        const user = raw ? JSON.parse(raw) : {};

        const updatedUser = {
          ...user,
          name: fullName,
          username: username,
          email: email,
          office: office,
          role: 'admin'
        };

        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        loadAdminProfile();
        showToast('Profile information updated successfully!', 'success');
      } catch (err) {
        console.error('Failed to update profile:', err);
        showToast('Error saving profile changes.', 'error');
      }
    });
  }

  // Security / Change Password Form
  const formPassword = document.getElementById('formAdminPassword');
  if (formPassword) {
    formPassword.addEventListener('submit', (e) => {
      e.preventDefault();

      const currentPass = document.getElementById('currentPassword')?.value;
      const newPass = document.getElementById('newPassword')?.value;
      const confirmPass = document.getElementById('confirmNewPassword')?.value;

      if (!currentPass || !newPass || !confirmPass) {
        showToast('Please fill in all password fields.', 'error');
        return;
      }

      // Check current password (defaults to #De8080)
      const storedPassword = localStorage.getItem('sms_admin_password') || DEFAULT_ADMIN_PASSWORD;
      if (currentPass !== storedPassword) {
        showToast('Incorrect current password. (Default is #De8080)', 'error');
        return;
      }

      // 5-Rule Password Policy Check
      const hasLength = newPass.length >= 8;
      const hasUpper = /[A-Z]/.test(newPass);
      const hasLower = /[a-z]/.test(newPass);
      const hasNumber = /[0-9]/.test(newPass);
      const hasSymbol = /[^A-Za-z0-9]/.test(newPass);

      if (!hasLength || !hasUpper || !hasLower || !hasNumber || !hasSymbol) {
        showToast('New password does not meet all security requirements.', 'error');
        return;
      }

      if (newPass !== confirmPass) {
        showToast('New passwords do not match.', 'error');
        return;
      }

      // Save new password
      try {
        localStorage.setItem('sms_admin_password', newPass);
        formPassword.reset();
        
        // Reset checklist indicators
        ['rule-length', 'rule-upper', 'rule-lower', 'rule-number', 'rule-symbol'].forEach(id => {
          updateRuleState(id, false);
        });

        showToast('Admin password updated successfully!', 'success');
      } catch (err) {
        console.error('Failed to update password:', err);
        showToast('Error updating password.', 'error');
      }
    });
  }
}

function showToast(message, type = 'info') {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'pointer-events-auto bg-white border border-[#e5e7eb] shadow-xl rounded-xl p-3 flex items-center gap-3 min-w-[260px] max-w-sm transition-all duration-300 transform translate-x-0';

  const isSuccess = type === 'success';
  const isError = type === 'error';
  
  let iconSvg = `<div class="w-7 h-7 rounded-full bg-blue-50 text-[#0030c2] flex items-center justify-center shrink-0"><svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"/></svg></div>`;
  
  if (isSuccess) {
    iconSvg = `<div class="w-7 h-7 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0"><svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"/></svg></div>`;
  } else if (isError) {
    iconSvg = `<div class="w-7 h-7 rounded-full bg-red-50 text-red-600 flex items-center justify-center shrink-0"><svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg></div>`;
  }

  toast.innerHTML = `
    ${iconSvg}
    <p class="text-xs font-semibold text-[#111827] flex-1">${message}</p>
    <button onclick="this.parentElement.remove()" class="text-gray-400 hover:text-gray-600 p-1 cursor-pointer">
      <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
    </button>
  `;

  container.appendChild(toast);
  setTimeout(() => {
    toast.classList.add('opacity-0', 'translate-x-full');
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}
