import React from 'react';
import MaturityDistribution from './MaturityDistribution';

export default function GlobalDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Total Audits</h3>
          <p className="text-3xl font-bold text-primary-600">12</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Completion Rate</h3>
          <p className="text-3xl font-bold text-green-600">87%</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Avg Maturity</h3>
          <p className="text-3xl font-bold text-blue-600">3.2</p>
        </div>
      </div>
      <MaturityDistribution />
    </div>
  );
}
