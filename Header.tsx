
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { PhoneCall, Moon, Sun, MessageCircleMore } from 'lucide-react';
import { User } from '../types';
import { APP_CONFIG } from '../constants';

interface HeaderProps {
  toggleTheme: () => void;
  isDarkMode: boolean;
  currentUser: User | null;
}

const Header: React.FC<HeaderProps> = ({ toggleTheme, isDarkMode, currentUser }) => {
  const location = useLocation();
  const isCommitteeMember = currentUser && currentUser.designation !== "সাধারণ সদস্য" && currentUser.designation !== "সাধারণ জনগণ";
  const isMessengerPage = location.pathname === '/messenger';

  return (
    <header className={`shadow-md sticky top-0 z-50 transition-colors duration-300 ${isDarkMode ? 'bg-slate-800 border-b border-slate-700' : 'bg-white'}`}>
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 flex items-center justify-center overflow-hidden rounded-full shadow-inner bg-gray-50 dark:bg-slate-700">
            <img 
              src={APP_CONFIG.logoUrl} 
              alt="Logo" 
              className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
              onError={(e) => {
                e.currentTarget.src = APP_CONFIG.placeholderLogo;
              }}
            />
          </div>
          <h1 className={`text-lg md:text-xl font-black ${isDarkMode ? 'text-indigo-400' : 'text-indigo-900'}`}>
            {APP_CONFIG.siteName}
          </h1>
        </Link>
        
        <div className="flex items-center space-x-2 sm:space-x-3">
          {isCommitteeMember && (
            <Link 
              to="/messenger" 
              className={`p-2.5 rounded-full transition-all duration-300 relative ${isMessengerPage ? 'bg-indigo-600 text-white shadow-lg' : (isDarkMode ? 'bg-slate-700 text-indigo-400 hover:bg-slate-600' : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100')}`}
              title="মেসেঞ্জার"
            >
              <MessageCircleMore size={22} className={!isMessengerPage ? 'animate-pulse' : ''} />
              {!isMessengerPage && (
                <span className="absolute top-0 right-0 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border-2 border-white dark:border-slate-800"></span>
                </span>
              )}
            </Link>
          )}

          <button 
            onClick={toggleTheme}
            className={`p-2.5 rounded-full transition-all duration-300 ${isDarkMode ? 'bg-slate-700 text-yellow-400 hover:bg-slate-600' : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'}`}
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          <Link 
            to="/contact" 
            className="bg-indigo-600 text-white px-3 sm:px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black flex items-center space-x-2 hover:bg-indigo-700 transition shadow-lg active:scale-95"
          >
            <PhoneCall size={14} />
            <span className="hidden xs:inline">যোগাযোগ</span>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
