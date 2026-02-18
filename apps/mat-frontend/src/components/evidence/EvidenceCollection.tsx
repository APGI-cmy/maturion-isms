/**
 * Evidence Collection Component
 * FRS: FR-013 to FR-020 (Evidence Collection)
 * TRS: TR-049, TR-051, TR-052
 * Task: 5.6.4
 */
import { useState, useRef } from 'react';
import { useCriterionEvidence, useUploadEvidence, useDeleteEvidence } from '../../lib/hooks/useEvidence';
import { FileText, Image, Mic, Video, Upload, Trash2, Check } from 'lucide-react';

interface EvidenceCollectionProps {
  criterionId: string;
}

type EvidenceType = 'text' | 'photo' | 'audio' | 'video' | 'document';

export function EvidenceCollection({ criterionId }: EvidenceCollectionProps) {
  const { data: evidence, isLoading, isError, error } = useCriterionEvidence(criterionId);
  const uploadEvidence = useUploadEvidence();
  const deleteEvidence = useDeleteEvidence();
  
  const [activeTab, setActiveTab] = useState<EvidenceType>('text');
  const [textContent, setTextContent] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const tabs: { id: EvidenceType; label: string; icon: any }[] = [
    { id: 'text', label: 'Text', icon: FileText },
    { id: 'photo', label: 'Photo', icon: Image },
    { id: 'audio', label: 'Audio', icon: Mic },
    { id: 'video', label: 'Video', icon: Video },
    { id: 'document', label: 'Document', icon: Upload },
  ];

  const handleTextSubmit = async () => {
    if (!textContent.trim()) {
      alert('Please enter some text');
      return;
    }

    try {
      await uploadEvidence.mutateAsync({
        criterionId,
        type: 'text',
        content: textContent,
      });
      setTextContent('');
      alert('Text evidence saved successfully!');
    } catch (err) {
      alert(`Failed to save text evidence: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile) {
      alert('Please select a file');
      return;
    }

    try {
      await uploadEvidence.mutateAsync({
        criterionId,
        type: activeTab,
        file: selectedFile,
      });
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      alert(`${activeTab} evidence uploaded successfully!`);
    } catch (err) {
      alert(`Failed to upload ${activeTab}: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: true, 
        video: activeTab === 'video' 
      });
      
      mediaRecorderRef.current = new MediaRecorder(stream);
      recordedChunksRef.current = [];
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = async () => {
        const blob = new Blob(recordedChunksRef.current, {
          type: activeTab === 'video' ? 'video/webm' : 'audio/webm'
        });
        
        const file = new File([blob], `recording-${Date.now()}.webm`, {
          type: blob.type
        });

        // Upload the recording
        try {
          await uploadEvidence.mutateAsync({
            criterionId,
            type: activeTab,
            file,
          });
          alert(`${activeTab} recording saved successfully!`);
        } catch (err) {
          alert(`Failed to save recording: ${err instanceof Error ? err.message : 'Unknown error'}`);
        }

        // Clean up
        stream.getTracks().forEach(track => track.stop());
        setRecordingTime(0);
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (err) {
      alert(`Failed to start recording: ${err instanceof Error ? err.message : 'Permission denied'}`);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleDelete = async (evidenceId: string, filePath?: string) => {
    if (!confirm('Are you sure you want to delete this evidence?')) {
      return;
    }

    try {
      await deleteEvidence.mutateAsync({ id: evidenceId, criterionId, filePath });
      alert('Evidence deleted successfully!');
    } catch (err) {
      alert(`Failed to delete evidence: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'photo': return <Image className="h-5 w-5" />;
      case 'audio': return <Mic className="h-5 w-5" />;
      case 'video': return <Video className="h-5 w-5" />;
      case 'document': return <FileText className="h-5 w-5" />;
      default: return <FileText className="h-5 w-5" />;
    }
  };

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-12 bg-gray-200 rounded w-full" />
        <div className="h-64 bg-gray-200 rounded w-full" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="border-2 border-red-500 bg-red-50 rounded p-4" role="alert">
        <p className="text-red-800">Failed to load evidence: {error?.message}</p>
      </div>
    );
  }

  return (
    <div className="evidence-collection">
      {/* Tab Navigation */}
      <div className="flex border-b mb-4 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                activeTab === tab.id
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Text Evidence Tab */}
      {activeTab === 'text' && (
        <div className="space-y-4">
          <textarea
            value={textContent}
            onChange={(e) => setTextContent(e.target.value)}
            className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
            rows={6}
            placeholder="Enter text evidence, observations, or notes..."
            aria-label="Text evidence"
          />
          <button
            onClick={handleTextSubmit}
            disabled={uploadEvidence.isPending || !textContent.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {uploadEvidence.isPending ? 'Saving...' : 'Save Text Evidence'}
          </button>
        </div>
      )}

      {/* Photo Evidence Tab */}
      {activeTab === 'photo' && (
        <div className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
              aria-label="Upload photo"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              <Image className="h-5 w-5" />
              Select Photo
            </button>
            {selectedFile && (
              <div className="mt-4">
                <p className="font-medium">{selectedFile.name}</p>
                <p className="text-sm text-gray-500">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            )}
          </div>
          {selectedFile && (
            <button
              onClick={handleFileUpload}
              disabled={uploadEvidence.isPending}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
            >
              {uploadEvidence.isPending ? 'Uploading...' : 'Upload Photo'}
            </button>
          )}
        </div>
      )}

      {/* Audio Evidence Tab */}
      {activeTab === 'audio' && (
        <div className="space-y-4">
          <div className="border-2 border-gray-300 rounded-lg p-8 text-center">
            {!isRecording ? (
              <button
                onClick={startRecording}
                className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                <Mic className="h-5 w-5" />
                Start Recording
              </button>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-3">
                  <div className="h-4 w-4 bg-red-600 rounded-full animate-pulse" />
                  <span className="text-lg font-mono">{formatTime(recordingTime)}</span>
                </div>
                <button
                  onClick={stopRecording}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                >
                  <Check className="h-5 w-5" />
                  Stop & Save
                </button>
              </div>
            )}
          </div>
          <p className="text-sm text-gray-500 text-center">
            Or upload an existing audio file
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept="audio/*"
            onChange={handleFileSelect}
            className="w-full"
          />
          {selectedFile && (
            <button
              onClick={handleFileUpload}
              disabled={uploadEvidence.isPending}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
            >
              {uploadEvidence.isPending ? 'Uploading...' : 'Upload Audio'}
            </button>
          )}
        </div>
      )}

      {/* Video Evidence Tab */}
      {activeTab === 'video' && (
        <div className="space-y-4">
          <div className="border-2 border-gray-300 rounded-lg p-8 text-center">
            {!isRecording ? (
              <button
                onClick={startRecording}
                className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                <Video className="h-5 w-5" />
                Start Recording
              </button>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-3">
                  <div className="h-4 w-4 bg-red-600 rounded-full animate-pulse" />
                  <span className="text-lg font-mono">{formatTime(recordingTime)}</span>
                </div>
                <button
                  onClick={stopRecording}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                >
                  <Check className="h-5 w-5" />
                  Stop & Save
                </button>
              </div>
            )}
          </div>
          <p className="text-sm text-gray-500 text-center">
            Or upload an existing video file
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            onChange={handleFileSelect}
            className="w-full"
          />
          {selectedFile && (
            <button
              onClick={handleFileUpload}
              disabled={uploadEvidence.isPending}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
            >
              {uploadEvidence.isPending ? 'Uploading...' : 'Upload Video'}
            </button>
          )}
        </div>
      )}

      {/* Document Evidence Tab */}
      {activeTab === 'document' && (
        <div className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx,.xls,.xlsx,.txt"
              onChange={handleFileSelect}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              <Upload className="h-5 w-5" />
              Select Document
            </button>
            <p className="text-sm text-gray-500 mt-2">
              PDF, Word, Excel, or Text files
            </p>
            {selectedFile && (
              <div className="mt-4">
                <p className="font-medium">{selectedFile.name}</p>
                <p className="text-sm text-gray-500">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            )}
          </div>
          {selectedFile && (
            <button
              onClick={handleFileUpload}
              disabled={uploadEvidence.isPending}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
            >
              {uploadEvidence.isPending ? 'Uploading...' : 'Upload Document'}
            </button>
          )}
        </div>
      )}

      {/* Evidence List */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Collected Evidence ({evidence?.length || 0})
        </h3>
        {evidence && evidence.length > 0 ? (
          <div className="space-y-2">
            {evidence.map((item) => (
              <div
                key={item.id}
                className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <div className="flex-shrink-0 text-gray-600">
                  {getFileIcon(item.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 capitalize">{item.type} Evidence</p>
                  {item.content && (
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">{item.content}</p>
                  )}
                  {item.file_name && (
                    <p className="text-sm text-gray-500 mt-1">{item.file_name}</p>
                  )}
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(item.created_at).toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(item.id, item.file_path)}
                  disabled={deleteEvidence.isPending}
                  className="flex-shrink-0 p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                  aria-label="Delete evidence"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="border-2 border-gray-300 bg-gray-50 rounded p-8 text-center">
            <p className="text-gray-600">No evidence collected yet.</p>
            <p className="text-sm text-gray-500 mt-2">
              Use the tabs above to add evidence for this criterion.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
