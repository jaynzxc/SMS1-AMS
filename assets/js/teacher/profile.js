/**
 * Teacher Profile Module JavaScript
 * Bestlink College of the Philippines - Attendance Monitoring System
 * Handles personal details update, password strength verification,
 * dynamic QR code rendering/download/print, and RFID card management.
 */

document.addEventListener('DOMContentLoaded', () => {
  initProfileModule();
});

function initProfileModule() {
  // Bind form submissions
  const formProfile = document.getElementById('formTeacherProfile');
  if (formProfile) {
    formProfile.addEventListener('submit', handleProfileUpdate);
  }

  const formPassword = document.getElementById('formChangePassword');
  if (formPassword) {
    formPassword.addEventListener('submit', handlePasswordChange);
  }

  // Revoke Remote Device Sessions Button
  const btnRevoke = document.getElementById('btnRevokeOtherSessions');
  if (btnRevoke) {
    btnRevoke.addEventListener('click', handleRevokeOtherSessions);
  }

  // Bind password input for live strength validation
  const newPasswordInput = document.getElementById('newPassword');
  if (newPasswordInput) {
    newPasswordInput.addEventListener('input', validatePasswordStrength);
  }

  // Bind avatar file input
  const avatarInput = document.getElementById('avatarFileInput');
  if (avatarInput) {
    avatarInput.addEventListener('change', handleAvatarChange);
  }

  // Bind escape key to close modals
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeLostCardModal();
    }
  });

  const lostCardModal = document.getElementById('lostCardModal');
  if (lostCardModal) {
    lostCardModal.addEventListener('click', (e) => {
      if (e.target === lostCardModal) closeLostCardModal();
    });
  }

  // Handle URL hash tab navigation
  const hash = window.location.hash.replace('#', '');
  if (['personal', 'id-cards', 'security'].includes(hash)) {
    switchProfileTab(hash);
  }
}

/**
 * Handle Personal & Academic Profile Form Submission
 */
function handleProfileUpdate(e) {
  e.preventDefault();

  const fullName = document.getElementById('teacherFullName')?.value.trim();
  const email = document.getElementById('teacherEmail')?.value.trim();
  const contact = document.getElementById('teacherContact')?.value.trim();

  if (!fullName || !email || !contact) {
    showToast('Please fill in all required fields.', false);
    return;
  }

  // Reflect updates into identity overview card
  const cardName = document.getElementById('cardTeacherFullName');
  if (cardName) {
    cardName.textContent = fullName;
  }

  const cardEmail = document.getElementById('cardTeacherEmail');
  if (cardEmail) {
    cardEmail.textContent = email;
  }

  const cardContact = document.getElementById('cardTeacherContact');
  if (cardContact) {
    cardContact.textContent = contact;
  }

  // Update initials if avatar text is displayed
  const avatarInitials = document.getElementById('profileAvatarInitials');
  if (avatarInitials) {
    const parts = fullName.replace(/^(Mr\.|Mrs\.|Ms\.|Dr\.|Engr\.|Prof\.)\s+/i, '').trim().split(' ');
    if (parts.length >= 2) {
      avatarInitials.textContent = (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    } else if (parts.length === 1 && parts[0].length > 0) {
      avatarInitials.textContent = parts[0][0].toUpperCase();
    }
  }

  showToast('Profile information updated successfully!');
}

// Password Rules Metadata for clear warning feedback
const PASSWORD_RULES_META = {
  length: {
    id: 'ruleLength',
    label: 'At least 8 characters long'
  },
  upper: {
    id: 'ruleUpper',
    label: 'At least 1 uppercase letter (A-Z)'
  },
  lower: {
    id: 'ruleLower',
    label: 'At least 1 lowercase letter (a-z)'
  },
  number: {
    id: 'ruleNumber',
    label: 'At least 1 numeric digit (0-9)'
  },
  special: {
    id: 'ruleSpecial',
    label: 'At least 1 special character (!@#$%^&*)'
  }
};

/**
 * Handle Account Security / Password Change
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
      badge.textContent = '⚠ Complete all password fields';
      badge.classList.remove('hidden');
    }
    if (!currentPass) document.getElementById('currentPassword')?.focus();
    else if (!newPass) document.getElementById('newPassword')?.focus();
    else document.getElementById('confirmPassword')?.focus();
    return;
  }

  // Validate all 5 rules
  const rules = checkRules(newPass);
  const allValid = Object.values(rules).every(Boolean);

  if (!allValid) {
    // Keep UI clean: NO TOAST NOTIFICATION. The yellow warning on the password requirements checklist stays!
    highlightUnmetPasswordRules(rules);

    // Focus new password field to let teacher continue typing
    const newPassInput = document.getElementById('newPassword');
    if (newPassInput) {
      newPassInput.focus();
    }
    return;
  }

  if (newPass !== confirmPass) {
    if (box) box.classList.add('checklist-warning-highlight');
    if (badge) {
      badge.textContent = '⚠ Passwords do not match';
      badge.classList.remove('hidden');
    }
    const confirmInput = document.getElementById('confirmPassword');
    if (confirmInput) {
      confirmInput.focus();
    }
    return;
  }

  // Reset password form upon success
  e.target.reset();
  validatePasswordStrength(); // Reset visual rules checklist
  showToast('Account Password Updated', 'Your faculty account password has been successfully updated.', 'success');
}

/**
 * Apply and keep the yellow warning on the password requirements checklist
 */
function highlightUnmetPasswordRules(rules) {
  const checklistBox = document.getElementById('passwordRequirementsBox') ||
                        document.querySelector('#panelSecurity .bg-\\[\\#f8fafc\\].border');
  const badge = document.getElementById('passwordReqWarningBadge');

  if (checklistBox) {
    checklistBox.classList.remove('border-emerald-300', 'bg-emerald-50/20');
    checklistBox.classList.add('checklist-warning-highlight');
  }

  if (badge) {
    badge.className = 'text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300';
    badge.textContent = '⚠ Requirements not met';
    badge.classList.remove('hidden');
  }

  Object.keys(rules).forEach(key => {
    updateRuleUI(PASSWORD_RULES_META[key]?.id, rules[key], true);
  });
}

/**
 * Live Password Strength Checker
 */
function checkRules(password) {
  return {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)
  };
}

