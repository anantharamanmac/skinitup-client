import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AdminDashboard.css';

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  const API_BASE = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        localStorage.removeItem('token');
        window.location.href = '/login';
        return;
      }

      try {
        const res = await axios.get(`${API_BASE}/api/admin/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(res.data);
      } catch (err) {
        console.error('Error fetching users:', err.response?.data || err.message);
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
      }
    };

    fetchUsers();
  }, [API_BASE]);

  const toggleAdmin = async (userId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${API_BASE}/api/admin/users/${userId}/admin`,
        { isAdmin: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const updatedUsers = users.map((user) =>
        user._id === userId ? { ...user, isAdmin: newStatus } : user
      );
      setUsers(updatedUsers);
    } catch (err) {
      console.error('Failed to update admin status:', err.response?.data || err.message);
    }
  };

  const totalPages = Math.ceil(users.length / usersPerPage);
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map((user) => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <span className={`badge ${user.isAdmin ? 'bg-success' : 'bg-primary'}`}>
                    {user.isAdmin ? 'Admin' : 'User'}
                  </span>
                  <button
                    className="toggle-btn"
                    onClick={() => toggleAdmin(user._id, !user.isAdmin)}
                  >
                    {user.isAdmin ? 'Revoke' : 'Make Admin'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pagination-wrapper">
        <ul className="pagination">
          {[...Array(totalPages).keys()].map((n) => (
            <li
              key={n + 1}
              className={`page-item ${currentPage === n + 1 ? 'active' : ''}`}
            >
              <button className="page-link" onClick={() => setCurrentPage(n + 1)}>
                {n + 1}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default AdminDashboard;
