---
name: security
description: Comprehensive security standards, API protection, authentication (2FA/OTP), session lifecycle, anti-XSS, CSRF, input validation, rate limiting, audit logging (user_activity), and Row Level Security for the Bestlink College of the Philippines Attendance Monitoring System. Use whenever implementing auth, APIs, session guards, forms, or database queries.
---

# Security, API & Data Protection Skill (SMS1-AMS)

## Goal

Ensure the attendance monitoring system implements defense-in-depth against unauthorized access, proxy attendance, tampering, credential leaks, and data exploitation across all layers: **Frontend UI**, **Client JavaScript / APIs**, **IoT Scanner Kiosks**, and **Supabase PostgreSQL Database**, in full compliance with the **10 Official Submodules** and the **SMS 1 Integration Bridges**.

---

## 1. Threat Model & Required Security Controls

| Security Control | Implementation Mechanism in SMS1-AMS Stack | Threat Mitigated |
| :--- | :--- | :--- |
| **Role-Based Access Control (RBAC)** | Strict separation of **Admin**, **Teacher**, and **Student** roles. Frontend routes guard views, while Supabase Row Level Security (RLS) policies strictly enforce data boundaries via `auth.uid() -> profiles.role`. | Unauthorized panel access, privilege escalation, cross-role tampering. |
| **Password Hashing** | Bcrypt with unique salt (handled natively by Supabase Auth). Plain-text passwords never touch or exist in the database. | Credential dumping, rainbow table attacks. |
| **Authentication: Email + Password + OTP (2FA)** | Two-factor verification: 6-digit numeric OTP code sent to verified email/mobile with a **5-minute expiration** window. Enforced for Admin and Faculty logins. | Credential stuffing, stolen password reuse, account takeover. |
| **Session Token Validation & Guarding** | If session token is missing: immediate redirect to `/login.html`. If user role does not match target path (e.g. Student opening `/admin/`): redirect to unauthorized notice or designated dashboard. | Bypassing client routing to access protected views. |
| **Single Active Session Matching (`DB != Client Token`)** | `profiles.active_session_id` stores current active session hash. If a user logs in on Device B, Device A's local token mismatches the DB hash: Device A is auto-logged out. | Shared credentials, concurrent exam/attendance fraud. |
| **Session Lifetime** | Short-lived JWT access tokens (1 hour) with refresh tokens expiring in **8 hours** (for public lab/workstation security) or **15 days** (with "Remember Me" on trusted devices). | Session hijacking from abandoned computers. |
| **Rate Limiting** | OTP generation limited to **3 requests per hour**; Login attempts limited to **5 attempts per 15 minutes** with progressive delay. | Brute-force attacks against accounts and OTP codes. |
| **XSS Prevention (Cross-Site Scripting)** | All dynamic inputs and data renders must use `textContent`, DOM elements, or sanitized templates. Strict ban on unescaped `innerHTML` when displaying student names, remarks, or excuse details. | Malicious script execution in reviewer browsers. |
| **Input Field Validation** | Multi-tier validation: HTML5 client constraints (`pattern`, `maxlength`, `required`) + JavaScript format sanitizers + PostgreSQL `CHECK` constraints (email format, valid timestamps, non-negative counts). | Malformed payloads, SQL injection attempts, dirty data. |
| **CSRF & Origin Protection** | Supabase REST/PostgREST uses `Authorization: Bearer <JWT>` headers rather than ambient cookies, naturally mitigating CSRF. Custom Edge Functions/APIs validate `Origin` and `Referer` headers. | Cross-Site Request Forgery from third-party tabs. |
| **Device Matching & IP Logging** | Captures `navigator.userAgent`, IP address, and checkpoint identifier during login and attendance scanning. | Account compromise detection, foreign geolocation access. |
| **Full Activity Logging (`user_activity`)** | Every sensitive action (`LOGIN`, `ATTENDANCE_OVERRIDE`, `EXCUSE_APPROVED`, `RFID_ASSIGNED`, `PREFECT_REFERRAL_DISPATCH`) commits an immutable audit record to `user_activity`. | Audit trail repudiation, administrative disputes. |
| **Centralized Export Authorization** | All file exports (CSV/Excel/PDF) are restricted to Submodule 10 with verified session credentials. Operational tables do not expose client-side data dump triggers. | Mass data exfiltration via scrapers or unauthorized exports. |

---

## 2. Authentication & 2FA Lifecycle Flow

