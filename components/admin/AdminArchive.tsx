
import React, { useState } from 'react';
import { Archive, RefreshCcw, Trash2, Search, Filter, Mail, FileText, MessageSquare, Calculator, Trash } from 'lucide-react';
import { ArchivedItem } from '../../types';
import DeleteConfirmationModal from './DeleteConfirmationModal';

interface Props {
  archive: ArchivedItem[];
  onRecover: (id: string) => void;
  onDelete: (id: string) => void;
  onClearAll: () => void;
}

const TYPE_ICONS: Record<string, React.ReactNode> = {
  inbox: <Mail size={16} />,
  evidence: <FileText size={16} />,
  chats: <MessageSquare size={16} />,
  calc_leads: <Calculator size={16} />
};

const AdminArchive: React.FC<Props> = ({ archive, onRecover, onDelete, onClearAll }) => {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  if (archive.length === 0) {
    return (
      <div className="py-32 text-center bg-slate-900 rounded-3xl border border-white/5">
        <Archive className="mx-auto mb-4 text-slate-800" size={64} />
        <h3 className="text-xl font-black text-slate-500">The vault is empty.</h3>
        <p className="text-slate-600 text-xs font-bold uppercase tracking-widest mt-2 text-balance">Archived leads and evidence will appear here for recovery or purging.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in slide-in-from-right-8 duration-500">
      <header className="flex flex-col sm:flex-row justify-between sm:items-end gap-6 mb-8">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400 mb-2">Vault Command</p>
          <h2 className="text-4xl font-black tracking-tighter text-white">Lead Archive</h2>
        </div>
        <button 
          onClick={() => setShowClearConfirm(true)}
          className="bg-red-900/20 hover:bg-red-900/40 text-red-500 px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 border border-red-500/20 transition-all"
        >
          <Trash size={16} /> WIPE ARCHIVE VAULT
        </button>
      </header>

      <div className="grid grid-cols-1 gap-4">
        {archive.map((item) => (
          <div key={item.id} className="bg-slate-900 border border-white/5 p-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-6 group hover:border-blue-500/30 transition-all">
            <div className="flex items-center gap-4 w-full sm:w-auto">
               <div className="p-3 bg-slate-800 rounded-xl text-slate-500">
                  {TYPE_ICONS[item.type]}
               </div>
               <div>
                  <div className="flex items-center gap-3">
                    <h4 className="font-black text-slate-100">{item.data.name || item.data.subject || 'Legacy Record'}</h4>
                    <span className="text-[8px] font-black bg-slate-800 text-slate-500 px-2 py-0.5 rounded tracking-widest uppercase">{item.type}</span>
                  </div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Archived {new Date(item.archivedAt).toLocaleString()}</p>
               </div>
            </div>
            
            <div className="flex items-center gap-2 w-full sm:w-auto">
               <button 
                 onClick={() => onRecover(item.id)}
                 className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 rounded-xl font-black text-[10px] uppercase tracking-widest border border-blue-600/20 transition-all"
               >
                 <RefreshCcw size={14} /> RECOVER
               </button>
               <button 
                 onClick={() => setDeleteId(item.id)}
                 className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 hover:bg-red-600/10 text-slate-600 hover:text-red-400 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all"
               >
                 <Trash2 size={14} /> PURGE
               </button>
            </div>
          </div>
        ))}
      </div>

      <DeleteConfirmationModal 
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => { if (deleteId) onDelete(deleteId); setDeleteId(null); }}
        message="This will permanently destroy this archived record. It cannot be recovered once this cycle completes."
      />

      <DeleteConfirmationModal 
        isOpen={showClearConfirm}
        onClose={() => setShowClearConfirm(false)}
        onConfirm={() => { onClearAll(); setShowClearConfirm(false); }}
        title="WIPE ENTIRE ARCHIVE"
        message="DANGER: This will permanently purge EVERY record in the archive vault. This is a irreversible command."
      />
    </div>
  );
};

export default AdminArchive;
