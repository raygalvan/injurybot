
import React from 'react';
import { Mail, Phone } from 'lucide-react';
import { InboxMessage } from '../../types';
import LeadActionBar from './LeadActionBar';

interface Props {
  messages: InboxMessage[];
  onDelete: (id: string) => void;
  // Updated signature to include id
  onContact: (id: string, name: string, email: string, template: 'accept' | 'reject') => void;
}

const AdminInbox: React.FC<Props> = ({ messages, onDelete, onContact }) => {
  if (messages.length === 0) {
    return (
      <div className="py-32 text-center bg-slate-900 rounded-2xl border border-white/5">
        <Mail className="mx-auto mb-4 text-slate-700" size={48} />
        <p className="text-slate-500 font-bold">No incoming messages yet.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {messages.map((m) => (
        <div key={m.id} className="bg-slate-900 border border-white/5 p-5 sm:p-6 rounded-2xl hover:border-blue-500/50 transition-all group relative overflow-hidden">
          {m.id.startsWith('demo_') && (
            <div className="absolute top-4 right-4 bg-yellow-500 text-slate-900 text-[8px] font-black px-2 py-0.5 rounded shadow-lg uppercase tracking-widest z-10">Demo Data</div>
          )}
          <div className="flex flex-col gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-600/10 flex items-center justify-center text-blue-500 font-black shrink-0">
                  {m.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-black text-xl leading-tight text-white">{m.name}</h4>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Received {new Date(m.timestamp).toLocaleString()}</p>
                </div>
              </div>
              <div className="flex wrap gap-4 text-xs font-bold">
                <div className="flex items-center gap-2 text-slate-400"><Mail size={14} /> <span className="truncate max-w-[200px]">{m.email}</span></div>
                <div className="flex items-center gap-2 text-slate-400"><Phone size={14} /> {m.phone}</div>
                <div className="px-2 py-0.5 bg-blue-600/20 text-blue-400 rounded-md text-[9px] uppercase tracking-widest">{m.method} Preferred</div>
              </div>
              <p className="bg-slate-800/50 p-4 rounded-xl text-slate-300 text-sm italic leading-relaxed">
                "{m.message}"
              </p>
            </div>
            
            <LeadActionBar 
              id={m.id}
              leadName={m.name}
              leadEmail={m.email}
              onDelete={() => onDelete(m.id)}
              onArchive={() => alert("Message archived.")}
              // Updated to pass m.id
              onReplyTrigger={(type) => onContact(m.id, m.name, m.email, type)}
              primaryLabel="REPLY TO INQUIRY"
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminInbox;
