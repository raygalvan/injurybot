
import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { useDemoMode } from '../useDemoMode';
import { MockDB, DEFAULT_SYSTEM_PROMPT, DEFAULT_ANALYZER_PROMPT, DEFAULT_SUMMARIZER_PROMPT } from '../services/storage';
import { InboxMessage, EvidenceSubmission, SettlementBenchmark, FirmBranding, ChatTranscript, AttorneyProfile, StandardCalculatorConfig, SeriousCalculatorConfig, WrongfulDeathConfig, EmailConfig, CalculatorLead, ArchivedItem } from '../types';

// Modular Components
import AdminSidebar from './admin/AdminSidebar';
import AdminInbox from './admin/AdminInbox';
import AdminEvidenceHub from './admin/AdminEvidenceHub';
import AdminChatTranscripts from './admin/AdminChatTranscripts';
import AdminCalculatorLeads from './admin/AdminCalculatorLeads';
import AdminBotConfig from './admin/AdminBotConfig';
import AdminCalcTuning from './admin/AdminCalcTuning';
import AdminBenchmarks from './admin/AdminBenchmarks';
import AdminBranding from './admin/AdminBranding';
import AdminComms from './admin/AdminComms';
import AdminTeam from './admin/AdminTeam';
import AdminEmailModal from './admin/AdminEmailModal';
import AdminArchive from './admin/AdminArchive';
import DeleteConfirmationModal from './admin/DeleteConfirmationModal';

interface AdminDashboardProps {
  firm: FirmBranding;
  onLogout: () => void;
}

type TabType = 'inbox' | 'evidence' | 'chats' | 'calc_leads' | 'archive' | 'branding' | 'comms' | 'team' | 'benchmarks' | 'bot_config' | 'calc_tuning';

