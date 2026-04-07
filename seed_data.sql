-- CareSphere Data Seed

INSERT INTO Admins (Username, PasswordHash, Role) VALUES ('brisco.official@gmail.com', 'Usman.brisco123', 'admin');
INSERT INTO Patient (PName, Gender, Email, PasswordHash, PhoneNo, Address) VALUES ('Ali Patient', 'Male', 'patient@caresphere.pk', 'password', '03001234567', 'DHA Phase 5, Lahore');
INSERT INTO Receptionist (Name, Depid, Gender, Email, PasswordHash, PhoneNo) VALUES 
('Sana Receptionist', 1, 'Female', 'recep1@caresphere.pk', 'password', '03219876543'),
('Bilal Receptionist', 2, 'Male', 'recep2@caresphere.pk', 'password', '03219876544');

-- Emergency Doctors
INSERT INTO Doctor (Name, Depid, Gender, Email, PasswordHash, Specialization, Experience) VALUES 
('Dr. Tariq Mahmood', 1, 'Male', 'doc.tariq.mahmood@caresphere.pk', 'password', 'Emergency Specialist', 5),
('Dr. Ayesha Khan', 1, 'Female', 'doc.ayesha.khan@caresphere.pk', 'password', 'Emergency Specialist', 6),
('Dr. Usman Raza', 1, 'Male', 'doc.usman.raza@caresphere.pk', 'password', 'Emergency Specialist', 7),
('Dr. Fatima Ali', 1, 'Female', 'doc.fatima.ali@caresphere.pk', 'password', 'Emergency Specialist', 8),
('Dr. Bilal Ahmed', 1, 'Male', 'doc.bilal.ahmed@caresphere.pk', 'password', 'Emergency Specialist', 9);

-- Emergency Nurses
INSERT INTO Nurse (NurseName, Depid, Gender, Email, PasswordHash, Shift) VALUES 
('Asma Tariq', 1, 'Female', 'nurse.asma.tariq@caresphere.pk', 'password', 'Morning'),
('Zainab Ali', 1, 'Female', 'nurse.zainab.ali@caresphere.pk', 'password', 'Night'),
('Sadia Imran', 1, 'Female', 'nurse.sadia.imran@caresphere.pk', 'password', 'Morning'),
('Maria Qasim', 1, 'Female', 'nurse.maria.qasim@caresphere.pk', 'password', 'Night'),
('Kiran Shah', 1, 'Female', 'nurse.kiran.shah@caresphere.pk', 'password', 'Morning');

-- Emergency Wardboys
INSERT INTO WardBoy (WardBName, Depid, Gender, Email, PasswordHash, Shift) VALUES 
('Ahmed Ali', 1, 'Male', 'wardboy.ahmed.ali@caresphere.pk', 'password', 'Rotational'),
('Ali Raza', 1, 'Male', 'wardboy.ali.raza@caresphere.pk', 'password', 'Rotational');

-- Surgical Doctors
INSERT INTO Doctor (Name, Depid, Gender, Email, PasswordHash, Specialization, Experience) VALUES 
('Dr. Sana Iqbal', 2, 'Male', 'doc.sana.iqbal@caresphere.pk', 'password', 'Surgical Specialist', 5),
('Dr. Imran Shah', 2, 'Female', 'doc.imran.shah@caresphere.pk', 'password', 'Surgical Specialist', 6),
('Dr. Hira Qadri', 2, 'Male', 'doc.hira.qadri@caresphere.pk', 'password', 'Surgical Specialist', 7),
('Dr. Kamran Saleem', 2, 'Female', 'doc.kamran.saleem@caresphere.pk', 'password', 'Surgical Specialist', 8),
('Dr. Nadia Jamil', 2, 'Male', 'doc.nadia.jamil@caresphere.pk', 'password', 'Surgical Specialist', 9);

-- Surgical Nurses
INSERT INTO Nurse (NurseName, Depid, Gender, Email, PasswordHash, Shift) VALUES 
('Noreen Waqar', 2, 'Female', 'nurse.noreen.waqar@caresphere.pk', 'password', 'Morning'),
('Samina Gul', 2, 'Female', 'nurse.samina.gul@caresphere.pk', 'password', 'Night'),
('Lubna Javed', 2, 'Female', 'nurse.lubna.javed@caresphere.pk', 'password', 'Morning'),
('Bushra Ansari', 2, 'Female', 'nurse.bushra.ansari@caresphere.pk', 'password', 'Night'),
('Tayyaba Noor', 2, 'Female', 'nurse.tayyaba.noor@caresphere.pk', 'password', 'Morning');

-- Surgical Wardboys
INSERT INTO WardBoy (WardBName, Depid, Gender, Email, PasswordHash, Shift) VALUES 
('Hasan Zafar', 2, 'Male', 'wardboy.hasan.zafar@caresphere.pk', 'password', 'Rotational'),
('Umar Farooq', 2, 'Male', 'wardboy.umar.farooq@caresphere.pk', 'password', 'Rotational');

-- Pediatrics Doctors
INSERT INTO Doctor (Name, Depid, Gender, Email, PasswordHash, Specialization, Experience) VALUES 
('Dr. Raza Malik', 3, 'Male', 'doc.raza.malik@caresphere.pk', 'password', 'Pediatrics Specialist', 5),
('Dr. Farah Sheikh', 3, 'Female', 'doc.farah.sheikh@caresphere.pk', 'password', 'Pediatrics Specialist', 6),
('Dr. Zahid Hussain', 3, 'Male', 'doc.zahid.hussain@caresphere.pk', 'password', 'Pediatrics Specialist', 7),
('Dr. Nida Tariq', 3, 'Female', 'doc.nida.tariq@caresphere.pk', 'password', 'Pediatrics Specialist', 8),
('Dr. Faisal Nawaz', 3, 'Male', 'doc.faisal.nawaz@caresphere.pk', 'password', 'Pediatrics Specialist', 9);

