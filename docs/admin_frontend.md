# Administrator Role Modules & Contents Documentation

## Overview
The **Administrator Panel** serves as the central management, configuration, and monitoring hub for the Bestlink College of the Philippines Attendance Monitoring System. The administrator has institution-wide oversight of attendance records, hardware scanner tokens, user credentials, parent SMS alerts, and analytics.

---

## 1. Sidebar Navigation Modules

### 1.1 Admin Dashboard
* **Purpose**: Provide a comprehensive high-level summary of campus-wide attendance, faculty presence, scanner activities, and quick actions.
* **Contents**:
  - **Summary Cards**: Total Enrolled Students, Total Faculty Teachers, Present Count Today, Late Count Today, Absent Count Today, Excused Count Today, Overall Attendance Rate (%).
  - **Live Counters**: Students currently scanned today across all kiosks.
  - **Activity Feeds**: Recent real-time attendance scans, recent excuse slip submissions, system notifications.
  - **Quick Actions**: Add Student, Add Teacher, Register RFID Token, Generate Attendance Report, View Performance Analytics.

### 1.2 Daily Attendance Monitoring
* **Purpose**: Real-time institution-wide monitoring of student attendance records submitted by teachers and hardware kiosks, with administrative correction capabilities.
* **Contents**:
  - **Attendance Records Table Columns**: Date, Subject, Section, Assigned Teacher, Student Name, Time In, Attendance Status (Present / Late / Absent / Excused), Attendance Method (RFID Tap / QR Code / Manual Entry), Remarks.
  - **Functions**: Search by student name/ID, Multi-filter by Date, Section, Teacher, Subject; View Detailed Record; Administrative Record Correction (Mark Present, Late, Absent, Excused with audit logging); Delete/Restore Invalid Records; Lock Attendance Records after verification.
  - **Authority**: Institutional override and audit verification.

### 1.3 RFID / QR Scanning Management
* **Purpose**: Hardware and digital identity credential management and real-time checkpoint scan auditing.
* **Contents**:
  - **RFID Registry**:
    - *Columns*: Student ID, Student Name, Course & Section, RFID Card UID, Card Status (Active / Inactive / Lost / Damaged), Date Registered.
    - *Functions*: Register RFID Card, Replace Lost/Damaged RFID, Toggle Card Status (Activate / Deactivate), View Scan History.
  - **QR Code Management**:
    - *Features*: Batch Generate Dynamic Student QR Codes, Regenerate Compromised QR Codes, Single & Batch Download QR (PNG), Print Official QR Identification Badges, Monitor QR Expiration Status.
  - **Scan Logs**:
    - *Columns*: Student Name, Student ID, Date, Time In/Out, Scan Type (RFID Tap / QR Scan), Result (Success / Failed / Invalid Token / Late Flag), Checkpoint / Device Kiosk Used.
    - *Functions*: Search, Filter by Checkpoint/Date/Status, Export Scan Logs to CSV.

### 1.4 Tardy & Absence Logs
* **Purpose**: Monitor chronic tardiness and unexcused absences, and identify habitual offenders across all year levels.
* **Contents**:
  - **Tardy List**:
    - *Columns*: Student Name, Student ID, Section, Total Late Count, Last Late Timestamp, Class Adviser, Delay Duration.
    - *Functions*: View Tardy Timeline, Reset Late Counter (Admin Authorized), Export Tardy Summary.
  - **Absence List**:
    - *Columns*: Student Name, Student ID, Section, Total Absences, Excused Absences, Unexcused Absences, Class Adviser.
    - *Functions*: View Detailed Attendance History, Correct Record Status, Export Absence List.
  - **Habitual Offender Monitoring**:
    - *Automated Flagging Thresholds*: Students exceeding 3 Late arrivals, 5 Late arrivals, 5 Absences, or 10 Absences.
    - *Actions*: View Intervention History, Issue Guidance Advisory, Log Guardian Notification.

### 1.5 Teacher Attendance Monitoring
* **Purpose**: Monitor faculty attendance, duty schedules, and arrival punctuality.
* **Contents**:
  - **Attendance Log Columns**: Teacher ID, Faculty Name, Department, Time In, Time Out, Status (Present / Late / Absent / On Leave), Date.
  - **Functions**: Search by Teacher/Department, Filter by Date Range, View Faculty Attendance History, Manual Administrative Correction, Export Faculty Attendance Report.
  - **Summary Statistics**: Monthly Faculty Attendance Rate, Total Late Occurrences, Total Absences.

### 1.6 Excuse Slip Management
* **Purpose**: Institutional oversight, review, and final appeal authority for student excuse slips.
* **Contents**:
  - **Workflow Context**: Subject teachers act as first-line approvers; administrators handle institution-wide oversight, appeals, and system audit history.
  - **Pending Requests**:
    - *Columns*: Student Name, Section, Submission Date, Absence Date, Reason Category, Attached Medical/Official Proof (Image/PDF).
    - *Functions*: Preview Proof Attachment, Approve Request, Reject Request, Request Revision with Remarks.
  - **Approved Requests**: Student Name, Approver (Teacher or Admin), Approval Date, Verification Remarks.
  - **Rejected Requests**: Student Name, Rejection Justification, Review Date.
  - **Excuse Slip History**: Complete searchable archive of all processed excuse slips with attached documentation.

### 1.7 Attendance Calendar
* **Purpose**: Interactive monthly and weekly calendar interface for date-based attendance breakdown and daily summaries.
* **Contents**:
  - **Interactive Calendar Grid**: Color-coded day markers for attendance volume and status distributions.
  - **Day View Modal / Drawer**: Students Present, Students Late, Students Absent, Excused Slips, Faculty Attendance.
  - **Filters**: Academic Department, Course, Section, Subject Teacher.
  - **Functions**: View Daily Attendance Breakdown, Print Daily Attendance Roster, Export Daily Ledger.

