---
name: ui-ux_backend_spec
description: Backend specifications, API query shapes, payload contracts, loading/empty/error states, and Supabase real-time bindings powering the Bestlink College of the Philippines Attendance Monitoring System (SMS1-AMS) UI/UX components. Use when connecting frontend views to Supabase services.
---

# UI/UX Backend Specification Skill (SMS1-AMS)

## Goal

Provide a concrete, standardized contract between the **Pure HTML5 + Compiled Tailwind CSS + Vanilla JavaScript UI Components** and the **Supabase PostgreSQL Backend Services** for the **Bestlink College of the Philippines Attendance Monitoring System (SMS1-AMS)**. This ensures developers and AI agents know the exact database tables, query shapes, mutation payloads, loading/empty states, and real-time event bindings required across the **Admin**, **Teacher**, and **Student** portals.

---

## 1. Architectural Service Pattern

All UI views in SMS1-AMS interact with Supabase through modular Vanilla JavaScript services located in `assets/js/`. Direct database calls mixed with presentation logic are separated into dedicated query functions.

```
┌─────────────────────────────────────────────────────────────┐
│                 HTML5 + Tailwind UI View                    │
│    (e.g., student/my-attendance.html, teacher/scanner.html) │
│  - Skeleton loading states (`animate-pulse`)                │
│  - Table rows, modals, drawer sliders, KPI summary cards    │
└──────────────────────────────┬──────────────────────────────┘
                               │ Calls JS service function
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                 assets/js/*/*.js Services                   │
│  - Supabase client queries (`assets/js/config/`)            │
│  - Fallback local data provider (Dual-Mode Architecture)    │
│  - Payload validation, date normalization, error formatting │
└──────────────────────────────┬──────────────────────────────┘
                               │ Supabase JS SDK (HTTPS / WSS)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│             Supabase PostgreSQL 15 + RLS                    │
│  - `attendance`, `students`, `teachers`, `profiles`         │
│  - `excuse_slips`, `rfid_cards`, `sms_logs`, `admin_details` │
└─────────────────────────────────────────────────────────────┘
```

### Standard Service Response Convention
Every data-fetching and mutation function returns a standardized promise resolving to:
```javascript
{
  data: any | null,
  error: { message: string, code?: string } | null
}
```

### Dual-Mode Architecture (Production & Staging Fallback)
To ensure pages function seamlessly during testing, local `file:///` previews, or when Supabase is initializing:
1. Functions attempt to query Supabase via `import { supabase } from '../config/supabaseClient.js'` (or standard script bindings).
2. If the Supabase client returns an error, network failure, or runs offline, the module gracefully falls back to structured mock datasets matching the student/teacher curriculum without breaking the UI.

---

## 2. Screen-by-Screen Backend Specifications

---

### PART A: Student Portal (`student/`)

#### Screen S1: Student Dashboard (`student/dashboard.html`)
* **UI Purpose:** Overall attendance KPI summary cards, today's arrival card, recent alerts feed, and quick-action shortcuts.
* **Backend Function:** `studentDashboardService.getStudentDashboardData(studentId)`
* **Supabase Queries:**
  ```javascript
  // 1. Overall attendance counters
  const { data: attendanceLogs } = await supabase
    .from('attendance')
    .select('id, date, status, method, time_in')
    .eq('student_id', studentId);

  // 2. Today's scan record
  const { data: todayLog } = await supabase
    .from('attendance')
    .select('date, time_in, time_out, status, method, course_section, remarks')
    .eq('student_id', studentId)
    .eq('date', new Date().toISOString().split('T')[0])
    .maybeSingle();

  // 3. Recent excuse slip review alerts & notifications
  const { data: alerts } = await supabase
    .from('excuse_slips')
    .select('id, absence_date, status, reviewer_remarks, updated_at')
    .eq('student_id', studentId)
    .order('updated_at', { ascending: false })
    .limit(5);
  ```
* **Output Data Contract to UI:**
  ```json
  {
    "kpis": {
      "attendanceRate": 94.7,
      "presentCount": 36,
      "lateCount": 1,
      "unexcusedAbsentCount": 1,
      "excusedCount": 1,
      "totalSessions": 38
    },
    "today": {
      "hasScanned": true,
      "timeIn": "07:48 AM",
      "status": "Present",
      "method": "RFID Badge",
      "classroom": "Lab 304",
      "remarks": "On Time"
    },
    "notifications": [
      {
        "id": "notif-1",
        "title": "Excuse Slip Approved",
        "message": "Your excuse slip for Aug 26 was approved by Mrs. Jane Dela Cruz.",
        "type": "success",
        "timestamp": "2026-08-27T10:15:00Z"
      }
    ]
  }
  ```
