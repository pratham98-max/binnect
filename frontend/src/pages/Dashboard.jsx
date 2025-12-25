import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { auth } from '../services/firebase';
import api from '../services/api';

const Dashboard = () => {
  const [myBusinesses, setMyBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  // 1. Listen for auth state changes to ensure user is loaded
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      setUser(firebaseUser);
      if (!firebaseUser) {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  // 2. Fetch data only when the user is confirmed
  useEffect(() => {
    const fetchMyData = async () => {
      if (!user) return;
      
      try {
        const token = await user.getIdToken();
        const { data } = await api.get('/providers/my-businesses', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMyBusinesses(data);
      } catch (err) {
        console.error("Dashboard load error", err);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchMyData();
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-100 flex p-6 gap-6 font-sans text-black">
      {/* MAIN WORKSPACE: Large rounded box */}
      <div className="flex-1 bg-white border-4 border-black rounded-[60px] p-12 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] overflow-y-auto">
        <h2 className="text-5xl font-black mb-10 uppercase italic tracking-tighter">My Workspace</h2>
        
        {loading ? (
          <p className="font-bold italic animate-pulse">Scanning your niche...</p>
        ) : myBusinesses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {myBusinesses.map(biz => (
              <div key={biz._id} className="border-4 border-black p-8 rounded-[40px] hover:bg-yellow-50 transition-all hover:translate-x-1 hover:translate-y-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <h3 className="text-2xl font-black uppercase mb-1 leading-none">{biz.businessName}</h3>
                <p className="text-blue-600 font-black text-xs mb-6 uppercase tracking-widest">{biz.category}</p>
                
                <div className="text-sm font-bold border-t-2 border-black pt-4">
                  <span className="block text-[10px] font-black uppercase text-gray-400 mb-1">Targeting:</span>
                  <p className="italic leading-tight">"{biz.targetCustomer}"</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="h-full min-h-[400px] flex flex-col items-center justify-center border-8 border-dashed border-gray-200 rounded-[60px] p-20 text-center">
            <p className="text-3xl font-black text-gray-300 uppercase mb-8 italic">Your workspace is empty</p>
            <Link to="/register" className="bg-black text-white px-12 py-4 rounded-2xl font-black uppercase text-xl hover:bg-blue-600 transition-colors shadow-[8px_8px_0px_0px_rgba(0,0,0,0.2)]">
              Register First Business
            </Link>
          </div>
        )}
      </div>

      {/* RIGHT SIDEBAR: Profile and Menu */}
      <div className="w-80 space-y-6">
        <div className="flex flex-col items-center p-8 bg-white border-4 border-black rounded-[40px] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <div className="w-24 h-24 rounded-full border-4 border-black mb-4 overflow-hidden shadow-inner bg-gray-100">
            {user?.photoURL ? (
              <img src={user.photoURL} alt="profile" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center font-black text-2xl">?</div>
            )}
          </div>
          <p className="font-black text-center uppercase leading-tight tracking-tighter">{user?.displayName || "Business User"}</p>
        </div>

        <div className="bg-white border-4 border-black p-8 rounded-[40px] flex flex-col gap-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <button className="text-left font-black uppercase hover:text-blue-600 transition-all text-sm tracking-tight">Profile Section</button>
          <button className="text-left font-black uppercase hover:text-blue-600 transition-all text-sm tracking-tight">Saved Businesses</button>
          <Link to="/saved" className="text-left font-black uppercase hover:text-blue-600 transition-all text-sm tracking-tight">
  Saved Businesses
</Link>
          <button className="text-left font-black uppercase hover:text-blue-600 transition-all text-sm tracking-tight">My Contracts</button>
          <button 
            className="text-left font-black uppercase text-red-500 border-t-4 border-black pt-6 mt-2 hover:italic" 
            onClick={() => auth.signOut()}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;