import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { ROLES, WARD_DATA } from '../dummyData';
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
      case ROLES.ADMIN:
        return <AdminView />;
      case ROLES.DOCTOR:
        return <DoctorView />;
      case ROLES.NURSE:
        return <NurseView />;
      case ROLES.RECEPTIONIST:
        return <ReceptionistView />;
      case ROLES.PATIENT:
        return <PatientView />;
      case ROLES.WARDBOY:
        return <WardBoyView />;
      default:
        return <div>Unauthorized Role</div>;
    }
  };

  return (
    <div className="page-wrapper">
      <header className="page-header" style={{padding: '40px 20px', flexDirection: 'row', display: 'flex', justifyContent: 'space-between', alignItems: 'center', textAlign: 'left'}}>
        <div>
          <h2 style={{color: 'white', margin: 0, fontSize: '2rem'}}>CareSphere Dashboard</h2>
          <p style={{margin: 0, opacity: 0.9}}>Authenticated as: {user?.name} (<span style={{textTransform: 'capitalize'}}>{user?.role}</span>)</p>
        </div>
        <button onClick={handleLogout} style={{backgroundColor: '#dc3545', fontWeight: 'bold'}}>
          Logout
        </button>
      </header>
      
      <main style={{maxWidth: '1200px', margin: '40px auto'}}>
        {renderRoleDashboard()}
      </main>
    </div>
  );
};

/* Role Specific Views (Placeholders) */

const AdminView = () => {
  const { users, appointments, updateAppointmentStatus, applications, approveApplication, rejectApplication, wards } = useAuth();
  
  return (
  <div>
    <h3>Admin Control Center</h3>
    <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
      <StatCard title="Total Staff" value={users.filter(u => u.role !== ROLES.PATIENT).length.toString()} />
      <StatCard title="Active Wards" value={wards.length.toString()} />
      <StatCard title="Waitlist" value={applications.length.toString()} />
    </div>
    
    <WardDataDisplay wards={wards} />

    <div style={{ marginTop: '30px' }}>
      <h4>Pending Staff Applications</h4>
      {applications.length === 0 ? (
          <p>No pending applications.</p>
      ) : (
          <table>
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
                  <td>{app.name}</td>
                  <td style={{textTransform:'capitalize'}}>{app.role}</td>
                  <td>{app.department || 'N/A'}</td>
                  <td><span style={{color: 'orange', fontWeight:'bold'}}>{app.status}</span></td>
                  <td>
                    <div style={{display: 'flex', gap: '5px'}}>
                      <button onClick={() => approveApplication(app.id)}>Approve</button>
                      <button onClick={() => rejectApplication(app.id)} style={{backgroundColor: '#dc3545'}}>Reject</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
      )}
    </div>

    <div style={{ marginTop: '30px' }}>
      <h4>All Appointments</h4>
      <AppointmentsTable appointments={appointments} updateAppointmentStatus={updateAppointmentStatus} canEdit={true} />
    </div>

    <div style={{ marginTop: '20px' }}>
      <Link to="/users">
        <button style={{ backgroundColor: '#007bff' }}>Manage Hospital Users</button>
      </Link>
    </div>
  </div>
  );
};

const DoctorView = () => {
  const { appointments, updateAppointmentStatus, user } = useAuth();
  // Simplified logic for showing appointments. In a real app we'd filter by doctor.
  const myAppointments = appointments.filter(a => a.department === user.department || !user.department);

  return (
    <div>
      <h3>Doctor Dashboard</h3>
      <div>
        <StatCard title="My Appointments" value={myAppointments.length.toString()} />
      </div>

      <div style={{ marginTop: '30px' }}>
        <h4>Appointments Queue</h4>
        <AppointmentsTable appointments={myAppointments} updateAppointmentStatus={updateAppointmentStatus} />
      </div>
    </div>
  );
};

const NurseView = () => (
  <div>
    <h3>Nurse Station</h3>
    <div>
      <StatCard title="Patients in Ward" value="18" />
      <StatCard title="Medication Due" value="4" />
    </div>
  </div>
);

const ReceptionistView = () => {
  const { appointments, updateAppointmentStatus, wards } = useAuth();
  return (
  <div>
    <h3>Reception Dashboard</h3>
    <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
      <StatCard title="Check-ins Today" value="-" />
      <StatCard title="Pending Appts" value={appointments.filter(a => a.status === 'Pending').length.toString()} />
    </div>

    <WardDataDisplay wards={wards} />
    
    <div style={{ marginTop: '30px' }}>
      <h4>All Appointments</h4>
      <AppointmentsTable appointments={appointments} updateAppointmentStatus={updateAppointmentStatus} canEdit={true} />
    </div>
  </div>
  );
};

