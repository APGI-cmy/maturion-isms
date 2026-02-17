export default function VoiceRecorder() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Voice Recorder</h3>
      <div className="flex gap-2">
        <button className="rounded-full bg-red-500 p-4 text-white hover:bg-red-600">
          🎤 Record
        </button>
      </div>
    </div>
  );
}
