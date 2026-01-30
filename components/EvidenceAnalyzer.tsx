
import React, { useState, useRef, useMemo, useEffect } from 'react';
import { 
  FileText, Search, Loader2, CheckCircle2, AlertTriangle, Upload, X, 
  Bot, BrainCircuit, Activity, DollarSign, ImageIcon, Briefcase, Plus, Scale, Phone, User as UserIcon, Lock, CheckSquare, Send, ShieldCheck, Info, Sparkles, Check
} from 'lucide-react';
import { FirmBranding, Language } from '../types';
import { analyzeCaseEvidence, CaseFile } from '../services/gemini';
import ConsentModal, { ConsentPayload } from './ConsentModal';
import { MockDB } from '../services/storage';
import { useDemoMode } from '../useDemoMode';
import { DEMO_DOCUMENTS, DEMO_EVIDENCE } from '../demoData';

interface EvidenceAnalyzerProps {
  firm: FirmBranding;
  language: Language;
}

const ThinkingDots = () => (
  <div className="flex gap-1.5 items-center">
    <div className="w-2 h-2 bg-blue-600 rounded-full typing-dot"></div>
    <div className="w-2 h-2 bg-blue-600 rounded-full typing-dot"></div>
    <div className="w-2 h-2 bg-blue-600 rounded-full typing-dot"></div>
  </div>
);

const CATEGORIES = (lang: Language) => [
  { 
    id: 'official', 
    label: lang === 'en' ? 'Official Reports' : 'Informes Oficiales', 
    icon: <FileText size={18} />, 
    sub: lang === 'en' ? 'Police, Incident, Crash' : 'Policía, Incidente, Choque',
    desc: lang === 'en' ? 'This includes Police Reports (CR-3 in Texas), Incident reports from businesses, and Fire Department/EMS run logs. These documents establish the legal foundation of liability.' : 'Esto incluye Informes Policiales (CR-3 en Texas), informes de incidentes de empresas y registros del Departamento de Bomberos/EMS. Estos documentos establecen la base legal de la responsabilidad.'
  },
  { 
    id: 'medical', 
    label: lang === 'en' ? 'Medical Records' : 'Registros Médicos', 
    icon: <Activity size={18} />, 
    sub: lang === 'en' ? 'ER, Bills, Imaging' : 'Urgencias, Facturas, Imágenes',
    desc: lang === 'en' ? 'Clinical proof of injury. Includes ER intake forms, radiology reports (MRI/CT), discharge summaries, and itemized billing statements. Requires a signed medical release/consent.' : 'Prueba clínica de la lesión. Incluye formularios de ingreso a urgencias, informes radiológicos (RMN/TC), resúmenes de alta y estados de cuenta detallados. Requiere una autorización/consentimiento médico firmado.'
  },
  { 
    id: 'financial', 
    label: lang === 'en' ? 'Income Docs' : 'Docs. de Ingresos', 
    icon: <DollarSign size={18} />, 
    sub: lang === 'en' ? 'Paystubs, Tax Forms' : 'Nóminas, Formularios de Impuestos',
    desc: lang === 'en' ? 'Documentation proving economic loss. Includes pay stubs from the 3 months prior to the accident, W-2s, or tax returns for self-employed individuals to verify lost earning capacity.' : 'Documentación que acredite la pérdida económica. Incluye recibos de pago de los 3 meses anteriores al accidente, W-2 o declaraciones de impuestos para trabajadores independientes.'
  },
  { 
    id: 'media', 
    label: lang === 'en' ? 'Visual Evidence' : 'Evidencia Visual', 
    icon: <ImageIcon size={18} />, 
    sub: lang === 'en' ? 'Fotos, Videos' : 'Fotos, Videos',
    desc: lang === 'en' ? 'Visual documentation of the scene, vehicle damage, and physical injuries. Photos should be high-resolution and include multiple angles to help AI reconstruct the incident.' : 'Documentación visual de la escena, daños al vehículo y lesiones físicas. Las fotos deben ser de alta resolución e incluir múltiples ángulos.'
  },
] as const;