-- Pediatrics Nurses
INSERT INTO Nurse (NurseName, Depid, Gender, Email, PasswordHash, Shift) VALUES 
('Uzma Khalid', 3, 'Female', 'nurse.uzma.khalid@caresphere.pk', 'password', 'Morning'),
('Shazia Parveen', 3, 'Female', 'nurse.shazia.parveen@caresphere.pk', 'password', 'Night'),
('Rida Batool', 3, 'Female', 'nurse.rida.batool@caresphere.pk', 'password', 'Morning'),
('Nida Zafar', 3, 'Female', 'nurse.nida.zafar@caresphere.pk', 'password', 'Night'),
('Sonia Majeed', 3, 'Female', 'nurse.sonia.majeed@caresphere.pk', 'password', 'Morning');

-- Pediatrics Wardboys
INSERT INTO WardBoy (WardBName, Depid, Gender, Email, PasswordHash, Shift) VALUES 
('Zaid Hameed', 3, 'Male', 'wardboy.zaid.hameed@caresphere.pk', 'password', 'Rotational'),
('Hamza Abbasi', 3, 'Male', 'wardboy.hamza.abbasi@caresphere.pk', 'password', 'Rotational');

-- Orthopedics Doctors
INSERT INTO Doctor (Name, Depid, Gender, Email, PasswordHash, Specialization, Experience) VALUES 
('Dr. Hassan Saeed', 4, 'Male', 'doc.hassan.saeed@caresphere.pk', 'password', 'Orthopedics Specialist', 5),
('Dr. Amna Dar', 4, 'Female', 'doc.amna.dar@caresphere.pk', 'password', 'Orthopedics Specialist', 6),
('Dr. Salman Qureshi', 4, 'Male', 'doc.salman.qureshi@caresphere.pk', 'password', 'Orthopedics Specialist', 7),
('Dr. Rabia Aslam', 4, 'Female', 'doc.rabia.aslam@caresphere.pk', 'password', 'Orthopedics Specialist', 8),
('Dr. Shoaib Akhtar', 4, 'Male', 'doc.shoaib.akhtar@caresphere.pk', 'password', 'Orthopedics Specialist', 9);

-- Orthopedics Nurses
INSERT INTO Nurse (NurseName, Depid, Gender, Email, PasswordHash, Shift) VALUES 
('Aneela Qadir', 4, 'Female', 'nurse.aneela.qadir@caresphere.pk', 'password', 'Morning'),
('Mehwish Hayat', 4, 'Female', 'nurse.mehwish.hayat@caresphere.pk', 'password', 'Night'),
('Ayesha Omer', 4, 'Female', 'nurse.ayesha.omer@caresphere.pk', 'password', 'Morning'),
('Humaira Chohan', 4, 'Female', 'nurse.humaira.chohan@caresphere.pk', 'password', 'Night'),
('Saba Qamar', 4, 'Female', 'nurse.saba.qamar@caresphere.pk', 'password', 'Morning');

-- Orthopedics Wardboys
INSERT INTO WardBoy (WardBName, Depid, Gender, Email, PasswordHash, Shift) VALUES 
('Sheheryar Munawar', 4, 'Male', 'wardboy.sheheryar.munawar@caresphere.pk', 'password', 'Rotational'),
('Fahad Mustafa', 4, 'Male', 'wardboy.fahad.mustafa@caresphere.pk', 'password', 'Rotational');

-- Radiology Doctors
INSERT INTO Doctor (Name, Depid, Gender, Email, PasswordHash, Specialization, Experience) VALUES 
('Dr. Khadija Rehman', 5, 'Male', 'doc.khadija.rehman@caresphere.pk', 'password', 'Radiology Specialist', 5),
('Dr. Waqas Munir', 5, 'Female', 'doc.waqas.munir@caresphere.pk', 'password', 'Radiology Specialist', 6),
('Dr. Marium Riaz', 5, 'Male', 'doc.marium.riaz@caresphere.pk', 'password', 'Radiology Specialist', 7),
('Dr. Junaid Safdar', 5, 'Female', 'doc.junaid.safdar@caresphere.pk', 'password', 'Radiology Specialist', 8),
('Dr. Sahar Zaman', 5, 'Male', 'doc.sahar.zaman@caresphere.pk', 'password', 'Radiology Specialist', 9);

-- Radiology Nurses
INSERT INTO Nurse (NurseName, Depid, Gender, Email, PasswordHash, Shift) VALUES 
('Madiha Iftikhar', 5, 'Female', 'nurse.madiha.iftikhar@caresphere.pk', 'password', 'Morning'),
('Anum Fayyaz', 5, 'Female', 'nurse.anum.fayyaz@caresphere.pk', 'password', 'Night'),
('Sanam Jung', 5, 'Female', 'nurse.sanam.jung@caresphere.pk', 'password', 'Morning'),
('Maya Ali', 5, 'Female', 'nurse.maya.ali@caresphere.pk', 'password', 'Night'),
('Mahira Khan', 5, 'Female', 'nurse.mahira.khan@caresphere.pk', 'password', 'Morning');

-- Radiology Wardboys
INSERT INTO WardBoy (WardBName, Depid, Gender, Email, PasswordHash, Shift) VALUES 
('Danish Taimoor', 5, 'Male', 'wardboy.danish.taimoor@caresphere.pk', 'password', 'Rotational'),
('Imran Abbas', 5, 'Male', 'wardboy.imran.abbas@caresphere.pk', 'password', 'Rotational');
