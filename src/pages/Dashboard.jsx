import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { ROLES } from '../dummyData';
import './SharedPages.css';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const renderRoleDashboard = () => {
    switch (user?.role) {
      case ROLES.ADMIN: return <AdminView />;
      case ROLES.DOCTOR: return <DoctorView />;
      case ROLES.NURSE: return <NurseView />;
      case ROLES.RECEPTIONIST: return <ReceptionistView />;
      case ROLES.PATIENT: return <PatientView />;
      case ROLES.WARDBOY: return <WardBoyView />;
      default: return <div>Unauthorized Role</div>;
    }
  };

  return (
    <div className="page-wrapper">
      <header className="page-header" style={{padding: '40px 20px', flexDirection: 'row', display: 'flex', justifyContent: 'space-between', alignItems: 'center', textAlign: 'left'}}>
        <div>
          <h2 style={{color: 'white', margin: 0, fontSize: '2rem'}}>CareSphere Dashboard</h2>
          <p style={{margin: 0, opacity: 0.9}}>Authenticated as: {user?.name} (<span style={{textTransform: 'capitalize'}}>{user?.role}</span>)</p>
        </div>
        <button onClick={handleLogout} className="action-btn danger" style={{padding: '10px 20px', fontSize: '1rem'}}>
          Logout Account
        </button>
      </header>
      
      <main className="dashboard-container">
        {renderRoleDashboard()}
      </main>
    </div>
  );
};

/* Role Specific Views */

