import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { auth } from '../services/firebase';

const ExplorePage = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // 1. Initial Load: Fetch all businesses
  useEffect(() => {
    handleSearch();
  }, []);

  // 2. Search Logic
  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.get(`/providers/search?query=${query}`);
      setResults(data);
    } catch (err) {
      console.error("Search failed", err);
    } finally {
      setLoading(false);
    }
  };

  // 3. CORRECTED Save Logic: Matches /providers/save/:id
  const handleSaveBusiness = async (bizId) => {
    try {
      // Check if user is logged in
      const user = auth.currentUser;
      if (!user) {
        alert("Please sign in on the home page first!");
        return;
      }

      // FORCE a fresh token refresh to avoid auth session expiration errors
      const token = await user.getIdToken(true); 
      
      // Send POST request to the correct backend route
      await api.post(`/providers/save/${bizId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      alert("✅ Business saved to your workspace!");
    } catch (err) {
      // Improved error logging for debugging
      console.error("Save failed:", err.response?.data || err.message);
      alert("Could not save. Please try logging out and back in to refresh your session.");
    }
  };

  return (
    <div className="min-h-screen bg-white text-black font-sans">
      {/* Neo-Brutalist Header */}
      <header className="bg-white border-b-4 border-black p-6 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-6 items-center justify-between">
          <Link to="/" className="text-3xl font-black italic text-blue-900 tracking-tighter">BINNECT</Link>
          
          <form onSubmit={handleSearch} className="flex-1 max-w-2xl relative">
             <span className="absolute left-6 top-1/2 -translate-y-1/2 text-xl">🔍</span>
             <input 
              type="text"
              placeholder="search for ur desired niche in buisness"
              className="w-full pl-16 pr-6 py-4 rounded-full border-4 border-black font-bold outline-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:bg-yellow-50 transition-all"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </form>

          <Link to="/dashboard" className="w-12 h-12 bg-white rounded-full flex items-center justify-center border-4 border-black overflow-hidden hover:rotate-12 transition shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
             {auth.currentUser?.photoURL ? (
               <img src={auth.currentUser.photoURL} alt="profile" />
             ) : (
               <span className="text-sm font-black uppercase">P</span>
             )}
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-8">
        <div className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
           <div>
              <h2 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Explore Business Page</h2>
              <p className="text-4xl font-black uppercase italic underline decoration-blue-500 underline-offset-4">Results</p>
           </div>
           <div className="flex gap-4">
              <button className="bg-white border-4 border-black px-6 py-2 rounded-xl font-black uppercase text-sm hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all">Filter</button>
              <button className="bg-white border-4 border-black px-6 py-2 rounded-xl font-black uppercase text-sm hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all">Sort</button>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {loading ? (
            <div className="col-span-full py-20 text-center font-black uppercase italic animate-pulse">Scanning the Niche...</div>
          ) : results.length > 0 ? (
            results.map(biz => (
              <div key={biz._id} className="group bg-white border-4 border-black rounded-[40px] overflow-hidden hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all flex flex-col h-full">
                <div className="h-40 bg-blue-50 border-b-4 border-black flex items-center justify-center p-6 relative">
                  <span className="text-3xl font-black opacity-10 uppercase tracking-tighter absolute select-none text-gray-300">{biz.businessName}</span>
                  <div className="bg-white border-4 border-black p-4 rounded-2xl font-black uppercase italic text-sm z-10">
                    {biz.category}
                  </div>
                  
                  {/* STAR/SAVE BUTTON */}
                  <button 
                    onClick={() => handleSaveBusiness(biz._id)} 
                    className="absolute top-4 right-4 w-12 h-12 bg-white border-4 border-black rounded-full flex items-center justify-center hover:bg-yellow-400 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none z-20"
                    title="Save to Workspace"
                  >
                    <span className="text-xl">⭐</span>
                  </button>
                </div>

                <div className="p-8 flex flex-col flex-1">
                  <div className="flex justify-between items-start mb-6">
                    <h3 className="text-2xl font-black uppercase leading-none tracking-tighter">{biz.businessName}</h3>
                    <div className="flex text-yellow-500 text-xs">⭐⭐⭐⭐⭐</div>
                  </div>

                  <div className="space-y-4 mb-8 flex-1">
                    <div>
                      <p className="text-[10px] font-black uppercase text-gray-400 mb-1 tracking-widest">Desired Service</p>
                      <p className="font-bold text-gray-800 leading-tight italic">
                        {biz.desiredService || "Premium Business Solutions"}
                      </p>
                    </div>
                    <div className="bg-yellow-50 border-2 border-black p-4 rounded-2xl">
                      <p className="text-[10px] font-black uppercase text-black mb-1">Target Customer</p>
                      <p className="text-sm font-black text-blue-900 leading-none underline decoration-yellow-500">
                        {biz.targetCustomer || "Innovative Partners"}
                      </p>
                    </div>
                  </div>

                  <div className="pt-6 border-t-2 border-black flex justify-between items-center gap-4">
                    <button className="flex-1 bg-black text-white py-4 rounded-2xl font-black uppercase text-sm hover:bg-blue-600 transition-all active:translate-y-1">
                      View Profile
                    </button>
                    <a 
                      href={biz.website?.startsWith('http') ? biz.website : `https://${biz.website}`} 
                      target="_blank" 
                      rel="noreferrer"
                      className="bg-white border-4 border-black p-3 rounded-2xl hover:bg-gray-100 transition-all"
                    >
                      🌐
                    </a>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-32 text-center border-8 border-dashed border-gray-100 rounded-[60px]">
               <p className="text-4xl font-black text-gray-200 uppercase tracking-tighter italic">No matching niche found.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ExplorePage;