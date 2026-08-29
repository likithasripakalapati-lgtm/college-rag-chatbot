'use client';

import { useState, useEffect } from 'react';
import ChatInterface from '@/components/ChatInterface';
import DocumentUpload from '@/components/DocumentUpload';
import { checkHealth } from '@/lib/api';

export default function Home() {
const [backendConnected, setBackendConnected] = useState(false);
const [checkingBackend, setCheckingBackend] = useState(true);
const [activeTab, setActiveTab] = useState<'chat' | 'knowledge'>('chat');
const [chatKey, setChatKey] = useState(0);

useEffect(() => {
const checkBackend = async () => {
const connected = await checkHealth();

  setBackendConnected(connected);
  setCheckingBackend(false);
};

checkBackend();

const interval = setInterval(checkBackend, 10000);

return () => clearInterval(interval);

}, []);

const handleNewChat = () => {
setChatKey((prev) => prev + 1);
setActiveTab('chat');
};

return (
<div className="flex h-screen bg-white overflow-hidden">

  {/* Sidebar */}
  <aside className="hidden md:flex w-72 flex-col bg-gray-50 border-r border-gray-200 p-3">

    {/* Logo */}
    <div className="flex items-center gap-3 px-3 py-4 mb-4">
      <div className="w-9 h-9 bg-black rounded-lg flex items-center justify-center">
        <span className="text-white font-bold text-sm">
          AI
        </span>
      </div>

      <div>
        <h1 className="font-semibold text-gray-900">
          CollegeAI
        </h1>

        <p className="text-xs text-gray-500">
          College Assistant
        </p>
      </div>
    </div>

    {/* New Chat */}
    <button
      onClick={handleNewChat}
      className="w-full flex items-center gap-3 px-4 py-3 rounded-lg border border-gray-300 bg-white hover:bg-gray-100 transition text-sm font-medium text-gray-800 mb-3"
    >
      <span className="text-lg">＋</span>
      New Chat
    </button>

    {/* Navigation */}
    <div className="space-y-1">

      <button
        onClick={() => setActiveTab('chat')}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition ${
          activeTab === 'chat'
            ? 'bg-gray-200 text-gray-900 font-medium'
            : 'text-gray-600 hover:bg-gray-200'
        }`}
      >
        💬 Chat
      </button>

      <button
        onClick={() => setActiveTab('knowledge')}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition ${
          activeTab === 'knowledge'
            ? 'bg-gray-200 text-gray-900 font-medium'
            : 'text-gray-600 hover:bg-gray-200'
        }`}
      >
        📚 Knowledge Base
      </button>

    </div>

    {/* Bottom Status */}
    <div className="mt-auto border-t border-gray-200 pt-4">

      <div className="flex items-center gap-2 px-3 py-2 text-xs text-gray-500">

        {checkingBackend ? (
          <>
            <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></span>
            Connecting...
          </>
        ) : backendConnected ? (
          <>
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            AI System Online
          </>
        ) : (
          <>
            <span className="w-2 h-2 bg-red-500 rounded-full"></span>
            Backend Offline
          </>
        )}

      </div>

      <p className="px-3 pb-2 text-xs text-gray-400">
        CollegeAI • 2026
      </p>

    </div>

  </aside>

  {/* Main Area */}
  <main className="flex-1 flex flex-col min-w-0 bg-white">

    {/* Mobile Header */}
    <div className="md:hidden h-16 border-b border-gray-200 flex items-center justify-between px-4">

      <div className="flex items-center gap-2">

        <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
          <span className="text-white text-xs font-bold">
            AI
          </span>
        </div>

        <span className="font-semibold text-gray-900">
          CollegeAI
        </span>

      </div>

      <button
        onClick={() =>
          setActiveTab(
            activeTab === 'chat' ? 'knowledge' : 'chat'
          )
        }
        className="text-sm px-3 py-2 rounded-lg bg-gray-100 text-gray-700"
      >
        {activeTab === 'chat' ? '📚 Docs' : '💬 Chat'}
      </button>

    </div>

    {/* Content */}
    <div className="flex-1 min-h-0">

      {activeTab === 'chat' ? (

        <div className="h-full">
          <ChatInterface key={chatKey} />
        </div>

      ) : (

        <div className="h-full overflow-y-auto bg-gray-50 p-4 sm:p-8">

          <div className="max-w-2xl mx-auto">

            <div className="mb-6">

              <h2 className="text-2xl font-semibold text-gray-900">
                Knowledge Base
              </h2>

              <p className="text-sm text-gray-500 mt-2">
                Upload documents to help CollegeAI answer questions accurately.
              </p>

            </div>

            <DocumentUpload />

          </div>

        </div>

      )}

    </div>

  </main>

</div>

);
}