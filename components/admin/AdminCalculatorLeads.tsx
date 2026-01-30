
import React from 'react';
import { SlidersHorizontal, BrainCircuit, Phone, FileDigit } from 'lucide-react';
import { CalculatorLead } from '../../types';
import LeadActionBar from './LeadActionBar';

interface Props {
  leads: CalculatorLead[];
  onDelete: (id: string) => void;
  // Updated signature to include id
  onContact: (id: string, name: string, email: string, template: 'accept' | 'reject') => void;
}

const SOURCE_BADGES: Record<string, { label: string, color: string }> = {
  minor: { label: 'MINOR', color: 'bg-blue-600' },
  serious: { label: 'SERIOUS', color: 'bg-purple-600' },
  estate: { label: 'ESTATE', color: 'bg-red-600' },
  beneficiary: { label: 'SURVIVOR', color: 'bg-emerald-600' },
};

const AdminCalculatorLeads: React.FC<Props> = ({ leads, onDelete, onContact }) => {
  if (leads.length === 0) {
    return (
      <div className="py-32 text-center bg-slate-900 rounded-2xl border border-white/5">
        <FileDigit className="mx-auto mb-4 text-slate-700" size={48} />
        <p className="text-slate-500 font-bold">No calculator leads captured yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {leads.map((lead) => {
        const sourceInfo = SOURCE_BADGES[lead.calculatorSource] || { label: 'UNKNOWN', color: 'bg-slate-600' };
        return (
          <div key={lead.id} className="bg-slate-900 border border-white/5 p-5 sm:p-8 rounded-2xl shadow-xl space-y-6 relative overflow-hidden group/card">
            {lead.id.startsWith('demo_') && (
              <div className="absolute top-4 right-4 bg-yellow-500 text-slate-900 text-[8px] font-black px-2 py-0.5 rounded shadow-lg uppercase tracking-widest z-10">Demo Data</div>
            )}
            
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
               <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl ${sourceInfo.color}/10 flex items-center justify-center text-white font-black text-xl shrink-0 shadow-inner overflow-hidden relative`}>
                     <div className={`absolute inset-0 ${sourceInfo.color} opacity-20`} />
                     <span className="relative z-10 text-white">{lead.name.charAt(0)}</span>
                  </div>
                  <div>
                     <div className="flex items-center gap-3 flex-wrap">
                        <h4 className="font-black text-xl sm:text-2xl leading-tight text-white">{lead.name}</h4>
                        <span className={`${sourceInfo.color} text-white text-[8px] font-black px-2 py-0.5 rounded tracking-[0.1em] shadow-lg`}>
                           {sourceInfo.label}
                        </span>
                     </div>
                     <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">{lead.phone} • {new Date(lead.timestamp).toLocaleString()}</p>
                  </div>
               </div>
               <div className="flex flex-col items-end gap-2 w-full sm:w-auto">
                  <div className={`px-4 py-2 ${sourceInfo.color} text-white rounded-xl shadow-lg w-full sm:w-auto text-center sm:text-right`}>
                     <p className="text-[8px] font-black uppercase tracking-widest opacity-70">Calculated Net</p>
                     <h4 className="text-lg font-black">${lead.valuation.net.toLocaleString()}</h4>
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
               <div className="lg:col-span-4 space-y-4">
                  <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2"><SlidersHorizontal size={14} /> Mathematical Inputs</h5>
                  <div className="bg-slate-950 p-5 rounded-xl border border-white/5 space-y-3 font-mono text-[10px]">
                     <div className="flex justify-between border-b border-white/5 pb-2"><span className="text-slate-500">Type:</span><span className="text-white font-bold">{lead.inputs.injuryType}</span></div>
                     <div className="flex justify-between"><span className="text-slate-500">Medical:</span><span className="text-emerald-400">${lead.inputs.medicalBills.toLocaleString()}</span></div>
                     <div className="flex justify-between"><span className="text-slate-500">Wages:</span><span className="text-emerald-400">${lead.inputs.lostWages.toLocaleString()}</span></div>
                     <div className="flex justify-between"><span className="text-slate-500">Future:</span><span className="text-emerald-400">${lead.inputs.futureMedical.toLocaleString()}</span></div>
                     <div className="flex justify-between"><span className="text-slate-500">Misc:</span><span className="text-emerald-400">${lead.inputs.outOfPocket.toLocaleString()}</span></div>
                  </div>
               </div>
               <div className="lg:col-span-8 space-y-4">
                  <h5 className="text-[10px] font-black uppercase tracking-widest text-blue-400 flex items-center gap-2"><BrainCircuit size={14} /> Algorithmic Audit</h5>
                  <div className="bg-blue-600/5 p-6 rounded-xl border border-blue-500/20 text-blue-100 text-sm leading-relaxed font-medium italic min-h-[140px]">
                     "{lead.aiAudit}"
                  </div>
               </div>
            </div>

            <LeadActionBar 
              id={lead.id}
              leadName={lead.name}
              leadEmail={`${lead.name.toLowerCase().replace(' ', '.')}@example.com`} // Mocking email for calc leads if not stored
              onDelete={() => onDelete(lead.id)}
              onArchive={() => alert("Calc Lead archived.")}
              onCopy={() => { navigator.clipboard.writeText(`Lead: ${lead.name}\nSource: ${sourceInfo.label}\nNet recovery estimated at $${lead.valuation.net.toLocaleString()}`); alert("Summary copied."); }}
              // Updated to pass lead.id
              onReplyTrigger={(type) => onContact(lead.id, lead.name, `${lead.name.toLowerCase().replace(' ', '.')}@example.com`, type)}
              primaryLabel="CONTACT CALC LEAD"
            />
          </div>
        );
      })}
    </div>
  );
};

export default AdminCalculatorLeads;
