import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Rocket, Globe, Target, Briefcase, Sparkles, CheckCircle2 } from 'lucide-react';
import api from '../services/api';
import { auth } from '../services/firebase';
import Sidebar from '../components/Sidebar';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    businessName: '',
    category: '',
    desiredService: '',
    targetCustomer: '',
    website: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = await auth.currentUser?.getIdToken(true);
      await api.post('/providers/register', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate('/dashboard');
    } catch (err) {
      console.error("Registration failed:", err);
      alert("Error saving business niche.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex bg-[#050505] min-h-screen text-white">
      <Sidebar />

      <main className="flex-1 ml-24 lg:ml-72 p-8 lg:p-12 relative flex items-center justify-center">
        {/* Background Glows */}
        <div className="absolute top-[-10%] left-[10%] w-[400px] h-[400px] bg-blue-600/10 blur-[120px] rounded-full -z-10" />
        <div className="absolute bottom-[-10%] right-[10%] w-[400px] h-[400px] bg-purple-600/10 blur-[120px] rounded-full -z-10" />

        <div className="max-w-6xl w-full grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Side: Visual/Context */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="hidden lg:block"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-bold mb-6 tracking-widest uppercase">
              <Sparkles size={12} /> Join the Ecosystem
            </div>
            <h1 className="text-6xl font-bold tracking-tighter mb-8 leading-[0.9]">
              LAUNCH YOUR <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 italic">NICHE.</span>
            </h1>
            
            <div className="space-y-8 mt-12">
              <FeatureItem icon={<Target size={20} />} text="Reach precision-targeted partners" />
              <FeatureItem icon={<Globe size={20} />} text="Scale your global visibility score" />
              <FeatureItem icon={<CheckCircle2 size={20} />} text="Verified business networking" />
            </div>
          </motion.div>

          {/* Right Side: Glassmorphic Form */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 p-10 rounded-[40px] shadow-2xl relative"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputGroup 
                  label="Business Name" 
                  icon={<Briefcase size={16} />} 
                  placeholder="e.g. Logify AI"
                  value={formData.businessName}
                  onChange={(e) => setFormData({...formData, businessName: e.target.value})}
                />
                <InputGroup 
                  label="Category" 
                  icon={<Sparkles size={16} />} 
                  placeholder="e.g. SaaS / Marketing"
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                />
              </div>

              <InputGroup 
                label="Desired Service" 
                icon={<Rocket size={16} />} 
                placeholder="What service are you looking for?"
                value={formData.desiredService}
                onChange={(e) => setFormData({...formData, desiredService: e.target.value})}
              />

              <InputGroup 
                label="Target Customer" 
                icon={<Target size={16} />} 
                placeholder="Who is your ideal partner?"
                value={formData.targetCustomer}
                onChange={(e) => setFormData({...formData, targetCustomer: e.target.value})}
              />

              <InputGroup 
                label="Website URL" 
                icon={<Globe size={16} />} 
                placeholder="https://yourwebsite.com"
                value={formData.website}
                onChange={(e) => setFormData({...formData, website: e.target.value})}
              />

              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl transition-all shadow-lg shadow-blue-600/20 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? "Registering..." : "Publish Niche"}
                {!loading && <Rocket size={18} />}
              </button>
            </form>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

// Helper Components
const InputGroup = ({ label, icon, placeholder, value, onChange }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
      {icon} {label}
    </label>
    <input 
      required
      type="text" 
      placeholder={placeholder}
      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-5 outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 transition-all text-sm"
      value={value}
      onChange={onChange}
    />
  </div>
);

const FeatureItem = ({ icon, text }) => (
  <div className="flex items-center gap-4 group">
    <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
      {icon}
    </div>
    <span className="text-gray-400 font-medium group-hover:text-white transition-colors">{text}</span>
  </div>
);

export default RegisterPage;