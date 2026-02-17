export default function ScoreConfirmation() {
  return (
    <div className="space-y-4">
      <h3 className="font-bold">Confirm AI Score</h3>
      <div className="border p-4 rounded">
        <p className="mb-4">AI Score: 3 | Your Score: ___</p>
        <div className="flex gap-2">
          <button className="bg-green-600 text-white px-4 py-2 rounded">Confirm</button>
          <button className="bg-yellow-600 text-white px-4 py-2 rounded">Override</button>
        </div>
      </div>
    </div>
  );
}
