# End-to-End System Workflow Specification

## Project Title
**Design and Development of an Attendance Monitoring System for Bestlink College of the Philippines with Performance Analytics and RFID/QR Scanning (SMS1-AMS)**

* **Institution:** Bestlink College of the Philippines (BCP)
* **Program:** Bachelor of Science in Information Technology
* **Document Version:** 1.0.0
* **Document Purpose:** Complete academic and procedural workflow specification documenting the end-to-end data lifecycle connecting the **Administrator**, **Teacher**, and **Student** panels with IoT hardware scanners, automated parent SMS alerting, and Supabase PostgreSQL.

---

## 1. System Actors & Operational Responsibilities

```mermaid
graph TD
    subgraph Actors [System Actors]
        Admin([System Administrator])
        Teacher([Faculty Teacher])
        Student([Enrolled Student])
        Parent([Parent / Guardian])
    end

    subgraph Actions [Operational Responsibilities]
        Admin -->|1. Provisions Users & Hardware| System[(BCP AMS Engine)]
        Teacher -->|2. Roster Attendance & Live Scan| System
        Student -->|3. Taps Badge / Files Excuse| System
        System -->|4. Automated SMS Advisory| Parent
    end
```

| Actor | System Role & Authority | Primary Responsibilities |
| :--- | :--- | :--- |
| **Administrator** | Institutional Authority & Auditor | User provisioning, RFID card registration, campus-wide overrides, calendar configuration, academic term management, system security audits, and official award conferment. |
| **Faculty Teacher** | Classroom Evaluator & First-Line Reviewer | Daily class attendance recording, classroom live kiosk scanning, first-line review of excuse slips, section punctuality tracking, and nominating students for academic honors. |
| **Enrolled Student** | Credential Holder & Viewer (Read-Only) | Identity badge tapping (RFID), backup QR display, viewing personal attendance records and calendar, submitting excuse slips with proof, and tracking award eligibility. |
| **Parent / Guardian** | External Notification Recipient | Receiving automated real-time SMS alerts regarding late arrivals, cuts, or chronic absence thresholds. |

---

## 2. High-Level End-to-End Architecture

```mermaid
flowchart TD
    subgraph HardwareLayer [Hardware & Client Layer]
        ESP32[ESP32 + RC522 RFID Kiosk]
        WebCam[Webcam / Phone QR Scanner]
        WebUI[Responsive Web Application]
    end

    subgraph IngestionLayer [Ingestion & Processing]
        API[Supabase Edge / PostgREST APIs]
        AuthEngine[Supabase Auth & Session Guard]
        AntiPassback[Anti-Passback 5-min Cooldown]
    end

    subgraph StorageLayer [Database & Storage (Supabase)]
        DB_Profiles[(profiles / students / teachers)]
        DB_Attendance[(attendance / teacher_attendance)]
        DB_Excuses[(excuse_slips & storage bucket)]
        DB_Audit[(user_activity & sms_logs)]
    end

    subgraph MultiPanelSync [Real-Time Cross-Panel Reflection]
        AdminPanel[Admin Dashboard & Ledger]
        TeacherPanel[Teacher Roster & Scanner]
        StudentPanel[Student Ledger, Calendar & Notifications]
        SMSGateway[Outbound SMS Gateway]
    end

    ESP32 -->|Wi-Fi HTTP POST| API
    WebCam -->|Camera Capture| WebUI
    WebUI -->|Authenticated REST / Bearer JWT| API
    API --> AuthEngine
    AuthEngine --> AntiPassback
    AntiPassback --> StorageLayer

    StorageLayer --> AdminPanel
    StorageLayer --> TeacherPanel
    StorageLayer --> StudentPanel
    StorageLayer --> SMSGateway
```

---

## 3. Detailed Step-by-Step Workflows

### 3.1 Lifecycle 1: User Provisioning & Credential Enrollment

