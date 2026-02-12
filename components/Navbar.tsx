
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Users, GraduationCap, UserCircle } from 'lucide-react';

interface NavbarProps {
  isDarkMode: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ isDarkMode }) => {
  return (
    <nav className={`fixed bottom-0 left-0 right-0 border-t h-16 z-50 transition-colors duration-300 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
      <div className="flex justify-around items-center h-full max-w-lg mx-auto">
        <NavLink 
          to="/" 
          className={({ isActive }) => 
            `flex flex-col items-center space-y-1 transition ${isActive ? 'text-indigo-400 font-bold' : (isDarkMode ? 'text-slate-400' : 'text-gray-500')}`
          }
        >
          <Home size={24} />
          <span className="text-[10px] sm:text-xs font-medium">হোম</span>
        </NavLink>
        
        <NavLink 
          to="/committee" 
          className={({ isActive }) => 
            `flex flex-col items-center space-y-1 transition ${isActive ? 'text-indigo-400 font-bold' : (isDarkMode ? 'text-slate-400' : 'text-gray-500')}`
          }
        >
          <Users size={24} />
          <span className="text-[10px] sm:text-xs font-medium">কমিটি</span>
        </NavLink>
        
        <NavLink 
          to="/schools" 
          className={({ isActive }) => 
            `flex flex-col items-center space-y-1 transition ${isActive ? 'text-indigo-400 font-bold' : (isDarkMode ? 'text-slate-400' : 'text-gray-500')}`
          }
        >
          <GraduationCap size={24} />
          <span className="text-[10px] sm:text-xs font-medium">স্কুলসমূহ</span>
        </NavLink>
        
        <NavLink 
          to="/profile" 
          className={({ isActive }) => 
            `flex flex-col items-center space-y-1 transition ${isActive ? 'text-indigo-400 font-bold' : (isDarkMode ? 'text-slate-400' : 'text-gray-500')}`
          }
        >
          <UserCircle size={24} />
          <span className="text-[10px] sm:text-xs font-medium">প্রোফাইল</span>
        </NavLink>
      </div>
    </nav>
  );
};

export default Navbar;
