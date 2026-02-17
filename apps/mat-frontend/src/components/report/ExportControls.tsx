export default function ExportControls() {
  return (
    <div className="space-y-4">
      <h4 className="font-bold">Export Report</h4>
      <div className="flex gap-2">
        <button className="border px-4 py-2 rounded hover:bg-gray-50">📄 PDF</button>
        <button className="border px-4 py-2 rounded hover:bg-gray-50">📝 DOCX</button>
        <button className="border px-4 py-2 rounded hover:bg-gray-50">📊 XLSX</button>
      </div>
    </div>
  );
}
