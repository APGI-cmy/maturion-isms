import React from 'react';

export default function DomainDashboard() {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Domain Dashboard</h2>
      <div className="space-y-4">
        <div className="border-b pb-3">
          <h3 className="font-semibold">Domain: Information Security</h3>
          <p className="text-sm text-gray-600">Maturity Level: 3</p>
        </div>
        <div className="border-b pb-3">
          <h3 className="font-semibold">Domain: Access Control</h3>
          <p className="text-sm text-gray-600">Maturity Level: 4</p>
        </div>
      </div>
    </div>
  );
}
