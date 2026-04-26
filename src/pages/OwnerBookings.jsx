import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const OwnerBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData || JSON.parse(userData).role !== 'owner') {
      navigate('/login');
      return;
    }
    const fetchBookings = async () => {
      try {
        const res = await api.get('/bookings/owner');
        setBookings(res.data);
      } catch (err) {
        console.error('Failed to fetch owner bookings', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [navigate]);

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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Customer Bookings</h2>
        <button onClick={() => navigate('/dashboard')} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', fontSize: '0.9rem', padding: '0.5rem 1rem' }}>← Back to Dashboard</button>
      </div>

      {bookings.length === 0 ? (
        <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>No customers have booked your turfs yet.</p>
        </div>
      ) : (
        <div className="glass-panel" style={{ padding: '1.5rem', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '700px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid rgba(255,255,255,0.1)' }}>
                <th style={thStyle}>Customer</th>
                <th style={thStyle}>Email</th>
                <th style={thStyle}>Turf</th>
                <th style={thStyle}>Date</th>
                <th style={thStyle}>Slot</th>
                <th style={thStyle}>Amount</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map(b => (
                <tr key={b._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={tdStyle}><span style={{ fontWeight: '600' }}>{b.user?.name || 'N/A'}</span></td>
                  <td style={tdStyle}><span style={{ color: 'var(--accent)' }}>{b.user?.email || 'N/A'}</span></td>
                  <td style={tdStyle}>{b.turf?.name || 'N/A'}</td>
                  <td style={tdStyle}>{new Date(b.date).toLocaleDateString()}</td>
                  <td style={tdStyle}><span style={{ background: 'rgba(56, 189, 248, 0.1)', padding: '0.25rem 0.6rem', borderRadius: '4px', fontWeight: '600', fontSize: '0.9rem' }}>{b.timeSlot}</span></td>
                  <td style={tdStyle}>₹{b.totalPrice}</td>
                  <td style={tdStyle}>
                    <span style={{
                      display: 'inline-block', padding: '0.25rem 0.6rem', borderRadius: '6px', fontSize: '0.8rem', fontWeight: '600',
                      background: b.status === 'confirmed' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                      color: b.status === 'confirmed' ? 'var(--success)' : 'var(--danger)',
                    }}>
                      {b.status.toUpperCase()}
                    </span>
                  </td>
                  <td style={tdStyle}>
                    {b.status === 'confirmed' && (
                      <button 
                        onClick={() => handleCancelBooking(b._id)}
                        style={{ background: 'transparent', color: 'var(--danger)', border: '1px solid var(--danger)', padding: '0.25rem 0.6rem', fontSize: '0.8rem', borderRadius: '4px' }}
                      >
                        Cancel
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const thStyle = { textAlign: 'left', padding: '0.75rem 1rem', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' };
const tdStyle = { padding: '0.85rem 1rem', fontSize: '0.95rem' };

export default OwnerBookings;
