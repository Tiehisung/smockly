import { useAuth } from "../contexts/AuthContext";
import { useAppSelector } from "../store/hooks";

export function Dashboard() {
  const { user } = useAuth();
  const preferences = useAppSelector((state) => state.user.preferences);

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* User Info Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">User Information</h2>
          <div className="space-y-2">
            <p>
              <span className="font-medium">Email:</span> {user?.email}
            </p>
            <p>
              <span className="font-medium">User ID:</span> {user?.uid}
            </p>
            <p>
              <span className="font-medium">Email Verified:</span>{" "}
              {user?.emailVerified ? "✅" : "❌"}
            </p>
          </div>
        </div>

        {/* Preferences Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Your Preferences</h2>
          <div className="space-y-2">
            <p>
              <span className="font-medium">Theme:</span> {preferences.theme}
            </p>
            <p>
              <span className="font-medium">Notifications:</span>{" "}
              {preferences.notifications ? "On" : "Off"}
            </p>
            <p>
              <span className="font-medium">Language:</span>{" "}
              {preferences.language}
            </p>
          </div>
        </div>

        {/* Stats Card */}
        <div className="bg-white rounded-lg shadow p-6 md:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Quick Stats</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">0</div>
              <div className="text-sm text-gray-600">Projects</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">0</div>
              <div className="text-sm text-gray-600">Tasks</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">0</div>
              <div className="text-sm text-gray-600">Messages</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">0</div>
              <div className="text-sm text-gray-600">Days Active</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
