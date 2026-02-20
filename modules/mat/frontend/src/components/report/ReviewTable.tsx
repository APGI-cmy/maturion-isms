/**
 * Review Table Component
 * FRS: FR-033, FR-034 (Review Table with Inline Editing)
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
          <td contentEditable>-</td>
          <td>-</td>
        </tr>
      </tbody>
    </table>
  );
}
