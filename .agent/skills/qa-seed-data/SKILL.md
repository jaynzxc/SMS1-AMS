---
name: qa-seed-data
description: Comprehensive quality assurance checklists, cross-role multi-device verification workflows, and realistic mock seed data generation for the Bestlink College of the Philippines Attendance Monitoring System. Use when generating test records, verifying multi-panel workflows, or preparing for capstone demonstrations and defense.
---

# Quality Assurance & Test Seed Data Skill (SMS1-AMS)

## Goal

Ensure complete system integrity, data consistency, and seamless end-to-end demonstrations across **Admin**, **Teacher**, and **Student** panels prior to defense presentations.

---

## 1. Cross-Role Verification Lifecycle Checklist

When testing any feature, verify the full roundtrip through all 3 portals:

- [ ] **Step 1: Student Portal**
  - View current attendance balance and calendar dots.
  - Submit an excuse slip with reason and medical certificate / parent note attachment.
  - Verify status is immediately listed as `Pending`.
- [ ] **Step 2: Teacher Portal**
  - Open `excuse-slip/pending-requests.html` to find the newly submitted excuse.
  - Approve or Reject the excuse with teacher remarks.
  - Open `daily-attendance.html` and verify that the student's status automatically transitioned to `Excused`.
- [ ] **Step 3: Admin Portal**
  - Open `excuse-slip/approved-requests.html` to confirm the audit trail has been recorded.
  - Open `performance-analytics.html` and confirm the attendance percentage recomputed properly.
  - Check `parent-alerts.html` to ensure no false absence alerts remain active.

---

## 2. Standard Capstone Demo Seed Personas

Always maintain realistic, structured test accounts:

| Role | Name | Email / ID | Default RFID UID |
| :--- | :--- | :--- | :--- |
| **System Admin** | Engr. Administrator | `admin@bcp.edu.ph` | `ADMIN-001` |
| **Faculty Member** | Prof. Maria Santos | `prof.santos@bcp.edu.ph` | `TEACH-101` |
| **Ideal Student** | Juan Dela Cruz | `20240101@bcp.edu.ph` | `E2000019` (100% Attendance) |
| **Tardy Student** | Pedro Penduko | `20240102@bcp.edu.ph` | `E2000020` (Habitual Late) |
| **At-Risk Student** | Clara Santos | `20240103@bcp.edu.ph` | `E2000021` (3 Absences / Parent Alert) |

---

## 3. Seed SQL Pattern for Mock Attendance Data

When populating Supabase for local testing or demo presentations:
```sql
-- Insert mock student daily scan record
INSERT INTO attendance_records (
    student_id,
    subject_id,
    date,
    time_in,
    time_out,
    status,
    scan_method,
    remarks
) VALUES (
    '20240101',
    'IT301',
    CURRENT_DATE,
    '07:55:00',
    '11:00:00',
    'Present',
    'RFID',
    'On-time tap at gate turnstile'
);
```
