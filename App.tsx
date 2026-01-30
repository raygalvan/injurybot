
import React, { useState, useEffect, useRef } from 'react';
import { 
  Phone, Bot, Calculator as CalcIcon, FileText, ClipboardList, 
  Home as HomeIcon, ShieldCheck, Scale, Zap, Menu, X, ArrowRight, Sparkles, Briefcase, Info, Users, ChevronUp, MessageSquare, Lock, MapPin, ExternalLink, Mail, HeartPulse, Skull, ChevronDown, User as UserIcon, Globe, ArrowLeft, ToggleLeft, ToggleRight
} from 'lucide-react';
import { INITIAL_TEAM } from './constants';
import { FirmId, AttorneyProfile, FirmBranding, Language } from './types';
import ChatBot from './components/ChatBot';
import Calculator from './components/Calculator';
import IntakeForm from './components/IntakeForm';
import EvidenceAnalyzer from './components/EvidenceAnalyzer';
import AboutViews from './components/AboutViews';
import MessageModal from './components/MessageModal';
import SeriousCalculator from './components/SeriousCalculator';
import WrongfulDeathCalculator from './components/WrongfulDeathCalculator';
import WrongfulDeathBeneficiaries from './components/WrongfulDeathBeneficiaries';
import AdminDashboard from './components/AdminDashboard';
import { MockDB } from './services/storage';
import { useDemoMode } from './useDemoMode';

type View = 'home' | 'chat' | 'calculator' | 'intake' | 'analyze' | 'aboutUs' | 'aboutBot' | 'seriousCalculator' | 'wrongfulDeath' | 'wrongfulDeathBeneficiaries' | 'admin_login' | 'admin_dashboard';

