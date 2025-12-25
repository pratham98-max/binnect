import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Bookmark, PlusCircle, Settings, LogOut, LayoutDashboard } from 'lucide-react';
import { motion } from 'framer-motion';

// Helper component defined inside the file is fine as long as it isn't exported separately
const SidebarLink = ({ icon, label, path, active }) => (
  <Link to={path} className="w-full">
    <motion.div 
      whileHover={{ x: 5 }}
      whileTap={{ scale: 0.95 }}
      className={`flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 cursor-pointer ${
        active 
          ? 'bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)]' 
          : 'text-gray-400 hover:bg-white/5 hover:text-white'
      }`}
    >
      {icon}
      <span className="hidden lg:block font-bold text-sm tracking-tight">{label}</span>
    </motion.div>
  </Link>
);

const Sidebar = () => {
  const location = useLocation();

  return (
    <aside className="w-20 lg:w-64 h-[calc(100vh-2rem)] bg-white/5 backdrop-blur-xl border border-white/10 m-4 rounded-[32px] flex flex-col items-center lg:items-start p-6 fixed left-0 top-0 z-50 shadow-2xl">
      {/* Brand Logo */}
      <div className="mb-12 px-2 flex items-center gap-3">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-black italic text-white shadow-lg shadow-blue-500/20">
          B
        </div>
        <span className="hidden lg:block text-xl font-black tracking-tighter text-white uppercase italic">
          Binnect
        </span>
      </div>
      
      {/* Navigation Links */}
      <nav className="flex-1 space-y-3 w-full">
        <SidebarLink 
          icon={<LayoutDashboard size={20}/>} 
          label="Dashboard" 
          path="/dashboard" 
          active={location.pathname === '/dashboard'} 
        />
        <SidebarLink 
          icon={<PlusCircle size={20}/>} 
          label="Register Niche" 
          path="/register" 
          active={location.pathname === '/register'} 
        />
        <SidebarLink 
          icon={<Bookmark size={20}/>} 
          label="Saved Niches" 
          path="/saved" 
          active={location.pathname === '/saved'} 
        />
        <SidebarLink 
          icon={<Home size={20}/>} 
          label="Explore" 
          path="/explore" 
          active={location.pathname === '/explore'} 
        />
      </nav>
      
      {/* Settings & Logout */}
      <div className="w-full space-y-3 mt-auto pt-6 border-t border-white/10">
        <SidebarLink 
          icon={<Settings size={20}/>} 
          label="Settings" 
          path="/settings" 
          active={location.pathname === '/settings'} 
        />
        <button className="w-full flex items-center gap-4 p-4 rounded-2xl text-red-400 hover:bg-red-500/10 transition-all duration-300 group">
          <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="hidden lg:block font-bold text-sm">Logout</span>
        </button>
      </div>
    </aside>
  );
};

// Only export the main component to satisfy Fast Refresh
export default Sidebar;