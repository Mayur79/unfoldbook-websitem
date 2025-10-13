import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('user')); } catch (e) { return null; }
  });

  useEffect(() => {
    
    async function load() {
      try {
        const res = await api.get('/api/v1/auth/me');
        setUser(res.data.user);
      } catch (err) {
        console.error('Could not verify token', err);
       
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login', { replace: true });
      }
    }
    load();
  }, []);

  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  }

  return (
    <div style={{ padding: 24 }}>
      <h2>Dashboard</h2>
      <p>Welcome, <strong>{user?.name || user?.email}</strong></p>
      <button onClick={logout}>Logout</button>
      <div style={{ marginTop: 24 }}>
        <p>This is your protected POC dashboard. Next step: wire S3 document listing & Razorpay checkout.</p>
      </div>
      <div style={{ marginTop: 24 }}>
       
       <Link to="/document">My document</Link>
             </div>
    </div>
  );
}
