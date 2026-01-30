
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import { streamExpertChat } from '../services/gemini';
import { FirmBranding, Language } from '../types';
import { MockDB } from '../services/storage';

interface Message {
  role: 'bot' | 'user';
  text: string;
  isTyping?: boolean;
}

interface ChatBotProps {
  firm: FirmBranding;
  language: Language;
  isExpanded?: boolean;
  onToggleExpand?: (val: boolean) => void;
}

const TypingIndicator = () => (
  <div className="flex gap-1 px-1 py-1">
    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full typing-dot"></div>
    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full typing-dot"></div>
    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full typing-dot"></div>
  </div>
);

const ChatBot: React.FC<ChatBotProps> = ({ firm, language, isExpanded = false, onToggleExpand }) => {
  const getInitialBotMsg = () => {
    return language === 'en' 
      ? `Hello! I'm injury.bot, the AI legal assistant for ${firm.attorney}. How can I help you with your case today?`
      : `¡Hola! Soy injury.bot, el asistente legal de IA de ${firm.attorney}. ¿Cómo puedo ayudarle con su caso hoy?`;
  };

  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', text: getInitialBotMsg() }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const messagesRef = useRef<Message[]>(messages);

  // Real-time language conversion for the initial greeting
  useEffect(() => {
    setMessages(prev => {
      // Only auto-translate the first message if the user hasn't started a conversation yet
      if (prev.length === 1 && prev[0].role === 'bot') {
        return [{ role: 'bot', text: getInitialBotMsg() }];
      }
      return prev;
    });
  }, [language, firm.attorney]);

  useEffect(() => {
    messagesRef.current = messages;
    if (messages.length > 1) {
      scrollRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [messages]);

  useEffect(() => {
    return () => {
      const finalMessages = messagesRef.current;
      if (finalMessages.length > 2) {
        const firstUserMessage = finalMessages.find(m => m.role === 'user')?.text || 'Inquiry';
        MockDB.saveChatTranscript({
          subject: firstUserMessage.slice(0, 40) + '...',
          messages: finalMessages.map(m => ({ role: m.role, text: m.text }))
        });
      }
    };
  }, []);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    const chatHistory = messages
      .filter(m => !m.isTyping && m.text.trim() !== '')
      .map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.text }]
      }));

    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setInput('');
    setIsLoading(true);
    setMessages(prev => [...prev, { role: 'bot', text: '', isTyping: true }]);

    try {
      const result = await streamExpertChat(userMessage, firm.attorney, language, chatHistory);
      let fullResponse = '';
      let hasStartedStreaming = false;
      
      for await (const chunk of result) {
        if (!hasStartedStreaming) {
          hasStartedStreaming = true;
          setMessages(prev => {
            const next = [...prev];
            if (next[next.length - 1].role === 'bot') {
              next[next.length - 1].isTyping = false;
            }
            return next;
          });
        }
        const text = chunk.text;
        fullResponse += text;
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1].text = fullResponse;
          return newMessages;
        });
      }
    } catch (error) {
      setMessages(prev => {
        const next = [...prev];
        const last = next[next.length - 1];
        if (last.role === 'bot') {
          last.isTyping = false;
          last.text = language === 'en' 
            ? "I'm sorry, I'm having trouble connecting right now. Please call our office directly at " + firm.phone
            : "Lo siento, tengo problemas para conectarme ahora mismo. Por favor, llame directamente a nuestra oficina al " + firm.phone;
        }
        return next;
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`flex flex-col ${isExpanded ? 'h-dvh' : 'h-[70vh] lg:h-full'} bg-white ${isExpanded ? 'rounded-none' : 'rounded-t-3xl lg:rounded-xl'} shadow-2xl overflow-hidden border border-slate-200 mobile-chat-container transition-all duration-500`}>
      {/* Fixed Header */}
      <div className={`${firm.primaryColor} p-4 text-white flex items-center justify-between shrink-0 z-20`}>
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-lg">
            <Bot size={20} className={firm.secondaryColor} />
          </div>
          <div>
            <h3 className="font-bold text-sm lowercase tracking-tighter">injury.bot</h3>
            <p className="text-[10px] opacity-75 uppercase tracking-widest leading-none">
              {language === 'en' ? 'Active Intelligence' : 'Inteligencia Activa'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
           <div className="hidden lg:flex px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 rounded-full items-center gap-2">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[8px] font-black uppercase tracking-widest">Encrypted Line</span>
           </div>
           
           <button 
             onClick={() => onToggleExpand?.(!isExpanded)}
             className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all shadow-sm active:scale-90"
             title={isExpanded ? "Collapse View" : "Expand View"}
           >
             {isExpanded ? <ChevronDown size={22} className="text-white" /> : <ChevronUp size={22} className="text-white" />}
           </button>
        </div>
      </div>

      {/* Scrollable Message Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 no-scrollbar overscroll-contain bg-slate-50/30">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'bot' ? 'justify-start' : 'justify-end'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
            <div className={`max-w-[90%] lg:max-w-[80%] flex gap-3 ${m.role === 'bot' ? 'flex-row' : 'flex-row-reverse'}`}>
              <div className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center shadow-sm ${m.role === 'bot' ? 'bg-white text-slate-400 border border-slate-200' : firm.primaryColor + ' text-white'}`}>
                {m.role === 'bot' ? <Bot size={16} /> : <User size={16} />}
              </div>
              <div className={`p-4 rounded-2xl text-[16px] leading-relaxed shadow-sm ${m.role === 'bot' ? 'bg-white text-slate-800 rounded-tl-none border border-slate-100' : firm.primaryColor + ' text-white rounded-tr-none'}`}>
                {m.isTyping ? <TypingIndicator /> : m.text}
              </div>
            </div>
          </div>
        ))}
        <div ref={scrollRef} className="h-4" />
      </div>

      {/* Fixed Input Bar */}
      <div className="p-4 border-t border-slate-200 bg-white sticky bottom-0 z-20 shadow-[0_-10px_40px_rgba(0,0,0,0.03)] pb-safe">
        <div className="flex gap-2 max-w-5xl mx-auto">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={language === 'en' ? "Describe your accident..." : "Describa su accidente..."}
            className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-[16px] font-medium focus:ring-2 focus:ring-slate-900 focus:bg-white outline-none transition-all placeholder:text-slate-400"
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className={`${firm.primaryColor} text-white p-4 rounded-2xl hover:opacity-90 transition-all disabled:opacity-30 shadow-lg active:scale-95 shrink-0`}
          >
            {isLoading ? <Loader2 size={24} className="animate-spin" /> : <Send size={24} />}
          </button>
        </div>
        <p className="text-[8px] text-center text-slate-400 font-bold uppercase tracking-widest mt-3 opacity-60">
          AI Legal Triage Protocol • {firm.firmName}
        </p>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @media (max-width: 1024px) {
          .mobile-chat-container:not(.h-dvh) {
            height: calc(100dvh - 72px) !important;
            border-radius: 0 !important;
            border: none !important;
          }
          .mobile-chat-container.h-dvh {
             border: none !important;
             border-radius: 0 !important;
          }
        }
        .pb-safe {
          padding-bottom: max(1rem, env(safe-area-inset-bottom));
        }
      `}} />
    </div>
  );
};

export default ChatBot;
