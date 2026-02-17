import React from 'react';

export default function AuditActions() {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Audit Actions</h2>
      <div className="flex gap-4">
        <button className="bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700">
          Start Audit
        </button>
        <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          Complete Audit
        </button>
        <button className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700">
          Submit for Review
        </button>
        <button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
          Cancel Audit
        </button>
      </div>
    </div>
  );
}
