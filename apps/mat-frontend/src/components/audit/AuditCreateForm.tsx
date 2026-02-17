import React from 'react';

export default function AuditCreateForm() {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Create New Audit</h2>
      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Audit Name</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded px-3 py-2"
            placeholder="Enter audit name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Organisation</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded px-3 py-2"
            placeholder="Enter organisation name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Start Date</label>
          <input
            type="date"
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>
        <button
          type="submit"
          className="bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700"
        >
          Create Audit
        </button>
      </form>
    </div>
  );
}
