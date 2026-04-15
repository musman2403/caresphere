-- ==========================================
-- CareSphere Hospital Management SQL Schema
-- (Clean Version - No Dummy Data)
-- ==========================================

-- DROP EXISTING TABLES TO CLEANLY RECREATE THEM
DROP TABLE IF EXISTS Admins CASCADE;
DROP TABLE IF EXISTS Ward CASCADE;
DROP TABLE IF EXISTS Appointment CASCADE;
DROP TABLE IF EXISTS Patient CASCADE;
DROP TABLE IF EXISTS WardBoy CASCADE;
DROP TABLE IF EXISTS Nurse CASCADE;
DROP TABLE IF EXISTS Doctor CASCADE;
DROP TABLE IF EXISTS Receptionist CASCADE;
DROP TABLE IF EXISTS Departments CASCADE;

-- 1. Departments Table
CREATE TABLE Departments (
    Depid SERIAL PRIMARY KEY,
    DepartmentName VARCHAR(100) NOT NULL UNIQUE
);

-- SEED DEPARTMENTS
INSERT INTO Departments (DepartmentName) VALUES 
('Emergency'), ('Surgical'), ('Pediatrics'), ('Orthopedics'), ('Radiology');

-- 2. Receptionist Table
CREATE TABLE Receptionist (
    Repid SERIAL PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Depid INT REFERENCES Departments(Depid),
    Gender VARCHAR(20),
    Email VARCHAR(100) UNIQUE NOT NULL,
    PasswordHash VARCHAR(255) DEFAULT 'password123',
    PhoneNo VARCHAR(20),
    Address TEXT,
    Shift VARCHAR(50),
    Status VARCHAR(50) DEFAULT 'Active'
);

-- 3. Doctor Table
CREATE TABLE Doctor (
    Docid SERIAL PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Depid INT REFERENCES Departments(Depid),
    Gender VARCHAR(20),
    DOB DATE,
    PhoneNo VARCHAR(20),
    Email VARCHAR(100) UNIQUE NOT NULL,
    PasswordHash VARCHAR(255) DEFAULT 'password123',
    Address TEXT,
    Qualification VARCHAR(200),
    Specialization VARCHAR(200),
    Experience INT,
    Salary DECIMAL(10,2),
    Status VARCHAR(50) DEFAULT 'Active'
);

-- 4. Nurse Table
CREATE TABLE Nurse (
    Nurseid SERIAL PRIMARY KEY,
    NurseName VARCHAR(100) NOT NULL,
    Depid INT REFERENCES Departments(Depid),
    Gender VARCHAR(20),
    PhoneNo VARCHAR(20),
    Email VARCHAR(100) UNIQUE NOT NULL,
    PasswordHash VARCHAR(255) DEFAULT 'password123',
    Address TEXT,
    Salary DECIMAL(10,2),
    Shift VARCHAR(50),
    Status VARCHAR(50) DEFAULT 'Active'
);

-- 5. WardBoy Table
CREATE TABLE WardBoy (
    WardBid SERIAL PRIMARY KEY,
    WardBName VARCHAR(100) NOT NULL,
    Depid INT REFERENCES Departments(Depid),
    Gender VARCHAR(20),
    Email VARCHAR(100) UNIQUE NOT NULL,
    PasswordHash VARCHAR(255) DEFAULT 'password123',
    Address TEXT,
    PhoneNo VARCHAR(20),
    Salary DECIMAL(10,2),
    Shift VARCHAR(50),
    Status VARCHAR(50) DEFAULT 'Active'
);

-- 6. Patient Table
CREATE TABLE Patient (
    Pid SERIAL PRIMARY KEY,
    PName VARCHAR(100) NOT NULL,
    Gender VARCHAR(20),
    DOB DATE,
    PhoneNo VARCHAR(20),
    Email VARCHAR(100) UNIQUE NOT NULL,
    PasswordHash VARCHAR(255) NOT NULL,
    Address TEXT,
    BloodGroup VARCHAR(5),
    EmergencyPhoneNo VARCHAR(20),
    RegistrationDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Disease VARCHAR(200),
    Status VARCHAR(50) DEFAULT 'Active'
);

-- 7. Appointment Table
CREATE TABLE Appointment (
    Apid SERIAL PRIMARY KEY,
    AppointmentDate TIMESTAMP NOT NULL,
    TimeSlot VARCHAR(50),
    Pid INT REFERENCES Patient(Pid),
    Docid INT REFERENCES Doctor(Docid),
    Depid INT REFERENCES Departments(Depid),
    Disease VARCHAR(200),
    Note TEXT,
    Status VARCHAR(50) DEFAULT 'Pending'
);

-- 8. Ward Table
CREATE TABLE Ward (
    Wardid SERIAL PRIMARY KEY,
    WardNo VARCHAR(20) NOT NULL UNIQUE,
    TotalBeds INT NOT NULL DEFAULT 20,
    AvailableBeds INT NOT NULL DEFAULT 20,
    Depid INT REFERENCES Departments(Depid),
    Status VARCHAR(50) DEFAULT 'Active'
);

-- SEED WARDS
INSERT INTO Ward (WardNo, TotalBeds, AvailableBeds, Depid) VALUES 
('E-101', 20, 15, 1), 
('S-201', 20, 8, 2), 
('P-301', 20, 12, 3), 
('O-401', 20, 5, 4), 
('R-501', 20, 20, 5);

-- 9. Admins Table
CREATE TABLE Admins (
    Adminid SERIAL PRIMARY KEY,
    Username VARCHAR(100) UNIQUE NOT NULL,
    PasswordHash VARCHAR(255) NOT NULL,
    Role VARCHAR(50) DEFAULT 'admin'
);
