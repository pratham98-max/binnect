import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Star, ExternalLink, LayoutGrid, Zap, Sparkles } from 'lucide-react';
import api from '../services/api';
import { auth } from '../services/firebase';

const ExplorePage = () => {
  const [results, setResults] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);

  // 1. Initial Load & Search Logic
  const handleSearch = async () => {
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

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      handleSearch();
    }, 300); // Debounce search for smoother UI

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  // 2. Save Logic with High-Fidelity Feedback
  const handleSave = async (bizId) => {
    try {
      const token = await auth.currentUser?.getIdToken(true);
      if (!token) return alert("Please sign in to save!");
      
      await api.post(`/providers/save/${bizId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("✨ Niche bookmarked in your workspace!");
    } catch (err) {
      console.error("Save failed", err);
    }
  };

  return (
    <div className="min-h-screen p-6 lg:p-12 relative overflow-hidden bg-[#050505]">
      {/* 3D Animated Background Orbs */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1] 
        }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/20 blur-[150px] rounded-full -z-10" 
      />
      
      <header className="max-w-7xl mx-auto mb-20 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-bold mb-4 tracking-widest uppercase">
              <Sparkles size={12} /> Live Marketplace
            </div>
            <h1 className="text-5xl font-bold tracking-tighter mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/40">
              Explore Niche
            </h1>
            <p className="text-gray-500 font-medium">Precision-targeted business intelligence at your fingertips.</p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative w-full md:w-[450px] group"
          >
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-500 transition-colors" size={20} />
            <input 
              type="text"
              placeholder="Search industries, services, or targets..."
              className="w-full bg-white/5 border border-white/10 rounded-[24px] py-5 pl-14 pr-6 outline-none focus:border-blue-500/50 focus:ring-8 focus:ring-blue-500/5 transition-all text-sm font-medium placeholder:text-gray-600"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </motion.div>
        </div>
      </header>

      {/* 3. Grid with Staggered Animations */}
      <main className="max-w-7xl mx-auto">
        {loading && results.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-40 gap-4">
             <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
             <p className="text-gray-500 font-bold tracking-widest text-xs uppercase">Analyzing Niche Data...</p>
          </div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            initial="hidden"
            animate="show"
            variants={{
              show: { transition: { staggerChildren: 0.1 } }
            }}
          >
            <AnimatePresence mode='popLayout'>
              {results.map((biz) => (
                <motion.div
                  variants={{
                    hidden: { opacity: 0, y: 30 },
                    show: { opacity: 1, y: 0 }
                  }}
                  whileHover={{ 
                    y: -12,
                    transition: { duration: 0.3, ease: "easeOut" }
                  }}
                  key={biz._id}
                  className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-[35px] p-8 group relative flex flex-col h-full shadow-2xl hover:border-blue-500/30 transition-colors"
                >
                  {/* Interactive Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-[35px]" />
                  
                  <div className="flex justify-between items-start mb-10 relative z-10">
                    <div className="w-14 h-14 bg-blue-600/10 rounded-[20px] flex items-center justify-center text-blue-500 border border-blue-500/20 shadow-inner">
                      <LayoutGrid size={28} />
                    </div>
                    <button 
                      onClick={() => handleSave(biz._id)}
                      className="bg-white/5 hover:bg-white/10 border border-white/10 p-4 rounded-full text-gray-500 hover:text-yellow-400 transition-all active:scale-90"
                    >
                      <Star size={20} fill="currentColor" className="fill-transparent group-hover:fill-current" />
                    </button>
                  </div>

                  <h3 className="text-2xl font-bold mb-2 tracking-tight group-hover:text-blue-400 transition-colors">{biz.businessName}</h3>
                  <div className="flex items-center gap-2 mb-8">
                    <div className="w-1 h-1 bg-blue-500 rounded-full" />
                    <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.2em]">{biz.category}</p>
                  </div>
                  
                  <div className="flex-1 space-y-6 mb-10 relative z-10">
                    <div className="p-5 bg-white/[0.03] rounded-[24px] border border-white/5 group-hover:bg-white/[0.05] transition-colors">
                      <p className="text-[10px] text-gray-500 font-bold uppercase mb-2 flex items-center gap-2">
                        <Zap size={10} className="text-blue-500" /> Target Customer
                      </p>
                      <p className="text-sm italic text-gray-300 leading-relaxed">
                        "{biz.targetCustomer || 'High-growth innovative partners'}"
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 relative z-10">
                    <button className="flex-[2] py-4 bg-white text-black font-black rounded-[18px] hover:bg-blue-600 hover:text-white transition-all shadow-xl active:scale-95 text-xs uppercase tracking-widest">
                      View Profile
                    </button>
                    <a 
                      href={biz.website?.startsWith('http') ? biz.website : `https://${biz.website}`} 
                      target="_blank" 
                      rel="noreferrer"
                      className="flex-1 flex items-center justify-center bg-white/5 border border-white/10 rounded-[18px] hover:bg-white/10 transition-all active:scale-95"
                    >
                      <ExternalLink size={20} className="text-gray-400" />
                    </a>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default ExplorePage;