### 1.8 Parent Alerts Monitoring
* **Purpose**: Real-time monitoring and dispatch logs for automated outbound SMS notifications sent to parents and guardians.
* **Scope Boundary**: No parent portal exists; communication is strictly outbound transactional SMS alerts.
* **Contents**:
  - **SMS Dispatch Columns**: Student Name, Parent/Guardian Name, Registered Mobile Number, Alert Type (Time-In Entry, Late Advisory, Unexcused Absence, Time-Out Exit, Excuse Slip Status), Timestamp, Gateway Status (Delivered / Pending / Failed).
  - **Statistics**: Total Alerts Dispatched, Successful Deliveries, Failed Deliveries, SMS Gateway Balance.
  - **Functions**: Resend Failed SMS Alert, Filter by Alert Type and Date, View Guardian Notification History.

### 1.9 Performance Analytics Dashboard
* **Purpose**: Institutional data analytics and visual trend reporting for attendance performance across departments.
* **Contents**:
  - **Summary Metrics**: Campus-wide Attendance Rate (%), Present %, Late %, Absent %, Excused %.
  - **Visual Charts**: Daily Attendance Trend (Multi-line chart), Monthly Attendance Comparison (Bar chart), Section-by-Section Comparison, Course-by-Course Attendance Ranks.
  - **Leaderboards & Risk Analysis**: Top Performing Students (Highest Attendance %), Students at Risk (High Tardiness/Absence threshold).
  - **Filters & Export**: Filter by School Year, Semester, Month, Course, Section; Export to PDF, Excel, and CSV.

### 1.10 Perfect Attendance Award Tool
* **Purpose**: Automated evaluation and certificate generation for students meeting institutional perfect attendance criteria.
* **Contents**:
  - **Configurable Criteria**: Minimum Attendance % (e.g. 100%), Maximum Allowed Late Occurrences (e.g. 0 or 1), Allowed Excused Absences.
  - **Awardee Roster Table**: Student Name, ID, Course & Section, Final Attendance %, Late Count, Absence Count, Verification Status.
  - **Functions**: Generate Awardee List, Review & Approve Candidates, Remove Non-Qualifying Students, Batch Generate Printable Certificates, Export Awardee Registry.
  - **Historical Archive**: Repository of previous semester and school year award recipients.

### 1.11 Reports & Export
* **Purpose**: Centralized report generation hub supporting compliance, academic reporting, and administrative audits.
* **Contents**:
  - **Available Reports**: Daily Master Attendance, Weekly Summary, Monthly Departmental Attendance, Individual Student Attendance Ledger, Faculty Attendance Summary, Tardy Analysis, Absence Roster, Excuse Slip Audit, Parent Notification Summary.
  - **Supported Formats**: CSV, Microsoft Excel (.xlsx), PDF.
  - **Multi-Level Filters**: Date Range, Academic Term, Course, Section, Teacher, Specific Student.

### 1.12 User Management
* **Purpose**: Institutional administration of user accounts, role-based privileges, and credential provisioning.
* **Contents**:
  - **Student Accounts**: Create Student, Edit Profile, Archive/Deactivate, Reset Password, Link RFID Token, Generate QR Code.
  - **Teacher Accounts**: Create Faculty Account, Edit Department, Assign Subjects & Sections, Reset Password.
  - **Administrator Accounts**: Provision Admin Account, Edit Roles, Update System Permissions.
  - **Search & Filtering**: Real-time search by ID Number, Full Name, Role, or Department.

### 1.13 Academic Management
* **Purpose**: Manage the core academic structure supporting class attendance tracking and analytics.
* **Contents**:
  - **Terms & Semesters**: Manage Academic Years, Active Semester selection, Term Start/End dates.
  - **Courses & Sections**: Manage Course Programs (e.g. BSIT, BSCS, BSIS), Section definitions (e.g. 1A, 2A, 3B).
  - **Subject Catalog**: Manage Curricular Subjects (e.g. Web Development, Database Management Systems).

---

## 2. Topbar Profile Dropdown Modules
*To maintain sidebar cleanliness and usability, personal account settings and system-wide configurations are accessible exclusively via the Topbar Profile Dropdown.*

### 2.1 My Profile (`admin/profile.html`)
* **Purpose**: Personal administrator account management and security configuration.
* **Contents**:
  - **Administrator Information**: Full Name, Username, Official Email, Department/Office, Role Badge (*System Administrator*).
  - **Security Management**: Change Password with 5-rule real-time password policy validation (min 8 chars, uppercase, lowercase, digit, symbol).
  - **Session Details**: Last login timestamp, active browser session.

### 2.2 System Settings (`admin/settings.html`)
* **Purpose**: Global institutional rules, scanner policies, SMS trigger automation, backup management, and audit logs.
* **Contents**:
  - **General Configuration**: Institution Name (*Bestlink College of the Philippines*), Official School Logo uploader & preview, School Entry & Dismissal Hours.
  - **Attendance Rules**: Present Cut-off Time, Late Threshold (Grace Period in minutes), Late Cut-off Time, Automatic Absent Rule toggle.
  - **RFID & QR Settings**: RFID Hardware Kiosks toggle & live device status, Dynamic QR Code toggle, QR Lifetime Expiration in seconds.
  - **Notification Rules**: Outbound SMS/Email gateway toggles, Parent SMS Trigger Rules (Time-In Entry, Late Advisory, Unexcused Absence, Time-Out Exit).
  - **Database Backup & Recovery**: Symmetrical 1-click JSON snapshot download and JSON file restore.
  - **Audit Logs & History**: Real-time system activity table (Timestamp, Actor, Action Description, Status) and CSV export.