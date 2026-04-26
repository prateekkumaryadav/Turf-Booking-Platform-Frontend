import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('token');
  const userData = localStorage.getItem('user');
  const user = userData ? JSON.parse(userData) : null;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  // Force re-render on route change
  const _ = location.pathname;

  return (
    <nav style={{ padding: '1rem 0', background: 'rgba(30,41,59,0.8)', backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(255,255,255,0.05)', position: 'sticky', top: 0, zIndex: 50 }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary)' }}>
          Turf<span style={{ color: 'var(--text-main)' }}>Book</span>
        </Link>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          {token && user ? (
            <>
              {user.role === 'user' && (
                <Link to="/turfs" style={{ fontWeight: '500' }}>Browse Turfs</Link>
              )}
              {user.role === 'user' && (
                <Link to="/my-bookings" style={{ fontWeight: '500', color: 'var(--accent)' }}>My Bookings</Link>
              )}
              {user.role === 'owner' && (
                <Link to="/dashboard" style={{ fontWeight: '500', color: 'var(--accent)' }}>Dashboard</Link>
              )}
              {user.role === 'owner' && (
                <Link to="/owner-bookings" style={{ fontWeight: '500' }}>Bookings</Link>
              )}
              <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Hi, {user.name}</span>
              <button
                onClick={handleLogout}
                style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', padding: '0.4rem 0.8rem', fontSize: '0.9rem' }}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={{ padding: '0.5rem 1rem' }}>Login</Link>
              <Link to="/register"><button>Sign Up</button></Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
