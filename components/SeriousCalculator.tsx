
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  ChevronLeft, Gavel, Scale, ShieldAlert, Zap, Activity, Skull, DollarSign,
  Layers, User, Ban, Info, AlertTriangle, Calculator as CalcIcon, 
  TrendingUp, ArrowUpRight, Phone, MessageSquare, HeartPulse, 
  Stethoscope, Thermometer, Scissors, Brain, Eye, Crosshair, ClipboardCheck,
  CheckCircle2, Star, Flame, Wind, ChevronDown, Loader2, FileSearch, ShieldCheck, Lock, Send,
  Target, FileText, BarChart3, RefreshCcw, CheckSquare, Check
} from 'lucide-react';
import { FirmBranding, AttorneyProfile, SeriousCalculatorConfig, Language } from '../types';
import MessageModal from './MessageModal';
import { MockDB } from '../services/storage';
import { SERIOUS_INJURY_ICONS } from '../constants';

interface SeriousCalculatorProps {
  firm: FirmBranding;
  language: Language;
  attorney: AttorneyProfile;
  onBack: () => void;
  onWrongfulDeathClick?: () => void;
}

const CONTRIBUTION_WEIGHTS = [
  { val: 0.00, label: '0% (No Fault)' },
  { val: 0.10, label: '10% (Slight Fault)' },
  { val: 0.20, label: '20% (Some Fault)' },
  { val: 0.30, label: '30% (Moderate Fault)' },
  { val: 0.40, label: '40% (Significant Fault)' },
  { val: 0.50, label: '50% (Substantial Fault)' },
];

const LIABILITY_LEVELS = [
  { 
    id: 'standard', 
    label: 'Ordinary Negligence', 
    mult: 1.0, 
    desc: 'The most common standard; it means the person failed to use reasonable care that an ordinary person would have used.' 
  },
  { 
    id: 'gross', 
    label: 'Gross Negligence', 
    mult: 1.5, 
    desc: 'A higher level of fault where the person showed an extreme lack of care or a conscious indifference to the safety of others.' 
  },
  { 
    id: 'intentional', 
    label: 'Intentional Misconduct', 
    mult: 2.0, 
    desc: 'Deliberate and willful actions where the party specifically intended to cause harm or knew injury was likely to occur.' 
  },
];

const NON_ECON_FACTORS = [
  { id: 'pain', label: 'Pain and Suffering' },
  { id: 'quality', label: 'Diminished Quality of Life' },
  { id: 'disfigure', label: 'Permanent Disfigurement' },
  { id: 'impair', label: 'Physical Impairment' },
  { id: 'consort', label: 'Loss of Consortium' },
  { id: 'distress', label: 'Mental / Emotional Distress' },
];

