'use client';

import { useChat, UIMessage } from '@ai-sdk/react';

import ReactMarkdown from 'react-markdown';
import { Send, Bot, User, Loader2, MessageCircle, X, Minimize2, Maximize2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

// Helper to safely get text content from a message
const getMessageContent = (m: UIMessage & { content?: string }) => {
  if (m.content) return m.content;
  if (!m.parts) return '';
  return m.parts
    .filter(part => part.type === 'text')
    .map(part => part.text)
    .join('');
};

export default function ChatPage() {

  // Custom state management since useChat is failing
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<Error | undefined>(undefined);
  const status = isLoading ? 'streaming' : 'ready';

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { id: Date.now().toString(), role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({ role: m.role, content: getMessageContent(m) }))
        }),
      });

      if (!response.ok) throw new Error(response.statusText);

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No reader available');

      // Create a placeholder for the assistant response
      const assistantMessageId = Date.now().toString() + '-a';
      setMessages(prev => [...prev, { id: assistantMessageId, role: 'assistant', content: '' }]);

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (!line.trim()) continue;

          // Parse Vercel Data Stream Protocol: 0:"content"
          const match = line.match(/^0:(.*)$/);
          if (match) {
            try {
              const textContent = JSON.parse(match[1]);
              setMessages(prev => prev.map(m =>
                m.id === assistantMessageId
                  ? { ...m, content: (m.content || '') + textContent }
                  : m
              ));
            } catch (e) {
              console.error('Error parsing chunk:', line);
            }
          }
        }
      }
    } catch (error: any) {
      console.error('Chat error:', error);
      setError(error);
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'system', content: 'Error: Failed to fetch response.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (

    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-4">
      {/* Chat Window */}
      <div
        className={`${isOpen ? 'flex' : 'hidden'
          } flex-col w-[400px] h-[600px] bg-gray-950 border border-gray-800 rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 ease-in-out`}
      >
        {/* Header */}
        <header className="px-6 py-4 border-b border-gray-800 bg-gray-900/80 backdrop-blur-md flex items-center justify-between shadow-sm shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center border border-blue-500/20">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-sm font-semibold tracking-tight text-gray-100">FastAPI Assistant</h1>
              <div className="flex items-center gap-1.5">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span>
                </span>
                <span className="text-[10px] text-gray-400 font-medium">Online</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-400 hover:text-white transition-colors p-1 rounded-md hover:bg-gray-800"
          >
            <X className="w-4 h-4" />
          </button>
        </header>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 scroll-smooth">
          <div className="space-y-6">
            {messages.length === 0 && (
              <div className="text-center text-gray-500 mt-20 animate-in fade-in zoom-in duration-500">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-900 rounded-2xl flex items-center justify-center shadow-inner ring-1 ring-gray-800">
                  <Bot className="w-8 h-8 text-gray-600" />
                </div>
                <h2 className="text-lg font-bold text-gray-300 mb-1">Hello!</h2>
                <p className="text-xs text-gray-500 max-w-[200px] mx-auto">
                  I'm connected to your local FastAPI backend.
                </p>
              </div>
            )}

            {messages.map((m) => {
              const content = getMessageContent(m);
              // Split by blank lines (newline followed by optional whitespace followed by newline)
              // This handles \n\n, \n \n, \n\t\n, etc.
              const bubbles = content
                .split(/\n\s*\n/)
                .filter((b: string) => {
                  // Filter out strings that are empty or contain only invisible characters/whitespace
                  // [\p{C}\p{Z}] covers control characters and separators in unicode
                  // But standard .trim() + replace for zero-width spaces is usually robust enough
                  return b.trim().replace(/[\u200B-\u200D\uFEFF]/g, '').length > 0;
                });

              if (bubbles.length === 0) return null;

              return (
                <div
                  key={m.id}
                  className={`flex gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300 ${m.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                >
                  {m.role !== 'user' && (
                    <div className="w-6 h-6 rounded-lg bg-gray-800/50 border border-gray-700/50 flex items-center justify-center shrink-0 mt-0.5">
                      <Bot className="w-3.5 h-3.5 text-gray-400" />
                    </div>
                  )}

                  <div className={`flex flex-col gap-2 max-w-[85%] ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                    {bubbles.map((bubble: string, i: number) => (
                      <div
                        key={i}
                        className={`rounded-2xl px-4 py-2.5 shadow-sm text-sm w-fit ${m.role === 'user'
                          ? 'bg-blue-600 text-white rounded-br-none'
                          : 'bg-gray-900 border border-gray-800 text-gray-100 rounded-bl-none'
                          }`}
                      >
                        {m.role === 'user' ? (
                          <p className="leading-relaxed whitespace-pre-wrap">{bubble}</p>
                        ) : (
                          <div className="prose prose-invert prose-sm max-w-none prose-p:leading-relaxed prose-pre:bg-gray-950 prose-pre:border prose-pre:border-gray-800 prose-p:text-sm prose-pre:text-xs">
                            <ReactMarkdown>{bubble}</ReactMarkdown>
                          </div>
                        )}
                      </div>
                    ))}
                    {/* Name label for bot at the bottom of the group if desired, currently using avatar on left */}
                  </div>
                </div>
              )
            })}

            {isLoading && (
              <div className="flex justify-start gap-3 animate-in fade-in duration-300">
                <div className="w-6 h-6 rounded-lg bg-gray-800/50 border border-gray-700/50 flex items-center justify-center shrink-0">
                  <Bot className="w-3.5 h-3.5 text-gray-400" />
                </div>
                <div className="bg-gray-900 border border-gray-800 rounded-2xl rounded-bl-none px-4 py-3 flex items-center gap-2">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-500" />
                  <span className="text-xs text-gray-400 font-medium tracking-wide">Thinking...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} className="h-2" />
          </div>
        </div>

        {/* Input Area */}
        <div className="bg-gray-950 border-t border-gray-800 p-4 shrink-0">
          <form onSubmit={handleSubmit} className="relative flex gap-2 items-center">
            <input
              className="w-full bg-gray-900 text-gray-100 border border-gray-800 rounded-xl pl-4 pr-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all shadow-lg placeholder-gray-500"
              value={input}
              placeholder="Type a message..."
              onChange={handleInputChange}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="absolute right-1.5 p-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg disabled:opacity-0 disabled:scale-95 transition-all duration-200 shadow-lg shadow-blue-500/20"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <div className="text-center mt-2">
            <p className="text-[10px] text-gray-600 font-medium">AI can make mistakes.</p>
          </div>
        </div>
      </div>

      {/* Launcher Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-blue-600 hover:bg-blue-500 text-white rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 group"
      >
        <div className="relative">
          {isOpen ? (
            <Minimize2 className="w-7 h-7 transition-transform duration-300 group-hover:rotate-90" />
          ) : (
            <MessageCircle className="w-7 h-7" />
          )}
          {!isOpen && (
            <span className="absolute top-0 right-0 -mt-1 -mr-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border border-blue-600"></span>
            </span>
          )}
        </div>
      </button>

    </div>
  );
}
