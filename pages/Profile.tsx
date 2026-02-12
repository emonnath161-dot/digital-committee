
import React, { useState, useRef } from 'react';
import { User } from '../types';
import { DESIGNATIONS, BLOOD_GROUPS } from '../constants';
import { Save, LogOut, Phone, Mail, MapPin, Droplet, Camera, Edit2, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ProfileProps {
  user: User;
  onUpdate: (user: User) => void;
  isDarkMode: boolean;
}

const Profile: React.FC<ProfileProps> = ({ user, onUpdate, isDarkMode }) => {
  const [formData, setFormData] = useState<User>(user);
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Only "অর্থ সম্পাদক" or "সহ অর্থ সম্পাদক" can access Admin Panel
  const canAccessAdmin = user.designation === "অর্থ সম্পাদক" || user.designation === "সহ অর্থ সম্পাদক";

  const handleSave = () => {
    onUpdate(formData);
    setIsEditing(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('cm_logged_user');
    window.location.reload();
  };

  const handleImageClick = () => {
    if (isEditing) {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, profilePic: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="animate-fadeIn max-w-2xl mx-auto pt-6">
      <div className={`rounded-[2.5rem] overflow-hidden shadow-2xl border transition-all duration-500 pb-10 ${isDarkMode ? 'bg-slate-800 border-slate-700 shadow-slate-950' : 'bg-white border-gray-100 shadow-indigo-100'}`}>
        <div className="flex flex-col items-center pt-10 px-6">
          <div className="relative group">
            <img 
              src={formData.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&size=200&background=6366f1&color=fff`} 
              alt={user.name}
              className={`w-36 h-36 rounded-[2.5rem] border-4 object-cover shadow-xl transition-all duration-300 ${isDarkMode ? 'border-slate-700' : 'border-indigo-50'} ${isEditing ? 'cursor-pointer hover:brightness-75 scale-105' : ''}`}
              onClick={handleImageClick}
            />
            {isEditing && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <Camera className="text-white" size={32} />
              </div>
            )}
            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
            <div className="absolute -bottom-2 -right-2 bg-green-500 w-8 h-8 rounded-full border-4 border-white dark:border-slate-800 shadow-md"></div>
          </div>

          <div className="mt-6 text-center">
            <h2 className={`text-3xl font-black ${isDarkMode ? 'text-slate-100' : 'text-gray-900'}`}>{user.name}</h2>
            <div className="mt-2 inline-block px-4 py-1 bg-indigo-600 text-white rounded-full text-xs font-black shadow-lg uppercase tracking-widest">
              {user.designation}
            </div>
          </div>

          <div className="mt-10 w-full space-y-4">
            {!isEditing ? (
              <>
                <div className={`p-6 rounded-[2rem] flex items-center space-x-5 border shadow-sm transition-all duration-300 hover:shadow-md ${isDarkMode ? 'bg-slate-900/50 border-slate-700' : 'bg-gradient-to-r from-indigo-50 to-white border-indigo-50'}`}>
                  <div className="bg-indigo-600 p-3 rounded-2xl text-white shadow-lg">
                    <Phone size={24} />
                  </div>
                  <div className="flex-grow">
                    <p className={`text-xs font-black uppercase tracking-wider ${isDarkMode ? 'text-indigo-400' : 'text-indigo-500'}`}>মোবাইল নাম্বার</p>
                    <p className={`text-xl font-bold ${isDarkMode ? 'text-slate-100' : 'text-gray-900'}`}>{user.mobile}</p>
                  </div>
                </div>

                <div className={`p-6 rounded-[2rem] flex items-center space-x-5 border shadow-sm transition-all duration-300 hover:shadow-md ${isDarkMode ? 'bg-slate-900/50 border-slate-700' : 'bg-gradient-to-r from-purple-50 to-white border-purple-50'}`}>
                  <div className="bg-purple-600 p-3 rounded-2xl text-white shadow-lg">
                    <Mail size={24} />
                  </div>
                  <div className="flex-grow">
                    <p className={`text-xs font-black uppercase tracking-wider ${isDarkMode ? 'text-purple-400' : 'text-purple-500'}`}>ইমেইল ঠিকানা</p>
                    <p className={`text-xl font-bold ${isDarkMode ? 'text-slate-100' : 'text-gray-900'}`}>{user.email || 'তথ্য নেই'}</p>
                  </div>
                </div>

                <div className={`p-6 rounded-[2rem] flex items-center space-x-5 border shadow-sm transition-all duration-300 hover:shadow-md ${isDarkMode ? 'bg-slate-900/50 border-slate-700' : 'bg-gradient-to-r from-red-50 to-white border-red-50'}`}>
                  <div className="bg-red-600 p-3 rounded-2xl text-white shadow-lg">
                    <Droplet size={24} />
                  </div>
                  <div className="flex-grow">
                    <p className={`text-xs font-black uppercase tracking-wider ${isDarkMode ? 'text-red-400' : 'text-red-500'}`}>রক্তের গ্রুপ</p>
                    <p className="text-xl font-black text-red-600">{user.bloodGroup}</p>
                  </div>
                </div>
              </>
            ) : (
              <div className="space-y-5 px-2">
                <div>
                  <label className={`block text-xs font-black uppercase mb-2 ml-1 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>পূর্ণ নাম</label>
                  <input 
                    type="text" 
                    className={`w-full p-4 rounded-2xl border-2 outline-none transition text-lg font-bold ${isDarkMode ? 'bg-slate-900 border-slate-700 text-white focus:border-indigo-500' : 'bg-gray-50 border-transparent focus:border-indigo-600 text-gray-900'}`}
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-xs font-black uppercase mb-2 ml-1 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>ইমেইল</label>
                    <input 
                      type="email" 
                      className={`w-full p-4 rounded-2xl border-2 outline-none transition ${isDarkMode ? 'bg-slate-900 border-slate-700 text-white focus:border-indigo-500' : 'bg-gray-50 border-transparent focus:border-indigo-600 text-gray-900'}`}
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className={`block text-xs font-black uppercase mb-2 ml-1 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>রক্তের গ্রুপ</label>
                    <select 
                      className={`w-full p-4 rounded-2xl border-2 outline-none transition ${isDarkMode ? 'bg-slate-900 border-slate-700 text-white focus:border-indigo-500' : 'bg-gray-50 border-transparent focus:border-indigo-600 text-gray-900'}`}
                      value={formData.bloodGroup}
                      onChange={(e) => setFormData({...formData, bloodGroup: e.target.value})}
                    >
                      {BLOOD_GROUPS.map(bg => <option key={bg} value={bg}>{bg}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="mt-12 w-full flex flex-col space-y-4">
            {!isEditing ? (
              <button 
                onClick={() => setIsEditing(true)}
                className="w-full py-5 bg-indigo-600 text-white rounded-[1.5rem] font-black text-xl shadow-xl shadow-indigo-200 dark:shadow-indigo-900/20 flex items-center justify-center space-x-3 active:scale-[0.98] transition hover:bg-indigo-700"
              >
                <Edit2 size={24} />
                <span>তথ্য পরিবর্তন করুন</span>
              </button>
            ) : (
              <button 
                onClick={handleSave}
                className="w-full py-5 bg-green-600 text-white rounded-[1.5rem] font-black text-xl shadow-xl shadow-green-100 dark:shadow-green-900/20 flex items-center justify-center space-x-3 active:scale-[0.98] transition hover:bg-green-700"
              >
                <Save size={24} />
                <span>পরিবর্তন সংরক্ষণ করুন</span>
              </button>
            )}

            {/* Admin Access Only for অর্থ সম্পাদক or সহ অর্থ সম্পাদক */}
            {canAccessAdmin && (
              <button 
                onClick={() => navigate('/admin')}
                className="w-full py-5 bg-slate-900 dark:bg-slate-100 dark:text-slate-900 text-white rounded-[1.5rem] font-black text-xl shadow-xl flex items-center justify-center space-x-3 active:scale-[0.98] transition hover:opacity-90"
              >
                <ShieldCheck size={24} />
                <span>অ্যাডমিন প্যানেল</span>
              </button>
            )}

            <button 
              onClick={handleLogout}
              className={`w-full py-5 rounded-[1.5rem] font-black text-lg flex items-center justify-center space-x-3 active:scale-[0.98] transition ${isDarkMode ? 'bg-red-950/30 text-red-500 hover:bg-red-900/50' : 'bg-red-50 text-red-600 hover:bg-red-100'}`}
            >
              <LogOut size={24} />
              <span>লগ আউট করুন</span>
            </button>
          </div>
        </div>
      </div>
      
      <div className="mt-10 text-center pb-10">
        <p className={`text-xs font-bold ${isDarkMode ? 'text-slate-500' : 'text-gray-400'}`}>© বাগীশিক উত্তর মাদার্শা | ২০২৪</p>
      </div>
    </div>
  );
};

export default Profile;
