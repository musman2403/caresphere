-- ==========================================
-- CareSphere Hospital Management SQL Schema
-- ==========================================

-- 1. Departments Table
CREATE TABLE Departments (
    Depid SERIAL PRIMARY KEY,
    DepartmentName VARCHAR(100) NOT NULL
);

-- 2. Receptionist Table
CREATE TABLE Receptionist (
    Repid SERIAL PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Depid INT REFERENCES Departments(Depid),
    Gender VARCHAR(20),
    Email VARCHAR(100) UNIQUE,
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
    Email VARCHAR(100) UNIQUE,
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
    Email VARCHAR(100) UNIQUE,
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
    Email VARCHAR(100) UNIQUE,
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
    Email VARCHAR(100) UNIQUE,
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
    Status VARCHAR(50) DEFAULT 'Pending'
);

-- 8. Ward Table
CREATE TABLE Ward (
    Wardid SERIAL PRIMARY KEY,
    WardNo VARCHAR(20) NOT NULL UNIQUE,
    TotalBeds INT NOT NULL,
    AvailableBeds INT NOT NULL,
    Depid INT REFERENCES Departments(Depid),
    Status VARCHAR(50) DEFAULT 'Active'
);


-- 9. Admins Table
CREATE TABLE Admins (
    Adminid SERIAL PRIMARY KEY,
    Username VARCHAR(100) UNIQUE NOT NULL,
    PasswordHash VARCHAR(255) NOT NULL,
    Role VARCHAR(50) DEFAULT 'admin'
);


-- ==========================================
-- DUMMY DATA SEEDING (Pakistan Context)
-- ==========================================

-- Insert Default Admin
INSERT INTO Admins (Username, PasswordHash) VALUES
('brisco.official@gmail.com', 'Usman.brisco123');

-- Insert Departments
INSERT INTO Departments (DepartmentName) VALUES
('Emergency'),
('Surgical'),
('Pediatrics'),
('Orthopedics'),
('Radiology');

-- Insert Receptionists (2 Total)
INSERT INTO Receptionist (Name, Depid, Gender, Email, PhoneNo, Address, Shift) VALUES
('Sana Ali', 1, 'Female', 'sana.ali@caresphere.pk', '+92 300 1234567', 'Gulberg III, Lahore', 'Day'),
('Bilal Ahmed', 1, 'Male', 'bilal.ahmed@caresphere.pk', '+92 321 7654321', 'DHA Phase 5, Lahore', 'Night');

-- Insert Doctors (5 per department = 25 total)
INSERT INTO Doctor (Name, Depid, Gender, DOB, PhoneNo, Email, Address, Qualification, Specialization, Experience, Salary) VALUES
-- Emergency (Depid: 1)
('Dr. Tariq Mahmood', 1, 'Male', '1980-05-14', '+92 300 1111111', 'tariq.mahmood@caresphere.pk', 'Model Town, Lahore', 'MBBS, FCPS', 'Emergency Medicine', 12, 250000),
('Dr. Ayesha Khan', 1, 'Female', '1985-08-22', '+92 300 1111112', 'ayesha.khan@caresphere.pk', 'Cantt, Lahore', 'MBBS, MRCP', 'Trauma', 8, 220000),
('Dr. Usman Raza', 1, 'Male', '1978-11-03', '+92 300 1111113', 'usman.raza@caresphere.pk', 'DHA Phase 1, Lahore', 'MBBS', 'Critical Care', 15, 275000),
('Dr. Fatima Ali', 1, 'Female', '1990-01-25', '+92 300 1111114', 'fatima.ali@caresphere.pk', 'Wapda Town, Lahore', 'MBBS', 'Emergency', 5, 180000),
('Dr. Bilal Ahmed', 1, 'Male', '1982-09-09', '+92 300 1111115', 'bilal.ahmed.doc@caresphere.pk', 'Johar Town, Lahore', 'MBBS, MCPS', 'Trauma', 10, 210000),

