# Student Role Modules & Contents Documentation

## Overview
The **Student Portal** provides students with real-time visibility into their personal attendance records, digital identification (personal QR code and RFID status), excuse slip submission and tracking, personal attendance analytics, and perfect attendance award progress.

Attendance monitoring and automated notifications (including parent/guardian SMS alerts and tardiness warnings) are **mandatory institutional regulations** at Bestlink College of the Philippines. Consequently, student-side settings, alert disabling toggles, and threshold adjustments are intentionally omitted to uphold policy integrity.

---

## 1. Module Implementation Status Summary

| # | Module / Page | File Path | Status | Description |
|---|---------------|-----------|:------:|-------------|
| 1.1 | **Student Dashboard** | `student/dashboard.html` | ✅ Fully Implemented | Attendance summary cards, today's status, quick actions, recent feeds. |
| 1.2 | **My Attendance** | `student/my-attendance.html` | ✅ Fully Implemented | Comprehensive historical log across enrolled subjects, status filters, search. |
| 1.3 | **RFID / QR Code** | `student/rfid-and-qr.html` | ✅ Fully Implemented | Registered RFID card status, lost card reporting, encrypted dynamic QR code modal. |
| 1.4a | **Tardy Records** | `student/tardy-and-absence/tardy-records.html` | ✅ Fully Implemented | Late frequency, delay minutes, 3-late threshold warning banner, modal details. |
| 1.4b | **Absence Records** | `student/tardy-and-absence/absence-records.html` | ✅ Fully Implemented | Excused vs unexcused breakdown, academic risk indicators, excuse slip links. |
| 1.4c | **Attendance History** | `student/tardy-and-absence/attendance-history.html` | ✅ Fully Implemented | Chronological audit ledger, subject progress bars, comprehensive filter suite. |
| 1.5 | **Attendance Calendar** | `student/attendance-calendar.html` | ✅ Fully Implemented | Color-coded interactive monthly attendance calendar with daily detail modal. |
| 1.6a | **Submit Excuse Slip** | `student/excuse-slip/submit-excuse.html` | ✅ Fully Implemented | Submission form with proof attachment uploader, reason categories, and validation. |
| 1.6b | **My Requests** | `student/excuse-slip/my-requests.html` | ✅ Fully Implemented | Active tracking for pending, approved, and rejected excuse slip submissions. |
| 1.6c | **Excuse History** | `student/excuse-slip/excuse-history.html` | ✅ Fully Implemented | Complete archive of past excuse slips with reviewer remarks and attachments. |
| 1.7 | **Notifications** | `student/notifications.html` | ✅ Fully Implemented | Read-only activity feed & audit inbox (scans, alerts, SMS logs, approvals). |
| 1.8 | **Performance Analytics** | `student/performance-analytics.html` | ⏳ Planned | Charts for monthly punctuality trends, subject compliance rates, and delay breakdown. |
| 1.9 | **Perfect Attendance Award** | `student/perfect-attendance.html` | ⏳ Planned | Real-time semester eligibility tracker, checklist criteria, and award certificates. |
| 2.1 | **My Profile** | `student/profile.html` | ⏳ Planned | Student personal details (read-only academic info, editable contact info, security). |

---

## 2. Detailed Module Specifications

### 2.1 Student Dashboard (`student/dashboard.html`)
* **Status**: ✅ Fully Implemented
* **Companion Script**: `assets/js/student/dashboard.js`
* **Purpose**: Provide an accessible summary of the student's current attendance standing, today's arrival status, and quick shortcuts.
* **Contents**:
  - **Summary Cards**: Overall Attendance Rate (%), Total Present Days, Late Arrivals Count, Absences Count, Excused Absences.
  - **Today's Attendance Status**: Date, Arrival Time In, Attendance Status (*Present / Late / Absent*), Method Used (*RFID Tap / QR Scan*), Checkpoint / Classroom.
  - **Recent Activity & Advisories**: Recent scan verifications, parent SMS dispatch alerts, excuse slip review updates.
  - **Quick Action Links**: View Full Attendance Records, Submit New Excuse Slip, View Attendance Calendar.

