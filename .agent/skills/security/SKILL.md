---

name: security
description: Comprehensive security standards, API protection, authentication (2FA/OTP), session lifecycle, anti-XSS, CSRF, input validation, rate limiting, audit logging (user_activity), and Row Level Security for the Bestlink College of the Philippines Attendance Monitoring System. Use whenever implementing auth, APIs, session guards, forms, or database queries.
---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

# Security, API & Data Protection Skill (SMS1-AMS)

## Goal

Ensure the attendance monitoring system implements defense-in-depth against unauthorized access, proxy attendance, tampering, credential leaks, and data exploitation across all layers: **Frontend UI**, **Client JavaScript / APIs**, **IoT Scanner Kiosks**, and **Supabase PostgreSQL Database**.

---

## 1. Threat Model & Required Security Controls

| Security Control | Implementation Mechanism in SMS1-AMS Stack | Threat Mitigated |
| :--- | :--- | :--- |
| **Role-Based Access Control (RBAC)** | Strict separation of **Admin**, **Teacher**, and **Student** roles. Frontend routes guard views, while Supabase Row Level Security (RLS) policies strictly enforce data boundaries via `auth.uid() -> profiles.role`. | Unauthorized panel access, privilege escalation, cross-role tampering. |
| **Password Hashing** | Bcrypt with unique salt (handled natively by Supabase Auth). Plain-text passwords never touch or exist in the database. | Credential dumping, rainbow table attacks. |
| **Authentication: Email + Password + OTP (2FA)** | Two-factor verification: 6-digit numeric OTP code sent to verified email/mobile with a **5-minute expiration** window. Enforced for Admin and Faculty logins. | Credential stuffing, stolen password reuse, account takeover. |
| **Session Token Validation & Guarding** | If session token is missing $\rightarrow$ immediate redirect to `/login.html`. If user role does not match target path (e.g. Student opening `/admin/`) $\rightarrow$ redirect to unauthorized notice or designated dashboard. | Bypassing client routing to access protected views. |
| **Single Active Session Matching (`DB != Client Token`)** | `profiles.active_session_id` stores current active session hash. If a user logs in on Device B, Device A's local token mismatches the DB hash $\rightarrow$ Device A is auto-logged out. | Shared credentials, concurrent exam/attendance fraud. |
| **Session Lifetime** | Short-lived JWT access tokens (1 hour) with refresh tokens expiring in **8 hours** (for public lab/workstation security) or **15 days** (with "Remember Me" on trusted devices). | Session hijacking from abandoned computers. |
| **Rate Limiting** | OTP generation limited to **3 requests per hour**; Login attempts limited to **5 attempts per 15 minutes** with progressive delay. | Brute-force attacks against accounts and OTP codes. |
| **XSS Prevention (Cross-Site Scripting)** | All dynamic inputs and data renders must use `textContent`, DOM elements, or sanitized templates. Strict ban on unescaped `innerHTML` when displaying student names, remarks, or excuse details. | Malicious script execution in reviewer browsers. |
| **Input Field Validation** | Multi-tier validation: HTML5 client constraints (`pattern`, `maxlength`, `required`) + JavaScript format sanitizers + PostgreSQL `CHECK` constraints (email format, valid timestamps, non-negative counts). | Malformed payloads, SQL injection attempts, dirty data. |
| **CSRF & Origin Protection** | Supabase REST/PostgREST uses `Authorization: Bearer <JWT>` headers rather than ambient cookies, naturally mitigating CSRF. Custom Edge Functions/APIs validate `Origin` and `Referer` headers. | Cross-Site Request Forgery from third-party tabs. |
| **Device Matching & IP Logging** | Captures `navigator.userAgent`, IP address, and checkpoint identifier during login and attendance scanning. | Account compromise detection, foreign geolocation access. |
| **Full Activity Logging (`user_activity`)** | Every sensitive action (`LOGIN`, `ATTENDANCE_OVERRIDE`, `EXCUSE_APPROVED`, `RFID_ASSIGNED`) commits an immutable audit record to `user_activity`. | Audit trail repudiation, administrative disputes. |
| **UX Security Standards** | Automatic session timeouts, explicit loading spinner states on submit buttons to prevent double-submits, and smooth auto-redirections upon session expiry. | User confusion, race conditions, replay clicks. |

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
    // Redirect to legitimate dashboard
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
   * ❌ `element.innerHTML = `<p>${userInput}</p>``
   * ✅ `element.textContent = userInput`
   * ✅ Use template element cloning or safe DOM element generation (`document.createElement`).
