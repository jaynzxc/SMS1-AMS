---

name: ui-ux
description: UI/UX design standards, component anatomy, styling rules, color palettes, and benchmark reference files for the Bestlink College of the Philippines Attendance Monitoring System. Use when creating or refining frontend pages, layouts, cards, modals, or topbars.
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

# UI/UX Design System Skill (SMS1-AMS)

## Goal

Ensure 100% visual and structural consistency across all portals (**Admin**, **Teacher**, and **Student**) without requiring the user to repeatedly specify reference files or layout instructions.

---

## 1. Official Reference Standards (Golden Benchmarks)

When creating or modifying any page, ALWAYS consult these reference benchmark files first:

| Role Panel | Benchmark Reference File | Use As Reference For |
| :--- | :--- | :--- |
| **Student Panel** | [`student/attendance-calendar.html`](file:///c:/Users/jaync/Desktop/Attendance%20Monitoring/SMS1-AMS/student/attendance-calendar.html) | Main shell layout, sidebar, topbar header, KPI summary cards, filter bars, tables, modal dialogs, and toast system. |
| **Student Analytics** | [`student/performance-analytics.html`](file:///c:/Users/jaync/Desktop/Attendance%20Monitoring/SMS1-AMS/student/performance-analytics.html) | SVG charts, metric progress bars, analytics cards, subject compliance gauges. |
| **Teacher Panel** | [`teacher/class-analytics.html`](file:///c:/Users/jaync/Desktop/Attendance%20Monitoring/SMS1-AMS/teacher/class-analytics.html) & [`teacher/attendance-calendar.html`](file:///c:/Users/jaync/Desktop/Attendance%20Monitoring/SMS1-AMS/teacher/attendance-calendar.html) | Teacher sidebar, evaluation grids, class filters, scan status, approval modals. |
| **Admin Panel** | [`admin/attendance-calendar.html`](file:///c:/Users/jaync/Desktop/Attendance%20Monitoring/SMS1-AMS/admin/attendance-calendar.html) & [`admin/performance-analytics.html`](file:///c:/Users/jaync/Desktop/Attendance%20Monitoring/SMS1-AMS/admin/performance-analytics.html) | Admin sidebar, system-wide metrics, configuration controls, user tables, audit logs. |

---

## 2. Technology & Pipeline Standards

* **Strictly Pure HTML5 + Compiled Tailwind CSS + Vanilla JavaScript**:
  * **DO NOT** import `<script src="https://cdn.tailwindcss.com"></script>`. The project uses a compiled CSS pipeline.
  * Always link stylesheets in the `<head>`:
    ```html
    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">

    <!-- Stylesheets -->
    <link rel="stylesheet" href="../assets/css/output.css">
    <link rel="stylesheet" href="../assets/css/style.css">
    ```
* **No Framework Injections**: Do NOT introduce React, Vue, Angular, Bootstrap, jQuery, or PHP templates.
* **No External Icon Libraries (FontAwesome/Bootstrap Icons)**: Use clean inline SVG icons styled with Tailwind (`stroke-width="1.75"` or `2`, `fill="none"`, `stroke="currentColor"`).

---

## 3. Core Color Palette & Token Rules

All interfaces follow the Bestlink College of the Philippines institutional design system:

| Token / Usage | Tailwind Class | Hex Value | Application |
| :--- | :--- | :--- | :--- |
| **Primary Brand** | `text-[#0030c2]`, `bg-[#0030c2]` | `#0030c2` | Primary buttons, active nav pills, key highlights, progress bars. |
| **Primary Hover** | `hover:bg-[#002699]` | `#002699` | Button hover state. |
| **Primary Soft Tint** | `bg-[#eff6ff]`, `bg-[#e7edff]` | `#eff6ff` / `#e7edff` | Active menu backgrounds, primary icon badge backgrounds. |
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

## 4. Standard Page Shell & Layout Anatomy

Every page inside the panels MUST follow this standard layout shell:

```html
<body class="bg-[#f8fafc] text-[#111827]">
  <div class="flex h-screen overflow-hidden">

    <!-- 1. SIDEBAR (Width: w-64, fixed shrink-0, white background, right border) -->
    <aside id="mainSidebar" class="w-64 bg-white border-r border-[#e5e7eb] flex flex-col shrink-0 h-full overflow-y-auto sidebar-fixed">
      <!-- Logo Header: 32px rounded-full primary icon, Title: ATTENDANCE MONITORING, Subtitle: [Role] Panel -->
      <!-- Navigation Menu: flex-1 py-2 px-2.5 space-y-0.5 with SVG icons -->
    </aside>

    <!-- 2. MAIN SCROLL CONTAINER -->
    <div class="flex-1 flex flex-col min-w-0 h-full overflow-y-auto main-scroll">

      <!-- TOPBAR HEADER (Sticky top-0, h-14, border-b, backdrop-blur-sm bg-white/95) -->
      <header class="h-14 border-b border-[#e5e7eb] flex items-center justify-between px-4 shrink-0 sticky top-0 z-10 bg-white/95 backdrop-blur-sm">
        <div class="flex items-center gap-3 min-w-0">
          <button class="burger-btn text-[#6b7280] hover:text-[#111827] focus:outline-none p-1.5 rounded-lg shrink-0">
            <!-- Burger SVG -->
          </button>
          <h1 class="text-base font-bold text-[#111827] truncate">Page Title</h1>
        </div>

        <div class="flex items-center gap-4 shrink-0">
          <!-- Notification Bell with Count Badge -->
          <!-- User Profile Pill Button with Dropdown (NO external unauthenticated image URLs; use SVG avatar) -->
        </div>
      </header>

      <!-- PAGE CONTENT AREA (p-5 space-y-5) -->
      <main class="flex-1 p-5 space-y-5">
        <!-- Page Title & Subtitle + Date Display Badge -->
        <!-- KPI Summary Cards Grid (5-column grid: grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5) -->
        <!-- Primary Interactive Cards / Tables / Modals -->
      </main>

    </div>
  </div>
</body>
```

---

## 5. Component Anatomy & Design Patterns

### A. KPI Summary Cards (5-Column Grid)
* **Container**: `stat-card bg-white rounded-xl border border-[#e5e7eb] p-3.5 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all`
* **Icon Box**: `w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border` (using the specific semantic color tint).
* **Metric Value**: `text-xl font-extrabold truncate`.
* **Subtext**: `mt-2.5 flex items-center justify-between text-[11px] font-medium truncate`.
* **Direct Navigation**: Cards should link directly (`href="#section"` or `href="page.html"`) to their respective target records.

### B. Tables
* **Wrapper**: `bg-white rounded-xl border border-[#e5e7eb] shadow-xs overflow-hidden`
* **Toolbar / Header**: `p-4 border-b border-[#e5e7eb] flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white`
* **Table Header (`thead`)**: `border-b border-[#e5e7eb] bg-[#f9fafb] text-[11px] font-bold text-[#6b7280] uppercase tracking-wider`
* **Row (`tr`)**: `border-b border-[#f3f4f6] hover:bg-gray-50/75 transition-colors`
* **Typography**: `text-xs text-[#374151]`

### C. Status Pills & Badges
* **Always use unified round pills**: `inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border`
* **Present / Pass**: `bg-[#f0fdf4] text-[#16a34a] border-[#bbf7d0]`
* **Late / Warning**: `bg-[#fff7ed] text-[#f97316] border-[#fed7aa]`
* **Absent / Danger**: `bg-[#fef2f2] text-[#dc2626] border-[#fecaca]`
* **Excused / Info**: `bg-[#eff6ff] text-[#0030c2] border-[#bfdbfe]`
* **Award / Conferred**: `bg-[#f5f3ff] text-[#7c3aed] border-[#ddd6fe]`

### D. Modal Dialogs
* **Backdrop**: `fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4`
* **Card Frame**: `bg-white rounded-2xl max-w-md (or max-w-4xl) w-full shadow-2xl border border-[#e5e7eb] overflow-hidden flex flex-col animate-scale-in`
* **Header**: `px-5 py-4 border-b border-[#e5e7eb] flex items-center justify-between bg-white`
* **Body**: `p-5 overflow-y-auto space-y-4 text-xs`
* **Footer**: `p-4 border-t border-[#e5e7eb] bg-gray-50 flex items-center justify-between gap-2`
* **Accessibility & UX**: Must close via the close button, clicking the backdrop, and pressing `Escape`.

### E. Notification Toasts
* **Container**: Fixed at `#toastContainer` (`fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none`).
* **Toast Box**: `bg-white border border-[#e5e7eb] shadow-xl rounded-xl p-3.5 flex items-start gap-3 min-w-[280px] max-w-sm pointer-events-auto`.

---

## 6. Role-Specific UX Rules

1. **Student Panel (Strictly Read-Only)**:
   * Students are viewers and recipients only.
   * **Never** include administrative archive tools, configuration sliders, attendance edit buttons, or self-service certificate printing/downloads.
   * Settings links are removed from headers and sidebars.
2. **Teacher Panel**:
   * Evaluates class sections, inputs or monitors scans, verifies excuse slips, and endorses awards.
3. **Admin Panel**:
   * Full configuration, policy thresholds, user management, and official conferment authority.

---

## 7. Developer Pre-Flight Checklist

Before finishing any UI change or creating a new page:
- [ ] Stylesheet links point to `output.css` and `style.css` (NO Tailwind CDN script).
- [ ] Font is Inter (`font-family: 'Inter', sans-serif`).
- [ ] Topbar title, notification bell (with unread badge), and profile pill match the reference files.
- [ ] Summary cards use the standard 5-column responsive grid and hover elevation.
- [ ] Status badges match the institutional color tokens.
- [ ] JavaScript syntax is verified with `node -c assets/js/...`.
- [ ] No regression or visual discrepancy with the role benchmark file.
