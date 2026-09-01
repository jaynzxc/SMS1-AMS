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

* `admin/` → administrator pages and modules
* `student/` → student pages
* `teacher/` → teacher pages
* `assets/css/` → Tailwind and stylesheet files
* `assets/js/` → JavaScript modules
* `assets/images/` → system images
* `.agent/skills/` → reusable AI workflows

Preserve the existing folder structure.

Do not move files unless necessary.

---

# Coding Standards

## HTML

* Use semantic HTML whenever possible.
* Keep components readable and properly indented.
* Use meaningful IDs and class names.

## Tailwind CSS

* Prefer utility classes.
* Avoid unnecessary inline styles.
* Reuse existing design patterns for consistency.

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

---

# Development Rules

Before changing code:

1. Analyze the existing implementation.
2. Identify affected modules.
3. Explain the proposed solution.
4. Implement only the requested feature.
5. Check for regression in related pages.

Never rewrite an entire working module for a small change.

Prefer incremental modifications.

---

# Security Rules

* Frontend role checks are not enough.
* Sensitive authorization must be enforced in Supabase policies.
* Never trust client-side role values alone.
* Protect attendance records from unauthorized modification.

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
