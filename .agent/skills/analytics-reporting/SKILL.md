---
name: analytics-reporting
description: Standards for Chart.js visualizations, attendance KPI aggregation formulas, attendance rate calculations, habitual tardiness indexes, CSV downloads, and print/PDF export styling for the Bestlink College of the Philippines Attendance Monitoring System. Use when working on dashboards, reports-export, performance analytics, or class analytics.
---

# Performance Analytics & Reporting Skill (SMS1-AMS)

## Goal

Standardize analytical computations, KPI metrics, chart color aesthetics, and export formats across Admin, Teacher, and Student portals to ensure 100% data consistency for capstone evaluation.

---

## 1. Key Performance Indicators (KPI) & Mathematical Formulas

| Metric Name | Formula | Interpretation |
| :--- | :--- | :--- |
| **Attendance Rate (%)** | $\frac{\text{Present Days} + (\text{Tardy Days} \times 1.0) + \text{Excused Days}}{\text{Total Academic School Days}} \times 100$ | Overall student participation rate. |
| **Punctuality Rate (%)** | $\frac{\text{Present Days}}{\text{Present Days} + \text{Tardy Days}} \times 100$ | Measures on-time arrivals vs late arrivals. |
| **Habitual Tardy Threshold** | $\ge 3\text{ tardy instances in a calendar month or } \ge 5\text{ in a semester}$ | Flags student for automated guidance counseling / parent alert. |
| **Chronic Absence Threshold** | $\ge 3\text{ unexcused absences}$ | Triggers urgent parent SMS notification and risk warning. |
| **Perfect Attendance** | $\text{Absences} = 0 \text{ AND } \text{Tardy} = 0$ over target semester | Qualifies student for Certificate of Perfect Attendance. |

---

## 2. Chart.js Styling Standards

All analytical charts must follow the official BCP color system:

* **Present / On-Time**: Emerald Green (`rgba(16, 185, 129, 0.85)`) / Border: `#059669`
* **Late / Tardy**: Amber Yellow (`rgba(245, 158, 11, 0.85)`) / Border: `#d97706`
* **Absent**: Crimson Red (`rgba(239, 68, 68, 0.85)`) / Border: `#dc2626`
* **Excused**: Blue (`rgba(59, 130, 246, 0.85)`) / Border: `#2563eb`
* **Background Grid**: `#f1f5f9` (Light) or `#334155` (Dark)
* **Font Family**: `Inter, system-ui, -apple-system, sans-serif`

```javascript
// Standard Chart Defaults
export const CHART_PALETTE = {
    present: { bg: 'rgba(16, 185, 129, 0.2)', border: '#10b981' },
    tardy: { bg: 'rgba(245, 158, 11, 0.2)', border: '#f59e0b' },
    absent: { bg: 'rgba(239, 68, 68, 0.2)', border: '#ef4444' },
    excused: { bg: 'rgba(59, 130, 246, 0.2)', border: '#3b82f6' },
};
```

---

## 3. Print & PDF Export Styling Guidelines

When generating printable reports via `window.print()` or `html2pdf`:

1. Apply CSS `@media print`:
   - Hide sidebars, top headers, search inputs, and filter buttons (`.no-print { display: none !important; }`).
   - Force backgrounds to print: `-webkit-print-color-adjust: exact; print-color-adjust: exact;`.
   - Set paper size to Letter/A4 portrait or landscape based on report breadth.
2. Include the official **Bestlink College of the Philippines** header:
   - Institution Logo
   - College Name & Address
   - Report Title & Date Range Generated
   - Signature Blocks: Prepared by (Teacher/Staff), Verified by (Admin/Dean).
