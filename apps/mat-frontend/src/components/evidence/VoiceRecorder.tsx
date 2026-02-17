import React from 'react';

export default function VoiceRecorder() {
  const [isRecording, setIsRecording] = React.useState(false);

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Voice Recorder</h2>
      <div className="text-center">
        <div className="mb-4">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary-100">
            <svg className="w-12 h-12 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          </div>
        </div>
        <p className="text-gray-600 mb-4">{isRecording ? 'Recording...' : 'Ready to record'}</p>
        <button
          onClick={() => setIsRecording(!isRecording)}
          className={`px-6 py-3 rounded-full font-medium ${
            isRecording
              ? 'bg-red-600 text-white hover:bg-red-700'
              : 'bg-primary-600 text-white hover:bg-primary-700'
          }`}
        >
          {isRecording ? 'Stop Recording' : 'Start Recording'}
        </button>
      </div>
    </div>
  );
}
