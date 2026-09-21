# SMS 1 Cross-Module Integration Bridges & Touchpoints

**Project Title:** Attendance Monitoring System for Bestlink College of the Philippines with Performance Analytics and RFID/QR Scanning  
**Ecosystem:** School Management System 1 (SMS 1) Master Architecture  
**Document Purpose:** Architectural specification for cross-module integration bridges linking AMS to companion SMS 1 systems.

---

## 1. Executive Overview

Within the Bestlink College of the Philippines (BCP) School Management System (SMS 1) ecosystem, the **Attendance Monitoring System (AMS)** functions as the real-time institutional attendance truth engine. Rather than operating in isolation, AMS consumes identity records from a shared data directory and transmits verified attendance events to five downstream companion systems:

1. **Clinic Management System**
2. **PREFECT Disciplinary Action System**
3. **Academic HR Management System**
4. **Office of Student Affairs and Services (OSAS)**
5. **School Event Management System**

---

## 2. Shared SMS 1 Master Data Layer

All SMS 1 systems share a common directory layer to maintain a single identity for every campus entity:

```
+-------------------------------------------------------------+
|                SMS 1 SHARED MASTER DIRECTORY                |
+-------------------------------------------------------------+
| 1. users / profiles                                         |
|    - id (UUID, PK)                                          |
|    - school_id (VARCHAR: e.g., '2024-00123')                |
|    - first_name, last_name, email                           |
|    - role ('ADMIN', 'TEACHER', 'STUDENT')                   |
|    - rfid_uid (VARCHAR: Unique physical RFID serial)        |
|    - qr_code_hash (VARCHAR: Encrypted dynamic QR pass)      |
|    - department_id, program_strand, section                 |
+-------------------------------------------------------------+
| 2. academic_calendar                                        |
|    - id (UUID, PK)                                          |
|    - school_year (VARCHAR: '2025-2026')                     |
|    - semester ('1ST_SEMESTER', '2ND_SEMESTER', 'SUMMER')    |
|    - holiday_dates (DATE[]: Recognized holiday blackout)    |
|    - suspension_dates (DATE[]: Calamity / typhoon closures) |
+-------------------------------------------------------------+
```

---

## 3. The 5 Integration Touchpoints

### Bridge 1: AMS <-> Clinic Management System
* **Touchpoint:** Medical Excuse Slips & Campus Clinic Visits.
* **Problem Solved:** Prevents falsified medical excuses and streamlines health-related absences.
* **Workflow:**
  1. If a student is admitted to the school clinic during school hours, the Clinic Nurse creates a `clinic_visit_log`.
  2. The student can file an Excuse Slip in AMS selecting **"School Clinic Pass"** as the document source.
  3. AMS verifies the `clinic_visit_id` against the clinic module, automatically assigning the verified status `Excused (Clinic Verified)`.
  4. Students with outside medical treatment can choose **"External Medical Certificate"** and upload doctor prescriptions / hospital certificates for standard review.
* **Bridge Schema Contract:**
  ```sql
  ALTER TABLE excuse_slips ADD COLUMN IF NOT EXISTS excuse_source VARCHAR(30) DEFAULT 'EXTERNAL_MEDICAL'; -- 'EXTERNAL_MEDICAL' or 'CLINIC_PASS'
  ALTER TABLE excuse_slips ADD COLUMN IF NOT EXISTS clinic_visit_id UUID REFERENCES clinic_visit_logs(id);
  ALTER TABLE excuse_slips ADD COLUMN IF NOT EXISTS clinic_verification_status VARCHAR(20) DEFAULT 'NOT_APPLICABLE'; -- 'VERIFIED', 'PENDING_CLINIC', 'NOT_APPLICABLE'
  ```

---

### Bridge 2: AMS <-> PREFECT Disciplinary Action System
* **Touchpoint:** Habitual Truancy & Chronic Tardiness Escalation.
* **Problem Solved:** Bridges classroom attendance records directly to student disciplinary counseling without manual paper referrals.
* **Workflow:**
  1. AMS continuously calculates cumulative attendance statistics in `absence_records` and `tardy_records`.
  2. When a student exceeds the institutional threshold:
     * **3 Consecutive Unexcused Absences**, OR
     * **5 Tardy Occurrences in a Grading Period**
  3. AMS flags the student as `is_habitual_truancy = true`.
  4. AMS automatically injects a pending case into `prefect_incident_referrals`.
  5. The Prefect Officer accesses the referral to issue an official Summon / Parent Conference Notice.
* **Bridge Schema Contract:**
  ```sql
  ALTER TABLE absence_records ADD COLUMN IF NOT EXISTS is_habitual_truancy BOOLEAN DEFAULT false;
  ALTER TABLE absence_records ADD COLUMN IF NOT EXISTS prefect_referral_id UUID REFERENCES prefect_incident_referrals(id);
  
  -- Prefect Incident Referral Payload
  -- {
  --   "student_id": "UUID",
  --   "referral_type": "HABITUAL_TRUANCY",
  --   "consecutive_absences": 3,
  --   "trigger_date": "2026-09-20",
  --   "status": "PENDING_DISCIPLINARY_REVIEW"
  -- }
  ```

