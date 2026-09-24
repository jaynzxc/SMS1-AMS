---
name: ui-ux
description: UI/UX design standards, component anatomy, styling rules, color palettes, and benchmark reference files for the Bestlink College of the Philippines Attendance Monitoring System. Use when creating or refining frontend pages, layouts, cards, modals, or topbars.
---

# UI/UX Design System Skill (SMS1-AMS)

## Goal

Ensure 100% visual, architectural, and structural consistency across all portals (**Admin**, **Teacher**, and **Student**) in strict accordance with the **10 Official AMS Submodules** and the **Centralized Export Standard (Option 1)**.

---

## 1. Official Reference Standards (Golden Benchmarks)

When creating or modifying any page, ALWAYS consult these reference benchmark files first:

| Role Panel | Benchmark Reference File | Use As Reference For |
| :--- | :--- | :--- |
| **Student Panel** | `student/attendance-calendar.html` | Main shell layout, sidebar, topbar header, KPI summary cards, filter bars, tables, modal dialogs, and toast system. |
| **Student Analytics** | `student/performance-analytics.html` | SVG charts, metric progress bars, analytics cards, subject compliance gauges. |
| **Teacher Panel** | `teacher/class-analytics.html` & `teacher/attendance-calendar.html` | Teacher sidebar, evaluation grids, class filters, scan status, approval modals. |
| **Admin Panel** | `admin/attendance-calendar.html` & `admin/performance-analytics.html` | Admin sidebar, system-wide metrics, configuration controls, user tables, audit logs. |

---

## 2. Technology & Pipeline Standards

* **Strictly Pure HTML5 + Compiled Tailwind CSS + Vanilla JavaScript**:
  * **DO NOT** import `<script src="https://cdn.tailwindcss.com"></script>`. The project uses a compiled CSS pipeline.
  * Always link stylesheets in the `<head>`:
    ```html
    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">

    <!-- Stylesheets -->
    <link rel="stylesheet" href="../assets/css/output.css">
    <link rel="stylesheet" href="../assets/css/style.css">
    ```
* **No Framework Injections**: Do NOT introduce React, Vue, Angular, Bootstrap, jQuery, or PHP templates.
* **No External Icon Libraries (FontAwesome/Bootstrap Icons)**: Use clean inline SVG icons styled with Tailwind (`stroke-width="1.75"` or `2`, `fill="none"`, `stroke="currentColor"`).
* **Strict Ban on Emojis in Generated Code & UI**: Do NOT use emojis in place of icons, buttons, badges, table cells, or alert messages. Always use clean, inline vector SVGs or Tailwind text badges.
* **Zero AI Slop & Placeholder Text**: Avoid dummy lorem ipsum text, bloated wrapper divs, or artificial filler. Use accurate Bestlink College of the Philippines context and academic data.

---

## 3. Sidebar Navigation Standards (The 10 Official Submodules)

All sidebars across all 3 portals strictly follow the **9 Core Submodules** structure:

### Admin Portal Navigation Menu
1. **Analytics Dashboard** (`admin/dashboard.html` / `performance-analytics.html`)
2. **Daily Attendance** (`admin/attendance.html`)
3. **RFID & QR Management** (`admin/rfid-and-qr/rfid-registry.html`, `qr-management.html`, `scan-logs.html`)
4. **Tardy & Absence Logs** (`admin/tardy-and-absence/tardy-and-absence.html`, `habitual-offender.html`)
5. **Teacher Attendance** (`admin/teacher-attendance.html`)
6. **Excuse Management** (`admin/excuse-management.html`)
7. **Attendance Calendar** (`admin/attendance-calendar.html`)
8. **Parent Alerts** (`admin/parent-alerts.html`)
9. **Perfect Attendance** (`admin/perfect-attendance.html`)
*Footer Item:* **User Management** (`admin/user-management.html`)

*(Rule: `academic-management.html` is strictly omitted from the navigation menu as academic curriculum belongs to the upstream SMS 1 Academic Module. The standalone `reports-export.html` module is retired in favor of universal table-level export modals. Dropdown submenus must include `.rotate-90` smooth chevron transitions and proper parent highlight state synchronization).*

