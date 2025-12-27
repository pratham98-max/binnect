import React from 'react';
import { Link } from 'react-router-dom';

const AuthenticatedHome = () => {
  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Welcome back to Binnect!</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-white shadow rounded-xl">
          <h2 className="text-xl font-semibold mb-2">Find Services</h2>
          <p className="mb-4 text-gray-600">Discover top-rated niches and businesses in our community.</p>
          <Link to="/explore" className="text-blue-600 font-medium">Browse Explore →</Link>
        </div>
        <div className="p-6 bg-white shadow rounded-xl">
          <h2 className="text-xl font-semibold mb-2">List Your Niche</h2>
          <p className="mb-4 text-gray-600">Ready to share your services? Register your business now.</p>
          <Link to="/register" className="text-blue-600 font-medium">Get Started →</Link>
        </div>
      </div>
    </div>
  );
};

export default AuthenticatedHome;