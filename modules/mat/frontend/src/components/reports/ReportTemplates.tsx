/**
 * Report Template Selector
 * FRS: FR-036 (Report Templates)
 * TRS: TR-047
 */
export function ReportTemplates() {
  return (
    <div className="report-templates">
      <label htmlFor="template">Report Template</label>
      <select id="template">
        <option>Executive Summary</option>
        <option>Detailed Assessment</option>
        <option>Gap Analysis</option>
      </select>
    </div>
  );
}
