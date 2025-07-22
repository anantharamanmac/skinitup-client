import React, { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import './Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const API_BASE = process.env.REACT_APP_API_BASE_URL;

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(`${API_BASE}/api/users/login`, {
        email,
        password,
      });

      localStorage.setItem('token', res.data.token);

      toast.success('Login successful!');

      setTimeout(() => {
        navigate(res.data.isAdmin ? '/admin' : '/');
      }, 1500);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="login-page">
      <ToastContainer position="top-right" autoClose={2000} />

      <div className="login-box">
        <h2>Login</h2>

        <form className="login-form" onSubmit={handleLogin}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            required
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />

          <button type="submit">Login</button>
        </form>

        <p className="login-footer">
          New here? <a href="/register">Create an account</a>
        </p>
      </div>
    </div>
  );
}

export default Login;
