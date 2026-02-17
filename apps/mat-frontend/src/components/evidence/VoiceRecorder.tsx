export default function VoiceRecorder() {
  return (
    <div className="space-y-4">
      <h3 className="font-bold">Voice Recorder</h3>
      <div className="flex items-center justify-center p-8 border rounded">
        <button className="bg-red-600 text-white rounded-full w-16 h-16">●</button>
      </div>
      <p className="text-center text-sm text-gray-600">Click to start recording</p>
    </div>
  );
}
