/**
 * Attendance Monitoring System - Student Portal
 * notifications.js - Activity & Notifications Feed
 */

document.addEventListener('DOMContentLoaded', () => {
  initCurrentDate();
  initNotificationsModule();
});

// State Store
let activeCategory = 'all';
let searchQuery = '';
let showUnreadOnly = false;
let currentPage = 1;
const pageSize = 6;

// Sample Activity Feed Notifications Data
let notificationsData = [
  {
    id: 'notif-demo-check',
    category: 'scans',
    title: 'RFID Gate Time-In Verified',
    message: 'Tap confirmed at Gate 1 Main Entrance Turnstile A. Official attendance recorded on-time for today.',
    timestamp: '2026-09-12T07:15:00',
    relativeTime: 'Just now',
    unread: true,
    meta: {
      location: 'Gate 1 Turnstile A',
      status: 'On-Time (Present)',
      checkpoint: 'ESP32 RFID Reader #01'
    },
    action: {
      label: 'View Attendance',
      url: 'my-attendance.html',
      type: 'primary'
    }
  },
  {
    id: 'notif-1',
    category: 'scans',
    title: 'RFID Gate Time-In Recorded',
    message: 'Your physical RFID card tap was successfully verified at Gate 1 Main Entrance turnstile checkpoint.',
    timestamp: '2026-09-10T07:18:00',
    relativeTime: '12 mins ago',
    unread: true,
    meta: {
      location: 'Gate 1 Turnstile A',
      status: 'On-Time (Present)',
      checkpoint: 'ESP32 RFID Reader #01'
    },
    action: {
      label: 'View Attendance',
      url: 'my-attendance.html',
      type: 'primary'
    }
  },
  {
    id: 'notif-2',
    category: 'warnings',
    title: 'Tardiness Warning Flagged',
    message: 'You were marked Late (+18 mins delay) during daily roll call for CS201 (Data Structures and Algorithms).',
    timestamp: '2026-09-09T08:18:00',
    relativeTime: 'Yesterday, 8:18 AM',
    unread: true,
    meta: {
      subject: 'CS201 - Data Structures',
      teacher: 'Prof. Mark Ramirez',
      delay: '+18 mins late'
    },
    action: {
      label: 'Submit Excuse Slip',
      url: 'excuse-slip/submit-excuse.html',
      type: 'warning'
    }
  },
  {
    id: 'notif-3',
    category: 'warnings',
    title: 'Unexcused Absence & Parent SMS Dispatched',
    message: 'An unexcused absence was recorded in IT302. An automated SMS advisory was successfully dispatched to your registered parent/guardian (+63 917-***-5678).',
    timestamp: '2026-09-08T10:30:00',
    relativeTime: '2 days ago',
    unread: true,
    meta: {
      subject: 'IT302 - Database Systems 2',
      teacher: 'Prof. Maria Santos',
      dispatchStatus: 'Delivered to Guardian'
    },
    action: {
      label: 'File Excuse Slip Now',
      url: 'excuse-slip/submit-excuse.html',
      type: 'danger'
    }
  },
  {
    id: 'notif-4',
    category: 'excuse',
    title: 'Excuse Slip Approved',
    message: 'Your excuse request for Sept 02 (Medical Consultation) has been APPROVED by Prof. Maria Santos. Daily roll call status updated to Excused.',
    timestamp: '2026-09-07T14:45:00',
    relativeTime: '3 days ago',
    unread: true,
    meta: {
      subject: 'IT301 - Web Development',
      decision: 'Approved by Faculty',
      absenceDate: 'Sept 02, 2026'
    },
    action: {
      label: 'View in My Requests',
      url: 'excuse-slip/my-requests.html',
      type: 'success'
    }
  },
  {
    id: 'notif-5',
    category: 'scans',
    title: 'Classroom Dynamic QR Verified',
    message: 'Your encrypted dynamic QR code was verified at the classroom camera scanner for IT301.',
    timestamp: '2026-09-07T07:35:00',
    relativeTime: '3 days ago',
    unread: false,
    meta: {
      subject: 'IT301 - Web Development',
      teacher: 'Prof. Maria Santos',
      room: 'Computer Lab 3'
    },
    action: {
      label: 'View Scan Logs',
      url: 'my-attendance.html',
      type: 'neutral'
    }
  },
  {
    id: 'notif-6',
    category: 'warnings',
    title: '3-Late Accumulation Warning',
    message: 'Academic Policy Notice: You have accumulated 3 late arrivals in CS201. Under institutional guidelines, 3 tardies are recorded as 1 unexcused absence.',
    timestamp: '2026-09-05T11:00:00',
    relativeTime: '5 days ago',
    unread: false,
    meta: {
      subject: 'CS201 - Data Structures',
      policy: '3 Lates = 1 Absence Conversion',
      currentCount: '3 Tardies'
    },
    action: {
      label: 'Review Tardy Records',
      url: 'tardy-and-absence/tardy-records.html',
      type: 'warning'
    }
  },
  {
    id: 'notif-7',
    category: 'excuse',
    title: 'Excuse Slip Rejected with Remarks',
    message: 'Your excuse slip submission for Aug 28 was returned with feedback: "Missing doctor\'s official prescription or clinic diagnosis note."',
    timestamp: '2026-09-04T16:20:00',
    relativeTime: '6 days ago',
    unread: false,
    meta: {
      subject: 'CS201 - Data Structures',
      reviewer: 'Prof. Mark Ramirez',
      status: 'Rejected / Incomplete Proof'
    },
    action: {
      label: 'View Remarks & Re-submit',
      url: 'excuse-slip/my-requests.html',
      type: 'danger'
    }
  },
  {
    id: 'notif-8',
    category: 'advisories',
    title: 'Institutional Advisory: Midterm Attendance Guidelines',
    message: 'The Office of Academic Affairs reminds all students that attendance checkpoints will be strictly audited during the upcoming Midterm Examination week.',
    timestamp: '2026-09-03T09:00:00',
    relativeTime: '1 week ago',
    unread: false,
    meta: {
      issuer: 'Office of Academic Affairs',
      scope: 'Campus-wide BSIT / BSCS'
    }
  },
  {
    id: 'notif-9',
    category: 'scans',
    title: 'RFID Gate Checkpoint Time-In',
    message: 'Time-In verified at Gate 1 Main Entrance. Recorded at 07:15 AM.',
    timestamp: '2026-09-03T07:15:00',
    relativeTime: '1 week ago',
    unread: false,
    meta: {
      location: 'Gate 1 Turnstile B',
      status: 'On-Time (Present)'
    },
    action: {
      label: 'View Attendance',
      url: 'my-attendance.html',
      type: 'neutral'
    }
  },
  {
    id: 'notif-10',
    category: 'scans',
    title: 'Classroom QR Verified: IT401 Capstone',
    message: 'Your personal dynamic QR code scan was recorded and validated by Dr. Robert Garcia for IT401 Capstone Project.',
    timestamp: '2026-09-02T13:02:00',
    relativeTime: '1 week ago',
    unread: false,
    meta: {
      subject: 'IT401 - Capstone Project',
      teacher: 'Dr. Robert Garcia',
      room: 'Multimedia Room 4'
    },
    action: {
      label: 'View Record',
      url: 'my-attendance.html',
      type: 'neutral'
    }
  },
  {
    id: 'notif-11',
    category: 'excuse',
    title: 'Excuse Slip Submission Logged',
    message: 'Your excuse slip submission for Sept 02 has been successfully routed to Prof. Maria Santos for review.',
    timestamp: '2026-09-02T10:15:00',
    relativeTime: '1 week ago',
    unread: false,
    meta: {
      referenceId: 'EXC-2026-0902-004',
      status: 'Pending Faculty Review'
    },
    action: {
      label: 'Track Status',
      url: 'excuse-slip/my-requests.html',
      type: 'neutral'
    }
  },
  {
    id: 'notif-12',
    category: 'advisories',
    title: 'Suspension of Classes & Attendance Waived',
    message: 'Due to severe weather advisory, afternoon classes and on-campus attendance logging were officially suspended by College Administration.',
    timestamp: '2026-09-01T11:45:00',
    relativeTime: '9 days ago',
    unread: false,
    meta: {
      issuer: 'College Administration & Disaster Risk Office',
      scope: 'All Campuses'
    }
  },
  {
    id: 'notif-13',
    category: 'scans',
    title: 'Gate RFID Time-Out Logged',
    message: 'Official departure tap recorded at Gate 2 Exit Turnstile at 05:08 PM.',
    timestamp: '2026-08-31T17:08:00',
    relativeTime: '10 days ago',
    unread: false,
    meta: {
      location: 'Gate 2 Exit Turnstile',
      status: 'Departure Logged'
    }
  },
  {
    id: 'notif-14',
    category: 'scans',
    title: 'Gate RFID Time-In Logged',
    message: 'Arrival tap verified at Gate 1 Main Entrance at 07:20 AM.',
    timestamp: '2026-08-31T07:20:00',
    relativeTime: '10 days ago',
    unread: false,
    meta: {
      location: 'Gate 1 Turnstile A',
      status: 'On-Time (Present)'
    }
  }
];

