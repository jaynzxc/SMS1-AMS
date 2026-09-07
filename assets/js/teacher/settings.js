/**
 * Faculty Settings Module JavaScript
 * Bestlink College of the Philippines - Attendance Monitoring System
 * Streamlined for practical faculty usage:
 * 1. Teacher In-App Notifications (Excuse slips, absence alerts, unsubmitted roll calls)
 * 2. In-Browser QR Scanner Feedback (Audio chime, haptic vibration for mobile phone / laptop camera)
 * 3. Security & Active Device Sessions (Viewing & revoking shared classroom/lab podium logins)
 */

// Default settings configuration
const DEFAULT_FACULTY_SETTINGS = {
  // 1. Teacher Notifications
  notifyExcuseSlip: true,
  notifyConsecutiveCuts: true,
  notifyClassReminder: true,
  notifySessionReminder: true,
  notifyParentSms: false,

  // 2. In-Browser QR Scanner (Phone or Laptop Camera)
  qrChime: true,
  qrVibrate: true,
  qrCooldown: '3'
};

const SETTINGS_STORAGE_KEY = 'sms_teacher_settings';

document.addEventListener('DOMContentLoaded', () => {
  initSettingsModule();
});

/**
 * Initialize Settings Module
 */
function initSettingsModule() {
  loadAndApplySettings();
  bindSettingsEvents();
  initTabNavigation();
}

/**
 * Tab Navigation (matches profile.html behavior)
 */
function initTabNavigation() {
  const hash = window.location.hash.replace('#', '');
  const validTabs = ['notifications', 'qr-scanner'];

  if (validTabs.includes(hash)) {
    switchSettingsTab(hash);
  } else {
    switchSettingsTab('notifications');
  }
}

/**
 * Switch Active Settings Tab
 * @param {string} tab - The tab identifier ('notifications', 'qr-scanner')
 */
