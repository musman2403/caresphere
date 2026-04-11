import React, { createContext, useState, useContext, useEffect } from 'react';
import { ROLES } from '../dummyData';
import { supabase } from '../supabaseClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [applications, setApplications] = useState([]); 
  const [wards, setWards] = useState([]);
  const [loading, setLoading] = useState(true);

  // Helper to find profile and role from SQL tables based on email
  const fetchProfileByEmail = async (email) => {
    const tables = ['Admins', 'Doctor', 'Nurse', 'Receptionist', 'WardBoy', 'Patient'];
    const emailFields = { Admins: 'Username', Doctor: 'Email', Nurse: 'Email', Receptionist: 'Email', WardBoy: 'Email', Patient: 'Email' };
    
    for (const table of tables) {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .eq(emailFields[table], email)
        .single();
      
      console.log(`[Auth Debug] Table: ${table}, Data:`, data, 'Error:', error);
      
      if (data && !error) {
        let role = table.toLowerCase();
        if (role === 'doctor') role = ROLES.DOCTOR;
        if (role === 'admins') role = ROLES.ADMIN;
        
        return { 
          id: data.Adminid || data.Docid || data.Pid || data.Nurseid || data.Repid || data.WardBid,
          name: data.Name || data.PName || data.NurseName || data.WardBName || data.Username || data.Username?.split('@')[0],
          email: email,
          role: role,
          profile: data
        };
      }
    }
    return null;
  };

  const fetchAllData = async () => {
    try {
      // 1. Fetch Users from all tables for admin views
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

      const deptMap = (depts || []).reduce((acc, d) => ({ ...acc, [d.Depid]: d.DepartmentName }), {});

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
    }
  };

  useEffect(() => {
    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchProfileByEmail(session.user.email).then(profile => {
          if (profile) setUser(profile);
          else setUser({ email: session.user.email, role: 'unauthorized', name: 'New User' });
        });
      }
      setLoading(false);
    });

    // Listen for Auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const profile = await fetchProfileByEmail(session.user.email);
        if (profile) setUser(profile);
        else setUser({ email: session.user.email, role: 'unauthorized', name: 'New User' });
      } else {
        setUser(null);
      }
      fetchAllData();
    });

    fetchAllData();
    return () => subscription.unsubscribe();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setLoading(false);
        return { success: false, message: error.message };
      }
      
      // Wait for the onAuthStateChange listener to set the user profile
      // or fetch it here directly to be sure
      const profile = await fetchProfileByEmail(email);
      if (profile) {
        setUser(profile);
      } else {
        setUser({ email, role: 'unauthorized', name: 'New User' });
      }
      
      return { success: true };
    } catch (err) {
      return { success: false, message: 'An unexpected error occurred' };
    } finally {
      setLoading(false);
    }
  };

  const signup = async (userData) => {
    // 1. Supabase Auth Signup
    const { data: authData, error: authError } = await supabase.auth.signUp({ 
      email: userData.email, 
      password: userData.password 
    });

    if (authError) return { success: false, message: authError.message };

    // 2. Create Patient Profile
    const { error: profileError } = await supabase.from('Patient').insert([{
      PName: userData.name,
      Email: userData.email,
      Gender: userData.gender,
      DOB: userData.dob,
      PhoneNo: userData.phone,
      Address: userData.address,
      BloodGroup: userData.bloodGroup,
      EmergencyPhoneNo: userData.emergencyPhone,
      Disease: userData.disease
    }]);

    if (profileError) {
        // We might want to warn the user but the account is created.
        return { success: true, message: 'Account created, but profile failed' };
    }

    return { success: true };
  };

  /* The rest of the methods remain same but use fetchAllData to stay in sync */
  const bookAppointment = async (apptData) => {
    const { data: dept } = await supabase.from('Departments').select('Depid').eq('DepartmentName', apptData.department).single();
    await supabase.from('Appointment').insert([{ AppointmentDate: apptData.date, Pid: apptData.patientId, Docid: apptData.doctorId || null, Depid: dept?.Depid }]);
    fetchAllData();
  };

  const updateAppointmentStatus = async (appointmentId, newStatus) => {
    await supabase.from('Appointment').update({ Status: newStatus }).eq('Apid', appointmentId);
    fetchAllData();
  };

  const addUser = async (userData) => {
    let table = '';
    let payload = { Status: 'Active' };
    switch (userData.role) {
      case ROLES.DOCTOR: table = 'Doctor'; payload = { ...payload, Name: userData.name, Email: userData.username }; break;
      case ROLES.NURSE: table = 'Nurse'; payload = { ...payload, NurseName: userData.name, Email: userData.username }; break;
      case ROLES.RECEPTIONIST: table = 'Receptionist'; payload = { ...payload, Name: userData.name, Email: userData.username }; break;
      case ROLES.WARDBOY: table = 'WardBoy'; payload = { ...payload, WardBName: userData.name, Email: userData.username }; break;
      case ROLES.PATIENT: table = 'Patient'; payload = { ...payload, PName: userData.name, Email: userData.username }; break;
      case ROLES.ADMIN: table = 'Admins'; payload = { Username: userData.username, Role: ROLES.ADMIN }; break;
      default: return { success: false, message: 'Invalid role' };
    }
    const { error } = await supabase.from(table).insert([payload]);
    if (error) return { success: false, message: error.message };
    fetchAllData();
    return { success: true };
  };

  const removeUser = async (userToRemove) => {
    const tables = { [ROLES.DOCTOR]: ['Doctor', 'Docid'], [ROLES.NURSE]: ['Nurse', 'Nurseid'], [ROLES.RECEPTIONIST]: ['Receptionist', 'Repid'], [ROLES.WARDBOY]: ['WardBoy', 'WardBid'], [ROLES.PATIENT]: ['Patient', 'Pid'], [ROLES.ADMIN]: ['Admins', 'Adminid'] };
    const [table, idCol] = tables[userToRemove.role];
    await supabase.from(table).delete().eq(idCol, userToRemove.id);
    fetchAllData();
  };

  const updateUserRole = async (userId, newRole) => {
    // Note: In this architecture, updating role means moving record between tables, 
    // which is complex. For now, we update the Role field if it exists.
    const { error } = await supabase.from('Admins').update({ Role: newRole }).eq('Adminid', userId);
    if (error) {
        // Handle other tables if necessary
    }
    fetchAllData();
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user, users, appointments, applications, wards,
      login, signup, logout, bookAppointment, updateAppointmentStatus, 
      addUser, removeUser, updateUserRole, loading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