/**
 * Initialize current date in top bar (Matches other student pages)
 */
function initCurrentDate() {
  const dateLabel = document.getElementById('currentDateLabel');
  if (dateLabel) {
    const today = new Date();
    const dayOfWeek = today.toLocaleDateString('en-US', { weekday: 'long' });
    const monthDayYear = today.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    dateLabel.textContent = `${monthDayYear} (${dayOfWeek})`;
  }
}

const NOTIF_STORAGE_KEY = 'student_portal_notifications';

/**
 * Sync unread states from localStorage
 */
function syncFromLocalStorage() {
  try {
    const raw = localStorage.getItem(NOTIF_STORAGE_KEY);
    if (raw) {
      const stored = JSON.parse(raw);
      stored.forEach(sItem => {
        const match = notificationsData.find(n => n.id === sItem.id);
        if (match) {
          match.unread = !!sItem.unread;
        }
      });
    } else {
      syncToLocalStorage();
    }
  } catch (e) {
    console.warn('Error reading notifications from localStorage:', e);
  }
}

/**
 * Persist unread states to localStorage
 */
function syncToLocalStorage() {
  try {
    const raw = localStorage.getItem(NOTIF_STORAGE_KEY);
    if (raw) {
      const stored = JSON.parse(raw);
      stored.forEach(sItem => {
        const match = notificationsData.find(n => n.id === sItem.id);
        if (match) {
          sItem.unread = !!match.unread;
        }
      });
      localStorage.setItem(NOTIF_STORAGE_KEY, JSON.stringify(stored));
    }
  } catch (e) {
    console.warn('Error syncing notifications to localStorage:', e);
  }
}

