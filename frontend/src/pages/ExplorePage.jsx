import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const ExplorePage = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch all businesses on load
  useEffect(() => {
    handleSearch();
  }, []);

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Search Header as per your sketch */}
      <header className="bg-white border-b p-6 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-4 items-center justify-between">
          <Link to="/" className="text-2xl font-black text-blue-900">BINNECT</Link>
          
          <form onSubmit={handleSearch} className="flex-1 max-w-2xl relative group">
             <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">🔍</span>
             <input 
              type="text"
              placeholder="search for ur desired niche in buisness"
              className="w-full pl-12 pr-4 py-3 rounded-full border-2 border-black outline-none focus:ring-4 focus:ring-blue-100 transition-all"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </form>

          <Link to="/dashboard" className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center border-2 border-black overflow-hidden hover:scale-105 transition">
             <span className="text-xs font-bold">P</span>
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-8">
        <div className="mb-8 flex justify-between items-end">
           <div>
              <h2 className="text-sm font-black text-gray-400 uppercase tracking-widest">Explore Business Page</h2>
              <p className="text-gray-500 font-medium">Page 3 Results</p>
           </div>
           <div className="flex gap-2 text-xs font-bold uppercase">
              <span className="bg-white border border-black px-3 py-1 rounded">Filter</span>
              <span className="bg-white border border-black px-3 py-1 rounded">Sort</span>
           </div>
        </div>

        {/* Business Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            <p className="col-span-full text-center py-20 font-bold">Scanning Niche...</p>
          ) : results.length > 0 ? (
            results.map(biz => (
              <div key={biz._id} className="bg-white border-2 border-black rounded-2xl overflow-hidden hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all">
                {/* Business Image Area from your sketch */}
                <div className="h-48 bg-gray-200 border-b-2 border-black flex items-center justify-center font-bold text-gray-400">
                  {biz.businessName} Photo
                </div>

                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-black uppercase">{biz.businessName}</h3>
                      <p className="text-blue-600 font-bold text-xs tracking-tighter">{biz.category}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex text-yellow-500 text-xs">⭐⭐⭐⭐⭐</div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase">24 Reviews</span>
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm mb-6 line-clamp-3 font-medium">
                    {biz.description}
                  </p>

                  {/* Info Section from your sketch */}
                  <div className="border-t-2 border-dashed border-gray-100 pt-4 flex justify-between items-center">
                    <div>
                       <p className="text-[10px] font-black text-gray-400 uppercase">Current Customers</p>
                       <p className="text-xs font-bold">150+ Verified</p>
                    </div>
                    <button className="bg-black text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-blue-600 transition">
                      View Profile
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center border-4 border-dashed border-gray-200 rounded-3xl">
               <p className="font-black text-gray-300">No matching niche found.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ExplorePage;