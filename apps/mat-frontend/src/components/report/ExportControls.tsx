import React from 'react';

export default function ExportControls() {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Export Report</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Export Format</label>
          <div className="grid grid-cols-2 gap-2">
            <button className="border-2 border-primary-500 bg-primary-50 text-primary-700 px-4 py-2 rounded font-medium hover:bg-primary-100">
              PDF
            </button>
            <button className="border-2 border-gray-300 bg-white text-gray-700 px-4 py-2 rounded font-medium hover:bg-gray-50">
              DOCX
            </button>
            <button className="border-2 border-gray-300 bg-white text-gray-700 px-4 py-2 rounded font-medium hover:bg-gray-50">
              XLSX
            </button>
            <button className="border-2 border-gray-300 bg-white text-gray-700 px-4 py-2 rounded font-medium hover:bg-gray-50">
              CSV
            </button>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Include Watermark</label>
          <select className="w-full border border-gray-300 rounded px-3 py-2">
            <option>Draft</option>
            <option>Final</option>
            <option>Confidential</option>
            <option>None</option>
          </select>
        </div>
        <button className="w-full bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700">
          Download Report
        </button>
      </div>
    </div>
  );
}
