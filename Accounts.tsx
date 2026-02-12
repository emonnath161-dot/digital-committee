
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Transaction } from '../types';
import { DESIGNATION_RANK } from '../constants';
import { ArrowLeft, Wallet, TrendingUp, ChevronRight, User as UserIcon } from 'lucide-react';

interface AccountsProps {
  users: User[];
  transactions: Transaction[];
  isDarkMode: boolean;
}

const Accounts: React.FC<AccountsProps> = ({ users, transactions, isDarkMode }) => {
  const navigate = useNavigate();

  // Members who are NOT "সাধারণ সদস্য"
  const committeeMembers = users
    .filter(u => u.designation !== "সাধারণ সদস্য")
    .sort((a, b) => DESIGNATION_RANK[a.designation] - DESIGNATION_RANK[b.designation]);

  const calculateTotal = (userId: string) => {
    return transactions
      .filter(t => t.userId === userId)
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const grandTotal = transactions.reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="animate-fadeIn pb-24 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <button 
          onClick={() => navigate(-1)}
          className={`flex items-center px-5 py-2 rounded-xl transition font-black text-xs uppercase tracking-widest ${isDarkMode ? 'bg-slate-800 text-slate-400 hover:text-indigo-400' : 'bg-white text-gray-600 hover:text-indigo-600 shadow-sm border border-gray-100'}`}
        >
          <ArrowLeft size={16} className="mr-2" /> ফিরে যান
        </button>
      </div>

      <div className="mb-10 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-600 rounded-[2.5rem] text-white shadow-2xl mb-6">
          <Wallet size={40} />
        </div>
        <h2 className={`text-4xl font-black mb-2 ${isDarkMode ? 'text-slate-100' : 'text-indigo-950'}`}>কমিটি হিসাব</h2>
        <div className="w-20 h-2 bg-indigo-600 rounded-full mx-auto mb-4"></div>
        <div className={`inline-block px-6 py-2 rounded-2xl font-black text-lg ${isDarkMode ? 'bg-slate-800 text-green-400' : 'bg-green-50 text-green-700 border border-green-100'}`}>
          সর্বমোট ফান্ড: {grandTotal.toLocaleString('bn-BD')} ৳
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {committeeMembers.map((member) => {
          const totalPaid = calculateTotal(member.id);
          return (
            <div 
              key={member.id} 
              className={`rounded-[2rem] p-6 border transition-all duration-300 flex flex-col justify-between group ${isDarkMode ? 'bg-slate-800 border-slate-700 hover:bg-slate-700/50' : 'bg-white border-gray-100 hover:shadow-xl'}`}
            >
              <div className="flex items-center space-x-4 mb-6">
                <img 
                  src={member.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=6366f1&color=fff`} 
                  className="w-16 h-16 rounded-2xl object-cover shadow-md"
                  alt={member.name}
                />
                <div className="min-w-0">
                  <h3 className={`text-xl font-black truncate ${isDarkMode ? 'text-slate-100' : 'text-indigo-950'}`}>{member.name}</h3>
                  <p className="text-[10px] font-black uppercase text-indigo-500 tracking-wider">{member.designation}</p>
                </div>
              </div>

              <div className={`p-4 rounded-2xl mb-6 flex items-center justify-between ${isDarkMode ? 'bg-slate-900' : 'bg-indigo-50'}`}>
                <div className="flex items-center space-x-2">
                   <TrendingUp size={18} className="text-green-500" />
                   <span className="text-xs font-black uppercase text-gray-400">মোট জমা</span>
                </div>
                <span className="text-2xl font-black text-indigo-600">{totalPaid.toLocaleString('bn-BD')} ৳</span>
              </div>

              <Link 
                to={`/accounts/${member.id}`}
                className={`w-full py-4 rounded-xl font-black text-sm flex items-center justify-center space-x-2 transition-all ${isDarkMode ? 'bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600 hover:text-white' : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg'}`}
              >
                <span>বিস্তারিত দেখুন</span>
                <ChevronRight size={16} />
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Accounts;