### 2.2 My Attendance (`student/my-attendance.html`)
* **Status**: ✅ Fully Implemented
* **Companion Script**: `assets/js/student/my-attendance.js`
* **Purpose**: Comprehensive historical log of the student's personal attendance across all enrolled subjects.
* **Contents**:
  - **Attendance Record Table**:
    - *Columns*: Date, Enrolled Subject, Assigned Teacher, Time In Timestamp, Status (*Present / Late / Absent / Excused*), Method (*RFID / QR Code / Manual*), Remarks.
  - **Summary Metrics**: Total Enrolled Subjects, Subject-by-Subject Attendance %, Total Excused vs Unexcused.
  - **Filters**: Search by Date Range, Filter by Subject, Filter by Academic Month.

### 2.3 RFID / QR Code (`student/rfid-and-qr.html`)
* **Status**: ✅ Fully Implemented
* **Companion Script**: `assets/js/student/rfid-and-qr.js`
* **Purpose**: Digital identification center where students can view their registered RFID card status and access their contactless dynamic QR code.
* **Contents**:
  - **RFID Card Status**:
    - *Displays*: Registered RFID Card Number (UID), Card Status (*Active / Inactive / Reported Lost*), Date Assigned.
    - *Action*: Report Lost/Damaged RFID Card (alerts Administrator for immediate card deactivation and reissue).
  - **Personal Dynamic QR Code**:
    - *Displays*: Official Encrypted Dynamic QR Code (containing Student ID Number, Full Name, Course & Year Level, and security token).
    - *Functions*: View Fullscreen QR for phone screen scanning at teacher webcam/camera checkpoints when the physical RFID card is unavailable, Download QR Code (PNG).
  - **Security Notice**: Explaining that physical RFID assignment and badge replacements are handled exclusively by the Administrator.

### 2.4 Tardy & Absence Logs (`student/tardy-and-absence/`)
* **Status**: ✅ Fully Implemented
* **Sub-Modules**:
  - **Tardy Records (`student/tardy-and-absence/tardy-records.html` | `assets/js/student/tardy-records.js`)**:
    - *Displays*: Total late count, accumulated delay minutes, average delay per occurrence, subject frequency breakdown, and 3-late threshold warning banner (3 lates = 1 unexcused absence).
    - *Table Columns*: Date & Day, Enrolled Subject, Teacher, Scheduled Period, Time In, Delay Duration (e.g. `+17 mins late`), Scan Method (RFID / QR), Actions (View Details).
    - *Functions*: Search by Subject/Teacher, Filter by Subject, Delay Duration, and Academic Month; Session Details Modal with direct action to submit an excuse slip.
  - **Absence Records (`student/tardy-and-absence/absence-records.html` | `assets/js/student/absence-records.js`)**:
    - *Displays*: Total absences, excused absences, unexcused absences, and risk standing.
    - *Functions*: View absence dates, excuse slip review status, and direct excuse submission link.
  - **Attendance History (`student/tardy-and-absence/attendance-history.html` | `assets/js/student/attendance-history.js`)**:
    - *Displays*: Comprehensive chronological attendance history ledger across all enrolled subjects with subject progress bars and audit logs.

### 2.5 Attendance Calendar (`student/attendance-calendar.html`)
* **Status**: ✅ Fully Implemented
* **Companion Script**: `assets/js/student/attendance-calendar.js`
* **Purpose**: Visual, interactive calendar representation of personal attendance history throughout the academic semester.
* **Contents**:
  - **Color-Coded Calendar Grid**:
    - 🟢 Green: Present
    - 🟡 Yellow: Late
    - 🔴 Red: Unexcused Absent
    - 🔵 Blue: Excused Absent / Approved Slip
  - **Interactive Day Modal**: Click any date to view class periods, subjects, time-in timestamps, and teacher remarks for that specific day.
  - **Filters**: Filter by Academic Month and Semester.

### 2.6 Excuse Slip Management (`student/excuse-slip/`)
* **Status**: ✅ Fully Implemented
* **Sub-Modules**:
  - **Submit Excuse Slip (`student/excuse-slip/submit-excuse.html` | `assets/js/student/submit-excuse.js`)**:
    - *Form Fields*: Date of Absence, Enrolled Subject(s) / Whole Day Toggle, Reason Category (Medical Illness, Family Emergency, Official School Event, Other), Detailed Explanation, Supporting Document Uploader (PDF, JPEG, PNG).
    - *Actions*: Submit Request, Clear Form.
  - **My Requests (`student/excuse-slip/my-requests.html` | `assets/js/student/my-requests.js`)**:
    - *Displays*: Real-time tracking of active excuse slips categorized into Pending Review, Approved, and Rejected.
    - *Functions*: View Request Details Modal, Preview Attachment, View Teacher/Admin Feedback Remarks.
  - **Excuse History (`student/excuse-slip/excuse-history.html` | `assets/js/student/excuse-history.js`)**:
    - *Displays*: Permanent historical archive of all processed excuse slips with search and status filtering.

