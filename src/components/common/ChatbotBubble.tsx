import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Bot,
  Trash2,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  source?: string;
  timestamp: string;
}

export const ChatbotBubble: React.FC = () => {
  const { language } = useLanguage();
  const isBn = language === 'bn';

  const [isOpen, setIsOpen] = useState(false);
  const [apiKey] = useState<string>(() => {
    return (
      localStorage.getItem('vumiseba_gemini_api_key') ||
      import.meta.env.VITE_GEMINI_API_KEY ||
      'AQ.Ab8RN6KBMQy9Pu5DIOJVEdw5I4NERFMZJfUEnFC8mBCOwhnwdw'
    );
  });

  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    return [
      {
        id: 'welcome-1',
        role: 'assistant',
        content: isBn
          ? 'আসসালামু আলাইকুম! আমি ভূমিসেবা এআই সহায়ক (Google Gemini চালিত)। জমি ক্রয়-বিক্রয়, নামজারি (ই-নামজারি), খতিয়ান যাচাই ও আইনি পরামর্শের জন্য আমাকে যেকোনো প্রশ্ন করতে পারেন।'
          : 'Hello! I am VumiSeba AI Land Assistant (powered by Google Gemini). Ask me anything about Bangladesh land records, e-mutation, safe land purchases, or khatian verification.',
        source: 'VumiSeba Assistant',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ];
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages update or panel opens
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Pre-crafted quick query chips
  const quickChips = isBn
    ? [
        'বায়না করার আগে জমি কীভাবে যাচাই করব?',
        'ই-নামজারি হতে কতদিন সময় লাগে?',
        'খতিয়ানে হিস্যা ঘাটতি থাকলে কী হয়?',
        '১-ক্লিক ডেমো অ্যাকাউন্ট কীভাবে ব্যবহার করব?',
      ]
    : [
        'How to verify land before earnest money?',
        'How long does e-mutation take?',
        'What if there is a share discrepancy?',
        'How do the 1-click demo accounts work?',
      ];

  const handleSendMessage = async (textToSend?: string) => {
    const message = (textToSend || inputMessage).trim();
    if (!message || loading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: message,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setLoading(true);

    try {
      // Send message to backend Gemini endpoint
      const res = await fetch('/api/chat/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          apiKey: apiKey || undefined,
          history: messages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      const data = await res.json();

      if (data.success && data.reply) {
        const assistantMsg: ChatMessage = {
          id: `bot-${Date.now()}`,
          role: 'assistant',
          content: data.reply,
          source: data.source?.startsWith('google') ? 'Gemini 2.5 Flash' : 'VumiSeba Smart Engine',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, assistantMsg]);
      } else {
        throw new Error(data.error || 'Failed to get AI response');
      }
    } catch (err: any) {
      console.error('Chat error:', err);
      const fallbackMsg: ChatMessage = {
        id: `bot-err-${Date.now()}`,
        role: 'assistant',
        content: isBn
          ? 'দুঃখিত, এআই সেবায় সংযোগে সাময়িক সমস্যা হয়েছে। অনুগ্রহ করে কিছুক্ষণ পর পুনরায় চেষ্টা করুন।'
          : 'Sorry, temporary connection issue with the AI assistant. Please try again in a moment.',
        source: 'Error Notice',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: 'welcome-reset',
        role: 'assistant',
        content: isBn
          ? 'কথোপকথন রিসেট হয়েছে। জমি সম্পর্কিত যেকোনো প্রশ্ন জিজ্ঞেস করতে পারেন!'
          : 'Conversation cleared. Feel free to ask anything about land records or mutation!',
        source: 'VumiSeba Assistant',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  return (
    <div className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50 font-sans">
      {/* 1. Floating Circular Trigger Bubble */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative w-14 h-14 rounded-full bg-gradient-to-tr from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-xl hover:shadow-2xl hover:shadow-emerald-500/40 transition-all duration-300 transform hover:-translate-y-1 active:scale-95 border-2 border-white/30 flex items-center justify-center"
          aria-label="Open AI Land Assistant"
          title={isBn ? 'ভূমিসেবা এআই সহায়ক (Gemini)' : 'VumiSeba AI Land Assistant (Gemini)'}
        >
          {/* Active Live Pulse Indicator Dot */}
          <span className="absolute top-0.5 right-0.5 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-80"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-400 border-2 border-white dark:border-slate-900"></span>
          </span>

          {/* Bot Icon */}
          <Bot size={25} className="text-white group-hover:scale-110 transition-transform duration-300 drop-shadow-sm" />
        </button>
      )}

      {/* 2. Expanded Floating Chat Window */}
      {isOpen && (
        <div className="w-[92vw] sm:w-[410px] h-[560px] max-h-[85vh] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200 transition-colors">
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white p-3.5 sm:p-4 flex items-center justify-between border-b border-emerald-900/40 shrink-0">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center font-bold shadow-md shrink-0 border border-emerald-400/40">
                <Bot size={20} />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className="font-extrabold text-xs sm:text-sm text-white truncate">
                    {isBn ? 'ভূমিসেবা এআই সহায়ক' : 'VumiSeba AI Assistant'}
                  </h3>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
                </div>
                <p className="text-[10px] text-emerald-200/90 truncate flex items-center gap-1 font-medium">
                  <Sparkles size={11} className="text-yellow-300" />
                  <span>Google Gemini Studio API</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0 text-slate-300">
              {/* Clear History */}
              <button
                type="button"
                onClick={handleClearHistory}
                title={isBn ? 'কথোপকথন পরিষ্কার করুন' : 'Clear Chat'}
                className="p-1.5 hover:bg-white/10 rounded-lg transition text-slate-400 hover:text-white"
              >
                <Trash2 size={16} />
              </button>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                title={isBn ? 'বন্ধ করুন' : 'Close'}
                className="p-1.5 hover:bg-white/10 rounded-lg transition text-slate-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-3.5 space-y-3 bg-slate-50/50 dark:bg-slate-950/40 text-xs">
            {messages.map((m) => {
              const isUser = m.role === 'user';
              return (
                <div
                  key={m.id}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 leading-relaxed shadow-2xs ${
                      isUser
                        ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-br-xs'
                        : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200/80 dark:border-slate-700/80 rounded-bl-xs'
                    }`}
                  >
                    <div className="whitespace-pre-wrap break-words">{m.content}</div>
                  </div>

                  <div className="flex items-center gap-1.5 text-[9.5px] text-slate-400 px-1">
                    <span>{m.timestamp}</span>
                    {m.source && (
                      <>
                        <span>•</span>
                        <span className="text-emerald-700 dark:text-emerald-400 font-semibold">{m.source}</span>
                      </>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Typing Loading Indicator */}
            {loading && (
              <div className="flex items-center gap-2 p-2.5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 w-24">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce"></div>
                <div className="w-2 h-2 rounded-full bg-teal-500 animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-2 h-2 rounded-full bg-cyan-500 animate-bounce [animation-delay:0.4s]"></div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Query Suggestion Chips */}
          <div className="p-2 border-t border-slate-100 dark:border-slate-800/80 bg-white dark:bg-slate-900 shrink-0">
            <div className="flex gap-1.5 overflow-x-auto no-scrollbar py-0.5">
              {quickChips.map((chip, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSendMessage(chip)}
                  disabled={loading}
                  className="shrink-0 text-[10px] font-medium px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950 text-slate-700 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-300 border border-slate-200 dark:border-slate-700 transition"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>

          {/* Chat Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2 shrink-0"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={isBn ? 'জমিসংক্রান্ত যেকোনো প্রশ্ন লিখুন...' : 'Ask anything about land records...'}
              className="flex-1 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
              disabled={loading}
            />

            <button
              type="submit"
              disabled={!inputMessage.trim() || loading}
              className="p-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl shadow-xs transition shrink-0 active:scale-95"
              title={isBn ? 'পাঠান' : 'Send'}
            >
              <Send size={15} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatbotBubble;
