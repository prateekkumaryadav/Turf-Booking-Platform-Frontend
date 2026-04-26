import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await api.get('/bookings/me');
        setBookings(res.data);
      } catch (err) {
        console.error('Failed to fetch bookings', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    
    try {
      await api.put(`/bookings/${bookingId}/cancel`);
      setBookings(bookings.map(b => b._id === bookingId ? { ...b, status: 'cancelled' } : b));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel booking');
    }
  };

  if (loading) return <div style={{ textAlign: 'center', marginTop: '4rem', color: 'var(--text-muted)' }}>Loading Bookings...</div>;

  return (
    <div>
      <h2 style={{ marginBottom: '2rem', fontSize: '2.5rem', fontWeight: 'bold' }}>My Bookings</h2>
      {bookings.length === 0 ? (
        <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '1.5rem' }}>You haven't booked any turfs yet.</p>
          <Link to="/turfs"><button>Browse Turfs</button></Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {bookings.map(b => (
            <div key={b._id} className="glass-panel" style={{ padding: '1.5rem', borderLeft: `4px solid ${b.status === 'confirmed' ? 'var(--accent)' : b.status === 'cancelled' ? 'var(--danger)' : 'var(--text-muted)'}` }}>
              <p style={{ fontWeight: 'bold', fontSize: '1.3rem', marginBottom: '0.5rem', color: 'var(--primary)' }}>{b.turf?.name || 'Unknown Turf'}</p>
              {b.turf?.location && <p style={{ color: 'var(--text-muted)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>📍 {b.turf.location}</p>}
              <p style={{ color: 'var(--text-muted)', marginBottom: '0.3rem' }}>📅 {new Date(b.date).toLocaleDateString()}</p>
              <p style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>⏰ {b.timeSlot}</p>
              <p style={{ marginBottom: '1rem', fontWeight: '600', color: 'var(--accent)' }}>💰 ₹{b.totalPrice}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ display: 'inline-block', padding: '0.3rem 0.8rem', background: b.status === 'confirmed' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)', color: b.status === 'confirmed' ? 'var(--success)' : 'var(--danger)', borderRadius: '6px', fontSize: '0.85rem', fontWeight: '600' }}>
                  {b.status.toUpperCase()}
                </span>
                {b.status === 'confirmed' && (
                  <button 
                    onClick={() => handleCancelBooking(b._id)}
                    style={{ background: 'transparent', color: 'var(--danger)', border: '1px solid var(--danger)', padding: '0.4rem 0.8rem', fontSize: '0.85rem', width: 'auto' }}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;