2. **Excuse Slip Attachment Upload Validation**:
   * Allowed MIME types strictly: `['image/jpeg', 'image/png', 'application/pdf']`.
   * Block double extensions (e.g. `proof.php.png` or `cert.exe.pdf`).
   * Size limit strictly: $\le 5\text{ MB}$.
3. **Form Fields Regex Patterns**:
   * Student/Teacher ID: `^[a-zA-Z0-9_-]{4,20}$`
   * Phone Number: `^(09|\+639)\d{9}$`
   * Reason / Explanation: String length between 10 and 500 characters, special control characters stripped.

---

## 5. Audit Logging Schema (`user_activity`)

Every security-sensitive transaction must write to the `user_activity` table:

```sql
CREATE TABLE IF NOT EXISTS public.user_activity (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    role VARCHAR(20) NOT NULL,
    action VARCHAR(50) NOT NULL, -- e.g. 'LOGIN', 'LOGOUT', 'EXCUSE_SUBMITTED', 'EXCUSE_APPROVED', 'ATTENDANCE_OVERRIDE', 'PASSWORD_CHANGED'
    target_resource VARCHAR(100), -- e.g. 'attendance:att_93810', 'student:s2301198'
    ip_address VARCHAR(45),
    user_agent TEXT,
    details JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS: Only Admins can view activity logs; Nobody can edit/delete activity logs
ALTER TABLE public.user_activity ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all audit logs" 
ON public.user_activity FOR SELECT 
TO authenticated 
USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Deny all updates and deletes to enforce immutability
CREATE POLICY "Deny update on user_activity" ON public.user_activity FOR UPDATE USING (false);
CREATE POLICY "Deny delete on user_activity" ON public.user_activity FOR DELETE USING (false);
```

---

## 6. Recommended Additional Security Controls for BCP AMS

In addition to your list, the following measures are strongly recommended for this capstone project:

1. **Anti-Passback RFID Cooldown (5 Minutes)**:
   * Prevents students from tapping their card, then immediately handing it to a friend standing outside the kiosk line.
   * Checks `MAX(time_in)` from `attendance` for the student on the current date. If $< 5\text{ mins}$, reject with buzzer alert.
2. **Encrypted Dynamic QR with Expiring Salt**:
   * To stop students screenshotting and messaging their QR to classmates, the dynamic QR token regenerates every 60 seconds with an HMAC token (`student_id:epoch_window:hmac_secret`).
3. **Database Level Immutability for Conferred Honors**:
   * Once an Admin marks a Perfect Attendance Award as *Conferred* and issues the serial number, a PostgreSQL trigger locks the row against any further `UPDATE` or `DELETE`.
4. **Service-Role Key Strict Isolation**:
   * The `service_role` key must **never** be referenced or stored in any client JavaScript file. Only the public `anonKey` is permitted in frontend configurations.

---

## 7. Developer Pre-Flight Security Checklist

Before approving any database query, API integration, or auth script:

- [ ] **CSRF / Origin Check**: Requests validate authenticated JWT bearer headers and valid origin.
- [ ] **XSS Audit**: Dynamic text rendered via `textContent` or safe DOM nodes (no unescaped `innerHTML`).
- [ ] **Input Constraints**: All form inputs validated on both client (regex) and database (PostgreSQL types/constraints).
- [ ] **Password Security**: Passwords hashed with salted Bcrypt; meets length, upper, lower, number, and symbol rules.
- [ ] **Role Authorization**: Page guard checks active session & role; Supabase RLS policies enforce access on DB.
- [ ] **Session Matching**: Verifies `active_session_id` to terminate superseded concurrent sessions.
- [ ] **OTP 2FA**: 6-digit numeric codes with 5-minute expiry and $\le 3\text{ requests/hour}$ rate limiting.
- [ ] **Audit Trail**: Key actions logged to immutable `user_activity` table.
- [ ] **Loading UX**: Forms show loading states and disable submit buttons to prevent double-post attacks.
