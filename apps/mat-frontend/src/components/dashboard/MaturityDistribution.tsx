import React from 'react';

export default function MaturityDistribution() {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Maturity Distribution</h2>
      <div className="space-y-2">
        <div className="flex items-center gap-4">
          <span className="w-24 text-sm">Level 0:</span>
          <div className="flex-1 bg-gray-200 rounded-full h-4">
            <div className="bg-red-500 h-4 rounded-full" style={{ width: '5%' }}></div>
          </div>
          <span className="text-sm">5%</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="w-24 text-sm">Level 1:</span>
          <div className="flex-1 bg-gray-200 rounded-full h-4">
            <div className="bg-orange-500 h-4 rounded-full" style={{ width: '15%' }}></div>
          </div>
          <span className="text-sm">15%</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="w-24 text-sm">Level 2:</span>
          <div className="flex-1 bg-gray-200 rounded-full h-4">
            <div className="bg-yellow-500 h-4 rounded-full" style={{ width: '25%' }}></div>
          </div>
          <span className="text-sm">25%</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="w-24 text-sm">Level 3:</span>
          <div className="flex-1 bg-gray-200 rounded-full h-4">
            <div className="bg-blue-500 h-4 rounded-full" style={{ width: '35%' }}></div>
          </div>
          <span className="text-sm">35%</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="w-24 text-sm">Level 4:</span>
          <div className="flex-1 bg-gray-200 rounded-full h-4">
            <div className="bg-green-500 h-4 rounded-full" style={{ width: '20%' }}></div>
          </div>
          <span className="text-sm">20%</span>
        </div>
      </div>
    </div>
  );
}
