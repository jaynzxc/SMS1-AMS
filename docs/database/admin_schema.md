# Admin Role Schema Design

## Table: `admin_details`
```sql
CREATE TABLE IF NOT EXISTS public.admin_details (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    username TEXT UNIQUE NOT NULL DEFAULT 'admin',
    office_location TEXT DEFAULT 'Main Administration Office',
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);
```

## Description of Fields & Credentials
- `username`: Administrator identifier (e.g. `admin`).
- `email`: System Admin email (e.g. `admin@bcp.edu.ph`).
- `user_id`: Reference to admin record in `profiles` (if authenticated via Supabase Auth).
- `password`: Stored securely in database / managed via Supabase Auth.
- Full administrative access to student/teacher user creation, RFID/QR assignments, attendance management, and password resets.
