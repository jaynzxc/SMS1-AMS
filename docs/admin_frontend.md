#Admin role Sidebar Menu Modules and Contents

##Admin Dashboard

Purpose: Overview of the entire attendance system

Contents:

    - Total Students
    - Total Teachers
    - Today's Attendance Summary
        - Present
        - Absent
        - Late
        - Excused
    - Attendance Rate (%)
    - Students Currently Scanned Today
    - Recent Attendance Activities
    - Recent Excuse Slip Requests
    - Notifications
    - Quick Actions
        - Add Student
        - Register RFID
        - Generate Report
        - View Analytics

#DAILY ATTENDANCE MONITORING

Purpose: Monitor attendance submitted by teachers and correct mistakes if necessary.

Contents:

    Attendance Records Table

        Columns
        - Date
        - Subject
        - Section
        - Teacher
        - Student Name
        - Time In
        - Attendance Status
        - Attendance Method (RFID / QR / Manual)
        - Remarks

    Functions
    - Search Student
    - Filter by Date
    - Filter by Section
    - Filter by Teacher
    - Filter by Subject
    - View Attendance Details
    - Correct Attendance Record
    - Mark Present
    - Mark Absent
    - Mark Late
    - Delete Invalid Record
    - Attendance History

    Admin Permission
    - Edit incorrect attendance
    - Restore deleted attendance
    - Lock attendance after verification

#RFID/QR SCANNING MANAGEMENT

Purpose: Manage RFID cards and QR codes.

Contents:

    RFID Registry

    Columns
    - Student ID
    - Student Name
    - RFID Number
    - Status
    - Date Registered

    Functions
    - Register RFID Card
    - Replace Lost RFID
    - Disable RFID
    - Activate RFID
    - View Scan History

    QR Code Management

        Contents
        - Generate Student QR
        - Regenerate QR
        - Download QR
        - Print QR
        - QR Status

    Scan Logs

        Columns
        - Student Name
        - Date
        - Time
        - Scan Type
        - Result
        - Device Used

    Functions
    - Search
    - Filter
    - Export

#TARDY & ABSENCE LOGS

Purpose: Monitor students with excessive absences and tardiness

Contents:

    Tardy List

        Columns
        - Student
        - Section
        - Total Late
        - Last Late
        - Adviser

    Functions
    - View Details
    - Reset Count (Authorized)
    - Export

    Absence List

        Columns
        - Student
        - Section
        - Total Absences
        - Excused
        - Unexcused

    Functions
    - View Attendance History
    - Manual Correction
    - Export Report

    Habitual Offender Monitoring

    Automatically display students exceeding:
    - 3 Late
    - 5 Late
    - 5 Absences
    - 10 Absences

#TEACHER ATTENDANCE MONITORING

Purpose: Monitor Faculty Attendance

Contents:

    Columns
    - Teacher
    - Department
    - Time In
    - Time Out
    - Status
    - Date

    Functions
    - Search
    - Filter
    - View Attendance History
    - Manual Correction
    - Export

    Statistics
    - Monthly Attendance
    - Late Count
    - Absent Count

#EXCUSE SLIP MANAGEMENT

Purpose: Review and approve excuse slips

Contents:

    Pending Requests

        Columns
        - Student
        - Section
        - Submitted Date
        - Absence Date
        - Reason
        - Attachment

        Functions
        - View Attachment
        - Approve
        - Reject
        - Request Revision

    Approved Requests

        Contents
        - Student
        - Approved By
        - Approval Date
        - Remarks

    Rejected Requests

        Contents
        - Student
        - Reason for Rejection
        - Date

    Excuse Slip History

        Complete record of all submitted excuse slips.

#ATTENDANCE CALENDAR

Purpose: View attendance by date

Contents:

    Calendar Features

        Click a date to display
        - Students Present
        - Students Absent
        - Students Late
        - Excused Students
        - Teacher Attendance

    Filters
    - Department
    - Course
    - Section
    - Teacher

    Functions
    - Edit Attendance
    - View Daily Summary
    - Print Daily Attendance

