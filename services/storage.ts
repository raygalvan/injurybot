
import { InboxMessage, EvidenceSubmission, SettlementBenchmark, ChatTranscript, AttorneyProfile, FirmBranding, StandardCalculatorConfig, SeriousCalculatorConfig, WrongfulDeathConfig, EmailConfig, OfficeAddress, CalculatorLead, ArchivedItem } from '../types';
import { INITIAL_TEAM, BODY_PARTS, CONDUCT_TYPES } from '../constants';
import { DEMO_LEADS, DEMO_EVIDENCE, DEMO_CHATS, DEMO_CALC_LEADS } from '../demoData';

// Default prompt constants for AI features
export const DEFAULT_SYSTEM_PROMPT = `You are InjuryBot, an advanced legal intelligence protocol developed for {attorneyName}. 
Your objective is to provide professional, empathetic, and strategic triage for potential personal injury clients.

RULES:
1. Identify as InjuryBot, the firm's AI assistant.
2. If the user describes a collision or injury, emphasize the importance of medical evaluation.
3. Encourage the use of the "Evidence Hub" for multi-modal analysis of documents.
4. Do not provide binding legal advice or guarantee specific settlement amounts.
5. Be conversational and not so eager to promote or engage in legal task unless the user initiates the conversation with legal issues.
6. Engage in normal conversation when the user does not mention that they have been injured or in an accident. 
7. Mention Robert Gregg or Law Offices of Robert S. Gregg in the context of accidents and injuries or when appropriate in the conversation.  
8. Use {attorneyName}'s name when referring to the firm's leadership.`;


export const DEFAULT_ANALYZER_PROMPT = `You are an elite legal case analyzer. Your task is to review evidence and generate an executive memorandum for Robert S. Gregg.
Respond in {language}.

Structure the response with:
1. EVIDENCE COMPILATION & FINDINGS (Identify key facts from documents)
2. DISCREPANCY ANALYSIS (Contrast user testimony with official reports)
3. DAMAGES ASSESSMENT (Medical vs. Economic impact)
4. LIABILITY RATING (1-10 scale based on negligence standards)
5. STRATEGIC PLAN (Immediate next steps for the firm)`;

export const DEFAULT_SUMMARIZER_PROMPT = `Summarize the following legal chat transcript for the Law Offices of Robert S. Gregg.
Focus on identifying:
- Potential Client (PNC) contact details.
- Type of incident and primary injuries.
- Adverse party details.
- Liability indicators.

Format the output strictly as:
[PNC INFORMATION]
...
[CASE SUMMARY]
...
[STRATEGIC RECOMMENDATION]
...`;

const STORAGE_KEYS = {
  MESSAGES: 'ib_messages',
  EVIDENCE: 'ib_evidence',
  BENCHMARKS: 'ib_benchmarks',
  CHATS: 'ib_chats',
  CALC_LEADS: 'ib_calc_leads', 
  TEAM: 'ib_team_profiles',
  PROMPT_CHATBOT: 'ib_p_chatbot',
  PROMPT_ANALYZER: 'ib_p_analyzer',
  PROMPT_SUMMARIZER: 'ib_p_summarizer',
  BRANDING: 'ib_branding_v2',
  EMAIL_CONFIG: 'ib_email_config_v1',
  STANDARD_CALC: 'ib_standard_calc_v2',
  SERIOUS_CALC: 'ib_serious_calc_v2',
  DEATH_CALC: 'ib_death_calc_v1',
  ARCHIVE: 'ib_archive_v1',
  INITIALIZED: 'ib_init_v55_rebrand' // Incremented to force benchmark refresh
};

export const DEFAULT_BRANDING: FirmBranding = {
  id: 'gregg',
  firmName: "Law Offices of Robert S. Gregg",
  attorney: "Robert S. Gregg",
  phone: "214-559-3444",
  website: "https://gregglawdallas.com",
  websiteDisplay: "gregglawdallas.com",
  primaryColor: "bg-red-800",
  secondaryColor: "text-slate-100",
  logoColor: "text-white",
  tagline: "Fighting for the Injured Since 1989",
  themeId: 'law_red',
  offices: [
    { id: 'dallas_main', name: 'DALLAS OFFICE', details: '2024 Commerce St\nDallas, TX 75201\nT: (214) 559-3444' }
  ]
};

