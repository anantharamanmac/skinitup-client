import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './NavBar.css';

const NavBar = ({ search, setSearch }) => {
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState('guest');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const dropdownRef = useRef();
  const navigate = useNavigate();
  const location = useLocation();

  const decodeToken = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => `%${('00' + c.charCodeAt(0).toString(16)).slice(-2)}`)
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      return null;
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = decodeToken(token);
      setUser(decoded);
      setUserId(decoded?.id || decoded?._id || 'guest');
    } else {
      setUser(null);
      setUserId('guest');
    }
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const logoutHandler = () => {
    localStorage.removeItem('token');
    setUser(null);
    setUserId('guest');
    navigate('/');
  };

  const goToCart = () => navigate('/cart');
  const goToAdmin = () => navigate('/admin');
  const goToProfile = () => navigate('/profile');
  const goToMyOrders = () => navigate('/myorders');

  return (
    <>
      <header className="top-header">
        <div className="logo" onClick={() => navigate('/')}>
          SkinitUp
        </div>

        <input
          className="search-bar"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="nav-icons">
          <span className="cart" onClick={goToCart} style={{ cursor: 'pointer' }}>
            🛒
          </span>

          {user ? (
            <div className="dropdown" ref={dropdownRef}>
              <span
                onClick={() => setIsDropdownOpen((prev) => !prev)}
                style={{ cursor: 'pointer' }}
              >
                👤 {user.name?.split(' ')[0] || 'User'} ⬇
              </span>
              {isDropdownOpen && (
                <div className="dropdown-content">
                  <span onClick={goToProfile}>Profile</span>
                  <span onClick={goToMyOrders}>My Orders</span>
                  {user.isAdmin && <span onClick={goToAdmin}>Admin Panel</span>}
                  <span onClick={logoutHandler}>Logout</span>
                </div>
              )}
            </div>
          ) : (
            <span onClick={() => navigate('/login')} style={{ cursor: 'pointer' }}>
              🔐 Login
            </span>
          )}
        </div>

        <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </div>
      </header>

    </>
  );
};

export default NavBar;