* **UI State Requirements:**
  * `isLoading`: Render pulsating KPI skeletons (`animate-pulse bg-gray-200 h-8 rounded-lg`).
  * `isEmpty`: Display *"No attendance logged for today. Please scan your RFID card or QR code at your classroom kiosk."*
  * `isError`: Render toast alert with fallback to cached statistics.

---

#### Screen S2: My Attendance Ledger (`student/my-attendance.html`)
* **UI Purpose:** Comprehensive chronological log of all personal class attendance records with search, subject filter, date-range filter, and record details modal.
* **Backend Function:** `attendanceService.getStudentAttendance(studentId, filters)`
* **Supabase Query:**
  ```javascript
  let query = supabase
    .from('attendance')
    .select(`
      id,
      student_id,
      student_name,
      course_section,
      date,
      time_in,
      time_out,
      status,
      method,
      remarks,
      recorded_at
    `)
    .eq('student_id', studentId)
    .order('date', { ascending: false });

  if (filters.subject) query = query.ilike('course_section', `%${filters.subject}%`);
  if (filters.status && filters.status !== 'ALL') query = query.eq('status', filters.status);
  if (filters.startDate && filters.endDate) {
    query = query.gte('date', filters.startDate).lte('date', filters.endDate);
  }
  ```
* **Payload from UI (Record Detail Modal):**
  Triggered when student clicks `Inspect Details`:
  ```json
  {
    "id": "att-uuid-1",
    "subject": "IT301 - Web Development",
    "teacher": "Mrs. Jane Dela Cruz",
    "schedule": "08:00 AM – 10:00 AM",
    "date": "Sep 02, 2026",
    "timeIn": "07:54 AM",
    "status": "Present",
    "method": "RFID Badge",
    "remarks": "Completed practical laboratory checkpoint."
  }
  ```

---

#### Screen S3: Digital Identification & RFID Center (`student/rfid-and-qr.html`)
* **UI Purpose:** Display registered physical RFID card UID & status, fullscreen encrypted dynamic QR code, and report lost/damaged badge modal.
* **Backend Functions:**
  * `idService.getStudentIdCredentials(studentId)`
  * `idService.reportLostBadge(payload)`
* **Data Contract to UI:**
  ```json
  {
    "student_id": "s230111001",
    "full_name": "Juan Paolo Dela Cruz",
    "course": "BSIT",
    "section": "3A",
    "rfid": {
      "card_uid": "E20000192803001",
      "status": "Active",
      "assigned_date": "2026-08-15"
    },
    "qr": {
      "raw_payload": "BCP-AMS:s230111001:BSIT-3A:2026-1ST:SEC_TOKEN_892F1",
      "generated_at": "2026-09-02T08:00:00Z",
      "expires_in_hours": 24
    }
  }
  ```
* **Report Lost Badge Mutation Payload (from UI Modal):**
  ```json
  {
    "student_id": "s230111001",
    "card_uid": "E20000192803001",
    "incident_reason": "Lost during commute",
    "incident_date": "2026-09-08"
  }
  ```
* **Backend Trigger:** Updates `students.rfid_uid = NULL` (or status to `Reported Lost`) and inserts a notification into `admin_alerts`.

---

#### Screen S4: Attendance Calendar (`student/attendance-calendar.html`)
* **UI Purpose:** Interactive monthly calendar grid, 5 KPI summary cards, color-coded daily badges (🟢 Present, 🟡 Late, 🔴 Absent, 🔵 Excused, ⚪ Holiday), slide-over day breakdown drawer, and export modal.
* **Backend Functions:**
  * `calendarService.getMonthAttendance(studentId, year, month)`
  * `calendarService.getDayBreakdown(studentId, dateString)`
