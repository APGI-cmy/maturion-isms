export default function AuditCreateForm() {
  return (
    <form className="space-y-4">
      <div>
        <label htmlFor="audit-name" className="block text-sm font-medium">
          Audit Name
        </label>
        <input
          id="audit-name"
          type="text"
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          placeholder="Enter audit name"
        />
      </div>
      <div>
        <label htmlFor="standard" className="block text-sm font-medium">
          Standard
        </label>
        <select
          id="standard"
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
        >
          <option value="">Select a standard</option>
          <option value="ISO27001">ISO/IEC 27001</option>
          <option value="ISO27701">ISO/IEC 27701</option>
        </select>
      </div>
      <button
        type="submit"
        className="rounded-md bg-primary px-4 py-2 text-white hover:bg-primary/90"
      >
        Create Audit
      </button>
    </form>
  );
}
