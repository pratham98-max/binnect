import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { loginWithGoogle, auth } from '../services/firebase';
import api from '../services/api';

const LandingPage = () => {
  const [user, setUser] = useState(null);
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Monitor Authentication State
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // 2. Fetch Trending Businesses for the bottom section
  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const { data } = await api.get('/providers/search');
        setTrending(data.slice(0, 3)); // Show top 3 as per sketch
      } catch (err) {
        console.error("Error fetching trending:", err);
      }
    };
    fetchTrending();
  }, []);

  // 3. Handle Login and Database Sync
  const handleAuth = async () => {
    try {
      const firebaseUser = await loginWithGoogle();
      if (firebaseUser) {
        const token = await firebaseUser.getIdToken();
        // Sync user with MongoDB so they exist in our database
        await api.post('/auth/sync', {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
    } catch (err) {
      console.error("Auth failed:", err);
    }
  };

  const handleLogout = () => auth.signOut();

  if (loading) return <div className="h-screen flex items-center justify-center font-black italic">LOADING BINNECT...</div>;

  return (
    <div className="min-h-screen bg-white font-sans text-black">
      {/* HEADER: Matches your sketch top bar */}
      <nav className="flex justify-between items-center p-6 border-b-4 border-black">
        <div className="text-3xl font-black italic tracking-tighter text-blue-900">BINNECT</div>
        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <button 
                onClick={handleLogout}
                className="text-xs font-black uppercase underline hover:text-red-600"
              >
                Logout
              </button>
              <Link to="/dashboard" className="flex items-center gap-2 border-4 border-black p-1 pr-4 rounded-full font-bold hover:bg-gray-50">
                <img src={user.photoURL} className="w-8 h-8 rounded-full border-2 border-black" alt="profile" />
                <span className="text-sm uppercase">{user.displayName.split(' ')[0]}</span>
              </Link>
            </div>
          ) : (
            <button 
              onClick={handleAuth}
              className="bg-blue-600 text-white border-4 border-black px-6 py-2 rounded-xl font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all"
            >
              Sign In
            </button>
          )}
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-16 text-center">
        {/* HERO SECTION */}
        <h1 className="text-7xl font-black mb-4 uppercase tracking-tighter leading-none">
          The B2B Connection Engine
        </h1>
        <p className="text-xl font-bold text-gray-500 mb-12">
          Connect with vetted providers, cut costs, and grow faster.
        </p>

        {/* AUTH BOX: Displays Sign Up option directly on landing page */}
        {!user ? (
          <div className="max-w-2xl mx-auto p-10 border-4 border-black rounded-[40px] bg-yellow-400 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] mb-20">
            <h2 className="text-3xl font-black uppercase mb-2">Join the Marketplace</h2>
            <p className="font-bold mb-8 uppercase text-sm">Sign up now to register or explore businesses</p>
            <button 
              onClick={handleAuth}
              className="bg-black text-white px-12 py-5 rounded-2xl font-black text-2xl uppercase hover:bg-blue-700 transition-colors"
            >
              Get Started with Google
            </button>
          </div>
        ) : (
          /* ACTION BUTTONS: Only show when logged in to prevent "not signed in" errors */
          <div className="flex flex-wrap justify-center gap-6 mb-24">
            <Link to="/register" className="bg-white border-4 border-black px-10 py-5 rounded-2xl font-black uppercase text-lg hover:bg-yellow-400 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all">
              Register Business
            </Link>
            <Link to="/explore" className="bg-white border-4 border-black px-10 py-5 rounded-2xl font-black uppercase text-lg hover:bg-green-400 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all">
              Explore Business
            </Link>
            <Link to="/dashboard" className="bg-white border-4 border-black px-10 py-5 rounded-2xl font-black uppercase text-lg hover:bg-blue-400 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all">
              My Dashboard
            </Link>
          </div>
        )}

        {/* TRENDING SECTION: From the bottom of your Page 1 sketch */}
        <section className="text-left">
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-xl font-black uppercase italic tracking-widest">Trending Businesses</h2>
            <div className="h-1 flex-1 bg-black"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {trending.length > 0 ? (
              trending.map((biz) => (
                <div key={biz._id} className="group border-4 border-black p-8 rounded-[40px] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all bg-white">
                  <span className="text-xs font-black uppercase bg-blue-100 px-3 py-1 rounded-full border-2 border-black">
                    {biz.category}
                  </span>
                  <h3 className="text-2xl font-black mt-4 mb-2 uppercase">{biz.businessName}</h3>
                  <div className="w-full h-32 bg-gray-100 border-2 border-black rounded-2xl mb-4 flex items-center justify-center font-bold text-gray-400 uppercase text-xs">
                    Business Preview
                  </div>
                  <p className="font-bold text-gray-600 text-sm line-clamp-2">{biz.description}</p>
                </div>
              ))
            ) : (
              <div className="col-span-full border-4 border-dashed border-gray-200 py-20 rounded-[40px] text-center font-bold text-gray-300">
                No trending businesses yet. Be the first to register!
              </div>
            )}
          </div>
        </section>
      </main>

      {/* CHATBOT: Floating circle from sketch */}
      <div className="fixed bottom-8 left-8 w-20 h-20 bg-black text-white rounded-full border-4 border-white shadow-2xl flex items-center justify-center cursor-pointer hover:scale-110 transition-transform z-50">
        <div className="text-center">
          <p className="text-[10px] font-black uppercase leading-none">Chat</p>
          <p className="text-[10px] font-black uppercase leading-none">Bot</p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;