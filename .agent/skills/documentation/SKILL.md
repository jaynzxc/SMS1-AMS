---

name: documentation
description: Write academic technical documentation for the Bestlink College of the Philippines Attendance Monitoring System including module descriptions, workflows, system architecture, methodology, and implementation documentation. Use for capstone documentation and technical writing.
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

# Documentation Skill (SMS1-AMS)

## Goal

Produce rigorous, standardized, and professional academic technical documentation for the **Bestlink College of the Philippines Attendance Monitoring System with Performance Analytics and RFID/QR Scanning (SMS1-AMS)** suitable for capstone project manuscripts, defense presentations, architecture briefs, and developer manuals.

---

## 1. Documentation Principles & Standards

1. **Academic Tone:** Use formal academic English (or formal Filipino if explicitly requested). Maintain an objective, third-person perspective (e.g. *"The system implements..."* rather than *"I made..."* or *"We did..."*).
2. **Authority Sources:** All documentation must be derived from and remain consistent with confirmed project specifications:
   * [`docs/PRD.md`](file:///c:/Users/jaync/Desktop/Attendance%20Monitoring/SMS1-AMS/docs/PRD.md) — Product Requirements Document
   * [`docs/system_workflow.md`](file:///c:/Users/jaync/Desktop/Attendance%20Monitoring/SMS1-AMS/docs/system_workflow.md) — Multi-Panel System Flows & Sequence Diagrams
   * [`docs/database_schema_design.md`](file:///c:/Users/jaync/Desktop/Attendance%20Monitoring/SMS1-AMS/docs/database_schema_design.md) & [`docs/supabase_schema_setup.sql`](file:///c:/Users/jaync/Desktop/Attendance%20Monitoring/SMS1-AMS/docs/supabase_schema_setup.sql) — Database Schema & RLS Matrix
   * [`docs/implemented_security.md`](file:///c:/Users/jaync/Desktop/Attendance%20Monitoring/SMS1-AMS/docs/implemented_security.md) — Security Architecture & Compliance
   * Front-end specifications: [`docs/admin_frontend.md`](file:///c:/Users/jaync/Desktop/Attendance%20Monitoring/SMS1-AMS/docs/admin_frontend.md), [`docs/teacher_frontend.md`](file:///c:/Users/jaync/Desktop/Attendance%20Monitoring/SMS1-AMS/docs/teacher_frontend.md), [`docs/student_frontend.md`](file:///c:/Users/jaync/Desktop/Attendance%20Monitoring/SMS1-AMS/docs/student_frontend.md)
3. **Zero Hallucination / No Phantom Features:** Never invent database tables, APIs, hardware sensors, or features not present in the repository or confirmed by the user.
4. **Strict Demarcation of Assumptions:** If a section requires operational assumptions (e.g. network latency or kiosk mounting dimensions), clearly label it under a dedicated **"Assumptions & Limitations"** heading.
5. **Clear Actor Boundaries:** Accurately characterize the three system roles:
   * **Administrator:** Campus oversight, user provisioning, master policies, audit logs, and official award conferment.
   * **Teacher:** Class attendance roster, live kiosk scanner, first-line excuse review, faculty DTR, and award nomination.
   * **Student:** Strictly read-only personal attendance, calendar, dynamic QR badge, and excuse submission (certificate print/download is prohibited).

---

## 2. Standard Capstone Documentation Structures

### Structure A: Module Technical Specification
Use this structure when documenting an individual module (e.g., RFID Kiosk, Excuse Slip System, Honor Roll Analytics):

1. **Module Title & Overview:** High-level description, institutional context, and business rationale.
2. **Objective:** Specific measurable goals of the module within BCP attendance operations.
3. **Actor Roles & Permissions:** Clear breakdown of what Admin, Teacher, and Student can and cannot do.
4. **Functional Workflow & Process:** Step-by-step lifecycle from trigger to completion.
5. **System Architecture & Data Flow:** Diagram (Mermaid sequence or flowchart) showing data movement across layers.
6. **Database Interactions & Schema:** Tables accessed, keys, queries executed, and RLS policies enforced.
7. **Security & Validation Measures:** Input sanitation (anti-XSS), anti-passback cooldown, file validation, audit logging.
8. **Limitations & Future Work:** Acknowledged operational constraints and proposed future expansions.

### Structure B: System Architecture & Workflow Chapter
Use this structure when creating or revising major manuscript chapters (e.g., Chapter 3 Methodology / System Design):

1. **System Overview:** Architectural summary (HTML5, Compiled Tailwind, Vanilla JS ES6, Supabase PostgreSQL, ESP32 + RC522).
2. **Hardware & Scanning Subsystem:** ESP32 integration, 13.56 MHz RFID protocol, camera QR scanning, anti-passback logic.
3. **Software & Role Panels:** Detailed specifications of `/admin/`, `/teacher/`, and `/student/` interfaces.
4. **Security & Compliance Architecture:** 2FA/OTP, active session tracking, 100% RLS enforcement, immutable audit logging.
5. **End-to-End Sequence Diagrams:** Inter-panel synchronization flows (e.g. Ingestion -> Roster -> Parent SMS -> Student Portal).
6. **Data Dictionary & Entity Relationships:** Formal entity relationship definitions and indexing strategies.

---

## 3. Formatting & Diagram Guidelines

* **Mermaid Visualizations:** Always use valid Mermaid syntax for flowcharts and sequence diagrams. Quote labels containing special characters:
  ```mermaid
  sequenceDiagram
      actor Student
      participant Kiosk as "RFID Kiosk (ESP32)"
      participant DB as "Supabase PostgreSQL"
      participant SMS as "SMS Gateway"

      Student->>Kiosk: Tap RFID Card (UID)
      Kiosk->>DB: Check Anti-Passback & Log Attendance
      DB-->>Kiosk: Success (Present)
      Kiosk->>SMS: Dispatch Parent Notification
  ```
* **Tables for Precision:** Use markdown tables for data dictionaries, RLS matrices, and comparative analyses.
* **File References:** Use clickable markdown links formatted as `[filename](file:///path/to/file)` when referring to repository files.

---

## 4. Required Output Checklist

When generating documentation:
- [ ] Confirmed project title: *Design and Development of an Attendance Monitoring System for Bestlink College of the Philippines with Performance Analytics and RFID/QR Scanning*.
- [ ] Technology stack accurately represented (no unauthorized frameworks like React or PHP).
- [ ] Complete database tables referenced match confirmed schema (`profiles`, `students`, `teachers`, `admin_details`, `attendance`, `teacher_attendance`, `rfid_cards`, `sms_logs`, `excuse_slips`, `conferred_awards`, `user_activity`).
- [ ] RLS and security compliance explicitly addressed.
- [ ] Assumptions clearly distinguished from implemented features.
