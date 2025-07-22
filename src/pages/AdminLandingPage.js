import React from 'react';
import { Link } from 'react-router-dom';
import './AdminLandingPage.css';

const AdminLandingPage = () => {
  return (
    <div className="admin-landing">
      <div className="admin-container">
        <h2>Welcome, Admin</h2>
        <p>Select a section to manage:</p>
        <div className="admin-links">
          <Link to="/admin/products" className="admin-card">📦 Manage Products</Link>
          <Link to="/admin/user" className="admin-card">👤 Manage Users</Link>
          <Link to="/admin/shipping" className="admin-card">🚚 Shipping Settings</Link>
          <Link to="/admin/orders" className="admin-card">📊 Orders Dashboard</Link>
          <Link to="/admin/settings" className="admin-card">⚙️ Site Settings</Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLandingPage;