```
  [User Enters Email & Password]
               │
               ▼
  [Verify Credentials via Supabase Auth (Bcrypt)]
               │
               ├─► Invalid (>= 5 failures) ──► Lock account for 15 minutes
               │
               ▼ Valid Credentials
  [Generate 6-Digit OTP] (TTL: 5 Minutes, Rate Limit: Max 3/hr)
               │
               ▼
  [Prompt OTP Modal / Screen (Loading State)]
               │
               ▼ User submits 6-digit OTP
  [Validate OTP & Match Salt]
               │
               ├─► Expired / Mismatch ──► Display error; decrement remaining tries
               │
               ▼ Validated
  [Create JWT Session Token + Update active_session_id in profiles]
               │
               ▼
  [Log to user_activity: ACTION='LOGIN_SUCCESS', IP, DeviceInfo]
               │
               ▼
  [Auto-Redirect to Role Dashboard (Admin / Teacher / Student)]
```

---

## 3. Session Guard & Single-Session Verification Rule

Every authenticated page in the system MUST include the standard security guard lifecycle:

```javascript
// Universal Page Guard Logic
async function enforcePageSecurity(requiredRole) {
  const { data: { session }, error } = await supabase.auth.getSession();

  // 1. Session Token Not Set
  if (!session || error) {
    window.location.replace('/login.html?reason=unauthorized');
    return null;
  }

  // 2. Fetch User Profile & Validate Single Active Session
  const { data: profile, error: profError } = await supabase
    .from('profiles')
    .select('role, status, active_session_id')
    .eq('id', session.user.id)
    .single();

  if (profError || !profile || profile.status === 'Inactive') {
    await supabase.auth.signOut();
    window.location.replace('/login.html?reason=account_disabled');
    return null;
  }

  // 3. Concurrent Login Detection (DB Session != Current Session Token)
  const currentSessionHash = hashToken(session.access_token);
  if (profile.active_session_id && profile.active_session_id !== currentSessionHash) {
    await supabase.auth.signOut();
    window.location.replace('/login.html?reason=session_superseded_by_other_device');
    return null;
  }

  // 4. Role Authorization Check
  if (requiredRole && profile.role !== requiredRole) {
    const homeMap = { admin: '/admin/dashboard.html', teacher: '/teacher/dashboard.html', student: '/student/dashboard.html' };
    window.location.replace(homeMap[profile.role] || '/login.html');
    return null;
  }

  return { session, profile };
}
```

---

## 4. Input Validation & XSS Prevention Standards

### A. Input Sanitization Rules
1. **Never use raw `innerHTML` with dynamic variables**:
   * Bad: `element.innerHTML = '<p>' + userInput + '</p>'`
   * Good: `element.textContent = userInput`
   * Good: Use template element cloning or safe DOM element generation (`document.createElement`).
2. **Excuse Slip Attachment Upload Validation**:
   * Allowed MIME types strictly: `['image/jpeg', 'image/png', 'application/pdf']`.
   * Block double extensions (e.g. `proof.php.png` or `cert.exe.pdf`).
   * Size limit strictly: <= 5 MB.
3. **Form Fields Regex Patterns**:
   * Student/Teacher ID: `^[a-zA-Z0-9_-]{4,20}$`
   * Phone Number: `^(09|\+639)\d{9}$`
   * Clinic Pass Number: `^[a-zA-Z0-9_-]{6,30}$`
   * Reason / Explanation: String length between 10 and 500 characters, special control characters stripped.

---

## 5. Audit Logging Schema (`user_activity`)

Every security-sensitive transaction must write to the `user_activity` table:

```sql
INSERT INTO user_activity (
  actor_id,
  actor_role,
  action_type,
  target_resource,
  details,
  ip_address,
  user_agent
) VALUES (
  auth.uid(),
  'admin',
  'ATTENDANCE_OVERRIDE',
  'attendance:UUID_HERE',
  '{"student_id": "s230111001", "old_status": "Absent", "new_status": "Excused"}',
  '192.168.1.100',
  'Mozilla/5.0 ...'
);
```

---

## 6. SMS 1 Integration Security & Data Isolation Rules

1. **Clinic Pass Verification**: Clinic consultation records may only be queried for verification of active excuse slips; student medical records remain strictly confidential in the Clinic module.
2. **Disciplinary Referrals**: Prefect truancy referrals generated by AMS are read-only for students; students cannot cancel or modify pending referrals.
3. **Faculty DTR Integrity**: Teachers can view their personal DTR logs, but only Academic HR and System Administrators have write authority to correct biometric/RFID gate timestamps.