const AdminDashboard: React.FC<AdminDashboardProps> = ({ firm, onLogout }) => {
  const [tab, setTab] = useState<TabType>('inbox');
  const [messages, setMessages] = useState<InboxMessage[]>([]);
  const [evidence, setEvidence] = useState<EvidenceSubmission[]>([]);
  const [chats, setChats] = useState<ChatTranscript[]>([]);
  const [calcLeads, setCalcLeads] = useState<CalculatorLead[]>([]);
  const [archive, setArchive] = useState<ArchivedItem[]>([]);
  const [benchmarks, setBenchmarks] = useState<SettlementBenchmark[]>([]);
  const [team, setTeam] = useState<AttorneyProfile[]>([]);
  const [newAward, setNewAward] = useState({ injuryId: 'death', text: '' });
  
  const { demoModeEnabled, setDemoModeEnabled } = useDemoMode();
  const [brandingState, setBrandingState] = useState<FirmBranding>(firm);
  const [emailConfig, setEmailConfig] = useState<EmailConfig>(MockDB.getEmailConfig());
  const [standardConfig, setStandardConfig] = useState<StandardCalculatorConfig>(MockDB.getStandardConfig());
  const [seriousConfig, setSeriousConfig] = useState<SeriousCalculatorConfig>(MockDB.getSeriousConfig());
  const [deathConfig, setDeathConfig] = useState<WrongfulDeathConfig>(MockDB.getDeathConfig());
  const [activeCalcSubtab, setActiveCalcSubtab] = useState<'standard' | 'serious' | 'death'>('standard');
  const [selectedSeriousId, setSelectedSeriousId] = useState<string>('tbi');
  const [activePromptTab, setActivePromptTab] = useState<'chatbot' | 'analyzer' | 'summarizer'>('chatbot');
  const [prompts, setPrompts] = useState({ chatbot: '', analyzer: '', summarizer: '' });
  const [summaries, setSummaries] = useState<Record<string, string>>({});
  const [loadingSummaries, setLoadingSummaries] = useState<Set<string>>(new Set());

  // Safety Modals
  const [deleteSafety, setDeleteSafety] = useState<{ id: string, type: ArchivedItem['type'] } | null>(null);

  // Email Modal State
  const [emailModal, setEmailModal] = useState<{ 
    isOpen: boolean; name: string; email: string; template: 'accept' | 'reject'; sourceId?: string; sourceType?: ArchivedItem['type'] 
  }>({
    isOpen: false,
    name: '',
    email: '',
    template: 'accept'
  });

  useEffect(() => { loadData(); }, [tab, demoModeEnabled]);

  const loadData = () => {
    // Helper to filter demo items based on ID prefix or explicit flag
    const filterItems = <T extends { id: string; isDemo?: boolean }>(list: T[]): T[] => {
      if (demoModeEnabled) return list;
      return list.filter(item => {
        const idStr = item.id?.toString() || '';
        return !idStr.startsWith('demo_') && !item.isDemo;
      });
    };

    setMessages(filterItems(MockDB.getMessages())); 
    setEvidence(filterItems(MockDB.getEvidence())); 
    setChats(filterItems(MockDB.getChats())); 
    setCalcLeads(filterItems(MockDB.getCalcLeads()));
    
    // For archive, we need to filter based on nested data too if possible, 
    // but ID prefix on the archive record itself is the primary mechanism
    setArchive(filterItems(MockDB.getArchive()));

    setBenchmarks(filterItems(MockDB.getBenchmarks('all')));
    setTeam(MockDB.getTeam()); // Team is usually kept as-is unless explicitly marked
    
    setPrompts({ 
      chatbot: MockDB.getPrompt('chatbot'), 
      analyzer: MockDB.getPrompt('analyzer'), 
      summarizer: MockDB.getPrompt('summarizer') 
    });
    setBrandingState(MockDB.getBranding());
    setEmailConfig(MockDB.getEmailConfig());
    setStandardConfig(MockDB.getStandardConfig());
    setSeriousConfig(MockDB.getSeriousConfig());
    if (seriousConfig.injuries.length > 0 && !selectedSeriousId) setSelectedSeriousId(seriousConfig.injuries[0].id);
    setDeathConfig(MockDB.getDeathConfig());
  };

  const openEmailFlow = (id: string, name: string, email: string, template: 'accept' | 'reject', type: ArchivedItem['type']) => {
    setEmailModal({ isOpen: true, name, email, template, sourceId: id, sourceType: type });
  };

  const handlePostSendAction = (action: 'archive' | 'delete') => {
    if (!emailModal.sourceId || !emailModal.sourceType) return;
    if (action === 'archive') {
      MockDB.archiveItem(emailModal.sourceId, emailModal.sourceType);
      loadData(); // REFRESH UI
    } else {
      // Trigger the safety warning modal
      setDeleteSafety({ id: emailModal.sourceId, type: emailModal.sourceType });
    }
  };

  const executeDelete = () => {
    if (!deleteSafety) return;
    const { id, type } = deleteSafety;
    
    if (type === 'inbox') MockDB.deleteMessage(id);
    else if (type === 'evidence') MockDB.deleteEvidence(id);
    else if (type === 'chats') MockDB.deleteChatTranscript(id);
    else if (type === 'calc_leads') MockDB.deleteCalcLead(id);
    
    setDeleteSafety(null);
    loadData(); // REFRESH UI
  };

  const handleAISummary = async (chat: ChatTranscript) => {
    if (loadingSummaries.has(chat.id) || summaries[chat.id]) return;
    setLoadingSummaries(prev => new Set(prev).add(chat.id));
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const transcriptText = chat.messages.map(m => `[${m.role.toUpperCase()}]: ${m.text}`).join('\n');
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `${MockDB.getPrompt('summarizer') || DEFAULT_SUMMARIZER_PROMPT}\n\nTranscript:\n${transcriptText}`,
      });
      setSummaries(prev => ({ ...prev, [chat.id]: response.text || "Summary failed." }));
    } catch (error) { setSummaries(prev => ({ ...prev, [chat.id]: "Error generating summary." })); } 
    finally { setLoadingSummaries(prev => { const next = new Set(prev); next.delete(chat.id); return next; }); }
  };

  const renderContent = () => {
    switch (tab) {
      case 'inbox': return <AdminInbox messages={messages} onDelete={(id) => setDeleteSafety({id, type:'inbox'})} onContact={(id,n,e,t) => openEmailFlow(id,n,e,t, 'inbox')} />;
      case 'evidence': return <AdminEvidenceHub evidence={evidence} onDelete={(id) => setDeleteSafety({id, type:'evidence'})} handleDownloadFile={(d,n,m) => { const link = document.createElement('a'); link.href = `data:${m};base64,${d}`; link.download = n; link.click(); }} onContact={(id,n,e,t) => openEmailFlow(id,n,e,t, 'evidence')} />;
      case 'chats': return <AdminChatTranscripts chats={chats} summaries={summaries} loadingSummaries={loadingSummaries} onDelete={(id) => setDeleteSafety({id, type:'chats'})} onSummarize={handleAISummary} onCopy={(c) => {}} onPrint={(c) => {}} goToEvidence={() => setTab('evidence')} onContact={(id,n,e,t) => openEmailFlow(id,n,e,t, 'chats')} />;
      case 'calc_leads': return <AdminCalculatorLeads leads={calcLeads} onDelete={(id) => setDeleteSafety({id, type:'calc_leads'})} onContact={(id,n,e,t) => openEmailFlow(id,n,e,t, 'calc_leads')} />;
      case 'archive': return <AdminArchive archive={archive} onRecover={(id) => { MockDB.recoverItem(id); loadData(); }} onDelete={(id) => { MockDB.deleteArchivedItem(id); loadData(); }} onClearAll={() => { MockDB.clearArchive(); loadData(); }} />;
      case 'bot_config': return <AdminBotConfig activePromptTab={activePromptTab} setPromptTab={setActivePromptTab} prompts={prompts} setPrompts={setPrompts} onSave={() => { MockDB.savePrompt('chatbot', prompts.chatbot); MockDB.savePrompt('analyzer', prompts.analyzer); MockDB.savePrompt('summarizer', prompts.summarizer); alert("Intelligence Deployed."); }} onReset={() => { }} />;
      case 'calc_tuning': return <AdminCalcTuning activeCalcSubtab={activeCalcSubtab} setActiveCalcSubtab={setActiveCalcSubtab} standardConfig={standardConfig} setStandardConfig={setStandardConfig} seriousConfig={seriousConfig} setSeriousConfig={setSeriousConfig} deathConfig={deathConfig} setDeathConfig={setDeathConfig} selectedSeriousId={selectedSeriousId} setSelectedSeriousId={setSelectedSeriousId} onSave={() => { MockDB.saveStandardConfig(standardConfig); MockDB.saveSeriousConfig(seriousConfig); alert("Multipliers Synced."); }} />;
      case 'benchmarks': return <AdminBenchmarks benchmarks={benchmarks} newAward={newAward} setNewAward={setNewAward} onAdd={() => { MockDB.addBenchmark(newAward.injuryId, newAward.text); setNewAward({...newAward, text: ''}); loadData(); }} onDelete={(id) => { MockDB.deleteBenchmark(id); loadData(); }} />;
      case 'branding': return <AdminBranding brandingState={brandingState} setBrandingState={setBrandingState} onSave={() => { MockDB.saveBranding(brandingState); alert("Branding updated."); }} handleLogoUpload={(e) => { const file = e.target.files?.[0]; if (file) { const reader = new FileReader(); reader.onloadend = () => setBrandingState({...brandingState, logoData: reader.result as string}); reader.readAsDataURL(file); } }} />;
      case 'comms': return <AdminComms emailConfig={emailConfig} setEmailConfig={setEmailConfig} onSave={() => { MockDB.saveEmailConfig(emailConfig); alert("Comms protocol synced."); }} />;
      case 'team': return <AdminTeam team={team} onUpdateName={(i,n) => { const next = [...team]; next[i].name = n; setTeam(next); }} onUpdateTitle={(i,t) => { const next = [...team]; next[i].title = t; setTeam(next); }} onUploadPhoto={(i,e) => {}} onSave={() => { MockDB.saveTeam(team); alert("Team updated."); }} />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col sm:flex-row animate-in fade-in duration-500 overflow-hidden">
      <AdminSidebar 
        activeTab={tab} setTab={setTab} 
        counts={{ 
          messages: messages.length, 
          evidence: evidence.length, 
          chats: chats.length, 
          calcLeads: calcLeads.length, 
          team: team.length, 
          benchmarks: benchmarks.length,
          archive: archive.length
        }} 
        firmName={brandingState.firmName} demoModeEnabled={demoModeEnabled} setDemoModeEnabled={setDemoModeEnabled} onLogout={onLogout} 
      />
      <main className="flex-1 p-4 sm:p-12 overflow-y-auto no-scrollbar relative">
        <div className="max-w-7xl mx-auto">{renderContent()}</div>
      </main>

      <AdminEmailModal 
        isOpen={emailModal.isOpen}
        onClose={() => setEmailModal({ ...emailModal, isOpen: false })}
        leadName={emailModal.name}
        leadEmail={emailModal.email}
        template={emailModal.template}
        firm={brandingState}
        onPostAction={handlePostSendAction}
      />

      <DeleteConfirmationModal 
        isOpen={!!deleteSafety}
        onClose={() => setDeleteSafety(null)}
        onConfirm={executeDelete}
        title={`ERASE ${deleteSafety?.type?.replace('_', ' ').toUpperCase() || 'DATA'}`}
        message="DANGER: This action is absolute. The selected record will be scrubbed from the database and the local cache immediately. This cannot be undone."
      />
    </div>
  );
};

export default AdminDashboard;
