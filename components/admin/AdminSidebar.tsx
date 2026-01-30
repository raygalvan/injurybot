
import React from 'react';
import { ShieldCheck, Inbox, FileText, MessageSquare, FileDigit, BrainCircuit, Calculator, Database, UserPlus, Share2, Palette, Sparkles, LogOut, Archive, ToggleLeft, ToggleRight } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setTab: (tab: any) => void;
  counts: {
    messages: number;
    evidence: number;
    chats: number;
    calcLeads: number;
    team: number;
    benchmarks: number;
    archive: number;
  };
  firmName: string;
  demoModeEnabled: boolean;
  setDemoModeEnabled: (val: boolean) => void;
  onLogout: () => void;
}

const AdminSidebar: React.FC<SidebarProps> = ({ 
  activeTab, setTab, counts, firmName, demoModeEnabled, setDemoModeEnabled, onLogout 
}) => {
  const NavButton = ({ id, label, icon, count }: any) => (
    <button
      onClick={() => setTab(id)}
      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-bold text-sm transition-all ${
        activeTab === id ? 'bg-blue-600 text-white shadow-xl' : 'text-slate-400 hover:bg-white/5'
      }`}
    >
      <div className="flex items-center gap-3">
        {icon} {label}
      </div>
      {count !== undefined && (
        <span className={`text-[10px] px-2 py-0.5 rounded-full ${activeTab === id ? 'bg-white/20' : 'bg-slate-800'}`}>
          {count}
        </span>
      )}
    </button>
  );

  return (
    <aside className="w-full sm:w-72 bg-slate-900 border-r border-white/5 p-6 flex flex-col h-full overflow-y-auto no-scrollbar">
      <div className="flex items-center justify-between mb-10 px-2">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-xl text-white shadow-lg">
            <ShieldCheck size={24} />
          </div>
          <div>
            <h1 className="font-black text-lg tracking-tight leading-none text-white">
              {firmName.split(' ')[0]}<br/>
              <span className="text-blue-500 lowercase text-xs tracking-widest">Admin Command</span>
            </h1>
          </div>
        </div>

        {/* Mobile-only Logout Button */}
        <button 
          onClick={onLogout}
          className="sm:hidden p-3 bg-red-500/10 text-red-500 rounded-xl active:scale-95 transition-all border border-red-500/20"
          title="Logout Session"
        >
          <LogOut size={20} />
        </button>
      </div>

      <nav className="space-y-6 flex-1">
        <div className="space-y-2">
          <p className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 mb-2">Lead Activity</p>
          <NavButton id="inbox" label="Lead Inbox" icon={<Inbox size={18} />} count={counts.messages} />
          <NavButton id="evidence" label="Evidence Hub" icon={<FileText size={18} />} count={counts.evidence} />
          <NavButton id="chats" label="Chat Transcripts" icon={<MessageSquare size={18} />} count={counts.chats} />
          <NavButton id="calc_leads" label="Calc Leads" icon={<FileDigit size={18} />} count={counts.calcLeads} />
          <NavButton id="archive" label="Archive Vault" icon={<Archive size={18} />} count={counts.archive} />
        </div>

        <div className="space-y-2">
          <p className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 mb-2">Intelligence Engine</p>
          <NavButton id="bot_config" label="Bot Intelligence" icon={<BrainCircuit size={18} />} />
          <NavButton id="calc_tuning" label="Calculator Tuning" icon={<Calculator size={18} />} />
          <NavButton id="benchmarks" label="Benchmarks" icon={<Database size={18} />} count={counts.benchmarks} />
        </div>

        <div className="space-y-2">
          <p className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 mb-2">Firm Config</p>
          <NavButton id="team" label="Legal Team" icon={<UserPlus size={18} />} count={counts.team} />
          <NavButton id="comms" label="Comms Protocol" icon={<Share2 size={18} />} />
          <NavButton id="branding" label="Firm Branding" icon={<Palette size={18} />} />
        </div>
      </nav>

      <div className="mt-8 pt-6 border-t border-white/5 space-y-4">
        <p className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">System Mode</p>
        <button 
          onClick={() => setDemoModeEnabled(!demoModeEnabled)}
          className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-bold text-xs transition-all ${
            demoModeEnabled ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' : 'bg-white/5 text-slate-500 border border-transparent'
          }`}
        >
          <div className="flex items-center gap-3">
            <Sparkles size={16} className={demoModeEnabled ? 'animate-pulse' : ''} />
            <span>Demo Data Mode</span>
          </div>
          {demoModeEnabled ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
        </button>

        <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-3 text-red-400 font-bold text-xs hover:bg-red-400/10 rounded-xl transition-all uppercase tracking-widest">
          <LogOut size={16} /> Logout Session
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