* **Output Data Contract to Calendar Grid:**
  ```json
  {
    "2026-09-01": { "status": "present", "present": 4, "late": 0, "absent": 0, "excused": 0, "holiday": false },
    "2026-09-02": { "status": "present", "present": 4, "late": 0, "absent": 0, "excused": 0, "holiday": false },
    "2026-09-04": { "status": "late", "present": 3, "late": 1, "absent": 0, "excused": 0, "holiday": false },
    "2026-09-08": { "status": "absent", "present": 0, "late": 0, "absent": 1, "excused": 0, "holiday": false },
    "2026-08-31": { "status": "holiday", "holidayName": "National Heroes Day (Holiday)", "holiday": true }
  }
  ```
* **Day Breakdown Drawer Contract:**
  When a student clicks a calendar date, the drawer receives an array of scheduled classes:
  ```json
  [
    {
      "subjectCode": "IT301",
      "subjectName": "Web Development",
      "section": "BSIT 3A",
      "room": "Lab 304",
      "schedule": "08:00 AM – 10:00 AM",
      "teacher": "Mrs. Jane Dela Cruz",
      "timeIn": "07:54 AM",
      "method": "RFID Badge",
      "status": "Present",
      "delay": "On Time (6 mins early)",
      "remarks": "Completed practical laboratory checkpoint."
    }
  ]
  ```

---

#### Screen S5: Excuse Slip Submission & Tracking (`student/excuse-slip/`)
* **UI Purpose:** Multi-field form to submit formal excuse slips for absences or tardiness with file attachment upload (PDF, JPEG, PNG), and track pending/approved slips.
* **Backend Functions:**
  * `excuseService.submitExcuseSlip(formData, fileAttachment)`
  * `excuseService.getStudentExcuseHistory(studentId)`
* **Step 1 — Storage Upload Payload (Supabase Storage):**
  * Bucket: `excuse-attachments`
  * Path: `${studentId}/${Date.now()}_medical_certificate.pdf`
* **Step 2 — Database Insert Payload (Table `excuse_slips`):**
  ```json
  {
    "student_id": "s230111001",
    "student_name": "Juan Paolo Dela Cruz",
    "course_section": "BSIT 3A",
    "absence_date": "2026-09-08",
    "subject_code": "IT302",
    "reason_category": "Medical Illness",
    "explanation": "Suffered acute gastroenteritis; medical certificate attached.",
    "document_url": "https://<project-id>.supabase.co/storage/v1/object/public/excuse-attachments/s230111001/cert.pdf",
    "status": "Pending",
    "created_at": "2026-09-08T18:30:00Z"
  }
  ```
* **Backend Resolution:** When a teacher approves the slip, `attendance` status for `date = absence_date` and `student_id` is automatically mutated from `Absent` to `Excused`.

---

#### Screen S6: Performance Analytics & Perfect Attendance (`student/performance-analytics.html`, `student/perfect-attendance.html`)
* **UI Purpose:** Monthly punctuality trend charts, subject compliance ranking, and 4-point real-time eligibility checklist for institutional Perfect Attendance Award.
* **Backend Function:** `analyticsService.getStudentAnalytics(studentId, academicTerm)`
* **4-Point Criteria Evaluation Contract:**
  ```json
  {
    "student_id": "s230111001",
    "academic_term": "1st Semester AY 2026-2027",
    "criteria": {
      "overallRate": { "required": 100.0, "actual": 94.7, "passed": false },
      "unexcusedAbsences": { "maxAllowed": 0, "actual": 1, "passed": false },
      "tardinessLimit": { "maxAllowed": 2, "actual": 1, "passed": true },
      "approvedExcuseRatio": { "maxAllowed": 2, "actual": 1, "passed": true }
    },
    "eligibilityStatus": "At Risk",
    "conferredAwards": []
  }
  ```

---

### PART B: Teacher Portal (`teacher/`)

#### Screen T1: Daily Attendance Roll Call (`teacher/daily-attendance.html`)
* **UI Purpose:** Interactive classroom roster for conducting daily roll calls, marking time-in/time-out, toggling statuses (Present, Late, Absent, Excused), and committing the class session.
* **Backend Functions:**
  * `teacherAttendanceService.getClassRoster(section, date)`
  * `teacherAttendanceService.commitClassAttendance(sessionPayload)`
