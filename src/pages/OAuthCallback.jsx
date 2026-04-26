import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const OAuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');
    const userParam = searchParams.get('user');

    if (token && userParam) {
      try {
        const user = JSON.parse(userParam);
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));

        // Redirect based on role
        if (user.role === 'owner') {
          navigate('/dashboard', { replace: true });
        } else {
          navigate('/turfs', { replace: true });
        }
      } catch (err) {
        console.error('OAuth callback error:', err);
        navigate('/login', { replace: true });
      }
    } else {
      navigate('/login', { replace: true });
    }
  }, [searchParams, navigate]);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
      <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
        <h2 style={{ marginBottom: '1rem' }}>Signing you in...</h2>
        <p style={{ color: 'var(--text-muted)' }}>Please wait while we complete your Google sign-in.</p>
      </div>
    </div>
  );
};

export default OAuthCallback;
