
import React, { useState, useEffect } from 'react';
import { LeadData, FirmBranding, Language } from '../types';
import { Send, CheckCircle, X, Loader2, Check, Shield } from 'lucide-react';
import { MockDB } from '../services/storage';

interface IntakeFormProps {
  firm: FirmBranding;
  language: Language;
}

const IntakeForm: React.FC<IntakeFormProps> = ({ firm, language }) => {
  const initialFormState: LeadData = {
    name: '',
    phone: '',
    email: '',
    caseType: 'Car Accident',
    incidentDate: '',
    description: ''
  };

  const [formData, setFormData] = useState<LeadData>(initialFormState);
  const [agreedToDisclosure, setAgreedToDisclosure] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const FORMSPREE_ENDPOINT = "https://formspree.io/f/mwvolqkk";

  // Auto-dismiss the success popup and ensure form is ready for a new lead
  useEffect(() => {
    if (submitted) {
      const timer = setTimeout(() => {
        setSubmitted(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [submitted]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || !agreedToDisclosure) return;

    setIsSubmitting(true);

    try {
      // 1. Instant Local Persistence
      MockDB.saveMessage({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        method: 'Web Portal',
        message: `[CASE TYPE: ${formData.caseType}] | INCIDENT DATE: ${formData.incidentDate} | DETAILS: ${formData.description}`
      });

      // 2. TRIGGER INSTANT UI FEEDBACK
      setSubmitted(true);
      const currentSubmissionData = { ...formData };
      setFormData(initialFormState);
      setAgreedToDisclosure(false);
      setIsSubmitting(false);

      // 3. Background external submission
      fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          source: "injury.bot",
          firmName: firm.firmName,
          language: language,
          ...currentSubmissionData,
          submittedAt: new Date().toISOString(),
        }),
      }).catch(err => console.error("Background submission failed:", err));

    } catch (err) {
      console.error("Local save error:", err);
      setIsSubmitting(false);
      setSubmitted(true);
    }
  };

  const t = {
    title: language === 'en' ? "Legal Intake Portal" : "Portal de Entrada Legal",
    sub: language === 'en' ? "Securely submit your case details for a free evaluation." : "Envíe de forma segura los detalles de su caso para una evaluación gratuita.",
    fullName: language === 'en' ? "Full Name" : "Nombre Completo",
    phone: language === 'en' ? "Phone Number" : "Número de Teléfono",
    email: language === 'en' ? "Email Address" : "Correo Electrónico",
    date: language === 'en' ? "Incident Date" : "Fecha del Incidente",
    desc: language === 'en' ? "Case Description" : "Descripción del Caso",
    placeholder: language === 'en' ? "Tell us about your accident..." : "Cuéntenos sobre su accidente...",
    button: language === 'en' ? "SEND SECURE INQUIRY" : "ENVIAR CONSULTA SEGURA",
    received: language === 'en' ? "Message Sent" : "Mensaje Enviado",
    successMsg: language === 'en' 
      ? `Your details have been securely routed to ${firm.firmName}. A specialist will contact you shortly.`
      : `Sus datos han sido enviados de forma segura a ${firm.firmName}. Un especialista se pondrá en contacto con usted en breve.`,
    disclosure: language === 'en' 
      ? "I understand that submitting this form does not create an attorney-client relationship. I acknowledge that the information provided is for evaluation purposes only."
      : "Entiendo que el envío de este formulario no crea una relación abogado-cliente. Reconozco que la información proporcionada es solo para fines de evaluación."
  };

  return (
    <div className="relative">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
        <div className={`${firm.primaryColor} p-8 text-white`}>
          <div className="flex items-center gap-3 mb-2">
            <Shield size={24} className="opacity-50" />
            <h2 className="text-3xl font-black">{t.title}</h2>
          </div>
          <p className="opacity-80 text-sm font-medium">{t.sub}</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{t.fullName}</label>
              <input 
                required
                disabled={isSubmitting}
                type="text" 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-base font-bold text-slate-900 focus:ring-2 focus:ring-slate-900 outline-none transition-all disabled:opacity-50"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{t.phone}</label>
              <input 
                required
                disabled={isSubmitting}
                type="tel" 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-base font-bold text-slate-900 focus:ring-2 focus:ring-slate-900 outline-none transition-all disabled:opacity-50"
                value={formData.phone}
                onChange={e => setFormData({...formData, phone: e.target.value})}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{t.email}</label>
              <input 
                required
                disabled={isSubmitting}
                type="email" 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-base font-bold text-slate-900 focus:ring-2 focus:ring-slate-900 outline-none transition-all disabled:opacity-50"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{t.date}</label>
              <input 
                required
                disabled={isSubmitting}
                type="date" 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-base font-bold text-slate-900 focus:ring-2 focus:ring-slate-900 outline-none transition-all disabled:opacity-50"
                value={formData.incidentDate}
                onChange={e => setFormData({...formData, incidentDate: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{t.desc}</label>
            <textarea 
              required
              disabled={isSubmitting}
              rows={4}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-base font-bold text-slate-900 focus:ring-2 focus:ring-slate-900 outline-none resize-none transition-all disabled:opacity-50"
              placeholder={t.placeholder}
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
            />
          </div>

          {/* New Disclosure Checkbox */}
          <div 
            onClick={() => setAgreedToDisclosure(!agreedToDisclosure)}
            className={`flex items-start gap-4 p-5 rounded-2xl border-2 transition-all cursor-pointer group ${agreedToDisclosure ? 'bg-blue-50 border-blue-600/30' : 'bg-slate-50 border-slate-100 hover:border-slate-300'}`}
          >
            <div className={`mt-0.5 shrink-0 w-6 h-6 border-2 rounded-md flex items-center justify-center transition-all ${agreedToDisclosure ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300 bg-white'}`}>
              {agreedToDisclosure && <Check size={18} strokeWidth={4} />}
            </div>
            <p className={`text-xs font-bold leading-relaxed ${agreedToDisclosure ? 'text-blue-900' : 'text-slate-500'}`}>
              {t.disclosure}
            </p>
          </div>

          <button 
            type="submit"
            disabled={isSubmitting || !agreedToDisclosure}
            className={`${firm.primaryColor} text-white w-full py-5 rounded-xl font-black text-xl flex items-center justify-center gap-3 shadow-lg hover:opacity-90 transition-all active:scale-[0.99] disabled:opacity-30 disabled:grayscale disabled:cursor-not-allowed`}
          >
            {isSubmitting ? (
              <Loader2 className="animate-spin" size={24} />
            ) : (
              <Send size={22} />
            )} 
            {isSubmitting ? 'PROCESSING...' : t.button}
          </button>
        </form>
      </div>

      {/* Success Popup */}
      {submitted && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl p-10 text-center shadow-2xl animate-in zoom-in-95 border border-slate-100 relative">
            <button 
              onClick={() => setSubmitted(false)}
              className="absolute top-6 right-6 text-slate-300 hover:text-slate-900 transition-colors"
            >
              <X size={20} />
            </button>
            <div className="bg-green-100 text-green-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-100">
              <CheckCircle size={40} />
            </div>
            <h3 className="text-3xl font-black text-slate-900 mb-2 text-balance">{t.received}</h3>
            <p className="text-slate-500 font-medium">
              {t.successMsg}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default IntakeForm;
