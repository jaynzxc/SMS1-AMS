---
name: ui-ux_backend_spec
description: Backend specifications, API query shapes, payload contracts, loading/empty/error states, and Supabase real-time bindings powering the Bestlink College of the Philippines Attendance Monitoring System (SMS1-AMS) UI/UX components. Use when connecting frontend views to Supabase services.
---

# UI/UX Backend Specification Skill (SMS1-AMS)

## Goal

Provide a concrete, standardized contract between the **Pure HTML5 + Compiled Tailwind CSS + Vanilla JavaScript UI Components** and the **Supabase PostgreSQL Backend Services** for the **Bestlink College of the Philippines Attendance Monitoring System (SMS1-AMS)**. This ensures developers and AI agents know the exact database tables, query shapes, mutation payloads, loading/empty states, and real-time event bindings required across the **Admin**, **Teacher**, and **Student** portals in alignment with the **10 Official Submodules** and the **Centralized Export Standard (Option 1)**.

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

#### Screen S4: Attendance Calendar (`student/attendance-calendar.html`)
* **UI Purpose:** Interactive monthly calendar grid, 5 KPI summary cards, color-coded daily badges (Present, Late, Absent, Excused, Holiday), and slide-over day breakdown drawer.
* **Backend Functions:**
  * `calendarService.getMonthAttendance(studentId, year, month)`
  * `calendarService.getDayBreakdown(studentId, dateString)`

#### Screen S5: Dual-Option Excuse Slip Submission (`student/excuse-slip/submit-excuse.html`)
* **UI Purpose:** Digital excuse slip submission supporting both external doctor certificates and on-campus school clinic passes.
* **Backend Functions:**
  * `excuseService.submitExcuseSlip(formData, fileAttachment)`
  * `excuseService.getStudentExcuseHistory(studentId)`
* **Payload Contract (Table `excuse_slips`):**
  ```json
  {
    "student_id": "s230111001",
    "student_name": "Juan Paolo Dela Cruz",
    "course_section": "BSIT 3A",
    "absence_date": "2026-09-08",
    "subject_code": "IT302",
    "reason_category": "Medical Illness",
    "medical_source": "CLINIC_PASS",
    "clinic_pass_number": "CLN-2026-0842",
    "clinic_visit_id": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
    "clinic_verification_status": "VERIFIED",
    "explanation": "Treated at BCP campus clinic for acute dehydration.",
    "document_url": null,
    "status": "Pending",
    "created_at": "2026-09-08T18:30:00Z"
  }
  ```
* *When `medical_source = 'EXTERNAL_MEDICAL'`*: `document_url` stores the Supabase storage path to the uploaded doctor's prescription PDF/JPG, and `clinic_pass_number` is null.
* **Backend Resolution:** When a teacher or administrator approves the slip, `attendance.status` for matching `student_id` and `date` is automatically mutated from `Absent` to `Excused`.

---

### PART B: Teacher Portal (`teacher/`)

