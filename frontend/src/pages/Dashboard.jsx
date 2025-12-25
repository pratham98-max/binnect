import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, Plus, Star, Users, MessageSquare, Zap, ArrowRight, TrendingUp } from 'lucide-react';
import api from '../services/api';
import { auth } from '../services/firebase'; 
import Sidebar from '../components/Sidebar';
import MessagesPage from './MessagesPage'; 

const Dashboard = () => {
  const [myNiches, setMyNiches] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWorkspace = async () => {
    try {
      setLoading(true);
      // Retrieve fresh token from Firebase
      const token = await auth.currentUser?.getIdToken(true);
      
      if (!token) return;

      // GET request with the Bearer token
      const { data } = await api.get('/providers/my-workspace', {
        headers: { Authorization: `Bearer ${token}` }
      });

      setMyNiches(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Dashboard Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkspace();
  }, []);

  const totalReviews = myNiches.reduce((acc, niche) => acc + (niche.reviews?.length || 0), 0);

  if (loading) return <div className="min-h-screen bg-[#050505] flex items-center justify-center text-blue-500 font-black animate-pulse uppercase tracking-[0.3em]">Syncing Workspace...</div>;

  return (
    <div className="bg-[#050505] min-h-screen text-white flex">
      <Sidebar />
      <main className="flex-1 p-8 lg:p-12 pt-32 max-w-7xl mx-auto w-full">
        <header className="mb-12 flex justify-between items-end">
          <div>
            <h1 className="text-5xl font-black italic uppercase tracking-tighter">Workspace</h1>
            <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.3em] mt-2">Central Command Center</p>
          </div>
          <div className="flex gap-4">
            <button onClick={fetchWorkspace} className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] uppercase font-black tracking-widest hover:bg-white/10 transition-all">Refresh</button>
            <Link to="/register" className="px-6 py-3 bg-blue-600 text-white font-black rounded-xl flex items-center gap-2 hover:bg-blue-700 transition-all text-[10px] uppercase tracking-widest">
              <Plus size={16} /> New Business
            </Link>
          </div>
        </header>

        {/* METRICS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-white/[0.03] border border-white/5 p-8 rounded-[35px]">
            <Zap size={20} className="text-blue-500 mb-4"/>
            <p className="text-4xl font-black italic">{myNiches.length}</p>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mt-1">Total Businesses</p>
          </div>
          <div className="bg-white/[0.03] border border-white/5 p-8 rounded-[35px]">
            <Star size={20} className="text-purple-500 mb-4"/>
            <p className="text-4xl font-black italic">{totalReviews}</p>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mt-1">Feedback Received</p>
          </div>
          <div className="bg-white/[0.03] border border-white/5 p-8 rounded-[35px]">
            <TrendingUp size={20} className="text-green-500 mb-4"/>
            <p className="text-4xl font-black italic">94%</p>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mt-1">Visibility Score</p>
          </div>
        </div>

        {/* LISTINGS */}
        <section className="mb-20">
          <h2 className="text-xs font-black uppercase tracking-[0.4em] text-gray-500 mb-8 flex items-center gap-3"><LayoutDashboard size={16} /> Registered Niches & Feedback</h2>
          {myNiches.length === 0 ? (
            <div className="py-20 text-center border border-dashed border-white/10 rounded-[40px] bg-white/[0.01]">
              <p className="text-gray-600 font-bold uppercase text-[10px] tracking-widest">No Active Deployments Found</p>
              <Link to="/register" className="text-blue-500 text-[10px] font-black uppercase mt-4 block underline">Deploy your first niche →</Link>
            </div>
          ) : (
            <div className="grid gap-6">
              {myNiches.map((niche) => (
                <div key={niche._id} className="bg-white/[0.02] border border-white/10 rounded-[40px] p-8 flex flex-col lg:flex-row gap-8 hover:bg-white/[0.04] transition-all">
                  <div className="flex-1 border-r border-white/5 pr-8">
                    <span className="text-[9px] font-black uppercase tracking-widest text-blue-500">{niche.category}</span>
                    <h3 className="text-3xl font-black italic uppercase tracking-tighter mt-1">{niche.businessName}</h3>
                    <div className="flex gap-4 mt-6 text-[10px] font-bold text-gray-400"><Users size={12} /> {niche.activeUsers?.length || 0} Partners</div>
                  </div>
                  <div className="flex-[1.5]">
                    <p className="text-[9px] font-black uppercase tracking-widest text-gray-600 mb-4">Latest Review</p>
                    {niche.reviews?.length > 0 ? (
                      <div className="bg-black/40 p-5 rounded-3xl border border-white/5">
                        <div className="flex justify-between mb-2">
                          <span className="text-[10px] font-bold text-blue-400">{niche.reviews[0].userName}</span>
                          <div className="flex gap-1 text-yellow-500">{[...Array(niche.reviews[0].rating)].map((_, i) => <Star key={i} size={10} fill="currentColor" />)}</div>
                        </div>
                        <p className="text-xs text-gray-400 italic">"{niche.reviews[0].comment}"</p>
                      </div>
                    ) : <p className="text-xs text-gray-700 italic font-medium">Awaiting verified feedback...</p>}
                  </div>
                  <div className="flex items-center"><Link to={`/profile/${niche._id}`} className="p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-all"><ArrowRight size={20} /></Link></div>
                </div>
              ))}
            </div>
          )}
        </section>

       
      </main>
    </div>
  );
};

export default Dashboard;