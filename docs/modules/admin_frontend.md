# Administrator Role Modules & Contents Documentation

## Overview
The **Administrator Panel** serves as the central management, configuration, and monitoring hub for the Bestlink College of the Philippines Attendance Monitoring System (AMS). The administrator has institution-wide oversight of attendance records, hardware scanner tokens, user credentials, parent SMS alerts, and analytics.

---

## 1. Sidebar Navigation Modules (The 10 Official Submodules)

### 1.1 Analytics Dashboard (Submodule 8)
* **Routes**: `admin/dashboard.html`, `admin/performance-analytics.html`
* **Purpose**: Provide a comprehensive high-level summary of campus-wide attendance, faculty presence, scanner activities, and institutional trend charts.
* **Contents**:
  - **Summary Cards**: Total Enrolled Students, Total Faculty Teachers, Present Count Today, Late Count Today, Absent Count Today, Excused Count Today, Overall Attendance Rate (%).
  - **Dynamic Charts**: Interactive multi-period attendance trends (Last 7 Days, 30 Days, Semester), departmental breakdown, at-risk student distribution.
  - **Live Counters**: Real-time headcount of students and teachers currently scanned today.
  - **Recent Feeds**: Live audit stream of kiosk taps, newly submitted excuse slips, and critical truancy alerts.

### 1.2 Daily Attendance Monitoring (Submodule 1)
* **Route**: `admin/attendance.html`
* **Purpose**: Real-time institution-wide monitoring of student attendance records submitted by teachers and hardware kiosks, with administrative correction capabilities.
* **Contents**:
  - **Attendance Records Table**: Date, Subject, Section, Assigned Teacher, Student Name, Time In, Attendance Status (Present / Late / Absent / Excused), Method (RFID / QR / Manual), Remarks.
  - **Controls Bar**: Student search, Date filter, Section filter, Subject filter, Status filter, Administrative Override Modal.
  - **Design Note**: In accordance with Option 1 (Full Centralization), local table export buttons are omitted. All data extraction is handled in Submodule 10 (`reports-export.html`).

### 1.3 RFID / QR Scanning Management (Submodule 2)
* **Routes**: `admin/rfid-and-qr/rfid-registry.html`, `qr-management.html`, `scan-logs.html`
* **Purpose**: Hardware and digital identity credential management and real-time checkpoint scan auditing for both students and faculty members.
* **Contents**:
  - **RFID Registry**: Card UID linking, status toggle (Active / Inactive / Lost / Damaged), registration date, user role.
  - **QR Code Management**: Dynamic QR generation, credential renewal, badge printing preview.
  - **Scan Logs**: Real-time audit log of all gate taps, classroom check-ins, and campus event entries.

### 1.4 Tardy & Absence Logs (Submodule 3)
* **Routes**: `admin/tardy-and-absence/tardy-list.html`, `absence-list.html`, `habitual-offender.html`
* **Purpose**: Monitor chronic tardiness and unexcused absences, and identify habitual truancy offenders across all year levels.
* **Contents**:
  - **Tardy List**: Student ID, Name, Section, Cumulative Late Minutes, Late Occurrences, Delay Timestamps.
  - **Absence List**: Unexcused absences, Excused absences, Cumulative missed sessions, Risk category.
  - **Habitual Truancy Escalation**: Automated flagging for students with >3 consecutive absences or >5 tardies, with direct referral bridge to the PREFECT Disciplinary Action Module.

### 1.5 Teacher Attendance Monitoring (Submodule 4)
* **Route**: `admin/teacher-attendance.html`
* **Purpose**: Monitor faculty attendance, arrival punctuality, and rendered duty hours captured via gate RFID/QR stations, supplying Daily Time Records (DTR) to Academic HR.
* **Contents**:
  - **Faculty Log Table**: Teacher ID, Faculty Name, Department, Time In, Time Out, Rendered Duty Hours, Status (Present / Late / Absent / On Leave), Date.
  - **Integration Bridge**: Directly syncs verified teaching hours to Academic HR Management (`hr_faculty_dtr`).

