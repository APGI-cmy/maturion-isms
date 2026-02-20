/**
 * Review Table Component
 * FRS: FR-033 (Review Table)
 * TRS: TR-047
 */
export function ReviewTable() {
  return (
    <table className="review-table">
      <thead>
        <tr>
          <th>Criterion</th>
          <th>Score</th>
          <th>Evidence</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>No data</td>
          <td>-</td>
          <td>-</td>
        </tr>
      </tbody>
    </table>
  );
}