const EvidenceAnalyzer: React.FC<EvidenceAnalyzerProps> = ({ firm, language }) => {
  const [userFacts, setUserFacts] = useState('');
  const [files, setFiles] = useState<CaseFile[]>([]);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showGate, setShowGate] = useState(false);
  const [hasUnlocked, setHasUnlocked] = useState(false);
  const [isFinalSubmitted, setIsFinalSubmitted] = useState(false);
  const [isConsentOpen, setIsConsentOpen] = useState(false);
  const [medicalConsentId, setMedicalConsentId] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string>("");
  
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { demoModeEnabled } = useDemoMode();

  // Handle auto-scroll to top of container when loading starts
  useEffect(() => {
    if (isLoading && containerRef.current) {
      containerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [isLoading]);

  useEffect(() => {
    if (demoModeEnabled) {
      setFiles(DEMO_DOCUMENTS);
      setUserFacts("I had an accident and hit my head.");
    } else {
      setFiles([]);
      setUserFacts("");
    }
  }, [demoModeEnabled]);
  
  const [leadInfo, setLeadInfo] = useState({ name: '', contact: '', agreed: false });

  const [activeCategory, setActiveCategory] = useState<CaseFile['category']>('official');

  // Calculate Brief Strength based on 5 specific pillars
  const protocolMetrics = useMemo(() => {
    const hasFacts = userFacts.trim().length > 15;
    const hasOfficial = files.some(f => f.category === 'official');
    const hasMedical = files.some(f => f.category === 'medical');
    const hasFinancial = files.some(f => f.category === 'financial');
    const hasMedia = files.some(f => f.category === 'media');

    let count = 0;
    if (hasFacts) count++;
    if (hasOfficial) count++;
    if (hasMedical) count++;
    if (hasFinancial) count++;
    if (hasMedia) count++;

    const percentage = count * 20;
    return { percentage, hasFacts, hasOfficial, hasMedical, hasFinancial, hasMedia };
  }, [userFacts, files]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (demoModeEnabled) return;

    const rawFiles = e.target.files;
    if (!rawFiles) return;

    if (activeCategory === 'medical' && !medicalConsentId) {
      setIsConsentOpen(true);
      return;
    }

    Array.from(rawFiles).forEach((file: File) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Data = (reader.result as string).split(',')[1];
        setFiles(prev => [...prev, { data: base64Data, mimeType: file.type, category: activeCategory, name: file.name }]);
      };
      reader.readAsDataURL(file);
    });
    if (fileInputRef.current) fileInputRef.current.value = '';
    setUploadStatus("");
  };

  const handleAddClick = () => {
    if (demoModeEnabled) return;

    if (activeCategory === 'medical' && !medicalConsentId) {
      setIsConsentOpen(true);
    } else {
      fileInputRef.current?.click();
    }
  };

  const handleAnalyze = async () => {
    if (!userFacts.trim()) return;
    setIsLoading(true);
    setAnalysis(null);
    setShowGate(false);

    if (demoModeEnabled) {
      // Simulate synthesis for the demo experience
      await new Promise(resolve => setTimeout(resolve, 2500));
      setAnalysis(DEMO_EVIDENCE[0].analysis);
      setShowGate(true);
      setIsLoading(false);
      return;
    }

    try {
      const result = await analyzeCaseEvidence(files, userFacts, firm.attorney, language);
      setAnalysis(result || (language === 'en' ? "Failed to generate brief." : "Error al generar el informe."));
      setShowGate(true);
    } catch (error) {
      setAnalysis(language === 'en' ? "Error compiling memorandum." : "Error al compilar el memorando.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (leadInfo.name && leadInfo.contact && leadInfo.agreed) {
      setHasUnlocked(true);
      setShowGate(false);
    }
  };

  const handleFinalSubmit = () => {
    MockDB.saveEvidence({
      name: leadInfo.name,
      contact: leadInfo.contact,
      testimony: userFacts,
      analysis: analysis || '',
      files: files,
      protocolStrength: protocolMetrics.percentage
    });
    setIsFinalSubmitted(true);
  };

  const handleConsentAccept = (payload: ConsentPayload) => {
    setMedicalConsentId(payload.signatureName + "-" + Date.now());
    setIsConsentOpen(false);
    setUploadStatus(language === 'en' ? "Consent verified. You may now upload medical records." : "Consentimiento verificado. Ahora puede cargar registros médicos.");
    setTimeout(() => {
      fileInputRef.current?.click();
    }, 500);
  };

  const t = {
    title: language === 'en' ? "Evidence Synthesis Hub" : "Centro de Síntesis de Evidencia",
    subtitle: language === 'en' ? "Provide details and supporting docs for clinical analysis." : "Proporcione detalles y documentos de apoyo para el análisis clínico.",
    genTitle: language === 'en' ? "Case Audit Generator" : "Generador de Auditoría del Caso",
    pncFacts: language === 'en' ? "PNC Facts Provided" : "Hechos del PNC Proporcionados",
    offReports: language === 'en' ? "Official Reports Integrated" : "Informes Oficiales Integrados",
    medProof: language === 'en' ? "Medical Clinical Proof" : "Prueba Clínica Médica",
    finData: language === 'en' ? "Financial Impact Data" : "Datos de Impacto Financiero",
    visRecon: language === 'en' ? "Visual Reconstruction" : "Reconstrucción Visual",
    completion: language === 'en' ? "Brief Completion" : "Completado del Informe",
    beginPrompt: language === 'en' ? "Begin by entering facts to initiate generator." : "Comience ingresando hechos para iniciar el generador.",
    step1: language === 'en' ? "1. Your Set of Facts" : "1. Su Conjunto de Hechos",
    textareaPlaceholder: language === 'en' ? "Describe the incident in detail..." : "Describa el incidente en detalle...",
    factsLocked: language === 'en' ? "Facts Locked (+20%)" : "Hechos Bloqueados (+20%)",
    step2: language === 'en' ? "2. Upload Evidence (Optional)" : "2. Cargar Evidencia (Opcional)",
    aboutLabel: language === 'en' ? "About" : "Sobre",
    docsAttached: (count: number) => language === 'en' ? `Attached Documents (${count})` : `Documentos Adjuntos (${count})`,
    compileBtn: language === 'en' ? "BEGIN EVIDENCE AUDIT" : "INICIAR AUDITORÍA DE EVIDENCIA",
    analyzing: language === 'en' ? "synthesizing memorandum..." : "sintetizando memorando...",
    analysisComplete: language === 'en' ? "Audit Complete" : "Auditoría Completada",
    accessBrief: language === 'en' ? "Access the executive recovery briefing below." : "Acceda al informe ejecutivo de recuperación a continuación.",
    fullName: language === 'en' ? "Full Legal Name" : "Nombre Legal Completo",
    phoneEmail: language === 'en' ? "Phone or Email" : "Teléfono o Correo",
    disclaimer: language === 'en' ? "I understand that this analysis is an AI synthesis and does not constitute a formal attorney-client relationship." : "Entiendo que este análisis es una síntesis de IA y no constituye una relación formal abogado-cliente.",
    viewMemo: language === 'en' ? "UNLOCK CASE MEMORANDUM" : "DESBLOQUEAR MEMORANDO DEL CASO",
    execBrief: language === 'en' ? "Executive Recovery Briefing" : "Informe Ejecutivo de Recuperación",
    preparedFor: language === 'en' ? "Prepared for" : "Preparado para",
    submitToHLG: language === 'en' ? "SUBMIT TO FIRM FOR REVIEW" : "ENVIAR A LA FIRMA PARA REVISIÓN",
    memoTransmitted: language === 'en' ? "Memorandum Transmitted" : "Memorando Transmitido",
    memoNotify: language === 'en' ? "The legal team has been notified and will review your file shortly." : "El equipo legal ha sido notificado y revisará su expediente en breve."
  };

  const categories = CATEGORIES(language);

  return (
    <div ref={containerRef} className="max-w-6xl mx-auto space-y-8 pb-20 no-scrollbar overflow-x-hidden min-h-[800px] scroll-mt-32">
      {!analysis && !isLoading && (
        <div className="text-center mb-10 px-4 animate-in fade-in duration-500">
          {demoModeEnabled && (
            <div className="inline-flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 px-4 py-2 rounded-full mb-6 animate-in slide-in-from-top-4">
              <Sparkles size={14} className="text-yellow-600" />
              <span className="text-[10px] font-black uppercase tracking-widest text-yellow-700">DEMO MODE ON: sample Allegiance EMS case</span>
            </div>
          )}
          <h2 className="text-4xl sm:text-5xl font-black tracking-tighter mb-4">{t.title}</h2>
          <p className="text-slate-500 font-medium max-w-2xl mx-auto text-sm sm:text-base">{t.subtitle}</p>
        </div>
      )}

      {!analysis && !isLoading && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 px-4 sm:px-0 animate-in fade-in slide-in-from-bottom-4 duration-700">
          
          <div className="lg:col-span-4 space-y-6 order-1 lg:order-2">
             <div className="bg-slate-900 p-8 rounded-3xl text-white space-y-8 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                   <ShieldCheck size={120} />
                </div>
                <h4 className="text-xl font-black tracking-tight relative z-10">{t.genTitle}</h4>
                
                <div className="space-y-4 relative z-10">
                   <div className="flex gap-3">
                      <div className={`w-5 h-5 rounded-full ${protocolMetrics.hasFacts ? 'bg-emerald-500/20' : 'bg-white/5'} flex items-center justify-center shrink-0 mt-0.5`}>
                        <CheckCircle2 size={12} className={protocolMetrics.hasFacts ? 'text-emerald-400' : 'text-white/20'} />
                      </div>
                      <p className={`text-xs ${protocolMetrics.hasFacts ? 'text-white' : 'text-slate-500'} font-medium transition-colors`}>{t.pncFacts}</p>
                   </div>
                   <div className="flex gap-3">
                      <div className={`w-5 h-5 rounded-full ${protocolMetrics.hasOfficial ? 'bg-emerald-500/20' : 'bg-white/5'} flex items-center justify-center shrink-0 mt-0.5`}>
                        <CheckCircle2 size={12} className={protocolMetrics.hasOfficial ? 'text-emerald-400' : 'text-white/20'} />
                      </div>
                      <p className={`text-xs ${protocolMetrics.hasOfficial ? 'text-white' : 'text-slate-500'} font-medium transition-colors`}>{t.offReports}</p>
                   </div>
                   <div className="flex gap-3">
                      <div className={`w-5 h-5 rounded-full ${protocolMetrics.hasMedical ? 'bg-emerald-500/20' : 'bg-white/5'} flex items-center justify-center shrink-0 mt-0.5`}>
                        <CheckCircle2 size={12} className={protocolMetrics.hasMedical ? 'text-emerald-400' : 'text-white/20'} />
                      </div>
                      <p className={`text-xs ${protocolMetrics.hasMedical ? 'text-white' : 'text-slate-500'} font-medium transition-colors`}>{t.medProof}</p>
                   </div>
                   <div className="flex gap-3">
                      <div className={`w-5 h-5 rounded-full ${protocolMetrics.hasFinancial ? 'bg-emerald-500/20' : 'bg-white/5'} flex items-center justify-center shrink-0 mt-0.5`}>
                        <CheckCircle2 size={12} className={protocolMetrics.hasFinancial ? 'text-emerald-400' : 'text-white/20'} />
                      </div>
                      <p className={`text-xs ${protocolMetrics.hasFinancial ? 'text-white' : 'text-slate-500'} font-medium transition-colors`}>{t.finData}</p>
                   </div>
                   <div className="flex gap-3">
                      <div className={`w-5 h-5 rounded-full ${protocolMetrics.hasMedia ? 'bg-emerald-500/20' : 'bg-white/5'} flex items-center justify-center shrink-0 mt-0.5`}>
                        <CheckCircle2 size={12} className={protocolMetrics.hasMedia ? 'text-emerald-400' : 'text-white/20'} />
                      </div>
                      <p className={`text-xs ${protocolMetrics.hasMedia ? 'text-white' : 'text-slate-500'} font-medium transition-colors`}>{t.visRecon}</p>
                   </div>
                </div>

                <div className="pt-6 border-t border-white/10">
                   <div className="flex justify-between items-center mb-3">
                      <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">{t.completion}</p>
                      <p className="text-[10px] font-black text-white">{protocolMetrics.percentage}%</p>
                   </div>
                   <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden border border-white/5">
                      <div 
                        className="h-full bg-blue-500 transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(59,130,246,0.5)]" 
                        style={{ width: `${protocolMetrics.percentage}%` }}
                      />
                   </div>
                </div>
             </div>
          </div>

          <div className="lg:col-span-8 space-y-6 order-2 lg:order-1">
            <div className={`bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-200`}>
              <h3 className="text-xs font-black uppercase text-slate-400 tracking-[0.2em] mb-4">{t.step1}</h3>
              <textarea 
                readOnly={demoModeEnabled}
                value={userFacts} 
                onChange={(e) => setUserFacts(e.target.value)} 
                placeholder={t.textareaPlaceholder} 
                className="w-full h-40 p-5 bg-slate-50 border border-slate-200 rounded-2xl text-[16px] focus:ring-2 focus:ring-slate-900 outline-none resize-none font-medium mb-2" 
              />
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest text-right">
                {protocolMetrics.hasFacts ? <span className="text-emerald-500">{t.factsLocked}</span> : (language === 'en' ? "Requires >15 characters" : "Requiere >15 caracteres")}
              </p>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-200">
              <h3 className="text-xs font-black uppercase text-slate-400 tracking-[0.2em] mb-6">{t.step2}</h3>
              <div className={`grid grid-cols-2 md:grid-cols-4 gap-3 mb-6 ${demoModeEnabled ? 'opacity-50 pointer-events-none' : ''}`}>
                {categories.map(cat => (
                  <button key={cat.id} onClick={() => { setActiveCategory(cat.id); setUploadStatus(""); }} className={`p-4 rounded-2xl border-2 transition-all text-left flex flex-col gap-3 group ${activeCategory === cat.id ? firm.primaryColor + ' border-transparent text-white shadow-lg scale-[1.02]' : 'bg-slate-50 border-slate-100 text-slate-500 hover:border-slate-300'}`}>
                    <div className={`p-2 rounded-xl w-fit ${activeCategory === cat.id ? 'bg-white/20' : 'bg-white shadow-sm'}`}>{cat.icon}</div>
                    <div>
                      <p className="text-[11px] font-black leading-tight mb-1">{cat.label}</p>
                    </div>
                  </button>
                ))}
              </div>

              {!demoModeEnabled && (
                <>
                  <div className="bg-blue-50/50 border border-blue-100 p-5 rounded-2xl mb-8 flex gap-4 animate-in fade-in duration-300">
                    <div className="shrink-0 text-blue-500"><Info size={20} /></div>
                    <div>
                      <h4 className="text-[11px] font-black uppercase tracking-widest text-blue-900 mb-1">{t.aboutLabel} {categories.find(c => c.id === activeCategory)?.label}</h4>
                      <p className="text-xs text-blue-700 leading-relaxed font-medium">
                        {categories.find(c => c.id === activeCategory)?.desc}
                      </p>
                    </div>
                  </div>

                  <div onClick={handleAddClick} className="border-2 border-dashed border-slate-200 rounded-2xl p-8 flex flex-col items-center justify-center gap-4 hover:border-slate-400 cursor-pointer bg-slate-50/50 transition-all group mb-8">
                    <Plus className="text-slate-400" size={32} />
                    <p className="text-base sm:text-lg font-black text-slate-900">{language === 'en' ? 'Add' : 'Agregar'} {categories.find(c => c.id === activeCategory)?.label}</p>
                    <input type="file" ref={fileInputRef} className="hidden" multiple onChange={handleFileChange} />
                  </div>
                </>
              )}

              {files.length > 0 && (
                <div className="space-y-3">
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-2">{t.docsAttached(files.length)}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {files.map((f, i) => (
                      <div key={i} className={`flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-xl group relative ${demoModeEnabled ? 'hover:bg-yellow-50/50 transition-colors' : ''}`}>
                        {demoModeEnabled && (
                          <div className="absolute top-1 right-2"><Sparkles size={8} className="text-yellow-500" /></div>
                        )}
                        <div className="flex items-center gap-3 overflow-hidden">
                          <div className={`p-2 rounded-lg shadow-sm shrink-0 ${demoModeEnabled ? 'bg-yellow-100/50 text-yellow-600' : 'bg-white text-slate-600'}`}>
                            {categories.find(c => c.id === f.category)?.icon || <FileText size={14} />}
                          </div>
                          <span className="text-xs font-bold text-slate-600 truncate">{f.name}</span>
                        </div>
                        {!demoModeEnabled && (
                          <button onClick={() => setFiles(prev => prev.filter((_, idx) => idx !== i))} className="p-1 text-slate-300 hover:text-red-500 transition-colors">
                            <X size={14} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button 
              onClick={handleAnalyze} 
              disabled={isLoading || !userFacts.trim()} 
              className={`${firm.primaryColor} text-white w-full py-6 rounded-2xl font-black text-xl flex items-center justify-center gap-4 hover:opacity-95 transition-all disabled:opacity-50 shadow-2xl group relative overflow-hidden`}
            >
              <BrainCircuit size={28} /> {t.compileBtn}
            </button>
          </div>

        </div>
      )}

      {isLoading && (
        <div className="animate-in zoom-in-95 duration-500 bg-white p-12 rounded-3xl shadow-2xl border border-slate-200 flex flex-col items-center justify-center py-32 gap-8 max-w-4xl mx-auto">
          <BrainCircuit size={64} className="text-blue-600 animate-bounce" />
          <h3 className="text-2xl font-black text-slate-900 mb-2 lowercase">{t.analyzing}</h3>
          <ThinkingDots />
        </div>
      )}

      {showGate && !hasUnlocked && (
        <div className="max-w-2xl mx-auto bg-white p-8 sm:p-12 rounded-3xl shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-500">
          <h3 className="text-3xl font-black tracking-tighter mb-2 text-center">{t.analysisComplete}</h3>
          <p className="text-slate-500 text-center font-medium mb-8">{t.accessBrief}</p>
          <form onSubmit={handleUnlock} className="space-y-6">
            <input required type="text" value={leadInfo.name} onChange={e => setLeadInfo({...leadInfo, name: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-4 font-bold outline-none focus:ring-2 focus:ring-slate-900 transition-all" placeholder={t.fullName} />
            <input required type="text" value={leadInfo.contact} onChange={e => setLeadInfo({...leadInfo, contact: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-4 font-bold outline-none focus:ring-2 focus:ring-slate-900 transition-all" placeholder={t.phoneEmail} />
            <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl cursor-pointer group transition-all hover:bg-slate-100/50" onClick={() => setLeadInfo({...leadInfo, agreed: !leadInfo.agreed})}>
              <div className={`shrink-0 mt-0.5 w-6 h-6 border-2 rounded-md flex items-center justify-center transition-all ${leadInfo.agreed ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300 bg-white'}`}>
                {leadInfo.agreed && <Check size={18} strokeWidth={4} />}
              </div>
              <p className="text-[11px] font-bold text-slate-500 leading-tight">{t.disclaimer}</p>
            </div>
            <button type="submit" disabled={!leadInfo.agreed} className={`${firm.primaryColor} text-white w-full py-5 rounded-xl font-black text-xl shadow-xl hover:opacity-95 transition-all active:scale-95 disabled:opacity-50`}>{t.viewMemo}</button>
          </form>
        </div>
      )}

      {analysis && hasUnlocked && (
        <div className="bg-white p-6 sm:p-12 rounded-3xl shadow-2xl border border-slate-200 animate-in fade-in duration-700">
          <div className="flex items-center justify-between mb-8 pb-8 border-b border-slate-100">
            <div className="flex items-center gap-4">
              <div className="bg-slate-900 p-3 rounded-2xl text-white"><Bot size={24} /></div>
              <div>
                <h3 className="font-black text-2xl tracking-tight">{t.execBrief}</h3>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{t.preparedFor} {firm.attorney}</p>
              </div>
            </div>
            <button onClick={() => window.print()} className="p-3 bg-slate-100 rounded-xl text-slate-600 hover:bg-slate-200 transition-colors"><FileText size={20} /></button>
          </div>
          <div className="whitespace-pre-wrap text-slate-800 font-mono text-sm leading-relaxed mb-12 bg-slate-50 p-8 rounded-3xl border border-slate-100 shadow-inner max-h-[600px] overflow-y-auto micro-scrollbar">{analysis}</div>
          {!isFinalSubmitted ? (
            <button onClick={handleFinalSubmit} className={`${firm.primaryColor} text-white w-full py-6 rounded-2xl font-black text-lg sm:text-xl px-4 flex items-center justify-center gap-3 shadow-2xl hover:scale-[1.01] transition-all active:scale-95 text-balance`}>
              <Send size={24} /> {t.submitToHLG}
            </button>
          ) : (
            <div className="bg-emerald-50 p-12 rounded-3xl text-center border-2 border-emerald-100 animate-in zoom-in-95 duration-500">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 size={32} />
              </div>
              <h3 className="text-3xl font-black text-emerald-900 mb-2">{t.memoTransmitted}</h3>
              <p className="text-emerald-700 font-medium">{t.memoNotify}</p>
            </div>
          )}
        </div>
      )}

      <ConsentModal 
        open={isConsentOpen} 
        firm={firm} 
        language={language}
        onCancel={() => setIsConsentOpen(false)}
        onAccept={handleConsentAccept}
      />
    </div>
  );
};

export default EvidenceAnalyzer;
