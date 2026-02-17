import React from 'react';

export default function CriteriaApproval() {
  const parsedCriteria = [
    { id: 1, text: '5.1 Policies for information security', status: 'pending' },
    { id: 2, text: '5.2 Information security roles and responsibilities', status: 'pending' },
    { id: 3, text: '5.3 Segregation of duties', status: 'pending' },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Review Parsed Criteria</h2>
      <div className="space-y-3">
        {parsedCriteria.map((criterion) => (
          <div key={criterion.id} className="border border-gray-200 rounded p-4">
            <p className="mb-2">{criterion.text}</p>
            <div className="flex gap-2">
              <button className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700">
                Approve
              </button>
              <button className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700">
                Reject
              </button>
              <button className="bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700">
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 flex gap-2">
        <button className="bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700">
          Approve All
        </button>
        <button className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700">
          Review Later
        </button>
      </div>
    </div>
  );
}
