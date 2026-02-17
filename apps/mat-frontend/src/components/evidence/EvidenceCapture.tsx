import { useState, useRef } from 'react';

interface EvidenceCaptureProps {
  onCapture?: (file: File, type: 'document' | 'photo' | 'video' | 'audio') => void;
  allowedTypes?: ('document' | 'photo' | 'video' | 'audio')[];
}

const EvidenceCapture = ({ 
  onCapture, 
  allowedTypes = ['document', 'photo', 'video', 'audio'] 
}: EvidenceCaptureProps) => {
  const [activeTab, setActiveTab] = useState<'document' | 'photo' | 'video' | 'audio'>('document');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: typeof activeTab) => {
    const file = e.target.files?.[0];
    if (file && onCapture) {
      onCapture(file, type);
    }
  };

  const tabs = [
    { key: 'document' as const, label: 'Document', icon: '📄' },
    { key: 'photo' as const, label: 'Photo', icon: '📷' },
    { key: 'video' as const, label: 'Video', icon: '🎥' },
    { key: 'audio' as const, label: 'Voice', icon: '🎤' },
  ].filter(tab => allowedTypes.includes(tab.key));

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">Capture Evidence</h3>

      {/* Tabs */}
      <div className="flex space-x-2 mb-6 border-b">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === tab.key
                ? 'border-b-2 border-primary-600 text-primary-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            aria-selected={activeTab === tab.key}
            role="tab"
          >
            <span aria-hidden="true">{tab.icon}</span> {tab.label}
          </button>
        ))}
      </div>

      {/* Document Upload */}
      {activeTab === 'document' && (
        <div className="space-y-4">
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx,.txt,.xlsx,.xls"
            onChange={(e) => handleFileUpload(e, 'document')}
            className="hidden"
            aria-label="Upload document"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full p-8 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 transition-colors"
          >
            <div className="text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p className="mt-2 text-sm text-gray-600">Click to upload document</p>
              <p className="text-xs text-gray-500">PDF, DOC, DOCX, TXT, XLSX</p>
            </div>
          </button>
        </div>
      )}

      {/* Photo Capture */}
      {activeTab === 'photo' && (
        <div className="space-y-4">
          <input
            ref={photoInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={(e) => handleFileUpload(e, 'photo')}
            className="hidden"
            aria-label="Capture photo"
          />
          <button
            onClick={() => photoInputRef.current?.click()}
            className="w-full p-8 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 transition-colors"
          >
            <div className="text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <p className="mt-2 text-sm text-gray-600">Take photo</p>
            </div>
          </button>
        </div>
      )}

      {/* Video Capture */}
      {activeTab === 'video' && (
        <div className="space-y-4">
          <input
            ref={videoInputRef}
            type="file"
            accept="video/*"
            capture="environment"
            onChange={(e) => handleFileUpload(e, 'video')}
            className="hidden"
            aria-label="Record video"
          />
          <button
            onClick={() => videoInputRef.current?.click()}
            className="w-full p-8 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 transition-colors"
          >
            <div className="text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <p className="mt-2 text-sm text-gray-600">Record video</p>
            </div>
          </button>
        </div>
      )}

      {/* Audio Recording */}
      {activeTab === 'audio' && (
        <div className="space-y-4">
          <div className="p-8 border-2 border-dashed border-gray-300 rounded-lg">
            <div className="text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
              <p className="mt-2 text-sm text-gray-600">Voice recording</p>
              <button className="mt-4 px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700">
                Start Recording
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EvidenceCapture;
