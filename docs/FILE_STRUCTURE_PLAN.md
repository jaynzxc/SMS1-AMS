# SMS1-AMS Project File Structure Plan & Organization

**Capstone Project:** Design and Development of an Attendance Monitoring System for Bestlink College of the Philippines with Performance Analytics and RFID/QR Scanning  
**Target Platform:** Pure Vanilla HTML5, Tailwind CSS v4, Modular JavaScript (ESM), Supabase (PostgreSQL with RLS)

---

## 1. Executive Summary

This document establishes the official file structure standard and cleanup plan for the **SMS1-AMS** repository. The goal is to ensure high maintainability, clear folder responsibilities, strict separation of concerns, and clean academic documentation suitable for capstone defense and future scaling.

---

## 2. Restructuring & Simplification Standards (Phase 2)

1. **Strict 10-Submodule Taxonomy**:
   * The entire system is structured around the 10 official AMS submodules:
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

2. **Scope Demarcation (`academic-management` Excluded)**:
   * `academic-management.html` is removed from AMS primary navigation. Curriculum, course syllabi, and academic program configurations belong to the upstream SMS 1 Academic Module.

3. **Universal Table-Level Export Standard (`export-modal.js`)**:
   * Dedicated `reports-export.html` pages have been eliminated across all portals.
   * Every operational table includes a contextual **Export** button triggering an interactive modal form (`#bcpUniversalExportModal`).
   * Supports 4 standard formats: **CSV**, **EXCEL** (`.xlsx`), **PDF** (Printable CHED Collegiate Sheet), and **WORD** (`.doc`).
   * Institutional documentation strictly adheres to **CHED (Commission on Higher Education)** collegiate compliance standards (Colleges/Departments, Degree Programs, Semester/Academic Year, and formal collegiate signatories).

4. **SMS 1 Cross-Module Integration Bridges**:
   * Documentation of data flows and bridge schemas connecting AMS to the 5 companion SMS 1 systems:
     * Clinic Management (`excuse_slips.clinic_visit_id`)
     * PREFECT Disciplinary Action (`absence_records.is_habitual_truancy`)
     * Academic HR Management (`teacher_attendance.rendered_hours`)
     * OSAS (`perfect_attendance_awards.osas_endorsement_status`)
     * School Events (`rfid_qr_scan_logs.event_id`)

---

## 3. Official File Structure

