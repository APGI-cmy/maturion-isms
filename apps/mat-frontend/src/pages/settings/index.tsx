import React from 'react';

export default function Settings() {
  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">User Profile</h2>
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded px-3 py-2"
              defaultValue="John Smith"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              className="w-full border border-gray-300 rounded px-3 py-2"
              defaultValue="john.smith@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Role</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded px-3 py-2"
              defaultValue="Lead Auditor"
              disabled
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Notification Preferences</label>
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input type="checkbox" defaultChecked />
                <span className="text-sm">Email notifications</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" defaultChecked />
                <span className="text-sm">Audit updates</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" />
                <span className="text-sm">Weekly summaries</span>
              </label>
            </div>
          </div>
          <button
            type="submit"
            className="bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}