### Teacher Portal Navigation Menu
1. **Class Analytics** (`teacher/dashboard.html` / `class-analytics.html`)
2. **Daily Attendance** (`teacher/daily-attendance.html`)
3. **RFID & QR Scanner** (`teacher/rfid-and-qr/live-scanner.html`, `scan-logs.html`)
4. **Tardy & Absence Logs** (`teacher/tardy-and-absence/tardy-and-absence.html`)
5. **My Teacher Attendance** (`teacher/teacher-attendance.html`)
6. **Excuse Slip Reviews** (`teacher/excuse-slip/pending-requests.html`)
7. **Attendance Calendar** (`teacher/attendance-calendar.html`)
8. **Alerts to Parents** (`teacher/parent-alerts.html`)
9. **Perfect Attendance** (`teacher/perfect-attendance.html`)

### Student Portal Navigation Menu
1. **Dashboard** (`student/dashboard.html` / `performance-analytics.html`)
2. **My Attendance** (`student/my-attendance.html`)
3. **Digital ID & QR Pass** (`student/rfid-and-qr.html`)
4. **Submit Excuse Slip** (`student/excuse-slip/submit-excuse.html`, `my-requests.html`)
5. **Attendance Calendar** (`student/attendance-calendar.html`)
6. **Notifications & Alerts** (`student/notifications.html`)
7. **Perfect Attendance** (`student/perfect-attendance.html`)

---

## 4. Universal Table-Level Export & Multi-Format Modal Standard (`export-modal.js`)

To ensure intuitive accessibility, consistent data extraction, and institutional accreditation compliance:

1. **Contextual Table-Level Export Buttons**:
   * Every operational table across Admin, Teacher, and Student portals features an **Export** button in its control header right alongside Search and Filter controls.
   * **Benchmark Style**: Solid primary blue button matching `admin/excuse-management.html`:
     ```html
     <button onclick="openExportModal({ ... })"
       class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-[#0030c2] hover:bg-[#002699] rounded-lg transition-colors cursor-pointer shadow-sm">
       <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
         <path stroke-linecap="round" stroke-linejoin="round"
           d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
       </svg>
       <span>Export</span>
     </button>
     ```
   * Clicking the button invokes `openExportModal(options)` with module-specific metadata (table ID, document title, default filename, and CHED compliance attributes).
2. **Interactive Multi-Format Modal Selector**:
   * Standard modal dialog rendered dynamically via `assets/js/common/export-modal.js` (`#bcpUniversalExportModal`).
   * Provides 4 format selection tiles with custom radios:
     * **CSV** (`.csv`): Raw, UTF-8 encoded comma-separated values for database imports and statistical tooling.
     * **EXCEL** (`.xlsx`): Formatted XML spreadsheet with native header styling, auto-filter capabilities, and auto-width columns.
     * **PDF** (`.pdf`): High-resolution vector printable document formatted with official Bestlink College of the Philippines institutional header, CHED compliance metadata, tabular grid, and collegiate signatory blocks (Instructor, Department Head, Dean, Registrar).
     * **WORD** (`.doc`): Formal Microsoft Word document layout with letterhead, institutional metadata table, and audit trail.
3. **CHED Collegiate Compliance Standard**:
   * Bestlink College of the Philippines is a higher-education institution under the **Commission on Higher Education (CHED)**.
   * All formal documents strictly implement collegiate nomenclature:
     * **College / Academic Department** (e.g., *College of Computer Studies*)
     * **Degree Program** (e.g., *Bachelor of Science in Information Technology*)
     * **Semester & Academic Year** (e.g., *1st Semester, A.Y. 2026-2027*)
     * **Course Code & Descriptive Title** (e.g., *IT201 - Web Development*)
     * **Institutional Signatories**: Instructor, Prefect of Discipline / Department Head, College Dean, and College Registrar.
   * Basic education (DepEd SF2) terminology is strictly prohibited.

---

## 5. Dual-Option Medical Excuse Slip UI Component

In `student/excuse-slip/submit-excuse.html`, the medical proof section must provide a dual-option selector:

