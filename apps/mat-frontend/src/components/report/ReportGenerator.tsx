import React from 'react';

export default function ReportGenerator() {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Generate Report</h2>
      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Report Type</label>
          <select className="w-full border border-gray-300 rounded px-3 py-2">
            <option>Executive Summary</option>
            <option>Detailed Findings Report</option>
            <option>Gap Analysis Report</option>
            <option>Compliance Certificate</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Include Sections</label>
          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input type="checkbox" defaultChecked />
              <span className="text-sm">Executive Summary</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" defaultChecked />
              <span className="text-sm">Maturity Scores</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" defaultChecked />
              <span className="text-sm">Findings & Evidence</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" />
              <span className="text-sm">Appendices</span>
            </label>
          </div>
        </div>
        <button
          type="submit"
          className="bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700"
        >
          Generate Report
        </button>
      </form>
    </div>
  );
}
