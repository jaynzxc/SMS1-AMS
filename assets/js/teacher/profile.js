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
      closeQrModal();
      closeLostCardModal();
    }
  });

  // Bind backdrop click to close modals
  const qrModal = document.getElementById('qrFullscreenModal');
  if (qrModal) {
    qrModal.addEventListener('click', (e) => {
      if (e.target === qrModal) closeQrModal();
    });
  }

  const lostCardModal = document.getElementById('lostCardModal');
  if (lostCardModal) {
    lostCardModal.addEventListener('click', (e) => {
      if (e.target === lostCardModal) closeLostCardModal();
    });
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
  const avatarDiv = document.querySelector('.relative.inline-block .rounded-full.bg-\\[\\#0030c2\\]');
  if (avatarDiv && !avatarDiv.querySelector('img')) {
    const parts = fullName.replace(/^(Mr\.|Mrs\.|Ms\.|Dr\.|Engr\.|Prof\.)\s+/i, '').trim().split(' ');
    if (parts.length >= 2) {
      avatarDiv.textContent = (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    } else if (parts.length === 1 && parts[0].length > 0) {
      avatarDiv.textContent = parts[0][0].toUpperCase();
    }
  }

  showToast('Profile information updated successfully!');
}

/**
 * Handle Account Security / Password Change
 */
function handlePasswordChange(e) {
  e.preventDefault();

  const currentPass = document.getElementById('currentPassword')?.value;
  const newPass = document.getElementById('newPassword')?.value;
  const confirmPass = document.getElementById('confirmPassword')?.value;

  if (!currentPass || !newPass || !confirmPass) {
    showToast('Please complete all password fields.', false);
    return;
  }

  if (newPass !== confirmPass) {
    showToast('New password and confirmation do not match.', false);
    return;
  }

  // Validate all 5 rules
  const rules = checkRules(newPass);
  const allValid = Object.values(rules).every(Boolean);

  if (!allValid) {
    showToast('Please satisfy all password security requirements.', false);
    return;
  }

  // Reset password form
  e.target.reset();
  validatePasswordStrength(); // Reset visual rules checklist
  showToast('Account password updated successfully!');
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

  updateRuleUI('ruleLength', rules.length);
  updateRuleUI('ruleUpper', rules.upper);
  updateRuleUI('ruleLower', rules.lower);
  updateRuleUI('ruleNumber', rules.number);
  updateRuleUI('ruleSpecial', rules.special);
}

function updateRuleUI(ruleElementId, isValid) {
  const el = document.getElementById(ruleElementId);
  if (!el) return;

  const iconSpan = el.querySelector('.rule-icon');
  if (isValid) {
    el.classList.remove('text-gray-500');
    el.classList.add('text-emerald-600', 'font-semibold');
    if (iconSpan) iconSpan.textContent = '✓';
  } else {
    el.classList.remove('text-emerald-600', 'font-semibold');
    el.classList.add('text-gray-500');
    if (iconSpan) iconSpan.textContent = '○';
  }
}

/**
 * Toggle Password Visibility with SVG Icons
 */
function togglePasswordVisibility(inputId, iconId) {
  const input = document.getElementById(inputId);
  const icon = document.getElementById(iconId);
  if (!input || !icon) return;

  if (input.type === 'password') {
    input.type = 'text';
    // Switch to Eye-Off SVG
    icon.innerHTML = `
      <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
    `;
  } else {
    input.type = 'password';
    // Switch to Eye SVG
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
    const avatarDiv = document.querySelector('.relative.inline-block .rounded-full.bg-\\[\\#0030c2\\]');
    if (avatarDiv) {
      avatarDiv.innerHTML = `<img src="${event.target.result}" alt="Faculty Photo" class="w-full h-full rounded-full object-cover shadow-sm">`;
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
      downloadLink.download = 'BCP_Faculty_QR_JaneDelaCruz.png';
      downloadLink.href = pngFile;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);

      showToast('Faculty QR Code downloaded (PNG)!');
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
 */
let toastTimeout = null;
function showToast(message, isSuccess = true) {
  const toast = document.getElementById('profileToast');
  const toastMsg = document.getElementById('profileToastMsg');
  const toastIcon = document.getElementById('profileToastIcon');

  if (!toast || !toastMsg) return;

  toastMsg.textContent = message;

  if (toastIcon) {
    toastIcon.textContent = isSuccess ? '✓' : '✕';
    toastIcon.className = isSuccess ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold';
  }

  // Clear previous timer
  if (toastTimeout) {
    clearTimeout(toastTimeout);
  }

  // Show
  toast.classList.remove('translate-y-20', 'opacity-0', 'pointer-events-none');
  toast.classList.add('translate-y-0', 'opacity-100');

  // Auto hide after 3 seconds
  toastTimeout = setTimeout(() => {
    toast.classList.remove('translate-y-0', 'opacity-100');
    toast.classList.add('translate-y-20', 'opacity-0', 'pointer-events-none');
  }, 3200);
}

// Explicit window bindings for inline HTML attributes
window.openQrModal = openQrModal;
window.closeQrModal = closeQrModal;
window.downloadQrCode = downloadQrCode;
window.printFacultyBadge = printFacultyBadge;
window.openLostCardModal = openLostCardModal;
window.closeLostCardModal = closeLostCardModal;
window.submitLostCardReport = submitLostCardReport;
window.togglePasswordVisibility = togglePasswordVisibility;
window.showToast = showToast;

