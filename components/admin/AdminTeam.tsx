
import React from 'react';
import { Save, Camera, Plus } from 'lucide-react';
import { AttorneyProfile } from '../../types';

interface Props {
  team: AttorneyProfile[];
  onUpdateName: (idx: number, name: string) => void;
  onUpdateTitle: (idx: number, title: string) => void;
  onUploadPhoto: (idx: number, e: React.ChangeEvent<HTMLInputElement>) => void;
  onSave: () => void;
}

const AdminTeam: React.FC<Props> = ({ team, onUpdateName, onUpdateTitle, onUploadPhoto, onSave }) => {
  return (
    <div className="space-y-8 animate-in slide-in-from-right-8 duration-500">
       <header className="flex flex-col sm:flex-row justify-between sm:items-end gap-6 mb-8">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400 mb-2">Personnel Management</p>
            <h2 className="text-4xl font-black tracking-tighter text-white">Legal Team Configuration</h2>
          </div>
          <button 
            onClick={onSave}
            className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg transition-all w-full sm:w-auto"
          >
            <Save size={18} /> Push Updates
          </button>
       </header>

       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: Math.min(6, team.length + 1) }).map((_, idx) => {
            const member = team[idx];
            return (
              <div key={idx} className="bg-slate-900 border border-white/5 p-8 rounded-2xl flex flex-col items-center gap-6 group transition-all hover:border-blue-500/50 shadow-2xl">
                 <div className="relative">
                    <div className={`w-32 h-32 rounded-xl overflow-hidden bg-slate-800 border-2 border-dashed border-slate-700 flex items-center justify-center transition-all ${member?.photoData ? 'border-solid border-blue-600 shadow-2xl' : ''}`}>
                       {member?.photoData ? (
                         <img src={member.photoData} alt="Profile" className="w-full h-full object-cover" />
                       ) : (
                         <Plus size={32} className="text-slate-600 group-hover:text-blue-500 transition-colors" />
                       )}
                    </div>
                    <label className="absolute -bottom-2 -right-2 bg-blue-600 p-3 rounded-xl text-white cursor-pointer hover:scale-110 transition-transform shadow-lg">
                      <Camera size={18} />
                      <input type="file" className="hidden" accept="image/*" onChange={(e) => onUploadPhoto(idx, e)} />
                    </label>
                 </div>
                 <div className="w-full space-y-4">
                    <input 
                      type="text" placeholder="Name" value={member?.name || ''} 
                      onChange={(e) => onUpdateName(idx, e.target.value)}
                      className="w-full bg-slate-950 border border-white/10 rounded-xl px-5 py-4 font-bold text-white outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                    />
                    <input 
                      type="text" placeholder="Title" value={member?.title || ''} 
                      onChange={(e) => onUpdateTitle(idx, e.target.value)}
                      className="w-full bg-slate-950 border border-white/10 rounded-xl px-5 py-3 text-xs font-bold text-slate-400 outline-none"
                    />
                 </div>
              </div>
            );
          })}
       </div>
    </div>
  );
};

export default AdminTeam;
