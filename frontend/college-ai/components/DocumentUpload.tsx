'use client';

import React, { useState, useRef } from 'react';
import { uploadDocument } from '@/lib/api';

export default function DocumentUpload() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.pdf')) {
  setError('Only PDF files are supported');
  setSelectedFile(null);
  return;
}

    setSelectedFile(file);
    setError(null);
    setSuccess(false);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a file first');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await uploadDocument(selectedFile);

      if (response.success) {
        setSuccess(true);
        setSuccessMessage(
          `✅ Document "${selectedFile.name}" uploaded successfully!\n\nThe backend is now extracting text, chunking it, and generating embeddings. This may take a minute.`
        );
        setSelectedFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } else {
        setError(response.message || 'Failed to upload document');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred during upload';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleClearFile = () => {
    setSelectedFile(null);
    setError(null);
    setSuccess(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div id="upload" className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">📄 Admin - Upload College Documents</h2>
        <p className="text-gray-600 text-sm">
          Upload PDF documents about your college. The AI will process them and be able to answer questions based on their content.
        </p>
      </div>

      {/* File Input Area */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center bg-gray-50 mb-4">
        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
          <span className="text-xl">📁</span>
        </div>
        
        <label className="cursor-pointer">
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            onChange={handleFileSelect}
            disabled={loading}
            className="hidden"
          />
          <span className="text-blue-600 font-medium hover:text-blue-700">Click to select</span>
          <span className="text-gray-600"> or drag and drop</span>
        </label>
        
        <p className="text-xs text-gray-500 mt-2">PDF files only • Max 50MB</p>
      </div>

      {/* Selected File Display */}
      {selectedFile && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xl">✓</span>
            <div className="flex-1">
              <p className="font-medium text-gray-900 text-sm">{selectedFile.name}</p>
              <p className="text-xs text-gray-600">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>
          <button
            onClick={handleClearFile}
            disabled={loading}
            className="text-gray-400 hover:text-gray-600 disabled:cursor-not-allowed"
          >
            ✕
          </button>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <p className="text-sm text-red-700">⚠️ {error}</p>
        </div>
      )}

      {/* Success Message */}
      {success && successMessage && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
          <p className="text-sm text-green-700 whitespace-pre-line">{successMessage}</p>
        </div>
      )}

      {/* Upload Button */}
      <button
        onClick={handleUpload}
        disabled={!selectedFile || loading}
        className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium transition flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            Uploading...
          </>
        ) : (
          <>
            <span>⬆️</span>
            Upload PDF
          </>
        )}
      </button>

      <p className="text-xs text-gray-500 mt-4 text-center">
        After uploading, the document will be processed in the background. This includes text extraction, chunking, and embedding generation.
      </p>
    </div>
  );
}
