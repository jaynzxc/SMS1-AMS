# Teacher Role Modules & Contents Documentation

## Overview
The **Teacher Panel** empowers faculty members to record, manage, and verify student attendance across their assigned subjects and sections. Teachers interact directly with students in the classroom, utilize live RFID/QR hardware scanners, review first-line excuse slips, monitor class tardiness and absences, and submit verified attendance sessions to the administration.

---

## 1. Sidebar Navigation Modules

### 1.1 Teacher Dashboard (`teacher/dashboard.html`)
* **Purpose**: Comprehensive overview of the teacher's daily class schedule, attendance completion rate, and pending student requests.
* **Contents**:
  - **Summary Cards**: Classes Scheduled Today, Total Assigned Students, Attendance Submitted Today, Students Present, Students Late, Students Absent, Pending Excuse Slips.
  - **Today's Class Schedule**: Subject Name, Section, Scheduled Time Slot, Room/Building, Attendance Status badge (*Not Started / In Progress / Submitted*).
  - **Recent Activities Feed**: Recent attendance session submissions, recently reviewed excuse slips, student scanner logs.
  - **Quick Action Buttons**: Start Attendance Session, Open RFID/QR Scanner, View Class Attendance History, Review Excuse Slips.

### 1.2 Daily Attendance (`teacher/daily-attendance.html`)
* **Purpose**: Primary interactive roster for taking, editing, and submitting attendance for assigned classes and periods.
* **Contents**:
  - **Class Selection & Session Header**: Dropdown selector for Subject, Section, Schedule Slot, and Target Date.
  - **Student Roster Table**:
    - *Columns*: Student ID, Student Name, Time In Timestamp, Attendance Status (Present / Late / Absent / Excused), Attendance Method (RFID Tap / QR Code / Manual Entry), Remarks.
  - **Interactive Functions**:
    - Start Attendance Session (opens automated recording).
    - Close Attendance Session.
    - Quick Status Buttons (Mark All Present, Mark Late, Mark Absent, Mark Excused).
    - Real-time Student Search within the active class.
    - Save Local Draft (temporary persistence without administrative commit).
    - Submit Attendance to Administration (locks session and commits records to database).
    - Session Summary Modal (Present, Late, Absent, Excused breakdown before submission).

### 1.3 RFID / QR Scanning (`teacher/rfid-and-qr/`)
* **Purpose**: Hardware and camera scanning interface for real-time classroom attendance verification.
* **Sub-Modules**:
  - **Live Scanner (`teacher/rfid-and-qr/live-scanner.html`)**:
    - *Scanner Interface*: Dual-mode support (Receives real-time WebSocket push events from physical ESP32 RFID card taps; also features direct webcam/phone camera QR scanner for backup).
    - *Live Verification Card*: Student Photo, Full Name, Student ID, Course & Section, Scan Timestamp, Assigned Status badge (*Present / Late*).
    - *Scanner Controls*: Start Scanner, Pause Scanner, Manual Attendance Override, Rescan Student Profile.
  - **Scan Logs (`teacher/rfid-and-qr/scan-logs.html`)**:
    - *Columns*: Student Name, Student ID, Scan Timestamp, Status Flag, Method (RFID / QR), Checkpoint / Classroom.
    - *Functions*: Search by Student Name/ID, Filter by Class/Status, Export Classroom Scan Logs.

### 1.4 Tardy & Absence Logs (`teacher/tardy-and-absence/`)
* **Purpose**: In-depth monitoring and historical tracking of tardiness and absences for students in the teacher's assigned classes.
* **Sub-Modules**:
  - **Tardy List (`teacher/tardy-and-absence/tardy-list.html`)**:
    - *Columns*: Student Name, Section, Total Late Count in Subject, Latest Late Date, Average Delay.
    - *Functions*: Filter by Class Section, View Tardy Breakdown, Export Class Tardy List.
  - **Absence List (`teacher/tardy-and-absence/absence-list.html`)**:
    - *Columns*: Student Name, Section, Total Absences, Excused Absences, Unexcused Absences, Associated Excuse Slip Status.
    - *Functions*: View Absence Timeline, Link to Excuse Slip, Export Class Absence List.
  - **Student Attendance History (`teacher/tardy-and-absence/student-attendance-history.html`)**:
    - *Features*: Individual student attendance profile, monthly calendar attendance view, subject attendance rate (%), tardiness and absence patterns.

### 1.5 Teacher Attendance (`teacher/teacher-attendance.html`)
* **Purpose**: Allow faculty members to review their own personal daily attendance, physical RFID punch-in/out logs, rendered duty hours, and institutional punctuality history.
* **Contents**:
  - **Summary Badges**: Today's Time In, Today's Time Out, Duty Status (*On Duty / Present on Campus*), Total Monthly Lates, Total Monthly Absences.
  - **Personal Attendance Calendar**: Interactive monthly ledger displaying daily arrival timestamps and status.
  - **Attendance History Log Table**:
    - *Columns*: Date, Time In, Time Out, Gate / Device Location, Method (*RFID Tap / QR Scan*), Duty Status (*Present / Late / Absent*), Rendered Hours.
    - *Functions*: Date Range Filter, Search, Quick Pagination, Export Personal DTR.

