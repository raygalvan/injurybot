
import React, { useState } from 'react';
import { Trash2, Copy, Printer, Archive, Send, Loader2, CheckCircle, Ban, ChevronRight, X } from 'lucide-react';

export interface LeadActionBarProps {
  id: string;
  leadName?: string;
  leadEmail?: string;
  onDelete?: () => void;
  onArchive?: () => void;
  onPrint?: () => void;
  onCopy?: () => void;
  onReplyTrigger?: (template: 'accept' | 'reject') => void;
  primaryLabel?: string;
  primaryAction?: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
    loading?: boolean;
  };
}

const LeadActionBar: React.FC<LeadActionBarProps> = ({ 
  id, 
  leadName,
  leadEmail,
  onDelete, 
  onArchive, 
  onPrint, 
  onCopy, 
  onReplyTrigger,
  primaryLabel = "CONTACT LEAD",
  primaryAction
}) => {
  const [showOptions, setShowOptions] = useState(false);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 pt-4 border-t border-white/5">
      <div className="flex items-center gap-1 w-full sm:w-auto overflow-x-auto no-scrollbar">
        {onArchive && (
          <button onClick={onArchive} className="p-2.5 text-slate-500 hover:text-white hover:bg-white/5 rounded-xl transition-all" title="Archive">
            <Archive size={18} />
          </button>
        )}
        {onCopy && (
          <button onClick={onCopy} className="p-2.5 text-slate-500 hover:text-white hover:bg-white/5 rounded-xl transition-all" title="Copy">
            <Copy size={18} />
          </button>
        )}
        {onPrint && (
          <button onClick={onPrint} className="p-2.5 text-slate-500 hover:text-white hover:bg-white/5 rounded-xl transition-all" title="Print">
            <Printer size={18} />
          </button>
        )}
        {onDelete && (
          <button onClick={onDelete} className="p-2.5 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all" title="Delete">
            <Trash2 size={18} />
          </button>
        )}
      </div>
      
      {primaryAction ? (
        <button 
          onClick={primaryAction.onClick}
          disabled={primaryAction.loading}
          className="w-full sm:w-auto px-10 py-3 bg-blue-600 text-white rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg hover:bg-blue-500 transition-all disabled:opacity-50"
        >
          {primaryAction.loading ? <Loader2 size={16} className="animate-spin" /> : (primaryAction.icon || <Send size={16} />)}
          {primaryAction.label}
        </button>
      ) : onReplyTrigger ? (
        <div className="relative w-full sm:w-auto flex gap-2">
          {!showOptions ? (
            <button 
              onClick={() => setShowOptions(true)}
              className="w-full sm:w-auto px-10 py-3 bg-blue-600 text-white rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg hover:bg-blue-500 transition-all active:scale-95"
            >
              <Send size={16} />
              {primaryLabel}
              <ChevronRight size={14} className="ml-1 opacity-50" />
            </button>
          ) : (
            <div className="flex items-center gap-2 animate-in slide-in-from-right-4 duration-300 w-full">
              <button 
                onClick={() => { onReplyTrigger('accept'); setShowOptions(false); }}
                className="flex-1 sm:flex-none px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl shadow-emerald-900/20 active:scale-95 border border-emerald-400/30"
              >
                <CheckCircle size={14} /> ACCEPT
              </button>
              <button 
                onClick={() => { onReplyTrigger('reject'); setShowOptions(false); }}
                className="flex-1 sm:flex-none px-6 py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl shadow-red-900/20 active:scale-95 border border-red-400/30"
              >
                <Ban size={14} /> REJECT
              </button>
              <button 
                onClick={() => setShowOptions(false)}
                className="p-3 bg-slate-800 text-slate-400 hover:text-white rounded-xl transition-all border border-white/5"
              >
                <X size={16} />
              </button>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};

export default LeadActionBar;
