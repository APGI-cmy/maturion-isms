export default function ReviewTable() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 text-left">Criterion</th>
            <th className="p-2 text-left">Score</th>
            <th className="p-2 text-left">Evidence</th>
            <th className="p-2 text-left">Findings</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-t">
            <td className="p-2">1.1</td>
            <td className="p-2">3</td>
            <td className="p-2">5 items</td>
            <td 
              className="p-2" 
              contentEditable 
              role="textbox" 
              aria-label="Editable findings for criterion 1.1"
            >
              Editable findings...
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
