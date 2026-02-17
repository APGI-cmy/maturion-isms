import React from 'react';

export default function AuditorAssignment() {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Assign Auditor</h2>
      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Select Auditor</label>
          <select className="w-full border border-gray-300 rounded px-3 py-2">
            <option>John Smith</option>
            <option>Jane Doe</option>
            <option>Bob Johnson</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Role</label>
          <select className="w-full border border-gray-300 rounded px-3 py-2">
            <option>Lead Auditor</option>
            <option>Assistant Auditor</option>
            <option>Observer</option>
          </select>
        </div>
        <button
          type="submit"
          className="bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700"
        >
          Assign Auditor
        </button>
      </form>
    </div>
  );
}
