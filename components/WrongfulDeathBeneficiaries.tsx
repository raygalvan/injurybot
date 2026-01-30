
import React, { useState, useMemo } from 'react';
import { 
  ChevronLeft, Skull, DollarSign, Activity, 
  TrendingUp, Phone, HeartPulse, Send,
  Target, BarChart3, RefreshCcw, Loader2, ShieldCheck, 
  Scale, Users, Heart, Sparkles, User, ArrowUpRight, Baby, ChevronDown, Lock, CheckSquare, Check
} from 'lucide-react';
import { FirmBranding, AttorneyProfile, Language } from '../types';
import MessageModal from './MessageModal';
import { MockDB } from '../services/storage';

interface WrongfulDeathBeneficiariesProps {
  firm: FirmBranding;
  language: Language;
  attorney: AttorneyProfile;
  onBack: () => void;
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

const WrongfulDeathBeneficiaries: React.FC<WrongfulDeathBeneficiariesProps> = ({ firm, language, attorney, onBack }) => {
  const initialParams = {
    financialSupport: 1500000,
    householdServices: 300000,
    consortium: 1000000,
    anguish: 1000000,
    isMinorBeneficiary: true,
    fault: 0.00,
    conductId: 'standard'
  };

  const [params, setParams] = useState(initialParams);
  const [auditState, setAuditState] = useState<'idle' | 'analyzing' | 'completed'>('idle');
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  
  const [hasUnlocked, setHasUnlocked] = useState(false);
  const [leadInfo, setLeadInfo] = useState({ name: '', phone: '', agreed: false });

  const valuation = useMemo(() => {
    const conduct = LIABILITY_LEVELS.find(l => l.id === params.conductId) || LIABILITY_LEVELS[0];
    let minorMultiplier = params.isMinorBeneficiary ? 1.5 : 1.0;
    const econTotal = (params.financialSupport + params.householdServices);
    const nonEconTotal = (params.consortium + params.anguish) * minorMultiplier;
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
        calculatorSource: 'beneficiary',
        inputs: {
          injuryType: 'Wrongful Death Act (Beneficiary)',
          medicalBills: 0,
          lostWages: params.financialSupport,
          futureMedical: 0,
          outOfPocket: params.householdServices
        },
        valuation: { net: Math.floor(valuation.net) },
        aiAudit: `WRONGFUL DEATH BENEFICIARY LEAD. Minor Child involved: ${params.isMinorBeneficiary ? 'YES' : 'NO'}. Net recovery revealed: $${Math.floor(valuation.net).toLocaleString()}.`
      });
    }
  };

  const handleReset = () => {
    setParams(initialParams);
    setAuditState('idle');
    setHasUnlocked(false);
  };

  const WrongfulDeathActPanel = () => (
    <div className="bg-slate-900 text-white p-8 sm:p-10 rounded-3xl shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none"><Heart size={120} /></div>
      <div className="relative z-10 space-y-6">
        <div className="flex items-center gap-2"><Sparkles size={16} className="text-yellow-400" /><h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-yellow-400">The Wrongful Death Act</h4></div>
        <h3 className="text-2xl font-black tracking-tight leading-tight">Claims Held by Survivors</h3>
        <p className="text-sm text-slate-300 leading-relaxed font-medium">Under <strong>CPRC Chapter 71</strong>, family members can recover for <em>their own individual losses</em>.</p>
      </div>
    </div>
  );

  const disclosureText = language === 'en'
    ? "I understand that sending this intake form does not create an attorney-client relationship. I acknowledge this information is for evaluation purposes only and I authorize the firm to contact me regarding my inquiry."
    : "Entiendo que el envío de este formulario de admisión no crea una relación abogado-cliente. Reconozco que esta información es solo para fines de evaluación y autorizo a la firma a contactarme con respecto a mi consulta.";

  return (
    <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 max-w-7xl mx-auto pb-24 px-4 sm:px-0 no-scrollbar">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-slate-400 font-black text-xs uppercase tracking-widest hover:text-slate-900 transition-colors mb-8"
      >
        <ChevronLeft size={16} /> Return to Estate claim
      </button>

      <h2 className="text-3xl sm:text-5xl font-black tracking-tighter mb-8">Loss of Life - Beneficiaries</h2>

      <div className="flex flex-col lg:flex-row gap-12">
        <div className="lg:hidden mb-4"><WrongfulDeathActPanel /></div>
        <div className="flex-1 space-y-8">
          <div className={`bg-white p-8 sm:p-12 rounded-3xl border border-slate-200 shadow-2xl relative overflow-hidden transition-all duration-500 ${auditState === 'completed' ? 'opacity-50 grayscale pointer-events-none' : 'opacity-100'}`}>
            <div className="flex items-center gap-4 mb-10">
              <h3 className="text-xl font-bold flex items-center gap-2 text-slate-900"><DollarSign className="text-red-600" /> Case Input</h3>
            </div>
            <div className="space-y-12">
              <div className="space-y-6">
                <label className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400 tracking-[0.3em]"><DollarSign size={12} className="text-red-600" /> Financial Dependency & Services</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                   <div className="space-y-3">
                      <div className="flex justify-between text-[10px] font-black text-slate-500 uppercase"><span>Loss of Financial Support</span><span className="text-red-600 font-mono text-xs">${params.financialSupport.toLocaleString()}</span></div>
                      <input type="range" min="0" max="5000000" step="100000" value={params.financialSupport} onChange={e => { setParams({...params, financialSupport: parseInt(e.target.value)}); setHasUnlocked(false); }} className="w-full h-1.5 bg-slate-100 rounded-full appearance-none accent-blue-600 cursor-pointer" />
                   </div>
                   <div className="space-y-3">
                      <div className="flex justify-between text-[10px] font-black text-slate-500 uppercase"><span>Loss of Household Services</span><span className="text-red-600 font-mono text-xs">${params.householdServices.toLocaleString()}</span></div>
                      <input type="range" min="0" max="1000000" step="25000" value={params.householdServices} onChange={e => { setParams({...params, householdServices: parseInt(e.target.value)}); setHasUnlocked(false); }} className="w-full h-1.5 bg-slate-100 rounded-full appearance-none accent-blue-600 cursor-pointer" />
                   </div>
                </div>
              </div>
              <div className="space-y-6 pt-8 border-t border-slate-100">
                <label className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400 tracking-[0.3em]"><Heart size={12} className="text-red-600" /> Human Impact & Relationship loss</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                   <div className="space-y-3">
                      <div className="flex justify-between text-[10px] font-black text-slate-500 uppercase"><span>Loss of Consortium</span><span className="text-red-600 font-bold">${params.consortium.toLocaleString()}</span></div>
                      <input type="range" min="0" max="3000000" step="50000" value={params.consortium} onChange={e => { setParams({...params, consortium: parseInt(e.target.value)}); setHasUnlocked(false); }} className="w-full h-1.5 bg-slate-100 rounded-full appearance-none accent-blue-600 cursor-pointer" />
                   </div>
                   <div className="space-y-3">
                      <div className="flex justify-between text-[10px] font-black text-slate-500 uppercase"><span>Mental Anguish (Survivors)</span><span className="text-red-600 font-bold">${params.anguish.toLocaleString()}</span></div>
                      <input type="range" min="0" max="3000000" step="50000" value={params.anguish} onChange={e => { setParams({...params, anguish: parseInt(e.target.value)}); setHasUnlocked(false); }} className="w-full h-1.5 bg-slate-100 rounded-full appearance-none accent-blue-600 cursor-pointer" />
                   </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 mt-8">
                  <button 
                    onClick={() => { setParams({...params, isMinorBeneficiary: !params.isMinorBeneficiary}); setHasUnlocked(false); }}
                    className={`flex-1 p-4 rounded-2xl border-2 transition-all flex items-center gap-4 ${params.isMinorBeneficiary ? 'bg-red-50 border-red-500 text-red-700 shadow-md' : 'bg-white border-slate-100 text-slate-400 hover:border-slate-300'}`}
                  >
                    <Baby size={24} />
                    <div className="text-left">
                       <p className="text-xs font-black uppercase tracking-widest">Minor Child Involved</p>
                       <p className="text-[10px] font-medium opacity-80 leading-tight">Increases consortium and anguish weight.</p>
                    </div>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-8 border-t border-slate-100 mt-8">
                   <div className="space-y-4">
                      <h4 className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em] ml-1">Survivor Recovery Basis</h4>
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
                      <h4 className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em] ml-1">Comparative Fault (Survivor)</h4>
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
        <div className="lg:w-[420px] space-y-6">
          <div className="hidden lg:block"><WrongfulDeathActPanel /></div>
          <div className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-100 shadow-xl space-y-8">
            {auditState === 'analyzing' ? (
              <div className="py-20 text-center space-y-6 animate-in fade-in duration-500"><Loader2 size={48} className="text-red-600 animate-spin mx-auto" /><p className="text-xs font-black uppercase text-slate-900 tracking-widest">Analyzing Survivor Impacts...</p></div>
            ) : auditState === 'completed' && !hasUnlocked ? (
               <div className="space-y-6 animate-in zoom-in-95 duration-500">
                  <div className="flex items-center gap-3 mb-2">
                    <Lock size={20} className="text-red-600" />
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-red-600">Survivor Valuation Gated</p>
                  </div>
                  <h3 className="text-2xl font-black tracking-tight text-slate-900">Validation required to reveal individual survivor impact scores.</h3>
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
                      <Send size={24} /> REVEAL SURVIVOR EVALUATION
                    </button>
                  </form>
               </div>
            ) : auditState === 'completed' && hasUnlocked ? (
              <div className="space-y-8 animate-in zoom-in-95 duration-500">
                <div className="p-8 bg-red-600 text-white rounded-2xl shadow-xl relative overflow-hidden"><p className="text-[10px] font-black uppercase tracking-widest mb-2 opacity-80">Estimated Survivor Recovery</p><h3 className="text-4xl font-black tracking-tighter">${Math.floor(valuation.net).toLocaleString()}</h3></div>
                <div className="bg-slate-50 p-6 rounded-xl space-y-3 font-mono text-[11px]"><div className="flex justify-between"><span>Non-Econ (Consortium/Anguish)</span><span className="text-slate-900 font-bold">${valuation.nonEconTotal.toLocaleString()}</span></div><div className="flex justify-between"><span>Econ (Support/Services)</span><span className="text-slate-900 font-bold">${valuation.econTotal.toLocaleString()}</span></div></div>
                <div className="space-y-3"><button onClick={() => setIsMessageModalOpen(true)} className="bg-slate-900 text-white w-full py-5 rounded-xl font-black text-xl flex items-center justify-center gap-3 hover:scale-[1.02] transition-all shadow-xl"><Send size={24} /> REQUEST BENEFICIARY AUDIT</button><button onClick={handleReset} className="w-full py-4 rounded-xl font-black text-[10px] uppercase tracking-widest text-slate-400 hover:text-slate-900 flex items-center justify-center gap-2"><RefreshCcw size={14} /> Reset Survivor Calc</button></div>
              </div>
            ) : (
              <div className="space-y-4"><p className="text-xs font-bold text-slate-500 text-center leading-relaxed">Initiate the Wrongful Death Act audit to quantify the losses suffered by the surviving family.</p><button onClick={handleStartAudit} className="bg-blue-600 text-white w-full py-5 rounded-xl font-black text-xl flex items-center justify-center gap-3 hover:scale-[1.02] transition-all shadow-xl"><Target size={24} /> INITIATE SURVIVOR AUDIT</button></div>
            )}
          </div>
        </div>
      </div>
      {isMessageModalOpen && <MessageModal attorney={attorney} firm={firm} language={language} isGeneric={false} initialMessage={`BENEFICIARY AUDIT: PNC requested a review of a Wrongful Death Act claim with an estimated value of $${Math.floor(valuation.net).toLocaleString()}. (Minor child: ${params.isMinorBeneficiary ? 'Yes' : 'No'}, Context: ${params.conductId.toUpperCase()})`} customSuccessMessage="Beneficiary audit data has been securely transmitted." onClose={() => setIsMessageModalOpen(false)} />}
    </div>
  );
};

export default WrongfulDeathBeneficiaries;
