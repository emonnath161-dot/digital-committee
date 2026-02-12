
import React, { useState, useEffect } from 'react';
import { Update, School, User as AppUser, GalleryImage, Transaction, Student } from '../types';
import { supabase } from '../lib/supabase';
import { 
  Plus, Trash2, Save, School as SchoolIcon, 
  Image as ImageIcon, Lock, Database, Loader2, 
  ChevronRight, Video, Monitor, Smartphone as PortraitIcon, 
  GraduationCap, X, Edit, RefreshCw, Mail, Phone, MapPin, Facebook, Globe, MessageSquare, Users as UsersIcon, Droplet
} from 'lucide-react';

interface AdminProps {
  updates: Update[];
  schools: School[];
  users: AppUser[];
  gallery: GalleryImage[];
  transactions: Transaction[];
  contactInfo: any;
  onUpdateUpdates: () => Promise<void> | void;
  onUpdateSchools: () => Promise<void> | void;
  onUpdateGallery: () => Promise<void> | void;
  onUpdateTransactions: () => Promise<void> | void;
  onUpdateSettings: () => Promise<void> | void;
  onUpdateUsers: () => Promise<void> | void;
  isDarkMode: boolean;
}

const Admin: React.FC<AdminProps> = ({ 
  updates, schools, users, gallery, transactions, contactInfo,
  onUpdateUpdates, onUpdateSchools, onUpdateGallery, onUpdateTransactions, onUpdateSettings, onUpdateUsers,
  isDarkMode
}) => {
  const [activeTab, setActiveTab] = useState<'accounts' | 'schools' | 'updates' | 'gallery' | 'users' | 'contact' | 'setup'>('accounts');
  const [loading, setLoading] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminPass, setAdminPass] = useState('');
  
  const [selectedMember, setSelectedMember] = useState<AppUser | null>(null);
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const [schoolStudents, setSchoolStudents] = useState<Student[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | number | null>(null);

  // Form States
  const [feeForm, setFeeForm] = useState({ amount: '', month: '' });
  const [updateForm, setUpdateForm] = useState({ title: '', description: '', image: '', media_type: 'image' as 'image' | 'video', aspect_ratio: 'landscape' as 'landscape' | 'portrait' });
  const [schoolForm, setSchoolForm] = useState({ name: '', teacherName: '', teacherPhone: '', established: '', teacherImage: '' });
  const [studentForm, setStudentForm] = useState({ name: '', fatherName: '', motherName: '', mobile: '', className: '', roll: '', image: '' });
  const [galleryForm, setGalleryForm] = useState({ title: '', description: '', url: '' });
  const [contactForm, setContactForm] = useState(contactInfo);

  useEffect(() => {
    if (selectedSchool) fetchStudents(selectedSchool.id);
  }, [selectedSchool]);

  useEffect(() => {
    setContactForm(contactInfo);
  }, [contactInfo]);

  const fetchStudents = async (schoolId: string) => {
    const { data, error } = await supabase.from('students').select('*').eq('school_id', schoolId).order('roll', { ascending: true });
    if (!error) setSchoolStudents(data || []);
  };

  const handleAdminAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPass === '1234') setIsAdminAuthenticated(true);
    else alert('ভুল পিন!');
  };

  const resetForms = () => {
    setEditingId(null);
    setSchoolForm({ name: '', teacherName: '', teacherPhone: '', established: '', teacherImage: '' });
    setStudentForm({ name: '', fatherName: '', motherName: '', mobile: '', className: '', roll: '', image: '' });
    setUpdateForm({ title: '', description: '', image: '', media_type: 'image', aspect_ratio: 'landscape' });
    setGalleryForm({ title: '', description: '', url: '' });
    setFeeForm({ amount: '', month: '' });
  };

  const handleSave = async (table: string, rawData: any, refreshCallback: () => Promise<void> | void) => {
    if (loading) return;
    setLoading(true);

    try {
      let payload: any = {};
      
      if (table === 'site_settings') {
        payload = { ...rawData, id: 'contact_info' };
      } else if (table === 'schools') {
        payload = { name: rawData.name, "teacherName": rawData.teacherName, "teacherPhone": rawData.teacherPhone, "teacherImage": rawData.teacherImage, established: rawData.established };
      } else if (table === 'students') {
        payload = { school_id: rawData.school_id, name: rawData.name, "fatherName": rawData.fatherName, "motherName": rawData.motherName, mobile: rawData.mobile, "className": rawData.className, roll: rawData.roll, image: rawData.image };
      } else if (table === 'transactions') {
        payload = { "userId": rawData.userId, amount: parseFloat(rawData.amount), month: rawData.month, date: new Date().toISOString() };
      } else if (table === 'updates') {
        payload = { ...rawData, date: new Date().toLocaleDateString('bn-BD') };
      } else {
        payload = { ...rawData };
      }

      if (editingId && table !== 'site_settings') {
        payload.id = ['updates', 'gallery', 'transactions'].includes(table) ? Number(editingId) : editingId;
      }

      const { error } = await supabase.from(table).upsert([payload]);

      if (error) throw error;

      if (refreshCallback) await refreshCallback();
      if (table === 'students' && selectedSchool) await fetchStudents(selectedSchool.id);

      setShowModal(false);
      resetForms();
      alert('সফলভাবে সংরক্ষিত হয়েছে!');
    } catch (err: any) {
      alert(`সেভ করা যায়নি: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const deleteItem = async (table: string, id: any) => {
    if (!confirm('ডিলিট করতে চান?')) return;
    try {
      await supabase.from(table).delete().eq('id', id);
      if (table === 'updates') await onUpdateUpdates();
      if (table === 'schools') await onUpdateSchools();
      if (table === 'gallery') await onUpdateGallery();
      if (table === 'transactions') await onUpdateTransactions();
      if (table === 'profiles') await onUpdateUsers();
      if (table === 'students' && selectedSchool) await fetchStudents(selectedSchool.id);
      alert('ডিলিট সফল হয়েছে।');
    } catch (err) {
      alert('ডিলিট হয়নি।');
    }
  };

  const clearChat = async () => {
    if (!confirm('সতর্কতা: সব মেসেজ ডিলিট করতে চান? এটি আর ফিরিয়ে আনা যাবে না।')) return;
    setLoading(true);
    try {
      const { error } = await supabase.from('messages').delete().neq('id', 0); // সব ডিলিট
      if (error) throw error;
      alert('সব মেসেজ ক্লিয়ার করা হয়েছে।');
    } catch (e) {
      alert('মেসেজ ডিলিট হয়নি।');
    } finally {
      setLoading(false);
    }
  };

  const openEdit = (type: string, item: any) => {
    setEditingId(item.id);
    if (type === 'school') setSchoolForm({ name: item.name, teacherName: item.teacherName, teacherPhone: item.teacherPhone, established: item.established, teacherImage: item.teacherImage });
    if (type === 'student') setStudentForm({ name: item.name, fatherName: item.fatherName, motherName: item.motherName, mobile: item.mobile, className: item.className, roll: item.roll, image: item.image });
    if (type === 'update') setUpdateForm({ title: item.title, description: item.description, image: item.image, media_type: item.media_type, aspect_ratio: item.aspect_ratio });
    if (type === 'gallery') setGalleryForm({ title: item.title, description: item.description, url: item.url });
    setShowModal(true);
  };

  if (!isAdminAuthenticated) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-4">
        <div className="bg-white dark:bg-slate-800 p-10 rounded-[3rem] shadow-2xl w-full max-sm text-center border-2 border-indigo-600">
          <Lock size={48} className="mx-auto text-indigo-600 mb-6" />
          <h2 className="text-2xl font-black mb-6 dark:text-white">অ্যাডমিন প্রবেশ</h2>
          <form onSubmit={handleAdminAuth} className="space-y-4">
            <input type="password" placeholder="PIN: 1234" className="w-full p-4 bg-gray-50 dark:bg-slate-900 border rounded-2xl text-center font-black dark:text-white outline-none focus:border-indigo-600" value={adminPass} onChange={(e) => setAdminPass(e.target.value)} />
            <button className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-lg hover:bg-indigo-700 transition-all">প্রবেশ করুন</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-32 space-y-6 max-w-4xl mx-auto px-2 relative min-h-screen animate-fadeIn">
      {/* Tab Navigation */}
      <div className="flex overflow-x-auto space-x-2 p-2 bg-white dark:bg-slate-800 rounded-3xl shadow-sm sticky top-20 z-40 border dark:border-slate-700 scrollbar-hide">
        {(['accounts', 'schools', 'updates', 'gallery', 'users', 'contact', 'setup'] as const).map(tab => (
          <button key={tab} onClick={() => { setActiveTab(tab); setSelectedMember(null); setSelectedSchool(null); resetForms(); }} className={`px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700'}`}>
            {tab === 'accounts' ? 'হিসাব' : tab === 'schools' ? 'স্কুল' : tab === 'updates' ? 'আপডেট' : tab === 'gallery' ? 'গ্যালারি' : tab === 'users' ? 'ইউজার' : tab === 'contact' ? 'যোগাযোগ' : 'সেটআপ'}
          </button>
        ))}
      </div>

      <div className="px-1">
        {/* ACCOUNTS */}
        {activeTab === 'accounts' && !selectedMember && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {users.map(u => (
              <div key={u.id} className="bg-white dark:bg-slate-800 p-4 rounded-3xl border flex items-center justify-between shadow-sm">
                <div className="flex items-center space-x-3">
                  <img src={u.profilePic} className="w-10 h-10 rounded-xl object-cover" />
                  <div>
                    <h4 className="font-black text-sm dark:text-white">{u.name}</h4>
                    <p className="text-[9px] text-indigo-500 font-bold uppercase">{u.designation}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedMember(u)} className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-black text-[10px] uppercase shadow-md active:scale-95 transition-all">ফি জমা</button>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'accounts' && selectedMember && (
          <div className="bg-white dark:bg-slate-800 p-6 rounded-[2.5rem] border shadow-xl">
             <button onClick={() => setSelectedMember(null)} className="mb-4 text-indigo-600 font-black text-xs uppercase flex items-center"><ChevronRight className="rotate-180" /> ফিরে যান</button>
             <h3 className="text-xl font-black mb-6 dark:text-white">{selectedMember.name} এর ইতিহাস</h3>
             <div className="space-y-2 mb-6">
                {transactions.filter(t => t.userId === selectedMember.id).map(t => (
                  <div key={t.id} className="p-3 bg-gray-50 dark:bg-slate-900 rounded-xl flex justify-between items-center border dark:border-slate-700">
                    <span className="font-bold dark:text-white">{t.amount} ৳ - {t.month}</span>
                    <button onClick={() => deleteItem('transactions', t.id)} className="text-red-500 p-2"><Trash2 size={16}/></button>
                  </div>
                ))}
             </div>
             <button onClick={() => setShowModal(true)} className="w-full py-4 bg-green-600 text-white rounded-2xl font-black flex items-center justify-center space-x-2"><Plus/> <span>নতুন ফি জমা</span></button>
          </div>
        )}

        {/* SCHOOLS */}
        {activeTab === 'schools' && !selectedSchool && (
          <div className="grid gap-4">
            {schools.map(s => (
              <div key={s.id} className="bg-white dark:bg-slate-800 p-5 rounded-[2rem] border flex items-center justify-between shadow-sm hover:border-indigo-600 transition-all">
                <div className="flex items-center space-x-4">
                   <SchoolIcon className="text-indigo-600" />
                   <h4 className="font-black text-lg dark:text-white">{s.name}</h4>
                </div>
                <div className="flex space-x-2">
                   <button onClick={() => setSelectedSchool(s)} className="p-3 bg-indigo-50 text-indigo-600 rounded-xl"><ChevronRight/></button>
                   <button onClick={() => deleteItem('schools', s.id)} className="p-3 bg-red-50 text-red-500 rounded-xl"><Trash2/></button>
                </div>
              </div>
            ))}
            <button onClick={() => { resetForms(); setShowModal(true); }} className="fixed bottom-24 right-6 w-14 h-14 bg-indigo-600 text-white rounded-full shadow-2xl flex items-center justify-center z-50 animate-bounce"><Plus size={32}/></button>
          </div>
        )}

        {activeTab === 'schools' && selectedSchool && (
          <div className="space-y-4">
             <button onClick={() => setSelectedSchool(null)} className="text-indigo-600 font-black text-xs uppercase flex items-center"><ChevronRight className="rotate-180" /> ফিরে যান</button>
             <div className="bg-indigo-900 p-6 rounded-[2rem] text-white flex justify-between items-center shadow-lg">
                <h3 className="text-xl font-black">{selectedSchool.name}</h3>
                <button onClick={() => openEdit('school', selectedSchool)} className="p-3 bg-white/20 rounded-xl"><Edit/></button>
             </div>
             
             <div className="flex items-center justify-between mt-6">
                <h4 className="font-black text-lg flex items-center dark:text-white"><GraduationCap className="mr-2 text-indigo-500"/> শিক্ষার্থী ({schoolStudents.length})</h4>
                <button onClick={() => { resetForms(); setShowModal(true); }} className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-black text-[10px] uppercase shadow-md">নতুন শিক্ষার্থী</button>
             </div>

             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {schoolStudents.map(st => (
                  <div key={st.id} className="bg-white dark:bg-slate-800 p-3 rounded-2xl border flex items-center justify-between shadow-sm">
                     <div className="flex items-center space-x-3">
                        <img src={st.image} className="w-10 h-10 rounded-lg object-cover border dark:border-slate-700" />
                        <div>
                           <h5 className="font-black text-sm dark:text-white leading-tight">{st.name}</h5>
                           <p className="text-[10px] opacity-60">রোল: {st.roll}</p>
                        </div>
                     </div>
                     <div className="flex space-x-1">
                        <button onClick={() => openEdit('student', st)} className="p-2 text-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg"><Edit size={14}/></button>
                        <button onClick={() => deleteItem('students', st.id)} className="p-2 text-red-400 bg-red-50 dark:bg-red-900/30 rounded-lg"><Trash2 size={14}/></button>
                     </div>
                  </div>
                ))}
             </div>
          </div>
        )}

        {/* UPDATES TAB */}
        {activeTab === 'updates' && (
          <div className="space-y-4">
            <h3 className="text-xl font-black dark:text-white mb-4">সকল আপডেট ({updates.length})</h3>
            <div className="grid gap-4">
              {updates.map(up => (
                <div key={up.id} className="bg-white dark:bg-slate-800 p-4 rounded-3xl border flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img src={up.image} className="w-12 h-12 rounded-xl object-cover" />
                    <h4 className="font-black text-sm dark:text-white truncate max-w-[150px]">{up.title}</h4>
                  </div>
                  <div className="flex space-x-2">
                    <button onClick={() => openEdit('update', up)} className="p-2 text-indigo-600 bg-indigo-50 rounded-xl"><Edit size={18}/></button>
                    <button onClick={() => deleteItem('updates', up.id)} className="p-2 text-red-500 bg-red-50 rounded-xl"><Trash2 size={18}/></button>
                  </div>
                </div>
              ))}
              <button onClick={() => { resetForms(); setShowModal(true); }} className="w-full py-4 border-2 border-dashed border-indigo-200 rounded-3xl text-indigo-500 font-black flex items-center justify-center space-x-2"><Plus/> <span>নতুন আপডেট যোগ করুন</span></button>
            </div>
          </div>
        )}

        {/* GALLERY TAB */}
        {activeTab === 'gallery' && (
          <div className="space-y-4">
            <h3 className="text-xl font-black dark:text-white mb-4">গ্যালারি চিত্রপট ({gallery.length})</h3>
            <div className="grid grid-cols-2 gap-4">
              {gallery.map(img => (
                <div key={img.id} className="bg-white dark:bg-slate-800 p-2 rounded-3xl border relative group">
                  <img src={img.url} className="w-full aspect-square rounded-2xl object-cover" />
                  <div className="absolute inset-2 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex items-center justify-center space-x-2">
                    <button onClick={() => openEdit('gallery', img)} className="p-2 bg-white text-indigo-600 rounded-xl"><Edit size={16}/></button>
                    <button onClick={() => deleteItem('gallery', img.id)} className="p-2 bg-white text-red-500 rounded-xl"><Trash2 size={16}/></button>
                  </div>
                </div>
              ))}
              <button onClick={() => { resetForms(); setShowModal(true); }} className="aspect-square border-2 border-dashed border-indigo-200 rounded-3xl text-indigo-500 flex flex-col items-center justify-center space-y-2"><Plus size={32}/> <span className="text-[10px] font-black">নতুন ছবি</span></button>
            </div>
          </div>
        )}

        {/* USERS TAB (RE-ADDED) */}
        {activeTab === 'users' && (
          <div className="space-y-4 animate-fadeIn">
            <h3 className="text-xl font-black dark:text-white mb-4 flex items-center">
              <UsersIcon className="mr-2 text-indigo-600" /> সকল নিবন্ধিত ইউজার ({users.length})
            </h3>
            <div className="grid grid-cols-1 gap-4">
              {users.map(user => (
                <div key={user.id} className="bg-white dark:bg-slate-800 p-5 rounded-[2rem] border shadow-sm flex items-center justify-between hover:border-indigo-600 transition-all">
                  <div className="flex items-center space-x-4 min-w-0">
                    <img src={user.profilePic} className="w-14 h-14 rounded-2xl object-cover border-2 border-indigo-50" />
                    <div className="min-w-0">
                      <h4 className="font-black text-lg dark:text-white leading-tight truncate">{user.name}</h4>
                      <div className="flex flex-wrap gap-2 mt-1">
                        <span className="text-[8px] font-black bg-indigo-50 dark:bg-indigo-900/50 text-indigo-600 px-2 py-0.5 rounded-full uppercase">{user.designation}</span>
                        <span className="text-[8px] font-black bg-red-50 dark:bg-red-900/50 text-red-600 px-2 py-0.5 rounded-full flex items-center">
                          <Droplet size={8} className="mr-1" /> {user.bloodGroup}
                        </span>
                      </div>
                      <div className="mt-2 space-y-0.5">
                        <p className="text-[10px] font-bold text-gray-500 flex items-center"><Phone size={10} className="mr-1" /> {user.mobile}</p>
                        <p className="text-[10px] font-bold text-gray-400 flex items-center truncate"><MapPin size={10} className="mr-1" /> {user.address || 'ঠিকানা নেই'}</p>
                      </div>
                    </div>
                  </div>
                  <button onClick={() => deleteItem('profiles', user.id)} className="p-3 text-red-500 bg-red-50 dark:bg-red-900/30 rounded-2xl hover:bg-red-500 hover:text-white transition-all">
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CONTACT TAB */}
        {activeTab === 'contact' && (
          <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border shadow-xl animate-fadeIn">
             <h3 className="text-xl font-black mb-8 dark:text-white flex items-center"><Phone className="mr-2 text-indigo-600" /> কন্টাক্ট ইনফো এডিট</h3>
             <div className="space-y-5">
                <div className="relative">
                   <Phone className="absolute left-4 top-4 text-indigo-600" size={18} />
                   <input type="text" placeholder="ফোন ১" className="w-full pl-12 p-4 bg-gray-50 dark:bg-slate-900 rounded-2xl border dark:border-slate-700 dark:text-white font-bold" value={contactForm.phone1} onChange={e => setContactForm({...contactForm, phone1: e.target.value})} />
                </div>
                <div className="relative">
                   <Phone className="absolute left-4 top-4 text-indigo-600" size={18} />
                   <input type="text" placeholder="ফোন ২" className="w-full pl-12 p-4 bg-gray-50 dark:bg-slate-900 rounded-2xl border dark:border-slate-700 dark:text-white font-bold" value={contactForm.phone2} onChange={e => setContactForm({...contactForm, phone2: e.target.value})} />
                </div>
                <div className="relative">
                   <Mail className="absolute left-4 top-4 text-indigo-600" size={18} />
                   <input type="email" placeholder="ইমেইল" className="w-full pl-12 p-4 bg-gray-50 dark:bg-slate-900 rounded-2xl border dark:border-slate-700 dark:text-white font-bold" value={contactForm.email} onChange={e => setContactForm({...contactForm, email: e.target.value})} />
                </div>
                <div className="relative">
                   <MapPin className="absolute left-4 top-4 text-indigo-600" size={18} />
                   <input type="text" placeholder="ঠিকানা" className="w-full pl-12 p-4 bg-gray-50 dark:bg-slate-900 rounded-2xl border dark:border-slate-700 dark:text-white font-bold" value={contactForm.address} onChange={e => setContactForm({...contactForm, address: e.target.value})} />
                </div>
                <div className="relative">
                   <Facebook className="absolute left-4 top-4 text-indigo-600" size={18} />
                   <input type="text" placeholder="ফেসবুক লিঙ্ক" className="w-full pl-12 p-4 bg-gray-50 dark:bg-slate-900 rounded-2xl border dark:border-slate-700 dark:text-white font-bold" value={contactForm.facebook} onChange={e => setContactForm({...contactForm, facebook: e.target.value})} />
                </div>
                <div className="relative">
                   <Globe className="absolute left-4 top-4 text-indigo-600" size={18} />
                   <input type="text" placeholder="ওয়েবসাইট লিঙ্ক" className="w-full pl-12 p-4 bg-gray-50 dark:bg-slate-900 rounded-2xl border dark:border-slate-700 dark:text-white font-bold" value={contactForm.website} onChange={e => setContactForm({...contactForm, website: e.target.value})} />
                </div>
                <button onClick={() => handleSave('site_settings', contactForm, onUpdateSettings)} disabled={loading} className="w-full py-5 bg-indigo-600 text-white rounded-[1.5rem] font-black text-lg shadow-lg flex items-center justify-center space-x-2">
                  {loading ? <Loader2 className="animate-spin" /> : <Save />} <span>সেটিংস সেভ করুন</span>
                </button>
             </div>
          </div>
        )}

        {/* SETUP TAB */}
        {activeTab === 'setup' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-800 p-10 rounded-[3rem] text-center border-2 border-dashed border-indigo-200 shadow-xl max-w-md mx-auto">
               <Database size={48} className="mx-auto text-indigo-600 mb-6" />
               <h3 className="text-2xl font-black mb-4 dark:text-white">সিস্টেম মেরামত</h3>
               <p className="text-gray-500 mb-8 font-bold text-[10px] uppercase dark:text-slate-400">যদি ডাটা সেভ না হয়, তবে চ্যাট থেকে SQL কোডটি কপি করে সুপাবেস এ রান করুন।</p>
               <button onClick={() => alert('SQL কোডটি চ্যাট থেকে কপি করুন।')} className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-lg flex items-center mx-auto">
                 <RefreshCw size={18} className="mr-2" /> মাস্টার SQL গাইড
               </button>
            </div>

            <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border shadow-xl">
               <h3 className="text-xl font-black mb-6 text-red-500 flex items-center"><MessageSquare className="mr-2" /> মেসেঞ্জার সেটিংস</h3>
               <p className="text-xs text-gray-500 mb-4 font-bold">গ্রুপ চ্যাট এর সকল মেসেজ ডিলিট করতে নিচের বাটনটি চাপুন।</p>
               <button onClick={clearChat} className="w-full py-4 bg-red-500 text-white rounded-2xl font-black flex items-center justify-center space-x-2 active:scale-95 transition-all">
                 <Trash2 size={20} /> <span>মেসেজ হিস্ট্রি ক্লিয়ার করুন</span>
               </button>
            </div>
          </div>
        )}
      </div>

      {/* MODAL SYSTEM */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-800 w-full max-w-lg rounded-[2.5rem] p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto border-4 border-indigo-600 scrollbar-hide">
            <button onClick={() => setShowModal(false)} className="absolute top-6 right-6 p-2 bg-gray-100 dark:bg-slate-700 rounded-xl text-gray-500"><X/></button>
            <h3 className="text-xl font-black mb-8 text-indigo-600 flex items-center">
              {editingId ? <Edit className="mr-2" /> : <Plus className="mr-2" />}
              {editingId ? 'সংশোধন করুন' : 'নতুন যোগ করুন'}
            </h3>
            
            <div className="space-y-4">
              {activeTab === 'accounts' && selectedMember && (
                <div className="space-y-4">
                  <input type="number" placeholder="টাকার পরিমাণ (৳)" className="w-full p-4 bg-gray-50 dark:bg-slate-900 rounded-2xl font-black border dark:border-slate-700 dark:text-white outline-none focus:border-indigo-600" value={feeForm.amount} onChange={e => setFeeForm({...feeForm, amount: e.target.value})} />
                  <input type="text" placeholder="মাসের নাম (উদা: জানুয়ারি ২০২৫)" className="w-full p-4 bg-gray-50 dark:bg-slate-900 rounded-2xl font-black border dark:border-slate-700 dark:text-white outline-none focus:border-indigo-600" value={feeForm.month} onChange={e => setFeeForm({...feeForm, month: e.target.value})} />
                  <button onClick={() => handleSave('transactions', { "userId": selectedMember.id, amount: feeForm.amount, month: feeForm.month }, onUpdateTransactions)} disabled={loading} className="w-full py-4 bg-green-600 text-white rounded-2xl font-black shadow-lg flex items-center justify-center active:scale-95 transition-all">
                    {loading ? <Loader2 className="animate-spin mr-2"/> : <Save className="mr-2"/>} সেভ করুন
                  </button>
                </div>
              )}

              {activeTab === 'schools' && !selectedSchool && (
                <div className="space-y-4">
                  <input type="text" placeholder="স্কুলের নাম" className="w-full p-4 bg-gray-50 dark:bg-slate-900 rounded-2xl font-black border dark:border-slate-700 dark:text-white outline-none focus:border-indigo-600" value={schoolForm.name} onChange={e => setSchoolForm({...schoolForm, name: e.target.value})} />
                  <input type="text" placeholder="প্রধান শিক্ষক" className="w-full p-4 bg-gray-50 dark:bg-slate-900 rounded-2xl font-black border dark:border-slate-700 dark:text-white outline-none focus:border-indigo-600" value={schoolForm.teacherName} onChange={e => setSchoolForm({...schoolForm, teacherName: e.target.value})} />
                  <input type="text" placeholder="ফোন" className="w-full p-4 bg-gray-50 dark:bg-slate-900 rounded-2xl font-black border dark:border-slate-700 dark:text-white outline-none focus:border-indigo-600" value={schoolForm.teacherPhone} onChange={e => setSchoolForm({...schoolForm, teacherPhone: e.target.value})} />
                  <input type="text" placeholder="ছবি URL" className="w-full p-4 bg-gray-50 dark:bg-slate-900 rounded-2xl font-black border dark:border-slate-700 dark:text-white outline-none focus:border-indigo-600" value={schoolForm.teacherImage} onChange={e => setSchoolForm({...schoolForm, teacherImage: e.target.value})} />
                  <input type="text" placeholder="স্থাপিত" className="w-full p-4 bg-gray-50 dark:bg-slate-900 rounded-2xl font-black border dark:border-slate-700 dark:text-white outline-none focus:border-indigo-600" value={schoolForm.established} onChange={e => setSchoolForm({...schoolForm, established: e.target.value})} />
                  <button onClick={() => handleSave('schools', schoolForm, onUpdateSchools)} disabled={loading} className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black flex items-center justify-center active:scale-95 transition-all">
                    {loading ? <Loader2 className="animate-spin mr-2"/> : <Save className="mr-2"/>} স্কুল সেভ করুন
                  </button>
                </div>
              )}

              {activeTab === 'schools' && selectedSchool && (
                <div className="space-y-4">
                  <input type="text" placeholder="শিক্ষার্থীর নাম" className="w-full p-4 bg-gray-50 dark:bg-slate-900 rounded-2xl font-black border dark:border-slate-700 dark:text-white outline-none focus:border-indigo-600" value={studentForm.name} onChange={e => setStudentForm({...studentForm, name: e.target.value})} />
                  <div className="grid grid-cols-2 gap-2">
                    <input type="text" placeholder="পিতা" className="w-full p-4 bg-gray-50 dark:bg-slate-900 rounded-2xl font-black border dark:border-slate-700 dark:text-white outline-none focus:border-indigo-600" value={studentForm.fatherName} onChange={e => setStudentForm({...studentForm, fatherName: e.target.value})} />
                    <input type="text" placeholder="মাতা" className="w-full p-4 bg-gray-50 dark:bg-slate-900 rounded-2xl font-black border dark:border-slate-700 dark:text-white outline-none focus:border-indigo-600" value={studentForm.motherName} onChange={e => setStudentForm({...studentForm, motherName: e.target.value})} />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input type="text" placeholder="মোবাইল" className="w-full p-4 bg-gray-50 dark:bg-slate-900 rounded-2xl font-black border dark:border-slate-700 dark:text-white outline-none focus:border-indigo-600" value={studentForm.mobile} onChange={e => setStudentForm({...studentForm, mobile: e.target.value})} />
                    <input type="text" placeholder="রোল" className="w-full p-4 bg-gray-50 dark:bg-slate-900 rounded-2xl font-black border dark:border-slate-700 dark:text-white outline-none focus:border-indigo-600" value={studentForm.roll} onChange={e => setStudentForm({...studentForm, roll: e.target.value})} />
                  </div>
                  <input type="text" placeholder="শ্রেণী" className="w-full p-4 bg-gray-50 dark:bg-slate-900 rounded-2xl font-black border dark:border-slate-700 dark:text-white outline-none focus:border-indigo-600" value={studentForm.className} onChange={e => setStudentForm({...studentForm, className: e.target.value})} />
                  <input type="text" placeholder="ছবি URL" className="w-full p-4 bg-gray-50 dark:bg-slate-900 rounded-2xl font-black border dark:border-slate-700 dark:text-white outline-none focus:border-indigo-600" value={studentForm.image} onChange={e => setStudentForm({...studentForm, image: e.target.value})} />
                  <button onClick={() => handleSave('students', { ...studentForm, school_id: selectedSchool.id }, onUpdateSchools)} disabled={loading} className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black flex items-center justify-center active:scale-95 transition-all">
                    {loading ? <Loader2 className="animate-spin mr-2"/> : <Save className="mr-2"/>} শিক্ষার্থী সেভ করুন
                  </button>
                </div>
              )}

              {activeTab === 'updates' && (
                <div className="space-y-4">
                  <input type="text" placeholder="টাইটেল" className="w-full p-4 bg-gray-50 dark:bg-slate-900 rounded-2xl font-black border dark:border-slate-700 dark:text-white outline-none focus:border-indigo-600" value={updateForm.title} onChange={e => setUpdateForm({...updateForm, title: e.target.value})} />
                  <textarea placeholder="বর্ণনা" className="w-full p-4 bg-gray-50 dark:bg-slate-900 rounded-2xl font-black border dark:border-slate-700 dark:text-white outline-none focus:border-indigo-600" value={updateForm.description} onChange={e => setUpdateForm({...updateForm, description: e.target.value})} />
                  <input type="text" placeholder="ছবি/ভিডিও URL" className="w-full p-4 bg-gray-50 dark:bg-slate-900 rounded-2xl font-black border dark:border-slate-700 dark:text-white outline-none focus:border-indigo-600" value={updateForm.image} onChange={e => setUpdateForm({...updateForm, image: e.target.value})} />
                  <div className="grid grid-cols-2 gap-2">
                    <select className="p-4 bg-gray-50 dark:bg-slate-900 rounded-2xl border dark:border-slate-700 dark:text-white" value={updateForm.media_type} onChange={e => setUpdateForm({...updateForm, media_type: e.target.value as any})}>
                      <option value="image">Image</option>
                      <option value="video">Video</option>
                    </select>
                    <select className="p-4 bg-gray-50 dark:bg-slate-900 rounded-2xl border dark:border-slate-700 dark:text-white" value={updateForm.aspect_ratio} onChange={e => setUpdateForm({...updateForm, aspect_ratio: e.target.value as any})}>
                      <option value="landscape">Landscape</option>
                      <option value="portrait">Portrait</option>
                    </select>
                  </div>
                  <button onClick={() => handleSave('updates', updateForm, onUpdateUpdates)} disabled={loading} className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black flex items-center justify-center active:scale-95 transition-all">
                    {loading ? <Loader2 className="animate-spin mr-2"/> : <Save className="mr-2"/>} আপডেট সেভ করুন
                  </button>
                </div>
              )}

              {activeTab === 'gallery' && (
                <div className="space-y-4">
                  <input type="text" placeholder="টাইটেল" className="w-full p-4 bg-gray-50 dark:bg-slate-900 rounded-2xl font-black border dark:border-slate-700 dark:text-white outline-none focus:border-indigo-600" value={galleryForm.title} onChange={e => setGalleryForm({...galleryForm, title: e.target.value})} />
                  <textarea placeholder="বর্ণনা" className="w-full p-4 bg-gray-50 dark:bg-slate-900 rounded-2xl font-black border dark:border-slate-700 dark:text-white outline-none focus:border-indigo-600" value={galleryForm.description} onChange={e => setGalleryForm({...galleryForm, description: e.target.value})} />
                  <input type="text" placeholder="ছবির URL" className="w-full p-4 bg-gray-50 dark:bg-slate-900 rounded-2xl font-black border dark:border-slate-700 dark:text-white outline-none focus:border-indigo-600" value={galleryForm.url} onChange={e => setGalleryForm({...galleryForm, url: e.target.value})} />
                  <button onClick={() => handleSave('gallery', galleryForm, onUpdateGallery)} disabled={loading} className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black flex items-center justify-center active:scale-95 transition-all">
                    {loading ? <Loader2 className="animate-spin mr-2"/> : <Save className="mr-2"/>} গ্যালারি সেভ করুন
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
