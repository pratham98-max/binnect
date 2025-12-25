import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { auth } from '../services/firebase';
import api from '../services/api';

const SavedPage = () => {
  const [saved, setSaved] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSaved = async (user) => {
      try {
        // Force a fresh token to ensure the 'protect' middleware accepts the request
        const token = await user.getIdToken(true); 
        const { data } = await api.get('/providers/saved', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Ensure we handle the data correctly if it comes back as null
        setSaved(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load saved businesses", err);
      } finally {
        setLoading(false);
      }
    };

    // Listen for auth state to prevent fetching with a null user
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        fetchSaved(user);
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // NEW: Handle removing a business from the saved list
// Inside SavedPage.jsx
const handleRemove = async (bizId) => {
  try {
    const token = await auth.currentUser?.getIdToken(true); // Fresh token
    
    // MUST be api.delete to match the backend router.delete
    await api.delete(`/providers/saved/${bizId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    // Update the local list so the card disappears
    setSaved(prev => prev.filter(biz => biz._id !== bizId));
  } catch (err) {
    console.error("Remove failed:", err.response?.data || err.message);
    alert("Could not remove business. Please check the console.");
  }
};
  return (
    <div className="min-h-screen bg-white p-8 font-sans text-black">
      <header className="max-w-6xl mx-auto mb-12 flex justify-between items-center">
        <h1 className="text-5xl font-black uppercase italic underline decoration-yellow-400 decoration-8 underline-offset-8 tracking-tighter">
          Saved Niche
        </h1>
        <Link to="/dashboard" className="bg-black text-white px-8 py-3 rounded-2xl font-black uppercase text-sm hover:bg-blue-600 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none">
          Back to Dashboard
        </Link>
      </header>

      <main className="max-w-6xl mx-auto">
        {loading ? (
          <p className="text-2xl font-black italic animate-pulse uppercase">Scanning Bookmarks...</p>
        ) : saved.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {saved.map(biz => (
              <div key={biz._id} className="border-4 border-black p-10 rounded-[40px] shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] bg-white relative group">
                {/* REMOVE BUTTON: The 'X' to un-star */}
                <button 
                  onClick={() => handleRemove(biz._id)}
                  className="absolute top-6 right-6 w-10 h-10 border-4 border-black rounded-full flex items-center justify-center font-black hover:bg-red-500 hover:text-white transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none"
                  title="Remove from saved"
                >
                  ✕
                </button>

                <span className="text-[10px] font-black uppercase bg-green-100 border-2 border-black px-4 py-1 rounded-full mb-6 inline-block tracking-widest">
                  Saved Business
                </span>
                
                <h3 className="text-4xl font-black uppercase italic mb-2 leading-none tracking-tighter">{biz.businessName}</h3>
                <p className="font-black text-blue-600 text-xs uppercase mb-8 tracking-widest">{biz.category}</p>
                
                <div className="bg-gray-50 border-4 border-black p-6 rounded-3xl mb-8">
                  <p className="text-[10px] font-black uppercase text-gray-400 mb-2">Targeting:</p>
                  <p className="font-bold italic text-lg leading-tight">"{biz.targetCustomer}"</p>
                </div>
                
                <button className="w-full bg-black text-white py-5 rounded-2xl font-black uppercase text-lg hover:bg-blue-600 transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,0.2)]">
                  Contact Now
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-32 border-8 border-dashed border-gray-100 rounded-[60px] bg-gray-50">
            <p className="text-4xl font-black text-gray-300 uppercase italic mb-8">No saved niches yet.</p>
            <Link to="/explore" className="bg-black text-white px-10 py-4 rounded-2xl font-black uppercase text-xl hover:bg-yellow-400 hover:text-black transition-all inline-block shadow-[8px_8px_0px_0px_rgba(0,0,0,0.1)]">
              Find Businesses
            </Link>
          </div>
        )}
      </main>
    </div>
  );
};

export default SavedPage;