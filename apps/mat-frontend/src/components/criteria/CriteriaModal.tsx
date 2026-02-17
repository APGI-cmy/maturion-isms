export default function CriteriaModal() {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center" role="dialog" aria-modal="true">
      <div className="bg-white p-6 rounded shadow-lg max-w-2xl w-full">
        <h2 className="text-xl font-bold mb-4">Criterion Details</h2>
        <p className="mb-4">Criterion text and details go here.</p>
        <div className="flex gap-2">
          <label className="flex items-center gap-2">
            <input type="checkbox" />
            <span>Mark as "Not Used"</span>
          </label>
        </div>
        <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded">Close</button>
      </div>
    </div>
  );
}
