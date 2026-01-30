
import React from 'react';
import { Bot, FileText, BarChart3, Settings, Save, RefreshCcw } from 'lucide-react';

interface Props {
  activePromptTab: 'chatbot' | 'analyzer' | 'summarizer';
  setPromptTab: (tab: any) => void;
  prompts: {
    chatbot: string;
    analyzer: string;
    summarizer: string;
  };
  setPrompts: (prompts: any) => void;
  onSave: () => void;
  onReset: () => void;
}

const AdminBotConfig: React.FC<Props> = ({ activePromptTab, setPromptTab, prompts, setPrompts, onSave, onReset }) => {
  return (
    <div className="space-y-8 animate-in slide-in-from-right-8 duration-500">
      <header className="flex flex-col sm:flex-row justify-between sm:items-end gap-6 mb-8">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400 mb-2">Neural Engineering</p>
          <h2 className="text-4xl font-black tracking-tighter text-white">AI Intelligence Protocol</h2>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <button 
            onClick={onReset}
            className="bg-slate-800 hover:bg-red-900/20 text-slate-400 hover:text-red-400 px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all w-full sm:w-auto"
          >
            <RefreshCcw size={18} /> Factory Reset
          </button>
          <button 
            onClick={onSave}
            className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg transition-all w-full sm:w-auto"
          >
            <Save size={18} /> Deploy Intelligence
          </button>
        </div>
      </header>

      <div className="bg-slate-900 p-8 rounded-2xl border border-white/5 space-y-6 shadow-2xl">
        <div className="flex items-center gap-3 mb-4">
           <div className="bg-blue-600/20 p-3 rounded-xl text-blue-400">
              <Settings size={24} />
           </div>
           <div>
              <h3 className="font-black text-xl text-white">System Instructions</h3>
              <p className="text-xs text-slate-500 font-bold">Define behavioral triggers and constraints for specific features.</p>
           </div>
        </div>

        <div className="flex overflow-x-auto no-scrollbar gap-2 mb-6 bg-slate-950 p-1 rounded-2xl border border-white/5 w-full sm:w-fit whitespace-nowrap">
           {[
             { id: 'chatbot', label: 'Core System Intelligence', icon: <Bot size={14} /> },
             { id: 'analyzer', label: 'Evidence Hub', icon: <FileText size={14} /> },
             { id: 'summarizer', label: 'Transcript Auditor', icon: <BarChart3 size={14} /> }
           ].map(sub => (
             <button 
               key={sub.id} 
               onClick={() => setPromptTab(sub.id as any)}
               className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activePromptTab === sub.id ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
             >
               {sub.icon} <span>{sub.label}</span>
             </button>
           ))}
        </div>

        <div className="bg-slate-950 p-6 rounded-xl border border-white/5 relative">
           <textarea 
             value={prompts[activePromptTab]}
             onChange={(e) => setPrompts({ ...prompts, [activePromptTab]: e.target.value })}
             className="w-full h-[400px] bg-transparent text-blue-100 font-mono text-sm leading-relaxed resize-none outline-none micro-scrollbar"
             placeholder={`Enter ${activePromptTab} core AI instructions...`}
           />
           <div className="absolute bottom-6 right-6 flex items-center gap-2">
              <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest bg-slate-900 px-3 py-1 rounded-full border border-white/5">
                {activePromptTab === 'summarizer' ? 'STRICT FORMAT enforced' : 'Variable: {attorneyName} is dynamic'}
              </span>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
           <div className="bg-blue-600/5 border border-blue-500/10 p-4 rounded-xl">
              <h4 className="text-[9px] font-black uppercase text-blue-400 mb-1 tracking-widest">Logic Lock</h4>
              <p className="text-[10px] text-slate-400 font-medium italic">Gemini 3 Pro series models adhere strictly to these rules over generic training.</p>
           </div>
           <div className="bg-blue-600/5 border border-blue-500/10 p-4 rounded-xl">
              <h4 className="text-[9px] font-black uppercase text-blue-400 mb-1 tracking-widest">Triage Integrity</h4>
              <p className="text-[10px] text-slate-400 font-medium italic">Ensures bot directs users to evidence collection protocols consistently.</p>
           </div>
           <div className="bg-blue-600/5 border border-blue-500/10 p-4 rounded-xl">
              <h4 className="text-[9px] font-black uppercase text-blue-400 mb-1 tracking-widest">Response Safety</h4>
              <p className="text-[10px] text-slate-400 font-medium italic">Safeguards against unauthorized legal advice or settlement guarantees.</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AdminBotConfig;
