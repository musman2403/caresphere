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

export const WARD_DATA = [
  { id: 1, department: 'Cardiology', totalBeds: 10, availableBeds: 4 },
  { id: 2, department: 'Neurology', totalBeds: 8, availableBeds: 2 },
  { id: 3, department: 'Pediatrics', totalBeds: 15, availableBeds: 7 },
  { id: 4, department: 'Orthopedics', totalBeds: 12, availableBeds: 5 },
  { id: 5, department: 'General', totalBeds: 20, availableBeds: 12 }
];
