
import React, { useState } from 'react';
import { FirmBranding, Language } from '../types';
import { 
  ShieldCheck, Zap, Scale, Cpu, BrainCircuit, Users, Heart, Bot, Search, 
  ExternalLink, Phone, Sparkles, Gavel, BarChart3, X, CheckCircle2, 
  Database, Fingerprint, Lock, ShieldAlert, Target, TrendingUp, Landmark, FileSearch, HeartPulse, ShieldX, ArrowRight
} from 'lucide-react';

interface AboutViewsProps {
  firm: FirmBranding;
  language: Language;
}

const AboutViews: React.FC<AboutViewsProps> = ({ firm, language }) => {
  const brandName = language === 'en' ? 'injury.bot' : 'lesion.bot';

  const t = {
    title: language === 'en' ? "The Policy Limits Protocol" : "El Protocolo de Límites de Póliza",
    subtitle: language === 'en' ? "35 Years of Trial Experience + AI Infrastructure" : "35 Años de Experiencia en Juicios + Infraestructura de IA",
    p1: language === 'en' 
      ? `Traditional injury firms are built on manual labor and slow timelines. Our AI-powered infrastructure is designed for one purpose: demanding the policy limits.`
      : `Las firmas tradicionales se basan en el trabajo manual y plazos lentos. Nuestra infraestructura impulsada por IA diseñada para un solo propósito: exigir los límites de la póliza.`,
    history_h: language === 'en' ? "The Duty to Settle" : "El Deber de Liquidar",
    history_p: language === 'en'
      ? "In the 1920s, Texas courts established the 'Stowers Doctrine,' forcing insurance companies to act in good faith. Today, obtaining a policy limits offer requires more than just a serious injury—it requires a demand so well-organized and legally defensible that the insurer fears a multi-million dollar 'excess' verdict if they refuse to pay."
      : "En la década de 1920, los tribunales de Texas establecieron la 'Doctrina Stowers', obligando a las aseguradoras a actuar de buena fe. Hoy, obtener una oferta de límites requiere una demanda tan bien organizada que la aseguradora tema un veredicto 'excesivo' si se niegan a pagar.",
    ai_benefit_h: language === 'en' ? "The 20% Net Advantage" : "La Ventaja del 20% Neto",
    ai_benefit_p: language === 'en'
      ? "By using AI Agents to triage evidence, itemize medical bills, and perform legal research in seconds, we have eliminated the administrative bloat of traditional firms. This efficiency allows our clients to receive more than 20% more of their final settlement compared to standard industry models."
      : "Al usar Agentes de IA para clasificar evidencia y detallar facturas médicas en segundos, hemos eliminado la carga administrativa. Esta eficiencia permite que nuestros clientes reciban más del 20% adicional de su liquidación final en comparación con los modelos estándar.",
    cta_btn: language === 'en' ? `DEPLOY THE PROTOCOL` : `DESPLEGAR EL PROTOCOLO`,
  };

  const protocols = [
    {
      id: 'triage',
      icon: <BrainCircuit className="text-blue-400" size={24} />,
      title: language === 'en' ? "Autonomous Triage" : "Triaje Autónomo",
      desc: language === 'en' ? "Our agents scan records to identify 'Anchor Injuries' that exceed insurance limits within hours of your onboarding." : "Nuestros agentes escanean registros para identificar 'Lesiones de Anclaje' que superan los límites en horas."
    },
    {
      id: 'defense',
      icon: <Gavel className="text-red-400" size={24} />,
      title: language === 'en' ? "Defensible Demands" : "Demandas Defendibles",
      desc: language === 'en' ? "AI synthesizes 35 years of trial strategy to build demands that trigger the insurer's legal duty to settle." : "La IA sintetiza 35 años de estrategia de juicio para construir demandas que activan el deber legal de liquidar."
    },
    {
      id: 'clinical',
      icon: <HeartPulse className="text-emerald-400" size={24} />,
      title: language === 'en' ? "Clinical Synthesis" : "Síntesis Clínica",
      desc: language === 'en' ? "Every ER bill and MRI report is mapped by agents to ensure no medical value is left off the negotiation table." : "Cada factura de urgencias e informe de RMN es mapeado para asegurar que no se omita ningún valor médico."
    }
  ];

  const eligibility = [
    { label: "Verified Coverage", icon: <ShieldCheck size={16} className="text-emerald-400" /> },
    { label: "Clear Liability Indicators", icon: <CheckCircle2 size={16} className="text-emerald-400" /> },
    { label: "No Subrogation Liens", icon: <ShieldX size={16} className="text-red-400" /> },
    { label: "Electronic Record Access", icon: <Database size={16} className="text-blue-400" /> },
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 max-w-6xl mx-auto px-4 sm:px-0 pb-24 no-scrollbar overflow-x-hidden text-left">
      
      {/* Hero Branding */}
      <div className="text-center mb-20 pt-8">
        <div className="inline-flex items-center gap-2 bg-slate-900 border border-white/10 px-4 py-2 rounded-full mb-8 shadow-2xl">
          <Zap size={14} className="text-amber-500 fill-amber-500" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400">Policy Limits Express Protocol</span>
        </div>
        <h2 className="text-5xl sm:text-7xl font-black tracking-tighter mb-6 text-slate-900 leading-[0.9]">
          AI-Powered.<br/><span className="text-slate-400">Attorney-Built.</span>
        </h2>
        <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-sm max-w-2xl mx-auto">{t.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
        <div className="lg:col-span-7 space-y-12">
          {/* Main Narrative */}
          <section className="space-y-6">
            <p className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
              {t.p1}
            </p>
            <div className="h-1 w-20 bg-blue-600 rounded-full" />
          </section>

          {/* Stowers Section */}
          <section className="bg-white p-8 sm:p-10 rounded-[2.5rem] border border-slate-100 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
              <Landmark size={150} />
            </div>
            <div className="relative z-10 space-y-6">
              <div className="flex items-center gap-3">
                <Scale className="text-blue-600" size={24} />
                <h3 className="text-xl font-black uppercase tracking-tight">{t.history_h}</h3>
              </div>
              <p className="text-lg text-slate-600 leading-relaxed font-medium">
                {t.history_p}
              </p>
              <p className="text-sm text-slate-400 font-bold italic">
                {language === 'en' 
                  ? "*Insurers prioritize cases where the recovery package is organized for immediate trial review." 
                  : "*Las aseguradoras priorizan los casos donde el paquete de recuperación está organizado para revisión de juicio inmediata."}
              </p>
            </div>
          </section>

          {/* Catastrophic Context */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
               <ShieldAlert className="text-red-600" size={24} />
               <h3 className="text-xl font-black uppercase tracking-tight">{language === 'en' ? "Beyond Catastrophic" : "Más allá de lo Catastrófico"}</h3>
            </div>
            <p className="text-lg text-slate-500 leading-relaxed font-medium">
              {language === 'en' 
                ? "It is a harsh reality: most policy limit cases involve catastrophic, life-altering injuries. However, a severe injury does not guarantee a maximum payout. Insurance adjusters are trained to minimize 'General Damages' unless they are presented with a clinical, legally defensible map of the impairment."
                : "Es una realidad dura: la mayoría de los casos de límites involucran lesiones catastróficas. Sin embargo, una lesión grave no garantiza un pago máximo. Los ajustadores están entrenados para minimizar los daños a menos que se les presente un mapa legal defendible del deterioro."}
            </p>
          </section>
        </div>

        <div className="lg:col-span-5 space-y-8">
          {/* AI Efficiency Card */}
          <div className="bg-slate-900 text-white p-10 rounded-[3rem] shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 p-12 opacity-10">
                <Target size={180} className="text-blue-500" />
             </div>
             <div className="relative z-10 space-y-8">
                <div>
                   <div className="inline-flex items-center gap-2 bg-blue-600/20 border border-blue-500/30 px-3 py-1.5 rounded-full mb-4">
                      <TrendingUp size={12} className="text-blue-400" />
                      <span className="text-[9px] font-black uppercase tracking-widest text-blue-400">Net Recovery Advantage</span>
                   </div>
                   <h3 className="text-3xl font-black tracking-tight leading-none mb-4">{t.ai_benefit_h}</h3>
                   <p className="text-lg opacity-80 leading-relaxed font-medium">
                      {t.ai_benefit_p}
                   </p>
                </div>

                <div className="space-y-4">
                   {protocols.map((p) => (
                     <div key={p.id} className="bg-white/5 border border-white/10 p-5 rounded-2xl flex gap-4 hover:bg-white/10 transition-all cursor-default">
                        <div className="shrink-0 mt-1">{p.icon}</div>
                        <div>
                           <h4 className="text-[11px] font-black uppercase tracking-widest text-white mb-1">{p.title}</h4>
                           <p className="text-xs text-slate-400 leading-relaxed font-medium">{p.desc}</p>
                        </div>
                     </div>
                   ))}
                </div>
             </div>
          </div>

          {/* PLE Eligibility Protocol - REPLACED Deploy the Protocol */}
          <div className="bg-white border-2 border-slate-900 p-10 rounded-[3rem] text-slate-900 space-y-8 shadow-2xl group">
            <div className="space-y-2">
               <div className="flex items-center gap-2">
                  <ShieldCheck className="text-blue-600" size={24} />
                  <h4 className="text-2xl font-black leading-none tracking-tight uppercase">{language === 'en' ? "Eligibility Protocol" : "Protocolo de Elegibilidad"}</h4>
               </div>
               <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">{language === 'en' ? "PLE Acceptance Criteria" : "Criterios de Aceptación PLE"}</p>
            </div>
            
            <div className="space-y-3">
               {eligibility.map((item, i) => (
                 <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                    {item.icon}
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-700">{item.label}</span>
                 </div>
               ))}
            </div>

            <button 
              onClick={() => {
                // This link should trigger the navigation to ple_terms in App.tsx
                // Since this component is generic, we rely on the parent's route control if needed.
                // For now, let's assume we want to direct them to the full criteria page.
                const btn = document.querySelector('[data-nav="ple_terms"]') as HTMLElement;
                if (btn) btn.click();
                else window.scrollTo(0, 0);
              }}
              className="w-full inline-flex items-center justify-center gap-3 bg-slate-900 text-white px-8 py-5 rounded-2xl font-black text-sm hover:scale-[1.02] transition-transform shadow-xl active:scale-95 uppercase tracking-widest"
            >
              READ FULL ACCEPTANCE CRITERIA <ArrowRight size={18} />
            </button>
          </div>

          {/* Final Disclosure */}
          <div className="bg-slate-100 p-8 rounded-3xl border border-slate-200 text-center">
             <p className="text-[10px] text-slate-500 font-bold uppercase leading-relaxed tracking-widest px-4">
                {language === 'en' 
                  ? "This system is a proprietary triage protocol. It does not replace the specialized judgment of lead counsel but augments it with high-velocity data synthesis."
                  : "Este sistema es un protocolo de triaje patentado. No reemplaza el juicio del abogado principal, sino que lo aumenta con síntesis de datos de alta velocidad."}
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutViews;
