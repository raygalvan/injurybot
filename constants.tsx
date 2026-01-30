
import React from 'react';
import { FirmBranding, BodyPart, ConductType, AttorneyProfile } from './types';
import { Activity, Layers, User, Skull, Ban, Scale, ShieldAlert, Gavel, Zap, Eye, Crosshair, Scissors, Thermometer, Brain, HeartPulse, ShieldCheck, Waves, Wind, Droplets } from 'lucide-react';

export const FIRMS: Record<string, FirmBranding> = {
  gregg: {
    id: 'gregg',
    firmName: "Law Offices of Robert S. Gregg",
    attorney: "Robert S. Gregg",
    phone: "214-559-3444",
    website: "https://gregglawdallas.com",
    websiteDisplay: "gregglawdallas.com",
    primaryColor: "bg-red-800",
    secondaryColor: "text-slate-100",
    logoColor: "text-white",
    tagline: "Fighting for the Injured Since 1989"
  }
};

export const INITIAL_TEAM: AttorneyProfile[] = [
  { id: 'rg', name: 'ROBERT S. GREGG', title: 'Managing Partner', initials: 'RG' },
];

export const BODY_PARTS: BodyPart[] = [
  { 
    id: 'none', 
    label: { en: 'No Injury', es: 'Sin Lesiones' }, 
    description: { 
      en: 'Claims strictly for property damage to your vehicle or assets with no reported bodily harm.', 
      es: 'Reclamos estrictamente por daños a la propiedad sin daño corporal.' 
    },
    boost: 0.0 
  },
  { 
    id: 'sprains', 
    label: { en: 'Sprains & Strains', es: 'Esguinces y Distensiones' }, 
    description: { 
      en: 'Represents: ligament sprains (ankle, knee, wrist) and muscle or tendon strains (neck, back, shoulder, hamstring). Typical “pulled muscle,” “whiplash-type strain,” mild tear or overstretch without fracture.', 
      es: 'Representa: esguinces de ligamentos y distensiones musculares. El típico "músculo tirado" sin fractura.' 
    },
    boost: 1.1 
  },
  { 
    id: 'scrapes', 
    label: { en: 'Scrapes & Scratches', es: 'Raspaduras y Arañazos' }, 
    description: { 
      en: 'Represents: superficial skin injuries, including abrasions (road rash), minor cuts/lacerations that usually do not require significant repair, and shallow punctures with routine wound care. Primary issue is skin damage, not deep tissue.', 
      es: 'Representa: lesiones cutáneas superficiales, incluyendo raspaduras, cortes menores y pinchazos superficiales.' 
    },
    boost: 0.8 
  },
  { 
    id: 'swelling', 
    label: { en: 'Swelling & Soreness', es: 'Hinchazón y Dolor' }, 
    description: { 
      en: 'Represents: contusions (bruising), localized inflammation, tenderness, stiffness, and minor aggravations of joints or soft tissue that do not clearly fit a sprain/strain. Often documented as “contusion,” “soft-tissue injury,” “inflammation,” “bursitis/tendonitis,” or “general soreness” with limited range of motion.', 
      es: 'Representa: contusiones (moretones), inflamación localizada, rigidez y dolor de los tejidos blandos.' 
    },
    boost: 0.9 
  },
];

export const CONDUCT_TYPES: ConductType[] = [
  { 
    id: 'standard', 
    label: { en: 'Ordinary Negligence', es: 'Negligencia Ordinaria' }, 
    description: {
      en: 'The most common standard; it means the person failed to use reasonable care that an ordinary person would have used.',
      es: 'El estándar más común; significa que la persona no utilizó el cuidado razonable que habría utilizado una persona común.'
    },
    multiplier: 2.5 
  },
  { 
    id: 'gross', 
    label: { en: 'Gross Negligence', es: 'Negligencia Grave' }, 
    description: {
      en: 'A higher level of fault where the person showed an extreme lack of care or a conscious indifference to the safety of others.',
      es: 'Un mayor nivel de culpa en el que la persona mostró una falta extrema de cuidado o una indiferencia consciente hacia la seguridad de los demás.'
    },
    multiplier: 4.0 
  },
  { 
    id: 'intentional', 
    label: { en: 'Intentional Conduct', es: 'Conducta Intencional' }, 
    description: {
      en: 'Deliberate and willful actions where the party specifically intended to cause harm or knew injury was likely to occur.',
      es: 'Acciones deliberadas y voluntarias en las que la parte tenía la intención específica de causar daño o sabía que era probable que se produjera una lesión.'
    },
    multiplier: 4.8 
  },
];

export const BODY_PART_ICONS: Record<string, React.ReactNode> = {
  none: <Ban size={20} />,
  sprains: <Waves size={20} />,
  scrapes: <Wind size={20} />,
  swelling: <Droplets size={20} />,
};

export const CONDUCT_ICONS: Record<string, React.ReactNode> = {
  standard: <Scale size={20} />,
  gross: <ShieldAlert size={20} />,
  intentional: <Gavel size={20} />,
};

export const SERIOUS_INJURY_ICONS: Record<string, React.ReactNode> = {
  tbi: <Brain size={18} />,
  spinal: <Crosshair size={18} />,
  fracture: <Activity size={18} />,
  burns: <Thermometer size={18} />,
  back: <Layers size={18} />,
  amputation: <Scissors size={18} />,
  blindness: <Eye size={18} />,
  internal: <ShieldCheck size={18} />,
};
