
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Header from './components/Header';
import Home from './pages/Home';
import Committee from './pages/Committee';
import Schools from './pages/Schools';
import SchoolDetail from './pages/SchoolDetail';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Contact from './pages/Contact';
import Admin from './pages/Admin';
import Messenger from './pages/Messenger';
import Gallery from './pages/Gallery';
import Accounts from './pages/Accounts';
import MemberTransactions from './pages/MemberTransactions';
import { User, School, Update, Message, GalleryImage, Transaction, Student } from './types';
import { supabase } from './lib/supabase';
import { AlertCircle, RefreshCw } from 'lucide-react';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [schools, setSchools] = useState<School[]>([]);
  const [updates, setUpdates] = useState<Update[]>([]);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    try {
      return localStorage.getItem('cm_theme') === 'dark';
    } catch (e) {
      return false;
    }
  });
  const [isLoading, setIsLoading] = useState(true);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  const [contactInfo, setContactInfo] = useState({
    phone1: 'লোডিং...',
    phone2: 'লোডিং...',
    email: 'লোডিং...',
    address: 'লোডিং...',
    facebook: '#',
    website: '#'
  });

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setConnectionError(null);

      const [
        { data: profiles },
        { data: schoolsRaw },
        { data: studentsRaw },
        { data: msgs },
        { data: trans },
        { data: upds },
        { data: galls },
        { data: settings }
      ] = await Promise.all([
        supabase.from('profiles').select('*'),
        supabase.from('schools').select('*'),
        supabase.from('students').select('*'),
        supabase.from('messages').select('*').order('timestamp', { ascending: true }),
        supabase.from('transactions').select('*'),
        supabase.from('updates').select('*').order('id', { ascending: false }),
        supabase.from('gallery').select('*'),
        supabase.from('site_settings').select('*').eq('id', 'contact_info').single()
      ]);

      if (profiles) setUsers(profiles.map((p: any) => ({ ...p, bloodGroup: p.blood_group, profilePic: p.profile_pic })));
      if (msgs) setMessages(msgs as any);
      if (trans) setTransactions(trans as any);
      if (upds) setUpdates(upds as any);
      if (galls) setGalleryImages(galls as any);
      if (settings) setContactInfo(settings as any);

      if (schoolsRaw) {
        const processedSchools = schoolsRaw.map((school: any) => {
          const sStudents = studentsRaw ? studentsRaw.filter((s: any) => s.school_id === school.id) : [];
          return {
            ...school,
            students: sStudents,
            studentCount: sStudents.length
          };
        });
        setSchools(processedSchools);
      }

    } catch (error: any) {
      console.error("Data fetching error:", error);
      setConnectionError("ডাটাবেজ রিড করতে সমস্যা হয়েছে।");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    try {
      const savedUser = localStorage.getItem('cm_logged_user');
      if (savedUser) setCurrentUser(JSON.parse(savedUser));
    } catch (e) {}
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
    try {
      localStorage.setItem('cm_theme', isDarkMode ? 'dark' : 'light');
    } catch (e) {}
  }, [isDarkMode]);

  const handleSetCurrentUser = (user: User | null) => {
    setCurrentUser(user);
    if (user) localStorage.setItem('cm_logged_user', JSON.stringify(user));
    else localStorage.removeItem('cm_logged_user');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-indigo-950 text-white">
        <div className="w-16 h-16 border-4 border-indigo-400 border-t-white rounded-full animate-spin mb-6"></div>
        <h2 className="text-2xl font-black animate-pulse tracking-widest">লোডিং হচ্ছে...</h2>
      </div>
    );
  }

  return (
    <Router>
      <div className={`flex flex-col min-h-screen pb-20 transition-colors duration-300 ${isDarkMode ? 'bg-slate-900 text-slate-100' : 'bg-[#f0f2f5] text-gray-900'}`}>
        {connectionError && (
          <div className="bg-red-600 text-white p-3 text-center text-xs font-bold flex items-center justify-center space-x-2 z-[100] sticky top-0">
            <AlertCircle size={14} />
            <span>{connectionError}</span>
            <button onClick={() => fetchData()} className="ml-4 underline flex items-center">
              <RefreshCw size={12} className="mr-1" /> রিলোড করুন
            </button>
          </div>
        )}
        
        <Header toggleTheme={() => setIsDarkMode(!isDarkMode)} isDarkMode={isDarkMode} currentUser={currentUser} />
        <main className="flex-grow container mx-auto px-4 py-4 max-w-lg">
          <Routes>
            <Route path="/login" element={<Login users={users} onLogin={handleSetCurrentUser} />} />
            <Route path="/signup" element={<Signup users={users} onSignup={() => fetchData()} />} />
            <Route path="/" element={currentUser ? <Home visitorCount={users.length * 12 + 45} updates={updates} isDarkMode={isDarkMode} currentUser={currentUser} /> : <Navigate to="/login" />} />
            <Route path="/messenger" element={currentUser ? <Messenger users={users} messages={messages} currentUser={currentUser} isDarkMode={isDarkMode} /> : <Navigate to="/login" />} />
            <Route path="/committee" element={<Committee users={users} isDarkMode={isDarkMode} />} />
            <Route path="/schools" element={<Schools schools={schools} currentUser={currentUser} isDarkMode={isDarkMode} />} />
            <Route path="/schools/:id" element={<SchoolDetail schools={schools} currentUser={currentUser} isDarkMode={isDarkMode} />} />
            <Route path="/profile" element={currentUser ? <Profile user={currentUser} onUpdate={(u) => { handleSetCurrentUser(u); fetchData(); }} isDarkMode={isDarkMode} /> : <Navigate to="/login" />} />
            <Route path="/gallery" element={<Gallery images={galleryImages} isDarkMode={isDarkMode} />} />
            <Route path="/accounts" element={<Accounts users={users} transactions={transactions} isDarkMode={isDarkMode} />} />
            <Route path="/accounts/:userId" element={<MemberTransactions users={users} transactions={transactions} isDarkMode={isDarkMode} />} />
            <Route path="/contact" element={<Contact contactInfo={contactInfo} />} />
            <Route path="/admin" element={
              currentUser && (currentUser.designation === "অর্থ সম্পাদক" || currentUser.designation === "সহ অর্থ সম্পাদক") ? (
                <Admin 
                  updates={updates} 
                  schools={schools} 
                  users={users} 
                  gallery={galleryImages} 
                  transactions={transactions} 
                  contactInfo={contactInfo}
                  onUpdateUpdates={() => fetchData()}
                  onUpdateSchools={() => fetchData()}
                  onUpdateGallery={() => fetchData()}
                  onUpdateTransactions={() => fetchData()}
                  onUpdateSettings={() => fetchData()}
                  onUpdateUsers={() => fetchData()}
                  isDarkMode={isDarkMode}
                />
              ) : <Navigate to="/" />
            } />
          </Routes>
        </main>
        {currentUser && <Navbar isDarkMode={isDarkMode} />}
      </div>
    </Router>
  );
};

export default App;
