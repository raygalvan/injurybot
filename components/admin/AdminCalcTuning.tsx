
import React from 'react';
import { Save, SlidersHorizontal, Settings2, ShieldCheck, ChevronDown, HeartPulse } from 'lucide-react';
import { StandardCalculatorConfig, SeriousCalculatorConfig, WrongfulDeathConfig } from '../../types';

interface Props {
  activeCalcSubtab: 'standard' | 'serious' | 'death';
  setActiveCalcSubtab: (tab: any) => void;
  standardConfig: StandardCalculatorConfig;
  setStandardConfig: (cfg: any) => void;
  seriousConfig: SeriousCalculatorConfig;
  setSeriousConfig: (cfg: any) => void;
  deathConfig: WrongfulDeathConfig;
  setDeathConfig: (cfg: any) => void;
  selectedSeriousId: string;
  setSelectedSeriousId: (id: string) => void;
  onSave: () => void;
}

const AdminCalcTuning: React.FC<Props> = ({ 
  activeCalcSubtab, setActiveCalcSubtab, standardConfig, setStandardConfig, 
  seriousConfig, setSeriousConfig, deathConfig, setDeathConfig, 
  selectedSeriousId, setSelectedSeriousId, onSave 
}) => {
  const selectedSeriousInjury = (seriousConfig.injuries || []).find(i => i.id === selectedSeriousId);

  return (
    <div className="space-y-8 animate-in slide-in-from-right-8 duration-500 max-w-5xl">
       <header className="flex flex-col sm:flex-row justify-between sm:items-end gap-6 mb-8">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400 mb-2">Math Intelligence</p>
            <h2 className="text-4xl font-black tracking-tighter text-white">Calculator Tuning</h2>
          </div>
          <button 
            onClick={onSave}
            className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl transition-all w-full sm:w-auto"
          >
            <Save size={18} /> DEPLOY MULTIPLIERS
          </button>
       </header>

       <div className="grid grid-cols-3 sm:flex sm:w-fit gap-1 mb-8 bg-slate-900 p-1 rounded-2xl border border-white/5 w-full overflow-hidden">
          <button 
            onClick={() => setActiveCalcSubtab('standard')} 
            className={`px-2 sm:px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeCalcSubtab === 'standard' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
          >
            Minor
          </button>
          <button 
            onClick={() => setActiveCalcSubtab('serious')} 
            className={`px-2 sm:px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeCalcSubtab === 'serious' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
          >
            Serious
          </button>
          <button 
            onClick={() => setActiveCalcSubtab('death')} 
            className={`px-2 sm:px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeCalcSubtab === 'death' ? 'bg-red-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
          >
            Death
          </button>
       </div>

       {activeCalcSubtab === 'standard' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in duration-300">
             <div className="bg-slate-900/50 border border-white/5 p-8 rounded-2xl space-y-6">
                <div className="flex items-center gap-3 mb-2">
                   <SlidersHorizontal size={20} className="text-blue-400" />
                   <h3 className="text-xl font-black text-white">Injury Boosts</h3>
                </div>
                <div className="space-y-8">
                   {(standardConfig.bodyParts || []).map((bp, idx) => (
                     <div key={bp.id} className="space-y-3">
                        <div className="flex justify-between items-end">
                           <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{bp.label.en}</label>
                           <span className="text-xs font-mono text-blue-400 font-bold">x{bp.boost.toFixed(2)}</span>
                        </div>
                        <input 
                          type="range" min="0" max="5" step="0.1" value={bp.boost} 
                          onChange={(e) => {
                            const next = [...standardConfig.bodyParts];
                            next[idx].boost = parseFloat(e.target.value);
                            setStandardConfig({...standardConfig, bodyParts: next});
                          }}
                          className="w-full h-1.5 bg-slate-800 rounded-full appearance-none accent-blue-500 cursor-pointer"
                        />
                     </div>
                   ))}
                </div>
             </div>
             <div className="bg-slate-900/50 border border-white/5 p-8 rounded-2xl space-y-6">
                <div className="flex items-center gap-3 mb-2">
                   <Settings2 size={20} className="text-blue-400" />
                   <h3 className="text-xl font-black text-white">Conduct Multipliers</h3>
                </div>
                <div className="space-y-8">
                   {(standardConfig.conductTypes || []).map((ct, idx) => (
                     <div key={ct.id} className="space-y-3">
                        <div className="flex justify-between items-end">
                           <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{ct.label.en}</label>
                           <span className="text-xs font-mono text-blue-400 font-bold">x{ct.multiplier.toFixed(2)}</span>
                        </div>
                        <input 
                          type="range" min="1" max="10" step="0.1" value={ct.multiplier} 
                          onChange={(e) => {
                            const next = [...standardConfig.conductTypes];
                            next[idx].multiplier = parseFloat(e.target.value);
                            setStandardConfig({...standardConfig, conductTypes: next});
                          }}
                          className="w-full h-1.5 bg-slate-800 rounded-full appearance-none accent-blue-500 cursor-pointer"
                        />
                     </div>
                   ))}
                </div>
             </div>
          </div>
       )}

       {activeCalcSubtab === 'serious' && (
          <div className="bg-slate-900/50 border border-white/5 p-8 rounded-2xl space-y-8 animate-in fade-in duration-300">
             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-3">
                   <ShieldCheck size={24} className="text-blue-400" />
                   <h3 className="text-2xl font-black text-white">Serious Injury Matrix</h3>
                </div>
                <div className="relative w-full sm:w-auto">
                   <select 
                     value={selectedSeriousId} onChange={(e) => setSelectedSeriousId(e.target.value)}
                     className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 font-bold text-white outline-none focus:ring-1 focus:ring-blue-500 appearance-none pr-10 min-w-[200px]"
                   >
                      {(seriousConfig.injuries || []).map(i => <option key={i.id} value={i.id} className="text-slate-900">{i.label}</option>)}
                   </select>
                   <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                </div>
             </div>

             {selectedSeriousInjury ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                   {(selectedSeriousInjury.tiers || []).map((tier, tidx) => (
                      <div key={tidx} className="bg-slate-950/50 p-6 rounded-2xl border border-white/5 space-y-6">
                         <h4 className="text-[10px] font-black uppercase tracking-widest text-blue-400 border-b border-white/5 pb-2">Tier: {tier.label}</h4>
                         <div className="space-y-4">
                            <div className="space-y-1.5">
                               <label className="text-[9px] font-black uppercase text-slate-500 tracking-widest">Economic Floor</label>
                               <input 
                                 type="number" value={tier.edFloor}
                                 onChange={(e) => {
                                   const next = {...seriousConfig};
                                   const injury = next.injuries.find(i => i.id === selectedSeriousId);
                                   if (injury) injury.tiers[tidx].edFloor = parseInt(e.target.value) || 0;
                                   setSeriousConfig(next);
                                 }}
                                 className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 font-mono text-sm font-bold text-white outline-none" 
                               />
                            </div>
                            <div className="space-y-2">
                               <div className="flex justify-between items-end">
                                  <label className="text-[9px] font-black uppercase text-slate-500 tracking-widest">Weight Impact</label>
                                  <span className="text-xs font-mono text-blue-400 font-bold">{tier.minWeight.toFixed(2)}</span>
                               </div>
                               <input 
                                 type="range" min="1" max="10" step="0.1" value={tier.minWeight}
                                 onChange={(e) => {
                                   const next = {...seriousConfig};
                                   const injury = next.injuries.find(i => i.id === selectedSeriousId);
                                   if (injury) injury.tiers[tidx].minWeight = parseFloat(e.target.value);
                                   setSeriousConfig(next);
                                 }}
                                 className="w-full h-1.5 bg-slate-800 rounded-full appearance-none accent-blue-500 cursor-pointer" 
                               />
                            </div>
                         </div>
                      </div>
                   ))}
                </div>
             ) : (
                <div className="py-12 text-center text-slate-500 font-bold uppercase text-xs tracking-widest border border-dashed border-white/10 rounded-2xl">
                  Select an injury type to tune matrix parameters.
                </div>
             )}
          </div>
       )}

       {activeCalcSubtab === 'death' && (
          <div className="bg-slate-900/50 border border-white/5 p-8 rounded-2xl space-y-8 animate-in fade-in duration-300">
             <div className="flex items-center gap-3">
                <HeartPulse size={24} className="text-red-500" />
                <h3 className="text-2xl font-black text-white">Death Protocol Anchors</h3>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-6">
                   <div className="space-y-2">
                      <div className="flex justify-between items-end">
                         <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest text-white">Pecuniary Damage Floor</label>
                         <span className="text-xs font-mono text-red-400 font-bold">${deathConfig.pecuniaryFloor.toLocaleString()}</span>
                      </div>
                      <input 
                        type="range" min="100000" max="5000000" step="50000" value={deathConfig.pecuniaryFloor}
                        onChange={(e) => setDeathConfig({...deathConfig, pecuniaryFloor: parseInt(e.target.value)})}
                        className="w-full h-1.5 bg-slate-800 rounded-full appearance-none accent-red-600 cursor-pointer"
                      />
                   </div>
                </div>
             </div>
          </div>
       )}
    </div>
  );
};

export default AdminCalcTuning;
