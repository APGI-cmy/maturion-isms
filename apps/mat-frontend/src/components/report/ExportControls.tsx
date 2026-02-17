export default function ExportControls() {
  return (
    <div className="flex gap-2">
      <button className="rounded-md bg-primary px-4 py-2 text-white">Export PDF</button>
      <button className="rounded-md border px-4 py-2">Export DOCX</button>
      <button className="rounded-md border px-4 py-2">Export XLSX</button>
    </div>
  );
}
