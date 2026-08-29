'use client';

import React from 'react';

export default function Header() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">AI</span>
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl font-bold text-gray-900">CollegeAI</h1>
              <p className="text-xs text-gray-600">College Information Assistant</p>
            </div>
          </div>
          
          <nav className="hidden md:flex gap-6">
            <a href="#chat" className="text-gray-700 hover:text-blue-600 font-medium transition">
              Chat
            </a>
            <a href="#upload" className="text-gray-700 hover:text-blue-600 font-medium transition">
              Upload Docs
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}
