/**
 * Attendance Monitoring System - Student Portal
 * notifications-flyout.js - Shared Topbar Floating Notification Dropdown
 * Handles flyout toggle, All/Unread filtering, Mark All Read, and Directory Link.
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'student_portal_notifications';

  // Seed default notifications if none exist in localStorage
  const defaultFlyoutNotifications = [
    {
      id: 'notif-demo-check',
      category: 'scans',
      title: 'RFID Gate Time-In Verified',
      message: 'Tap confirmed at Gate 1 Main Entrance Turnstile A. Official attendance recorded on-time for today.',
      timestamp: '2026-09-12T07:15:00',
      relativeTime: 'Just now',
      unread: true,
      iconType: 'scan',
      targetUrl: 'my-attendance.html'
    },
    {
      id: 'notif-1',
      category: 'scans',
      title: 'RFID Gate Time-In Recorded',
      message: 'Your physical RFID card tap was successfully verified at Gate 1 Main Entrance turnstile checkpoint.',
      timestamp: '2026-09-10T07:18:00',
      relativeTime: '12 mins ago',
      unread: true,
      iconType: 'scan',
      targetUrl: 'my-attendance.html'
    },
    {
      id: 'notif-2',
      category: 'warnings',
      title: 'Tardiness Warning Flagged',
      message: 'You were marked Late (+18 mins delay) during daily roll call for CS201 (Data Structures and Algorithms).',
      timestamp: '2026-09-09T08:18:00',
      relativeTime: 'Yesterday, 8:18 AM',
      unread: true,
      iconType: 'warning',
      targetUrl: 'tardy-and-absence/tardy-records.html'
    },
    {
      id: 'notif-3',
      category: 'warnings',
      title: 'Unexcused Absence & Parent SMS Dispatched',
      message: 'An unexcused absence was recorded in IT302. An automated SMS advisory was successfully dispatched to your guardian.',
      timestamp: '2026-09-08T10:30:00',
      relativeTime: '2 days ago',
      unread: true,
      iconType: 'absence',
      targetUrl: 'excuse-slip/submit-excuse.html'
    },
    {
      id: 'notif-4',
      category: 'excuse',
      title: 'Excuse Slip Approved',
      message: 'Your excuse request for Sept 02 (Medical Consultation) has been APPROVED by Prof. Maria Santos.',
      timestamp: '2026-09-07T14:45:00',
      relativeTime: '3 days ago',
      unread: true,
      iconType: 'approved',
      targetUrl: 'excuse-slip/my-requests.html'
    },
    {
      id: 'notif-5',
      category: 'scans',
      title: 'Classroom Dynamic QR Verified',
      message: 'Your encrypted dynamic QR code was verified at the classroom camera scanner for IT301.',
      timestamp: '2026-09-07T07:35:00',
      relativeTime: '3 days ago',
      unread: false,
      iconType: 'scan',
      targetUrl: 'my-attendance.html'
    },
    {
      id: 'notif-6',
      category: 'advisories',
      title: 'Institutional Weather Suspension Advisory',
      message: 'Metro Manila Disaster Risk Reduction Council announced suspension of in-person collegiate classes due to severe weather.',
      timestamp: '2026-09-04T06:00:00',
      relativeTime: '6 days ago',
      unread: false,
      iconType: 'advisory',
      targetUrl: 'notifications.html'
    }
  ];

  let currentFlyoutFilter = 'all'; // 'all' | 'unread'

  /**
   * Get notifications from localStorage
   */
  function getNotifications() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch (e) {
      console.warn('Error reading notifications from localStorage:', e);
    }
    // Initialize default
    saveNotifications(defaultFlyoutNotifications);
    return defaultFlyoutNotifications;
  }

  /**
   * Save notifications to localStorage
   */
  function saveNotifications(data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.warn('Error saving notifications to localStorage:', e);
    }
  }

  /**
   * Compute relative path to a student page based on current URL path
   */
  function getRelativeStudentPath(targetFile) {
    const pathname = window.location.pathname.replace(/\\/g, '/');
    if (pathname.includes('/excuse-slip/') || pathname.includes('/tardy-and-absence/')) {
      if (targetFile.startsWith('excuse-slip/') || targetFile.startsWith('tardy-and-absence/')) {
        return '../' + targetFile;
      }
      return '../' + targetFile;
    }
    return targetFile;
  }

  /**
   * Render category icon SVG
   */
  function getCategoryIconSvg(iconType) {
    switch (iconType) {
      case 'scan':
        return `
          <div class="w-8 h-8 rounded-xl bg-[#eff6ff] text-[#0030c2] border border-[#bfdbfe]/60 flex items-center justify-center shrink-0">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 15.375c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5zM13.5 15.75h2.25v2.25H13.5V15.75zM18 15.75h2.25v2.25H18v-2.25zM13.5 19.5h2.25v1.5H13.5v-1.5zM18 19.5h2.25v1.5H18v-1.5z" />
            </svg>
          </div>
        `;
      case 'warning':
        return `
          <div class="w-8 h-8 rounded-xl bg-[#fff7ed] text-[#f97316] border border-[#fed7aa]/60 flex items-center justify-center shrink-0">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        `;
      case 'absence':
        return `
          <div class="w-8 h-8 rounded-xl bg-[#fef2f2] text-[#dc2626] border border-[#fecaca]/60 flex items-center justify-center shrink-0">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
          </div>
        `;
      case 'approved':
        return `
          <div class="w-8 h-8 rounded-xl bg-[#f0fdf4] text-[#16a34a] border border-[#bbf7d0]/60 flex items-center justify-center shrink-0">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        `;
      default:
        return `
          <div class="w-8 h-8 rounded-xl bg-[#eff6ff] text-[#0030c2] border border-[#bfdbfe]/60 flex items-center justify-center shrink-0">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
            </svg>
          </div>
        `;
    }
  }

  /**
   * Escape HTML utility
   */
  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  /**
   * Update all badge counters across the page (topbar & flyout header)
   */
  function updateBadges() {
    const list = getNotifications();
    const unreadCount = list.filter(n => n.unread).length;

    // Topbar badge
    const badgeEl = document.getElementById('topbarNotifBadge');
    if (badgeEl) {
      if (unreadCount > 0) {
        badgeEl.textContent = unreadCount;
        badgeEl.classList.remove('hidden');
        badgeEl.style.display = 'flex';
      } else {
        badgeEl.textContent = '';
        badgeEl.classList.add('hidden');
        badgeEl.style.display = 'none';
      }
    }

    // Update any badge spans inside #studentNotifBtn
    const notifBtn = document.getElementById('studentNotifBtn');
    if (notifBtn) {
      const badgeSpans = notifBtn.querySelectorAll('span');
      badgeSpans.forEach(span => {
        if (unreadCount > 0) {
          span.textContent = unreadCount;
          span.classList.remove('hidden');
          span.style.display = 'flex';
        } else {
          span.textContent = '';
          span.classList.add('hidden');
          span.style.display = 'none';
        }
      });
    }

    // Flyout header unread pill (completely remove when zero, show only when > 0)
    const flyoutUnreadCountEl = document.getElementById('flyoutUnreadCount');
    if (flyoutUnreadCountEl) {
      if (unreadCount > 0) {
        flyoutUnreadCountEl.textContent = unreadCount;
        flyoutUnreadCountEl.classList.remove('hidden');
        flyoutUnreadCountEl.style.display = 'flex';
      } else {
        flyoutUnreadCountEl.textContent = '';
        flyoutUnreadCountEl.classList.add('hidden');
        flyoutUnreadCountEl.style.display = 'none';
      }
    }
  }

  /**
   * Render the list inside the flyout body
   */
  function renderFlyoutList() {
    const container = document.getElementById('flyoutNotifList');
    if (!container) return;

    const list = getNotifications();
    let displayList = list;

    if (currentFlyoutFilter === 'unread') {
      displayList = list.filter(n => n.unread);
    }

    if (displayList.length === 0) {
      container.innerHTML = `
        <div class="flex flex-col items-center justify-center p-6 text-center" style="height: 255px; min-height: 255px; box-sizing: border-box;">
          <div class="w-11 h-11 rounded-full bg-[#f3f4f6] text-[#9ca3af] flex items-center justify-center mx-auto mb-2.5">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.75">
              <path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
            </svg>
          </div>
          <p class="text-xs font-bold text-[#111827]">
            ${currentFlyoutFilter === 'unread' ? 'No unread notifications' : 'No notifications yet'}
          </p>
          <p class="text-[11px] text-[#6b7280] mt-0.5">
            ${currentFlyoutFilter === 'unread' ? "You're all caught up!" : 'Activity notices will appear here.'}
          </p>
        </div>
      `;
      return;
    }

    container.innerHTML = displayList.map(item => {
      const isUnread = !!item.unread;
      const unreadBg = isUnread ? 'bg-[#eff6ff]/40' : 'bg-white';
      const targetUrl = item.targetUrl ? getRelativeStudentPath(item.targetUrl) : '';

      return `
        <div class="flyout-notif-item p-2.5 ${unreadBg} hover:bg-gray-50 transition-colors cursor-pointer flex items-start gap-3 relative group shrink-0"
             style="height: 85px; min-height: 85px; max-height: 85px; box-sizing: border-box;"
             onclick="window.handleFlyoutItemClick('${escapeHtml(item.id)}', '${escapeHtml(targetUrl)}')">
          ${getCategoryIconSvg(item.iconType || 'info')}
          <div class="flex-1 min-w-0">
            <div class="flex items-center justify-between gap-1.5">
              <p class="text-xs font-bold ${isUnread ? 'text-[#111827]' : 'text-[#374151]'} truncate">
                ${escapeHtml(item.title)}
              </p>
              ${isUnread ? '<span class="w-2 h-2 rounded-full bg-[#0030c2] shrink-0" title="Unread"></span>' : ''}
            </div>
            <p class="flyout-notif-msg text-[11px] text-[#4b5563] mt-0.5 leading-snug"
               style="display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; text-overflow: ellipsis; line-height: 1.35; max-height: 2.7em;">
              ${escapeHtml(item.message)}
            </p>
            <div class="flex items-center gap-2 mt-1">
              <span class="text-[10px] text-[#9ca3af] font-medium">${escapeHtml(item.relativeTime || 'Recently')}</span>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  /**
   * Set filter between 'all' and 'unread'
   */
  window.setFlyoutFilter = function (filter, event) {
    if (event) event.stopPropagation();
    currentFlyoutFilter = filter;

    const allBtn = document.getElementById('flyoutTabAll');
    const unreadBtn = document.getElementById('flyoutTabUnread');

    const baseClass = 'flyout-tab-btn h-7 text-xs rounded-md transition-all cursor-pointer flex items-center justify-center flex-1 w-1/2';
    const activeClass = `${baseClass} font-bold bg-white text-[#0030c2] shadow-xs`;
    const inactiveClass = `${baseClass} font-semibold text-[#6b7280] hover:text-[#111827]`;

    if (filter === 'all') {
      if (allBtn) {
        allBtn.className = activeClass;
        allBtn.style.flex = '1 1 0%';
        allBtn.style.width = '50%';
        allBtn.style.height = '28px';
      }
      if (unreadBtn) {
        unreadBtn.className = `${inactiveClass} gap-1`;
        unreadBtn.style.flex = '1 1 0%';
        unreadBtn.style.width = '50%';
        unreadBtn.style.height = '28px';
      }
    } else {
      if (allBtn) {
        allBtn.className = inactiveClass;
        allBtn.style.flex = '1 1 0%';
        allBtn.style.width = '50%';
        allBtn.style.height = '28px';
      }
      if (unreadBtn) {
        unreadBtn.className = `${activeClass} gap-1`;
        unreadBtn.style.flex = '1 1 0%';
        unreadBtn.style.width = '50%';
        unreadBtn.style.height = '28px';
      }
    }

    renderFlyoutList();
  };

  /**
   * Mark all flyout notifications as read
   */
  window.markAllFlyoutNotificationsAsRead = function (event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    const list = getNotifications();
    list.forEach(n => { n.unread = false; });
    saveNotifications(list);

    updateBadges();
    renderFlyoutList();

    // Notify full notifications page if active
    if (window.onNotificationStateChanged) {
      window.onNotificationStateChanged();
    }
  };

  /**
   * External hook to update flyout badges & list
   */
  window.updateFlyoutBadges = function () {
    updateBadges();
    renderFlyoutList();
  };

  // Sync across tabs/windows
  window.addEventListener('storage', (e) => {
    if (e.key === STORAGE_KEY) {
      updateBadges();
      renderFlyoutList();
    }
  });

  /**
   * Handle single item click
   */
  window.handleFlyoutItemClick = function (id, targetUrl) {
    const list = getNotifications();
    const item = list.find(n => n.id === id);
    if (item && item.unread) {
      item.unread = false;
      saveNotifications(list);
      updateBadges();
      renderFlyoutList();

      if (window.onNotificationStateChanged) {
        window.onNotificationStateChanged();
      }
    }

    if (targetUrl) {
      window.location.href = targetUrl;
    }
  };

  /**
   * Toggle floating notification dropdown
   */
  window.toggleNotificationDropdown = function (event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    // Close profile menu if open
    const profileMenu = document.getElementById('studentProfileMenu');
    if (profileMenu && !profileMenu.classList.contains('hidden')) {
      profileMenu.classList.add('hidden');
    }

    const dropdown = document.getElementById('studentNotificationDropdown');
    if (!dropdown) return;

    const isHidden = dropdown.classList.contains('hidden');
    if (isHidden) {
      renderFlyoutList();
      updateBadges();
      dropdown.classList.remove('hidden');
      dropdown.classList.add('flex');
    } else {
      dropdown.classList.add('hidden');
      dropdown.classList.remove('flex');
    }
  };

  /**
   * Close floating notification dropdown
   */
  window.closeNotificationDropdown = function () {
    const dropdown = document.getElementById('studentNotificationDropdown');
    if (dropdown && !dropdown.classList.contains('hidden')) {
      dropdown.classList.add('hidden');
      dropdown.classList.remove('flex');
    }
  };

  /**
   * Mount and attach flyout HTML structure to topbar bell
   */
  function setupNotificationFlyout() {
    const notifBtn = document.getElementById('studentNotifBtn');
    if (!notifBtn) return;

    // Wrap button in relative container if not already wrapped
    let parent = notifBtn.parentElement;
    if (!parent.classList.contains('relative')) {
      const wrapper = document.createElement('div');
      wrapper.className = 'relative';
      parent.insertBefore(wrapper, notifBtn);
      wrapper.appendChild(notifBtn);
      parent = wrapper;
    }

    // Ensure notifBtn has onclick and pointer cursor
    notifBtn.setAttribute('onclick', 'toggleNotificationDropdown(event)');
    notifBtn.classList.add('cursor-pointer');

    // Remove legacy anchor tag behavior if button was an <a> tag
    if (notifBtn.tagName === 'A') {
      notifBtn.removeAttribute('href');
    }

    // Set up badge element id
    let badgeSpan = notifBtn.querySelector('span');
    if (badgeSpan && !badgeSpan.id) {
      badgeSpan.id = 'topbarNotifBadge';
    }

    // Check if dropdown already exists
    let dropdown = document.getElementById('studentNotificationDropdown');
    if (!dropdown) {
      dropdown = document.createElement('div');
      dropdown.id = 'studentNotificationDropdown';
      dropdown.style.width = '384px';
      dropdown.style.minWidth = '384px';
      dropdown.style.maxWidth = '384px';
      dropdown.style.boxSizing = 'border-box';
      dropdown.className = 'hidden absolute right-0 top-full mt-2 bg-white rounded-2xl border border-[#e5e7eb] shadow-2xl z-50 overflow-hidden flex flex-col transition-all';

      const directoryUrl = getRelativeStudentPath('notifications.html');

      dropdown.innerHTML = `
        <!-- Flyout Header -->
        <div class="p-3 border-b border-[#e5e7eb] flex items-center justify-between bg-white shrink-0">
          <!-- Left: All / Unread Filter Tabs (Strictly Equal 50/50 Sizing) -->
          <div class="flyout-tab-container w-36 flex items-center gap-0.5 bg-[#f3f4f6] p-0.5 rounded-lg"
               style="width: 140px; min-width: 140px; box-sizing: border-box; display: flex; gap: 2px;">
            <button id="flyoutTabAll" onclick="setFlyoutFilter('all', event)"
              style="height: 28px; width: 50%; flex: 1 1 0%; box-sizing: border-box; display: flex; align-items: center; justify-content: center;"
              class="flyout-tab-btn h-7 flex-1 w-1/2 text-xs font-bold rounded-md bg-white text-[#0030c2] shadow-xs transition-all cursor-pointer flex items-center justify-center">
              All
            </button>
            <button id="flyoutTabUnread" onclick="setFlyoutFilter('unread', event)"
              style="height: 28px; width: 50%; flex: 1 1 0%; box-sizing: border-box; display: flex; align-items: center; justify-content: center;"
              class="flyout-tab-btn h-7 flex-1 w-1/2 text-xs font-semibold rounded-md text-[#6b7280] hover:text-[#111827] transition-all cursor-pointer flex items-center justify-center gap-1">
              <span>Unread</span>
              <span id="flyoutUnreadCount"
                class="hidden w-4 h-4 rounded-full bg-[#0030c2] text-white text-[9px] font-bold items-center justify-center shrink-0"></span>
            </button>
          </div>

          <!-- Right: Mark all as read + Directory Settings Icon -->
          <div class="flex items-center gap-1">
            <button id="flyoutMarkAllBtn" onclick="markAllFlyoutNotificationsAsRead(event)"
              class="p-1.5 text-[#0030c2] hover:bg-[#e7edff] rounded-lg transition-colors cursor-pointer flex items-center justify-center"
              title="Mark all as read"
              aria-label="Mark all as read">
              <svg class="w-4 h-4 text-[#0030c2]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.25">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5m-3 6l6 6 9-13.5" />
              </svg>
            </button>

            <!-- Directory / Full Notifications Center Settings Icon -->
            <a id="flyoutDirectoryLink" href="${directoryUrl}"
              class="p-1.5 text-[#6b7280] hover:text-[#0030c2] hover:bg-[#e7edff] rounded-lg transition-colors cursor-pointer inline-flex items-center justify-center"
              title="Notification Directory (Main View)">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.85">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 010 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.6 6.6 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 010-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </a>
          </div>
        </div>

        <!-- Flyout Body: Scrollable Feed (Max 3 items visible, scrollable beyond 3) -->
        <div id="flyoutNotifList"
             style="height: 255px; min-height: 255px; max-height: 255px; overflow-y: auto; -webkit-overflow-scrolling: touch;"
             class="divide-y divide-[#f3f4f6]">
          <!-- Rendered dynamically -->
        </div>
      `;

      parent.appendChild(dropdown);
    }

    // Dismiss listeners
    document.addEventListener('click', (e) => {
      if (dropdown && !dropdown.classList.contains('hidden')) {
        if (!parent.contains(e.target)) {
          closeNotificationDropdown();
        }
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeNotificationDropdown();
      }
    });

    updateBadges();
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupNotificationFlyout);
  } else {
    setupNotificationFlyout();
  }

})();
