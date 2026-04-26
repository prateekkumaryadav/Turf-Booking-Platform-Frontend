import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

const TurfDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [turf, setTurf] = useState(null);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [bookedSlots, setBookedSlots] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTurf = async () => {
      try {
        const res = await api.get(`/turfs/${id}`);
        setTurf(res.data);
      } catch (err) {
        console.error('Failed to fetch turf details', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTurf();
  }, [id]);

  // Fetch booked slots whenever date changes
  useEffect(() => {
    if (!date) { setBookedSlots([]); return; }
    const fetchBookedSlots = async () => {
      try {
        const res = await api.get(`/bookings/turf/${id}`);
        const slotsForDate = res.data
          .filter(b => b.date === date)
          .map(b => b.timeSlot);
        setBookedSlots(slotsForDate);
      } catch (err) {
        console.error('Failed to fetch booked slots', err);
      }
    };
    fetchBookedSlots();
  }, [date, id]);

  const handleBooking = async () => {
    setMessage('');
    setError('');

    const token = localStorage.getItem('token');
    if (!token) {
      setError('You must be logged in to book a turf.');
      return;
    }
    if (!date || !selectedSlot) {
      setError('Please select a date and a time slot.');
      return;
    }

    try {
      await api.post('/bookings', { turfId: id, date, timeSlot: selectedSlot });
      setMessage('Booking confirmed! Redirecting to your bookings...');
      setSelectedSlot('');
      setTimeout(() => navigate('/my-bookings'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create booking.');
    }
  };

  // Get today's date in YYYY-MM-DD for min attribute
  const today = new Date().toISOString().split('T')[0];

  if (loading) return <div style={{ textAlign: 'center', marginTop: '4rem', color: 'var(--text-muted)' }}>Loading Details...</div>;
  if (!turf) return <div style={{ textAlign: 'center', marginTop: '4rem', color: 'var(--text-muted)' }}>Turf not found.</div>;

  return (
    <div style={{ display: 'flex', gap: '2.5rem', flexWrap: 'wrap' }}>
      {/* Turf Info Panel */}
      <div className="glass-panel" style={{ flex: '1 1 500px', padding: '2.5rem' }}>
        <h2 style={{ fontSize: '2.5rem', color: 'var(--primary)', marginBottom: '1rem', fontWeight: 'bold' }}>{turf.name}</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '1.1rem' }}>📍 {turf.location}</p>
        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '2rem' }}>
          <p style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>{turf.description}</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ fontSize: '1.1rem', color: 'var(--text-muted)' }}>Pricing:</span>
          <span style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--accent)' }}>₹{turf.pricePerHour}<span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>/hr</span></span>
        </div>
      </div>

      {/* Booking Panel */}
      <div className="glass-panel" style={{ flex: '1 1 400px', padding: '2.5rem' }}>
        <h3 style={{ marginBottom: '1.5rem', fontSize: '1.8rem', fontWeight: '600' }}>Reserve a Slot</h3>

        {error && <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', border: '1px solid rgba(239, 68, 68, 0.2)' }}>{error}</div>}
        {message && <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', border: '1px solid rgba(16, 185, 129, 0.2)' }}>{message}</div>}

        {/* Step 1: Pick a Date */}
        <div className="form-group">
          <label>1. Select Date</label>
          <input type="date" required min={today} value={date} onChange={(e) => { setDate(e.target.value); setSelectedSlot(''); }} style={{ cursor: 'pointer' }} />
        </div>

        {/* Step 2: Pick a Slot */}
        {date && (
          <div className="form-group">
            <label>2. Pick an Available Slot</label>
            {(!turf.availableSlots || turf.availableSlots.length === 0) ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>No slots have been defined by the owner for this turf yet.</p>
            ) : (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginTop: '0.5rem' }}>
                {turf.availableSlots.map(slot => {
                  const isBooked = bookedSlots.includes(slot);
                  const isSelected = selectedSlot === slot;
                  return (
                    <button
                      key={slot}
                      type="button"
                      disabled={isBooked}
                      onClick={() => setSelectedSlot(slot)}
                      style={{
                        padding: '0.6rem 1.2rem',
                        fontSize: '0.9rem',
                        borderRadius: '8px',
                        fontWeight: '600',
                        background: isBooked
                          ? 'rgba(239, 68, 68, 0.15)'
                          : isSelected
                            ? 'var(--primary)'
                            : 'rgba(255,255,255,0.05)',
                        color: isBooked
                          ? 'rgba(239, 68, 68, 0.5)'
                          : isSelected
                            ? 'white'
                            : 'var(--text-main)',
                        border: isSelected ? '2px solid var(--primary)' : '1px solid rgba(255,255,255,0.1)',
                        cursor: isBooked ? 'not-allowed' : 'pointer',
                        textDecoration: isBooked ? 'line-through' : 'none',
                        transform: isSelected ? 'scale(1.05)' : 'scale(1)',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      {slot}
                    </button>
                  );
                })}
              </div>
            )}
            {date && turf.availableSlots && turf.availableSlots.length > 0 && (
              <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <span>🟢 Available</span>
                <span>🔴 Booked</span>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Confirm */}
        {selectedSlot && (
          <div style={{ marginTop: '1.5rem' }}>
            <div style={{ background: 'rgba(56, 189, 248, 0.08)', padding: '1rem', borderRadius: '10px', border: '1px solid rgba(56, 189, 248, 0.2)', marginBottom: '1rem' }}>
              <p style={{ fontWeight: '600', marginBottom: '0.3rem' }}>Booking Summary</p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>📅 {date} &nbsp; ⏰ {selectedSlot} &nbsp; 💰 ₹{turf.pricePerHour}</p>
            </div>
            <button onClick={handleBooking} style={{ width: '100%', fontSize: '1.1rem', padding: '1rem' }}>Confirm Booking</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TurfDetails;