function validatePasswordStrength() {
  const password = document.getElementById('newPassword')?.value || '';
  const rules = checkRules(password);
  const allValid = Object.values(rules).every(Boolean);

  const box = document.getElementById('passwordRequirementsBox') ||
              document.querySelector('#panelSecurity .bg-\\[\\#f8fafc\\].border');
  const badge = document.getElementById('passwordReqWarningBadge');

  if (!password) {
    // Initial empty state: reset to neutral
    if (box) {
      box.classList.remove('checklist-warning-highlight', 'border-emerald-300', 'bg-emerald-50/20');
    }
    if (badge) {
      badge.classList.add('hidden');
    }
    Object.keys(rules).forEach(key => {
      const el = document.getElementById(PASSWORD_RULES_META[key]?.id);
      if (el) {
        el.className = 'flex items-center gap-1.5 text-gray-500 transition-colors';
        const icon = el.querySelector('.rule-icon');
        if (icon) icon.textContent = '○';
      }
    });
    return;
  }

  // Active typing state
  if (allValid) {
    if (box) {
      box.classList.remove('checklist-warning-highlight');
      box.classList.add('border-emerald-300', 'bg-emerald-50/20');
    }
    if (badge) {
      badge.className = 'text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300';
      badge.textContent = '✓ All requirements satisfied';
      badge.classList.remove('hidden');
    }
  } else {
    // Yellow warning stays on unmet requirements
    if (box) {
      box.classList.remove('border-emerald-300', 'bg-emerald-50/20');
      box.classList.add('checklist-warning-highlight');
    }
    if (badge) {
      badge.className = 'text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300';
      badge.textContent = '⚠ Requirements pending';
      badge.classList.remove('hidden');
    }
  }

  Object.keys(rules).forEach(key => {
    updateRuleUI(PASSWORD_RULES_META[key]?.id, rules[key], Boolean(password));
  });
}

function updateRuleUI(ruleElementId, isValid, hasTyped = true) {
  const el = document.getElementById(ruleElementId);
  if (!el) return;

  const iconSpan = el.querySelector('.rule-icon');
  if (isValid) {
    el.className = 'flex items-center gap-1.5 rule-met-highlight transition-colors';
    if (iconSpan) iconSpan.textContent = '✓';
  } else if (hasTyped) {
    // Yellow warning stays on unmet requirements
    el.className = 'flex items-center gap-1.5 rule-unmet-highlight transition-colors';
    if (iconSpan) iconSpan.textContent = '⚠';
  } else {
    el.className = 'flex items-center gap-1.5 text-gray-500 transition-colors';
    if (iconSpan) iconSpan.textContent = '○';
  }
}

