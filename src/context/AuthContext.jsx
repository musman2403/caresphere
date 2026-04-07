import React, { createContext, useState, useContext, useEffect } from 'react';
import { ROLES } from '../dummyData';
import { supabase } from '../supabaseClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [applications, setApplications] = useState([]); // Kept for logic, but will use Supabase later if needed
  const [wards, setWards] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      
      // 1. Fetch Users from all tables
      const [
        { data: admins },
        { data: doctors },
        { data: nurses },
        { data: receptionists },
        { data: wardboys },
        { data: patients },
        { data: depts }
      ] = await Promise.all([
        supabase.from('Admins').select('*'),
        supabase.from('Doctor').select('*'),
        supabase.from('Nurse').select('*'),
        supabase.from('Receptionist').select('*'),
        supabase.from('WardBoy').select('*'),
        supabase.from('Patient').select('*'),
        supabase.from('Departments').select('*')
      ]);

      const deptMap = depts.reduce((acc, d) => ({ ...acc, [d.Depid]: d.DepartmentName }), {});

      const consolidatedUsers = [
        ...(admins || []).map(u => ({ ...u, id: u.Adminid, name: u.Username.split('@')[0], email: u.Username, role: ROLES.ADMIN })),
        ...(doctors || []).map(u => ({ ...u, id: u.Docid, name: u.Name, email: u.Email, role: ROLES.DOCTOR, department: deptMap[u.Depid] })),
        ...(nurses || []).map(u => ({ ...u, id: u.Nurseid, name: u.NurseName, email: u.Email, role: ROLES.NURSE, department: deptMap[u.Depid] })),
        ...(receptionists || []).map(u => ({ ...u, id: u.Repid, name: u.Name, email: u.Email, role: ROLES.RECEPTIONIST, department: deptMap[u.Depid] })),
        ...(wardboys || []).map(u => ({ ...u, id: u.WardBid, name: u.WardBName, email: u.Email, role: ROLES.WARDBOY, department: deptMap[u.Depid] })),
        ...(patients || []).map(u => ({ ...u, id: u.Pid, name: u.PName, email: u.Email, role: ROLES.PATIENT }))
      ];

      setUsers(consolidatedUsers);

      // 2. Fetch Appointments
      const { data: appts } = await supabase.from('Appointment').select(`
        *,
        Patient(PName),
        Doctor(Name),
        Departments(DepartmentName)
      `);
      
      setAppointments((appts || []).map(a => ({
        id: a.Apid,
        patientName: a.Patient?.PName,
        doctorName: a.Doctor?.Name,
        department: a.Departments?.DepartmentName,
        date: a.AppointmentDate,
        status: a.Status,
        patientId: a.Pid
      })));

      // 3. Fetch Wards
      const { data: wardData } = await supabase.from('Ward').select('*, Departments(DepartmentName)');
      setWards((wardData || []).map(w => ({
        id: w.Wardid,
        department: w.Departments?.DepartmentName,
        totalBeds: w.TotalBeds,
        availableBeds: w.AvailableBeds
      })));

    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const savedUser = localStorage.getItem('caresphere_current_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    fetchAllData();
  }, []);

  const login = async (email, password) => {
    // In a real app we'd use Supabase Auth, but to preserve existing flow with SQL tables:
    const tables = ['Admins', 'Doctor', 'Nurse', 'Receptionist', 'WardBoy', 'Patient'];
    const emailFields = { Admins: 'Username', Doctor: 'Email', Nurse: 'Email', Receptionist: 'Email', WardBoy: 'Email', Patient: 'Email' };
    
    for (const table of tables) {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .eq(emailFields[table], email)
        .eq('PasswordHash', password)
        .single();
      
      if (data && !error) {
        let role = table.toLowerCase();
        if (role === 'doctor') role = ROLES.DOCTOR;
        if (role === 'admins') role = ROLES.ADMIN;
        
        const userToSave = { 
          id: data.Adminid || data.Docid || data.Pid || data.Nurseid || data.Repid || data.WardBid,
          name: data.Name || data.PName || data.NurseName || data.WardBName || data.Username,
          email: email,
          role: role,
          departmentId: data.Depid
        };
        setUser(userToSave);
        localStorage.setItem('caresphere_current_user', JSON.stringify(userToSave));
        return { success: true };
      }
    }
    return { success: false, message: 'Invalid credentials' };
  };

  const signup = async (userData) => {
    const { data, error } = await supabase.from('Patient').insert([{
      PName: userData.name,
      Email: userData.email,
      PasswordHash: userData.password,
      Gender: userData.gender,
      DOB: userData.dob,
      PhoneNo: userData.phone,
      Address: userData.address,
      BloodGroup: userData.bloodGroup,
      EmergencyPhoneNo: userData.emergencyPhone,
      Disease: userData.disease
    }]).select().single();

    if (error) return { success: false, message: error.message };

    const newUser = {
      id: data.Pid,
      name: data.PName,
      email: data.Email,
      role: ROLES.PATIENT
    };
    
    setUser(newUser);
    localStorage.setItem('caresphere_current_user', JSON.stringify(newUser));
    fetchAllData(); // Refresh list
    return { success: true };
  };

  const bookAppointment = async (apptData) => {
    // Map department name to ID
    const { data: dept } = await supabase.from('Departments').select('Depid').eq('DepartmentName', apptData.department).single();
    
    await supabase.from('Appointment').insert([{
      AppointmentDate: apptData.date,
      Pid: apptData.patientId,
      Docid: apptData.doctorId || null,
      Depid: dept?.Depid,
      Status: 'Pending'
    }]);
    
    fetchAllData();
  };

  const updateAppointmentStatus = async (appointmentId, newStatus) => {
    await supabase.from('Appointment').update({ Status: newStatus }).eq('Apid', appointmentId);
    fetchAllData();
  };

  const addUser = async (userData) => {
    let table = '';
    let payload = { PasswordHash: userData.password, Status: 'Active' };

    switch (userData.role) {
      case ROLES.DOCTOR: table = 'Doctor'; payload = { ...payload, Name: userData.name, Email: userData.username }; break;
      case ROLES.NURSE: table = 'Nurse'; payload = { ...payload, NurseName: userData.name, Email: userData.username }; break;
      case ROLES.RECEPTIONIST: table = 'Receptionist'; payload = { ...payload, Name: userData.name, Email: userData.username }; break;
      case ROLES.WARDBOY: table = 'WardBoy'; payload = { ...payload, WardBName: userData.name, Email: userData.username }; break;
      case ROLES.PATIENT: table = 'Patient'; payload = { ...payload, PName: userData.name, Email: userData.username }; break;
      case ROLES.ADMIN: table = 'Admins'; payload = { Username: userData.username, PasswordHash: userData.password, Role: ROLES.ADMIN }; break;
      default: return { success: false, message: 'Invalid role' };
    }

    const { error } = await supabase.from(table).insert([payload]);
    if (error) return { success: false, message: error.message };
    
    fetchAllData();
    return { success: true };
  };

  const removeUser = async (userToRemove) => {
    let table = '';
    let idColumn = '';

    switch (userToRemove.role) {
      case ROLES.DOCTOR: table = 'Doctor'; idColumn = 'Docid'; break;
      case ROLES.NURSE: table = 'Nurse'; idColumn = 'Nurseid'; break;
      case ROLES.RECEPTIONIST: table = 'Receptionist'; idColumn = 'Repid'; break;
      case ROLES.WARDBOY: table = 'WardBoy'; idColumn = 'WardBid'; break;
      case ROLES.PATIENT: table = 'Patient'; idColumn = 'Pid'; break;
      case ROLES.ADMIN: table = 'Admins'; idColumn = 'Adminid'; break;
      default: return;
    }

    await supabase.from(table).delete().eq(idColumn, userToRemove.id);
    fetchAllData();
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('caresphere_current_user');
  };

  return (
    <AuthContext.Provider value={{
      user, users, appointments, applications, wards,
      login, signup, logout, bookAppointment, updateAppointmentStatus, 
      addUser, removeUser,
      loading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

