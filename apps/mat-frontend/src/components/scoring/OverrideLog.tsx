export default function OverrideLog() {
  return (
    <div className="space-y-2">
      <h4 className="font-bold">Override History</h4>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 text-left">Date</th>
            <th className="p-2 text-left">AI Score</th>
            <th className="p-2 text-left">Human Score</th>
            <th className="p-2 text-left">Justification</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-t">
            <td className="p-2">2024-01-15</td>
            <td className="p-2">3</td>
            <td className="p-2">4</td>
            <td className="p-2">Additional evidence reviewed</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