### 2.7 Notifications (`student/notifications.html`)
* **Status**: ✅ Fully Implemented
* **Companion Script**: `assets/js/student/notifications.js`
* **Purpose**: Centralized, strictly read-only notification inbox and audit feed. Provides the student with immediate visibility into attendance scans, tardiness flags, unexcused absences, parent SMS dispatches, and excuse slip approval updates.
* **Design Principles & Scope Boundaries**:
  - **Pure Read-Only Ledger**: Students cannot modify, mute, or turn off system notifications or alert thresholds, ensuring full compliance with mandatory institutional attendance tracking.
  - **Settings Link Removed**: The legacy/dead `Settings` link is removed from student dropdowns; students navigate strictly between **Notifications** (for incoming notices) and **My Profile** (for personal credentials).
* **Planned Contents**:
  - **Header Controls**: Unread count badge, Mark All as Read button, Date & Keyword Search filter.
  - **Category Filter Tabs**:
    - `All Notifications`
    - `Attendance Scans` (RFID gate taps & classroom QR verifications)
    - `Warnings & Policies` (Tardiness accumulation flags, 3-late threshold notices, absence alerts)
    - `Excuse Slips` (Review status changes: Approved / Rejected / Remarks added)
    - `Institutional Advisories` (Campus-wide notices, weather suspensions, schedule changes)
  - **Notification Feed Cards**:
    - Status type icon & color accents (Emerald for approvals/present scans, Amber for tardy/warnings, Rose for unexcused/SMS dispatches, Indigo for institutional notices).
    - Timestamp (relative time e.g., *"10 mins ago"* + exact date/time).
    - Descriptive message body with contextual metadata (Subject, Teacher, Room, Gate).
    - **Contextual Action Buttons**:
      - For absence notices: Direct shortcut **`[Submit Excuse Slip]`** (pre-navigates to excuse form).
      - For excuse slip updates: Direct shortcut **`[View Excuse Details]`** (opens request details).

### 2.8 Performance Analytics (`student/performance-analytics.html`)
* **Status**: ⏳ Planned
* **Purpose**: Self-monitoring analytics dashboard showing personal attendance trends, punctuality patterns, and subject compliance.
* **Planned Contents**:
  - Punctuality Rate (%), Subject Compliance Score, Risk Level Indicator.
  - Visual charts: Monthly Attendance Trend (Line graph), Attendance Percentage by Subject (Horizontal bar chart), Delay Distribution (Pie chart).

### 2.9 Perfect Attendance Status (`student/perfect-attendance.html`)
* **Status**: ⏳ Planned
* **Purpose**: Track real-time eligibility and progress toward qualifying for the institutional Perfect Attendance Award.
* **Planned Contents**:
  - Eligibility progress bar toward meeting zero unexcused absences and tardiness limits.
  - Criteria checklist and archive of previously earned attendance awards and semester certificates.

---

## 3. Topbar Profile Dropdown Modules

To maintain a clean and streamlined user interface, student settings/configurations are eliminated:

### 3.1 My Profile (`student/profile.html`)
* **Status**: ⏳ Planned
* **Companion Script**: `assets/js/student/profile.js`
* **Purpose**: View student institutional records and update personal contact credentials.
* **Contents**:
  - **Academic Information (Read-Only)**: Student ID Number, Full Name, Program (e.g., BSIT), Year Level, Assigned Section. *Managed exclusively by Administration.*
  - **Contact Information (Editable)**: Personal Email, Mobile Contact Number, Guardian Name, Guardian Contact Number.
  - **Account Security**: Change Password with real-time requirements validation, Update Profile Picture Avatar.
* **Topbar Dropdown Clean-up**:
  - In student pages, the dropdown contains strictly:
    1. **My Profile** (`profile.html`)
    2. **Sign Out** (`auth.js: handleLogout()`)
  - *(`Settings` option is completely removed across all student headers).*