// Global hook for notifications-flyout.js
window.onNotificationStateChanged = function () {
  syncFromLocalStorage();
  updateCounts();
  renderNotifications();
};

/**
 * Initialize Module
 */
function initNotificationsModule() {
  syncFromLocalStorage();
  updateCounts();
  renderNotifications();
  setupEventListeners();
}

/**
 * Update Counter Badges and Metrics
 */
function updateCounts() {
  const totalCount = notificationsData.length;
  const unreadCount = notificationsData.filter(n => n.unread).length;
  const scanCount = notificationsData.filter(n => n.category === 'scans').length;
  const warningCount = notificationsData.filter(n => n.category === 'warnings').length;
  const excuseCount = notificationsData.filter(n => n.category === 'excuse').length;
  const advisoryCount = notificationsData.filter(n => n.category === 'advisories').length;

  // Topbar bell badge
  const topbarBadge = document.getElementById('topbarNotifBadge');
  if (topbarBadge) {
    if (unreadCount > 0) {
      topbarBadge.textContent = unreadCount;
      topbarBadge.classList.remove('hidden');
      topbarBadge.style.display = 'flex';
    } else {
      topbarBadge.textContent = '';
      topbarBadge.classList.add('hidden');
      topbarBadge.style.display = 'none';
    }
  }

  // 5 Stat Cards
  const statTotal = document.getElementById('statTotalNotifs');
  if (statTotal) statTotal.textContent = totalCount;

  const statUnread = document.getElementById('statUnreadNotifs');
  if (statUnread) statUnread.textContent = unreadCount;

  const statScans = document.getElementById('statScanNotifs');
  if (statScans) statScans.textContent = scanCount;

  const statWarnings = document.getElementById('statWarningNotifs');
  if (statWarnings) statWarnings.textContent = warningCount;

  const statExcuse = document.getElementById('statExcuseNotifs');
  if (statExcuse) statExcuse.textContent = excuseCount;

  // Header Table card badges
  const notifCountBadge = document.getElementById('notifCountBadge');
  if (notifCountBadge) notifCountBadge.textContent = `${totalCount} Logs`;

  const unreadCountBadge = document.getElementById('unreadCountBadge');
  if (unreadCountBadge) {
    if (unreadCount === 0) {
      unreadCountBadge.textContent = '';
      unreadCountBadge.classList.add('hidden');
      unreadCountBadge.style.display = 'none';
    } else {
      unreadCountBadge.textContent = `${unreadCount} Unread`;
      unreadCountBadge.classList.remove('hidden');
      unreadCountBadge.style.display = 'inline-flex';
    }
  }

  // Category Tabs Count Badges
  const tabAll = document.getElementById('tabCountAll');
  if (tabAll) tabAll.textContent = `(${totalCount})`;

  const tabScans = document.getElementById('tabCountScans');
  if (tabScans) tabScans.textContent = `(${scanCount})`;

  const tabWarnings = document.getElementById('tabCountWarnings');
  if (tabWarnings) tabWarnings.textContent = `(${warningCount})`;

  const tabExcuse = document.getElementById('tabCountExcuse');
  if (tabExcuse) tabExcuse.textContent = `(${excuseCount})`;

  const tabAdvisories = document.getElementById('tabCountAdvisories');
  if (tabAdvisories) tabAdvisories.textContent = `(${advisoryCount})`;
}

