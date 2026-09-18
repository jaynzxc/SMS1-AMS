---

name: debugging
description: Diagnose frontend JavaScript, Tailwind UI, HTML, and Supabase integration issues systematically without rewriting unrelated modules. Use when fixing bugs or analyzing errors.
-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

# Debugging Skill (SMS1-AMS)

## Goal

Systematically diagnose, isolate, and resolve issues across Frontend HTML5, Compiled Tailwind CSS, Modular JavaScript (ES6), IoT Hardware Scanners, and Supabase PostgreSQL integration without rewriting working modules or introducing breaking changes in the Bestlink College of the Philippines Attendance Monitoring System.

---

## 1. Core Debugging Principles

1. **Always Review Related Files Before Proceeding:** Thoroughly inspect dependent HTML views, JS controllers, shared utilities, and Supabase schema files before proposing or applying a bug fix.
2. **Root Cause Before Code:** Never write a fix without first confirming the root cause and verifying the exact point of failure.
3. **Minimal Surgical Modifications (Zero AI Slop):** Modify only the code necessary to solve the defect. Avoid bloated boilerplate, unnecessary rewrites, fake functions, or hollow wrappers.
4. **No Emojis in Code or Logs:** Do NOT use emojis in code, comments, or debug console logs (`console.log`, `console.error`). Use clean, professional text messages.
5. **Defense-in-Depth Integrity:** Never bypass security checks (e.g. relaxing RLS policies, skipping token verification, or hardcoding IDs) as a "temporary fix".
6. **Cross-Panel Regression Awareness:** Always check if a change in one role's module (e.g. Teacher attendance roster) impacts another role (e.g. Student dashboard or Admin analytics) as specified in `.agent/skills/system-flow/SKILL.md`.
7. **Aesthetic & Design Preservation:** When fixing UI bugs, strictly preserve existing Tailwind utility patterns, typography, and color tokens from `.agent/skills/ui-ux/SKILL.md`. Never introduce inline style hacks or runtime Tailwind CDN scripts.

---

## 2. Systematic Diagnostic Process

```
   ┌──────────────────┐      ┌──────────────────┐      ┌──────────────────┐
   │ 1. REPRODUCE     │ ───► │ 2. ISOLATE TIER  │ ───► │ 3. TRACE DATA    │
   │ - Record steps   │      │ - UI / JS / Auth │      │ - Network / RLS  │
   │ - Error logs     │      │ - Hardware / DB  │      │ - State & Token  │
   └──────────────────┘      └──────────────────┘      └────────┬─────────┘
                                                                │
   ┌──────────────────┐      ┌──────────────────┐               │
   │ 5. VERIFY & TEST │ ◄─── │ 4. SURGICAL FIX  │ ◄─────────────┘
   │ - Cross-panel    │      │ - Minimal change │
   │ - Regression     │      │ - Preserved styles
   └──────────────────┘      └──────────────────┘
```

### Step 1 — Reproduce & Capture
* Identify the exact page route (`/admin/`, `/teacher/`, `/student/`).
* Record the user role, test account credentials, and sequence of user interactions.
* Inspect the browser DevTools Console for uncaught exceptions, module import failures, or syntax errors.
* Inspect DevTools Network tab for failed Supabase REST calls (`400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`, `409 Conflict`).

### Step 2 — Isolate the Affected Architectural Tier

