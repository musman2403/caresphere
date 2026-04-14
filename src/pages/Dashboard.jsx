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
      <header className="page-header dashboard-header">
        <div>
          <h2 style={{color: 'white', margin: 0, fontSize: '2rem'}}>CareSphere Dashboard</h2>
          <p style={{margin: 0, opacity: 0.9}}>Authenticated as: {user?.name} (<span style={{textTransform: 'capitalize'}}>{user?.role}</span>)</p>
        </div>
        <button onClick={handleLogout} className="action-btn danger" style={{padding: '10px 20px', fontSize: '1rem'}}>
          Logout Account
        </button>
      </header>
      
      <main className="dashboard-container">
        <ProfileDetails />
        {renderRoleDashboard()}
      </main>
    </div>
  );
};

const ProfileDetails = () => {
    const { user } = useAuth();
    if (!user || !user.profile) return null;

    const omitKeys = ['adminid', 'docid', 'nurseid', 'repid', 'pid', 'wardbid', 'depid', 'status', 'registrationdate'];
    const entries = Object.entries(user.profile).filter(([k]) => !omitKeys.includes(k));

    return (
        <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '30px' }}>
            <h4 style={{ margin: '0 0 15px', color: '#112A46', fontSize: '1.4rem', borderBottom: '2px solid #e2e8f0', paddingBottom: '10px' }}>My Profile & Credentials</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '15px' }}>
                {entries.map(([key, val]) => (
                    <div key={key}>
                        <strong style={{ display: 'block', color: '#64748b', textTransform: 'capitalize', fontSize: '0.85rem', marginBottom: '4px' }}>
                            {key === 'passwordhash' ? 'Password' : key}
                        </strong>
                        <span style={{ color: '#0f172a', wordBreak: 'break-all' }}>{val || 'N/A'}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

/* Role Specific Views */

const AdminView = () => {
  const { users, appointments, updateAppointmentStatus, applications, approveApplication, rejectApplication, deleteApplication, wards } = useAuth();
  const [selectedApp, setSelectedApp] = useState(null);
  
  return (
  <div>
    {selectedApp && (
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000}}>
        <div style={{ background: 'white', padding: '30px', borderRadius: '12px', width: '500px', maxWidth: '90%', maxHeight: '90vh', overflowY: 'auto' }}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
            <h3 style={{margin: 0, color: '#112A46'}}>Application Details</h3>
            <button onClick={() => setSelectedApp(null)} style={{background: 'transparent', border: 'none', fontSize: '1.5rem', cursor: 'pointer'}}>&times;</button>
          </div>
          <p><strong>Name:</strong> {selectedApp.name}</p>
          <p><strong>Email:</strong> {selectedApp.email}</p>
          <p><strong>Role:</strong> <span style={{textTransform: 'capitalize'}}>{selectedApp.role}</span></p>
          <p><strong>Department:</strong> {selectedApp.department || 'N/A'}</p>
          <p><strong>License Number:</strong> {selectedApp.licensenumber || 'N/A'}</p>
          <p><strong>Years Experience:</strong> {selectedApp.yearsexperience || '0'}</p>
          <p><strong>Shift Preference:</strong> {selectedApp.shiftpreference || 'N/A'}</p>
          <p><strong>Languages:</strong> {selectedApp.languages || 'N/A'}</p>
          <div style={{marginTop: '20px'}}>
            <strong>Cover Letter:</strong>
            <p style={{background: '#f8fafc', padding: '15px', borderRadius: '8px', border: '1px solid #e2e8f0', whiteSpace: 'pre-wrap', marginTop: '10px'}}>{selectedApp.coverletter || 'No cover letter provided.'}</p>
          </div>
          <div style={{display: 'flex', gap: '10px', marginTop: '30px', borderTop: '1px solid #e2e8f0', paddingTop: '20px'}}>
            {selectedApp.status === 'Pending' && (
              <>
                <button className="action-btn primary" onClick={() => { approveApplication(selectedApp.id); setSelectedApp(null); }}>Approve</button>
                <button className="action-btn danger" onClick={() => { rejectApplication(selectedApp.id); setSelectedApp(null); }}>Reject</button>
              </>
            )}
            <button className="action-btn" style={{backgroundColor: '#e2e8f0', color: '#334155'}} onClick={() => setSelectedApp(null)}>Close</button>
          </div>
        </div>
      </div>
    )}
    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
      <h3 style={{color: '#112A46', margin: 0, fontSize: '1.6rem'}}>Admin Control Center</h3>
      <Link to="/users">
        <button className="submit-btn" style={{padding: '10px 20px', width: 'auto'}}>Manage Hospital Users</button>
      </Link>
    </div>
    
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '40px' }}>
      <StatCard title="Total Staff" value={users.filter(u => u.role !== ROLES.PATIENT).length.toString()} />
      <StatCard title="Active Wards" value={wards.length.toString()} />
      <StatCard title="Pending Waitlist" value={applications.filter(a => a.status === 'Pending').length.toString()} color="#00b4db" />
    </div>
    
    <WardDataDisplay canEdit={true} />

    <div style={{ marginTop: '40px' }}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #f0f0f0', paddingBottom: '10px', marginBottom: '0'}}>
        <h4 style={{color: '#112A46', fontSize: '1.4rem', margin: 0}}>Staff Applications</h4>
        <span style={{fontSize: '0.85rem', color: '#888'}}>
          {applications.filter(a => a.status === 'Pending').length} pending · {applications.length} total
        </span>
      </div>
      {applications.length === 0 ? (
          <p style={{color: '#888', marginTop: '20px'}}>No applications in the queue.</p>
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
                  <tr key={app.id} style={{cursor: 'pointer'}} onClick={() => setSelectedApp(app)} title="Click to view details">
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
                    <td onClick={(e) => e.stopPropagation()}>
                      {app.status === 'Pending' ? (
                        <div style={{display: 'flex', gap: '8px'}}>
                          <button className="action-btn primary" onClick={() => approveApplication(app.id)}>Approve</button>
                          <button className="action-btn danger" onClick={() => rejectApplication(app.id)}>Reject</button>
                          <button className="action-btn" style={{backgroundColor: '#f1f5f9', color: '#64748b'}} onClick={() => { if(window.confirm('Remove this application?')) deleteApplication(app.id); }}>Remove</button>
                        </div>
                      ) : (
                        <div style={{display: 'flex', gap: '8px', alignItems: 'center'}}>
                          <span style={{color: '#aaa'}}>-</span>
                          <button className="action-btn" style={{backgroundColor: '#f1f5f9', color: '#64748b', padding: '5px 10px', fontSize: '0.8rem'}} onClick={() => { if(window.confirm('Remove this application from the list?')) deleteApplication(app.id); }}>Remove</button>
                        </div>
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
        <AppointmentsTable appointments={myAppointments} updateAppointmentStatus={updateAppointmentStatus} canEdit={true} isDoctor={true} />
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
    const { wards, departments, addDepartment, addWard, updateWardBeds, updateWard, deleteWard } = useAuth();
    const [newDeptName, setNewDeptName] = useState('');
    const [newWard, setNewWard] = useState({ wardNo: '', depid: '', totalBeds: 10 });
    const [editingWardId, setEditingWardId] = useState(null);
    const [editFormData, setEditFormData] = useState({ wardNo: '', depid: '', totalBeds: 10, availableBeds: 10 });

    const handleAddDept = async (e) => {
      e.preventDefault();
      const res = await addDepartment(newDeptName);
      if (res.success) { setNewDeptName(''); alert('Department added!'); }
      else alert('Error: ' + res.message);
    };

    const handleAddWard = async (e) => {
      e.preventDefault();
      const res = await addWard(newWard.wardNo, newWard.depid, parseInt(newWard.totalBeds));
      if (res.success) { setNewWard({ wardNo: '', depid: '', totalBeds: 10 }); alert('Ward added!'); }
      else alert('Error: ' + res.message);
    };

    const handleBedChange = async (ward, delta) => {
      try {
        const res = await updateWardBeds(ward.id, delta);
        if (!res?.success) alert('Error: ' + res?.message);
      } catch (err) {
        console.error(err);
        alert('An unexpected error occurred.');
      }
    };

    const handleRemoveWard = async (ward) => {
      if (!window.confirm(`Remove Ward ${ward.wardNo || ward.id}? This cannot be undone.`)) return;
      try {
        const res = await deleteWard(ward.id);
        if (!res?.success) alert('Error: ' + res?.message);
      } catch (err) {
        console.error(err);
        alert('An unexpected error occurred.');
      }
    };

    const handleEditClick = (ward) => {
      setEditingWardId(ward.id);
      setEditFormData({
        wardNo: ward.wardNo || '',
        depid: ward.departmentId || '',
        totalBeds: ward.totalBeds,
        availableBeds: ward.availableBeds
      });
    };

    const handleSaveEdit = async (wardId) => {
      try {
        const res = await updateWard(wardId, editFormData);
        if (!res?.success) {
          alert('Error: ' + res?.message);
        } else {
          setEditingWardId(null);
        }
      } catch (err) {
        console.error(err);
        alert('An unexpected error occurred.');
      }
    };

    const handleCancelEdit = () => {
      setEditingWardId(null);
    };

    return (
        <div style={{ marginTop: '30px' }}>
            <h4 style={{color: '#112A46', fontSize: '1.4rem', borderBottom: '2px solid #f0f0f0', paddingBottom: '10px'}}>Ward &amp; Facility Overview</h4>
            
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
                  <h5 style={{color: '#334155', marginBottom: '15px'}}>Add New Ward</h5>
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
                          {canEdit && <th>Manage Beds</th>}
                          {canEdit && <th>Actions</th>}
                      </tr>
                  </thead>
                  <tbody>
                      {(wards || []).map(ward => (
                           <tr key={ward.id}>
                              {editingWardId === ward.id ? (
                                <>
                                  <td><input type="text" value={editFormData.wardNo} onChange={e => setEditFormData({...editFormData, wardNo: e.target.value})} style={{margin:0, width: '80px', padding: '5px'}}/></td>
                                  <td>
                                    <select value={editFormData.depid} onChange={e => setEditFormData({...editFormData, depid: e.target.value})} style={{margin:0, padding: '5px'}}>
                                      <option value="">Select Dept</option>
                                      {(departments || []).map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                                    </select>
                                  </td>
                                  <td><input type="number" value={editFormData.totalBeds} onChange={e => setEditFormData({...editFormData, totalBeds: e.target.value})} style={{margin:0, width: '60px', padding: '5px'}}/></td>
                                  <td><input type="number" value={editFormData.availableBeds} onChange={e => setEditFormData({...editFormData, availableBeds: e.target.value})} style={{margin:0, width: '60px', padding: '5px'}}/></td>
                                  {canEdit && (
                                    <td colSpan="2">
                                      <div style={{display: 'flex', gap: '5px'}}>
                                        <button className="action-btn primary" style={{padding: '5px 10px'}} onClick={() => handleSaveEdit(ward.id)}>Save</button>
                                        <button className="action-btn" style={{padding: '5px 10px', backgroundColor: '#f1f5f9', color: '#64748b'}} onClick={handleCancelEdit}>Cancel</button>
                                      </div>
                                    </td>
                                  )}
                                </>
                              ) : (
                                <>
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
                                      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                                        <button
                                          type="button"
                                          className="action-btn danger"
                                          style={{padding: '4px 10px', fontSize: '1.1rem', lineHeight: '1'}}
                                          onClick={() => handleBedChange(ward, -1)}
                                          disabled={Number(ward.totalBeds) <= 0 || Number(ward.availableBeds) <= 0}
                                          title="Remove one bed"
                                        >−</button>
                                        <span style={{minWidth: '24px', textAlign: 'center', fontWeight: '600'}}>{ward.totalBeds}</span>
                                        <button
                                          type="button"
                                          className="action-btn primary"
                                          style={{padding: '4px 10px', fontSize: '1.1rem', lineHeight: '1'}}
                                          onClick={() => handleBedChange(ward, 1)}
                                          title="Add one bed"
                                        >+</button>
                                      </div>
                                    </td>
                                  )}
                                  {canEdit && (
                                    <td>
                                      <div style={{ display: 'flex', gap: '5px' }}>
                                        <button
                                          type="button"
                                          className="action-btn primary"
                                          style={{padding: '5px 10px', fontSize: '0.85rem'}}
                                          onClick={() => handleEditClick(ward)}
                                        >
                                          Edit
                                        </button>
                                        <button
                                          type="button"
                                          className="action-btn danger"
                                          style={{padding: '5px 10px', fontSize: '0.85rem'}}
                                          onClick={() => handleRemoveWard(ward)}
                                        >
                                          Remove
                                        </button>
                                      </div>
                                    </td>
                                  )}
                                </>
                              )}
                          </tr>
                      ))}
                      {(wards || []).length === 0 && (
                        <tr><td colSpan={canEdit ? "6" : "4"} style={{textAlign: 'center', color: '#888'}}>No ward data available. Add a ward above.</td></tr>
                      )}
                  </tbody>
              </table>
            </div>
        </div>
    )
}

const AppointmentsTable = ({ appointments, updateAppointmentStatus, canEdit = false, isDoctor = false }) => {
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
                    const isCompleted = new Date(app.date) < new Date() && app.status !== 'Canceled' && app.status !== 'Rejected';
                    const displayStatus = isCompleted ? 'Completed' : app.status;

                    let bg = '#f1f5f9';
                    let fg = '#475569';
                    if (displayStatus === 'Confirmed' || displayStatus === 'Approved') { bg = '#dcfce7'; fg = '#16a34a'; }
                    else if (displayStatus === 'Canceled' || displayStatus === 'Rejected') { bg = '#fee2e2'; fg = '#dc2626'; }
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
                                <button className="action-btn primary" onClick={() => updateAppointmentStatus(app.id, isDoctor ? 'Approved' : 'Confirmed')}>{isDoctor ? 'Approve' : 'Confirm'}</button>
                              )}
                              {(app.status !== 'Canceled' && app.status !== 'Rejected' && !isCompleted && canEdit) && (
                                  <button className="action-btn danger" onClick={() => updateAppointmentStatus(app.id, isDoctor ? 'Rejected' : 'Canceled')}>{isDoctor ? 'Reject' : 'Cancel'}</button>
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
                      <span className="status-badge" style={{ backgroundColor: (app.status === 'Confirmed' || app.status === 'Approved') ? '#dcfce7' : (app.status === 'Canceled' || app.status === 'Rejected') ? '#fee2e2' : '#fef3c7', color: (app.status === 'Confirmed' || app.status === 'Approved') ? '#16a34a' : (app.status === 'Canceled' || app.status === 'Rejected') ? '#dc2626' : '#d97706' }}>
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