/**
 * Filter Notifications by Category
 */
window.filterNotifications = function (category) {
  activeCategory = category;
  currentPage = 1;

  // Update tab visual active state
  const tabs = document.querySelectorAll('#categoryTabs .notif-tab');
  tabs.forEach(tab => {
    const tabCat = tab.getAttribute('data-category');
    const badge = tab.querySelector('span:last-child');
    if (tabCat === category) {
      tab.className = 'notif-tab active flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#0030c2] text-white transition-colors whitespace-nowrap cursor-pointer shadow-2xs';
      if (badge) badge.className = 'text-[11px] opacity-80';
    } else {
      tab.className = 'notif-tab flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg text-[#6b7280] hover:bg-white hover:text-[#111827] border border-transparent hover:border-[#e5e7eb] transition-all whitespace-nowrap cursor-pointer';
      if (badge) badge.className = 'text-[11px] text-[#9ca3af]';
    }
  });

  renderNotifications();
};

/**
 * Toggle Unread Only Filter
 */
window.toggleUnreadFilter = function () {
  showUnreadOnly = !showUnreadOnly;
  currentPage = 1;

  const toggleBtn = document.getElementById('toggleUnreadBtn');
  const toggleDot = document.getElementById('unreadToggleDot');
  const toggleText = document.getElementById('unreadToggleText');

  if (showUnreadOnly) {
    toggleBtn.className = 'flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#0030c2] bg-[#eff6ff] border border-[#bfdbfe] rounded-lg transition-colors cursor-pointer shadow-2xs';
    toggleDot.className = 'w-2 h-2 rounded-full bg-[#0030c2] animate-pulse';
    toggleText.textContent = 'Showing Unread';
  } else {
    toggleBtn.className = 'flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#374151] bg-white border border-[#e5e7eb] hover:bg-gray-50 rounded-lg transition-colors cursor-pointer shadow-2xs';
    toggleDot.className = 'w-2 h-2 rounded-full bg-gray-400';
    toggleText.textContent = 'Unread Only';
  }

  renderNotifications();
};

