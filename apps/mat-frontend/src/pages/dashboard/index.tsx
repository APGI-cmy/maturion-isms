import React from 'react';
import GlobalDashboard from '../../components/dashboard/GlobalDashboard';
import DomainDashboard from '../../components/dashboard/DomainDashboard';
import MPSDashboard from '../../components/dashboard/MPSDashboard';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <GlobalDashboard />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DomainDashboard />
        <MPSDashboard />
      </div>
    </div>
  );
}
