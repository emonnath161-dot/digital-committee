
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { School, User as AppUser } from '../types';
import { Calendar, User, Users, Eye, GraduationCap, Lock } from 'lucide-react';

interface SchoolsProps {
  schools: School[];
  currentUser: AppUser | null;
  isDarkMode: boolean;
}

const COLORS = [
  'from-blue-600 to-indigo-700',
  'from-purple-600 to-indigo-800',
  'from-pink-600 to-rose-700',
  'from-amber-500 to-orange-700',
  'from-emerald-500 to-teal-700',
  'from-cyan-500 to-blue-700',
  'from-rose-500 to-pink-700',
];

const Schools: React.FC<SchoolsProps> = ({ schools, currentUser, isDarkMode }) => {
  const navigate = useNavigate();
  const isGeneralPublic = currentUser?.designation === "সাধারণ সদস্য";

  const handleViewDetails = (schoolId: string) => {
    if (isGeneralPublic) {
      alert("দুঃখিত! এই স্কুলের শিক্ষার্থীদের বিস্তারিত তথ্য শুধুমাত্র কমিটির নিবন্ধিত সদস্যদের জন্য সংরক্ষিত। আপনার পদবী পরিবর্তন করতে প্রোফাইলে যোগাযোগ করুন।");
    } else {
      navigate(`/schools/${schoolId}`);
    }
  };

  return (
    <div className="animate-fadeIn pb-20">
      <div className="mb-10 text-center sm:text-left">
        <h2 className={`text-4xl font-black mb-2 ${isDarkMode ? 'text-slate-100' : 'text-gray-900'}`}>গীতা স্কুল সমূহ</h2>
        <div className="w-24 h-2 bg-indigo-600 rounded-full mx-auto sm:mx-0"></div>
        <p className={`font-bold mt-4 flex items-center justify-center sm:justify-start ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
          <GraduationCap className="mr-2 text-indigo-500" size={24} />
          পরিচালিত ধর্মীয় বিদ্যাপীঠসমূহের তালিকা
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {schools.map((school, index) => (
          <div 
            key={school.id} 
            className={`group relative rounded-[3rem] shadow-xl border overflow-hidden flex flex-col hover:-translate-y-2 transition-all duration-500 ${isDarkMode ? 'bg-slate-800 border-slate-700 shadow-slate-900/50' : 'bg-white border-slate-100 shadow-slate-200'}`}
          >
            {/* School Header Info */}
            <div className={`h-32 bg-gradient-to-br ${COLORS[index % COLORS.length]} p-8 flex justify-between items-start`}>
              <div className="bg-white/20 backdrop-blur-md p-3 rounded-2xl text-white">
                <GraduationCap size={24} />
              </div>
              <div className="bg-black/20 backdrop-blur-md px-4 py-2 rounded-xl text-white text-[10px] font-black uppercase tracking-widest border border-white/20">
                স্থাপিত: {school.established}
              </div>
            </div>
            
            <div className="p-10 pt-8">
              <h3 className={`text-3xl font-black mb-6 group-hover:text-indigo-500 transition ${isDarkMode ? 'text-slate-100' : 'text-gray-900'}`}>{school.name}</h3>
              
              <div className="space-y-4 mb-8">
                <div className={`flex items-center p-4 rounded-2xl border ${isDarkMode ? 'bg-slate-900/50 border-slate-700 text-slate-300' : 'bg-slate-50 border-slate-100 text-gray-600'}`}>
                  <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center mr-4 text-indigo-600 dark:text-indigo-400">
                    <User size={20} />
                  </div>
                  <div>
                    <p className={`text-[10px] font-black uppercase ${isDarkMode ? 'text-slate-500' : 'text-gray-400'}`}>প্রধান শিক্ষক</p>
                    <span className="font-black text-lg">{school.teacherName}</span>
                  </div>
                </div>
                
                <div className={`flex items-center p-4 rounded-2xl border ${isDarkMode ? 'bg-slate-900/50 border-slate-700 text-slate-300' : 'bg-slate-50 border-slate-100 text-gray-600'}`}>
                  <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center mr-4 text-purple-600 dark:text-purple-400">
                    <Users size={20} />
                  </div>
                  <div>
                    <p className={`text-[10px] font-black uppercase ${isDarkMode ? 'text-slate-500' : 'text-gray-400'}`}>ছাত্র সংখ্যা</p>
                    <span className="font-black text-lg text-indigo-500">{school.studentCount} জন</span>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => handleViewDetails(school.id)}
                className={`w-full py-5 rounded-[1.5rem] font-black text-xl flex items-center justify-center space-x-4 transition-all duration-300 shadow-lg active:scale-95 ${
                  isGeneralPublic 
                  ? (isDarkMode ? 'bg-slate-700 text-slate-500 cursor-not-allowed border-2 border-dashed border-slate-600' : 'bg-slate-200 text-slate-500 cursor-not-allowed border-2 border-dashed border-slate-300')
                  : `bg-gradient-to-r ${COLORS[index % COLORS.length]} text-white hover:brightness-110`
                }`}
              >
                {isGeneralPublic ? <Lock size={24} /> : <Eye size={24} />}
                <span>{isGeneralPublic ? 'অ্যাক্সেস সীমিত' : 'বিস্তারিত দেখুন'}</span>
              </button>
              
              {isGeneralPublic && (
                <p className="mt-4 text-center text-red-500 text-[10px] font-bold animate-pulse">
                  * বিস্তারিত তথ্য দেখতে সদস্যদের জন্য লগইন প্রয়োজন
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Schools;
