# SMS1-AMS Project File Structure Plan & Organization

**Capstone Project:** Design and Development of an Attendance Monitoring System for Bestlink College of the Philippines with Performance Analytics and RFID/QR Scanning  
**Target Platform:** Pure Vanilla HTML5, Tailwind CSS v4, Modular JavaScript (ESM), Supabase (PostgreSQL with RLS)

---

## 1. Executive Summary

This document establishes the official file structure standard and cleanup plan for the **SMS1-AMS** repository. The goal is to ensure high maintainability, clear folder responsibilities, strict separation of concerns, and clean academic documentation suitable for capstone defense and future scaling.

---

## 2. Issues in Current Structure

1. **Misleading `keys/` Directory**:
   - Contains `admin_schema.md`, `student_schema.md`, `teacher_schema.md`, and `db_schema_overview.md`.
   - The directory name `keys` falsely implies private cryptographic keys or API secrets. Furthermore, `.gitignore` previously ignored `keys/`, which caused core database documentation to be excluded from version control.
   - **Resolution**: Move all schema markdown files into `docs/database/` and eliminate the `keys/` directory.

2. **Flat & Disorganized `docs/` Root**:
   - Product requirements, SQL scripts, security policies, and role specs were jumbled together in a single flat directory.
   - **Resolution**: Organize `docs/` into 4 domain directories:
     - `docs/architecture/` (System PRD, RFID/QR hardware workflows, overall lifecycle)
     - `docs/database/` (Supabase DDL, schema definitions, ERD relationships)
     - `docs/modules/` (Role specifications for Admin, Teacher, and Student portals)
     - `docs/security/` (RLS policies, session guards, audit logging specifications)

3. **Misplaced Environment Configuration**:
   - `.env.local` was located inside `assets/.env.local`. Serving static files from `assets/` could inadvertently expose local environment variables.
   - **Resolution**: Relocate `.env.local` to the workspace root (ignored by `.gitignore`) and provide a clean, sanitized `.env.example` at root.

4. **Empty Directories & Utilities Gap**:
   - Unused `scratch/` folder at workspace root.
   - Absence of an `assets/js/utils/` folder for shared reusable formatting, date calculations, and export helpers.
   - **Resolution**: Prune empty `scratch/` and establish `assets/js/utils/`.

---

## 3. Target File Structure

