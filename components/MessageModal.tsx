
import React, { useState, useEffect } from 'react';
import { X, Send, ShieldCheck, User, Phone, Mail, CheckCircle, MessageSquare, Bell, Users } from 'lucide-react';
// Import Language to fix typing errors
import { AttorneyProfile, FirmBranding, Language } from '../types';
import { MockDB } from '../services/storage';

interface MessageModalProps {
  attorney: AttorneyProfile;
  firm: FirmBranding;
  // Added language to fix prop mismatch in App.tsx
  language: Language;
  isGeneric?: boolean;
  initialMessage?: string;
  customSuccessMessage?: string;
  onClose: () => void;
  onSuccess?: () => void;
}

// Added language to destructuring
const MessageModal: React.FC<MessageModalProps> = ({ 
  attorney, 
  firm, 
  language,
  isGeneric = true, 
  initialMessage = '', 
  customSuccessMessage,
  onClose, 
  onSuccess 
}) => {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ 
    name: '', 
    phone: '', 
    email: '', 
    preferredMethod: 'phone',
    message: initialMessage 
  });

  useEffect(() => {
    if (initialMessage) {
      setForm(prev => ({ ...prev, message: initialMessage }));
    }
  }, [initialMessage]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Save to Mock Backend
    MockDB.saveMessage({
      name: form.name,
      email: form.email,
      phone: form.phone,
      method: form.preferredMethod,
      message: form.message
    });

    setSubmitted(true);
    if (onSuccess) onSuccess();
    setTimeout(onClose, 4000);
  };

  if (submitted) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in">
        <div className="bg-white w-full max-w-md rounded-3xl p-10 text-center shadow-2xl animate-in zoom-in-95">
          <div className="bg-green-100 text-green-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-100">
            <CheckCircle size={40} />
          </div>
          <h3 className="text-3xl font-black text-slate-900 mb-2 text-balance">Message Sent</h3>
          <p className="text-slate-500 font-medium">
            {customSuccessMessage || "Your request has been routed to our legal team. We will reach out via your preferred method shortly."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in overflow-y-auto">
      <div className="bg-white w-full max-w-lg my-auto rounded-3xl overflow-hidden shadow-2xl relative animate-in zoom-in-95 border border-slate-100">
        <button onClick={onClose} className="absolute top-8 right-8 p-2 text-slate-300 hover:text-slate-900 transition-colors z-20">
          <X size={24} />
        </button>

        <div className={`${firm.primaryColor} p-10 text-white relative`}>
          <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
            <ShieldCheck size={120} />
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] mb-4 text-blue-400">Secure Triage Channel</p>
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-xl bg-white/20 flex items-center justify-center border border-white/20 shrink-0 shadow-lg overflow-hidden">
              {isGeneric ? (
                <Users size={32} className="text-white" />
              ) : (
                attorney.photoData ? (
                  <img src={attorney.photoData} alt={attorney.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xl font-black text-yellow-400">{attorney.initials}</span>
                )
              )}
            </div>
            <div>
              <h2 className="text-3xl font-black tracking-tight leading-none mb-1">{firm.firmName}</h2>
              {isGeneric ? (
                <p className="text-xs opacity-80 font-bold uppercase tracking-widest">Direct Team Message Portal • Secure & Encrypted</p>
              ) : (
                <div className="flex flex-col">
                   <p className="text-xs font-black text-yellow-400 uppercase tracking-widest mb-0.5">Contacting: {attorney.name}</p>
                   <p className="text-[10px] opacity-70 font-bold uppercase tracking-widest">{attorney.title}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 sm:p-10 space-y-6">
          <div className="space-y-4">
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input required type="text" placeholder="Full Legal Name" className="w-full bg-slate-50 border border-slate-100 rounded-xl pl-12 pr-4 py-4 font-bold focus:ring-2 focus:ring-slate-900 outline-none transition-all" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input required type="tel" placeholder="Phone Number" className="w-full bg-slate-50 border border-slate-100 rounded-xl pl-12 pr-4 py-4 font-bold focus:ring-2 focus:ring-slate-900 outline-none transition-all" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
              </div>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input required type="email" placeholder="Email Address" className="w-full bg-slate-50 border border-slate-100 rounded-xl pl-12 pr-4 py-4 font-bold focus:ring-2 focus:ring-slate-900 outline-none transition-all" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-2 flex items-center gap-2">
                <Bell size={12} /> Preferred Contact Method
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'phone', label: 'Call', icon: <Phone size={14} /> },
                  { id: 'text', label: 'Text', icon: <MessageSquare size={14} /> },
                  { id: 'email', label: 'Email', icon: <Mail size={14} /> }
                ].map((method) => (
                  <button key={method.id} type="button" onClick={() => setForm({...form, preferredMethod: method.id})} className={`flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-xs transition-all border ${form.preferredMethod === method.id ? 'bg-slate-900 text-white border-slate-900 shadow-md scale-[1.02]' : 'bg-white text-slate-500 border-slate-100 hover:border-slate-300'}`}>
                    {method.icon} {method.label}
                  </button>
                ))}
              </div>
            </div>

            <textarea required placeholder="Brief case description..." rows={3} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-5 py-4 font-bold focus:ring-2 focus:ring-slate-900 outline-none resize-none transition-all" value={form.message} onChange={e => setForm({...form, message: e.target.value})} />
          </div>

          <button type="submit" className={`${firm.primaryColor} text-white w-full py-5 rounded-xl font-black text-xl flex items-center justify-center gap-3 shadow-xl hover:opacity-95 transition-all active:scale-95`}>
            <Send size={24} /> {isGeneric ? 'CONTACT THE TEAM' : `MESSAGE ${attorney.name.split(' ')[0].toUpperCase()}`}
          </button>
        </form>
      </div>
    </div>
  );
};

export default MessageModal;
