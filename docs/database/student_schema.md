# Student Role Schema Design

## Table: `students`
```sql
CREATE TABLE IF NOT EXISTS public.students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    student_id TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    course TEXT NOT NULL,
    section TEXT NOT NULL,
    status TEXT DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive', 'Archived')),
    rfid_uid TEXT UNIQUE,
    qr_code TEXT UNIQUE,
    validation_date TEXT NOT NULL DEFAULT '1st Semester',
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_students_student_id ON public.students (student_id);
CREATE INDEX IF NOT EXISTS idx_students_rfid ON public.students (rfid_uid);
CREATE INDEX IF NOT EXISTS idx_students_qr ON public.students (qr_code);
```

## Description of Fields
- `student_id`: System-generated identifier adhering to the `s23011XXXX` format (e.g. `s230111001`).
- `name`: Student full name.
- `email`: Student Gmail for receiving login credentials and portal access.
- `course`: Selected degree program (e.g. `BSIT`, `BSCS`, `BSBA`, `BSA`).
- `section`: Auto-assigned class section (e.g. `1A`, `2B`), editable by admin in user management.
- `status`: Account status, defaulted to `Active`.
- `rfid_uid`: Hardware RFID hex tag identifier.
- `qr_code`: Unique digital QR code string.
- `validation_date`: Academic semester term (e.g. `1st Semester`, `2nd Semester`).

## Initial Student Account (1 Account)
- **Student ID:** `s230111001`
- **Name:** `Dela Cruz, Juan Paolo`
- **Email:** `student@gmail.com`
- **Password:** `#De8080` *(Formula: # + 1st letter uppercase & 2nd letter lowercase of last name + 8080; Customizable by Admin)*
- **Course & Section:** `BSIT 2A`
- **RFID Card UID:** `E20000192803001`
- **QR Code:** `QR-STU-s230111001`
- **Validation Date:** `1st Semester`
- **Status:** `Active`
