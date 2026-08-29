'use client';

import React from 'react';
import { ChatSource } from '@/lib/api';

interface MessageBubbleProps {
  role: 'user' | 'assistant';
  content: string;
  sources?: ChatSource[];
}

export default function MessageBubble({ role, content, sources }: MessageBubbleProps) {
  if (role === 'user') {
    return (
      <div className="flex justify-end mb-4">
        <div className="bg-blue-600 text-white rounded-lg rounded-tr-none px-4 py-3 max-w-xs sm:max-w-md lg:max-w-lg break-words">
          <p className="text-sm">{content}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start mb-4">
      <div className="bg-gray-100 text-gray-900 rounded-lg rounded-tl-none px-4 py-3 max-w-xs sm:max-w-md lg:max-w-lg">
        <p className="text-sm leading-relaxed mb-3 whitespace-pre-wrap">{content}</p>
        
        {sources && sources.length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-300">
            <p className="text-xs font-semibold text-gray-700 mb-2">📚 Sources:</p>
            <div className="space-y-1">
              {sources.map((source, idx) => (
                <div key={idx} className="text-xs text-gray-600 bg-white rounded px-2 py-1">
                  <p className="font-medium text-gray-700">{source.fileName}</p>
                  <p className="text-gray-500">
                    Chunk {source.chunkIndex} • Match: {(source.similarity * 100).toFixed(1)}%
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
