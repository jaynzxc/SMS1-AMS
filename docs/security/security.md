# Implemented Security Architecture & Data Protection Blueprint

## Project Title
**Attendance Monitoring System for Bestlink College of the Philippines with Performance Analytics and RFID/QR Scanning (SMS1-AMS)**

* **Document Purpose:** Reference ledger of all security protocols, authentication mechanisms, threat mitigations, and database defenses implemented across the system.
* **Target Roles Protected:** Administrator, Faculty Teacher, Enrolled Student, and Parent/Guardian Contact Data.
* **Database & Auth Engine:** Supabase PostgreSQL with Row Level Security (RLS).

---

## 1. Security Overview & Defense-in-Depth Model

The system implements defense-in-depth across 4 interconnected tiers:

```
  ┌────────────────────────────────────────────────────────────────────────┐
  │                    TIER 1: FRONTEND & ROUTE SECURITY                   │
  │  - Universal Page Session Guards (Redirect on missing JWT)             │
  │  - Strict Role-Based View Restrictions (e.g. Student panel read-only)  │
  │  - Form Input Validation (HTML5 regex, length limits, type validation) │
  │  - Contextual DOM Injection (Strict anti-XSS via textContent)          │
  └──────────────────────────────────┬─────────────────────────────────────┘
                                     │
                                     ▼
  ┌────────────────────────────────────────────────────────────────────────┐
  │                 TIER 2: CLIENT JAVASCRIPT & API SECURITY               │
  │  - Supabase Bearer Token Auth (Header-based; avoids cookie CSRF)       │
  │  - Public Anon-Key Isolation (Service-role key completely excluded)    │
  │  - Double-Submit Protection (Submit buttons disabled with spinners)    │
  │  - Single Active Session Hash Check (Concurrent login termination)     │
  └──────────────────────────────────┬─────────────────────────────────────┘
                                     │
                                     ▼
  ┌────────────────────────────────────────────────────────────────────────┐
  │                TIER 3: IOT HARDWARE & ATTENDANCE SCANNING              │
  │  - Anti-Passback Algorithm (5-minute cooldown per identity)            │
  │  - Dynamic Expiring QR Codes (Salted HMAC hashes; anti-screenshot)     │
  │  - Device Station Header Verification                                  │
  └──────────────────────────────────┬─────────────────────────────────────┘
                                     │
                                     ▼
  ┌────────────────────────────────────────────────────────────────────────┐
  │             TIER 4: SUPABASE POSTGRESQL & ROW LEVEL SECURITY           │
  │  - 100% RLS Enforcement across all database tables                     │
  │  - Identity derived exclusively from auth.uid() (Zero IDOR attacks)    │
  │  - Passwords hashed via salted Bcrypt (auth.users)                     │
  │  - Immutable Audit Logging in user_activity (Deny UPDATE & DELETE)     │
  └────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Core Security Controls Ledger

### 2.1 Cross-Site Request Forgery (CSRF) Prevention
* **Implementation Mechanism:** Supabase REST / PostgREST APIs utilize explicit `Authorization: Bearer <JWT>` request headers rather than ambient browser session cookies.
* **Protection Impact:** Cross-origin malicious sites cannot forge authenticated requests because the browser does not attach the JWT automatically. Custom Edge Functions also validate the `Origin` and `Referer` headers.

### 2.2 Cross-Site Scripting (XSS) Prevention
* **Implementation Mechanism:** Dynamic data rendering in client JavaScript (e.g., student names, teacher remarks, absence reasons, and notifications) is strictly injected using `element.textContent`, DOM node generation (`document.createElement`), or template cloning.
* **Strict Rule:** Raw, unescaped `innerHTML` on user-supplied variables is strictly banned throughout the codebase.

### 2.3 Input Field Validation & Sanitization
* **Client-Side Tier:** Real-time feedback using HTML5 attributes (`required`, `pattern`, `minlength`, `maxlength`) and JavaScript sanitizers:
  * **Student / Teacher ID:** `^[a-zA-Z0-9_-]{4,20}$`
  * **Phone Numbers (Philippine Format):** `^(09|\+639)\d{9}$`
  * **Text Explanations:** Length capped to prevent payload buffer overflow and stripped of control characters.
* **File Upload Tier (Excuse Slips):**
  * Allowed MIME types: `['image/jpeg', 'image/png', 'application/pdf']`.
  * Double-extension blocking (e.g. `exploit.php.png` rejected).
  * Strict file size cap: $\le 5\text{ MB}$.
* **Database Tier:** PostgreSQL `CHECK` constraints on valid date ranges, non-negative delay minutes, and valid status enums (`Present`, `Late`, `Absent`, `Excused`).

### 2.4 Password Hashing & Credential Security
* **Implementation Mechanism:** Handled natively by Supabase Auth (`auth.users`) using salted **Bcrypt** with dynamic work factors.
* **Protection Impact:** Plain-text passwords are never stored, transmitted in logs, or accessible to database administrators. Rainbow table and credential dump attacks are completely neutralized.
* **Password Policy:** Enforces $\ge 8$ characters containing uppercase, lowercase, numbers, and special symbols.

### 2.5 Role-Based Access Control (RBAC)
* **Three Strict System Roles:** `Administrator`, `Teacher`, `Student`.
* **Frontend Enforcement:** Role-specific directories (`admin/`, `teacher/`, `student/`) with automatic URL redirection on unauthorized access attempts.
* **Backend Enforcement:** Database queries resolve `auth.uid()` against `profiles.role` to determine read and write privileges.

### 2.6 Session Token Validation & Single Active Session Enforcement
* **Missing Token Guard:** Any request or page load without an active Supabase session token immediately triggers `window.location.replace('/login.html?reason=unauthorized')`.
* **Single Active Session Matching (`DB != Client Token`):**
  * The `profiles.active_session_id` column stores a hash of the current valid session.
  * When a user logs in on **Device B**, the database column is updated with Device B's hash.
  * When **Device A** attempts any action or heartbeat check, the mismatch is detected, and Device A is immediately logged out with `reason=session_superseded_by_other_device`.
  * **Prevents:** Shared account credentials and concurrent exam/attendance fraud.

### 2.7 Two-Factor Authentication (Email + Password + OTP 2FA)
* **2FA Scope:** Enforced for privileged roles (**Administrator** and **Faculty Teacher**).
* **Code Specs:** 6-digit numeric OTP with a **5-minute expiration (TTL)** window.
* **Rate Limiting:** Maximum **3 OTP requests per hour** to prevent brute-force attacks and SMS/email gateway exhaustion.

### 2.8 Session Lifetime Management
* **Access Tokens:** Short-lived JWTs (1 hour).
* **Refresh Tokens:**
  * **8 Hours:** Default session window on public school computer lab terminals and faculty kiosks.
  * **15 Days:** Extended window when "Remember Me" is explicitly toggled on trusted personal devices.

### 2.9 Anti-Passback Hardware Scanning Cooldown
* **Implementation Mechanism:** When an RFID card is tapped or a QR code is scanned, the database evaluates the student's most recent `time_in` for that day.
* **5-Minute Cooldown:** If a scan occurred within $< 5\text{ minutes}$, the scan is rejected with an `ANTI_PASSBACK_VIOLATION` alert.
* **Prevents:** A student tapping their card and immediately passing it backward through the gate to an absent friend.

### 2.10 Time-Bounded Dynamic QR Codes
* **Anti-Screenshot Defense:** Rather than static QR images, the student portal dynamically generates an encrypted token salted with the current timestamp window (`student_id + timestamp + salt`).
* **Expiration:** QR codes expire every 60 seconds, preventing proxy attendance via shared screenshots.

### 2.11 Full Immutable Activity Logging (`user_activity`)
* **Audit Table Schema:** `id`, `user_id`, `role`, `action`, `target_resource`, `ip_address`, `user_agent`, `details`, and `created_at`.
* **Tracked Actions:** `LOGIN`, `LOGOUT`, `ATTENDANCE_OVERRIDE`, `EXCUSE_SUBMITTED`, `EXCUSE_APPROVED`, `EXCUSE_REJECTED`, `RFID_ASSIGNED`, `AWARD_CONFERRED`.
* **Database Immutability:** Supabase RLS explicitly denies `UPDATE` and `DELETE` on `user_activity`. Only administrators can read logs; no one can erase history.

---

## 3. Supabase Row Level Security (RLS) Policy Ledger

| Table Name | RLS Status | Student Access | Teacher Access | Admin Access | Primary Enforced Policy |
| :--- | :---: | :---: | :---: | :---: | :--- |
| `profiles` | **ENABLED** | Read own profile | Read own + enrolled students | Full CRUD | `auth.uid() = id OR is_admin()` |
| `students` | **ENABLED** | Read own record | Read assigned sections | Full CRUD | `user_id = auth.uid() OR is_teacher_of(section)` |
| `teachers` | **ENABLED** | Read basic info | Read own record | Full CRUD | `user_id = auth.uid() OR is_admin()` |
| `attendance` | **ENABLED** | **SELECT ONLY (Own)** | SELECT, INSERT, UPDATE (Class) | Full CRUD + Override | Students **CANNOT** write to attendance. |
| `teacher_attendance` | **ENABLED** | **NO ACCESS** | SELECT (Own DTR) | Full CRUD (HR) | Teachers cannot modify own punch hours. |
| `excuse_slips` | **ENABLED** | SELECT, INSERT (Own) | SELECT, UPDATE (Class approval) | Full Oversight | `student_id = current_student_id()` |
| `rfid_cards` | **ENABLED** | SELECT (Own card) | SELECT (Scan verification) | Full CRUD | Managed exclusively by Admin. |
| `sms_logs` | **ENABLED** | **NO ACCESS** | System trigger on late/absent | Full CRUD | Contact numbers shielded from scraping. |
| `conferred_awards`| **ENABLED** | SELECT (Own awards) | SELECT, INSERT (Nominees) | Full Conferment | Award serials locked upon conferment. |
| `user_activity` | **ENABLED** | **NO ACCESS** | **NO ACCESS** | **SELECT ONLY** | UPDATE & DELETE blocked for all roles. |

---

## 4. User Experience (UX) Security Standards

1. **Double-Submit Protection:** Form submit buttons automatically enter a disabled state with an animated loading spinner upon click, preventing duplicate records or race conditions.
2. **Graceful Redirection:** If a session expires during use, the user is redirected to `/login.html` with a descriptive URL parameter explaining the timeout, preserving user trust.
3. **Sensitive Role Cleanliness:** The Student Panel is built strictly as a **read-only consumer**—all administrative controls, certificate self-printing, and attendance edit buttons are completely omitted.

---

## 5. Security Verification Checklist for Developers

When committing code or backend integrations, verify each requirement:
- [x] CSRF protection via JWT Bearer headers.
- [x] Anti-XSS via `textContent` DOM injection.
- [x] Input validation on client regex, file uploads, and PostgreSQL constraints.
- [x] Salted Bcrypt password hashing via Supabase Auth.
- [x] Role-Based Access Control on both frontend routes and database RLS.
- [x] Unauthorized session redirection to `/login.html`.
- [x] Single active session mismatch detection (`profiles.active_session_id`).
- [x] Two-Factor Authentication (OTP 2FA) with 5-minute expiry and rate limiting.
- [x] Anti-passback hardware cooldown (5 minutes) and dynamic expiring QR codes.
- [x] Immutable activity logging (`user_activity`).
- [x] Pure `anonKey` frontend usage with zero `service_role` key exposure.
