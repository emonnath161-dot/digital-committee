
import React from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { School, User as AppUser } from '../types';
import { ArrowLeft, Calendar, Users as UsersIcon, Smartphone, GraduationCap, User, PhoneCall, Heart } from 'lucide-react';

interface SchoolDetailProps {
  schools: School[];
  currentUser: AppUser | null;
  isDarkMode: boolean;
}

const SchoolDetail: React.FC<SchoolDetailProps> = ({ schools, currentUser, isDarkMode }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const school = schools.find(s => s.id === id);
  const isGeneralPublic = currentUser?.designation === "সাধারণ সদস্য";

  if (isGeneralPublic) return <Navigate to="/schools" />;
  if (!school) return <div className="text-center py-20 font-black text-xl text-red-500">স্কুল পাওয়া যায়নি!</div>;

  const students = school.students || [];

  return (
    <div className="animate-fadeIn pb-24 max-w-4xl mx-auto">
      {/* Back Button */}
      <button 
        onClick={() => navigate('/schools')} 
        className={`flex items-center font-black mb-4 hover:-translate-x-1 transition-transform group ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`}
      >
        <ArrowLeft size={18} className="mr-1.5" />
        <span className="text-sm">তালিকায় ফিরুন</span>
      </button>

      {/* Basic School Info Card */}
      <div className={`rounded-3xl p-5 shadow-sm border mb-4 flex flex-col sm:flex-row items-center justify-between transition-colors ${isDarkMode ? 'bg-slate-800 border-slate-700 shadow-slate-900/30' : 'bg-white border-slate-100 shadow-slate-100'}`}>
        <h2 className={`text-xl sm:text-2xl font-black mb-3 sm:mb-0 tracking-tight ${isDarkMode ? 'text-slate-100' : 'text-gray-900'}`}>{school.name}</h2>
        <div className="flex gap-2">
          <div className={`px-3 py-1 rounded-lg text-[10px] font-black border flex items-center ${isDarkMode ? 'bg-indigo-950/50 text-indigo-400 border-indigo-900' : 'bg-indigo-50 text-indigo-600 border-indigo-100'}`}>
            <Calendar size={12} className="mr-1.5" /> স্থাপন: {school.established}
          </div>
          <div className={`px-3 py-1 rounded-lg text-[10px] font-black border flex items-center ${isDarkMode ? 'bg-purple-950/50 text-purple-400 border-purple-900' : 'bg-purple-50 text-purple-600 border-purple-100'}`}>
            <UsersIcon size={12} className="mr-1.5" /> ছাত্র: {school.studentCount}
          </div>
        </div>
      </div>

      {/* Teacher Section */}
      <div className={`rounded-3xl p-4 shadow-md mb-8 flex items-center space-x-4 border transition-colors ${isDarkMode ? 'bg-indigo-950/50 border-indigo-900' : 'bg-indigo-900 border-indigo-800 text-white'}`}>
        <div className="relative flex-shrink-0">
          <img 
            src={school.teacherImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(school.teacherName)}&size=80&background=fff&color=6366f1`} 
            className="w-16 h-16 rounded-2xl object-cover border-2 border-white/50"
            alt={school.teacherName}
          />
        </div>
        
        <div className="flex-grow min-w-0">
          <span className="text-[7px] font-black bg-white/20 px-2 py-0.5 rounded-full text-indigo-100 uppercase tracking-widest mb-0.5 inline-block">প্রধান শিক্ষক</span>
          <h4 className="text-lg sm:text-xl font-black truncate text-white leading-tight">{school.teacherName}</h4>
          <div className="mt-1 flex items-center text-indigo-200">
            <Smartphone size={14} className="mr-1.5" />
            <span className="text-sm font-black tracking-widest">{school.teacherPhone}</span>
          </div>
        </div>

        <a 
          href={`tel:${school.teacherPhone}`}
          className={`h-10 w-10 flex items-center justify-center rounded-xl transition-all shadow active:scale-90 ${isDarkMode ? 'bg-indigo-600 text-white' : 'bg-white text-indigo-900'}`}
        >
          <PhoneCall size={16} />
        </a>
      </div>

      {/* Students Section Header */}
      <div className="flex items-center mb-5">
        <div className="w-1 h-5 bg-indigo-600 rounded-full mr-2"></div>
        <h3 className={`text-lg font-black ${isDarkMode ? 'text-slate-100' : 'text-gray-900'}`}>শিক্ষার্থী তালিকা ({students.length})</h3>
      </div>
      
      {/* 2-Column Grid for Students */}
      {students.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {students.map((student) => (
            <div 
              key={student.id} 
              className={`rounded-2xl border shadow-sm overflow-hidden flex flex-col transition-all duration-300 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}
            >
              <div className="relative aspect-square bg-slate-100 dark:bg-slate-700 overflow-hidden">
                <img 
                  src={student.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}&background=random`} 
                  alt={student.name} 
                  className="w-full h-full object-cover" 
                />
                <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm text-white text-[8px] font-black px-1.5 py-0.5 rounded-md">
                  রোল: {student.roll}
                </div>
              </div>
              
              <div className="p-3 space-y-1.5">
                <h4 className={`text-sm sm:text-base font-black truncate ${isDarkMode ? 'text-indigo-400' : 'text-indigo-900'}`}>
                  {student.name}
                </h4>
                <div className="space-y-0.5 border-t border-slate-50 dark:border-slate-700 pt-1.5">
                  <div className="flex items-center text-[9px] sm:text-[10px]">
                    <span className={`${isDarkMode ? 'text-slate-500' : 'text-gray-400'} font-bold mr-1`}>পিতা:</span>
                    <span className={`${isDarkMode ? 'text-slate-300' : 'text-gray-700'} font-bold truncate`}>{student.fatherName}</span>
                  </div>
                  <div className="flex items-center text-[9px] sm:text-[10px]">
                    <span className={`${isDarkMode ? 'text-slate-500' : 'text-gray-400'} font-bold mr-1`}>মাতা:</span>
                    <span className={`${isDarkMode ? 'text-slate-300' : 'text-gray-700'} font-bold truncate`}>{student.motherName}</span>
                  </div>
                  
                  <div className={`mt-2 flex items-center font-black text-[10px] sm:text-xs pt-1 ${isDarkMode ? 'text-indigo-300' : 'text-indigo-700'}`}>
                    <Smartphone size={10} className="mr-1 flex-shrink-0" />
                    <span className="tracking-tight">{student.mobile}</span>
                  </div>
                  
                  <div className={`flex items-center font-bold text-[8px] sm:text-[9px] uppercase tracking-tighter ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                     শ্রেণী: {student.className}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={`text-center py-10 rounded-[2rem] border-4 border-dashed font-bold ${isDarkMode ? 'border-slate-800 text-slate-700' : 'border-gray-100 text-gray-400'}`}>
          বর্তমানে কোনো শিক্ষার্থীর তথ্য নেই।
        </div>
      )}
    </div>
  );
};

export default SchoolDetail;
