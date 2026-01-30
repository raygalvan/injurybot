
import React, { useState, useMemo, useEffect } from 'react';
import { DollarSign, ChevronRight, TrendingUp, Info, AlertCircle, X, Phone, ExternalLink, Zap, ArrowUpRight, ChevronDown, User, Lock, CheckSquare, Send, Car, Check } from 'lucide-react';
import { FirmBranding, CaseEstimate, BodyPart, ConductType, StandardCalculatorConfig, Language } from '../types';
import { MockDB } from '../services/storage';
import { BODY_PART_ICONS, CONDUCT_ICONS } from '../constants';

interface CalculatorProps {
  firm: FirmBranding;
  language: Language;
  onSeriousClick?: () => void;
}

const CONTRIBUTION_WEIGHTS = (lang: Language) => [
  { val: 0, label: lang === 'en' ? '0% (No Fault)' : '0% (Sin Culpa)' },
  { val: 10, label: lang === 'en' ? '10% (Minor Fault)' : '10% (Culpa Menor)' },
  { val: 20, label: lang === 'en' ? '20% (Partial Fault)' : '20% (Culpa Parcial)' },
  { val: 30, label: lang === 'en' ? '30% (Moderate Fault)' : '30% (Culpa Moderada)' },
  { val: 40, label: lang === 'en' ? '40% (Significant Fault)' : '40% (Culpa Significativa)' },
  { val: 50, label: lang === 'en' ? '50% (Shared Fault)' : '50% (Culpa Compartida)' },
];

