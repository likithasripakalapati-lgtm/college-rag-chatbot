'use client';

import { useState, useEffect } from 'react';
import ChatInterface from '@/components/ChatInterface';
import DocumentUpload from '@/components/DocumentUpload';
import { checkHealth, login, signup } from '@/lib/api';

export default function Home() {
const [backendConnected, setBackendConnected] = useState(false);
const [checkingBackend, setCheckingBackend] = useState(true);

const [isAuthenticated, setIsAuthenticated] = useState(false);
const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

const [activeTab, setActiveTab] = useState<'chat' | 'knowledge'>('chat');
const [chatKey, setChatKey] = useState(0);

const [name, setName] = useState('');
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');

const [authLoading, setAuthLoading] = useState(false);
const [authMessage, setAuthMessage] = useState('');

// Check backend connection
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

// Login / Signup
const handleAuth = async (e: React.FormEvent) => {
e.preventDefault();

setAuthMessage('');
setAuthLoading(true);

try {
  if (authMode === 'signup') {
    const result = await signup(name, email, password);

    if (result.success) {
      setAuthMessage('Account created successfully! Please sign in.');

      setAuthMode('login');
      setName('');
      setPassword('');
    } else {
      setAuthMessage(result.message);
    }
  } else {
    const result = await login(email, password);

    if (result.success) {
      setIsAuthenticated(true);
    } else {
      setAuthMessage(result.message);
    }
  }
} catch {
  setAuthMessage('Something went wrong. Please try again.');
}

setAuthLoading(false);

};

const handleNewChat = () => {
setChatKey((prev) => prev + 1);
setActiveTab('chat');
};

const handleLogout = () => {
setIsAuthenticated(false);

setEmail('');
setPassword('');
setName('');
setAuthMessage('');
setAuthMode('login');

};

// =========================
// AUTH PAGE
// =========================

if (!isAuthenticated) {
return (
<main className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 flex items-center justify-center p-4">

    <div className="w-full max-w-md">

      {/* Logo */}
      <div className="text-center mb-8">

        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
          <span className="text-black font-bold text-xl">
            AI
          </span>
        </div>

        <h1 className="text-3xl font-bold text-white">
          CollegeAI
        </h1>

        <p className="text-gray-400 mt-2">
          Your Intelligent College Assistant
        </p>

      </div>

      {/* Auth Card */}
      <div className="bg-white rounded-2xl shadow-2xl p-8">

        <h2 className="text-2xl font-bold text-gray-900 text-center">

          {authMode === 'login'
            ? 'Welcome Back'
            : 'Create Your Account'}

        </h2>

        <p className="text-gray-500 text-sm text-center mt-2 mb-6">

          {authMode === 'login'
            ? 'Sign in to continue to CollegeAI'
            : 'Create an account to get started'}

        </p>

        <form onSubmit={handleAuth} className="space-y-4">

          {/* Name */}
          {authMode === 'signup' && (
            <div>

              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>

              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-black"
              />

            </div>
          )}

          {/* Email */}
          <div>

            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              style={{ color: '#000000', opacity: 1 }}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg !text-black placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-black"
            />

          </div>

          {/* Password */}
          <div>

            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              minLength={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg  !text-black placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-black"
            />

          </div>

          {/* Message */}
          {authMessage && (
            <div className="text-sm text-center text-red-500">
              {authMessage}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={authLoading}
            className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition disabled:opacity-60"
          >

            {authLoading
              ? 'Please wait...'
              : authMode === 'login'
              ? 'Sign In'
              : 'Create Account'}

          </button>

        </form>

        {/* Switch Login / Signup */}
        <div className="text-center mt-6 text-sm text-gray-600">

          {authMode === 'login' ? (
            <>
              Don't have an account?{' '}

              <button
                onClick={() => {
                  setAuthMode('signup');
                  setAuthMessage('');
                }}
                className="text-black font-semibold hover:underline"
              >
                Create an Account
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}

              <button
                onClick={() => {
                  setAuthMode('login');
                  setAuthMessage('');
                }}
                className="text-black font-semibold hover:underline"
              >
                Sign In
              </button>
            </>
          )}

        </div>

      </div>

      {/* Backend Status */}
      <div className="flex justify-center mt-5 text-xs text-gray-400">

        {checkingBackend ? (
          <span>🟡 Connecting to AI System...</span>
        ) : backendConnected ? (
          <span>🟢 AI System Online</span>
        ) : (
          <span>🔴 Backend Offline</span>
        )}

      </div>

    </div>

  </main>
);

}

// =========================
// MAIN COLLEGE AI DASHBOARD
// =========================

return (
<div className="flex h-screen bg-white overflow-hidden">

  {/* Sidebar */}
  <aside className="hidden md:flex w-72 flex-col bg-gray-50 border-r border-gray-200 p-3">

    {/* Logo */}
    <div className="flex items-center gap-3 px-3 py-4 mb-4">

      <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center">
        <span className="text-white font-bold">
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

    {/* Bottom */}
    <div className="mt-auto border-t border-gray-200 pt-4">

      <button
        onClick={handleLogout}
        className="w-full text-left px-3 py-2 text-sm text-red-500 hover:bg-red-50 rounded-lg"
      >
        🚪 Logout
      </button>

      <div className="flex items-center gap-2 px-3 py-2 text-xs text-gray-500">

        {backendConnected ? (
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
                Upload PDF documents to help CollegeAI answer questions accurately.
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