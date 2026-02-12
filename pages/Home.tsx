
import React from 'react';
import { Link } from 'react-router-dom';
import { Update, User as AppUser } from '../types';
import { Users as UserIcon, Calendar, ArrowRight, Image as ImageIcon, Wallet, PlayCircle } from 'lucide-react';

interface HomeProps {
  visitorCount: number;
  updates: Update[];
  isDarkMode: boolean;
  currentUser: AppUser | null;
}

const Home: React.FC<HomeProps> = ({ visitorCount, updates, isDarkMode, currentUser }) => {
  const isCommitteeMember = currentUser && currentUser.designation !== "সাধারণ সদস্য";

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Visitor Counter Section */}
      <div className={`rounded-3xl p-6 md:p-8 text-white shadow-2xl flex flex-col sm:flex-row items-center justify-between relative overflow-hidden transition-all duration-500 ${isDarkMode ? 'bg-indigo-950 border border-indigo-900/50' : 'bg-indigo-900'}`}>
        <div className="relative z-10 text-center sm:text-left mb-6 sm:mb-0">
          <h2 className={`text-xs font-black uppercase tracking-widest mb-2 ${isDarkMode ? 'text-indigo-300' : 'text-indigo-200'}`}>মোট ইউনিক ভিজিটর</h2>
          <p className="text-5xl md:text-6xl font-black">{visitorCount.toLocaleString('bn-BD')}</p>
        </div>
        
        <div className="flex flex-col items-center sm:items-end space-y-4 relative z-10">
          <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-md hidden sm:block">
            <UserIcon size={32} />
          </div>
          
          <div className="flex flex-row items-center gap-3">
            <Link 
              to="/gallery" 
              className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 backdrop-blur-md px-4 py-3 rounded-2xl transition-all active:scale-95 border border-white/10 whitespace-nowrap shadow-lg"
            >
              <ImageIcon size={18} />
              <span className="text-xs font-black uppercase tracking-wider">চিত্রপট</span>
            </Link>
            
            {isCommitteeMember && (
              <Link 
                to="/accounts" 
                className="flex items-center space-x-2 bg-indigo-500/40 hover:bg-indigo-500/60 backdrop-blur-md px-4 py-3 rounded-2xl transition-all active:scale-95 border border-white/10 whitespace-nowrap shadow-lg"
              >
                <Wallet size={18} />
                <span className="text-xs font-black uppercase tracking-wider">হিসাব</span>
              </Link>
            )}
          </div>
        </div>

        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
      </div>

      {/* Latest Updates Section */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className={`text-2xl font-black border-l-8 border-indigo-600 pl-4 ${isDarkMode ? 'text-slate-100' : 'text-gray-800'}`}>লেটেস্ট আপডেট</h2>
        </div>
        
        <div className="grid gap-8">
          {updates.length > 0 ? (
            updates.map((update) => (
              <div key={update.id} className={`rounded-[2.5rem] shadow-sm border overflow-hidden transition-all duration-500 group ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100'}`}>
                <div className={update.aspect_ratio === 'portrait' ? 'flex flex-col' : 'md:flex'}>
                  <div className={`${update.aspect_ratio === 'portrait' ? 'w-full aspect-[3/4]' : 'md:w-1/3 aspect-video md:aspect-auto'} relative overflow-hidden bg-slate-900`}>
                    {update.media_type === 'video' ? (
                      <div className="w-full h-full flex items-center justify-center bg-black group-hover:scale-105 transition-transform duration-700">
                        <iframe 
                          src={update.image.includes('youtube.com') ? update.image.replace('watch?v=', 'embed/') : update.image} 
                          className="w-full h-full border-none"
                          allowFullScreen
                          title={update.title}
                        />
                        <div className="absolute top-4 left-4 bg-red-600 text-white p-2 rounded-xl shadow-lg flex items-center space-x-1 animate-pulse">
                           <PlayCircle size={16}/>
                           <span className="text-[10px] font-black uppercase">Video</span>
                        </div>
                      </div>
                    ) : (
                      <img 
                        src={update.image} 
                        alt={update.title} 
                        className="h-full w-full object-cover group-hover:scale-110 transition duration-700" 
                      />
                    )}
                  </div>
                  <div className={`p-8 ${update.aspect_ratio === 'portrait' ? 'w-full' : 'md:w-2/3'} flex flex-col justify-between`}>
                    <div>
                      <div className="flex items-center text-indigo-500 text-xs font-black mb-4 uppercase tracking-widest">
                        <Calendar size={14} className="mr-2" />
                        <span>{update.date}</span>
                      </div>
                      <h3 className={`text-2xl font-black mb-4 group-hover:text-indigo-500 transition-colors ${isDarkMode ? 'text-slate-100' : 'text-gray-900'}`}>{update.title}</h3>
                      <p className={`text-sm leading-relaxed font-medium ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                        {update.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className={`text-center py-20 rounded-[3rem] border-4 border-dashed font-bold ${isDarkMode ? 'border-slate-800 text-slate-600' : 'border-gray-100 text-gray-400'}`}>
              বর্তমানে কোনো নতুন আপডেট নেই।
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