```html
<!-- Medical Document Source Selector -->
<div class="space-y-3">
  <label class="block text-xs font-bold text-[#374151]">Medical Verification Type</label>
  <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
    <!-- Option A: External Medical Certificate -->
    <label class="flex items-center gap-3 p-3 rounded-xl border border-[#0030c2] bg-[#eff6ff] cursor-pointer">
      <input type="radio" name="medicalSource" value="EXTERNAL_MEDICAL" checked class="text-[#0030c2]" onchange="toggleMedicalSource(this.value)">
      <div>
        <p class="text-xs font-bold text-[#111827]">External Medical Certificate</p>
        <p class="text-[11px] text-[#6b7280]">Doctor prescription or hospital document</p>
      </div>
    </label>
    <!-- Option B: School Clinic Pass -->
    <label class="flex items-center gap-3 p-3 rounded-xl border border-[#e5e7eb] hover:bg-gray-50 cursor-pointer">
      <input type="radio" name="medicalSource" value="CLINIC_PASS" class="text-[#0030c2]" onchange="toggleMedicalSource(this.value)">
      <div>
        <p class="text-xs font-bold text-[#111827]">School Clinic Pass</p>
        <p class="text-[11px] text-[#6b7280]">Treated at BCP Campus Health Clinic</p>
      </div>
    </label>
  </div>

  <!-- Dynamic Container for External Upload -->
  <div id="externalUploadContainer" class="space-y-2">
    <label class="block text-xs font-semibold text-[#374151]">Upload Document (PDF, JPG, PNG)</label>
    <input type="file" id="medicalFile" accept=".pdf,.jpg,.jpeg,.png" class="w-full text-xs text-gray-500 border border-[#e5e7eb] rounded-lg p-2 bg-white">
  </div>

  <!-- Dynamic Container for Clinic Pass -->
  <div id="clinicPassContainer" class="hidden space-y-2">
    <label class="block text-xs font-semibold text-[#374151]">School Clinic Pass / Slip Number</label>
    <input type="text" id="clinicPassNumber" placeholder="e.g. CLN-2026-0842" class="w-full text-xs px-3 py-2 border border-[#e5e7eb] rounded-lg bg-white">
    <p class="text-[10px] text-[#6b7280]">Verification is automatically cross-referenced with Clinic Management records.</p>
  </div>
</div>
```

---

## 6. Core Color Palette & Token Rules

All interfaces follow the Bestlink College of the Philippines institutional design system:

| Token / Usage | Tailwind Class | Hex Value | Application |
| :--- | :--- | :--- | :--- |
| **Primary Brand** | `text-[#0030c2]`, `bg-[#0030c2]` | `#0030c2` | Primary buttons, active nav pills, key highlights, progress bars. |
| **Primary Hover** | `hover:bg-[#002699]` | `#002699` | Button hover state. |
| **Primary Soft Tint** | `bg-[#eff6ff]`, `hover:bg-[#dbeafe]`, `border-[#bfdbfe]` | `#eff6ff` | Filter buttons, active pills, icon badge backgrounds. |
| **Body Background** | `bg-[#f8fafc]` | `#f8fafc` | Page canvas background. |
| **Surface / Card** | `bg-white` | `#ffffff` | Main cards, tables, headers, sidebar, modals. |
| **Card Borders** | `border-[#e5e7eb]` | `#e5e7eb` | Standard card, table, header, and input borders. |
| **Subtle Divider** | `border-[#f3f4f6]` | `#f3f4f6` | List dividers, subtle sub-header borders. |
| **Primary Text** | `text-[#111827]` | `#111827` | Headings (`h1`, `h2`, `h3`), primary data values, bold labels. |
| **Secondary Text** | `text-[#374151]` | `#374151` | Table content, form labels, modal text. |
| **Muted / Hint Text** | `text-[#6b7280]` | `#6b7280` | Subtitles, timestamps, breadcrumbs, placeholder text. |
| **Success / Present** | `text-[#16a34a]`, `bg-[#f0fdf4]`, `border-[#bbf7d0]` | `#16a34a` | Present status, 100% rate, qualified/eligible badges. |
| **Warning / Late** | `text-[#f97316]`, `bg-[#fff7ed]`, `border-[#fed7aa]` | `#f97316` | Late arrivals, at-risk warnings, pending review. |
| **Danger / Absent** | `text-[#dc2626]`, `bg-[#fef2f2]`, `border-[#fecaca]` | `#dc2626` | Unexcused absences, critical warnings, disqualified, sign out. |
| **Honor / Purple** | `text-[#7c3aed]`, `bg-[#f5f3ff]`, `border-[#ddd6fe]` | `#7c3aed` | Perfect attendance awards, conferred status, certificates. |

