-- ============================================================================
-- Bestlink College of the Philippines Attendance Monitoring System
-- Supabase PostgreSQL Database Setup Script
-- Includes Tables, RLS Policies, Indexes, and Real-Time Support
-- ============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- 2. PROFILES TABLE (Linked to Supabase Auth)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('admin', 'teacher', 'student')),
    status TEXT DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive', 'Archived')),
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- ============================================================================
-- 3. STUDENTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    student_id TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    password TEXT,
    course TEXT NOT NULL,
    section TEXT NOT NULL,
    status TEXT DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive', 'Archived')),
    rfid_uid TEXT UNIQUE,
    qr_code TEXT UNIQUE,
    validation_date TEXT NOT NULL DEFAULT '1st Semester',
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- Ensure all columns exist if table was previously created
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS password TEXT;
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS validation_date TEXT DEFAULT '1st Semester';
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS rfid_uid TEXT;
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS qr_code TEXT;

-- Indexing for fast student lookup during RFID and QR scans
CREATE INDEX IF NOT EXISTS idx_students_student_id ON public.students (student_id);
CREATE INDEX IF NOT EXISTS idx_students_email ON public.students (email);
CREATE INDEX IF NOT EXISTS idx_students_rfid ON public.students (rfid_uid);
CREATE INDEX IF NOT EXISTS idx_students_qr ON public.students (qr_code);

-- ============================================================================
-- 4. TEACHERS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.teachers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    teacher_id TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    password TEXT,
    department TEXT NOT NULL,
    status TEXT DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive', 'Archived')),
    rfid_uid TEXT UNIQUE,
    qr_code TEXT UNIQUE,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- Ensure all columns exist if table was previously created
ALTER TABLE public.teachers ADD COLUMN IF NOT EXISTS password TEXT;
ALTER TABLE public.teachers ADD COLUMN IF NOT EXISTS rfid_uid TEXT;
ALTER TABLE public.teachers ADD COLUMN IF NOT EXISTS qr_code TEXT;

-- Indexing for fast teacher lookup
CREATE INDEX IF NOT EXISTS idx_teachers_teacher_id ON public.teachers (teacher_id);
CREATE INDEX IF NOT EXISTS idx_teachers_email ON public.teachers (email);
CREATE INDEX IF NOT EXISTS idx_teachers_rfid ON public.teachers (rfid_uid);
CREATE INDEX IF NOT EXISTS idx_teachers_qr ON public.teachers (qr_code);

-- ============================================================================
-- 5. ADMIN DETAILS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.admin_details (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    username TEXT UNIQUE NOT NULL DEFAULT 'admin',
    full_name TEXT NOT NULL DEFAULT 'System Administrator',
    email TEXT NOT NULL DEFAULT 'admin@bcp.edu.ph',
    password TEXT,
    office_location TEXT DEFAULT 'Main Administration Office',
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- Ensure all columns exist on pre-existing admin_details tables
ALTER TABLE public.admin_details ADD COLUMN IF NOT EXISTS username TEXT;
ALTER TABLE public.admin_details ADD COLUMN IF NOT EXISTS full_name TEXT DEFAULT 'System Administrator';
ALTER TABLE public.admin_details ADD COLUMN IF NOT EXISTS email TEXT DEFAULT 'admin@bcp.edu.ph';
ALTER TABLE public.admin_details ADD COLUMN IF NOT EXISTS password TEXT;
ALTER TABLE public.admin_details ADD COLUMN IF NOT EXISTS office_location TEXT DEFAULT 'Main Administration Office';

-- Ensure unique constraint on username for ON CONFLICT clause
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'admin_details_username_key'
    ) THEN
        ALTER TABLE public.admin_details ADD CONSTRAINT admin_details_username_key UNIQUE (username);
    END IF;
EXCEPTION
    WHEN OTHERS THEN NULL;
END $$;

-- ============================================================================
-- 6. ATTENDANCE TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.attendance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id TEXT NOT NULL,
    student_name TEXT NOT NULL,
    course_section TEXT NOT NULL,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    time_in TIME,
    time_out TIME,
    status TEXT NOT NULL CHECK (status IN ('Present', 'Late', 'Absent', 'Excused')),
    method TEXT DEFAULT 'RFID' CHECK (method IN ('RFID', 'QR Code', 'Manual')),
    remarks TEXT DEFAULT '-',
    recorded_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_attendance_date ON public.attendance (date);
CREATE INDEX IF NOT EXISTS idx_attendance_student_id ON public.attendance (student_id);

-- ============================================================================
-- 7. AUTOMATIC TIMESTAMP TRIGGER
-- ============================================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_students_updated_at ON public.students;
CREATE TRIGGER set_students_updated_at
    BEFORE UPDATE ON public.students
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_teachers_updated_at ON public.teachers;
CREATE TRIGGER set_teachers_updated_at
    BEFORE UPDATE ON public.teachers
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================================
-- 8. ROW-LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
DROP POLICY IF EXISTS "Allow all profiles operations" ON public.profiles;
CREATE POLICY "Allow all profiles operations"
    ON public.profiles FOR ALL
    USING (true)
    WITH CHECK (true);

-- Students Policies (Full CRUD for User Management & RFID/QR scanning)
DROP POLICY IF EXISTS "Allow all students operations" ON public.students;
CREATE POLICY "Allow all students operations"
    ON public.students FOR ALL
    USING (true)
    WITH CHECK (true);

-- Teachers Policies (Full CRUD for User Management & Attendance)
DROP POLICY IF EXISTS "Allow all teachers operations" ON public.teachers;
CREATE POLICY "Allow all teachers operations"
    ON public.teachers FOR ALL
    USING (true)
    WITH CHECK (true);

-- Admin Details Policies
DROP POLICY IF EXISTS "Allow all admin_details operations" ON public.admin_details;
CREATE POLICY "Allow all admin_details operations"
    ON public.admin_details FOR ALL
    USING (true)
    WITH CHECK (true);

-- Attendance Policies (Full read/write for attendance scanning & analytics)
DROP POLICY IF EXISTS "Allow all attendance operations" ON public.attendance;
CREATE POLICY "Allow all attendance operations"
    ON public.attendance FOR ALL
    USING (true)
    WITH CHECK (true);

-- ============================================================================
-- 9. CLEANUP PREVIOUS HARDCODED STARTER ACCOUNTS (If any)
-- ============================================================================
DELETE FROM public.students WHERE student_id = 's230111001';
DELETE FROM public.teachers WHERE teacher_id = 't230111001';

-- ============================================================================
-- 10. INITIAL ADMIN ACCOUNT SEED / UPSERT
-- ============================================================================
-- You can customize the admin username, email, and password directly here.
-- No passwords are stored in the client-side JavaScript source code.
INSERT INTO public.admin_details (
    username,
    full_name,
    email,
    password,
    office_location
) VALUES (
    'admin',
    'System Administrator',
    'admin@bcp.edu.ph',
    'bcpadmin123',
    'Main Administration Office'
) ON CONFLICT (username) DO NOTHING;