/**
 * Handle Search Input
 */
window.handleNotifSearch = function (query) {
  searchQuery = (query || '').trim().toLowerCase();
  currentPage = 1;
  renderNotifications();
};

/**
 * Reset Filters
 */
window.resetFilters = function () {
  activeCategory = 'all';
  searchQuery = '';
  showUnreadOnly = false;
  currentPage = 1;

  const searchInput = document.getElementById('notifSearchInput');
  if (searchInput) searchInput.value = '';

  const toggleBtn = document.getElementById('toggleUnreadBtn');
  const toggleDot = document.getElementById('unreadToggleDot');
  const toggleText = document.getElementById('unreadToggleText');
  if (toggleBtn) toggleBtn.className = 'flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#374151] bg-white border border-[#e5e7eb] hover:bg-gray-50 rounded-lg transition-colors cursor-pointer shadow-2xs';
  if (toggleDot) toggleDot.className = 'w-2 h-2 rounded-full bg-gray-400';
  if (toggleText) toggleText.textContent = 'Unread Only';

  window.filterNotifications('all');
};

/**
 * Mark single notification as read
 */
window.markNotificationAsRead = function (notifId, event) {
  if (event) event.stopPropagation();

  const item = notificationsData.find(n => n.id === notifId);
  if (item && item.unread) {
    item.unread = false;
    syncToLocalStorage();
    updateCounts();
    renderNotifications();
    if (window.updateFlyoutBadges) window.updateFlyoutBadges();
    showToast('Notification marked as read', 'info');
  }
};

/**
 * Mark all notifications as read
 */
window.markAllNotificationsAsRead = function () {
  const unreadCount = notificationsData.filter(n => n.unread).length;
  if (unreadCount === 0) {
    showToast('All notifications are already read', 'info');
    return;
  }

  notificationsData.forEach(n => {
    n.unread = false;
  });

  syncToLocalStorage();
  updateCounts();
  renderNotifications();
  if (window.updateFlyoutBadges) window.updateFlyoutBadges();
  showToast('All notifications marked as read', 'success');
};

/**
 * Render the Notifications Feed with Pagination
 */
function renderNotifications() {
  const container = document.getElementById('notificationFeedList');
  const emptyState = document.getElementById('notifEmptyState');
  if (!container) return;

  // Filter list
  let filtered = notificationsData.filter(item => {
    // Unread filter
    if (showUnreadOnly && !item.unread) {
      return false;
    }
    // Category filter
    if (activeCategory !== 'all' && item.category !== activeCategory) {
      return false;
    }
    // Search filter
    if (searchQuery) {
      const titleMatch = item.title.toLowerCase().includes(searchQuery);
      const msgMatch = item.message.toLowerCase().includes(searchQuery);
      const metaValues = Object.values(item.meta || {}).join(' ').toLowerCase();
      const metaMatch = metaValues.includes(searchQuery);
      return titleMatch || msgMatch || metaMatch;
    }
    return true;
  });

  const totalFiltered = filtered.length;

  // Handle empty state
  if (totalFiltered === 0) {
    container.innerHTML = '';
    if (emptyState) {
      emptyState.classList.remove('hidden');
      const emptyMsg = document.getElementById('emptyStateMessage');
      if (emptyMsg) {
        if (searchQuery) {
          emptyMsg.textContent = `No notifications found matching "${searchQuery}". Try searching with different keywords.`;
        } else if (showUnreadOnly) {
          emptyMsg.textContent = `You have no unread notifications in this category.`;
        } else {
          emptyMsg.textContent = `There are currently no notifications in the "${getCategoryTitle(activeCategory)}" category.`;
        }
      }
    }
    updatePagination(0, 0);
    return;
  }

  if (emptyState) emptyState.classList.add('hidden');

  // Pagination slice
  const totalPages = Math.ceil(totalFiltered / pageSize) || 1;
  if (currentPage > totalPages) currentPage = totalPages;

  const startIndex = (currentPage - 1) * pageSize;
  const paginatedItems = filtered.slice(startIndex, startIndex + pageSize);

  // Render cards
  container.innerHTML = paginatedItems.map(item => generateFeedRowHTML(item)).join('');

  updatePagination(totalFiltered, paginatedItems.length);
}