---

### Standard Interactive Button Specifications

1. **Filter / Soft Tint Pill Button**:
   ```html
   class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#0030c2] bg-[#eff6ff] hover:bg-[#dbeafe] border border-[#bfdbfe] rounded-lg transition-colors shadow-xs cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#0030c2]/30"
   ```
2. **Neutral Table Control Button (Export / Reset / Action)**:
   ```html
   class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#374151] bg-white border border-[#e5e7eb] hover:bg-gray-50 hover:text-[#0030c2] hover:border-[#0030c2] rounded-lg transition-colors shadow-xs cursor-pointer focus:outline-none"
   ```
3. **Solid Primary Call-to-Action**:
   ```html
   class="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-[#0030c2] hover:bg-[#002699] rounded-lg transition-colors shadow-xs cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#0030c2]/40"
   ```

---

## 7. Standard Page Shell & Topbar Anatomy

```html
<body class="bg-[#f8fafc] text-[#111827]">
  <div class="flex h-screen overflow-hidden">

    <!-- 1. SIDEBAR -->
    <aside id="mainSidebar" class="w-64 bg-white border-r border-[#e5e7eb] flex flex-col shrink-0 h-full overflow-y-auto sidebar-fixed">
      <!-- Logo Header -->
      <div class="flex items-center gap-2.5 px-4 py-4 border-b border-[#e5e7eb] sticky top-0 z-10 bg-white">
        <div class="w-8 h-8 rounded-full bg-[#0030c2] flex items-center justify-center shrink-0 shadow-xs">
          <!-- Primary Icon SVG -->
        </div>
        <div>
          <p class="text-[11px] font-bold tracking-wide text-[#111827] leading-tight">ATTENDANCE MONITORING</p>
          <p class="text-[10px] text-[#6b7280]">[Role] Panel</p>
        </div>
      </div>
      <!-- Navigation Menu: 10 Official Submodules -->
      <nav class="flex-1 overflow-y-auto py-2 px-2.5 space-y-0.5">
        <!-- Links -->
      </nav>
    </aside>

    <!-- 2. MAIN CONTAINER -->
    <div class="flex-1 flex flex-col min-w-0 h-full overflow-y-auto main-scroll">
      <!-- TOPBAR HEADER (Sticky, h-14) -->
      <header class="h-14 border-b border-[#e5e7eb] flex items-center justify-between px-4 shrink-0 sticky top-0 z-10 bg-white/95 backdrop-blur-sm">
        <div class="flex items-center gap-3 min-w-0">
          <button id="sidebarToggle" class="burger-btn text-[#6b7280] hover:text-[#111827] p-1.5 rounded-lg shrink-0">
            <!-- Burger SVG -->
          </button>
          <h1 class="text-base font-bold text-[#111827] truncate">Page Title</h1>
        </div>
        <div class="flex items-center gap-3 shrink-0">
          <!-- Notification Bell Button (#adminNotifBtn / #teacherNotifBtn / #studentNotifBtn) -->
          <!-- User Profile Pill Button with Dropdown -->
        </div>
      </header>

      <!-- PAGE CONTENT AREA -->
      <main class="flex-1 p-5 space-y-5">
        <!-- KPI Summary Cards (5-column grid) -->
        <!-- Operational Tables / Charts (Zero export buttons) -->
      </main>
    </div>
  </div>
</body>
```

### 7.1 Header Date Display & Anti-Flicker Standard

