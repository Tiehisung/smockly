import { ChevronUp, ChevronDown, Search } from "lucide-react";
import { useState, useMemo } from "react";
import { UserActions } from "./Actions";

import type { IApiResponse } from "../../../types";
import { EUserRole, type IUser } from "../../../types/user.types";
import { AVATAR } from "../../../components/ui/avatar";
import { getInitials } from "../../../lib";
import { SimplePagination } from "../../../components/pagination/Pagination";
import { SELECT } from "../../../components/input/Select";
import { enumToOptions } from "../../../lib/select";
import { LoadingSpinner } from "../../../components/common/LoadingSpinner";
import { SEARCH } from "../../../components/input/Search";
import { ClearBtn } from "../../../components/buttons/Clear";
import { formatDate, getTimeAgo } from "../../../lib/timeAndDate";

interface UserTableProps {
  users?: IApiResponse<IUser[]>;
  isLoading?: boolean;
}

type SortField = "name" | "email" | "role" | "dateJoined";
type SortDirection = "asc" | "desc";

export default function UserTable({
  users: propUsers,
  isLoading,
}: UserTableProps) {
  const [sortField, setSortField] = useState<SortField>("dateJoined");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  // Fetch users if not provided via props

  const users = propUsers?.data;

  const filteredAndSortedUsers = useMemo(() => {
    let result = [...(users || [])];

    // Apply sorting
    result.sort((a, b) => {
      let aValue: string | number = "";
      let bValue: string | number = "";

      switch (sortField) {
        case "name":
          aValue = a.displayName || "";
          bValue = b.displayName || "";
          break;
        case "email":
          aValue = a.email || "";
          bValue = b.email || "";
          break;
        case "role":
          aValue = a.role as string;
          bValue = b.role as string;
          break;
        case "dateJoined":
          aValue = new Date(a.createdAt as string).getTime();
          bValue = new Date(b.createdAt as string).getTime();
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    return result;
  }, [users, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getRoleColor = (role: EUserRole) => {
    switch (role) {
      case EUserRole.ADMIN:
      case EUserRole.SUPER_ADMIN:
        return "bg-red-100 text-red-800";
      case EUserRole.CUSTOMER:
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-green-100 text-green-800";
    }
  };

  const stats = useMemo(() => {
    return {
      total: users?.length || 0,
      showing: filteredAndSortedUsers.length,
    };
  }, [users, filteredAndSortedUsers]);
  console.log(stats);

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <MetricCard
            icon={<Globe className="w-6 h-6" />}
            title="Total Users"
            value={0}
            isLoading={true}
            color="blue"
          />
          <MetricCard
            icon={<Filter className="w-6 h-6" />}
            title="Showing"
            value={0}
            isLoading={true}
            color="orange"
          />
        </div> */}
        <div className="flex justify-center items-center min-h-100">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard
          icon={<Globe className="w-6 h-6" />}
          title="Total Users"
          value={stats.total}
          isLoading={isLoading}
          color="blue"
        />

        <MetricCard
          icon={<Filter className="w-6 h-6" />}
          title="Showing"
          value={stats.showing}
          isLoading={isLoading}
          color="orange"
        />
      </div> */}

      {/* Controls */}
      <div className="bg-card rounded-xl shadow-card p-6">
        <div className="flex flex-col md:flex-row flex-wrap gap-4 md:items-center justify-between">
          <SEARCH />
 <SELECT options={enumToOptions(EUserRole)}   />
           
            <ClearBtn label="Clear All" />
        </div>
      </div>

      {/* Table */}

      <div className="p-5">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary text-muted-foreground uppercase">
              <tr >
                <th
                  className="py-4 px-6 text-left cursor-pointer hover:bg-popover/50"
                  onClick={() => handleSort("name")}
                >
                  <div className="flex items-center gap-2">
                    <span>User</span>
                    {sortField === "name" &&
                      (sortDirection === "asc" ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      ))}
                  </div>
                </th>

                <th
                  className="py-4 px-6 text-left cursor-pointer hover:bg-popover/50"
                  onClick={() => handleSort("role")}
                >
                  <div className="flex items-center gap-2">
                    <span>Role</span>
                    {sortField === "role" &&
                      (sortDirection === "asc" ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      ))}
                  </div>
                </th>

                <th
                  className="py-4 px-6 text-left cursor-pointer hover:bg-popover/50"
                  onClick={() => handleSort("dateJoined")}
                >
                  <div className="flex items-center gap-2">
                    <span> Joined</span>
                    {sortField === "dateJoined" &&
                      (sortDirection === "asc" ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      ))}
                  </div>
                </th>
                <th> </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-sm">
              {filteredAndSortedUsers?.map((user) => (
                <tr
                  key={user?._id}
                  className="hover:bg-popover transition-colors group relative"
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3 text-start">
                      <AVATAR
                        src={user?.photoURL as string}
                        fallbackText={getInitials(
                          (user?.displayName as string)?.split(" "),
                          2,
                        )}
                        className="uppercase"
                      />
                      <div>
                        <p className="font-medium uppercase text-sm">
                          {user?.displayName}
                        </p>
                        <p className="text-muted-foreground font-light italic">
                          <a href={`mailto:${user?.email}`}>{user?.email}</a>
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 ">
                    <span
                      className={` px-3 py-1 rounded-full text-xs font-medium ${getRoleColor(
                        user?.role as EUserRole,
                      )}`}
                    >
                      {(user?.role as string).toUpperCase()}
                    </span>
                  </td>

                  <td className="py-4 px-6 text-muted-foreground text-xs">
                    <p className="">{formatDate(user?.createdAt)}</p>
                    <p>({getTimeAgo(user?.createdAt)})</p>
                  </td>

                  <td>
                    <UserActions user={user} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredAndSortedUsers.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium mb-2">No users found</h3>
              <p className="text-muted-foreground text-xs">
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}
        </div>

        <hr className="my-3" />

        <SimplePagination pagination={propUsers?.pagination} />
      </div>
    </div>
  );
}