/**
 * Update Pagination Controls
 */
function updatePagination(totalCount, currentRenderCount) {
  const pageShowingCount = document.getElementById('pageShowingCount');
  const pageTotalCount = document.getElementById('pageTotalCount');
  const prevBtn = document.getElementById('prevPageBtn');
  const nextBtn = document.getElementById('nextPageBtn');
  const paginationNumbers = document.getElementById('paginationNumbers');

  if (pageShowingCount) pageShowingCount.textContent = currentRenderCount;
  if (pageTotalCount) pageTotalCount.textContent = totalCount;

  const totalPages = Math.ceil(totalCount / pageSize) || 1;

  if (prevBtn) prevBtn.disabled = currentPage <= 1;
  if (nextBtn) nextBtn.disabled = currentPage >= totalPages;

  if (paginationNumbers) {
    let html = '';
    for (let i = 1; i <= totalPages; i++) {
      if (i === currentPage) {
        html += `<button class="w-7 h-7 flex items-center justify-center rounded-lg bg-[#0030c2] text-white font-bold text-xs shadow-2xs">${i}</button>`;
      } else {
        html += `<button onclick="goToPage(${i})" class="w-7 h-7 flex items-center justify-center rounded-lg border border-[#e5e7eb] hover:bg-gray-50 text-[#374151] font-semibold text-xs transition-colors cursor-pointer">${i}</button>`;
      }
    }
    paginationNumbers.innerHTML = html;
  }
}

window.goToPreviousPage = function () {
  if (currentPage > 1) {
    currentPage--;
    renderNotifications();
  }
};

window.goToNextPage = function () {
  const totalPages = Math.ceil(notificationsData.length / pageSize);
  if (currentPage < totalPages) {
    currentPage++;
    renderNotifications();
  }
};

window.goToPage = function (pageNum) {
  currentPage = pageNum;
  renderNotifications();
};

/**
 * Category Helper
 */
function getCategoryTitle(cat) {
  switch (cat) {
    case 'scans': return 'Gate & Scans';
    case 'warnings': return 'Warnings & Policies';
    case 'excuse': return 'Excuse Slips';
    case 'advisories': return 'Campus Advisories';
    default: return 'All';
  }
}

/**
 * Generate Feed Item HTML (Clean Activity Timeline Style)
 */
