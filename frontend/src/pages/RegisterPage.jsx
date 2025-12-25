import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { auth } from '../services/firebase';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [formData, setFormData] = useState({
    businessName: '',
    category: '',
    description: '',
    desiredService: '', 
    targetCustomer: '',  
    website: ''
  });

  // 1. Listen for auth state changes to ensure we have a valid user
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
      }
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentUser) {
      alert("No active session found. Please sign in on the home page.");
      navigate('/');
      return;
    }

    try {
      // 2. Force a fresh token retrieval right before the API call
      const token = await currentUser.getIdToken(true); 
      
      await api.post('/providers/register', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert("Business Registered Successfully!");
      navigate('/dashboard'); 
    } catch (err) {
      console.error("Registration failed", err);
      const errorMsg = err.response?.data?.message || "Error saving business. Your session might have expired.";
      alert(errorMsg);
    }
  };

  if (authLoading) return (
    <div className="min-h-screen flex items-center justify-center font-black uppercase italic">
      Verifying Identity...
    </div>
  );

  return (
    <div className="min-h-screen bg-white p-8 font-sans">
      {/* Top Header Box from Sketch */}
      <div className="max-w-4xl mx-auto border-4 border-black p-4 mb-10 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <h1 className="text-center font-black uppercase italic tracking-widest text-lg">
          register your business now
        </h1>
      </div>

      {/* Main Registration Form */}
      <div className="max-w-5xl mx-auto border-4 border-black rounded-[40px] p-12 bg-white shadow-[15px_15px_0px_0px_rgba(0,0,0,1)]">
        <h2 className="text-4xl font-black mb-12 uppercase italic underline decoration-blue-500 underline-offset-8">
          Business details
        </h2>
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Left Column */}
          <div className="space-y-8">
            <div>
              <label className="block font-black uppercase text-sm mb-3">business name</label>
              <input 
                required
                placeholder="Enter Company Name"
                className="w-full p-4 border-4 border-black rounded-2xl font-bold outline-none focus:bg-yellow-50 transition-colors"
                onChange={(e) => setFormData({...formData, businessName: e.target.value})}
              />
            </div>
            <div>
              <label className="block font-black uppercase text-sm mb-3">category</label>
              <input 
                required
                placeholder="e.g. Marketing, Logistics, Tech"
                className="w-full p-4 border-4 border-black rounded-2xl font-bold outline-none focus:bg-yellow-50 transition-colors"
                onChange={(e) => setFormData({...formData, category: e.target.value})}
              />
            </div>
            <div>
              <label className="block font-black uppercase text-sm mb-3">desired business or service</label>
              <textarea 
                required
                placeholder="What exactly do you provide?"
                className="w-full p-4 border-4 border-black rounded-2xl font-bold outline-none focus:bg-yellow-50 transition-colors h-32"
                onChange={(e) => setFormData({...formData, desiredService: e.target.value, description: e.target.value})}
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            <div>
              <label className="block font-black uppercase text-sm mb-3">and some more info (Website/Links)</label>
              <input 
                placeholder="https://yourwebsite.com"
                className="w-full p-4 border-4 border-black rounded-2xl font-bold outline-none focus:bg-yellow-50 transition-colors"
                onChange={(e) => setFormData({...formData, website: e.target.value})}
              />
            </div>
            <div>
              <label className="block font-black uppercase text-sm mb-3">desired customer business</label>
              <textarea 
                required
                placeholder="Describe your ideal client / buyer..."
                className="w-full p-4 border-4 border-black rounded-2xl font-bold outline-none focus:bg-yellow-50 transition-colors h-32"
                onChange={(e) => setFormData({...formData, targetCustomer: e.target.value})}
              />
            </div>
            
            <button 
              type="submit" 
              className="w-full bg-black text-white py-6 rounded-3xl font-black text-2xl uppercase tracking-tighter hover:bg-blue-700 hover:shadow-[8px_8px_0px_0px_rgba(30,58,138,1)] transition-all active:translate-y-1"
            >
              Confirm Registration
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;