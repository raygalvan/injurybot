
import React from 'react';
import { Clock, BrainCircuit, Sparkles, Loader2, Link as LinkIcon, MessageSquare, RefreshCcw } from 'lucide-react';
import { ChatTranscript } from '../../types';
import LeadActionBar from './LeadActionBar';

interface Props {
  chats: ChatTranscript[];
  summaries: Record<string, string>;
  loadingSummaries: Set<string>;
  onDelete: (id: string) => void;
  onCopy: (chat: ChatTranscript) => void;
  onPrint: (chat: ChatTranscript) => void;
  onSummarize: (chat: ChatTranscript) => void;
  goToEvidence: () => void;
  // Updated signature to include id
  onContact: (id: string, name: string, email: string, template: 'accept' | 'reject') => void;
}

const AdminChatTranscripts: React.FC<Props> = ({ 
  chats, summaries, loadingSummaries, onDelete, onCopy, onPrint, onSummarize, goToEvidence, onContact 
}) => {
  if (chats.length === 0) {
    return (
      <div className="py-32 text-center bg-slate-900 rounded-2xl border border-white/5">
        <MessageSquare className="mx-auto mb-4 text-slate-700" size={48} />
        <p className="text-slate-500 font-bold">No chat history available.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {chats.map((chat) => (
        <div key={chat.id} className="bg-slate-900 border border-white/5 p-5 sm:p-8 rounded-2xl hover:border-blue-500/50 transition-all group/card relative overflow-hidden">
          {chat.id.startsWith('demo_') && (
            <div className="absolute top-4 right-4 bg-yellow-500 text-slate-900 text-[8px] font-black px-2 py-0.5 rounded shadow-lg uppercase tracking-widest z-10">Demo Transcript</div>
          )}
          
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-600/20 text-blue-400 rounded-xl shadow-inner shrink-0"><Clock size={20} /></div>
              <div>
                <p className="text-[9px] font-black uppercase text-slate-500 tracking-widest mb-1">{new Date(chat.timestamp).toLocaleString()}</p>
                <h4 className="text-lg sm:text-xl font-black text-slate-100 tracking-tight leading-tight">{chat.subject}</h4>
              </div>
            </div>
            <button onClick={() => onSummarize(chat)} disabled={loadingSummaries.has(chat.id)} className="px-4 py-2 bg-slate-800 hover:bg-blue-900/30 text-blue-400 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all border border-white/5">
              {loadingSummaries.has(chat.id) ? <Loader2 size={12} className="animate-spin" /> : <RefreshCcw size={12} />} RE-ANALYZE
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
             <div className="lg:col-span-7">
                <h5 className="text-[9px] font-black uppercase tracking-widest text-slate-600 mb-3 ml-1 flex items-center gap-2"><MessageSquare size={12} /> Raw Transcript</h5>
                <div className="bg-slate-950 p-5 rounded-xl border border-white/5 max-h-[400px] overflow-y-auto micro-scrollbar space-y-4 shadow-inner">
                   {chat.messages.map((m, idx) => (
                     <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] p-4 rounded-xl text-[13px] leading-relaxed ${
                          m.role === 'user' 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-slate-800 text-slate-300 border border-white/5'
                        }`}>
                           <span className="font-black uppercase text-[8px] block mb-1 opacity-50 tracking-widest">
                              {m.role === 'user' ? 'Potential Client' : 'Injury.Bot'}
                           </span>
                           {m.text}
                        </div>
                     </div>
                   ))}
                </div>
             </div>

             <div className="lg:col-span-5">
               <div className="bg-blue-600/10 border border-blue-500/20 p-6 rounded-xl h-full flex flex-col gap-4">
                  <div className="flex items-center justify-between mb-2">
                     <div className="flex items-center gap-2">
                        <BrainCircuit size={18} className="text-blue-400" />
                        <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400">Intelligent Audit</h5>
                     </div>
                     {summaries[chat.id] && <Sparkles size={14} className="text-yellow-400 animate-pulse" />}
                  </div>
                  
                  <div className="flex-1">
                    {summaries[chat.id] ? (
                      <div className="text-[13px] text-blue-100 leading-relaxed font-medium bg-blue-500/5 p-4 rounded-xl border border-blue-500/10 whitespace-pre-wrap italic micro-scrollbar">
                        {summaries[chat.id]}
                      </div>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-center py-12 px-4 space-y-4 bg-slate-900/50 rounded-xl border border-dashed border-white/5">
                        <Loader2 size={32} className={`text-slate-700 ${loadingSummaries.has(chat.id) ? 'animate-spin text-blue-500' : ''}`} />
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">
                          {loadingSummaries.has(chat.id) ? 'Processing neural summary...' : 'Awaiting manual summary trigger'}
                        </p>
                      </div>
                    )}
                  </div>
                  
                  {summaries[chat.id]?.toLowerCase().includes("evidence hub") && (
                    <button 
                      onClick={goToEvidence}
                      className="w-full py-3 bg-blue-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg hover:bg-blue-500 transition-all"
                    >
                       <LinkIcon size={12} /> Refer to Evidence Hub
                    </button>
                  )}
               </div>
             </div>
          </div>

          <LeadActionBar 
            id={chat.id}
            leadName={chat.subject.split(' - ')[1] || 'Web Visitor'}
            leadEmail={`${(chat.subject.split(' - ')[1] || 'visitor').toLowerCase().replace(' ', '.')}@example.com`}
            onDelete={() => onDelete(chat.id)}
            onCopy={() => onCopy(chat)}
            onPrint={() => onPrint(chat)}
            // Updated to pass chat.id
            onReplyTrigger={(template) => onContact(chat.id, chat.subject.split(' - ')[1] || 'Web Visitor', `${(chat.subject.split(' - ')[1] || 'visitor').toLowerCase().replace(' ', '.')}@example.com`, template)}
            primaryLabel="CONTACT LEAD"
          />
        </div>
      ))}
    </div>
  );
};

export default AdminChatTranscripts;
