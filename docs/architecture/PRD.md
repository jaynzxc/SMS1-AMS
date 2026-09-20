# Product Requirements Document (PRD)

## Project Title
**Design and Development of an Attendance Monitoring System for Bestlink College of the Philippines with Performance Analytics and RFID/QR Scanning (SMS1-AMS)**

---

## 1. Document Control & Metadata
* **Institution:** Bestlink College of the Philippines (BCP)
* **Program:** Bachelor of Science in Information Technology
* **Document Version:** 2.0.0 (Phase 2 Restructured & SMS 1 Aligned)
* **Status:** Approved for Pre-Oral Defense & System Architecture
* **Target Audience:** Capstone Advisers, Defense Panel, Lead System Developers, Database Administrators

---

## 2. Executive Summary & Problem Statement

### 2.1 Background
Bestlink College of the Philippines manages thousands of students and faculty members across diverse academic programs. Traditional manual attendance tracking (paper roll calls, manual logs, and localized spreadsheets) suffers from significant vulnerabilities:
1. **Inefficiency and Lost Instructional Time:** Teachers spend 5–10 minutes per class verifying attendance manually.
2. **Attendance Tampering & Proxy Signing:** Students can sign attendance sheets for absent peers.
3. **Delayed Guardian Intervention:** Parents often discover truancy or chronic tardiness weeks later during midterm grading periods.
4. **Data Inconsistency:** Absence records, excuse slips, and honor awards are tracked in disparate silos.

### 2.2 Solution Overview
The **BCP Attendance Monitoring System (SMS1-AMS)** is a web-based, multi-role management platform integrated with **IoT RFID hardware (ESP32 + RC522)**, **dynamic camera-based QR scanning**, **automated parental SMS alerting**, **data-driven performance analytics**, and **Row Level Security (RLS)** powered by Supabase PostgreSQL. 

The system is strictly partitioned into **10 official submodules**, centralizes all data exports into Submodule 10 (**Option 1 Standard**), and operates 5 standardized data bridges connecting to the wider **SMS 1 Master Architecture** (Clinic Management, PREFECT Disciplinary Action, Academic HR, OSAS, and School Events).

---

## 3. Project Objectives

### 3.1 General Objective
To design and develop an institutional Attendance Monitoring System for Bestlink College of the Philippines featuring contactless RFID and QR scanning, real-time performance analytics, automated excuse management, and defense-in-depth data security.

### 3.2 Specific Objectives
1. Implement a **dual-method identification pipeline** supporting physical Mifare RFID card tapping and dynamic time-bounded QR code scanning.
2. Automate **parental SMS advisories** dispatched immediately upon late arrivals or unexcused absences.
3. Establish a **3-role authorization framework** (**Admin**, **Teacher**, **Student**) strictly mapped to the 10 official submodules.
4. Digitize the **excuse slip lifecycle** supporting both external medical certificate uploads and campus clinic pass references.
5. Provide **real-time performance analytics** (punctuality trends, subject attendance compliance against the 80% institutional threshold, and chronic tardiness warnings).
6. Automate the **Perfect Attendance Award verification ledger**, establishing end-to-end criteria tracking without allowing unauthorized self-generation of credentials.
7. Centralize all compliance and academic exports (DepEd SF2, habitual truancy lists, faculty DTR summaries) in Submodule 10, eliminating table-level export clutter.
8. Establish **SMS 1 ecosystem integration bridges** connecting attendance data with Clinic, Prefect, Academic HR, OSAS, and School Events.

---

## 4. The 10 Official Submodules Taxonomy

The system architecture and user navigation strictly align with the 10 official AMS submodules:

```
+---------------------------------------------------------------------------------+
|                       10 OFFICIAL AMS SUBMODULES                                |
+---------------------------------------------------------------------------------+
| 1. Daily Attendance Marking       | 6. Attendance Calendar                      |
| 2. RFID / QR Scanning             | 7. Alerts to Parents                        |
| 3. Tardy & Absence Logs           | 8. Analytics Dashboard                      |
| 4. Teacher Attendance             | 9. Perfect Attendance Award Tool            |
| 5. Excuse Slip Submission         | 10. CSV / Excel Export                      |
+---------------------------------------------------------------------------------+
```

### Role-Based Access Matrix

| Submodule # | Submodule Name | Admin Portal (`admin/`) | Teacher Portal (`teacher/`) | Student Portal (`student/`) |
| :---: | :--- | :--- | :--- | :--- |
| **8** | **Analytics Dashboard** | Campus-wide KPI Dashboard | Class Performance Analytics | Personal Analytics & Streak |
| **1** | **Daily Attendance** | Master Audit & Override | Class Roster Roll Call & Submit | Personal Attendance Records |
| **2** | **RFID / QR Scanning** | RFID Registry & QR Manager | Live Kiosk (Class & Event Mode) | Dynamic QR Pass & RFID Card |
| **3** | **Tardy & Absence Logs** | Campus Tardy/Absence Lists | Section Late & Truancy Lists | Personal Delay & Risk Ledger |
| **4** | **Teacher Attendance** | HR Campus DTR Review | Personal Faculty DTR Log | *Staff Only (No Access)* |
| **5** | **Excuse Slip Submission** | Institutional Oversight/Appeals| First-Line Section Approval | Dual-Option Excuse Submission |
| **6** | **Attendance Calendar** | Campus Presence Heatmap | Class Schedule Calendar | Personal Attendance Calendar |
| **7** | **Alerts to Parents** | Outbound SMS Queue & Audit | Class Absence Notification Feed | In-App Alert Inbox |
| **9** | **Perfect Attendance** | Threshold Setup & Conferment | Section Nominee Endorsement | Eligibility Criteria & Record |
| **10** | **Reports & Export** | Full Institutional Reports Hub | Section Grading Sheets | Personal CSV Transcript Only |

