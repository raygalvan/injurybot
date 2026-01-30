import React from 'react';
import { Save, Type, ImageIcon, Camera, MapPin, Plus, Trash2, Palette, Check, Bot } from 'lucide-react';
import { FirmBranding } from '../../types';

interface Props {
  brandingState: FirmBranding;
  setBrandingState: (val: FirmBranding) => void;
  onSave: () => void;
  handleLogoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const THEMES = [
  { id: 'slate_onyx', label: 'Slate Onyx', desc: 'BG-SLATE-900 / TEXT-YELLOW-400', primary: 'bg-slate-900', secondary: 'text-yellow-400' },
  { id: 'law_red', label: 'Law Red', desc: 'BG-RED-800 / TEXT-WHITE', primary: 'bg-red-800', secondary: 'text-white' },
  { id: 'corporate_navy', label: 'Corporate Navy', desc: 'BG-BLUE-900 / TEXT-BLUE-200', primary: 'bg-blue-900', secondary: 'text-blue-200' },
  { id: 'justice_green', label: 'Justice Green', desc: 'BG-EMERALD-900 / TEXT-EMERALD-200', primary: 'bg-emerald-900', secondary: 'text-emerald-200' },
  { id: 'gold_black', label: 'Gold & Black', desc: 'BG-BLACK / TEXT-YELLOW-500', primary: 'bg-black', secondary: 'text-yellow-500' },
];

// Helper component for form labels with consistent styling, moved outside to resolve children prop typing issues
const Label: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <label className="block text-[10px] font-black uppercase text-slate-500 tracking-[0.2em] mb-2 ml-1">{children}</label>
);

