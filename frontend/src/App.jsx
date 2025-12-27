import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import ExplorePage from './pages/ExplorePage';
import Dashboard from './pages/Dashboard';
import RegisterPage from './pages/RegisterPage';
import SavedPage from './pages/SavedPage'; 
import ProfilePage from './pages/ProfilePage';
import EnquiryPage from './pages/EnquiryPage';
import MessagesPage from './pages/MessagesPage';
import ProtectedRoute from './components/ProtectedRoute'; 
import AIChat from './components/AIChat';
// Import a Navbar if you have one, or I can help you build a simple one
// import Navbar from './components/Navbar'; 

function App() {
  return (
    <Router>
      <div className="font-sans relative min-h-screen bg-gray-50">
        {/* Floating AI Chat stays accessible across all pages */}
        <AIChat />
        
        {/* If you add a Navbar here, it will show on every page */}
        {/* <Navbar /> */}

        <Routes>
          {/* Public Home/Landing Page */}
          <Route path="/" element={<LandingPage />} />
          
          {/* Protected Routes - require login to access */}
          <Route path="/explore" element={<ProtectedRoute><ExplorePage /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/register" element={<ProtectedRoute><RegisterPage /></ProtectedRoute>} />
          <Route path="/saved" element={<ProtectedRoute><SavedPage /></ProtectedRoute>} />
          <Route path="/profile/:id" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/enquiry/:id" element={<ProtectedRoute><EnquiryPage /></ProtectedRoute>} />
          <Route path="/messages" element={<ProtectedRoute><MessagesPage /></ProtectedRoute>} />
          
          {/* Catch-all route for 404s (optional but helpful) */}
          <Route path="*" element={<div className="flex items-center justify-center h-screen">Page Not Found</div>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;