const Calculator: React.FC<CalculatorProps> = ({ firm, language, onSeriousClick }) => {
  const [config, setConfig] = useState<StandardCalculatorConfig>(MockDB.getStandardConfig());
  
  const [data, setData] = useState({
    bodyPart: 'sprains',
    conduct: 'standard',
    medicalBills: 5000,
    lostWages: 500,
    futureMedical: 0,
    outOfPocket: 0,
    propertyDamage: 5000,
    fault: 0
  });

  const [hasUnlocked, setHasUnlocked] = useState(false);
  const [leadInfo, setLeadInfo] = useState({ name: '', phone: '', agreed: false });

  useEffect(() => {
    setConfig(MockDB.getStandardConfig());
  }, []);

  const [infoModal, setInfoModal] = useState<BodyPart | null>(null);
  const [conductModal, setConductModal] = useState<ConductType | null>(null);

  const estimate = useMemo((): CaseEstimate => {
    const part = config.bodyParts.find(p => p.id === data.bodyPart) || config.bodyParts[0];
    const conduct = config.conductTypes.find(c => c.id === data.conduct) || config.conductTypes[0];
    
    let total = 0;
    let econBase = 0;
    let nonEcon = 0;
    let multiplier = "1.0";

    if (data.bodyPart === 'none') {
      // Pure Property Damage Logic
      econBase = data.propertyDamage;
      nonEcon = 0;
      total = econBase * (1 - (data.fault / 100));
      multiplier = "1.0";
    } else {
      // Standard Injury Logic
      econBase = data.medicalBills + data.lostWages + data.futureMedical + data.outOfPocket;
      const mVal = conduct.multiplier * (part.boost || 1);
      multiplier = mVal.toFixed(1);
      total = econBase * mVal * (1 - (data.fault / 100));
      nonEcon = Math.floor(econBase * (mVal - 1));
    }
    
    return {
      range: [Math.floor(total * 0.90), Math.floor(total * 1.10)],
      economic: econBase,
      nonEconomic: nonEcon,
      multiplier
    };
  }, [data, config]);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (leadInfo.name && leadInfo.phone && leadInfo.agreed) {
      setHasUnlocked(true);
      MockDB.saveCalcLead({
        name: leadInfo.name,
        phone: leadInfo.phone,
        calculatorSource: 'minor',
        inputs: {
          injuryType: config.bodyParts.find(p => p.id === data.bodyPart)?.label.en || data.bodyPart,
          medicalBills: data.bodyPart === 'none' ? 0 : data.medicalBills,
          lostWages: data.bodyPart === 'none' ? 0 : data.lostWages,
          futureMedical: data.bodyPart === 'none' ? 0 : data.futureMedical,
          outOfPocket: data.bodyPart === 'none' ? data.propertyDamage : data.outOfPocket
        },
        valuation: {
          net: estimate.range[0]
        },
        aiAudit: `PNC reports ${data.bodyPart} case. Net estimate revealed between $${estimate.range[0].toLocaleString()} and $${estimate.range[1].toLocaleString()}.`
      });
    }
  };

  const t = {
    title: language === 'en' ? "Minor Injury Estimator" : "Estimador de Lesiones Menores",
    caseInputs: language === 'en' ? "Case Inputs" : "Datos del Caso",
    seriousButton: language === 'en' ? "Serious Injuries" : "Lesiones Graves",
    injuryType: language === 'en' ? "Injury Type" : "Tipo de Lesión",
    conductType: language === 'en' ? "Defendant Conduct" : "Conducta del Demandado",
    economicDamages: language === 'en' ? "Economic Damages & Impact" : "Daños Económicos e Impacto",
    propertyDamage: language === 'en' ? "Property Damage" : "Daños a la Propiedad",
    medBills: language === 'en' ? "Medical Bills (to date)" : "Gastos Médicos (a la fecha)",
    futureMed: language === 'en' ? "Future Medical Expenses" : "Gastos Médicos Futuros",
    lostWages: language === 'en' ? "Lost Wages / Income" : "Pérdida de Salarios / Ingresos",
    outOfPocket: language === 'en' ? "Out of Pocket Expenses" : "Gastos de Bolsillo",
    compFault: language === 'en' ? "Comparative Fault Assessment" : "Evaluación de Culpa Comparativa",
    impactReduction: language === 'en' ? "Impact Reduction" : "Reducción por Impacto",
    liabilityOffset: language === 'en' ? "Liability Offset" : "Compensación de Responsabilidad",
    faultHelp: language === 'en' ? "This is your estimated percentage of fault for the accident. Under Texas law, your final recovery is reduced by this percentage." : "Este es su porcentaje estimado de culpa por el accidente. Según la ley de Texas, su recuperación final se reduce por este porcentaje.",
    estValue: language === 'en' ? "Estimated Case Value" : "Valor Estimado del Caso",
    econDamageShort: language === 'en' ? "Economic Damages" : "Daños Económicos",
    painSuffering: language === 'en' ? "Pain & Suffering" : "Dolor y Sufrimiento",
    footerDisclaimer: language === 'en' ? "These numbers are estimates based on Texas trial standards. Contact our office for a binding verification." : "Estas cifras son estimaciones basadas en estándares judiciales de Texas. Contacte nuestra oficina para una verificación vinculante.",
    callOffice: language === 'en' ? "CALL OUR OFFICE" : "LLAME A NUESTRA OFICINA",
    visitWebsite: language === 'en' ? "VISIT OUR WEBSITE" : "VISITE NUESTRO SITIO WEB",
    unlockBtn: language === 'en' ? "UNLOCK ESTIMATE" : "DESBLOQUEAR ESTIMACIÓN",
    accessPrompt: language === 'en' ? "Enter your contact details to view your evaluation." : "Ingrese sus datos para ver su evaluación.",
    agreeTerm: language === 'en' 
      ? "I understand that submitting this information does not create an attorney-client relationship. I acknowledge that this estimate is for evaluation purposes only and I authorize the firm to contact me." 
      : "Entiendo que el envío de esta información no crea una relación abogado-cliente. Reconozco que esta estimación es solo para fines de evaluación y autorizo a la firma a contactarme."
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20 no-scrollbar">
      <h2 className="text-3xl sm:text-5xl font-black tracking-tighter px-4 sm:px-0">{t.title}</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative px-4 sm:px-0">
        {/* Injury Info Overlay */}
        {infoModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-md rounded-3xl p-8 shadow-2xl relative border border-slate-200">
              <button onClick={() => setInfoModal(null)} className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-900 transition-colors">
                <X size={24} />
              </button>
              <div className={`w-16 h-16 rounded-xl ${firm.primaryColor} text-white flex items-center justify-center mb-6`}>
                {BODY_PART_ICONS[infoModal.id]}
              </div>
              <h4 className="text-2xl font-black mb-2">{infoModal.label[language]}</h4>
              <p className="text-slate-500 font-medium leading-relaxed">{infoModal.description[language]}</p>
            </div>
          </div>
        )}

        {/* Conduct Info Overlay */}
        {conductModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-md rounded-3xl p-8 shadow-2xl relative border border-slate-200">
              <button onClick={() => setConductModal(null)} className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-900 transition-colors">
                <X size={24} />
              </button>
              <div className={`w-16 h-16 rounded-xl ${firm.primaryColor} text-white flex items-center justify-center mb-6`}>
                {CONDUCT_ICONS[conductModal.id]}
              </div>
              <h4 className="text-2xl font-black mb-2">{conductModal.label[language]}</h4>
              <p className="text-slate-500 font-medium leading-relaxed">{conductModal.description ? conductModal.description[language] : ''}</p>
            </div>
          </div>
        )}

        <div className={`bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-200 space-y-6 transition-all`}>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <DollarSign className={firm.logoColor} /> {t.caseInputs}
            </h3>
            {onSeriousClick && (
              <button 
                onClick={onSeriousClick}
                className="bg-red-600 hover:bg-red-500 text-white sm:px-3 sm:py-1.5 px-2 py-1 rounded-lg sm:rounded-xl text-[9px] sm:text-[10px] font-bold flex items-center gap-1 transition-all shadow-lg active:scale-95 shrink-0"
              >
                {t.seriousButton} <ArrowUpRight size={10} className="sm:w-3 sm:h-3" />
              </button>
            )}
          </div>
          
          <div className="space-y-4">
            <label className="block text-sm font-bold text-slate-700 uppercase tracking-wider">{t.injuryType}</label>
            <div className="grid grid-cols-2 gap-2">
              {config.bodyParts.map(p => (
                <div key={p.id} className="relative group">
                  <button
                    onClick={() => { setData(prev => ({ ...prev, bodyPart: p.id })); setHasUnlocked(false); }}
                    className={`w-full h-full p-4 pr-10 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                      data.bodyPart === p.id 
                        ? firm.primaryColor + ' text-white border-transparent' 
                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-400'
                    }`}
                  >
                    <div className="shrink-0">{BODY_PART_ICONS[p.id]}</div>
                    <span className="text-xs font-bold leading-tight">{p.label[language]}</span>
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); setInfoModal(p); }}
                    className={`absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full transition-colors ${
                      data.bodyPart === p.id ? 'text-white/50 hover:text-white' : 'text-slate-300 hover:text-slate-600'
                    }`}
                  >
                    <Info size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6 animate-in slide-in-from-top-4 duration-300">
            {data.bodyPart !== 'none' && (
              <div className="space-y-4">
                <label className="block text-sm font-bold text-slate-700 uppercase tracking-wider">{t.conductType}</label>
                <div className="space-y-2">
                  {config.conductTypes.map(c => (
                    <div key={c.id} className="relative group">
                      <button
                        onClick={() => { setData(prev => ({ ...prev, conduct: c.id })); setHasUnlocked(false); }}
                        className={`w-full p-4 pr-12 rounded-2xl border flex items-center justify-between transition-all ${
                          data.conduct === c.id 
                            ? firm.primaryColor + ' text-white border-transparent' 
                            : 'bg-white border-slate-200 text-slate-600 hover:border-slate-400'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {CONDUCT_ICONS[c.id]}
                          <span className="text-sm font-bold">{c.label[language]}</span>
                        </div>
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); setConductModal(c); }}
                        className={`absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full transition-colors ${
                          data.conduct === c.id ? 'text-white/50 hover:text-white' : 'text-slate-300 hover:text-slate-600'
                        }`}
                      >
                        <Info size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-6 pt-4 border-t border-slate-100">
              <label className="block text-sm font-bold text-slate-700 uppercase tracking-wider">{t.economicDamages}</label>
              
              <div className="space-y-4">
                {data.bodyPart === 'none' ? (
                  <div className="space-y-2 animate-in fade-in duration-300">
                    <div className="flex justify-between text-[10px] font-black uppercase text-slate-400">
                      <span>{t.propertyDamage}</span>
                      <span className="text-slate-900 font-bold">${data.propertyDamage.toLocaleString()}</span>
                    </div>
                    <input 
                      type="range" min="500" max="250000" step="500" 
                      value={data.propertyDamage}
                      onChange={(e) => { setData(prev => ({ ...prev, propertyDamage: parseInt(e.target.value) })); setHasUnlocked(false); }}
                      className={`w-full h-2 bg-slate-200 rounded-full appearance-none accent-blue-600 cursor-pointer`}
                    />
                    <p className="text-[10px] text-slate-500 font-medium italic mt-2">Only property damage is considered in this analysis.</p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-2">
                      <div className="flex justify-between text-[10px] font-black uppercase text-slate-400">
                        <span>{t.medBills}</span>
                        <span className="text-slate-900 font-bold">${data.medicalBills.toLocaleString()}</span>
                      </div>
                      <input 
                        type="range" min="0" max="50000" step="500" 
                        value={data.medicalBills}
                        onChange={(e) => { setData(prev => ({ ...prev, medicalBills: parseInt(e.target.value) })); setHasUnlocked(false); }}
                        className={`w-full h-2 bg-slate-200 rounded-full appearance-none accent-blue-600 cursor-pointer`}
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-[10px] font-black uppercase text-slate-400">
                        <span>{t.futureMed}</span>
                        <span className="text-slate-900 font-bold">${data.futureMedical.toLocaleString()}</span>
                      </div>
                      <input 
                        type="range" min="0" max="100000" step="1000" 
                        value={data.futureMedical}
                        onChange={(e) => { setData(prev => ({ ...prev, futureMedical: parseInt(e.target.value) })); setHasUnlocked(false); }}
                        className={`w-full h-2 bg-slate-200 rounded-full appearance-none accent-blue-600 cursor-pointer`}
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-[10px] font-black uppercase text-slate-400">
                        <span>{t.lostWages}</span>
                        <span className="text-slate-900 font-bold">${data.lostWages.toLocaleString()}</span>
                      </div>
                      <input 
                        type="range" min="0" max="25000" step="250" 
                        value={data.lostWages}
                        onChange={(e) => { setData(prev => ({ ...prev, lostWages: parseInt(e.target.value) })); setHasUnlocked(false); }}
                        className={`w-full h-2 bg-slate-200 rounded-full appearance-none accent-blue-600 cursor-pointer`}
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-[10px] font-black uppercase text-slate-400">
                        <span>{t.outOfPocket}</span>
                        <span className="text-slate-900 font-bold">${data.outOfPocket.toLocaleString()}</span>
                      </div>
                      <input 
                        type="range" min="0" max="10000" step="100" 
                        value={data.outOfPocket}
                        onChange={(e) => { setData(prev => ({ ...prev, outOfPocket: parseInt(e.target.value) })); setHasUnlocked(false); }}
                        className={`w-full h-2 bg-slate-200 rounded-full appearance-none accent-blue-600 cursor-pointer`}
                      />
                    </div>
                  </>
                )}

                {/* Comparative Fault Dropdown Section */}
                <div className="pt-4 border-t border-slate-50">
                  <label className="block text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-4">{t.compFault}</label>
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center justify-between relative group hover:border-blue-200 transition-all">
                    <div className="flex flex-col">
                      <span className="text-[9px] font-black text-slate-400 uppercase leading-none mb-1">{t.impactReduction}</span>
                      <span className="text-sm font-bold text-slate-900">-{data.fault}% {t.liabilityOffset}</span>
                    </div>
                    <div className="relative">
                      <select 
                        value={data.fault} 
                        onChange={(e) => { setData(prev => ({ ...prev, fault: parseInt(e.target.value) })); setHasUnlocked(false); }} 
                        className="opacity-0 absolute inset-0 w-full h-full cursor-pointer z-10"
                      >
                        {CONTRIBUTION_WEIGHTS(language).map(w => <option key={w.val} value={w.val} className="text-slate-900">{w.label}</option>)}
                      </select>
                      <div className="bg-white p-2 rounded-xl shadow-sm border border-slate-100 flex items-center gap-2">
                        <span className="text-xs font-black text-slate-600">{data.fault}%</span>
                        <ChevronDown size={14} className="text-slate-400" />
                      </div>
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-500 font-medium italic mt-4 leading-relaxed">{t.faultHelp}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className={`${firm.primaryColor} text-white p-1 rounded-3xl shadow-2xl relative overflow-hidden`}>
             {!hasUnlocked ? (
               <div className="p-8 sm:p-10 space-y-6 animate-in zoom-in-95 duration-500 relative z-20">
                  <div className="flex items-center gap-3 mb-2">
                    <Lock size={20} className="text-blue-400" />
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400">Secure Case Evaluation</p>
                  </div>
                  <h3 className="text-2xl font-black tracking-tight leading-none">{t.accessPrompt}</h3>
                  <form onSubmit={handleUnlock} className="space-y-4">
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                      <input required type="text" value={leadInfo.name} onChange={e => setLeadInfo({...leadInfo, name: e.target.value})} placeholder="Full Legal Name" className="w-full bg-white/10 border border-white/20 rounded-xl pl-12 pr-4 py-4 font-bold text-white placeholder:text-white/40 focus:ring-2 focus:ring-white/50 outline-none transition-all" />
                    </div>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                      <input required type="tel" value={leadInfo.phone} onChange={e => setLeadInfo({...leadInfo, phone: e.target.value})} placeholder="Phone Number" className="w-full bg-white/10 border border-white/20 rounded-xl pl-12 pr-4 py-4 font-bold text-white placeholder:text-white/40 focus:ring-2 focus:ring-white/50 outline-none transition-all" />
                    </div>
                    <div className="flex items-start gap-3 p-4 bg-white/5 rounded-xl cursor-pointer group transition-all hover:bg-white/10" onClick={() => setLeadInfo({...leadInfo, agreed: !leadInfo.agreed})}>
                      <div className={`shrink-0 mt-0.5 w-6 h-6 border-2 rounded-md flex items-center justify-center transition-all ${leadInfo.agreed ? 'bg-white border-white text-red-800' : 'border-white/40 bg-transparent'}`}>
                        {leadInfo.agreed && <Check size={18} strokeWidth={4} />}
                      </div>
                      <p className="text-[11px] font-bold text-white/80 leading-tight">{t.agreeTerm}</p>
                    </div>
                    <button type="submit" disabled={!leadInfo.agreed} className="w-full bg-blue-600 text-white py-5 rounded-xl font-black text-xl shadow-xl hover:bg-blue-500 transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-30 disabled:cursor-not-allowed">
                      <Send size={24} /> {t.unlockBtn}
                    </button>
                  </form>
               </div>
             ) : (
               <div className="p-8 sm:p-10 animate-in fade-in zoom-in-95 duration-700">
                  <div className="absolute top-0 right-0 p-6 opacity-20 pointer-events-none">
                    {data.bodyPart === 'none' ? <Car size={120} /> : <TrendingUp size={120} />}
                  </div>
                  <div className="flex justify-between items-start mb-4 relative z-10">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60">{t.estValue}</p>
                  </div>
                  <h2 className="text-4xl sm:text-5xl font-black mb-8 tracking-tighter relative z-10">
                    ${estimate.range[0].toLocaleString()} - ${estimate.range[1].toLocaleString()}
                  </h2>
                  <div className="grid grid-cols-2 gap-4 relative z-10">
                    <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/5">
                      <span className="block text-[8px] font-black uppercase opacity-60">{t.econDamageShort}</span>
                      <span className="text-lg font-bold">${estimate.economic.toLocaleString()}</span>
                    </div>
                    <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/5">
                      <span className="block text-[8px] font-black uppercase opacity-60">{data.bodyPart === 'none' ? 'Adjustments' : t.painSuffering}</span>
                      <span className="text-lg font-bold">${estimate.nonEconomic.toLocaleString()}</span>
                    </div>
                  </div>
               </div>
             )}
          </div>

          {hasUnlocked && (
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm text-center space-y-4 animate-in slide-in-from-bottom-4 duration-500">
              <p className="text-slate-500 text-sm mb-4">{t.footerDisclaimer}</p>
              <div className="flex flex-col gap-4">
                <a href={`tel:${firm.phone}`} className={`${firm.primaryColor} text-white w-full py-5 rounded-xl font-black text-2xl flex items-center justify-center gap-3 hover:scale-[1.02] transition-all shadow-xl`}>
                  <Phone size={24} fill="currentColor" /> {t.callOffice}
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Calculator;