* **Batch Mutation Payload (Committed to `attendance` table):**
  ```json
  {
    "section": "BSIT 3A",
    "subject_code": "IT301",
    "date": "2026-09-02",
    "teacher_id": "t230111001",
    "records": [
      {
        "student_id": "s230111001",
        "student_name": "Juan Paolo Dela Cruz",
        "course_section": "BSIT 3A",
        "time_in": "07:54:00",
        "status": "Present",
        "method": "RFID",
        "remarks": "On Time"
      },
      {
        "student_id": "s230111002",
        "student_name": "Kenneth Bautista",
        "course_section": "BSIT 3A",
        "time_in": "08:22:00",
        "status": "Late",
        "method": "QR Code",
        "remarks": "+22 mins late"
      }
    ]
  }
  ```
* **Automated SMS Dispatch Trigger:** When a student is committed as `Late` or `Absent`, an automated background row is inserted into `sms_logs` to trigger the parent notification SMS gateway.

---

#### Screen T2: Live RFID & QR Scanner (`teacher/rfid-and-qr/live-scanner.html`)
* **UI Purpose:** Real-time hardware kiosk/webcam scanner screen that listens for contactless RFID card taps or dynamic QR camera decodes and registers attendance within 500ms.
* **Backend Function:** `scannerService.processScan(scanPayload)`
* **Scan Ingest Payload (from hardware reader or camera decoder):**
  ```json
  {
    "scan_type": "RFID", // or "QR"
    "identifier": "E20000192803001", // RFID UID or decrypted QR payload
    "checkpoint_room": "Lab 304",
    "subject_code": "IT301",
    "timestamp": "2026-09-02T07:54:12+08:00"
  }
  ```
* **Backend Processing Pipeline:**
  1. Look up student record in `students` via `rfid_uid = identifier` OR `qr_code = identifier`.
  2. Verify enrollment in the active class session schedule.
  3. Determine status:
     * If scan time $\le$ `schedule_start + 15 mins`: `status = 'Present'`
     * If scan time $>$ `schedule_start + 15 mins`: `status = 'Late'`
  4. Insert record into `attendance`.
  5. Return resolved student profile card for immediate UI visual and audio verification.
* **Scan Response to Scanner UI:**
  ```json
  {
    "success": true,
    "student": {
      "student_id": "s230111001",
      "name": "Juan Paolo Dela Cruz",
      "course": "BSIT",
      "section": "3A",
      "time_in": "07:54 AM",
      "status": "Present",
      "remarks": "Normal Time-In Verified"
    }
  }
  ```

---

#### Screen T3: Excuse Management (`teacher/excuse-slip/`)
* **UI Purpose:** Pending requests inbox where faculty members inspect student excuses, examine document previews, and either approve or reject with feedback notes.
* **Backend Function:** `teacherExcuseService.reviewExcuseSlip(slipId, action, remarks)`
* **Review Mutation Payload:**
  ```json
  {
    "slipId": "slip-uuid-88",
    "action": "Approved", // or "Rejected"
    "teacher_id": "t230111001",
    "reviewer_remarks": "Medical certificate verified with clinic doctor."
  }
  ```
* **Database Updates:**
  1. `UPDATE excuse_slips SET status = 'Approved', reviewer_id = teacher_id, updated_at = NOW() WHERE id = slipId;`
  2. `UPDATE attendance SET status = 'Excused', remarks = 'Medical Certificate' WHERE student_id = :student_id AND date = :absence_date;`

---

### PART C: Administrator Portal (`admin/`)

#### Screen A1: Campus-Wide Administrative Dashboard (`admin/dashboard.html`)
* **UI Purpose:** System-wide attendance metrics, real-time campus presenteeism gauge, active kiosk telemetry, and system audit counters.
* **Backend Function:** `adminDashboardService.getCampusMetrics()`
* **Supabase Aggregations:**
  ```javascript
  // 1. Total student and faculty population
  const { count: totalStudents } = await supabase.from('students').select('*', { count: 'exact', head: true });
  const { count: totalTeachers } = await supabase.from('teachers').select('*', { count: 'exact', head: true });

  // 2. Today's total scans by status
  const today = new Date().toISOString().split('T')[0];
  const { data: todayStats } = await supabase
    .from('attendance')
    .select('status')
    .eq('date', today);
  ```

---

#### Screen A2: User Management (`admin/user-management.html`)
* **UI Purpose:** Full CRUD operations for Student and Faculty directories, RFID badge assignment, and credential provisioning.
* **Backend Functions:**
  * `userService.createStudent(studentData)`
  * `userService.updateRfidBinding(userId, rfidUid)`
  * `userService.deactivateAccount(userId)`
