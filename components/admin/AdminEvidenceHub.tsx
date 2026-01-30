
import React from 'react';
import { FileText, Database, Download, Bot, BarChart3, Activity, DollarSign, ImageIcon, RefreshCcw } from 'lucide-react';
import { EvidenceSubmission } from '../../types';
import LeadActionBar from './LeadActionBar';

interface Props {
  evidence: EvidenceSubmission[];
  onDelete: (id: string) => void;
  handleDownloadFile: (data: string, name: string, mime: string) => void;
  // Updated signature to include id
  onContact: (id: string, name: string, email: string, template: 'accept' | 'reject') => void;
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  official: <FileText size={14} />,
  medical: <Activity size={14} />,
  financial: <DollarSign size={14} />,
  media: <ImageIcon size={14} />
};

const AdminEvidenceHub: React.FC<Props> = ({ evidence, onDelete, handleDownloadFile, onContact }) => {
  if (evidence.length === 0) {
    return (
      <div className="py-32 text-center bg-slate-900 rounded-2xl border border-white/5">
        <FileText className="mx-auto mb-4 text-slate-700" size={48} />
        <p className="text-slate-500 font-bold">No evidence submitted yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {evidence.map((sub) => (
        <div key={sub.id} className="bg-slate-900 border border-white/5 p-5 sm:p-8 rounded-2xl shadow-xl space-y-6 relative overflow-hidden">
          {sub.id.startsWith('demo_') && (
            <div className="absolute top-4 right-4 bg-yellow-500 text-slate-900 text-[8px] font-black px-2 py-0.5 rounded shadow-lg uppercase tracking-widest z-10">Demo Data</div>
          )}
          
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-blue-600/10 flex items-center justify-center text-blue-500 font-black text-xl shrink-0">
                {sub.name.charAt(0)}
              </div>
              <div>
                <h4 className="font-black text-xl sm:text-2xl leading-tight text-white">{sub.name}</h4>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">{sub.contact} • {new Date(sub.timestamp).toLocaleString()}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 w-full sm:w-auto justify-between">
              <div className="text-left sm:text-right">
                <p className="text-[9px] font-black uppercase text-blue-400 tracking-widest mb-1">Protocol Strength</p>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500" style={{ width: `${sub.protocolStrength}%` }} />
                  </div>
                  <span className="font-mono text-xs font-bold text-white">{sub.protocolStrength}%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-4 space-y-4">
              <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2"><ImageIcon size={14} /> Attached Assets ({sub.files.length})</h5>
              <div className="grid grid-cols-1 gap-2">
                {sub.files.map((file, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-white/5 group">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="p-2 bg-slate-900 rounded-lg text-blue-400 shrink-0">
                        {CATEGORY_ICONS[file.category]}
                      </div>
                      <span className="text-[11px] font-bold text-slate-400 truncate">{file.name}</span>
                    </div>
                    <button 
                      onClick={() => handleDownloadFile(file.data, file.name, file.mimeType)}
                      className="p-2 text-slate-600 hover:text-white transition-colors"
                    >
                      <Download size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:col-span-8 space-y-6">
              <div className="space-y-2">
                <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-500">PNC Testimony</h5>
                <p className="bg-slate-950 p-6 rounded-xl border border-white/5 text-slate-300 text-sm italic leading-relaxed">"{sub.testimony}"</p>
              </div>
              <div className="space-y-2">
                <h5 className="text-[10px] font-black uppercase tracking-widest text-blue-400 flex items-center gap-2"><Bot size={14} /> Automated AI Analysis Memorandum</h5>
                <div className="bg-blue-600/5 p-5 sm:p-6 rounded-xl border border-blue-500/20 text-blue-100 text-sm font-mono whitespace-pre-wrap leading-relaxed max-h-[300px] sm:max-h-[400px] overflow-y-auto micro-scrollbar">
                  {sub.analysis}
                </div>
              </div>
            </div>
          </div>

          <LeadActionBar 
            id={sub.id}
            leadName={sub.name}
            leadEmail={sub.contact} // Assuming contact is email for this flow
            onDelete={() => onDelete(sub.id)}
            onArchive={() => alert("Evidence archived.")}
            onPrint={() => window.print()}
            // Updated to pass sub.id
            onReplyTrigger={(type) => onContact(sub.id, sub.name, sub.contact, type)}
            primaryLabel="RESPONSE TO BRIEF"
          />
        </div>
      ))}
    </div>
  );
};

export default AdminEvidenceHub;