/**
 * Toggle Password Visibility with SVG Icons
 */
function togglePasswordVisibility(inputId, eyeOpenId, eyeClosedId, event) {
  if (event && event.preventDefault) {
    event.preventDefault();
    event.stopPropagation();
  }
  const input = document.getElementById(inputId);
  if (!input) return;

  // Reliable dual-SVG toggle
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

  // Fallback single icon switch
  const icon = document.getElementById(eyeOpenId);
  if (!icon) return;
  if (input.type === 'password') {
    input.type = 'text';
    icon.innerHTML = `
      <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
    `;
  } else {
    input.type = 'password';
    icon.innerHTML = `
      <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
      <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    `;
  }
}

/**
 * Handle Photo Upload
 */
function handleAvatarChange(e) {
  const file = e.target.files?.[0];
  if (!file) return;

  if (!file.type.startsWith('image/')) {
    showToast('Please select a valid image file.', false);
    return;
  }

  const reader = new FileReader();
  reader.onload = (event) => {
    const avatarPreview = document.getElementById('profileAvatarPreview');
    if (avatarPreview) {
      avatarPreview.innerHTML = `<img src="${event.target.result}" alt="Faculty Photo" class="w-full h-full object-cover">`;
    }
    // Also sync the topbar profile pill avatar
    const topbarAvatar = document.querySelector('#topbarProfileBtn .w-8.h-8');
    if (topbarAvatar) {
      topbarAvatar.innerHTML = `<img src="${event.target.result}" alt="Faculty Photo" class="w-full h-full rounded-full object-cover">`;
    }
    showToast('Faculty photo preview updated!');
  };
  reader.readAsDataURL(file);
}

/**
 * Fullscreen QR Modal Handlers
 */
function openQrModal() {
  const modal = document.getElementById('qrFullscreenModal');
  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }
}

function closeQrModal() {
  const modal = document.getElementById('qrFullscreenModal');
  if (modal) {
    modal.classList.remove('flex');
    modal.classList.add('hidden');
  }
}

/**
 * Download Faculty QR Code as PNG
 */
function downloadQrCode() {
  const svg = document.getElementById('facultyQrSvg');
  if (!svg) {
    showToast('QR Code not found for download.', false);
    return;
  }

  try {
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    canvas.width = 600;
    canvas.height = 600;

    img.onload = () => {
      // Draw white background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      // Draw QR image
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // Trigger download
      const pngFile = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.download = 'BCP_Teacher_QR_t230110089.png';
      downloadLink.href = pngFile;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);

      showToast('Teacher QR Pass downloaded (PNG)!');
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  } catch (err) {
    console.error('Download QR failed:', err);
    showToast('Failed to download QR code.', false);
  }
}

/**
 * Print Faculty Identification Badge
 */
function printFacultyBadge() {
  window.print();
}

/**
 * Lost or Damaged Card Modal Handlers
 */
function openLostCardModal() {
  const modal = document.getElementById('lostCardModal');
  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }
}

function closeLostCardModal() {
  const modal = document.getElementById('lostCardModal');
  if (modal) {
    modal.classList.remove('flex');
    modal.classList.add('hidden');
  }
}

function submitLostCardReport() {
  const reason = document.getElementById('lostCardReason')?.value || 'Lost';
  const notes = document.getElementById('lostCardNotes')?.value.trim() || '';

  // Close modal
  closeLostCardModal();

  // Update card status badge in UI to deactivation pending
  const badgeContainer = document.querySelector('.relative.overflow-hidden.rounded-2xl .text-\\[10px\\].font-bold.px-2');
  if (badgeContainer) {
    badgeContainer.className = 'text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-400/30';
    badgeContainer.textContent = 'REVOCATION PENDING';
  }

  showToast(`Incident reported (${reason}). Administrator notified.`);
}

/**
 * Toast Notification Utility
 * Supports rich toast types: 'warning', 'success', 'error', 'info'
 * Backwards compatible with showToast(message, isSuccess)
 */
