import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import HomePage from './pages/HomePage'; // New Authenticated Home
import ExplorePage from './pages/ExplorePage';
import Dashboard from './pages/Dashboard';
import RegisterPage from './pages/RegisterPage';
import SavedPage from './pages/SavedPage'; 
import ProfilePage from './pages/ProfilePage';
import EnquiryPage from './pages/EnquiryPage';
import MessagesPage from './pages/MessagesPage';
import ProtectedRoute from './components/ProtectedRoute'; 
import AIChat from './components/AIChat';

function App() {
  return (
    <Router>
      <div className="font-sans relative min-h-screen bg-gray-50">
        <AIChat />
        
        <Routes>
          {/* Public Landing Page */}
          <Route path="/" element={<LandingPage />} />
          
          {/* Protected Routes - Authenticated users only */}
          <Route 
            path="/home" 
            element={<ProtectedRoute><HomePage /></ProtectedRoute>} 
          />
          <Route 
            path="/explore" 
            element={<ProtectedRoute><ExplorePage /></ProtectedRoute>} 
          />
          <Route 
            path="/dashboard" 
            element={<ProtectedRoute><Dashboard /></ProtectedRoute>} 
          />
          <Route 
            path="/register" 
            element={<ProtectedRoute><RegisterPage /></ProtectedRoute>} 
          />
          <Route 
            path="/saved" 
            element={<ProtectedRoute><SavedPage /></ProtectedRoute>} 
          />
          <Route 
            path="/profile/:id" 
            element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} 
          />
          <Route 
            path="/enquiry/:id" 
            element={<ProtectedRoute><EnquiryPage /></ProtectedRoute>} 
          />
          <Route 
            path="/messages" 
            element={<ProtectedRoute><MessagesPage /></ProtectedRoute>} 
          />
          
          {/* Catch-all route for 404s */}
          <Route path="*" element={
            <div className="flex flex-col items-center justify-center h-screen">
              <h2 className="text-2xl font-bold text-gray-800">404 - Page Not Found</h2>
              <button 
                onClick={() => window.location.href = '/'} 
                className="mt-4 text-blue-600 underline"
              >
                Go back to safety
              </button>
            </div>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;