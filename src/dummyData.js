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

// INITIAL_USERS and generation logic removed. 
// Data is now fetched from Supabase via AuthContext.
