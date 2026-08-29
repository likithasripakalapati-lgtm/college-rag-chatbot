'use client';

import React from 'react';

export default function Header() {
return (
<header className="h-16 border-b border-gray-200 bg-white flex items-center justify-between px-4 sm:px-6">

  {/* Logo */}
  <div className="flex items-center gap-3">
    <div className="w-9 h-9 bg-black rounded-lg flex items-center justify-center">
      <span className="text-white text-sm font-bold">AI</span>
    </div>

    <div>
      <h1 className="text-base font-semibold text-gray-900">
        CollegeAI
      </h1>

      <p className="text-xs text-gray-500">
        College Assistant
      </p>
    </div>
  </div>

  {/* Status */}
  <div className="flex items-center gap-2">
    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
    <span className="text-xs text-gray-500 hidden sm:block">
      Online
    </span>
  </div>

</header>

);
}