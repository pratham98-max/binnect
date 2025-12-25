import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { auth } from '../services/firebase';
import Sidebar from '../components/Sidebar';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    businessName: '',
    category: '',
    targetCustomer: '',
    desiredService: '',
    website: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 1. Get the current user's token to identify the owner
      const token = await auth.currentUser?.getIdToken(true);
      
      if (!token) {
        alert("You must be logged in to register a niche.");
        return;
      }

      // 2. Explicitly send the data and initialize review/user arrays
      const payload = {
        ...formData,
        reviews: [],
        activeUsers: []
      };

      const response = await api.post('/providers', payload, {
        headers: { Authorization: `Bearer ${token}` } //
      });

      if (response.status === 201) {
        alert("Niche Deployed Successfully!");
        // 3. Navigate to Dashboard so you can immediately see the count update
        navigate('/dashboard'); 
      }
    } catch (err) {
      console.error("Registration Error:", err.response?.data || err.message);
      const msg = err.response?.data?.message || "Registration failed. Please fill all fields.";
      alert(msg);
    }
  };

  return (
    <div className="bg-[#050505] min-h-screen text-white flex">
      <Sidebar />
      <main className="flex-1 p-12 pt-32 max-w-5xl mx-auto">
        <h1 className="text-7xl font-black italic uppercase tracking-tighter mb-12">
          Register <span className="text-blue-600">Niche</span>
        </h1>
        
        <form onSubmit={handleSubmit} className="bg-white/[0.02] border border-white/5 p-10 rounded-[45px] space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
               <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-2">Business Name</label>
               <input 
                 required 
                 value={formData.businessName}
                 placeholder="e.g. Nexus Tech" 
                 className="w-full bg-black/40 border border-white/10 p-5 rounded-2xl outline-none focus:border-blue-500" 
                 onChange={e => setFormData({...formData, businessName: e.target.value})} 
               />
            </div>
            <div className="space-y-2">
               <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-2">Category</label>
               <input 
                 required 
                 value={formData.category}
                 placeholder="e.g. SaaS" 
                 className="w-full bg-black/40 border border-white/10 p-5 rounded-2xl outline-none focus:border-blue-500" 
                 onChange={e => setFormData({...formData, category: e.target.value})} 
               />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-2">Target Customer</label>
            <textarea 
              required 
              value={formData.targetCustomer}
              placeholder="Who is this for?" 
              className="w-full bg-black/40 border border-white/10 p-5 rounded-2xl h-32 outline-none focus:border-blue-500" 
              onChange={e => setFormData({...formData, targetCustomer: e.target.value})} 
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-2">Core Solution</label>
            <input 
              required 
              value={formData.desiredService}
              placeholder="What primary service do you provide?" 
              className="w-full bg-black/40 border border-white/10 p-5 rounded-2xl outline-none focus:border-blue-500" 
              onChange={e => setFormData({...formData, desiredService: e.target.value})} 
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-2">Website</label>
            <input 
              value={formData.website}
              placeholder="https://yourwebsite.com" 
              className="w-full bg-black/40 border border-white/10 p-5 rounded-2xl outline-none focus:border-blue-500" 
              onChange={e => setFormData({...formData, website: e.target.value})} 
            />
          </div>

          <button 
            type="submit" 
            className="w-full py-6 bg-blue-600 font-black rounded-3xl uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 active:scale-95"
          >
            Deploy Niche to Database
          </button>
        </form>
      </main>
    </div>
  );
};

export default RegisterPage;