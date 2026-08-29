'use client';

import React, { useState } from 'react';
import { ChatSource } from '@/lib/api';

interface MessageBubbleProps {
role: 'user' | 'assistant';
content: string;
sources?: ChatSource[];
}

export default function MessageBubble({
role,
content,
sources
}: MessageBubbleProps) {
const [showSources, setShowSources] = useState(false);

if (role === 'user') {
return (
<div className="flex justify-end mb-6">
<div className="max-w-[85%] bg-gray-100 text-gray-900 px-5 py-3 rounded-2xl rounded-br-md">
<p className="text-sm leading-relaxed whitespace-pre-wrap">
{content}
</p>
</div>
</div>
);
}

return (
<div className="flex gap-3 mb-8 max-w-full">

  {/* AI Avatar */}
  <div className="w-9 h-9 rounded-full bg-black flex items-center justify-center flex-shrink-0">
    <span className="text-sm">🎓</span>
  </div>

  {/* AI Message */}
  <div className="flex-1 min-w-0 pt-1">

    <div className="mb-4">
      <p className="text-sm leading-7 text-gray-800 whitespace-pre-wrap">
        {content}
      </p>
    </div>

    {/* Sources */}
    {sources && sources.length > 0 && (
      <div className="mt-4">

        <button
          onClick={() => setShowSources(!showSources)}
          className="flex items-center gap-2 text-xs text-gray-500 hover:text-gray-900 transition"
        >
          <span>📚</span>

          <span>
            {showSources
              ? 'Hide sources'
              : `View sources (${sources.length})`}
          </span>

          <span className="text-gray-400">
            {showSources ? '⌃' : '⌄'}
          </span>
        </button>

        {showSources && (
          <div className="mt-3 space-y-2">

            {sources.map((source, idx) => (
              <div
                key={idx}
                className="border border-gray-200 bg-gray-50 rounded-xl px-4 py-3"
              >
                <p className="text-xs font-medium text-gray-800 truncate">
                  📄 {source.fileName}
                </p>

                <p className="text-xs text-gray-500 mt-1">
                  Chunk {source.chunkIndex} •{' '}
                  {(source.similarity * 100).toFixed(0)}% relevant
                </p>
              </div>
            ))}

          </div>
        )}

      </div>
    )}

  </div>
</div>

);
}