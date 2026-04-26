import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const TurfList = () => {
  const [turfs, setTurfs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTurfs = async () => {
      try {
        const res = await api.get('/turfs');
        setTurfs(res.data);
      } catch (err) {
        console.error('Failed to fetch turfs', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTurfs();
  }, []);

  if (loading) return <div style={{ textAlign: 'center', marginTop: '4rem' }}>Loading Turfs...</div>;

  return (
    <div>
      <h2 style={{ marginBottom: '2rem', fontSize: '2.5rem', fontWeight: 'bold' }}>Available Turfs</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
        {turfs.map(turf => (
          <div key={turf._id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ fontSize: '1.6rem', color: 'var(--primary)', marginBottom: '0.5rem' }}>{turf.name}</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1rem', fontSize: '0.95rem' }}>📍 {turf.location}</p>
            <p style={{ marginBottom: '1.5rem', flex: 1, color: 'rgba(248, 250, 252, 0.9)' }}>{turf.description}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
              <span style={{ fontWeight: 'bold', fontSize: '1.3rem', color: 'var(--accent)' }}>${turf.pricePerHour}<span style={{fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 'normal'}}>/hr</span></span>
              <Link to={`/turfs/${turf._id}`}>
                <button>Details & Book</button>
              </Link>
            </div>
          </div>
        ))}
        {turfs.length === 0 && <p style={{ color: 'var(--text-muted)' }}>No turfs currently available. Please check back later.</p>}
      </div>
    </div>
  );
};

export default TurfList;
