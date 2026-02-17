import React from 'react';

export default function ValidationResults() {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Validation Results</h2>
      <div className="space-y-4">
        <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded">
          <span className="font-medium">Coverage</span>
          <span className="text-green-700 font-bold">98%</span>
        </div>
        <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded">
          <span className="font-medium">Criteria Extracted</span>
          <span className="text-blue-700 font-bold">42</span>
        </div>
        <div className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded">
          <span className="font-medium">Warnings</span>
          <span className="text-yellow-700 font-bold">3</span>
        </div>
        <div className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded">
          <span className="font-medium">Errors</span>
          <span className="text-red-700 font-bold">0</span>
        </div>
      </div>
    </div>
  );
}
