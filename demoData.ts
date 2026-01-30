
import { InboxMessage, EvidenceSubmission, ChatTranscript, CalculatorLead } from './types';
import { CaseFile } from './services/gemini';

// Mock Assets (SVG Data URLs)
const SVG_DOC_OFFICIAL = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjUwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjhmYmZmIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyNCIgZmlsbD0iIzMzMyIgdGV4dC1hbmNob3I9Im1pZGRsZSI+U0FNUExFIENSQVNIIFJFUE9SVDwvdGV4dD48L3N2Zz4=";
const SVG_DOC_MEDICAL = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjUwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZmZmOGY4Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyNCIgZmlsbD0iIzMzMyIgdGV4dC1hbmNob3I9Im1pZGRsZSI+U0FNUExFIE1FRElDQUwgQklMTDwvdGV4dD48L3N2Zz4=";
const SVG_DOC_FINANCIAL = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjUwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjhmYmY4Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyNCIgZmlsbD0iIzMzMyIgdGV4dC1hbmNob3I9Im1pZGRsZSI+U0FNUExFIFBBWVNUVUI8L3RleHQ+PC9zdmc+";
const SVG_DOC_IMAGE = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzMzIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyMCIgZmlsbD0iI2ZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+U0FNUExFIFZFSFICLEUgREFNQUdFPC90ZXh0Pjwvc3ZnPg==";

export const DEMO_DOCUMENTS: CaseFile[] = [
  { id: 'd1', name: 'ALLEGIANCE_UNIT_5138_PHOTOS.pdf', category: 'media', mimeType: 'image/svg+xml', data: SVG_DOC_IMAGE.split(',')[1] },
  { id: 'd2', name: 'TX_CRASH_REPORT_GWD3575.pdf', category: 'official', mimeType: 'image/svg+xml', data: SVG_DOC_OFFICIAL.split(',')[1] },
  { id: 'd3', name: 'MEDICAL_SPECIALS_SUMMARY.pdf', category: 'medical', mimeType: 'image/svg+xml', data: SVG_DOC_MEDICAL.split(',')[1] },
  { id: 'd4', name: 'LOST_WAGES_VERIFICATION.pdf', category: 'financial', mimeType: 'image/svg+xml', data: SVG_DOC_FINANCIAL.split(',')[1] },
];

export const DEMO_LEADS: InboxMessage[] = [
  {
    id: 'demo_1',
    name: 'Sarah Montgomery',
    email: 's.montgomery@example.com',
    phone: '(214) 555-0192',
    method: 'phone',
    message: 'I was in an accident with an Allegiance Mobile Health EMS truck. I hit my head very hard and the passenger side of my car is crushed. The ambulance was an EMS Supervisor vehicle.',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    isRead: false
  }
];

export const DEMO_EVIDENCE: EvidenceSubmission[] = [
  {
    id: 'demo_ev_1',
    name: 'Sarah Montgomery',
    contact: '(214) 555-0192',
    testimony: 'I was hit by an ambulance company supervisor who was following an ambulace on its way to an emergency. I hit his car when he ran a red light. I had a green light. I hit my head and my knee really hard.',
    analysis: `**LEGAL MEMORANDUM**

**TO:** Robert S. Gregg, Esq.  
**FROM:** Injury Bot AI  
**DOA:** May 22, 2024  
**RE:** EXECUTIVE CASE BRIEF: PNC HEAD INJURY / ALLEGIANCE MOBILE HEALTH COLLISION  

---

### **1. EVIDENCE COMPILATION & FINDINGS**
The preliminary investigation has yielded the following evidentiary components:

*   **Photographic Evidence:** Digital imagery depicts a Ford Escape identified as an "EMS SUPERVISOR" vehicle belonging to **Allegiance Mobile Health** (Unit 5138, TX License GWD-3575). The vehicle exhibits significant lateral impact deformation to the passenger side, consistent with a high-energy T-bone or side-swipe collision.
*   **Actuarial Methodology (Trevino Calculation):** Documentation provided utilizes a *Trevino* multiplier of 2.5x for non-economic damages. This suggests a rigorous approach to quantifying subjective loss based on established Texas protocols.
*   **Liability Admission (Projected):** Internal documentation indicates a projected **91% Defendant Liability**, suggesting the adverse driver (Allegiance employee) breached the standard of care, likely via failure to yield or improper emergency vehicle operation.

### **2. DISCREPANCY ANALYSIS**
*   **PNC Testimony:** PNC states, "I had an accident and hit my head." This is a layman’s simplification of a traumatic event.
*   **Official Indicators vs. Testimony:** While PNC’s statement is brief, the vehicle damage suggests a high-velocity impact. The discrepancy lies in the *severity of the mechanism*. A "head hit" in the context of a commercial EMS vehicle collision often masks Traumatic Brain Injury (TBI) or Coup-Contrecoup phenomena. There is no current contradiction between the PNC's statement and the vehicle damage, but the medical severity likely far exceeds the PNC’s initial verbal assessment.

### **3. DAMAGES ASSESSMENT**

#### **MEDICAL SUMMARY**
*   **Incurred Expenses:** $14,583 (Current medical specials).
*   **Future Medical Projections:** $38,175. This indicates a clinical necessity for long-term care, likely involving neurology or pain management, consistent with post-concussive syndrome or cervical acceleration-deceleration (CAD) injury.
*   **Diagnostic Focus:** Given the "head hit" testimony, we must secure MRI/CT imaging to rule out intracranial hemorrhage or axonal shearing.

#### **ECONOMIC SUMMARY**
*   **Lost Wages:** $15,360 (Documented past loss).
*   **Total Special Damages (Economic):** $68,118.
*   **General Damages (Non-Economic):** $170,295 (calculated via 2.5x multiplier for Pain/Suffering, Mental Anguish, and Loss of Consortium).
*   **Total Projected Gross Recovery:** **$216,956** (Adjusted for 91% liability).

### **4. LIABILITY RATING: 9 / 10**
Under Texas’s Modified Comparative Fault rule (51% Bar), recovery probability is exceptionally high. Because the adverse vehicle is a commercial EMS unit, the "Emergency Care" defense (Tex. Civ. Prac. & Rem. Code § 74.151) may be raised. However, the 91% liability projection suggests the driver was either not on an active call or operated the vehicle with "reckless disregard," vitiating statutory immunity for emergency responders.

### **5. STRATEGIC PLAN**
1.  **Direct Filing:** Given the commercial nature of the defendant (Allegiance Mobile Health), initiate a formal preservation of evidence letter (Spoliation Letter) for dashcam footage and "black box" (EDR) data.
2.  **Neurological Referral:** Transition PNC to a TBI specialist to quantify the "head hit" and establish a permanent impairment rating under AMA Guides.
3.  **Trevino Validation:** Substantiate the 2.5x multiplier by gathering "Day in the Life" evidence to support the $170,295 non-economic demand.
4.  **Policy Limit Demand:** Determine the commercial umbrella limits for Allegiance Mobile Health; the current valuation of ~$217k may exceed the primary auto layer depending on the carrier.

**END OF BRIEF**`,
    timestamp: new Date().toISOString(),
    files: DEMO_DOCUMENTS,
    protocolStrength: 95
  }
];

