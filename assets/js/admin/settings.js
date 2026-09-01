// assets/js/admin/settings.js
// Clean System Settings & Configuration Controller

const DEFAULT_SETTINGS = {
  general: {
    schoolName: 'Bestlink College of the Philippines',
    schoolStart: '07:00',
    schoolEnd: '17:00'
  },
  attendance: {
    presentCutoff: '07:15',
    lateCutoff: '09:00',
    lateThreshold: 15,
    autoAbsent: true
  },
  scanning: {
    enableRfid: true,
    enableQr: true,
    qrExpiration: 60
  },
  notifications: {
    enableSms: true,
    enableEmail: true,
    ruleSmsTimeIn: true,
    ruleSmsTardy: true,
    ruleSmsAbsent: true,
    ruleSmsTimeOut: true
  }
};

document.addEventListener('DOMContentLoaded', () => {
  console.log('⚙️ System Settings Module Initialized');
  initCurrentDate();
  loadAdminSession();
  initLogoPreviewListener();
  loadSettings();
});

function initCurrentDate() {
  const el = document.getElementById('currentDateLabel');
  if (el) {
    const now = new Date();
    const options = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' };
    el.textContent = now.toLocaleDateString('en-US', options);
  }
}

function loadAdminSession() {
  try {
    const raw = localStorage.getItem('currentUser');
    const user = raw ? JSON.parse(raw) : null;
    const elTopbarName = document.getElementById('topbarAdminName');
    if (elTopbarName) {
      let name = user?.name;
      if (!name || name === 'System Administrator') name = 'Admin User';
      elTopbarName.textContent = name;
    }
  } catch (e) {
    console.error('Error loading session:', e);
  }
}

function initLogoPreviewListener() {
  const input = document.getElementById('schoolLogoInput');
  const preview = document.getElementById('schoolLogoPreview');
  if (input && preview) {
    input.addEventListener('change', (e) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (evt) => {
          preview.src = evt.target.result;
        };
        reader.readAsDataURL(file);
      }
    });
  }
}

function loadSettings() {
  try {
    const raw = localStorage.getItem('systemSettings');
    const cfg = raw ? JSON.parse(raw) : DEFAULT_SETTINGS;

    // 1. General
    const gen = cfg.general || DEFAULT_SETTINGS.general;
    setVal('settingSchoolName', gen.schoolName);
    setVal('settingSchoolStart', gen.schoolStart);
    setVal('settingSchoolEnd', gen.schoolEnd);

    // 2. Attendance
    const att = cfg.attendance || DEFAULT_SETTINGS.attendance;
    setVal('settingPresentCutoff', att.presentCutoff);
    setVal('settingLateCutoff', att.lateCutoff);
    setVal('settingLateThreshold', att.lateThreshold);
    setChecked('settingAutoAbsent', att.autoAbsent);

    // 3. Scanning
    const scn = cfg.scanning || DEFAULT_SETTINGS.scanning;
    setChecked('settingEnableRfid', scn.enableRfid);
    setChecked('settingEnableQr', scn.enableQr);
    setVal('settingQrExpiration', scn.qrExpiration);

    // 4. Notifications
    const notif = cfg.notifications || DEFAULT_SETTINGS.notifications;
    setChecked('settingEnableSms', notif.enableSms);
    setChecked('settingEnableEmail', notif.enableEmail);
    setChecked('ruleSmsTimeIn', notif.ruleSmsTimeIn);
    setChecked('ruleSmsTardy', notif.ruleSmsTardy);
    setChecked('ruleSmsAbsent', notif.ruleSmsAbsent);
    setChecked('ruleSmsTimeOut', notif.ruleSmsTimeOut);

  } catch (e) {
    console.error('Error loading settings:', e);
  }
}

function setVal(id, val) {
  const el = document.getElementById(id);
  if (el && val !== undefined) el.value = val;
}

function setChecked(id, val) {
  const el = document.getElementById(id);
  if (el && val !== undefined) el.checked = Boolean(val);
}

window.saveAllSettings = function() {
  const data = {
    general: {
      schoolName: document.getElementById('settingSchoolName')?.value?.trim() || 'Bestlink College of the Philippines',
      schoolStart: document.getElementById('settingSchoolStart')?.value || '07:00',
      schoolEnd: document.getElementById('settingSchoolEnd')?.value || '17:00'
    },
    attendance: {
      presentCutoff: document.getElementById('settingPresentCutoff')?.value || '07:15',
      lateCutoff: document.getElementById('settingLateCutoff')?.value || '09:00',
      lateThreshold: parseInt(document.getElementById('settingLateThreshold')?.value || '15', 10),
      autoAbsent: document.getElementById('settingAutoAbsent')?.checked ?? true
    },
    scanning: {
      enableRfid: document.getElementById('settingEnableRfid')?.checked ?? true,
      enableQr: document.getElementById('settingEnableQr')?.checked ?? true,
      qrExpiration: parseInt(document.getElementById('settingQrExpiration')?.value || '60', 10)
    },
    notifications: {
      enableSms: document.getElementById('settingEnableSms')?.checked ?? true,
      enableEmail: document.getElementById('settingEnableEmail')?.checked ?? true,
      ruleSmsTimeIn: document.getElementById('ruleSmsTimeIn')?.checked ?? true,
      ruleSmsTardy: document.getElementById('ruleSmsTardy')?.checked ?? true,
      ruleSmsAbsent: document.getElementById('ruleSmsAbsent')?.checked ?? true,
      ruleSmsTimeOut: document.getElementById('ruleSmsTimeOut')?.checked ?? true
    }
  };

  try {
    localStorage.setItem('systemSettings', JSON.stringify(data));
    showToast('System configuration saved successfully.', 'success');
  } catch (e) {
    console.error('Error saving settings:', e);
    showToast('Error saving settings.', 'error');
  }
};

window.handleBackupDatabase = function() {
  const backupData = {
    system: 'Bestlink College of the Philippines AMS',
    exportedAt: new Date().toISOString(),
    settings: JSON.parse(localStorage.getItem('systemSettings') || JSON.stringify(DEFAULT_SETTINGS))
  };

  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backupData, null, 2));
  const downloadAnchor = document.createElement('a');
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', `bcp_ams_backup_${dateStr}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();

  showToast('Database snapshot downloaded successfully.', 'success');
};

window.handleRestoreDatabase = function(event) {
  const file = event.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const parsed = JSON.parse(e.target.result);
      if (parsed.settings) {
        localStorage.setItem('systemSettings', JSON.stringify(parsed.settings));
        loadSettings();
      }
      showToast(`Database backup "${file.name}" restored successfully.`, 'success');
    } catch (err) {
      showToast('Invalid backup file format.', 'error');
    }
  };
  reader.readAsText(file);
};

window.exportAuditLogs = function() {
  const csvContent = 'data:text/csv;charset=utf-8,Timestamp,Actor,Description,Status\n' +
    '"07:15 AM","Admin User","Login Authenticated","Success"\n' +
    '"07:35 AM","Mrs. Dela Cruz","Attendance Correction","Updated"\n' +
    '"08:00 AM","System Daemon","RFID Token Sync","Synced"';

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `audit_logs_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  link.remove();

  showToast('Audit logs exported as CSV successfully.', 'success');
};

function showToast(message, type = 'success') {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'pointer-events-auto bg-white border border-[#e5e7eb] shadow-xl rounded-xl p-3 flex items-center gap-3 min-w-[260px] max-w-sm transition-all duration-300 transform translate-x-0';

  const isSuccess = type === 'success' || type === false;
  const isError = type === 'error' || type === true;
  
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

window.showToast = showToast;
