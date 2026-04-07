export const ROLES = {
  ADMIN: 'admin',
  DOCTOR: 'doctor',
  RECEPTIONIST: 'receptionist',
  NURSE: 'nurse',
  PATIENT: 'patient',
  WARDBOY: 'wardboy'
};

export const DEPARTMENTS = [
  'Emergency', 'Surgical', 'Pediatrics', 'Orthopedics', 'Radiology'
];

let userIdCounter = 1;

const PAK_NAMEDOC = ['Tariq Mahmood', 'Ayesha Khan', 'Usman Raza', 'Fatima Ali', 'Bilal Ahmed', 'Sana Iqbal', 'Imran Shah', 'Hira Qadri', 'Kamran Saleem', 'Nadia Jamil', 'Raza Malik', 'Farah Sheikh', 'Zahid Hussain', 'Nida Tariq', 'Faisal Nawaz', 'Hassan Saeed', 'Amna Dar', 'Salman Qureshi', 'Rabia Aslam', 'Shoaib Akhtar', 'Khadija Rehman', 'Waqas Munir', 'Marium Riaz', 'Junaid Safdar', 'Sahar Zaman'];
const PAK_NAMENURSE = ['Asma Tariq', 'Zainab Ali', 'Sadia Imran', 'Maria Qasim', 'Kiran Shah', 'Noreen Waqar', 'Samina Gul', 'Lubna Javed', 'Bushra Ansari', 'Tayyaba Noor', 'Uzma Khalid', 'Shazia Parveen', 'Rida Batool', 'Nida Zafar', 'Sonia Majeed', 'Aneela Qadir', 'Mehwish Hayat', 'Ayesha Omer', 'Humaira Chohan', 'Saba Qamar', 'Madiha Iftikhar', 'Anum Fayyaz', 'Sanam Jung', 'Maya Ali', 'Mahira Khan'];
const PAK_NAMEWARD = ['Ahmed Ali', 'Ali Raza', 'Hasan Zafar', 'Umar Farooq', 'Zaid Hameed', 'Hamza Abbasi', 'Sheheryar Munawar', 'Fahad Mustafa', 'Danish Taimoor', 'Imran Abbas'];

const generateUsers = () => {
    const users = [];
    users.push({ id: userIdCounter++, name: 'Usman Admin', username: 'brisco.official@gmail.com', password: 'Usman.brisco123', role: ROLES.ADMIN });
    users.push({ id: userIdCounter++, name: 'Ali Patient', username: 'patient', password: 'password', role: ROLES.PATIENT });
    users.push({ id: userIdCounter++, name: 'Recep Sana', username: 'recep1', password: 'password', role: ROLES.RECEPTIONIST });
    users.push({ id: userIdCounter++, name: 'Recep Bilal', username: 'recep2', password: 'password', role: ROLES.RECEPTIONIST });

    DEPARTMENTS.forEach((dept, index) => {
        for(let i=0; i<5; i++) users.push({ id: userIdCounter++, name: `Dr. ${PAK_NAMEDOC[(index*5 + i)%PAK_NAMEDOC.length]}`, username: `doc_${dept.toLowerCase()}_${i}`, password: 'password', role: ROLES.DOCTOR, department: dept });
        for(let i=0; i<5; i++) users.push({ id: userIdCounter++, name: `Nurse ${PAK_NAMENURSE[(index*5 + i)%PAK_NAMENURSE.length]}`, username: `nurse_${dept.toLowerCase()}_${i}`, password: 'password', role: ROLES.NURSE, department: dept });
        for(let i=0; i<2; i++) users.push({ id: userIdCounter++, name: `Wardboy ${PAK_NAMEWARD[(index*2 + i)%PAK_NAMEWARD.length]}`, username: `wardboy_${dept.toLowerCase()}_${i}`, password: 'password', role: ROLES.WARDBOY, department: dept });
    });
    return users;
};

export const INITIAL_USERS = generateUsers();

export const WARD_DATA = DEPARTMENTS.map((dept, index) => ({
    id: index + 1,
    department: dept,
    totalBeds: 20,
    availableBeds: Math.floor(Math.random() * 20)
}));
