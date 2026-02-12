
import React from 'react';
import { User } from '../types';
import { DESIGNATION_RANK } from '../constants';
// Added ShieldAlert to the lucide-react imports
import { Phone, MapPin, Award, ShieldAlert } from 'lucide-react';

interface CommitteeProps {
  users: User[];
  isDarkMode: boolean;
}

const Committee: React.FC<CommitteeProps> = ({ users, isDarkMode }) => {
  // Members who are NOT (সদস্য or সাধারণ সদস্য) are part of Executive Committee
  const committeeMembers = users
    .filter(u => u.designation !== "সদস্য" && u.designation !== "সাধারণ সদস্য")
    .sort((a, b) => DESIGNATION_RANK[a.designation] - DESIGNATION_RANK[b.designation]);

  return (
    <div className="animate-fadeIn pb-20 max-w-3xl mx-auto">
      <div className="mb-10 text-center">
        <h2 className={`text-4xl font-black mb-2 ${isDarkMode ? 'text-slate-100' : 'text-gray-900'}`}>কার্যকরী কমিটি</h2>
        <div className="w-20 h-1.5 bg-indigo-600 rounded-full mx-auto mb-4"></div>
        <p className={`text-sm font-bold uppercase tracking-widest ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>নিবেদিতপ্রাণ সকল সদস্যদের পূর্ণাঙ্গ তালিকা</p>
      </div>

      {committeeMembers.length > 0 ? (
        <div className="flex flex-col space-y-6">
          {committeeMembers.map((member, index) => (
            <div key={member.id} className={`rounded-[2.5rem] shadow-sm border p-6 flex items-center space-x-6 transition-all duration-300 group relative overflow-hidden ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100 hover:shadow-xl hover:shadow-indigo-50'}`}>
              
              {/* Rank Badge */}
              <div className="absolute top-0 right-0 px-5 py-2 bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 rounded-bl-3xl text-[10px] font-black uppercase tracking-widest">
                 পদবী ক্রম #{index + 1}
              </div>

              {/* Profile Image with Ring */}
              <div className="flex-shrink-0 relative">
                <div className="w-24 h-24 rounded-[2rem] p-1 bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg">
                  <img 
                    src={member.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=fff&color=6366f1&size=100`} 
                    alt={member.name}
                    className="w-full h-full rounded-[1.75rem] object-cover border-2 border-white dark:border-slate-800"
                  />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-white dark:bg-slate-800 p-1.5 rounded-full shadow-md text-indigo-600">
                   <Award size={18} />
                </div>
              </div>
              
              {/* Information Section */}
              <div className="flex-grow min-w-0 pt-2">
                <div className="mb-1 px-3 py-1 bg-indigo-600 text-white text-[9px] font-black rounded-full inline-block uppercase tracking-wider shadow-sm">
                  {member.designation}
                </div>
                <h3 className={`text-2xl font-black truncate group-hover:text-indigo-600 transition-colors tracking-tight mb-4 ${isDarkMode ? 'text-slate-100' : 'text-gray-900'}`}>
                  {member.name}
                </h3>
                
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className={`flex items-center px-4 py-2 rounded-2xl border transition-all ${isDarkMode ? 'bg-slate-900/50 border-slate-700 text-slate-200' : 'bg-slate-50 border-slate-200 text-gray-700'}`}>
                    <Phone size={16} className="text-indigo-600 mr-3 flex-shrink-0" />
                    <span className={`text-base font-black tracking-widest ${isDarkMode ? 'text-indigo-400' : 'text-indigo-900'}`}>{member.mobile}</span>
                  </div>
                  
                  <div className="flex items-center px-2">
                    <MapPin size={14} className="text-red-500 mr-2 flex-shrink-0" />
                    <span className={`text-xs font-bold truncate max-w-[200px] ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>{member.address || 'ঠিকানা পাওয়া যায়নি'}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={`rounded-[3rem] p-20 text-center border-4 border-dashed ${isDarkMode ? 'bg-slate-800/50 border-slate-700 text-slate-600' : 'bg-white border-gray-100 text-gray-400'}`}>
          <ShieldAlert size={60} className="mx-auto mb-4 opacity-20" />
          <p className="text-xl font-black uppercase tracking-widest">বর্তমানে কোনো কার্যকরী সদস্য নেই</p>
        </div>
      )}
    </div>
  );
};

export default Committee;
