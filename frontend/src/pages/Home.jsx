import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-5xl font-bold text-blue-600 mb-6">
        Welcome to Binnect
      </h1>
      <p className="text-xl text-gray-600 mb-8 max-w-2xl">
        The ultimate platform to discover and register local businesses. 
        Find what you need or grow your reach today.
      </p>
      
      <div className="flex gap-4">
        <Link 
          to="/explore" 
          className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          Explore Businesses
        </Link>
        <Link 
          to="/register" 
          className="bg-white text-blue-600 border border-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition"
        >
          Register Your Business
        </Link>
      </div>
    </div>
  );
};

export default Home;