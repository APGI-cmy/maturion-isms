/**
 * Interview Recorder Component
 * FRS: FR-021 (Interview Recording), FR-028 (Interview Recording — Wave 2R G-10)
 * TRS: TR-028 (interview recording — data model, consent fields)
 *
 * Requires consent fields (interviewee name, role, consent checkbox) before recording.
 * Reuses MediaRecorder pipeline from audio recording.
 */
import { useState, useRef } from 'react';
import { Mic, Square, Check } from 'lucide-react';

export interface InterviewMetadata {
  interviewee_name: string;
  interviewee_role: string;
  consent_given: boolean;
}

interface InterviewRecorderProps {
  onRecordingComplete?: (file: File, metadata: InterviewMetadata) => void;
}

export function InterviewRecorder({ onRecordingComplete }: InterviewRecorderProps = {}) {
  const [intervieweeName, setIntervieweeName] = useState('');
  const [intervieweeRole, setIntervieweeRole] = useState('');
  const [consentGiven, setConsentGiven] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordingComplete, setRecordingComplete] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const canStartRecording =
    intervieweeName.trim() !== '' && intervieweeRole.trim() !== '' && consentGiven;

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      recordedChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: 'audio/webm' });
        const file = new File([blob], `interview-${Date.now()}.webm`, { type: 'audio/webm' });
        onRecordingComplete?.(file, {
          interviewee_name: intervieweeName,
          interviewee_role: intervieweeRole,
          consent_given: consentGiven,
        });
        stream.getTracks().forEach((t) => t.stop());
        setRecordingTime(0);
        if (timerRef.current) clearInterval(timerRef.current);
        setRecordingComplete(true);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setRecordingComplete(false);
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      alert(
        `Failed to start recording: ${err instanceof Error ? err.message : 'Failed to access microphone'}`
      );
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="interview-recorder space-y-4">
      {/* Consent and metadata fields */}
      <div className="border rounded-lg p-4 bg-gray-50 space-y-3">
        <h4 className="font-semibold text-gray-900 text-sm">Interview Details &amp; Consent</h4>

        <div>
          <label
            htmlFor="interviewee-name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Interviewee Name <span className="text-red-500">*</span>
          </label>
          <input
            id="interviewee-name"
            type="text"
            value={intervieweeName}
            onChange={(e) => setIntervieweeName(e.target.value)}
            placeholder="Full name"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Interviewee name"
            disabled={isRecording}
          />
        </div>

        <div>
          <label
            htmlFor="interviewee-role"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Role / Title <span className="text-red-500">*</span>
          </label>
          <input
            id="interviewee-role"
            type="text"
            value={intervieweeRole}
            onChange={(e) => setIntervieweeRole(e.target.value)}
            placeholder="e.g. CISO, IT Manager"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Interviewee role"
            disabled={isRecording}
          />
        </div>

        <div className="flex items-start gap-2">
          <input
            id="consent-checkbox"
            type="checkbox"
            checked={consentGiven}
            onChange={(e) => setConsentGiven(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
            aria-label="Consent given"
            disabled={isRecording}
          />
          <label htmlFor="consent-checkbox" className="text-sm text-gray-700">
            The interviewee has been informed and consented to this recording being used as audit
            evidence. <span className="text-red-500">*</span>
          </label>
        </div>
      </div>

      {/* Recording controls */}
      <div className="border-2 border-gray-300 rounded-lg p-6 text-center">
        {!isRecording ? (
          <div className="space-y-3">
            <button
              onClick={startRecording}
              disabled={!canStartRecording}
              className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
              aria-label="Start interview recording"
            >
              <Mic className="h-5 w-5" />
              Start Recording
            </button>
            {!canStartRecording && (
              <p className="text-xs text-gray-500">
                Complete all required fields and confirm consent to start recording.
              </p>
            )}
            {recordingComplete && (
              <div className="flex items-center justify-center gap-2 text-green-600">
                <Check className="h-4 w-4" />
                <span className="text-sm">Recording saved successfully</span>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-3">
              <div className="h-4 w-4 bg-red-600 rounded-full animate-pulse" />
              <span className="text-lg font-mono">{formatTime(recordingTime)}</span>
            </div>
            <button
              onClick={stopRecording}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-md hover:bg-gray-700"
              aria-label="Stop recording"
            >
              <Square className="h-5 w-5" />
              Stop &amp; Save
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
