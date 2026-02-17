export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded shadow">
        <h1 className="text-2xl font-bold mb-4">Login to MAT</h1>
        <form className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="w-full border p-2 rounded"
              placeholder="your@email.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="w-full border p-2 rounded"
            />
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
