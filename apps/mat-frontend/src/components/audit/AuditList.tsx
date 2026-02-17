import React from 'react';
import AuditStatusBadge from './AuditStatusBadge';

export default function AuditList() {
  const audits = [
    { id: 1, name: 'Q1 2024 Audit', organisation: 'Acme Corp', status: 'in_progress' },
    { id: 2, name: 'Annual Review 2024', organisation: 'TechCo', status: 'completed' },
    { id: 3, name: 'Mid-Year Assessment', organisation: 'GlobalInc', status: 'planning' },
  ];

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Organisation</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {audits.map((audit) => (
            <tr key={audit.id}>
              <td className="px-6 py-4 whitespace-nowrap">{audit.name}</td>
              <td className="px-6 py-4 whitespace-nowrap">{audit.organisation}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <AuditStatusBadge status={audit.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
