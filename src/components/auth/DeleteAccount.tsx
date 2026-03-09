import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { apiService } from "../../services/api.service";

export function DeleteAccount() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);
  console.log(showConfirm)
  const [confirmation, setConfirmation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState<"initial" | "confirm" | "final">("initial");

  const handleDeleteRequest = () => {
    setStep("confirm");
    setShowConfirm(true);
  };

  const handleDelete = async () => {
    if (confirmation !== "DELETE") {
      setError("Please type DELETE to confirm");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await apiService.delete("/users/account", {
        confirmation: "DELETE",
      });

      if (response.success) {
        setStep("final");
        // Log out after 3 seconds
        setTimeout(async () => {
          await logout();
          navigate("/");
        }, 3000);
      } else {
        setError(response.error || "Failed to delete account");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setStep("initial");
    setShowConfirm(false);
    setConfirmation("");
    setError("");
  };

  // Final success screen
  if (step === "final") {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
          <svg
            className="h-6 w-6 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-green-800 mb-2">
          Account Deleted
        </h3>
        <p className="text-sm text-green-700 mb-4">
          Your account has been successfully deleted. You will be redirected
          shortly.
        </p>
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-600"></div>
        </div>
      </div>
    );
  }

  // Confirmation screen
  if (step === "confirm") {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h3 className="text-lg font-medium text-red-800 mb-4">
          Delete Account
        </h3>

        <div className="space-y-4">
          <div className="bg-red-100 border border-red-300 rounded p-4">
            <p className="text-sm text-red-700">
              <strong>⚠️ Warning:</strong> This action is permanent and cannot
              be undone. All your data, including posts, comments, and
              preferences will be permanently deleted.
            </p>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-300 rounded p-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-red-800 mb-2">
              Type{" "}
              <span className="font-mono bg-red-200 px-2 py-1 rounded">
                DELETE
              </span>{" "}
              to confirm
            </label>
            <input
              type="text"
              value={confirmation}
              onChange={(e) => setConfirmation(e.target.value)}
              className="w-full px-3 py-2 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              placeholder="DELETE"
              disabled={loading}
            />
          </div>

          <div className="flex space-x-3">
            <button
              onClick={handleDelete}
              disabled={loading || confirmation !== "DELETE"}
              className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Deleting...
                </span>
              ) : (
                "Permanently Delete Account"
              )}
            </button>
            <button
              onClick={handleCancel}
              disabled={loading}
              className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Initial button
  return (
    <div className="border-t border-gray-200 pt-6">
      <h3 className="text-lg font-medium text-gray-900 mb-2">Danger Zone</h3>
      <p className="text-sm text-gray-600 mb-4">
        Once you delete your account, there is no going back. Please be certain.
      </p>
      <button
        onClick={handleDeleteRequest}
        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
      >
        Delete Account
      </button>
    </div>
  );
}
