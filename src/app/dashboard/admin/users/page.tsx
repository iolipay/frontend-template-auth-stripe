"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Alert } from "@/components/ui/Alert";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { apiFetch } from "@/utils/api";

interface UserListItem {
  id: string;
  email: string;
  is_admin: boolean;
  is_verified: boolean;
  created_at: string;
  total_declarations: number;
  total_paid_amount: number;
  last_declaration_date: string | null;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await apiFetch("/admin/declarations/users/list");

      if (!response.ok) {
        throw new Error("Failed to load users");
      }

      const data = await response.json();
      setUsers(data.users || data);
    } catch (err) {
      console.error("Failed to load users:", err);
      setError(err instanceof Error ? err.message : "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  // Filter users by email search
  const filteredUsers = users.filter((user) =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate statistics
  const stats = {
    totalUsers: users.length,
    adminUsers: users.filter((u) => u.is_admin).length,
    verifiedUsers: users.filter((u) => u.is_verified).length,
    totalRevenue: users.reduce((sum, u) => sum + (u.total_paid_amount || 0), 0),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-medium uppercase tracking-wide">
          All Users
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          View and manage registered users
        </p>
      </div>

      {/* Alerts */}
      {error && (
        <Alert type="error" message={error} onClose={() => setError("")} />
      )}

      {/* Statistics */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card hoverable={false}>
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500 mb-1">
            Total Users
          </p>
          <p className="text-3xl font-medium text-[#003049]">{stats.totalUsers}</p>
        </Card>

        <Card hoverable={false}>
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500 mb-1">
            Admin Users
          </p>
          <p className="text-3xl font-medium text-[#4e35dc]">{stats.adminUsers}</p>
        </Card>

        <Card hoverable={false}>
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500 mb-1">
            Verified Users
          </p>
          <p className="text-3xl font-medium text-green-600">
            {stats.verifiedUsers}
          </p>
        </Card>

        <Card hoverable={false}>
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500 mb-1">
            Total Revenue
          </p>
          <p className="text-3xl font-medium text-green-600">
            ₾{(stats.totalRevenue || 0).toFixed(2)}
          </p>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <Input
          id="search"
          label="Search by Email"
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="user@example.com"
        />
        <p className="text-xs text-gray-500 mt-2">
          Showing {filteredUsers.length} of {users.length} users
        </p>
      </Card>

      {/* Users Table */}
      <Card>
        {loading ? (
          <div className="animate-pulse space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-[9px] mx-auto mb-4 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            </div>
            <p className="text-sm text-gray-600">No users found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 px-4 font-medium uppercase tracking-wide text-gray-700">
                    Email
                  </th>
                  <th className="text-center py-3 px-4 font-medium uppercase tracking-wide text-gray-700">
                    Status
                  </th>
                  <th className="text-center py-3 px-4 font-medium uppercase tracking-wide text-gray-700">
                    Role
                  </th>
                  <th className="text-right py-3 px-4 font-medium uppercase tracking-wide text-gray-700">
                    Declarations
                  </th>
                  <th className="text-right py-3 px-4 font-medium uppercase tracking-wide text-gray-700">
                    Paid Total
                  </th>
                  <th className="text-left py-3 px-4 font-medium uppercase tracking-wide text-gray-700">
                    Registered
                  </th>
                  <th className="text-left py-3 px-4 font-medium uppercase tracking-wide text-gray-700">
                    Last Activity
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200"
                  >
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium text-gray-900">{user.email}</p>
                        <p className="text-xs text-gray-500 font-mono">
                          {user.id.substring(0, 8)}
                        </p>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      {user.is_verified ? (
                        <Badge variant="success">Verified</Badge>
                      ) : (
                        <Badge variant="warning">Unverified</Badge>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {user.is_admin ? (
                        <Badge variant="primary">Admin</Badge>
                      ) : (
                        <Badge variant="secondary">User</Badge>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right font-medium text-gray-900">
                      {user.total_declarations || 0}
                    </td>
                    <td className="py-3 px-4 text-right font-medium text-green-600">
                      ₾{(user.total_paid_amount || 0).toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-xs text-gray-600">
                      {new Date(user.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="py-3 px-4 text-xs text-gray-600">
                      {user.last_declaration_date
                        ? new Date(user.last_declaration_date).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            }
                          )
                        : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Help Text */}
      <Card>
        <h3 className="text-sm font-medium uppercase tracking-wide mb-3">
          User Management Notes
        </h3>
        <div className="space-y-2 text-sm text-gray-700">
          <p>
            <strong>Admin Users:</strong> Can access the admin dashboard and manage declarations.
          </p>
          <p>
            <strong>Verified Users:</strong> Have confirmed their email address.
          </p>
          <p>
            <strong>Paid Total:</strong> Total amount paid for admin filing services.
          </p>
          <p className="text-xs text-gray-500 mt-4">
            To grant admin access to a user, update their user document in the database to set{" "}
            <code className="bg-gray-100 px-1 rounded">is_admin: true</code>
          </p>
        </div>
      </Card>
    </div>
  );
}