To prevent page-refresh flickering and flash-of-unstyled-date (where stale dates like `May 27, 2025` momentarily appear before being replaced):
1. **Synchronous Immediate Initialization**:
   * Header date displays use `<span id="currentDateLabel">Loading date...</span>` immediately followed by an inline synchronous script that writes the live system date during DOM parsing before the browser's first paint:
   ```html
   <button id="currentDateDisplay" class="flex items-center gap-2 ...">
     <svg class="w-4 h-4 text-[#6b7280] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.75">
       <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
     </svg>
     <span id="currentDateLabel">Loading date...</span><script>(function(){try{var d=new Date(),days=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],months=['January','February','March','April','May','June','July','August','September','October','November','December'],el=document.currentScript?document.currentScript.previousElementSibling:document.getElementById('currentDateLabel');if(el)el.textContent=months[d.getMonth()]+' '+d.getDate()+', '+d.getFullYear()+' ('+days[d.getDay()]+')';}catch(e){}})();</script>
   </button>
   ```
2. **Centralized Safe Date Sync (`sidebar.js`)**:
   * `assets/js/common/sidebar.js` specifically targets `#currentDateLabel` and `#currentDateDisplay`. It does NOT execute broad, sweeping text scrapers across arbitrary document elements.
3. **Table Pagination Anti-Flicker (`table-pagination.js`)**:
   * `TablePagination.init()` initializes immediately upon evaluation as well as on `DOMContentLoaded` so that rows beyond the first page are hidden before layout paint, preventing rows 6+ from flashing into view and disappearing.
4. **Dashboard Stat Persistence (`dashboard.js`)**:
   * `dashboard.js` hydrates from `sessionStorage` (`bcp_admin_dashboard_cache`) on reload to preserve KPI card metrics and summary counters smoothly while asynchronous Supabase queries resolve in the background.

---

## 8. UI/UX Modernization Standard (`--preset b1Z5bagIi`)

The user interface across all three portals adheres to the **Vega** minimal dashboard architecture decoded from `--preset b1Z5bagIi`:

1. **Aesthetic Identity**: `vega` (Clean SaaS layout, crisp 1px borders, minimal visual friction, subtle micro-elevations).
2. **Typography**: Google Font **Inter** (`font-family: 'Inter', sans-serif`). Highly legible, neutral, modern sans-serif typeface.
3. **Neutral Canvas**: Canvas background `#f8fafc`, container cards pure `#ffffff`, borders `#e5e7eb`.
4. **Brand Primary Accent**: `#0030c2` with soft tint `#eff6ff` for active states and badges.
5. **Corner Radius Hierarchy**:
   * Controls, buttons, table search/filter pills: `rounded-lg` (8px).
   * Metric cards, KPI tiles, table wrappers: `rounded-xl` (12px).
   * Modal dialogs, scanner preview frames: `rounded-2xl` (16px).
6. **Subtle Navigation**: Navigation items use soft tint highlights (`bg-[#eff6ff]` with `#0030c2` text) rather than solid high-saturation fills.

---

## 9. Developer Pre-Flight Checklist

Before finishing any UI change or creating a new page:
- [ ] Navigation strictly adheres to the official AMS submodules.
- [ ] Operational table headers feature contextual table-level Export buttons triggering `#bcpUniversalExportModal`.
- [ ] Excuse slip form includes the dual-option medical toggle.
- [ ] Stylesheet links point to `output.css` and `style.css` (NO Tailwind CDN script).
- [ ] Font is Inter (`font-family: 'Inter', sans-serif`) with Google Fonts preconnect.
- [ ] Status badges match the official 4-color palette in `docs/COLOR_PALETTE.md`.
- [ ] Zero emojis in generated HTML, comments, or UI badges.
- [ ] Related agent skills specifications updated to align with any UI/UX changes made.

---

## 10. Continuous UI/UX Spec Alignment Rule

Whenever making modifications, improvements, or refinements to UI/UX components (e.g., chart styling, pill bars, card geometries, hover interactions, progressive color hierarchies):

