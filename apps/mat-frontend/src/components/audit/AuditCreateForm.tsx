export default function AuditCreateForm() {
  return (
    <form className="space-y-4">
      <h2 className="text-xl font-bold">Create New Audit</h2>
      <div>
        <label htmlFor="audit-name">Audit Name</label>
        <input id="audit-name" type="text" className="border p-2 w-full" />
      </div>
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        Create Audit
      </button>
    </form>
  );
}
