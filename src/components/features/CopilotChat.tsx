'use client';

import React, { useState } from 'react';
import { useChat } from 'ai/react';
import { Bot, User, Send, X, MessageCircle } from 'lucide-react';

interface CopilotChatProps {
  meetingId?: string;
}

export default function CopilotChat({ meetingId }: CopilotChatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/ai/chat',
    body: { meetingId }
  });

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-[--color-rd-navy] text-white p-4 rounded-full shadow-2xl hover:scale-105 transition-transform flex items-center justify-center z-50"
      >
        <MessageCircle className="w-6 h-6" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 h-[32rem] bg-surface rounded-2xl shadow-2xl border border-[--color-outline-variant] flex flex-col z-50 overflow-hidden">
      {/* Header */}
      <div className="bg-[--color-rd-navy] p-4 text-white flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-[--color-rd-cyan]" />
          <h3 className="font-semibold">Dra. Conte Copilot</h3>
        </div>
        <button onClick={() => setIsOpen(false)} className="text-white/70 hover:text-white">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-background">
        {messages.length === 0 && (
          <div className="text-center text-[--color-on-surface-variant] text-sm mt-10">
            Olá, Doutor! Posso te ajudar a relembrar o prontuário deste paciente ou tirar dúvidas médicas?
          </div>
        )}
        {messages.map(m => (
          <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
              m.role === 'user' 
                ? 'bg-[--color-rd-navy] text-white rounded-tr-sm' 
                : 'bg-white border border-[--color-outline-variant] text-[--color-on-surface] rounded-tl-sm shadow-sm'
            }`}>
              {m.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
             <div className="bg-white border border-[--color-outline-variant] p-3 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
             </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t border-[--color-outline-variant]">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <input
            value={input}
            onChange={handleInputChange}
            placeholder="Pergunte à Dra. Conte..."
            className="flex-1 p-3 bg-background border border-[--color-outline-variant] rounded-full text-sm focus:outline-none focus:border-[--color-rd-cyan]"
          />
          <button 
            type="submit" 
            disabled={isLoading || !input.trim()}
            className="bg-[--color-rd-cyan] text-[--color-rd-navy] p-3 rounded-full hover:bg-cyan-400 disabled:opacity-50 transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