const AdminView = () => {
  const { users, appointments, updateAppointmentStatus, applications, approveApplication, rejectApplication, wards } = useAuth();
  
  return (
  <div>
    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
      <h3 style={{color: '#112A46', margin: 0, fontSize: '1.6rem'}}>Admin Control Center</h3>
      <Link to="/users">
        <button className="submit-btn" style={{padding: '10px 20px', width: 'auto'}}>Manage Hospital Users</button>
      </Link>
    </div>
    
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '40px' }}>
      <StatCard title="Total Staff" value={users.filter(u => u.role !== ROLES.PATIENT).length.toString()} />
      <StatCard title="Active Wards" value={wards.length.toString()} />
      <StatCard title="Total Waitlist" value={applications.length.toString()} color="#00b4db" />
    </div>
    
    <WardDataDisplay canEdit={true} />

    <div style={{ marginTop: '40px' }}>
      <h4 style={{color: '#112A46', fontSize: '1.4rem', borderBottom: '2px solid #f0f0f0', paddingBottom: '10px'}}>Pending Staff Applications</h4>
      {applications.length === 0 ? (
          <p style={{color: '#888', marginTop: '20px'}}>No pending applications in the queue.</p>
      ) : (
          <div className="sleek-table-container">
            <table className="sleek-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Role</th>
                  <th>Department</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {applications.map(app => (
                  <tr key={app.id}>
                    <td style={{fontWeight: '500'}}>{app.name}</td>
                    <td style={{textTransform:'capitalize'}}>{app.role}</td>
                    <td>{app.department || 'N/A'}</td>
                    <td>
                      <span className="status-badge" style={{
                        backgroundColor: app.status === 'Approved' ? '#dcfce7' : app.status === 'Rejected' ? '#fee2e2' : '#fef3c7', 
                        color: app.status === 'Approved' ? '#16a34a' : app.status === 'Rejected' ? '#dc2626' : '#d97706'
                      }}>
                        {app.status}
                      </span>
                    </td>
                    <td>
                      {app.status === 'Pending' ? (
                        <div style={{display: 'flex', gap: '8px'}}>
                          <button className="action-btn primary" onClick={() => approveApplication(app.id)}>Approve</button>
                          <button className="action-btn danger" onClick={() => rejectApplication(app.id)}>Reject</button>
                        </div>
                      ) : (
                        <span style={{color: '#aaa'}}>-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
      )}
    </div>

    <div style={{ marginTop: '40px' }}>
      <h4 style={{color: '#112A46', fontSize: '1.4rem', borderBottom: '2px solid #f0f0f0', paddingBottom: '10px'}}>All Hospital Appointments</h4>
      <AppointmentsTable appointments={appointments} updateAppointmentStatus={updateAppointmentStatus} canEdit={true} />
    </div>
  </div>
  );
};

const DoctorView = () => {
  const { appointments, updateAppointmentStatus, user } = useAuth();
  const myAppointments = appointments.filter(a => a.department === user.department || !user.department);

  return (
    <div>
      <h3 style={{color: '#112A46', fontSize: '1.6rem', marginBottom: '20px'}}>Doctor Dashboard</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        <StatCard title="My Today's Appointments" value={myAppointments.length.toString()} color="#0083B0" />
      </div>

      <div style={{ marginTop: '30px' }}>
        <h4 style={{color: '#112A46', fontSize: '1.4rem', borderBottom: '2px solid #f0f0f0', paddingBottom: '10px'}}>Appointments Queue</h4>
        <AppointmentsTable appointments={myAppointments} updateAppointmentStatus={updateAppointmentStatus} />
      </div>
    </div>
  );
};

const NurseView = () => (
  <div>
    <h3 style={{color: '#112A46', fontSize: '1.6rem', marginBottom: '20px'}}>Nurse Station</h3>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
      <StatCard title="Patients in Ward" value="18" />
      <StatCard title="Medication Scheduled" value="4" color="#d97706" />
    </div>
  </div>
);

const ReceptionistView = () => {
  const { appointments, updateAppointmentStatus } = useAuth();
  return (
  <div>
    <h3 style={{color: '#112A46', fontSize: '1.6rem', marginBottom: '20px'}}>Reception Dashboard</h3>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '40px' }}>
      <StatCard title="Check-ins Today" value="-" />
      <StatCard title="Pending Appts" value={appointments.filter(a => a.status === 'Pending').length.toString()} />
    </div>

    <WardDataDisplay canEdit={true} />
    
    <div style={{ marginTop: '40px' }}>
      <h4 style={{color: '#112A46', fontSize: '1.4rem', borderBottom: '2px solid #f0f0f0', paddingBottom: '10px'}}>All Appointments</h4>
      <AppointmentsTable appointments={appointments} updateAppointmentStatus={updateAppointmentStatus} canEdit={true} />
    </div>
  </div>
  );
};

const WardDataDisplay = ({ canEdit = false }) => {
    const { wards, departments, addDepartment, addWard, updateWardBeds } = useAuth();
    const [newDeptName, setNewDeptName] = useState('');
    const [newWard, setNewWard] = useState({ wardNo: '', depid: '', totalBeds: 10 });

    const handleAddDept = async (e) => {
      e.preventDefault();
      const res = await addDepartment(newDeptName);
      if (res.success) {
        setNewDeptName('');
        alert('Department added!');
      } else {
        alert('Error: ' + res.message);
      }
    };

    const handleAddWard = async (e) => {
      e.preventDefault();
      const res = await addWard(newWard.wardNo, newWard.depid, parseInt(newWard.totalBeds));
      if (res.success) {
        setNewWard({ wardNo: '', depid: '', totalBeds: 10 });
        alert('Ward added!');
      } else {
        alert('Error: ' + res.message);
      }
    };

    return (
        <div style={{ marginTop: '30px' }}>
            <h4 style={{color: '#112A46', fontSize: '1.4rem', borderBottom: '2px solid #f0f0f0', paddingBottom: '10px'}}>Ward & Facility Overview</h4>
            
            {canEdit && (
              <div style={{ display: 'flex', gap: '30px', margin: '20px 0', flexWrap: 'wrap' }}>
                <div style={{ flex: '1', background: '#f8fafc', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  <h5 style={{color: '#334155', marginBottom: '15px'}}>Add Department</h5>
                  <form onSubmit={handleAddDept} style={{ margin: 0, padding: 0, boxShadow: 'none', background: 'transparent' }}>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <input type="text" placeholder="Department Name" value={newDeptName} onChange={e => setNewDeptName(e.target.value)} required style={{margin: 0}} />
                      <button type="submit" className="action-btn primary" style={{padding: '10px 20px'}}>Add</button>
                    </div>
                  </form>
                </div>
                <div style={{ flex: '1', background: '#f8fafc', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  <h5 style={{color: '#334155', marginBottom: '15px'}}>Add Ward</h5>
                  <form onSubmit={handleAddWard} style={{ margin: 0, padding: 0, boxShadow: 'none', background: 'transparent', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <input type="text" placeholder="Ward No (E-102)" value={newWard.wardNo} onChange={e => setNewWard({...newWard, wardNo: e.target.value})} required style={{margin: 0}} />
                    <select value={newWard.depid} onChange={e => setNewWard({...newWard, depid: e.target.value})} required style={{margin: 0}}>
                      <option value="">Select Department</option>
                      {(departments || []).map(d => (
                        <option key={d.id} value={d.id}>{d.name}</option>
                      ))}
                    </select>
                    <input type="number" placeholder="Total Beds" value={newWard.totalBeds} onChange={e => setNewWard({...newWard, totalBeds: e.target.value})} required min="1" style={{margin: 0}} />
                    <button type="submit" className="action-btn primary" style={{margin: 0}}>Add Ward</button>
                  </form>
                </div>
              </div>
            )}

            <div className="sleek-table-container">
              <table className="sleek-table">
                  <thead>
                      <tr>
                          <th>Ward No</th>
                          <th>Department</th>
                          <th>Total Beds</th>
                          <th>Available Beds</th>
                          {canEdit && <th>Manage Capacity</th>}
                      </tr>
                  </thead>
                  <tbody>
                      {(wards || []).map(ward => (
                           <tr key={ward.id}>
                              <td style={{fontWeight: '500', color: '#112A46'}}>{ward.wardNo || 'N/A'}</td>
                              <td>{ward.department}</td>
                              <td>{ward.totalBeds}</td>
                              <td>
                                <span className="status-badge" style={{ backgroundColor: ward.availableBeds === 0 ? '#fee2e2' : '#dcfce7', color: ward.availableBeds === 0 ? '#dc2626' : '#16a34a' }}>
                                  {ward.availableBeds} Available
                                </span>
                              </td>
                              {canEdit && (
                                <td>
                                  <div style={{ display: 'flex', gap: '8px' }}>
                                    <button className="action-btn primary" onClick={() => updateWardBeds(ward.id, 1)}>Add Bed</button>
                                    <button className="action-btn danger" onClick={() => updateWardBeds(ward.id, -1)} disabled={ward.totalBeds === 0 || ward.availableBeds === 0}>Remove Bed</button>
                                  </div>
                                </td>
                              )}
                          </tr>
                      ))}
                      {(wards || []).length === 0 && (
                        <tr><td colSpan={canEdit ? "5" : "4"} style={{textAlign: 'center', color: '#888'}}>No ward data available. Adjusting hospital setup...</td></tr>
                      )}
                  </tbody>
              </table>
            </div>
        </div>
    )
}

const AppointmentsTable = ({ appointments, updateAppointmentStatus, canEdit = false }) => {
    return (
        appointments.length === 0 ? (
          <p style={{color: '#888', marginTop: '20px'}}>No appointments scheduled.</p>
        ) : (
          <div className="sleek-table-container">
            <table className="sleek-table">
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Department</th>
                  <th>Date & Time</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map(app => {
                    const isCompleted = new Date(app.date) < new Date() && app.status !== 'Canceled';
                    const displayStatus = isCompleted ? 'Completed' : app.status;

                    let bg = '#f1f5f9';
                    let fg = '#475569';
                    if (displayStatus === 'Confirmed') { bg = '#dcfce7'; fg = '#16a34a'; }
                    else if (displayStatus === 'Canceled') { bg = '#fee2e2'; fg = '#dc2626'; }
                    else if (displayStatus === 'Completed') { bg = '#e0f2fe'; fg = '#0284c7'; }
                    else if (displayStatus === 'Pending') { bg = '#fef3c7'; fg = '#d97706'; }

                    return (
                  <tr key={app.id}>
                    <td style={{fontWeight: '500', color: '#112A46'}}>{app.patientName}</td>
                    <td>{app.department}</td>
                    <td>{new Date(app.date).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</td>
                    <td>
                      <span className="status-badge" style={{ backgroundColor: bg, color: fg }}>
                        {displayStatus}
                      </span>
                    </td>
                    <td>
                      {isCompleted ? (
                           <span style={{color: '#aaa'}}>-</span>
                      ) : (
                          <div style={{display: 'flex', gap: '8px'}}>
                               {(app.status === 'Pending' && !isCompleted && canEdit) && (
                                <button className="action-btn primary" onClick={() => updateAppointmentStatus(app.id, 'Confirmed')}>Confirm</button>
                              )}
                              {(app.status !== 'Canceled' && !isCompleted && canEdit) && (
                                  <button className="action-btn danger" onClick={() => updateAppointmentStatus(app.id, 'Canceled')}>Cancel</button>
                              )}
                          </div>
                      )}
                    </td>
                  </tr>
                )})}
              </tbody>
            </table>
          </div>
        )
    )
};

const PatientView = () => {
  const { user, appointments, bookAppointment, updateAppointmentStatus } = useAuth();
  const [date, setDate] = useState('');
  const [department, setDepartment] = useState('');

  const myAppointments = appointments.filter(a => a.patientId === user.id);

  const handleBook = (e) => {
    e.preventDefault();
    bookAppointment({
      patientId: user.id,
      patientName: user.name,
      date,
      department
    });
    setDate('');
    setDepartment('');
    alert('Appointment requested successfully and is pending confirmation!');
  };

  return (
    <div>
      <h3 style={{color: '#112A46', fontSize: '1.6rem', marginBottom: '20px'}}>My Patient Portal</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
        <StatCard 
          title="Next Appointment" 
          value={myAppointments.length > 0 ? new Date(myAppointments[myAppointments.length - 1].date).toLocaleDateString() : "None"} 
          color="#0284c7"
        />
        <StatCard title="My Vitals" value="Healthy" color="#16a34a" />
      </div>

      <div style={{ marginTop: '40px' }}>
        <h4 style={{color: '#112A46', fontSize: '1.4rem', borderBottom: '2px solid #f0f0f0', paddingBottom: '10px'}}>Book Next Consultation</h4>
        <form onSubmit={handleBook} style={{ margin: '20px 0 0', maxWidth: '100%', boxShadow: 'none', padding: 0, display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          <div className="form-group" style={{ flex: '1', minWidth: '200px', margin: 0 }}>
            <label>Selected Date & Time</label>
            <input type="datetime-local" value={date} onChange={e => setDate(e.target.value)} required />
          </div>
          <div className="form-group" style={{ flex: '1', minWidth: '200px', margin: 0 }}>
            <label>Department Specialist</label>
            <select value={department} onChange={e => setDepartment(e.target.value)} required>
              <option value="">Select Department</option>
              <option value="Cardiology">Cardiology</option>
              <option value="Neurology">Neurology</option>
              <option value="Pediatrics">Pediatrics</option>
              <option value="Orthopedics">Orthopedics</option>
              <option value="General">General</option>
            </select>
          </div>
          <div style={{ flex: '1', minWidth: '200px', display: 'flex', alignItems: 'flex-end' }}>
            <button type="submit" className="submit-btn" style={{padding: '16px'}}>Book Appointment</button>
          </div>
        </form>
      </div>

      {appointments.length > 0 && (
        <div style={{ marginTop: '50px' }}>
          <h4 style={{color: '#112A46', fontSize: '1.4rem', borderBottom: '2px solid #f0f0f0', paddingBottom: '10px'}}>My History</h4>
          <div className="sleek-table-container">
            <table className="sleek-table">
              <thead>
                <tr>
                  <th>Department</th>
                  <th>Doctor</th>
                  <th>Date & Time</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {myAppointments.map(app => (
                  <tr key={app.id}>
                    <td>{app.department}</td>
                    <td>{app.doctorName || 'N/A'}</td>
                    <td>{new Date(app.date).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</td>
                    <td>
                      <span className="status-badge" style={{ backgroundColor: app.status === 'Confirmed' ? '#dcfce7' : app.status === 'Canceled' ? '#fee2e2' : '#fef3c7', color: app.status === 'Confirmed' ? '#16a34a' : app.status === 'Canceled' ? '#dc2626' : '#d97706' }}>
                        {app.status}
                      </span>
                    </td>
                    <td>
                      {app.status === 'Pending' ? (
                          <button className="action-btn danger" onClick={() => updateAppointmentStatus(app.id, 'Canceled')}>Cancel</button>
                      ) : <span style={{color: '#aaa'}}>-</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

const WardBoyView = () => (
  <div>
    <h3 style={{color: '#112A46', fontSize: '1.6rem', marginBottom: '20px'}}>Ward Staff View</h3>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
      <StatCard title="Pending Tasks" value="7" />
      <StatCard title="Shift Status" value="On Duty" color="#16a34a" />
    </div>
  </div>
);

const StatCard = ({ title, value, color = '#112A46' }) => (
  <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #f0f0f0', padding: '25px', boxShadow: '0 5px 20px rgba(0,0,0,0.03)', borderLeft: `5px solid ${color}` }}>
    <p style={{ margin: '0 0 10px', fontSize: '1rem', color: '#64748b', fontWeight: '500' }}>{title}</p>
    <p style={{ margin: '0', fontSize: '2.5rem', fontWeight: '700', color: color, lineHeight: '1' }}>{value}</p>
  </div>
);

export default Dashboard;