```text
SMS1-AMS/
├── .agent/                             # Agent Skills & Workflows (14 domain skills)
│   └── skills/
│       ├── architecture/               # System architecture & 10-submodule taxonomy
│       ├── database/                   # Supabase schema & SQL planning
│       ├── debugging/                  # Systematic bug triage
│       ├── documentation/              # Academic technical writing
│       ├── planning/                   # Feature breakdown & planning
│       ├── rbac/                       # Role-based access control
│       ├── security/                   # Session lifecycle & RLS rules
│       ├── system-flow/                # Cross-panel module connections & SMS 1 flows
│       ├── ui-ux/                      # UI design standards & benchmarks
│       ├── ui-ux_backend_spec/         # Component query shapes & payload contracts
│       ├── rfid-qr-hardware/          # Hardware scanner & USB HID specifications
│       ├── analytics-reporting/        # Attendance calculation & Chart.js guidelines
│       ├── parent-alerts-sms/          # Parent SMS notification dispatch engine
│       └── qa-seed-data/               # Mock seed scripts & test scenarios
│
├── admin/                              # Administrator Portal (10 Official Submodules)
│   ├── dashboard.html                  # Submodule 8: Analytics Dashboard
│   ├── performance-analytics.html      # Submodule 8: In-Depth Institutional Trends
│   ├── attendance.html                 # Submodule 1: Daily Attendance Marking & Override
│   ├── rfid-and-qr/                    # Submodule 2: RFID & QR Scanning Management
│   │   ├── rfid-registry.html
│   │   ├── qr-management.html
│   │   ├── scan-logs.html
│   │   └── device-management.html      # IoT Terminal & Hardware Fleet Management
│   ├── tardy-and-absence/              # Submodule 3: Tardy & Absence Logs
│   │   ├── tardy-list.html
│   │   ├── absence-list.html
│   │   └── habitual-offender.html
│   ├── teacher-attendance.html         # Submodule 4: Teacher Attendance & HR DTR Audit
│   ├── excuse-management.html          # Submodule 5: Excuse Management (Unified Module with Pending, Approved, Rejected, & History)
│   ├── attendance-calendar.html        # Submodule 6: Attendance Calendar
│   ├── parent-alerts.html              # Submodule 7: Alerts to Parents (SMS Log)
│   ├── perfect-attendance.html         # Submodule 9: Perfect Attendance Award Tool
│   ├── audit-logs.html                 # Immutable Security & Mutation Audit Ledger
│   ├── user-management.html            # System Role Management
│   ├── profile.html                    # Admin Account Profile
│   └── settings.html                   # System Preferences
│
├── teacher/                            # Teacher Portal (Assigned Classes Scope)
│   ├── dashboard.html                  # Submodule 8: Teacher Dashboard
│   ├── class-analytics.html            # Submodule 8: Class Performance Analytics
│   ├── daily-attendance.html           # Submodule 1: Daily Attendance Marking
│   ├── rfid-and-qr/                    # Submodule 2: RFID & QR Scanner
│   │   ├── live-scanner.html           # Classroom & Event Kiosk Mode
│   │   └── scan-logs.html
│   ├── tardy-and-absence/              # Submodule 3: Tardy & Absence Logs
│   │   ├── tardy-list.html
│   │   ├── absence-list.html
│   │   └── student-attendance-history.html
│   ├── teacher-attendance.html         # Submodule 4: My Teacher Attendance (Personal DTR)
│   ├── excuse-slip/                    # Submodule 5: Excuse Slip Classroom Reviews
│   │   ├── pending-requests.html
│   │   ├── approved-requests.html
│   │   ├── rejected-requests.html
│   │   └── excuse-history.html
│   ├── attendance-calendar.html        # Submodule 6: Class Schedule Calendar
│   ├── parent-alerts.html              # Submodule 7: Alerts to Parents
│   ├── perfect-attendance.html         # Submodule 9: Perfect Attendance Endorsements
│   ├── profile.html                    # Teacher Account Profile
│   └── settings.html                   # Account Preferences
│
├── student/                            # Student Portal (Self-Service View)
│   ├── dashboard.html                  # Submodule 8: Student Dashboard
│   ├── performance-analytics.html      # Submodule 8: Personal Attendance Analytics
│   ├── my-attendance.html              # Submodule 1: My Attendance Records
│   ├── rfid-and-qr.html                # Submodule 2: Digital ID & Dynamic QR Pass
│   ├── tardy-and-absence/              # Submodule 3: Tardy & Absence Records
│   │   ├── tardy-records.html
│   │   ├── absence-records.html
│   │   └── attendance-history.html
│   ├── excuse-slip/                    # Submodule 5: Excuse Slip Submission (Dual Option)
│   │   ├── submit-excuse.html          # External Medical Cert vs Clinic Pass
│   │   ├── my-requests.html
│   │   └── excuse-history.html
│   ├── attendance-calendar.html        # Submodule 6: Personal Attendance Calendar
│   ├── notifications.html              # Submodule 7: Notifications & Alerts Feed
│   ├── perfect-attendance.html         # Submodule 9: Perfect Attendance Progress & Certificate
│   └── profile.html                    # Student Account Profile
│
├── assets/
│   ├── css/
│   │   ├── input.css                   # Tailwind source
│   │   ├── output.css                  # Compiled Tailwind output
│   │   └── style.css                   # Global styles, mobile drawer & animations
│   ├── data/
│   │   └── sms1-integration-mock.json  # [NEW] Pre-Oral Defense SMS 1 Seed Records
│   ├── images/
│   │   ├── bcp-logo.png
│   │   └── login-bg.png
│   └── js/
│       ├── admin/                      # Admin controllers
│       ├── teacher/                    # Teacher controllers
│       ├── student/                    # Student controllers
│       ├── common/                     # auth.js, sidebar.js, table-pagination.js, flyout.js
│       ├── services/                   # Supabase API services
│       ├── config/                     # Supabase public credentials
│       └── utils/                      # Shared date helpers, formatters, sanitizers
│
└── docs/
    ├── FILE_STRUCTURE_PLAN.md          # Master Directory Architecture
    ├── COLOR_PALETTE.md                # Institutional 4-Color Palette Specification
    ├── architecture/
    │   ├── PRD.md                      # Product Requirements Document
    │   ├── rfid_qr_workflow.md         # Hardware & Scanner Workflows
    │   ├── system_workflow.md          # End-to-End Workflows
    │   └── sms1_integration_bridges.md # [NEW] SMS 1 Cross-Module Integration Bridges
    ├── database/                       # Schema DDL, RLS policies, ERDs
    ├── modules/                        # Admin, Teacher, and Student frontend specifications
    └── security/                       # Security mitigation & RLS protocols
```
