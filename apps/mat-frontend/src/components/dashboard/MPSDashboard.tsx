import React from 'react';

export default function MPSDashboard() {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">MPS Dashboard</h2>
      <div className="space-y-4">
        <div className="border-b pb-3">
          <h3 className="font-semibold">MPS: 5.1 Policies</h3>
          <p className="text-sm text-gray-600">Criteria: 8 | Completed: 6</p>
        </div>
        <div className="border-b pb-3">
          <h3 className="font-semibold">MPS: 5.2 Information Security Roles</h3>
          <p className="text-sm text-gray-600">Criteria: 5 | Completed: 5</p>
        </div>
      </div>
    </div>
  );
}