const DEFAULT_SERIOUS_CONFIG: SeriousCalculatorConfig = {
  injuries: [
    {
      id: 'tbi',
      label: 'Traumatic Brain (TBI)',
      summary: 'Neurological impairment resulting from external force.',
      tiers: [
        { label: 'Mild', edFloor: 150000, minWeight: 2.0, desc: 'Mild Traumatic Brain Injury involving concussion, post-concussive syndrome, and temporary cognitive disruption.' },
        { label: 'Moderate', edFloor: 500000, minWeight: 4.0, desc: 'Moderate Traumatic Brain Injury with documented loss of consciousness, persistent cognitive deficits, and personality alterations.' },
        { label: 'Severe', edFloor: 1500000, minWeight: 7.0, desc: 'Catastrophic Traumatic Brain Injury resulting in permanent cognitive impairment, motor dysfunction, or persistent vegetative state.' }
      ]
    },
    {
      id: 'spinal',
      label: 'Spinal Cord Injury',
      summary: 'Damage to the spinal cord or nerves.',
      tiers: [
        { label: 'Herniation', edFloor: 75000, minWeight: 1.5, desc: 'Lumbar or Cervical disc herniation requiring surgical intervention such as a single-level fusion or laminectomy.' },
        { label: 'Partial Paralysis', edFloor: 800000, minWeight: 5.0, desc: 'Significant spinal cord damage resulting in loss of sensation or motor control in specific extremities (Paraparesis).' },
        { label: 'Quadriplegia', edFloor: 4000000, minWeight: 10.0, desc: 'Total and permanent loss of function in all four limbs and torso resulting from high-level cervical spinal cord injury.' }
      ]
    },
    {
      id: 'fracture',
      label: 'Severe Fractures',
      summary: 'Complex bone breaks requiring surgical intervention.',
      tiers: [
        { label: 'Compound', edFloor: 50000, minWeight: 1.2, desc: 'Open fracture where the bone pierces the skin, requiring emergency surgical stabilization and risk of office-wide osteomyelitis.' },
        { label: 'Comminuted', edFloor: 120000, minWeight: 2.0, desc: 'Complex fracture where the bone is splintered or crushed into multiple fragments requiring extensive internal fixation.' },
        { label: 'Pelvic/Hip', edFloor: 250000, minWeight: 3.5, desc: 'Catastrophic fracture of the pelvic girdle or femoral neck resulting in permanent mobility impairment and chronic pain.' }
      ]
    },
    {
      id: 'burns',
      label: 'Severe Burns',
      summary: 'Thermal or chemical damage to skin and tissue.',
      tiers: [
        { label: '2nd Degree', edFloor: 40000, minWeight: 1.5, desc: 'Partial thickness burns involving the epidermis and dermis, causing significant pain and potential for localized scarring.' },
        { label: '3rd Degree', edFloor: 200000, minWeight: 4.5, desc: 'Full thickness burns extending through all skin layers, requiring surgical debridement and extensive skin grafting procedures.' },
        { label: 'Catastrophic', edFloor: 1000000, minWeight: 8.0, desc: 'Fourth-degree burns involving underlying muscle and bone, resulting in massive disfigurement or systemic organ failure.' }
      ]
    },
    {
      id: 'back',
      label: 'Back & Neck',
      summary: 'Soft tissue and disc injuries of the spinal column.',
      tiers: [
        { label: 'Strain/Sprain', edFloor: 15000, minWeight: 1.0, desc: 'Chronic myofascial pain syndrome and ligamentous instability resulting in persistent loss of range of motion.' },
        { label: 'Disc Bulge', edFloor: 45000, minWeight: 1.8, desc: 'Bulging intervertebral discs with nerve root impingement requiring long-term epidural steroid injections or physical therapy.' },
        { label: 'Disc Herniation', edFloor: 95000, minWeight: 2.5, desc: 'Extrusion of disc material causing severe radiculopathy and requiring microdiscectomy or surgical laminectomy.' }
      ]
    },
    {
      id: 'amputation',
      label: 'Amputations',
      summary: 'Loss of a body part due to traumatic impact.',
      tiers: [
        { label: 'Digit/Toe', edFloor: 75000, minWeight: 2.0, desc: 'Traumatic loss of a finger or toe resulting in diminished grip strength or permanent balance disruption.' },
        { label: 'Partial Limb', edFloor: 350000, minWeight: 4.5, desc: 'Traumatic loss of a hand or foot (transmetatarsal or transcarpal) requiring specialized prosthetic adaptation.' },
        { label: 'Full Limb', edFloor: 1200000, minWeight: 8.5, desc: 'Catastrophic loss of an arm or leg (above or below knee/elbow) requiring lifelong prosthetic maintenance and therapy.' }
      ]
    },
    {
      id: 'blindness',
      label: 'Vision Impairment',
      summary: 'Partial or total loss of sight.',
      tiers: [
        { label: 'Partial', edFloor: 100000, minWeight: 2.5, desc: 'Significant loss of visual acuity or field of vision in one or both eyes, affecting daily activities and ability to drive.' },
        { label: 'Single Eye', edFloor: 450000, minWeight: 5.0, desc: 'Complete and irreversible loss of sight in one eye (Enucleation or total retinal detachment).' },
        { label: 'Total', edFloor: 2000000, minWeight: 9.5, desc: 'Bilateral total blindness resulting in complete permanent disability and loss of independent living capacity.' }
      ]
    },
    {
      id: 'internal',
      label: 'Internal Trauma',
      summary: 'Damage to internal organs or high-velocity trauma.',
      tiers: [
        { label: 'Splenectomy', edFloor: 85000, minWeight: 1.8, desc: 'Ruptured spleen requiring emergency surgical removal and resulting in lifelong immune system compromise.' },
        { label: 'Organ Laceration', edFloor: 150000, minWeight: 3.0, desc: 'Significant laceration or bruising to the liver, kidneys, or lungs requiring intensive care monitoring or major surgery.' },
        { label: 'Multi-System', edFloor: 650000, minWeight: 6.0, desc: 'Critical trauma to multiple internal organ systems resulting in septic risk, internal hemorrhage, or multi-organ failure.' }
      ]
    }
  ]
};