-- Surgical (Depid: 2)
('Dr. Sana Iqbal', 2, 'Female', '1981-04-10', '+92 300 1111116', 'sana.iqbal@caresphere.pk', 'Gulberg, Lahore', 'MBBS, FCPS', 'General Surgery', 14, 280000),
('Dr. Imran Shah', 2, 'Male', '1975-12-30', '+92 300 1111117', 'imran.shah@caresphere.pk', 'DHA Phase 6, Lahore', 'MBBS, FRCS', 'Neurosurgeon', 20, 450000),
('Dr. Hira Qadri', 2, 'Female', '1988-06-18', '+92 300 1111118', 'hira.qadri@caresphere.pk', 'Model Town, Lahore', 'MBBS', 'Plastic Surgery', 7, 240000),
('Dr. Kamran Saleem', 2, 'Male', '1979-02-14', '+92 300 1111119', 'kamran.saleem@caresphere.pk', 'Bahria Town, Lahore', 'MBBS, FCPS', 'Cardiothoracic', 16, 320000),
('Dr. Nadia Jamil', 2, 'Female', '1983-07-07', '+92 300 1111120', 'nadia.jamil@caresphere.pk', 'Cantt, Lahore', 'MBBS', 'Vascular', 11, 260000),

-- Pediatrics (Depid: 3)
('Dr. Raza Malik', 3, 'Male', '1986-10-12', '+92 300 1111121', 'raza.malik@caresphere.pk', 'Johar Town, Lahore', 'MBBS, DCH', 'Pediatrics', 9, 200000),
('Dr. Farah Sheikh', 3, 'Female', '1984-03-24', '+92 300 1111122', 'farah.sheikh@caresphere.pk', 'Gulberg, Lahore', 'MBBS, FCPS', 'Neonatology', 10, 230000),
('Dr. Zahid Hussain', 3, 'Male', '1980-08-08', '+92 300 1111123', 'zahid.hussain@caresphere.pk', 'Samanabad, Lahore', 'MBBS', 'Pediatric Surgery', 13, 250000),
('Dr. Nida Tariq', 3, 'Female', '1991-05-19', '+92 300 1111124', 'nida.tariq@caresphere.pk', 'Iqbal Town, Lahore', 'MBBS', 'General Pediatrics', 4, 150000),
('Dr. Faisal Nawaz', 3, 'Male', '1977-11-11', '+92 300 1111125', 'faisal.nawaz@caresphere.pk', 'DHA, Lahore', 'MBBS, MRCPCH', 'Pediatric Oncology', 18, 290000),

-- Orthopedics (Depid: 4)
('Dr. Hassan Saeed', 4, 'Male', '1985-05-14', '+92 300 1111126', 'hassan.saeed.ortho@caresphere.pk', 'Model Town, Lahore', 'MBBS, FCPS', 'Spine', 10, 250000),
('Dr. Amna Dar', 4, 'Female', '1982-08-22', '+92 300 1111127', 'amna.dar.ortho@caresphere.pk', 'Cantt, Lahore', 'MBBS', 'Joints', 12, 220000),
('Dr. Salman Qureshi', 4, 'Male', '1975-11-03', '+92 300 1111128', 'salman.qureshi.ortho@caresphere.pk', 'DHA Phase 1, Lahore', 'MBBS, FRCS', 'Reconstruction', 18, 300000),
('Dr. Rabia Aslam', 4, 'Female', '1988-01-25', '+92 300 1111129', 'rabia.aslam.ortho@caresphere.pk', 'Wapda Town, Lahore', 'MBBS', 'Sports Medicine', 7, 180000),
('Dr. Shoaib Akhtar', 4, 'Male', '1980-09-09', '+92 300 1111130', 'shoaib.akhtar.ortho@caresphere.pk', 'Johar Town, Lahore', 'MBBS, MS', 'Orthopedics', 14, 210000),

