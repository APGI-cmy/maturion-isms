import React from 'react';
import GlobalDashboard from '../components/dashboard/GlobalDashboard';

export default function Dashboard() {
  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <GlobalDashboard />
    </div>
  );
}
