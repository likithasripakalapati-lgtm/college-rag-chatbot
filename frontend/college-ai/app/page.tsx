'use client';

import Header from '@/components/Header';
import ChatInterface from '@/components/ChatInterface';
import DocumentUpload from '@/components/DocumentUpload';
import { useState, useEffect } from 'react';
import { checkHealth } from '@/lib/api';

export default function Home() {
  const [backendConnected, setBackendConnected] = useState(false);
  const [checkingBackend, setCheckingBackend] = useState(true);

  useEffect(() => {
    const checkBackend = async () => {
      const connected = await checkHealth();
      setBackendConnected(connected);
      setCheckingBackend(false);
    };

    checkBackend();
    // Re-check every 10 seconds
    const interval = setInterval(checkBackend, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />

      {/* Connection Status Banner */}
      {!checkingBackend && !backendConnected && (
        <div className="bg-yellow-50 border-b border-yellow-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <p className="text-sm text-yellow-800">
              ⚠️ <strong>Backend not connected</strong> - Make sure the server is running at http://localhost:5000
            </p>
          </div>
        </div>
      )}

      {backendConnected && (
        <div className="bg-green-50 border-b border-green-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
            <p className="text-xs text-green-700">✓ Backend connected</p>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Chat (2/3 width on desktop) */}
          <div className="lg:col-span-2">
            <ChatInterface />
          </div>

          {/* Right Column - Admin Section (1/3 width on desktop) */}
          <div className="lg:col-span-1 space-y-6">
            <DocumentUpload />

            {/* Quick Info Card */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">ℹ️ How It Works</h3>
              <ol className="space-y-3 text-sm text-gray-700">
                <li className="flex gap-3">
                  <span className="font-bold text-blue-600 flex-shrink-0">1</span>
                  <span>Upload a PDF document about your college</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-blue-600 flex-shrink-0">2</span>
                  <span>Backend extracts, chunks, and embeds the text</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-blue-600 flex-shrink-0">3</span>
                  <span>Ask a question in the chat interface</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-blue-600 flex-shrink-0">4</span>
                  <span>AI searches and returns relevant information</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-blue-600 flex-shrink-0">5</span>
                  <span>Sources are displayed with each answer</span>
                </li>
              </ol>
            </div>

            {/* Tech Stack Card */}
            <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
              <h3 className="text-sm font-bold text-blue-900 mb-3">🚀 Technology</h3>
              <div className="space-y-1 text-xs text-blue-800">
                <p>• Next.js + React Frontend</p>
                <p>• Node.js + Express Backend</p>
                <p>• MongoDB Database</p>
                <p>• Google Gemini AI</p>
                <p>• Semantic Search</p>
                <p>• RAG Pipeline</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Product</h4>
              <ul className="space-y-1 text-sm text-gray-600">
                <li><a href="#" className="hover:text-blue-600">Chat</a></li>
                <li><a href="#" className="hover:text-blue-600">Upload Docs</a></li>
                <li><a href="#" className="hover:text-blue-600">Search</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">About</h4>
              <ul className="space-y-1 text-sm text-gray-600">
                <li><a href="#" className="hover:text-blue-600">Features</a></li>
                <li><a href="#" className="hover:text-blue-600">Technology</a></li>
                <li><a href="#" className="hover:text-blue-600">Documentation</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Support</h4>
              <ul className="space-y-1 text-sm text-gray-600">
                <li><a href="#" className="hover:text-blue-600">Help Center</a></li>
                <li><a href="#" className="hover:text-blue-600">Contact</a></li>
                <li><a href="#" className="hover:text-blue-600">Feedback</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 pt-8">
            <p className="text-sm text-gray-600 text-center">
              © 2026 CollegeAI. All rights reserved. | Built with Next.js, React, and Google Gemini
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
