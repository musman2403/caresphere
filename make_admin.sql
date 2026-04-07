-- ==========================================
-- STEP 1: MAKE brisco.official@gmail.com ADMIN
-- ==========================================
INSERT INTO Admins (Username, PasswordHash, Role) 
VALUES ('brisco.official@gmail.com', 'MANAGED_BY_SUPABASE_AUTH', 'admin')
ON CONFLICT (Username) DO UPDATE SET Role = 'admin';

-- ==========================================
-- STEP 2: ENSURE OTHER STAFF ROLES WORK
-- (These will link automatically when they log in)
-- ==========================================

-- Example: If you have a doctor in the Auth dashboard with email 'doctor@example.com'
-- and they exist in the 'Doctor' table, they will automatically be recognized.

SELECT * FROM Admins WHERE Username = 'brisco.official@gmail.com';
