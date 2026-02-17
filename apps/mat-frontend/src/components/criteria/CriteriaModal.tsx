import React from 'react';

export default function CriteriaModal() {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-2xl w-full">
        <h2 className="text-2xl font-bold mb-4">Criterion Details</h2>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1">Criterion ID</label>
            <p className="text-gray-700">5.1.1</p>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <p className="text-gray-700">Policies for information security shall be defined, approved by management, published, communicated to and acknowledged by relevant personnel and relevant interested parties, and reviewed at planned intervals and if significant changes occur.</p>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Evidence Required</label>
            <p className="text-gray-700">Policy documents, approval records, communication logs</p>
          </div>
        </div>
        <div className="mt-6 flex gap-2 justify-end">
          <button className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700">
            Close
          </button>
          <button className="bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700">
            Add Evidence
          </button>
        </div>
      </div>
    </div>
  );
}