| Tier | Common Failure Modes | Diagnostic Technique |
| :--- | :--- | :--- |
| **Presentation (HTML/CSS)** | Missing styling, broken layout, mobile responsiveness breakdown, broken icon rendering. | Inspect computed styles in DevTools; verify classes exist in `assets/css/output.css`; check semantic tags and unclosed tags. |
| **Client JS Logic** | Event listener not firing, broken DOM binding, null reference on `document.getElementById`, race conditions. | Set breakpoints in browser DevTools; verify DOM element existence before binding; check async/await sequencing. |
| **Session & Auth** | Infinite redirect loop between login and dashboard, premature session expiration, unauthorized role bypass. | Check `sessionStorage` / `localStorage` for JWT tokens; inspect `profiles.active_session_id` match; verify `assets/js/common/auth.js` guard execution. |
| **Database & RLS** | Query returns empty array `[]` despite data existing; HTTP `403 Forbidden`; duplicate key error on insert. | Check active Supabase session user ID (`auth.uid()`); verify RLS policies in `docs/supabase_schema_setup.sql`; check foreign key relationships. |
| **Hardware & Scanning** | RFID tag not recognized, QR scanner camera permission denied, duplicate tap recorded within seconds. | Check serial monitor baud rate (ESP32); verify hex UID format; test anti-passback 5-minute cooldown query logic; check camera HTTPS permission. |

### Step 3 — Root Cause Analysis & Security Audit
* **Check Anti-XSS Compliance:** Ensure data injection uses `element.textContent` or sanitized templates. Flag any hazardous `innerHTML` usage with unescaped user inputs.
* **Check Service Role Key Leaks:** Ensure `service_role` is never referenced in client code. Only `anonKey` from `assets/js/config/config.js` is permitted.
* **Check Single-Session Concurrency:** Verify if the user was logged out due to a newer login session overwriting `profiles.active_session_id`.

### Step 4 — Minimal Surgical Fix
* Target only the offending function or selector.
* Preserve existing code structure, variable naming conventions, and modular exports.
* Do not introduce external dependencies or frameworks.

### Step 5 — Regression & Cross-Panel Verification
* Test the affected module directly with valid and invalid inputs.
* Perform cross-panel checks:
  * If updating `attendance`, verify Teacher roster, Student view, and Admin reports.
  * If updating `excuse_slips`, verify Student submission, Teacher recommendation, and Admin review.
  * If updating `conferred_awards`, verify Admin conferment and Student read-only view.

---

## 3. Common Error Signatures & Resolution Strategies

### 1. Supabase Query Returns Empty `[]` with HTTP 200
* **Cause:** Row Level Security (RLS) is filtering out all records because `auth.uid()` does not match the policy condition, or user role in JWT does not grant access.
* **Resolution:** Check user session with `supabase.auth.getUser()`. Verify the policy in `docs/supabase_schema_setup.sql` matches the user's role and ID.

### 2. Infinite Redirect Loop Between `/login.html` and Dashboard
* **Cause:** Auth guard in `assets/js/common/auth.js` detects expired token or missing session, redirects to login, but login page detects existing session token and redirects to dashboard.
* **Resolution:** Synchronize token clearance. Ensure invalid session clears both `sessionStorage` and Supabase auth state before triggering redirect to `/login.html`.

### 3. Student Able to Access Certificate Print or Download Feature
* **Cause:** UI element not removed or missing role check in client controller.
* **Resolution:** Enforce strict read-only policy for students: remove print/download triggers from student templates and ensure no export functions are exposed.

### 4. Styles Missing After Adding Tailwind Classes
* **Cause:** Tailwind classes were written that were not pre-compiled into `assets/css/output.css`.
* **Resolution:** Check `assets/css/output.css` to confirm utility classes. Use only classes included in the design system or run the Tailwind build step. Never inject runtime CDN scripts.

---

## 4. Required Output Format

When providing debugging solutions, format the response systematically:

1. **Problem Statement:** Clear, concise summary of the reported defect.
2. **Root Cause Analysis:** Technical explanation of why the bug occurs, citing exact line numbers and architectural tiers.
3. **Evidence:** Console logs, network responses, error codes, or code snippets demonstrating the flaw.
4. **Surgical Fix:** The exact code changes required, presented as clean diffs or specific replacements.
5. **Files Modified:** List of all files modified with clickable markdown links (`file:///...`).
6. **Testing & Regression Checklist:** Step-by-step verification instructions to confirm the fix and ensure no regressions across Admin, Teacher, and Student panels.