-- Radiology (Depid: 5)
('Dr. Khadija Rehman', 5, 'Female', '1986-04-10', '+92 300 1111131', 'khadija.rehman.rad@caresphere.pk', 'Gulberg, Lahore', 'MBBS, DMRD', 'Radiology', 9, 210000),
('Dr. Waqas Munir', 5, 'Male', '1978-12-30', '+92 300 1111132', 'waqas.munir.rad@caresphere.pk', 'DHA Phase 6, Lahore', 'MBBS, FCPS', 'Interventional', 16, 290000),
('Dr. Marium Riaz', 5, 'Female', '1990-06-18', '+92 300 1111133', 'marium.riaz.rad@caresphere.pk', 'Model Town, Lahore', 'MBBS', 'Diagnostic', 5, 170000),
('Dr. Junaid Safdar', 5, 'Male', '1983-02-14', '+92 300 1111134', 'junaid.safdar.rad@caresphere.pk', 'Bahria Town, Lahore', 'MBBS, FCPS', 'MRI Specialist', 12, 240000),
('Dr. Sahar Zaman', 5, 'Female', '1981-07-07', '+92 300 1111135', 'sahar.zaman.rad@caresphere.pk', 'Cantt, Lahore', 'MBBS', 'Ultrasound', 13, 230000);

-- Insert Nurses (5 per department = 25 total)
INSERT INTO Nurse (NurseName, Depid, Gender, PhoneNo, Email, Address, Salary, Shift) VALUES
-- Emergency
('Nurse Asma Tariq', 1, 'Female', '+92 321 000001', 'asma.tariq@caresphere.pk', 'Lahore', 65000, 'Day'),
('Nurse Zainab Ali', 1, 'Female', '+92 321 000002', 'zainab.ali@caresphere.pk', 'Lahore', 65000, 'Night'),
('Nurse Sadia Imran', 1, 'Female', '+92 321 000003', 'sadia.imran@caresphere.pk', 'Lahore', 70000, 'Rotating'),
('Nurse Maria Qasim', 1, 'Female', '+92 321 000004', 'maria.qasim@caresphere.pk', 'Lahore', 60000, 'Day'),
('Nurse Kiran Shah', 1, 'Female', '+92 321 000005', 'kiran.shah@caresphere.pk', 'Lahore', 65000, 'Night'),
-- Surgical
('Nurse Noreen Waqar', 2, 'Female', '+92 321 000006', 'noreen.waqar@caresphere.pk', 'Lahore', 75000, 'Day'),
('Nurse Samina Gul', 2, 'Female', '+92 321 000007', 'samina.gul@caresphere.pk', 'Lahore', 75000, 'Night'),
('Nurse Lubna Javed', 2, 'Female', '+92 321 000008', 'lubna.javed.surg@caresphere.pk', 'Lahore', 70000, 'Rotating'),
('Nurse Bushra Ansari', 2, 'Female', '+92 321 000009', 'bushra.ansari.surg@caresphere.pk', 'Lahore', 65000, 'Day'),
('Nurse Tayyaba Noor', 2, 'Female', '+92 321 000010', 'tayyaba.noor.surg@caresphere.pk', 'Lahore', 65000, 'Night'),
-- Pediatrics
('Nurse Uzma Khalid', 3, 'Female', '+92 321 000011', 'uzma.khalid.ped@caresphere.pk', 'Lahore', 65000, 'Day'),
('Nurse Shazia Parveen', 3, 'Female', '+92 321 000012', 'shazia.parveen.ped@caresphere.pk', 'Lahore', 65000, 'Night'),
('Nurse Rida Batool', 3, 'Female', '+92 321 000013', 'rida.batool.ped@caresphere.pk', 'Lahore', 70000, 'Rotating'),
('Nurse Nida Zafar', 3, 'Female', '+92 321 000014', 'nida.zafar.ped@caresphere.pk', 'Lahore', 60000, 'Day'),
('Nurse Sonia Majeed', 3, 'Female', '+92 321 000015', 'sonia.majeed.ped@caresphere.pk', 'Lahore', 65000, 'Night'),
-- Orthopedics
('Nurse Aneela Qadir', 4, 'Female', '+92 321 000016', 'aneela.qadir.ortho@caresphere.pk', 'Lahore', 65000, 'Day'),
('Nurse Mehwish Hayat', 4, 'Female', '+92 321 000017', 'mehwish.hayat.ortho@caresphere.pk', 'Lahore', 65000, 'Night'),
('Nurse Ayesha Omer', 4, 'Female', '+92 321 000018', 'ayesha.omer.ortho@caresphere.pk', 'Lahore', 70000, 'Rotating'),
('Nurse Humaira Chohan', 4, 'Female', '+92 321 000019', 'humaira.chohan.ortho@caresphere.pk', 'Lahore', 60000, 'Day'),
('Nurse Saba Qamar', 4, 'Female', '+92 321 000020', 'saba.qamar.ortho@caresphere.pk', 'Lahore', 65000, 'Night'),
-- Radiology
('Nurse Madiha Iftikhar', 5, 'Female', '+92 321 000021', 'madiha.iftikhar.rad@caresphere.pk', 'Lahore', 75000, 'Day'),
('Nurse Anum Fayyaz', 5, 'Female', '+92 321 000022', 'anum.fayyaz.rad@caresphere.pk', 'Lahore', 75000, 'Night'),
('Nurse Sanam Jung', 5, 'Female', '+92 321 000023', 'sanam.jung.rad@caresphere.pk', 'Lahore', 70000, 'Rotating'),
('Nurse Maya Ali', 5, 'Female', '+92 321 000024', 'maya.ali.rad@caresphere.pk', 'Lahore', 65000, 'Day'),
('Nurse Mahira Khan', 5, 'Female', '+92 321 000025', 'mahira.khan.rad@caresphere.pk', 'Lahore', 65000, 'Night');

