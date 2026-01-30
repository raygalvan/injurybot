
import React, { useState, useMemo, useEffect } from 'react';
import { 
  ChevronLeft, Skull, DollarSign, Activity, 
  TrendingUp, Phone, HeartPulse, Send,
  Target, BarChart3, RefreshCcw, Loader2, ShieldCheck, 
  Scale, Users, Heart, Sparkles, User, ArrowUpRight, ChevronDown, Lock, CheckSquare, Check
} from 'lucide-react';
import { FirmBranding, AttorneyProfile, WrongfulDeathConfig, Language } from '../types';
import MessageModal from './MessageModal';
import { MockDB } from '../services/storage';

interface WrongfulDeathCalculatorProps {
  firm: FirmBranding;
  language: Language;
  attorney: AttorneyProfile;
  onBack: () => void;
  onBeneficiariesClick?: () => void;
}

const CONTRIBUTION_WEIGHTS = [
  { val: 0.00, label: '0% (No Fault)' },
  { val: 0.10, label: '10% (Slight Fault)' },
  { val: 0.20, label: '20% (Some Fault)' },
  { val: 0.30, label: '30% (Moderate Fault)' },
];

const LIABILITY_LEVELS = [
  { id: 'standard', label: 'Ordinary Negligence', mult: 1.0, desc: 'Failure to use ordinary care.' },
  { id: 'gross', label: 'Gross Negligence', mult: 1.5, desc: 'Extreme risk/conscious indifference.' },
  { id: 'intentional', label: 'Intentional Conduct', mult: 2.0, desc: 'Specific intent to cause harm.' },
];