const SeriousCalculator: React.FC<SeriousCalculatorProps> = ({ firm, language, attorney, onBack, onWrongfulDeathClick }) => {
  const [config, setConfig] = useState<SeriousCalculatorConfig>(MockDB.getSeriousConfig());
  const containerRef = useRef<HTMLDivElement>(null);

  const initialParams = {
    injuryType: 'tbi',
    tierIndex: null as number | null, 
    wc: 0.00,
    ce: 25000,    
    mcp: 50000,   
    lw: 500000,   
    op: 5000,    
    conductId: 'standard',
    selectedFactors: ['pain', 'quality', 'distress', 'impair']
  };

  const [params, setParams] = useState(initialParams);
  const [auditState, setAuditState] = useState<'idle' | 'analyzing' | 'completed'>('idle');
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [factAssessment, setFactAssessment] = useState<string>('');
  const [analysisId, setAnalysisId] = useState<string>('tbi');

  const [hasUnlocked, setHasUnlocked] = useState(false);
  const [leadInfo, setLeadInfo] = useState({ name: '', phone: '', agreed: false });

  useEffect(() => {
    setConfig(MockDB.getSeriousConfig());
  }, []);

  // Handle auto-scroll when analysis starts
  useEffect(() => {
    if (auditState === 'analyzing' && containerRef.current) {
      containerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [auditState]);

  const currentCalculation = useMemo(() => {
    if (!config.injuries || config.injuries.length === 0) return null;
    const currentInjury = config.injuries.find(i => i.id === params.injuryType) || config.injuries[0];
    const baselineFloor = currentInjury.tiers[0].edFloor * 0.4;
    const anchor = params.tierIndex !== null ? currentInjury.tiers[params.tierIndex].edFloor : baselineFloor;
    const tierWeight = params.tierIndex !== null ? currentInjury.tiers[params.tierIndex].minWeight : 1.0;
    const ED_actual = params.ce + params.mcp + params.lw + params.op;
    const ed = Math.max(ED_actual, anchor);
    const nonEconMultiplier = tierWeight + (params.selectedFactors.length * 0.25);
    const ned = ed * nonEconMultiplier;
    const conduct = LIABILITY_LEVELS.find(l => l.id === params.conductId) || LIABILITY_LEVELS[0];
    const grossRecovery = (ed + ned) * conduct.mult;
    const netRecovery = grossRecovery * (1 - params.wc);
    
    return { 
      ed, 
      ned, 
      grossRecovery, 
      netRecovery, 
      ED_actual, 
      ed_floor: anchor, 
      tierWeight,
      nonEconMultiplier, 
      conductMult: conduct.mult 
    };
  }, [params, config]);

  const calculation = currentCalculation || {
    ed: 0, ned: 0, grossRecovery: 0, netRecovery: 0, ED_actual: 0, ed_floor: 0, tierWeight: 1, nonEconMultiplier: 1, conductMult: 1
  };

  const toggleFactor = (id: string) => {
    setParams(p => ({
      ...p,
      selectedFactors: p.selectedFactors.includes(id) 
        ? p.selectedFactors.filter(f => f !== id)
        : [...p.selectedFactors, id]
    }));
    setHasUnlocked(false);
  };

  const selectedInjury = (config.injuries || []).find(i => i.id === params.injuryType) || (config.injuries && config.injuries[0]);

  const handleTierChange = (idx: number) => {
    setParams(p => ({ 
      ...p, 
      tierIndex: p.tierIndex === idx ? null : idx 
    }));
    setHasUnlocked(false);
  };

  const startAudit = () => {
    setAuditState('analyzing');
  };

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (leadInfo.name && leadInfo.phone && leadInfo.agreed) {
      setHasUnlocked(true);
      // Save Lead to DB
      MockDB.saveCalcLead({
        name: leadInfo.name,
        phone: leadInfo.phone,
        calculatorSource: 'serious',
        inputs: {
          injuryType: selectedInjury?.label + (params.tierIndex !== null ? ` (${selectedInjury?.tiers[params.tierIndex].label})` : ''),
          medicalBills: params.ce,
          lostWages: params.lw,
          futureMedical: params.mcp,
          outOfPocket: params.op
        },
        valuation: {
          net: Math.floor(calculation.netRecovery)
        },
        aiAudit: `SERIOUS INJURY LEAD. PNC reports ${params.injuryType.toUpperCase()}. Non-Econ Factors: ${params.selectedFactors.join(', ')}. Gross recovery estimated at $${Math.floor(calculation.grossRecovery).toLocaleString()}.`
      });
    }
  };

  const handleReset = () => {
    setParams(initialParams);
    setAuditState('idle');
    setFactAssessment('');
    setAnalysisId('tbi');
    setHasUnlocked(false);
  };

  useEffect(() => {
    if (auditState === 'analyzing') {
      const timer = setTimeout(() => {
        const assessment = `Clinical analysis of the ${selectedInjury?.id.toUpperCase()} vector indicates high-severity impairment. Texas jury patterns for cases of this severity show a strong trend toward full economic recovery and significant non-economic adjustment.`;
        setFactAssessment(assessment);
        setAnalysisId(params.injuryType);
        setAuditState('completed');
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [auditState, selectedInjury, params.injuryType]);

  const dynamicComparables = useMemo(() => {
    return MockDB.getBenchmarks(auditState === 'completed' ? analysisId : params.injuryType);
  }, [params.injuryType, analysisId, auditState]);

  if (!selectedInjury) {
    return <div className="p-20 text-center font-bold text-slate-500">Loading serious calculator protocols...</div>;
  }

  const agreeText = language === 'en' 
    ? "I understand that submitting this form does not create an attorney-client relationship. I acknowledge that the evaluation is for informational purposes only and I authorize the firm to contact me." 
    : "Entiendo que el envío de esta información no crea una relación abogado-cliente. Reconozco que la evaluación es solo para fines informativos y autorizo a la firma a contactarme.";

  return (
    <div ref={containerRef} className="animate-in fade-in slide-in-from-bottom-8 duration-700 max-w-7xl mx-auto pb-24 overflow-y-visible min-h-[800px] scroll-mt-32">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-slate-400 font-black text-xs uppercase tracking-widest hover:text-slate-900 transition-colors mb-8 px-4 sm:px-0"
      >
        <ChevronLeft size={16} /> Return to Home
      </button>

      <h2 className="text-3xl sm:text-5xl font-black tracking-tighter mb-8 px-4 sm:px-0">Serious Injury Estimator</h2>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-8 px-4 sm:px-0">
          <div className={`bg-slate-900 p-8 sm:p-12 rounded-3xl border border-white/5 text-white shadow-2xl relative overflow-hidden transition-all duration-500 ${auditState === 'completed' ? 'opacity-40 grayscale pointer-events-none' : 'opacity-100'}`}>
             <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                <CalcIcon size={240} className="text-blue-500" />
             </div>
             
             <div className="relative z-10">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-10">
                   <h3 className="text-xl font-bold flex items-center gap-2">
                     <DollarSign className="text-blue-500" /> Case Inputs
                   </h3>
                   {onWrongfulDeathClick && (
                    <button 
                      onClick={onWrongfulDeathClick}
                      className="bg-red-600 hover:bg-red-500 text-white sm:px-3 sm:py-1.5 px-2 py-1 rounded-lg sm:rounded-xl text-[9px] sm:text-[10px] font-bold flex items-center gap-1 transition-all shadow-lg active:scale-95 shrink-0"
                    >
                      Loss of Life <ArrowUpRight size={10} className="sm:w-3 sm:h-3" />
                    </button>
                  )}
                </div>

                <div className="space-y-12">
                   {/* Step 1: Clinical Diagnosis */}
                   <div className="space-y-6">
                      <label className="flex items-center gap-2 text-[10px] font-black uppercase text-blue-400 tracking-[0.3em]">
                        <Activity size={12} /> Step 1: Clinical Diagnosis
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                         {(config.injuries || []).map(injury => (
                            <button
                               key={injury.id}
                               onClick={() => { setParams({...params, injuryType: injury.id, tierIndex: null}); setAuditState('idle'); setHasUnlocked(false); }}
                               className={`flex flex-col items-center gap-2 p-4 rounded-2xl border text-center transition-all min-h-[110px] justify-center ${
                                 params.injuryType === injury.id ? 'bg-blue-600 border-blue-500 text-white shadow-xl' : 'bg-white/5 border-white/10 text-slate-400 hover:border-blue-500/30'
                               }`}
                            >
                               {SERIOUS_INJURY_ICONS[injury.id]}
                               <span className="text-[10px] font-black uppercase tracking-widest leading-tight">
                                  {injury.label.includes(' ') ? <>{injury.label.split(' ')[0]}<br/>{injury.label.split(' ').slice(1).join(' ')}</> : injury.label}
                               </span>
                            </button>
                         ))}
                      </div>
                   </div>

                   {/* Step 2: Severity Assessment */}
                   <div className="space-y-6 pt-8 border-t border-white/10">
                      <label className="flex items-center gap-2 text-[10px] font-black uppercase text-blue-400 tracking-[0.3em]">
                        <Layers size={12} /> Step 2: Severity Assessment
                      </label>
                      <div className="bg-white/5 p-6 rounded-2xl border border-white/10 space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                           {(selectedInjury?.tiers || []).map((tier, idx) => (
                             <button
                                key={idx}
                                onClick={() => handleTierChange(idx)}
                                className={`p-4 rounded-xl border transition-all text-left flex flex-col gap-1 ${
                                  params.tierIndex === idx ? 'bg-white border-white text-slate-900 shadow-xl scale-[1.02]' : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/20'
                                }`}
                             >
                                <span className="text-[10px] font-black uppercase tracking-widest">{tier.label}</span>
                                <span className="text-[9px] font-medium opacity-70 leading-tight">{tier.desc}</span>
                              </button>
                           ))}
                        </div>
                        <div className="flex items-center justify-between p-4 bg-blue-600/10 rounded-xl border border-blue-500/30 transition-all">
                           <div className="space-y-1">
                              <p className="text-[10px] font-black uppercase text-blue-400 tracking-widest">Injury Anchor</p>
                              {params.tierIndex === null ? (
                                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter opacity-70">Automatic Baseline Applied</p>
                              ) : (
                                <p className="text-[9px] text-blue-300 font-bold uppercase tracking-tighter opacity-70">Controlling Mult: x{calculation.tierWeight.toFixed(1)}</p>
                              )}
                           </div>
                           <p className="font-mono text-white font-bold text-lg animate-in fade-in duration-300">
                             ${calculation.ed_floor.toLocaleString()}
                           </p>
                        </div>
                      </div>
                   </div>

                   {/* Step 3: Economic Damage Vectors */}
                   <div className="space-y-4 pt-8 border-t border-white/10">
                      <label className="flex items-center gap-2 text-[10px] font-black uppercase text-blue-400 tracking-[0.3em]">
                        <DollarSign size={12} /> Step 3: Economic Damage Vectors
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-8">
                         <div className="space-y-3">
                            <div className="flex justify-between text-[10px] font-black text-slate-500 uppercase"><span>Medical Bills (To Date)</span><span className="text-blue-400 font-mono text-xs">${params.ce.toLocaleString()}</span></div>
                            <input type="range" min="0" max="1000000" step="5000" value={params.ce} onChange={e => { setParams({...params, ce: parseInt(e.target.value)}); setHasUnlocked(false); }} className="w-full h-1.5 bg-white/10 rounded-full appearance-none accent-blue-600 cursor-pointer" />
                         </div>
                         <div className="space-y-3">
                            <div className="flex justify-between text-[10px] font-black text-slate-500 uppercase"><span>Future Medical Bills</span><span className="text-blue-400 font-mono text-xs">${params.mcp.toLocaleString()}</span></div>
                            <input type="range" min="10000" max="1000000" step="10000" value={params.mcp} onChange={e => { setParams({...params, mcp: parseInt(e.target.value)}); setHasUnlocked(false); }} className="w-full h-1.5 bg-white/10 rounded-full appearance-none accent-blue-600 cursor-pointer" />
                         </div>
                         <div className="space-y-3">
                            <div className="flex justify-between text-[10px] font-black text-slate-500 uppercase"><span>Lost income (Past & Future)</span><span className="text-blue-400 font-mono text-xs">${params.lw.toLocaleString()}</span></div>
                            <input type="range" min="0" max="1000000" step="5000" value={params.lw} onChange={e => { setParams({...params, lw: parseInt(e.target.value)}); setHasUnlocked(false); }} className="w-full h-1.5 bg-white/10 rounded-full appearance-none accent-blue-600 cursor-pointer" />
                         </div>
                         <div className="space-y-3">
                            <div className="flex justify-between text-[10px] font-black text-slate-500 uppercase"><span>Out of pocket expenses</span><span className="text-blue-400 font-mono text-xs">${params.op.toLocaleString()}</span></div>
                            <input type="range" min="100" max="100000" step="100" value={params.op} onChange={e => { setParams({...params, op: parseInt(e.target.value)}); setHasUnlocked(false); }} className="w-full h-1.5 bg-white/10 rounded-full appearance-none accent-blue-600 cursor-pointer" />
                         </div>
                      </div>
                   </div>

                   {/* Step 4: Non-Economic Damages */}
                   <div className="space-y-6 pt-8 border-t border-white/10">
                      <label className="flex items-center gap-2 text-[10px] font-black uppercase text-blue-400 tracking-[0.3em]">
                        <HeartPulse size={12} /> Step 4: Non-Economic Damages
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                         {NON_ECON_FACTORS.map(f => (
                            <button
                               key={f.id}
                               onClick={() => toggleFactor(f.id)}
                               className={`p-4 rounded-xl border transition-all text-left flex flex-col gap-1 ${
                                 params.selectedFactors.includes(f.id) ? 'bg-blue-600 border-blue-500 text-white shadow-lg' : 'bg-white/5 border-white/10 text-slate-400 hover:border-blue-500/30'
                               }`}
                            >
                               <span className="text-[10px] font-black uppercase tracking-widest">{f.label}</span>
                            </button>
                         ))}
                      </div>
                   </div>

                   {/* Step 5: Liability and Fault Assignment */}
                   <div className="space-y-10 pt-8 border-t border-white/10">
                      <label className="flex items-center gap-2 text-[10px] font-black uppercase text-blue-400 tracking-[0.3em]">
                        <Scale size={12} /> Step 5: Liability and Fault Assignment
                      </label>

                      <div className="space-y-8">
                         {/* Liability Assessment Block */}
                         <div className="space-y-4">
                            <h4 className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em] ml-1">Liability Assessment</h4>
                            <div className="bg-white/5 p-6 rounded-2xl border border-white/10 flex items-center justify-between relative group hover:border-blue-500/50 transition-all">
                               <div className="flex flex-col">
                                  <span className="text-[9px] font-black text-blue-400 uppercase leading-none mb-1">Negligence Standard</span>
                                  <span className="text-lg font-bold text-white">
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
                                  <div className="bg-slate-800 p-2.5 rounded-xl shadow-lg border border-white/10 flex items-center gap-2">
                                    <ChevronDown size={18} className="text-slate-400" />
                                  </div>
                               </div>
                            </div>
                            <p className="text-[10px] text-slate-500 font-medium italic leading-relaxed px-1">
                              {LIABILITY_LEVELS.find(l => l.id === params.conductId)?.desc}
                            </p>
                         </div>

                         {/* Comparative Fault Block */}
                         <div className="space-y-4">
                            <h4 className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em] ml-1">Comparative Fault</h4>
                            <div className="bg-white/5 p-6 rounded-2xl border border-white/10 flex items-center justify-between relative group hover:border-blue-500/50 transition-all">
                               <div className="flex flex-col">
                                  <span className="text-[9px] font-black text-blue-400 uppercase leading-none mb-1">Impact Reduction</span>
                                  <span className="text-lg font-bold text-white">
                                    -{Math.round(params.wc * 100)}% Liability Offset
                                  </span>
                               </div>
                               <div className="relative">
                                  <select 
                                    value={params.wc} 
                                    onChange={(e) => { setParams(prev => ({ ...prev, wc: parseFloat(e.target.value) })); setHasUnlocked(false); }} 
                                    className="opacity-0 absolute inset-0 w-full h-full cursor-pointer z-10"
                                  >
                                    {CONTRIBUTION_WEIGHTS.map(w => <option key={w.val} value={w.val} className="text-slate-900">{w.label}</option>)}
                                  </select>
                                  <div className="bg-slate-800 p-2.5 rounded-xl shadow-lg border border-white/10 flex items-center gap-2">
                                    <ChevronDown size={18} className="text-slate-400" />
                                  </div>
                               </div>
                            </div>
                            <p className="text-[10px] text-slate-500 font-medium italic leading-relaxed px-1">This is your estimated percentage of fault for the accident. Under Texas law, your final recovery is reduced by this percentage.</p>
                         </div>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </div>

        <div className="lg:w-[420px] space-y-6 px-4 sm:px-0">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-xl space-y-8 sticky top-24 min-h-[400px]">
            {auditState === 'analyzing' ? (
              <div className="py-20 text-center space-y-6 animate-in fade-in duration-500">
                <div className="relative">
                   <div className="absolute inset-0 bg-blue-100/50 blur-3xl rounded-full scale-150" />
                   <Loader2 size={48} className="text-blue-600 animate-spin mx-auto relative z-10" />
                </div>
                <div className="space-y-2 relative z-10">
                   <p className="text-xs font-black uppercase text-slate-900 tracking-widest">Analyzing Incident Vectors...</p>
                </div>
              </div>
            ) : !hasUnlocked && auditState === 'completed' ? (
               <div className="space-y-6 animate-in zoom-in-95 duration-500">
                  <div className="flex items-center gap-3 mb-2">
                    <Lock size={20} className="text-blue-600" />
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600">Evaluation Secured</p>
                  </div>
                  <h3 className="text-2xl font-black tracking-tight text-slate-900">Enter your contact details to reveal your valuation.</h3>
                  <form onSubmit={handleUnlock} className="space-y-4">
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                      <input required type="text" value={leadInfo.name} onChange={e => setLeadInfo({...leadInfo, name: e.target.value})} placeholder="Full Legal Name" className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-4 py-4 font-bold text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-600 outline-none transition-all" />
                    </div>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                      <input required type="tel" value={leadInfo.phone} onChange={e => setLeadInfo({...leadInfo, phone: e.target.value})} placeholder="Phone Number" className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-4 py-4 font-bold text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-600 outline-none transition-all" />
                    </div>
                    <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl cursor-pointer group transition-all hover:bg-slate-100/50" onClick={() => setLeadInfo({...leadInfo, agreed: !leadInfo.agreed})}>
                      <div className={`shrink-0 mt-0.5 w-6 h-6 border-2 rounded-md flex items-center justify-center transition-all ${leadInfo.agreed ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300 bg-white'}`}>
                        {leadInfo.agreed && <Check size={18} strokeWidth={4} />}
                      </div>
                      <p className="text-[11px] font-bold text-slate-500 leading-tight">{agreeText}</p>
                    </div>
                    <button type="submit" disabled={!leadInfo.agreed} className="w-full bg-blue-600 text-white py-5 rounded-xl font-black text-xl shadow-xl hover:bg-blue-500 transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-30 disabled:cursor-not-allowed">
                      <Send size={24} /> UNLOCK RECOVERY VALUATION
                    </button>
                  </form>
               </div>
            ) : (
              <div className="space-y-8 animate-in fade-in duration-500">
                <div className="p-8 bg-slate-900 text-white rounded-3xl shadow-2xl relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                     <Target size={120} />
                   </div>
                   <div className="flex justify-between items-start mb-2 relative z-10">
                     <p className="text-[10px] font-black uppercase tracking-widest text-blue-400">Estimated Gross Recovery</p>
                   </div>
                   <h3 className="text-4xl sm:text-5xl font-black tracking-tighter mb-4 animate-in zoom-in-95 duration-300">
                     {hasUnlocked ? `$${Math.floor(calculation.grossRecovery).toLocaleString()}` : "Analysis Pending"}
                   </h3>
                </div>

                {auditState === 'completed' && hasUnlocked && (
                  <div className="space-y-6 animate-in zoom-in-95 duration-700">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 mb-2"><BarChart3 size={16} className="text-blue-600" /><p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-900">Protocol Assessment</p></div>
                      <div className="bg-slate-900 text-white p-6 rounded-2xl border border-white/5 shadow-xl">
                        <p className="text-[11px] font-medium leading-relaxed italic opacity-90 mb-6">{factAssessment}</p>
                        
                        {dynamicComparables.length > 0 && (
                          <div className="space-y-3 pt-6 border-t border-white/10">
                            <div className="flex items-center gap-2 mb-1">
                              <Scale size={12} className="text-blue-400" />
                              <h4 className="text-[9px] font-black uppercase tracking-widest text-blue-400">Recovery Benchmarks</h4>
                            </div>
                            <div className="space-y-2">
                              {dynamicComparables.slice(0, 5).map((b) => (
                                <div key={b.id} className="bg-white/5 p-3 rounded-xl border border-white/5 flex gap-3 items-start group">
                                  <div className="mt-1 w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0 shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
                                  <p className="text-[10px] font-bold leading-relaxed text-slate-300 group-hover:text-white transition-colors">{b.text}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="space-y-3 pt-4">
                      <button onClick={() => setIsMessageModalOpen(true)} className="bg-blue-600 text-white w-full py-5 rounded-xl font-black text-xl flex items-center justify-center gap-3 hover:scale-[1.02] transition-all shadow-xl active:scale-95"><Send size={24} /> REQUEST FREE CONSULTATION</button>
                      <button onClick={handleReset} className="w-full py-4 rounded-xl font-black text-xs uppercase tracking-widest text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-all flex items-center justify-center gap-2"><RefreshCcw size={14} /> Start Another Analysis</button>
                    </div>
                  </div>
                )}
                
                {auditState === 'idle' && (
                  <button onClick={startAudit} className="bg-slate-900 text-white w-full py-5 rounded-xl font-black text-xl flex items-center justify-center gap-3 hover:scale-[1.02] transition-all shadow-xl active:scale-95">
                    <Zap size={24} fill="currentColor" className="text-blue-400" /> BEGIN INJURY AUDIT
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {isMessageModalOpen && <MessageModal attorney={attorney} firm={firm} language={language} isGeneric={false} initialMessage={`SERIOUS INJURY AUDIT: PNC reported ${params.injuryType?.toUpperCase()} injury. (Liability Standard: ${params.conductId.toUpperCase()})`} customSuccessMessage="Your information was recorded and a team member will be contacting you shortly." onClose={() => setIsMessageModalOpen(false)} />}
    </div>
  );
};

export default SeriousCalculator;
