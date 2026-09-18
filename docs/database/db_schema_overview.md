# Database Schema Overview

This document captures the finalized Supabase PostgreSQL schema design for the Attendance Monitoring System for **Admin**, **Teacher**, and **Student** roles.

## Table Architecture & Keys
| Table | Primary Key | References / Foreign Keys | Description |
|---|---|---|---|
| `profiles` | `id` (UUID) | `auth.users(id) ON DELETE CASCADE` | Central profile table storing system roles (`admin`, `teacher`, `student`) |
| `students` | `id` (UUID) | `user_id -> profiles(id)` | Enrolled student records with auto-generated ID (`s23011XXXX`), course, section, RFID, QR, validation date |
| `teachers` | `id` (UUID) | `user_id -> profiles(id)` | Faculty member records with auto-generated ID (`t23011XXXX`), department, RFID, QR |
| `admin_details` | `id` (UUID) | `user_id -> profiles(id)` | Admin account details (`admin`, office location) |
| `attendance` | `id` (UUID) | `student_id -> students(student_id)` | Scanned attendance logs with timestamps, status (Present, Late, Absent, Excused), and method |

## ID & Key Generation Standards
- **Student ID**: Automatically formatted as `s23011XXXX` (e.g. `s230111001`).
- **Teacher ID**: Automatically formatted as `t23011XXXX` (e.g. `t230111001`).
- **RFID UID**: Hardware contactless UID / hex format (e.g. `E20000192803001`).
- **QR Code**: Standardized badge payload string (`QR-STU-s23011XXXX` / `QR-TCH-t23011XXXX`).
- **Gmail**: Student/Teacher Gmail address configured to receive their account credentials.

## SQL Setup
The full SQL deployment script is located at:
[`docs/supabase_schema_setup.sql`](file:///c:/Users/jaync/Desktop/Attendance%20Monitoring%20System/SMS1-AMS/docs/supabase_schema_setup.sql)
