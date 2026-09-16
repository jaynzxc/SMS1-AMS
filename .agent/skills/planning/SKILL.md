---

name: planning
description: Create structured implementation plans, module workflows, feature breakdowns, and development roadmaps for the Bestlink College of the Philippines Attendance Monitoring System. Use when planning a new module, page, feature, or enhancement before coding.
-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

# Planning Skill (SMS1-AMS)

## Goal

Produce thorough, highly structured, and production-ready implementation plans before writing any code or modifying schemas for the **Bestlink College of the Philippines Attendance Monitoring System (SMS1-AMS)**.

---

## 1. Core Planning Principles

1. **Planning Only — Zero Premature Coding:** Never write production code, modify database schemas, or execute destructive commands during the planning phase.
2. **Cross-Panel Lifecycle Analysis:** Every feature must be evaluated for downstream impact across all three roles (Admin, Teacher, Student) using [`.agent/skills/system-flow/SKILL.md`](file:///c:/Users/jaync/Desktop/Attendance%20Monitoring/SMS1-AMS/.agent/skills/system-flow/SKILL.md).
3. **Strict Technology Stack Adherence:** Plan strictly within:
   * Semantic HTML5
   * Compiled Tailwind CSS (`assets/css/output.css` + `assets/css/style.css`)
   * Modular Vanilla JavaScript (ES6)
   * Supabase PostgreSQL with 100% Row Level Security (RLS)
   * Hardware IoT: ESP32 + RC522 13.56 MHz RFID / Web QR Scanner
   * *Do NOT introduce React, Vue, Angular, jQuery, PHP, or external UI frameworks.*
4. **Defense-in-Depth & Security First:** Every plan must integrate RLS policy definitions, anti-XSS (`textContent`) measures, session guard verification, and audit logging via `user_activity` as defined in [`.agent/skills/security/SKILL.md`](file:///c:/Users/jaync/Desktop/Attendance%20Monitoring/SMS1-AMS/.agent/skills/security/SKILL.md).
5. **Design System Alignment:** Plan UI components against the design benchmarks, color tokens, and layout guidelines established in [`.agent/skills/ui-ux/SKILL.md`](file:///c:/Users/jaync/Desktop/Attendance%20Monitoring/SMS1-AMS/.agent/skills/ui-ux/SKILL.md).

---

## 2. Six-Step Planning Workflow

```
   ┌───────────────────────┐
   │ 1. SCOPE & ACTORS     │ ── Define feature objectives & map to Admin / Teacher / Student
   └──────────┬────────────┘
              ▼
   ┌───────────────────────┐
   │ 2. CROSS-PANEL FLOW   │ ── Trace cross-panel impacts using .agent/skills/system-flow/
   └──────────┬────────────┘
              ▼
   ┌───────────────────────┐
   │ 3. UI/UX BENCHMARK    │ ── Match layouts & components against .agent/skills/ui-ux/
   └──────────┬────────────┘
              ▼
   ┌───────────────────────┐
   │ 4. DATABASE & RLS     │ ── Map tables, columns, indexes, & non-destructive DDL
   └──────────┬────────────┘
              ▼
   ┌───────────────────────┐
   │ 5. SECURITY & AUDIT   │ ── Plan anti-XSS, CSRF, single-session check, user_activity log
   └──────────┬────────────┘
              ▼
   ┌───────────────────────┐
   │ 6. PHASED ROADMAP     │ ── Phased implementation breakdown, testing steps, rollback plan
   └───────────────────────┘
```

### Step 1 — Scope & Actor Identification
* Identify user stories and business logic for the feature.
* Classify permissions by actor:
  * **Admin:** System-wide management, master overrides, audit visibility.
  * **Teacher:** Section-specific roster, kiosk scanner, first-line reviews.
  * **Student:** Read-only viewing, QR badge, excuse submission (strictly no certificate printing/downloading).

### Step 2 — Cross-Panel Flow & Dependency Mapping
* Trace data ingestion from tap/scan/form to database commit and downstream views.
* Verify real-time or page-refresh synchronization across panels.
* Reference [`docs/system_workflow.md`](file:///c:/Users/jaync/Desktop/Attendance%20Monitoring/SMS1-AMS/docs/system_workflow.md).

### Step 3 — UI/UX Design System Mapping
* Select pre-existing Tailwind utility classes from `assets/css/output.css`.
* Identify benchmark reference files in the repository (e.g., topbars, stat cards, data tables, modals).
* Ensure high-contrast readability, responsive breakpoints (`sm:`, `md:`, `lg:`), and micro-interactions.

### Step 4 — Database & RLS Impact Analysis
* Confirm affected tables: `profiles`, `students`, `teachers`, `admin_details`, `attendance`, `teacher_attendance`, `rfid_cards`, `sms_logs`, `excuse_slips`, `conferred_awards`, `user_activity`.
* Formulate explicit RLS policies (e.g., student read-only `auth.uid() = user_id`).
* Specify non-destructive DDL (`ADD COLUMN IF NOT EXISTS`).

### Step 5 — Security & Compliance Audit Plan
* Anti-XSS: Plan DOM updates via `textContent` or sanitized template interpolation.
* Auth Guards: Ensure page includes `assets/js/common/auth.js` with role validation and single-session check.
* Audit Log: Plan logging of critical actions to `user_activity` table.

### Step 6 — Phased Implementation Roadmap
* Break tasks into clean sequential phases:
  * Phase 1: Presentation & Semantic HTML Markup
  * Phase 2: Client JavaScript Controller & Event Handlers
  * Phase 3: Supabase Queries & Database RLS Policies
  * Phase 4: Cross-Panel Testing & Verification

---

## 3. Required Output Format

When generating an implementation plan, structure it as follows:

1. **Feature Title & Objectives:** Clear problem statement and desired outcome.
2. **Actors Involved & Access Matrix:** Exact role permissions (Admin, Teacher, Student).
3. **Workflow & Data Flow Diagram:** Mermaid sequence diagram or flowchart showing full lifecycle.
4. **UI/UX & Component Mapping:** Reference benchmarks from `.agent/skills/ui-ux/SKILL.md` and compiled Tailwind classes.
5. **File Modification Plan:** Grouped into `[NEW]`, `[MODIFY]`, or `[DELETE]` with clickable links (`file:///...`).
6. **Database & Schema Plan:** Target tables, required indexes, and non-destructive SQL / RLS policies.
7. **Security & Threat Mitigation:** Anti-XSS measures, auth verification, session concurrency, and audit logging.
8. **Phased Execution Steps:** Step-by-step checklist of development tasks.
9. **Verification & Testing Checklist:** Concrete test scenarios for happy paths, edge cases, and unauthorized role access.
10. **Assumptions & Open Questions:** Clearly distinguished assumptions or decisions requiring user approval.
