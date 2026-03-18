import {   Shield, Download } from "lucide-react";
import UserTable from "./UserTable";
import { useSearchParams } from "react-router-dom";
import { LoadingSpinner } from "../../../components/common/LoadingSpinner";
import { useGetAllUsersQuery } from "../../../store/api/user.api";

export default function UsersPage() {
  const [searchParams] = useSearchParams();
  const paramsString = searchParams.toString();
  console.log(paramsString);

  const { data: users, isLoading, error } = useGetAllUsersQuery({});

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex justify-center items-center min-h-100">
          <LoadingSpinner />
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {(error as any)?.message || "Unknown error"}
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <header className="mb-6 flex items-center justify-between flex-wrap gap-4">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-6 h-6 text-primary-600" />
            <h2 className="text-2xl font-semibold">User Overview</h2>
          </div>
          <p className="text-muted-foreground">
            All users who have logged in using Google OAuth or traditional
            credentials
          </p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors">
          <Download className="w-5 h-5" />
          Export Users
        </button>
      </header>
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <UserTable users={users} />

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t">
          <div className="text-center text-gray-500 text-sm">
            <p>User Management Dashboard • {new Date().getFullYear()}</p>
            <p className="mt-1">
              Showing users authenticated via Google or Credentials
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}
