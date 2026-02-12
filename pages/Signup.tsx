
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Designation } from '../types';
import { DESIGNATIONS, BLOOD_GROUPS } from '../constants';
import { UserPlus, Loader2, Smartphone, Lock, MapPin, ChevronDown, ShieldCheck, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface SignupProps {
  users: User[];
  onSignup: () => void;
}

const Signup: React.FC<SignupProps> = ({ onSignup }) => {
  const [formData, setFormData] = useState({
    name: '',
    designation: '' as Designation | '',
    mobile: '',
    bloodGroup: '',
    password: '',
    address: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.designation || !formData.mobile || !formData.password || !formData.bloodGroup) {
      setError('অনুগ্রহ করে সবগুলো ফিল্ড সঠিকভাবে পূরণ করুন');
      return;
    }

    if (formData.mobile.length < 11) {
      setError('সঠিক মোবাইল নম্বর প্রদান করুন');
      return;
    }

    setLoading(true);
    try {
      // আমরা এখানে 'id' পাঠাচ্ছি না, কারণ ডাটাবেজ স্বয়ংক্রিয়ভাবে ID তৈরি করবে (gen_random_uuid())
      const { error: sbError } = await supabase
        .from('profiles')
        .insert([{
          name: formData.name,
          designation: formData.designation,
          mobile: formData.mobile,
          blood_group: formData.bloodGroup,
          password: formData.password,
          address: formData.address,
          profile_pic: `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&background=4f46e5&color=fff&size=200`,
          email: ''
        }]);

      if (sbError) {
        console.error("Signup error details:", sbError);
        if (sbError.code === '23505') throw new Error('এই মোবাইল নম্বরটি দিয়ে ইতিমধ্যে রেজিস্ট্রেশন করা হয়েছে।');
        if (sbError.message.includes('id') || sbError.message.includes('null value')) {
          throw new Error('ডাটাবেজ আইডি তৈরি করতে ব্যর্থ। অ্যাডমিন প্যানেল থেকে "মাস্টার ফিক্স" SQL রান করুন।');
        }
        throw new Error(sbError.message);
      }

      onSignup();
      alert('রেজিস্ট্রেশন সফল হয়েছে! এখন লগইন করুন।');
      navigate('/login');
    } catch (err: any) {
      setError(err.message || 'রেজিস্ট্রেশন করতে সমস্যা হয়েছে।');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-10 px-4 animate-fadeIn">
      <div className="w-full max-w-lg bg-white p-8 sm:p-12 rounded-[3.5rem] shadow-2xl border border-indigo-50 relative overflow-hidden">
        <div className="text-center mb-10 relative z-10">
          <div className="w-20 h-20 mx-auto mb-6 bg-indigo-600 rounded-[2rem] flex items-center justify-center text-white shadow-xl shadow-indigo-200 rotate-3">
            <UserPlus size={36} />
          </div>
          <h2 className="text-4xl font-black text-indigo-950 leading-tight">নতুন সদস্য নিবন্ধন</h2>
          <p className="text-indigo-400 font-bold text-[10px] mt-2 uppercase tracking-[0.3em]">বাগীশিক উত্তর মাদার্শা</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-5 relative z-10">
          <div className="space-y-1.5">
            <label className="text-[11px] font-black text-gray-400 uppercase ml-4 tracking-wider">পূর্ণ নাম</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-indigo-600">
                <ShieldCheck size={20} />
              </div>
              <input 
                type="text"
                className="w-full pl-14 pr-5 py-4 bg-gray-50 border border-transparent rounded-2xl outline-none focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-50 transition-all font-bold text-gray-700"
                placeholder="আপনার নাম লিখুন"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-black text-gray-400 uppercase ml-4 tracking-wider">পদবী</label>
              <div className="relative">
                <select 
                  className="w-full pl-5 pr-10 py-4 bg-gray-50 border border-transparent rounded-2xl outline-none focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-50 transition-all appearance-none font-bold text-gray-700"
                  value={formData.designation}
                  onChange={(e) => setFormData({...formData, designation: e.target.value as Designation})}
                >
                  <option value="">নির্বাচন করুন</option>
                  {DESIGNATIONS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-indigo-600">
                  <ChevronDown size={20} />
                </div>
              </div>
            </div>
            
            <div className="space-y-1.5">
              <label className="text-[11px] font-black text-gray-400 uppercase ml-4 tracking-wider">রক্তের গ্রুপ</label>
              <div className="relative">
                <select 
                  className="w-full pl-5 pr-10 py-4 bg-gray-50 border border-transparent rounded-2xl outline-none focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-50 transition-all appearance-none font-black text-red-600"
                  value={formData.bloodGroup}
                  onChange={(e) => setFormData({...formData, bloodGroup: e.target.value})}
                >
                  <option value="">গ্রুপ নির্বাচন</option>
                  {BLOOD_GROUPS.map(bg => <option key={bg} value={bg}>{bg}</option>)}
                </select>
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-indigo-600">
                  <ChevronDown size={20} />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-black text-gray-400 uppercase ml-4 tracking-wider">মোবাইল নম্বর</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-indigo-600">
                <Smartphone size={20} />
              </div>
              <input 
                type="tel"
                className="w-full pl-14 pr-5 py-4 bg-gray-50 border border-transparent rounded-2xl outline-none focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-50 transition-all font-bold text-gray-700"
                placeholder="০১XXXXXXXXX"
                value={formData.mobile}
                onChange={(e) => setFormData({...formData, mobile: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-black text-gray-400 uppercase ml-4 tracking-wider">পাসওয়ার্ড</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-indigo-600">
                <Lock size={20} />
              </div>
              <input 
                type="password"
                className="w-full pl-14 pr-5 py-4 bg-gray-50 border border-transparent rounded-2xl outline-none focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-50 transition-all font-bold text-gray-700"
                placeholder="গোপন পাসওয়ার্ড"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-black text-gray-400 uppercase ml-4 tracking-wider">ঠিকানা</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-indigo-600">
                <MapPin size={20} />
              </div>
              <input 
                type="text"
                className="w-full pl-14 pr-5 py-4 bg-gray-50 border border-transparent rounded-2xl outline-none focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-50 transition-all font-bold text-gray-700"
                placeholder="গ্রাম, ইউনিয়ন"
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-[1.5rem] text-xs font-black text-center border border-red-100 flex items-center justify-center space-x-2 animate-pulse shadow-sm">
               <AlertCircle size={16} />
               <span>{error}</span>
            </div>
          )}

          <button 
            type="submit"
            disabled={loading}
            className={`w-full py-5 bg-indigo-600 text-white rounded-[1.5rem] font-black text-xl shadow-xl hover:bg-indigo-700 active:scale-95 transition-all flex items-center justify-center space-x-3 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? <Loader2 className="animate-spin" size={24} /> : null}
            <span>{loading ? 'প্রসেসিং...' : 'নিবন্ধন সম্পন্ন করুন'}</span>
          </button>
        </form>

        <div className="mt-10 pt-8 border-t border-gray-100 text-center">
          <p className="text-gray-400 font-bold text-sm">
            ইতিমধ্যে অ্যাকাউন্ট আছে? 
            <Link to="/login" className="text-indigo-600 font-black hover:underline ml-2">লগইন করুন</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
