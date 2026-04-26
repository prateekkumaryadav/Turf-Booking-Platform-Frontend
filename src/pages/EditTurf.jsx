import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

const SLOT_OPTIONS = [
  '06:00-07:00', '07:00-08:00', '08:00-09:00', '09:00-10:00',
  '10:00-11:00', '11:00-12:00', '12:00-13:00', '13:00-14:00',
  '14:00-15:00', '15:00-16:00', '16:00-17:00', '17:00-18:00',
  '18:00-19:00', '19:00-20:00', '20:00-21:00', '21:00-22:00',
];

const EditTurf = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    name: '', location: '', pricePerHour: '', description: '', availableSlots: []
  });

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData || JSON.parse(userData).role !== 'owner') {
      navigate('/login');
      return;
    }
    const fetchTurf = async () => {
      try {
        const res = await api.get(`/turfs/${id}`);
        setFormData({
          name: res.data.name,
          location: res.data.location,
          pricePerHour: res.data.pricePerHour,
          description: res.data.description,
          availableSlots: res.data.availableSlots || []
        });
      } catch (err) {
        setError('Failed to load turf details.');
      } finally {
        setLoading(false);
      }
    };
    fetchTurf();
  }, [id, navigate]);

  const toggleSlot = (slot) => {
    setFormData(prev => {
      const slots = prev.availableSlots.includes(slot)
        ? prev.availableSlots.filter(s => s !== slot)
        : [...prev.availableSlots, slot];
      return { ...prev, availableSlots: slots };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    if (formData.availableSlots.length === 0) {
      setError('Please select at least one available time slot.');
      setSaving(false);
      return;
    }
    try {
      await api.put(`/turfs/${id}`, formData);
      setSuccess('Turf updated successfully!');
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update turf.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this turf? This action cannot be undone.')) return;
    try {
      await api.delete(`/turfs/${id}`);
      alert('Turf deleted.');
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete turf.');
    }
  };

  if (loading) return <div style={{ textAlign: 'center', marginTop: '4rem', color: 'var(--text-muted)' }}>Loading...</div>;

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Edit Turf</h2>
        <button onClick={() => navigate('/dashboard')} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', fontSize: '0.9rem', padding: '0.5rem 1rem' }}>← Back to Dashboard</button>
      </div>

      <div className="glass-panel" style={{ padding: '2.5rem' }}>
        {error && <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', border: '1px solid rgba(239, 68, 68, 0.2)' }}>{error}</div>}
        {success && <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', border: '1px solid rgba(16, 185, 129, 0.2)' }}>{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Turf Name</label>
            <input type="text" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Location</label>
            <input type="text" required value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Price Per Hour (₹)</label>
            <input type="number" required value={formData.pricePerHour} onChange={e => setFormData({ ...formData, pricePerHour: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea required rows="4" style={{ width: '100%', padding: '0.85rem 1.2rem', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-main)', borderRadius: '8px', outline: 'none', resize: 'vertical' }} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })}></textarea>
          </div>
          <div className="form-group">
            <label>Available Time Slots</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', marginTop: '0.5rem' }}>
              {SLOT_OPTIONS.map(slot => {
                const isActive = formData.availableSlots.includes(slot);
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
            <p style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>{formData.availableSlots.length} slot(s) selected</p>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
            <button type="submit" disabled={saving} style={{ flex: 1, padding: '1rem', fontSize: '1.05rem' }}>
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            <button type="button" onClick={handleDelete} style={{ padding: '1rem 1.5rem', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', color: 'var(--danger)', fontSize: '1.05rem' }}>
              Delete Turf
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTurf;
