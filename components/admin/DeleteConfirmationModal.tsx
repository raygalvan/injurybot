
import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({ 
  isOpen, onClose, onConfirm, 
  title = "PERMANENT DELETION", 
  message = "This action is final and cannot be undone. All data associated with this record will be purged from the system servers immediately." 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[400] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-red-500/30 w-full max-w-md rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(239,68,68,0.2)] animate-in zoom-in-95 duration-300">
        <div className="bg-red-600/10 p-8 text-center space-y-6">
           <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(220,38,38,0.5)]">
              <AlertTriangle size={40} className="text-white animate-pulse" />
           </div>
           <div className="space-y-2">
              <h3 className="text-2xl font-black text-white tracking-tighter uppercase">{title}</h3>
              <p className="text-red-200/60 text-sm font-bold uppercase tracking-widest">Visual Safety Warning Protocol</p>
           </div>
           <p className="text-slate-300 font-medium leading-relaxed bg-slate-950/50 p-6 rounded-2xl border border-white/5 italic">
             "{message}"
           </p>
        </div>
        <div className="p-6 bg-slate-950 flex flex-col gap-3">
           <button 
             onClick={onConfirm}
             className="w-full py-5 bg-red-600 hover:bg-red-500 text-white rounded-2xl font-black text-lg flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl shadow-red-900/20"
           >
             <Trash2 size={24} /> YES, PURGE DATA
           </button>
           <button 
             onClick={onClose}
             className="w-full py-4 text-slate-500 hover:text-white font-black text-xs uppercase tracking-widest transition-colors"
           >
             CANCEL AND RETAIN RECORD
           </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
