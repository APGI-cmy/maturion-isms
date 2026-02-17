import React from 'react';

export default function CriteriaTree() {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Criteria Tree</h2>
      <div className="space-y-2">
        <div className="border-l-2 border-primary-500 pl-4">
          <div className="font-semibold">Domain: Organisational Controls</div>
          <div className="ml-4 mt-2 space-y-2">
            <div className="border-l-2 border-blue-400 pl-4">
              <div className="font-medium">MPS 5.1: Policies</div>
              <div className="ml-4 mt-1 space-y-1">
                <div className="text-sm">✓ Criterion 5.1.1</div>
                <div className="text-sm">✓ Criterion 5.1.2</div>
              </div>
            </div>
            <div className="border-l-2 border-blue-400 pl-4">
              <div className="font-medium">MPS 5.2: Roles</div>
              <div className="ml-4 mt-1 space-y-1">
                <div className="text-sm">○ Criterion 5.2.1</div>
                <div className="text-sm">✓ Criterion 5.2.2</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
