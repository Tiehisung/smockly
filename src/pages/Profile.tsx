import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import { setUserPreferences } from "../store/slices/userSlice";

export function Profile() {
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  const preferences = useAppSelector((state) => state.user.preferences);

  const [displayName, setDisplayName] = useState(user?.displayName || "");

  const handleSavePreferences = () => {
    // Update Redux
    dispatch(
      setUserPreferences({
        theme: preferences.theme === "light" ? "dark" : "light",
        notifications: !preferences.notifications,
      }),
    );
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Profile Settings
      </h1>

      <div className="bg-white rounded-lg shadow divide-y">
        {/* Profile Info */}
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={user?.email || ""}
                disabled
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Display Name
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your display name"
              />
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Preferences</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Dark Mode</span>
              <button
                onClick={handleSavePreferences}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  preferences.theme === "dark" ? "bg-blue-600" : "bg-gray-200"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    preferences.theme === "dark"
                      ? "translate-x-6"
                      : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-700">Email Notifications</span>
              <button
                onClick={handleSavePreferences}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  preferences.notifications ? "bg-blue-600" : "bg-gray-200"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    preferences.notifications
                      ? "translate-x-6"
                      : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Language
              </label>
              <select
                value={preferences.language}
                onChange={(e) =>
                  dispatch(setUserPreferences({ language: e.target.value }))
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
              </select>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="p-6">
          <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
