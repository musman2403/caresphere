-- ==========================================
-- FIX: Allow authenticated users to read all tables
-- Run this in Supabase SQL Editor
-- ==========================================

-- ADMINS
ALTER TABLE Admins ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow read access" ON Admins FOR SELECT USING (true);
CREATE POLICY "Allow insert access" ON Admins FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update access" ON Admins FOR UPDATE USING (true);
CREATE POLICY "Allow delete access" ON Admins FOR DELETE USING (true);

-- DOCTOR
ALTER TABLE Doctor ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow read access" ON Doctor FOR SELECT USING (true);
CREATE POLICY "Allow insert access" ON Doctor FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update access" ON Doctor FOR UPDATE USING (true);
CREATE POLICY "Allow delete access" ON Doctor FOR DELETE USING (true);

-- NURSE
ALTER TABLE Nurse ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow read access" ON Nurse FOR SELECT USING (true);
CREATE POLICY "Allow insert access" ON Nurse FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update access" ON Nurse FOR UPDATE USING (true);
CREATE POLICY "Allow delete access" ON Nurse FOR DELETE USING (true);

-- RECEPTIONIST
ALTER TABLE Receptionist ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow read access" ON Receptionist FOR SELECT USING (true);
CREATE POLICY "Allow insert access" ON Receptionist FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update access" ON Receptionist FOR UPDATE USING (true);
CREATE POLICY "Allow delete access" ON Receptionist FOR DELETE USING (true);

-- WARDBOY
ALTER TABLE WardBoy ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow read access" ON WardBoy FOR SELECT USING (true);
CREATE POLICY "Allow insert access" ON WardBoy FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update access" ON WardBoy FOR UPDATE USING (true);
CREATE POLICY "Allow delete access" ON WardBoy FOR DELETE USING (true);

-- PATIENT
ALTER TABLE Patient ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow read access" ON Patient FOR SELECT USING (true);
CREATE POLICY "Allow insert access" ON Patient FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update access" ON Patient FOR UPDATE USING (true);
CREATE POLICY "Allow delete access" ON Patient FOR DELETE USING (true);

-- DEPARTMENTS
ALTER TABLE Departments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow read access" ON Departments FOR SELECT USING (true);
CREATE POLICY "Allow insert access" ON Departments FOR INSERT WITH CHECK (true);

-- APPOINTMENT
ALTER TABLE Appointment ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow read access" ON Appointment FOR SELECT USING (true);
CREATE POLICY "Allow insert access" ON Appointment FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update access" ON Appointment FOR UPDATE USING (true);
CREATE POLICY "Allow delete access" ON Appointment FOR DELETE USING (true);

-- WARD
ALTER TABLE Ward ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow read access" ON Ward FOR SELECT USING (true);
CREATE POLICY "Allow insert access" ON Ward FOR INSERT WITH CHECK (true);

-- ==========================================
-- ALSO: Make sure admin user exists
-- ==========================================
INSERT INTO Admins (Username, PasswordHash, Role) 
VALUES ('brisco.official@gmail.com', 'MANAGED_BY_SUPABASE_AUTH', 'admin')
ON CONFLICT (Username) DO UPDATE SET Role = 'admin';
