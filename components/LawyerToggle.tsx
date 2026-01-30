
import React from 'react';
import { FirmId } from '../types';
import { FIRMS } from '../constants';
import { Users } from 'lucide-react';

interface LawyerToggleProps {
  currentFirmId: FirmId;
  onToggle: (id: FirmId) => void;
}

const LawyerToggle: React.FC<LawyerToggleProps> = ({ currentFirmId, onToggle }) => {
  return (
    <div className="flex bg-white rounded-full p-1 shadow-inner border border-slate-200">
      <button
        onClick={() => onToggle('hernandez')}
        className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
          currentFirmId === 'hernandez' 
            ? 'bg-slate-900 text-white shadow-md' 
            : 'text-slate-500 hover:text-slate-800'
        }`}
      >
        Juan Hernandez
      </button>
      <button
        onClick={() => onToggle('gregg')}
        className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
          currentFirmId === 'gregg' 
            ? 'bg-red-800 text-white shadow-md' 
            : 'text-slate-500 hover:text-slate-800'
        }`}
      >
        Robert S. Gregg
      </button>
    </div>
  );
};

export default LawyerToggle;