function showToast(titleOrMessage, detailsOrSuccess = true, type = null, customDuration = null) {
  let title = '';
  let message = '';
  let items = [];
  let toastType = 'info';
  let duration = customDuration || 4500;

  // Detect signature
  if (type !== null) {
    // Rich signature: showToast(title, messageOrList, type, duration)
    title = titleOrMessage;
    toastType = type;
    if (Array.isArray(detailsOrSuccess)) {
      items = detailsOrSuccess;
    } else {
      message = detailsOrSuccess || '';
    }
    if (toastType === 'warning' && !customDuration) {
      duration = 6000; // Give extra reading time for warning requirements
    }
  } else if (typeof detailsOrSuccess === 'boolean') {
    // Legacy signature: showToast(message, isSuccess)
    message = titleOrMessage;
    toastType = detailsOrSuccess ? 'success' : 'error';
    title = detailsOrSuccess ? 'Success' : 'Attention';
  } else if (typeof detailsOrSuccess === 'string' && ['success', 'warning', 'error', 'info'].includes(detailsOrSuccess)) {
    // 2-arg signature: showToast(message, 'warning')
    message = titleOrMessage;
    toastType = detailsOrSuccess;
    title = toastType === 'warning' ? 'Security Notice' : (toastType === 'success' ? 'Success' : 'Notice');
  } else {
    title = 'Notification';
    message = titleOrMessage;
    toastType = 'info';
  }

  // Backwards compatibility fallback for legacy single-line DOM element if accessed elsewhere
  const legacyMsg = document.getElementById('profileToastMsg');
  if (legacyMsg) legacyMsg.textContent = message || title;

  // Get or dynamically inject toast container
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container-fixed';
    document.body.appendChild(container);
  } else if (!container.classList.contains('toast-container-fixed')) {
    container.className = 'toast-container-fixed';
  }

  // Create toast card element
  const toast = document.createElement('div');
  toast.className = `toast-notification-card toast-theme-${toastType}`;

  // SVG Icon based on toastType
  let iconSvg = `
    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
      <path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
    </svg>`;

  if (toastType === 'warning') {
    iconSvg = `
      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.25">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
      </svg>`;
  } else if (toastType === 'success') {
    iconSvg = `
      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.25">
        <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
      </svg>`;
  } else if (toastType === 'error') {
    iconSvg = `
      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.25">
        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>`;
  }

  // Build items HTML if list is supplied
  let itemsHtml = '';
  if (items.length > 0) {
    itemsHtml = `
      <div class="toast-req-list-box">
        <p class="toast-req-list-title">Missing Requirements:</p>
        <div class="toast-req-list">
          ${items.map(item => `
            <div class="toast-req-item">
              <span class="toast-req-dot"></span>
              <span>${item}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  toast.innerHTML = `
    <div class="toast-icon-wrapper">
      ${iconSvg}
    </div>
    <div class="toast-content-wrapper">
      <div class="toast-header-row">
        <h4 class="toast-title">${title}</h4>
        <span class="toast-type-badge">${toastType}</span>
      </div>
      ${message ? `<p class="toast-desc">${message}</p>` : ''}
      ${itemsHtml}
    </div>
    <button type="button" class="toast-dismiss-btn" aria-label="Dismiss notification">
      <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  `;

  // Attach close handler
  const closeBtn = toast.querySelector('.toast-dismiss-btn');
  let isRemoved = false;
  const removeToast = () => {
    if (isRemoved) return;
    isRemoved = true;
    toast.classList.remove('toast-visible');
    toast.classList.add('toast-hiding');
    setTimeout(() => {
      if (toast.parentElement) toast.remove();
    }, 300);
  };

  if (closeBtn) {
    closeBtn.addEventListener('click', removeToast);
  }

  // Insert toast into container
  container.appendChild(toast);

  // Trigger smooth enter animation
  requestAnimationFrame(() => {
    toast.classList.add('toast-visible');
  });

  // Auto remove after specified duration
  setTimeout(removeToast, duration);
}

/**
 * Switch Main Profile Tabs (Personal & Academic, Digital ID & RFID, Security & Notifications)
 */