### 1.6 Excuse Slip Management (Submodule 5)
* **Routes**: `admin/excuse-slip/pending-requests.html`, `approved-requests.html`, `rejected-requests.html`, `excuse-history.html`
* **Purpose**: Institutional oversight, review, and final appeal authority for student excuse slips.
* **Contents**:
  - **Dual Medical Verification Support**:
    - *External Medical Certificate*: View uploaded doctor prescription / medical slip attachment.
    - *School Clinic Pass*: Cross-referenced with Clinic Management consultation records (`clinic_visit_logs`).
  - **Review Actions**: Approve Excuse (mutates attendance to Excused), Reject Excuse with justification remarks, Request Revision.

### 1.7 Attendance Calendar (Submodule 6)
* **Route**: `admin/attendance-calendar.html`
* **Purpose**: Interactive monthly calendar interface displaying campus-wide presence heatmaps, academic terms, and holiday/calamity suspensions.
* **Contents**:
  - **Monthly Heatmap Grid**: Visual color codes (Green = High Attendance, Orange = Moderate, Red = Low).
  - **Day View Drawer**: Detailed daily breakdown of present, late, absent, and excused students.
  - **Shared Calendar Sync**: Connects with SMS 1 Institutional Academic Calendar.

### 1.8 Alerts to Parents (Submodule 7)
* **Route**: `admin/parent-alerts.html`
* **Purpose**: Outbound SMS broadcast queue and delivery audit log for automated parent notifications.
* **Contents**:
  - **SMS Dispatch Table**: Student Name, Guardian Name, Registered Mobile Number, Alert Type (Time-In, Late Advisory, Unexcused Absence, Truancy Warning), Delivery Timestamp, Gateway Status.
  - **Gateway Metrics**: Total SMS sent, Delivery success rate, Gateway balance credit.

### 1.9 Perfect Attendance Award Tool (Submodule 9)
* **Route**: `admin/perfect-attendance.html`
* **Purpose**: Automated evaluation and certificate conferment for students maintaining 100% attendance and zero infractions.
* **Contents**:
  - **Configurable Criteria**: Attendance percentage threshold, allowed tardy minutes, zero unexcused cuts.
  - **Awardee Roster**: Qualified students, section, semester attendance record, conferment status.
  - **Integration Bridge**: Transmits endorsed qualifier lists to OSAS for honors convocation and graduation clearance.

### 1.10 Reports & Export (Submodule 10)
* **Route**: `admin/reports-export.html`
* **Purpose**: Centralized institutional reporting engine for all official documentation, audits, and compliance exports.
* **Contents**:
  - **Report Categories**: Daily Master Attendance, DepEd / CHED Form 137 / SF2 Attendance Component, Habitual Truancy Summaries, Faculty DTR Logs, Parent SMS Delivery Audit, Excuse Slip Ledger.
  - **Export Formats**: CSV, Microsoft Excel (.xlsx), and Printable Official PDF with institutional headers and signature lines.
  - **Multi-Parameter Filtering**: Date range, academic year, semester, department, course, section, status.

---

## 2. Institutional Administration Item

### User Management (`admin/user-management.html`)
* **Purpose**: Role assignment, student/faculty credential provisioning, and password resets.
* **Contents**: Student Accounts, Faculty Accounts, Administrator Accounts, Role Permissions, Account Status (Active / Suspended).

---

## 3. Topbar Profile Dropdown Modules

### 3.1 My Profile (`admin/profile.html`)
* Administrator account details, official email, department, real-time password change with 5-rule policy.

### 3.2 System Settings (`admin/settings.html`)
* Institutional rules, grace period cut-offs, RFID hardware device registry, outbound SMS gateway toggles, database backup/restore.