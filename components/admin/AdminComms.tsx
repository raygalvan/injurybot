
import React from 'react';
import { Save, Share2, Globe, Bot, Mail, ShieldCheck } from 'lucide-react';
import { EmailConfig } from '../../types';

interface Props {
  emailConfig: EmailConfig;
  setEmailConfig: (cfg: EmailConfig) => void;
  onSave: () => void;
}

const AdminComms: React.FC<Props> = ({ emailConfig, setEmailConfig, onSave }) => {
  return (
    <div className="space-y-8 animate-in slide-in-from-right-8 duration-500">
       <header className="flex flex-col sm:flex-row justify-between sm:items-end gap-6 mb-8">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400 mb-2">Network Protocols</p>
            <h2 className="text-4xl font-black tracking-tighter text-white">Comms Protocol</h2>
          </div>
          <button onClick={onSave} className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl transition-all">
            <Save size={18} /> SYNC COMMUNICATION
          </button>
       </header>

       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-slate-900/50 border border-white/5 p-8 rounded-2xl space-y-8 shadow-2xl">
             <div className="flex items-center gap-3"><Share2 size={24} className="text-blue-500" /><h3 className="text-xl font-black text-white">Routing Configuration</h3></div>
             <div className="space-y-6">
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Lead Destination Email</label>
                   <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                      <input type="email" value={emailConfig.routingEmail} onChange={e => setEmailConfig({...emailConfig, routingEmail: e.target.value})} className="w-full bg-slate-950 border border-white/10 rounded-xl pl-12 pr-5 py-4 font-bold text-white outline-none focus:ring-1 focus:ring-blue-500" placeholder="attorney@firm.com" />
                   </div>
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Outbound Bot Name</label>
                   <div className="relative">
                      <Bot className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                      <input type="text" value={emailConfig.outboundName} onChange={e => setEmailConfig({...emailConfig, outboundName: e.target.value})} className="w-full bg-slate-950 border border-white/10 rounded-xl pl-12 pr-5 py-4 font-bold text-white outline-none" />
                   </div>
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Managed System Alias</label>
                   <div className="relative">
                      <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500" size={18} />
                      <input type="text" value={emailConfig.managedAlias || ''} onChange={e => setEmailConfig({...emailConfig, managedAlias: e.target.value})} className="w-full bg-slate-950 border border-white/10 rounded-xl pl-12 pr-5 py-4 font-bold text-blue-400 outline-none" placeholder="triage@injury.bot" />
                   </div>
                   <p className="text-[9px] text-slate-600 font-bold uppercase tracking-widest ml-1">Used for low-friction managed leads</p>
                </div>
             </div>
          </div>

          <div className="bg-slate-900/50 border border-white/5 p-8 rounded-2xl space-y-8 shadow-2xl">
             <div className="flex items-center gap-3"><Globe size={24} className="text-blue-500" /><h3 className="text-xl font-black text-white">Outbound Strategy</h3></div>
             <div className="grid grid-cols-1 gap-4">
                {['managed', 'professional'].map((mode) => (
                  <button key={mode} onClick={() => setEmailConfig({...emailConfig, mode: mode as any})} className={`p-6 rounded-xl border text-left flex items-start gap-4 transition-all ${emailConfig.mode === mode ? 'bg-blue-600/10 border-blue-600 shadow-xl' : 'bg-slate-950 border-white/5 hover:border-white/10'}`}>
                     <div className={`p-3 rounded-lg ${emailConfig.mode === mode ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-500'}`}>{mode === 'managed' ? <Bot size={20} /> : <Globe size={20} />}</div>
                     <div>
                        <h4 className="font-black text-white text-sm mb-1 uppercase">{mode} Channels</h4>
                        <p className="text-[10px] text-slate-500 font-medium leading-relaxed">Leads are delivered via {mode === 'managed' ? 'injury.bot high-speed triage network' : 'Firm SMTP/Exchange endpoints'}.</p>
                     </div>
                  </button>
                ))}
             </div>
          </div>
       </div>
    </div>
  );
};

export default AdminComms;
