# Teacher Role Modules & Contents Documentation

## Overview
The **Teacher Panel** empowers faculty members to record, manage, and verify student attendance across their assigned subjects and sections. Teachers interact directly with students in the classroom, utilize live RFID/QR hardware scanners, review first-line excuse slips, monitor class tardiness and absences, and submit verified attendance sessions to the administration.

---

## 1. Sidebar Navigation Modules (The 10 Official Submodules)

### 1.1 Class Analytics (Submodule 8)
* **Routes**: `teacher/dashboard.html`, `teacher/class-analytics.html`
* **Purpose**: Visual analytics and attendance performance reports for the teacher's assigned sections.
* **Contents**:
  - **Summary Cards**: Classes Scheduled Today, Total Assigned Students, Attendance Submitted Today, Students Present, Students Late, Students Absent, Pending Excuse Slips.
  - **Today's Class Schedule**: Subject Name, Section, Scheduled Time Slot, Room/Building, Attendance Status badge (*Not Started / In Progress / Submitted*).
  - **Visual Charts**: Daily Class Attendance Trends, Monthly Comparison, Subject Punctuality Comparison, At-Risk Student Distribution.

### 1.2 Daily Attendance Marking (Submodule 1)
* **Route**: `teacher/daily-attendance.html`
* **Purpose**: Primary interactive roster for taking, editing, and submitting attendance for assigned classes and periods.
* **Contents**:
  - **Class Selection & Session Header**: Dropdown selector for Subject, Section, Schedule Slot, and Target Date.
  - **Student Roster Table**:
    - *Columns*: Student ID, Student Name, Time In Timestamp, Attendance Status (Present / Late / Absent / Excused), Attendance Method (RFID Tap / QR Code / Manual Entry), Remarks.
  - **Interactive Functions**:
    - Quick Status Buttons (Mark All Present, Mark Late, Mark Absent, Mark Excused).
    - Real-time Student Search within the active class.
    - Save Local Draft (temporary persistence without administrative commit).
    - Submit Attendance to Administration (locks session and commits records to database).
  - **Design Note**: Every class operational table features a contextual Export button powered by the Universal Export Modal (`assets/js/common/export-modal.js`), providing CSV, EXCEL, PDF, and WORD formats with CHED collegiate compliance headers.

### 1.3 RFID / QR Scanning (Submodule 2)
* **Routes**: `teacher/rfid-and-qr/live-scanner.html`, `teacher/rfid-and-qr/scan-logs.html`
* **Purpose**: Hardware and camera scanning interface for real-time classroom attendance verification and event checking.
* **Contents**:
  - **Live Scanner (`live-scanner.html`)**:
    - Dual-mode support: Receives real-time WebSocket push events from physical ESP32 RFID card taps, plus in-browser camera QR scanning.
    - Dual-context: Supports standard classroom roll call or campus event venue tracking (`scan_context`).
    - Live Verification Card: Student Photo, Full Name, Student ID, Course & Section, Scan Timestamp, Status badge (*Present / Late*).
  - **Scan Logs (`scan-logs.html`)**:
    - Student Name, Student ID, Scan Timestamp, Status Flag, Method (RFID / QR), Checkpoint / Classroom.

### 1.4 Tardy & Absence Logs (Submodule 3)
* **Routes**: `teacher/tardy-and-absence/tardy-list.html`, `absence-list.html`, `student-attendance-history.html`
* **Purpose**: In-depth monitoring and historical tracking of tardiness and absences for students in the teacher's assigned classes.
* **Contents**:
  - **Tardy List**: Student Name, Section, Total Late Count in Subject, Latest Late Date, Average Delay.
  - **Absence List**: Student Name, Section, Total Absences, Excused Absences, Unexcused Absences, Truancy Threshold Warning.
  - **Student Attendance History**: Individual student attendance profile, monthly calendar attendance view, subject attendance rate (%).

### 1.5 My Teacher Attendance (Submodule 4)
* **Route**: `teacher/teacher-attendance.html`
* **Purpose**: Review personal daily faculty attendance, gate RFID punch-in/out logs, rendered duty hours, and punctuality records.
* **Contents**:
  - **Summary Badges**: Today's Time In, Today's Time Out, Duty Status, Total Monthly Lates, Total Monthly Absences.
  - **Personal Attendance Calendar**: Interactive monthly ledger displaying daily arrival timestamps and status.
  - **Attendance History Table**: Date, Time In, Time Out, Gate Location, Method (*RFID Tap / QR Scan*), Duty Status, Rendered Hours.
  - **HR Sync**: Automatically syncs faculty hours into the Academic HR Daily Time Record (DTR).

### 1.6 Excuse Slip Reviews (Submodule 5)
* **Routes**: `teacher/excuse-slip/pending-requests.html`, `approved-requests.html`, `rejected-requests.html`, `excuse-history.html`
* **Purpose**: First-line evaluation and approval portal for student excuse slips submitted for the teacher's assigned classes.
* **Contents**:
  - **Dual Medical Verification Support**:
    - *External Medical Certificate*: View uploaded doctor prescription / medical slip attachment.
    - *School Clinic Pass*: Cross-referenced with Clinic Management consultation records (`clinic_visit_logs`).
  - **Review Actions**: Approve Excuse (mutates student status from Absent to Excused across all rosters), Reject Excuse (requires mandatory feedback remarks).

### 1.7 Attendance Calendar (Submodule 6)
* **Route**: `teacher/attendance-calendar.html`
* **Purpose**: View class attendance records across historical dates and academic calendar schedules.
* **Contents**:
  - **Interactive Calendar Grid**: Month navigation controls, color-coded daily attendance percentage status badges (≥90% High, Moderate, Low, School Holidays, Weekends).
  - **Day View Drawer**: Slide-over drawer with student-by-student roll call overview and direct link to active roll call in `daily-attendance.html`.

### 1.8 Alerts to Parents (Submodule 7)
* **Route**: `teacher/parent-alerts.html`
* **Purpose**: Monitor automated SMS notification dispatch status for students enrolled in the teacher's classes.
* **Contents**:
  - **Notification History Table**: Student Name, Parent/Guardian Contact, Alert Type (Late Advisory, Unexcused Absence, Excuse Status), Timestamp, Delivery Status (*Delivered / Pending / Failed*).

### 1.9 Perfect Attendance (Submodule 9)
* **Route**: `teacher/perfect-attendance.html`
* **Purpose**: Identify qualifying students within the teacher's classes and submit official recommendations to the Administrator.
* **Contents**:
  - **Candidate List**: Student Name, Section, Attendance %, Late Count (0), Absence Count (0), Qualification Status.
  - **Actions**: View Criteria Compliance, Recommend Candidate to Admin.

### 1.10 Universal Table-Level Export Service
* **Component**: `assets/js/common/export-modal.js`
* **Access**: Contextual Export button on class operational tables
* **Purpose**: Class and teacher data extraction service directly accessible on every operational table view.
* **Supported Formats**: CSV, Microsoft Excel (.xlsx), Printable Official PDF, Microsoft Word (.doc).
* **Compliance Standards**: Commission on Higher Education (CHED) collegiate metadata, academic departments, degree programs, semester/A.Y., and collegiate signatory blocks (Instructor, Department Head, Dean, Registrar).

---

## 2. Topbar Profile Dropdown Modules

### 2.1 My Profile (`teacher/profile.html`)
* Faculty credentials, contact number, personal encrypted QR identification badge, RFID card status, and password management.

### 2.2 Faculty Settings (`teacher/settings.html`)
* In-browser QR camera preferences (audio chime on scan, vibration toggle, auto-resume delay), active session monitor, and device revocation.