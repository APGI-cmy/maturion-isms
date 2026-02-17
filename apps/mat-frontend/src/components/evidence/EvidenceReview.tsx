import React from 'react';

export default function EvidenceReview() {
  const evidence = [
    { id: 1, type: 'document', name: 'Security Policy.pdf', date: '2024-02-15' },
    { id: 2, type: 'photo', name: 'Server Room.jpg', date: '2024-02-14' },
    { id: 3, type: 'audio', name: 'Interview Recording.mp3', date: '2024-02-13' },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Evidence Review</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {evidence.map((item) => (
          <div key={item.id} className="border border-gray-200 rounded-lg p-4">
            <div className="aspect-square bg-gray-100 rounded mb-3 flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="font-medium text-sm truncate">{item.name}</p>
            <p className="text-xs text-gray-500 mt-1">{item.date}</p>
            <button className="mt-2 w-full bg-primary-600 text-white text-sm px-3 py-1 rounded hover:bg-primary-700">
              View
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
