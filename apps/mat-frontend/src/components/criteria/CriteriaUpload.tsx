import React from 'react';

export default function CriteriaUpload() {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Upload Criteria Document</h2>
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
        <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
          <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <p className="mt-2 text-sm text-gray-600">
          Drag and drop your criteria document here, or click to browse
        </p>
        <p className="mt-1 text-xs text-gray-500">PDF, DOCX up to 10MB</p>
        <input type="file" className="hidden" accept=".pdf,.docx" />
        <button className="mt-4 bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700">
          Select File
        </button>
      </div>
    </div>
  );
}
