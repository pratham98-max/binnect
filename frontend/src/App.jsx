import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import RegisterPage from './pages/RegisterPage';

// Import your new page components
import LandingPage from './pages/LandingPage';
import ExplorePage from './pages/ExplorePage';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <Router>
      <div className="font-sans">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          {/* Catch-all for mistakes */}
          <Route path="*" element={<div className="p-20 text-center">404 - Page Not Found</div>} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;