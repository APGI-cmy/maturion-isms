import React from 'react';

export default function InterviewRecorder() {
  const [isRecording, setIsRecording] = React.useState(false);

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Interview Recorder</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Interviewee Name</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded px-3 py-2"
            placeholder="Enter name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Role</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded px-3 py-2"
            placeholder="Enter role"
          />
        </div>
        <div className="text-center py-6">
          <div className="mb-4">
            <span className="text-4xl font-mono">{isRecording ? '00:45' : '00:00'}</span>
          </div>
          <button
            onClick={() => setIsRecording(!isRecording)}
            className={`px-6 py-3 rounded-full font-medium ${
              isRecording
                ? 'bg-red-600 text-white hover:bg-red-700'
                : 'bg-primary-600 text-white hover:bg-primary-700'
            }`}
          >
            {isRecording ? 'Stop Interview' : 'Start Interview'}
          </button>
        </div>
      </div>
    </div>
  );
}
