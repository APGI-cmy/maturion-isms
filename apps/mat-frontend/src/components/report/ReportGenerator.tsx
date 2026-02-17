export default function ReportGenerator() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Generate Report</h3>
      <div className="space-y-2">
        <select className="w-full rounded-md border p-2">
          <option>Select Format</option>
          <option>PDF</option>
          <option>DOCX</option>
          <option>XLSX</option>
        </select>
        <button className="w-full rounded-md bg-primary px-4 py-2 text-white">
          Generate Report
        </button>
      </div>
    </div>
  );
}
