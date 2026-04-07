import React, { createContext, useState, useContext, useEffect } from 'react';
import { INITIAL_USERS, ROLES } from '../dummyData';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Persistent user session
    const savedUser = localStorage.getItem('caresphere_current_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    // Persistent list of all registered users
    const savedUsers = localStorage.getItem('caresphere_all_users');
    if (savedUsers) {
      let parsed = JSON.parse(savedUsers);
      // Force resync if the browser cached the older generic dummy system
      const hasNewData = parsed.some(u => u.name === 'Dr. Tariq Mahmood');
      
      if (!hasNewData) {
        // Retain any manual patient signups or applications the user created, but force in the new doctors!
        const manualUsers = parsed.filter(u => u.id > 1000 || u.role === 'patient');
        
        // Ensure no exact ID overlap with INITIAL_USERS if needed
        const merged = [...INITIAL_USERS, ...manualUsers.filter(m => !INITIAL_USERS.some(init => init.id === m.id))];
        setUsers(merged);
        localStorage.setItem('caresphere_all_users', JSON.stringify(merged));
      } else {
        setUsers(parsed);
      }
    } else {
      setUsers(INITIAL_USERS);
      localStorage.setItem('caresphere_all_users', JSON.stringify(INITIAL_USERS));
    }

    const savedAppts = localStorage.getItem('caresphere_appointments');
    if (savedAppts) {
      setAppointments(JSON.parse(savedAppts));
    }

    const savedApps = localStorage.getItem('caresphere_applications');
    if (savedApps) {
      setApplications(JSON.parse(savedApps));
    }
    
    setLoading(false);
  }, []);

  const login = (username, password) => {
    // Search in the persisted users list
    const foundUser = users.find(u => u.username === username && u.password === password);
    if (foundUser) {
      const userToSave = { ...foundUser };
      delete userToSave.password;
      setUser(userToSave);
      localStorage.setItem('caresphere_current_user', JSON.stringify(userToSave));
      return { success: true };
    }
    return { success: false, message: 'Invalid credentials' };
  };

  const signup = (userData) => {
    const newUser = {
      ...userData,
      id: Date.now(),
      role: ROLES.PATIENT // Default role for public sign up
    };
    
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    localStorage.setItem('caresphere_all_users', JSON.stringify(updatedUsers));
    
    // Auto-login after sign up
    const userToSave = { ...newUser };
    delete userToSave.password;
    setUser(userToSave);
    localStorage.setItem('caresphere_current_user', JSON.stringify(userToSave));
    
    return { success: true };
  };

  const addUser = (userData) => {
    const newUser = { ...userData, id: Date.now() };
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    localStorage.setItem('caresphere_all_users', JSON.stringify(updatedUsers));
    return { success: true };
  };

  const submitApplication = (appData) => {
    const newApp = { ...appData, id: Date.now(), status: 'Pending' };
    const updatedApps = [...applications, newApp];
    setApplications(updatedApps);
    localStorage.setItem('caresphere_applications', JSON.stringify(updatedApps));
    return { success: true };
  };

  const approveApplication = (appId) => {
    const appToApprove = applications.find(a => a.id === appId);
    if (!appToApprove) return;

    // Generate specific credentials mapped to schema
    const username = `${appToApprove.name.toLowerCase().replace(/\s+/g, '.')}@caresphere.com`;
    
    const newUser = {
      id: Date.now(),
      name: appToApprove.name,
      username: username,
      password: 'password123', // Admin sets default password
      role: appToApprove.role,
      department: appToApprove.department,
      email: username, // Uses custom email
      // Store other specifics from application
      licenseNumber: appToApprove.licenseNumber,
      yearsExperience: appToApprove.yearsExperience,
      shift: appToApprove.shiftPreference,
      languages: appToApprove.languages,
      status: 'Active'
    };

    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    localStorage.setItem('caresphere_all_users', JSON.stringify(updatedUsers));

    // Remove from pending
    rejectApplication(appId);
  };

  const rejectApplication = (appId) => {
    const updatedApps = applications.filter(a => a.id !== appId);
    setApplications(updatedApps);
    localStorage.setItem('caresphere_applications', JSON.stringify(updatedApps));
  };

  const removeUser = (userId) => {
    const updatedUsers = users.filter(u => u.id !== userId);
    setUsers(updatedUsers);
    localStorage.setItem('caresphere_all_users', JSON.stringify(updatedUsers));
  };

  const updateUserRole = (userId, newRole) => {
    const updatedUsers = users.map(u => 
      u.id === userId ? { ...u, role: newRole } : u
    );
    setUsers(updatedUsers);
    localStorage.setItem('caresphere_all_users', JSON.stringify(updatedUsers));
  };

  const bookAppointment = (appointmentData) => {
    const newAppointment = { ...appointmentData, id: Date.now(), status: 'Pending' };
    const updatedAppointments = [...appointments, newAppointment];
    setAppointments(updatedAppointments);
    localStorage.setItem('caresphere_appointments', JSON.stringify(updatedAppointments));
  };

  const updateAppointmentStatus = (appointmentId, newStatus) => {
    const updatedAppointments = appointments.map(a => 
      a.id === appointmentId ? { ...a, status: newStatus } : a
    );
    setAppointments(updatedAppointments);
    localStorage.setItem('caresphere_appointments', JSON.stringify(updatedAppointments));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('caresphere_current_user');
  };

  return (
    <AuthContext.Provider value={{
      user, users, appointments, applications, 
      login, signup, logout, addUser, removeUser, updateUserRole, 
      bookAppointment, updateAppointmentStatus, 
      submitApplication, approveApplication, rejectApplication,
      loading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
