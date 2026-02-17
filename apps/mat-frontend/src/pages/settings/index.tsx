export default function Settings() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Settings</h1>
      <div className="border p-4 rounded">
        <h2 className="text-xl font-bold mb-4">User Profile</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input type="text" className="border p-2 w-full" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input type="email" className="border p-2 w-full" />
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
