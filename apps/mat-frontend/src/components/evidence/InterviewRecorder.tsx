export default function InterviewRecorder() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Interview Recorder</h3>
      <div className="rounded-lg border bg-card p-4">
        <button className="rounded-md bg-red-500 px-4 py-2 text-white">🎤 Record Interview</button>
        <p className="mt-2 text-xs text-muted-foreground">Max 30 minutes, requires consent</p>
      </div>
    </div>
  );
}
