-- Supabase / PostgreSQL schema for Attendance Management

create table users (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text unique not null,
  password_hash text not null,
  role text check (role in ('admin','student')) not null,
  created_at timestamptz default now()
);

create table students (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  register_number text unique not null
);

create table attendance (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references students(id) on delete cascade,
  date date not null,
  status text check (status in ('present','absent')) not null,
  created_at timestamptz default now(),
  constraint one_per_day unique(student_id, date)
);

-- Indexes to help aggregations
create index attendance_student_date_idx on attendance(student_id, date);
