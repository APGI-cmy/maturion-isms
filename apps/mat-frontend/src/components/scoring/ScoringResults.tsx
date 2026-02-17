import React from 'react';
import ConfidenceIndicator from './ConfidenceIndicator';
import MaturityLevelDisplay from './MaturityLevelDisplay';

export default function ScoringResults() {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">AI Scoring Results</h2>
      <div className="space-y-4">
        <div className="border border-gray-200 rounded p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Criterion 5.1.1: Information Security Policies</h3>
            <ConfidenceIndicator confidence={0.92} />
          </div>
          <MaturityLevelDisplay level={3} />
          <div className="mt-3">
            <p className="text-sm font-medium mb-1">AI Rationale:</p>
            <p className="text-sm text-gray-600">
              Evidence shows well-documented policies with management approval and regular review cycles. 
              However, communication to all stakeholders could be improved.
            </p>
          </div>
          <div className="mt-3 flex gap-2">
            <button className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700">
              Confirm
            </button>
            <button className="bg-yellow-600 text-white px-3 py-1 rounded text-sm hover:bg-yellow-700">
              Override
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
