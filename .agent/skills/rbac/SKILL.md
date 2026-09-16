---

name: rbac
description: Plan and review role-based access control for Admin, Teacher, and Student users using frontend restrictions and Supabase Row Level Security. Use when implementing permissions, protected pages, or authorization.
-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

# Role-Based Access Control (RBAC) Skill (SMS1-AMS)

## Goal

Plan, enforce, and audit Role-Based Access Control across the Presentation, Client Application, and Supabase PostgreSQL Database tiers for the **Bestlink College of the Philippines Attendance Monitoring System (SMS1-AMS)**.

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
  │ - Faculty DTR & nominations    │             │ - Excuse slip submission ONLY  │
  │ - NO admin or global audits    │             │ - NO cert print / download     │
  └────────────────────────────────┘             └────────────────────────────────┘
```

### 1. Administrator (`admin`)
* **Scope:** Campus-wide management across all programs and year levels.
* **Capabilities:** User provisioning (students, teachers, admins), RFID card assignment/deactivation, system policy configuration, campus-wide analytics and DTR reports, manual attendance adjustments with mandatory audit trail, final excuse slip appeals, official award conferment, and immutable security audit log access (`user_activity`).

### 2. Teacher (`teacher`)
* **Scope:** Class-level authority for assigned subject sections and schedules.
* **Capabilities:** View student rosters for assigned sections, operate the live classroom attendance scanner (RFID/QR), conduct manual daily roll calls, review and recommend/reject first-line student excuse slips, log and review personal faculty DTR (`teacher_attendance`), and nominate high-attendance students for honor rolls.
* **Restrictions:** Cannot modify school-wide settings, access other teachers' confidential DTR, view global `user_activity` audit logs, or confer official awards.

### 3. Student (`student`)
* **Scope:** Strictly personal, self-service information consumer.
* **Capabilities:** View personal attendance statistics, calendar, timetable, dynamic QR badge, and conferred awards. Submit excuse slips with single valid attachment (<= 5MB).
* **Restrictions:** Strictly read-only for attendance. **CANNOT** create attendance records, modify attendance status, view other students' records, approve excuse slips, or print/download attendance certificates.

---

## 2. Three-Tier Defense-in-Depth Enforcement

```
  TIER 1: ROUTING & PRESENTATION (Client Guards)
  - URL directory isolation: /admin/, /teacher/, /student/
  - Shared auth guard (assets/js/common/auth.js) validates session token + role
  - Token mismatch or missing session -> Immediate redirect to /login.html
                          │
                          ▼
  TIER 2: CLIENT APPLICATION & SESSION (Token & State)
  - JWT Bearer Token stored securely in sessionStorage
  - Single-session concurrency check: profiles.active_session_id match
  - Concurrent login on another device invalidates previous token
                          │
                          ▼
  TIER 3: DATABASE & SUPABASE RLS (Ultimate Source of Truth)
  - 100% of tables have Row Level Security enabled
  - Enforced via PostgreSQL auth.uid() and role checks
  - Client cannot bypass RLS even if frontend code is manipulated
```

---

## 3. Comprehensive RBAC Permissions Matrix

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
| **`conferred_awards`** | Full `ALL` (Confer/Revoke)| `SELECT`, `INSERT` (Nominees) | `SELECT` ONLY own awards |
| **`user_activity`** | `SELECT` ONLY (Immutable) | **NO ACCESS** | **NO ACCESS** |
| **Certificate Print** | **Authorized** | **Authorized** (Section) | **STRICTLY PROHIBITED** |

---

## 4. Frontend Route & Session Guard Standards

Every protected page must include the centralized auth guard before loading content:

```javascript
// Verification flow in assets/js/common/auth.js
import { supabase } from '../config/supabaseClient.js';

export async function requireAuth(allowedRoles = []) {
  const { data: { session }, error } = await supabase.auth.getSession();
  
  if (error || !session) {
    window.location.replace('/login.html');
    return null;
  }

  // Fetch profile role & active session ID
  const { data: profile } = await supabase
    .from('profiles')
    .select('role, active_session_id')
    .eq('id', session.user.id)
    .single();

  // Validate role authorization
  if (!profile || !allowedRoles.includes(profile.role)) {
    window.location.replace('/unauthorized.html');
    return null;
  }

  // Enforce single active session concurrency
  const clientSessionId = sessionStorage.getItem('sms_session_id');
  if (profile.active_session_id && profile.active_session_id !== clientSessionId) {
    await supabase.auth.signOut();
    sessionStorage.clear();
    alert('You have been logged out because this account was accessed from another device.');
    window.location.replace('/login.html');
    return null;
  }

  return { session, profile };
}
```

---

## 5. Row Level Security (RLS) Implementation Rules

1. **Enable RLS on Every Table:** `ALTER TABLE <table_name> ENABLE ROW LEVEL SECURITY;`.
2. **Student Read-Only Policies:** Always enforce `auth.uid() = user_id` or `auth.uid() = student_id`. Never allow student `INSERT` or `UPDATE` on `attendance` or `conferred_awards`.
3. **Teacher Scoped Policies:** Restrict teacher reads and writes to sections/students assigned to that teacher.
4. **Admin Global Override:** Enforce admin authority through verified role claim:
   ```sql
   CREATE POLICY "Admin full access" ON attendance
     FOR ALL
     USING (
       EXISTS (
         SELECT 1 FROM profiles 
         WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
       )
     );
   ```

---

## 6. Required RBAC Review Checklist

When implementing or auditing any page or endpoint:
- [ ] User role verified both on client route guard and at Supabase RLS level.
- [ ] Student cannot access, trigger, or unhide administrative actions.
- [ ] Student certificate print/download buttons are completely removed from student UI.
- [ ] Single active session check (`profiles.active_session_id`) is enforced.
- [ ] Sensitive operations (overrides, status changes, conferments) logged to `user_activity`.
- [ ] Unauthorized access scenarios tested (direct URL tampering, role spoofing, IDOR on IDs).
