# Color Palette Specification

**Project:** Bestlink College of the Philippines — Attendance Monitoring System (SMS1-AMS)  
**Standard:** Institutional Design System  

---

## 1. The 4 Solid Core Colors

The core visual identity and status indicators across all portals (Admin, Teacher, and Student) are anchored by four primary colors:

| Color Name | Role | Hex Code | RGB | Tailwind Class |
| :--- | :--- | :--- | :--- | :--- |
| **Brand Primary (Blue)** | Primary actions, navigation highlights, brand accents, chart splines | `#0030c2` | `rgb(0, 48, 194)` | `bg-[#0030c2]`, `text-[#0030c2]` |
| **Success (Green)** | Present status, verified logs, online devices, high compliance | `#16a34a` | `rgb(22, 163, 74)` | `bg-[#16a34a]`, `text-[#16a34a]` |
| **Warning (Orange)** | Tardy arrivals, pending approvals, warning thresholds, attention needed | `#f97316` | `rgb(249, 115, 22)` | `bg-[#f97316]`, `text-[#f97316]` |
| **Danger (Red)** | Absent status, offline devices, rejected requests, critical security alerts | `#dc2626` | `rgb(220, 38, 38)` | `bg-[#dc2626]`, `text-[#dc2626]` |

---

## 2. Interactive States & Soft Tints

Each of the four core colors has an associated dark hover shade, light tint background, and accent border for pill badges, filters, and card states:

### 1. Brand Primary
* **Base:** `#0030c2`
* **Hover / Dark:** `#002699`
* **Soft Tint Background:** `#eff6ff`
* **Border Accent:** `#bfdbfe`
* **Hover Tint:** `#dbeafe`

### 2. Success / Present
* **Base:** `#16a34a`
* **Hover / Dark:** `#15803d`
* **Soft Tint Background:** `#f0fdf4`
* **Border Accent:** `#bbf7d0`
* **Hover Tint:** `#dcfce7`

### 3. Warning / Tardy
* **Base:** `#f97316`
* **Hover / Dark:** `#ea580c`
* **Soft Tint Background:** `#fff7ed`
* **Border Accent:** `#fed7aa`
* **Hover Tint:** `#ffedd5`

### 4. Danger / Absent
* **Base:** `#dc2626`
* **Hover / Dark:** `#b91c1c`
* **Soft Tint Background:** `#fef2f2`
* **Border Accent:** `#fecaca`
* **Hover Tint:** `#fee2e2`

---

## 3. Neutral Foundation

The neutral scale provides contrast, structure, and readability across data tables, sidebars, and application shells:

| Element | Hex Code | RGB | Tailwind Class | Usage |
| :--- | :--- | :--- | :--- | :--- |
| **Canvas Background** | `#f8fafc` | `rgb(248, 250, 252)` | `bg-[#f8fafc]` | Page canvas behind cards |
| **Card / Surface** | `#ffffff` | `rgb(255, 255, 255)` | `bg-white` | Cards, sidebars, topbars, modals |
| **Primary Text** | `#111827` | `rgb(17, 24, 39)` | `text-[#111827]` | Headings, primary values, active labels |
| **Secondary Text** | `#374151` | `rgb(55, 65, 81)` | `text-[#374151]` | Form labels, table content |
| **Muted Text** | `#6b7280` | `rgb(107, 114, 128)` | `text-[#6b7280]` | Subtitles, timestamps, breadcrumbs |
| **Border / Divider** | `#e5e7eb` | `rgb(229, 231, 235)` | `border-[#e5e7eb]` | Card outlines, table rows, input strokes |
| **Subtle Divider** | `#f3f4f6` | `rgb(243, 244, 246)` | `border-[#f3f4f6]` | Inner dividers, alternate striping |

---

## 4. Extended Institutional Accent

| Color Name | Role | Hex Code | Soft Tint BG | Border Accent | Tailwind Class |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Honor / Purple** | Perfect attendance awards, certificates, conferred recognitions | `#7c3aed` | `#f5f3ff` | `#ddd6fe` | `text-[#7c3aed]`, `bg-[#7c3aed]` |

---

## 5. Typography Standard (Inter)

The system is standardized on the **Inter** font family across all roles, dashboards, data tables, and print outputs:

* **Primary Font Family:** `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`
* **Google Fonts Import:** `https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap`
* **Weights in Active Use:**
  * `400 (Regular)`: Table body text, explanatory helper text, modal descriptions.
  * `500 (Medium)`: Input fields, breadcrumbs, secondary meta labels.
  * `600 (SemiBold)`: Card titles, table column headers (`thead th`), interactive buttons, status badges.
  * `700 (Bold)`: KPI summary statistics, page main `<h1>` headers, modal dialog titles.
  * `800 (ExtraBold)`: Key metrics, CHED accreditation headers, brand wordmark.

---

## 6. UI/UX Modernization Specification (`--preset b1Z5bagIi`)

The system implements the **Vega** minimal dashboard architectural style decoded from `--preset b1Z5bagIi`:

* **Style Identity:** `vega` (Sleek SaaS dashboard layout, crisp 1px borders, minimal visual friction).
* **Base Surface Canvas:** `#f8fafc` (Slate neutral background canvas).
* **Card Elevation:** Pure `#ffffff` container cards wrapped in `border border-[#e5e7eb] rounded-xl shadow-xs`.
* **Corner Radius Standards:**
  * Small inputs, badges, buttons: `rounded-lg` (`8px`)
  * Container cards, summary stat tiles: `rounded-xl` (`12px`)
  * Modal dialog cards, scanner viewports: `rounded-2xl` (`16px`)
* **Menu Accent:** `subtle` navigation active indicators (`bg-[#eff6ff]` with `#0030c2` text and left accent bar).
* **Iconography:** Pure vector inline SVGs (Lucide icon set, strictly zero emojis).