function switchProfileTab(tab) {
  const tabPersonalBtn = document.getElementById('tabPersonalBtn');
  const tabIdCardsBtn = document.getElementById('tabIdCardsBtn');
  const tabSecurityBtn = document.getElementById('tabSecurityBtn');

  const panelPersonal = document.getElementById('panelPersonal');
  const panelIdCards = document.getElementById('panelIdCards');
  const panelSecurity = document.getElementById('panelSecurity');

  const tabs = [
    { key: 'personal', btn: tabPersonalBtn, panel: panelPersonal },
    { key: 'id-cards', btn: tabIdCardsBtn, panel: panelIdCards },
    { key: 'security', btn: tabSecurityBtn, panel: panelSecurity }
  ];

  tabs.forEach(t => {
    if (!t.btn || !t.panel) return;
    if (t.key === tab) {
      t.btn.className = 'btn-press flex items-center gap-2 pb-3 px-3 text-xs sm:text-sm font-bold border-b-2 border-[#0030c2] text-[#0030c2] transition-all cursor-pointer whitespace-nowrap';
      t.panel.classList.remove('hidden');
    } else {
      t.btn.className = 'btn-press flex items-center gap-2 pb-3 px-3 text-xs sm:text-sm font-medium border-b-2 border-transparent text-[#6b7280] hover:text-[#111827] hover:border-gray-300 transition-all cursor-pointer whitespace-nowrap';
      t.panel.classList.add('hidden');
    }
  });
}

/**
 * Switch Security Tab (Password vs Notifications) - Backward Compatibility
 */
function switchSecurityTab(tab) {
  const tabPasswordBtn = document.getElementById('tabPasswordBtn');
  const tabNotificationsBtn = document.getElementById('tabNotificationsBtn');
  const tabPasswordContent = document.getElementById('tabPasswordContent');
  const tabNotificationsContent = document.getElementById('tabNotificationsContent');

  if (!tabPasswordBtn || !tabNotificationsBtn || !tabPasswordContent || !tabNotificationsContent) return;

  if (tab === 'password') {
    tabPasswordBtn.className = 'px-2.5 py-1 rounded-md text-[#0030c2] bg-white shadow-2xs transition-all cursor-pointer';
    tabNotificationsBtn.className = 'px-2.5 py-1 rounded-md text-gray-500 hover:text-[#111827] transition-all cursor-pointer';
    tabPasswordContent.classList.remove('hidden');
    tabNotificationsContent.classList.add('hidden');
  } else {
    tabNotificationsBtn.className = 'px-2.5 py-1 rounded-md text-[#0030c2] bg-white shadow-2xs transition-all cursor-pointer';
    tabPasswordBtn.className = 'px-2.5 py-1 rounded-md text-gray-500 hover:text-[#111827] transition-all cursor-pointer';
    tabNotificationsContent.classList.remove('hidden');
    tabPasswordContent.classList.add('hidden');
  }
}

/**
 * Handle Revoke Other Device Sessions
 */
function handleRevokeOtherSessions() {
  const secondary = document.getElementById('secondarySessionItem');
  if (secondary) {
    secondary.classList.add('opacity-40', 'pointer-events-none');
    const status = document.getElementById('secondarySessionStatus');
    if (status) {
      status.textContent = 'Terminated';
      status.className = 'text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 shrink-0';
    }
  }
  showToast('Sessions Terminated', 'Logged out of 1 remote laboratory terminal.', 'warning');
}

/**
 * Copy RFID Card UID to clipboard with toast feedback
 */
function copyUidToClipboard() {
  const uidEl = document.getElementById('cardVisualUid');
  const uid = uidEl ? uidEl.textContent.trim() : 'RFID-8842-9901';
  navigator.clipboard.writeText(uid).then(() => {
    showToast('Copied to Clipboard', `Card UID ${uid} copied to clipboard.`, 'success');
  }).catch(() => {
    showToast('Card UID', uid, 'info');
  });
}

// Explicit window bindings for inline HTML attributes
window.switchProfileTab = switchProfileTab;
window.openQrModal = openQrModal;
window.closeQrModal = closeQrModal;
window.downloadQrCode = downloadQrCode;
window.openLostCardModal = openLostCardModal;
window.closeLostCardModal = closeLostCardModal;
window.submitLostCardReport = submitLostCardReport;
window.togglePasswordVisibility = togglePasswordVisibility;
window.switchSecurityTab = switchSecurityTab;
window.handleRevokeOtherSessions = handleRevokeOtherSessions;
window.showToast = showToast;
window.copyUidToClipboard = copyUidToClipboard;



