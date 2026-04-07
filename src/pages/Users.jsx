import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ROLES } from '../dummyData';
import { Link } from 'react-router-dom';

const Users = () => {
  const { users, user, addUser, removeUser, updateUserRole } = useAuth();
  const [formData, setFormData] = useState({ name: '', username: '', password: '', role: ROLES.PATIENT });
  const [pendingRoles, setPendingRoles] = useState({});

  if (user?.role !== ROLES.ADMIN && user?.role !== ROLES.DOCTOR) {
    return <div>Access Denied</div>;
  }

  const availableRoles = Object.values(ROLES).filter(role => {
    if (user.role === ROLES.ADMIN) return true;
    if (user.role === ROLES.DOCTOR) return role !== ROLES.ADMIN;
    return false;
  });

  const handleCreateUser = (e) => {
    e.preventDefault();
    addUser(formData);
    setFormData({ name: '', username: '', password: '', role: ROLES.PATIENT });
  };

  const handleRoleChange = (userId, newRole) => {
    setPendingRoles({ ...pendingRoles, [userId]: newRole });
  };

  const submitRoleUpdate = (userId) => {
    if (pendingRoles[userId]) {
      updateUserRole(userId, pendingRoles[userId]);
      const newPending = { ...pendingRoles };
      delete newPending[userId];
      setPendingRoles(newPending);
      alert('Role updated successfully!');
    }
  };

  return (
    <div>
      <header>
        <div>
          <h2>CareSphere - User Management</h2>
          <p>Authenticated as: {user?.name} ({user?.role})</p>
        </div>
        <Link to="/dashboard">
          <button>Back to Dashboard</button>
        </Link>
      </header>
      <main>
        <div>
          <h3>User & Staff Management</h3>
          <div>
            <div>
              <h4>Add New Staff/User</h4>
              <form onSubmit={handleCreateUser}>
                <div><input type="text" placeholder="Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required /></div>
                <div><input type="text" placeholder="Username" value={formData.username} onChange={(e) => setFormData({...formData, username: e.target.value})} required /></div>
                <div><input type="password" placeholder="Password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} required /></div>
                <div>
                  <select value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})}>
                    {availableRoles.map(role => (
                      <option key={role} value={role}>{role.charAt(0).toUpperCase() + role.slice(1)}</option>
                    ))}
                  </select>
                </div>
                <button type="submit">Add User</button>
              </form>
            </div>

            <div style={{ marginTop: '30px' }}>
              <h4>Current Users</h4>
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Role</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => {
                    const currentSelectedRole = pendingRoles[u.id] || u.role;
                    return (
                      <tr key={u.id}>
                        <td>{u.name}</td>
                        <td>
                          {user.role === ROLES.ADMIN && u.id !== user.id ? (
                            <div style={{ display: 'flex', gap: '10px' }}>
                              <select 
                                value={currentSelectedRole} 
                                onChange={(e) => handleRoleChange(u.id, e.target.value)}
                                style={{ padding: '5px', margin: 0, width: 'auto' }}
                              >
                                {Object.values(ROLES).map(role => (
                                  <option key={role} value={role}>{role.charAt(0).toUpperCase() + role.slice(1)}</option>
                                ))}
                              </select>
                              {pendingRoles[u.id] && pendingRoles[u.id] !== u.role && (
                                <button onClick={() => submitRoleUpdate(u.id)} style={{ padding: '5px 10px' }}>
                                  Update
                                </button>
                              )}
                            </div>
                          ) : (
                            u.role.charAt(0).toUpperCase() + u.role.slice(1)
                          )}
                        </td>
                        <td>
                          {u.id !== user.id && (
                            <button onClick={() => removeUser(u)}>Remove</button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Users;
