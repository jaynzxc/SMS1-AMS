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
6. **Excuse Slip Management** (`admin/excuse-slip/pending-requests.html`)
7. **Attendance Calendar** (`admin/attendance-calendar.html`)
8. **Parent Alerts** (`admin/parent-alerts.html`)
9. **Perfect Attendance** (`admin/perfect-attendance.html`)
*Footer Item:* **User Management** (`admin/user-management.html`)

*(Rule: `academic-management.html` is strictly omitted from the navigation menu as academic curriculum belongs to the upstream SMS 1 Academic Module. The standalone `reports-export.html` module is retired in favor of universal table-level export modals).*

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