const WardDataDisplay = ({ wards = [] }) => {
    return (
        <div style={{ marginTop: '20px' }}>
            <h4>Ward Availability Overview</h4>
            <table>
                <thead>
                    <tr>
                        <th>Department</th>
                        <th>Total Beds</th>
                        <th>Available Beds</th>
                    </tr>
                </thead>
                <tbody>
                    {wards.map(ward => (
                         <tr key={ward.id}>
                            <td>{ward.department}</td>
                            <td>{ward.totalBeds}</td>
                            <td>{ward.availableBeds}</td>
                        </tr>
                    ))}
                    {wards.length === 0 && (
                      <tr><td colSpan="3">No ward data available. Adjusting hospital setup...</td></tr>
                    )}
                </tbody>
            </table>
        </div>
    )
}

const AppointmentsTable = ({ appointments, updateAppointmentStatus, canEdit = false }) => {
    return (
        appointments.length === 0 ? (
          <p>No appointments scheduled.</p>
        ) : (
          <table>
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

                  return (
                <tr key={app.id}>
                  <td>{app.patientName}</td>
                  <td>{app.department}</td>
                  <td>{new Date(app.date).toLocaleString()}</td>
                  <td style={{ fontWeight: 'bold', color: displayStatus === 'Confirmed' ? 'green' : displayStatus === 'Canceled' ? 'red' : displayStatus === 'Completed' ? 'blue' : 'orange' }}>
                    {displayStatus}
                  </td>
                  <td>
                    {isCompleted ? (
                         <span>-</span>
                    ) : (
                        <div style={{display: 'flex', gap: '5px'}}>
                             {(app.status === 'Pending' && !isCompleted && canEdit) && (
                              <button onClick={() => updateAppointmentStatus(app.id, 'Confirmed')}>Confirm</button>
                            )}
                            {(app.status !== 'Canceled' && !isCompleted && canEdit) && (
                                <button onClick={() => updateAppointmentStatus(app.id, 'Canceled')} style={{backgroundColor: '#dc3545'}}>Cancel</button>
                            )}
                        </div>
                    )}
                  </td>
                </tr>
              )})}
            </tbody>
          </table>
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
      <h3>My Patient Portal</h3>
      <div>
        <StatCard 
          title="Next Appointment" 
          value={myAppointments.length > 0 ? new Date(myAppointments[myAppointments.length - 1].date).toLocaleString() : "None"} 
        />
        <StatCard title="My Vitals" value="Healthy" />
      </div>

      <div style={{ marginTop: '30px' }}>
        <h4>Book New Appointment</h4>
        <form onSubmit={handleBook} style={{ margin: '10px 0', maxWidth: '100%' }}>
          <div>
            <label>Date and Time</label>
            <input 
              type="datetime-local" 
              value={date} 
              onChange={e => setDate(e.target.value)} 
              required 
            />
          </div>
          <div>
            <label>Department</label>
            <select value={department} onChange={e => setDepartment(e.target.value)} required>
              <option value="">Select Department</option>
              <option value="Cardiology">Cardiology</option>
              <option value="Neurology">Neurology</option>
              <option value="Pediatrics">Pediatrics</option>
              <option value="Orthopedics">Orthopedics</option>
              <option value="General">General</option>
            </select>
          </div>
          <button type="submit">Book Appointment</button>
        </form>
      </div>

      {appointments.length > 0 && (
        <div style={{ marginTop: '30px' }}>
          <h4>My Appointments</h4>
          <table>
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
                  <td>{new Date(app.date).toLocaleString()}</td>
                  <td style={{ fontWeight: 'bold', color: app.status === 'Confirmed' ? 'green' : app.status === 'Canceled' ? 'red' : 'orange' }}>
                    {app.status}
                  </td>
                  <td>
                    {app.status === 'Pending' && (
                        <button onClick={() => updateAppointmentStatus(app.id, 'Canceled')} style={{backgroundColor: '#dc3545', padding: '5px 10px', fontSize: '0.8rem'}}>Cancel</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const WardBoyView = () => (
  <div>
    <h3>Ward Staff View</h3>
    <div>
      <StatCard title="Pending Tasks" value="7" />
      <StatCard title="Shift Status" value="On Duty" />
    </div>
  </div>
);

const StatCard = ({ title, value }) => (
  <div>
    <p>{title}</p>
    <p>{value}</p>
  </div>
);

export default Dashboard;
