import { useState } from 'react';

interface InterviewRecordingProps {
  criterionId?: string;
  // auditId and onSave are interface placeholders for future implementation
  auditId?: string;
  onSave?: (recording: File, metadata: InterviewMetadata) => void;
}

interface InterviewMetadata {
  interviewer: string;
  interviewee: string;
  duration: number;
  notes?: string;
}

const InterviewRecording = ({ criterionId }: InterviewRecordingProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const [metadata, setMetadata] = useState<Partial<InterviewMetadata>>({});

  const handleStartRecording = () => {
    setIsRecording(true);
    setDuration(0);
  };

  const handleStopRecording = () => {
    setIsRecording(false);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">
        {criterionId ? 'Criterion Interview' : 'Audit Interview'}
      </h3>

      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Interviewer
          </label>
          <input
            type="text"
            value={metadata.interviewer || ''}
            onChange={(e) => setMetadata({ ...metadata, interviewer: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Name of interviewer"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Interviewee
          </label>
          <input
            type="text"
            value={metadata.interviewee || ''}
            onChange={(e) => setMetadata({ ...metadata, interviewee: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Name of interviewee"
          />
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-8 text-center">
        {!isRecording ? (
          <div className="space-y-4">
            <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
            <button
              onClick={handleStartRecording}
              className="px-6 py-3 bg-red-600 text-white rounded-full hover:bg-red-700 inline-flex items-center space-x-2"
              aria-label="Start recording"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <circle cx="10" cy="10" r="5" />
              </svg>
              <span>Start Recording</span>
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="animate-pulse">
              <svg className="mx-auto h-16 w-16 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </div>
            <div className="text-2xl font-mono text-gray-900">
              {Math.floor(duration / 60)}:{(duration % 60).toString().padStart(2, '0')}
            </div>
            <button
              onClick={handleStopRecording}
              className="px-6 py-3 bg-gray-800 text-white rounded-full hover:bg-gray-900"
              aria-label="Stop recording"
            >
              Stop Recording
            </button>
          </div>
        )}
      </div>

      {criterionId && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded text-sm text-blue-700">
          <p className="font-semibold mb-1">Interview Governance:</p>
          <ul className="list-disc list-inside space-y-1 text-xs">
            <li>Obtain consent before recording</li>
            <li>Ensure interview is relevant to criterion</li>
            <li>Protect confidential information</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default InterviewRecording;
