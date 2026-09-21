---
name: architecture
description: Design system architecture, module relationships, workflows, folder responsibilities, and data flow for the Bestlink College of the Philippines Attendance Monitoring System. Use when analyzing architecture before implementation or documentation.
---

# Architecture Skill (SMS1-AMS)

## Goal

Design and maintain a clean, resilient, and scalable architecture using **HTML5**, **Compiled Tailwind CSS**, **Vanilla JavaScript (ES6 Modules)**, **Supabase PostgreSQL**, and **IoT Hardware (ESP32 + RC522)** for the Bestlink College of the Philippines Attendance Monitoring System (AMS).

---

## 1. Architectural Principles & Constraints

1. **No External Frameworks:** Do NOT introduce React, Vue, Angular, jQuery, PHP, or Laravel. Preserve the lightweight Vanilla JS + HTML5 architecture.
2. **Compiled CSS Pipeline:** Styles must strictly use `assets/css/output.css` and `assets/css/style.css`. Never inject runtime Tailwind CDN scripts.
3. **Strict 10-Submodule Taxonomy:** The system strictly adheres to the 10 official submodules:
   1. Daily Attendance Marking
   2. RFID / QR Scanning
   3. Tardy & Absence Logs
   4. Teacher Attendance
   5. Excuse Slip Submission
   6. Attendance Calendar
   7. Alerts to Parents
   8. Analytics Dashboard
   9. Perfect Attendance Award Tool
   10. CSV / Excel Export
4. **Scope Boundary (`academic-management` Excluded):** Curriculum, syllabus, and course catalog management belong to the upstream SMS 1 Academic Module. AMS navigation strictly omits `academic-management.html` to eliminate scope overlap.
5. **Centralized Reporting Engine (Option 1):** Table-level export buttons and redundant modal markup on individual module pages are eliminated. All data extraction, CSV, Excel, and printable PDF compliance sheets are strictly centralized in Submodule 10 (`reports-export.html`).
6. **Strict Role-Based Directory Boundaries:**
   * `admin/`: Campus-wide administration, policy setup, audits, master logs, conferment, and user management.
   * `teacher/`: Daily attendance roster, live classroom kiosk scanner, first-line excuse reviews, faculty DTR.
   * `student/`: Personal attendance records, calendar, dynamic QR badge, dual-option excuse submission, and award verification.
7. **Defense-in-Depth:** Frontend route guards + Client JWT Bearer tokens + Hardware Anti-Passback + Supabase PostgreSQL Row Level Security (RLS).
8. **Cross-Panel Synchronization:** Actions in one panel must cascade state consistently across other roles as defined in `.agent/skills/system-flow/SKILL.md`.

---

## 2. Architecture Layers & SMS 1 Master Ecosystem

```
                  +---------------------------------------------------+
                  |           SMS 1 SHARED DATA LAYER                 |
                  |  - users / profiles (rfid_uid, qr_hash, role)     |
                  |  - academic_calendar (school_year, term, holidays)|
                  +---------------------------------------------------+
                                           |
                                           v
+-----------------------------------------------------------------------------------------+
|                       ATTENDANCE MONITORING SYSTEM (AMS)                                |
|  - daily_attendance        - tardy_records       - rfid_qr_scan_logs                     |
|  - teacher_attendance      - absence_records     - excuse_slips                         |
+-----------------------------------------------------------------------------------------+
       |                         |                       |                    |
       v                         v                       v                    v
+---------------+        +---------------+       +---------------+    +---------------+
| 1. CLINIC     |        | 2. PREFECT OF |       | 3. ACADEMIC HR|    | 4. OSAS &     |
|   MANAGEMENT  |        |    DISCIPLINE |       |   MANAGEMENT  |    |    EVENTS     |
| Excuse Slips  |        | Habitual      |       | Faculty DTR   |    | Clearance &   |
| Clinic Passes |        | Truancy Cases |       | Gate Logs     |    | Perfect Award |
+---------------+        +---------------+       +---------------+    +---------------+
```

### Presentation Tier
* Semantic HTML5 + Compiled Tailwind CSS.
* Role-specific panels: `/admin/`, `/teacher/`, `/student/`.
* Components strictly follow `.agent/skills/ui-ux/SKILL.md` with centralized export navigation.

### Client Application Tier
* Modular Vanilla JavaScript (ES6).
* Shared Auth & Page Guards: `assets/js/common/auth.js`.
* Supabase JS Client: `assets/js/config/supabaseClient.js` (public `anonKey` ONLY; zero `service_role` exposure).

### IoT Hardware & Scanning Tier
* ESP32 Microcontroller + RC522 13.56 MHz RFID Reader.
* Web-based Camera QR Scanner (`live-scanner.html`) with dual-mode support (Classroom vs. Campus Event).
* 5-minute Anti-Passback Cooldown Engine.
* Automated Parent SMS Dispatch Gateway.

### Database & Storage Tier
* Supabase PostgreSQL with 100% Row Level Security (RLS).
* Supabase Auth (Salted Bcrypt, 2FA/OTP support).
* Supabase Storage Bucket for excuse slip attachments (external medical certificates or clinic passes <= 5MB).
* Immutable Security Audit Log: `user_activity`.

---

## 3. Analysis & Review Workflow

Before proposing or modifying system architecture:

1. **Identify Involved Modules:** Map the target feature across Admin, Teacher, and Student panels against the 10 official submodules.
2. **Verify Data Flow:** Trace data from ingestion (RFID tap / QR scan / form input) to database commit and downstream panel reflections.
3. **Map Files & Responsibilities:** Clearly distinguish UI layout (`.html`), client controller (`assets/js/`), and database table/RLS impact.
4. **Enforce Security Boundaries:** Ensure students cannot execute unauthorized state mutations (e.g. attendance logs or award generation).
5. **Verify Centralized Export:** Ensure no redundant export buttons or modal scripts are added to individual operational tables.

---

## 4. Required Output Format

When generating architectural analysis:

1. **Architecture Overview:** Concise summary of the module within the 4-tier model.
2. **Module Responsibilities:** Clear breakdown for Admin, Teacher, and Student roles mapped to the 10 official submodules.
3. **Data Flow & Sequence Diagram:** Mermaid diagram showing data ingestion to display.
4. **Folder & File Mapping:** Exact file paths created or modified.
5. **Database & RLS Impact:** Affected tables, foreign keys, and RLS policies.
6. **Security Considerations:** Anti-XSS, CSRF, input validation, and audit logging.
7. **Cross-Module SMS 1 Integration Touchpoints:** Document connections to Clinic, Prefect, Academic HR, OSAS, or School Events.
