---
name: qa-seed-data
description: Comprehensive quality assurance checklists, cross-role multi-device verification workflows, and realistic mock seed data generation for the Bestlink College of the Philippines Attendance Monitoring System. Use when generating test records, verifying multi-panel workflows, or preparing for capstone demonstrations and defense.
---

# Quality Assurance & Test Seed Data Skill (SMS1-AMS)

## Goal

Ensure complete system integrity, data consistency, and seamless end-to-end demonstrations across **Admin**, **Teacher**, and **Student** panels, with realistic mock seed data showcasing the **5 SMS 1 Integration Bridges** for the pre-oral defense presentation.

---

## 1. Five Pre-Oral Defense Demonstration Scenarios

### Scenario 1: Perfect Attendance Award & OSAS Bridge (Submodule 9)
* **Persona:** Juan Paolo Dela Cruz (`s230111001`, `BSIT 3A`)
* **Test Flow:**
  1. Student maintains 100% attendance rate with zero unexcused cuts and 0 tardies over the term.
  2. Teacher reviews qualifying candidates on `teacher/perfect-attendance.html` and clicks **Endorse to Admin**.
  3. Admin reviews endorsed list on `admin/perfect-attendance.html` and executes **Confer Award**.
  4. Record updates with `osas_endorsement_status = 'CONFERRED'` and generates unique `certificate_serial_hash`.
  5. Student opens `student/perfect-attendance.html` to see the conferred digital award badge and official verification hash.

### Scenario 2: Chronic Truant Student & PREFECT Bridge (Submodule 3 & 7)
* **Persona:** Pedro Penduko (`s230111002`, `BSIT 3A`)
* **Test Flow:**
  1. Student accumulates 3 consecutive unexcused absences in IT301.
  2. System flags student as `is_habitual_truancy = true` on `admin/tardy-and-absence/habitual-offender.html`.
  3. AMS dispatches urgent Parent SMS alert ("NOTICE: 3 unexcused absences...") visible on `admin/parent-alerts.html`.
  4. AMS injects a disciplinary referral into `prefect_incident_referrals` (`referral_type = 'HABITUAL_TRUANCY'`).

### Scenario 3: Dual-Option Medical Excuse Slip & Clinic Bridge (Submodule 5)
* **Persona:** Clara Santos (`s230111003`, `BSIT 3A`)
* **Test Flow:**
  1. Student submits an excuse slip on `student/excuse-slip/submit-excuse.html`:
     * Option A: Uploads an external doctor's medical certificate PDF.
     * Option B: Enters Clinic Slip Number `CLN-2026-0842` issued by the BCP Campus Clinic.
  2. Teacher views the pending request on `teacher/excuse-slip/pending-requests.html` with the `[School Clinic Verified]` badge.
  3. Teacher approves the slip. Daily roll call status in `teacher/daily-attendance.html` and `student/my-attendance.html` automatically mutates from `Absent` to `Excused`.

### Scenario 4: Faculty Punctuality & Academic HR DTR Bridge (Submodule 4)
* **Persona:** Prof. Robert Miller (`t230111001`, College of Computer Studies)
* **Test Flow:**
  1. Teacher taps RFID card `E20000192900001` at the campus gate turnstile.
  2. Log is recorded in `teacher_attendance` with `time_in = '07:48 AM'` (On Time).
  3. At 05:00 PM, teacher taps out; system computes `rendered_hours = 8.00`.
  4. Record automatically syncs to `hr_faculty_dtr` for Academic HR payroll compliance.

### Scenario 5: Campus Event Scanning & School Events Bridge (Submodule 2)
* **Test Flow:**
  1. Kiosk scanner on `teacher/rfid-and-qr/live-scanner.html` is toggled to **Event Mode** (`scan_context = 'EVENT_VENUE'`) for "BCP Foundation Week 2026".
  2. Students tap RFID or scan QR passes; badge reads log directly into `rfid_qr_scan_logs` referencing `event_id`.
  3. Kiosk displays live real-time attendee headcounts.

---

## 2. Standard Capstone Demo Seed Personas

| Role | Full Name | ID Number | Email / Login | RFID UID | Key Demo Purpose |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Admin** | Engr. Administrator | `ADMIN-001` | `admin@bcp.edu.ph` | `E20000192999001` | Campus-wide audits, reports generation |
| **Teacher** | Prof. Robert Miller | `t230111001` | `teacher@gmail.com` | `E20000192900001` | Classroom roll call, DTR logging, excuse review |
| **Student 1**| Juan Paolo Dela Cruz | `s230111001` | `student@gmail.com` | `E20000192803001` | 100% attendance, Perfect Attendance Qualifier |
| **Student 2**| Pedro Penduko | `s230111002` | `pedro@gmail.com` | `E20000192803002` | Habitual truant, Prefect referral, Parent SMS |
| **Student 3**| Clara Santos | `s230111003` | `clara@gmail.com` | `E20000192803003` | Medical excuse filer (Clinic pass & external cert) |

---

## 3. QA Pre-Flight Checklist

Before presenting the system in a capstone pre-oral defense:
- [ ] Sidebars across Admin, Teacher, and Student cleanly show only the 10 official submodules.
- [ ] No `academic-management.html` link exists in navigation.
- [ ] Operational tables have zero local export buttons (all reporting operates in Submodule 10).
- [ ] Dual-option medical excuse slip toggle renders and submits cleanly.
- [ ] All status badges follow institutional colors (Green, Orange, Red, Blue, Purple).
- [ ] Zero console errors and zero emojis in UI badges or text.
