
import React, { useState, useEffect, useRef } from 'react';
import { User, Message } from '../types';
import { supabase } from '../lib/supabase';
import { Send, MessageCircleMore, CheckCheck, Users } from 'lucide-react';

interface MessengerProps {
  users: User[];
  messages: Message[];
  currentUser: User;
  isDarkMode: boolean;
}

const COMMITTEE_GROUP_ID = 'committee-group';

const Messenger: React.FC<MessengerProps> = ({ users, messages: initialMessages, currentUser, isDarkMode }) => {
  const [localMessages, setLocalMessages] = useState<Message[]>(initialMessages);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(COMMITTEE_GROUP_ID);
  const [text, setText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // রিয়েল-টাইম সাবস্ক্রিপশন
  useEffect(() => {
    const channel = supabase
      .channel('realtime_messages')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, payload => {
        setLocalMessages(prev => [...prev, payload.new as Message]);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [localMessages]);

  const handleSend = async () => {
    if (!text.trim()) return;
    
    const { error } = await supabase.from('messages').insert([{
      sender_id: currentUser.id,
      receiver_id: selectedUserId,
      text: text,
      timestamp: new Date().toISOString()
    }]);

    if (!error) setText('');
  };

  const activeMessages = localMessages.filter(m => 
    selectedUserId === COMMITTEE_GROUP_ID ? m.receiver_id === COMMITTEE_GROUP_ID :
    (m.sender_id === currentUser.id && m.receiver_id === selectedUserId) ||
    (m.sender_id === selectedUserId && m.receiver_id === currentUser.id)
  );

  return (
    <div className={`h-[calc(100vh-160px)] flex flex-col rounded-[2rem] border shadow-xl overflow-hidden ${isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-gray-100'}`}>
      <div className="p-4 border-b flex items-center bg-indigo-600 text-white">
        <Users size={20} className="mr-3" />
        <h4 className="font-black">কমিটি গ্রুপ চ্যাট (রিয়েল-টাইম)</h4>
      </div>

      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        {activeMessages.map(msg => (
          <div key={msg.id} className={`flex ${msg.sender_id === currentUser.id ? 'justify-end' : 'justify-start'}`}>
            <div className={`p-3 rounded-2xl max-w-[80%] ${msg.sender_id === currentUser.id ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-gray-100 dark:bg-slate-800 rounded-tl-none'}`}>
              <p className="text-sm">{msg.text}</p>
              <span className="text-[8px] opacity-60 block text-right mt-1">
                {new Date(msg.timestamp).toLocaleTimeString('bn-BD')}
              </span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t flex space-x-2">
        <input 
          type="text" 
          className="flex-grow p-3 rounded-xl bg-gray-50 dark:bg-slate-800 outline-none"
          placeholder="মেসেজ লিখুন..."
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyPress={e => e.key === 'Enter' && handleSend()}
        />
        <button onClick={handleSend} className="p-3 bg-indigo-600 text-white rounded-xl">
          <Send size={20} />
        </button>
      </div>
    </div>
  );
};

export default Messenger;
