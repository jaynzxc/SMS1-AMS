-- ============================================================================
-- BESTLINK COLLEGE OF THE PHILIPPINES (BCP) - ATTENDANCE MONITORING SYSTEM (SMS1-AMS)
-- Comprehensive Supabase PostgreSQL Schema & Security Migration Script
-- ============================================================================
-- How to use:
-- 1. Open your Supabase Project Dashboard (https://supabase.com/dashboard)
-- 2. Navigate to "SQL Editor" -> "New query"
-- 3. Paste this entire script and click "Run"
-- ============================================================================

-- Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- 1. PROFILES TABLE (Core user registry linked to Supabase auth.users)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('admin', 'teacher', 'student')),
    status TEXT DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive', 'Archived')),
    active_session_id TEXT, -- Hash of active session for single-session enforcement
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);

-- ============================================================================
-- 2. STUDENTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    student_id TEXT UNIQUE NOT NULL, -- e.g. "s23011001"
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    course TEXT NOT NULL,            -- e.g. "BSIT"
    section TEXT NOT NULL,           -- e.g. "BSIT 3A"
    year_level TEXT DEFAULT '3rd Year',
    guardian_name TEXT,
    guardian_contact TEXT,           -- Philippine mobile e.g. "09123456789"
    status TEXT DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive', 'Archived')),
    rfid_uid TEXT UNIQUE,            -- Mifare Card UID
    qr_code TEXT UNIQUE,             -- Encrypted dynamic QR token
    validation_date TEXT DEFAULT '1st Semester AY 2026-2027',
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_students_student_id ON public.students(student_id);
CREATE INDEX IF NOT EXISTS idx_students_rfid ON public.students(rfid_uid);
CREATE INDEX IF NOT EXISTS idx_students_qr ON public.students(qr_code);
CREATE INDEX IF NOT EXISTS idx_students_section ON public.students(section);

-- ============================================================================
-- 3. TEACHERS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.teachers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    teacher_id TEXT UNIQUE NOT NULL, -- e.g. "t23011001"
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    department TEXT NOT NULL,        -- e.g. "College of Computer Studies"
    status TEXT DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive', 'Archived')),
    rfid_uid TEXT UNIQUE,
    qr_code TEXT UNIQUE,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_teachers_teacher_id ON public.teachers(teacher_id);
CREATE INDEX IF NOT EXISTS idx_teachers_rfid ON public.teachers(rfid_uid);

-- ============================================================================
-- 4. ADMIN DETAILS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.admin_details (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    username TEXT UNIQUE NOT NULL DEFAULT 'admin',
    full_name TEXT NOT NULL DEFAULT 'System Administrator',
    email TEXT NOT NULL DEFAULT 'admin@bcp.edu.ph',
    office_location TEXT DEFAULT 'Main Administration Office',
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- ============================================================================
-- 5. ATTENDANCE TABLE (Student attendance sessions & kiosk logs)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.attendance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id TEXT NOT NULL,        -- Matches students.student_id
    student_name TEXT NOT NULL,
    course_section TEXT NOT NULL,
    subject_code TEXT DEFAULT 'IT301',
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    time_in TIME,
    time_out TIME,
    status TEXT NOT NULL CHECK (status IN ('Present', 'Late', 'Absent', 'Excused')),
    delay_minutes INTEGER DEFAULT 0,
    method TEXT DEFAULT 'RFID' CHECK (method IN ('RFID', 'QR Code', 'Manual')),
    is_locked BOOLEAN DEFAULT false,
    verified_by UUID REFERENCES public.profiles(id),
    remarks TEXT DEFAULT '-',
    recorded_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_attendance_date ON public.attendance(date);
CREATE INDEX IF NOT EXISTS idx_attendance_student_id ON public.attendance(student_id);
CREATE INDEX IF NOT EXISTS idx_attendance_status ON public.attendance(status);
CREATE INDEX IF NOT EXISTS idx_attendance_section ON public.attendance(course_section);

-- ============================================================================
-- 6. TEACHER ATTENDANCE (Faculty Daily Time Record - DTR)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.teacher_attendance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    teacher_id TEXT NOT NULL,        -- Matches teachers.teacher_id
    faculty_name TEXT NOT NULL,
    department TEXT NOT NULL,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    time_in TIME,
    time_out TIME,
    rendered_hours NUMERIC(4, 2) DEFAULT 0.00,
    status TEXT NOT NULL CHECK (status IN ('Present', 'Late', 'Absent', 'On Leave')),
    method TEXT DEFAULT 'RFID' CHECK (method IN ('RFID', 'QR Code', 'Manual')),
    remarks TEXT DEFAULT '-',
    recorded_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_teacher_attendance_date ON public.teacher_attendance(date);
CREATE INDEX IF NOT EXISTS idx_teacher_attendance_teacher ON public.teacher_attendance(teacher_id);

-- ============================================================================
-- 7. EXCUSE SLIPS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.excuse_slips (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id TEXT NOT NULL,
    student_name TEXT NOT NULL,
    section TEXT NOT NULL,
    absence_date DATE NOT NULL,
    subject TEXT DEFAULT 'All Enrolled Classes',
    reason_category TEXT NOT NULL CHECK (reason_category IN ('Medical Illness', 'Family Emergency', 'Official School Event', 'Other')),
    explanation TEXT NOT NULL,
    attachment_url TEXT,
    status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'Approved', 'Rejected')),
    reviewed_by UUID REFERENCES public.profiles(id),
    reviewer_name TEXT,
    review_remarks TEXT,
    reviewed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_excuse_student ON public.excuse_slips(student_id);
