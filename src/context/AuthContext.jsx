import React, { createContext, useState, useContext, useEffect, useRef } from 'react';
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
  // Ref to prevent double-fetching profile when login() and onAuthStateChange fire together
  const isFetchingProfile = useRef(false);

  // Helper to find profile and role from SQL tables based on email
  const fetchProfileByEmail = async (email) => {
    // PostgreSQL stores unquoted identifiers as lowercase
    const tables = ['admins', 'doctor', 'nurse', 'receptionist', 'wardboy', 'patient'];
    const emailFields = { admins: 'username', doctor: 'email', nurse: 'email', receptionist: 'email', wardboy: 'email', patient: 'email' };
    
    for (const table of tables) {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .eq(emailFields[table], email)
        .maybeSingle(); // maybeSingle() returns null data (not an error) when no rows found
      
      if (error) {
        console.error(`[Auth Debug] Error querying table ${table}:`, error.message);
        continue;
      }
      
      if (data) {
        console.log(`[Auth Debug] Found user in table: ${table}`, data);
        let role = table;
        if (role === 'doctor') role = ROLES.DOCTOR;
        else if (role === 'admins') role = ROLES.ADMIN;
        else if (role === 'nurse') role = ROLES.NURSE;
        else if (role === 'receptionist') role = ROLES.RECEPTIONIST;
        else if (role === 'wardboy') role = ROLES.WARDBOY;
        else if (role === 'patient') role = ROLES.PATIENT;
        
        return { 
          id: data.adminid || data.docid || data.pid || data.nurseid || data.repid || data.wardbid,
          name: data.name || data.pname || data.nursename || data.wardbname || (data.username ? data.username.split('@')[0] : email.split('@')[0]),
          email: email,
          role: role,
          profile: data
        };
      }
    }
    console.warn(`[Auth Debug] No profile found for email: ${email}`);
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
        supabase.from('admins').select('*'),
        supabase.from('doctor').select('*'),
        supabase.from('nurse').select('*'),
        supabase.from('receptionist').select('*'),
        supabase.from('wardboy').select('*'),
        supabase.from('patient').select('*'),
        supabase.from('departments').select('*')
      ]);

      const deptMap = (depts || []).reduce((acc, d) => ({ ...acc, [d.depid]: d.departmentname }), {});

      const consolidatedUsers = [
        ...(admins || []).map(u => ({ ...u, id: u.adminid, name: u.username.split('@')[0], email: u.username, role: ROLES.ADMIN })),
        ...(doctors || []).map(u => ({ ...u, id: u.docid, name: u.name, email: u.email, role: ROLES.DOCTOR, department: deptMap[u.depid] })),
        ...(nurses || []).map(u => ({ ...u, id: u.nurseid, name: u.nursename, email: u.email, role: ROLES.NURSE, department: deptMap[u.depid] })),
        ...(receptionists || []).map(u => ({ ...u, id: u.repid, name: u.name, email: u.email, role: ROLES.RECEPTIONIST, department: deptMap[u.depid] })),
        ...(wardboys || []).map(u => ({ ...u, id: u.wardbid, name: u.wardbname, email: u.email, role: ROLES.WARDBOY, department: deptMap[u.depid] })),
        ...(patients || []).map(u => ({ ...u, id: u.pid, name: u.pname, email: u.email, role: ROLES.PATIENT }))
      ];

      setUsers(consolidatedUsers);

      // 2. Fetch Appointments
      const { data: appts } = await supabase.from('appointment').select(`
        *,
        patient(pname),
        doctor(name),
        departments(departmentname)
      `);
      
      setAppointments((appts || []).map(a => ({
        id: a.apid,
        patientName: a.patient?.pname,
        doctorName: a.doctor?.name,
        department: a.departments?.departmentname,
        date: a.appointmentdate,
        status: a.status,
        patientId: a.pid
      })));

      // 3. Fetch Wards
      const { data: wardData } = await supabase.from('ward').select('*, departments(departmentname)');
      setWards((wardData || []).map(w => ({
        id: w.wardid,
        department: w.departments?.departmentname,
        totalBeds: w.totalbeds,
        availableBeds: w.availablebeds
      })));

    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  useEffect(() => {
    let mounted = true;

    // Step 1: Check for an existing session on mount
    const initAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user && mounted) {
        const profile = await fetchProfileByEmail(session.user.email);
        if (mounted) {
          if (profile) setUser(profile);
          else setUser({ email: session.user.email, role: 'unauthorized', name: 'User' });
          fetchAllData();
        }
      }
      if (mounted) setLoading(false);
    };

    initAuth();

    // Step 2: Listen for subsequent Auth changes (e.g., token refresh, signout)
    // We skip SIGNED_IN events here because login() handles them directly
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('[Auth] Event:', event);
      if (event === 'SIGNED_OUT') {
        if (mounted) setUser(null);
      } else if (event === 'TOKEN_REFRESHED' && session?.user) {
        // Just refresh the profile silently
        if (!isFetchingProfile.current && mounted) {
          const profile = await fetchProfileByEmail(session.user.email);
          if (mounted && profile) setUser(profile);
        }
      }
      // SIGNED_IN is handled by the login() function directly
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    isFetchingProfile.current = true;
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        console.error('[Login] Supabase auth error:', error.message);
        return { success: false, message: error.message };
      }

      if (!data?.user) {
        return { success: false, message: 'Login failed. No user returned.' };
      }

      // Use the email from Supabase Auth (canonical/lowercase form)
      const authEmail = data.user.email;

      // Fetch the profile from DB tables using the Supabase auth email
      const profile = await fetchProfileByEmail(authEmail);
      if (profile) {
        setUser(profile);
        fetchAllData(); // Load full data in background
        return { success: true };
      } else {
        // Authenticated with Supabase but not found in any DB table
        // Sign them out to prevent a broken session
        await supabase.auth.signOut();
        return { 
          success: false, 
          message: 'Your account is not registered in the system. Please contact admin.' 
        };
      }
    } catch (err) {
      console.error('[Login] Unexpected error:', err);
      return { success: false, message: 'An unexpected error occurred. Please try again.' };
    } finally {
      setLoading(false);
      isFetchingProfile.current = false;
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
    const { error: profileError } = await supabase.from('patient').insert([{
      pname: userData.name,
      email: userData.email,
      gender: userData.gender,
      dob: userData.dob,
      phoneno: userData.phone,
      address: userData.address,
      bloodgroup: userData.bloodGroup,
      emergencyphoneno: userData.emergencyPhone,
      disease: userData.disease || 'N/A',
      passwordhash: 'MANAGED_BY_SUPABASE_AUTH'
    }]);

    if (profileError) {
      console.error('[Signup] Profile insert error:', profileError.message);
      return { success: true, message: 'Account created! Please check your email to verify.' };
    }

    return { success: true, message: 'Account created! Please check your email to verify your account before logging in.' };
  };

  const bookAppointment = async (apptData) => {
    const { data: dept } = await supabase.from('departments').select('depid').eq('departmentname', apptData.department).single();
    await supabase.from('appointment').insert([{ appointmentdate: apptData.date, pid: apptData.patientId, docid: apptData.doctorId || null, depid: dept?.depid }]);
    fetchAllData();
  };

  const updateAppointmentStatus = async (appointmentId, newStatus) => {
    await supabase.from('appointment').update({ status: newStatus }).eq('apid', appointmentId);
    fetchAllData();
  };

  const addUser = async (userData) => {
    let table = '';
    let payload = { status: 'Active' };
    switch (userData.role) {
      case ROLES.DOCTOR: table = 'doctor'; payload = { ...payload, name: userData.name, email: userData.username }; break;
      case ROLES.NURSE: table = 'nurse'; payload = { ...payload, nursename: userData.name, email: userData.username }; break;
      case ROLES.RECEPTIONIST: table = 'receptionist'; payload = { ...payload, name: userData.name, email: userData.username }; break;
      case ROLES.WARDBOY: table = 'wardboy'; payload = { ...payload, wardbname: userData.name, email: userData.username }; break;
      case ROLES.PATIENT: table = 'patient'; payload = { ...payload, pname: userData.name, email: userData.username, passwordhash: 'MANAGED_BY_SUPABASE_AUTH' }; break;
      case ROLES.ADMIN: table = 'admins'; payload = { username: userData.username, passwordhash: 'MANAGED_BY_SUPABASE_AUTH', role: ROLES.ADMIN }; break;
      default: return { success: false, message: 'Invalid role' };
    }
    const { error } = await supabase.from(table).insert([payload]);
    if (error) return { success: false, message: error.message };
    fetchAllData();
    return { success: true };
  };

  const removeUser = async (userToRemove) => {
    const tables = { [ROLES.DOCTOR]: ['doctor', 'docid'], [ROLES.NURSE]: ['nurse', 'nurseid'], [ROLES.RECEPTIONIST]: ['receptionist', 'repid'], [ROLES.WARDBOY]: ['wardboy', 'wardbid'], [ROLES.PATIENT]: ['patient', 'pid'], [ROLES.ADMIN]: ['admins', 'adminid'] };
    const [table, idCol] = tables[userToRemove.role];
    await supabase.from(table).delete().eq(idCol, userToRemove.id);
    fetchAllData();
  };

  const updateUserRole = async (userId, newRole) => {
    const { error } = await supabase.from('admins').update({ role: newRole }).eq('adminid', userId);
    if (error) console.error('updateUserRole error:', error.message);
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
