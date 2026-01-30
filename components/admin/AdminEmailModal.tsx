
import React, { useState, useEffect } from 'react';
import { X, Send, CheckCircle2, Loader2, Mail, FileText, Ban, Archive, Trash2 } from 'lucide-react';
import { FirmBranding } from '../../types';

interface AdminEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  leadName: string;
  leadEmail: string;
  template: 'accept' | 'reject';
  firm: FirmBranding;
  onPostAction?: (action: 'archive' | 'delete') => void;
}

const AdminEmailModal: React.FC<AdminEmailModalProps> = ({ 
  isOpen, onClose, leadName, leadEmail, template, firm, onPostAction 
}) => {
  const [subject, setSubject] = useState("Gregg Law Office Case Review");
  const [body, setBody] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsSent(false);
      setIsSending(false);
      setSubject(`${firm.firmName} Case Review`);
      
      if (template === 'accept') {
        setBody(`Hello ${leadName},\n\nThank you for providing the details regarding your case. Robert S. Gregg has completed an initial review and would like to formally accept your case for representation. \n\nWe believe there is significant merit to your claim and would like to move forward with a formal agreement to begin our legal investigation. Please contact our Dallas office at (214) 559-3444 to finalize these details.\n\nBest regards,\n\n${firm.attorney}\n${firm.firmName}\n2024 Commerce St\nDallas, TX 75201`);
      } else {
        setBody(`Hello ${leadName},\n\nThank you for reaching out to the Law Offices of Robert S. Gregg. After careful review of the information provided, our office is unable to undertake representation in this specific matter at this time. \n\nThis decision is not an opinion on the legal merits of your claim, but rather a determination based on our current capacity and office protocols. We strongly suggest that you consult with other legal counsel immediately. Please be mindful of the "statutes of limitations" which strictly govern legal claims in Texas; any delay could result in the permanent loss of your right to recovery.\n\nBest regards,\n\n${firm.attorney}\n${firm.firmName}\n2024 Commerce St\nDallas, TX 75201`);
      }
    }
  }, [isOpen, template, leadName, firm]);

  const handleSend = () => {
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setIsSent(true);
    }, 1500);
  };

  const handleAction = (type: 'archive' | 'delete') => {
    if (onPostAction) onPostAction(type);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="bg-slate-900 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl border border-white/10 animate-in zoom-in-95 duration-500">
        {!isSent ? (
          <>
            <div className="p-8 border-b border-white/5 flex justify-between items-center bg-slate-950/50">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${template === 'accept' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                  {template === 'accept' ? <FileText size={20} /> : <Ban size={20} />}
                </div>
                <div>
                  <h3 className="text-xl font-black text-white leading-none">Draft: {template === 'accept' ? 'Case Acceptance' : 'Declination Notice'}</h3>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">To: {leadEmail}</p>
                </div>
              </div>
              <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors"><X size={24} /></button>
            </div>

            <div className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-600 tracking-widest ml-1">Subject Line</label>
                <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} className="w-full bg-slate-950 border border-white/10 rounded-xl px-5 py-4 font-bold text-white outline-none focus:ring-1 focus:ring-red-500" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-600 tracking-widest ml-1">Message Body</label>
                <textarea value={body} onChange={(e) => setBody(e.target.value)} className="w-full h-64 bg-slate-950 border border-white/10 rounded-xl px-5 py-4 text-sm font-medium text-slate-300 outline-none focus:ring-1 focus:ring-red-500 resize-none micro-scrollbar" />
              </div>
              <button onClick={handleSend} disabled={isSending} className={`w-full py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 shadow-xl transition-all active:scale-95 ${template === 'accept' ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-red-700 hover:bg-red-600'} text-white`}>
                {isSending ? <Loader2 size={24} className="animate-spin" /> : <Send size={24} />}
                {isSending ? 'DISPATCHING...' : `SEND TO ${leadName.toUpperCase()}`}
              </button>
            </div>
          </>
        ) : (
          <div className="p-12 sm:p-20 text-center space-y-10 animate-in zoom-in-95">
             <div className="space-y-4">
                <div className="w-24 h-24 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-2xl">
                    <CheckCircle2 size={48} />
                </div>
                <div>
                    <h3 className="text-3xl font-black text-white tracking-tighter uppercase">Transmission Confirmed</h3>
                    <p className="text-slate-400 font-medium mt-2">Legal notice has been delivered to <span className="text-emerald-400 font-bold">{leadEmail}</span></p>
                </div>
             </div>

             <div className="space-y-6 pt-10 border-t border-white/5">
                <p className="text-xs font-black uppercase text-slate-500 tracking-widest">How should this record be handled?</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                   <button 
                     onClick={() => handleAction('archive')}
                     className="bg-slate-800 hover:bg-red-900/30 text-white p-6 rounded-2xl border border-white/5 transition-all group active:scale-95 flex flex-col items-center gap-3"
                   >
                      <Archive size={28} className="text-red-400 group-hover:scale-110 transition-transform" />
                      <div className="text-left">
                        <span className="block font-black text-[10px] uppercase tracking-widest">Move to Archive</span>
                        <span className="block text-[8px] font-bold text-slate-500 mt-0.5">Clears active list but retains data.</span>
                      </div>
                   </button>
                   <button 
                     onClick={() => handleAction('delete')}
                     className="bg-slate-800 hover:bg-red-900/30 text-white p-6 rounded-2xl border border-white/5 transition-all group active:scale-95 flex flex-col items-center gap-3"
                   >
                      <Trash2 size={28} className="text-red-400 group-hover:scale-110 transition-transform" />
                      <div className="text-left">
                        <span className="block font-black text-[10px] uppercase tracking-widest">Permanent Delete</span>
                        <span className="block text-[8px] font-bold text-slate-500 mt-0.5">Purges data from all servers.</span>
                      </div>
                   </button>
                </div>
                <button onClick={onClose} className="text-[10px] font-black text-slate-600 hover:text-white uppercase tracking-[0.2em] transition-colors">Close without changes</button>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminEmailModal;