CREATE INDEX IF NOT EXISTS idx_excuse_status ON public.excuse_slips(status);

-- ============================================================================
-- 8. RFID CARDS REGISTRY
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.rfid_cards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    card_uid TEXT UNIQUE NOT NULL,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('student', 'teacher')),
    status TEXT DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive', 'Reported Lost', 'Damaged')),
    issued_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
    last_scanned_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_rfid_uid ON public.rfid_cards(card_uid);

-- ============================================================================
-- 9. PARENT SMS LOGS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.sms_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id TEXT NOT NULL,
    student_name TEXT NOT NULL,
    recipient_contact TEXT NOT NULL,
    message_content TEXT NOT NULL,
    trigger_reason TEXT NOT NULL CHECK (trigger_reason IN ('Late Arrival', 'Unexcused Absence', 'Threshold Alert', 'General Advisory')),
    status TEXT DEFAULT 'Sent' CHECK (status IN ('Pending', 'Sent', 'Failed')),
    sent_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- ============================================================================
-- 10. CONFERRED PERFECT ATTENDANCE AWARDS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.conferred_awards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id TEXT NOT NULL,
    student_name TEXT NOT NULL,
    program_section TEXT NOT NULL,
    academic_term TEXT NOT NULL,      -- e.g. "1st Semester AY 2025-2026"
    credential_id TEXT UNIQUE NOT NULL, -- e.g. "BCP-AMS-CERT-2026-004821"
    audit_sessions_present INTEGER NOT NULL,
    audit_total_sessions INTEGER NOT NULL,
    audit_lates INTEGER DEFAULT 0,
    audit_absences INTEGER DEFAULT 0,
    attendance_rate NUMERIC(5, 2) DEFAULT 100.00,
    is_conferred BOOLEAN DEFAULT true,
    conferred_by UUID REFERENCES public.profiles(id),
    conferred_date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_awards_student ON public.conferred_awards(student_id);
CREATE INDEX IF NOT EXISTS idx_awards_credential ON public.conferred_awards(credential_id);