```mermaid
sequenceDiagram
    autonumber
    actor Admin as Administrator
    participant UI as admin/user-management.html
    participant DB as Supabase PostgreSQL
    actor Student as Student / Teacher

    Admin->>UI: Enters User Profile (Name, ID, Section/Dept, Email, Guardian Contact)
    UI->>DB: INSERT into `profiles` & (`students` or `teachers`)
    Admin->>UI: Assigns Physical RFID Card (Scans UID)
    UI->>DB: INSERT into `rfid_cards` (card_uid, user_id, status='Active')
    DB-->>UI: Auto-generates initial password formula (`#LastName8080`)
    DB-->>UI: Auto-generates Dynamic Encrypted QR Code token
    Student->>UI: Receives login credentials & physical RFID card
    Student->>DB: Logs in via login.html & updates default password
```

1. **Profile Creation:** Admin registers new students or teachers.
2. **Credential Assignment:** The admin registers a Mifare 1K RFID card UID into `rfid_cards` mapped to the user.
3. **Dynamic QR Generation:** The system binds an encrypted dynamic token containing `user_id + timestamp + salt` accessible on the student's mobile portal.
4. **Security Notice:** Plain-text passwords are never stored; Supabase Auth hashes credentials using salted Bcrypt.

---

### 3.2 Lifecycle 2: Contactless Attendance Capture & Role Resolution

```mermaid
sequenceDiagram
    autonumber
    actor User as Student OR Teacher
    participant Terminal as IoT Kiosk (ESP32) / Web Scanner
    participant DB as Supabase Database
    participant SMS as SMS Gateway
    participant TeacherUI as Teacher Live Scanner
    participant AdminUI as Admin Dashboard

    User->>Terminal: Taps RFID card or presents Dynamic QR Code
    Terminal->>DB: POST /attendance/scan (device_id, card_uid, timestamp)
    DB->>DB: Check Anti-Passback (Was last scan < 5 mins ago?)
    alt Anti-Passback Violation
        DB-->>Terminal: REJECT (Buzzer 2x, LED Red: "Already Scanned")
    else Valid Scan
        DB->>DB: Resolve Role via `profiles.role`
        alt Role is STUDENT
            DB->>DB: Validate active schedule period in `schedules`
            alt Arrived On-Time
                DB->>DB: INSERT into `attendance` (status = 'Present')
                Terminal-->>User: ACCEPT (Buzzer 1x, LED Green: "Present")
            else Arrived Late (Exceeded grace period)
                DB->>DB: INSERT into `attendance` (status = 'Late', delay_minutes)
                Terminal-->>User: ACCEPT WITH WARNING (LED Yellow: "Late")
                DB->>SMS: Enqueue Parent SMS ("Student Juan Dela Cruz arrived Late")
            end
            DB->>TeacherUI: Push live card update to teacher/rfid-and-qr/live-scanner.html
            DB->>AdminUI: Increment Present/Late counters on admin/dashboard.html
        else Role is TEACHER
            DB->>DB: Determine Time-In vs Time-Out for Faculty DTR
            DB->>DB: INSERT/UPDATE `teacher_attendance` (calculate rendered duty hours)
            Terminal-->>User: ACCEPT (Buzzer 1x, LED Green: "Faculty Verified")
        end
    end
```

---

### 3.3 Lifecycle 3: Classroom Daily Attendance & Session Finalization

```mermaid
sequenceDiagram
    autonumber
    actor Teacher as Faculty Teacher
    participant UI as teacher/daily-attendance.html
    participant DB as Supabase PostgreSQL
    participant StudentUI as Student Portal
    participant AdminUI as Admin Portal

    Teacher->>UI: Selects Subject (e.g. IT301), Section (BSIT 3A), & Date
    UI->>DB: Fetch Enrolled Students & Pre-populated Kiosk Scans
    DB-->>UI: Displays Roster with real-time status badges
    Teacher->>UI: Performs manual adjustments if needed (e.g. Mark Excused / Absent)
    alt Save Local Draft
        Teacher->>UI: Clicks "Save Draft" (stored locally without final admin lock)
    else Submit to Administration
        Teacher->>UI: Clicks "Submit Attendance to Admin"
        UI->>DB: UPDATE `attendance` SET is_locked = true, verified_by = teacher_id
        DB->>AdminUI: Attendance locked; reflects in admin/attendance.html audit trail
        DB->>StudentUI: Instantly reflects in student/my-attendance.html & Calendar
    end