1. **Always Update Related Agent Skill Specs:** Immediately update `.agent/skills/ui-ux/SKILL.md`, `.agent/skills/analytics-reporting/SKILL.md`, or other relevant skills to reflect the new visual tokens, container bounds, SVG viewBox scales, and interactive behaviors.
2. **Preserve Visual Continuity:** Ensure all subsequent tasks align with the updated specifications to prevent accidental regressions to legacy templates or outdated layouts.

---

## 11. Admin Dashboard Truancy by Category Radial Chart Widget

The Admin Dashboard (`admin/dashboard.html`) bottom row pairs the **Recent Attendance** table (`col-span-2`) with the **Truancy by Category Radial Chart** (`col-span-1`), replacing the legacy Quick Actions card:

1. **Purpose**: Real-time administrative surveillance and breakdown of chronic absenteeism and habitual tardiness categorized toward CHED compliance. Modeled after the Alerts by Type card in `admin/parent-alerts.html`.
2. **Component Anatomy**:
   * **Header**: Contains title `Truancy by Category` and `View All` navigation pill linking to `admin/tardy-and-absence/habitual-offender.html`.
   * **Radial / Donut Chart**: Pure SVG radial chart with background track and four color-coded category slices (`#sliceChronicAbs`, `#sliceHabitualLate`, `#sliceSevereBoth`, `#sliceAdvisory`) centered around the total cases count.
   * **Category Legend**: 4-item breakdown showing dot indicator, category name, count, and percentage:
     - Chronic Absences (>5) - Red (`#ef4444`)
     - Habitual Late (>5) - Orange (`#f97316`)
     - Severe (Exceeds Both) - Purple (`#8b5cf6`)
     - Advisory Warning - Blue (`#0030c2`)
   * **Footer**: CHED 20% Threshold Warning note with deep link `Manage Offenders →`.
3. **Dynamic Controller**: Driven by `renderAtRiskRadar(logs)` in `assets/js/admin/dashboard.js`, dynamically aggregating attendance logs to calculate slice dasharrays, offsets, and legend percentages.

---

## 12. shadcn/ui Button Component Standard (Pure CSS & Tailwind Compliant)

Reference: `shadcnComponents/buttons.md`

All button and button-like interactive triggers follow the official shadcn/ui button architecture implemented via clean CSS utility classes in `assets/css/style.css`:

1. **Global Cursor Rule**:
   ```css
   button:not(:disabled),
   [role="button"]:not(:disabled) {
     cursor: pointer;
   }
   ```
2. **Base Button (`.btn-shadcn`)**:
   * Shared styling: inline-flex, center alignment, gap-2, rounded-lg (or rounded-md for xs), text-sm, font-medium, focus-visible ring, active scale (`active:scale-[0.98]`), and disabled states.
3. **Variants**:
   * **Default (`.btn-shadcn-default`)**: Solid institutional blue (`#0030c2`), hover `#00259e`, white text, shadow-2xs.
   * **Outline (`.btn-shadcn-outline`)**: White background, subtle border (`#e5e7eb`), hover `#f9fafb` with `#d1d5db` border, dark text (`#111827`).
   * **Secondary (`.btn-shadcn-secondary`)**: Soft blue background (`#eff6ff`), blue border (`#bfdbfe`), blue text (`#0030c2`), font-semibold, hover `#dbeafe`.
   * **Ghost (`.btn-shadcn-ghost`)**: Transparent background, text `#6b7280`, hover background `#f3f4f6`, hover text `#111827`.
   * **Destructive (`.btn-shadcn-destructive`)**: Red (`#dc2626`), hover `#b91c1c`, white text.
4. **Sizes**:
   * **`sm` (`.btn-shadcn-sm`)**: Height 32px (`h-8`), px-3, text-xs.
   * **`xs` (`.btn-shadcn-xs`)**: Height 28px (`h-7`), px-2, text-xs.
   * **`lg` (`.btn-shadcn-lg`)**: Height 40px (`h-10`), px-5, text-sm.
   * **`icon` (`.btn-shadcn-icon`)**: 36px x 36px (`h-9 w-9`), p-0, centered icon.
   * **`icon-sm` (`.btn-shadcn-icon-sm`)**: 32px x 32px (`h-8 w-8`), p-0, centered icon.
   * **`icon-xs` (`.btn-shadcn-icon-xs`)**: 28px x 28px (`h-7 w-7`), p-0, centered icon.