const DEFAULT_BENCHMARKS: SettlementBenchmark[] = [
  { id: 'demo_b1', isDemo: true, injuryId: 'death', text: 'Dallas County: $14.2M Jury Verdict (Wrongful Death / Commercial Trucking)', dateAdded: '2023-11-12' },
  { id: 'demo_b2', isDemo: true, injuryId: 'tbi', text: 'Harris County: $3.4M Settlement (Traumatic Brain Injury)', dateAdded: '2023-09-05' },
  { id: 'demo_b3', isDemo: true, injuryId: 'spinal', text: 'Dallas County: $5.8M Verdict (Paraplegia / Premises Liability)', dateAdded: '2024-01-20' },
  { id: 'demo_b4', isDemo: true, injuryId: 'fracture', text: 'Tarrant County: $1.2M Settlement (Multiple Compound Fractures)', dateAdded: '2023-08-15' },
  { id: 'demo_b5', isDemo: true, injuryId: 'death', text: 'Bexar County: $8.9M Settlement (Wrongful Death / Drunk Driver)', dateAdded: '2023-12-01' },
  { id: 'demo_b6', isDemo: true, injuryId: 'burns', text: 'Travis County: $4.5M Verdict (Industrial Explosion / 3rd Degree Burns)', dateAdded: '2023-07-22' },
  { id: 'demo_b7', isDemo: true, injuryId: 'internal', text: 'Collin County: $950k Settlement (Organ Trauma / High Velocity Collision)', dateAdded: '2023-06-10' },
  { id: 'demo_b8', isDemo: true, injuryId: 'tbi', text: 'El Paso County: $2.1M Verdict (Closed Head Injury / School Bus Accident)', dateAdded: '2023-10-30' },
  { id: 'demo_b9', isDemo: true, injuryId: 'spinal', text: 'Denton County: $3.8M Settlement (Discectomy Required / 18-Wheeler)', dateAdded: '2024-02-14' },
  { id: 'demo_b10', isDemo: true, injuryId: 'amputation', text: 'Hidalgo County: $7.2M Verdict (Loss of Limb / Defective Machinery)', dateAdded: '2023-05-25' },
  { id: 'demo_b11', isDemo: true, injuryId: 'death', text: 'Lubbock County: $12.5M Verdict (Wrongful Death / Medical Malpractice)', dateAdded: '2023-04-18' },
  { id: 'demo_b12', isDemo: true, injuryId: 'back', text: 'Galveston County: $650k Settlement (Herniated Discs / Rideshare)', dateAdded: '2023-09-12' },
  { id: 'demo_b13', isDemo: true, injuryId: 'blindness', text: 'Fort Bend County: $5.4M Settlement (Vision Loss / Chemical Exposure)', dateAdded: '2023-11-28' },
  { id: 'demo_b14', isDemo: true, injuryId: 'fracture', text: 'Montgomery County: $1.1M Settlement (Pelvic Fracture / Motorcycle)', dateAdded: '2023-10-05' },
  { id: 'demo_b15', isDemo: true, injuryId: 'internal', text: 'Smith County: $875k Verdict (Internal Bleeding / Construction Site)', dateAdded: '2023-08-29' },
  { id: 'demo_b16', isDemo: true, injuryId: 'death', text: 'Cameron County: $9.1M Settlement (Workplace Fatality / Oil Field)', dateAdded: '2023-12-15' },
  { id: 'demo_b17', isDemo: true, injuryId: 'tbi', text: 'Webb County: $4.2M Verdict (Cognitive Deficit / Delivery Truck)', dateAdded: '2023-06-20' },
  { id: 'demo_b18', isDemo: true, injuryId: 'spinal', text: 'Jefferson County: $2.9M Settlement (Cervical Fusion / Rear-end)', dateAdded: '2024-01-05' },
  { id: 'demo_b19', isDemo: true, injuryId: 'burns', text: 'Nueces County: $6.3M Verdict (Electrical Burn / Apartment Negligence)', dateAdded: '2023-03-14' },
  { id: 'demo_b20', isDemo: true, injuryId: 'amputation', text: 'Brazoria County: $3.5M Settlement (Finger Amputation / Tool Failure)', dateAdded: '2023-07-08' },
  { id: 'demo_b21', isDemo: true, injuryId: 'death', text: 'Bell County: $11.0M Verdict (Fatal Rollover / Tire Defect)', dateAdded: '2023-11-01' },
  { id: 'demo_b22', isDemo: true, injuryId: 'back', text: 'Ector County: $825k Settlement (Bulging Discs / Oil Rig Accident)', dateAdded: '2023-05-12' },
  { id: 'demo_b23', isDemo: true, injuryId: 'internal', text: 'Midland County: $1.4M Verdict (Splenectomy / Drunk Driver)', dateAdded: '2023-08-01' },
  { id: 'demo_b24', isDemo: true, injuryId: 'tbi', text: 'Potter County: $2.8M Settlement (Frontal Lobe Damage / Fall)', dateAdded: '2023-10-18' },
  { id: 'demo_b25', isDemo: true, injuryId: 'spinal', text: 'Tom Green County: $3.1M Verdict (Lumbar Fusion / Slip and Fall)', dateAdded: '2023-12-28' },
  { id: 'demo_b26', isDemo: true, injuryId: 'death', text: 'Taylor County: $7.5M Settlement (Wrongful Death / Construction Collapse)', dateAdded: '2023-04-05' },
  { id: 'demo_b27', isDemo: true, injuryId: 'fracture', text: 'Gregg County: $950k Settlement (Broken Femur / Bicycle Accident)', dateAdded: '2023-09-30' },
  { id: 'demo_b28', isDemo: true, injuryId: 'burns', text: 'Wichita County: $4.1M Verdict (Scalding Injury / Nursing Home)', dateAdded: '2023-11-20' },
  { id: 'demo_b29', isDemo: true, injuryId: 'blindness', text: 'Johnson County: $2.4M Settlement (Eye Injury / Bungee Failure)', dateAdded: '2023-06-15' },
  { id: 'demo_b30', isDemo: true, injuryId: 'amputation', text: 'Parker County: $5.2M Verdict (Hand Crush / Industrial Press)', dateAdded: '2024-02-01' },
  { id: 'demo_b31', isDemo: true, injuryId: 'death', text: 'Ellis County: $8.4M Settlement (Fatal Pedestrian / Garbage Truck)', dateAdded: '2023-07-12' },
  { id: 'demo_b32', isDemo: true, injuryId: 'tbi', text: 'Comal County: $1.9M Settlement (Post-Concussive Syndrome / Multi-Car)', dateAdded: '2023-08-22' },
  { id: 'demo_b33', isDemo: true, injuryId: 'spinal', text: 'Guadalupe County: $4.4M Verdict (Spinal Fracture / Forklift)', dateAdded: '2023-12-10' },
  { id: 'demo_b34', isDemo: true, injuryId: 'internal', text: 'Bastrop County: $1.1M Settlement (Liver Laceration / High-Speed)', dateAdded: '2023-05-18' },
  { id: 'demo_b35', isDemo: true, injuryId: 'death', text: 'Hays County: $13.1M Verdict (Wrongful Death / Dram Shop Liability)', dateAdded: '2023-10-02' },
  { id: 'demo_b36', isDemo: true, injuryId: 'back', text: 'Williamson County: $725k Settlement (Sacroiliac Strain / Rear-end)', dateAdded: '2023-09-08' },
  { id: 'demo_b37', isDemo: true, injuryId: 'burns', text: 'Liberty County: $2.7M Settlement (Flash Fire / Chemical Plant)', dateAdded: '2023-11-15' },
  { id: 'demo_b38', isDemo: true, injuryId: 'amputation', text: 'Waller County: $6.1M Verdict (Foot Loss / Agriculture Eq)', dateAdded: '2023-04-28' },
  { id: 'demo_b39', isDemo: true, injuryId: 'blindness', text: 'Kaufman County: $3.3M Verdict (Retinal Detachment / Workplace)', dateAdded: '2023-06-05' },
  { id: 'demo_b40', isDemo: true, injuryId: 'death', text: 'Rockwall County: $5.9M Settlement (Fatal Drowning / Negligent Pool)', dateAdded: '2023-08-30' },
  { id: 'demo_b41', isDemo: true, injuryId: 'fracture', text: 'Hunt County: $1.4M Verdict (Multiple Ribs/Lung / Trucking)', dateAdded: '2023-12-05' },
  { id: 'demo_b42', isDemo: true, injuryId: 'internal', text: 'Henderson County: $900k Settlement (Kidney Damage / Assault)', dateAdded: '2024-01-15' },
  { id: 'demo_b43', isDemo: true, injuryId: 'tbi', text: 'Rusk County: $2.5M Verdict (Subdural Hematoma / Fall from Height)', dateAdded: '2023-03-22' },
  { id: 'demo_b44', isDemo: true, injuryId: 'spinal', text: 'Harrison County: $3.9M Settlement (Epidural Abscess / Medical Error)', dateAdded: '2023-05-01' },
  { id: 'demo_b45', isDemo: true, injuryId: 'death', text: 'Panola County: $7.8M Verdict (Fatal Log Truck Accident)', dateAdded: '2023-10-12' }
];
export const MockDB = {
  init: () => {
    if (!localStorage.getItem(STORAGE_KEYS.INITIALIZED)) {
      localStorage.setItem(STORAGE_KEYS.BENCHMARKS, JSON.stringify(DEFAULT_BENCHMARKS));
      localStorage.setItem(STORAGE_KEYS.SERIOUS_CALC, JSON.stringify(DEFAULT_SERIOUS_CONFIG));
      localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(DEMO_LEADS));
      localStorage.setItem(STORAGE_KEYS.EVIDENCE, JSON.stringify(DEMO_EVIDENCE));
      localStorage.setItem(STORAGE_KEYS.CHATS, JSON.stringify(DEMO_CHATS));
      localStorage.setItem(STORAGE_KEYS.CALC_LEADS, JSON.stringify(DEMO_CALC_LEADS));
      localStorage.setItem(STORAGE_KEYS.ARCHIVE, JSON.stringify([]));
      localStorage.setItem(STORAGE_KEYS.TEAM, JSON.stringify(INITIAL_TEAM));
      localStorage.setItem(STORAGE_KEYS.BRANDING, JSON.stringify(DEFAULT_BRANDING));
      
      // Initialize default AI prompts
      localStorage.setItem(STORAGE_KEYS.PROMPT_CHATBOT, DEFAULT_SYSTEM_PROMPT);
      localStorage.setItem(STORAGE_KEYS.PROMPT_ANALYZER, DEFAULT_ANALYZER_PROMPT);
      localStorage.setItem(STORAGE_KEYS.PROMPT_SUMMARIZER, DEFAULT_SUMMARIZER_PROMPT);
      
      localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
    }
  },

  getBranding: (): FirmBranding => JSON.parse(localStorage.getItem(STORAGE_KEYS.BRANDING) || JSON.stringify(DEFAULT_BRANDING)),
  saveBranding: (branding: FirmBranding) => localStorage.setItem(STORAGE_KEYS.BRANDING, JSON.stringify(branding)),
  getEmailConfig: (): EmailConfig => JSON.parse(localStorage.getItem(STORAGE_KEYS.EMAIL_CONFIG) || '{"mode":"managed","routingEmail":"leads@gregglawdallas.com","outboundName":"injury.bot"}'),
  saveEmailConfig: (config: EmailConfig) => localStorage.setItem(STORAGE_KEYS.EMAIL_CONFIG, JSON.stringify(config)),
  getStandardConfig: (): StandardCalculatorConfig => JSON.parse(localStorage.getItem(STORAGE_KEYS.STANDARD_CALC) || JSON.stringify({ bodyParts: BODY_PARTS, conductTypes: CONDUCT_TYPES })),
  saveStandardConfig: (config: StandardCalculatorConfig) => localStorage.setItem(STORAGE_KEYS.STANDARD_CALC, JSON.stringify(config)),
  getSeriousConfig: (): SeriousCalculatorConfig => JSON.parse(localStorage.getItem(STORAGE_KEYS.SERIOUS_CALC) || JSON.stringify(DEFAULT_SERIOUS_CONFIG)),
  saveSeriousConfig: (config: SeriousCalculatorConfig) => localStorage.setItem(STORAGE_KEYS.SERIOUS_CALC, JSON.stringify(config)),
  getDeathConfig: (): WrongfulDeathConfig => JSON.parse(localStorage.getItem(STORAGE_KEYS.DEATH_CALC) || '{"pecuniaryFloor":1000000}'),
  saveDeathConfig: (config: WrongfulDeathConfig) => localStorage.setItem(STORAGE_KEYS.DEATH_CALC, JSON.stringify(config)),

  getMessages: (): InboxMessage[] => JSON.parse(localStorage.getItem(STORAGE_KEYS.MESSAGES) || '[]'),
  saveMessage: (msg: any) => {
    const list = MockDB.getMessages();
    const newMsg = { ...msg, id: 'msg_' + Date.now(), timestamp: new Date().toISOString(), isRead: false };
    list.unshift(newMsg);
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(list));
    return newMsg;
  },
  deleteMessage: (id: string) => localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(MockDB.getMessages().filter(m => m.id !== id))),

  getEvidence: (): EvidenceSubmission[] => JSON.parse(localStorage.getItem(STORAGE_KEYS.EVIDENCE) || '[]'),
  saveEvidence: (sub: any) => {
    const list = MockDB.getEvidence();
    const newSub = { ...sub, id: 'ev_' + Date.now(), timestamp: new Date().toISOString() };
    list.unshift(newSub);
    localStorage.setItem(STORAGE_KEYS.EVIDENCE, JSON.stringify(list));
    return newSub;
  },
  deleteEvidence: (id: string) => localStorage.setItem(STORAGE_KEYS.EVIDENCE, JSON.stringify(MockDB.getEvidence().filter(e => e.id !== id))),

  getCalcLeads: (): CalculatorLead[] => JSON.parse(localStorage.getItem(STORAGE_KEYS.CALC_LEADS) || '[]'),
  saveCalcLead: (lead: any) => {
    const list = MockDB.getCalcLeads();
    const newLead = { ...lead, id: 'cl_' + Date.now(), timestamp: new Date().toISOString() };
    list.unshift(newLead);
    localStorage.setItem(STORAGE_KEYS.CALC_LEADS, JSON.stringify(list));
    return newLead;
  },
  deleteCalcLead: (id: string) => localStorage.setItem(STORAGE_KEYS.CALC_LEADS, JSON.stringify(MockDB.getCalcLeads().filter(l => l.id !== id))),

  getChats: (): ChatTranscript[] => JSON.parse(localStorage.getItem(STORAGE_KEYS.CHATS) || '[]'),
  saveChatTranscript: (transcript: any) => {
    const list = MockDB.getChats();
    const newChat = { ...transcript, id: 'ch_' + Date.now(), timestamp: new Date().toISOString() };
    list.unshift(newChat);
    localStorage.setItem(STORAGE_KEYS.CHATS, JSON.stringify(list));
    return newChat;
  },
  deleteChatTranscript: (id: string) => localStorage.setItem(STORAGE_KEYS.CHATS, JSON.stringify(MockDB.getChats().filter(c => c.id !== id))),

  getArchive: (): ArchivedItem[] => JSON.parse(localStorage.getItem(STORAGE_KEYS.ARCHIVE) || '[]'),
  archiveItem: (id: string, type: ArchivedItem['type']) => {
    let itemData: any = null;
    if (type === 'inbox') { itemData = MockDB.getMessages().find(m => m.id === id); if (itemData) MockDB.deleteMessage(id); }
    else if (type === 'evidence') { itemData = MockDB.getEvidence().find(e => e.id === id); if (itemData) MockDB.deleteEvidence(id); }
    else if (type === 'calc_leads') { itemData = MockDB.getCalcLeads().find(l => l.id === id); if (itemData) MockDB.deleteCalcLead(id); }
    else if (type === 'chats') { itemData = MockDB.getChats().find(c => c.id === id); if (itemData) MockDB.deleteChatTranscript(id); }

    if (itemData) {
      const archive = MockDB.getArchive();
      archive.unshift({ id, type, data: itemData, archivedAt: new Date().toISOString() });
      localStorage.setItem(STORAGE_KEYS.ARCHIVE, JSON.stringify(archive));
    }
  },
  recoverItem: (id: string) => {
    const archive = MockDB.getArchive();
    const item = archive.find(a => a.id === id);
    if (item) {
      if (item.type === 'inbox') { const list = MockDB.getMessages(); list.unshift(item.data); localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(list)); }
      else if (item.type === 'evidence') { const list = MockDB.getEvidence(); list.unshift(item.data); localStorage.setItem(STORAGE_KEYS.EVIDENCE, JSON.stringify(list)); }
      else if (item.type === 'calc_leads') { const list = MockDB.getCalcLeads(); list.unshift(item.data); localStorage.setItem(STORAGE_KEYS.CALC_LEADS, JSON.stringify(list)); }
      else if (item.type === 'chats') { const list = MockDB.getChats(); list.unshift(item.data); localStorage.setItem(STORAGE_KEYS.CHATS, JSON.stringify(list)); }
      localStorage.setItem(STORAGE_KEYS.ARCHIVE, JSON.stringify(archive.filter(a => a.id !== id)));
    }
  },
  deleteArchivedItem: (id: string) => localStorage.setItem(STORAGE_KEYS.ARCHIVE, JSON.stringify(MockDB.getArchive().filter(a => a.id !== id))),
  clearArchive: () => localStorage.setItem(STORAGE_KEYS.ARCHIVE, JSON.stringify([])),

  getTeam: (): AttorneyProfile[] => JSON.parse(localStorage.getItem(STORAGE_KEYS.TEAM) || '[]'),
  saveTeam: (members: AttorneyProfile[]) => localStorage.setItem(STORAGE_KEYS.TEAM, JSON.stringify(members)),

  getPrompt: (feature: 'chatbot' | 'analyzer' | 'summarizer'): string => {
    const key = 'ib_p_' + feature;
    const stored = localStorage.getItem(key);
    if (stored && stored.trim().length > 10) return stored;
    
    // Robust fallback to defaults if storage is missing or empty
    if (feature === 'chatbot') return DEFAULT_SYSTEM_PROMPT;
    if (feature === 'analyzer') return DEFAULT_ANALYZER_PROMPT;
    if (feature === 'summarizer') return DEFAULT_SUMMARIZER_PROMPT;
    return '';
  },
  savePrompt: (feature: 'chatbot' | 'analyzer' | 'summarizer', text: string) => localStorage.setItem('ib_p_' + feature, text),

  getBenchmarks: (id?: string) => JSON.parse(localStorage.getItem(STORAGE_KEYS.BENCHMARKS) || '[]').filter((b: any) => !id || b.injuryId === id || id === 'all'),
  addBenchmark: (injuryId: string, text: string) => {
    const list = MockDB.getBenchmarks('all');
    list.push({ id: 'b_' + Date.now(), injuryId, text, dateAdded: new Date().toISOString() });
    localStorage.setItem(STORAGE_KEYS.BENCHMARKS, JSON.stringify(list));
  },
  deleteBenchmark: (id: string) => localStorage.setItem(STORAGE_KEYS.BENCHMARKS, JSON.stringify(MockDB.getBenchmarks('all').filter((b: any) => b.id !== id)))
};