```

---

### 3.4 Lifecycle 4: Tardy & Absence Policy Threshold Monitoring

```mermaid
flowchart TD
    ScanEvent[Scan or Session Submission] --> Calculate[System Calculates Accumulated Metrics]
    Calculate --> CheckLates{Total Lates in Subject}
    Calculate --> CheckAbsences{Total Unexcused Absences}

    CheckLates -->|3rd Late Accumulated| Rule3Late[Enforce 3 Lates = 1 Absence Rule]
    Rule3Late --> Banner1[Display Warning Banner in Student Portal]
    Rule3Late --> SMS1[Notify Guardian via SMS Alert]

    CheckAbsences -->|Reaches 3 Absences| RiskWarning[Moderate Academic Risk Warning]
    CheckAbsences -->|Reaches 5 Absences| CreditLoss[Critical: Course Credit Forfeiture Alert]

    CreditLoss --> GuidanceNotice[Trigger Referral to Guidance & Dean's Office]
    CreditLoss --> AdminFlag[Display on Admin Habitual Offender List]
```

1. **Automated Tallying:** Each late entry adds exact delay minutes and increments subject frequency counters.
2. **The 3-Late Rule:** On the 3rd tardy, the system flags an equivalent unexcused absence penalty, notifying the parent via SMS and rendering a warning banner on `student/tardy-and-absence/tardy-records.html`.
3. **Credit Risk Cap:** Reaching 5 unexcused absences triggers an immediate Dean/Guidance review advisory on `admin/tardy-and-absence/absence-list.html`.

---

### 3.5 Lifecycle 5: Multi-Tier Excuse Slip Processing

```mermaid
sequenceDiagram
    autonumber
    actor Student as Student
    participant StudentUI as student/excuse-slip/submit-excuse.html
    participant Storage as Supabase Storage Bucket
    participant DB as Supabase Database
    participant TeacherUI as teacher/excuse-slip/pending-requests.html
    participant AdminUI as admin/excuse-slip/all-requests.html

    Student->>StudentUI: Fills Dates, Selects Reason Category, Explains, Uploads Proof (PDF/JPG)
    StudentUI->>Storage: Upload attachment (whitelisted MIME, max 5MB)
    Storage-->>StudentUI: Return attachment_url
    StudentUI->>DB: INSERT into `excuse_slips` (status = 'Pending')
    DB->>TeacherUI: Appears in Teacher's Pending Requests
    alt Teacher Approves
        TeacherUI->>DB: UPDATE `excuse_slips` SET status = 'Approved', reviewed_by = teacher_id
        DB->>DB: UPDATE `attendance` SET status = 'Excused' for selected dates
        DB->>StudentUI: Date turns BLUE on student/attendance-calendar.html
        DB->>StudentUI: my-requests.html updates status badge to "Approved"
        DB->>AdminUI: Logged as Verified in Admin audit ledger
    else Teacher Rejects
        TeacherUI->>DB: UPDATE `excuse_slips` SET status = 'Rejected', remarks = 'Unclear medical certificate'
        DB->>StudentUI: Displays rejection remarks in student/excuse-slip/my-requests.html
        opt Institutional Appeal
            Student->>AdminUI: Student appeals directly to Dean/Admin
            AdminUI->>DB: Admin executes institutional override
        end
    end
```

---

### 3.6 Lifecycle 6: Faculty Attendance (DTR) & Duty Hours

1. **Morning Punch-In:** Faculty teacher taps their registered RFID badge at the kiosk.
2. **Duty Verification:** The system confirms faculty status, sets `teacher_attendance.time_in`, and records `status = 'Present'`.
3. **Evening Punch-Out:** Faculty teacher taps again upon shift conclusion; the system sets `teacher_attendance.time_out` and automatically computes `rendered_hours`.
4. **Administrative Oversight:** Human Resources and Administrators view monthly DTR logs, overtime hours, and tardiness tallies on `admin/teacher-attendance.html`.
5. **Role Boundary:** Students have **zero visibility** into faculty DTR records.

---

### 3.7 Lifecycle 7: Performance Analytics & Visual Reporting

```mermaid
graph LR
    AttendanceData[(attendance records)] --> Aggregator[Supabase SQL Aggregation Views]
    Aggregator --> StudentAnalytics[student/performance-analytics.html]
    Aggregator --> TeacherAnalytics[teacher/class-analytics.html]
    Aggregator --> AdminAnalytics[admin/performance-analytics.html]

    StudentAnalytics --> SA1[Daily Trend SVG Line Chart]
    StudentAnalytics --> SA2[Subject Compliance vs 80% Bar]
    StudentAnalytics --> SA3[Session Distribution Donut]

    TeacherAnalytics --> TA1[Section Attendance Rate Gauge]
    TeacherAnalytics --> TA2[At-Risk Student Tally]

    AdminAnalytics --> AA1[Campus-Wide Daily Attendance]
    AdminAnalytics --> AA2[College Department Breakdown]
```

---

### 3.8 Lifecycle 8: Perfect Attendance Award Nomination & Conferment

```mermaid
sequenceDiagram
    autonumber
    actor Admin as Administrator
    participant DB as Supabase PostgreSQL
    participant StudentUI as student/perfect-attendance.html
    actor Teacher as Faculty Teacher
    participant TeacherUI as teacher/perfect-attendance.html

    Admin->>DB: Sets Institutional Criteria (100% Rate, Max 2 Lates, 0 Cuts)
    DB-->>StudentUI: Evaluates 4-Point Checklist in real time (Zero Absences, Punctuality, Verified Scans, Clearance)
    Note over StudentUI: Student monitors eligibility week-by-week (Read-Only)
    Teacher->>TeacherUI: Reviews eligible nominees for BSIT 3A & submits endorsement
    TeacherUI->>DB: INSERT into `award_nominations` (status = 'Endorsed')
    Admin->>DB: Validates nominations & clicks "Confer Award"
    DB->>DB: Generates Official Serial ID (e.g. BCP-AMS-CERT-2026-004821)
    DB->>DB: INSERT into `conferred_awards` & locks row against modification
    DB->>StudentUI: student/perfect-attendance.html displays "Conferred Award"
    Admin->>Teacher: Prints official hardcopy on certificate parchment with dry seal & ink signatures
    Teacher->>StudentUI: Formally awards physical certificate in semester convocation
    Note over StudentUI: Student uses "View Details" modal strictly as read-only verification
```

---

## 4. Cross-Panel State Synchronization Rules

To prevent data desynchronization, the system follows these strict transactional rules:

| Trigger Event | Immediate Primary Mutation | Secondary Cascading State Updates |
| :--- | :--- | :--- |
| **Kiosk Scan (Late)** | `INSERT` into `attendance` (`status = 'Late'`) | 1. Increment Student late count.<br>2. Queue Parent SMS.<br>3. Push WebSocket event to Teacher Live Scanner.<br>4. Increment Admin dashboard counter. |
| **Excuse Slip Approved** | `UPDATE excuse_slips` (`status = 'Approved'`) | 1. Mutate `attendance.status` from `Absent` to `Excused`.<br>2. Turn Calendar date badge **Blue**.<br>3. Deduct from unexcused absence total.<br>4. Re-validate Perfect Attendance Award eligibility. |
| **Session Locked by Teacher** | `UPDATE attendance` (`is_locked = true`) | 1. Disable teacher roster edit controls.<br>2. Reflect finalized attendance in student ledger.<br>3. Write entry to `user_activity` audit trail. |
| **Concurrent Login Detected** | `UPDATE profiles.active_session_id` | Terminate session on any other device holding an outdated token hash. |

---

## 5. Security & Technical Constraints Checklist

Before moving any module into production:
- [x] **Universal Session Guard:** Missing JWT redirects to `/login.html?reason=unauthorized`.
- [x] **Anti-Passback Cooldown:** Rejects taps within 5 minutes for the same identity.
- [x] **Row Level Security:** 100% of tables enforced with PostgreSQL RLS policies.
- [x] **No Self-Service Printing:** Students cannot generate, print, or download certificates.
- [x] **Anti-XSS:** All dynamic DOM injections use `textContent` or sanitized nodes.
- [x] **Secret Key Isolation:** `service_role` key strictly excluded from frontend code.
- [x] **Audit Trail:** Critical mutations logged immutably in `user_activity`.