const App: React.FC = () => {
  const [view, setView] = useState<View>('home');
  const [language, setLanguage] = useState<Language>('en');
  const [firm, setFirm] = useState<FirmBranding>(MockDB.getBranding());
  const [selectedAttorney, setSelectedAttorney] = useState<AttorneyProfile>(INITIAL_TEAM[0]);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [isMessageModalGeneric, setIsMessageModalGeneric] = useState(true);
  const [teamMembers, setTeamMembers] = useState<AttorneyProfile[]>(INITIAL_TEAM);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isEstimatorDropdownOpen, setIsEstimatorDropdownOpen] = useState(false);
  const [isMobileEstimatorOpen, setIsMobileEstimatorOpen] = useState(false);
  const [isChatExpanded, setIsChatExpanded] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const { demoModeEnabled, setDemoModeEnabled } = useDemoMode();
  
  // Dynamic accent color based on branding (for Home)
  const accentColor = firm.primaryColor.replace('bg-', 'text-');

  // Rebranded Admin Credentials
  const [adminEmail, setAdminEmail] = useState('admin@injury.bot');
  const [adminPassword, setAdminPassword] = useState('123456');
  const [loginError, setLoginError] = useState('');

  useEffect(() => {
    MockDB.init();
    const currentBranding = MockDB.getBranding();
    setFirm(currentBranding);
    window.scrollTo(0, 0);
    
    const savedTeam = MockDB.getTeam();
    if (savedTeam && savedTeam.length > 0) {
      setTeamMembers(savedTeam);
      setSelectedAttorney(savedTeam[0]);
    } else {
      setTeamMembers(INITIAL_TEAM);
      setSelectedAttorney(INITIAL_TEAM[0]);
    }

    // Default chat to expanded on mobile
    if (view === 'chat' && window.innerWidth < 1024) {
      setIsChatExpanded(true);
    } else if (view !== 'chat') {
      setIsChatExpanded(false);
    }
  }, [view]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsEstimatorDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminEmail === 'admin@injury.bot' && adminPassword === '123456') {
      setView('admin_dashboard');
      setLoginError('');
    } else {
      setLoginError('Invalid administrator credentials.');
    }
  };

  const renderLogo = (size: number = 24, className?: string) => {
    if (firm.logoData) {
      return <img src={firm.logoData} alt={firm.firmName} style={{ height: size }} className={className} />;
    }
    return <Bot size={size} className={className || firm.logoColor} />;
  };

  const labels = {
    quickIntake: language === 'en' ? 'Quick Intake' : 'Consulta Rápida',
    injuryChat: language === 'en' ? 'Injury Chat' : 'Chat de Lesiones',
    injuryCalculator: language === 'en' ? 'Injury Calculator' : 'Calculadora de Lesiones',
    evidenceHub: language === 'en' ? 'Evidence Hub' : 'Centro de Evidencia',
    aboutUs: language === 'en' ? 'The Difference' : 'La Diferencia',
    chatWithBot: language === 'en' ? 'CHAT WITH THE BOT' : 'CHATEA CON EL BOT',
    talkToTeam: language === 'en' ? 'TALK TO THE TEAM' : 'HABLA CON EL EQUIPO',
    minorInjuries: language === 'en' ? 'Minor Injuries' : 'Lesiones Menores',
    seriousInjuries: language === 'en' ? 'Serious Injuries' : 'Lesiones Graves',
    lossOfLife: language === 'en' ? 'Loss of Life' : 'Pérdida de Vida',
    homeDashboard: language === 'en' ? 'Home Dashboard' : 'Panel de Inicio',
    credentials: language === 'en' ? 'Admin Portal' : 'Portal de Administración',
    contactRobert: language === 'en' ? 'Contact Robert' : 'Contactar a Robert'
  };

  const navigateTo = (newView: View) => {
    setView(newView);
    setIsMobileMenuOpen(false);
    setIsMobileEstimatorOpen(false);
    window.scrollTo(0, 0);
  };

  const renderView = () => {
    switch(view) {
      case 'home':
        return (
          <div className="animate-in fade-in duration-700 pb-24 no-scrollbar overflow-x-hidden w-full">
            <div className="relative pt-12 lg:pt-24 pb-20 text-center px-6 w-full">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1200px] h-[600px] bg-red-100/20 blur-[160px] rounded-full -z-10 pointer-events-none" />
              
              <button 
                onClick={() => setView('aboutUs')}
                className="inline-flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-full mb-10 shadow-sm animate-in slide-in-from-top-4 duration-1000 hover:scale-105 transition-all group active:scale-95"
              >
                <Sparkles size={14} className="text-red-600 fill-red-600 group-hover:rotate-12 transition-transform" />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">The injury.bot Difference</span>
              </button>
              
              <div className="flex flex-col items-center mb-6">
                <h1 className="text-7xl lg:text-[180px] font-black tracking-tighter leading-[0.8] text-slate-900 lowercase animate-in zoom-in-95 duration-1000">
                  injury<span className="text-slate-400">.bot</span>
                </h1>
              </div>
              
              <div className="text-[10px] sm:text-xs font-black uppercase tracking-[0.6em] text-slate-400 mb-10">
                {language === 'en' ? 'POWERED BY' : 'IMPULSADO POR'} {firm.firmName.toUpperCase()}
              </div>

              <p className="text-2xl lg:text-3xl text-slate-500 mb-16 max-w-4xl mx-auto font-medium leading-tight px-4 text-balance">
                {language === 'en' 
                  ? <>Cutting-edge technology meets <span className="text-slate-900 font-bold">{firm.attorney}'s</span> proven track record of fighting for the injured.</>
                  : <>Tecnología de vanguardia combinada con la trayectoria comprobada de <span className="text-slate-900 font-bold">{firm.attorney}</span> luchando por los heridos.</>
                }
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-32 px-4 max-w-4xl mx-auto">
                <button onClick={() => setView('chat')} className={`${firm.primaryColor} text-white w-full sm:flex-1 whitespace-nowrap px-10 py-6 rounded-2xl font-black text-2xl flex items-center justify-center gap-4 hover:scale-[1.02] transition-all shadow-2xl active:scale-95`}>
                  <Bot size={28} className="shrink-0" /> {labels.chatWithBot}
                </button>
                <button onClick={() => { setIsMessageModalGeneric(true); setIsMessageModalOpen(true); }} className="bg-white text-slate-900 border-2 border-slate-200 w-full sm:flex-1 whitespace-nowrap px-10 py-6 rounded-2xl font-black text-2xl flex items-center justify-center gap-4 hover:bg-slate-50 transition-all shadow-sm active:scale-95">
                  <Users size={28} className="shrink-0" /> {labels.talkToTeam}
                </button>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto px-4">
                {[
                  { id: 'chat', icon: <Bot />, label: labels.injuryChat, sub: language === 'en' ? "24/7 AI Triage" : "Triaje con IA 24/7", color: "bg-blue-600" },
                  { id: 'calculator', icon: <CalcIcon />, label: labels.injuryCalculator, sub: language === 'en' ? "Minor & Serious Claims" : "Reclamos Menores y Graves", color: "bg-emerald-600" },
                  { id: 'analyze', icon: <Briefcase />, label: labels.evidenceHub, sub: language === 'en' ? "Multi-Modal Analysis" : "Análisis Multimodal", color: "bg-indigo-600" },
                  { id: 'intake', icon: <ClipboardList />, label: labels.quickIntake, sub: language === 'en' ? "Fast Case Evaluation" : "Evaluación Rápida", color: "bg-slate-900" },
                ].map((item, idx) => (
                  <button 
                    key={item.id} 
                    onClick={() => setView(item.id as View)} 
                    className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all flex flex-col items-center gap-6 group border border-slate-100 animate-in fade-in slide-in-from-bottom-8"
                    style={{ animationDelay: `${idx * 150}ms` }}
                  >
                    <div className={`p-5 rounded-2xl ${item.color} text-white group-hover:rotate-6 transition-transform shadow-lg`}>{item.icon}</div>
                    <div className="text-center">
                      <div className="font-black text-lg mb-1 text-slate-900">{item.label}</div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{item.sub}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
      case 'admin_login':
        return (
          <div className="min-h-[70vh] flex items-center justify-center p-6 w-full max-w-7xl mx-auto">
            <div className="bg-white w-full max-w-md p-10 rounded-2xl shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-500">
              <div className="text-center mb-8">
                <div className="bg-red-800 text-white w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-xl">
                  <Lock size={32} />
                </div>
                <h2 className="text-3xl font-black tracking-tighter">Admin Portal</h2>
                <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest mt-1">{firm.firmName.toUpperCase()}</p>
              </div>
              <form onSubmit={handleAdminLogin} className="space-y-4">
                <input required type="email" placeholder="Administrator Email" value={adminEmail} onChange={e => setAdminEmail(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-6 py-4 font-bold outline-none focus:ring-2 focus:ring-red-800 transition-all" />
                <input required type="password" placeholder="Password" value={adminPassword} onChange={e => setAdminPassword(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-6 py-4 font-bold outline-none focus:ring-2 focus:ring-red-800 transition-all" />
                {loginError && <p className="text-red-500 text-xs font-bold text-center animate-pulse">{loginError}</p>}
                <button type="submit" className="w-full bg-red-800 text-white py-5 rounded-xl font-black text-xl shadow-xl hover:opacity-95 transition-all active:scale-95">LOG IN COMMAND CENTER</button>
              </form>
            </div>
          </div>
        );
      case 'admin_dashboard': return <AdminDashboard firm={firm} onLogout={() => setView('home')} />;
      case 'chat': return (
        <div className={`transition-all duration-500 ${isChatExpanded ? 'fixed inset-0 z-[60] bg-white h-dvh overflow-hidden pt-0' : 'h-[75vh] max-w-7xl mx-auto px-4 w-full'}`}>
          <ChatBot firm={firm} language={language} isExpanded={isChatExpanded} onToggleExpand={setIsChatExpanded} />
        </div>
      );
      case 'calculator': return <Calculator firm={firm} language={language} onSeriousClick={() => setView('seriousCalculator')} />;
      case 'intake': return <div className="max-w-7xl mx-auto px-4 w-full"><IntakeForm firm={firm} language={language} /></div>;
      case 'analyze': return <EvidenceAnalyzer firm={firm} language={language} />;
      case 'aboutUs': return <AboutViews firm={firm} language={language} />;
      case 'seriousCalculator': return <SeriousCalculator firm={firm} language={language} attorney={selectedAttorney} onBack={() => setView('calculator')} onWrongfulDeathClick={() => setView('wrongfulDeath')} />;
      case 'wrongfulDeath': return <WrongfulDeathCalculator firm={firm} language={language} attorney={selectedAttorney} onBack={() => setView('home')} onBeneficiariesClick={() => setView('wrongfulDeathBeneficiaries')} />;
      case 'wrongfulDeathBeneficiaries': return <WrongfulDeathBeneficiaries firm={firm} language={language} attorney={selectedAttorney} onBack={() => setView('wrongfulDeath')} />;
    }
  };

  if (view === 'admin_dashboard') return <AdminDashboard firm={firm} onLogout={() => setView('home')} />;

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-slate-100 no-scrollbar overflow-x-hidden relative">
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[100] bg-white animate-in slide-in-from-right duration-300 flex flex-col">
          <div className="p-6 flex items-center justify-between border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className={`${firm.primaryColor} w-8 h-8 rounded-lg flex items-center justify-center text-white`}>
                {firm.logoData ? <img src={firm.logoData} alt={firm.firmName} className="w-5 h-5 object-contain" /> : <Bot size={20} />}
              </div>
              <span className="font-black text-slate-900 tracking-tight lowercase">injury<span className="text-slate-400">.bot</span></span>
            </div>
            <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-slate-900"><X size={32} /></button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            <nav className="space-y-6">
              <button onClick={() => navigateTo('home')} className={`w-full text-left flex items-center gap-4 py-2 ${view === 'home' ? accentColor : 'text-slate-400'}`}>
                <HomeIcon size={24} className={view === 'home' ? accentColor : 'text-slate-400'} /> <span className="text-xl font-black uppercase tracking-widest">Home</span>
              </button>
              <button onClick={() => navigateTo('chat')} className={`w-full text-left flex items-center gap-4 py-2 ${view === 'chat' ? 'text-slate-900' : 'text-slate-400'}`}>
                <Bot size={24} className={view === 'chat' ? 'text-slate-900' : 'text-slate-400'} /> <span className="text-xl font-black uppercase tracking-widest">{labels.injuryChat}</span>
              </button>
              
              <div className="space-y-4">
                <div className={`flex items-center gap-4 py-2 text-slate-900`}>
                  <CalcIcon size={24} className="text-slate-900" /> <span className="text-xl font-black uppercase tracking-widest">{labels.injuryCalculator}</span>
                </div>
                {/* Mobile Submenu Flattened for 1-tap Access */}
                <div className="pl-10 space-y-4">
                  <button onClick={() => navigateTo('calculator')} className={`w-full text-left block text-sm font-black uppercase tracking-widest ${view === 'calculator' ? 'text-slate-900' : 'text-slate-400'}`}>{labels.minorInjuries}</button>
                  <button onClick={() => navigateTo('seriousCalculator')} className={`w-full text-left block text-sm font-black uppercase tracking-widest ${view === 'seriousCalculator' ? 'text-slate-900' : 'text-slate-400'}`}>{labels.seriousInjuries}</button>
                  <button onClick={() => navigateTo('wrongfulDeath')} className={`w-full text-left block text-sm font-black uppercase tracking-widest ${view === 'wrongfulDeath' ? 'text-slate-900' : 'text-slate-400'}`}>{labels.lossOfLife}</button>
                </div>
              </div>

              <button onClick={() => navigateTo('analyze')} className={`w-full text-left flex items-center gap-4 py-2 ${view === 'analyze' ? 'text-slate-900' : 'text-slate-400'}`}>
                <Briefcase size={24} className={view === 'analyze' ? 'text-slate-900' : 'text-slate-400'} /> <span className="text-xl font-black uppercase tracking-widest">{labels.evidenceHub}</span>
              </button>
              <button onClick={() => navigateTo('intake')} className={`w-full text-left flex items-center gap-4 py-2 ${view === 'intake' ? 'text-slate-900' : 'text-slate-400'}`}>
                <ClipboardList size={24} className={view === 'intake' ? 'text-slate-900' : 'text-slate-400'} /> <span className="text-xl font-black uppercase tracking-widest">{labels.quickIntake}</span>
              </button>
            </nav>

            <div className="pt-8 border-t border-slate-100 space-y-6">
              <button 
                onClick={() => { setLanguage(l => l === 'en' ? 'es' : 'en'); setIsMobileMenuOpen(false); }}
                className="w-full flex items-center justify-between p-4 bg-slate-50 rounded-2xl"
              >
                <div className="flex items-center gap-3">
                  <Globe size={20} className="text-slate-500" />
                  <span className="font-black text-sm uppercase tracking-widest text-slate-900">Language / Idioma</span>
                </div>
                <span className="bg-slate-900 text-white px-3 py-1 rounded-lg text-xs font-black uppercase">{language.toUpperCase()}</span>
              </button>

              <a href={`tel:${firm.phone}`} className={`${firm.primaryColor} text-white w-full p-5 rounded-2xl flex items-center justify-center gap-4 shadow-xl`}>
                <Phone size={24} fill="white" />
                <span className="text-xl font-black tracking-tight">{firm.phone}</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Hide Navbar when chat is expanded */}
      {!isChatExpanded && (
        <nav className="fixed top-0 left-0 w-full z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 px-4 sm:px-6 py-3 sm:py-4 shadow-sm">
          <div className="flex items-center w-full relative">
            
            <div className="flex-1 flex justify-start z-10">
              <div className="flex items-center gap-3 text-left">
                <button onClick={() => { setView('home'); setIsMobileMenuOpen(false); }} className={`${firm.primaryColor} w-10 h-10 rounded-xl flex items-center justify-center shadow-lg transition-all active:scale-95 text-white hover:scale-105`}>
                  {firm.logoData ? (
                    <img src={firm.logoData} alt={firm.firmName} className="w-6 h-6 object-contain" />
                  ) : (
                    <Bot size={24} />
                  )}
                </button>
                <button onClick={() => setView('home')} className="font-black text-slate-900 leading-none tracking-tight text-lg lowercase p-0 border-none bg-transparent m-0">
                  injury<span className="text-slate-400">.bot</span>
                </button>
              </div>
            </div>

            <div className="hidden lg:flex flex-1 justify-center items-center gap-10">
              <button onClick={() => setView('home')} className={`text-[10px] font-black uppercase tracking-widest transition-colors ${view === 'home' ? accentColor + ' border-b-2 border-current' : 'text-slate-400 hover:' + accentColor}`}>Home</button>
              <button onClick={() => setView('chat')} className={`text-[10px] font-black uppercase tracking-widest transition-colors ${view === 'chat' ? 'text-slate-900 border-b-2 border-slate-900' : 'text-slate-400 hover:text-slate-900'}`}>{labels.injuryChat}</button>
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setIsEstimatorDropdownOpen(!isEstimatorDropdownOpen)}
                  className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-1 transition-colors ${isEstimatorDropdownOpen || ['calculator', 'seriousCalculator', 'wrongfulDeath', 'wrongfulDeathBeneficiaries'].includes(view) ? 'text-slate-900' : 'text-slate-400 hover:text-slate-900'}`}
                >
                  {labels.injuryCalculator} <ChevronDown size={12} className={`transition-transform duration-300 ${isEstimatorDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                {isEstimatorDropdownOpen && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-56 bg-white border border-slate-100 rounded-xl shadow-2xl py-2 animate-in fade-in zoom-in-95 duration-200">
                    {[
                      { label: labels.minorInjuries, view: 'calculator' },
                      { label: labels.seriousInjuries, view: 'seriousCalculator' },
                      { label: labels.lossOfLife, view: 'wrongfulDeath' }
                    ].map(sub => (
                      <button 
                        key={sub.label}
                        onClick={() => { setView(sub.view as View); setIsEstimatorDropdownOpen(false); }}
                        className={`w-full px-6 py-3 text-left text-[11px] font-black uppercase tracking-widest transition-colors ${view === sub.view ? 'text-slate-900 bg-slate-50' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
                      >
                        {sub.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <button onClick={() => setView('analyze')} className={`text-[10px] font-black uppercase tracking-widest transition-colors ${view === 'analyze' ? 'text-slate-900 border-b-2 border-slate-900' : 'text-slate-400 hover:text-slate-900'}`}>{labels.evidenceHub}</button>
              <button onClick={() => setView('intake')} className={`text-[10px] font-black uppercase tracking-widest transition-colors ${view === 'intake' ? 'text-slate-900 border-b-2 border-slate-900' : 'text-slate-400 hover:text-slate-900'}`}>{labels.quickIntake}</button>
            </div>

            <div className="flex-1 flex justify-end items-center gap-3 z-10">
              <button 
                  onClick={() => setLanguage(l => l === 'en' ? 'es' : 'en')}
                  className="hidden lg:flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-500 hover:text-slate-900 transition-all font-black text-[10px] uppercase tracking-widest"
              >
                  <Globe size={14} /> {language.toUpperCase()}
              </button>
              <a href={`tel:${firm.phone}`} className={`hidden lg:flex items-center gap-3 ${firm.primaryColor} px-6 py-3 rounded-full text-white shadow-lg hover:scale-105 transition-all active:scale-95 group`}>
                  <Phone size={18} fill="white" />
                  <span className="text-sm font-black tracking-tight">{firm.phone}</span>
              </a>
              <a href={`tel:${firm.phone}`} className={`lg:hidden ${firm.primaryColor} w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg`}>
                <Phone size={18} fill="white" />
              </a>
              <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden text-slate-900 p-2"><Menu size={28} /></button>
            </div>
          </div>
        </nav>
      )}

      {/* Remove padding when chat is expanded */}
      <main className={`flex-1 w-full no-scrollbar ${isChatExpanded ? 'pt-0' : 'pt-32 sm:pt-40 pb-8'}`}>
        {renderView()}
      </main>

      {/* Hide Footer when chat is expanded */}
      {!isChatExpanded && (
        <footer className="bg-slate-950 text-white pt-24 pb-12 px-6 relative z-30 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-800/50 to-transparent" />
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-20">
              <div className="space-y-6 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-3">
                  <div className={`${firm.primaryColor} p-2 rounded-xl`}>{renderLogo(24, "text-white")}</div>
                  <span className="font-black text-2xl tracking-tighter lowercase">injury<span className="text-slate-500">.bot</span></span>
                </div>
                <p className="text-slate-400 text-sm leading-relaxed font-medium">Proprietary legal intelligence protocol developed for the {firm.firmName}.</p>
                <div className="space-y-3">
                  <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">Version 2.4.0 Final</p>
                  
                  {/* Footer Demo Toggle */}
                  <button 
                    onClick={() => setDemoModeEnabled(!demoModeEnabled)}
                    className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all ${demoModeEnabled ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-500' : 'bg-white/5 border-white/10 text-slate-500'}`}
                  >
                    <Sparkles size={10} className={demoModeEnabled ? 'animate-pulse' : ''} />
                    <span className="text-[9px] font-black uppercase tracking-widest">{demoModeEnabled ? 'Live Demo On' : 'Standard Mode'}</span>
                  </button>
                </div>
              </div>

              <div className="space-y-6 text-center md:text-left">
                <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-red-500">{language === 'en' ? 'Navigation' : 'Navegación'}</h4>
                <ul className="space-y-4">
                  {[
                    { label: labels.injuryChat, view: 'chat' },
                    { label: labels.injuryCalculator, view: 'calculator' },
                    { label: labels.evidenceHub, view: 'analyze' },
                    { label: labels.quickIntake, view: 'intake' },
                    { label: labels.aboutUs, view: 'aboutUs' },
                    { label: labels.credentials, view: 'admin_login' },
                  ].map((link) => (
                    <li key={link.label}>
                      <button onClick={() => setView(link.view as View)} className="text-slate-400 hover:text-white font-bold text-sm transition-colors flex items-center justify-center md:justify-start gap-2 group mx-auto md:mx-0">
                        <ArrowRight size={12} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />{link.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-6 text-center md:text-left">
                <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-red-500">{language === 'en' ? 'Office Location' : 'Oficina'}</h4>
                <div className="space-y-6">
                  {(firm.offices && firm.offices.length > 0) ? firm.offices.map((office) => (
                    <div key={office.id} className="flex flex-col md:flex-row items-center md:items-start gap-4">
                      <MapPin size={18} className="text-red-500 shrink-0 mt-1" />
                      <div>
                        <p className="font-black text-sm uppercase tracking-widest">{office.name}</p>
                        <p className="text-[11px] text-slate-500 font-medium leading-relaxed whitespace-pre-line">{office.details}</p>
                      </div>
                    </div>
                  )) : (
                    <p className="text-xs text-slate-500 italic">Office location pending.</p>
                  )}
                </div>
              </div>

              <div className="space-y-6 text-center">
                <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-red-500">{labels.contactRobert}</h4>
                <div className="flex flex-wrap justify-center gap-4 max-w-[200px] mx-auto">
                  {teamMembers.slice(0, 6).map((member) => (
                    <button key={member.id} onClick={() => { setSelectedAttorney(member); setIsMessageModalGeneric(false); setIsMessageModalOpen(true); }} className="group flex flex-col items-center gap-2">
                      <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center font-black text-xs text-slate-400 group-hover:bg-red-800 group-hover:text-white group-hover:border-red-500 transition-all overflow-hidden group-hover:-translate-y-1 group-active:scale-95">
                        {member.photoData ? <img src={member.photoData} alt={member.name} className="w-full h-full object-cover" /> : member.initials}
                      </div>
                      <span className="text-[8px] font-black uppercase text-slate-600 group-hover:text-slate-300 transition-colors text-center leading-none truncate max-w-[64px]">{member.name.split(' ')[0]}</span>
                    </button>
                  ))}
                </div>
                <div className="pt-6 border-t border-white/5 flex flex-col items-center gap-2">
                  <a href={`tel:${firm.phone}`} className="flex items-center gap-3 text-white font-black text-lg hover:text-red-500 transition-colors"><Phone size={20} fill="currentColor" className="text-red-500" />{firm.phone}</a>
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">{language === 'en' ? '24/7 Client Response Line' : 'Línea de Respuesta 24/7'}</p>
                </div>
              </div>
            </div>
          </div>
        </footer>
      )}

      {isMessageModalOpen && <MessageModal attorney={selectedAttorney} firm={firm} language={language} isGeneric={isMessageModalGeneric} onClose={() => setIsMessageModalOpen(false)} />}
    </div>
  );
};

export default App;
