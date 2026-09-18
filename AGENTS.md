# Bestlink College of the Philippines Attendance Monitoring System

## Project Identity

**Capstone Title:** Design and Development of an Attendance Monitoring System for Bestlink College of the Philippines with Performance Analytics and RFID/QR Scanning.

This repository contains the frontend and backend integration of a college attendance monitoring system.

The system manages student attendance, teacher attendance, RFID scanning, QR scanning, tardiness, absences, excused attendance, reports, analytics, and role-based access.

---

# Technology Stack

* HTML5
* Tailwind CSS
* JavaScript
* Supabase
* PostgreSQL

Do not introduce React, Vue, Angular, PHP, Laravel, or other frameworks unless explicitly requested.

---

# IDE Usage

* **Antigravity:** coding and implementation.
* **VS Code + OpenCode:** planning, workflow design, architecture, and documentation.

When generating documentation, prioritize analysis before implementation.

---

# Current Folder Structure

* `admin/` → administrator pages and submodules
* `student/` → student pages and submodules
* `teacher/` → teacher pages and submodules
* `assets/css/` → Tailwind and stylesheet files
* `assets/js/` → JavaScript modules (`admin/`, `teacher/`, `student/`, `services/`, `common/`, `config/`, `utils/`)
* `assets/images/` → system images and logos
* `docs/` → organized technical documentation (`architecture/`, `database/`, `modules/`, `security/`)
* `.agent/skills/` → reusable AI workflows (14 domain skills)

See `docs/FILE_STRUCTURE_PLAN.md` for full directory details. Preserve the existing folder structure. Do not move files unless necessary.

---

# Coding Standards

## HTML

* Use semantic HTML whenever possible.
* Keep components readable and properly indented.
* Use meaningful IDs and class names.

## Tailwind CSS & Design

* Prefer utility classes.
* Avoid unnecessary inline styles.
* Reuse existing design patterns for consistency.
* Follow the official design system and reference benchmarks defined in `.agent/skills/ui-ux/SKILL.md`.

## JavaScript

* Use modular and readable functions.
* Separate UI logic from database logic when possible.
* Avoid duplicate code.
* Add comments only when logic is not obvious.

## Supabase

* Use PostgreSQL through Supabase.
* Never expose service-role keys in frontend code.
* Respect Row Level Security when designing authorization.
* Do not modify database schema without explaining the impact first.

## Code Cleanliness & Quality (Zero AI Slop)

* **No AI Slop:** Write clean, purposeful, production-grade code. Avoid bloated boilerplate, redundant restatements of code in comments, hollow wrappers, or fake dummy functions.
* **No Emojis When Generating Code:** Do NOT use emojis in code, comments, console logs, commit messages, or UI elements. Use clean, professional inline SVGs or standard text badges.

---

# Development Rules

Before changing code:

1. **Always review other related files before proceeding:** Inspect related HTML views, JS controllers, shared utilities, and schema definitions before designing or touching code.
2. **Always send an implementation plan before proceeding:** Deliver a clear, structured plan outlining affected files, database impact, and verification steps for user review before implementing changes.
3. **Identify affected modules across all roles:** Consult `.agent/skills/system-flow/SKILL.md` to trace dependencies across Admin, Teacher, and Student portals.
4. **Implement only the requested feature:** Never rewrite an entire working module for a small change.
5. **Check for regression in related pages:** Validate that modifications do not break cross-panel sync or dependent views.

Prefer incremental modifications.

---

# Security Rules

* Frontend role checks are not enough.
* Sensitive authorization must be enforced in Supabase policies.
* Never trust client-side role values alone.
* Protect attendance records from unauthorized modification.
* Follow all threat mitigation and defense-in-depth rules defined in `.agent/skills/security/SKILL.md`.

---

# Documentation Rules

When creating documentation:

1. Explain the objective.
2. Describe workflow.
3. Identify actors involved.
4. Explain database interaction.
5. Include assumptions.
6. Identify future improvements separately.

Use clear academic writing suitable for a capstone project.

---

# Response Behavior

When assisting with this project:

* Be concise but technically accurate.
* Preserve existing architecture.
* Ask for missing requirements instead of inventing system behavior.
* Clearly distinguish confirmed information from assumptions.
* Prioritize maintainability and simplicity over unnecessary complexity.
