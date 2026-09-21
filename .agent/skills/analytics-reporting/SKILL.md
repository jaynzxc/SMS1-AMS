---
name: analytics-reporting
description: Standards for Chart.js visualizations, attendance KPI aggregation formulas, attendance rate calculations, habitual tardiness indexes, CSV downloads, and print/PDF export styling for the Bestlink College of the Philippines Attendance Monitoring System. Use when working on dashboards, reports-export, performance analytics, or class analytics.
---

# Performance Analytics & Centralized Reporting Skill (SMS1-AMS)

## Goal

Standardize analytical computations, KPI metrics, chart color aesthetics, and institutional export formats across Admin, Teacher, and Student portals to ensure 100% data consistency, adhering strictly to **Option 1 (Full Centralization of Reports & Export)**.

---

## 1. Centralized Reporting Architecture (Option 1 Standard)

To maintain clean separation of concerns and eliminate code bloat:

1. **NO Table-Level Export Actions:**
   * Individual operational tables (`attendance.html`, `tardy-list.html`, `absence-list.html`, `teacher-attendance.html`, `scan-logs.html`) MUST NOT render local "Export CSV" or "Export Excel" buttons.
   * Tables focus exclusively on operational search, multi-parameter filtering, and record verification.
2. **Dedicated Reporting Engine (`reports-export.html`):**
   * Submodule 10 is the single institutional source of truth for all data exports.
   * Supports 5 standardized reporting templates:
     1. **Daily Master Attendance Report**: Detailed roster of daily presences, lates, absences, and excused slips by section and date.
     2. **Official DepEd / CHED Form 137 / SF2 Attendance Component**: Official monthly consolidated attendance summary formatted for institutional compliance.
     3. **Habitual Truancy & Tardiness Roster**: Students exceeding institutional absence/tardy thresholds for intervention by the PREFECT Disciplinary module.
     4. **Faculty Daily Time Record (DTR) Summary**: Teacher check-in/out timestamps, late minutes, and rendered teaching hours for Academic HR payroll.
     5. **Parent SMS Notification Audit**: Complete log of outbound alerts dispatched to guardians, delivery timestamps, and gateway statuses.
3. **Supported Formats:**
   * **CSV**: Raw structured data dump for spreadsheet analysis.
   * **Microsoft Excel (`.xlsx`)**: Formatted workbook with bold headers, autofit columns, and institutional metadata.
   * **Printable PDF**: High-resolution official printable layout with institutional headers, DepEd/CHED compliance text, and signatory blocks.

---

## 2. Key Performance Indicators (KPI) & Mathematical Formulas

| Metric Name | Formula | Interpretation |
| :--- | :--- | :--- |
| **Attendance Rate (%)** | $\frac{\text{Present Days} + (\text{Tardy Days} \times 1.0) + \text{Excused Days}}{\text{Total Academic School Days}} \times 100$ | Overall student participation rate. |
| **Punctuality Rate (%)** | $\frac{\text{Present Days}}{\text{Present Days} + \text{Tardy Days}} \times 100$ | Measures on-time arrivals vs late arrivals. |
| **Habitual Tardy Threshold** | $\ge 3\text{ tardy instances in a month or } \ge 5\text{ in a semester}$ | Flags student for automated Prefect referral / parent alert. |
| **Chronic Truancy Threshold** | $\ge 3\text{ consecutive unexcused absences}$ | Triggers urgent parent SMS notification and Prefect disciplinary case. |
| **Perfect Attendance** | $\text{Absences} = 0 \text{ AND } \text{Tardy} \le 2$ over target semester | Qualifies student for Semester Perfect Attendance Award. |

---

## 3. Chart.js & SVG Visualization Standards

All analytical charts must follow the official BCP color system:

* **Present / On-Time**: Emerald Green (`rgba(22, 163, 74, 0.85)`) / Border: `#16a34a`
* **Late / Tardy**: Amber Orange (`rgba(249, 115, 22, 0.85)`) / Border: `#f97316`
* **Absent**: Crimson Red (`rgba(220, 38, 38, 0.85)`) / Border: `#dc2626`
* **Excused**: Blue (`rgba(0, 48, 194, 0.85)`) / Border: `#0030c2`
* **Honors / Award**: Purple (`rgba(124, 58, 237, 0.85)`) / Border: `#7c3aed`
* **Background Grid**: `#f3f4f6`
* **Font Family**: `Inter, system-ui, -apple-system, sans-serif`

```javascript
export const CHART_PALETTE = {
  present: { bg: 'rgba(22, 163, 74, 0.15)', border: '#16a34a' },
  late: { bg: 'rgba(249, 115, 22, 0.15)', border: '#f97316' },
  absent: { bg: 'rgba(220, 38, 38, 0.15)', border: '#dc2626' },
  excused: { bg: 'rgba(0, 48, 194, 0.15)', border: '#0030c2' },
  honor: { bg: 'rgba(124, 58, 237, 0.15)', border: '#7c3aed' }
};
```

---

## 4. Print & PDF Export Styling Guidelines

When generating printable reports via `window.print()` or PDF exporters:

1. **CSS `@media print` Rules:**
   * Hide sidebars, top headers, search inputs, and navigation buttons (`.no-print { display: none !important; }`).
   * Force backgrounds to print: `-webkit-print-color-adjust: exact; print-color-adjust: exact;`.
   * Set paper size to standard Letter / A4 portrait or landscape based on report breadth.
2. **Official Institutional Header:**
   * Bestlink College of the Philippines official logo.
   * Institutional address and department title.
   * Form title (e.g. *School Form 2 - Daily Attendance Record*).
   * Academic Year, Semester, Section, and Date Generated.
3. **Official Signatory Blocks:**
   * *Prepared by:* Subject Teacher / Adviser
   * *Verified by:* Department Head / Dean
   * *Noted by:* Office of Student Affairs / Prefect of Discipline

---

## 5. Monthly Attendance Bar Chart Lifecycle Specification (12-Month View)

To ensure visual, structural, and behavioral consistency across all performance analytics modules (`admin/performance-analytics.html`, `teacher/class-analytics.html`, and `student/performance-analytics.html`):

1. **3-Tier Progressive Color Lifecycle & Unified ViewBox (`0 0 600 226`):**
   - **Header Layout:** Clean card header separated by a border divider (`border-b border-[#e5e7eb] pb-3 mb-2`), containing Title, Subtitle, and right-aligned badge (`A.Y. 2025-2026`) to achieve 100% pixel-height symmetry with the adjacent Daily Attendance Trend card.
   - **Unified Scale:** Uses `viewBox="0 0 600 226"` and `class="w-full h-56 sm:h-60 overflow-visible cursor-pointer"`, perfectly matching the line chart's Cartesian grid lines (`x1="36" x2="590"`), Y-axis baseline (`195`), and right-aligned percentages (`x="30"`).
   - **Past Months:** Light Blue (`#60a5fa`) with rounded pill corners (`rx="7"`), displaying attendance rate percentage directly centered on top.
   - **Present Month:** Dark Primary Blue (`#0030c2`) with active highlight glow and bold percentage centered on top.
   - **Future Months:** Neutral Gray (`#f1f5f9` ghost pill pillar with `#cbd5e1` dashed stroke). **NO percentage labels above future bars** (leaving top space clean and uncluttered).

2. **Interactive Hover Rules (Anti-Bounce Simplified Date & Rate Tooltip):**
   - **Past & Present:** Magnetic snapping guide + floating glassmorphism tooltip clamped strictly within the card frame (`#trendChartTooltip` and `#barChartTooltip`). The content is kept hyper-clean and simplified to display **only the Date/Month and Attendance Rate (%)** (e.g. `Rate: 97.20%`). Extra badges, headcount numbers, and on-time counters are omitted to prevent visual clutter and distraction.
   - **Anti-Bounce Stabilization:** Bar chart tooltip is anchored at a stable `top: 8px` and centered horizontally on the active bar's SVG center coordinate (`(closest.center / 600) * containerRect.width`), preventing vertical flip jitter when hovering tall bars. All SVG text labels above bars must have `pointer-events-none select-none` to prevent mouse event collision and hover flickering.
   - **Future Months:** When the cursor hovers over future gray bars, **NO attendance details are displayed** (displays only the month and an italicized `No records` notice, with zero rates or metrics).

3. **Continuous Spec Alignment Rule:**
   - Whenever any UI/UX component or interaction is modified, immediately synchronize related agent skill specifications (`analytics-reporting`, `ui-ux`, `system-flow`) to keep all future AI workflows perfectly aligned.

---

## 6. Daily Attendance Trend Line Chart Specification (Interactive Natural Spline)

Referencing modern UI benchmarks (`line_chartUI.md`), the daily attendance trend line chart must adhere to the following standards:

1. **Card Header with Horizontal Divider & Time Range Filter:**
   - **Title & Description:** Clear card title (`Attendance Trend`) with descriptive subtitle (`Daily attendance monitoring & trends`).
   - **Divider:** Standard border divider (`border-b border-[#e5e7eb] pb-4 mb-3`) separating header controls cleanly from the chart canvas.
   - **Time Range Selector:** Clean dropdown select (`#trendTimeRange`) supporting `Last 30 days`, `Last 14 days`, and `Last 7 days`. Changing selection dynamically recalibrates coordinates and re-renders the curve, data points, and X-axis ticks without full-page reloads.

2. **Smooth Natural Cubic Spline (`type="natural"`):**
   - Must use cubic Bezier curves (`M ... C ...`) rather than sharp, jagged polyline vectors to ensure organic fluid visual curves.
   - Closed area fill (`#trendAreaPath`) using soft luminous vertical gradient (`#trendAreaGradient` with 0.3 opacity at crest tapering to 0.01 at base).
   - Minimal Cartesian horizontal-only grid lines (`vertical={false}`).

3. **Interactive Cursor & Tooltip Specification:**
   - Vertical dashed snapping magnetic guide snaps immediately to the closest data point.
   - Active data point dynamically enlarges (`r="6"`) for immediate feedback.
   - Tooltip contains **Date**, **Indicator Dot** (matching metric color), and **Attendance Rate** (e.g., `* Rate: 97.20%`), clamped strictly within container bounds to prevent overflow.