-- ============================================================================
-- 11. IMMUTABLE SECURITY AUDIT LOG (`user_activity`)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.user_activity (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    role TEXT NOT NULL,
    action TEXT NOT NULL,             -- e.g. 'LOGIN', 'ATTENDANCE_OVERRIDE', 'EXCUSE_APPROVED'
    target_resource TEXT,             -- e.g. 'attendance:2026-09-16'
    ip_address TEXT,
    user_agent TEXT,
    details JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_activity_user ON public.user_activity(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_action ON public.user_activity(action);

-- ============================================================================
-- 12. AUTOMATIC TIMESTAMP TRIGGER FUNCTION
-- ============================================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_profiles_updated_at ON public.profiles;
CREATE TRIGGER set_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_students_updated_at ON public.students;
CREATE TRIGGER set_students_updated_at
    BEFORE UPDATE ON public.students
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_teachers_updated_at ON public.teachers;
CREATE TRIGGER set_teachers_updated_at
    BEFORE UPDATE ON public.teachers
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================================
-- 13. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teacher_attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.excuse_slips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rfid_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sms_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conferred_awards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_activity ENABLE ROW LEVEL SECURITY;

-- Helper function to check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles Policies
DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
CREATE POLICY "Users can read own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id OR public.is_admin());

DROP POLICY IF EXISTS "Admins full access on profiles" ON public.profiles;
CREATE POLICY "Admins full access on profiles"
    ON public.profiles FOR ALL
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- Students Policies
DROP POLICY IF EXISTS "Students can read own record" ON public.students;
CREATE POLICY "Students can read own record"
    ON public.students FOR SELECT
    USING (user_id = auth.uid() OR public.is_admin() OR EXISTS (
        SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'teacher'
    ));

DROP POLICY IF EXISTS "Admins manage students" ON public.students;
CREATE POLICY "Admins manage students"
    ON public.students FOR ALL
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- Attendance Policies (Students CANNOT write to attendance!)
DROP POLICY IF EXISTS "Students can view own attendance" ON public.attendance;
CREATE POLICY "Students can view own attendance"
    ON public.attendance FOR SELECT
    USING (
        student_id IN (SELECT student_id FROM public.students WHERE user_id = auth.uid())
        OR public.is_admin()
        OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'teacher')
    );

DROP POLICY IF EXISTS "Teachers and admins can record attendance" ON public.attendance;
CREATE POLICY "Teachers and admins can record attendance"
    ON public.attendance FOR INSERT
    WITH CHECK (
        public.is_admin() OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'teacher')
    );

DROP POLICY IF EXISTS "Teachers and admins can update attendance" ON public.attendance;
CREATE POLICY "Teachers and admins can update attendance"
    ON public.attendance FOR UPDATE
    USING (
        public.is_admin() OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'teacher')
    );

-- Excuse Slips Policies
DROP POLICY IF EXISTS "Students can submit and view own excuse slips" ON public.excuse_slips;
CREATE POLICY "Students can submit and view own excuse slips"
    ON public.excuse_slips FOR ALL
    USING (
        student_id IN (SELECT student_id FROM public.students WHERE user_id = auth.uid())
        OR public.is_admin()
        OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'teacher')
    )
    WITH CHECK (
        student_id IN (SELECT student_id FROM public.students WHERE user_id = auth.uid())
        OR public.is_admin()
        OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'teacher')
    );

-- Conferred Awards Policies (Read-only for students, admins confer)
DROP POLICY IF EXISTS "Students can view own conferred awards" ON public.conferred_awards;
CREATE POLICY "Students can view own conferred awards"
    ON public.conferred_awards FOR SELECT
    USING (
        student_id IN (SELECT student_id FROM public.students WHERE user_id = auth.uid())
        OR public.is_admin()
        OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'teacher')
    );

DROP POLICY IF EXISTS "Admins confer awards" ON public.conferred_awards;
CREATE POLICY "Admins confer awards"
    ON public.conferred_awards FOR ALL
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- User Activity Policies (Immutable: Only Admins read, nobody updates or deletes)
DROP POLICY IF EXISTS "Admins view activity logs" ON public.user_activity;
CREATE POLICY "Admins view activity logs"
    ON public.user_activity FOR SELECT
    USING (public.is_admin());

DROP POLICY IF EXISTS "System insert activity logs" ON public.user_activity;
CREATE POLICY "System insert activity logs"
    ON public.user_activity FOR INSERT
    WITH CHECK (true);

DROP POLICY IF EXISTS "Deny update on user_activity" ON public.user_activity;
CREATE POLICY "Deny update on user_activity" ON public.user_activity FOR UPDATE USING (false);

DROP POLICY IF EXISTS "Deny delete on user_activity" ON public.user_activity;
CREATE POLICY "Deny delete on user_activity" ON public.user_activity FOR DELETE USING (false);
