# Teacher Role Schema Design

## Table: `teachers`
```sql
CREATE TABLE IF NOT EXISTS public.teachers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    teacher_id TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    department TEXT NOT NULL,
    status TEXT DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive', 'Archived')),
    rfid_uid TEXT UNIQUE,
    qr_code TEXT UNIQUE,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_teachers_teacher_id ON public.teachers (teacher_id);
CREATE INDEX IF NOT EXISTS idx_teachers_rfid ON public.teachers (rfid_uid);
CREATE INDEX IF NOT EXISTS idx_teachers_qr ON public.teachers (qr_code);
```

## Description of Fields
- `teacher_id`: System-generated identifier adhering to the `t23011XXXX` format (e.g. `t230111001`).
- `name`: Teacher / Faculty member full name.
- `email`: Teacher Gmail for receiving credentials and notifications.
- `department`: Department / College assignment (e.g. `College of Computer Studies`).
- `status`: Account status, defaulted to `Active`.
- `rfid_uid`: Hardware RFID hex tag identifier.
- `qr_code`: Unique digital QR code string.

## Initial Teacher Account (1 Account)
- **Teacher ID:** `t230111001`
- **Name:** `Prof. Robert Miller`
- **Email:** `teacher@gmail.com`
- **Password:** `#Mi8080` *(Formula: # + 1st letter uppercase & 2nd letter lowercase of last name + 8080; Customizable by Admin)*
- **Department:** `College of Computer Studies`
- **RFID Card UID:** `E20000192900001`
- **QR Code:** `QR-TCH-t230111001`
- **Status:** `Active`