const WrongfulDeathCalculator: React.FC<WrongfulDeathCalculatorProps> = ({ firm, language, attorney, onBack, onBeneficiariesClick }) => {
  const [config, setConfig] = useState<WrongfulDeathConfig>(MockDB.getDeathConfig());
  
  const initialParams = {
    futureEarnings: 1200000,
    painAndSuffering: 500000,
    physicalImpairment: 250000,
    medicalFuneral: 45000,
    fault: 0.00,
    conductId: 'standard'
  };

  const [params, setParams] = useState(initialParams);
  const [auditState, setAuditState] = useState<'idle' | 'analyzing' | 'completed'>('idle');
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  
  const [hasUnlocked, setHasUnlocked] = useState(false);
  const [leadInfo, setLeadInfo] = useState({ name: '', phone: '', agreed: false });

  useEffect(() => {
    setConfig(MockDB.getDeathConfig());
  }, []);

  const valuation = useMemo(() => {
    const conduct = LIABILITY_LEVELS.find(l => l.id === params.conductId) || LIABILITY_LEVELS[0];
    const econTotal = params.futureEarnings + params.medicalFuneral;
    const nonEconTotal = params.painAndSuffering + params.physicalImpairment;
    const gross = (econTotal + nonEconTotal) * conduct.mult;
    const net = gross * (1 - params.fault);
    return { econTotal, nonEconTotal, gross, net };
  }, [params]);

  const handleStartAudit = () => {
    setAuditState('analyzing');
    setTimeout(() => { setAuditState('completed'); }, 4000);
  };

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (leadInfo.name && leadInfo.phone && leadInfo.agreed) {
      setHasUnlocked(true);
      MockDB.saveCalcLead({
        name: leadInfo.name,
        phone: leadInfo.phone,
        calculatorSource: 'estate',
        inputs: {
          injuryType: 'Wrongful Death - Estate Survival Action',
          medicalBills: params.medicalFuneral,
          lostWages: params.futureEarnings,
          futureMedical: 0,
          outOfPocket: 0
        },
        valuation: { net: Math.floor(valuation.net) },
        aiAudit: `CRITICAL ESTATE LEAD. Pre-death suffering value: $${params.painAndSuffering.toLocaleString()}. Physical impairment: $${params.physicalImpairment.toLocaleString()}. Net estimate revealed: $${Math.floor(valuation.net).toLocaleString()}.`
      });
    }
  };

  const handleReset = () => {
    setParams(initialParams);
    setAuditState('idle');
    setHasUnlocked(false);
  };

  const SurvivalActionPanel = () => (
    <div className="bg-slate-900 text-white p-8 sm:p-10 rounded-3xl shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none"><Scale size={120} /></div>
      <div className="relative z-10 space-y-6">
        <div className="flex items-center gap-2"><ShieldCheck size={16} className="text-blue-400" /><h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400">The Survival Action</h4></div>
        <h3 className="text-2xl font-black tracking-tight leading-tight">Claims Held by The Estate</h3>
        <p className="text-sm text-slate-300 leading-relaxed font-medium">Under the <strong>Texas Estates Code</strong>, a cause of action for personal injury survives the death of the injured person. These recoveries belong strictly to the estate.</p>
      </div>
    </div>
  );

  const disclosureText = language === 'en'
    ? "I understand that submitting this inquiry does not create an attorney-client relationship. I acknowledge this valuation is for evaluation purposes only and I authorize the firm to contact me regarding this matter."
    : "Entiendo que el envío de esta consulta no crea una relación abogado-cliente. Reconozco que esta valoración es solo para fines de evaluación y autorizo a la firma a contactarme con respecto a este asunto.";

  return (
    <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 max-w-7xl mx-auto pb-24 px-4 sm:px-0 no-scrollbar">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-slate-400 font-black text-xs uppercase tracking-widest hover:text-slate-900 transition-colors mb-8"
      >
        <ChevronLeft size={16} /> Return to Home
      </button>

      <div className="mb-8">
        <h2 className="text-3xl sm:text-5xl font-black tracking-tighter">Loss of Life - The Estate</h2>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        <div className="lg:hidden mb-4"><SurvivalActionPanel /></div>
        <div className="flex-1 space-y-8">
          <div className={`bg-white p-8 sm:p-12 rounded-3xl border border-slate-200 shadow-2xl relative overflow-hidden transition-all duration-500 ${auditState === 'completed' ? 'opacity-50 grayscale pointer-events-none' : 'opacity-100'}`}>
            <div className="flex flex-wrap items-center justify-between gap-4 mb-10">
              <h3 className="text-xl font-bold flex items-center gap-2 text-slate-900">
                <DollarSign className="text-blue-600" /> Case Input
              </h3>
              {onBeneficiariesClick && (
                <button 
                  onClick={onBeneficiariesClick}
                  className="bg-red-600 hover:bg-red-500 text-white sm:px-3 sm:py-1 px-2 py-1 rounded-lg sm:rounded-xl text-[9px] sm:text-[10px] font-black flex items-center gap-1 transition-all shadow-lg active:scale-95 shrink-0 whitespace-nowrap"
                >
                  Beneficiaries <ArrowUpRight size={10} className="sm:w-3 sm:h-3" />
                </button>
              )}
            </div>
            
            <div className="space-y-12">
              <div className="space-y-6">
                <label className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400 tracking-[0.3em]"><DollarSign size={12} className="text-blue-600" /> Pecuniary Assets & Medicals</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                   <div className="space-y-3">
                      <div className="flex justify-between text-[10px] font-black text-slate-500 uppercase"><span>Lost Future Earnings</span><span className="text-blue-600 font-mono text-xs">${params.futureEarnings.toLocaleString()}</span></div>
                      <input type="range" min="0" max="5000000" step="100000" value={params.futureEarnings} onChange={e => { setParams({...params, futureEarnings: parseInt(e.target.value)}); setHasUnlocked(false); }} className="w-full h-1.5 bg-slate-100 rounded-full appearance-none accent-blue-600 cursor-pointer" />
                   </div>
                   <div className="space-y-3">
                      <div className="flex justify-between text-[10px] font-black text-slate-500 uppercase"><span>Medical & Funeral Expenses</span><span className="text-blue-600 font-mono text-xs">${params.medicalFuneral.toLocaleString()}</span></div>
                      <input type="range" min="0" max="250000" step="5000" value={params.medicalFuneral} onChange={e => { setParams({...params, medicalFuneral: parseInt(e.target.value)}); setHasUnlocked(false); }} className="w-full h-1.5 bg-slate-100 rounded-full appearance-none accent-blue-600 cursor-pointer" />
                   </div>
                </div>
              </div>
              <div className="space-y-6 pt-8 border-t border-slate-100">
                <label className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400 tracking-[0.3em]"><HeartPulse size={12} className="text-blue-600" /> Pre-Death Suffering</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                   <div className="space-y-3">
                      <div className="flex justify-between text-[10px] font-black text-slate-500 uppercase"><span>Physical Pain & Anguish</span><span className="text-blue-600 font-bold">${params.painAndSuffering.toLocaleString()}</span></div>
                      <input type="range" min="0" max="2000000" step="50000" value={params.painAndSuffering} onChange={e => { setParams({...params, painAndSuffering: parseInt(e.target.value)}); setHasUnlocked(false); }} className="w-full h-1.5 bg-slate-100 rounded-full appearance-none accent-blue-600 cursor-pointer" />
                   </div>
                   <div className="space-y-3">
                      <div className="flex justify-between text-[10px] font-black text-slate-500 uppercase"><span>Physical Impairment</span><span className="text-blue-600 font-bold">${params.physicalImpairment.toLocaleString()}</span></div>
                      <input type="range" min="0" max="2000000" step="50000" value={params.physicalImpairment} onChange={e => { setParams({...params, physicalImpairment: parseInt(e.target.value)}); setHasUnlocked(false); }} className="w-full h-1.5 bg-slate-100 rounded-full appearance-none accent-blue-600 cursor-pointer" />
                   </div>
                </div>

                <div className="space-y-8 pt-8 border-t border-slate-100">
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                      <div className="space-y-4">
                         <h4 className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em] ml-1">Negligence Standard</h4>
                         <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex items-center justify-between relative group hover:border-blue-500/50 transition-all">
                            <div className="flex flex-col">
                               <span className="text-[9px] font-black text-blue-600 uppercase leading-none mb-1">Standard</span>
                               <span className="text-lg font-bold text-slate-900">
                                 {LIABILITY_LEVELS.find(l => l.id === params.conductId)?.label}
                               </span>
                            </div>
                            <div className="relative">
                               <select 
                                 value={params.conductId} 
                                 onChange={(e) => { setParams(prev => ({ ...prev, conductId: e.target.value })); setHasUnlocked(false); }} 
                                 className="opacity-0 absolute inset-0 w-full h-full cursor-pointer z-10"
                               >
                                 {LIABILITY_LEVELS.map(l => <option key={l.id} value={l.id} className="text-slate-900">{l.label}</option>)}
                               </select>
                               <div className="bg-white p-2.5 rounded-xl shadow-lg border border-slate-200 flex items-center gap-2">
                                 <ChevronDown size={18} className="text-slate-400" />
                               </div>
                            </div>
                         </div>
                      </div>

                      <div className="space-y-4">
                         <h4 className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em] ml-1">Estate Liability Offset</h4>
                         <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex items-center justify-between relative group hover:border-blue-500/50 transition-all">
                            <div className="flex flex-col">
                               <span className="text-[9px] font-black text-blue-600 uppercase leading-none mb-1">Impact Reduction</span>
                               <span className="text-lg font-bold text-slate-900">
                                 -{Math.round(params.fault * 100)}% Offset
                               </span>
                            </div>
                            <div className="relative">
                               <select 
                                 value={params.fault} 
                                 onChange={(e) => { setParams(prev => ({ ...prev, fault: parseFloat(e.target.value) })); setHasUnlocked(false); }} 
                                 className="opacity-0 absolute inset-0 w-full h-full cursor-pointer z-10"
                               >
                                 {CONTRIBUTION_WEIGHTS.map(w => <option key={w.val} value={w.val} className="text-slate-900">{w.label}</option>)}
                               </select>
                               <div className="bg-white p-2.5 rounded-xl shadow-lg border border-slate-200 flex items-center gap-2">
                                 <ChevronDown size={18} className="text-slate-400" />
                               </div>
                            </div>
                         </div>
                      </div>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="lg:w-[420px] space-y-6">
          <div className="hidden lg:block"><SurvivalActionPanel /></div>
          <div className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-100 shadow-xl space-y-8">
            {auditState === 'analyzing' ? (
              <div className="py-20 text-center space-y-6 animate-in fade-in duration-500"><Loader2 size={48} className="text-blue-600 animate-spin mx-auto" /><p className="text-xs font-black uppercase text-slate-900 tracking-widest">Compiling Estate Assets...</p></div>
            ) : auditState === 'completed' && !hasUnlocked ? (
               <div className="space-y-6 animate-in zoom-in-95 duration-500">
                  <div className="flex items-center gap-3 mb-2">
                    <Lock size={20} className="text-red-600" />
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-red-600">Recovery Data Gated</p>
                  </div>
                  <h3 className="text-2xl font-black tracking-tight text-slate-900">Please verify your identity to view the recovery audit.</h3>
                  <form onSubmit={handleUnlock} className="space-y-4">
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                      <input required type="text" value={leadInfo.name} onChange={e => setLeadInfo({...leadInfo, name: e.target.value})} placeholder="Full Legal Name" className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-4 py-4 font-bold text-slate-900 focus:ring-2 focus:ring-red-600 outline-none transition-all" />
                    </div>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                      <input required type="tel" value={leadInfo.phone} onChange={e => setLeadInfo({...leadInfo, phone: e.target.value})} placeholder="Phone Number" className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-4 py-4 font-bold text-slate-900 focus:ring-2 focus:ring-red-600 outline-none transition-all" />
                    </div>
                    
                    {/* Legal Disclosure Section */}
                    <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl cursor-pointer group transition-all hover:bg-slate-100/50" onClick={() => setLeadInfo({...leadInfo, agreed: !leadInfo.agreed})}>
                      <div className={`shrink-0 mt-0.5 w-6 h-6 border-2 rounded-md flex items-center justify-center transition-all ${leadInfo.agreed ? 'bg-red-600 border-red-600 text-white' : 'border-slate-300 bg-white'}`}>
                        {leadInfo.agreed && <Check size={18} strokeWidth={4} />}
                      </div>
                      <p className="text-[11px] font-bold text-slate-500 leading-tight">
                        {disclosureText}
                      </p>
                    </div>

                    <button type="submit" disabled={!leadInfo.agreed} className="w-full bg-red-600 text-white py-5 rounded-xl font-black text-xl shadow-xl hover:bg-red-500 transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-30 disabled:cursor-not-allowed">
                      <Send size={24} /> REVEAL ESTATE VALUATION
                    </button>
                  </form>
               </div>
            ) : auditState === 'completed' && hasUnlocked ? (
              <div className="space-y-8 animate-in zoom-in-95 duration-500">
                <div className="p-8 bg-blue-600 text-white rounded-2xl shadow-xl relative overflow-hidden"><p className="text-[10px] font-black uppercase tracking-widest mb-2 opacity-80">Estimated Estate Recovery</p><h3 className="text-4xl font-black tracking-tighter">${Math.floor(valuation.net).toLocaleString()}</h3></div>
                <div className="bg-slate-50 p-6 rounded-xl space-y-3 font-mono text-[11px]"><div className="flex justify-between"><span>Survival Damages</span><span className="text-slate-900 font-bold">${valuation.nonEconTotal.toLocaleString()}</span></div><div className="flex justify-between"><span>Pecuniary Loss</span><span className="text-slate-900 font-bold">${valuation.econTotal.toLocaleString()}</span></div></div>
                <div className="space-y-3"><button onClick={() => setIsMessageModalOpen(true)} className="bg-slate-900 text-white w-full py-5 rounded-xl font-black text-xl flex items-center justify-center gap-3 hover:scale-[1.02] transition-all shadow-xl"><Send size={24} /> REQUEST ESTATE AUDIT</button><button onClick={handleReset} className="w-full py-4 rounded-xl font-black text-[10px] uppercase tracking-widest text-slate-400 hover:text-slate-900 flex items-center justify-center gap-2"><RefreshCcw size={14} /> Reset Estate Calc</button></div>
              </div>
            ) : (
              <div className="space-y-4"><p className="text-xs font-bold text-slate-500 text-center leading-relaxed">Initiate the Survival Action audit under the Texas Estates Code.</p><button onClick={handleStartAudit} className="bg-blue-600 text-white w-full py-5 rounded-xl font-black text-xl flex items-center justify-center gap-3 hover:scale-[1.02] transition-all shadow-xl"><Target size={24} /> INITIATE ESTATE AUDIT</button></div>
            )}
          </div>
        </div>
      </div>
      {isMessageModalOpen && <MessageModal attorney={attorney} firm={firm} language={language} isGeneric={false} initialMessage={`ESTATE AUDIT: PNC requested a review of an Estate Survival Action claim with an estimated value of $${Math.floor(valuation.net).toLocaleString()}. (Liability Context: ${params.conductId.toUpperCase()})`} customSuccessMessage="Estate audit data has been securely transmitted to the managing partner." onClose={() => setIsMessageModalOpen(false)} />}
    </div>
  );
};

export default WrongfulDeathCalculator;
