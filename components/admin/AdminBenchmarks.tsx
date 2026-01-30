
import React, { useState } from 'react';
import { Plus, Trash2, Sparkles, Filter } from 'lucide-react';
import { SettlementBenchmark } from '../../types';

interface Props {
  benchmarks: SettlementBenchmark[];
  newAward: { injuryId: string; text: string };
  setNewAward: (val: any) => void;
  onAdd: () => void;
  onDelete: (id: string) => void;
}

const AdminBenchmarks: React.FC<Props> = ({ benchmarks, newAward, setNewAward, onAdd, onDelete }) => {
  const [filterId, setFilterId] = useState<string>('all');

  const categories = [
    { id: 'death', label: 'Wrongful Death' },
    { id: 'tbi', label: 'Traumatic Brain (TBI)' },
    { id: 'spinal', label: 'Spinal Cord Injury' },
    { id: 'fracture', label: 'Severe Fractures' },
    { id: 'burns', label: 'Severe Burns' },
    { id: 'back', label: 'Back & Neck Injury' },
    { id: 'amputation', label: 'Amputations' },
    { id: 'blindness', label: 'Vision Impairment' },
    { id: 'internal', label: 'Internal Organ Trauma' },
  ];

  const filteredBenchmarks = benchmarks.filter(b => 
    filterId === 'all' || b.injuryId === filterId
  );

  return (
    <div className="space-y-8 animate-in slide-in-from-right-8 duration-500">
      <header className="mb-8">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400 mb-2">Public Disclosure Manager</p>
        <h2 className="text-4xl font-black tracking-tighter text-white">Case Benchmarks</h2>
      </header>

      {/* Add New Section */}
      <div className="bg-slate-900 p-8 rounded-2xl border border-white/5 space-y-6">
        <h3 className="font-black text-xl mb-4 text-white">Add New Award/Settlement</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <select 
            value={newAward.injuryId}
            onChange={(e) => setNewAward({...newAward, injuryId: e.target.value})}
            className="bg-slate-800 border border-white/10 rounded-xl px-4 py-4 font-bold text-white outline-none cursor-pointer focus:ring-1 focus:ring-blue-500"
          >
            {categories.map(cat => (
              <option key={cat.id} value={cat.id} className="text-slate-900">{cat.label}</option>
            ))}
          </select>
          <input 
            type="text" value={newAward.text}
            onChange={(e) => setNewAward({...newAward, text: e.target.value})}
            placeholder="e.g. Harris County: $1.2M Settlement..."
            className="bg-slate-800 border border-white/10 rounded-xl px-6 py-4 font-bold text-white outline-none focus:ring-1 focus:ring-blue-500"
          />
          <button 
            onClick={onAdd}
            className="bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-black text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-lg active:scale-95"
          >
            <Plus size={18} /> Publish
          </button>
        </div>
      </div>

      {/* Filter and List Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t border-white/5">
        <div className="flex items-center gap-3">
          <h3 className="font-black text-xl text-white">Management Table</h3>
          <span className="bg-slate-800 text-slate-400 text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-widest">
            {filteredBenchmarks.length} Records
          </span>
        </div>
        
        <div className="flex items-center gap-3 bg-slate-900 p-2 rounded-xl border border-white/5">
          <div className="text-blue-400 pl-2"><Filter size={16} /></div>
          <select 
            value={filterId}
            onChange={(e) => setFilterId(e.target.value)}
            className="bg-transparent border-none font-bold text-xs text-white outline-none cursor-pointer pr-4"
          >
            <option value="all" className="text-slate-900">View All Categories</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id} className="text-slate-900">{cat.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Benchmark Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredBenchmarks.length > 0 ? (
          filteredBenchmarks.sort((a, b) => {
            // Sort by demo status then by date
            if (a.isDemo !== b.isDemo) return a.isDemo ? 1 : -1;
            return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
          }).map((b) => (
            <div key={b.id} className={`bg-slate-900 border ${b.isDemo ? 'border-yellow-500/20' : 'border-white/5'} p-6 rounded-xl flex justify-between items-center group relative overflow-hidden transition-all hover:border-blue-500/30`}>
              {b.isDemo && (
                <div className="absolute top-0 right-0 p-1 bg-yellow-500 text-slate-900 text-[7px] font-black px-2 uppercase tracking-tighter rounded-bl-lg flex items-center gap-1">
                  <Sparkles size={8} /> Demo data
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-[9px] font-black uppercase tracking-widest ${b.injuryId === 'death' ? 'text-red-400' : 'text-blue-400'}`}>
                    {categories.find(c => c.id === b.injuryId)?.label || b.injuryId}
                  </span>
                  <span className="text-slate-700">•</span>
                  <span className="text-[9px] font-bold text-slate-500">{new Date(b.dateAdded).toLocaleDateString()}</span>
                </div>
                <p className="font-bold text-slate-200 pr-4 truncate group-hover:whitespace-normal group-hover:overflow-visible transition-all">"{b.text}"</p>
              </div>
              <button 
                onClick={() => onDelete(b.id)} 
                className="p-2 text-slate-600 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 shrink-0"
                title="Delete Benchmark"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))
        ) : (
          <div className="col-span-full py-12 text-center bg-slate-900/50 rounded-2xl border border-dashed border-white/10">
            <p className="text-slate-500 font-bold uppercase text-xs tracking-widest">No benchmarks found for this category.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminBenchmarks;