#### Screen T1: Daily Attendance Roll Call (`teacher/daily-attendance.html`)
* **UI Purpose:** Interactive classroom roster for conducting daily roll calls, marking time-in/time-out, toggling statuses (Present, Late, Absent, Excused), and committing the class session.
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
      }
    ]
  }
  ```

#### Screen T2: Live RFID & QR Scanner (`teacher/rfid-and-qr/live-scanner.html`)
* **UI Purpose:** Dual-mode kiosk listening for physical ESP32 RFID taps or webcam QR scans.
* **Scan Ingestion Payload (Committed to `scan_logs` & `attendance`):**
  ```json
  {
    "token_type": "RFID",
    "token_value": "E20000192803001",
    "scan_timestamp": "2026-09-20T08:05:12Z",
    "scan_context": "CLASSROOM_PERIOD",
    "subject_id": "IT301",
    "event_id": null
  }
  ```
* *Event Mode Support*: When `scan_context = 'EVENT_VENUE'`, `event_id` references `school_events.id` from the School Event Management System.

---

### PART C: Centralized Reporting Engine (`admin/reports-export.html` & `teacher/reports-export.html`)

In accordance with **Option 1 (Full Centralization)**, operational tables DO NOT execute individual export queries. All CSV, Excel, and PDF downloads are handled exclusively through Submodule 10.

* **Backend Function:** `reportsExportService.generateDataset(filters)`
* **Filter Contract:**
  ```json
  {
    "report_type": "DAILY_MASTER_ATTENDANCE",
    "academic_year": "2026-2027",
    "semester": "1ST_SEMESTER",
    "start_date": "2026-09-01",
    "end_date": "2026-09-20",
    "department_id": "CITE",
    "course_strand": "BSIT",
    "section": "3A",
    "export_format": "CSV"
  }
  ```
* **Supported Report Generators:**
  1. `DAILY_MASTER_ATTENDANCE` (Aggregated student rosters by date)
  2. `HABITUAL_TRUANCY_LIST` (Students exceeding late/absence thresholds)
  3. `FACULTY_DTR_SUMMARY` (Teacher attendance, duty hours, late arrivals for Academic HR)
  4. `PARENT_SMS_DISPATCH_AUDIT` (SMS delivery logs, timestamps, gateway statuses)
  5. `EXCUSE_SLIP_LEDGER` (Medical certificates, clinic passes, review audits)

---

### PART D: SMS 1 Ecosystem Integration Bridges

#### Bridge 1: Clinic Consultation Verification
```javascript
// Query Clinic Management record to verify a student's clinic slip
async function verifyClinicPass(clinicPassNumber) {
  const { data, error } = await supabase
    .from('clinic_visit_logs')
    .select('id, student_id, diagnosis, time_admitted, time_discharged, nurse_name')
    .eq('pass_number', clinicPassNumber)
    .single();
  return { data, error };
}
```

#### Bridge 2: Prefect Disciplinary Referral Insertion
```javascript
// Automatically escalate a habitual offender to the PREFECT module
async function escalateToPrefect(studentId, consecutiveAbsences, reason) {
  const { data, error } = await supabase
    .from('prefect_incident_referrals')
    .insert({
      student_id: studentId,
      referral_type: 'HABITUAL_TRUANCY',
      consecutive_absences: consecutiveAbsences,
      violation_summary: reason,
      status: 'PENDING_DISCIPLINARY_REVIEW',
      created_at: new Date().toISOString()
    });
  return { data, error };
}
```

#### Bridge 3: Academic HR Faculty DTR Sync
```javascript
// Feed verified faculty RFID taps to Academic HR for payroll
async function syncFacultyDTR(teacherLog) {
  const { data, error } = await supabase
    .from('hr_faculty_dtr')
    .upsert({
      employee_id: teacherLog.teacher_id,
      duty_date: teacherLog.date,
      time_in: teacherLog.time_in,
      time_out: teacherLog.time_out,
      rendered_hours: teacherLog.rendered_hours,
      status: teacherLog.status
    });
  return { data, error };
}
```

---

## 3. Real-Time Synchronization Specifications

SMS1-AMS utilizes **Supabase Realtime WebSockets** (`postgres_changes`) to push updates instantly across devices:

### Channel 1: Live Attendance Scan Broadcast (`attendance-scanner-channel`)
* **Listening Views:**
  * `teacher/rfid-and-qr/live-scanner.html` (Plays sound and renders verified student card).
  * `teacher/daily-attendance.html` (Auto-updates student row from `Absent` to `Present`).
  * `admin/dashboard.html` (Increments today's Present counter without page refresh).

### Channel 2: Excuse Slip Status Dispatch (`excuse-notifications-channel`)
* **Listening Views:**
  * `teacher/excuse-slip/pending-requests.html` (Notifies faculty of new student excuse submissions).
  * `student/notifications.html` & `student/my-requests.html` (Alerts student immediately upon teacher approval or rejection).

---

## 4. UI State & Feedback Standards

Every data-dependent component in SMS1-AMS must explicitly handle three essential UI states:
1. **Loading State**: Animated pulse skeletons (`animate-pulse`) matching exact container dimensions.
2. **Empty State**: Centered neutral icon, clean message ("No Attendance Records Found"), actionable reset button.
3. **Error & Recovery State**: Non-intrusive toast alert (`showToast`), graceful fallback to local structured cache, retry trigger.

---

## 5. Developer & Agent Implementation Rules

1. **Pure HTML5 + Vanilla JS Only:** Never introduce React, Vue, Angular, or jQuery. Keep all logic in pure JavaScript modules.
2. **Centralized Exports (Option 1):** Never place export buttons or modal markup on operational tables. All exports pass through Submodule 10.
3. **Dual Medical Flexibility:** Always support both `EXTERNAL_MEDICAL` uploads and `CLINIC_PASS` verification numbers.
4. **Dual Fallback Standard:** Always preserve local fallback datasets so views render perfectly even when offline or accessed via `file:///` protocols during testing.
5. **Respect Row-Level Security (RLS):** Never bypass RLS policies or attempt to use service-role administrative keys inside client-side frontend code.
6. **Zero Emojis:** Never use emojis in code, comments, console logs, commit messages, or UI elements.