* **Student Provisioning Payload:**
  ```json
  {
    "student_id": "s230111099",
    "name": "Maria Clara Santos",
    "email": "m.santos@gmail.com",
    "course": "BSIT",
    "section": "3A",
    "rfid_uid": "E20000192984001",
    "validation_date": "1st Semester"
  }
  ```

---

#### Screen A3: RFID Registry & Hardware Center (`admin/rfid-and-qr/rfid-registry.html`)
* **UI Purpose:** Physical RFID card inventory, UID mapping status (`Assigned`, `Unassigned`, `Reported Lost`, `Defective`), and card re-issuance log.
* **Backend Function:** `rfidService.getCardInventory(statusFilter)`
* **Inventory Query Contract:**
  ```json
  [
    {
      "card_uid": "E20000192803001",
      "assigned_to_id": "s230111001",
      "assigned_to_name": "Juan Paolo Dela Cruz",
      "role": "student",
      "status": "Assigned",
      "assigned_at": "2026-08-15T09:00:00Z"
    },
    {
      "card_uid": "E20000192999002",
      "assigned_to_id": null,
      "assigned_to_name": "—",
      "role": "unassigned",
      "status": "Available in Stock",
      "assigned_at": null
    }
  ]
  ```

---

## 3. Real-Time Synchronization Specifications

SMS1-AMS utilizes **Supabase Realtime WebSockets** (`postgres_changes`) to push updates instantly across devices:

### Channel 1: Live Attendance Scan Broadcast (`attendance-scanner-channel`)
* **Listening Views:**
  * `teacher/rfid-and-qr/live-scanner.html` (Plays sound and renders verified student card).
  * `teacher/daily-attendance.html` (Auto-updates student row from `Absent` to `Present`).
  * `admin/dashboard.html` (Increments today's Present counter without page refresh).
* **Subscription Code Pattern:**
  ```javascript
  supabase
    .channel('public:attendance')
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'attendance'
    }, (payload) => {
      handleIncomingScan(payload.new);
    })
    .subscribe();
  ```

### Channel 2: Excuse Slip Status Dispatch (`excuse-notifications-channel`)
* **Listening Views:**
  * `teacher/excuse-slip/pending-requests.html` (Notifies faculty of new student excuse submissions).
  * `student/notifications.html` & `student/my-requests.html` (Alerts student immediately upon teacher approval or rejection).

---

## 4. UI State & Feedback Standards

Every data-dependent component in SMS1-AMS must explicitly handle three essential UI states:

```
┌─────────────────────────────────────────────────────────────┐
│ 1. LOADING STATE                                            │
│    - Render animated pulse skeletons: `animate-pulse`       │
│    - Display matching container dimensions to prevent layout │
│      shifts (CLS).                                          │
├─────────────────────────────────────────────────────────────┤
│ 2. EMPTY STATE                                              │
│    - Dedicated SVG icon styled in neutral slate/gray.        │
│    - Clear title: "No Attendance Records Found"             │
│    - Helpful subtitle + actionable button ("Reset Filters"). │
├─────────────────────────────────────────────────────────────┤
│ 3. ERROR & RECOVERY STATE                                   │
│    - Non-intrusive toast alert via `showToast(title, msg)`. │
│    - Seamless fallback to local structured cache.           │
│    - "Try Again" manual trigger for network retries.        │
└─────────────────────────────────────────────────────────────┘
```

---

## 5. Developer & Agent Implementation Rules

1. **Pure HTML5 + Vanilla JS Only:** Never introduce React (`.jsx`), Vue, Angular, or jQuery into this repository. Keep all logic in pure JavaScript modules.
2. **Dual Fallback Standard:** Always preserve local fallback datasets so views render perfectly even when offline or accessed via `file:///` protocols during testing.
3. **Respect Row-Level Security (RLS):** Never bypass RLS policies or attempt to use service-role administrative keys inside client-side frontend code.
4. **Immediate Feedback & Auditing:** Any action mutating attendance or excuse slips must trigger a corresponding toast notification (`showToast`) and record an audit log entry in `user_activity`.
5. **Cross-Panel Consistency:** When editing backend queries for one role, verify that complementary fields across the other two roles (e.g. status changes reflecting between `student/attendance-calendar.html` and `teacher/daily-attendance.html`) remain synchronized.