5. **Semantic Links as Buttons**:
   * Use plain `<a>` tags with `class="btn-shadcn btn-shadcn-secondary btn-shadcn-sm"` (avoiding nested buttons or improper roles).

---

## 13. shadcn/ui Chart Tooltip Standard (indicator="line")

Reference: `shadcnComponents/chartTooltip.md`

All analytical charts (such as Attendance Trend spline charts and Truancy Radial/Donut charts) utilize the official shadcn/ui chart tooltip architecture with line indicator:

1. **Card Container (Dark Surface Palette)**:
   * Black glassmorphic surface: `background: rgba(17, 24, 39, 0.95); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); border: 1px solid rgba(255, 255, 255, 0.15); box-shadow: 0 10px 25px -4px rgba(0, 0, 0, 0.35); rounded-lg px-3 py-2 text-xs min-w-[145px]`.
   * Floating overlay with smooth transitions: `absolute opacity-0 pointer-events-none z-30 transition-opacity duration-150`.
   * Strictly contained: Position calculated using `clientX`/`clientY` clamped inside the parent card wrapper bounds to prevent spillover.
2. **Header Title**:
   * Date or category title: `font-semibold text-xs text-white pb-1 mb-1.5 border-b border-white/10`.
3. **Metric Item with Line Indicator (`indicator="line"`)**:
   * Colored vertical line: `w-1 h-3.5 rounded-full shrink-0` styled with the corresponding series/slice color (e.g. Cyan/Blue `#60a5fa` / `#3b82f6`, Red `#ef4444`, Orange `#f97316`, Purple `#8b5cf6`).
   * Metric label: `text-gray-300 text-xs font-normal`.
   * Metric value: `ml-auto font-mono font-bold text-white`.
4. **Radial / Donut Hover Dynamics**:
   * Hovering a slice or legend item:
     - Expands the hovered slice stroke (`stroke-width="15"` from `12`).
     - Dims non-hovered slices (`opacity: 0.45`).
     - Positions the tooltip with line indicator, category title, case count, and percentage share.
   * Mouseleave:
     - Resets stroke-width to `12` and opacity to `1`.
     - Hides tooltip.

---

## 14. Summary & KPI Stat Card Hover Interaction Standard

All summary and metric KPI cards across the entire application (**Admin, Teacher, and Student portals**) adhere to the unified 3D elevation and ambient glow hover interaction system defined in `assets/css/style.css`:

1. **Card Container Anatomy**:
   * Class hierarchy: `stat-card stat-card-<type> bg-white rounded-xl border border-[#e5e7eb] p-4 shadow-sm block group transition-all`
   * Cursor: `cursor: pointer` uniformly applied.
   * Motion timing: `transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.2s ease`.
2. **Universal Icon Micro-Interaction**:
   * Icon badge wrappers automatically scale upon hover via `.stat-card:hover .group-hover\:scale-105`, `.stat-card:hover .shrink-0[class*="rounded-"]`, and `.stat-card:hover > div > div:first-child[class*="rounded-"]` to create subtle depth and reactive feedback (`transform: scale(1.05)`).
