---
name: rbac
description: Plan and review role-based access control for Admin, Teacher, and Student users using frontend restrictions and Supabase Row Level Security. Use when implementing permissions, protected pages, or authorization.
---

# Role-Based Access Control (RBAC) Skill (SMS1-AMS)

## Goal

Plan, enforce, and audit Role-Based Access Control across the Presentation, Client Application, and Supabase PostgreSQL Database tiers for the **Bestlink College of the Philippines Attendance Monitoring System (SMS1-AMS)** in strict compliance with the **10 Official Submodules** and the **Option 1 Centralized Reporting** standard.

---

## 1. System Roles & Authority Boundaries

The system strictly supports **three (3)** confirmed roles. No other roles may be introduced without explicit approval:

```
                          ┌────────────────────────────────┐
                          │         ADMINISTRATOR          │
                          │ - Campus-wide oversight        │
                          │ - User provisioning & master   │
                          │ - Full attendance overrides    │
                          │ - Award conferment & audits    │
                          └───────────────┬────────────────┘
                                          │
                  ┌───────────────────────┴───────────────────────┐
                  ▼                                               ▼
  ┌────────────────────────────────┐             ┌────────────────────────────────┐
  │            TEACHER             │             │            STUDENT             │
  │ - Assigned class rosters       │             │ - Strictly READ-ONLY personal  │
  │ - Live classroom scanner       │             │   attendance & calendar        │
  │ - First-line excuse reviews    │             │ - Dynamic QR badge             │
  │ - Faculty DTR & nominations    │             │ - Dual-option excuse filing    │
  │ - NO admin or global audits    │             │ - NO cert print / download     │
  └────────────────────────────────┘             └────────────────────────────────┘
```

### 1. Administrator (`admin`)
* **Scope:** Campus-wide management across all 10 submodules.
* **Capabilities:** User provisioning, RFID card assignment, system policy configuration, campus-wide analytics, institutional reports generation (Submodule 10), manual attendance overrides with audit logging, final excuse slip appeals, and official Perfect Attendance conferment.
* **Scope Demarcation:** Does NOT manage curriculum courses or syllabi (`academic-management.html` is excluded; belongs to SMS 1 Academic Module).

### 2. Teacher (`teacher`)
* **Scope:** Class-level authority for assigned subject sections and schedules.
* **Capabilities:** View student rosters for assigned sections, operate the live classroom attendance scanner (RFID/QR), conduct manual daily roll calls, review first-line student excuse slips (external vs clinic pass), track personal faculty DTR (`teacher_attendance`), endorse Perfect Attendance nominees, and generate section grading sheets in Submodule 10.
* **Restrictions:** Cannot modify school-wide settings, access other teachers' confidential DTR, view global `user_activity` audit logs, or confer official awards.

### 3. Student (`student`)
* **Scope:** Strictly personal, self-service information consumer.
* **Capabilities:** View personal attendance statistics, calendar, timetable, dynamic QR badge, and conferred awards. Submit excuse slips with dual medical verification options (External Doctor Cert or Campus Clinic Pass).
* **Restrictions:** Strictly read-only for attendance. **CANNOT** create attendance records, modify attendance status, view other students' records, approve excuse slips, or self-print/download official diplomas or certificates.

---

## 2. Comprehensive RBAC Permissions Matrix

| Module / Table | Administrator | Teacher | Student |
| :--- | :--- | :--- | :--- |
| **`profiles`** | Full `ALL` | `SELECT` own + assigned students | `SELECT` own (`auth.uid() = id`) |
| **`students`** | Full `ALL` (CRUD) | `SELECT` assigned sections | `SELECT` own (`user_id = auth.uid()`) |
| **`teachers`** | Full `ALL` (CRUD) | `SELECT` own profile | `SELECT` directory info only |
| **`attendance`** | Full `ALL` + Override | `SELECT`, `INSERT`, `UPDATE` (class) | **`SELECT` ONLY** own records |
| **`teacher_attendance`**| Full `ALL` (HR Oversight) | `SELECT`, `INSERT` own DTR logs | **NO ACCESS** |
| **`rfid_cards`** | Full `ALL` (Assign/Revoke) | `SELECT` card validity | **NO ACCESS** |
| **`sms_logs`** | Full `ALL` (Dispatch/View)| `SELECT` class alerts | **NO ACCESS** |
| **`excuse_slips`** | Full `ALL` (Final Escalations)| `SELECT`, `UPDATE` (Recommend/Reject)| `SELECT`, `INSERT` own slips |
| **`perfect_attendance_awards`** | Full `ALL` (Confer/Revoke)| `SELECT`, `INSERT` (Nominees) | `SELECT` ONLY own awards |
| **Table-Level Export Modal** | Full Institutional Scope (CSV, EXCEL, PDF, WORD) | Assigned Classes Scope (CSV, EXCEL, PDF, WORD) | Personal Records Scope (CSV, EXCEL, PDF, WORD) |
| **Table-Level Exports** | **PROHIBITED** (Option 1) | **PROHIBITED** (Option 1) | **PROHIBITED** (Option 1) |
| **`academic-management`** | **EXCLUDED FROM AMS** | **EXCLUDED FROM AMS** | **EXCLUDED FROM AMS** |

---

## 3. Frontend Route & Session Guard Standards

Every protected page must include the centralized auth guard before loading content:

```javascript
import { checkAuth, enforceRole } from '../common/auth.js';

// Enforce role boundary on page init
const session = checkAuth();
if (!session || !enforceRole(['admin'])) {
  window.location.href = '../login.html';
}
```
