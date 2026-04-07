import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { ROLES, WARD_DATA } from '../dummyData';

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
    <div>
      <header>
        <div>
          <h2>CareSphere</h2>
          <p>Authenticated as: {user?.name} ({user?.role})</p>
        </div>
        <button onClick={handleLogout}>
          Logout
        </button>
      </header>
      
      <main>
        {renderRoleDashboard()}
      </main>
    </div>
  );
};

/* Role Specific Views (Placeholders) */

const AdminView = () => {
  const { appointments, updateAppointmentStatus, applications, approveApplication, rejectApplication } = useAuth();
  
  return (
  <div>
    <h3>Admin Control Center</h3>
    <div>
      <StatCard title="Total Staff" value="42" />
      <StatCard title="Active Wards" value="8" />
      <StatCard title="Revenue" value="$12,400" />
    </div>
    
    <WardDataDisplay />

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
  const { appointments, updateAppointmentStatus } = useAuth();
  return (
  <div>
    <h3>Reception Dashboard</h3>
    <div>
      <StatCard title="New Registrations" value="3" />
      <StatCard title="Check-ins" value="15" />
    </div>

    <WardDataDisplay />
    
    <div style={{ marginTop: '30px' }}>
      <h4>All Appointments</h4>
      <AppointmentsTable appointments={appointments} updateAppointmentStatus={updateAppointmentStatus} canEdit={true} />
    </div>
  </div>
  );
};

const WardDataDisplay = () => {
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
                    {WARD_DATA.map(ward => (
                         <tr key={ward.id}>
                            <td>{ward.department}</td>
                            <td>{ward.totalBeds}</td>
                            <td>{ward.availableBeds}</td>
                        </tr>
                    ))}
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