```text
SMS1-AMS/
├── .agent/                             # Agent Skills & Workflows
│   └── skills/
│       ├── architecture/               # System architecture & data flow
│       ├── database/                   # Supabase schema & SQL planning
│       ├── debugging/                  # Systematic bug triage
│       ├── documentation/              # Academic technical writing
│       ├── planning/                   # Feature breakdown & planning
│       ├── rbac/                       # Role-based access control
│       ├── security/                   # Session lifecycle & RLS rules
│       ├── system-flow/                # Cross-panel module connections
│       ├── ui-ux/                      # UI design standards & benchmarks
│       ├── ui-ux_backend_spec/         # Component query shapes & payload contracts
│       ├── rfid-qr-hardware/          # [NEW] Hardware scanner & USB HID specifications
│       ├── analytics-reporting/        # [NEW] Attendance calculation & Chart.js guidelines
│       ├── parent-alerts-sms/          # [NEW] Parent SMS notification dispatch engine
│       └── qa-seed-data/               # [NEW] Mock seed scripts & test scenarios
│
├── admin/                              # Administrator Views (15 modules)
│   ├── academic-management.html
│   ├── attendance-calendar.html
│   ├── attendance.html
│   ├── dashboard.html
│   ├── parent-alerts.html
│   ├── perfect-attendance.html
│   ├── performance-analytics.html
│   ├── profile.html
│   ├── reports-export.html
│   ├── settings.html
│   ├── teacher-attendance.html
│   ├── user-management.html
│   ├── excuse-slip/                    # (pending, approved, rejected, history)
│   ├── rfid-and-qr/                    # (rfid-registry, qr-management, scan-logs)
│   └── tardy-and-absence/              # (absence-list, habitual-offender, tardy-list)
│
├── teacher/                            # Teacher Views (13 modules)
│   ├── attendance-calendar.html
│   ├── class-analytics.html
│   ├── daily-attendance.html
│   ├── dashboard.html
│   ├── parent-alerts.html
│   ├── perfect-attendance.html
│   ├── profile.html
│   ├── reports-export.html
│   ├── settings.html
│   ├── teacher-attendance.html
│   ├── excuse-slip/                    # (pending, approved, rejected, history)
│   ├── rfid-and-qr/                    # (live-scanner, scan-logs)
│   └── tardy-and-absence/              # (absence-list, student-attendance-history, tardy-list)
│
├── student/                            # Student Views (10 modules)
│   ├── attendance-calendar.html
│   ├── dashboard.html
│   ├── my-attendance.html
│   ├── notifications.html
│   ├── perfect-attendance.html
│   ├── performance-analytics.html
│   ├── profile.html
│   ├── rfid-and-qr.html
│   ├── excuse-slip/                    # (submit-excuse, my-requests, excuse-history)
│   └── tardy-and-absence/              # (absence-records, attendance-history, tardy-records)
│
├── assets/
│   ├── css/
│   │   ├── input.css                   # Tailwind source
│   │   ├── output.css                  # Compiled Tailwind output
│   │   └── style.css                   # Global styles & micro-animations
│   ├── images/
│   │   ├── bcp-logo.png
│   │   └── login-bg.png
│   └── js/
│       ├── admin/                      # Admin page-specific scripts (19 modules)
│       ├── teacher/                    # Teacher page-specific scripts (13 modules)
│       ├── student/                    # Student page-specific scripts (10 modules)
│       ├── common/                     # auth-guard.js, sidebar.js, auth.js, flyout.js
│       ├── services/                   # Supabase API services (attendance, auth, rfid)
│       ├── config/                     # Supabase public credentials
│       └── utils/                      # [NEW] Shared date helpers, formatters, sanitizers
│
├── docs/                               # Reorganized Technical Documentation
│   ├── FILE_STRUCTURE_PLAN.md          # This structural blueprint
│   ├── architecture/
│   │   ├── PRD.md                      # Capstone product requirements
│   │   ├── system_workflow.md          # Multi-role attendance lifecycles
│   │   └── rfid_qr_workflow.md         # Gate/room scanning sequence diagrams
│   ├── database/
│   │   ├── supabase_schema.sql         # Production DDL with tables & RLS
│   │   ├── database_schema_design.md   # Schema normalization rationale
│   │   ├── db_schema_overview.md       # Consolidated ERD (from keys/)
│   │   ├── admin_schema.md             # Admin table references (from keys/)
│   │   ├── teacher_schema.md           # Teacher table references (from keys/)
│   │   └── student_schema.md           # Student table references (from keys/)
│   ├── modules/
│   │   ├── admin_frontend.md           # Admin screen catalog & interactions
│   │   ├── teacher_frontend.md         # Teacher screen catalog & interactions
│   │   └── student_frontend.md         # Student screen catalog & interactions
│   └── security/
│       └── security.md                 # Defense-in-depth, 2FA, session policies
│
├── .env.example                        # Environment template for developers
├── .gitignore                          # Standardized git ignore rules
├── AGENTS.md                           # Master project instructions for AI agents
├── index.html                          # Root portal gateway & authentication
├── package.json
└── tailwind.config.js
```

---

## 4. Execution & Cleanup Roadmap

### Phase 1: Documentation & Schema Reorganization
1. Create directories: `docs/architecture`, `docs/database`, `docs/modules`, `docs/security`.
2. Move all `.md` files from `keys/` into `docs/database/`.
3. Delete the obsolete `keys/` folder.
4. Move root `docs/` files into their respective subdirectories.

### Phase 2: Environment & Repository Hygiene
1. Move `assets/.env.local` to root `.env.local`.
2. Create `.env.example` at root for template reference.
3. Update `.gitignore` to remove `keys/` and `assets/.env.local`, ensuring root `.env*` is ignored.
4. Remove unused root `scratch/` directory.
5. Create `assets/js/utils/` with a shared `helpers.js`.

### Phase 3: Agent Skills Expansion
1. Create `rfid-qr-hardware` skill.
2. Create `analytics-reporting` skill.
3. Create `parent-alerts-sms` skill.
4. Create `qa-seed-data` skill.
5. Update `AGENTS.md` with the new structure and skill list.