const AdminBranding: React.FC<Props> = ({ brandingState, setBrandingState, onSave, handleLogoUpload }) => {
  const addOffice = () => {
    const newOffice = { id: Math.random().toString(36).substr(2, 9), name: 'NEW OFFICE', details: 'Address and Contacts...' };
    setBrandingState({ ...brandingState, offices: [...(brandingState.offices || []), newOffice] });
  };

  const removeOffice = (id: string) => {
    setBrandingState({ ...brandingState, offices: (brandingState.offices || []).filter(o => o.id !== id) });
  };

  const updateOffice = (id: string, field: 'name' | 'details', val: string) => {
    const offices = (brandingState.offices || []).map(o => o.id === id ? { ...o, [field]: val } : o);
    setBrandingState({ ...brandingState, offices });
  };

  return (
    <div className="space-y-12 animate-in slide-in-from-right-8 duration-500 max-w-5xl">
       <header className="flex flex-col sm:flex-row justify-between sm:items-end gap-6 mb-8">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400 mb-2">Visual Interface</p>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-white">Branding & Rebranding</h2>
          </div>
          <button onClick={onSave} className="bg-emerald-600 hover:bg-emerald-500 text-white px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl transition-all w-full sm:w-auto active:scale-95">
            <Save size={20} /> APPLY VISUALS
          </button>
       </header>

       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Firm Identity Card - IMAGE 1 */}
          <div className="bg-[#0a0f1d] border border-white/5 p-8 sm:p-10 rounded-3xl space-y-8 shadow-2xl">
             <div className="flex items-center gap-4">
                <Type size={28} className="text-blue-500" />
                <h3 className="text-2xl font-black text-white tracking-tight">Firm Identity</h3>
             </div>
             <div className="space-y-6">
                <div>
                   <Label>Firm Name</Label>
                   <input type="text" value={brandingState.firmName} onChange={(e) => setBrandingState({ ...brandingState, firmName: e.target.value })} className="w-full bg-[#111827] border border-white/10 rounded-2xl px-6 py-5 font-bold text-white outline-none focus:ring-1 focus:ring-blue-500 transition-all" />
                </div>
                <div>
                   <Label>Primary Attorney</Label>
                   <input type="text" value={brandingState.attorney} onChange={(e) => setBrandingState({ ...brandingState, attorney: e.target.value })} className="w-full bg-[#111827] border border-white/10 rounded-2xl px-6 py-5 font-bold text-white outline-none focus:ring-1 focus:ring-blue-500 transition-all" />
                </div>
                <div>
                   <Label>Phone</Label>
                   <input type="tel" value={brandingState.phone} onChange={(e) => setBrandingState({ ...brandingState, phone: e.target.value })} className="w-full bg-[#111827] border border-white/10 rounded-2xl px-6 py-5 font-bold text-white outline-none focus:ring-1 focus:ring-blue-500 transition-all" />
                </div>
                <div>
                   <Label>Tagline</Label>
                   <input type="text" value={brandingState.tagline} onChange={(e) => setBrandingState({ ...brandingState, tagline: e.target.value })} className="w-full bg-[#111827] border border-white/10 rounded-2xl px-6 py-5 font-bold text-white outline-none focus:ring-1 focus:ring-blue-500 transition-all" />
                </div>
             </div>
          </div>

          <div className="space-y-8">
            {/* Custom Logo Upload - IMAGE 2 */}
            <div className="bg-[#0a0f1d] border border-white/5 p-8 sm:p-10 rounded-3xl space-y-8 shadow-2xl flex flex-col">
              <div className="flex items-center gap-4">
                  <ImageIcon size={28} className="text-blue-500" />
                  <h3 className="text-2xl font-black text-white tracking-tight">Custom Logo Upload</h3>
              </div>
              <div className="flex-1 border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center p-12 gap-4 bg-[#0a0f1d] relative overflow-hidden">
                  {brandingState.logoData ? (
                    <img src={brandingState.logoData} alt="Custom Logo" className="max-h-24 object-contain relative z-10" />
                  ) : (
                    <div className="flex flex-col items-center gap-4 text-slate-700">
                      <ImageIcon size={64} className="opacity-20" />
                      <p className="text-[10px] font-black uppercase tracking-widest">No Custom Logo</p>
                    </div>
                  )}
              </div>
              <p className="text-[11px] text-slate-500 font-medium text-center px-4 leading-relaxed">
                Upload a transparent PNG or high-quality JPG. Navigation will use this, but "injury.bot" remains the core landing signature.
              </p>
              <label className="w-full bg-blue-600 hover:bg-blue-500 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 cursor-pointer active:scale-95 transition-all shadow-lg">
                  <Camera size={20} /> UPLOAD NEW LOGO
                  <input type="file" className="hidden" accept="image/*" onChange={handleLogoUpload} />
              </label>
            </div>

            {/* Office Locations - IMAGE 2 & 3 */}
            <div className="bg-[#0a0f1d] border border-white/5 p-8 sm:p-10 rounded-3xl space-y-8 shadow-2xl">
              <div className="flex items-center gap-4">
                  <MapPin size={28} className="text-blue-500" />
                  <h3 className="text-2xl font-black text-white tracking-tight">Office Locations</h3>
              </div>
              <button onClick={addOffice} className="w-full bg-blue-600 hover:bg-blue-500 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 active:scale-95 transition-all shadow-lg">
                <Plus size={20} /> ADD OFFICE MODULE
              </button>
              <div className="space-y-4">
                {(brandingState.offices || []).map((office) => (
                  <div key={office.id} className="bg-[#111827] p-6 rounded-2xl border border-white/5 space-y-4 group relative">
                    <button onClick={() => removeOffice(office.id)} className="absolute top-6 right-6 text-slate-700 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                      <Trash2 size={18} />
                    </button>
                    <div>
                      <Label>Office Label</Label>
                      <input type="text" value={office.name} onChange={(e) => updateOffice(office.id, 'name', e.target.value)} className="bg-[#0a0f1d] border border-white/10 w-full font-black text-sm text-white focus:ring-1 focus:ring-blue-500 outline-none p-4 rounded-xl uppercase tracking-widest" />
                    </div>
                    <div>
                      <Label>Address & Contacts</Label>
                      <textarea value={office.details} onChange={(e) => updateOffice(office.id, 'details', e.target.value)} className="bg-[#0a0f1d] border border-white/10 w-full text-sm text-white font-bold resize-none h-32 outline-none p-4 rounded-xl leading-relaxed focus:ring-1 focus:ring-blue-500" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
       </div>

       {/* Color Palette - IMAGE 4 */}
       <div className="bg-[#0a0f1d] border border-white/5 p-8 sm:p-10 rounded-3xl space-y-10 shadow-2xl max-w-2xl">
          <div className="flex items-center gap-4">
             <Palette size={28} className="text-blue-500" />
             <h3 className="text-2xl font-black text-white tracking-tight">Color Palette</h3>
          </div>
          <div className="grid grid-cols-1 gap-4">
             {THEMES.map(t => (
               <button 
                 key={t.id} 
                 onClick={() => setBrandingState({ ...brandingState, themeId: t.id, primaryColor: t.primary, secondaryColor: t.secondary, logoColor: t.secondary.replace('text-', 'text-') })} 
                 className={`flex items-center justify-between p-6 rounded-2xl border transition-all text-left group ${brandingState.themeId === t.id ? 'bg-blue-600/5 border-blue-500/50 shadow-[0_0_20px_rgba(59,130,246,0.1)]' : 'bg-[#111827] border-white/5 hover:border-white/10'}`}
               >
                  <div className="flex items-center gap-6">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-105 ${t.primary} ${t.secondary}`}>
                      <Bot size={28} />
                    </div>
                    <div>
                      <h4 className="text-lg font-black text-white tracking-tight mb-0.5">{t.label}</h4>
                      <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{t.desc}</p>
                    </div>
                  </div>
                  {brandingState.themeId === t.id && (
                    <div className="bg-blue-600/20 p-2 rounded-lg">
                      <Check size={20} className="text-blue-500" />
                    </div>
                  )}
               </button>
             ))}
          </div>
       </div>
    </div>
  );
};

export default AdminBranding;