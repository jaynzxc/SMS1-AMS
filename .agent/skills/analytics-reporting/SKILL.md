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
