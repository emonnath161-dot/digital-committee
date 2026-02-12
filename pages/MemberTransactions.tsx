
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { User, Transaction } from '../types';
import { ArrowLeft, Calendar, DollarSign, Wallet, User as UserIcon, History } from 'lucide-react';

interface MemberTransactionsProps {
  users: User[];
  transactions: Transaction[];
  isDarkMode: boolean;
}

const MemberTransactions: React.FC<MemberTransactionsProps> = ({ users, transactions, isDarkMode }) => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const user = users.find(u => u.id === userId);
  const userTransactions = transactions
    .filter(t => t.userId === userId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const total = userTransactions.reduce((sum, t) => sum + t.amount, 0);

  if (!user) return <div className="text-center py-20 font-black text-red-500">ইউজার পাওয়া যায়নি!</div>;

  return (
    <div className="animate-fadeIn pb-24 max-w-3xl mx-auto">
      <button 
        onClick={() => navigate(-1)}
        className={`flex items-center font-black mb-8 hover:-translate-x-1 transition-transform ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`}
      >
        <ArrowLeft size={18} className="mr-2" />
        <span className="text-sm">হিসাব তালিকায় ফিরুন</span>
      </button>

      <div className={`rounded-[2.5rem] p-8 mb-10 border shadow-xl relative overflow-hidden ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-indigo-50'}`}>
        <div className="flex flex-col sm:flex-row items-center sm:space-x-8 relative z-10 text-center sm:text-left">
          <img 
            src={user.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=6366f1&color=fff&size=128`} 
            className="w-32 h-32 rounded-[2rem] object-cover border-4 border-indigo-500/20 shadow-2xl mb-6 sm:mb-0"
            alt={user.name}
          />
          <div>
            <h2 className={`text-3xl font-black mb-2 ${isDarkMode ? 'text-slate-100' : 'text-indigo-950'}`}>{user.name}</h2>
            <div className="inline-block px-4 py-1 bg-indigo-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
              {user.designation}
            </div>
            <div className={`flex items-center justify-center sm:justify-start space-x-2 text-2xl font-black ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
               <Wallet size={24} />
               <span>মোট জমা: {total.toLocaleString('bn-BD')} ৳</span>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
      </div>

      <div className="space-y-6">
        <h3 className={`text-xl font-black flex items-center mb-6 ml-4 ${isDarkMode ? 'text-slate-100' : 'text-indigo-950'}`}>
          <History className="mr-3 text-indigo-500" size={24} /> লেনদেনের ইতিহাস
        </h3>
        
        {userTransactions.length > 0 ? (
          userTransactions.map((t) => (
            <div 
              key={t.id} 
              className={`p-6 rounded-[2rem] border shadow-sm transition-all hover:shadow-md flex items-center justify-between ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100'}`}
            >
              <div className="flex items-center space-x-6">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-indigo-600 ${isDarkMode ? 'bg-slate-900' : 'bg-indigo-50'}`}>
                  <Calendar size={28} />
                </div>
                <div>
                  <h4 className={`text-lg font-black ${isDarkMode ? 'text-slate-100' : 'text-indigo-950'}`}>{t.month} মাসের ফি</h4>
                  <p className="text-xs font-bold text-gray-400 mt-1 flex items-center">
                    <History size={12} className="mr-1.5" /> জমা: {new Date(t.date).toLocaleDateString('bn-BD', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className={`text-2xl font-black ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>+ {t.amount} ৳</div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">সফলভাবে জমা</p>
              </div>
            </div>
          ))
        ) : (
          <div className={`text-center py-20 rounded-[3rem] border-4 border-dashed font-bold ${isDarkMode ? 'border-slate-800 text-slate-700' : 'border-gray-100 text-gray-400'}`}>
            কোনো লেনদেনের তথ্য পাওয়া যায়নি।
          </div>
        )}
      </div>
    </div>
  );
};

export default MemberTransactions;
