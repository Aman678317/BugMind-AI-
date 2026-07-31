'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Loader2 } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatInterfaceProps {
  projectId: string;
}

export default function ChatInterface({ projectId }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Hello! I'm BugMind. I've analyzed your repository and I'm ready to help you investigate bugs or answer questions about the architecture. What would you like to know?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    try {
      const res = await fetch(`http://localhost:8000/api/v1/projects/${projectId}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          session_id: sessionId,
          message: userMsg 
        })
      });

      if (res.ok) {
        const data = await res.json();
        setSessionId(data.session_id);
        setMessages(prev => [...prev, data.message]);
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: "**Error:** Failed to reach the API." }]);
      }
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'assistant', content: "**Error:** Network failure." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] max-w-4xl mx-auto bg-bg-surface border border-border-subtle rounded-xl overflow-hidden shadow-lg">
      
      {/* Header */}
      <div className="px-6 py-4 border-b border-border-subtle bg-bg-base flex justify-between items-center">
        <div>
          <h2 className="font-semibold text-lg">Bug Investigation Chat</h2>
          <p className="text-xs text-text-secondary">AI Assistant Context: Active</p>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-bg-base">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            {/* Avatar */}
            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
              msg.role === 'user' ? 'bg-accent-primary text-white' : 'bg-bg-surface border border-border-subtle text-accent-primary'
            }`}>
              {msg.role === 'user' ? <User size={20} /> : <Bot size={20} />}
            </div>

            {/* Bubble */}
            <div className={`max-w-[80%] rounded-2xl px-5 py-3 ${
              msg.role === 'user' 
                ? 'bg-accent-primary text-white rounded-tr-sm' 
                : 'bg-bg-surface border border-border-subtle text-text-primary rounded-tl-sm'
            }`}>
              {/* For Sprint 7 we just use raw text. Next sprint we can use React Markdown */}
              <pre className="whitespace-pre-wrap font-sans text-sm m-0 p-0 bg-transparent border-none">
                {msg.content}
              </pre>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-bg-surface border border-border-subtle text-accent-primary flex items-center justify-center shrink-0">
              <Bot size={20} />
            </div>
            <div className="bg-bg-surface border border-border-subtle rounded-2xl rounded-tl-sm px-5 py-4 flex items-center gap-2">
              <Loader2 size={16} className="animate-spin text-accent-primary" />
              <span className="text-sm text-text-secondary italic">BugMind is thinking...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-bg-surface border-t border-border-subtle">
        <div className="relative flex items-center">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            disabled={isLoading}
            placeholder="Describe the bug or ask a question..."
            className="w-full bg-bg-base border border-border-subtle rounded-lg pl-4 pr-12 py-4 text-sm focus:outline-none focus:border-accent-primary transition-colors disabled:opacity-50"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="absolute right-2 p-2 rounded-md bg-accent-primary text-white hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <Send size={18} />
          </button>
        </div>
        <p className="text-center text-[10px] text-text-secondary mt-2">
          BugMind AI can make mistakes. Consider verifying critical information.
        </p>
      </div>

    </div>
  );
}
