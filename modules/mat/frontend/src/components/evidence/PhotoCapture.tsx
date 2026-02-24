/**
 * Photo Capture Component
 * FRS: FR-015 (Photo Evidence), FR-027 (Photo Capture — Wave 2R G-07)
 * TRS: TR-027 (camera integration — cross-platform)
 *
 * Mobile: uses <input capture="environment"> for native camera
 * Desktop: offers getUserMedia stream capture with file-input fallback
 */
import { useRef, useState, useMemo } from 'react';
import { Image, Camera, X } from 'lucide-react';

interface PhotoCaptureProps {
  onCapture?: (file: File) => void;
}

export function PhotoCapture({ onCapture }: PhotoCaptureProps = {}) {
  const [preview, setPreview] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const isMobile = useMemo(
    () => /Mobi|Android|iPhone|iPad/i.test(
      typeof navigator !== 'undefined' ? navigator.userAgent : ''
    ),
    []
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
    onCapture?.(file);
  };

  const startDesktopCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsCapturing(true);
    } catch {
      fileInputRef.current?.click();
    }
  };

  const captureFromStream = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0);
    canvas.toBlob((blob) => {
      if (!blob) return;
      const file = new File([blob], `photo-${Date.now()}.jpg`, { type: 'image/jpeg' });
      const url = URL.createObjectURL(blob);
      setPreview(url);
      onCapture?.(file);
      stopStream();
    }, 'image/jpeg');
  };

  const stopStream = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setIsCapturing(false);
  };

  return (
    <div className="photo-capture space-y-4">
      {/* Hidden file input — capture="environment" for mobile native camera, omitted on desktop */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        {...(isMobile && { capture: 'environment' as const })}
        onChange={handleFileChange}
        className="hidden"
        aria-label="Capture photo"
      />

      {!isCapturing ? (
        <div className="flex flex-col items-center gap-4">
          {isMobile ? (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              aria-label="Open camera"
            >
              <Camera className="h-5 w-5" />
              Take Photo
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={startDesktopCapture}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <Camera className="h-5 w-5" />
                Use Camera
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                <Image className="h-5 w-5" />
                Select File
              </button>
            </div>
          )}
          {preview && (
            <img
              src={preview}
              alt="Captured photo preview"
              className="max-h-48 rounded-lg border"
            />
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <video ref={videoRef} autoPlay playsInline className="w-full rounded-lg" aria-label="Camera preview" />
          <div className="flex gap-2">
            <button
              onClick={captureFromStream}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Capture
            </button>
            <button
              onClick={stopStream}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              aria-label="Cancel camera"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
