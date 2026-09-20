# Student Role Modules & Contents Documentation

## Overview
The **Student Portal** provides students with real-time visibility into their personal attendance records, digital identification (personal QR code and RFID status), excuse slip submission and tracking, personal attendance analytics, and perfect attendance award progress.

Attendance monitoring and automated notifications (including parent/guardian SMS alerts and tardiness warnings) are **mandatory institutional regulations** at Bestlink College of the Philippines. Consequently, student-side settings, alert disabling toggles, and threshold adjustments are intentionally omitted to uphold policy integrity.

---

## 1. 10-Submodule Architecture Mapping (Student Self-Service)

| Submodule # | Submodule Name | Student File Path | Description |
| :---: | :--- | :--- | :--- |
| **8** | **Student Dashboard** | `student/dashboard.html` | Attendance summary cards, today's arrival status, quick actions, recent feeds. |
| **8** | **Performance Analytics** | `student/performance-analytics.html` | Visual charts for monthly punctuality trends, subject compliance rates, and delay breakdown. |
| **1** | **My Attendance** | `student/my-attendance.html` | Comprehensive historical log across enrolled subjects, status filters, personal CSV export. |
| **2** | **Digital ID & QR Pass** | `student/rfid-and-qr.html` | Registered RFID card status, lost card reporting, dynamic QR pass for kiosk check-in. |
| **3** | **Tardy & Absence Records** | `student/tardy-and-absence/` | Tardy records, absence risk counters, chronological attendance history. |
| **5** | **Submit Excuse Slip** | `student/excuse-slip/` | Dual-option submission (External Medical vs Clinic Pass), active request tracker, archive. |
| **6** | **Attendance Calendar** | `student/attendance-calendar.html` | Interactive monthly presence heatmap (Green/Yellow/Red/Blue) with day modal. |
| **7** | **Notifications & Alerts** | `student/notifications.html` | Read-only audit inbox of scan events, excuse reviews, and parent SMS alerts. |
| **9** | **Perfect Attendance** | `student/perfect-attendance.html` | Real-time semester eligibility tracker, checklist criteria, and digital award view. |

---

## 2. Detailed Module Specifications

### 2.1 Student Dashboard (Submodule 8)
* **Route**: `student/dashboard.html`
* **Purpose**: Accessible summary of the student's current attendance standing, today's arrival status, and quick shortcuts.
* **Contents**:
  - **Summary Cards**: Overall Attendance Rate (%), Total Present Days, Late Arrivals Count, Absences Count, Excused Absences.
  - **Today's Attendance Status**: Date, Arrival Time In, Attendance Status (*Present / Late / Absent*), Method Used (*RFID Tap / QR Scan*), Checkpoint / Classroom.
  - **Recent Activity & Advisories**: Recent scan verifications, parent SMS dispatch alerts, excuse slip review updates.
  - **Quick Action Links**: View Full Attendance Records, Submit New Excuse Slip, View Attendance Calendar.

### 2.2 My Attendance (Submodule 1)
* **Route**: `student/my-attendance.html`
* **Purpose**: Comprehensive historical log of the student's personal attendance across all enrolled subjects.
* **Contents**:
  - **Attendance Record Table**:
    - *Columns*: Date, Enrolled Subject, Assigned Teacher, Time In Timestamp, Status (*Present / Late / Absent / Excused*), Method (*RFID / QR Code / Manual*), Remarks.
  - **Summary Metrics**: Total Enrolled Subjects, Subject-by-Subject Attendance %, Total Excused vs Unexcused.
  - **Export Capability**: Personal attendance ledger download (CSV format) for student self-audit.

### 2.3 Digital ID & QR Pass (Submodule 2)
* **Route**: `student/rfid-and-qr.html`
* **Purpose**: Digital identification center where students can view their registered RFID card status and access their contactless dynamic QR pass.
* **Contents**:
  - **RFID Card Status**: Registered RFID Card Number (UID), Card Status (*Active / Inactive / Reported Lost*), Date Assigned, Report Lost Card button.
  - **Personal Dynamic QR Code**: Official Encrypted Dynamic QR Code (containing Student ID Number, Full Name, Course & Year Level, and security token), Fullscreen Modal for kiosk scanning, Download QR (PNG).

### 2.4 Tardy & Absence Logs (Submodule 3)
* **Routes**: `student/tardy-and-absence/tardy-records.html`, `absence-records.html`, `attendance-history.html`
* **Purpose**: Personal tardiness and absence tracking to encourage punctuality and early intervention.
* **Sub-Modules**:
  - **Tardy Records (`tardy-records.html`)**: Late frequency, delay minutes, 3-late threshold warning banner (3 lates = 1 unexcused absence referral to Prefect of Discipline), session details modal.
  - **Absence Records (`absence-records.html`)**: Excused vs unexcused breakdown, academic risk indicators, excuse slip submission links.
  - **Attendance History (`attendance-history.html`)**: Chronological audit ledger with subject progress bars and filter suite.

### 2.5 Submit Excuse Slip (Submodule 5)
* **Routes**: `student/excuse-slip/submit-excuse.html`, `my-requests.html`, `excuse-history.html`
* **Purpose**: Digital excuse filing with dual-option medical proof verification and status tracking.
* **Contents**:
  - **Dual-Option Medical Verification**:
    - **Option A (External Medical Certificate)**: Uploads PDF/JPEG of doctor's prescription or hospital certificate.
    - **Option B (School Clinic Pass)**: Inputs the Clinic Consultation Slip Number issued by the BCP Campus Clinic, triggering automated verification against Clinic Management records.
  - **Other Reason Categories**: Family Emergency, Official School Representation, Calamity.
  - **My Requests (`my-requests.html`)**: Active status tracking for Pending, Approved, and Rejected slips with reviewer remarks.

### 2.6 Attendance Calendar (Submodule 6)
* **Route**: `student/attendance-calendar.html`
* **Purpose**: Interactive monthly attendance calendar showing daily status distributions.
* **Contents**:
  - **Visual Color-Coded Grid**:
    - Present: Green badge
    - Late: Orange badge
    - Unexcused Absent: Red badge
    - Excused Absent: Blue badge
  - **Interactive Day Modal**: View class periods, subjects, arrival timestamps, and teacher remarks for any selected day.

### 2.7 Notifications & Alerts (Submodule 7)
* **Route**: `student/notifications.html`
* **Purpose**: Transparent audit inbox for all attendance-related communications.
* **Contents**:
  - Outbound parent SMS dispatch notices (timestamp, guardian number, delivery status).
  - Excuse slip approval and rejection notifications with teacher feedback.
  - Truancy advisory notices.

### 2.8 Perfect Attendance Award (Submodule 9)
* **Route**: `student/perfect-attendance.html`
* **Purpose**: Real-time progress monitoring toward semester Perfect Attendance honors.
* **Contents**:
  - 4-Point Eligibility Checklist: 100% Attendance Rate, 0 Unexcused Cuts, Max 2 Late arrivals, Active Enrolled Status.
  - Conferred Award Credential view with official serial hash and QR verification.

---

## 3. Topbar Profile Dropdown

### My Profile (`student/profile.html`)
* Student official details (Student ID, Program & Strand, Section, Enrolled Subjects), editable contact phone and guardian contact, password change with policy validation.