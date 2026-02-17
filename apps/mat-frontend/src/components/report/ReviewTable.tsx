import React from 'react';

export default function ReviewTable() {
  const findings = [
    { id: 1, criterion: '5.1.1', finding: 'Policy documentation complete', maturity: 3, status: 'Approved' },
    { id: 2, criterion: '5.2.1', finding: 'Role definitions need clarification', maturity: 2, status: 'In Review' },
    { id: 3, criterion: '5.3.1', finding: 'Segregation of duties well implemented', maturity: 4, status: 'Approved' },
  ];

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Criterion</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Finding</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Maturity</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {findings.map((finding) => (
            <tr key={finding.id}>
              <td className="px-6 py-4 whitespace-nowrap font-medium">{finding.criterion}</td>
              <td className="px-6 py-4">{finding.finding}</td>
              <td className="px-6 py-4 whitespace-nowrap">Level {finding.maturity}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  finding.status === 'Approved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {finding.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
