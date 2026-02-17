import React from 'react';

export default function UploadProgress() {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Upload Progress</h2>
      <div className="space-y-3">
        <div className="border border-gray-200 rounded p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">document.pdf</span>
            <span className="text-sm text-green-600">Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-green-500 h-2 rounded-full" style={{ width: '100%' }}></div>
          </div>
        </div>
        <div className="border border-gray-200 rounded p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">photo.jpg</span>
            <span className="text-sm text-blue-600">67%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-blue-500 h-2 rounded-full" style={{ width: '67%' }}></div>
          </div>
        </div>
        <div className="border border-gray-200 rounded p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">audio.mp3</span>
            <span className="text-sm text-gray-600">Pending</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-gray-400 h-2 rounded-full" style={{ width: '0%' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}
