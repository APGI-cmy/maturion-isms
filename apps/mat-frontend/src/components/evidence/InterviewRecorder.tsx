export default function InterviewRecorder() {
  return (
    <div className="space-y-4">
      <h3 className="font-bold">Interview Recorder</h3>
      <div className="border p-6 rounded">
        <p className="mb-4">Recording interview...</p>
        <div className="flex gap-2">
          <button className="bg-red-600 text-white px-4 py-2 rounded">Stop</button>
          <button className="bg-gray-600 text-white px-4 py-2 rounded">Pause</button>
        </div>
      </div>
    </div>
  );
}
