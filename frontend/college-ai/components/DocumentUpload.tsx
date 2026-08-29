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

const handleFileSelect = (
e: React.ChangeEvent<HTMLInputElement>
) => {
const file = e.target.files?.[0];

if (!file) return;

if (!file.name.toLowerCase().endsWith('.pdf')) {
  setError('Only PDF files are supported');
  setSelectedFile(null);
  return;
}

if (file.size > 50 * 1024 * 1024) {
  setError('File size must be less than 50MB');
  setSelectedFile(null);
  return;
}

setSelectedFile(file);
setError(null);
setSuccess(false);
setSuccessMessage(null);

};

const handleUpload = async () => {
if (!selectedFile) {
setError('Please select a PDF file first');
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
      `"${selectedFile.name}" has been added to your knowledge base.`
    );

    setSelectedFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  } else {
    setError(response.message || 'Failed to upload document');
  }
} catch (err) {
  const errorMessage =
    err instanceof Error
      ? err.message
      : 'An error occurred while uploading the document';

  setError(errorMessage);
} finally {
  setLoading(false);
}

};

const handleClearFile = () => {
setSelectedFile(null);
setError(null);
setSuccess(false);
setSuccessMessage(null);

if (fileInputRef.current) {
  fileInputRef.current.value = '';
}

};

return (
<div className="w-full">

  {/* Upload Card */}
  <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8">

    <div className="text-center mb-8">

      <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <span className="text-2xl">📚</span>
      </div>

      <h2 className="text-xl font-semibold text-gray-900">
        Add to Knowledge Base
      </h2>

      <p className="text-sm text-gray-500 mt-2 max-w-md mx-auto">
        Upload college documents and CollegeAI will use them
        to provide accurate answers.
      </p>

    </div>

    {/* Upload Area */}
    <label
      className={`block border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition ${
        loading
          ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
          : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
      }`}
    >

      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf"
        onChange={handleFileSelect}
        disabled={loading}
        className="hidden"
      />

      <div className="text-4xl mb-4">📄</div>

      <p className="font-medium text-gray-800">
        Click to upload a document
      </p>

      <p className="text-sm text-gray-500 mt-2">
        PDF files only • Maximum 50MB
      </p>

    </label>

    {/* Selected File */}
    {selectedFile && (
      <div className="mt-5 flex items-center justify-between gap-4 border border-gray-200 bg-gray-50 rounded-xl p-4">

        <div className="flex items-center gap-3 min-w-0">

          <div className="w-10 h-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center flex-shrink-0">
            📄
          </div>

          <div className="min-w-0">

            <p className="text-sm font-medium text-gray-900 truncate">
              {selectedFile.name}
            </p>

            <p className="text-xs text-gray-500 mt-1">
              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
            </p>

          </div>

        </div>

        <button
          onClick={handleClearFile}
          disabled={loading}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-200 transition disabled:cursor-not-allowed"
        >
          ✕
        </button>

      </div>
    )}

    {/* Error */}
    {error && (
      <div className="mt-5 border border-red-200 bg-red-50 rounded-xl px-4 py-3">
        <p className="text-sm text-red-700">
          ⚠️ {error}
        </p>
      </div>
    )}

    {/* Success */}
    {success && successMessage && (
      <div className="mt-5 border border-green-200 bg-green-50 rounded-xl px-4 py-3">
        <p className="text-sm text-green-700">
          ✓ {successMessage}
        </p>
      </div>
    )}

    {/* Upload Button */}
    <button
      onClick={handleUpload}
      disabled={!selectedFile || loading}
      className="w-full mt-5 py-3.5 bg-black text-white rounded-xl font-medium text-sm hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">

          <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>

          Adding to Knowledge Base...

        </span>
      ) : (
        'Add Document'
      )}
    </button>

  </div>

  {/* Information */}
  <div className="mt-6 px-2">

    <h3 className="text-sm font-medium text-gray-800 mb-3">
      How it works
    </h3>

    <div className="space-y-3 text-sm text-gray-500">

      <div className="flex gap-3">
        <span>1.</span>
        <p>Upload a PDF containing college information.</p>
      </div>

      <div className="flex gap-3">
        <span>2.</span>
        <p>CollegeAI processes and stores the information.</p>
      </div>

      <div className="flex gap-3">
        <span>3.</span>
        <p>Ask questions and receive answers from your documents.</p>
      </div>

    </div>

  </div>

</div>

);
}