3. **Semantic Color & Shadow Matrix on Hover**:
   * **Total / History / Excused / Registered (`.stat-card-total`, `.stat-card-history`, `.stat-card-excused`, `.stat-card-blue`, `[class*="hover:border-[#0030c2]"]`, `[class*="hover:border-[#2563eb]"]`)**:
     - Border: `border-color: #0030c2 !important`
     - Elevation & Glow: `transform: translateY(-2px) !important; box-shadow: 0 10px 20px -3px rgba(0, 48, 194, 0.16), 0 4px 6px -2px rgba(0, 48, 194, 0.08) !important;`
   * **Present / Approved / Active (`.stat-card-present`, `.stat-card-approved`, `.stat-card-green`, `[class*="hover:border-[#16a34a]"]`)**:
     - Border: `border-color: #16a34a !important`
     - Elevation & Glow: `transform: translateY(-2px) !important; box-shadow: 0 10px 20px -3px rgba(22, 163, 74, 0.16), 0 4px 6px -2px rgba(22, 163, 74, 0.08) !important;`
   * **Late / Pending / Warning (`.stat-card-late`, `.stat-card-pending`, `.stat-card-orange`, `[class*="hover:border-[#f97316]"]`)**:
     - Border: `border-color: #f97316 !important`
     - Elevation & Glow: `transform: translateY(-2px) !important; box-shadow: 0 10px 20px -3px rgba(249, 115, 22, 0.22), 0 4px 6px -2px rgba(249, 115, 22, 0.1) !important;`
   * **Absent / Rejected / Risk (`.stat-card-absent`, `.stat-card-rejected`, `.stat-card-red`, `[class*="hover:border-[#dc2626]"]`)**:
     - Border: `border-color: #dc2626 !important`
     - Elevation & Glow: `transform: translateY(-2px) !important; box-shadow: 0 10px 20px -3px rgba(220, 38, 38, 0.16), 0 4px 6px -2px rgba(220, 38, 38, 0.08) !important;`
   * **Violet / Purple Analytics (`.stat-card-purple`, `[class*="hover:border-[#7c3aed]"]`, `[class*="hover:border-[#8b5cf6]"]`, `[class*="hover:border-[#9333ea]"]`)**:
     - Border: `border-color: #8b5cf6 !important`
     - Elevation & Glow: `transform: translateY(-2px) !important; box-shadow: 0 10px 20px -3px rgba(139, 92, 246, 0.18), 0 4px 6px -2px rgba(139, 92, 246, 0.08) !important;`
   * **Sky Blue / Devices (`.stat-card-sky`, `[class*="hover:border-[#0284c7]"]`)**:
     - Border: `border-color: #0284c7 !important`
     - Elevation & Glow: `transform: translateY(-2px) !important; box-shadow: 0 10px 20px -3px rgba(2, 132, 199, 0.18), 0 4px 6px -2px rgba(2, 132, 199, 0.08) !important;`
   * **Indigo Academic Batches (`.stat-card-indigo`, `[class*="hover:border-[#4f46e5]"]`)**:
     - Border: `border-color: #4f46e5 !important`
     - Elevation & Glow: `transform: translateY(-2px) !important; box-shadow: 0 10px 20px -3px rgba(79, 70, 229, 0.18), 0 4px 6px -2px rgba(79, 70, 229, 0.08) !important;`

---

## 15. Topbar Notification Bell Component Standard

All views across Admin, Teacher, and Student portals adhere to the unified topbar notification bell architecture:

1. **Button Anatomy**:
   ```html
   <button id="{adminNotifBtn|teacherNotifBtn|studentNotifBtn}" onclick="toggleNotificationDropdown(event)"
     class="cursor-pointer relative text-[#6b7280] hover:text-[#111827] transition-colors"
     title="Notifications" aria-label="Notifications">
     <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.75">
       <path stroke-linecap="round" stroke-linejoin="round"
         d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
     </svg>
     <span class="absolute -top-1 -right-1 w-4 h-4 min-w-4 min-h-4 bg-[#0030c2] text-white text-[9px] font-semibold rounded-full flex items-center justify-center">3</span>
   </button>
   ```
2. **Container Sibling Spacing**:
   * Sibling topbar controls wrapper must maintain `flex items-center gap-4` for comfortable breathing room between notification trigger and user profile menu.
3. **Badge Alignment**:
   * Badges must strictly use `absolute -top-1 -right-1 w-4 h-4 min-w-4 min-h-4` to sit perfectly on the upper-right corner of the bell.
   * `btn-shadcn`, `p-1`, `top-0 right-0`, and `top-1 right-1` deviations are strictly prohibited.
4. **Behavioral Integration**:
   * Fully coordinated with `assets/js/common/notifications-flyout.js` for role-specific unread badge counting, flyout toggling, and storage sync.
