import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import TurfList from './pages/TurfList';
import TurfDetails from './pages/TurfDetails';
import MyBookings from './pages/MyBookings';
import Dashboard from './pages/Dashboard';
import EditTurf from './pages/EditTurf';
import OwnerBookings from './pages/OwnerBookings';
import OAuthCallback from './pages/OAuthCallback';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <main className="container main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/turfs" element={<TurfList />} />
            <Route path="/turfs/:id" element={<TurfDetails />} />
            <Route path="/my-bookings" element={<MyBookings />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/edit-turf/:id" element={<EditTurf />} />
            <Route path="/owner-bookings" element={<OwnerBookings />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/oauth-callback" element={<OAuthCallback />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
