import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div style={{ textAlign: 'center', marginTop: '4rem' }}>
      <h1 style={{ fontSize: '4rem', marginBottom: '1rem', background: 'linear-gradient(to right, var(--primary), var(--accent))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: '700' }}>
        Book Your Turf Instantly
      </h1>
      <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '3rem', maxWidth: '600px', margin: '0 auto 3rem auto' }}>
        Find and reserve premium box cricket turfs and sports grounds near you with just a few clicks.
      </p>
      <Link to="/dashboard">
        <button style={{ fontSize: '1.1rem', padding: '1rem 2rem' }}>Get Started</button>
      </Link>
    </div>
  );
};

export default Home;
