export default function ReportGenerator() {
  return (
    <div className="space-y-4">
      <h3 className="font-bold">Generate Report</h3>
      <div className="border p-4 rounded">
        <label className="block mb-2">
          <span className="font-bold">Report Title</span>
          <input type="text" className="border p-2 w-full mt-1" placeholder="Enter report title" />
        </label>
        <button className="bg-blue-600 text-white px-4 py-2 rounded mt-4">
          Generate Report
        </button>
      </div>
    </div>
  );
}
