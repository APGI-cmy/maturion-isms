import React from 'react';

export default function ScoreConfirmation() {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Confirm AI Score</h2>
      <div className="space-y-4">
        <div className="p-4 bg-blue-50 border border-blue-200 rounded">
          <p className="font-medium mb-2">AI Suggested Score: Level 3</p>
          <p className="text-sm text-gray-700">
            Based on analysis of 8 evidence items with 92% confidence
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Review Comments</label>
          <textarea
            className="w-full border border-gray-300 rounded px-3 py-2"
            rows={4}
            placeholder="Add your review comments (optional)"
          />
        </div>
        <div className="flex gap-2">
          <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            Confirm Score
          </button>
          <button className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700">
            Request Override
          </button>
          <button className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700">
            Review Later
          </button>
        </div>
      </div>
    </div>
  );
}