export const DEMO_CHATS: ChatTranscript[] = [
  {
    id: 'demo_chat_1',
    subject: 'Allegiance EMS Collision - S. Montgomery',
    timestamp: new Date(Date.now() - 4000000).toISOString(),
    messages: [
      { role: 'user', text: 'I hit my head after an ambulance hit my car' },
      { role: 'bot', text: 'I am concerned about that head injury. Was it a private ambulance or a city vehicle? Do you remember the name on the truck?' },
      { role: 'user', text: 'It said Allegiance Mobile Health on the side. It was an SUV.' },
      { role: 'bot', text: 'That is likely an EMS Supervisor vehicle. These are high-value commercial claims in Texas. Have you been to the hospital yet?' },
      { role: 'user', text: 'I went to the ER, they said I have a concussion.' }
    ]
  }
];

export const DEMO_CHAT_SUMMARIES: Record<string, string> = {
  'demo_chat_1': `[PNC INFORMATION]\nName: Sarah Montgomery\nContact: (214) 555-0192\n\n[CASE SUMMARY]\nPNC reported a lateral collision with an Allegiance Mobile Health EMS Supervisor vehicle. PNC reported "hitting head" and has a clinical ER diagnosis of concussion. Significant vehicle damage noted.\n\n[STRATEGIC RECOMMENDATION]\nHigh-value commercial liability lead. ACTION: Evaluate for TBI/Coup-Contrecoup. Commercial policy limits apply.`
};

export const DEMO_CALC_LEADS: CalculatorLead[] = [
  {
    id: 'demo_calc_1',
    name: 'Sarah Montgomery',
    phone: '(214) 555-0192',
    timestamp: new Date(Date.now() - 1800000).toISOString(),
    calculatorSource: 'minor',
    inputs: {
      injuryType: 'Concussion / Head Trauma',
      medicalBills: 14583,
      lostWages: 15360,
      futureMedical: 38175,
      outOfPocket: 0
    },
    valuation: {
      net: 216956
    },
    aiAudit: "COMMERCIAL VEHICLE AUDIT. PNC hit head in collision with Allegiance Mobile Health. Trevino Multiplier of 2.5x applied to non-economic components. Net recovery adjusted for 91% liability projection."
  },
  {
    id: 'demo_calc_2',
    name: 'Marcus Reed',
    phone: '(817) 555-8821',
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    calculatorSource: 'serious',
    inputs: {
      injuryType: 'Traumatic Brain (TBI) - Significantly Serious',
      medicalBills: 85000,
      lostWages: 150000,
      futureMedical: 250000,
      outOfPocket: 15000
    },
    valuation: {
      net: 1450000
    },
    aiAudit: "SERIOUS INJURY AUDIT. High-severity neurological deficit documented. Calculating significant non-economic adjustment due to permanent cognitive impairment."
  },
  {
    id: 'demo_calc_3',
    name: 'Estate of David Vance',
    phone: '(214) 555-0011',
    timestamp: new Date(Date.now() - 172800000).toISOString(),
    calculatorSource: 'estate',
    inputs: {
      injuryType: 'Wrongful Death - Estate Survival Action',
      medicalBills: 45000,
      lostWages: 2200000,
      futureMedical: 0,
      outOfPocket: 0
    },
    valuation: {
      net: 4850000
    },
    aiAudit: "ESTATE SURVIVAL AUDIT. High-value pecuniary loss calculated based on future earning capacity. Includes pre-death anguish and itemized survival damages."
  },
  {
    id: 'demo_calc_4',
    name: 'Elena Vance (Survivor)',
    phone: '(214) 555-0011',
    timestamp: new Date(Date.now() - 172800000).toISOString(),
    calculatorSource: 'beneficiary',
    inputs: {
      injuryType: 'Wrongful Death Act (Beneficiary)',
      medicalBills: 0,
      lostWages: 1800000,
      futureMedical: 0,
      outOfPocket: 450000
    },
    valuation: {
      net: 3200000
    },
    aiAudit: "SURVIVOR BENEFICIARY AUDIT. Evaluating individual loss of consortium and financial dependency for decendent's spouse and minor child."
  }
];