---

### Bridge 3: AMS <-> Academic HR Management System
* **Touchpoint:** Faculty Daily Time Record (DTR) & Biometric/RFID Gate Logs.
* **Problem Solved:** Automates teacher attendance recording for payroll, punctuality tracking, and leave management.
* **Workflow:**
  1. Faculty members tap their RFID badge or scan their credential upon campus entry, room entry, and campus exit.
  2. AMS records timestamps, calculates rendered teaching minutes, and flags late arrivals in `teacher_attendance`.
  3. This stream feeds directly into `hr_faculty_dtr`.
  4. If a faculty member has an approved leave in `hr_leave_applications`, AMS automatically reflects their status as `On Official Leave / Excused`.
* **Bridge Schema Contract:**
  ```sql
  ALTER TABLE teacher_attendance ADD COLUMN IF NOT EXISTS employee_id VARCHAR(50);
  ALTER TABLE teacher_attendance ADD COLUMN IF NOT EXISTS rendered_hours DECIMAL(4,2);
  ALTER TABLE teacher_attendance ADD COLUMN IF NOT EXISTS hr_leave_id UUID REFERENCES hr_leave_applications(id);
  ALTER TABLE teacher_attendance ADD COLUMN IF NOT EXISTS hr_sync_status VARCHAR(20) DEFAULT 'SYNCED';
  ```

---

### Bridge 4: AMS <-> OSAS (Office of Student Affairs and Services)
* **Touchpoint:** Perfect Attendance Awards & Student Conduct Clearance.
* **Problem Solved:** Automates eligibility verification for semester honors and graduation clearance.
* **Workflow:**
  1. At term-end, Submodule 9 (Perfect Attendance Award Tool) executes automated qualification filtering (100% attendance, zero unexcused cuts, zero unresolved tardy sanctions).
  2. The candidate list is published to OSAS via `perfect_attendance_awards`.
  3. OSAS validates candidates for official semester convocation conferment.
  4. Students with pending or unresolved truancy sanctions are flagged on the OSAS graduation clearance list (`osas_student_clearance`).
* **Bridge Schema Contract:**
  ```sql
  ALTER TABLE perfect_attendance_awards ADD COLUMN IF NOT EXISTS osas_endorsement_status VARCHAR(20) DEFAULT 'PENDING_OSAS'; -- 'PENDING_OSAS', 'ENDORSED', 'CONFERRED'
  ALTER TABLE perfect_attendance_awards ADD COLUMN IF NOT EXISTS certificate_serial_hash VARCHAR(64) UNIQUE;
  ```

---

### Bridge 5: AMS <-> School Event Management System
* **Touchpoint:** Campus Event & Assembly Attendance Verification.
* **Problem Solved:** Reuses existing RFID/QR scanning hardware for institutional events (Intramurals, Seminars, Assemblies).
* **Workflow:**
  1. When an institutional event is scheduled in `school_events`, organizers generate an event session.
  2. AMS Scanner Kiosk (`live-scanner.html`) toggles `scan_context` from `CLASSROOM_PERIOD` to `EVENT_VENUE` with the corresponding `event_id`.
  3. Student and faculty badge taps log directly into `event_attendance_logs`.
  4. Organizers receive real-time headcount dashboards.
* **Bridge Schema Contract:**
  ```sql
  ALTER TABLE rfid_qr_scan_logs ADD COLUMN IF NOT EXISTS event_id UUID REFERENCES school_events(id);
  ALTER TABLE rfid_qr_scan_logs ADD COLUMN IF NOT EXISTS scan_context VARCHAR(30) DEFAULT 'CLASSROOM_PERIOD'; -- 'GATE_ENTRY', 'CLASSROOM_PERIOD', 'EVENT_VENUE'
  ```

---

## 4. Pre-Oral Defense Presentation Talking Points

When demonstrating the SMS 1 system integration to the panel:

1. **Interoperability:** Emphasize that AMS does not duplicate user records. User identities, RFID card UIDs, and QR hashes are maintained in the central SMS 1 directory.
2. **Automated Escalation (Zero Paperwork):** Show that when a student misses 3 consecutive classes, AMS immediately generates a Prefect Disciplinary Referral and dispatches an SMS notification to the parent.
3. **Dual Medical Flexibility:** Highlight that students can submit outside medical certificates or link their existing on-campus clinic consultation pass.
4. **Faculty Compliance:** Demonstrate how teacher RFID taps produce automated Daily Time Records (DTR) for Academic HR.
5. **Clean Single-Responsibility UI:** Show how each module stays uncluttered because institutional CSV/Excel/PDF reports are completely centralized in Submodule 10.
