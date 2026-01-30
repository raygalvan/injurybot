
import React, { useState } from 'react';
import { FirmBranding, Language } from '../types';
import { 
  ShieldCheck, Zap, Scale, Cpu, BrainCircuit, Users, Heart, Bot, Search, 
  ExternalLink, Phone, Sparkles, Gavel, BarChart3, X, CheckCircle2, 
  Database, Fingerprint, Lock, ShieldAlert
} from 'lucide-react';

interface AboutViewsProps {
  firm: FirmBranding;
  language: Language;
}

type ModalType = 'ai_synthesis' | 'attorney_oversight' | null;

const AboutViews: React.FC<AboutViewsProps> = ({ firm, language }) => {
  const [activeModal, setActiveModal] = useState<ModalType>(null);

  const t = {
    title: language === 'en' ? "The Injury.bot Difference" : "La Diferencia de Injury.bot",
    subtitle: language === 'en' ? "Data-Driven Strategy for Modern Injury Law" : "Estrategia de Datos para el Derecho de Lesiones Moderno",
    p1: language === 'en' 
      ? `At ${firm.firmName}, we treat technology as a strategic leverage point for our clients.`
      : `En ${firm.firmName}, tratamos la tecnología como un punto de apalancamiento estratégico para nuestros clientes.`,
    p2: language === 'en'
      ? "Insurance companies are currently utilizing sophisticated AI tools to evaluate your claim and predict jury behavior. They use this data to set artificial settlement floors and minimize their payouts. We believe you deserve access to that same level of intelligence to protect your future."
      : "Las compañías de seguros utilizan sofisticadas herramientas de IA para evaluar su reclamo. Utilizan estos datos para establecer límites de liquidación artificiales. Creemos que usted merece acceso a ese mismo nivel de inteligencia.",
    p3: language === 'en'
      ? `${firm.attorney} has built a reputation for relentless advocacy in the courtroom. By integrating high-level AI protocols into our practice, we provide our clients an absolute advantage. We don't just react to insurance company tactics; we anticipate them.`
      : `${firm.attorney} ha construido una reputación de defensa implacable. Al integrar protocolos de IA de alto nivel, brindamos a nuestros clientes una ventaja absoluta.`,
    h3: language === 'en' ? "Strategic Intelligence" : "Inteligencia Estratégica",
    p4: language === 'en' 
      ? "When we combine cutting-edge data synthesis with seasoned attorney oversight, you receive a significant advantage. This approach levels the playing field against billion-dollar corporations by using their own technological standards to prove the true value of your case."
      : "Cuando combinamos la síntesis de datos de vanguardia con la supervisión de abogados experimentados, usted recibe una ventaja significativa. Este enfoque nivela el campo de juego contra corporaciones multimillonarias.",
    legacy_h: language === 'en' ? "Courtroom Command" : "Mando en la Sala",
    legacy_p: language === 'en' ? `Decades of trial experience ensure that every data point we identify is backed by the threat of a jury verdict.` : `Décadas de experiencia en juicios aseguran que cada dato que identificamos esté respaldado por la amenaza de un veredicto.`,
    advantage_h: language === 'en' ? "Information Parity" : "Paridad de Información",
    advantage_p: language === 'en' ? "We use proprietary protocols to analyze liability and damages with the same clinical accuracy as the adjusters." : "Utilizamos protocolos patentados para analizar la responsabilidad y los daños con precisión clínica.",
    cta_h: language === 'en' ? "Need Extraordinary Counsel?" : "¿Necesita Asesoría Extraordinaria?",
    cta_sub: language === 'en' ? "Our resourceful team is ready to stand with you. Contact us today for a free evaluation." : "Nuestro equipo creativo está listo para apoyarlo. Contáctenos hoy para una evaluación gratuita.",
    cta_btn: language === 'en' ? `CALL ${firm.phone}` : `LLAMAR ${firm.phone}`,
    resource_h: language === 'en' ? "Explore our full resources" : "Explore nuestros recursos",
    resource_p: language === 'en' ? "Deep-dive profiles and successful case archives." : "Perfiles detallados y archivos de casos exitosos.",
  };

  const modalContent = {
    ai_synthesis: {
      title: language === 'en' ? "AI Data Synthesis Protocol" : "Protocolo de Síntesis de Datos de IA",
      icon: <BrainCircuit size={32} className="text-blue-500" />,
      tagline: language === 'en' ? "Fighting Algorithms with Intelligence" : "Combatiendo Algoritmos con Inteligencia",
      description: language === 'en' 
        ? "InjuryBot doesn't just read documents; it synthesizes thousands of data points from medical records, police reports, and actuarial tables to find the hidden value insurance companies try to ignore." 
        : "InjuryBot no solo lee documentos; sintetiza miles de puntos de datos de registros médicos, informes policiales y tablas actuariales para encontrar el valor oculto que las compañías de seguros intentan ignorar.",
      features: [
        { 
          h: language === 'en' ? "Clinical Impact Mapping" : "Mapeo de Impacto Clínico", 
          p: language === 'en' ? "Automatically cross-references your injuries with medical standards to predict long-term disability costs." : "Cruza automáticamente sus lesiones con estándares médicos para predecir costos de discapacidad a largo plazo." 
        },
        { 
          h: language === 'en' ? "Liability Reconstruction" : "Reconstrucción de Responsabilidad", 
          p: language === 'en' ? "AI-driven analysis of crash dynamics and witness testimony to establish definitive fault patterns." : "Análisis impulsado por IA de la dinámica de choques y testimonios para establecer patrones de culpa definitivos." 
        },
        { 
          h: language === 'en' ? "Settlement Parity" : "Paridad de Liquidación", 
          p: language === 'en' ? "We use the same data modeling insurance adjusters use, ensuring we negotiate from a position of absolute information parity." : "Usamos el mismo modelado de datos que los ajustadores, asegurando que negociamos desde una posición de paridad informativa absoluta." 
        }
      ]
    },
    attorney_oversight: {
      title: language === 'en' ? "Elite Attorney Oversight" : "Supervisión de Abogados de Élite",
      icon: <Users size={32} className="text-red-500" />,
      tagline: language === 'en' ? "Data is the Weapon. Humans Win the War." : "Los Datos son el Arma. Los Humanos Ganan la Guerra.",
      description: language === 'en' 
        ? `Technology provides the evidence, but ${firm.attorney} provides the strategy. Every AI synthesis is personally reviewed by our lead trial attorneys to ensure human empathy and courtroom grit.` 
        : `La tecnología proporciona la evidencia, pero ${firm.attorney} proporciona la estrategia. Cada síntesis de IA es revisada personalmente por nuestros abogados de juicio.`,
      features: [
        { 
          h: language === 'en' ? "Strategic Refinement" : "Refinamiento Estratégico", 
          p: language === 'en' ? "Our attorneys take the AI-generated facts and turn them into a compelling narrative for a jury." : "Nuestros abogados toman los hechos generados por la IA y los convierten en una narrativa convincente para el jurado." 
        },
        { 
          h: language === 'en' ? "Trial-Ready Validation" : "Validación para Juicio", 
          p: language === 'en' ? "We ensure every data point is admissible in court and backed by decades of courtroom command." : "Nos aseguramos de que cada punto de datos sea admisible en los tribunales y esté respaldado por décadas de mando." 
        },
        { 
          h: language === 'en' ? "The Human Element" : "El Elemento Humano", 
          p: language === 'en' ? "AI cannot replace the emotional weight of your story. We bridge the gap between hard data and your lived experience." : "La IA no puede reemplazar el peso emocional de su historia. Unimos la brecha entre los datos y su experiencia." 
        }
      ]
    }
  };

  const renderModal = () => {
    if (!activeModal) return null;
    const content = modalContent[activeModal];

    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-xl animate-in fade-in duration-300">
        <div className="bg-white w-full max-w-2xl rounded-[2rem] overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-500 border border-slate-200">
          <button 
            onClick={() => setActiveModal(null)}
            className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-900 transition-colors z-20"
          >
            <X size={28} />
          </button>

          <div className="p-8 sm:p-12">
            <div className="flex items-center gap-5 mb-8">
              <div className="p-4 bg-slate-50 rounded-2xl shadow-sm border border-slate-100 shrink-0">
                {content.icon}
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-600 mb-1">{content.tagline}</p>
                <h3 className="text-3xl font-black text-slate-900 tracking-tighter leading-none">{content.title}</h3>
              </div>
            </div>

            <p className="text-lg text-slate-600 font-medium leading-relaxed mb-10 text-balance">
              {content.description}
            </p>

            <div className="space-y-6 mb-10">
              {content.features.map((f, i) => (
                <div key={i} className="flex gap-4 group">
                  <div className="mt-1 shrink-0">
                    <CheckCircle2 size={20} className="text-emerald-500" />
                  </div>
                  <div>
                    <h4 className="font-black text-slate-900 uppercase text-[11px] tracking-widest mb-1 group-hover:text-blue-600 transition-colors">{f.h}</h4>
                    <p className="text-sm text-slate-500 font-medium leading-relaxed">{f.p}</p>
                  </div>
                </div>
              ))}
            </div>

            <button 
              onClick={() => setActiveModal(null)}
              className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-lg shadow-xl hover:bg-slate-800 transition-all active:scale-[0.98] uppercase tracking-widest"
            >
              Close Intelligence Briefing
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 max-w-5xl mx-auto px-4 sm:px-0 pb-20 no-scrollbar overflow-x-hidden">
      {renderModal()}
      
      <div className="text-center mb-16 pt-8">
        <div className={`inline-flex p-4 rounded-2xl ${firm.primaryColor} text-white mb-6 shadow-xl relative min-w-[80px] min-h-[80px] items-center justify-center`}>
          {firm.logoData ? (
            <img src={firm.logoData} alt={firm.firmName} className="h-12 w-auto object-contain" />
          ) : (
            <Bot size={48} />
          )}
          <div className="absolute -top-3 -right-3 bg-yellow-400 p-2 rounded-xl text-slate-900 shadow-lg border-2 border-white animate-in zoom-in-50 duration-500 delay-300">
            <Sparkles size={18} fill="currentColor" />
          </div>
        </div>
        <h2 className="text-4xl sm:text-6xl font-black tracking-tighter mb-4">{t.title}</h2>
        <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px] sm:text-sm">{t.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-7 space-y-10">
          <p className="text-2xl sm:text-3xl font-black text-slate-900 leading-[1.1] tracking-tight">
            {t.p1}
          </p>
          <p className="text-lg text-slate-500 leading-relaxed font-medium">
            {t.p2}
          </p>
          <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 relative group">
            <div className="absolute top-4 right-4 text-slate-200 group-hover:text-blue-200 transition-colors">
              <Gavel size={48} />
            </div>
            <p className="text-lg text-slate-700 font-medium italic relative z-10 leading-relaxed">
              {t.p3}
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center mb-4">
                <Scale size={20} />
              </div>
              <h4 className="font-black text-slate-900 mb-2">{t.legacy_h}</h4>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">{t.legacy_p}</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
                <BarChart3 size={20} />
              </div>
              <h4 className="font-black text-slate-900 mb-2">{t.advantage_h}</h4>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">{t.advantage_p}</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 space-y-8">
          <div className="bg-slate-900 text-white p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden flex flex-col justify-center min-h-[400px]">
            <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
              <Bot size={200} />
            </div>
            <h3 className="text-3xl font-black mb-6 relative z-10 tracking-tight leading-none">{t.h3}</h3>
            <p className="text-lg opacity-80 leading-relaxed mb-10 relative z-10 font-medium">
              {t.p4}
            </p>
            <div className="space-y-4 relative z-10">
              <button 
                onClick={() => setActiveModal('ai_synthesis')}
                className="w-full flex items-center gap-4 bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-md hover:bg-white/10 hover:border-blue-500/50 transition-all text-left active:scale-[0.98] group"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center group-hover:shadow-[0_0_15px_rgba(37,99,235,0.5)] transition-all shrink-0"><BrainCircuit size={20} /></div>
                <div className="flex-1">
                  <p className="text-[10px] font-black uppercase tracking-widest leading-none">AI Data Synthesis</p>
                  <p className="text-[8px] font-bold text-slate-500 mt-1 uppercase tracking-wider">Expand Intel</p>
                </div>
              </button>
              <button 
                onClick={() => setActiveModal('attorney_oversight')}
                className="w-full flex items-center gap-4 bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-md hover:bg-white/10 hover:border-red-500/50 transition-all text-left active:scale-[0.98] group"
              >
                <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center group-hover:shadow-[0_0_15px_rgba(220,38,38,0.5)] transition-all shrink-0"><Users size={20} /></div>
                <div className="flex-1">
                  <p className="text-[10px] font-black uppercase tracking-widest leading-none">Attorney Oversight</p>
                  <p className="text-[8px] font-bold text-slate-500 mt-1 uppercase tracking-wider">Expert Protocol</p>
                </div>
              </button>
            </div>
          </div>

          {/* Phone CTA Block */}
          <div className={`${firm.primaryColor} p-10 rounded-3xl text-white text-center space-y-4 shadow-2xl animate-in zoom-in-95 delay-300`}>
            <h4 className="text-3xl font-black leading-tight tracking-tight">{t.cta_h}</h4>
            <p className="text-sm opacity-90 font-medium mb-4">{t.cta_sub}</p>
            <a href={`tel:${firm.phone}`} className="w-full inline-flex items-center justify-center gap-3 bg-white text-slate-900 px-8 py-5 rounded-xl font-black text-xl hover:scale-[1.02] transition-transform shadow-xl active:scale-95">
              <Phone size={24} fill="currentColor" /> {t.cta_btn}
            </a>
          </div>

          {/* Website CTA Block (Restyled to match Phone CTA Block) */}
          <div className="bg-slate-100 p-10 rounded-3xl text-slate-900 text-center space-y-6 shadow-xl border border-slate-200">
            <div className="space-y-2">
              <h4 className="text-2xl font-black tracking-tight">{t.resource_h}</h4>
              <p className="text-sm text-slate-500 font-medium">{t.resource_p}</p>
            </div>
            
            <a 
              href={firm.website} 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-3 bg-slate-900 text-white px-8 py-5 rounded-xl font-black text-xl hover:scale-[1.02] transition-transform shadow-xl active:scale-95 uppercase tracking-tight"
            >
              {firm.websiteDisplay} <ExternalLink size={20} className="opacity-60" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutViews;