#PARENT ALERTS MONITORING

Purpose: Monitor all notifications sent to parents

Contents:

    Columns
    - Student
    - Parent
    - Contact Number
    - Alert Type
    - Date Sent
    - Status

    Alert Types
    - Absent
    - Late
    - Excuse Approved
    - Excuse Rejected

    Functions
    - Resend Alert
    - View Notification History
    - Search
    - Filter

    Statistics
    - Total Alerts Sent
    - Failed Notifications
    - Successful Notifications

#PERFORMANCE ANALYTICS DASHBOARD

Purpose: Analyze attendance trends

Contents:

    Cards
    - Overall Attendance Rate
    - Present %
    - Absent %
    - Late %
    - Excused %

    Charts
    - Attendance Trend
        - Daily attendance graph
    - Monthly Attendance
        - Monthly comparison chart

    Section Comparison
        - Attendance percentage per section

    Course Comparison
        - Attendance percentage per course

    Top Students
        - Highest attendance percentage

    Students At Risk

    Students with
    - Most absences
    - Most tardiness

    Teacher Attendance Summary
    - Attendance performance of teachers

    Filters
    - School Year
    - Semester
    - Month
    - Course
    - Section
    - Teacher

    Export
    - PDF
    - Excel
    - CSV

#PERFECT ATTENDANCE AWARD TOOL

Purpose: Automatically determine awardees

Contents:

    Settings
    - Attendance Requirement
    - Maximum Allowed Late
    - Excused Allowed

    Generate Awardees

    Columns
    - Student
    - Section
    - Attendance %
    - Late Count
    - Absences

    Functions
    - Generate List
    - Approve
    - Remove Student
    - Print Certificates
    - Export Awardees

    History
        - Previous award recipients.

#REPORTS & EXPORT

Purpose: Generate downloadable reports

Contents:

    Available Reports
    - Daily Attendance
    - Weekly Attendance
    - Monthly Attendance
    - Student Attendance
    - Teacher Attendance
    - Tardy Report
    - Absence Report
    - Excuse Slip Report
    - Parent Alert Report
    - Analytics Report

    Export Formats
    - CSV
    - Excel
    - PDF

    Filters
    - Date
    - Course
    - Section
    - Teacher
    - Student

#USER MANAGEMENT

Purpose: Manage system users

Contents:

    Students
    - Add Student
    - Edit Student
    - Archive Student
    - Reset Password
    - Register RFID
    - Generate QR

    Teachers
    - Add Teacher
    - Edit Teacher
    - Assign Subjects
    - Reset Password

    Admins
    - Add Admin
    - Edit Admin
    - Change Roles

    Search
    - Student ID
    - Teacher ID
    - Name

#ACADEMIC MANAGEMENT

Purpose: Manage essential academic structures directly supporting attendance monitoring and performance analytics

Contents

    - Academic Terms & Semesters (Active School Year, Term Duration, System Default Term)
    - Courses & Sections (Course Programs e.g. BSIT, Class Sections e.g. 1A, 2A, 2B)
    - Subjects (Subject Catalog e.g. Web Development, Database Systems)

#SYSTEM SETTINGS

Purpose: Configure the system

Contents:

    General
    - School Name
    - School Logo
    - Attendance Time Rules
    - Late Threshold
    - School Hours

    RFID Settings
    - Enable RFID
    - RFID Device Status

    QR Settings
    - Enable QR
    - QR Expiration

    Notification Settings
    - SMS/Email Toggle
    - Parent Notification Rules

    Attendance Rules
    - Present Cut-off
    - Late Cut-off
    - Automatic Absent Rule

    Backup
    - Backup Database
    - Restore Database

    Audit Logs
    - Login History
    - User Activity Logs
    - Attendance Correction Logs
    - System Error Logs