function switchSettingsTab(tab) {
  const tabNotificationsBtn = document.getElementById('tabNotificationsBtn');
  const tabQrScannerBtn = document.getElementById('tabQrScannerBtn');

  const panelNotifications = document.getElementById('panelNotifications');
  const panelQrScanner = document.getElementById('panelQrScanner');

  const tabs = [
    { key: 'notifications', btn: tabNotificationsBtn, panel: panelNotifications },
    { key: 'qr-scanner', btn: tabQrScannerBtn, panel: panelQrScanner }
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

  // Keep URL in sync without jumping page
  if (history.replaceState) {
    history.replaceState(null, '', `#${tab}`);
  }
}

/**
 * Load settings from localStorage and populate inputs
 */
function loadAndApplySettings() {
  let settings = { ...DEFAULT_FACULTY_SETTINGS };

  try {
    const stored = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (stored) {
      settings = { ...DEFAULT_FACULTY_SETTINGS, ...JSON.parse(stored) };
    }
  } catch (err) {
    console.warn('Failed to parse stored faculty settings, using defaults:', err);
  }

  // 1. Teacher Notifications
  setCheckboxState('settingNotifyExcuseSlip', settings.notifyExcuseSlip);
  setCheckboxState('settingNotifyConsecutiveCuts', settings.notifyConsecutiveCuts);
  setCheckboxState('settingNotifyClassReminder', settings.notifyClassReminder);
  setCheckboxState('settingNotifySessionReminder', settings.notifySessionReminder);
  setCheckboxState('settingNotifyParentSms', settings.notifyParentSms);

  // 2. In-Browser QR Scanner
  setCheckboxState('settingQrChime', settings.qrChime);
  setCheckboxState('settingQrVibrate', settings.qrVibrate);
  setInputValue('settingQrCooldown', settings.qrCooldown);

  // Update Left Column snapshot
  updateConfigurationSnapshot(settings);
}

/**
 * Update Snapshot Summary in Left Column
 */
function updateConfigurationSnapshot(settings) {
  const snapExcuse = document.getElementById('snapshotExcuseAlerts');
  if (snapExcuse) {
    snapExcuse.textContent = settings.notifyExcuseSlip ? 'Enabled' : 'Muted';
    snapExcuse.className = settings.notifyExcuseSlip 
      ? 'font-semibold text-emerald-700' 
      : 'font-semibold text-gray-500';
  }

  const snapChime = document.getElementById('snapshotQrChime');
  if (snapChime) {
    snapChime.textContent = settings.qrChime ? 'Enabled' : 'Muted';
    snapChime.className = settings.qrChime 
      ? 'font-semibold text-[#0030c2]' 
      : 'font-semibold text-gray-500';
  }
}

/**
 * Save Current Settings to LocalStorage
 * @param {string|null} contextName - Optional specific domain/tab name for the confirmation toast
 * @param {boolean} showFeedbackToast - Whether to trigger a toast notification (defaults to true)
 */
function saveCurrentSettings(contextName = null, showFeedbackToast = true) {
  const settings = {
    // 1. Teacher Notifications
    notifyExcuseSlip: getCheckboxState('settingNotifyExcuseSlip', true),
    notifyConsecutiveCuts: getCheckboxState('settingNotifyConsecutiveCuts', true),
    notifyClassReminder: getCheckboxState('settingNotifyClassReminder', true),
    notifySessionReminder: getCheckboxState('settingNotifySessionReminder', true),
    notifyParentSms: getCheckboxState('settingNotifyParentSms', false),

    // 2. In-Browser QR Scanner
    qrChime: getCheckboxState('settingQrChime', true),
    qrVibrate: getCheckboxState('settingQrVibrate', true),
    qrCooldown: getInputValue('settingQrCooldown', '3')
  };

  try {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    updateConfigurationSnapshot(settings);

    if (showFeedbackToast) {
      const message = contextName 
        ? `${contextName} preferences saved successfully.`
        : 'All faculty preferences have been updated.';
      showToast('Settings Saved', message, 'success');
    }
  } catch (err) {
    console.error('Failed to save faculty settings to localStorage:', err);
    if (showFeedbackToast) {
      showToast('Storage Error', 'Could not save settings to local storage.', 'error');
    }
  }
}

/**
 * Save settings trigger called from within individual tab panels
 * @param {string} panelName
 */
function saveSettingsFromPanel(panelName) {
  saveCurrentSettings(panelName, true);
}

/**
 * Reset Settings to Default
 */
function resetSettingsToDefault() {
  try {
    localStorage.removeItem(SETTINGS_STORAGE_KEY);
    loadAndApplySettings();
    showToast('Defaults Restored', 'All faculty preferences have been reset to system defaults.', 'info');
  } catch (err) {
    console.error('Failed to reset settings:', err);
    showToast('Error', 'Failed to reset settings to defaults.', 'error');
  }
}

/**
 * Bind Action Button Listeners
 */
function bindSettingsEvents() {
  // Auto-save on change so changes made to toggles or dropdowns take effect immediately
  const interactiveSettingIds = [
    'settingNotifyExcuseSlip',
    'settingNotifyConsecutiveCuts',
    'settingNotifyClassReminder',
    'settingNotifySessionReminder',
    'settingNotifyParentSms',
    'settingQrChime',
    'settingQrVibrate',
    'settingQrCooldown'
  ];

  interactiveSettingIds.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('change', () => {
        saveCurrentSettings(null, false);
      });
    }
  });

  // Topbar and Card Save Buttons (if present in DOM)
  const btnSaveTop = document.getElementById('btnSaveAllSettings');
  if (btnSaveTop) {
    btnSaveTop.addEventListener('click', () => saveCurrentSettings(null, true));
  }

  const btnSaveCard = document.getElementById('cardBtnSaveSettings');
  if (btnSaveCard) {
    btnSaveCard.addEventListener('click', () => saveCurrentSettings(null, true));
  }

  // Reset Defaults Button (Aligned with Tabs Navigation)
  const btnResetTop = document.getElementById('btnResetDefaultSettings');
  if (btnResetTop) {
    btnResetTop.addEventListener('click', resetSettingsToDefault);
  }

  const btnResetCard = document.getElementById('cardBtnResetSettings');
  if (btnResetCard) {
    btnResetCard.addEventListener('click', resetSettingsToDefault);
  }

  // Bind avatar file input for interactive preview
  const avatarInput = document.getElementById('avatarFileInput');
  if (avatarInput) {
    avatarInput.addEventListener('change', (e) => {
      const file = e.target.files?.[0];
      if (!file) return;

      if (!file.type.startsWith('image/')) {
        showToast('Invalid File', 'Please select a valid image file.', 'warning');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const avatarPreview = document.getElementById('profileAvatarPreview');
        if (avatarPreview) {
          avatarPreview.innerHTML = `<img src="${event.target.result}" alt="Faculty Photo" class="w-full h-full object-cover">`;
        }
        showToast('Photo Updated', 'Faculty photo preview updated.', 'success');
      };
      reader.readAsDataURL(file);
    });
  }

  // Test Camera Audio Chime Button
  const btnTestBeep = document.getElementById('btnTestScannerBeep');
  if (btnTestBeep) {
    btnTestBeep.addEventListener('click', () => {
      playScannerBeep();
      showToast('Audio Chime Test', 'Dual-tone chime synthesized via Web Audio API.', 'info', 2500);
    });
  }
}

