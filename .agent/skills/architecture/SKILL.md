---

name: architecture
description: Design system architecture, module relationships, workflows, folder responsibilities, and data flow for the Bestlink College of the Philippines Attendance Monitoring System. Use when analyzing architecture before implementation or documentation.
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

# Architecture Skill (SMS1-AMS)

## Goal

Design and maintain a clean, resilient, and scalable architecture using **HTML5**, **Compiled Tailwind CSS**, **Vanilla JavaScript (ES6 Modules)**, **Supabase PostgreSQL**, and **IoT Hardware (ESP32 + RC522)** for the Bestlink College of the Philippines Attendance Monitoring System.

---

## 1. Architectural Principles & Constraints

1. **No External Frameworks:** Do NOT introduce React, Vue, Angular, jQuery, PHP, or Laravel. Preserve the lightweight Vanilla JS + HTML5 architecture.
2. **Compiled CSS Pipeline:** Styles must strictly use `assets/css/output.css` and `assets/css/style.css`. Never inject runtime Tailwind CDN scripts.
3. **Strict Role-Based Directory Boundaries:**
   * `admin/`: Campus-wide administration, user management, policy setup, audits, and official conferment.
   * `teacher/`: Daily attendance roster, live classroom kiosk scanner, first-line excuse reviews, faculty DTR.
   * `student/`: Strictly read-only consumer for personal attendance records, calendar, dynamic QR badge, and award verification.
4. **Defense-in-Depth:** Frontend route guards + Client JWT Bearer tokens + Hardware Anti-Passback + Supabase PostgreSQL Row Level Security (RLS).
5. **Cross-Panel Synchronization:** Actions in one panel must cascade state consistently across other roles as defined in `.agent/skills/system-flow/SKILL.md`.

---

## 2. Architecture Layers

```
  ┌────────────────────────────────────────────────────────────────────────┐
  │                           PRESENTATION TIER                            │
  │  - Semantic HTML5 + Compiled Tailwind CSS                              │
  │  - Role-specific panels: /admin/, /teacher/, /student/                 │
  │  - UI Components follow .agent/skills/ui-ux/SKILL.md                   │
  └──────────────────────────────────┬─────────────────────────────────────┘
                                     │
                                     ▼
  ┌────────────────────────────────────────────────────────────────────────┐
  │                         CLIENT APPLICATION TIER                        │
  │  - Modular Vanilla JavaScript (ES6)                                    │
  │  - Shared Auth & Page Guards: assets/js/common/auth.js                 │
  │  - Supabase JS Client: assets/js/config/supabaseClient.js              │
  │  - Public anonKey ONLY; zero service_role exposure                     │
  └──────────────────────────────────┬─────────────────────────────────────┘
                                     │
                                     ▼
  ┌────────────────────────────────────────────────────────────────────────┐
  │                     IOT HARDWARE & SCANNING TIER                       │
  │  - ESP32 Microcontroller + RC522 13.56 MHz RFID Reader                 │
  │  - Web-based Camera QR Scanner (live-scanner.html)                     │
  │  - 5-minute Anti-Passback Cooldown Engine                              │
  │  - Automated Parent SMS Dispatch Gateway                               │
  └──────────────────────────────────┬─────────────────────────────────────┘
                                     │
                                     ▼
  ┌────────────────────────────────────────────────────────────────────────┐
  │                        DATABASE & STORAGE TIER                         │
  │  - Supabase PostgreSQL with 100% Row Level Security (RLS)             │
  │  - Supabase Auth (Salted Bcrypt, 2FA/OTP support)                      │
  │  - Supabase Storage Bucket (Whitelisted excuse attachments <= 5MB)     │
  │  - Immutable Security Audit Log: user_activity                         │
  └────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Analysis & Review Workflow

Before proposing or modifying system architecture:

1. **Identify Involved Modules:** Map the target feature across Admin, Teacher, and Student panels.
2. **Verify Data Flow:** Trace data from ingestion (RFID tap / QR scan / form input) to database commit and downstream panel reflections.
3. **Map Files & Responsibilities:** Clearly distinguish UI layout (`.html`), client controller (`assets/js/`), and database table/RLS impact.
4. **Enforce Security Boundaries:** Ensure students cannot execute unauthorized state mutations (e.g. attendance logs or award generation).
5. **Assess Scalability & Concurrency:** Verify indexing, anti-passback cooldowns, and single-session tracking (`profiles.active_session_id`).

---

## 4. Required Output Format

When generating architectural analysis:

1. **Architecture Overview:** Concise summary of the module within the 4-tier model.
2. **Module Responsibilities:** Clear breakdown for Admin, Teacher, and Student roles.
3. **Data Flow & Sequence Diagram:** Mermaid diagram showing data ingestion to display.
4. **Folder & File Mapping:** Exact file paths created or modified.
5. **Database & RLS Impact:** Affected tables, foreign keys, and RLS policies.
6. **Security Considerations:** Anti-XSS, CSRF, input validation, and audit logging.
7. **Scalability & Risk Assessment:** Concurrency limits and rollback strategies.
