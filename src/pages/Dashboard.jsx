import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

const SLOT_OPTIONS = [
  '06:00-07:00', '07:00-08:00', '08:00-09:00', '09:00-10:00',
  '10:00-11:00', '11:00-12:00', '12:00-13:00', '13:00-14:00',
  '14:00-15:00', '15:00-16:00', '16:00-17:00', '17:00-18:00',
  '18:00-19:00', '19:00-20:00', '20:00-21:00', '21:00-22:00',
];

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [turfs, setTurfs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [newTurf, setNewTurf] = useState({ name: '', location: '', description: '', pricePerHour: '', availableSlots: [] });

  useEffect(() => {
    const fetchDashboardData = async () => {
      const userData = localStorage.getItem('user');
      if (!userData) { navigate('/login'); return; }
      const parsedUser = JSON.parse(userData);
      if (parsedUser.role !== 'owner') { navigate('/turfs'); return; }
      setUser(parsedUser);

      try {
        const turfRes = await api.get('/turfs/owner/my');
        setTurfs(turfRes.data);
      } catch (err) {
        console.error('Failed to load dashboard', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, [navigate]);

  const toggleSlot = (slot) => {
    setNewTurf(prev => {
      const slots = prev.availableSlots.includes(slot)
        ? prev.availableSlots.filter(s => s !== slot)
        : [...prev.availableSlots, slot];
      return { ...prev, availableSlots: slots };
    });
  };

  const handleCreateTurf = async (e) => {
    e.preventDefault();
    if (newTurf.availableSlots.length === 0) {
      alert('Please select at least one available time slot.');
      return;
    }
    try {
      const res = await api.post('/turfs', newTurf);
      setTurfs([...turfs, res.data]);
      setNewTurf({ name: '', location: '', description: '', pricePerHour: '', availableSlots: [] });
      alert('Turf created successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create turf');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (loading) return <div style={{ textAlign: 'center', marginTop: '4rem', color: 'var(--text-muted)' }}>Loading Dashboard...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1.5rem' }}>
        <div>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>Owner Dashboard</h2>
          <p style={{ color: 'var(--text-muted)' }}>Manage your turfs and monitor bookings.</p>
        </div>
        <button onClick={handleLogout} style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: 'var(--danger)' }}>Sign Out</button>
      </div>

      {/* Quick Actions */}
      <div style={{ marginBottom: '2.5rem' }}>
        <Link to="/owner-bookings">
          <button style={{ marginRight: '1rem', background: 'rgba(56, 189, 248, 0.15)', border: '1px solid rgba(56, 189, 248, 0.3)', color: 'var(--accent)' }}>
            📋 View All Customer Bookings
          </button>
        </Link>
      </div>

      <div style={{ display: 'flex', gap: '2.5rem', flexWrap: 'wrap' }}>
        {/* Create Turf Form */}
        <div className="glass-panel" style={{ flex: '1 1 450px', padding: '2.5rem' }}>
          <h3 style={{ fontSize: '1.6rem', marginBottom: '2rem', color: 'var(--primary)' }}>Register New Turf</h3>
          <form onSubmit={handleCreateTurf}>
            <div className="form-group">
              <label>Turf Name</label>
              <input type="text" required value={newTurf.name} onChange={e => setNewTurf({ ...newTurf, name: e.target.value })} placeholder="e.g. Extreme Box Cricket" />
            </div>
            <div className="form-group">
              <label>Location</label>
              <input type="text" required value={newTurf.location} onChange={e => setNewTurf({ ...newTurf, location: e.target.value })} placeholder="Address or City" />
            </div>
            <div className="form-group">
              <label>Price Per Hour (₹)</label>
              <input type="number" required value={newTurf.pricePerHour} onChange={e => setNewTurf({ ...newTurf, pricePerHour: e.target.value })} placeholder="0" />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea required rows="3" style={{ width: '100%', padding: '0.85rem 1.2rem', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-main)', borderRadius: '8px', outline: 'none', resize: 'vertical' }} value={newTurf.description} onChange={e => setNewTurf({ ...newTurf, description: e.target.value })} placeholder="Describe amenities..."></textarea>
            </div>
            <div className="form-group">
              <label>Available Time Slots (click to select)</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', marginTop: '0.5rem' }}>
                {SLOT_OPTIONS.map(slot => {
                  const isActive = newTurf.availableSlots.includes(slot);
                  return (
                    <button key={slot} type="button" onClick={() => toggleSlot(slot)} style={{
                      padding: '0.5rem 1rem', fontSize: '0.85rem', borderRadius: '6px', fontWeight: '500',
                      background: isActive ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                      color: isActive ? 'white' : 'var(--text-muted)',
                      border: isActive ? '2px solid var(--primary)' : '1px solid rgba(255,255,255,0.1)',
                      cursor: 'pointer', transition: 'all 0.2s ease',
                    }}>{slot}</button>
                  );
                })}
              </div>
              <p style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>{newTurf.availableSlots.length} slot(s) selected</p>
            </div>
            <button type="submit" style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }}>Publish Turf</button>
          </form>
        </div>

        {/* Listed Turfs */}
        <div className="glass-panel" style={{ flex: '1 1 400px', padding: '2.5rem' }}>
          <h3 style={{ fontSize: '1.6rem', marginBottom: '2rem', color: 'var(--accent)' }}>Your Listed Turfs</h3>
          {turfs.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px dashed rgba(255,255,255,0.1)' }}>
              <p style={{ color: 'var(--text-muted)' }}>You haven't registered any turfs yet.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {turfs.map(t => (
                <div key={t._id} style={{ background: 'rgba(30, 41, 59, 0.5)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <p style={{ fontWeight: 'bold', fontSize: '1.3rem' }}>{t.name}</p>
                    <Link to={`/edit-turf/${t._id}`}>
                      <button style={{ padding: '0.3rem 0.8rem', fontSize: '0.8rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', color: 'var(--text-main)' }}>
                        ✏️ Edit
                      </button>
                    </Link>
                  </div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>📍 {t.location}</p>
                  <p style={{ color: 'var(--success)', fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '0.5rem' }}>₹{t.pricePerHour}/hr</p>
                  {t.availableSlots && t.availableSlots.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.5rem' }}>
                      {t.availableSlots.map(s => (
                        <span key={s} style={{ padding: '0.2rem 0.6rem', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', borderRadius: '4px', fontSize: '0.75rem' }}>{s}</span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
