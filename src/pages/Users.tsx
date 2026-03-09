import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

import { formatDistanceToNow } from "date-fns";
import {
  useGetAllUsersQuery,
  useUpdateUserRoleMutation,
  useToggleUserStatusMutation,
  useAdminDeleteUserMutation,
} from "../services/user.api";
import { EUserRole } from "../types/user.types";
import { enumToOptions } from "../lib/select";

// Types
interface Filters {
  search: string;
  role: string;
  status: string;
  sortBy: string;
  sortOrder: "asc" | "desc";
  page?: number;
}

export function UsersPage() {
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();

  // Pagination state
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  // Filters state
  const [filters, setFilters] = useState<Filters>({
    search: "",
    role: "",
    status: "",
    sortBy: "createdAt",
    sortOrder: "desc",
    page: 1,
  });

  // Delete confirmation
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Selected user for details view
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  console.log({ selectedUser, setSelectedUser });

  // RTK Query hooks
  const {
    data: usersData,
    isLoading: usersLoading,
    error: usersError,
    refetch: refetchUsers,
  } = useGetAllUsersQuery(
    {
      page,
      limit,
      search: filters.search,
      role: filters.role || undefined,
    },
    {
      pollingInterval: 30000, // Refresh every 30 seconds
    },
  );

  const [updateRole, { isLoading: roleUpdating }] = useUpdateUserRoleMutation();
  const [toggleStatus, { isLoading: statusUpdating }] =
    useToggleUserStatusMutation();
  const [deleteUser, { isLoading: deleting }] = useAdminDeleteUserMutation();

  // Filter and sort users locally
  const filteredUsers = useMemo(() => {
    if (!usersData?.data) return [];

    let filtered = [...usersData.data];

    // Filter by status
    if (filters.status) {
      filtered = filtered.filter((user) =>
        filters.status === "active" ? user.isActive : !user.isActive,
      );
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue: any = a[filters.sortBy as keyof typeof a];
      let bValue: any = b[filters.sortBy as keyof typeof b];

      if (filters.sortBy === "createdAt" || filters.sortBy === "lastLogin") {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }

      if (filters.sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [usersData, filters]);

  // Handle actions
  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await updateRole({ userId, role: newRole }).unwrap();
      refetchUsers();
    } catch (err) {
      console.error("Failed to update role:", err);
    }
  };

  const handleToggleStatus = async (userId: string) => {
    try {
      await toggleStatus(userId).unwrap();
      refetchUsers();
    } catch (err) {
      console.error("Failed to toggle status:", err);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      await deleteUser(userId).unwrap();
      setDeleteConfirm(null);
      refetchUsers();
    } catch (err) {
      console.error("Failed to delete user:", err);
    }
  };

  const handleViewUser = (userId: string) => {
    setSelectedUser(userId);
    // Navigate to user details page or open modal
    navigate(`/users/${userId}`);
  };

  // Reset filters
  const handleResetFilters = () => {
    setFilters({
      search: "",
      role: "",
      status: "",
      sortBy: "createdAt",
      sortOrder: "desc",
    });
    setPage(1);
  };

  // Check if current user is admin
  // if (!currentUser || currentUser?.role !== "admin") {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center">
  //       <div className="text-center">
  //         <h1 className="text-2xl font-bold text-gray-900 mb-4">
  //           Access Denied
  //         </h1>
  //         <p className="text-gray-600">
  //           You don't have permission to view this page.
  //         </p>
  //       </div>
  //     </div>
  //   );
  // }

  if (usersLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading users...</p>
        </div>
      </div>
    );
  }

  if (usersError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Error Loading Users
          </h1>
          <p className="text-gray-600">Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage all users, roles, and permissions
          </p>
        </div>

        {/* Filters Bar */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* Search */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Search Users
              </label>
              <input
                type="text"
                placeholder="Search by name or email..."
                value={filters.search}
                onChange={(e) =>
                  setFilters({ ...filters, search: e.target.value, page: 1 })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Role Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role
              </label>
              <select
                value={filters.role}
                onChange={(e) =>
                  setFilters({ ...filters, role: e.target.value, page: 1 })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Roles</option>

                {enumToOptions(EUserRole).map((role) => (
                  <option key={role.label} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) =>
                  setFilters({ ...filters, status: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sort By
              </label>
              <div className="flex">
                <select
                  value={filters.sortBy}
                  onChange={(e) =>
                    setFilters({ ...filters, sortBy: e.target.value })
                  }
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="createdAt">Joined Date</option>
                  <option value="lastLogin">Last Login</option>
                  <option value="email">Email</option>
                  <option value="displayName">Name</option>
                </select>
                <button
                  onClick={() =>
                    setFilters({
                      ...filters,
                      sortOrder: filters.sortOrder === "asc" ? "desc" : "asc",
                    })
                  }
                  className="px-3 py-2 border border-l-0 border-gray-300 rounded-r-lg bg-gray-50 hover:bg-gray-100"
                >
                  {filters.sortOrder === "asc" ? "↑" : "↓"}
                </button>
              </div>
            </div>
          </div>

          {/* Active Filters */}
          {(filters.search || filters.role || filters.status) && (
            <div className="mt-3 flex items-center space-x-2">
              <span className="text-sm text-gray-600">Active filters:</span>
              {filters.search && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                  Search: {filters.search}
                </span>
              )}
              {filters.role && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800">
                  Role: {filters.role}
                </span>
              )}
              {filters.status && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                  Status: {filters.status}
                </span>
              )}
              <button
                onClick={handleResetFilters}
                className="text-sm text-red-600 hover:text-red-800"
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Login
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Activity
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                        />
                      </svg>
                      <h3 className="mt-2 text-sm font-medium text-gray-900">
                        No users found
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Try adjusting your search or filters.
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr
                      key={user._id}
                      className={`hover:bg-gray-50 ${!user.isActive ? "bg-gray-50" : ""}`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 shrink-0">
                            {user.photoURL ? (
                              <img
                                className="h-10 w-10 rounded-full object-cover"
                                src={user.photoURL}
                                alt={user.displayName || "User"}
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-linear-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                                <span className="text-sm font-medium text-white">
                                  {user.email?.[0].toUpperCase()}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {user.displayName || "No name"}
                            </div>
                            <div className="text-sm text-gray-500">
                              {user.email}
                            </div>
                            {user._id === currentUser?.uid && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 mt-1">
                                You
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {deleteConfirm === user._id ? (
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-red-600">
                              Confirm delete?
                            </span>
                            <button
                              onClick={() => handleDeleteUser(user._id)}
                              disabled={deleting}
                              className="text-xs text-red-600 hover:text-red-900 font-medium"
                            >
                              Yes
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(null)}
                              className="text-xs text-gray-600 hover:text-gray-900 font-medium"
                            >
                              No
                            </button>
                          </div>
                        ) : (
                          <select
                            value={user.role}
                            onChange={(e) =>
                              handleRoleChange(user._id, e.target.value)
                            }
                            disabled={
                              roleUpdating || user._id === currentUser?.uid
                            }
                            className={`text-xs font-medium rounded-full px-3 py-1 border-0 focus:ring-2 focus:ring-offset-2 ${
                              user.role === "admin"
                                ? "bg-purple-100 text-purple-800"
                                : user.role === EUserRole.CUSTOMER
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-gray-100 text-gray-800"
                            } ${user._id === currentUser?.uid ? "opacity-50 cursor-not-allowed" : ""}`}
                          >
                            <option value={EUserRole.GUEST}>Guest</option>
                            <option value={EUserRole.CUSTOMER}>Customer</option>
                            <option value={EUserRole.ADMIN}>Admin</option>
                            <option value={EUserRole.SUPER_ADMIN}>
                              Super Admin
                            </option>
                          </select>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleToggleStatus(user._id)}
                          disabled={
                            statusUpdating || user._id === currentUser?.uid
                          }
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            user.isActive
                              ? "bg-green-100 text-green-800 hover:bg-green-200"
                              : "bg-red-100 text-red-800 hover:bg-red-200"
                          } ${user._id === currentUser?.uid ? "opacity-50 cursor-not-allowed" : ""}`}
                        >
                          {user.isActive ? "Active" : "Inactive"}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDistanceToNow(new Date(user.createdAt), {
                          addSuffix: true,
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDistanceToNow(new Date(user.lastLogin), {
                          addSuffix: true,
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex space-x-2">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                            Posts: {user.stats?.postsCount || 0}
                          </span>
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                            Followers: {user.stats?.followersCount || 0}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-3">
                          <button
                            onClick={() => handleViewUser(user._id)}
                            className="text-blue-600 hover:text-blue-900"
                            title="View details"
                          >
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                              />
                            </svg>
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(user._id)}
                            disabled={deleting || user._id === currentUser?.uid}
                            className={`text-red-600 hover:text-red-900 ${
                              user._id === currentUser?.uid
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                            }`}
                            title="Delete user"
                          >
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {usersData?.pagination && usersData.pagination.pages > 1 && (
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-700">
                  Page {page} of {usersData.pagination.pages}
                </span>
                <button
                  onClick={() =>
                    setPage((p) =>
                      Math.min(usersData?.pagination?.pages ?? 0, p + 1),
                    )
                  }
                  disabled={page === usersData.pagination.pages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing{" "}
                    <span className="font-medium">
                      {(page - 1) * limit + 1}
                    </span>{" "}
                    to{" "}
                    <span className="font-medium">
                      {Math.min(page * limit, usersData.pagination.total)}
                    </span>{" "}
                    of{" "}
                    <span className="font-medium">
                      {usersData.pagination.total}
                    </span>{" "}
                    results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                    {Array.from(
                      { length: usersData.pagination.pages },
                      (_, i) => i + 1,
                    )
                      .filter((p) => {
                        const distance = Math.abs(p - page);
                        return (
                          distance === 0 ||
                          distance === 1 ||
                          p === 1 ||
                          p === usersData?.pagination?.pages
                        );
                      })
                      .map((p, index, array) => (
                        <>
                          {index > 0 && array[index - 1] !== p - 1 && (
                            <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                              ...
                            </span>
                          )}
                          <button
                            key={p}
                            onClick={() => setPage(p)}
                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                              page === p
                                ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                                : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                            }`}
                          >
                            {p}
                          </button>
                        </>
                      ))}
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Export Button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={() => {
              // Implement export functionality
              const csvContent = [
                [
                  "Email",
                  "Display Name",
                  "Role",
                  "Status",
                  "Joined",
                  "Last Login",
                ].join(","),
                ...filteredUsers.map((u) =>
                  [
                    u.email,
                    u.displayName || "",
                    u.role,
                    u.isActive ? "Active" : "Inactive",
                    u.createdAt,
                    u.lastLogin,
                  ].join(","),
                ),
              ].join("\n");

              const blob = new Blob([csvContent], { type: "text/csv" });
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = `users-export-${new Date().toISOString().split("T")[0]}.csv`;
              a.click();
            }}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg
              className="w-5 h-5 mr-2 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            Export to CSV
          </button>
        </div>
      </div>
    </div>
  );
}
