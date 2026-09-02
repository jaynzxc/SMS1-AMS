# Student Role Modules & Contents Documentation

## Overview
The **Student Portal** provides students with real-time visibility into their personal attendance records, digital identification (personal QR code and RFID status), excuse slip submission and tracking, attendance analytics, and perfect attendance award progress.

---

## 1. Sidebar Navigation Modules

### 1.1 Student Dashboard (`student/dashboard.html`)
* **Purpose**: Provide a fast, accessible summary of the student's current attendance standing, today's arrival status, and notifications.
* **Contents**:
  - **Summary Cards**: Overall Attendance Rate (%), Total Present Days, Late Arrivals Count, Absences Count, Excused Absences.
  - **Today's Attendance Status**: Date, Arrival Time In, Attendance Status (*Present / Late / Absent*), Method Used (*RFID Tap / QR Scan*), Checkpoint / Classroom.
  - **Recent Notifications & Advisories**: Recent scan verifications, parent SMS dispatch alerts, excuse slip review updates.
  - **Quick Action Links**: View Full Attendance Records, Submit New Excuse Slip, View Attendance Calendar.

### 1.2 My Attendance (`student/my-attendance.html`)
* **Purpose**: Comprehensive historical log of the student's personal attendance across all enrolled subjects.
* **Contents**:
  - **Attendance Record Table**:
    - *Columns*: Date, Enrolled Subject, Assigned Teacher, Time In Timestamp, Status (*Present / Late / Absent / Excused*), Method (*RFID / QR Code / Manual*), Remarks.
  - **Summary Metrics**: Total Enrolled Subjects, Subject-by-Subject Attendance %, Total Excused vs Unexcused.
  - **Filters**: Search by Date Range, Filter by Subject, Filter by Academic Month.

### 1.3 RFID / QR Code (`student/rfid-and-qr.html`)
* **Purpose**: Digital identification center where students can view their registered RFID card status and access their contactless QR code.
* **Contents**:
  - **RFID Card Status**:
    - *Displays*: Registered RFID Card Number (UID), Card Status (*Active / Inactive / Reported Lost*), Date Assigned.
    - *Action*: Report Lost/Damaged RFID Card (alerts Administrator for deactivation and reissue).
  - **Personal QR Code**:
    - *Displays*: Official Encrypted Dynamic QR Code, Student ID Number, Full Name, Course & Year Level.
    - *Functions*: View Fullscreen QR for Kiosk/Classroom Scanning, Download QR Code (PNG), Print Official QR Badge.
  - **Security Notice**: Note explaining that RFID assignment and physical replacements are handled by the Administrator.

### 1.4 Attendance Calendar (`student/attendance-calendar.html`)
* **Purpose**: Visual, interactive calendar representation of personal attendance history throughout the academic semester.
* **Contents**:
  - **Color-Coded Calendar Grid**:
    - 🟢 Green: Present
    - 🟡 Yellow: Late
    - 🔴 Red: Unexcused Absent
    - 🔵 Blue: Excused Absent / Approved Slip
  - **Interactive Day Modal**: Click any date to view class periods, subjects, time-in timestamps, and teacher remarks for that specific day.
  - **Filters**: Filter by Academic Month and Semester.

### 1.5 Excuse Slip Submission (`student/excuse-slip.html`)
* **Purpose**: Submit formal excuse slips for missed classes or tardiness with supporting attachments, and monitor approval status.
* **Contents**:
  - **Excuse Slip Submission Form**:
    - *Fields*: Date of Absence, Enrolled Subject(s) / Whole Day Toggle, Reason Category (Medical Illness, Family Emergency, Official School Event, Other), Detailed Explanation, Supporting Document Uploader (Supports PDF, JPEG, PNG).
    - *Actions*: Submit Request, Clear Form.
  - **My Excuse Slips History**:
    - *Columns*: Date Submitted, Date of Absence, Subject, Reason, Attached Document Link, Review Status (*Pending Review / Approved / Rejected*), Reviewer Remarks (Teacher or Administrator), Reviewed Date.
  - **Detailed View Modal**: Full view of submitted rationale, document preview, and teacher/admin feedback notes.

### 1.6 In-App Notifications (`student/notifications.html`)
* **Purpose**: Direct inbox informing the student of attendance scans, status changes, and guardian SMS delivery confirmations.
* **Contents**:
  - **Notification Feed**:
    - Scan Confirmations (e.g. *"Time-In recorded at Gate 1: 07:18 AM"*).
    - Tardiness Flags (e.g. *"Marked Late in Web Development - 07:45 AM"*).
    - Absence Advisories (e.g. *"Unexcused Absence recorded. SMS advisory dispatched to parent"*).
    - Excuse Slip Resolution (e.g. *"Your excuse slip for Aug 28 has been Approved by Mr. Juan Dela Cruz"*).
    - Perfect Attendance Alerts (e.g. *"You are currently qualified for the Semester Perfect Attendance Award"*).
  - **Functions**: Mark as Read, Delete Notification, Filter by Category.

### 1.7 Attendance Analytics (`student/analytics.html`)
* **Purpose**: Self-monitoring analytics dashboard showing personal attendance trends, patterns, and subject compliance.
* **Contents**:
  - **Performance Metrics**: Overall Punctuality Rate (%), Subject Compliance Score, Risk Level Indicator.
  - **Visual Charts**:
    - Monthly Attendance Trend (Line graph).
    - Attendance Percentage by Subject (Horizontal bar chart).
    - Punctuality vs Delay Distribution (Pie chart).
  - **Actionable Insights**: Highest attended subject, subject needing punctuality improvement, total excused percentage.

### 1.8 Perfect Attendance Status (`student/perfect-attendance.html`)
* **Purpose**: Track real-time eligibility and progress toward qualifying for the institutional Perfect Attendance Award.
* **Contents**:
  - **Eligibility Progress Bar**: Percentage progress toward meeting zero unexcused absences and tardiness limits.
  - **Criteria Checklist**: Required Attendance % (100%), Allowed Late Count (0/1), Allowed Excused Absences Status.
  - **Award Archive**: Record of previously earned attendance awards and semester certificates.

---

## 2. Topbar Profile Dropdown Modules
*To maintain a clean and uncluttered sidebar menu, personal account settings are accessed exclusively via the Topbar Profile Dropdown.*

### 2.1 My Profile (`student/profile.html`)
* **Purpose**: View student personal records and update personal account credentials.
* **Contents**:
  - **Academic Information (Read-Only)**: Student ID Number, Full Name, Course Program (e.g. BSIT), Year Level, Assigned Section. *Note: Managed exclusively by Administration.*
  - **Contact Information (Editable)**: Personal Email, Mobile Contact Number, Guardian Name, Guardian Contact Number.
  - **Account Security**: Change Password with real-time security requirements validation, Update Profile Picture Avatar.