import React from 'react';
import { auth } from '../services/firebase';

const Dashboard = () => {
  const user = auth.currentUser;

  return (
    <div className="min-h-screen bg-gray-50 flex p-6 gap-6">
      {/* MAIN CONTENT AREA: Large rounded box from your sketch */}
      <div className="flex-1 bg-white border-4 border-black rounded-[60px] p-10 shadow-sm">
        <h2 className="text-4xl font-black mb-6 uppercase">My Workspace</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Placeholder for "My Businesses" or "Contracts" */}
          <div className="h-64 border-2 border-dashed border-gray-200 rounded-3xl flex items-center justify-center text-gray-400 font-bold">
            No Active Contracts Yet
          </div>
          <div className="h-64 border-2 border-dashed border-gray-200 rounded-3xl flex items-center justify-center text-gray-400 font-bold">
            My Registered Businesses
          </div>
        </div>
      </div>

      {/* RIGHT SIDEBAR: The profile/links box from your sketch */}
      <div className="w-80 flex flex-col gap-6">
        {/* Profile Circle and Name */}
        <div className="flex flex-col items-center mb-4">
          <div className="w-24 h-24 bg-gray-200 rounded-full border-4 border-black mb-4 overflow-hidden">
             <img src={user?.photoURL} alt="profile" className="w-full h-full object-cover" />
          </div>
          <p className="font-black text-lg">{user?.displayName || 'Business User'}</p>
        </div>

        {/* Action List from your sketch */}
        <div className="bg-white border-4 border-black p-6 rounded-3xl space-y-4">
          <button className="w-full text-left font-bold hover:text-blue-600 transition uppercase text-sm">Profile Section</button>
          <button className="w-full text-left font-bold hover:text-blue-600 transition uppercase text-sm">Saved Businesses</button>
          <button className="w-full text-left font-bold hover:text-blue-600 transition uppercase text-sm">Stared Businesses</button>
          <button className="w-full text-left font-bold hover:text-blue-600 transition uppercase text-sm">My Contracts</button>
          <button className="w-full text-left font-bold hover:text-blue-600 transition uppercase text-sm border-t-2 border-black pt-4">My Businesses</button>
          <button 
            onClick={() => auth.signOut()}
            className="w-full text-left font-bold text-red-500 hover:text-red-700 transition uppercase text-sm"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;