### 1.6 Excuse Slip Management (`teacher/excuse-slip/`)
* **Purpose**: Multi-tier review and approval portal for student excuse slip submissions for the teacher's assigned classes.
* **Sub-Modules**:
  - **Pending Requests (`teacher/excuse-slip/pending-requests.html`)**:
    - *Columns*: Student Name & ID, Section & Subject, Submission Date, Absence Date, Reason Category, Attached Medical/Official Proof.
    - *Functions*: View Attached Proof Modal, One-Click Approve (automatically syncs daily roll call status from *Absent* to *Excused*), Reject Request (mandates feedback remarks).
  - **Approved Requests (`teacher/excuse-slip/approved-requests.html`)**:
    - *Columns*: Student Name & ID, Section & Subject, Absence Date, Approval Timestamp, Teacher Remarks, Attached Proof.
    - *Functions*: View Processed Slip Modal, Filter by Subject, Export Approved List.
  - **Rejected Requests (`teacher/excuse-slip/rejected-requests.html`)**:
    - *Columns*: Student Name & ID, Section & Subject, Absence Date, Rejection Timestamp, Mandatory Justification Remarks.
    - *Functions*: View Rejection Details Modal, Filter by Subject.
  - **Excuse Slip History (`teacher/excuse-slip/excuse-history.html`)**:
    - *Columns*: Student Name & ID, Section & Subject, Absence Date, Reason Category, Decision Status (*Approved / Rejected*), Processed Date, Remarks.
    - *Functions*: Complete 33-record searchable archive, Quick Client-Side Status Filter (*All / Approved / Rejected*), Export Archive.

### 1.7 Attendance Calendar (`teacher/attendance-calendar.html`)
* **Purpose**: View class attendance records across historical dates and academic calendar schedules.
* **Contents**:
  - **Interactive Calendar Grid**: Month navigation controls, color-coded daily attendance percentage status badges (≥90% High, Moderate, Low, School Holidays, Weekends).
  - **Day View Drawer (`#dayViewDrawer`)**: Slide-over drawer with student-by-student roll call overview and direct link to active roll call in `daily-attendance.html`.
  - **Table Header Controls**: In-table Assigned Classes Filter Dropdown (`BSIT 3A`, `BSIT 3B`, `BSCS 2A`, `BSIT 4A`), View Daily Roll Call button, and Export button.
  - **Export Modal (`#exportModal`)**: Supports CSV, Excel (.xlsx), and Print Attendance Sheet (PDF/`window.print()`) with date and section selectors.

### 1.8 Parent Alerts (`teacher/parent-alerts.html`)
* **Purpose**: Monitor automated SMS notification dispatch status for students enrolled in the teacher's classes.
* **Scope Boundary**: Displays outbound SMS delivery status sent to parents/guardians for class events.
* **Contents**:
  - **Notification History Table**: Student Name, Parent/Guardian Contact, Alert Type (Late Advisory, Unexcused Absence, Excuse Status), Timestamp, Delivery Status (*Delivered / Pending / Failed*).
  - **Functions**: Filter by Subject/Section, Search by Student, Resend Failed Notification.

### 1.9 Class Analytics Dashboard (`teacher/class-analytics.html`)
* **Purpose**: Visual analytics and attendance performance reports for the teacher's assigned sections.
* **Contents**:
  - **Summary Metrics**: Overall Class Attendance Rate (%), Total Present %, Late %, Absent %, Excused %.
  - **Visual Charts**: Daily Class Attendance Trends, Monthly Comparison, Subject Punctuality Comparison.
  - **Student Rankings**: Punctual Students Roster, Students at Risk of Exceeding Absence Thresholds.
  - **Filters & Export**: Subject, Section, Month, Term; Export to PDF/Excel/CSV.

### 1.10 Perfect Attendance Award (`teacher/perfect-attendance.html`)
* **Purpose**: Identify qualifying students within the teacher's classes and submit official recommendations to the Administrator.
* **Contents**:
  - **Candidate List**: Student Name, Section, Attendance %, Late Count (0), Absence Count (0), Qualification Status.
  - **Functions**: View Criteria Compliance, Recommend Candidate to Admin, Print Candidate Roster, Export Nominations.

### 1.11 Reports & Export (`teacher/reports-export.html`)
* **Purpose**: Generate and download attendance reports for academic grading and departmental submission.
* **Contents**:
  - **Available Reports**: Class Master Attendance Sheet, Weekly Roll Call, Monthly Section Summary, Student-by-Student Attendance Summary, Subject Tardy/Absence Report.
  - **Supported Formats**: CSV, Microsoft Excel (.xlsx), PDF.
  - **Filters**: Subject, Section, Date Range, Student.

---

## 2. Topbar Profile Dropdown Modules
*To maintain a clean and uncluttered sidebar menu, account management is accessed exclusively via the Topbar Profile Dropdown.*

### 2.1 My Profile (`teacher/profile.html`)
* **Purpose**: Manage personal faculty information, digital QR identification, RFID hardware card verification, and security settings.
* **Contents**:
  - **Personal Information**: Faculty ID, Full Name, Academic Department, Official Email Address, Contact Number.
  - **Digital Faculty QR Identification**:
    - *Displays*: Dynamic encrypted QR code containing Faculty ID, Full Name, Department, and security hash.
    - *Functions*: View Fullscreen QR for phone screen scanning at faculty checkpoints, Download QR (PNG), Print Official Faculty QR Badge.
  - **Hardware RFID Card Status**:
    - *Displays*: Registered RFID Card UID, Card Status (*Active*), Assignment Date.
    - *Action*: Report Lost/Damaged RFID Card (alerts Administrator for immediate deactivation).
  - **Account Security**: Change Password with real-time strength validation, Update Profile Avatar, Manage Notification Preferences.
  - **Assigned Classes Overview**: Read-only summary of currently assigned subjects and class sections.