function generateFeedRowHTML(item) {
  const unreadBorder = item.unread
    ? 'border-l-4 border-l-[#0030c2] bg-[#f8faff]'
    : 'border-l-4 border-l-transparent bg-white hover:bg-gray-50/50';

  // Category Icon & Badge Styling
  let iconBox = 'w-10 h-10 rounded-xl bg-[#f0fdf4] text-[#16a34a] border border-[#bbf7d0]/60';
  let categoryBadge = 'bg-emerald-50 text-emerald-700 border-emerald-200';
  let categoryLabel = 'Gate Check-in';
  let iconSVG = `
    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.75">
      <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>`;

  if (item.category === 'warnings') {
    if (item.title.toLowerCase().includes('absence')) {
      iconBox = 'w-10 h-10 rounded-xl bg-[#fef2f2] text-[#dc2626] border border-[#fecaca]/60';
      categoryBadge = 'bg-rose-50 text-rose-700 border-rose-200';
      categoryLabel = 'Absence Alert';
      iconSVG = `
        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.75">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
        </svg>`;
    } else {
      iconBox = 'w-10 h-10 rounded-xl bg-[#fff7ed] text-[#f97316] border border-[#fed7aa]/60';
      categoryBadge = 'bg-amber-50 text-amber-700 border-amber-200';
      categoryLabel = 'Tardy Warning';
      iconSVG = `
        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.75">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>`;
    }
  } else if (item.category === 'excuse') {
    if (item.title.toLowerCase().includes('approved')) {
      iconBox = 'w-10 h-10 rounded-xl bg-[#eff6ff] text-[#0030c2] border border-[#bfdbfe]/60';
      categoryBadge = 'bg-blue-50 text-blue-700 border-blue-200';
      categoryLabel = 'Excuse Approved';
      iconSVG = `
        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.75">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>`;
    } else if (item.title.toLowerCase().includes('rejected')) {
      iconBox = 'w-10 h-10 rounded-xl bg-[#fef2f2] text-[#dc2626] border border-[#fecaca]/60';
      categoryBadge = 'bg-rose-50 text-rose-700 border-rose-200';
      categoryLabel = 'Excuse Rejected';
      iconSVG = `
        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.75">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>`;
    } else {
      iconBox = 'w-10 h-10 rounded-xl bg-[#eef2ff] text-[#6366f1] border border-[#c7d2fe]/60';
      categoryBadge = 'bg-indigo-50 text-indigo-700 border-indigo-200';
      categoryLabel = 'Excuse Submission';
      iconSVG = `
        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.75">
          <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>`;
    }
  } else if (item.category === 'advisories') {
    iconBox = 'w-10 h-10 rounded-xl bg-[#f5f3ff] text-[#7c3aed] border border-[#ddd6fe]/60';
    categoryBadge = 'bg-purple-50 text-purple-700 border-purple-200';
    categoryLabel = 'Campus Advisory';
    iconSVG = `
      <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.75">
        <path stroke-linecap="round" stroke-linejoin="round" d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 110-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 01-1.44-4.213m3.102 0a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
      </svg>`;
  }

  // Meta pills HTML
  const metaEntries = Object.entries(item.meta || {});
  const metaHTML = metaEntries.length > 0
    ? `
      <div class="flex flex-wrap items-center gap-1.5 mt-2.5">
        ${metaEntries.map(([key, val]) => `
          <span class="inline-flex items-center text-[10px] font-medium px-2 py-0.5 rounded-md bg-white border border-[#e5e7eb] text-[#4b5563] shadow-2xs">
            <span class="text-[#9ca3af] mr-1 capitalize">${key}:</span>
            <span class="font-semibold text-[#111827]">${val}</span>
          </span>
        `).join('')}
      </div>
    `
    : '';

  // Action Button HTML
  let actionBtnHTML = '';
  if (item.action) {
    let btnStyle = 'text-[#0030c2] bg-[#eff6ff] hover:bg-[#dbeafe] border-[#bfdbfe]';
    if (item.action.type === 'danger') {
      btnStyle = 'text-white bg-[#dc2626] hover:bg-[#b91c1c] border-transparent shadow-xs';
    } else if (item.action.type === 'warning') {
      btnStyle = 'text-white bg-[#f97316] hover:bg-[#ea580c] border-transparent shadow-xs';
    } else if (item.action.type === 'success') {
      btnStyle = 'text-[#16a34a] bg-[#f0fdf4] hover:bg-[#dcfce7] border-[#bbf7d0]';
    } else if (item.action.type === 'neutral') {
      btnStyle = 'text-[#374151] bg-white hover:bg-gray-50 border-[#e5e7eb] shadow-2xs';
    }

    actionBtnHTML = `
      <a href="${item.action.url}"
        class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${btnStyle}">
        <span>${item.action.label}</span>
        <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      </a>
    `;
  }

  // Mark Read Button HTML
  const markReadBtn = item.unread
    ? `
      <button onclick="markNotificationAsRead('${item.id}', event)"
        class="inline-flex items-center gap-1 text-[11px] font-semibold text-[#0030c2] hover:text-[#002699] hover:underline p-1 rounded transition-colors cursor-pointer"
        title="Mark notification as read">
        <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
        <span>Mark as Read</span>
      </button>
    `
    : `
      <span class="inline-flex items-center gap-1 text-[11px] text-[#9ca3af]">
        <svg class="w-3.5 h-3.5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
        <span>Read</span>
      </span>
    `;

  return `
    <div class="p-4 sm:p-5 transition-all ${unreadBorder}">
      <div class="flex items-start gap-3.5 sm:gap-4">
        
        <!-- Category Rounded Icon Box -->
        <div class="${iconBox} flex items-center justify-center shrink-0 shadow-2xs">
          ${iconSVG}
        </div>

        <!-- Main Content -->
        <div class="flex-1 min-w-0">
          
          <!-- Header Row -->
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-3">
            <div class="flex items-center gap-2 flex-wrap min-w-0">
              <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${categoryBadge}">
                ${categoryLabel}
              </span>
              <h4 class="text-sm font-bold text-[#111827] truncate">${item.title}</h4>
              ${item.unread ? '<span class="w-2 h-2 rounded-full bg-[#0030c2] shrink-0" title="Unread Notice"></span>' : ''}
            </div>

            <!-- Timestamp & Read action -->
            <div class="flex items-center gap-2.5 text-xs text-[#9ca3af] shrink-0">
              <span title="${new Date(item.timestamp).toLocaleString()}" class="whitespace-nowrap">${item.relativeTime}</span>
              <span class="text-gray-300">·</span>
              ${markReadBtn}
            </div>
          </div>

          <!-- Description Message -->
          <p class="text-xs text-[#4b5563] mt-1.5 leading-relaxed">
            ${item.message}
          </p>

          <!-- Metadata Tags -->
          ${metaHTML}

          <!-- Bottom Action Buttons -->
          ${item.action ? `
            <div class="mt-3.5 pt-2 flex items-center justify-between">
              <div>${actionBtnHTML}</div>
            </div>
          ` : ''}

        </div>
      </div>
    </div>
  `;
}

