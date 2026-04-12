-- ==========================================
-- CareSphere Auth Fix: Run in Supabase SQL Editor
-- This fixes issues that may prevent sign-in from working
-- ==========================================

-- Fix 1: Make PasswordHash nullable in Patient table
-- (Supabase Auth manages passwords, not us)
ALTER TABLE Patient ALTER COLUMN PasswordHash DROP NOT NULL;
ALTER TABLE Patient ALTER COLUMN PasswordHash SET DEFAULT 'MANAGED_BY_SUPABASE_AUTH';

-- Fix 2: Ensure RLS is enabled and policies allow anon reads
-- (Required so fetchProfileByEmail works BEFORE the session is fully set)

-- Drop and recreate policies to avoid conflicts
DO $$ 
BEGIN
  -- ADMINS
  DROP POLICY IF EXISTS "Allow read access" ON Admins;
  DROP POLICY IF EXISTS "Allow insert access" ON Admins;
  DROP POLICY IF EXISTS "Allow update access" ON Admins;
  DROP POLICY IF EXISTS "Allow delete access" ON Admins;
  
  -- DOCTOR
  DROP POLICY IF EXISTS "Allow read access" ON Doctor;
  DROP POLICY IF EXISTS "Allow insert access" ON Doctor;
  DROP POLICY IF EXISTS "Allow update access" ON Doctor;
  DROP POLICY IF EXISTS "Allow delete access" ON Doctor;
  
  -- NURSE
  DROP POLICY IF EXISTS "Allow read access" ON Nurse;
  DROP POLICY IF EXISTS "Allow insert access" ON Nurse;
  DROP POLICY IF EXISTS "Allow update access" ON Nurse;
  DROP POLICY IF EXISTS "Allow delete access" ON Nurse;
  
  -- RECEPTIONIST
  DROP POLICY IF EXISTS "Allow read access" ON Receptionist;
  DROP POLICY IF EXISTS "Allow insert access" ON Receptionist;
  DROP POLICY IF EXISTS "Allow update access" ON Receptionist;
  DROP POLICY IF EXISTS "Allow delete access" ON Receptionist;
  
  -- WARDBOY
  DROP POLICY IF EXISTS "Allow read access" ON WardBoy;
  DROP POLICY IF EXISTS "Allow insert access" ON WardBoy;
  DROP POLICY IF EXISTS "Allow update access" ON WardBoy;
  DROP POLICY IF EXISTS "Allow delete access" ON WardBoy;
  
  -- PATIENT
  DROP POLICY IF EXISTS "Allow read access" ON Patient;
  DROP POLICY IF EXISTS "Allow insert access" ON Patient;
  DROP POLICY IF EXISTS "Allow update access" ON Patient;
  DROP POLICY IF EXISTS "Allow delete access" ON Patient;
  
  -- DEPARTMENTS
  DROP POLICY IF EXISTS "Allow read access" ON Departments;
  DROP POLICY IF EXISTS "Allow insert access" ON Departments;
  
  -- APPOINTMENT
  DROP POLICY IF EXISTS "Allow read access" ON Appointment;
  DROP POLICY IF EXISTS "Allow insert access" ON Appointment;
  DROP POLICY IF EXISTS "Allow update access" ON Appointment;
  DROP POLICY IF EXISTS "Allow delete access" ON Appointment;
  
  -- WARD
  DROP POLICY IF EXISTS "Allow read access" ON Ward;
  DROP POLICY IF EXISTS "Allow insert access" ON Ward;
END $$;

-- ADMINS
ALTER TABLE Admins ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admins_select" ON Admins FOR SELECT USING (true);
CREATE POLICY "admins_insert" ON Admins FOR INSERT WITH CHECK (true);
CREATE POLICY "admins_update" ON Admins FOR UPDATE USING (true);
CREATE POLICY "admins_delete" ON Admins FOR DELETE USING (true);

-- DOCTOR
ALTER TABLE Doctor ENABLE ROW LEVEL SECURITY;
CREATE POLICY "doctor_select" ON Doctor FOR SELECT USING (true);
CREATE POLICY "doctor_insert" ON Doctor FOR INSERT WITH CHECK (true);
CREATE POLICY "doctor_update" ON Doctor FOR UPDATE USING (true);
CREATE POLICY "doctor_delete" ON Doctor FOR DELETE USING (true);

-- NURSE
ALTER TABLE Nurse ENABLE ROW LEVEL SECURITY;
CREATE POLICY "nurse_select" ON Nurse FOR SELECT USING (true);
CREATE POLICY "nurse_insert" ON Nurse FOR INSERT WITH CHECK (true);
CREATE POLICY "nurse_update" ON Nurse FOR UPDATE USING (true);
CREATE POLICY "nurse_delete" ON Nurse FOR DELETE USING (true);

-- RECEPTIONIST
ALTER TABLE Receptionist ENABLE ROW LEVEL SECURITY;
CREATE POLICY "receptionist_select" ON Receptionist FOR SELECT USING (true);
CREATE POLICY "receptionist_insert" ON Receptionist FOR INSERT WITH CHECK (true);
CREATE POLICY "receptionist_update" ON Receptionist FOR UPDATE USING (true);
CREATE POLICY "receptionist_delete" ON Receptionist FOR DELETE USING (true);

-- WARDBOY
ALTER TABLE WardBoy ENABLE ROW LEVEL SECURITY;
CREATE POLICY "wardboy_select" ON WardBoy FOR SELECT USING (true);
CREATE POLICY "wardboy_insert" ON WardBoy FOR INSERT WITH CHECK (true);
CREATE POLICY "wardboy_update" ON WardBoy FOR UPDATE USING (true);
CREATE POLICY "wardboy_delete" ON WardBoy FOR DELETE USING (true);

-- PATIENT
ALTER TABLE Patient ENABLE ROW LEVEL SECURITY;
CREATE POLICY "patient_select" ON Patient FOR SELECT USING (true);
CREATE POLICY "patient_insert" ON Patient FOR INSERT WITH CHECK (true);
CREATE POLICY "patient_update" ON Patient FOR UPDATE USING (true);
CREATE POLICY "patient_delete" ON Patient FOR DELETE USING (true);

-- DEPARTMENTS
ALTER TABLE Departments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "departments_select" ON Departments FOR SELECT USING (true);
CREATE POLICY "departments_insert" ON Departments FOR INSERT WITH CHECK (true);

-- APPOINTMENT
ALTER TABLE Appointment ENABLE ROW LEVEL SECURITY;
CREATE POLICY "appointment_select" ON Appointment FOR SELECT USING (true);
CREATE POLICY "appointment_insert" ON Appointment FOR INSERT WITH CHECK (true);
CREATE POLICY "appointment_update" ON Appointment FOR UPDATE USING (true);
CREATE POLICY "appointment_delete" ON Appointment FOR DELETE USING (true);

-- WARD
ALTER TABLE Ward ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ward_select" ON Ward FOR SELECT USING (true);
CREATE POLICY "ward_insert" ON Ward FOR INSERT WITH CHECK (true);

-- ==========================================
-- Fix 3: Ensure Admin user record exists
-- Replace with your actual admin email
-- ==========================================
INSERT INTO Admins (Username, PasswordHash, Role) 
VALUES ('brisco.official@gmail.com', 'MANAGED_BY_SUPABASE_AUTH', 'admin')
ON CONFLICT (Username) DO UPDATE SET Role = 'admin', PasswordHash = 'MANAGED_BY_SUPABASE_AUTH';
