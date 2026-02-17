export default function ScoreConfirmation() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Confirm Score</h3>
      <div className="rounded-lg border bg-card p-4">
        <p className="text-sm mb-4"><span className="font-medium">AI Score:</span> N/A</p>
        <div className="flex gap-2">
          <button className="rounded-md bg-green-500 px-4 py-2 text-white">Confirm</button>
          <button className="rounded-md bg-yellow-500 px-4 py-2 text-white">Modify</button>
          <button className="rounded-md bg-red-500 px-4 py-2 text-white">Reject</button>
        </div>
      </div>
    </div>
  );
}