/**
 * Synthesize Dual-Tone Scanner Beep via native Web Audio API
 */
function playScannerBeep() {
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    const now = ctx.currentTime;

    // First tone (C5 ~ 523.25 Hz)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(523.25, now);
    gain1.gain.setValueAtTime(0.2, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.09);

    // Second tone (G5 ~ 783.99 Hz)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(783.99, now + 0.1);
    gain2.gain.setValueAtTime(0.25, now + 0.1);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.1);
    osc2.stop(now + 0.22);
  } catch (err) {
    console.warn('Web Audio API unavailable or blocked by browser policy:', err);
  }
}

/**
 * Form Value Helpers
 */
function setInputValue(id, val) {
  const el = document.getElementById(id);
  if (el && val !== undefined) el.value = val;
}

function getInputValue(id, fallback = '') {
  const el = document.getElementById(id);
  return el ? el.value : fallback;
}

function setCheckboxState(id, checked) {
  const el = document.getElementById(id);
  if (el) el.checked = Boolean(checked);
}

function getCheckboxState(id, fallback = false) {
  const el = document.getElementById(id);
  return el ? el.checked : fallback;
}

/**
 * Toast Notification Utility
 * Standardized to match Reports & Export UI design exactly
 */
function showToast(title, message = '', type = 'info', duration = 4000) {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'pointer-events-auto flex items-start gap-3 p-4 rounded-xl bg-white border border-[#e5e7eb] shadow-xl text-xs max-w-sm w-full transition-all transform duration-300 translate-y-4 opacity-0';

  let iconBg = 'bg-blue-50 text-[#0030c2] border border-blue-200';
  let iconSvg = '<svg class="w-4 h-4 text-[#0030c2]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" /></svg>';

  if (type === 'success') {
    iconBg = 'bg-[#f0fdf4] text-[#16a34a] border border-[#bbf7d0]';
    iconSvg = '<svg class="w-4 h-4 text-[#16a34a]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>';
  } else if (type === 'error') {
    iconBg = 'bg-red-50 text-red-600 border border-red-200';
    iconSvg = '<svg class="w-4 h-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>';
  } else if (type === 'warning') {
    iconBg = 'bg-[#fffbeb] text-[#d97706] border border-[#fde68a]';
    iconSvg = '<svg class="w-4 h-4 text-[#d97706]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>';
  }

  toast.innerHTML = `
    <div class="w-8 h-8 rounded-lg ${iconBg} flex items-center justify-center shrink-0 mt-0.5">
      ${iconSvg}
    </div>
    <div class="flex-1 min-w-0">
      <h4 class="font-bold text-[#111827] text-xs leading-tight">${title}</h4>
      ${message ? `<p class="text-[11px] text-[#6b7280] mt-0.5 leading-snug">${message}</p>` : ''}
    </div>
    <button type="button" class="toast-close-btn text-gray-400 hover:text-gray-600 p-1 rounded-md hover:bg-gray-100 cursor-pointer shrink-0 transition-colors ml-auto">
      <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  `;

  const closeBtn = toast.querySelector('.toast-close-btn');
  let isDismissed = false;
  const dismiss = () => {
    if (isDismissed) return;
    isDismissed = true;
    toast.classList.remove('translate-y-0', 'opacity-100');
    toast.classList.add('translate-y-4', 'opacity-0');
    setTimeout(() => {
      if (toast.parentNode) toast.remove();
    }, 300);
  };

  if (closeBtn) {
    closeBtn.addEventListener('click', dismiss);
  }

  container.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.remove('translate-y-4', 'opacity-0');
    toast.classList.add('translate-y-0', 'opacity-100');
  });

  setTimeout(dismiss, duration);
}