-- Insert WardBoys (2 per department = 10 total)
INSERT INTO WardBoy (WardBName, Depid, Gender, Email, Address, PhoneNo, Salary, Shift) VALUES
('Wardboy Ahmed Ali', 1, 'Male', 'ahmed1@caresphere.pk', 'Lahore', '+92 333 100001', 35000, 'Day'),
('Wardboy Ali Raza', 1, 'Male', 'ali1@caresphere.pk', 'Lahore', '+92 333 100002', 35000, 'Night'),
('Wardboy Hasan Zafar', 2, 'Male', 'hasan2@caresphere.pk', 'Lahore', '+92 333 100003', 35000, 'Day'),
('Wardboy Umar Farooq', 2, 'Male', 'umar2@caresphere.pk', 'Lahore', '+92 333 100004', 35000, 'Night'),
('Wardboy Zaid Hameed', 3, 'Male', 'zaid3@caresphere.pk', 'Lahore', '+92 333 100005', 35000, 'Day'),
('Wardboy Hamza Abbasi', 3, 'Male', 'hamza.abbasi@caresphere.pk', 'Lahore', '+92 333 100006', 35000, 'Night'),
('Wardboy Sheheryar Munawar', 4, 'Male', 'sheheryar.munawar@caresphere.pk', 'Lahore', '+92 333 100007', 35000, 'Day'),
('Wardboy Fahad Mustafa', 4, 'Male', 'fahad.mustafa@caresphere.pk', 'Lahore', '+92 333 100008', 35000, 'Night'),
('Wardboy Danish Taimoor', 5, 'Male', 'danish.taimoor@caresphere.pk', 'Lahore', '+92 333 100009', 35000, 'Day'),
('Wardboy Imran Abbas', 5, 'Male', 'imran.abbas@caresphere.pk', 'Lahore', '+92 333 100010', 35000, 'Night');

-- Insert Patient
INSERT INTO Patient (PName, Gender, DOB, PhoneNo, Email, Address, BloodGroup, EmergencyPhoneNo, Disease) VALUES
('Ali Patient User', 'Male', '1995-03-22', '+92 300 9999999', 'ali.raza@example.pk', 'Garden Town, Lahore', 'O+', '+92 300 8888888', 'Asthma Checkup');

-- Insert Wards
INSERT INTO Ward (WardNo, TotalBeds, AvailableBeds, Depid) VALUES
('W-EMER-01', 20, 15, 1),
('W-SURG-01', 25, 10, 2),
('W-PEDI-01', 15, 5, 3),
('W-ORTH-01', 20, 8, 4),
('W-RADI-01', 10, 2, 5);