/**
 * Setup Global Listeners
 */
function setupEventListeners() {
  // Notifications bell is managed by notifications-flyout.js
}

/**
 * Global Profile Dropdown Toggle
 */
window.toggleProfileDropdown = function (event) {
  if (event) event.stopPropagation();
  const dropdown = document.getElementById('studentProfileMenu');
  if (dropdown) {
    dropdown.classList.toggle('hidden');
  }
};

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
  const dropdown = document.getElementById('studentProfileMenu');
  const btn = document.getElementById('topbarProfileBtn');
  if (dropdown && !dropdown.classList.contains('hidden')) {
    if (!btn || !btn.contains(e.target)) {
      dropdown.classList.add('hidden');
    }
  }
});

/**
 * Toast Notification Helper
 */
function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `px-4 py-3 rounded-lg shadow-lg text-xs font-semibold text-white transition-all transform duration-200 pointer-events-auto flex items-center gap-2 ${
    type === 'success' ? 'bg-emerald-600' :
    type === 'danger' ? 'bg-rose-600' :
    type === 'warning' ? 'bg-amber-600' : 'bg-[#0030c2]'
  }`;

  toast.innerHTML = `
    <svg class="w-4 h-4 text-white shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
      <path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
    </svg>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 200);
  }, 2500);
}
