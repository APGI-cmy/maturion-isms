import React from 'react';

export default function ApprovalWorkflow() {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Report Approval Workflow</h2>
      <div className="space-y-3">
        <div className="flex items-center gap-4 p-3 bg-green-50 border border-green-200 rounded">
          <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center">
            ✓
          </div>
          <div className="flex-1">
            <p className="font-medium">Lead Auditor Review</p>
            <p className="text-sm text-gray-600">Approved by John Smith on 2024-02-15</p>
          </div>
        </div>
        <div className="flex items-center gap-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
          <div className="w-8 h-8 bg-yellow-500 text-white rounded-full flex items-center justify-center">
            ⏳
          </div>
          <div className="flex-1">
            <p className="font-medium">Technical Review</p>
            <p className="text-sm text-gray-600">Pending review by Jane Doe</p>
          </div>
        </div>
        <div className="flex items-center gap-4 p-3 bg-gray-50 border border-gray-200 rounded">
          <div className="w-8 h-8 bg-gray-400 text-white rounded-full flex items-center justify-center">
            •
          </div>
          <div className="flex-1">
            <p className="font-medium">Management Approval</p>
            <p className="text-sm text-gray-600">Awaiting prior approvals</p>
          </div>
        </div>
      </div>
      <div className="mt-4 flex gap-2">
        <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          Approve
        </button>
        <button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
          Request Changes
        </button>
      </div>
    </div>
  );
}
