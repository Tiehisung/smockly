import { useEffect, useState } from "react";
import { apiService } from "../services/api.service";
import { useAuth } from "../hooks/useAuth";
 

export function TestBackend() {
  const { user } = useAuth();
  const [health, setHealth] = useState<any>(null);
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    testHealth();
    if (user) {
      getUserProfile();
    }
  }, [user]);

  const testHealth = async () => {
    const response = await fetch("http://localhost:5000/health");
    const data = await response.json();
    setHealth(data);
  };

  const getUserProfile = async () => {
    setLoading(true);
    const response = await apiService.get("/users/me");
    if (response.success) {
      setUserData(response.data);
    }
    setLoading(false);
  };

  const updateProfile = async () => {
    const response = await apiService.put("/users/profile", {
      bio: "Hello from the frontend!",
      location: "Test City",
    });

    if (response.success) {
      alert("Profile updated!");
      getUserProfile();
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Backend Connection Test</h2>

      <div className="mb-4">
        <h3 className="font-semibold">Health Check:</h3>
        <pre className="bg-gray-100 p-2 rounded">
          {JSON.stringify(health, null, 2)}
        </pre>
      </div>

      {user && (
        <div className="mb-4">
          <h3 className="font-semibold">User Profile:</h3>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <>
              <pre className="bg-gray-100 p-2 rounded mb-2">
                {JSON.stringify(userData, null, 2)}
              </pre>
              <button
                onClick={updateProfile}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Update Profile
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
