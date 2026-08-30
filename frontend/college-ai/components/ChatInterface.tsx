'use client';

import React, { useState, useRef, useEffect } from 'react';
import { askQuestion } from '@/lib/api';
import MessageBubble from './MessageBubble';

interface Message {
id: string;
role: 'user' | 'assistant';
content: string;
sources?: any[];
}

export default function ChatInterface() {
const [messages, setMessages] = useState<Message[]>([]);
const [input, setInput] = useState('');
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);

const messagesEndRef = useRef<HTMLDivElement>(null);
const inputRef = useRef<HTMLInputElement>(null);

const scrollToBottom = () => {
messagesEndRef.current?.scrollIntoView({
behavior: 'smooth',
});
};

useEffect(() => {
scrollToBottom();
}, [messages]);

const handleSendMessage = async (e: React.FormEvent) => {
e.preventDefault();

if (!input.trim() || loading) return;

const userMessage = input.trim();

setInput('');
setError(null);

setMessages((prev) => [
  ...prev,
  {
    id: Date.now().toString(),
    role: 'user',
    content: userMessage,
  },
]);

setLoading(true);

try {
  const response = await askQuestion(userMessage);

  if (response.success) {
    setMessages((prev) => [
      ...prev,
      {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.answer,
        sources: response.sources,
      },
    ]);
  } else {
    setError(response.error || 'Failed to get a response');
  }
} catch (err) {
  setError(
    err instanceof Error
      ? err.message
      : 'An unexpected error occurred'
  );
} finally {
  setLoading(false);
}

};

return (
<div
id="chat"
className="flex flex-col h-full bg-white overflow-hidden"
>
{/* Header */}
<div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
<div className="flex items-center gap-3">
<div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center">
<span className="text-xl">🎓</span>
</div>

      <div>
        <h2 className="font-semibold text-gray-900">
          CollegeAI
        </h2>

        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-green-500 rounded-full"></span>

          <span className="text-xs text-gray-500">
            AI System Online
          </span>
        </div>
      </div>
    </div>

    <span className="hidden sm:block text-xs text-gray-400">
      AI College Assistant
    </span>
  </div>

  {/* Messages */}
  <div className="flex-1 overflow-y-auto bg-white">
    {messages.length === 0 ? (
      <div className="min-h-full flex flex-col items-center justify-center text-center px-4 py-12">
        <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mb-6">
          <span className="text-3xl">🎓</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-semibold text-gray-900 mb-3">
          How can I help you today?
        </h1>

        <p className="text-gray-500 max-w-xl mb-8">
          Ask questions about your college documents and get accurate
          AI-powered answers from your knowledge base.
        </p>

        {/* Suggestions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl">
          <button
            onClick={() =>
              setInput(
                'What information is available in the college documents?'
              )
            }
            className="text-left p-5 bg-white border border-gray-200 rounded-2xl hover:bg-gray-50 transition"
          >
            <div className="text-xl mb-3">📚</div>

            <p className="font-medium text-sm text-gray-900">
              Explore documents
            </p>

            <p className="text-xs text-gray-500 mt-1">
              See what information is available
            </p>
          </button>

          <button
            onClick={() =>
              setInput(
                'What courses are available in the college documents?'
              )
            }
            className="text-left p-5 bg-white border border-gray-200 rounded-2xl hover:bg-gray-50 transition"
          >
            <div className="text-xl mb-3">🏫</div>

            <p className="font-medium text-sm text-gray-900">
              College information
            </p>

            <p className="text-xs text-gray-500 mt-1">
              Ask about courses and college details
            </p>
          </button>
        </div>
      </div>
    ) : (
      <div className="max-w-3xl mx-auto w-full px-4 sm:px-6 py-8">
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            role={message.role}
            content={message.content}
            sources={message.sources}
          />
        ))}

        {loading && (
          <div className="flex items-start gap-3 mb-6">
            <div className="w-9 h-9 rounded-full bg-black flex items-center justify-center">
              🤖
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-2xl rounded-tl-none px-5 py-4">
              <p className="text-xs text-gray-500 mb-2">
                CollegeAI is thinking...
              </p>

              <div className="flex gap-1">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                <span
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: '150ms' }}
                ></span>
                <span
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: '300ms' }}
                ></span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>
    )}
  </div>

  {/* Error */}
  {error && (
    <div className="px-5 py-3 bg-red-50 border-t border-red-200">
      <p className="text-sm text-red-700">
        ⚠️ {error}
      </p>
    </div>
  )}

  {/* Input */}
  <div className="bg-white px-4 sm:px-6 pb-5 pt-3">
    <form onSubmit={handleSendMessage} className="max-w-3xl mx-auto">
      <div className="relative flex items-center border border-gray-300 rounded-2xl bg-white shadow-sm">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask anything about your college..."
          disabled={loading}
          className="w-full bg-transparent px-5 py-4 pr-14 text-base font-medium text-black placeholder:text-gray-400 outline-none disabled:cursor-not-allowed"
        />

        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="absolute right-2 w-10 h-10 bg-black text-white rounded-xl hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition flex items-center justify-center text-lg"
        >
          {loading ? (
            <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          ) : (
            '↑'
          )}
        </button>
      </div>
    </form>

    <p className="text-center text-xs text-gray-400 mt-3">
      Powered by AI for smarter learning
    </p>
  </div>
</div>

);
}