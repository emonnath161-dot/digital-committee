
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Phone, Mail, MapPin, Facebook, Globe } from 'lucide-react';

interface ContactProps {
  contactInfo: {
    phone1: string;
    phone2: string;
    email: string;
    address: string;
    facebook: string;
    website: string;
  };
}

const Contact: React.FC<ContactProps> = ({ contactInfo }) => {
  const navigate = useNavigate();

  return (
    <div className="animate-fadeIn pb-10">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-600 dark:text-slate-400 hover:text-indigo-600 mb-8 transition font-black text-sm uppercase"
      >
        <ArrowLeft size={20} className="mr-2" />
        ফিরে যান
      </button>

      <div className="bg-white dark:bg-slate-800 rounded-[3rem] p-10 shadow-2xl border dark:border-slate-700 max-w-2xl mx-auto">
        <h2 className="text-4xl font-black text-indigo-900 dark:text-indigo-400 mb-3">যোগাযোগ করুন</h2>
        <p className="text-gray-500 dark:text-slate-400 mb-12 font-bold uppercase tracking-wider text-xs">যেকোনো প্রশ্ন বা তথ্যের জন্য আমাদের সাথে থাকুন</p>

        <div className="space-y-10">
          <div className="flex items-start space-x-6 group">
            <div className="bg-indigo-50 dark:bg-slate-900 p-4 rounded-[1.5rem] text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
              <Phone size={28} />
            </div>
            <div>
              <p className="text-[10px] text-gray-400 font-black uppercase mb-1 tracking-widest">ফোন নাম্বার</p>
              <p className="text-xl font-black text-gray-900 dark:text-white">{contactInfo.phone1}</p>
              <p className="text-sm text-gray-500 dark:text-slate-400 font-bold">{contactInfo.phone2}</p>
            </div>
          </div>

          <div className="flex items-start space-x-6 group">
            <div className="bg-purple-50 dark:bg-slate-900 p-4 rounded-[1.5rem] text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-all shadow-sm">
              <Mail size={28} />
            </div>
            <div>
              <p className="text-[10px] text-gray-400 font-black uppercase mb-1 tracking-widest">ইমেইল ঠিকানা</p>
              <p className="text-xl font-black text-gray-900 dark:text-white break-all">{contactInfo.email}</p>
            </div>
          </div>

          <div className="flex items-start space-x-6 group">
            <div className="bg-red-50 dark:bg-slate-900 p-4 rounded-[1.5rem] text-red-600 group-hover:bg-red-600 group-hover:text-white transition-all shadow-sm">
              <MapPin size={28} />
            </div>
            <div>
              <p className="text-[10px] text-gray-400 font-black uppercase mb-1 tracking-widest">অফিস ঠিকানা</p>
              <p className="text-xl font-black text-gray-900 dark:text-white leading-relaxed">{contactInfo.address}</p>
            </div>
          </div>
        </div>

        <hr className="my-12 border-gray-100 dark:border-slate-700" />

        <div className="text-center">
          <p className="text-[10px] text-gray-400 font-black uppercase mb-8 tracking-[0.3em]">সামাজিক যোগাযোগ</p>
          <div className="flex justify-center space-x-6">
            <a href={contactInfo.facebook} target="_blank" rel="noreferrer" className="w-16 h-16 bg-blue-50 dark:bg-slate-900 rounded-[1.5rem] flex items-center justify-center text-blue-600 hover:bg-blue-600 hover:text-white transition-all shadow-sm hover:shadow-blue-200 dark:hover:shadow-none hover:-translate-y-1">
              <Facebook size={28} />
            </a>
            <a href={contactInfo.website} target="_blank" rel="noreferrer" className="w-16 h-16 bg-indigo-50 dark:bg-slate-900 rounded-[1.5rem] flex items-center justify-center text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all shadow-sm hover:shadow-indigo-200 dark:hover:shadow-none hover:-translate-y-1">
              <Globe size={28} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
