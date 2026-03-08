export function About() {
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">About MyApp</h1>

      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <p className="text-gray-700">
          Welcome to MyApp - a modern web application built with:
        </p>

        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>⚛️ React with TypeScript</li>
          <li>🎨 Tailwind CSS for styling</li>
          <li>🔥 Firebase Authentication</li>
          <li>📦 Redux Toolkit for state management</li>
          <li>🔄 React Router for navigation</li>
          <li>💾 Redux Persist for data persistence</li>
        </ul>

        <p className="text-gray-700 mt-4">
          This template demonstrates authentication flow, protected routes,
          persistent user preferences, and a clean, responsive UI.
        </p>
      </div>
    </div>
  );
}
