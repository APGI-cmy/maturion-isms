export default function UserProfile() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">User Profile</h3>
      <div className="space-y-2">
        <div>
          <label className="text-sm font-medium">Name</label>
          <input type="text" className="mt-1 w-full rounded-md border p-2" placeholder="Your name" />
        </div>
        <div>
          <label className="text-sm font-medium">Email</label>
          <input type="email" className="mt-1 w-full rounded-md border p-2" placeholder="email@example.com" />
        </div>
      </div>
    </div>
  );
}