*(Rule: Curriculum and syllabus management belongs to the SMS 1 Academic Module; `academic-management.html` is omitted from AMS navigation).*

---

## 5. Functional Requirements (FR)

### 5.1 Submodule 1: Daily Attendance Marking
* **FR-1.1:** Teachers shall conduct daily classroom roll calls by subject and section, recording student statuses: *Present*, *Late*, *Absent*, or *Excused*.
* **FR-1.2:** Teachers shall have options to save local drafts before final submission to Administration.
* **FR-1.3:** Administrators shall retain master override authority with mandatory audit remarks committed to `user_activity`.

### 5.2 Submodule 2: RFID / QR Scanning
* **FR-2.1:** Hardware kiosks shall capture Mifare 13.56 MHz RFID UIDs via ESP32 microcontrollers with a 3-second hardware debounce.
* **FR-2.2:** The in-browser camera scanner (`live-scanner.html`) shall decode dynamic QR codes and support **Dual-Context Scanning**:
  * `CLASSROOM_PERIOD`: Standard class schedule validation.
  * `EVENT_VENUE`: Institutional school event check-in referencing `school_events.id`.

### 5.3 Submodule 3: Tardy & Absence Logs
* **FR-3.1:** The system shall aggregate late arrival minutes and cumulative unexcused cuts.
* **FR-3.2:** When a student reaches **3 consecutive unexcused absences** or **5 late arrivals**, the system automatically flags `is_habitual_truancy = true` and escalates a disciplinary referral to the **PREFECT Disciplinary Action System**.

### 5.4 Submodule 4: Teacher Attendance
* **FR-4.1:** Faculty members shall log gate arrivals and room presence via contactless RFID badges.
* **FR-4.2:** The system automatically calculates rendered teaching hours and syncs with the **Academic HR Daily Time Record (DTR)**.

### 5.5 Submodule 5: Excuse Slip Submission (Dual-Option Medical Verification)
* **FR-5.1:** Students shall submit excuse slips selecting from two medical verification modes:
  * **Option A (External Medical Certificate):** Uploads doctor's prescription / hospital slip (PDF, JPG, PNG <= 5MB).
  * **Option B (School Clinic Pass):** Inputs Clinic Slip Number issued by the BCP Campus Clinic, verified automatically against `clinic_visit_logs`.
* **FR-5.2:** Teacher approval automatically transitions roll call status from *Absent* to *Excused*.

### 5.6 Submodule 6: Attendance Calendar
* **FR-6.1:** Monthly calendar views shall display daily status heatmaps (Green = Present, Orange = Late, Red = Absent, Blue = Excused).
* **FR-6.2:** The calendar automatically syncs with the institutional academic calendar to black out official holidays and calamity suspensions.

### 5.7 Submodule 7: Alerts to Parents
* **FR-7.1:** Outbound transactional SMS notifications shall dispatch immediately to registered guardian numbers upon late arrivals or unexcused cuts.
* **FR-7.2:** Rate-limiting restricts dispatches to a maximum of 2 SMS per student per day to prevent credit exhaustion.

### 5.8 Submodule 8: Analytics Dashboard
* **FR-8.1:** Interactive dashboards shall display institutional and section-level attendance trends, punctuality rates, and drop-out risk distributions.

### 5.9 Submodule 9: Perfect Attendance Award Tool
* **FR-9.1:** The system shall evaluate semester eligibility against 4 criteria (100% attendance, zero unexcused cuts, maximum 2 late arrivals, active enrollment).
* **FR-9.2:** Endorsed candidates are transmitted to **OSAS** for honors convocation and graduation clearance.
* **FR-9.3:** Students have read-only access to view their conferred award record and verification hash; self-printing is strictly prohibited.

### 5.10 Submodule 10: Centralized CSV / Excel Export (Option 1 Standard)
* **FR-10.1:** All data exports (CSV, Excel `.xlsx`, printable PDF) must be centralized in Submodule 10. Individual operational tables must NOT render local export buttons.
* **FR-10.2:** Centralized report generators shall include Daily Master Attendance, DepEd/CHED Form 137 / SF2 summaries, Habitual Truancy lists, and Faculty DTR reports.

---

## 6. SMS 1 Ecosystem Cross-Module Integration Touchpoints

```
+---------------------------------------------------------------------------------+
|                       SMS 1 COMPANION SYSTEM BRIDGES                            |
+---------------------------------------------------------------------------------+
| 1. CLINIC MANAGEMENT    | excuse_slips.clinic_visit_id                          |
| 2. PREFECT DISCIPLINE   | absence_records.prefect_referral_id                   |
| 3. ACADEMIC HR          | teacher_attendance.rendered_hours -> hr_faculty_dtr   |
| 4. OSAS HONORS          | perfect_attendance_awards.osas_endorsement_status     |
| 5. SCHOOL EVENTS        | rfid_qr_scan_logs.event_id                            |
+---------------------------------------------------------------------------------+
```

---

## 7. Non-Functional Requirements (NFR)

* **NFR-1 (100% RLS):** All PostgreSQL tables must have Row Level Security active. Students have strictly read-only access to attendance and awards.
* **NFR-2 (No Framework Bloat):** Codebase must remain in native HTML5, compiled Tailwind CSS, and Vanilla JavaScript (ES6).
* **NFR-3 (Zero Emojis):** No emojis in code, comments, logs, commit messages, or UI badges.
* **NFR-4 (Defense-in-Depth):** Session token guards, single-session concurrency matching (`profiles.active_session_id`), and immutable audit logging (`user_activity`).
