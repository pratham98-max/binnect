import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// 1. Import your page components
import LandingPage from './pages/LandingPage';
import ExplorePage from './pages/ExplorePage';
import Dashboard from './pages/Dashboard';
import RegisterPage from './pages/RegisterPage';
import SavedPage from './pages/SavedPage'; // Ensure this file exists in src/pages!

function App() {
  return (
    <Router>
      <div className="font-sans">
        <Routes>
          {/* Main Landing Page */}
          <Route path="/" element={<LandingPage />} />
          
          {/* Business Discovery */}
          <Route path="/explore" element={<ExplorePage />} />
          
          {/* User Workspace */}
          <Route path="/dashboard" element={<Dashboard />} />
          
          {/* Registration Form */}
          <Route path="/register" element={<RegisterPage />} />
          
          {/* 2. THE NEW SAVED BUSINESSES ROUTE */}
          <Route path="/saved" element={<SavedPage />} />
          
          {/* Catch-all for mistakes */}
          <Route path="*" element={
            <div className="p-20 text-center font-black uppercase italic">
              <h1 className="text-6xl mb-4">404</h1>
              <p>Niche Not Found</p>
            </div>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;