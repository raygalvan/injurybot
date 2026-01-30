
import React, { useState, useMemo } from 'react';
import { X, ShieldCheck, FileText, CheckCircle2, Lock, Scale, Info, Check } from 'lucide-react';
// Import Language to fix typing errors
import { FirmBranding, Language } from '../types';

export type ConsentPayload = {
  consentVersion: string;
  signatureName: string;
  contactByText: boolean;
  checks: {
    voluntaryUpload: boolean;
    noRelationship: boolean;
    eCommsRisk: boolean;
  };
};

interface ConsentModalProps {
  open: boolean;
  firm: FirmBranding;
  // Added language to fix prop mismatch in EvidenceAnalyzer.tsx
  language: Language;
  onCancel: () => void;
  onAccept: (payload: ConsentPayload) => void;
}

const ConsentModal: React.FC<ConsentModalProps> = ({ open, firm, language, onCancel, onAccept }) => {
  const [c1, setC1] = useState(false);
  const [c2, setC2] = useState(false);
  const [c3, setC3] = useState(false);
  const [sms, setSms] = useState(false);
  const [sig, setSig] = useState("");

  const today = useMemo(() => {
    return new Date().toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
  }, []);

  const canContinue = c1 && c2 && c3 && sig.trim().length >= 4;

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/80 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="bg-white w-full sm:max-w-2xl h-full sm:h-auto sm:max-h-[90vh] rounded-none sm:rounded-3xl flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-bottom sm:zoom-in-95 duration-500">
        
        {/* FIXED HEADER */}
        <div className="bg-slate-900 p-6 sm:p-8 text-white relative shrink-0 z-10">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <ShieldCheck size={100} />
          </div>
          <button 
            onClick={onCancel}
            className="absolute top-6 right-6 p-2 text-slate-400 hover:text-white transition-colors"
            aria-label="Close"
          >
            <X size={24} />
          </button>
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-blue-600 p-1.5 rounded-lg">
              <Lock size={16} className="text-white" />
            </div>
            <p className="text-[9px] font-black uppercase tracking-[0.4em] text-blue-400">Secure Protocol v1.0</p>
          </div>
          <h2 className="text-xl sm:text-3xl font-black tracking-tighter">Medical Data Consent</h2>
          <p className="text-slate-400 text-xs sm:text-sm font-medium">Please authorize before uploading sensitive records.</p>
        </div>

        {/* SCROLLABLE BODY */}
        <div className="flex-1 overflow-y-auto overscroll-contain p-5 sm:p-10 space-y-6 sm:space-y-8 bg-white touch-pan-y no-scrollbar">
          <div className="space-y-4">
            <div className="bg-slate-50 p-5 rounded-xl border border-slate-100">
              <h4 className="text-[9px] font-black uppercase text-slate-400 tracking-widest mb-2 flex items-center gap-2">
                <FileText size={12} /> Voluntary Disclosure
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                You are voluntarily providing documents to <strong>{firm.firmName}</strong>. 
                You authorize the firm to review these materials to evaluate your potential claim.
              </p>
            </div>

            <div className="bg-slate-50 p-5 rounded-xl border border-slate-100">
              <h4 className="text-[9px] font-black uppercase text-slate-400 tracking-widest mb-2 flex items-center gap-2">
                <Scale size={12} /> No Relationship Established
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                Uploading documents does <strong>not</strong> create an attorney-client relationship until a written agreement is signed.
              </p>
            </div>

            <div className="bg-slate-50 p-5 rounded-xl border border-slate-100">
              <h4 className="text-[9px] font-black uppercase text-slate-400 tracking-widest mb-2 flex items-center gap-2">
                <Info size={12} /> Retention Policy
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                Uploaded documents are auto-deleted after <strong>5 days</strong> unless a formal case is opened.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {[
              { checked: c1, set: setC1, label: <>I authorize <b>{firm.firmName}</b> to securely store and review my medical evidence.</> },
              { checked: c2, set: setC2, label: <>I understand this does not create a formal attorney-client relationship.</> },
              { checked: c3, set: setC3, label: <>I consent to secure electronic communications and acknowledge risks.</> }
            ].map((item, idx) => (
              <button 
                key={idx}
                type="button"
                onClick={() => item.set(!item.checked)}
                className={`w-full flex items-start gap-4 p-4 rounded-xl border text-left transition-all group ${item.checked ? 'bg-blue-50 border-blue-600/30' : 'bg-white border-slate-200 hover:border-slate-300'}`}
              >
                <div className={`mt-0.5 shrink-0 w-6 h-6 border-2 rounded-md flex items-center justify-center transition-all ${item.checked ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300 bg-white'}`}>
                  {item.checked && <Check size={18} strokeWidth={4} />}
                </div>
                <span className={`text-xs font-bold leading-tight ${item.checked ? 'text-blue-900' : 'text-slate-700'}`}>
                  {item.label}
                </span>
              </button>
            ))}
          </div>

          <div className="pt-2">
            <div className="bg-slate-900 p-5 sm:p-6 rounded-2xl text-white">
              <label className="block mb-3">
                <span className="text-[9px] font-black uppercase text-blue-400 tracking-[0.2em] block mb-2">Electronic Signature</span>
                <input 
                  value={sig} 
                  onChange={(e) => setSig(e.target.value)} 
                  placeholder="Type Full Legal Name" 
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3.5 font-bold text-white placeholder:text-white/30 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-base"
                />
              </label>
              <div className="flex justify-between items-center text-[8px] font-black uppercase tracking-widest opacity-50">
                <span>Timestamp: {today}</span>
                <span>Portal ID: HLX-TR-2024</span>
              </div>
            </div>
          </div>
        </div>

        {/* FIXED FOOTER */}
        <div className="p-4 sm:p-8 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row gap-3 sm:gap-4 shrink-0 z-10">
          <button 
            type="button"
            onClick={onCancel}
            className="order-2 sm:order-1 flex-1 py-4 rounded-xl font-black text-sm text-slate-500 hover:bg-slate-200 transition-colors uppercase tracking-widest active:scale-95"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!canContinue}
            onClick={() => onAccept({
              consentVersion: "1.0",
              signatureName: sig,
              contactByText: sms,
              checks: { voluntaryUpload: true, noRelationship: true, eCommsRisk: true }
            })}
            className="order-1 sm:order-2 flex-2 sm:flex-[2] bg-blue-600 text-white py-4 rounded-xl font-black text-sm uppercase tracking-widest shadow-xl shadow-blue-200/50 hover:opacity-95 transition-all disabled:opacity-30 disabled:shadow-none active:scale-95"
          >
            Authorize and Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConsentModal;
