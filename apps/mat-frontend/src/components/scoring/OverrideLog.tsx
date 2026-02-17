import React from 'react';

export default function OverrideLog() {
  const overrides = [
    {
      id: 1,
      criterion: '5.1.1',
      aiScore: 3,
      humanScore: 2,
      auditor: 'John Smith',
      date: '2024-02-15',
      reason: 'Evidence of communication gaps not fully addressed',
    },
    {
      id: 2,
      criterion: '5.2.1',
      aiScore: 2,
      humanScore: 3,
      auditor: 'Jane Doe',
      date: '2024-02-14',
      reason: 'Additional documentation found during interview',
    },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Override History</h2>
      <div className="space-y-3">
        {overrides.map((override) => (
          <div key={override.id} className="border border-gray-200 rounded p-4">
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="font-semibold">Criterion {override.criterion}</p>
                <p className="text-sm text-gray-600">
                  AI Score: {override.aiScore} → Human Score: {override.humanScore}
                </p>
              </div>
              <span className="text-xs text-gray-500">{override.date}</span>
            </div>
            <p className="text-sm mb-2">
              <span className="font-medium">Reason:</span> {override.reason}
            </p>
            <p className="text-xs text-gray-600">Auditor: {override.auditor}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
